#pragma once

#include <QAbstractListModel>
#include <QJsonArray>
#include <QList>
#include <QString>
#include <QQmlEngine>

class RoomListModel : public QAbstractListModel
{
    Q_OBJECT
    QML_ELEMENT
    Q_PROPERTY(QString searchQuery READ searchQuery WRITE setSearchQuery NOTIFY searchQueryChanged)
    Q_PROPERTY(QString categoryFilter READ categoryFilter WRITE setCategoryFilter NOTIFY categoryFilterChanged)
    Q_PROPERTY(int count READ count NOTIFY countChanged)

public:
    enum Role {
        IdRole = Qt::UserRole + 1,
        NameRole,
        DescriptionRole,
        CategoryRole,
        TypeRole,
        OwnerIdRole,
        MembersCountRole,
        CreatedAtRole
    };

    struct RoomItem {
        QString id;
        QString name;
        QString description;
        QString category;
        QString type;
        QString ownerId;
        int membersCount = 0;
        QString createdAt;
    };

    explicit RoomListModel(QObject *parent = nullptr);

    int rowCount(const QModelIndex &parent = QModelIndex()) const override;
    QVariant data(const QModelIndex &index, int role = Qt::DisplayRole) const override;
    QHash<int, QByteArray> roleNames() const override;

    QString searchQuery() const;
    void setSearchQuery(const QString &query);

    QString categoryFilter() const;
    void setCategoryFilter(const QString &category);

    int count() const;

    void setRooms(const QJsonArray &rooms);
    void clear();

signals:
    void searchQueryChanged();
    void categoryFilterChanged();
    void countChanged();

private:
    void rebuildFilter();

    QList<RoomItem> m_allRooms;
    QList<int> m_filteredIndices;
    QString m_searchQuery;
    QString m_categoryFilter;
};
