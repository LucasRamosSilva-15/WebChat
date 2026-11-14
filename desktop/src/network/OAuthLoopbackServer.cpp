#include "OAuthLoopbackServer.hpp"

#include <QHostAddress>
#include <QJsonDocument>
#include <QJsonObject>
#include <QUrl>
#include <QUrlQuery>

OAuthLoopbackServer::OAuthLoopbackServer(QObject *parent)
    : QObject(parent)
{
    m_timeoutTimer.setSingleShot(true);
    m_timeoutTimer.setInterval(180000);
    connect(&m_server, &QTcpServer::newConnection, this, &OAuthLoopbackServer::onNewConnection);
    connect(&m_timeoutTimer, &QTimer::timeout, this, &OAuthLoopbackServer::onTimeout);
}

OAuthLoopbackServer::~OAuthLoopbackServer()
{
    stopListening();
}

QString OAuthLoopbackServer::startListening()
{
    stopListening();
    if (!m_server.listen(QHostAddress::LocalHost, 0)) {
        return QString();
    }
    m_timeoutTimer.start();
    return callbackUrl();
}

void OAuthLoopbackServer::stopListening()
{
    m_timeoutTimer.stop();
    if (m_server.isListening()) {
        m_server.close();
    }
}

bool OAuthLoopbackServer::isListening() const
{
    return m_server.isListening();
}

quint16 OAuthLoopbackServer::port() const
{
    return m_server.serverPort();
}

QString OAuthLoopbackServer::callbackUrl() const
{
    if (!m_server.isListening()) {
        return QString();
    }
    return QString("http://127.0.0.1:%1/callback").arg(m_server.serverPort());
}

void OAuthLoopbackServer::onNewConnection()
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

void OAuthLoopbackServer::onTimeout()
{
    stopListening();
    emit authError("Tempo esgotado aguardando autenticação no navegador.");
}

