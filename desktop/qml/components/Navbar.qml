pragma ComponentBehavior: Bound

import QtQuick
import QtQuick.Layouts
import SkyRipple

Rectangle {
    id: root

    property string pageTitle: "Salas de Conversa"
    property bool showBackButton: false
    signal backClicked()

    implicitHeight: 62
    radius: 0
    color: Theme.isDark
        ? Qt.rgba(15 / 255, 23 / 255, 42 / 255, 0.88)
        : Qt.rgba(1, 1, 1, 0.86)
    border.width: 1
    border.color: Theme.isDark
        ? Qt.rgba(1, 1, 1, 0.1)
        : Qt.rgba(148 / 255, 163 / 255, 184 / 255, 0.35)

    RowLayout {
        anchors.fill: parent
        anchors.leftMargin: 18
        anchors.rightMargin: 18
        spacing: 14

        SkeuoButton {
            visible: root.showBackButton
            text: "Voltar"
            variant: "secondary"
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
                }
            }
        }

        Item {
            Layout.fillWidth: true
        }

        SkeuoBadge {
            text: SessionStore.displayName !== "" ? SessionStore.displayName : "Usuário"
            roleType: "default"
        }

        SkeuoButton {
            text: Theme.isDark ? "Claro" : "Escuro"
            variant: "secondary"
            onClicked: ThemeController.toggleColorMode()
        }

        SkeuoButton {
            text: "Sair"
            variant: "danger"
            onClicked: {
                MessageService.stopSync()
                RoomService.leaveActiveRoom()
                AuthService.logout()
            }
        }
    }
}
