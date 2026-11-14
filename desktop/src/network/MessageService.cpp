#include "MessageService.hpp"
#include "ApiClient.hpp"
#include "SessionStore.hpp"

#include <QDateTime>
#include <QJsonArray>
#include <QJsonDocument>
#include <QJsonObject>
#include <QUrlQuery>

MessageService *MessageService::instance()
{
    static MessageService singleton;
    return &singleton;
}

MessageService *MessageService::create(QQmlEngine *qmlEngine, QJSEngine *jsEngine)
{
    Q_UNUSED(qmlEngine)
    Q_UNUSED(jsEngine)
    MessageService *inst = instance();
    QJSEngine::setObjectOwnership(inst, QJSEngine::CppOwnership);
    return inst;
}

MessageService::MessageService(QObject *parent)
    : QObject(parent)
{
    m_syncTimer.setInterval(2500);
    connect(&m_syncTimer, &QTimer::timeout, this, [this]() {
        syncNewMessages(50);
    });

    connect(SessionStore::instance(), &SessionStore::sessionChanged, this, [this]() {
        if (!SessionStore::instance()->isAuthenticated()) {
            stopSync();
            m_messages.clear();
        }
    });
}

bool MessageService::busy() const
{
    return m_busy;
}

bool MessageService::loadingMore() const
{
    return m_loadingMore;
}

bool MessageService::hasMore() const
{
    return m_hasMore;
}

bool MessageService::syncing() const
{
    return m_syncing;
}

QString MessageService::errorMessage() const
{
    return m_errorMessage;
}

QString MessageService::activeRoomId() const
{
    return m_activeRoomId;
}

MessageListModel *MessageService::messages()
{
    return &m_messages;
}

void MessageService::loadInitialMessages(const QString &roomId, int limit)
{
    const QString cleanRoomId = roomId.trimmed();
    if (cleanRoomId.isEmpty()) {
        setErrorMessage("Sala inválida.");
        return;
    }

    m_syncTimer.stop();
    if (m_activeRoomId != cleanRoomId) {
        m_activeRoomId = cleanRoomId;
        emit activeRoomIdChanged();
    }

    m_messages.clear();
    setHasMore(false);
    setBusy(true);
    setErrorMessage(QString());

    QUrlQuery query;
    query.addQueryItem("limit", QString::number(qBound(1, limit, 100)));

    ApiClient::instance()->get(
        QString("/rooms/%1/messages").arg(cleanRoomId),
        query,
        [this, cleanRoomId](const QJsonDocument &doc, int) {
            setBusy(false);
            if (m_activeRoomId != cleanRoomId) {
                return;
            }
            if (doc.isArray()) {
                m_messages.setInitialMessages(doc.array(), QString(), QString());
                setHasMore(false);
            } else if (doc.isObject()) {
                const QJsonObject obj = doc.object();
                m_messages.setInitialMessages(
                    obj.value("messages").toArray(),
                    obj.value("nextCursor").toString(),
                    obj.value("nextSince").toString()
                );
                setHasMore(obj.value("hasMore").toBool(false));
            }
            updateSyncTimerInterval();
            m_syncTimer.start();
        },
        [this](const QString &error, int) {
            setBusy(false);
            setErrorMessage(error);
        }
    );
}

void MessageService::loadOlderMessages(int limit)
{
    if (m_activeRoomId.isEmpty() || !m_hasMore || m_loadingMore) {
        return;
    }
    const QString cursor = m_messages.nextCursor();
    if (cursor.isEmpty()) {
        return;
    }

    setLoadingMore(true);
    setErrorMessage(QString());

    QUrlQuery query;
    query.addQueryItem("limit", QString::number(qBound(1, limit, 100)));
    query.addQueryItem("before", cursor);

    const QString targetRoomId = m_activeRoomId;
    ApiClient::instance()->get(
        QString("/rooms/%1/messages").arg(targetRoomId),
        query,
        [this, targetRoomId](const QJsonDocument &doc, int) {
            setLoadingMore(false);
            if (m_activeRoomId != targetRoomId) {
                return;
            }
            if (doc.isObject()) {
                const QJsonObject obj = doc.object();
                m_messages.prependMessages(
                    obj.value("messages").toArray(),
                    obj.value("nextCursor").toString()
                );
                setHasMore(obj.value("hasMore").toBool(false));
            }
        },
        [this](const QString &error, int) {
            setLoadingMore(false);
            setErrorMessage(error);
        }
    );
}

