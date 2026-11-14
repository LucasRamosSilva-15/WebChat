#include "AuthService.hpp"
#include "ApiClient.hpp"
#include "AppConfig.hpp"
#include "SessionStore.hpp"

#include <QDesktopServices>
#include <QJsonDocument>
#include <QJsonObject>
#include <QNetworkReply>
#include <QNetworkRequest>
#include <QUrl>
#include <QUrlQuery>

AuthService *AuthService::instance()
{
    static AuthService singleton;
    return &singleton;
}

AuthService *AuthService::create(QQmlEngine *qmlEngine, QJSEngine *jsEngine)
{
    Q_UNUSED(qmlEngine)
    Q_UNUSED(jsEngine)
    AuthService *inst = instance();
    QJSEngine::setObjectOwnership(inst, QJSEngine::CppOwnership);
    return inst;
}

AuthService::AuthService(QObject *parent)
    : QObject(parent)
{
    m_oauthNetwork.setTransferTimeout(15000);

    connect(&m_loopbackServer, &OAuthLoopbackServer::sessionPayloadReceived,
            this, &AuthService::handleLoopbackSession);

    connect(&m_loopbackServer, &OAuthLoopbackServer::tokenReceived,
            this, &AuthService::completeGoogleLoginWithToken);

    connect(&m_loopbackServer, &OAuthLoopbackServer::authError,
            this, [this](const QString &message) {
        setWaitingForGoogle(false);
        setBusy(false);
        setErrorMessage(message);
        emit authFailed(message);
    });

    m_sessionCheckTimer.setInterval(300000);
    connect(&m_sessionCheckTimer, &QTimer::timeout, this, []() {
        if (SessionStore::instance()->isAuthenticated()) {
            SessionStore::instance()->checkTokenExpiration();
        }
    });
    m_sessionCheckTimer.start();

    connect(ApiClient::instance(), &ApiClient::sessionExpired, this, [this]() {
        m_loopbackServer.stopListening();
        setWaitingForGoogle(false);
        setBusy(false);
    });

    connect(SessionStore::instance(), &SessionStore::sessionExpired, this, [this]() {
        m_loopbackServer.stopListening();
        setWaitingForGoogle(false);
        setBusy(false);
    });
}

bool AuthService::busy() const
{
    return m_busy;
}

bool AuthService::waitingForGoogle() const
{
    return m_waitingForGoogle;
}

QString AuthService::errorMessage() const
{
    return m_errorMessage;
}

void AuthService::setBusy(bool value)
{
    if (m_busy == value) {
        return;
    }
    m_busy = value;
    emit busyChanged();
}

void AuthService::setWaitingForGoogle(bool value)
{
    if (m_waitingForGoogle == value) {
        return;
    }
    m_waitingForGoogle = value;
    emit waitingForGoogleChanged();
}

void AuthService::setErrorMessage(const QString &message)
{
    if (m_errorMessage == message) {
        return;
    }
    m_errorMessage = message;
    emit errorMessageChanged();
}

void AuthService::clearError()
{
    setErrorMessage(QString());
}

void AuthService::login(const QString &email, const QString &password)
{
    if (m_busy) {
        return;
    }

    const QString cleanEmail = email.trimmed();
    if (cleanEmail.isEmpty() || password.isEmpty()) {
        setErrorMessage("Preencha e-mail e senha.");
        emit authFailed(m_errorMessage);
        return;
    }

    setBusy(true);
    setErrorMessage(QString());

    QJsonObject body;
    body.insert("email", cleanEmail);
    body.insert("password", password);

    ApiClient::instance()->post(
        "/auth/login",
        body,
        [this](const QJsonDocument &doc, int) {
            setBusy(false);
            const QJsonObject obj = doc.object();
            const QString token = obj.value("token").toString();
            const QJsonObject user = obj.value("user").toObject();
            if (token.isEmpty()) {
                setErrorMessage("Token de autenticação não recebido.");
                emit authFailed(m_errorMessage);
                return;
            }
            SessionStore::instance()->setSession(token, user);
            emit loginSucceeded();
        },
        [this](const QString &error, int) {
            setBusy(false);
            setErrorMessage(error);
            emit authFailed(error);
        }
    );
}

