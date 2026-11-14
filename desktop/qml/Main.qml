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

    function applyRoute(route, props) {
        const curr = stackView.currentItem
        if (curr && curr.objectName === "chatPage" && route !== "chat") {
            MessageService.stopSync()
            RoomService.leaveActiveRoom()
        }

        if (route === "chat" && curr && curr.objectName === "chatPage") {
            const nextRoomId = props && props.roomId ? String(props.roomId) : ""
            if (nextRoomId !== "") {
                curr.roomId = nextRoomId
            }
            return
        }

        let target = homeComponent
        if (route === "login") {
            target = loginComponent
        } else if (route === "register") {
            target = registerComponent
        } else if (route === "rooms") {
            target = roomsComponent
        } else if (route === "chat") {
            target = chatComponent
        }

        stackView.replace(target, props || {})
    }

    function navigateToAuthenticatedRooms() {
        if (!SessionStore.isAuthenticated) {
            return
        }
        window.lastAuthenticated = true
        const curr = stackView.currentItem
        if (curr && (curr.objectName === "roomsPage" || curr.objectName === "chatPage")) {
            return
        }
        NavHistory.reset("rooms", {})
    }

    function handleSessionExpiredRedirect() {
        window.lastAuthenticated = false
        MessageService.stopSync()
        RoomService.leaveActiveRoom()
        NavHistory.reset("login", { "sessionExpiredNotice": true })
    }

    Component.onCompleted: {
        NavHistory.initIfEmpty(SessionStore.isAuthenticated ? "rooms" : "home", {})
        if (SessionStore.isAuthenticated) {
            AuthService.validateSession()
        }
    }

    Shortcut {
        sequences: [StandardKey.Back]
        onActivated: NavHistory.goBack()
    }

    Shortcut {
        sequences: [StandardKey.Forward]
        onActivated: NavHistory.goForward()
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
            onLoginRequested: NavHistory.push("login", {})
            onRegisterRequested: NavHistory.push("register", {})
            onRoomsRequested: NavHistory.push("rooms", {})
        }
    }

    Component {
        id: loginComponent
        LoginPage {
            onRegisterRequested: NavHistory.push("register", {})
            onBackRequested: NavHistory.goBack()
        }
    }

    Component {
        id: registerComponent
        RegisterPage {
            onLoginRequested: NavHistory.push("login", {})
        }
    }

    Component {
        id: roomsComponent
        RoomsPage {
            onRoomOpened: function(roomId) {
                NavHistory.push("chat", { "roomId": roomId })
            }
        }
    }

    Component {
        id: chatComponent
        ChatPage {
            onBackToRoomsRequested: NavHistory.push("rooms", {})
        }
    }

    StackView {
        id: stackView
        anchors.fill: parent
        initialItem: SessionStore.isAuthenticated ? roomsComponent : homeComponent
    }

    Connections {
        target: NavHistory
        function onNavigateRequested(route, props) {
            window.applyRoute(route, props)
        }
    }

    Connections {
        target: SessionStore
        function onSessionChanged() {
            const authNow = SessionStore.isAuthenticated
            if (authNow) {
                window.navigateToAuthenticatedRooms()
                return
            }
            if (!window.lastAuthenticated) {
                return
            }
            window.lastAuthenticated = false
            NavHistory.reset("home", {})
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
        function onLoginSucceeded() {
            window.navigateToAuthenticatedRooms()
        }
        function onRegisterSucceeded() {
            window.navigateToAuthenticatedRooms()
        }
        function onRequestWindowFocus() {
            window.raise()
            window.requestActivate()
        }
    }
}
