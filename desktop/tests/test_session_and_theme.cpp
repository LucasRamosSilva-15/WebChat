#include <QtTest>
#include <QSignalSpy>
#include <QJsonObject>
#include <QTemporaryDir>
#include <QDir>
#include <QFile>
#include <QTextStream>

#include "ThemeController.hpp"
#include "AppConfig.hpp"
#include "SessionStore.hpp"
#include "TestEnvironment.hpp"

class TestSessionAndTheme : public QObject
{
    Q_OBJECT

private:
    TestEnvironment m_env;

private slots:
    void init()
    {
        m_env.init();
    }

    void cleanup()
    {
        m_env.cleanup();
    }

    void themeControllerDefaultsAndPersistence()
    {
        ThemeController first;
        QCOMPARE(first.colorMode(), QString("light"));
        QCOMPARE(first.primaryColor(), QString("blue"));
        QCOMPARE(first.bgColor(), QString("neutral"));
        QCOMPARE(first.bubbleFormat(), QString("grande"));
        QCOMPARE(first.isDark(), false);

        QSignalSpy modeSpy(&first, &ThemeController::colorModeChanged);
        QSignalSpy primarySpy(&first, &ThemeController::primaryColorChanged);
        QSignalSpy bgSpy(&first, &ThemeController::bgColorChanged);
        QSignalSpy bubbleSpy(&first, &ThemeController::bubbleFormatChanged);

        first.toggleColorMode();
        QCOMPARE(first.colorMode(), QString("dark"));
        QCOMPARE(first.isDark(), true);
        QCOMPARE(modeSpy.count(), 1);

        first.setPrimaryColor("purple");
        QCOMPARE(first.primaryColor(), QString("purple"));
        QCOMPARE(primarySpy.count(), 1);

        first.setBgColor("classic_blue");
        QCOMPARE(first.bgColor(), QString("classic_blue"));
        QCOMPARE(bgSpy.count(), 1);

        first.setBubbleFormat("classico");
        QCOMPARE(first.bubbleFormat(), QString("classico"));
        QCOMPARE(bubbleSpy.count(), 1);

        first.setColorMode("invalid");
        QCOMPARE(first.colorMode(), QString("light"));
        first.setPrimaryColor("unknown");
        QCOMPARE(first.primaryColor(), QString("blue"));
        first.setColorMode("dark");
        first.setPrimaryColor("purple");

        ThemeController reloaded;
        QCOMPARE(reloaded.colorMode(), QString("dark"));
        QCOMPARE(reloaded.primaryColor(), QString("purple"));
        QCOMPARE(reloaded.bgColor(), QString("classic_blue"));
        QCOMPARE(reloaded.bubbleFormat(), QString("classico"));
        QCOMPARE(reloaded.isDark(), true);
    }

    void appConfigNormalizationAndPersistence()
    {
        AppConfig *config = AppConfig::instance();
        QCOMPARE(config->apiBaseUrl(), QString("https://webchat-9vqr.onrender.com/api"));

        QSignalSpy urlSpy(config, &AppConfig::apiBaseUrlChanged);
        config->setApiBaseUrl("https://webchat-9vqr.onrender.com///");
        QCOMPARE(config->apiBaseUrl(), QString("https://webchat-9vqr.onrender.com"));
        QCOMPARE(urlSpy.count(), 1);

        config->setApiBaseUrl("https://custom.example.com/api/");
        QCOMPARE(config->apiBaseUrl(), QString("https://custom.example.com/api"));

        config->setApiBaseUrl("");
        QCOMPARE(config->apiBaseUrl(), QString("https://webchat-9vqr.onrender.com/api"));

        config->setApiBaseUrl("http://127.0.0.1:4000/api");
        QCOMPARE(config->apiBaseUrl(), QString("http://127.0.0.1:4000/api"));

        config->reload();
        QCOMPARE(config->apiBaseUrl(), QString("http://127.0.0.1:4000/api"));

        config->resetApiBaseUrl();
        QCOMPARE(config->apiBaseUrl(), QString("https://webchat-9vqr.onrender.com/api"));
    }

    void appConfigLoadsSupabaseFromDotEnv()
    {
        QTemporaryDir tempDir;
        QVERIFY(tempDir.isValid());

        QFile envFile(tempDir.filePath(".env"));
        QVERIFY(envFile.open(QIODevice::WriteOnly | QIODevice::Text));
        QTextStream out(&envFile);
        out << "VITE_SUPABASE_URL=\"https://dotenv-demo.supabase.co/\"\n";
        out << "VITE_SUPABASE_ANON_KEY='anon-key-from-dotenv'\n";
        envFile.close();

        const QString oldCwd = QDir::currentPath();
        QVERIFY(QDir::setCurrent(tempDir.path()));

        AppConfig *config = AppConfig::instance();
        config->setSupabaseUrl("");
        config->setSupabaseAnonKey("");
        config->reload();

        QCOMPARE(config->supabaseUrl(), QString("https://dotenv-demo.supabase.co"));
        QCOMPARE(config->supabaseAnonKey(), QString("anon-key-from-dotenv"));

        QVERIFY(QDir::setCurrent(oldCwd));
    }

