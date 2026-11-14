#include "MemberListModel.hpp"

#include <algorithm>

MemberListModel::MemberListModel(QObject *parent)
    : QAbstractListModel(parent)
{
}

int MemberListModel::rowCount(const QModelIndex &parent) const
{
    if (parent.isValid()) {
        return 0;
    }
    return m_items.size();
}

QVariant MemberListModel::data(const QModelIndex &index, int role) const
{
    if (!index.isValid() || index.row() < 0 || index.row() >= m_items.size()) {
        return {};
    }

    const MemberItem &item = m_items.at(index.row());
    switch (role) {
    case IdRole:
        return item.id;
    case UserIdRole:
        return item.userId;
    case DisplayNameRole:
        return item.displayName;
    case EmailRole:
        return item.email;
    case ProfilePhotoRole:
        return item.profilePhoto;
    case RoleRole:
        return item.role;
    case StatusRole:
        return item.status;
    default:
        return {};
    }
}

QHash<int, QByteArray> MemberListModel::roleNames() const
{
    return {
        {IdRole, "id"},
        {UserIdRole, "userId"},
        {DisplayNameRole, "displayName"},
        {EmailRole, "email"},
        {ProfilePhotoRole, "profilePhoto"},
        {RoleRole, "role"},
        {StatusRole, "status"}
    };
}

int MemberListModel::count() const
{
    return m_items.size();
}

void MemberListModel::setMembers(const QJsonArray &members)
{
    beginResetModel();
    m_items.clear();
    m_items.reserve(members.size());

    for (const QJsonValue &val : members) {
        if (!val.isObject()) {
            continue;
        }
        const MemberItem item = parseItem(val.toObject());
        if (!item.userId.isEmpty() || !item.id.isEmpty()) {
            m_items.append(item);
        }
    }

    sortItems();
    endResetModel();
    emit countChanged();
}

bool MemberListModel::updateRoleByUserId(const QString &userId, const QString &newRole)
{
    for (int i = 0; i < m_items.size(); ++i) {
        if (m_items.at(i).userId == userId || m_items.at(i).id == userId) {
            beginResetModel();
            m_items[i].role = newRole;
            sortItems();
            endResetModel();
            return true;
        }
    }
    return false;
}

bool MemberListModel::removeByUserId(const QString &userId)
{
    for (int i = 0; i < m_items.size(); ++i) {
        if (m_items.at(i).userId == userId || m_items.at(i).id == userId) {
            beginRemoveRows(QModelIndex(), i, i);
            m_items.removeAt(i);
            endRemoveRows();
            emit countChanged();
            return true;
        }
    }
    return false;
}

QString MemberListModel::roleForUserId(const QString &userId) const
{
    for (const MemberItem &item : m_items) {
        if (item.userId == userId || item.id == userId) {
            return item.role;
        }
    }
    return {};
}

void MemberListModel::clear()
{
    if (m_items.isEmpty()) {
        return;
    }
    beginResetModel();
    m_items.clear();
    endResetModel();
    emit countChanged();
}

MemberListModel::MemberItem MemberListModel::parseItem(const QJsonObject &obj)
{
    MemberItem item;
    QJsonObject userObj = obj.value("User").toObject();
    if (userObj.isEmpty()) {
        userObj = obj.value("user").toObject();
    }

    item.id = obj.value("id").toVariant().toString();
    item.userId = obj.value("user_id").toVariant().toString();
    if (item.userId.isEmpty()) {
        item.userId = obj.value("userId").toVariant().toString();
    }
    if (item.userId.isEmpty()) {
        item.userId = userObj.value("id").toVariant().toString();
    }
    if (item.userId.isEmpty()) {
        item.userId = item.id;
    }

    auto pickNonEmpty = [](std::initializer_list<QString> candidates) -> QString {
        for (const QString &c : candidates) {
            if (!c.trimmed().isEmpty()) {
                return c.trimmed();
            }
        }
        return {};
    };

    item.displayName = pickNonEmpty({
        userObj.value("displayName").toString(),
        userObj.value("display_name").toString(),
        userObj.value("name").toString(),
        obj.value("displayName").toString(),
        obj.value("display_name").toString(),
        obj.value("name").toString()
    });
    if (item.displayName.isEmpty()) {
        item.displayName = "Usuário";
    }

    item.email = pickNonEmpty({
        userObj.value("email").toString(),
        obj.value("email").toString()
    });

    item.profilePhoto = pickNonEmpty({
        userObj.value("profilePhoto").toString(),
        userObj.value("profile_photo").toString(),
        userObj.value("avatar_url").toString(),
        obj.value("profilePhoto").toString(),
        obj.value("profile_photo").toString()
    });

    item.role = pickNonEmpty({
        obj.value("role").toString(),
        obj.value("memberRole").toString()
    }).toLower();
    if (item.role.isEmpty()) {
        item.role = "user";
    }

    item.status = pickNonEmpty({
        userObj.value("status").toString(),
        obj.value("status").toString()
    }).toLower();
    if (item.status.isEmpty()) {
        item.status = "online";
    }

    return item;
}

int MemberListModel::roleRank(const QString &role)
{
    if (role == "owner") {
        return 0;
    }
    if (role == "moderator") {
        return 1;
    }
    return 2;
}

void MemberListModel::sortItems()
{
    std::stable_sort(m_items.begin(), m_items.end(), [](const MemberItem &a, const MemberItem &b) {
        const int rankA = roleRank(a.role);
        const int rankB = roleRank(b.role);
        if (rankA != rankB) {
            return rankA < rankB;
        }
        return QString::localeAwareCompare(a.displayName, b.displayName) < 0;
    });
}
