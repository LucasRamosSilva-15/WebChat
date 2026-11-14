pragma ComponentBehavior: Bound

import QtQuick
import QtQuick.Layouts
import QtQuick.Controls.Basic
import SkyRipple

Rectangle {
    id: root

    property string pageTitle: "Salas de Conversa"
    property string activeTab: "rooms"
    property bool showBackButton: false
    signal backClicked()
    signal navigateTab(string tab)

    readonly property string resolvedDisplayName: SessionStore.displayName !== "" ? SessionStore.displayName : "Usuário"

    implicitHeight: 56
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
            Layout.preferredWidth: implicitWidth
            Layout.minimumWidth: implicitWidth
            onClicked: root.backClicked()
        }

        RowLayout {
            spacing: 10

            Image {
                source: "qrc:/qt/qml/SkyRipple/assets/icons/skyripple_logo.svg"
                sourceSize.width: 30
                sourceSize.height: 30
                Layout.preferredWidth: 30
                Layout.preferredHeight: 30
                fillMode: Image.PreserveAspectFit
                smooth: true
            }

            ColumnLayout {
                spacing: 0

                Text {
                    text: "SkyRipple"
                    font.family: Theme.fontFamily
                    font.pixelSize: 16
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

        Item {
            id: profileTrigger
            Layout.preferredWidth: profileTriggerRow.implicitWidth
            Layout.preferredHeight: 36

            RowLayout {
                id: profileTriggerRow
                anchors.verticalCenter: parent.verticalCenter
                spacing: 8

                UserAvatar {
                    source: SessionStore.profilePhoto
                    name: root.resolvedDisplayName
                    size: "sm"
                    showStatus: false
                    Layout.preferredWidth: 32
                    Layout.preferredHeight: 32
                }

                ColumnLayout {
                    spacing: 1

                    RowLayout {
                        spacing: 6

                        Text {
                            text: root.resolvedDisplayName
                            font.family: Theme.fontFamily
                            font.pixelSize: 13
                            font.weight: Font.DemiBold
                            color: Theme.textPrimary
                            elide: Text.ElideRight
                            Layout.maximumWidth: 180
                        }

                        SkeuoBadge {
                            visible: SessionStore.role === "admin"
                            text: "ADMIN"
                            roleType: "owner"
                        }
                    }

                    Text {
                        text: "ONLINE"
                        font.family: Theme.fontFamily
                        font.pixelSize: 9
                        font.weight: Font.Bold
                        font.letterSpacing: 0.8
                        color: Theme.isDark ? "#4ade80" : "#16a34a"
                    }
                }
            }

            HoverHandler {
                cursorShape: Qt.PointingHandCursor
            }

            MouseArea {
                anchors.fill: parent
                cursorShape: Qt.PointingHandCursor
                onClicked: {
                    if (profilePopup.opened) {
                        profilePopup.close()
                    } else {
                        profilePopup.open()
                    }
                }
            }

            Popup {
                id: profilePopup
                x: Math.max(-220, profileTrigger.width - width)
                y: profileTrigger.height + 8
                width: 260
                padding: 0
                modal: false
                focus: true
                closePolicy: Popup.CloseOnEscape | Popup.CloseOnPressOutsideParent

                background: SkeuoPanel {
                    panelRadius: 16
                    contentPadding: 0
                    fillContent: true
                }

                contentItem: ColumnLayout {
                    spacing: 0

                    ColumnLayout {
                        Layout.fillWidth: true
                        Layout.margins: 16
                        spacing: 8

                        UserAvatar {
                            Layout.alignment: Qt.AlignHCenter
                            source: SessionStore.profilePhoto
                            name: root.resolvedDisplayName
                            size: "xl"
                            showStatus: true
                            status: "online"
                            Layout.preferredWidth: 64
                            Layout.preferredHeight: 64
                        }

                        RowLayout {
                            Layout.alignment: Qt.AlignHCenter
                            spacing: 6

                            Text {
                                text: root.resolvedDisplayName
                                font.family: Theme.fontFamily
                                font.pixelSize: 14
                                font.weight: Font.Bold
                                color: Theme.textPrimary
                                elide: Text.ElideRight
                                Layout.maximumWidth: 180
                            }

                            SkeuoBadge {
                                visible: SessionStore.role === "admin"
                                text: "ADMIN"
                                roleType: "owner"
                            }
                        }

                        Text {
                            Layout.fillWidth: true
                            horizontalAlignment: Text.AlignHCenter
                            text: SessionStore.email !== "" ? SessionStore.email : "Conectado no SkyRipple"
                            font.family: Theme.fontFamily
                            font.pixelSize: 11
                            color: Theme.textMuted
                            elide: Text.ElideRight
                        }
                    }

                    SkeuoWell {
                        Layout.fillWidth: true
                        wellRadius: 14
                        contentPadding: 10
                        fillContent: true
                        implicitHeight: popupActionsCol.implicitHeight + 20

                        ColumnLayout {
                            id: popupActionsCol
                            anchors.fill: parent
                            spacing: 8

                            SkeuoButton {
                                Layout.fillWidth: true
                                text: Theme.isDark ? "Tema: Claro" : "Tema: Escuro"
                                variant: "secondary"
                                horizontalPadding: 10
                                verticalPadding: 6
                                onClicked: ThemeController.toggleColorMode()
                            }

                            SkeuoButton {
                                Layout.fillWidth: true
                                text: "Sair da Conta"
                                variant: "danger"
                                horizontalPadding: 10
                                verticalPadding: 6
                                onClicked: {
                                    profilePopup.close()
                                    MessageService.stopSync()
                                    RoomService.leaveActiveRoom()
                                    AuthService.logout()
                                }
                            }
                        }
                    }
                }
            }
        }

        SkeuoButton {
            text: Theme.isDark ? "Claro" : "Escuro"
            variant: "secondary"
            horizontalPadding: 12
            verticalPadding: 6
            Layout.preferredWidth: implicitWidth
            Layout.minimumWidth: implicitWidth
            onClicked: ThemeController.toggleColorMode()
        }

        SkeuoButton {
            text: "Sair"
            variant: "danger"
            horizontalPadding: 14
            verticalPadding: 6
            Layout.preferredWidth: implicitWidth
            Layout.minimumWidth: implicitWidth
            onClicked: {
                MessageService.stopSync()
                RoomService.leaveActiveRoom()
                AuthService.logout()
            }
        }
    }
}
