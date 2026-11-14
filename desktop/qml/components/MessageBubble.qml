pragma ComponentBehavior: Bound

import QtQuick
import QtQuick.Layouts
import SkyRipple

Item {
    id: root

    property string messageId: ""
    property string senderName: "Usuário"
    property string content: ""
    property string formattedTime: ""
    property bool isMe: false
    property bool canDelete: false

    signal deleteRequested(string messageId)

    readonly property bool isGrande: Theme.bubbleFormat !== "classico"

    width: parent ? parent.width : 600
    implicitHeight: rowWrapper.implicitHeight + (isGrande ? 10 : 6)

    RowLayout {
        id: rowWrapper
        anchors.left: parent.left
        anchors.right: parent.right
        anchors.top: parent.top
        anchors.topMargin: root.isGrande ? 5 : 3
        anchors.leftMargin: 12
        anchors.rightMargin: 12
        spacing: 8

        Item {
            visible: root.isMe
            Layout.fillWidth: true
        }

        ColumnLayout {
            Layout.maximumWidth: Math.min(540, Math.max(260, root.width * 0.72))
            spacing: root.isGrande ? 4 : 2

            RowLayout {
                Layout.alignment: root.isMe ? Qt.AlignRight : Qt.AlignLeft
                spacing: 8
                visible: root.isGrande || !root.isMe

                Text {
                    text: root.isMe ? "Você" : root.senderName
                    font.family: Theme.fontFamily
                    font.pixelSize: 11
                    font.weight: Font.Bold
                    color: root.isMe ? Theme.primaryMain : Theme.textSecondary
                }

                Text {
                    visible: !root.isGrande
                    text: root.formattedTime
                    font.family: Theme.fontFamily
                    font.pixelSize: 10
                    color: Theme.textMuted
                }
            }

            Rectangle {
                id: bubbleRect
                Layout.alignment: root.isMe ? Qt.AlignRight : Qt.AlignLeft
                implicitWidth: Math.min(
                    Math.min(540, Math.max(260, root.width * 0.72)),
                    Math.max(120, bubbleContent.implicitWidth + (root.isGrande ? 30 : 22))
                )
                implicitHeight: bubbleContent.implicitHeight + (root.isGrande ? 20 : 14)

                topLeftRadius: root.isGrande ? 18 : 12
                topRightRadius: root.isGrande ? 18 : 12
                bottomLeftRadius: root.isMe ? (root.isGrande ? 18 : 12) : 2
                bottomRightRadius: root.isMe ? 2 : (root.isGrande ? 18 : 12)

                border.width: 1
                border.color: root.isMe
                    ? (Theme.isDark ? Qt.rgba(1, 1, 1, 0.18) : Theme.primaryDark)
                    : (Theme.isDark ? "#0f172a" : "#cccccc")

                gradient: Gradient {
                    GradientStop {
                        position: 0.0
                        color: root.isMe
                            ? (Theme.isDark ? Theme.primaryMain : Theme.primaryHoverLight)
                            : (Theme.isDark ? "#334155" : "#f9f9f9")
                    }
                    GradientStop {
                        position: 1.0
                        color: root.isMe
                            ? (Theme.isDark ? Theme.primaryDarker : Theme.primaryMain)
                            : (Theme.isDark ? "#1e293b" : "#ebebeb")
                    }
                }

                Rectangle {
                    anchors.fill: parent
                    anchors.margins: 1
                    topLeftRadius: Math.max(0, bubbleRect.topLeftRadius - 1)
                    topRightRadius: Math.max(0, bubbleRect.topRightRadius - 1)
                    bottomLeftRadius: Math.max(0, bubbleRect.bottomLeftRadius - 1)
                    bottomRightRadius: Math.max(0, bubbleRect.bottomRightRadius - 1)
                    color: "transparent"
                    border.width: 1
                    border.color: root.isMe
                        ? (Theme.isDark ? Qt.rgba(1, 1, 1, 0.14) : Qt.rgba(1, 1, 1, 0.4))
                        : (Theme.isDark ? Qt.rgba(1, 1, 1, 0.06) : Qt.rgba(1, 1, 1, 0.9))
                }

                ColumnLayout {
                    id: bubbleContent
                    anchors.fill: parent
                    anchors.leftMargin: root.isGrande ? 15 : 11
                    anchors.rightMargin: root.isGrande ? 15 : 11
                    anchors.topMargin: root.isGrande ? 10 : 7
                    anchors.bottomMargin: root.isGrande ? 10 : 7
                    spacing: 4

                    Text {
                        Layout.fillWidth: true
                        text: root.content
                        wrapMode: Text.Wrap
                        font.family: Theme.fontFamily
                        font.pixelSize: root.isGrande ? 14 : 13
                        font.weight: Font.Normal
                        color: root.isMe ? "#ffffff" : Theme.textPrimary
                    }

                    RowLayout {
                        Layout.fillWidth: true
                        spacing: 10

                        Text {
                            visible: root.isGrande || root.isMe
                            text: root.formattedTime
                            font.family: Theme.fontFamily
                            font.pixelSize: 10
                            color: root.isMe
                                ? Qt.rgba(1, 1, 1, 0.78)
                                : Theme.textMuted
                        }

                        Item {
                            Layout.fillWidth: true
                        }

                        MouseArea {
                            id: deleteMouse
                            visible: root.canDelete
                            implicitWidth: deleteLabel.implicitWidth + 8
                            implicitHeight: deleteLabel.implicitHeight + 2
                            hoverEnabled: true
                            cursorShape: Qt.PointingHandCursor
                            onClicked: root.deleteRequested(root.messageId)

                            Text {
                                id: deleteLabel
                                anchors.centerIn: parent
                                text: "Excluir"
                                font.family: Theme.fontFamily
                                font.pixelSize: 10
                                font.weight: Font.Bold
                                color: root.isMe
                                    ? (deleteMouse.containsMouse ? "#ffffff" : Qt.rgba(1, 1, 1, 0.75))
                                    : (deleteMouse.containsMouse ? "#ef4444" : Theme.textMuted)
                            }
                        }
                    }
                }
            }
        }

        Item {
            visible: !root.isMe
            Layout.fillWidth: true
        }
    }
}
