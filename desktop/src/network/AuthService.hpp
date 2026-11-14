#pragma once

#include <QObject>
#include <QString>
#include <QQmlEngine>
#include <QJSEngine>

class AuthService : public QObject
{
    Q_OBJECT
    QML_ELEMENT
    QML_SINGLETON
    Q_PROPERTY(bool busy READ busy NOTIFY busyChanged)
    Q_PROPERTY(QString errorMessage READ errorMessage NOTIFY errorMessageChanged)

public:
    static AuthService *instance();
    static AuthService *create(QQmlEngine *qmlEngine, QJSEngine *jsEngine);

    bool busy() const;
    QString errorMessage() const;

    Q_INVOKABLE void login(const QString &email, const QString &password);
    Q_INVOKABLE void registerAccount(const QString &displayName, const QString &email, const QString &password);
    Q_INVOKABLE void fetchMe();
    Q_INVOKABLE void logout();
    Q_INVOKABLE void clearError();

signals:
    void busyChanged();
    void errorMessageChanged();
    void loginSucceeded();
    void registerSucceeded();
    void authFailed(const QString &message);

private:
    explicit AuthService(QObject *parent = nullptr);
    void setBusy(bool value);
    void setErrorMessage(const QString &message);

    bool m_busy;
    QString m_errorMessage;
};
