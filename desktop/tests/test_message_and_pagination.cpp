#include <QtTest>
#include <QSignalSpy>
#include <QJsonArray>
#include <QJsonObject>

#include "MessageService.hpp"
#include "MessageListModel.hpp"
#include "AppConfig.hpp"
#include "SessionStore.hpp"
#include "MockHttpServer.hpp"
#include "TestEnvironment.hpp"

class TestMessageAndPagination : public QObject
{
    Q_OBJECT

private:
    TestEnvironment m_env;
    MockHttpServer *m_server = nullptr;

    static QJsonObject makeMessage(const QString &id,
                                   const QString &roomId,
                                   const QString &userId,
                                   const QString &displayName,
                                   const QString &content,
                                   const QString &createdAt)
    {
        return QJsonObject{
            {"id", id},
            {"room_id", roomId},
            {"user_id", userId},
            {"content", content},
            {"created_at", createdAt},
            {"user", QJsonObject{
                {"id", userId},
                {"displayName", displayName}
            }}
        };
    }

private slots:
    void init()
    {
        m_env.init();
        m_server = new MockHttpServer(this);
        QVERIFY(m_server->start());
        AppConfig::instance()->setApiBaseUrl(m_server->baseUrl());
        SessionStore::instance()->setSession(
            "msg-test-jwt",
            QJsonObject{{"id", "u1"}, {"displayName", "Autor"}, {"email", "autor@example.com"}, {"role", "user"}}
        );
        MessageService::instance()->stopSync();
        MessageService::instance()->messages()->clear();
        MessageService::instance()->clearError();
    }

    void cleanup()
    {
        MessageService::instance()->stopSync();
        delete m_server;
        m_server = nullptr;
        m_env.cleanup();
    }

    void loadInitialMessagesPaginatesBeforeAndSyncsSinceWithoutDuplicates()
    {
        const QString t3 = "2026-01-01T10:03:00.000Z";
        const QString t4 = "2026-01-01T10:04:00.000Z";
        const QString t5 = "2026-01-01T10:05:00.000Z";

        m_server->enqueueResponse(200, QJsonObject{
            {"messages", QJsonArray{
                makeMessage("m3", "room-1", "u1", "Autor", "msg 3", t3),
                makeMessage("m4", "room-1", "u2", "Outro", "msg 4", t4),
                makeMessage("m5", "room-1", "u1", "Autor", "msg 5", t5)
            }},
            {"hasMore", true},
            {"nextCursor", t3},
            {"nextSince", t5}
        });

        MessageService *service = MessageService::instance();
        MessageListModel *model = service->messages();

        service->loadInitialMessages("room-1", 50);
        QTRY_COMPARE_WITH_TIMEOUT(model->count(), 3, 3000);
        QCOMPARE(service->hasMore(), true);
        QCOMPARE(model->nextCursor(), t3);
        QCOMPARE(model->nextSince(), t5);

        const MockHttpServer::RecordedRequest initialReq = m_server->lastRequest();
        QCOMPARE(initialReq.path, QString("/api/rooms/room-1/messages"));
        QCOMPARE(initialReq.query, QString("limit=50"));

        QCOMPARE(model->data(model->index(0, 0), MessageListModel::IsMeRole).toBool(), true);
        QCOMPARE(model->data(model->index(0, 0), MessageListModel::CanDeleteRole).toBool(), true);
        QCOMPARE(model->data(model->index(1, 0), MessageListModel::IsMeRole).toBool(), false);
        QCOMPARE(model->data(model->index(1, 0), MessageListModel::CanDeleteRole).toBool(), false);

        const QString t1 = "2026-01-01T10:01:00.000Z";
        const QString t2 = "2026-01-01T10:02:00.000Z";

        m_server->enqueueResponse(200, QJsonObject{
            {"messages", QJsonArray{
                makeMessage("m1", "room-1", "u2", "Outro", "msg 1", t1),
                makeMessage("m2", "room-1", "u1", "Autor", "msg 2", t2),
                makeMessage("m3", "room-1", "u1", "Autor", "msg 3", t3)
            }},
            {"hasMore", false},
            {"nextCursor", QJsonValue::Null}
        });

        service->loadOlderMessages(50);
        QTRY_COMPARE_WITH_TIMEOUT(model->count(), 5, 3000);
        QCOMPARE(service->hasMore(), false);

        const MockHttpServer::RecordedRequest olderReq = m_server->lastRequest();
        QVERIFY(olderReq.query.contains("limit=50"));
        QVERIFY(olderReq.query.contains("before=2026-01-01T10%3A03%3A00.000Z") ||
                olderReq.query.contains("before=" + t3));

        QCOMPARE(model->data(model->index(0, 0), MessageListModel::ContentRole).toString(), QString("msg 1"));
        QCOMPARE(model->data(model->index(1, 0), MessageListModel::ContentRole).toString(), QString("msg 2"));
        QCOMPARE(model->data(model->index(2, 0), MessageListModel::ContentRole).toString(), QString("msg 3"));
        QCOMPARE(model->data(model->index(4, 0), MessageListModel::ContentRole).toString(), QString("msg 5"));

        const QString t6 = "2026-01-01T10:06:00.000Z";
        m_server->enqueueResponse(200, QJsonObject{
            {"messages", QJsonArray{
                makeMessage("m5", "room-1", "u1", "Autor", "msg 5", t5),
                makeMessage("m6", "room-1", "u2", "Outro", "msg 6", t6)
            }},
            {"hasMore", false},
            {"nextSince", t6}
        });

        service->syncNewMessages(50);
        QTRY_COMPARE_WITH_TIMEOUT(model->count(), 6, 3000);

        const MockHttpServer::RecordedRequest syncReq = m_server->lastRequest();
        QVERIFY(syncReq.query.contains("limit=50"));
        QVERIFY(syncReq.query.contains("since="));
        QCOMPARE(model->data(model->index(5, 0), MessageListModel::ContentRole).toString(), QString("msg 6"));
        QCOMPARE(model->nextSince(), t6);
    }

