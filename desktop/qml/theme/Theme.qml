pragma Singleton

import QtQuick
import SkyRipple

QtObject {
    id: root

    readonly property bool isDark: ThemeController.isDark
    readonly property string colorMode: ThemeController.colorMode
    readonly property string primaryColorName: ThemeController.primaryColor
    readonly property string bgColorName: ThemeController.bgColor
    readonly property string bubbleFormat: ThemeController.bubbleFormat

    readonly property var accentPalettes: ({
        "blue": {
            "light": "#4da4ff",
            "main": "#0071e3",
            "dark": "#005bb5",
            "darker": "#004488",
            "hoverLight": "#66b3ff",
            "hoverMain": "#1a82ff",
            "hoverDark": "#006ce6",
            "hoverDarker": "#0055a3",
            "ring": Qt.rgba(0, 113 / 255, 227 / 255, 0.14),
            "ringFocus": Qt.rgba(0, 113 / 255, 227 / 255, 0.6)
        },
        "green": {
            "light": "#34d399",
            "main": "#10b981",
            "dark": "#059669",
            "darker": "#047857",
            "hoverLight": "#6ee7b7",
            "hoverMain": "#34d399",
            "hoverDark": "#10b981",
            "hoverDarker": "#059669",
            "ring": Qt.rgba(16 / 255, 185 / 255, 129 / 255, 0.14),
            "ringFocus": Qt.rgba(16 / 255, 185 / 255, 129 / 255, 0.6)
        },
        "purple": {
            "light": "#c084fc",
            "main": "#a855f7",
            "dark": "#9333ea",
            "darker": "#7e22ce",
            "hoverLight": "#d8b4fe",
            "hoverMain": "#c084fc",
            "hoverDark": "#a855f7",
            "hoverDarker": "#9333ea",
            "ring": Qt.rgba(168 / 255, 85 / 255, 247 / 255, 0.14),
            "ringFocus": Qt.rgba(168 / 255, 85 / 255, 247 / 255, 0.6)
        },
        "red": {
            "light": "#fb7185",
            "main": "#f43f5e",
            "dark": "#e11d48",
            "darker": "#be123c",
            "hoverLight": "#fda4af",
            "hoverMain": "#fb7185",
            "hoverDark": "#f43f5e",
            "hoverDarker": "#e11d48",
            "ring": Qt.rgba(244 / 255, 63 / 255, 94 / 255, 0.14),
            "ringFocus": Qt.rgba(244 / 255, 63 / 255, 94 / 255, 0.6)
        },
        "slate": {
            "light": "#94a3b8",
            "main": "#64748b",
            "dark": "#475569",
            "darker": "#334155",
            "hoverLight": "#cbd5e1",
            "hoverMain": "#94a3b8",
            "hoverDark": "#64748b",
            "hoverDarker": "#475569",
            "ring": Qt.rgba(100 / 255, 116 / 255, 139 / 255, 0.14),
            "ringFocus": Qt.rgba(100 / 255, 116 / 255, 139 / 255, 0.6)
        }
    })

    readonly property var currentAccent: accentPalettes[primaryColorName] || accentPalettes["blue"]

    readonly property color primaryLight: currentAccent.light
    readonly property color primaryMain: currentAccent.main
    readonly property color primaryDark: currentAccent.dark
    readonly property color primaryDarker: currentAccent.darker
    readonly property color primaryHoverLight: currentAccent.hoverLight
    readonly property color primaryHoverMain: currentAccent.hoverMain
    readonly property color primaryHoverDark: currentAccent.hoverDark
    readonly property color primaryHoverDarker: currentAccent.hoverDarker
    readonly property color primaryRing: currentAccent.ring
    readonly property color primaryRingFocus: currentAccent.ringFocus

    readonly property color bgGradientTop: {
        if (isDark) return "#111827"
        if (bgColorName === "classic_blue") return "#0280ff"
        if (bgColorName === "smooth_gradient") return "#f8fafc"
        if (bgColorName === "clean_light") return "#f8fafc"
        return "#dbeafe"
    }

    readonly property color bgGradientBottom: {
        if (isDark) return "#0f172a"
        if (bgColorName === "classic_blue") return "#b8dcff"
        if (bgColorName === "smooth_gradient") return "#e2e8f0"
        if (bgColorName === "clean_light") return "#f8fafc"
        return "#f1f5f9"
    }

    readonly property color textPrimary: isDark ? "#f8fafc" : "#1d1d1f"
    readonly property color textSecondary: isDark ? "#94a3b8" : "#424245"
    readonly property color textMuted: isDark ? "#64748b" : "#86868b"

    readonly property color cardBg: isDark ? Qt.rgba(15 / 255, 23 / 255, 42 / 255, 0.85) : Qt.rgba(1, 1, 1, 0.88)
    readonly property color cardBorder: isDark ? Qt.rgba(1, 1, 1, 0.14) : Qt.rgba(1, 1, 1, 0.85)
    readonly property color cardOuterStroke: isDark ? Qt.rgba(0, 0, 0, 0.55) : Qt.rgba(148 / 255, 163 / 255, 184 / 255, 0.35)
    readonly property color cardSpecularTop: isDark ? Qt.rgba(1, 1, 1, 0.16) : Qt.rgba(1, 1, 1, 1.0)

    readonly property color panelTop: isDark ? Qt.rgba(30 / 255, 41 / 255, 59 / 255, 0.78) : "#ffffff"
    readonly property color panelBottom: isDark ? Qt.rgba(15 / 255, 23 / 255, 42 / 255, 0.88) : "#f8fafc"
    readonly property color panelBorderTop: isDark ? Qt.rgba(1, 1, 1, 0.16) : Qt.rgba(1, 1, 1, 0.9)
    readonly property color panelBorderBottom: isDark ? Qt.rgba(1, 1, 1, 0.08) : Qt.rgba(203 / 255, 213 / 255, 225 / 255, 0.7)

    readonly property color wellBg: isDark ? Qt.rgba(15 / 255, 23 / 255, 42 / 255, 0.65) : Qt.rgba(241 / 255, 245 / 255, 249 / 255, 0.75)
    readonly property color wellBorderTop: isDark ? Qt.rgba(2 / 255, 6 / 255, 23 / 255, 0.9) : Qt.rgba(148 / 255, 163 / 255, 184 / 255, 0.75)
    readonly property color wellBorderSide: isDark ? Qt.rgba(51 / 255, 65 / 255, 85 / 255, 0.7) : Qt.rgba(203 / 255, 213 / 255, 225 / 255, 0.95)
    readonly property color wellHighlightBottom: isDark ? Qt.rgba(1, 1, 1, 0.06) : "#ffffff"

    readonly property color inputBg: isDark ? "#0f172a" : "#fafafa"
    readonly property color inputFocusBg: isDark ? "#1e293b" : "#ffffff"
    readonly property color inputBorder: isDark ? "#020617" : "#b3b3b3"
    readonly property color inputBorderTop: isDark ? "#000000" : "#999999"
    readonly property color inputPlaceholder: isDark ? "#64748b" : "#94a3b8"

    readonly property color secondaryBtnStop0: isDark ? "#1e293b" : "#ffffff"
    readonly property color secondaryBtnStop50: isDark ? "#172033" : "#f9f9f9"
    readonly property color secondaryBtnStop51: isDark ? "#131c2e" : "#f0f0f0"
    readonly property color secondaryBtnStop100: isDark ? "#0f172a" : "#e6e6e6"
    readonly property color secondaryBtnHover0: isDark ? "#334155" : "#ffffff"
    readonly property color secondaryBtnHover100: isDark ? "#1e293b" : "#f0f0f0"
    readonly property color secondaryBtnBorder: isDark ? "#020617" : "#cccccc"
    readonly property color secondaryBtnText: isDark ? "#e2e8f0" : "#1d1d1f"

    readonly property color dangerStop0: "#fca5a5"
    readonly property color dangerStop50: "#ef4444"
    readonly property color dangerStop51: "#dc2626"
    readonly property color dangerStop100: "#b91c1c"
    readonly property color dangerHover0: "#fecaca"
    readonly property color dangerHover50: "#f87171"
    readonly property color dangerHover51: "#ef4444"
    readonly property color dangerHover100: "#dc2626"
    readonly property color dangerBorder: isDark ? Qt.rgba(1, 1, 1, 0.16) : "#991b1b"

    readonly property string fontFamily: "Inter"
}
