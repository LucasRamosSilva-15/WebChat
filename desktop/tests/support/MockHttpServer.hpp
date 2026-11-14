#pragma once

#include <QObject>
#include <QTcpServer>
#include <QTcpSocket>
#include <QJsonDocument>
#include <QJsonObject>
#include <QMap>
#include <QQueue>
#include <QList>
#include <QByteArray>
#include <QString>

class MockHttpServer : public QObject
{
    Q_OBJECT

public:
    struct RecordedRequest {
        QString method;
        QString path;
        QString query;
        QMap<QString, QString> headers;
        QByteArray bodyBytes;
        QJsonObject jsonBody;
    };

    struct ConfiguredResponse {
        int statusCode = 200;
        QByteArray rawBody;
        QMap<QString, QString> headers;
    };

    explicit MockHttpServer(QObject *parent = nullptr);
    ~MockHttpServer() override;

    bool start();
    void stop();

    QString baseUrl() const;
    quint16 port() const;

    void enqueueResponse(int statusCode,
                         const QJsonObject &jsonBody,
                         const QMap<QString, QString> &headers = {});
    void enqueueRawResponse(int statusCode,
                            const QByteArray &rawBody,
                            const QMap<QString, QString> &headers = {});
    void addRoute(const QString &method,
                  const QString &path,
                  int statusCode,
                  const QJsonObject &jsonBody,
                  const QMap<QString, QString> &headers = {});
    void clearRoutes();

    int requestCount() const;
    RecordedRequest lastRequest() const;
    QList<RecordedRequest> requests() const;
    void clearRequests();

private slots:
    void onNewConnection();

private:
    void processSocketBuffer(QTcpSocket *socket, QByteArray &buffer);
    void writeHttpResponse(QTcpSocket *socket, const ConfiguredResponse &response);
    QString reasonPhrase(int statusCode) const;

    QTcpServer m_server;
    QQueue<ConfiguredResponse> m_queuedResponses;
    QMap<QString, ConfiguredResponse> m_routes;
    QList<RecordedRequest> m_requests;
};
