#include <QtTest>
#include <QSignalSpy>
#include <QJsonArray>
#include <QJsonDocument>
#include <QJsonObject>
#include <QNetworkAccessManager>
#include <QNetworkReply>
#include <QNetworkRequest>
#include <QQmlComponent>
#include <QQmlEngine>
#include <QQuickItem>
#include <QQuickStyle>
#include <QQuickWindow>

#include "RoomService.hpp"
#include "MessageService.hpp"
#include "AuthService.hpp"
#include "ApiClient.hpp"
#include "MemberListModel.hpp"
#include "MessageListModel.hpp"
#include "OAuthLoopbackServer.hpp"
#include "AppConfig.hpp"
#include "SessionStore.hpp"
#include "MockHttpServer.hpp"
#include "TestEnvironment.hpp"

class TestRoomModerationAndSearch : public QObject
{
    Q_OBJECT

private:
    TestEnvironment m_env;
    MockHttpServer *m_server = nullptr;

private slots:
    void init()
    {
        m_env.init();
        m_server = new MockHttpServer(this);
        QVERIFY(m_server->start());
        AppConfig::instance()->setApiBaseUrl(m_server->baseUrl());

        SessionStore::instance()->setSession(
            "test-jwt-token",
            QJsonObject{
                {"id", "u-owner"},
                {"email", "owner@example.com"},
                {"displayName", "Dono Teste"},
                {"role", "user"}
            }
        );
    }

    void cleanup()
    {
        MessageService::instance()->stopSync();
        RoomService::instance()->leaveActiveRoom();
        if (m_server) {
            m_server->stop();
            m_server->deleteLater();
            m_server = nullptr;
        }
        m_env.cleanup();
    }

    void testMembersFetchRoleUpdateKickAndOwnershipTransfer()
    {
        m_server->addRoute("GET", "/api/rooms/r-1/members", 200, QJsonObject{
            {"members", QJsonArray{
                QJsonObject{{"user_id", "u-member"}, {"role", "user"}, {"User", QJsonObject{{"id", "u-member"}, {"displayName", "Bruno Membro"}}}},
                QJsonObject{{"user_id", "u-owner"}, {"role", "owner"}, {"User", QJsonObject{{"id", "u-owner"}, {"displayName", "Ana Dona"}}}},
                QJsonObject{{"user_id", "u-mod"}, {"role", "moderator"}, {"User", QJsonObject{{"id", "u-mod"}, {"displayName", "Carlos Mod"}}}}
            }}
        });

        RoomService::instance()->fetchMembers("r-1");
        QTRY_COMPARE(RoomService::instance()->members()->count(), 3);

        MemberListModel *members = RoomService::instance()->members();
        QCOMPARE(members->data(members->index(0), MemberListModel::RoleRole).toString(), QString("owner"));
        QCOMPARE(members->data(members->index(1), MemberListModel::RoleRole).toString(), QString("moderator"));
        QCOMPARE(members->data(members->index(2), MemberListModel::RoleRole).toString(), QString("user"));
        QCOMPARE(RoomService::instance()->activeUserRole(), QString("owner"));

        m_server->addRoute("PATCH", "/api/rooms/r-1/members/u-member/role", 200, QJsonObject{{"role", "moderator"}});
        QSignalSpy actionSpy(RoomService::instance(), &RoomService::memberActionSucceeded);
        RoomService::instance()->updateMemberRole("r-1", "u-member", "moderator");
        QTRY_COMPARE(actionSpy.count(), 1);
        QCOMPARE(m_server->lastRequest().jsonBody.value("role").toString(), QString("moderator"));
        QCOMPARE(members->roleForUserId("u-member"), QString("moderator"));

        m_server->addRoute("DELETE", "/api/rooms/r-1/members/u-member", 200, QJsonObject{{"message", "Removido"}});
        RoomService::instance()->kickMember("r-1", "u-member");
        QTRY_COMPARE(actionSpy.count(), 2);
        QCOMPARE(members->count(), 2);

        m_server->addRoute("POST", "/api/rooms/r-1/transfer-ownership", 200, QJsonObject{{"ownerId", "u-mod"}});
        m_server->clearRequests();
        RoomService::instance()->transferOwnership("r-1", "u-mod");
        QTRY_COMPARE(actionSpy.count(), 3);
        const QList<MockHttpServer::RecordedRequest> reqs = m_server->requests();
        QVERIFY(!reqs.isEmpty());
        QCOMPARE(reqs.first().path, QString("/api/rooms/r-1/transfer-ownership"));
        QCOMPARE(reqs.first().jsonBody.value("newOwnerId").toString(), QString("u-mod"));
        QCOMPARE(RoomService::instance()->activeRoomOwnerId(), QString("u-mod"));
    }

