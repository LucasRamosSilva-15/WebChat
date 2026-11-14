import QtQuick
import SkyRipple

Rectangle {
    id: root

    default property alias contentData: container.data
    property int wellRadius: 14
    property int contentPadding: 16
    property bool fillContent: false

    implicitWidth: fillContent ? 200 : container.childrenRect.width + contentPadding * 2
    implicitHeight: fillContent ? 120 : container.childrenRect.height + contentPadding * 2

    radius: wellRadius
    clip: true
    color: Theme.wellBg
    border.width: 1
    border.color: Theme.wellBorderSide

    Rectangle {
        anchors.fill: parent
        anchors.margins: 1
        radius: root.wellRadius - 1
        color: "transparent"
        border.width: 1
        border.color: Theme.isDark ? Qt.rgba(0, 0, 0, 0.45) : Qt.rgba(15 / 255, 23 / 255, 42 / 255, 0.08)
    }

    Item {
        id: container
        anchors.fill: parent
        anchors.margins: root.contentPadding
        clip: true
    }
}
