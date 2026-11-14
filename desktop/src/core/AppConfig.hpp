#pragma once

#include <QObject>
#include <QSettings>
#include <QString>
#include <QQmlEngine>
#include <QJSEngine>

class AppConfig : public QObject
{
    Q_OBJECT
    QML_ELEMENT
    QML_SINGLETON
    Q_PROPERTY(QString apiBaseUrl READ apiBaseUrl WRITE setApiBaseUrl NOTIFY apiBaseUrlChanged)

public:
    static AppConfig *instance();
    static AppConfig *create(QQmlEngine *qmlEngine, QJSEngine *jsEngine);

    QString apiBaseUrl() const;
    Q_INVOKABLE void setApiBaseUrl(const QString &url);
    Q_INVOKABLE void resetApiBaseUrl();

signals:
    void apiBaseUrlChanged();

private:
    explicit AppConfig(QObject *parent = nullptr);
    QString normalizeUrl(const QString &url) const;

    QSettings m_settings;
    QString m_apiBaseUrl;
};
