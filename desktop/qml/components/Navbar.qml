pragma ComponentBehavior: Bound

import QtQuick
import QtQuick.Layouts
import SkyRipple

Rectangle {
    id: root

    property string pageTitle: "Salas de Conversa"
    property string activeTab: "rooms"
    property bool showBackButton: false
    signal backClicked()
    signal navigateTab(string tab)

    implicitHeight: 58
    radius: 0
    color: Theme.isDark
        ? Qt.rgba(15 / 255, 23 / 255, 42 / 255, 0.90)
        : Qt.rgba(1, 1, 1, 0.88)
    border.width: 1
    border.color: Theme.isDark
        ? Qt.rgba(1, 1, 1, 0.1)
        : Qt.rgba(148 / 255, 163 / 255, 184 / 255, 0.35)

    RowLayout {
        anchors.fill: parent
        anchors.leftMargin: 16
        anchors.rightMargin: 16
        spacing: 12

        SkeuoButton {
            visible: root.showBackButton
            text: "Voltar"
            variant: "secondary"
            horizontalPadding: 12
            verticalPadding: 6
            onClicked: root.backClicked()
        }

        RowLayout {
            spacing: 10

            Image {
                source: "qrc:/qt/qml/SkyRipple/assets/icons/skyripple_logo.svg"
                sourceSize.width: 28
                sourceSize.height: 28
                Layout.preferredWidth: 28
                Layout.preferredHeight: 28
                fillMode: Image.PreserveAspectFit
                smooth: true
            }

            ColumnLayout {
                spacing: 0

                Text {
                    text: "SkyRipple"
                    font.family: Theme.fontFamily
                    font.pixelSize: 15
                    font.weight: Font.Bold
                    color: Theme.textPrimary
                }

                Text {
                    text: root.pageTitle
                    font.family: Theme.fontFamily
                    font.pixelSize: 11
                    font.weight: Font.Medium
                    color: Theme.textMuted
                    elide: Text.ElideRight
                }
            }
        }

        Item {
            Layout.fillWidth: true
        }

        RowLayout {
            visible: root.width >= 760
            spacing: 6

            Repeater {
                model: [
                    { key: "rooms", label: "Salas" },
                    { key: "chat", label: "Chat" },
                    { key: "favorites", label: "Favoritos" }
                ]

                delegate: SkeuoButton {
                    required property var modelData
                    text: modelData.label
                    variant: root.activeTab === modelData.key ? "primary" : "secondary"
                    horizontalPadding: 14
                    verticalPadding: 6
                    onClicked: root.navigateTab(modelData.key)
                }
            }
        }

        Item {
            Layout.fillWidth: true
        }

        RowLayout {
            spacing: 8

            Item {
                Layout.preferredWidth: 28
                Layout.preferredHeight: 28

                Rectangle {
                    anchors.fill: parent
                    radius: 14
                    color: Theme.primaryMain
                    border.width: 1
                    border.color: Theme.isDark ? Qt.rgba(1, 1, 1, 0.22) : "#ffffff"

                    Image {
                        anchors.fill: parent
                        anchors.margins: 1
                        source: SessionStore.profilePhoto
                        fillMode: Image.PreserveAspectCrop
                        visible: status === Image.Ready && SessionStore.profilePhoto !== ""
                        asynchronous: true
                    }

                    Text {
                        anchors.centerIn: parent
                        visible: SessionStore.profilePhoto === ""
                        text: {
                            var n = SessionStore.displayName
                            return n !== "" ? n.charAt(0).toUpperCase() : "U"
                        }
                        font.family: Theme.fontFamily
                        font.pixelSize: 12
                        font.weight: Font.Bold
                        color: "#ffffff"
                    }
                }

                Rectangle {
                    width: 9
                    height: 9
                    radius: 5
                    anchors.right: parent.right
                    anchors.bottom: parent.bottom
                    color: "#10b981"
                    border.width: 1.5
                    border.color: Theme.isDark ? "#0f172a" : "#ffffff"
                }
            }

            Text {
                text: SessionStore.displayName !== "" ? SessionStore.displayName : "Usuário"
                font.family: Theme.fontFamily
                font.pixelSize: 13
                font.weight: Font.DemiBold
                color: Theme.textPrimary
                elide: Text.ElideRight
                Layout.maximumWidth: 180
            }
        }

        SkeuoButton {
            text: Theme.isDark ? "Claro" : "Escuro"
            variant: "secondary"
            horizontalPadding: 12
            verticalPadding: 6
            onClicked: ThemeController.toggleColorMode()
        }

        SkeuoButton {
            text: "Sair"
            variant: "danger"
            horizontalPadding: 14
            verticalPadding: 6
            onClicked: {
                MessageService.stopSync()
                RoomService.leaveActiveRoom()
                AuthService.logout()
            }
        }
    }
}