void AuthService::registerAccount(const QString &displayName, const QString &email, const QString &password)
{
    if (m_busy) {
        return;
    }

    const QString cleanName = displayName.trimmed();
    const QString cleanEmail = email.trimmed();
    if (cleanName.isEmpty() || cleanEmail.isEmpty() || password.isEmpty()) {
        setErrorMessage("Preencha nome, e-mail e senha.");
        emit authFailed(m_errorMessage);
        return;
    }

    setBusy(true);
    setErrorMessage(QString());

    QJsonObject body;
    body.insert("displayName", cleanName);
    body.insert("name", cleanName);
    body.insert("email", cleanEmail);
    body.insert("password", password);

    ApiClient::instance()->post(
        "/auth/register",
        body,
        [this](const QJsonDocument &doc, int) {
            setBusy(false);
            const QJsonObject obj = doc.object();
            const QString token = obj.value("token").toString();
            const QJsonObject user = obj.value("user").toObject();
            if (token.isEmpty()) {
                setErrorMessage("Token de autenticação não recebido.");
                emit authFailed(m_errorMessage);
                return;
            }
            SessionStore::instance()->setSession(token, user);
            emit registerSucceeded();
        },
        [this](const QString &error, int) {
            setBusy(false);
            setErrorMessage(error);
            emit authFailed(error);
        }
    );
}

QUrl AuthService::buildGoogleAuthorizeUrl(quint16 desktopPort) const
{
    const QString supabaseUrl = AppConfig::instance()->supabaseUrl();
    const QString frontendBaseUrl = AppConfig::instance()->frontendBaseUrl();
    const QString redirectTo = QString("%1/auth/callback?source=desktop&desktop_port=%2")
        .arg(frontendBaseUrl)
        .arg(desktopPort);

    QUrl authUrl(supabaseUrl + "/auth/v1/authorize");
    QUrlQuery query;
    query.addQueryItem("provider", "google");
    query.addQueryItem("redirect_to", redirectTo);
    authUrl.setQuery(query);
    return authUrl;
}

quint16 AuthService::activeGoogleLoopbackPort() const
{
    return m_loopbackServer.port();
}

void AuthService::loginWithGoogle()
{
    if (m_busy || m_waitingForGoogle) {
        return;
    }

    const QString supabaseUrl = AppConfig::instance()->supabaseUrl();
    if (supabaseUrl.isEmpty()) {
        setErrorMessage("Configuração do Supabase ausente.");
        emit authFailed(m_errorMessage);
        return;
    }

    const QString callbackUrl = m_loopbackServer.startListening();
    if (callbackUrl.isEmpty() || m_loopbackServer.port() == 0) {
        setErrorMessage("Não foi possível iniciar o servidor local de autenticação.");
        emit authFailed(m_errorMessage);
        return;
    }

    setErrorMessage(QString());
    setWaitingForGoogle(true);

    if (qEnvironmentVariableIsSet("SKYRIPPLE_SKIP_OPEN_URL")) {
        return;
    }

    const QUrl authUrl = buildGoogleAuthorizeUrl(m_loopbackServer.port());
    if (!QDesktopServices::openUrl(authUrl)) {
        m_loopbackServer.stopListening();
        setWaitingForGoogle(false);
        setErrorMessage("Não foi possível abrir o navegador do sistema.");
        emit authFailed(m_errorMessage);
    }
}

void AuthService::cancelGoogleLogin()
{
    m_loopbackServer.stopListening();
    setWaitingForGoogle(false);
    setBusy(false);
}

void AuthService::handleLoopbackSession(const QString &token, const QJsonObject &user)
{
    setWaitingForGoogle(false);
    setBusy(false);

    if (token.trimmed().isEmpty()) {
        setErrorMessage("Token de autenticação não recebido.");
        emit authFailed(m_errorMessage);
        return;
    }

    SessionStore::instance()->setSession(token, user);
    const bool userIncomplete = user.value("email").toString().isEmpty()
        || (user.value("displayName").toString().isEmpty() && user.value("name").toString().isEmpty());
    if (userIncomplete) {
        fetchMe();
    }

    emit loginSucceeded();
    emit requestWindowFocus();
}

