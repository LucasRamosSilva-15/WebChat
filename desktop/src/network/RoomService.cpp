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
            m_members.clear();
            if (!m_favoriteRoomIds.isEmpty()) {
                m_favoriteRoomIds.clear();
                emit favoritesChanged();
            }
            setErrorMessage(QString());
            setBusy(false);
            setMembersBusy(false);
        }
    });
}

bool RoomService::busy() const
{
    return m_busy;
}

bool RoomService::membersBusy() const
{
    return m_membersBusy;
}

QString RoomService::errorMessage() const
{
    return m_errorMessage;
}

RoomListModel *RoomService::rooms()
{
    return &m_rooms;
}

MemberListModel *RoomService::members()
{
    return &m_members;
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

QString RoomService::activeUserRole() const
{
    const QString uid = SessionStore::instance()->userId();
    if (!uid.isEmpty()) {
        const QString memberRole = m_members.roleForUserId(uid);
        if (!memberRole.isEmpty()) {
            return memberRole;
        }
        if (!m_activeRoomOwnerId.isEmpty() && m_activeRoomOwnerId == uid) {
            return "owner";
        }
    }
    return "user";
}

int RoomService::totalUsers() const
{
    return m_totalUsers;
}

int RoomService::activeRooms() const
{
    return m_activeRooms;
}

int RoomService::pendingReports() const
{
    return m_pendingReports;
}

QStringList RoomService::favoriteRoomIds() const
{
    return m_favoriteRoomIds;
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

void RoomService::setMembersBusy(bool value)
{
    if (m_membersBusy == value) {
        return;
    }
    m_membersBusy = value;
    emit membersBusyChanged();
}

void RoomService::fetchStats()
{
    ApiClient::instance()->get(
        "/stats",
        QUrlQuery(),
        [this](const QJsonDocument &doc, int) {
            if (!doc.isObject()) {
                return;
            }
            const QJsonObject obj = doc.object();
            m_totalUsers = obj.value("total_users").toInt(obj.value("totalUsers").toInt(0));
            m_activeRooms = obj.value("active_rooms").toInt(obj.value("activeRooms").toInt(m_rooms.count()));
            m_pendingReports = obj.value("pending_reports").toInt(obj.value("pendingReports").toInt(0));
            emit statsChanged();
        },
        [this](const QString &, int) {
        }
    );
}

void RoomService::fetchFavorites()
{
    ApiClient::instance()->get(
        "/favorites",
        QUrlQuery(),
        [this](const QJsonDocument &doc, int) {
            QStringList ids;
            const QJsonArray arr = doc.isArray() ? doc.array() : doc.object().value("favorites").toArray();
            for (const QJsonValue &val : arr) {
                if (!val.isObject()) {
                    continue;
                }
                const QJsonObject obj = val.toObject();
                const QString itemType = obj.value("item_type").toString();
                if (itemType.isEmpty() || itemType == "room") {
                    const QString itemId = obj.value("item_id").toVariant().toString();
                    if (!itemId.isEmpty() && !ids.contains(itemId)) {
                        ids.append(itemId);
                    }
                }
            }
            if (m_favoriteRoomIds != ids) {
                m_favoriteRoomIds = ids;
                emit favoritesChanged();
            }
        },
        [this](const QString &, int) {
        }
    );
}

bool RoomService::isFavorite(const QString &roomId) const
{
    return m_favoriteRoomIds.contains(roomId.trimmed());
}

void RoomService::toggleFavorite(const QString &roomId, const QString &roomName)
{
    const QString cleanId = roomId.trimmed();
    if (cleanId.isEmpty()) {
        return;
    }

    if (isFavorite(cleanId)) {
        ApiClient::instance()->del(
            QString("/favorites/room/%1").arg(cleanId),
            [this, cleanId](const QJsonDocument &, int) {
                if (m_favoriteRoomIds.removeAll(cleanId) > 0) {
                    emit favoritesChanged();
                }
            },
            [this](const QString &error, int) {
                setErrorMessage(error);
            }
        );
    } else {
        QJsonObject body;
        body.insert("item_type", "room");
        body.insert("item_id", cleanId);
        if (!roomName.trimmed().isEmpty()) {
            body.insert("title", roomName.trimmed());
        }
        ApiClient::instance()->post(
            "/favorites",
            body,
            [this, cleanId](const QJsonDocument &, int) {
                if (!m_favoriteRoomIds.contains(cleanId)) {
                    m_favoriteRoomIds.append(cleanId);
                    emit favoritesChanged();
                }
            },
            [this](const QString &error, int) {
                setErrorMessage(error);
            }
        );
    }
}

void RoomService::fetchMembers(const QString &roomId)
{
    const QString cleanId = roomId.trimmed();
    if (cleanId.isEmpty()) {
        return;
    }

    setMembersBusy(true);

    ApiClient::instance()->get(
        QString("/rooms/%1/members").arg(cleanId),
        QUrlQuery(),
        [this](const QJsonDocument &doc, int) {
            setMembersBusy(false);
            if (doc.isArray()) {
                m_members.setMembers(doc.array());
            } else if (doc.isObject()) {
                m_members.setMembers(doc.object().value("members").toArray());
            }
            emit activeUserRoleChanged();
        },
        [this](const QString &error, int) {
            setMembersBusy(false);
            setErrorMessage(error);
        }
    );
}

void RoomService::updateMemberRole(const QString &roomId, const QString &userId, const QString &role)
{
    const QString cleanRoomId = roomId.trimmed();
    const QString cleanUserId = userId.trimmed();
    const QString cleanRole = role.trimmed().toLower();
    if (cleanRoomId.isEmpty() || cleanUserId.isEmpty() || cleanRole.isEmpty()) {
        return;
    }

    setErrorMessage(QString());
    QJsonObject body;
    body.insert("role", cleanRole);

    ApiClient::instance()->patch(
        QString("/rooms/%1/members/%2/role").arg(cleanRoomId, cleanUserId),
        body,
        [this, cleanUserId, cleanRole](const QJsonDocument &, int) {
            m_members.updateRoleByUserId(cleanUserId, cleanRole);
            emit activeUserRoleChanged();
            emit memberActionSucceeded("Cargo do membro atualizado.");
        },
        [this](const QString &error, int) {
            setErrorMessage(error);
        }
    );
}

void RoomService::kickMember(const QString &roomId, const QString &userId)
{
    const QString cleanRoomId = roomId.trimmed();
    const QString cleanUserId = userId.trimmed();
    if (cleanRoomId.isEmpty() || cleanUserId.isEmpty()) {
        return;
    }

    setErrorMessage(QString());

    ApiClient::instance()->del(
        QString("/rooms/%1/members/%2").arg(cleanRoomId, cleanUserId),
        [this, cleanUserId](const QJsonDocument &, int) {
            m_members.removeByUserId(cleanUserId);
            emit memberActionSucceeded("Membro removido da sala.");
        },
        [this](const QString &error, int) {
            setErrorMessage(error);
        }
    );
}

void RoomService::transferOwnership(const QString &roomId, const QString &newOwnerId)
{
    const QString cleanRoomId = roomId.trimmed();
    const QString cleanNewOwnerId = newOwnerId.trimmed();
    if (cleanRoomId.isEmpty() || cleanNewOwnerId.isEmpty()) {
        return;
    }

    setErrorMessage(QString());
    QJsonObject body;
    body.insert("newOwnerId", cleanNewOwnerId);

    ApiClient::instance()->post(
        QString("/rooms/%1/transfer-ownership").arg(cleanRoomId),
        body,
        [this, cleanRoomId, cleanNewOwnerId](const QJsonDocument &, int) {
            m_activeRoomOwnerId = cleanNewOwnerId;
            emit activeRoomChanged();
            emit memberActionSucceeded("Propriedade da sala transferida.");
            fetchMembers(cleanRoomId);
        },
        [this](const QString &error, int) {
            setErrorMessage(error);
        }
    );
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
    emit activeUserRoleChanged();
}
