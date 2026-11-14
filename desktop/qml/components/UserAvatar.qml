import QtQuick
import QtQuick.Effects
import SkyRipple

Item {
    id: root

    property string source: ""
    property string name: "?"
    property string size: "md"
    property bool showStatus: false
    property string status: "online"
    property bool clickable: false

    signal clicked()

    readonly property int avatarPx: {
        if (size === "xs") return 24
        if (size === "sm") return 32
        if (size === "lg") return 56
        if (size === "xl") return 64
        if (size === "2xl") return 96
        return 40
    }

    readonly property int ringPadding: size === "2xl" ? 3 : 2

    readonly property int fontPx: {
        if (size === "xs") return 10
        if (size === "sm") return 12
        if (size === "lg") return 18
        if (size === "xl") return 22
        if (size === "2xl") return 32
        return 14
    }

    readonly property int statusPx: {
        if (size === "xs") return 8
        if (size === "sm") return 10
        if (size === "lg") return 14
        if (size === "xl") return 16
        if (size === "2xl") return 20
        return 12
    }

    readonly property string initial: {
        var clean = name.trim()
        return clean !== "" ? clean.charAt(0).toUpperCase() : "?"
    }

    implicitWidth: avatarPx
    implicitHeight: avatarPx
    width: avatarPx
    height: avatarPx

    scale: root.clickable && avatarHover.hovered ? 1.05 : 1.0
    Behavior on scale {
        NumberAnimation { duration: 180; easing.type: Easing.OutQuad }
    }

    Rectangle {
        id: ringRect
        anchors.fill: parent
        radius: width / 2
        gradient: Gradient {
            GradientStop { position: 0.0; color: Theme.isDark ? "#0369a1" : "#38bdf8" }
            GradientStop { position: 1.0; color: Theme.isDark ? "#0c4a6e" : "#0284c7" }
        }

        Rectangle {
            id: innerRect
            anchors.fill: parent
            anchors.margins: root.ringPadding
            radius: width / 2
            gradient: Gradient {
                GradientStop { position: 0.0; color: Theme.isDark ? "#374151" : "#ffffff" }
                GradientStop { position: 1.0; color: Theme.isDark ? "#1f2937" : "#f9fafb" }
            }

            Rectangle {
                id: avatarMask
                anchors.fill: parent
                radius: width / 2
                color: "#ffffff"
                visible: false
                layer.enabled: true
            }

            Image {
                id: avatarImg
                anchors.fill: parent
                source: root.source
                fillMode: Image.PreserveAspectCrop
                asynchronous: true
                visible: false
            }

            MultiEffect {
                anchors.fill: avatarImg
                source: avatarImg
                visible: root.source !== "" && avatarImg.status === Image.Ready
                maskEnabled: true
                maskSource: avatarMask
            }

            Text {
                anchors.centerIn: parent
                visible: !(root.source !== "" && avatarImg.status === Image.Ready)
                text: root.initial
                font.family: Theme.fontFamily
                font.pixelSize: root.fontPx
                font.weight: Font.DemiBold
                color: Theme.isDark ? "#f3f4f6" : "#374151"
            }
        }
    }

    Rectangle {
        visible: root.showStatus
        width: root.statusPx
        height: root.statusPx
        radius: width / 2
        anchors.right: parent.right
        anchors.bottom: parent.bottom
        border.width: 1.5
        border.color: Theme.isDark ? "#0f172a" : "#ffffff"

        gradient: Gradient {
            GradientStop {
                position: 0.0
                color: {
                    if (root.status === "offline") return "#9ca3af"
                    if (root.status === "busy") return "#f87171"
                    if (root.status === "away") return "#fbbf24"
                    return "#34d399"
                }
            }
            GradientStop {
                position: 1.0
                color: {
                    if (root.status === "offline") return "#6b7280"
                    if (root.status === "busy") return "#ef4444"
                    if (root.status === "away") return "#f59e0b"
                    return "#10b981"
                }
            }
        }
    }

    HoverHandler {
        id: avatarHover
        enabled: root.clickable
        cursorShape: root.clickable ? Qt.PointingHandCursor : Qt.ArrowCursor
    }

    MouseArea {
        anchors.fill: parent
        enabled: root.clickable
        cursorShape: root.clickable ? Qt.PointingHandCursor : Qt.ArrowCursor
        onClicked: root.clicked()
    }
}
