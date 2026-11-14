#include <QtTest>
#include <QSignalSpy>
#include <QNetworkAccessManager>
#include <QNetworkReply>
#include <QNetworkRequest>
#include <QJsonDocument>
#include <QJsonObject>
#include <QUrl>
#include <QUrlQuery>

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
        qputenv("SKYRIPPLE_SKIP_OPEN_URL", "1");
        m_backendServer = new MockHttpServer(this);
        m_supabaseServer = new MockHttpServer(this);
        QVERIFY(m_backendServer->start());
        QVERIFY(m_supabaseServer->start());
        AppConfig::instance()->setApiBaseUrl(m_backendServer->baseUrl());
        AppConfig::instance()->setFrontendBaseUrl("https://web-chat-project-web2.vercel.app");
        AppConfig::instance()->setSupabaseUrl(QString("http://127.0.0.1:%1").arg(m_supabaseServer->port()));
        AppConfig::instance()->setSupabaseAnonKey("test-anon-key");
        AuthService::instance()->cancelGoogleLogin();
        AuthService::instance()->clearError();
    }

    void cleanup()
    {
        AuthService::instance()->cancelGoogleLogin();
        qunsetenv("SKYRIPPLE_SKIP_OPEN_URL");
        delete m_supabaseServer;
        m_supabaseServer = nullptr;
        delete m_backendServer;
        m_backendServer = nullptr;
        m_env.cleanup();
    }

    void loginWithGoogleBuildsRelayAuthorizeUrlAndHandlesCallbackSession()
    {
        AuthService *auth = AuthService::instance();
        QSignalSpy loginSpy(auth, &AuthService::loginSucceeded);
        QSignalSpy focusSpy(auth, &AuthService::requestWindowFocus);
        QSignalSpy failSpy(auth, &AuthService::authFailed);

        auth->loginWithGoogle();
        QCOMPARE(auth->waitingForGoogle(), true);
        const quint16 port = auth->activeGoogleLoopbackPort();
        QVERIFY(port >= 1024);

        const QUrl authorizeUrl = auth->buildGoogleAuthorizeUrl(port);
        QCOMPARE(authorizeUrl.path(), QString("/auth/v1/authorize"));
        const QUrlQuery authorizeQuery(authorizeUrl);
        QCOMPARE(authorizeQuery.queryItemValue("provider"), QString("google"));
        const QString expectedRedirect = QString("https://web-chat-project-web2.vercel.app/auth/callback?source=desktop&desktop_port=%1").arg(port);
        QCOMPARE(authorizeQuery.queryItemValue("redirect_to", QUrl::FullyDecoded), expectedRedirect);

        const QJsonObject userObj{
            {"id", "u-relay-77"},
            {"email", "relay.google@example.com"},
            {"displayName", "Relay User"},
            {"profilePhoto", "https://lh3.googleusercontent.com/a/relay.jpg"},
            {"role", "user"},
            {"status", "online"}
        };
        const QString userJson = QString::fromUtf8(QJsonDocument(userObj).toJson(QJsonDocument::Compact));

        QUrl callbackUrl(QString("http://127.0.0.1:%1/callback").arg(port));
        QUrlQuery cbQuery;
        cbQuery.addQueryItem("token", "backend-jwt-relay");
        cbQuery.addQueryItem("user", userJson);
        callbackUrl.setQuery(cbQuery);

        QNetworkAccessManager nam;
        QNetworkReply *reply = nam.get(QNetworkRequest(callbackUrl));
        QTRY_VERIFY_WITH_TIMEOUT(reply->isFinished(), 3000);
        QCOMPARE(reply->attribute(QNetworkRequest::HttpStatusCodeAttribute).toInt(), 200);
        const QByteArray html = reply->readAll();
        QVERIFY(html.contains("Login concluído!"));
        QVERIFY(html.contains("SkyRipple Desktop"));
        reply->deleteLater();

        QTRY_COMPARE_WITH_TIMEOUT(loginSpy.count(), 1, 3000);
        QCOMPARE(focusSpy.count(), 1);
        QCOMPARE(failSpy.count(), 0);
        QCOMPARE(auth->waitingForGoogle(), false);
        QCOMPARE(auth->busy(), false);

        QCOMPARE(SessionStore::instance()->isAuthenticated(), true);
        QCOMPARE(SessionStore::instance()->token(), QString("backend-jwt-relay"));
        QCOMPARE(SessionStore::instance()->userId(), QString("u-relay-77"));
        QCOMPARE(SessionStore::instance()->displayName(), QString("Relay User"));
        QCOMPARE(SessionStore::instance()->email(), QString("relay.google@example.com"));
        QCOMPARE(SessionStore::instance()->profilePhoto(), QString("https://lh3.googleusercontent.com/a/relay.jpg"));
    }

    void loginWithGoogleHandlesCallbackErrorWithoutCorruptingSession()
    {
        SessionStore::instance()->setSession(
            "existing-jwt",
            QJsonObject{{"id", "u-1"}, {"displayName", "Existing"}, {"email", "existing@example.com"}}
        );

        AuthService *auth = AuthService::instance();
        QSignalSpy failSpy(auth, &AuthService::authFailed);
        QSignalSpy loginSpy(auth, &AuthService::loginSucceeded);

        auth->loginWithGoogle();
        const quint16 port = auth->activeGoogleLoopbackPort();
        QVERIFY(port >= 1024);

        QUrl errorCallback(QString("http://127.0.0.1:%1/callback").arg(port));
        QUrlQuery errQuery;
        errQuery.addQueryItem("error", "access_denied");
        errorCallback.setQuery(errQuery);

        QNetworkAccessManager nam;
        QNetworkReply *reply = nam.get(QNetworkRequest(errorCallback));
        QTRY_VERIFY_WITH_TIMEOUT(reply->isFinished(), 3000);
        QCOMPARE(reply->attribute(QNetworkRequest::HttpStatusCodeAttribute).toInt(), 200);
        const QByteArray html = reply->readAll();
        QVERIFY(html.contains("access_denied"));
        reply->deleteLater();

        QTRY_COMPARE_WITH_TIMEOUT(failSpy.count(), 1, 3000);
        QCOMPARE(failSpy.at(0).at(0).toString(), QString("access_denied"));
        QCOMPARE(loginSpy.count(), 0);
        QCOMPARE(auth->waitingForGoogle(), false);

        QCOMPARE(SessionStore::instance()->isAuthenticated(), true);
        QCOMPARE(SessionStore::instance()->token(), QString("existing-jwt"));
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

        QCOMPARE(SessionStore::instance()->isAuthenticated(), true);
        QCOMPARE(SessionStore::instance()->token(), QString("backend-jwt-oauth"));
        QCOMPARE(SessionStore::instance()->userId(), QString("u-99"));
        QCOMPARE(SessionStore::instance()->displayName(), QString("Google User Test"));
    }

    void authServiceValidatesMissingSupabaseConfigAndPreservesSessionOnCancel()
    {
        SessionStore::instance()->setSession(
            "existing-jwt",
            QJsonObject{{"id", "u-1"}, {"displayName", "Existing"}, {"email", "existing@example.com"}}
        );

        AppConfig::instance()->setSupabaseUrl("");

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
