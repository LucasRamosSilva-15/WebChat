pragma ComponentBehavior: Bound

import QtQuick
import QtQuick.Layouts
import QtQuick.Controls.Basic
import SkyRipple

Item {
    id: root

    property string roomId: ""
    signal backToRoomsRequested()

    property bool loadingOlderSnapshot: false
    property real savedContentHeight: 0
    property real savedContentY: 0
    property bool wasNearBottom: true

    Component.onCompleted: {
        if (root.roomId !== "") {
            MessageService.loadInitialMessages(root.roomId, 50)
        }
    }

    onRoomIdChanged: {
        if (root.roomId !== "") {
            MessageService.loadInitialMessages(root.roomId, 50)
        }
    }

    Connections {
        target: MessageService
        function onMessageSent() {
            composerInput.clear()
            Qt.callLater(function() {
                messageListView.positionViewAtEnd()
            })
        }
    }

    Connections {
        target: MessageService.messages
        function onModelReset() {
            Qt.callLater(function() {
                messageListView.positionViewAtEnd()
            })
        }
        function onRowsAboutToBeInserted(parent, first, last) {
            if (first === 0 && MessageService.loadingMore) {
                root.loadingOlderSnapshot = true
                root.savedContentHeight = messageListView.contentHeight
                root.savedContentY = messageListView.contentY
            } else {
                root.loadingOlderSnapshot = false
                root.wasNearBottom = messageListView.atYEnd ||
                    (messageListView.contentHeight - (messageListView.contentY + messageListView.height) < 100)
            }
        }
        function onRowsInserted(parent, first, last) {
            if (root.loadingOlderSnapshot) {
                root.loadingOlderSnapshot = false
                Qt.callLater(function() {
                    const delta = messageListView.contentHeight - root.savedContentHeight
                    messageListView.contentY = Math.max(0, root.savedContentY + delta)
                })
            } else if (root.wasNearBottom) {
                Qt.callLater(function() {
                    messageListView.positionViewAtEnd()
                })
            }
        }
    }

    ColumnLayout {
        anchors.fill: parent
        spacing: 0

        Navbar {
            Layout.fillWidth: true
            pageTitle: RoomService.activeRoomName !== "" ? RoomService.activeRoomName : "Chat"
            showBackButton: true
            onBackClicked: {
                MessageService.stopSync()
                RoomService.leaveActiveRoom()
                root.backToRoomsRequested()
            }
        }

        ColumnLayout {
            Layout.fillWidth: true
            Layout.fillHeight: true
            Layout.margins: 18
            spacing: 12

            SkeuoPanel {
                Layout.fillWidth: true
                implicitHeight: roomHeaderRow.implicitHeight + 24

                RowLayout {
                    id: roomHeaderRow
                    anchors.fill: parent
                    anchors.margins: 12
                    spacing: 12

                    SkeuoButton {
                        text: "Voltar às Salas"
                        variant: "secondary"
                        onClicked: {
                            MessageService.stopSync()
                            RoomService.leaveActiveRoom()
                            root.backToRoomsRequested()
                        }
                    }

                    ColumnLayout {
                        Layout.fillWidth: true
                        spacing: 2

                        Text {
                            text: RoomService.activeRoomName !== "" ? RoomService.activeRoomName : "Sala"
                            font.family: Theme.fontFamily
                            font.pixelSize: 17
                            font.weight: Font.Bold
                            color: Theme.textPrimary
                            elide: Text.ElideRight
                            Layout.fillWidth: true
                        }

                        Text {
                            visible: RoomService.activeRoomDescription !== ""
                            text: RoomService.activeRoomDescription
                            font.family: Theme.fontFamily
                            font.pixelSize: 12
                            color: Theme.textMuted
                            elide: Text.ElideRight
                            Layout.fillWidth: true
                        }
                    }

                    SkeuoBadge {
                        text: MessageService.syncing ? "Sincronizando..." : "Conectado"
                        roleType: MessageService.syncing ? "moderator" : "online"
                    }

                    SkeuoButton {
                        text: Theme.bubbleFormat === "classico" ? "Bolha: Clássico" : "Bolha: Grande"
                        variant: "secondary"
                        onClicked: {
                            ThemeController.setBubbleFormat(
                                Theme.bubbleFormat === "classico" ? "grande" : "classico"
                            )
                        }
                    }
                }
            }

            Rectangle {
                visible: MessageService.errorMessage !== ""
                Layout.fillWidth: true
                implicitHeight: chatErrorLabel.implicitHeight + 14
                radius: 10
                color: Theme.isDark
                    ? Qt.rgba(239 / 255, 68 / 255, 68 / 255, 0.16)
                    : Qt.rgba(254 / 255, 226 / 255, 226 / 255, 0.9)
                border.width: 1
                border.color: "#ef4444"

                Text {
                    id: chatErrorLabel
                    anchors.fill: parent
                    anchors.margins: 7
                    text: MessageService.errorMessage
                    font.family: Theme.fontFamily
                    font.pixelSize: 12
                    color: Theme.isDark ? "#fca5a5" : "#b91c1c"
                    wrapMode: Text.Wrap
                }
            }

            SkeuoWell {
                Layout.fillWidth: true
                Layout.fillHeight: true

                ListView {
                    id: messageListView
                    anchors.fill: parent
                    anchors.margins: 10
                    clip: true
                    reuseItems: true
                    spacing: 4
                    model: MessageService.messages

                    header: Item {
                        width: messageListView.width
                        height: MessageService.hasMore ? loadMoreBtn.implicitHeight + 16 : 0
                        visible: MessageService.hasMore

                        SkeuoButton {
                            id: loadMoreBtn
                            anchors.centerIn: parent
                            text: MessageService.loadingMore
                                ? "Carregando anteriores..."
                                : "Carregar mensagens anteriores"
                            variant: "secondary"
                            enabled: !MessageService.loadingMore
                            onClicked: MessageService.loadOlderMessages(50)
                        }
                    }

                    delegate: Item {
                        id: msgDelegate
                        required property string id
                        required property string senderName
                        required property string content
                        required property string formattedTime
                        required property bool isMe
                        required property bool canDelete

                        width: messageListView.width
                        height: bubbleItem.implicitHeight

                        MessageBubble {
                            id: bubbleItem
                            width: msgDelegate.width
                            messageId: msgDelegate.id
                            senderName: msgDelegate.senderName
                            content: msgDelegate.content
                            formattedTime: msgDelegate.formattedTime
                            isMe: msgDelegate.isMe
                            canDelete: msgDelegate.canDelete
                            onDeleteRequested: function(msgId) {
                                MessageService.deleteMessage(msgId)
                            }
                        }
                    }

                    ScrollBar.vertical: ScrollBar {
                        policy: ScrollBar.AsNeeded
                    }
                }

                Text {
                    anchors.centerIn: parent
                    visible: !MessageService.busy && MessageService.messages.count === 0
                    text: "Nenhuma mensagem ainda. Seja o primeiro a enviar!"
                    font.family: Theme.fontFamily
                    font.pixelSize: 13
                    color: Theme.textMuted
                }
            }

            SkeuoCard {
                Layout.fillWidth: true
                implicitHeight: composerRow.implicitHeight + 24

                RowLayout {
                    id: composerRow
                    anchors.fill: parent
                    anchors.margins: 12
                    spacing: 10

                    SkeuoInput {
                        id: composerInput
                        Layout.fillWidth: true
                        placeholderText: "Digite sua mensagem..."
                        maximumLength: 1000
                        onAccepted: {
                            MessageService.sendMessage(root.roomId, composerInput.text)
                        }
                    }

                    Text {
                        text: composerInput.text.length + "/1000"
                        font.family: Theme.fontFamily
                        font.pixelSize: 11
                        font.weight: Font.Medium
                        color: composerInput.text.length >= 950 ? "#ef4444" : Theme.textMuted
                    }

                    SkeuoButton {
                        text: "Enviar"
                        variant: "primary"
                        onClicked: {
                            MessageService.sendMessage(root.roomId, composerInput.text)
                        }
                    }
                }
            }
        }
    }
}