void AuthService::completeGoogleLoginWithToken(const QString &accessToken)
{
    setWaitingForGoogle(false);

    const QString cleanToken = accessToken.trimmed();
    if (cleanToken.isEmpty()) {
        setBusy(false);
        setErrorMessage("Token de acesso do Google inválido.");
        emit authFailed(m_errorMessage);
        return;
    }

    const QString supabaseUrl = AppConfig::instance()->supabaseUrl();
    const QString supabaseAnonKey = AppConfig::instance()->supabaseAnonKey();
    if (supabaseUrl.isEmpty() || supabaseAnonKey.isEmpty()) {
        setBusy(false);
        setErrorMessage("Configuração do Supabase ausente.");
        emit authFailed(m_errorMessage);
        return;
    }

    setBusy(true);
    setErrorMessage(QString());

    QNetworkRequest request(QUrl(supabaseUrl + "/auth/v1/user"));
    request.setHeader(QNetworkRequest::ContentTypeHeader, "application/json");
    request.setRawHeader("Accept", "application/json");
    request.setRawHeader("apikey", supabaseAnonKey.toUtf8());
    request.setRawHeader("Authorization", QString("Bearer %1").arg(cleanToken).toUtf8());

    QNetworkReply *reply = m_oauthNetwork.get(request);
    connect(reply, &QNetworkReply::finished, this, [this, reply]() {
        const QByteArray raw = reply->readAll();
        const int statusCode = reply->attribute(QNetworkRequest::HttpStatusCodeAttribute).toInt();
        const QNetworkReply::NetworkError netErr = reply->error();
        const QString errStr = reply->errorString();
        reply->deleteLater();

        if (netErr != QNetworkReply::NoError || statusCode < 200 || statusCode >= 300) {
            setBusy(false);
            const QJsonObject errObj = QJsonDocument::fromJson(raw).object();
            QString msg = errObj.value("error_description").toString();
            if (msg.isEmpty()) {
                msg = errObj.value("msg").toString();
            }
            if (msg.isEmpty()) {
                msg = errObj.value("error").toString();
            }
            if (msg.isEmpty()) {
                msg = statusCode == 0 ? errStr : QString("Falha ao validar conta Google (%1).").arg(statusCode);
            }
            setErrorMessage(msg);
            emit authFailed(msg);
            return;
        }

        const QJsonObject userObj = QJsonDocument::fromJson(raw).object();
        const QString email = userObj.value("email").toString().trimmed();
        if (email.isEmpty()) {
            setBusy(false);
            setErrorMessage("E-mail da conta Google não retornado pelo Supabase.");
            emit authFailed(m_errorMessage);
            return;
        }

        const QJsonObject meta = userObj.value("user_metadata").toObject();
        QString displayName = meta.value("full_name").toString().trimmed();
        if (displayName.isEmpty()) {
            displayName = meta.value("name").toString().trimmed();
        }
        if (displayName.isEmpty()) {
            displayName = email.section('@', 0, 0);
        }

        QString profilePhoto = meta.value("avatar_url").toString().trimmed();
        if (profilePhoto.isEmpty()) {
            profilePhoto = meta.value("picture").toString().trimmed();
        }

        syncOAuthUserToBackend(email, displayName, profilePhoto);
    });
}

void AuthService::syncOAuthUserToBackend(const QString &email,
                                         const QString &displayName,
                                         const QString &profilePhoto)
{
    QJsonObject body;
    body.insert("email", email);
    body.insert("name", displayName);
    if (!profilePhoto.isEmpty()) {
        body.insert("avatar_url", profilePhoto);
    }

    ApiClient::instance()->post(
        "/auth/oauth-sync",
        body,
        [this](const QJsonDocument &doc, int) {
            setBusy(false);
            const QJsonObject obj = doc.object();
            const QString token = obj.value("token").toString();
            const QJsonObject user = obj.value("user").toObject();
            if (token.isEmpty()) {
                setErrorMessage("Token de autenticação não recebido.");
                emit authFailed(m_errorMessage);
                return;
            }
            SessionStore::instance()->setSession(token, user);
            emit loginSucceeded();
            emit requestWindowFocus();
        },
        [this](const QString &error, int) {
            setBusy(false);
            setErrorMessage(error);
            emit authFailed(error);
        }
    );
}

void AuthService::fetchMe()
{
    if (!SessionStore::instance()->isAuthenticated()) {
        return;
    }

    ApiClient::instance()->get(
        "/auth/me",
        QUrlQuery(),
        [](const QJsonDocument &doc, int) {
            if (doc.isObject()) {
                SessionStore::instance()->updateUser(doc.object());
            }
        },
        [this](const QString &error, int statusCode) {
            if (statusCode == 401) {
                setErrorMessage("Sua sessão expirou. Faça login novamente.");
            } else if (statusCode != 0) {
                setErrorMessage(error);
            }
        }
    );
}

void AuthService::validateSession()
{
    if (!SessionStore::instance()->checkTokenExpiration()) {
        return;
    }
    fetchMe();
}

void AuthService::logout()
{
    m_loopbackServer.stopListening();
    setWaitingForGoogle(false);
    setBusy(false);
    setErrorMessage(QString());
    SessionStore::instance()->clearSession();
}
