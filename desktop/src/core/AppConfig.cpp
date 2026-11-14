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
    , m_supabaseUrl(loadSupabaseUrl(m_settings))
    , m_supabaseAnonKey(loadSupabaseAnonKey(m_settings))
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

QString AppConfig::supabaseUrl() const
{
    return m_supabaseUrl;
}

void AppConfig::setSupabaseUrl(const QString &url)
{
    const QString normalized = normalizeSupabaseUrl(url);
    if (m_supabaseUrl == normalized) {
        return;
    }
    m_supabaseUrl = normalized;
    QSettings settings("SkyRipple", "SkyRippleDesktop");
    settings.setValue("oauth/supabaseUrl", m_supabaseUrl);
    settings.sync();
    emit supabaseUrlChanged();
}

QString AppConfig::supabaseAnonKey() const
{
    return m_supabaseAnonKey;
}

void AppConfig::setSupabaseAnonKey(const QString &key)
{
    const QString trimmed = key.trimmed();
    if (m_supabaseAnonKey == trimmed) {
        return;
    }
    m_supabaseAnonKey = trimmed;
    QSettings settings("SkyRipple", "SkyRippleDesktop");
    settings.setValue("oauth/supabaseAnonKey", m_supabaseAnonKey);
    settings.sync();
    emit supabaseAnonKeyChanged();
}

void AppConfig::reload()
{
    QSettings fresh("SkyRipple", "SkyRippleDesktop");
    const QString loadedApi = normalizeUrl(fresh.value("network/apiBaseUrl", "https://webchat-9vqr.onrender.com/api").toString());
    if (m_apiBaseUrl != loadedApi) {
        m_apiBaseUrl = loadedApi;
        emit apiBaseUrlChanged();
    }

    const QString loadedSupaUrl = loadSupabaseUrl(fresh);
    if (m_supabaseUrl != loadedSupaUrl) {
        m_supabaseUrl = loadedSupaUrl;
        emit supabaseUrlChanged();
    }

    const QString loadedSupaKey = loadSupabaseAnonKey(fresh);
    if (m_supabaseAnonKey != loadedSupaKey) {
        m_supabaseAnonKey = loadedSupaKey;
        emit supabaseAnonKeyChanged();
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

QString AppConfig::normalizeSupabaseUrl(const QString &url) const
{
    QString trimmed = url.trimmed();
    while (trimmed.endsWith('/')) {
        trimmed.chop(1);
    }
    return trimmed;
}

QString AppConfig::loadSupabaseUrl(const QSettings &settings) const
{
    const QString stored = normalizeSupabaseUrl(settings.value("oauth/supabaseUrl").toString());
    if (!stored.isEmpty()) {
        return stored;
    }
    return normalizeSupabaseUrl(qEnvironmentVariable("SUPABASE_URL"));
}

QString AppConfig::loadSupabaseAnonKey(const QSettings &settings) const
{
    const QString stored = settings.value("oauth/supabaseAnonKey").toString().trimmed();
    if (!stored.isEmpty()) {
        return stored;
    }
    return qEnvironmentVariable("SUPABASE_ANON_KEY").trimmed();
}
