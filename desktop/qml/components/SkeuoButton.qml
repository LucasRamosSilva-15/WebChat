import QtQuick
import QtQuick.Controls.Basic
import SkyRipple

Button {
    id: root

    property string variant: "primary"
    property int buttonRadius: 12
    property string iconSource: ""

    horizontalPadding: 18
    verticalPadding: 10

    implicitWidth: Math.max(88, contentRow.implicitWidth + horizontalPadding * 2)
    implicitHeight: Math.max(38, contentRow.implicitHeight + verticalPadding * 2)

    hoverEnabled: true

    contentItem: Item {
        implicitWidth: contentRow.implicitWidth
        implicitHeight: contentRow.implicitHeight

        Row {
            id: contentRow
            anchors.centerIn: parent
            anchors.verticalCenterOffset: root.down ? 1 : 0
            spacing: 8

            Image {
                visible: root.iconSource !== ""
                source: root.iconSource
                sourceSize.width: 16
                sourceSize.height: 16
                width: 16
                height: 16
                anchors.verticalCenter: parent.verticalCenter
                fillMode: Image.PreserveAspectFit
                smooth: true
                opacity: root.enabled ? 1.0 : 0.6
            }

            Text {
                id: labelItem
                text: root.text
                font.family: Theme.fontFamily
                font.pixelSize: 13
                font.weight: Font.DemiBold
                anchors.verticalCenter: parent.verticalCenter
                horizontalAlignment: Text.AlignHCenter
                verticalAlignment: Text.AlignVCenter
                color: root.variant === "secondary" ? (Theme.isDark ? "#f8fafc" : "#1d1d1f") : "#ffffff"
                opacity: root.enabled ? 1.0 : 0.6
            }
        }
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
                if (!Theme.isDark) {
                    if (root.down) return "#888888"
                    return root.hovered ? "#999999" : "#b8b8b8"
                }
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
                        if (!Theme.isDark) {
                            if (root.down) return "#e2e2e2"
                            return root.hovered ? "#ffffff" : "#ffffff"
                        }
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
                        if (!Theme.isDark) {
                            if (root.down) return "#ebebeb"
                            return root.hovered ? "#ffffff" : "#f9f9f9"
                        }
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
                        if (!Theme.isDark) {
                            if (root.down) return "#f4f4f4"
                            return root.hovered ? "#f2f2f2" : "#ececec"
                        }
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
                        if (!Theme.isDark) {
                            if (root.down) return "#fafafa"
                            return root.hovered ? "#e4e4e4" : "#dcdcdc"
                        }
                        if (root.down) return Theme.secondaryBtnStop100
                        return root.hovered ? Theme.secondaryBtnHover100 : Theme.secondaryBtnStop100
                    }
                    if (root.down) return Theme.primaryDark
                    return root.hovered ? Theme.primaryHoverDarker : Theme.primaryDarker
                }
            }
        }

        Rectangle {
            anchors.fill: parent
            anchors.margins: 1
            radius: Math.max(0, root.buttonRadius - 1)
            color: "transparent"
            border.width: 1
            visible: !root.down
            border.color: root.variant === "secondary"
                ? (Theme.isDark ? Qt.rgba(1, 1, 1, 0.14) : Qt.rgba(1, 1, 1, 0.92))
                : Qt.rgba(1, 1, 1, 0.28)
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
