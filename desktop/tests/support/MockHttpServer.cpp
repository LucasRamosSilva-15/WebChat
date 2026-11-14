#include "MockHttpServer.hpp"
#include <QHostAddress>

MockHttpServer::MockHttpServer(QObject *parent)
    : QObject(parent)
{
    connect(&m_server, &QTcpServer::newConnection, this, &MockHttpServer::onNewConnection);
}

MockHttpServer::~MockHttpServer()
{
    stop();
}

bool MockHttpServer::start()
{
    return m_server.listen(QHostAddress::LocalHost, 0);
}

void MockHttpServer::stop()
{
    if (m_server.isListening()) {
        m_server.close();
    }
}

QString MockHttpServer::baseUrl() const
{
    return QString("http://127.0.0.1:%1/api").arg(m_server.serverPort());
}

quint16 MockHttpServer::port() const
{
    return m_server.serverPort();
}

void MockHttpServer::enqueueResponse(int statusCode,
                                     const QJsonObject &jsonBody,
                                     const QMap<QString, QString> &headers)
{
    ConfiguredResponse resp;
    resp.statusCode = statusCode;
    resp.rawBody = QJsonDocument(jsonBody).toJson(QJsonDocument::Compact);
    resp.headers = headers;
    m_queuedResponses.enqueue(resp);
}

void MockHttpServer::enqueueRawResponse(int statusCode,
                                        const QByteArray &rawBody,
                                        const QMap<QString, QString> &headers)
{
    ConfiguredResponse resp;
    resp.statusCode = statusCode;
    resp.rawBody = rawBody;
    resp.headers = headers;
    m_queuedResponses.enqueue(resp);
}

void MockHttpServer::addRoute(const QString &method,
                              const QString &path,
                              int statusCode,
                              const QJsonObject &jsonBody,
                              const QMap<QString, QString> &headers)
{
    ConfiguredResponse resp;
    resp.statusCode = statusCode;
    resp.rawBody = QJsonDocument(jsonBody).toJson(QJsonDocument::Compact);
    resp.headers = headers;
    m_routes.insert(method.toUpper() + " " + path, resp);
}

void MockHttpServer::clearRoutes()
{
    m_queuedResponses.clear();
    m_routes.clear();
}

int MockHttpServer::requestCount() const
{
    return m_requests.size();
}

MockHttpServer::RecordedRequest MockHttpServer::lastRequest() const
{
    if (m_requests.isEmpty()) {
        return RecordedRequest();
    }
    return m_requests.last();
}

QList<MockHttpServer::RecordedRequest> MockHttpServer::requests() const
{
    return m_requests;
}

void MockHttpServer::clearRequests()
{
    m_requests.clear();
}

void MockHttpServer::onNewConnection()
{
    while (m_server.hasPendingConnections()) {
        QTcpSocket *socket = m_server.nextPendingConnection();
        auto *buffer = new QByteArray();

        connect(socket, &QTcpSocket::readyRead, this, [this, socket, buffer]() {
            buffer->append(socket->readAll());
            processSocketBuffer(socket, *buffer);
        });

        connect(socket, &QTcpSocket::disconnected, socket, [socket, buffer]() {
            delete buffer;
            socket->deleteLater();
        });
    }
}

void MockHttpServer::processSocketBuffer(QTcpSocket *socket, QByteArray &buffer)
{
    const int headerEnd = buffer.indexOf("\r\n\r\n");
    if (headerEnd < 0) {
        return;
    }

    const QByteArray headerBlock = buffer.left(headerEnd);
    const QList<QByteArray> lines = headerBlock.split('\n');
    if (lines.isEmpty()) {
        return;
    }

    const QByteArray requestLine = lines.first().trimmed();
    const QList<QByteArray> parts = requestLine.split(' ');
    if (parts.size() < 2) {
        return;
    }

    RecordedRequest recorded;
    recorded.method = QString::fromUtf8(parts.at(0)).toUpper();

    const QString fullTarget = QString::fromUtf8(parts.at(1));
    const int qIndex = fullTarget.indexOf('?');
    if (qIndex >= 0) {
        recorded.path = fullTarget.left(qIndex);
        recorded.query = fullTarget.mid(qIndex + 1);
    } else {
        recorded.path = fullTarget;
    }

    int contentLength = 0;
    for (int i = 1; i < lines.size(); ++i) {
        const QByteArray line = lines.at(i).trimmed();
        const int colon = line.indexOf(':');
        if (colon > 0) {
            const QString key = QString::fromUtf8(line.left(colon)).trimmed().toLower();
            const QString value = QString::fromUtf8(line.mid(colon + 1)).trimmed();
            recorded.headers.insert(key, value);
            if (key == "content-length") {
                contentLength = value.toInt();
            }
        }
    }

    const int bodyStart = headerEnd + 4;
    if (buffer.size() < bodyStart + contentLength) {
        return;
    }

    recorded.bodyBytes = buffer.mid(bodyStart, contentLength);
    buffer.remove(0, bodyStart + contentLength);

    if (!recorded.bodyBytes.isEmpty()) {
        const QJsonDocument doc = QJsonDocument::fromJson(recorded.bodyBytes);
        if (doc.isObject()) {
            recorded.jsonBody = doc.object();
        }
    }

    m_requests.append(recorded);

    ConfiguredResponse response;
    if (!m_queuedResponses.isEmpty()) {
        response = m_queuedResponses.dequeue();
    } else {
        const QString routeKey = recorded.method + " " + recorded.path;
        if (m_routes.contains(routeKey)) {
            response = m_routes.value(routeKey);
        } else {
            response.statusCode = 404;
            response.rawBody = "{\"error\":\"Rota não encontrada no mock.\"}";
        }
    }

    writeHttpResponse(socket, response);
}

void MockHttpServer::writeHttpResponse(QTcpSocket *socket, const ConfiguredResponse &response)
{
    QByteArray out;
    out.append(QString("HTTP/1.1 %1 %2\r\n").arg(response.statusCode).arg(reasonPhrase(response.statusCode)).toUtf8());
    out.append("Content-Type: application/json\r\n");
    out.append(QString("Content-Length: %1\r\n").arg(response.rawBody.size()).toUtf8());
    for (auto it = response.headers.cbegin(); it != response.headers.cend(); ++it) {
        out.append(QString("%1: %2\r\n").arg(it.key(), it.value()).toUtf8());
    }
    out.append("Connection: close\r\n\r\n");
    out.append(response.rawBody);

    socket->write(out);
    socket->flush();
    socket->disconnectFromHost();
}

QString MockHttpServer::reasonPhrase(int statusCode) const
{
    switch (statusCode) {
    case 200: return "OK";
    case 201: return "Created";
    case 400: return "Bad Request";
    case 401: return "Unauthorized";
    case 403: return "Forbidden";
    case 404: return "Not Found";
    case 409: return "Conflict";
    case 429: return "Too Many Requests";
    case 500: return "Internal Server Error";
    default: return "OK";
    }
}
