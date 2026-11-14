#pragma once

#include <QObject>
#include <QString>
#include <QQmlEngine>
#include <QJSEngine>

#include "RoomListModel.hpp"

class RoomService : public QObject
{
    Q_OBJECT
    QML_ELEMENT
    QML_SINGLETON
    Q_PROPERTY(bool busy READ busy NOTIFY busyChanged)
    Q_PROPERTY(QString errorMessage READ errorMessage NOTIFY errorMessageChanged)
    Q_PROPERTY(RoomListModel *rooms READ rooms CONSTANT)
    Q_PROPERTY(QString activeRoomId READ activeRoomId NOTIFY activeRoomChanged)
    Q_PROPERTY(QString activeRoomName READ activeRoomName NOTIFY activeRoomChanged)
    Q_PROPERTY(QString activeRoomDescription READ activeRoomDescription NOTIFY activeRoomChanged)
    Q_PROPERTY(QString activeRoomOwnerId READ activeRoomOwnerId NOTIFY activeRoomChanged)

public:
    static RoomService *instance();
    static RoomService *create(QQmlEngine *qmlEngine, QJSEngine *jsEngine);

    bool busy() const;
    QString errorMessage() const;
    RoomListModel *rooms();

    QString activeRoomId() const;
    QString activeRoomName() const;
    QString activeRoomDescription() const;
    QString activeRoomOwnerId() const;

    Q_INVOKABLE void fetchRooms();
    Q_INVOKABLE void createRoom(const QString &name,
                                const QString &category,
                                const QString &description);
    Q_INVOKABLE void joinRoom(const QString &roomId);
    Q_INVOKABLE void leaveActiveRoom();
    Q_INVOKABLE void clearError();

signals:
    void busyChanged();
    void errorMessageChanged();
    void activeRoomChanged();
    void roomCreated(const QString &roomId);
    void roomEntered(const QString &roomId);

private:
    explicit RoomService(QObject *parent = nullptr);
    void setBusy(bool value);
    void setErrorMessage(const QString &message);
    void applyActiveRoom(const QJsonObject &roomObj);

    bool m_busy = false;
    QString m_errorMessage;
    RoomListModel m_rooms;
    QString m_activeRoomId;
    QString m_activeRoomName;
    QString m_activeRoomDescription;
    QString m_activeRoomOwnerId;
};
