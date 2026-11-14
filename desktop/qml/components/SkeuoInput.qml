import QtQuick
import QtQuick.Controls.Basic
import SkyRipple

TextField {
    id: root

    property int inputRadius: 22

    implicitWidth: 260
    implicitHeight: 42
    leftPadding: 16
    rightPadding: 16
    topPadding: 9
    bottomPadding: 9

    font.family: Theme.fontFamily
    font.pixelSize: 14
    color: Theme.textPrimary
    placeholderTextColor: Theme.inputPlaceholder
    selectionColor: Theme.primaryMain
    selectedTextColor: "#ffffff"
    verticalAlignment: TextInput.AlignVCenter

    background: Rectangle {
        radius: root.inputRadius
        color: root.activeFocus ? Theme.inputFocusBg : Theme.inputBg
        border.width: root.activeFocus ? 2 : 1
        border.color: root.activeFocus ? Theme.primaryMain : Theme.inputBorder

        Rectangle {
            anchors.fill: parent
            anchors.margins: 1
            radius: root.inputRadius - 1
            color: "transparent"
            border.width: 1
            border.color: Theme.isDark ? Qt.rgba(0, 0, 0, 0.5) : Qt.rgba(0, 0, 0, 0.08)
            visible: !root.activeFocus
        }

        Rectangle {
            anchors.fill: parent
            anchors.margins: -3
            radius: root.inputRadius + 3
            color: "transparent"
            border.width: 2
            border.color: Theme.primaryRingFocus
            visible: root.activeFocus
            opacity: 0.45
            z: -1
        }
    }
}
