#include "SessionStore.hpp"

SessionStore *SessionStore::instance()
{
    static SessionStore singleton;
    return &singleton;
}

SessionStore *SessionStore::create(QQmlEngine *qmlEngine, QJSEngine *jsEngine)
{
    Q_UNUSED(qmlEngine)
    Q_UNUSED(jsEngine)
    SessionStore *inst = instance();
    QJSEngine::setObjectOwnership(inst, QJSEngine::CppOwnership);
    return inst;
}

SessionStore::SessionStore(QObject *parent)
    : QObject(parent)
    , m_settings("SkyRipple", "SkyRippleDesktop")
    , m_token(m_settings.value("session/token").toString())
    , m_userId(m_settings.value("session/userId").toString())
    , m_displayName(m_settings.value("session/displayName").toString())
    , m_email(m_settings.value("session/email").toString())
    , m_profilePhoto(m_settings.value("session/profilePhoto").toString())
    , m_profileDesc(m_settings.value("session/profileDesc").toString())
    , m_role(m_settings.value("session/role").toString())
    , m_status(m_settings.value("session/status").toString())
{
}

bool SessionStore::isAuthenticated() const
{
    return !m_token.isEmpty();
}

QString SessionStore::token() const
{
    return m_token;
}

QString SessionStore::userId() const
{
    return m_userId;
}

QString SessionStore::displayName() const
{
    return m_displayName;
}

QString SessionStore::email() const
{
    return m_email;
}

QString SessionStore::profilePhoto() const
{
    return m_profilePhoto;
}

QString SessionStore::profileDesc() const
{
    return m_profileDesc;
}

QString SessionStore::role() const
{
    return m_role;
}

QString SessionStore::status() const
{
    return m_status;
}

void SessionStore::setSession(const QString &token, const QJsonObject &user)
{
    m_token = token;
    applyUserFields(user);
    persist();
    emit sessionChanged();
}

void SessionStore::updateUser(const QJsonObject &user)
{
    applyUserFields(user);
    persist();
    emit sessionChanged();
}

void SessionStore::clearSession()
{
    const bool hadSession = !m_token.isEmpty() || !m_userId.isEmpty();
    m_token.clear();
    m_userId.clear();
    m_displayName.clear();
    m_email.clear();
    m_profilePhoto.clear();
    m_profileDesc.clear();
    m_role.clear();
    m_status.clear();
    QSettings fresh("SkyRipple", "SkyRippleDesktop");
    fresh.remove("session");
    fresh.sync();
    if (hadSession) {
        emit sessionChanged();
    }
}

void SessionStore::reload()
{
    QSettings fresh("SkyRipple", "SkyRippleDesktop");
    m_token = fresh.value("session/token").toString();
    m_userId = fresh.value("session/userId").toString();
    m_displayName = fresh.value("session/displayName").toString();
    m_email = fresh.value("session/email").toString();
    m_profilePhoto = fresh.value("session/profilePhoto").toString();
    m_profileDesc = fresh.value("session/profileDesc").toString();
    m_role = fresh.value("session/role").toString();
    m_status = fresh.value("session/status").toString();
    emit sessionChanged();
}

void SessionStore::applyUserFields(const QJsonObject &user)
{
    if (user.contains("id")) {
        m_userId = user.value("id").toString();
    }
    const QString nameVal = user.value("displayName").toString();
    if (!nameVal.isEmpty()) {
        m_displayName = nameVal;
    } else if (user.contains("name")) {
        m_displayName = user.value("name").toString();
    }
    if (user.contains("email")) {
        m_email = user.value("email").toString();
    }
    if (user.contains("profilePhoto")) {
        m_profilePhoto = user.value("profilePhoto").toString();
    } else if (user.contains("avatar_url")) {
        m_profilePhoto = user.value("avatar_url").toString();
    }
    if (user.contains("profileDesc")) {
        m_profileDesc = user.value("profileDesc").toString();
    }
    if (user.contains("role")) {
        m_role = user.value("role").toString();
    }
    if (user.contains("status")) {
        m_status = user.value("status").toString();
    }
}

void SessionStore::persist()
{
    QSettings settings("SkyRipple", "SkyRippleDesktop");
    settings.setValue("session/token", m_token);
    settings.setValue("session/userId", m_userId);
    settings.setValue("session/displayName", m_displayName);
    settings.setValue("session/email", m_email);
    settings.setValue("session/profilePhoto", m_profilePhoto);
    settings.setValue("session/profileDesc", m_profileDesc);
    settings.setValue("session/role", m_role);
    settings.setValue("session/status", m_status);
    settings.sync();
}
