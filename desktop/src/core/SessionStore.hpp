#pragma once

#include <QObject>
#include <QSettings>
#include <QString>
#include <QJsonObject>
#include <QQmlEngine>
#include <QJSEngine>

class SessionStore : public QObject
{
    Q_OBJECT
    QML_ELEMENT
    QML_SINGLETON
    Q_PROPERTY(bool isAuthenticated READ isAuthenticated NOTIFY sessionChanged)
    Q_PROPERTY(QString token READ token NOTIFY sessionChanged)
    Q_PROPERTY(QString userId READ userId NOTIFY sessionChanged)
    Q_PROPERTY(QString displayName READ displayName NOTIFY sessionChanged)
    Q_PROPERTY(QString email READ email NOTIFY sessionChanged)
    Q_PROPERTY(QString profilePhoto READ profilePhoto NOTIFY sessionChanged)
    Q_PROPERTY(QString profileDesc READ profileDesc NOTIFY sessionChanged)
    Q_PROPERTY(QString role READ role NOTIFY sessionChanged)
    Q_PROPERTY(QString status READ status NOTIFY sessionChanged)

public:
    static SessionStore *instance();
    static SessionStore *create(QQmlEngine *qmlEngine, QJSEngine *jsEngine);

    bool isAuthenticated() const;
    QString token() const;
    QString userId() const;
    QString displayName() const;
    QString email() const;
    QString profilePhoto() const;
    QString profileDesc() const;
    QString role() const;
    QString status() const;

    void setSession(const QString &token, const QJsonObject &user);
    void updateUser(const QJsonObject &user);
    Q_INVOKABLE void clearSession();
    Q_INVOKABLE bool checkTokenExpiration();
    static bool isJwtExpired(const QString &token, qint64 skewSeconds = 0);
    void reload();

signals:
    void sessionChanged();
    void sessionExpired();

private:
    explicit SessionStore(QObject *parent = nullptr);
    void applyUserFields(const QJsonObject &user);
    void persist();

    QSettings m_settings;
    QString m_token;
    QString m_userId;
    QString m_displayName;
    QString m_email;
    QString m_profilePhoto;
    QString m_profileDesc;
    QString m_role;
    QString m_status;
};
