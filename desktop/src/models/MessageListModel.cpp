#include "MessageListModel.hpp"
#include "SessionStore.hpp"

#include <QDate>
#include <QDateTime>
#include <QTimeZone>

MessageListModel::MessageListModel(QObject *parent)
    : QAbstractListModel(parent)
{
    connect(SessionStore::instance(), &SessionStore::sessionChanged,
            this, &MessageListModel::refreshPermissions);
}

int MessageListModel::rowCount(const QModelIndex &parent) const
{
    if (parent.isValid()) {
        return 0;
    }
    return m_items.size();
}

QVariant MessageListModel::data(const QModelIndex &index, int role) const
{
    if (!index.isValid() || index.row() < 0 || index.row() >= m_items.size()) {
        return {};
    }

    const MessageItem &item = m_items.at(index.row());
    switch (role) {
    case IdRole:
        return item.id;
    case RoomIdRole:
        return item.roomId;
    case UserIdRole:
        return item.userId;
    case SenderNameRole:
        return item.senderName;
    case SenderPhotoRole:
        return item.senderPhoto;
    case ContentRole:
        return item.content;
    case CreatedAtRole:
        return item.createdAt;
    case FormattedTimeRole:
        return item.formattedTime;
    case IsMeRole:
        return item.isMe;
    case CanDeleteRole:
        return item.canDelete;
    default:
        return {};
    }
}

QHash<int, QByteArray> MessageListModel::roleNames() const
{
    return {
        {IdRole, "id"},
        {RoomIdRole, "roomId"},
        {UserIdRole, "userId"},
        {SenderNameRole, "senderName"},
        {SenderPhotoRole, "senderPhoto"},
        {ContentRole, "content"},
        {CreatedAtRole, "createdAt"},
        {FormattedTimeRole, "formattedTime"},
        {IsMeRole, "isMe"},
        {CanDeleteRole, "canDelete"}
    };
}

int MessageListModel::count() const
{
    return m_items.size();
}

QString MessageListModel::nextCursor() const
{
    return m_nextCursor;
}

QString MessageListModel::nextSince() const
{
    return m_nextSince;
}

void MessageListModel::setInitialMessages(const QJsonArray &messages,
                                          const QString &nextCursor,
                                          const QString &nextSince)
{
    beginResetModel();
    m_items.clear();
    m_ids.clear();
    m_items.reserve(messages.size());

    for (const QJsonValue &val : messages) {
        if (!val.isObject()) {
            continue;
        }
        const MessageItem item = parseItem(val.toObject());
        if (item.id.isEmpty() || m_ids.contains(item.id)) {
            continue;
        }
        m_ids.insert(item.id);
        m_items.append(item);
    }

    m_nextCursor = nextCursor;
    if (m_nextCursor.isEmpty() && !m_items.isEmpty()) {
        m_nextCursor = m_items.first().createdAt;
    }

    m_nextSince = nextSince;
    if (m_nextSince.isEmpty() && !m_items.isEmpty()) {
        m_nextSince = m_items.last().createdAt;
    }

    endResetModel();
    emit countChanged();
    emit cursorsChanged();
}

void MessageListModel::prependMessages(const QJsonArray &messages, const QString &nextCursor)
{
    QList<MessageItem> added;
    added.reserve(messages.size());

    for (const QJsonValue &val : messages) {
        if (!val.isObject()) {
            continue;
        }
        const MessageItem item = parseItem(val.toObject());
        if (item.id.isEmpty() || m_ids.contains(item.id)) {
            continue;
        }
        m_ids.insert(item.id);
        added.append(item);
    }

    if (!added.isEmpty()) {
        beginInsertRows(QModelIndex(), 0, added.size() - 1);
        for (int i = added.size() - 1; i >= 0; --i) {
            m_items.prepend(added.at(i));
        }
        endInsertRows();
        emit countChanged();
    }

    if (!nextCursor.isEmpty()) {
        m_nextCursor = nextCursor;
    } else if (!m_items.isEmpty()) {
        m_nextCursor = m_items.first().createdAt;
    } else {
        m_nextCursor.clear();
    }
    emit cursorsChanged();
}

void MessageListModel::appendMessages(const QJsonArray &messages, const QString &nextSince)
{
    QList<MessageItem> added;
    added.reserve(messages.size());

    for (const QJsonValue &val : messages) {
        if (!val.isObject()) {
            continue;
        }
        const MessageItem item = parseItem(val.toObject());
        if (item.id.isEmpty() || m_ids.contains(item.id)) {
            continue;
        }
        m_ids.insert(item.id);
        added.append(item);
    }

    if (!added.isEmpty()) {
        const int startRow = m_items.size();
        beginInsertRows(QModelIndex(), startRow, startRow + added.size() - 1);
        for (const MessageItem &item : added) {
            m_items.append(item);
        }
        endInsertRows();
        emit countChanged();
    }

    if (!nextSince.isEmpty()) {
        m_nextSince = nextSince;
    } else if (!m_items.isEmpty()) {
        m_nextSince = m_items.last().createdAt;
    }
    emit cursorsChanged();
}

