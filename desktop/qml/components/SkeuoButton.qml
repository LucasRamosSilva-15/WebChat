import QtQuick
import QtQuick.Controls.Basic
import SkyRipple

Button {
    id: root

    property string variant: "primary"
    property int buttonRadius: 12

    horizontalPadding: 18
    verticalPadding: 10

    implicitWidth: Math.max(88, labelItem.implicitWidth + horizontalPadding * 2)
    implicitHeight: Math.max(38, labelItem.implicitHeight + verticalPadding * 2)

    hoverEnabled: true

    contentItem: Text {
        id: labelItem
        text: root.text
        font.family: Theme.fontFamily
        font.pixelSize: 13
        font.weight: Font.DemiBold
        horizontalAlignment: Text.AlignHCenter
        verticalAlignment: Text.AlignVCenter
        color: root.variant === "secondary" ? Theme.secondaryBtnText : "#ffffff"
        opacity: root.enabled ? 1.0 : 0.6
    }

    background: Rectangle {
        id: bgRect
        radius: root.buttonRadius
        border.width: 1
        border.color: {
            if (root.variant === "danger") {
                return root.down ? "#7f1d1d" : Theme.dangerBorder
            }
            if (root.variant === "secondary") {
                return Theme.secondaryBtnBorder
            }
            return Theme.primaryDarker
        }

        gradient: Gradient {
            GradientStop {
                position: 0.0
                color: {
                    if (root.variant === "danger") {
                        if (root.down) return Theme.dangerStop100
                        return root.hovered ? Theme.dangerHover0 : Theme.dangerStop0
                    }
                    if (root.variant === "secondary") {
                        if (root.down) return Theme.secondaryBtnStop100
                        return root.hovered ? Theme.secondaryBtnHover0 : Theme.secondaryBtnStop0
                    }
                    if (root.down) return Theme.primaryDarker
                    return root.hovered ? Theme.primaryHoverLight : Theme.primaryLight
                }
            }
            GradientStop {
                position: 0.50
                color: {
                    if (root.variant === "danger") {
                        if (root.down) return Theme.dangerStop100
                        return root.hovered ? Theme.dangerHover50 : Theme.dangerStop50
                    }
                    if (root.variant === "secondary") {
                        if (root.down) return Theme.secondaryBtnStop100
                        return root.hovered ? Theme.secondaryBtnHover0 : Theme.secondaryBtnStop50
                    }
                    if (root.down) return Theme.primaryDarker
                    return root.hovered ? Theme.primaryHoverMain : Theme.primaryMain
                }
            }
            GradientStop {
                position: 0.51
                color: {
                    if (root.variant === "danger") {
                        if (root.down) return Theme.dangerStop100
                        return root.hovered ? Theme.dangerHover51 : Theme.dangerStop51
                    }
                    if (root.variant === "secondary") {
                        if (root.down) return Theme.secondaryBtnStop100
                        return root.hovered ? Theme.secondaryBtnHover100 : Theme.secondaryBtnStop51
                    }
                    if (root.down) return Theme.primaryDark
                    return root.hovered ? Theme.primaryHoverDark : Theme.primaryDark
                }
            }
            GradientStop {
                position: 1.0
                color: {
                    if (root.variant === "danger") {
                        if (root.down) return "#991b1b"
                        return root.hovered ? Theme.dangerHover100 : Theme.dangerStop100
                    }
                    if (root.variant === "secondary") {
                        if (root.down) return Theme.secondaryBtnStop100
                        return root.hovered ? Theme.secondaryBtnHover100 : Theme.secondaryBtnStop100
                    }
                    if (root.down) return Theme.primaryDark
                    return root.hovered ? Theme.primaryHoverDarker : Theme.primaryDarker
                }
            }
        }

        Rectangle {
            anchors.left: parent.left
            anchors.right: parent.right
            anchors.top: parent.top
            anchors.leftMargin: root.buttonRadius * 0.4
            anchors.rightMargin: root.buttonRadius * 0.4
            anchors.topMargin: 1
            height: 1
            visible: !root.down
            color: root.variant === "secondary"
                ? (Theme.isDark ? Qt.rgba(1, 1, 1, 0.08) : Qt.rgba(1, 1, 1, 0.95))
                : Qt.rgba(1, 1, 1, 0.38)
        }
    }

    scale: root.down ? 0.985 : 1.0
    Behavior on scale {
        NumberAnimation { duration: 90; easing.type: Easing.OutQuad }
    }

    HoverHandler {
        cursorShape: root.enabled ? Qt.PointingHandCursor : Qt.ArrowCursor
    }
}