    void sendMessageValidatesLengthCooldownAndPostsToServer()
    {
        QTest::qWait(550);
        MessageService *service = MessageService::instance();
        MessageListModel *model = service->messages();

        m_server->enqueueResponse(200, QJsonObject{
            {"messages", QJsonArray()},
            {"hasMore", false}
        });
        service->loadInitialMessages("room-1", 50);
        QTRY_COMPARE_WITH_TIMEOUT(service->busy(), false, 3000);

        QCOMPARE(service->sendMessage("room-1", "   "), false);
        QCOMPARE(service->errorMessage(), QString("Digite uma mensagem antes de enviar."));

        const QString tooLong(1001, QLatin1Char('a'));
        QCOMPARE(service->sendMessage("room-1", tooLong), false);
        QCOMPARE(service->errorMessage(), QString("A mensagem excede o limite de 1000 caracteres."));

        m_server->enqueueResponse(
            201,
            makeMessage("m-sent", "room-1", "u1", "Autor", "Oi, pessoal!", "2026-01-01T10:10:00.000Z")
        );

        QSignalSpy sentSpy(service, &MessageService::messageSent);
        QCOMPARE(service->sendMessage("room-1", "Oi, pessoal!"), true);
        QTRY_COMPARE_WITH_TIMEOUT(sentSpy.count(), 1, 3000);
        QCOMPARE(model->count(), 1);
        QCOMPARE(model->data(model->index(0, 0), MessageListModel::ContentRole).toString(), QString("Oi, pessoal!"));

        const MockHttpServer::RecordedRequest postReq = m_server->lastRequest();
        QCOMPARE(postReq.method, QString("POST"));
        QCOMPARE(postReq.path, QString("/api/rooms/room-1/messages"));
        QCOMPARE(postReq.jsonBody.value("content").toString(), QString("Oi, pessoal!"));

        QCOMPARE(service->sendMessage("room-1", "Segunda rápida"), false);
        QCOMPARE(service->errorMessage(), QString("Aguarde um instante antes de enviar outra mensagem."));
    }

    void deleteMessageRemovesItemFromModel()
    {
        m_server->enqueueResponse(200, QJsonObject{
            {"messages", QJsonArray{
                makeMessage("m-del", "room-1", "u1", "Autor", "Apagar esta", "2026-01-01T10:00:00.000Z")
            }},
            {"hasMore", false}
        });

        MessageService *service = MessageService::instance();
        MessageListModel *model = service->messages();
        service->loadInitialMessages("room-1", 50);
        QTRY_COMPARE_WITH_TIMEOUT(model->count(), 1, 3000);

        m_server->enqueueResponse(200, QJsonObject{{"success", true}});
        service->deleteMessage("m-del");

        QTRY_COMPARE_WITH_TIMEOUT(model->count(), 0, 3000);
        QCOMPARE(m_server->lastRequest().method, QString("DELETE"));
        QCOMPARE(m_server->lastRequest().path, QString("/api/messages/m-del"));
    }
};

QTEST_MAIN(TestMessageAndPagination)
#include "test_message_and_pagination.moc"