    void sessionStorePersistAndClear()
    {
        SessionStore *store = SessionStore::instance();
        QCOMPARE(store->isAuthenticated(), false);
        QVERIFY(store->token().isEmpty());

        QSignalSpy sessionSpy(store, &SessionStore::sessionChanged);

        QJsonObject user{
            {"id", "42"},
            {"displayName", "Lucas"},
            {"email", "lucas@example.com"},
            {"profilePhoto", "/uploads/avatar.png"},
            {"profileDesc", "Desktop tester"},
            {"role", "admin"},
            {"status", "online"}
        };
        store->setSession("jwt-token-abc", user);

        QCOMPARE(store->isAuthenticated(), true);
        QCOMPARE(store->token(), QString("jwt-token-abc"));
        QCOMPARE(store->userId(), QString("42"));
        QCOMPARE(store->displayName(), QString("Lucas"));
        QCOMPARE(store->email(), QString("lucas@example.com"));
        QCOMPARE(store->profilePhoto(), QString("/uploads/avatar.png"));
        QCOMPARE(store->profileDesc(), QString("Desktop tester"));
        QCOMPARE(store->role(), QString("admin"));
        QCOMPARE(store->status(), QString("online"));
        QCOMPARE(sessionSpy.count(), 1);

        store->reload();
        QCOMPARE(store->isAuthenticated(), true);
        QCOMPARE(store->token(), QString("jwt-token-abc"));
        QCOMPARE(store->userId(), QString("42"));
        QCOMPARE(store->displayName(), QString("Lucas"));
        QCOMPARE(store->email(), QString("lucas@example.com"));

        QJsonObject updatedUser{
            {"id", "42"},
            {"displayName", "Lucas Ramos"},
            {"email", "lucas@example.com"},
            {"role", "owner"},
            {"status", "away"}
        };
        store->updateUser(updatedUser);
        QCOMPARE(store->displayName(), QString("Lucas Ramos"));
        QCOMPARE(store->role(), QString("owner"));
        QCOMPARE(store->status(), QString("away"));

        store->clearSession();
        QCOMPARE(store->isAuthenticated(), false);
        QVERIFY(store->token().isEmpty());
        QVERIFY(store->userId().isEmpty());
        QVERIFY(store->displayName().isEmpty());
        QVERIFY(store->email().isEmpty());

        store->reload();
        QCOMPARE(store->isAuthenticated(), false);
        QVERIFY(store->token().isEmpty());
    }

    void jwtExpirationAndReloadAutoLogout()
    {
        auto makeJwt = [](qint64 expSec) -> QString {
            const QByteArray header = QByteArray("{\"alg\":\"HS256\",\"typ\":\"JWT\"}").toBase64(QByteArray::Base64UrlEncoding | QByteArray::OmitTrailingEquals);
            const QByteArray payload = QJsonDocument(QJsonObject{{"id", "42"}, {"exp", expSec}}).toJson(QJsonDocument::Compact).toBase64(QByteArray::Base64UrlEncoding | QByteArray::OmitTrailingEquals);
            return QString::fromLatin1(header + "." + payload + ".sig");
        };

        const qint64 nowSec = QDateTime::currentSecsSinceEpoch();
        const QString validJwt = makeJwt(nowSec + 3600);
        const QString expiredJwt = makeJwt(nowSec - 60);

        QVERIFY(!SessionStore::isJwtExpired("opaque-test-token"));
        QVERIFY(!SessionStore::isJwtExpired(validJwt));
        QVERIFY(SessionStore::isJwtExpired(expiredJwt));

        SessionStore *store = SessionStore::instance();
        store->setSession(validJwt, QJsonObject{{"id", "42"}, {"displayName", "Lucas"}});
        QVERIFY(store->checkTokenExpiration());
        QVERIFY(store->isAuthenticated());

        QSignalSpy expiredSpy(store, &SessionStore::sessionExpired);
        store->setSession(expiredJwt, QJsonObject{{"id", "42"}, {"displayName", "Lucas"}});
        QVERIFY(!store->checkTokenExpiration());
        QCOMPARE(expiredSpy.count(), 1);
        QVERIFY(!store->isAuthenticated());

        store->setSession(expiredJwt, QJsonObject{{"id", "42"}, {"displayName", "Lucas"}});
        store->reload();
        QVERIFY(!store->isAuthenticated());
    }
};

QTEST_MAIN(TestSessionAndTheme)
#include "test_session_and_theme.moc"
