pragma ComponentBehavior: Bound

import QtQuick
import QtQuick.Layouts
import QtQuick.Controls.Basic
import SkyRipple

RowLayout {
    id: root

    property bool compact: false

    spacing: 6
    implicitWidth: backButton.Layout.preferredWidth + forwardButton.Layout.preferredWidth + spacing
    implicitHeight: 34

    SkeuoButton {
        id: backButton
        text: root.compact ? "←" : "← Voltar"
        variant: "secondary"
        horizontalPadding: root.compact ? 8 : 12
        verticalPadding: 6
        buttonRadius: 10
        enabled: NavHistory.canGoBack
        opacity: enabled ? 1.0 : 0.45
        Layout.preferredWidth: root.compact ? 38 : Math.max(82, implicitWidth)
        Layout.minimumWidth: Layout.preferredWidth
        Layout.preferredHeight: 34
        ToolTip.visible: hovered
        ToolTip.delay: 400
        ToolTip.text: "Voltar (Alt+←)"
        onClicked: NavHistory.goBack()
    }

    SkeuoButton {
        id: forwardButton
        text: root.compact ? "→" : "Seguir →"
        variant: "secondary"
        horizontalPadding: root.compact ? 8 : 12
        verticalPadding: 6
        buttonRadius: 10
        enabled: NavHistory.canGoForward
        opacity: enabled ? 1.0 : 0.45
        Layout.preferredWidth: root.compact ? 38 : Math.max(84, implicitWidth)
        Layout.minimumWidth: Layout.preferredWidth
        Layout.preferredHeight: 34
        ToolTip.visible: hovered
        ToolTip.delay: 400
        ToolTip.text: "Seguir (Alt+→)"
        onClicked: NavHistory.goForward()
    }
}
