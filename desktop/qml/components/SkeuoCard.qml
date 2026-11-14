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
    border.color: Theme.isDark ? Qt.rgba(1, 1, 1, 0.16) : Qt.rgba(148 / 255, 163 / 255, 184 / 255, 0.45)

    Rectangle {
        anchors.fill: parent
        anchors.margins: 1
        radius: root.cardRadius - 1
        color: "transparent"
        border.width: 1
        border.color: Theme.isDark ? Qt.rgba(1, 1, 1, 0.14) : Qt.rgba(1, 1, 1, 0.9)
    }

    Item {
        id: container
        anchors.fill: parent
        anchors.margins: root.contentPadding
        implicitWidth: childrenRect.width
        implicitHeight: childrenRect.height
    }
}
