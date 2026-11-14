#include <QtTest>
#include <QSignalSpy>
#include <QJsonObject>
#include <QJsonDocument>
#include <QUrlQuery>

#include "ApiClient.hpp"
#include "AppConfig.hpp"
#include "SessionStore.hpp"
#include "MockHttpServer.hpp"
#include "TestEnvironment.hpp"

class TestApiClient : public QObject
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
    }

    void cleanup()
    {
        delete m_server;
        m_server = nullptr;
        m_env.cleanup();
    }

    void injectsJsonHeadersAndBearerTokenWhenAuthenticated()
    {
        SessionStore::instance()->setSession(
            "secret-jwt-token",
            QJsonObject{{"id", "7"}, {"email", "alice@example.com"}}
        );

        m_server->enqueueResponse(200, QJsonObject{{"ok", true}, {"count", 3}});

        bool done = false;
        QJsonDocument receivedDoc;
        int receivedStatus = 0;

        ApiClient::instance()->post(
            "/rooms",
            QJsonObject{{"name", "General"}},
            [&](const QJsonDocument &doc, int status) {
                receivedStatus = status;
                receivedDoc = doc;
                done = true;
            },
            [&](const QString &, int) {
                QFAIL("Unexpected error callback");
            }
        );

        QTRY_VERIFY_WITH_TIMEOUT(done, 3000);
        QCOMPARE(receivedStatus, 200);
        QCOMPARE(receivedDoc.object().value("ok").toBool(), true);
        QCOMPARE(receivedDoc.object().value("count").toInt(), 3);

        QCOMPARE(m_server->requestCount(), 1);
        const MockHttpServer::RecordedRequest req = m_server->lastRequest();
        QCOMPARE(req.method, QString("POST"));
        QCOMPARE(req.path, QString("/api/rooms"));
        QCOMPARE(req.headers.value("content-type"), QString("application/json"));
        QCOMPARE(req.headers.value("accept"), QString("application/json"));
        QCOMPARE(req.headers.value("authorization"), QString("Bearer secret-jwt-token"));
        QCOMPARE(req.jsonBody.value("name").toString(), QString("General"));
    }

    void omitsAuthorizationHeaderWhenUnauthenticated()
    {
        SessionStore::instance()->clearSession();
        m_server->enqueueResponse(200, QJsonObject{{"status", "ok"}});

        QUrlQuery query;
        query.addQueryItem("limit", "10");

        bool done = false;
        ApiClient::instance()->get(
            "/health",
            query,
            [&](const QJsonDocument &, int status) {
                QCOMPARE(status, 200);
                done = true;
            },
            [&](const QString &, int) {
                QFAIL("Unexpected error callback");
            }
        );

        QTRY_VERIFY_WITH_TIMEOUT(done, 3000);
        const MockHttpServer::RecordedRequest req = m_server->lastRequest();
        QCOMPARE(req.method, QString("GET"));
        QCOMPARE(req.path, QString("/api/health"));
        QCOMPARE(req.query, QString("limit=10"));
        QVERIFY(!req.headers.contains("authorization"));
    }

    void extractsBackendErrorFieldAcrossStatusCodes()
    {
        const QList<QPair<int, QString>> cases{
            {400, "Dados inválidos"},
            {403, "Acesso negado"},
            {404, "Recurso não encontrado"},
            {409, "E-mail já cadastrado"},
            {429, "Muitas tentativas. Tente novamente mais tarde."},
            {500, "Erro interno do servidor"}
        };

        for (const auto &entry : cases) {
            m_server->enqueueResponse(entry.first, QJsonObject{{"error", entry.second}});

            bool done = false;
            int gotStatus = 0;
            QString gotError;

            ApiClient::instance()->get(
                "/test",
                QUrlQuery(),
                [&](const QJsonDocument &, int) {
                    QFAIL("Expected error callback");
                },
                [&](const QString &message, int status) {
                    gotStatus = status;
                    gotError = message;
                    done = true;
                }
            );

            QTRY_VERIFY_WITH_TIMEOUT(done, 3000);
            QCOMPARE(gotStatus, entry.first);
            QCOMPARE(gotError, entry.second);
        }
    }

    void unauthorizedClearsSessionAndEmitsSessionExpired()
    {
        SessionStore::instance()->setSession(
            "expired-token",
            QJsonObject{{"id", "9"}, {"email", "bob@example.com"}}
        );
        QCOMPARE(SessionStore::instance()->isAuthenticated(), true);

        m_server->enqueueResponse(401, QJsonObject{{"error", "Token inválido ou expirado"}});

        QSignalSpy expiredSpy(ApiClient::instance(), &ApiClient::sessionExpired);

        bool done = false;
        int gotStatus = 0;
        QString gotError;

        ApiClient::instance()->get(
            "/auth/me",
            QUrlQuery(),
            [&](const QJsonDocument &, int) {
                QFAIL("Expected 401 error");
            },
            [&](const QString &message, int status) {
                gotStatus = status;
                gotError = message;
                done = true;
            }
        );

        QTRY_VERIFY_WITH_TIMEOUT(done, 3000);
        QCOMPARE(gotStatus, 401);
        QCOMPARE(gotError, QString("Token inválido ou expirado"));
        QCOMPARE(expiredSpy.count(), 1);
        QCOMPARE(SessionStore::instance()->isAuthenticated(), false);
        QVERIFY(SessionStore::instance()->token().isEmpty());
    }

    void supportsPutPatchAndDeleteMethods()
    {
        SessionStore::instance()->setSession("tok", QJsonObject{{"id", "1"}});
        m_server->enqueueResponse(200, QJsonObject{{"updated", true}});
        m_server->enqueueResponse(200, QJsonObject{{"patched", true}});
        m_server->enqueueResponse(200, QJsonObject{{"deleted", true}});

        bool putDone = false;
        ApiClient::instance()->put(
            "/profile",
            QJsonObject{{"display_name", "New"}},
            [&](const QJsonDocument &, int status) {
                QCOMPARE(status, 200);
                putDone = true;
            },
            [&](const QString &, int) { QFAIL("Unexpected PUT error"); }
        );
        QTRY_VERIFY_WITH_TIMEOUT(putDone, 3000);
        QCOMPARE(m_server->lastRequest().method, QString("PUT"));

        bool patchDone = false;
        ApiClient::instance()->patch(
            "/profile/status",
            QJsonObject{{"status", "busy"}},
            [&](const QJsonDocument &, int status) {
                QCOMPARE(status, 200);
                patchDone = true;
            },
            [&](const QString &, int) { QFAIL("Unexpected PATCH error"); }
        );
        QTRY_VERIFY_WITH_TIMEOUT(patchDone, 3000);
        QCOMPARE(m_server->lastRequest().method, QString("PATCH"));

        bool delDone = false;
        ApiClient::instance()->del(
            "/rooms/5",
            [&](const QJsonDocument &, int status) {
                QCOMPARE(status, 200);
                delDone = true;
            },
            [&](const QString &, int) { QFAIL("Unexpected DELETE error"); }
        );
        QTRY_VERIFY_WITH_TIMEOUT(delDone, 3000);
        QCOMPARE(m_server->lastRequest().method, QString("DELETE"));
        QCOMPARE(m_server->lastRequest().path, QString("/api/rooms/5"));
    }
};

QTEST_MAIN(TestApiClient)
#include "test_api_client.moc"
