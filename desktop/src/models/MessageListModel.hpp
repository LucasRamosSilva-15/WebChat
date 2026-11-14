#pragma once

#include <QAbstractListModel>
#include <QJsonArray>
#include <QJsonObject>
#include <QList>
#include <QSet>
#include <QString>
#include <QQmlEngine>

class MessageListModel : public QAbstractListModel
{
    Q_OBJECT
    QML_ELEMENT
    Q_PROPERTY(int count READ count NOTIFY countChanged)
    Q_PROPERTY(QString nextCursor READ nextCursor NOTIFY cursorsChanged)
    Q_PROPERTY(QString nextSince READ nextSince NOTIFY cursorsChanged)

public:
    enum Role {
        IdRole = Qt::UserRole + 1,
        RoomIdRole,
        UserIdRole,
        SenderNameRole,
        SenderPhotoRole,
        ContentRole,
        CreatedAtRole,
        FormattedTimeRole,
        IsMeRole,
        CanDeleteRole,
        ImageUrlRole,
        AttachmentUrlRole,
        AttachmentTypeRole,
        AttachmentNameRole,
        AttachmentSizeRole,
        AttachmentKindRole
    };

    struct MessageItem {
        QString id;
        QString roomId;
        QString userId;
        QString senderName;
        QString senderPhoto;
        QString content;
        QString createdAt;
        QString formattedTime;
        bool isMe = false;
        bool canDelete = false;
        QString imageUrl;
        QString attachmentUrl;
        QString attachmentType;
        QString attachmentName;
        qint64 attachmentSize = 0;
        QString attachmentKind;
    };

    explicit MessageListModel(QObject *parent = nullptr);

    int rowCount(const QModelIndex &parent = QModelIndex()) const override;
    QVariant data(const QModelIndex &index, int role = Qt::DisplayRole) const override;
    QHash<int, QByteArray> roleNames() const override;

    int count() const;
    QString nextCursor() const;
    QString nextSince() const;

    void setInitialMessages(const QJsonArray &messages, const QString &nextCursor, const QString &nextSince);
    void prependMessages(const QJsonArray &messages, const QString &nextCursor);
    void appendMessages(const QJsonArray &messages, const QString &nextSince);
    void appendSingleMessage(const QJsonObject &message);
    bool removeById(const QString &messageId);
    void clear();

signals:
    void countChanged();
    void cursorsChanged();

private slots:
    void refreshPermissions();

private:
    MessageItem parseItem(const QJsonObject &obj) const;
    QString formatTimestamp(const QString &isoTimestamp) const;

    QList<MessageItem> m_items;
    QSet<QString> m_ids;
    QString m_nextCursor;
    QString m_nextSince;
};