    void testMessageSearchAndAttachments()
    {
        m_server->addRoute("GET", "/api/rooms/r-1/messages/search", 200, QJsonObject{
            {"messages", QJsonArray{
                QJsonObject{
                    {"id", "m-99"},
                    {"room_id", "r-1"},
                    {"user_id", "u-2"},
                    {"content", "Olha o skyripple"},
                    {"created_at", "2026-01-01T12:00:00.000Z"},
                    {"User", QJsonObject{{"id", "u-2"}, {"displayName", "Maria Silva"}}}
                }
            }}
        });

        MessageService::instance()->searchMessages("r-1", "sky");
        QTRY_COMPARE(MessageService::instance()->searchResults()->count(), 1);
        QCOMPARE(m_server->lastRequest().query, QString("q=sky"));
        QCOMPARE(
            MessageService::instance()->searchResults()->data(
                MessageService::instance()->searchResults()->index(0),
                MessageListModel::SenderNameRole
            ).toString(),
            QString("Maria Silva")
        );

        MessageService::instance()->clearSearch();
        QCOMPARE(MessageService::instance()->searchResults()->count(), 0);
        QCOMPARE(MessageService::instance()->searchQuery(), QString());

        const qint64 tooBig = MessageService::MaxAttachmentBytes + 1;
        QVERIFY(!MessageService::instance()->sendMessage(
            "r-1",
            "",
            "data:image/png;base64,AAAA",
            "image/png",
            "grande.png",
            tooBig
        ));
        QVERIFY(!MessageService::instance()->errorMessage().isEmpty());

        QVERIFY(!MessageService::instance()->sendMessage(
            "r-1",
            "",
            "data:image/svg+xml;base64,PHN2Zz4=",
            "image/svg+xml",
            "vector.svg",
            128
        ));

        m_server->addRoute("POST", "/api/rooms/r-1/messages", 201, QJsonObject{
            {"id", "m-100"},
            {"room_id", "r-1"},
            {"user_id", "u-owner"},
            {"content", ""},
            {"attachment_url", "data:image/png;base64,iVBORw0KGgo="},
            {"attachment_type", "image/png"},
            {"attachment_name", "foto.png"},
            {"attachment_size", 1024},
            {"created_at", "2026-01-01T12:05:00.000Z"}
        });

        QSignalSpy sentSpy(MessageService::instance(), &MessageService::messageSent);
        QVERIFY(MessageService::instance()->sendMessage(
            "r-1",
            "",
            "data:image/png;base64,iVBORw0KGgo=",
            "image/png",
            "foto.png",
            1024
        ));
        QTRY_COMPARE(sentSpy.count(), 1);
        QCOMPARE(
            m_server->lastRequest().jsonBody.value("attachment").toObject().value("type").toString(),
            QString("image/png")
        );
    }

    void testStatsFavoritesAndOAuthPlusDecoding()
    {
        m_server->addRoute("GET", "/api/stats", 200, QJsonObject{
            {"total_users", 42},
            {"active_rooms", 7},
            {"pending_reports", 1}
        });

        m_server->addRoute("GET", "/api/favorites", 200, QJsonObject{
            {"favorites", QJsonArray{
                QJsonObject{{"item_type", "room"}, {"item_id", "r-1"}}
            }}
        });

        m_server->addRoute("POST", "/api/favorites", 201, QJsonObject{
            {"item_type", "room"},
            {"item_id", "r-2"}
        });

        m_server->addRoute("DELETE", "/api/favorites/room/r-2", 200, QJsonObject{{"removed", true}});

        QSignalSpy statsSpy(RoomService::instance(), &RoomService::statsChanged);
        RoomService::instance()->fetchStats();
        QTRY_COMPARE(statsSpy.count(), 1);
        QCOMPARE(RoomService::instance()->totalUsers(), 42);
        QCOMPARE(RoomService::instance()->activeRooms(), 7);

        QSignalSpy favSpy(RoomService::instance(), &RoomService::favoritesChanged);
        RoomService::instance()->fetchFavorites();
        QTRY_COMPARE(favSpy.count(), 1);
        QVERIFY(RoomService::instance()->isFavorite("r-1"));

        RoomService::instance()->toggleFavorite("r-2", "Tech");
        QTRY_COMPARE(favSpy.count(), 2);
        QVERIFY(RoomService::instance()->isFavorite("r-2"));

        RoomService::instance()->toggleFavorite("r-2", "Tech");
        QTRY_COMPARE(favSpy.count(), 3);
        QVERIFY(!RoomService::instance()->isFavorite("r-2"));

        OAuthLoopbackServer loopback;
        const QString callbackUrl = loopback.startListening();
        QVERIFY(!callbackUrl.isEmpty());

        QSignalSpy tokenSpy(&loopback, &OAuthLoopbackServer::sessionPayloadReceived);
        QNetworkAccessManager nam;
        QNetworkReply *reply = nam.get(QNetworkRequest(QUrl(
            callbackUrl + "?token=jwt-123&email=lucas%40example.com&displayName=Lucas+Ramos+Silva"
        )));
        QTRY_VERIFY(reply->isFinished());
        reply->deleteLater();

        QTRY_COMPARE(tokenSpy.count(), 1);
        const QJsonObject userObj = tokenSpy.at(0).at(1).toJsonObject();
        QCOMPARE(userObj.value("displayName").toString(), QString("Lucas Ramos Silva"));
        loopback.stopListening();
    }