void OAuthLoopbackServer::processSocketBuffer(QTcpSocket *socket, QByteArray &buffer)
{
    const int headerEnd = buffer.indexOf("\r\n\r\n");
    if (headerEnd < 0) {
        return;
    }

    const QByteArray headerBlock = buffer.left(headerEnd);
    const QList<QByteArray> lines = headerBlock.split('\n');
    if (lines.isEmpty()) {
        sendHttpResponse(socket, 400, "text/plain; charset=utf-8", "Bad Request");
        return;
    }

    const QList<QByteArray> requestLine = lines.first().trimmed().split(' ');
    if (requestLine.size() < 2) {
        sendHttpResponse(socket, 400, "text/plain; charset=utf-8", "Bad Request");
        return;
    }

    const QString method = QString::fromUtf8(requestLine.at(0)).toUpper();
    const QUrl targetUrl(QString::fromUtf8(requestLine.at(1)));
    const QString path = targetUrl.path();

    int contentLength = 0;
    for (int i = 1; i < lines.size(); ++i) {
        const QByteArray line = lines.at(i).trimmed();
        const int colonIdx = line.indexOf(':');
        if (colonIdx > 0) {
            const QString key = QString::fromUtf8(line.left(colonIdx)).trimmed().toLower();
            const QString val = QString::fromUtf8(line.mid(colonIdx + 1)).trimmed();
            if (key == "content-length") {
                contentLength = val.toInt();
            }
        }
    }

    const int totalRequired = headerEnd + 4 + contentLength;
    if (buffer.size() < totalRequired) {
        return;
    }

    const QByteArray bodyBytes = buffer.mid(headerEnd + 4, contentLength);
    buffer.remove(0, totalRequired);

    if (method == "GET" && path == "/callback") {
        const QUrlQuery query(targetUrl);
        const QString errorDesc = query.queryItemValue("error_description", QUrl::FullyDecoded).trimmed();
        const QString errorCode = query.queryItemValue("error", QUrl::FullyDecoded).trimmed();
        const QString token = query.queryItemValue("token", QUrl::FullyDecoded).trimmed();

        if (!errorDesc.isEmpty() || !errorCode.isEmpty()) {
            const QString msg = !errorDesc.isEmpty() ? errorDesc : errorCode;
            sendHttpResponse(
                socket,
                200,
                "text/html; charset=utf-8",
                resultHtml(false, "Autenticação não concluída", msg)
            );
            stopListening();
            emit authError(msg);
            return;
        }

        if (!token.isEmpty()) {
            QJsonObject userObj;
            const QString userRaw = query.queryItemValue("user", QUrl::FullyDecoded).trimmed();
            if (!userRaw.isEmpty()) {
                const QJsonDocument userDoc = QJsonDocument::fromJson(userRaw.toUtf8());
                if (userDoc.isObject()) {
                    userObj = userDoc.object();
                }
            }

            const QString email = query.queryItemValue("email", QUrl::FullyDecoded).trimmed();
            const QString displayName = query.queryItemValue("displayName", QUrl::FullyDecoded).trimmed();
            const QString profilePhoto = query.queryItemValue("profilePhoto", QUrl::FullyDecoded).trimmed();

            if (!email.isEmpty() && userObj.value("email").toString().isEmpty()) {
                userObj.insert("email", email);
            }
            if (!displayName.isEmpty() && userObj.value("displayName").toString().isEmpty()) {
                userObj.insert("displayName", displayName);
            }
            if (!profilePhoto.isEmpty() && userObj.value("profilePhoto").toString().isEmpty()) {
                userObj.insert("profilePhoto", profilePhoto);
            }

            sendHttpResponse(
                socket,
                200,
                "text/html; charset=utf-8",
                resultHtml(
                    true,
                    "Login concluído!",
                    "Pode fechar esta aba e voltar ao SkyRipple Desktop."
                )
            );
            stopListening();
            emit sessionPayloadReceived(token, userObj);
            return;
        }

        sendHttpResponse(socket, 200, "text/html; charset=utf-8", callbackHtml());
        return;
    }

    if (method == "POST" && path == "/complete") {
        const QJsonDocument doc = QJsonDocument::fromJson(bodyBytes);
        const QJsonObject obj = doc.object();
        const QString accessToken = obj.value("access_token").toString().trimmed();
        const QString errorDesc = obj.value("error_description").toString().trimmed();
        const QString errorCode = obj.value("error").toString().trimmed();

        sendHttpResponse(socket, 200, "application/json; charset=utf-8", "{\"ok\":true}");
        stopListening();

        if (!accessToken.isEmpty()) {
            emit tokenReceived(accessToken);
        } else if (!errorDesc.isEmpty()) {
            emit authError(errorDesc);
        } else if (!errorCode.isEmpty()) {
            emit authError(errorCode);
        } else {
            emit authError("Não foi possível obter o token de autenticação do Google.");
        }
        return;
    }

    sendHttpResponse(socket, 404, "text/plain; charset=utf-8", "Not Found");
}

void OAuthLoopbackServer::sendHttpResponse(QTcpSocket *socket,
                                           int statusCode,
                                           const QByteArray &contentType,
                                           const QByteArray &body)
{
    const QByteArray statusText = (statusCode == 200) ? "OK" : (statusCode == 400 ? "Bad Request" : "Not Found");
    QByteArray raw;
    raw.append("HTTP/1.1 " + QByteArray::number(statusCode) + " " + statusText + "\r\n");
    raw.append("Content-Type: " + contentType + "\r\n");
    raw.append("Content-Length: " + QByteArray::number(body.size()) + "\r\n");
    raw.append("Cache-Control: no-store\r\n");
    raw.append("Connection: close\r\n");
    raw.append("\r\n");
    raw.append(body);

    socket->write(raw);
    socket->flush();
    socket->disconnectFromHost();
}

