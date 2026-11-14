import QtQuick
import QtQuick.Layouts
import QtQuick.Controls.Basic
import SkyRipple

Item {
    id: root

    readonly property var accentOptions: [
        { "id": "blue", "label": "Azul", "swatch": "#0071e3" },
        { "id": "green", "label": "Verde", "swatch": "#10b981" },
        { "id": "purple", "label": "Roxo", "swatch": "#a855f7" },
        { "id": "red", "label": "Rosa", "swatch": "#f43f5e" },
        { "id": "slate", "label": "Ardósia", "swatch": "#64748b" }
    ]

    readonly property var bgOptions: [
        { "id": "neutral", "label": "Ardósia" },
        { "id": "classic_blue", "label": "Azul Clássico" },
        { "id": "smooth_gradient", "label": "Gradiente Suave" },
        { "id": "clean_light", "label": "Claro Limpo" }
    ]

    ScrollView {
        anchors.fill: parent
        contentWidth: availableWidth
        clip: true

        Item {
            width: parent.width
            implicitHeight: Math.max(root.height, mainRow.implicitHeight + 64)

            RowLayout {
                id: mainRow
                anchors.centerIn: parent
                width: Math.min(parent.width - 48, 920)
                spacing: 24

                SkeuoCard {
                    Layout.fillWidth: true
                    Layout.preferredWidth: 440
                    Layout.alignment: Qt.AlignTop
                    contentPadding: 28

                    ColumnLayout {
                        anchors.left: parent.left
                        anchors.right: parent.right
                        spacing: 16

                        Image {
                            Layout.alignment: Qt.AlignHCenter
                            Layout.preferredWidth: 72
                            Layout.preferredHeight: 72
                            source: "qrc:/qt/qml/SkyRipple/assets/icons/skyripple_logo.svg"
                            sourceSize.width: 72
                            sourceSize.height: 72
                            fillMode: Image.PreserveAspectFit
                            smooth: true
                        }

                        Text {
                            Layout.alignment: Qt.AlignHCenter
                            text: "SkyRipple"
                            font.family: Theme.fontFamily
                            font.pixelSize: 28
                            font.weight: Font.Bold
                            color: Theme.textPrimary
                        }

                        Text {
                            Layout.fillWidth: true
                            Layout.alignment: Qt.AlignHCenter
                            horizontalAlignment: Text.AlignHCenter
                            wrapMode: Text.WordWrap
                            text: "O seu espaço para conversas em tempo real. Design System nativo em Qt 6 + QML."
                            font.family: Theme.fontFamily
                            font.pixelSize: 13
                            color: Theme.textSecondary
                        }

                        SkeuoWell {
                            Layout.fillWidth: true
                            contentPadding: 14

                            ColumnLayout {
                                anchors.left: parent.left
                                anchors.right: parent.right
                                spacing: 10

                                RowLayout {
                                    Layout.fillWidth: true
                                    spacing: 8

                                    SkeuoBadge {
                                        text: "DONO"
                                        roleType: "owner"
                                    }
                                    SkeuoBadge {
                                        text: "MOD"
                                        roleType: "moderator"
                                    }
                                    SkeuoBadge {
                                        text: "ONLINE"
                                        roleType: "online"
                                    }
                                }

                                SkeuoInput {
                                    Layout.fillWidth: true
                                    placeholderText: "E-mail ou utilizador"
                                }

                                SkeuoInput {
                                    Layout.fillWidth: true
                                    placeholderText: "Senha"
                                    echoMode: TextInput.Password
                                }
                            }
                        }

                        RowLayout {
                            Layout.fillWidth: true
                            spacing: 10

                            SkeuoButton {
                                Layout.fillWidth: true
                                text: "Entrar"
                                variant: "primary"
                            }

                            SkeuoButton {
                                Layout.fillWidth: true
                                text: "Criar Conta"
                                variant: "secondary"
                            }

                            SkeuoButton {
                                text: "Sair"
                                variant: "danger"
                            }
                        }
                    }
                }

                SkeuoPanel {
                    Layout.fillWidth: true
                    Layout.preferredWidth: 420
                    Layout.alignment: Qt.AlignTop
                    contentPadding: 24

                    ColumnLayout {
                        anchors.left: parent.left
                        anchors.right: parent.right
                        spacing: 18

                        Text {
                            text: "Aparência e Tema"
                            font.family: Theme.fontFamily
                            font.pixelSize: 18
                            font.weight: Font.Bold
                            color: Theme.textPrimary
                        }

                        ColumnLayout {
                            Layout.fillWidth: true
                            spacing: 8

                            Text {
                                text: "MODO DE COR"
                                font.family: Theme.fontFamily
                                font.pixelSize: 11
                                font.weight: Font.Bold
                                color: Theme.textMuted
                            }

                            RowLayout {
                                Layout.fillWidth: true
                                spacing: 10

                                SkeuoButton {
                                    Layout.fillWidth: true
                                    text: "Modo Claro"
                                    variant: !Theme.isDark ? "primary" : "secondary"
                                    onClicked: ThemeController.setColorMode("light")
                                }

                                SkeuoButton {
                                    Layout.fillWidth: true
                                    text: "Modo Escuro"
                                    variant: Theme.isDark ? "primary" : "secondary"
                                    onClicked: ThemeController.setColorMode("dark")
                                }
                            }
                        }

                        ColumnLayout {
                            Layout.fillWidth: true
                            spacing: 8

                            Text {
                                text: "COR DE DESTAQUE"
                                font.family: Theme.fontFamily
                                font.pixelSize: 11
                                font.weight: Font.Bold
                                color: Theme.textMuted
                            }

                            RowLayout {
                                Layout.fillWidth: true
                                spacing: 10

                                Repeater {
                                    model: root.accentOptions

                                    delegate: Rectangle {
                                        id: swatchDelegate
                                        required property var modelData
                                        readonly property bool selected: Theme.primaryColorName === modelData.id

                                        width: 40
                                        height: 40
                                        radius: 20
                                        color: modelData.swatch
                                        border.width: selected ? 3 : 1
                                        border.color: selected ? Theme.textPrimary : Qt.rgba(1, 1, 1, 0.45)

                                        Rectangle {
                                            anchors.left: parent.left
                                            anchors.right: parent.right
                                            anchors.top: parent.top
                                            anchors.leftMargin: 8
                                            anchors.rightMargin: 8
                                            anchors.topMargin: 3
                                            height: 10
                                            radius: 5
                                            color: Qt.rgba(1, 1, 1, 0.35)
                                        }

                                        MouseArea {
                                            anchors.fill: parent
                                            cursorShape: Qt.PointingHandCursor
                                            onClicked: ThemeController.setPrimaryColor(swatchDelegate.modelData.id)
                                        }
                                    }
                                }
                            }
                        }

                        ColumnLayout {
                            Layout.fillWidth: true
                            spacing: 8

                            Text {
                                text: "ESTILO DE FUNDO (MODO CLARO)"
                                font.family: Theme.fontFamily
                                font.pixelSize: 11
                                font.weight: Font.Bold
                                color: Theme.textMuted
                            }

                            GridLayout {
                                Layout.fillWidth: true
                                columns: 2
                                columnSpacing: 10
                                rowSpacing: 10

                                Repeater {
                                    model: root.bgOptions

                                    delegate: SkeuoButton {
                                        required property var modelData
                                        Layout.fillWidth: true
                                        text: modelData.label
                                        variant: Theme.bgColorName === modelData.id ? "primary" : "secondary"
                                        onClicked: ThemeController.setBgColor(modelData.id)
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