    void testQmlLayoutGeometry()
    {
        QQuickStyle::setStyle("Basic");
        QQmlEngine engine;
        QQuickWindow window;
        window.resize(1280, 800);
        window.show();

        auto checkRowNoOverlap = [](QQuickItem *rowItem, int expectedVisibleChildren) {
            QVERIFY(rowItem != nullptr);
            QVERIFY(rowItem->width() > 400.0);
            QVERIFY(rowItem->height() > 20.0);
            QList<QQuickItem *> items;
            for (QObject *obj : rowItem->children()) {
                auto *item = qobject_cast<QQuickItem *>(obj);
                if (item && item->isVisible() && item->width() > 0 && item->height() > 0) {
                    items.append(item);
                }
            }
            QCOMPARE(items.size(), expectedVisibleChildren);
            std::sort(items.begin(), items.end(), [](QQuickItem *a, QQuickItem *b) {
                return a->x() < b->x();
            });
            for (int i = 1; i < items.size(); ++i) {
                QVERIFY2(items[i - 1]->x() + items[i - 1]->width() <= items[i]->x() + 1.0,
                         qPrintable(QString("Overlap at index %1: prevEnd=%2 currX=%3")
                                    .arg(i)
                                    .arg(items[i - 1]->x() + items[i - 1]->width())
                                    .arg(items[i]->x())));
            }
        };

        QQmlComponent roomsComp(&engine);
        roomsComp.loadFromModule("SkyRipple", "RoomsPage");
        QVERIFY2(roomsComp.isReady(), qPrintable(roomsComp.errorString()));
        std::unique_ptr<QObject> roomsObj(roomsComp.create());
        auto *roomsPage = qobject_cast<QQuickItem *>(roomsObj.get());
        QVERIFY(roomsPage != nullptr);
        roomsPage->setParentItem(window.contentItem());
        roomsPage->setSize(QSizeF(1280, 800));
        QCoreApplication::processEvents();
        QVERIFY(roomsPage->width() == 1280);
        QVERIFY(roomsPage->height() == 800);
        roomsPage->setVisible(false);

        QQmlComponent chatComp(&engine);
        chatComp.loadFromModule("SkyRipple", "ChatPage");
        QVERIFY2(chatComp.isReady(), qPrintable(chatComp.errorString()));
        std::unique_ptr<QObject> chatObj(chatComp.create());
        auto *chatPage = qobject_cast<QQuickItem *>(chatObj.get());
        QVERIFY(chatPage != nullptr);
        chatPage->setParentItem(window.contentItem());
        chatPage->setSize(QSizeF(1280, 800));
        QCoreApplication::processEvents();

        auto *headerRow = chatPage->findChild<QQuickItem *>("roomHeaderRow");
        auto *composerRow = chatPage->findChild<QQuickItem *>("composerRow");
        checkRowNoOverlap(headerRow, 5);
        checkRowNoOverlap(composerRow, 4);
    }

    void testAutoLogoutOnAuthMe401()
    {
        QVERIFY(SessionStore::instance()->isAuthenticated());
        m_server->addRoute("GET", "/api/auth/me", 401, QJsonObject{{"error", "Token inválido"}});

        QSignalSpy expiredSpy(ApiClient::instance(), &ApiClient::sessionExpired);
        AuthService::instance()->validateSession();
        QTRY_COMPARE(expiredSpy.count(), 1);
        QVERIFY(!SessionStore::instance()->isAuthenticated());
    }
};

QTEST_MAIN(TestRoomModerationAndSearch)
#include "test_room_moderation_and_search.moc"
