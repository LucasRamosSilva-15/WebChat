#pragma once

#include <QObject>
#include <QString>
#include <QStringList>
#include <QQmlEngine>
#include <QJSEngine>

#include "MemberListModel.hpp"
#include "RoomListModel.hpp"

class RoomService : public QObject
{
    Q_OBJECT
    QML_ELEMENT
    QML_SINGLETON
    Q_PROPERTY(bool busy READ busy NOTIFY busyChanged)
    Q_PROPERTY(bool membersBusy READ membersBusy NOTIFY membersBusyChanged)
    Q_PROPERTY(QString errorMessage READ errorMessage NOTIFY errorMessageChanged)
    Q_PROPERTY(RoomListModel *rooms READ rooms CONSTANT)
    Q_PROPERTY(MemberListModel *members READ members CONSTANT)
    Q_PROPERTY(QString activeRoomId READ activeRoomId NOTIFY activeRoomChanged)
    Q_PROPERTY(QString activeRoomName READ activeRoomName NOTIFY activeRoomChanged)
    Q_PROPERTY(QString activeRoomDescription READ activeRoomDescription NOTIFY activeRoomChanged)
    Q_PROPERTY(QString activeRoomOwnerId READ activeRoomOwnerId NOTIFY activeRoomChanged)
    Q_PROPERTY(QString activeUserRole READ activeUserRole NOTIFY activeUserRoleChanged)
    Q_PROPERTY(int totalUsers READ totalUsers NOTIFY statsChanged)
    Q_PROPERTY(int activeRooms READ activeRooms NOTIFY statsChanged)
    Q_PROPERTY(int pendingReports READ pendingReports NOTIFY statsChanged)
    Q_PROPERTY(QStringList favoriteRoomIds READ favoriteRoomIds NOTIFY favoritesChanged)

public:
    static RoomService *instance();
    static RoomService *create(QQmlEngine *qmlEngine, QJSEngine *jsEngine);

    bool busy() const;
    bool membersBusy() const;
    QString errorMessage() const;
    RoomListModel *rooms();
    MemberListModel *members();

    QString activeRoomId() const;
    QString activeRoomName() const;
    QString activeRoomDescription() const;
    QString activeRoomOwnerId() const;
    QString activeUserRole() const;
    int totalUsers() const;
    int activeRooms() const;
    int pendingReports() const;
    QStringList favoriteRoomIds() const;

    Q_INVOKABLE void fetchRooms();
    Q_INVOKABLE void fetchStats();
    Q_INVOKABLE void fetchFavorites();
    Q_INVOKABLE bool isFavorite(const QString &roomId) const;
    Q_INVOKABLE void toggleFavorite(const QString &roomId, const QString &roomName = QString());
    Q_INVOKABLE void createRoom(const QString &name,
                                const QString &category,
                                const QString &description);
    Q_INVOKABLE void joinRoom(const QString &roomId);
    Q_INVOKABLE void leaveActiveRoom();
    Q_INVOKABLE void fetchMembers(const QString &roomId);
    Q_INVOKABLE void updateMemberRole(const QString &roomId, const QString &userId, const QString &role);
    Q_INVOKABLE void kickMember(const QString &roomId, const QString &userId);
    Q_INVOKABLE void transferOwnership(const QString &roomId, const QString &newOwnerId);
    Q_INVOKABLE void clearError();

signals:
    void busyChanged();
    void membersBusyChanged();
    void errorMessageChanged();
    void activeRoomChanged();
    void activeUserRoleChanged();
    void statsChanged();
    void favoritesChanged();
    void roomCreated(const QString &roomId);
    void roomEntered(const QString &roomId);
    void memberActionSucceeded(const QString &message);

private:
    explicit RoomService(QObject *parent = nullptr);
    void setBusy(bool value);
    void setMembersBusy(bool value);
    void setErrorMessage(const QString &message);
    void applyActiveRoom(const QJsonObject &roomObj);

    bool m_busy = false;
    bool m_membersBusy = false;
    int m_totalUsers = 0;
    int m_activeRooms = 0;
    int m_pendingReports = 0;
    QString m_errorMessage;
    RoomListModel m_rooms;
    MemberListModel m_members;
    QStringList m_favoriteRoomIds;
    QString m_activeRoomId;
    QString m_activeRoomName;
    QString m_activeRoomDescription;
    QString m_activeRoomOwnerId;
};
