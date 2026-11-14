#pragma once

#include <QAbstractListModel>
#include <QJsonArray>
#include <QJsonObject>
#include <QList>
#include <QString>
#include <QQmlEngine>

class MemberListModel : public QAbstractListModel
{
    Q_OBJECT
    QML_ELEMENT
    Q_PROPERTY(int count READ count NOTIFY countChanged)

public:
    enum Role {
        IdRole = Qt::UserRole + 1,
        UserIdRole,
        DisplayNameRole,
        EmailRole,
        ProfilePhotoRole,
        RoleRole,
        StatusRole
    };

    struct MemberItem {
        QString id;
        QString userId;
        QString displayName;
        QString email;
        QString profilePhoto;
        QString role;
        QString status;
    };

    explicit MemberListModel(QObject *parent = nullptr);

    int rowCount(const QModelIndex &parent = QModelIndex()) const override;
    QVariant data(const QModelIndex &index, int role = Qt::DisplayRole) const override;
    QHash<int, QByteArray> roleNames() const override;

    int count() const;

    void setMembers(const QJsonArray &members);
    bool updateRoleByUserId(const QString &userId, const QString &newRole);
    bool removeByUserId(const QString &userId);
    QString roleForUserId(const QString &userId) const;
    void clear();

signals:
    void countChanged();

private:
    static MemberItem parseItem(const QJsonObject &obj);
    static int roleRank(const QString &role);
    void sortItems();

    QList<MemberItem> m_items;
};
