pragma ComponentBehavior: Bound

import QtQuick
import QtQuick.Layouts
import QtQuick.Controls.Basic
import QtQuick.Dialogs
import SkyRipple

Item {
    id: root

    property string roomId: ""
    signal backToRoomsRequested()

    property bool showRoomsSidebar: true
    property bool showMembersSidebar: true
    property bool loadingOlderSnapshot: false
    property real savedContentHeight: 0
    property real savedContentY: 0
    property bool wasNearBottom: true

    function loadRoomData() {
        if (root.roomId !== "") {
            MessageService.loadInitialMessages(root.roomId, 50)
            RoomService.fetchMembers(root.roomId)
            if (RoomService.rooms.count === 0) {
                RoomService.fetchRooms()
            }
        }
    }

    Component.onCompleted: loadRoomData()
    onRoomIdChanged: loadRoomData()

    FileDialog {
        id: attachmentDialog
        title: "Selecionar anexo (máx. 5 MB)"
        nameFilters: [
            "Arquivos suportados (*.png *.jpg *.jpeg *.gif *.webp *.pdf *.txt *.mp3 *.wav *.ogg *.doc *.docx *.zip)",
            "Imagens (*.png *.jpg *.jpeg *.gif *.webp)",
            "Todos os arquivos (*)"
        ]
        onAccepted: {
            MessageService.sendAttachmentFromFile(root.roomId, composerInput.text, selectedFile)
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
        target: RoomService
        function onRoomEntered(newRoomId) {
            if (newRoomId !== "" && newRoomId !== root.roomId) {
                root.roomId = newRoomId
            }
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
            activeTab: "chat"
            pageTitle: RoomService.activeRoomName !== "" ? RoomService.activeRoomName : "Chat"
            showBackButton: true
            onBackClicked: {
                MessageService.stopSync()
                RoomService.leaveActiveRoom()
                root.backToRoomsRequested()
            }
            onNavigateTab: function(tab) {
                if (tab === "rooms" || tab === "favorites") {
                    MessageService.stopSync()
                    RoomService.leaveActiveRoom()
                    root.backToRoomsRequested()
                }
            }
        }

        RowLayout {
            Layout.fillWidth: true
            Layout.fillHeight: true
            Layout.margins: 12
            spacing: 12

            SkeuoPanel {
                visible: root.showRoomsSidebar && root.width >= 880
                Layout.preferredWidth: 240
                Layout.minimumWidth: 240
                Layout.maximumWidth: 240
                Layout.fillHeight: true
                contentPadding: 12
                fillContent: true

                ColumnLayout {
                    anchors.fill: parent
                    spacing: 10

                    RowLayout {
                        Layout.fillWidth: true
                        spacing: 6

                        Text {
                            Layout.fillWidth: true
                            Layout.minimumWidth: 0
                            text: "Salas"
                            font.family: Theme.fontFamily
                            font.pixelSize: 14
                            font.weight: Font.Bold
                            color: Theme.textPrimary
                            elide: Text.ElideRight
                        }

                        SkeuoBadge {
                            text: String(RoomService.rooms.count)
                            roleType: "default"
                            Layout.preferredWidth: implicitWidth
                            Layout.minimumWidth: implicitWidth
                        }
                    }

                    SkeuoInput {
                        Layout.fillWidth: true
                        Layout.minimumWidth: 0
                        Layout.preferredHeight: 36
                        placeholderText: "Filtrar salas..."
                        onTextChanged: RoomService.rooms.searchQuery = text
                    }

                    SkeuoWell {
                        Layout.fillWidth: true
                        Layout.fillHeight: true
                        contentPadding: 6
                        fillContent: true

                        ListView {
                            anchors.fill: parent
                            clip: true
                            spacing: 6
                            model: RoomService.rooms

                            delegate: Rectangle {
                                id: sideRoomItem
                                required property string id
                                required property string name
                                required property string category
                                required property int membersCount

                                width: ListView.view.width
                                implicitHeight: sideRoomCol.implicitHeight + 14
                                radius: 10
                                color: sideRoomItem.id === root.roomId
                                    ? (Theme.isDark ? Qt.rgba(59 / 255, 130 / 255, 246 / 255, 0.25) : Qt.rgba(59 / 255, 130 / 255, 246 / 255, 0.14))
                                    : (sideRoomHover.hovered
                                        ? (Theme.isDark ? Qt.rgba(1, 1, 1, 0.06) : Qt.rgba(0, 0, 0, 0.04))
                                        : "transparent")
                                border.width: sideRoomItem.id === root.roomId ? 1 : 0
                                border.color: Theme.primaryMain

                                ColumnLayout {
                                    id: sideRoomCol
                                    anchors.fill: parent
                                    anchors.margins: 7
                                    spacing: 2

                                    Text {
                                        Layout.fillWidth: true
                                        Layout.minimumWidth: 0
                                        text: sideRoomItem.name
                                        font.family: Theme.fontFamily
                                        font.pixelSize: 13
                                        font.weight: sideRoomItem.id === root.roomId ? Font.Bold : Font.DemiBold
                                        color: Theme.textPrimary
                                        elide: Text.ElideRight
                                    }

                                    Text {
                                        Layout.fillWidth: true
                                        Layout.minimumWidth: 0
                                        text: sideRoomItem.category + " • " + sideRoomItem.membersCount
                                        font.family: Theme.fontFamily
                                        font.pixelSize: 10
                                        color: Theme.textMuted
                                        elide: Text.ElideRight
                                    }
                                }

                                HoverHandler {
                                    id: sideRoomHover
                                    cursorShape: Qt.PointingHandCursor
                                }

                                MouseArea {
                                    anchors.fill: parent
                                    onClicked: {
                                        if (sideRoomItem.id !== root.roomId) {
                                            RoomService.joinRoom(sideRoomItem.id)
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }

            ColumnLayout {
                Layout.fillWidth: true
                Layout.fillHeight: true
                Layout.minimumWidth: 320
                spacing: 10

                SkeuoPanel {
                    id: headerPanel
                    Layout.fillWidth: true
                    contentPadding: 10
                    implicitHeight: roomHeaderRow.implicitHeight + 20

                    RowLayout {
                        id: roomHeaderRow
                        objectName: "roomHeaderRow"
                        anchors.fill: parent
                        spacing: 8

                        SkeuoButton {
                            id: toggleRoomsBtn
                            text: "Salas"
                            variant: root.showRoomsSidebar ? "primary" : "secondary"
                            horizontalPadding: 8
                            verticalPadding: 4
                            visible: root.width >= 880
                            Layout.preferredWidth: 74
                            Layout.minimumWidth: 74
                            Layout.preferredHeight: 34
                            onClicked: root.showRoomsSidebar = !root.showRoomsSidebar
                        }

                        ColumnLayout {
                            Layout.fillWidth: true
                            Layout.minimumWidth: 0
                            spacing: 2

                            Text {
                                text: RoomService.activeRoomName !== "" ? RoomService.activeRoomName : "Sala"
                                font.family: Theme.fontFamily
                                font.pixelSize: 16
                                font.weight: Font.Bold
                                color: Theme.textPrimary
                                elide: Text.ElideRight
                                Layout.fillWidth: true
                                Layout.minimumWidth: 0
                            }

                            Text {
                                visible: RoomService.activeRoomDescription !== ""
                                text: RoomService.activeRoomDescription
                                font.family: Theme.fontFamily
                                font.pixelSize: 11
                                color: Theme.textMuted
                                elide: Text.ElideRight
                                Layout.fillWidth: true
                                Layout.minimumWidth: 0
                            }
                        }

                        SkeuoInput {
                            id: chatSearchInput
                            Layout.preferredWidth: 200
                            Layout.minimumWidth: 140
                            Layout.preferredHeight: 34
                            placeholderText: "Buscar na sala..."
                            onTextChanged: {
                                if (text.trim() === "") {
                                    MessageService.clearSearch()
                                }
                            }
                            onAccepted: MessageService.searchMessages(root.roomId, text)
                        }

                        SkeuoButton {
                            id: bubbleModeBtn
                            text: Theme.bubbleFormat === "classico" ? "Clássico" : "Grande"
                            variant: "secondary"
                            horizontalPadding: 8
                            verticalPadding: 4
                            Layout.preferredWidth: 96
                            Layout.minimumWidth: 96
                            Layout.preferredHeight: 34
                            onClicked: {
                                ThemeController.setBubbleFormat(
                                    Theme.bubbleFormat === "classico" ? "grande" : "classico"
                                )
                            }
                        }

                        SkeuoButton {
                            id: toggleMembersBtn
                            text: "Membros"
                            variant: root.showMembersSidebar ? "primary" : "secondary"
                            horizontalPadding: 8
                            verticalPadding: 4
                            visible: root.width >= 760
                            Layout.preferredWidth: 92
                            Layout.minimumWidth: 92
                            Layout.preferredHeight: 34
                            onClicked: root.showMembersSidebar = !root.showMembersSidebar
                        }
                    }
                }

                Rectangle {
                    visible: MessageService.errorMessage !== "" || RoomService.errorMessage !== ""
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
                        text: MessageService.errorMessage !== "" ? MessageService.errorMessage : RoomService.errorMessage
                        font.family: Theme.fontFamily
                        font.pixelSize: 12
                        color: Theme.isDark ? "#fca5a5" : "#b91c1c"
                        wrapMode: Text.Wrap
                    }
                }

                SkeuoWell {
                    Layout.fillWidth: true
                    Layout.fillHeight: true
                    contentPadding: 8
                    fillContent: true

                    ListView {
                        id: messageListView
                        anchors.fill: parent
                        clip: true
                        reuseItems: true
                        spacing: Theme.bubbleFormat === "classico" ? 4 : 8
                        model: MessageService.searchQuery !== "" ? MessageService.searchResults : MessageService.messages

                        header: Item {
                            width: messageListView.width
                            height: MessageService.searchQuery === "" && MessageService.hasMore ? 44 : 0
                            visible: MessageService.searchQuery === "" && MessageService.hasMore

                            SkeuoButton {
                                anchors.centerIn: parent
                                text: MessageService.loadingMore ? "Carregando..." : "Carregar mais antigas"
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
                            required property string imageUrl
                            required property string attachmentUrl
                            required property string attachmentType
                            required property string attachmentName
                            required property double attachmentSize
                            required property string attachmentKind

                            width: messageListView.width
                            implicitHeight: msgBubble.implicitHeight

                            MessageBubble {
                                id: msgBubble
                                width: parent.width
                                messageId: msgDelegate.id
                                senderName: msgDelegate.senderName
                                content: msgDelegate.content
                                formattedTime: msgDelegate.formattedTime
                                isMe: msgDelegate.isMe
                                canDelete: msgDelegate.canDelete
                                imageUrl: msgDelegate.imageUrl
                                attachmentUrl: msgDelegate.attachmentUrl
                                attachmentType: msgDelegate.attachmentType
                                attachmentName: msgDelegate.attachmentName
                                attachmentSize: msgDelegate.attachmentSize
                                attachmentKind: msgDelegate.attachmentKind
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
                        visible: {
                            if (MessageService.searchQuery !== "") {
                                return !MessageService.searching && MessageService.searchResults.count === 0
                            }
                            return !MessageService.busy && MessageService.messages.count === 0
                        }
                        text: MessageService.searchQuery !== ""
                            ? "Nenhuma mensagem encontrada para a busca."
                            : "Nenhuma mensagem ainda. Seja o primeiro a enviar!"
                        font.family: Theme.fontFamily
                        font.pixelSize: 13
                        color: Theme.textMuted
                    }
                }

                SkeuoPanel {
                    id: composerPanel
                    Layout.fillWidth: true
                    contentPadding: 10
                    implicitHeight: composerRow.implicitHeight + 20

                    RowLayout {
                        id: composerRow
                        objectName: "composerRow"
                        anchors.fill: parent
                        spacing: 8

                        SkeuoButton {
                            id: attachBtn
                            text: "Anexar"
                            variant: "secondary"
                            horizontalPadding: 8
                            verticalPadding: 6
                            Layout.preferredWidth: 86
                            Layout.minimumWidth: 86
                            Layout.preferredHeight: 40
                            onClicked: attachmentDialog.open()
                        }

                        SkeuoInput {
                            id: composerInput
                            Layout.fillWidth: true
                            Layout.minimumWidth: 120
                            Layout.preferredHeight: 40
                            placeholderText: "Digite sua mensagem..."
                            maximumLength: 1000
                            onAccepted: {
                                MessageService.sendMessage(root.roomId, composerInput.text)
                            }
                        }

                        Text {
                            id: charCountText
                            text: composerInput.text.length + "/1000"
                            font.family: Theme.fontFamily
                            font.pixelSize: 11
                            font.weight: Font.Medium
                            horizontalAlignment: Text.AlignRight
                            color: composerInput.text.length >= 950 ? "#ef4444" : Theme.textMuted
                            Layout.preferredWidth: 54
                            Layout.minimumWidth: 54
                        }

                        SkeuoButton {
                            id: sendBtn
                            text: "Enviar"
                            variant: "primary"
                            horizontalPadding: 8
                            verticalPadding: 6
                            Layout.preferredWidth: 86
                            Layout.minimumWidth: 86
                            Layout.preferredHeight: 40
                            onClicked: {
                                MessageService.sendMessage(root.roomId, composerInput.text)
                            }
                        }
                    }
                }
            }

            SkeuoPanel {
                visible: root.showMembersSidebar && root.width >= 760
                Layout.preferredWidth: 250
                Layout.minimumWidth: 250
                Layout.maximumWidth: 250
                Layout.fillHeight: true
                contentPadding: 12
                fillContent: true

                ColumnLayout {
                    anchors.fill: parent
                    spacing: 10

                    RowLayout {
                        Layout.fillWidth: true
                        spacing: 6

                        Text {
                            Layout.fillWidth: true
                            Layout.minimumWidth: 0
                            text: "Membros"
                            font.family: Theme.fontFamily
                            font.pixelSize: 14
                            font.weight: Font.Bold
                            color: Theme.textPrimary
                            elide: Text.ElideRight
                        }

                        SkeuoBadge {
                            text: String(RoomService.members.count)
                            roleType: "online"
                            Layout.preferredWidth: implicitWidth
                            Layout.minimumWidth: implicitWidth
                        }
                    }

                    SkeuoWell {
                        Layout.fillWidth: true
                        Layout.fillHeight: true
                        contentPadding: 6
                        fillContent: true

                        ListView {
                            anchors.fill: parent
                            clip: true
                            spacing: 8
                            model: RoomService.members

                            delegate: Rectangle {
                                id: memberDelegate
                                required property string userId
                                required property string displayName
                                required property string email
                                required property string profilePhoto
                                required property string role
                                required property string status

                                readonly property bool isSelf: memberDelegate.userId === SessionStore.userId
                                readonly property bool amOwner: RoomService.activeUserRole === "owner" || SessionStore.role === "admin"
                                readonly property bool amMod: RoomService.activeUserRole === "moderator"
                                readonly property bool canModerate: !isSelf && memberDelegate.role !== "owner" && (amOwner || (amMod && memberDelegate.role === "user"))

                                width: ListView.view.width
                                implicitHeight: memberCol.implicitHeight + 14
                                radius: 10
                                clip: true
                                color: Theme.isDark ? Qt.rgba(1, 1, 1, 0.04) : Qt.rgba(1, 1, 1, 0.72)
                                border.width: 1
                                border.color: Theme.isDark ? Qt.rgba(1, 1, 1, 0.08) : Qt.rgba(0, 0, 0, 0.08)

                                ColumnLayout {
                                    id: memberCol
                                    anchors.fill: parent
                                    anchors.margins: 7
                                    spacing: 6

                                    RowLayout {
                                        Layout.fillWidth: true
                                        spacing: 8

                                        UserAvatar {
                                            source: memberDelegate.profilePhoto
                                            name: memberDelegate.displayName
                                            size: "xs"
                                            showStatus: true
                                            status: memberDelegate.status
                                            Layout.preferredWidth: 24
                                            Layout.preferredHeight: 24
                                        }

                                        Text {
                                            Layout.fillWidth: true
                                            Layout.minimumWidth: 0
                                            text: memberDelegate.displayName
                                            font.family: Theme.fontFamily
                                            font.pixelSize: 12
                                            font.weight: Font.DemiBold
                                            color: Theme.textPrimary
                                            elide: Text.ElideRight
                                        }

                                        SkeuoBadge {
                                            visible: memberDelegate.role === "owner" || memberDelegate.role === "moderator"
                                            text: memberDelegate.role === "owner" ? "DONO" : "MOD"
                                            roleType: memberDelegate.role === "owner" ? "owner" : "moderator"
                                            Layout.preferredWidth: implicitWidth
                                            Layout.minimumWidth: implicitWidth
                                        }
                                    }

                                    RowLayout {
                                        visible: memberDelegate.canModerate
                                        Layout.fillWidth: true
                                        spacing: 4

                                        SkeuoButton {
                                            visible: memberDelegate.amOwner
                                            text: memberDelegate.role === "moderator" ? "Rebaixar" : "Promover"
                                            variant: "secondary"
                                            horizontalPadding: 4
                                            verticalPadding: 3
                                            Layout.fillWidth: true
                                            Layout.minimumWidth: 0
                                            Layout.preferredHeight: 28
                                            onClicked: {
                                                const nextRole = memberDelegate.role === "moderator" ? "user" : "moderator"
                                                RoomService.updateMemberRole(root.roomId, memberDelegate.userId, nextRole)
                                            }
                                        }

                                        SkeuoButton {
                                            visible: memberDelegate.amOwner
                                            text: "Dono"
                                            variant: "secondary"
                                            horizontalPadding: 4
                                            verticalPadding: 3
                                            Layout.preferredWidth: 50
                                            Layout.minimumWidth: 50
                                            Layout.preferredHeight: 28
                                            onClicked: RoomService.transferOwnership(root.roomId, memberDelegate.userId)
                                        }

                                        SkeuoButton {
                                            text: "Expulsar"
                                            variant: "danger"
                                            horizontalPadding: 4
                                            verticalPadding: 3
                                            Layout.fillWidth: true
                                            Layout.minimumWidth: 0
                                            Layout.preferredHeight: 28
                                            onClicked: RoomService.kickMember(root.roomId, memberDelegate.userId)
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}
