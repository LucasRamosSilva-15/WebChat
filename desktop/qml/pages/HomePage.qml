import QtQuick
import QtQuick.Layouts
import SkyRipple

Item {
    id: root

    signal loginRequested()
    signal registerRequested()
    signal roomsRequested()

    readonly property bool isLoggedIn: SessionStore.isAuthenticated
    readonly property string welcomeName: SessionStore.displayName !== "" ? SessionStore.displayName : "explorador"

    ColumnLayout {
        anchors.centerIn: parent
        width: Math.min(parent.width - 32, 480)
        spacing: 16

        SkeuoCard {
            Layout.fillWidth: true
            cardRadius: 28
            contentPadding: 34

            ColumnLayout {
                anchors.left: parent.left
                anchors.right: parent.right
                spacing: 0

                Image {
                    Layout.alignment: Qt.AlignHCenter
                    Layout.preferredWidth: 80
                    Layout.preferredHeight: 80
                    source: "qrc:/qt/qml/SkyRipple/assets/icons/skyripple_logo.svg"
                    sourceSize.width: 80
                    sourceSize.height: 80
                    fillMode: Image.PreserveAspectFit
                    smooth: true
                }

                Item {
                    Layout.preferredHeight: 16
                }

                Text {
                    Layout.alignment: Qt.AlignHCenter
                    text: "SkyRipple"
                    font.family: Theme.fontFamily
                    font.pixelSize: 34
                    font.weight: Font.Bold
                    color: Theme.textPrimary
                }

                Item {
                    Layout.preferredHeight: 10
                }

                Text {
                    Layout.fillWidth: true
                    Layout.maximumWidth: 380
                    Layout.alignment: Qt.AlignHCenter
                    horizontalAlignment: Text.AlignHCenter
                    wrapMode: Text.WordWrap
                    lineHeight: 1.45
                    textFormat: Text.RichText
                    text: root.isLoggedIn
                        ? ("Bem-vindo de volta, <b style='color:" + (Theme.isDark ? "#38bdf8" : "#0284c7") + ";'>" + root.welcomeName + "</b>! Pronto para conversar?")
                        : "O seu espaço para conversas em tempo real. Deixe as suas ideias fluírem livremente."
                    font.family: Theme.fontFamily
                    font.pixelSize: 14
                    color: Theme.isDark ? "#94a3b8" : "#475569"
                }

                Item {
                    Layout.preferredHeight: 24
                }

                RowLayout {
                    Layout.alignment: Qt.AlignHCenter
                    spacing: 12

                    SkeuoButton {
                        text: root.isLoggedIn ? "Explorar Salas  →" : "Criar conta gratuita  →"
                        variant: "primary"
                        horizontalPadding: 22
                        verticalPadding: 11
                        onClicked: {
                            if (root.isLoggedIn) {
                                root.roomsRequested()
                            } else {
                                root.registerRequested()
                            }
                        }
                    }

                    SkeuoButton {
                        text: root.isLoggedIn ? "Mensagens Diretas" : "Já tenho conta"
                        variant: "secondary"
                        horizontalPadding: 20
                        verticalPadding: 11
                        onClicked: {
                            if (root.isLoggedIn) {
                                root.roomsRequested()
                            } else {
                                root.loginRequested()
                            }
                        }
                    }
                }
            }
        }

        Rectangle {
            Layout.alignment: Qt.AlignHCenter
            implicitWidth: pillRow.implicitWidth + 28
            implicitHeight: pillRow.implicitHeight + 12
            radius: height / 2
            color: Theme.isDark
                ? Qt.rgba(30 / 255, 41 / 255, 59 / 255, 0.72)
                : Qt.rgba(1, 1, 1, 0.72)
            border.width: 1
            border.color: Theme.isDark
                ? Qt.rgba(1, 1, 1, 0.1)
                : Qt.rgba(1, 1, 1, 0.85)

            RowLayout {
                id: pillRow
                anchors.centerIn: parent
                spacing: 8

                Rectangle {
                    Layout.preferredWidth: 6
                    Layout.preferredHeight: 6
                    radius: 3
                    color: "#0ea5e9"
                }

                Text {
                    text: "Salas temáticas"
                    font.family: Theme.fontFamily
                    font.pixelSize: 11
                    font.weight: Font.Medium
                    color: Theme.isDark ? "#cbd5e1" : "#334155"
                }

                Text {
                    text: "•"
                    font.family: Theme.fontFamily
                    font.pixelSize: 11
                    color: Theme.isDark ? "#475569" : "#cbd5e1"
                }

                Text {
                    text: "Mensagens instantâneas"
                    font.family: Theme.fontFamily
                    font.pixelSize: 11
                    color: Theme.isDark ? "#94a3b8" : "#64748b"
                }

                Text {
                    text: "•"
                    font.family: Theme.fontFamily
                    font.pixelSize: 11
                    color: Theme.isDark ? "#475569" : "#cbd5e1"
                }

                Text {
                    text: "100% Nativo"
                    font.family: Theme.fontFamily
                    font.pixelSize: 11
                    color: Theme.isDark ? "#94a3b8" : "#64748b"
                }
            }
        }
    }
}
