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
    , m_apiBaseUrl(normalizeUrl(m_settings.value("network/apiBaseUrl", "http://localhost:3001/api").toString()))
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
    m_settings.setValue("network/apiBaseUrl", m_apiBaseUrl);
    emit apiBaseUrlChanged();
}

void AppConfig::resetApiBaseUrl()
{
    setApiBaseUrl("http://localhost:3001/api");
}

QString AppConfig::normalizeUrl(const QString &url) const
{
    QString trimmed = url.trimmed();
    while (trimmed.endsWith('/')) {
        trimmed.chop(1);
    }
    if (trimmed.isEmpty()) {
        return "http://localhost:3001/api";
    }
    return trimmed;
}
