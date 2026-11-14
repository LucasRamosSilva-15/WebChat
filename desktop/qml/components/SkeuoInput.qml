import QtQuick
import QtQuick.Controls.Basic
import SkyRipple

TextField {
    id: root

    property bool formMode: false
    property int inputRadius: formMode ? 12 : 22
    property string leadingIcon: ""
    property bool showPasswordToggle: false
    property bool passwordVisible: false

    signal passwordToggleClicked()

    implicitWidth: 260
    implicitHeight: 48
    leftPadding: (leadingIcon !== "" ? 36 : (formMode ? 14 : 16)) + 3
    rightPadding: (showPasswordToggle ? 38 : (formMode ? 14 : 16)) + 3
    topPadding: (formMode ? 10 : 9) + 3
    bottomPadding: (formMode ? 10 : 9) + 3

    font.family: Theme.fontFamily
    font.pixelSize: 14
    color: Theme.textPrimary
    placeholderTextColor: Theme.inputPlaceholder
    selectionColor: Theme.primaryMain
    selectedTextColor: "#ffffff"
    verticalAlignment: TextInput.AlignVCenter

    Canvas {
        id: leadingCanvas
        visible: root.leadingIcon !== ""
        width: 16
        height: 16
        anchors.left: parent.left
        anchors.leftMargin: 15
        anchors.verticalCenter: parent.verticalCenter

        Connections {
            target: Theme
            function onIsDarkChanged() {
                leadingCanvas.requestPaint()
            }
        }

        Connections {
            target: root
            function onActiveFocusChanged() {
                leadingCanvas.requestPaint()
            }
            function onLeadingIconChanged() {
                leadingCanvas.requestPaint()
            }
        }

        onPaint: {
            const ctx = getContext("2d")
            ctx.reset()
            ctx.strokeStyle = root.activeFocus ? Theme.primaryMain : Theme.inputPlaceholder
            ctx.lineWidth = 1.6
            ctx.lineCap = "round"
            ctx.lineJoin = "round"

            if (root.leadingIcon === "user") {
                ctx.beginPath()
                ctx.arc(8, 5, 3, 0, Math.PI * 2)
                ctx.stroke()
                ctx.beginPath()
                ctx.arc(8, 14.5, 5, Math.PI * 1.15, Math.PI * 1.85)
                ctx.stroke()
            } else if (root.leadingIcon === "mail") {
                ctx.beginPath()
                ctx.roundedRect(2, 3.5, 12, 9, 1.5, 1.5)
                ctx.stroke()
                ctx.beginPath()
                ctx.moveTo(2.5, 4.5)
                ctx.lineTo(8, 8.8)
                ctx.lineTo(13.5, 4.5)
                ctx.stroke()
            } else if (root.leadingIcon === "lock") {
                ctx.beginPath()
                ctx.roundedRect(3, 7, 10, 6.5, 1.5, 1.5)
                ctx.stroke()
                ctx.beginPath()
                ctx.arc(8, 6.5, 3, Math.PI, 0)
                ctx.stroke()
            } else if (root.leadingIcon === "search") {
                ctx.beginPath()
                ctx.arc(7, 7, 4.5, 0, Math.PI * 2)
                ctx.stroke()
                ctx.beginPath()
                ctx.moveTo(10.5, 10.5)
                ctx.lineTo(13.8, 13.8)
                ctx.stroke()
            } else if (root.leadingIcon === "link") {
                ctx.beginPath()
                ctx.arc(8, 8, 5.5, 0, Math.PI * 2)
                ctx.stroke()
                ctx.beginPath()
                ctx.moveTo(2.5, 8)
                ctx.lineTo(13.5, 8)
                ctx.stroke()
            }
        }
    }

    Item {
        visible: root.showPasswordToggle
        width: 32
        height: parent.height - 6
        anchors.right: parent.right
        anchors.rightMargin: 7
        anchors.verticalCenter: parent.verticalCenter

        Canvas {
            id: eyeCanvas
            width: 16
            height: 16
            anchors.centerIn: parent

            Connections {
                target: Theme
                function onIsDarkChanged() {
                    eyeCanvas.requestPaint()
                }
            }

            Connections {
                target: root
                function onPasswordVisibleChanged() {
                    eyeCanvas.requestPaint()
                }
            }

            onPaint: {
                const ctx = getContext("2d")
                ctx.reset()
                ctx.strokeStyle = eyeHover.hovered ? Theme.textPrimary : Theme.inputPlaceholder
                ctx.lineWidth = 1.6
                ctx.lineCap = "round"
                ctx.lineJoin = "round"

                ctx.beginPath()
                ctx.moveTo(1.5, 8)
                ctx.quadraticCurveTo(8, 2.5, 14.5, 8)
                ctx.quadraticCurveTo(8, 13.5, 1.5, 8)
                ctx.stroke()

                ctx.beginPath()
                ctx.arc(8, 8, 2.1, 0, Math.PI * 2)
                ctx.stroke()

                if (root.passwordVisible) {
                    ctx.beginPath()
                    ctx.moveTo(2.5, 13.5)
                    ctx.lineTo(13.5, 2.5)
                    ctx.stroke()
                }
            }
        }

        HoverHandler {
            id: eyeHover
            cursorShape: Qt.PointingHandCursor
            onHoveredChanged: eyeCanvas.requestPaint()
        }

        MouseArea {
            anchors.fill: parent
            cursorShape: Qt.PointingHandCursor
            onClicked: root.passwordToggleClicked()
        }
    }

    background: Item {
        Rectangle {
            anchors.fill: parent
            radius: root.inputRadius + 3
            color: "transparent"
            border.width: 2
            border.color: Theme.primaryRingFocus
            visible: root.activeFocus
            opacity: 0.45
        }

        Rectangle {
            anchors.fill: parent
            anchors.margins: 3
            radius: root.inputRadius
            clip: true
            border.width: root.activeFocus && !root.formMode ? 2 : 1
            border.color: root.activeFocus ? Theme.primaryMain : Theme.inputBorder

            gradient: Gradient {
                GradientStop {
                    position: 0.0
                    color: root.activeFocus
                        ? Theme.inputFocusBg
                        : (root.formMode
                            ? (Theme.isDark ? "#080d1a" : "#ededed")
                            : Theme.inputBg)
                }
                GradientStop {
                    position: 0.25
                    color: root.activeFocus ? Theme.inputFocusBg : Theme.inputBg
                }
                GradientStop {
                    position: 1.0
                    color: root.activeFocus ? Theme.inputFocusBg : Theme.inputBg
                }
            }

            Rectangle {
                anchors.fill: parent
                anchors.margins: 1
                radius: Math.max(0, root.inputRadius - 1)
                color: "transparent"
                border.width: 1
                border.color: Theme.isDark ? Qt.rgba(0, 0, 0, 0.5) : Qt.rgba(0, 0, 0, 0.08)
                visible: !root.activeFocus
            }
        }
    }
}