void MessageService::syncNewMessages(int limit)
{
    if (m_activeRoomId.isEmpty() || m_syncing || m_busy) {
        return;
    }

    setSyncing(true);

    QUrlQuery query;
    query.addQueryItem("limit", QString::number(qBound(1, limit, 100)));
    const QString since = m_messages.nextSince();
    if (!since.isEmpty()) {
        query.addQueryItem("since", since);
    }

    const QString targetRoomId = m_activeRoomId;
    ApiClient::instance()->get(
        QString("/rooms/%1/messages").arg(targetRoomId),
        query,
        [this, targetRoomId, since](const QJsonDocument &doc, int) {
            setSyncing(false);
            if (m_activeRoomId != targetRoomId) {
                return;
            }
            if (doc.isArray()) {
                if (since.isEmpty()) {
                    m_messages.setInitialMessages(doc.array(), QString(), QString());
                } else {
                    m_messages.appendMessages(doc.array(), QString());
                }
            } else if (doc.isObject()) {
                const QJsonObject obj = doc.object();
                const QJsonArray arr = obj.value("messages").toArray();
                const QString newSince = obj.value("nextSince").toString();
                if (since.isEmpty()) {
                    m_messages.setInitialMessages(arr, obj.value("nextCursor").toString(), newSince);
                    setHasMore(obj.value("hasMore").toBool(false));
                } else {
                    m_messages.appendMessages(arr, newSince);
                }
            }
        },
        [this](const QString &, int) {
            setSyncing(false);
        }
    );
}

bool MessageService::sendMessage(const QString &roomId, const QString &content)
{
    const QString cleanRoomId = roomId.trimmed();
    const QString cleanContent = content.trimmed();

    if (cleanRoomId.isEmpty()) {
        setErrorMessage("Sala inválida.");
        emit sendFailed(m_errorMessage);
        return false;
    }
    if (cleanContent.isEmpty()) {
        setErrorMessage("Digite uma mensagem antes de enviar.");
        emit sendFailed(m_errorMessage);
        return false;
    }
    if (cleanContent.size() > 1000) {
        setErrorMessage("A mensagem excede o limite de 1000 caracteres.");
        emit sendFailed(m_errorMessage);
        return false;
    }

    const qint64 nowMs = QDateTime::currentMSecsSinceEpoch();
    if (m_lastSendMs > 0 && (nowMs - m_lastSendMs) < 500) {
        setErrorMessage("Aguarde um instante antes de enviar outra mensagem.");
        emit sendFailed(m_errorMessage);
        return false;
    }
    m_lastSendMs = nowMs;

    setErrorMessage(QString());

    QJsonObject body;
    body.insert("content", cleanContent);

    ApiClient::instance()->post(
        QString("/rooms/%1/messages").arg(cleanRoomId),
        body,
        [this, cleanRoomId](const QJsonDocument &doc, int) {
            if (m_activeRoomId == cleanRoomId && doc.isObject()) {
                m_messages.appendSingleMessage(doc.object());
            }
            emit messageSent();
        },
        [this](const QString &error, int) {
            setErrorMessage(error);
            emit sendFailed(error);
        }
    );
    return true;
}

void MessageService::deleteMessage(const QString &messageId)
{
    const QString cleanId = messageId.trimmed();
    if (cleanId.isEmpty()) {
        return;
    }

    setErrorMessage(QString());

    ApiClient::instance()->del(
        QString("/messages/%1").arg(cleanId),
        [this, cleanId](const QJsonDocument &, int) {
            m_messages.removeById(cleanId);
        },
        [this](const QString &error, int) {
            setErrorMessage(error);
        }
    );
}

void MessageService::stopSync()
{
    m_syncTimer.stop();
    if (!m_activeRoomId.isEmpty()) {
        m_activeRoomId.clear();
        emit activeRoomIdChanged();
    }
    setBusy(false);
    setLoadingMore(false);
    setSyncing(false);
    setHasMore(false);
}

void MessageService::setWindowActive(bool active)
{
    if (m_windowActive == active) {
        return;
    }
    m_windowActive = active;
    updateSyncTimerInterval();
}

void MessageService::clearError()
{
    setErrorMessage(QString());
}

void MessageService::setBusy(bool value)
{
    if (m_busy == value) {
        return;
    }
    m_busy = value;
    emit busyChanged();
}

void MessageService::setLoadingMore(bool value)
{
    if (m_loadingMore == value) {
        return;
    }
    m_loadingMore = value;
    emit loadingMoreChanged();
}

void MessageService::setHasMore(bool value)
{
    if (m_hasMore == value) {
        return;
    }
    m_hasMore = value;
    emit hasMoreChanged();
}

void MessageService::setSyncing(bool value)
{
    if (m_syncing == value) {
        return;
    }
    m_syncing = value;
    emit syncingChanged();
}

void MessageService::setErrorMessage(const QString &message)
{
    if (m_errorMessage == message) {
        return;
    }
    m_errorMessage = message;
    emit errorMessageChanged();
}

void MessageService::updateSyncTimerInterval()
{
    m_syncTimer.setInterval(m_windowActive ? 2500 : 10000);
}
