import QtQuick
import QtQuick.Layouts
import QtQuick.Controls.Basic
import SkyRipple

Item {
    id: root

    ScrollView {
        anchors.fill: parent
        contentWidth: availableWidth
        clip: true

        Item {
            width: parent.width
            implicitHeight: Math.max(root.height, stubCard.implicitHeight + 64)

            SkeuoCard {
                id: stubCard
                anchors.centerIn: parent
                width: Math.min(parent.width - 48, 520)
                contentPadding: 30

                ColumnLayout {
                    anchors.left: parent.left
                    anchors.right: parent.right
                    spacing: 18

                    RowLayout {
                        Layout.fillWidth: true
                        spacing: 12

                        Image {
                            Layout.preferredWidth: 48
                            Layout.preferredHeight: 48
                            source: "qrc:/qt/qml/SkyRipple/assets/icons/skyripple_logo.svg"
                            sourceSize.width: 48
                            sourceSize.height: 48
                            fillMode: Image.PreserveAspectFit
                            smooth: true
                        }

                        ColumnLayout {
                            Layout.fillWidth: true
                            spacing: 2

                            Text {
                                text: "Sessão Autenticada"
                                font.family: Theme.fontFamily
                                font.pixelSize: 22
                                font.weight: Font.Bold
                                color: Theme.textPrimary
                            }

                            Text {
                                text: "Conectado em " + AppConfig.apiBaseUrl
                                font.family: Theme.fontFamily
                                font.pixelSize: 12
                                color: Theme.textSecondary
                                elide: Text.ElideMiddle
                                Layout.fillWidth: true
                            }
                        }

                        SkeuoBadge {
                            text: "ONLINE"
                            roleType: "online"
                        }
                    }

                    SkeuoWell {
                        Layout.fillWidth: true
                        contentPadding: 16

                        ColumnLayout {
                            anchors.left: parent.left
                            anchors.right: parent.right
                            spacing: 8

                            Text {
                                text: "NOME DE EXIBIÇÃO"
                                font.family: Theme.fontFamily
                                font.pixelSize: 11
                                font.weight: Font.Bold
                                color: Theme.textMuted
                            }

                            Text {
                                text: SessionStore.displayName.length > 0 ? SessionStore.displayName : "Usuário"
                                font.family: Theme.fontFamily
                                font.pixelSize: 16
                                font.weight: Font.DemiBold
                                color: Theme.textPrimary
                            }

                            Text {
                                text: "E-MAIL"
                                font.family: Theme.fontFamily
                                font.pixelSize: 11
                                font.weight: Font.Bold
                                color: Theme.textMuted
                            }

                            Text {
                                text: SessionStore.email.length > 0 ? SessionStore.email : "-"
                                font.family: Theme.fontFamily
                                font.pixelSize: 14
                                color: Theme.textSecondary
                            }

                            Text {
                                text: "ID DO USUÁRIO"
                                font.family: Theme.fontFamily
                                font.pixelSize: 11
                                font.weight: Font.Bold
                                color: Theme.textMuted
                            }

                            Text {
                                text: SessionStore.userId.length > 0 ? SessionStore.userId : "-"
                                font.family: Theme.fontFamily
                                font.pixelSize: 12
                                color: Theme.textSecondary
                                elide: Text.ElideMiddle
                                Layout.fillWidth: true
                            }
                        }
                    }

                    RowLayout {
                        Layout.fillWidth: true
                        spacing: 10

                        SkeuoButton {
                            Layout.fillWidth: true
                            text: Theme.isDark ? "Mudar para Claro" : "Mudar para Escuro"
                            variant: "secondary"
                            onClicked: ThemeController.toggleColorMode()
                        }

                        SkeuoButton {
                            Layout.fillWidth: true
                            text: "Sair"
                            variant: "danger"
                            onClicked: AuthService.logout()
                        }
                    }
                }
            }
        }
    }
}
