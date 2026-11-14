#include "ApiClient.hpp"
#include "AppConfig.hpp"
#include "SessionStore.hpp"
#include <QNetworkRequest>
#include <QUrl>
#include <QJsonParseError>

ApiClient *ApiClient::instance()
{
    static ApiClient singleton;
    return &singleton;
}

ApiClient *ApiClient::create(QQmlEngine *qmlEngine, QJSEngine *jsEngine)
{
    Q_UNUSED(qmlEngine)
    Q_UNUSED(jsEngine)
    ApiClient *inst = instance();
    QJSEngine::setObjectOwnership(inst, QJSEngine::CppOwnership);
    return inst;
}

ApiClient::ApiClient(QObject *parent)
    : QObject(parent)
{
}

void ApiClient::get(const QString &endpoint,
                    const QUrlQuery &query,
                    SuccessCallback onSuccess,
                    ErrorCallback onError)
{
    sendRequest("GET", endpoint, query, QJsonObject(), false, std::move(onSuccess), std::move(onError));
}

void ApiClient::post(const QString &endpoint,
                     const QJsonObject &body,
                     SuccessCallback onSuccess,
                     ErrorCallback onError)
{
    sendRequest("POST", endpoint, QUrlQuery(), body, true, std::move(onSuccess), std::move(onError));
}

void ApiClient::put(const QString &endpoint,
                    const QJsonObject &body,
                    SuccessCallback onSuccess,
                    ErrorCallback onError)
{
    sendRequest("PUT", endpoint, QUrlQuery(), body, true, std::move(onSuccess), std::move(onError));
}

void ApiClient::patch(const QString &endpoint,
                      const QJsonObject &body,
                      SuccessCallback onSuccess,
                      ErrorCallback onError)
{
    sendRequest("PATCH", endpoint, QUrlQuery(), body, true, std::move(onSuccess), std::move(onError));
}

void ApiClient::del(const QString &endpoint,
                    SuccessCallback onSuccess,
                    ErrorCallback onError)
{
    sendRequest("DELETE", endpoint, QUrlQuery(), QJsonObject(), false, std::move(onSuccess), std::move(onError));
}

QNetworkRequest ApiClient::buildRequest(const QString &endpoint, const QUrlQuery &query) const
{
    QString normalizedEndpoint = endpoint.startsWith('/') ? endpoint : ("/" + endpoint);
    QUrl url(AppConfig::instance()->apiBaseUrl() + normalizedEndpoint);
    if (!query.isEmpty()) {
        url.setQuery(query);
    }

    QNetworkRequest request(url);
    request.setTransferTimeout(45000);
    request.setHeader(QNetworkRequest::ContentTypeHeader, "application/json");
    request.setRawHeader("Accept", "application/json");
    request.setRawHeader("Connection", "keep-alive");

    const QString token = SessionStore::instance()->token();
    if (!token.isEmpty()) {
        request.setRawHeader("Authorization", QByteArray("Bearer ") + token.toUtf8());
    }

    return request;
}

void ApiClient::sendRequest(const QString &method,
                            const QString &endpoint,
                            const QUrlQuery &query,
                            const QJsonObject &body,
                            bool hasBody,
                            SuccessCallback onSuccess,
                            ErrorCallback onError)
{
    const QNetworkRequest request = buildRequest(endpoint, query);
    const QByteArray payload = hasBody ? QJsonDocument(body).toJson(QJsonDocument::Compact) : QByteArray();

    QNetworkReply *reply = nullptr;
    if (method == "GET") {
        reply = m_manager.get(request);
    } else if (method == "POST") {
        reply = m_manager.post(request, payload);
    } else if (method == "PUT") {
        reply = m_manager.put(request, payload);
    } else if (method == "DELETE") {
        reply = m_manager.deleteResource(request);
    } else {
        reply = m_manager.sendCustomRequest(request, method.toUtf8(), payload);
    }

    connect(reply, &QNetworkReply::finished, this, [this, reply, endpoint, onSuccess = std::move(onSuccess), onError = std::move(onError)]() {
        reply->deleteLater();

        const int statusCode = reply->attribute(QNetworkRequest::HttpStatusCodeAttribute).toInt();
        const QByteArray rawData = reply->readAll();

        if (reply->error() == QNetworkReply::NoError && statusCode >= 200 && statusCode < 300) {
            QJsonParseError parseError;
            const QJsonDocument doc = rawData.isEmpty() ? QJsonDocument() : QJsonDocument::fromJson(rawData, &parseError);
            if (!rawData.isEmpty() && parseError.error != QJsonParseError::NoError) {
                if (onError) {
                    onError("Resposta inválida do servidor.", statusCode);
                }
                return;
            }
            if (onSuccess) {
                onSuccess(doc, statusCode);
            }
            return;
        }

        const QString errMsg = extractErrorMessage(rawData, reply, statusCode);

        if (statusCode == 401) {
            const bool isAuthEndpoint = endpoint.startsWith("/auth/login") || endpoint.startsWith("/auth/register");
            if (!isAuthEndpoint && !SessionStore::instance()->token().isEmpty()) {
                SessionStore::instance()->clearSession();
                emit sessionExpired();
            }
        }

        if (onError) {
            onError(errMsg, statusCode);
        }
    });
}

QString ApiClient::extractErrorMessage(const QByteArray &payload, QNetworkReply *reply, int statusCode) const
{
    if (!payload.isEmpty()) {
        QJsonParseError parseError;
        const QJsonDocument doc = QJsonDocument::fromJson(payload, &parseError);
        if (parseError.error == QJsonParseError::NoError && doc.isObject()) {
            const QString apiError = doc.object().value("error").toString().trimmed();
            if (!apiError.isEmpty()) {
                return apiError;
            }
        }
    }

    if (statusCode == 429) {
        return "Muitas tentativas. Aguarde alguns instantes e tente novamente.";
    }

    if (reply->error() == QNetworkReply::OperationCanceledError || reply->error() == QNetworkReply::TimeoutError) {
        return "Tempo limite excedido ao conectar ao servidor.";
    }

    if (statusCode == 0) {
        return "Não foi possível conectar ao servidor.";
    }

    const QString reason = reply->attribute(QNetworkRequest::HttpReasonPhraseAttribute).toString();
    return reason.isEmpty() ? reply->errorString() : reason;
}
