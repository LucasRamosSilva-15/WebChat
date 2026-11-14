import QtQuick
import SkyRipple

Rectangle {
    id: root

    default property alias contentData: container.data
    property int panelRadius: Theme.isDark ? 28 : 22
    property int contentPadding: 20

    implicitWidth: container.implicitWidth + contentPadding * 2
    implicitHeight: container.implicitHeight + contentPadding * 2

    radius: panelRadius
    border.width: 1
    border.color: Theme.panelBorderBottom

    gradient: Gradient {
        GradientStop { position: 0.0; color: Theme.panelTop }
        GradientStop { position: 1.0; color: Theme.panelBottom }
    }

    Rectangle {
        anchors.fill: parent
        anchors.margins: 1
        radius: root.panelRadius - 1
        color: "transparent"
        border.width: 1
        border.color: Theme.panelBorderTop
    }

    Item {
        id: container
        anchors.fill: parent
        anchors.margins: root.contentPadding
        implicitWidth: childrenRect.width
        implicitHeight: childrenRect.height
    }
}
