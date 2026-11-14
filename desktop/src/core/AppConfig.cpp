#include "AppConfig.hpp"

AppConfig *AppConfig::instance()
{
    static AppConfig singleton;
    return &singleton;
}

AppConfig *AppConfig::create(QQmlEngine *qmlEngine, QJSEngine *jsEngine)
{
    Q_UNUSED(qmlEngine)
    Q_UNUSED(jsEngine)
    AppConfig *inst = instance();
    QJSEngine::setObjectOwnership(inst, QJSEngine::CppOwnership);
    return inst;
}

AppConfig::AppConfig(QObject *parent)
    : QObject(parent)
    , m_settings("SkyRipple", "SkyRippleDesktop")
    , m_apiBaseUrl(normalizeUrl(m_settings.value("network/apiBaseUrl", "https://webchat-9vqr.onrender.com/api").toString()))
{
}

QString AppConfig::apiBaseUrl() const
{
    return m_apiBaseUrl;
}

void AppConfig::setApiBaseUrl(const QString &url)
{
    const QString normalized = normalizeUrl(url);
    if (normalized.isEmpty() || m_apiBaseUrl == normalized) {
        return;
    }
    m_apiBaseUrl = normalized;
    QSettings settings("SkyRipple", "SkyRippleDesktop");
    settings.setValue("network/apiBaseUrl", m_apiBaseUrl);
    settings.sync();
    emit apiBaseUrlChanged();
}

void AppConfig::resetApiBaseUrl()
{
    setApiBaseUrl("https://webchat-9vqr.onrender.com/api");
}

void AppConfig::reload()
{
    QSettings fresh("SkyRipple", "SkyRippleDesktop");
    const QString loaded = normalizeUrl(fresh.value("network/apiBaseUrl", "https://webchat-9vqr.onrender.com/api").toString());
    if (m_apiBaseUrl != loaded) {
        m_apiBaseUrl = loaded;
        emit apiBaseUrlChanged();
    }
}

QString AppConfig::normalizeUrl(const QString &url) const
{
    QString trimmed = url.trimmed();
    while (trimmed.endsWith('/')) {
        trimmed.chop(1);
    }
    if (trimmed.isEmpty()) {
        return "https://webchat-9vqr.onrender.com/api";
    }
    return trimmed;
}
