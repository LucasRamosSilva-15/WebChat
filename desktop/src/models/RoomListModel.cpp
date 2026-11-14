#include "RoomListModel.hpp"

#include <QJsonObject>

RoomListModel::RoomListModel(QObject *parent)
    : QAbstractListModel(parent)
{
}

int RoomListModel::rowCount(const QModelIndex &parent) const
{
    if (parent.isValid()) {
        return 0;
    }
    return m_filteredIndices.size();
}

QVariant RoomListModel::data(const QModelIndex &index, int role) const
{
    if (!index.isValid() || index.row() < 0 || index.row() >= m_filteredIndices.size()) {
        return {};
    }

    const RoomItem &item = m_allRooms.at(m_filteredIndices.at(index.row()));
    switch (role) {
    case IdRole:
        return item.id;
    case NameRole:
        return item.name;
    case DescriptionRole:
        return item.description;
    case CategoryRole:
        return item.category;
    case TypeRole:
        return item.type;
    case OwnerIdRole:
        return item.ownerId;
    case MembersCountRole:
        return item.membersCount;
    case CreatedAtRole:
        return item.createdAt;
    default:
        return {};
    }
}

QHash<int, QByteArray> RoomListModel::roleNames() const
{
    return {
        {IdRole, "id"},
        {NameRole, "name"},
        {DescriptionRole, "description"},
        {CategoryRole, "category"},
        {TypeRole, "type"},
        {OwnerIdRole, "ownerId"},
        {MembersCountRole, "membersCount"},
        {CreatedAtRole, "createdAt"}
    };
}

QString RoomListModel::searchQuery() const
{
    return m_searchQuery;
}

void RoomListModel::setSearchQuery(const QString &query)
{
    if (m_searchQuery == query) {
        return;
    }
    m_searchQuery = query;
    emit searchQueryChanged();
    rebuildFilter();
}

QString RoomListModel::categoryFilter() const
{
    return m_categoryFilter;
}

void RoomListModel::setCategoryFilter(const QString &category)
{
    if (m_categoryFilter == category) {
        return;
    }
    m_categoryFilter = category;
    emit categoryFilterChanged();
    rebuildFilter();
}

int RoomListModel::count() const
{
    return m_filteredIndices.size();
}

void RoomListModel::setRooms(const QJsonArray &rooms)
{
    m_allRooms.clear();
    m_allRooms.reserve(rooms.size());

    for (const QJsonValue &val : rooms) {
        if (!val.isObject()) {
            continue;
        }
        const QJsonObject obj = val.toObject();
        RoomItem item;
        item.id = obj.value("id").toVariant().toString();
        item.name = obj.value("name").toString();
        item.description = obj.value("description").toString();
        item.category = obj.value("category").toString();
        if (item.category.isEmpty()) {
            item.category = "Casual";
        }
        item.type = obj.value("type").toString();
        if (item.type.isEmpty()) {
            item.type = "public";
        }
        item.ownerId = obj.value("created_by").toVariant().toString();
        if (item.ownerId.isEmpty()) {
            item.ownerId = obj.value("ownerId").toVariant().toString();
        }
        item.membersCount = obj.value("membersCount").toInt(obj.value("members_count").toInt(0));
        item.createdAt = obj.value("created_at").toString();
        if (item.createdAt.isEmpty()) {
            item.createdAt = obj.value("createdAt").toString();
        }
        m_allRooms.append(item);
    }

    rebuildFilter();
}

void RoomListModel::clear()
{
    beginResetModel();
    m_allRooms.clear();
    m_filteredIndices.clear();
    endResetModel();
    emit countChanged();
}

void RoomListModel::rebuildFilter()
{
    const QString queryLower = m_searchQuery.trimmed().toLower();
    const QString cat = m_categoryFilter.trimmed();
    const bool filterByCat = !cat.isEmpty() && cat.compare("Todas", Qt::CaseInsensitive) != 0;

    beginResetModel();
    m_filteredIndices.clear();
    for (int i = 0; i < m_allRooms.size(); ++i) {
        const RoomItem &item = m_allRooms.at(i);
        if (filterByCat && item.category.compare(cat, Qt::CaseInsensitive) != 0) {
            continue;
        }
        if (!queryLower.isEmpty()) {
            const bool matchesName = item.name.toLower().contains(queryLower);
            const bool matchesDesc = item.description.toLower().contains(queryLower);
            const bool matchesCat = item.category.toLower().contains(queryLower);
            if (!matchesName && !matchesDesc && !matchesCat) {
                continue;
            }
        }
        m_filteredIndices.append(i);
    }
    endResetModel();
    emit countChanged();
}
