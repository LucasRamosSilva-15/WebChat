#include "AppConfig.hpp"

#include <QCoreApplication>
#include <QDir>
#include <QFile>
#include <QFileInfo>
#include <QTextStream>

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
    const QMap<QString, QString> dotEnv = loadDotEnvFiles();
    m_supabaseUrl = loadSupabaseUrl(m_settings, dotEnv);
    m_supabaseAnonKey = loadSupabaseAnonKey(m_settings, dotEnv);
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
    const QString trimmed = stripQuotes(key);
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

    const QMap<QString, QString> dotEnv = loadDotEnvFiles();
    const QString loadedSupaUrl = loadSupabaseUrl(fresh, dotEnv);
    if (m_supabaseUrl != loadedSupaUrl) {
        m_supabaseUrl = loadedSupaUrl;
        emit supabaseUrlChanged();
    }

    const QString loadedSupaKey = loadSupabaseAnonKey(fresh, dotEnv);
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
    QString trimmed = stripQuotes(url);
    while (trimmed.endsWith('/')) {
        trimmed.chop(1);
    }
    return trimmed;
}

QString AppConfig::stripQuotes(const QString &value) const
{
    QString s = value.trimmed();
    if (s.size() >= 2) {
        const QChar first = s.front();
        const QChar last = s.back();
        if ((first == '"' && last == '"') || (first == '\'' && last == '\'')) {
            s = s.mid(1, s.size() - 2).trimmed();
        }
    }
    return s;
}

QMap<QString, QString> AppConfig::loadDotEnvFiles() const
{
    QMap<QString, QString> vars;
    QStringList baseDirs;
    baseDirs << QDir::currentPath();
    if (QCoreApplication::instance()) {
        const QString appDir = QCoreApplication::applicationDirPath();
        if (!appDir.isEmpty() && !baseDirs.contains(appDir)) {
            baseDirs << appDir;
        }
    }

    const QStringList relativePaths{
        ".env",
        "../.env",
        "../frontend/.env",
        "../../frontend/.env",
        "../mobile/.env",
        "../../mobile/.env"
    };

    for (const QString &base : baseDirs) {
        const QDir baseDir(base);
        for (const QString &rel : relativePaths) {
            const QString filePath = QFileInfo(baseDir.filePath(rel)).canonicalFilePath();
            if (filePath.isEmpty()) {
                continue;
            }
            QFile file(filePath);
            if (!file.open(QIODevice::ReadOnly | QIODevice::Text)) {
                continue;
            }
            QTextStream in(&file);
            while (!in.atEnd()) {
                const QString line = in.readLine().trimmed();
                if (line.isEmpty() || line.startsWith('#')) {
                    continue;
                }
                const int eqIdx = line.indexOf('=');
                if (eqIdx <= 0) {
                    continue;
                }
                const QString key = line.left(eqIdx).trimmed();
                const QString val = stripQuotes(line.mid(eqIdx + 1));
                if (!key.isEmpty() && !val.isEmpty() && !vars.contains(key)) {
                    vars.insert(key, val);
                }
            }
        }
    }
    return vars;
}

QString AppConfig::loadSupabaseUrl(const QSettings &settings, const QMap<QString, QString> &envVars) const
{
    const QString stored = normalizeSupabaseUrl(settings.value("oauth/supabaseUrl").toString());
    if (!stored.isEmpty()) {
        return stored;
    }
    const QString envPrimary = normalizeSupabaseUrl(qEnvironmentVariable("SUPABASE_URL"));
    if (!envPrimary.isEmpty()) {
        return envPrimary;
    }
    const QString envVite = normalizeSupabaseUrl(qEnvironmentVariable("VITE_SUPABASE_URL"));
    if (!envVite.isEmpty()) {
        return envVite;
    }
    const QString filePrimary = normalizeSupabaseUrl(envVars.value("SUPABASE_URL"));
    if (!filePrimary.isEmpty()) {
        return filePrimary;
    }
    return normalizeSupabaseUrl(envVars.value("VITE_SUPABASE_URL"));
}

QString AppConfig::loadSupabaseAnonKey(const QSettings &settings, const QMap<QString, QString> &envVars) const
{
    const QString stored = stripQuotes(settings.value("oauth/supabaseAnonKey").toString());
    if (!stored.isEmpty()) {
        return stored;
    }
    const QString envPrimary = stripQuotes(qEnvironmentVariable("SUPABASE_ANON_KEY"));
    if (!envPrimary.isEmpty()) {
        return envPrimary;
    }
    const QString envVite = stripQuotes(qEnvironmentVariable("VITE_SUPABASE_ANON_KEY"));
    if (!envVite.isEmpty()) {
        return envVite;
    }
    const QString filePrimary = stripQuotes(envVars.value("SUPABASE_ANON_KEY"));
    if (!filePrimary.isEmpty()) {
        return filePrimary;
    }
    return stripQuotes(envVars.value("VITE_SUPABASE_ANON_KEY"));
}
