#include "RoomService.hpp"
#include "ApiClient.hpp"
#include "SessionStore.hpp"

#include <QJsonArray>
#include <QJsonDocument>
#include <QJsonObject>
#include <QUrlQuery>

RoomService *RoomService::instance()
{
    static RoomService singleton;
    return &singleton;
}

RoomService *RoomService::create(QQmlEngine *qmlEngine, QJSEngine *jsEngine)
{
    Q_UNUSED(qmlEngine)
    Q_UNUSED(jsEngine)
    RoomService *inst = instance();
    QJSEngine::setObjectOwnership(inst, QJSEngine::CppOwnership);
    return inst;
}

RoomService::RoomService(QObject *parent)
    : QObject(parent)
{
    connect(SessionStore::instance(), &SessionStore::sessionChanged, this, [this]() {
        if (!SessionStore::instance()->isAuthenticated()) {
            leaveActiveRoom();
            m_rooms.clear();
            setErrorMessage(QString());
            setBusy(false);
        }
    });
}

bool RoomService::busy() const
{
    return m_busy;
}

QString RoomService::errorMessage() const
{
    return m_errorMessage;
}

RoomListModel *RoomService::rooms()
{
    return &m_rooms;
}

QString RoomService::activeRoomId() const
{
    return m_activeRoomId;
}

QString RoomService::activeRoomName() const
{
    return m_activeRoomName;
}

QString RoomService::activeRoomDescription() const
{
    return m_activeRoomDescription;
}

QString RoomService::activeRoomOwnerId() const
{
    return m_activeRoomOwnerId;
}

void RoomService::fetchRooms()
{
    setBusy(true);
    setErrorMessage(QString());

    ApiClient::instance()->get(
        "/rooms",
        QUrlQuery(),
        [this](const QJsonDocument &doc, int) {
            setBusy(false);
            if (doc.isArray()) {
                m_rooms.setRooms(doc.array());
            } else if (doc.isObject()) {
                m_rooms.setRooms(doc.object().value("rooms").toArray());
            }
        },
        [this](const QString &error, int) {
            setBusy(false);
            setErrorMessage(error);
        }
    );
}

void RoomService::createRoom(const QString &name,
                             const QString &category,
                             const QString &description)
{
    const QString cleanName = name.trimmed();
    if (cleanName.isEmpty()) {
        setErrorMessage("Informe o nome da sala.");
        return;
    }

    setBusy(true);
    setErrorMessage(QString());

    QJsonObject body;
    body.insert("name", cleanName);
    body.insert("type", "public");
    if (!category.trimmed().isEmpty()) {
        body.insert("category", category.trimmed());
    }
    if (!description.trimmed().isEmpty()) {
        body.insert("description", description.trimmed());
    }

    ApiClient::instance()->post(
        "/rooms",
        body,
        [this](const QJsonDocument &doc, int) {
            setBusy(false);
            const QJsonObject obj = doc.object();
            const QString createdId = obj.value("id").toVariant().toString();
            fetchRooms();
            emit roomCreated(createdId);
        },
        [this](const QString &error, int) {
            setBusy(false);
            setErrorMessage(error);
        }
    );
}

void RoomService::joinRoom(const QString &roomId)
{
    const QString cleanId = roomId.trimmed();
    if (cleanId.isEmpty()) {
        setErrorMessage("Sala inválida.");
        return;
    }

    setBusy(true);
    setErrorMessage(QString());

    ApiClient::instance()->post(
        QString("/rooms/%1/join").arg(cleanId),
        QJsonObject(),
        [this, cleanId](const QJsonDocument &, int) {
            ApiClient::instance()->get(
                QString("/rooms/%1").arg(cleanId),
                QUrlQuery(),
                [this, cleanId](const QJsonDocument &doc, int) {
                    setBusy(false);
                    if (doc.isObject()) {
                        applyActiveRoom(doc.object());
                    } else {
                        m_activeRoomId = cleanId;
                        emit activeRoomChanged();
                    }
                    emit roomEntered(m_activeRoomId);
                },
                [this](const QString &error, int) {
                    setBusy(false);
                    setErrorMessage(error);
                }
            );
        },
        [this](const QString &error, int) {
            setBusy(false);
            setErrorMessage(error);
        }
    );
}

void RoomService::leaveActiveRoom()
{
    if (m_activeRoomId.isEmpty() && m_activeRoomName.isEmpty()) {
        return;
    }
    m_activeRoomId.clear();
    m_activeRoomName.clear();
    m_activeRoomDescription.clear();
    m_activeRoomOwnerId.clear();
    emit activeRoomChanged();
}

void RoomService::clearError()
{
    setErrorMessage(QString());
}

void RoomService::setBusy(bool value)
{
    if (m_busy == value) {
        return;
    }
    m_busy = value;
    emit busyChanged();
}

void RoomService::setErrorMessage(const QString &message)
{
    if (m_errorMessage == message) {
        return;
    }
    m_errorMessage = message;
    emit errorMessageChanged();
}

void RoomService::applyActiveRoom(const QJsonObject &roomObj)
{
    m_activeRoomId = roomObj.value("id").toVariant().toString();
    m_activeRoomName = roomObj.value("name").toString();
    m_activeRoomDescription = roomObj.value("description").toString();
    m_activeRoomOwnerId = roomObj.value("created_by").toVariant().toString();
    if (m_activeRoomOwnerId.isEmpty()) {
        m_activeRoomOwnerId = roomObj.value("ownerId").toVariant().toString();
    }
    emit activeRoomChanged();
}
