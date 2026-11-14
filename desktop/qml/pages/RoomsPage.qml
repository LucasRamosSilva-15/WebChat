pragma ComponentBehavior: Bound

import QtQuick
import QtQuick.Layouts
import QtQuick.Controls.Basic
import SkyRipple

Item {
    id: root

    signal roomOpened(string roomId)

    property bool createModalOpen: false
    property string selectedCategory: "Todas"
    readonly property var categories: ["Todas", "Casual", "Tecnologia", "Jogos", "Arte", "Estudos"]
    readonly property var modalCategories: ["Casual", "Tecnologia", "Jogos", "Arte", "Estudos"]

    Component.onCompleted: {
        RoomService.fetchRooms()
    }

    Connections {
        target: RoomService
        function onRoomCreated(roomId) {
            root.createModalOpen = false
            newRoomNameInput.text = ""
            newRoomDescInput.text = ""
            newRoomCatCombo.currentIndex = 0
        }
        function onRoomEntered(roomId) {
            root.roomOpened(roomId)
        }
    }

    ColumnLayout {
        anchors.fill: parent
        spacing: 0

        Navbar {
            Layout.fillWidth: true
            pageTitle: "Salas de Conversa"
            showBackButton: false
        }

        Item {
            Layout.fillWidth: true
            Layout.fillHeight: true

            ColumnLayout {
                anchors.fill: parent
                anchors.margins: 24
                spacing: 16

                SkeuoCard {
                    Layout.fillWidth: true
                    implicitHeight: headerCol.implicitHeight + 32

                    ColumnLayout {
                        id: headerCol
                        anchors.fill: parent
                        anchors.margins: 16
                        spacing: 12

                        RowLayout {
                            Layout.fillWidth: true
                            spacing: 12

                            ColumnLayout {
                                Layout.fillWidth: true
                                spacing: 2

                                Text {
                                    text: "Salas de Conversa"
                                    font.family: Theme.fontFamily
                                    font.pixelSize: 22
                                    font.weight: Font.Bold
                                    color: Theme.textPrimary
                                }

                                Text {
                                    text: RoomService.rooms.count === 1
                                        ? "1 sala disponível"
                                        : RoomService.rooms.count + " salas disponíveis"
                                    font.family: Theme.fontFamily
                                    font.pixelSize: 12
                                    color: Theme.textMuted
                                }
                            }

                            SkeuoButton {
                                text: "Atualizar"
                                variant: "secondary"
                                enabled: !RoomService.busy
                                onClicked: RoomService.fetchRooms()
                            }

                            SkeuoButton {
                                text: "Nova Sala"
                                variant: "primary"
                                onClicked: {
                                    RoomService.clearError()
                                    root.createModalOpen = true
                                }
                            }
                        }

                        RowLayout {
                            Layout.fillWidth: true
                            spacing: 10

                            SkeuoInput {
                                id: searchInput
                                Layout.fillWidth: true
                                placeholderText: "Buscar sala por nome, categoria ou descrição..."
                                onTextChanged: RoomService.rooms.searchQuery = text
                            }

                            RowLayout {
                                spacing: 6

                                Repeater {
                                    model: root.categories

                                    SkeuoButton {
                                        required property string modelData
                                        text: modelData
                                        variant: root.selectedCategory === modelData ? "primary" : "secondary"
                                        onClicked: {
                                            root.selectedCategory = modelData
                                            RoomService.rooms.categoryFilter = modelData
                                        }
                                    }
                                }
                            }
                        }
                    }
                }

                Rectangle {
                    visible: RoomService.errorMessage !== ""
                    Layout.fillWidth: true
                    implicitHeight: errorText.implicitHeight + 16
                    radius: 12
                    color: Theme.isDark
                        ? Qt.rgba(239 / 255, 68 / 255, 68 / 255, 0.16)
                        : Qt.rgba(254 / 255, 226 / 255, 226 / 255, 0.9)
                    border.width: 1
                    border.color: "#ef4444"

                    Text {
                        id: errorText
                        anchors.fill: parent
                        anchors.margins: 8
                        text: RoomService.errorMessage
                        font.family: Theme.fontFamily
                        font.pixelSize: 13
                        color: Theme.isDark ? "#fca5a5" : "#b91c1c"
                        wrapMode: Text.Wrap
                    }
                }

                SkeuoWell {
                    Layout.fillWidth: true
                    Layout.fillHeight: true

                    GridView {
                        id: roomsGrid
                        anchors.fill: parent
                        anchors.margins: 12
                        clip: true
                        cellWidth: Math.max(260, Math.floor(width / Math.max(1, Math.floor(width / 290))))
                        cellHeight: 176
                        model: RoomService.rooms

                        delegate: Item {
                            id: roomDelegate
                            required property string id
                            required property string name
                            required property string description
                            required property string category
                            required property int membersCount

                            width: roomsGrid.cellWidth
                            height: roomsGrid.cellHeight

                            SkeuoPanel {
                                anchors.fill: parent
                                anchors.margins: 8

                                ColumnLayout {
                                    anchors.fill: parent
                                    anchors.margins: 16
                                    spacing: 8

                                    RowLayout {
                                        Layout.fillWidth: true
                                        spacing: 8

                                        Text {
                                            Layout.fillWidth: true
                                            text: roomDelegate.name
                                            elide: Text.ElideRight
                                            font.family: Theme.fontFamily
                                            font.pixelSize: 16
                                            font.weight: Font.Bold
                                            color: Theme.textPrimary
                                        }

                                        SkeuoBadge {
                                            text: roomDelegate.category
                                            roleType: "moderator"
                                        }
                                    }

                                    Text {
                                        Layout.fillWidth: true
                                        Layout.fillHeight: true
                                        text: roomDelegate.description !== ""
                                            ? roomDelegate.description
                                            : "Sem descrição disponível."
                                        wrapMode: Text.Wrap
                                        elide: Text.ElideRight
                                        maximumLineCount: 2
                                        font.family: Theme.fontFamily
                                        font.pixelSize: 12
                                        color: Theme.textSecondary
                                    }

                                    RowLayout {
                                        Layout.fillWidth: true
                                        spacing: 8

                                        SkeuoBadge {
                                            text: roomDelegate.membersCount + " membros"
                                            roleType: "default"
                                        }

                                        Item {
                                            Layout.fillWidth: true
                                        }

                                        SkeuoButton {
                                            text: "Entrar"
                                            variant: "primary"
                                            enabled: !RoomService.busy
                                            onClicked: RoomService.joinRoom(roomDelegate.id)
                                        }
                                    }
                                }
                            }
                        }
                    }

                    Text {
                        anchors.centerIn: parent
                        visible: !RoomService.busy && RoomService.rooms.count === 0
                        text: "Nenhuma sala encontrada."
                        font.family: Theme.fontFamily
                        font.pixelSize: 14
                        color: Theme.textMuted
                    }
                }
            }

            Rectangle {
                visible: root.createModalOpen
                anchors.fill: parent
                color: Qt.rgba(0, 0, 0, 0.45)
                z: 50

                MouseArea {
                    anchors.fill: parent
                    onClicked: root.createModalOpen = false
                }

                SkeuoCard {
                    anchors.centerIn: parent
                    width: Math.min(440, parent.width - 40)
                    implicitHeight: modalCol.implicitHeight + 48

                    MouseArea {
                        anchors.fill: parent
                    }

                    ColumnLayout {
                        id: modalCol
                        anchors.fill: parent
                        anchors.margins: 24
                        spacing: 14

                        Text {
                            text: "Criar Nova Sala"
                            font.family: Theme.fontFamily
                            font.pixelSize: 20
                            font.weight: Font.Bold
                            color: Theme.textPrimary
                        }

                        ColumnLayout {
                            Layout.fillWidth: true
                            spacing: 6

                            Text {
                                text: "Nome da Sala"
                                font.family: Theme.fontFamily
                                font.pixelSize: 11
                                font.weight: Font.Bold
                                color: Theme.textMuted
                            }

                            SkeuoInput {
                                id: newRoomNameInput
                                Layout.fillWidth: true
                                placeholderText: "Ex.: Sala Geral"
                            }
                        }

                        ColumnLayout {
                            Layout.fillWidth: true
                            spacing: 6

                            Text {
                                text: "Categoria"
                                font.family: Theme.fontFamily
                                font.pixelSize: 11
                                font.weight: Font.Bold
                                color: Theme.textMuted
                            }

                            ComboBox {
                                id: newRoomCatCombo
                                Layout.fillWidth: true
                                model: root.modalCategories
                            }
                        }

                        ColumnLayout {
                            Layout.fillWidth: true
                            spacing: 6

                            Text {
                                text: "Descrição"
                                font.family: Theme.fontFamily
                                font.pixelSize: 11
                                font.weight: Font.Bold
                                color: Theme.textMuted
                            }

                            SkeuoInput {
                                id: newRoomDescInput
                                Layout.fillWidth: true
                                placeholderText: "Sobre o que é esta sala?"
                            }
                        }

                        RowLayout {
                            Layout.fillWidth: true
                            spacing: 10

                            Item {
                                Layout.fillWidth: true
                            }

                            SkeuoButton {
                                text: "Cancelar"
                                variant: "secondary"
                                onClicked: root.createModalOpen = false
                            }

                            SkeuoButton {
                                text: RoomService.busy ? "Criando..." : "Criar Sala"
                                variant: "primary"
                                enabled: !RoomService.busy
                                onClicked: {
                                    RoomService.createRoom(
                                        newRoomNameInput.text,
                                        newRoomCatCombo.currentText,
                                        newRoomDescInput.text
                                    )
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}