QByteArray OAuthLoopbackServer::resultHtml(bool success, const QString &title, const QString &message) const
{
    const QString badgeColor = success
        ? "linear-gradient(180deg, #4da4ff 0%, #0071e3 100%)"
        : "linear-gradient(180deg, #f87171 0%, #dc2626 100%)";

    const QString html = QString(
        "<!DOCTYPE html>"
        "<html lang=\"pt-BR\">"
        "<head>"
        "<meta charset=\"utf-8\">"
        "<meta name=\"viewport\" content=\"width=device-width, initial-scale=1\">"
        "<title>SkyRipple Desktop</title>"
        "<style>"
        "body{margin:0;min-height:100vh;display:flex;align-items:center;justify-content:center;"
        "font-family:-apple-system,BlinkMacSystemFont,\"Segoe UI\",Roboto,sans-serif;"
        "background:linear-gradient(180deg,#dbeafe 0%,#f1f5f9 100%);color:#1d1d1f;}"
        ".card{background:rgba(255,255,255,0.92);border:1px solid rgba(148,163,184,0.35);"
        "border-radius:24px;padding:36px 32px;max-width:420px;width:90%;text-align:center;"
        "box-shadow:0 20px 50px -15px rgba(0,0,0,0.18);}"
        ".badge{display:inline-block;padding:6px 14px;border-radius:999px;background:%1;"
        "color:#ffffff;font-size:12px;font-weight:700;margin-bottom:16px;}"
        "h1{font-size:20px;margin:0 0 10px 0;}"
        "p{font-size:14px;color:#424245;margin:0;line-height:1.5;}"
        "</style>"
        "</head>"
        "<body>"
        "<div class=\"card\">"
        "<div class=\"badge\">SkyRipple Desktop</div>"
        "<h1>%2</h1>"
        "<p>%3</p>"
        "</div>"
        "</body>"
        "</html>"
    ).arg(badgeColor, title.toHtmlEscaped(), message.toHtmlEscaped());

    return html.toUtf8();
}

QByteArray OAuthLoopbackServer::callbackHtml() const
{
    return R"HTML(<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>SkyRipple - Autenticação Google</title>
<style>
body {
    margin: 0;
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    background: linear-gradient(180deg, #dbeafe 0%, #f1f5f9 100%);
    color: #1d1d1f;
}
.card {
    background: rgba(255, 255, 255, 0.92);
    border: 1px solid rgba(148, 163, 184, 0.35);
    border-radius: 24px;
    padding: 36px 32px;
    max-width: 420px;
    width: 90%;
    text-align: center;
    box-shadow: 0 20px 50px -15px rgba(0, 0, 0, 0.18);
}
.badge {
    display: inline-block;
    padding: 6px 14px;
    border-radius: 999px;
    background: linear-gradient(180deg, #4da4ff 0%, #0071e3 100%);
    color: #ffffff;
    font-size: 12px;
    font-weight: 700;
    margin-bottom: 16px;
}
h1 {
    font-size: 20px;
    margin: 0 0 10px 0;
}
p {
    font-size: 14px;
    color: #424245;
    margin: 0;
    line-height: 1.5;
}
</style>
</head>
<body>
<div class="card">
    <div class="badge">SkyRipple ID</div>
    <h1 id="title">Concluindo autenticação...</h1>
    <p id="message">Aguarde um instante enquanto sincronizamos sua conta com o aplicativo.</p>
</div>
<script>
(function() {
    var hashParams = new URLSearchParams(window.location.hash ? window.location.hash.substring(1) : "");
    var searchParams = new URLSearchParams(window.location.search || "");
    var accessToken = hashParams.get("access_token") || "";
    var code = searchParams.get("code") || "";
    var errorDesc = hashParams.get("error_description") || searchParams.get("error_description") || "";
    var errorCode = hashParams.get("error") || searchParams.get("error") || "";
    fetch("/complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            access_token: accessToken,
            code: code,
            error_description: errorDesc,
            error: errorCode
        })
    }).then(function() {
        var titleEl = document.getElementById("title");
        var msgEl = document.getElementById("message");
        if (accessToken) {
            titleEl.textContent = "Login concluído!";
            msgEl.textContent = "Pode fechar esta aba e voltar ao SkyRipple Desktop.";
        } else {
            titleEl.textContent = "Autenticação não concluída";
            msgEl.textContent = errorDesc || errorCode || "Você pode fechar esta aba e tentar novamente no aplicativo.";
        }
    }).catch(function() {
        document.getElementById("title").textContent = "Erro de comunicação";
        document.getElementById("message").textContent = "Feche esta aba e tente novamente no aplicativo SkyRipple.";
    });
})();
</script>
</body>
</html>)HTML";
}
