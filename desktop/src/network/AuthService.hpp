#pragma once

#include <QObject>
#include <QString>
#include <QUrl>
#include <QJsonObject>
#include <QNetworkAccessManager>
#include <QTimer>
#include <QQmlEngine>
#include <QJSEngine>

#include "OAuthLoopbackServer.hpp"

class AuthService : public QObject
{
    Q_OBJECT
    QML_ELEMENT
    QML_SINGLETON
    Q_PROPERTY(bool busy READ busy NOTIFY busyChanged)
    Q_PROPERTY(bool waitingForGoogle READ waitingForGoogle NOTIFY waitingForGoogleChanged)
    Q_PROPERTY(QString errorMessage READ errorMessage NOTIFY errorMessageChanged)

public:
    static AuthService *instance();
    static AuthService *create(QQmlEngine *qmlEngine, QJSEngine *jsEngine);

    bool busy() const;
    bool waitingForGoogle() const;
    QString errorMessage() const;

    Q_INVOKABLE void login(const QString &email, const QString &password);
    Q_INVOKABLE void registerAccount(const QString &displayName, const QString &email, const QString &password);
    Q_INVOKABLE void loginWithGoogle();
    Q_INVOKABLE void cancelGoogleLogin();
    Q_INVOKABLE void fetchMe();
    Q_INVOKABLE void validateSession();
    Q_INVOKABLE void logout();
    Q_INVOKABLE void clearError();

    QUrl buildGoogleAuthorizeUrl(quint16 desktopPort) const;
    quint16 activeGoogleLoopbackPort() const;
    void completeGoogleLoginWithToken(const QString &accessToken);

signals:
    void busyChanged();
    void waitingForGoogleChanged();
    void errorMessageChanged();
    void loginSucceeded();
    void registerSucceeded();
    void authFailed(const QString &message);
    void requestWindowFocus();

private:
    explicit AuthService(QObject *parent = nullptr);
    void setBusy(bool value);
    void setWaitingForGoogle(bool value);
    void setErrorMessage(const QString &message);
    void handleLoopbackSession(const QString &token, const QJsonObject &user);
    void syncOAuthUserToBackend(const QString &email,
                                const QString &displayName,
                                const QString &profilePhoto);

    bool m_busy = false;
    bool m_waitingForGoogle = false;
    QString m_errorMessage;
    OAuthLoopbackServer m_loopbackServer;
    QNetworkAccessManager m_oauthNetwork;
    QTimer m_sessionCheckTimer;
};
