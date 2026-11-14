#include "AuthService.hpp"
#include "ApiClient.hpp"
#include "SessionStore.hpp"
#include <QJsonObject>

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
    , m_busy(false)
{
}

bool AuthService::busy() const
{
    return m_busy;
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
        setErrorMessage("Informe e-mail e senha para entrar.");
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

void AuthService::logout()
{
    setBusy(false);
    setErrorMessage(QString());
    SessionStore::instance()->clearSession();
}
