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

    property bool lastAuthenticated: SessionStore.isAuthenticated
    property bool expiredRedirectPending: false

    function handleSessionExpiredRedirect() {
        window.expiredRedirectPending = true
        window.lastAuthenticated = false
        MessageService.stopSync()
        RoomService.leaveActiveRoom()
        stackView.clear()
        stackView.push(loginComponent, { "sessionExpiredNotice": true })
    }

    Component.onCompleted: {
        if (SessionStore.isAuthenticated) {
            AuthService.validateSession()
        }
    }

    onActiveChanged: {
        MessageService.setWindowActive(window.active)
        if (window.active && SessionStore.isAuthenticated) {
            SessionStore.checkTokenExpiration()
        }
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
            const authNow = SessionStore.isAuthenticated
            if (authNow === window.lastAuthenticated) {
                return
            }
            window.lastAuthenticated = authNow
            if (authNow) {
                window.expiredRedirectPending = false
                stackView.clear()
                stackView.push(roomsComponent)
                return
            }
            if (window.expiredRedirectPending) {
                window.expiredRedirectPending = false
                return
            }
            stackView.clear()
            stackView.push(homeComponent)
        }
        function onSessionExpired() {
            window.handleSessionExpiredRedirect()
        }
    }

    Connections {
        target: ApiClient
        function onSessionExpired() {
            window.handleSessionExpiredRedirect()
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