void MessageListModel::appendSingleMessage(const QJsonObject &message)
{
    const MessageItem item = parseItem(message);
    if (item.id.isEmpty() || m_ids.contains(item.id)) {
        return;
    }

    const int row = m_items.size();
    beginInsertRows(QModelIndex(), row, row);
    m_ids.insert(item.id);
    m_items.append(item);
    endInsertRows();

    if (!item.createdAt.isEmpty()) {
        m_nextSince = item.createdAt;
        if (m_nextCursor.isEmpty()) {
            m_nextCursor = item.createdAt;
        }
        emit cursorsChanged();
    }
    emit countChanged();
}

bool MessageListModel::removeById(const QString &messageId)
{
    for (int i = 0; i < m_items.size(); ++i) {
        if (m_items.at(i).id == messageId) {
            beginRemoveRows(QModelIndex(), i, i);
            m_items.removeAt(i);
            m_ids.remove(messageId);
            endRemoveRows();
            emit countChanged();
            return true;
        }
    }
    return false;
}

void MessageListModel::clear()
{
    beginResetModel();
    m_items.clear();
    m_ids.clear();
    m_nextCursor.clear();
    m_nextSince.clear();
    endResetModel();
    emit countChanged();
    emit cursorsChanged();
}

void MessageListModel::refreshPermissions()
{
    if (m_items.isEmpty()) {
        return;
    }
    const QString currentUserId = SessionStore::instance()->userId();
    const bool isAdmin = SessionStore::instance()->role() == "admin";

    for (MessageItem &item : m_items) {
        item.isMe = !item.userId.isEmpty() && item.userId == currentUserId;
        item.canDelete = item.isMe || isAdmin;
    }
    emit dataChanged(index(0), index(m_items.size() - 1), {IsMeRole, CanDeleteRole});
}

MessageListModel::MessageItem MessageListModel::parseItem(const QJsonObject &obj) const
{
    MessageItem item;
    item.id = obj.value("id").toVariant().toString();
    if (item.id.isEmpty()) {
        item.id = obj.value("messageId").toVariant().toString();
    }
    item.roomId = obj.value("room_id").toVariant().toString();
    if (item.roomId.isEmpty()) {
        item.roomId = obj.value("roomId").toVariant().toString();
    }

    const QJsonObject userObj = obj.value("user").toObject();
    item.userId = obj.value("user_id").toVariant().toString();
    if (item.userId.isEmpty()) {
        item.userId = obj.value("userId").toVariant().toString();
    }
    if (item.userId.isEmpty()) {
        item.userId = userObj.value("id").toVariant().toString();
    }

    item.senderName = userObj.value("displayName").toString();
    if (item.senderName.isEmpty()) {
        item.senderName = userObj.value("name").toString();
    }
    if (item.senderName.isEmpty()) {
        item.senderName = obj.value("sender_name").toString();
    }
    if (item.senderName.isEmpty()) {
        item.senderName = obj.value("sender").toString();
    }
    if (item.senderName.isEmpty()) {
        item.senderName = "Usuário";
    }

    item.senderPhoto = userObj.value("profilePhoto").toString();
    if (item.senderPhoto.isEmpty()) {
        item.senderPhoto = userObj.value("avatar_url").toString();
    }
    if (item.senderPhoto.isEmpty()) {
        item.senderPhoto = obj.value("sender_photo").toString();
    }

    item.content = obj.value("content").toString();
    item.createdAt = obj.value("created_at").toString();
    if (item.createdAt.isEmpty()) {
        item.createdAt = obj.value("createdAt").toString();
    }
    item.formattedTime = formatTimestamp(item.createdAt);

    const QString currentUserId = SessionStore::instance()->userId();
    const bool isAdmin = SessionStore::instance()->role() == "admin";
    item.isMe = !item.userId.isEmpty() && item.userId == currentUserId;
    item.canDelete = item.isMe || isAdmin;

    return item;
}

QString MessageListModel::formatTimestamp(const QString &isoTimestamp) const
{
    if (isoTimestamp.isEmpty()) {
        return QDateTime::currentDateTime().toString("HH:mm");
    }

    QDateTime dt = QDateTime::fromString(isoTimestamp, Qt::ISODateWithMs);
    if (!dt.isValid()) {
        dt = QDateTime::fromString(isoTimestamp, Qt::ISODate);
    }
    if (!dt.isValid()) {
        return isoTimestamp;
    }

    const QDateTime local = dt.toLocalTime();
    const QDate today = QDate::currentDate();
    if (local.date() == today) {
        return local.toString("HH:mm");
    }
    if (local.date() == today.addDays(-1)) {
        return QString("Ontem às %1").arg(local.toString("HH:mm"));
    }
    return local.toString("dd/MM/yyyy HH:mm");
}
