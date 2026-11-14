#include <QtTest>
#include <QSignalSpy>
#include <QNetworkAccessManager>
#include <QNetworkReply>
#include <QNetworkRequest>
#include <QJsonDocument>
#include <QJsonObject>
#include <QUrl>

#include "OAuthLoopbackServer.hpp"
#include "AuthService.hpp"
#include "AppConfig.hpp"
#include "SessionStore.hpp"
#include "MockHttpServer.hpp"
#include "TestEnvironment.hpp"

class TestGoogleOAuth : public QObject
{
    Q_OBJECT

private:
    TestEnvironment m_env;
    MockHttpServer *m_backendServer = nullptr;
    MockHttpServer *m_supabaseServer = nullptr;

private slots:
    void init()
    {
        m_env.init();
        m_backendServer = new MockHttpServer(this);
        m_supabaseServer = new MockHttpServer(this);
        QVERIFY(m_backendServer->start());
        QVERIFY(m_supabaseServer->start());
        AppConfig::instance()->setApiBaseUrl(m_backendServer->baseUrl());
        AppConfig::instance()->setSupabaseUrl(QString("http://127.0.0.1:%1").arg(m_supabaseServer->port()));
        AppConfig::instance()->setSupabaseAnonKey("test-anon-key");
        AuthService::instance()->cancelGoogleLogin();
        AuthService::instance()->clearError();
    }

    void cleanup()
    {
        AuthService::instance()->cancelGoogleLogin();
        delete m_supabaseServer;
        m_supabaseServer = nullptr;
        delete m_backendServer;
        m_backendServer = nullptr;
        m_env.cleanup();
    }

    void loopbackServerServesCallbackHtmlAndReceivesCompleteToken()
    {
        OAuthLoopbackServer server;
        const QString callbackUrl = server.startListening();
        QVERIFY(callbackUrl.startsWith("http://127.0.0.1:"));
        QVERIFY(callbackUrl.endsWith("/callback"));
        QVERIFY(server.isListening());

        QNetworkAccessManager nam;
        QNetworkReply *getReply = nam.get(QNetworkRequest(QUrl(callbackUrl)));
        QTRY_VERIFY_WITH_TIMEOUT(getReply->isFinished(), 3000);
        QCOMPARE(getReply->attribute(QNetworkRequest::HttpStatusCodeAttribute).toInt(), 200);
        const QByteArray html = getReply->readAll();
        QVERIFY(html.contains("SkyRipple ID"));
        QVERIFY(html.contains("access_token"));
        QVERIFY(html.contains("/complete"));
        getReply->deleteLater();

        QSignalSpy tokenSpy(&server, &OAuthLoopbackServer::tokenReceived);
        QSignalSpy errorSpy(&server, &OAuthLoopbackServer::authError);

        const QString completeUrl = QString("http://127.0.0.1:%1/complete").arg(server.port());
        QNetworkRequest postReq{QUrl(completeUrl)};
        postReq.setHeader(QNetworkRequest::ContentTypeHeader, "application/json");
        const QByteArray payload = QJsonDocument(QJsonObject{{"access_token", "supa-oauth-token-123"}}).toJson(QJsonDocument::Compact);

        QNetworkReply *postReply = nam.post(postReq, payload);
        QTRY_VERIFY_WITH_TIMEOUT(postReply->isFinished(), 3000);
        QCOMPARE(postReply->attribute(QNetworkRequest::HttpStatusCodeAttribute).toInt(), 200);
        postReply->deleteLater();

        QTRY_COMPARE_WITH_TIMEOUT(tokenSpy.count(), 1, 3000);
        QCOMPARE(tokenSpy.at(0).at(0).toString(), QString("supa-oauth-token-123"));
        QCOMPARE(errorSpy.count(), 0);
        QCOMPARE(server.isListening(), false);
    }

    void loopbackServerEmitsAuthErrorOnOAuthFailure()
    {
        OAuthLoopbackServer server;
        const QString callbackUrl = server.startListening();
        QVERIFY(!callbackUrl.isEmpty());

        QSignalSpy tokenSpy(&server, &OAuthLoopbackServer::tokenReceived);
        QSignalSpy errorSpy(&server, &OAuthLoopbackServer::authError);

        QNetworkAccessManager nam;
        const QString completeUrl = QString("http://127.0.0.1:%1/complete").arg(server.port());
        QNetworkRequest postReq{QUrl(completeUrl)};
        postReq.setHeader(QNetworkRequest::ContentTypeHeader, "application/json");
        const QByteArray payload = QJsonDocument(QJsonObject{{"error_description", "Acesso negado pelo usuário"}}).toJson(QJsonDocument::Compact);

        QNetworkReply *postReply = nam.post(postReq, payload);
        QTRY_VERIFY_WITH_TIMEOUT(postReply->isFinished(), 3000);
        postReply->deleteLater();

        QTRY_COMPARE_WITH_TIMEOUT(errorSpy.count(), 1, 3000);
        QCOMPARE(errorSpy.at(0).at(0).toString(), QString("Acesso negado pelo usuário"));
        QCOMPARE(tokenSpy.count(), 0);
        QCOMPARE(server.isListening(), false);
    }

