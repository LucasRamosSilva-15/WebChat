import QtQuick
import QtQuick.Controls.Basic
import SkyRipple

ApplicationWindow {
    id: window

    width: 1040
    height: 680
    minimumWidth: 800
    minimumHeight: 540
    visible: true
    title: "SkyRipple"
    color: Theme.bgGradientBottom

    Rectangle {
        id: backgroundLayer
        anchors.fill: parent
        z: -10

        gradient: Gradient {
            GradientStop { position: 0.0; color: Theme.bgGradientTop }
            GradientStop { position: 1.0; color: Theme.bgGradientBottom }
        }

        Rectangle {
            anchors.horizontalCenter: parent.horizontalCenter
            anchors.top: parent.top
            anchors.topMargin: -parent.height * 0.25
            width: parent.width * 0.9
            height: parent.height * 0.65
            radius: width / 2
            visible: Theme.isDark
            gradient: Gradient {
                GradientStop { position: 0.0; color: Theme.primaryRing }
                GradientStop { position: 1.0; color: "transparent" }
            }
        }
    }

    HomePage {
        anchors.fill: parent
    }
}
