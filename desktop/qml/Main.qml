pragma ComponentBehavior: Bound

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

    onActiveChanged: {
        MessageService.setWindowActive(window.active)
    }

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

    Component {
        id: homeComponent
        HomePage {
            onLoginRequested: stackView.push(loginComponent)
            onRegisterRequested: stackView.push(registerComponent)
        }
    }

    Component {
        id: loginComponent
        LoginPage {
            onRegisterRequested: stackView.replace(registerComponent)
            onBackRequested: stackView.pop()
        }
    }

    Component {
        id: registerComponent
        RegisterPage {
            onLoginRequested: stackView.replace(loginComponent)
        }
    }

    Component {
        id: roomsComponent
        RoomsPage {
            onRoomOpened: function(roomId) {
                stackView.push(chatComponent, { "roomId": roomId })
            }
        }
    }

    Component {
        id: chatComponent
        ChatPage {
            onBackToRoomsRequested: stackView.pop()
        }
    }

    StackView {
        id: stackView
        anchors.fill: parent
        initialItem: SessionStore.isAuthenticated ? roomsComponent : homeComponent
    }

    Connections {
        target: SessionStore
        function onSessionChanged() {
            stackView.clear()
            stackView.push(SessionStore.isAuthenticated ? roomsComponent : homeComponent)
        }
    }

    Connections {
        target: ApiClient
        function onSessionExpired() {
            MessageService.stopSync()
            RoomService.leaveActiveRoom()
            stackView.clear()
            stackView.push(loginComponent)
        }
    }

    Connections {
        target: AuthService
        function onRequestWindowFocus() {
            window.raise()
            window.requestActivate()
        }
    }
}
