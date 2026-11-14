import QtQuick
import SkyRipple

Rectangle {
    id: root

    default property alias contentData: container.data
    property int cardRadius: 28
    property int contentPadding: 28

    implicitWidth: container.implicitWidth + contentPadding * 2
    implicitHeight: container.implicitHeight + contentPadding * 2

    radius: cardRadius
    color: Theme.cardBg
    border.width: 1
    border.color: Theme.cardBorder

    Rectangle {
        anchors.fill: parent
        anchors.margins: -1
        radius: root.cardRadius + 1
        color: "transparent"
        border.width: 1
        border.color: Theme.cardOuterStroke
        z: -1
    }

    Rectangle {
        anchors.left: parent.left
        anchors.right: parent.right
        anchors.top: parent.top
        anchors.leftMargin: root.cardRadius * 0.45
        anchors.rightMargin: root.cardRadius * 0.45
        anchors.topMargin: 1
        height: 1
        color: Theme.cardSpecularTop
        opacity: 0.9
    }

    Item {
        id: container
        anchors.fill: parent
        anchors.margins: root.contentPadding
        implicitWidth: childrenRect.width
        implicitHeight: childrenRect.height
    }
}