    void authServiceGoogleFlowFetchesSupabaseUserAndSyncsWithBackend()
    {
        m_supabaseServer->enqueueResponse(200, QJsonObject{
            {"id", "supa-user-1"},
            {"email", "oauth.google@example.com"},
            {"user_metadata", QJsonObject{
                {"full_name", "Google User Test"},
                {"avatar_url", "https://lh3.googleusercontent.com/a/photo.jpg"}
            }}
        });

        m_backendServer->enqueueResponse(200, QJsonObject{
            {"token", "backend-jwt-oauth"},
            {"user", QJsonObject{
                {"id", "u-99"},
                {"email", "oauth.google@example.com"},
                {"displayName", "Google User Test"},
                {"profilePhoto", "https://lh3.googleusercontent.com/a/photo.jpg"},
                {"role", "user"},
                {"status", "online"}
            }}
        });

        AuthService *auth = AuthService::instance();
        QSignalSpy loginSpy(auth, &AuthService::loginSucceeded);
        QSignalSpy focusSpy(auth, &AuthService::requestWindowFocus);
        QSignalSpy failSpy(auth, &AuthService::authFailed);

        auth->completeGoogleLoginWithToken("supa-access-xyz");

        QTRY_COMPARE_WITH_TIMEOUT(loginSpy.count(), 1, 3000);
        QCOMPARE(focusSpy.count(), 1);
        QCOMPARE(failSpy.count(), 0);
        QCOMPARE(auth->busy(), false);

        const MockHttpServer::RecordedRequest supaReq = m_supabaseServer->lastRequest();
        QCOMPARE(supaReq.method, QString("GET"));
        QCOMPARE(supaReq.path, QString("/auth/v1/user"));
        QCOMPARE(supaReq.headers.value("apikey"), QString("test-anon-key"));
        QCOMPARE(supaReq.headers.value("authorization"), QString("Bearer supa-access-xyz"));

        const MockHttpServer::RecordedRequest syncReq = m_backendServer->lastRequest();
        QCOMPARE(syncReq.method, QString("POST"));
        QCOMPARE(syncReq.path, QString("/api/auth/oauth-sync"));
        QCOMPARE(syncReq.jsonBody.value("email").toString(), QString("oauth.google@example.com"));
        QCOMPARE(syncReq.jsonBody.value("name").toString(), QString("Google User Test"));
        QCOMPARE(syncReq.jsonBody.value("avatar_url").toString(), QString("https://lh3.googleusercontent.com/a/photo.jpg"));

        QCOMPARE(SessionStore::instance()->isAuthenticated(), true);
        QCOMPARE(SessionStore::instance()->token(), QString("backend-jwt-oauth"));
        QCOMPARE(SessionStore::instance()->userId(), QString("u-99"));
        QCOMPARE(SessionStore::instance()->displayName(), QString("Google User Test"));
        QCOMPARE(SessionStore::instance()->email(), QString("oauth.google@example.com"));
        QCOMPARE(SessionStore::instance()->profilePhoto(), QString("https://lh3.googleusercontent.com/a/photo.jpg"));
    }

    void authServiceValidatesMissingSupabaseConfigAndPreservesSessionOnCancel()
    {
        SessionStore::instance()->setSession(
            "existing-jwt",
            QJsonObject{{"id", "u-1"}, {"displayName", "Existing"}, {"email", "existing@example.com"}}
        );

        AppConfig::instance()->setSupabaseUrl("");
        AppConfig::instance()->setSupabaseAnonKey("");

        AuthService *auth = AuthService::instance();
        QSignalSpy failSpy(auth, &AuthService::authFailed);

        auth->loginWithGoogle();
        QCOMPARE(failSpy.count(), 1);
        QCOMPARE(auth->waitingForGoogle(), false);

        auth->cancelGoogleLogin();
        QCOMPARE(SessionStore::instance()->isAuthenticated(), true);
        QCOMPARE(SessionStore::instance()->token(), QString("existing-jwt"));
    }
};

QTEST_MAIN(TestGoogleOAuth)
#include "test_google_oauth.moc"
