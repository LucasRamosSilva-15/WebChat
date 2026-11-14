#pragma once

#include <QObject>
#include <QTcpServer>
#include <QTcpSocket>
#include <QTimer>
#include <QByteArray>
#include <QString>

class OAuthLoopbackServer : public QObject
{
    Q_OBJECT

public:
    explicit OAuthLoopbackServer(QObject *parent = nullptr);
    ~OAuthLoopbackServer() override;

    QString startListening();
    void stopListening();
    bool isListening() const;
    quint16 port() const;

signals:
    void tokenReceived(const QString &accessToken);
    void authError(const QString &message);

private slots:
    void onNewConnection();
    void onTimeout();

private:
    void processSocketBuffer(QTcpSocket *socket, QByteArray &buffer);
    void sendHttpResponse(QTcpSocket *socket,
                          int statusCode,
                          const QByteArray &contentType,
                          const QByteArray &body);
    QByteArray callbackHtml() const;

    QTcpServer m_server;
    QTimer m_timeoutTimer;
};
