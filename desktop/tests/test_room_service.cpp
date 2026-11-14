#include <QtTest>
#include <QSignalSpy>
#include <QJsonArray>
#include <QJsonObject>

#include "RoomService.hpp"
#include "RoomListModel.hpp"
#include "AppConfig.hpp"
#include "SessionStore.hpp"
#include "MockHttpServer.hpp"
#include "TestEnvironment.hpp"

class TestRoomService : public QObject
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
            "room-test-jwt",
            QJsonObject{{"id", "user-1"}, {"displayName", "Dono"}, {"email", "dono@example.com"}, {"role", "user"}}
        );
        RoomService::instance()->clearError();
        RoomService::instance()->leaveActiveRoom();
        RoomService::instance()->rooms()->setSearchQuery(QString());
        RoomService::instance()->rooms()->setCategoryFilter(QString());
    }

    void cleanup()
    {
        delete m_server;
        m_server = nullptr;
        m_env.cleanup();
    }

    void fetchRoomsPopulatesModelAndSupportsFiltering()
    {
        m_server->enqueueRawResponse(
            200,
            QJsonDocument(QJsonArray{
                QJsonObject{
                    {"id", "r1"},
                    {"name", "Sala Geral"},
                    {"description", "Conversas livres"},
                    {"category", "Casual"},
                    {"type", "public"},
                    {"created_by", "user-1"},
                    {"membersCount", 12}
                },
                QJsonObject{
                    {"id", "r2"},
                    {"name", "Qt e C++20"},
                    {"description", "Arquitetura nativa"},
                    {"category", "Tecnologia"},
                    {"type", "public"},
                    {"created_by", "user-2"},
                    {"membersCount", 5}
                },
                QJsonObject{
                    {"id", "r3"},
                    {"name", "RPG de Mesa"},
                    {"description", "Campanha semanal"},
                    {"category", "Jogos"},
                    {"type", "public"},
                    {"created_by", "user-3"},
                    {"membersCount", 8}
                }
            }).toJson(QJsonDocument::Compact)
        );

        RoomService *service = RoomService::instance();
        RoomListModel *model = service->rooms();

        service->fetchRooms();
        QTRY_COMPARE_WITH_TIMEOUT(model->count(), 3, 3000);

        const MockHttpServer::RecordedRequest req = m_server->lastRequest();
        QCOMPARE(req.method, QString("GET"));
        QCOMPARE(req.path, QString("/api/rooms"));
        QCOMPARE(req.headers.value("authorization"), QString("Bearer room-test-jwt"));

        QCOMPARE(model->data(model->index(0, 0), RoomListModel::NameRole).toString(), QString("Sala Geral"));
        QCOMPARE(model->data(model->index(1, 0), RoomListModel::CategoryRole).toString(), QString("Tecnologia"));
        QCOMPARE(model->data(model->index(2, 0), RoomListModel::MembersCountRole).toInt(), 8);

        model->setSearchQuery("nativa");
        QCOMPARE(model->count(), 1);
        QCOMPARE(model->data(model->index(0, 0), RoomListModel::IdRole).toString(), QString("r2"));

        model->setSearchQuery(QString());
        model->setCategoryFilter("Jogos");
        QCOMPARE(model->count(), 1);
        QCOMPARE(model->data(model->index(0, 0), RoomListModel::NameRole).toString(), QString("RPG de Mesa"));

        model->setCategoryFilter("Todas");
        QCOMPARE(model->count(), 3);
    }

    void createRoomValidatesEmptyNameAndCreatesOnServer()
    {
        RoomService *service = RoomService::instance();
        service->createRoom("   ", "Casual", "Teste");
        QCOMPARE(service->errorMessage(), QString("Informe o nome da sala."));
        QCOMPARE(m_server->requestCount(), 0);

        m_server->enqueueResponse(201, QJsonObject{
            {"id", "r-new"},
            {"name", "Geral"},
            {"category", "Casual"},
            {"description", "Bem-vindos"},
            {"type", "public"},
            {"created_by", "user-1"}
        });
        m_server->enqueueRawResponse(
            200,
            QJsonDocument(QJsonArray{
                QJsonObject{
                    {"id", "r-new"},
                    {"name", "Geral"},
                    {"category", "Casual"},
                    {"description", "Bem-vindos"},
                    {"type", "public"},
                    {"created_by", "user-1"},
                    {"membersCount", 1}
                }
            }).toJson(QJsonDocument::Compact)
        );

        QSignalSpy createdSpy(service, &RoomService::roomCreated);
        service->createRoom("Geral", "Casual", "Bem-vindos");

        QTRY_COMPARE_WITH_TIMEOUT(createdSpy.count(), 1, 3000);
        QCOMPARE(createdSpy.at(0).at(0).toString(), QString("r-new"));
        QTRY_COMPARE_WITH_TIMEOUT(service->rooms()->count(), 1, 3000);
        QCOMPARE(m_server->requests().at(0).method, QString("POST"));
        QCOMPARE(m_server->requests().at(0).path, QString("/api/rooms"));
        QCOMPARE(m_server->requests().at(0).jsonBody.value("name").toString(), QString("Geral"));
        QCOMPARE(m_server->requests().at(1).method, QString("GET"));
        QCOMPARE(m_server->requests().at(1).path, QString("/api/rooms"));
    }

    void joinRoomUpdatesActiveRoomMetadata()
    {
        m_server->enqueueResponse(200, QJsonObject{{"joined", true}});
        m_server->enqueueResponse(200, QJsonObject{
            {"id", "r-42"},
            {"name", "Laboratório Qt"},
            {"description", "Discussões técnicas"},
            {"created_by", "user-9"}
        });

        RoomService *service = RoomService::instance();
        QSignalSpy enteredSpy(service, &RoomService::roomEntered);

        service->joinRoom("r-42");

        QTRY_COMPARE_WITH_TIMEOUT(enteredSpy.count(), 1, 3000);
        QCOMPARE(enteredSpy.at(0).at(0).toString(), QString("r-42"));
        QCOMPARE(service->activeRoomId(), QString("r-42"));
        QCOMPARE(service->activeRoomName(), QString("Laboratório Qt"));
        QCOMPARE(service->activeRoomDescription(), QString("Discussões técnicas"));
        QCOMPARE(service->activeRoomOwnerId(), QString("user-9"));

        QCOMPARE(m_server->requestCount(), 2);
        QCOMPARE(m_server->requests().at(0).method, QString("POST"));
        QCOMPARE(m_server->requests().at(0).path, QString("/api/rooms/r-42/join"));
        QCOMPARE(m_server->requests().at(1).method, QString("GET"));
        QCOMPARE(m_server->requests().at(1).path, QString("/api/rooms/r-42"));
    }
};

QTEST_MAIN(TestRoomService)
#include "test_room_service.moc"
