#include <QtTest>
#include <QSignalSpy>
#include <QJsonObject>

#include "AuthService.hpp"
#include "AppConfig.hpp"
#include "SessionStore.hpp"
#include "MockHttpServer.hpp"
#include "TestEnvironment.hpp"

class TestAuthService : public QObject
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
        AuthService::instance()->clearError();
    }

    void cleanup()
    {
        delete m_server;
        m_server = nullptr;
        m_env.cleanup();
    }

    void registerAccountSuccessPersistsSession()
    {
        m_server->enqueueResponse(201, QJsonObject{
            {"token", "reg-jwt-123"},
            {"user", QJsonObject{
                {"id", "10"},
                {"displayName", "Maria"},
                {"email", "maria@example.com"},
                {"role", "user"},
                {"status", "online"}
            }}
        });

        AuthService *auth = AuthService::instance();
        QSignalSpy successSpy(auth, &AuthService::registerSucceeded);
        QSignalSpy failSpy(auth, &AuthService::authFailed);

        auth->registerAccount("Maria", "maria@example.com", "SenhaForte123!");

        QTRY_COMPARE_WITH_TIMEOUT(successSpy.count(), 1, 3000);
        QCOMPARE(failSpy.count(), 0);
        QCOMPARE(auth->busy(), false);
        QVERIFY(auth->errorMessage().isEmpty());

        QCOMPARE(SessionStore::instance()->isAuthenticated(), true);
        QCOMPARE(SessionStore::instance()->token(), QString("reg-jwt-123"));
        QCOMPARE(SessionStore::instance()->userId(), QString("10"));
        QCOMPARE(SessionStore::instance()->displayName(), QString("Maria"));
        QCOMPARE(SessionStore::instance()->email(), QString("maria@example.com"));

        const MockHttpServer::RecordedRequest req = m_server->lastRequest();
        QCOMPARE(req.method, QString("POST"));
        QCOMPARE(req.path, QString("/api/auth/register"));
        QCOMPARE(req.jsonBody.value("displayName").toString(), QString("Maria"));
        QCOMPARE(req.jsonBody.value("email").toString(), QString("maria@example.com"));
        QCOMPARE(req.jsonBody.value("password").toString(), QString("SenhaForte123!"));
    }

    void registerAccountDuplicateEmailEmitsAuthFailed()
    {
        m_server->enqueueResponse(409, QJsonObject{
            {"error", "E-mail já cadastrado"}
        });

        AuthService *auth = AuthService::instance();
        QSignalSpy successSpy(auth, &AuthService::registerSucceeded);
        QSignalSpy failSpy(auth, &AuthService::authFailed);

        auth->registerAccount("Maria", "maria@example.com", "SenhaForte123!");

        QTRY_COMPARE_WITH_TIMEOUT(failSpy.count(), 1, 3000);
        QCOMPARE(successSpy.count(), 0);
        QCOMPARE(auth->busy(), false);
        QCOMPARE(auth->errorMessage(), QString("E-mail já cadastrado"));
        QCOMPARE(failSpy.at(0).at(0).toString(), QString("E-mail já cadastrado"));
        QCOMPARE(SessionStore::instance()->isAuthenticated(), false);
    }

    void loginSuccessPersistsSession()
    {
        m_server->enqueueResponse(200, QJsonObject{
            {"token", "login-jwt-999"},
            {"user", QJsonObject{
                {"id", "25"},
                {"displayName", "Carlos"},
                {"email", "carlos@example.com"},
                {"role", "mod"},
                {"status", "online"}
            }}
        });

        AuthService *auth = AuthService::instance();
        QSignalSpy successSpy(auth, &AuthService::loginSucceeded);
        QSignalSpy failSpy(auth, &AuthService::authFailed);

        auth->login("carlos@example.com", "MinhaSenha123!");

        QTRY_COMPARE_WITH_TIMEOUT(successSpy.count(), 1, 3000);
        QCOMPARE(failSpy.count(), 0);
        QCOMPARE(auth->busy(), false);
        QVERIFY(auth->errorMessage().isEmpty());

        QCOMPARE(SessionStore::instance()->isAuthenticated(), true);
        QCOMPARE(SessionStore::instance()->token(), QString("login-jwt-999"));
        QCOMPARE(SessionStore::instance()->userId(), QString("25"));
        QCOMPARE(SessionStore::instance()->displayName(), QString("Carlos"));
        QCOMPARE(SessionStore::instance()->role(), QString("mod"));

        const MockHttpServer::RecordedRequest req = m_server->lastRequest();
        QCOMPARE(req.method, QString("POST"));
        QCOMPARE(req.path, QString("/api/auth/login"));
        QCOMPARE(req.jsonBody.value("email").toString(), QString("carlos@example.com"));
        QCOMPARE(req.jsonBody.value("password").toString(), QString("MinhaSenha123!"));
    }

    void loginInvalidCredentialsEmitsAuthFailed()
    {
        m_server->enqueueResponse(401, QJsonObject{
            {"error", "Credenciais inválidas"}
        });

        AuthService *auth = AuthService::instance();
        QSignalSpy successSpy(auth, &AuthService::loginSucceeded);
        QSignalSpy failSpy(auth, &AuthService::authFailed);

        auth->login("carlos@example.com", "errada");

        QTRY_COMPARE_WITH_TIMEOUT(failSpy.count(), 1, 3000);
        QCOMPARE(successSpy.count(), 0);
        QCOMPARE(auth->busy(), false);
        QCOMPARE(auth->errorMessage(), QString("Credenciais inválidas"));
        QCOMPARE(SessionStore::instance()->isAuthenticated(), false);
    }

    void loginRateLimitedEmits429Message()
    {
        m_server->enqueueResponse(429, QJsonObject{
            {"error", "Conta temporariamente bloqueada por excesso de tentativas"}
        });

        AuthService *auth = AuthService::instance();
        QSignalSpy failSpy(auth, &AuthService::authFailed);

        auth->login("carlos@example.com", "tentativa");

        QTRY_COMPARE_WITH_TIMEOUT(failSpy.count(), 1, 3000);
        QCOMPARE(auth->errorMessage(), QString("Conta temporariamente bloqueada por excesso de tentativas"));
        QCOMPARE(SessionStore::instance()->isAuthenticated(), false);
    }

    void fetchMeUpdatesUserAndHandlesInvalidToken()
    {
        SessionStore::instance()->setSession(
            "valid-jwt",
            QJsonObject{{"id", "25"}, {"displayName", "Old Name"}, {"email", "carlos@example.com"}}
        );

        m_server->enqueueResponse(200, QJsonObject{
            {"id", "25"},
            {"displayName", "Updated Name"},
            {"email", "carlos@example.com"},
            {"role", "admin"},
            {"status", "busy"}
        });

        AuthService *auth = AuthService::instance();
        auth->fetchMe();

        QTRY_COMPARE_WITH_TIMEOUT(SessionStore::instance()->displayName(), QString("Updated Name"), 3000);
        QCOMPARE(SessionStore::instance()->role(), QString("admin"));
        QCOMPARE(SessionStore::instance()->status(), QString("busy"));
        QCOMPARE(m_server->lastRequest().path, QString("/api/auth/me"));
        QCOMPARE(m_server->lastRequest().headers.value("authorization"), QString("Bearer valid-jwt"));

        m_server->enqueueResponse(401, QJsonObject{
            {"error", "Token inválido"}
        });

        auth->fetchMe();

        QTRY_COMPARE_WITH_TIMEOUT(SessionStore::instance()->isAuthenticated(), false, 3000);
        QCOMPARE(auth->errorMessage(), QString("Sua sessão expirou. Faça login novamente."));
        QVERIFY(SessionStore::instance()->token().isEmpty());
    }

    void logoutClearsSessionAndError()
    {
        SessionStore::instance()->setSession(
            "active-jwt",
            QJsonObject{{"id", "3"}, {"displayName", "Ana"}, {"email", "ana@example.com"}}
        );
        QCOMPARE(SessionStore::instance()->isAuthenticated(), true);

        AuthService::instance()->logout();
        QCOMPARE(SessionStore::instance()->isAuthenticated(), false);
        QVERIFY(SessionStore::instance()->token().isEmpty());
        QVERIFY(AuthService::instance()->errorMessage().isEmpty());
    }
};

QTEST_MAIN(TestAuthService)
#include "test_auth_service.moc"
