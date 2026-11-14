#pragma once

#include <QObject>
#include <QString>
#include <QTimer>
#include <QUrl>
#include <QQmlEngine>
#include <QJSEngine>

#include "MessageListModel.hpp"

class MessageService : public QObject
{
    Q_OBJECT
    QML_ELEMENT
    QML_SINGLETON
    Q_PROPERTY(bool busy READ busy NOTIFY busyChanged)
    Q_PROPERTY(bool loadingMore READ loadingMore NOTIFY loadingMoreChanged)
    Q_PROPERTY(bool hasMore READ hasMore NOTIFY hasMoreChanged)
    Q_PROPERTY(bool syncing READ syncing NOTIFY syncingChanged)
    Q_PROPERTY(bool searching READ searching NOTIFY searchingChanged)
    Q_PROPERTY(QString searchQuery READ searchQuery NOTIFY searchChanged)
    Q_PROPERTY(QString errorMessage READ errorMessage NOTIFY errorMessageChanged)
    Q_PROPERTY(QString activeRoomId READ activeRoomId NOTIFY activeRoomIdChanged)
    Q_PROPERTY(MessageListModel *messages READ messages CONSTANT)
    Q_PROPERTY(MessageListModel *searchResults READ searchResults CONSTANT)

public:
    static constexpr qint64 MaxAttachmentBytes = 5 * 1024 * 1024;

    static MessageService *instance();
    static MessageService *create(QQmlEngine *qmlEngine, QJSEngine *jsEngine);

    bool busy() const;
    bool loadingMore() const;
    bool hasMore() const;
    bool syncing() const;
    bool searching() const;
    QString searchQuery() const;
    QString errorMessage() const;
    QString activeRoomId() const;
    MessageListModel *messages();
    MessageListModel *searchResults();

    Q_INVOKABLE void loadInitialMessages(const QString &roomId, int limit = 50);
    Q_INVOKABLE void loadOlderMessages(int limit = 50);
    Q_INVOKABLE void syncNewMessages(int limit = 50);
    Q_INVOKABLE bool sendMessage(const QString &roomId,
                                 const QString &content,
                                 const QString &attachmentDataUrl = QString(),
                                 const QString &attachmentType = QString(),
                                 const QString &attachmentName = QString(),
                                 qint64 attachmentSize = 0);
    Q_INVOKABLE bool sendAttachmentFromFile(const QString &roomId,
                                            const QString &content,
                                            const QUrl &fileUrl);
    Q_INVOKABLE void deleteMessage(const QString &messageId);
    Q_INVOKABLE void searchMessages(const QString &roomId, const QString &query);
    Q_INVOKABLE void clearSearch();
    Q_INVOKABLE void stopSync();
    Q_INVOKABLE void setWindowActive(bool active);
    Q_INVOKABLE void clearError();

signals:
    void busyChanged();
    void loadingMoreChanged();
    void hasMoreChanged();
    void syncingChanged();
    void searchingChanged();
    void searchChanged();
    void errorMessageChanged();
    void activeRoomIdChanged();
    void messageSent();
    void sendFailed(const QString &error);

private:
    explicit MessageService(QObject *parent = nullptr);
    void setBusy(bool value);
    void setLoadingMore(bool value);
    void setHasMore(bool value);
    void setSyncing(bool value);
    void setSearching(bool value);
    void setErrorMessage(const QString &message);
    void updateSyncTimerInterval();

    bool m_busy = false;
    bool m_loadingMore = false;
    bool m_hasMore = false;
    bool m_syncing = false;
    bool m_searching = false;
    bool m_windowActive = true;
    qint64 m_lastSendMs = 0;
    QString m_searchQuery;
    QString m_errorMessage;
    QString m_activeRoomId;
    MessageListModel m_messages;
    MessageListModel m_searchResults;
    QTimer m_syncTimer;
};
