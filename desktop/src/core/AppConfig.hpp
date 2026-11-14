#pragma once

#include <QObject>
#include <QSettings>
#include <QString>
#include <QMap>
#include <QQmlEngine>
#include <QJSEngine>

class AppConfig : public QObject
{
    Q_OBJECT
    QML_ELEMENT
    QML_SINGLETON
    Q_PROPERTY(QString apiBaseUrl READ apiBaseUrl WRITE setApiBaseUrl NOTIFY apiBaseUrlChanged)
    Q_PROPERTY(QString frontendBaseUrl READ frontendBaseUrl WRITE setFrontendBaseUrl NOTIFY frontendBaseUrlChanged)
    Q_PROPERTY(QString supabaseUrl READ supabaseUrl WRITE setSupabaseUrl NOTIFY supabaseUrlChanged)
    Q_PROPERTY(QString supabaseAnonKey READ supabaseAnonKey WRITE setSupabaseAnonKey NOTIFY supabaseAnonKeyChanged)

public:
    static AppConfig *instance();
    static AppConfig *create(QQmlEngine *qmlEngine, QJSEngine *jsEngine);

    QString apiBaseUrl() const;
    Q_INVOKABLE void setApiBaseUrl(const QString &url);
    Q_INVOKABLE void resetApiBaseUrl();

    QString frontendBaseUrl() const;
    Q_INVOKABLE void setFrontendBaseUrl(const QString &url);

    QString supabaseUrl() const;
    Q_INVOKABLE void setSupabaseUrl(const QString &url);

    QString supabaseAnonKey() const;
    Q_INVOKABLE void setSupabaseAnonKey(const QString &key);

    void reload();

signals:
    void apiBaseUrlChanged();
    void frontendBaseUrlChanged();
    void supabaseUrlChanged();
    void supabaseAnonKeyChanged();

private:
    explicit AppConfig(QObject *parent = nullptr);
    QString normalizeUrl(const QString &url) const;
    QString normalizeFrontendUrl(const QString &url) const;
    QString normalizeSupabaseUrl(const QString &url) const;
    QString loadFrontendBaseUrl(const QSettings &settings, const QMap<QString, QString> &envVars) const;
    QString loadSupabaseUrl(const QSettings &settings, const QMap<QString, QString> &envVars) const;
    QString loadSupabaseAnonKey(const QSettings &settings, const QMap<QString, QString> &envVars) const;
    QMap<QString, QString> loadDotEnvFiles() const;
    QString stripQuotes(const QString &value) const;

    QSettings m_settings;
    QString m_apiBaseUrl;
    QString m_frontendBaseUrl;
    QString m_supabaseUrl;
    QString m_supabaseAnonKey;
};
