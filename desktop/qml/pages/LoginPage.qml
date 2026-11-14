import QtQuick
import QtQuick.Layouts
import QtQuick.Controls.Basic
import SkyRipple

Item {
    id: root

    signal registerRequested()
    signal backRequested()

    property bool showPassword: false
    property bool showServerConfig: false
    property bool sessionExpiredNotice: false

    function submitLogin() {
        root.sessionExpiredNotice = false
        if (root.showServerConfig) {
            AppConfig.setApiBaseUrl(serverUrlInput.text)
        }
        AuthService.login(emailInput.text, passwordInput.text)
    }

    Connections {
        target: ApiClient
        function onSessionExpired() {
            root.sessionExpiredNotice = true
        }
    }

    SystemNavControls {
        anchors.top: parent.top
        anchors.left: parent.left
        anchors.margins: 16
        z: 10
    }

    ScrollView {
        anchors.fill: parent
        contentWidth: availableWidth
        clip: true

        Item {
            width: parent.width
            implicitHeight: Math.max(root.height, loginCard.implicitHeight + 64)

            SkeuoCard {
                id: loginCard
                anchors.centerIn: parent
                width: Math.min(parent.width - 48, 460)
                contentPadding: 30

                ColumnLayout {
                    anchors.left: parent.left
                    anchors.right: parent.right
                    spacing: 16

                    Image {
                        Layout.alignment: Qt.AlignHCenter
                        Layout.preferredWidth: 56
                        Layout.preferredHeight: 56
                        source: "qrc:/qt/qml/SkyRipple/assets/icons/skyripple_logo.svg"
                        sourceSize.width: 56
                        sourceSize.height: 56
                        fillMode: Image.PreserveAspectFit
                        smooth: true
                    }

                    ColumnLayout {
                        Layout.fillWidth: true
                        spacing: 4

                        Text {
                            Layout.alignment: Qt.AlignHCenter
                            text: "Bem-vindo de volta"
                            font.family: Theme.fontFamily
                            font.pixelSize: 24
                            font.weight: Font.Bold
                            color: Theme.textPrimary
                        }

                        Text {
                            Layout.fillWidth: true
                            horizontalAlignment: Text.AlignHCenter
                            wrapMode: Text.WordWrap
                            text: "Insira suas credenciais para acessar sua conta SkyRipple"
                            font.family: Theme.fontFamily
                            font.pixelSize: 13
                            color: Theme.textSecondary
                        }
                    }

                    Rectangle {
                        Layout.fillWidth: true
                        visible: root.sessionExpiredNotice && AuthService.errorMessage.length === 0
                        implicitHeight: expiredLabel.implicitHeight + 20
                        radius: 12
                        color: Theme.isDark ? Qt.rgba(120 / 255, 53 / 255, 15 / 255, 0.35) : "#fffbeb"
                        border.width: 1
                        border.color: Theme.isDark ? "#92400e" : "#fde68a"

                        Text {
                            id: expiredLabel
                            anchors.fill: parent
                            anchors.margins: 10
                            wrapMode: Text.WordWrap
                            text: "Sua sessão expirou. Faça login novamente para continuar."
                            font.family: Theme.fontFamily
                            font.pixelSize: 12
                            font.weight: Font.Medium
                            color: Theme.isDark ? "#fcd34d" : "#b45309"
                        }
                    }

                    Rectangle {
                        Layout.fillWidth: true
                        visible: AuthService.errorMessage.length > 0
                        implicitHeight: errorLabel.implicitHeight + 20
                        radius: 12
                        color: Theme.isDark ? Qt.rgba(127 / 255, 29 / 255, 29 / 255, 0.35) : "#fef2f2"
                        border.width: 1
                        border.color: Theme.isDark ? "#991b1b" : "#fecaca"

                        Text {
                            id: errorLabel
                            anchors.fill: parent
                            anchors.margins: 10
                            wrapMode: Text.WordWrap
                            text: AuthService.errorMessage
                            font.family: Theme.fontFamily
                            font.pixelSize: 12
                            font.weight: Font.Medium
                            color: Theme.isDark ? "#f87171" : "#dc2626"
                        }
                    }

                    SkeuoWell {
                        Layout.fillWidth: true
                        contentPadding: 14

                        ColumnLayout {
                            anchors.left: parent.left
                            anchors.right: parent.right
                            spacing: 12

                            ColumnLayout {
                                Layout.fillWidth: true
                                spacing: 4

                                Text {
                                    text: "E-MAIL"
                                    font.family: Theme.fontFamily
                                    font.pixelSize: 11
                                    font.weight: Font.Bold
                                    color: Theme.textMuted
                                }

                                SkeuoInput {
                                    id: emailInput
                                    Layout.fillWidth: true
                                    placeholderText: "seu@email.com"
                                    inputMethodHints: Qt.ImhEmailCharactersOnly
                                    enabled: !AuthService.busy
                                    onAccepted: passwordInput.forceActiveFocus()
                                }
                            }

                            ColumnLayout {
                                Layout.fillWidth: true
                                spacing: 4

                                Text {
                                    text: "SENHA"
                                    font.family: Theme.fontFamily
                                    font.pixelSize: 11
                                    font.weight: Font.Bold
                                    color: Theme.textMuted
                                }

                                RowLayout {
                                    Layout.fillWidth: true
                                    spacing: 8

                                    SkeuoInput {
                                        id: passwordInput
                                        Layout.fillWidth: true
                                        placeholderText: "Sua senha"
                                        echoMode: root.showPassword ? TextInput.Normal : TextInput.Password
                                        enabled: !AuthService.busy
                                        onAccepted: root.submitLogin()
                                    }

                                    SkeuoButton {
                                        Layout.preferredWidth: 74
                                        text: root.showPassword ? "Ocultar" : "Ver"
                                        variant: "secondary"
                                        onClicked: root.showPassword = !root.showPassword
                                    }
                                }
                            }
                        }
                    }

                    ColumnLayout {
                        Layout.fillWidth: true
                        spacing: 8

                        RowLayout {
                            Layout.fillWidth: true

                            Text {
                                Layout.fillWidth: true
                                text: "Servidor: " + AppConfig.apiBaseUrl
                                font.family: Theme.fontFamily
                                font.pixelSize: 11
                                color: Theme.textMuted
                                elide: Text.ElideMiddle
                            }

                            Text {
                                text: root.showServerConfig ? "Ocultar" : "Alterar"
                                font.family: Theme.fontFamily
                                font.pixelSize: 12
                                font.weight: Font.Medium
                                color: Theme.primaryMain

                                MouseArea {
                                    anchors.fill: parent
                                    cursorShape: Qt.PointingHandCursor
                                    onClicked: root.showServerConfig = !root.showServerConfig
                                }
                            }
                        }

                        SkeuoWell {
                            Layout.fillWidth: true
                            visible: root.showServerConfig
                            contentPadding: 12

                            ColumnLayout {
                                anchors.left: parent.left
                                anchors.right: parent.right
                                spacing: 8

                                Text {
                                    text: "URL DA API"
                                    font.family: Theme.fontFamily
                                    font.pixelSize: 11
                                    font.weight: Font.Bold
                                    color: Theme.textMuted
                                }

                                SkeuoInput {
                                    id: serverUrlInput
                                    Layout.fillWidth: true
                                    text: AppConfig.apiBaseUrl
                                    placeholderText: "https://webchat-9vqr.onrender.com/api"
                                    onEditingFinished: AppConfig.setApiBaseUrl(text)
                                }

                                RowLayout {
                                    Layout.fillWidth: true
                                    spacing: 8

                                    SkeuoButton {
                                        Layout.fillWidth: true
                                        text: "Local"
                                        variant: AppConfig.apiBaseUrl === "http://localhost:3001/api" ? "primary" : "secondary"
                                        onClicked: {
                                            AppConfig.setApiBaseUrl("http://localhost:3001/api")
                                            serverUrlInput.text = AppConfig.apiBaseUrl
                                        }
                                    }

                                    SkeuoButton {
                                        Layout.fillWidth: true
                                        text: "Produção"
                                        variant: AppConfig.apiBaseUrl === "https://webchat-9vqr.onrender.com/api" ? "primary" : "secondary"
                                        onClicked: {
                                            AppConfig.setApiBaseUrl("https://webchat-9vqr.onrender.com/api")
                                            serverUrlInput.text = AppConfig.apiBaseUrl
                                        }
                                    }
                                }
                            }
                        }
                    }

                    RowLayout {
                        Layout.fillWidth: true
                        spacing: 10

                        SkeuoButton {
                            Layout.fillWidth: true
                            text: AuthService.busy ? "Entrando..." : "Entrar"
                            variant: "primary"
                            enabled: !AuthService.busy && !AuthService.waitingForGoogle
                            onClicked: root.submitLogin()
                        }

                        SkeuoButton {
                            Layout.fillWidth: true
                            text: "Criar Conta"
                            variant: "secondary"
                            enabled: !AuthService.busy && !AuthService.waitingForGoogle
                            onClicked: {
                                AuthService.clearError()
                                root.registerRequested()
                            }
                        }
                    }

                    RowLayout {
                        Layout.fillWidth: true
                        spacing: 10

                        Rectangle {
                            Layout.fillWidth: true
                            Layout.preferredHeight: 1
                            color: Theme.isDark ? Qt.rgba(1, 1, 1, 0.12) : Qt.rgba(148 / 255, 163 / 255, 184 / 255, 0.4)
                        }

                        Text {
                            text: "ou"
                            font.family: Theme.fontFamily
                            font.pixelSize: 11
                            font.weight: Font.Bold
                            color: Theme.textMuted
                        }

                        Rectangle {
                            Layout.fillWidth: true
                            Layout.preferredHeight: 1
                            color: Theme.isDark ? Qt.rgba(1, 1, 1, 0.12) : Qt.rgba(148 / 255, 163 / 255, 184 / 255, 0.4)
                        }
                    }

                    RowLayout {
                        Layout.fillWidth: true
                        spacing: 8

                        SkeuoButton {
                            Layout.fillWidth: true
                            text: AuthService.waitingForGoogle ? "Aguardando navegador..." : "Entrar com Google"
                            variant: "secondary"
                            iconSource: "qrc:/qt/qml/SkyRipple/assets/icons/google_g.svg"
                            enabled: !AuthService.busy && !AuthService.waitingForGoogle
                            onClicked: {
                                AppConfig.setApiBaseUrl(serverUrlInput.text)
                                AuthService.loginWithGoogle()
                            }
                        }

                        SkeuoButton {
                            visible: AuthService.waitingForGoogle
                            text: "Cancelar"
                            variant: "danger"
                            onClicked: AuthService.cancelGoogleLogin()
                        }
                    }

                    Text {
                        Layout.alignment: Qt.AlignHCenter
                        text: "Voltar para o início"
                        font.family: Theme.fontFamily
                        font.pixelSize: 12
                        color: Theme.textMuted

                        MouseArea {
                            anchors.fill: parent
                            cursorShape: Qt.PointingHandCursor
                            onClicked: {
                                AuthService.clearError()
                                root.backRequested()
                            }
                        }
                    }
                }
            }
        }
    }
}
