import QtQuick
import SkyRipple

Rectangle {
    id: root

    property string text: ""
    property string roleType: "default"

    implicitWidth: badgeText.implicitWidth + 20
    implicitHeight: badgeText.implicitHeight + 8
    radius: height / 2
    border.width: 1

    border.color: {
        if (root.roleType === "owner") return Theme.isDark ? "#78350f" : "#fcd34d"
        if (root.roleType === "moderator") return Theme.isDark ? "#4c1d95" : "#6d28d9"
        if (root.roleType === "online") return Theme.isDark ? "#064e3b" : "#047857"
        return Theme.isDark ? "#475569" : "#e5e7eb"
    }

    gradient: Gradient {
        GradientStop {
            position: 0.0
            color: {
                if (root.roleType === "owner") return Theme.isDark ? "#b45309" : "#fbbf24"
                if (root.roleType === "moderator") return Theme.isDark ? "#6d28d9" : "#a78bfa"
                if (root.roleType === "online") return Theme.isDark ? "#047857" : "#34d399"
                return Theme.isDark ? "#334155" : "#ffffff"
            }
        }
        GradientStop {
            position: 1.0
            color: {
                if (root.roleType === "owner") return Theme.isDark ? "#92400e" : "#f59e0b"
                if (root.roleType === "moderator") return Theme.isDark ? "#5b21b6" : "#7c3aed"
                if (root.roleType === "online") return Theme.isDark ? "#065f46" : "#059669"
                return Theme.isDark ? "#1e293b" : "#f3f4f6"
            }
        }
    }

    Rectangle {
        anchors.left: parent.left
        anchors.right: parent.right
        anchors.top: parent.top
        anchors.leftMargin: parent.height * 0.35
        anchors.rightMargin: parent.height * 0.35
        anchors.topMargin: 1
        height: 1
        color: Qt.rgba(1, 1, 1, Theme.isDark ? 0.18 : 0.6)
    }

    Text {
        id: badgeText
        anchors.centerIn: parent
        text: root.text
        font.family: Theme.fontFamily
        font.pixelSize: 11
        font.weight: Font.Bold
        color: {
            if (root.roleType === "owner") return Theme.isDark ? "#fef3c7" : "#78350f"
            if (root.roleType === "moderator") return Theme.isDark ? "#ede9fe" : "#ffffff"
            if (root.roleType === "online") return Theme.isDark ? "#d1fae5" : "#ffffff"
            return Theme.isDark ? "#cbd5e1" : "#4b5563"
        }
    }
}
