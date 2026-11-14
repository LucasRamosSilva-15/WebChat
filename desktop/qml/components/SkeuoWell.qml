import QtQuick
import SkyRipple

Rectangle {
    id: root

    default property alias contentData: container.data
    property int wellRadius: 14
    property int contentPadding: 16

    implicitWidth: container.implicitWidth + contentPadding * 2
    implicitHeight: container.implicitHeight + contentPadding * 2

    radius: wellRadius
    color: Theme.wellBg
    border.width: 1
    border.color: Theme.wellBorderSide

    Rectangle {
        anchors.left: parent.left
        anchors.right: parent.right
        anchors.top: parent.top
        anchors.leftMargin: root.wellRadius * 0.35
        anchors.rightMargin: root.wellRadius * 0.35
        height: 1
        color: Theme.wellBorderTop
    }

    Rectangle {
        anchors.left: parent.left
        anchors.right: parent.right
        anchors.bottom: parent.bottom
        anchors.leftMargin: root.wellRadius * 0.35
        anchors.rightMargin: root.wellRadius * 0.35
        anchors.bottomMargin: -1
        height: 1
        color: Theme.wellHighlightBottom
    }

    Item {
        id: container
        anchors.fill: parent
        anchors.margins: root.contentPadding
        implicitWidth: childrenRect.width
        implicitHeight: childrenRect.height
    }
}
