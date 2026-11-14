#pragma once

#include <QObject>
#include <QNetworkAccessManager>
#include <QNetworkReply>
#include <QJsonDocument>
#include <QJsonObject>
#include <QUrlQuery>
#include <QQmlEngine>
#include <QJSEngine>
#include <functional>

class ApiClient : public QObject
{
    Q_OBJECT
    QML_ELEMENT
    QML_SINGLETON

public:
    using SuccessCallback = std::function<void(const QJsonDocument &, int)>;
    using ErrorCallback = std::function<void(const QString &, int)>;

    static ApiClient *instance();
    static ApiClient *create(QQmlEngine *qmlEngine, QJSEngine *jsEngine);

    void get(const QString &endpoint,
             const QUrlQuery &query,
             SuccessCallback onSuccess,
             ErrorCallback onError);

    void post(const QString &endpoint,
              const QJsonObject &body,
              SuccessCallback onSuccess,
              ErrorCallback onError);

    void put(const QString &endpoint,
             const QJsonObject &body,
             SuccessCallback onSuccess,
             ErrorCallback onError);

    void patch(const QString &endpoint,
               const QJsonObject &body,
               SuccessCallback onSuccess,
               ErrorCallback onError);

    void del(const QString &endpoint,
             SuccessCallback onSuccess,
             ErrorCallback onError);

signals:
    void sessionExpired();

private:
    explicit ApiClient(QObject *parent = nullptr);

    void sendRequest(const QString &method,
                     const QString &endpoint,
                     const QUrlQuery &query,
                     const QJsonObject &body,
                     bool hasBody,
                     SuccessCallback onSuccess,
                     ErrorCallback onError);

    QNetworkRequest buildRequest(const QString &endpoint, const QUrlQuery &query) const;
    QString extractErrorMessage(const QByteArray &payload, QNetworkReply *reply, int statusCode) const;

    QNetworkAccessManager m_manager;
};
