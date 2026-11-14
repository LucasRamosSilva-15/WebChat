import QtQuick
import QtQuick.Layouts
import QtQuick.Controls.Basic
import SkyRipple

Item {
    id: root

    signal loginRequested()

    property string localError: ""
    property bool showPassword: false

    readonly property int passwordScore: {
        const pwd = passwordInput.text
        if (pwd.length === 0) return 0
        let score = 0
        if (pwd.length >= 6) score += 1
        if (pwd.length >= 10) score += 1
        if (/[A-Z]/.test(pwd) && /[a-z]/.test(pwd)) score += 1
        if (/[0-9]/.test(pwd) || /[^A-Za-z0-9]/.test(pwd)) score += 1
        return score
    }

    readonly property string strengthLabel: {
        if (passwordScore === 0) return ""
        if (passwordScore === 1) return "Fraca"
        if (passwordScore === 2) return "Razoável"
        if (passwordScore === 3) return "Boa"
        return "Forte"
    }

    readonly property color strengthColor: {
        if (passwordScore <= 1) return "#ef4444"
        if (passwordScore === 2) return "#f59e0b"
        if (passwordScore === 3) return "#0ea5e9"
        return "#10b981"
    }

    function submitRegister() {
        root.localError = ""
        AuthService.clearError()

        const cleanName = nameInput.text.trim()
        const cleanEmail = emailInput.text.trim()
        const pwd = passwordInput.text
        const confirm = confirmInput.text

        if (cleanName.length < 2) {
            root.localError = "Informe seu nome de exibição (mínimo 2 caracteres)."
            return
        }
        if (cleanEmail.indexOf("@") < 1 || cleanEmail.indexOf(".", cleanEmail.indexOf("@")) < 0) {
            root.localError = "Informe um endereço de e-mail válido."
            return
        }
        if (pwd.length < 6) {
            root.localError = "A senha deve ter pelo menos 6 caracteres."
            return
        }
        if (pwd !== confirm) {
            root.localError = "As senhas não coincidem."
            return
        }

        AuthService.registerAccount(cleanName, cleanEmail, pwd)
    }

    ScrollView {
        anchors.fill: parent
        contentWidth: availableWidth
        clip: true

        Item {
            width: parent.width
            implicitHeight: Math.max(root.height, registerCard.implicitHeight + 64)

            SkeuoCard {
                id: registerCard
                anchors.centerIn: parent
                width: Math.min(parent.width - 48, 480)
                contentPadding: 30

                ColumnLayout {
                    anchors.left: parent.left
                    anchors.right: parent.right
                    spacing: 16

                    Image {
                        Layout.alignment: Qt.AlignHCenter
                        Layout.preferredWidth: 52
                        Layout.preferredHeight: 52
                        source: "qrc:/qt/qml/SkyRipple/assets/icons/skyripple_logo.svg"
                        sourceSize.width: 52
                        sourceSize.height: 52
                        fillMode: Image.PreserveAspectFit
                        smooth: true
                    }

                    ColumnLayout {
                        Layout.fillWidth: true
                        spacing: 4

                        Text {
                            Layout.alignment: Qt.AlignHCenter
                            text: "Criar Conta"
                            font.family: Theme.fontFamily
                            font.pixelSize: 24
                            font.weight: Font.Bold
                            color: Theme.textPrimary
                        }

                        Text {
                            Layout.fillWidth: true
                            horizontalAlignment: Text.AlignHCenter
                            wrapMode: Text.WordWrap
                            text: "Crie sua conta gratuita para conversar no SkyRipple"
                            font.family: Theme.fontFamily
                            font.pixelSize: 13
                            color: Theme.textSecondary
                        }
                    }

                    Rectangle {
                        id: errorBanner
                        Layout.fillWidth: true
                        readonly property string displayedError: root.localError.length > 0 ? root.localError : AuthService.errorMessage
                        visible: displayedError.length > 0
                        implicitHeight: regErrorLabel.implicitHeight + 20
                        radius: 12
                        color: Theme.isDark ? Qt.rgba(127 / 255, 29 / 255, 29 / 255, 0.35) : "#fef2f2"
                        border.width: 1
                        border.color: Theme.isDark ? "#991b1b" : "#fecaca"

                        Text {
                            id: regErrorLabel
                            anchors.fill: parent
                            anchors.margins: 10
                            wrapMode: Text.WordWrap
                            text: errorBanner.displayedError
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
                            spacing: 10

                            ColumnLayout {
                                Layout.fillWidth: true
                                spacing: 4

                                Text {
                                    text: "NOME DE EXIBIÇÃO"
                                    font.family: Theme.fontFamily
                                    font.pixelSize: 11
                                    font.weight: Font.Bold
                                    color: Theme.textMuted
                                }

                                SkeuoInput {
                                    id: nameInput
                                    Layout.fillWidth: true
                                    placeholderText: "Ex: Lucas Ramos"
                                    enabled: !AuthService.busy
                                    onAccepted: emailInput.forceActiveFocus()
                                }
                            }

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
                                        placeholderText: "Mínimo 6 caracteres"
                                        echoMode: root.showPassword ? TextInput.Normal : TextInput.Password
                                        enabled: !AuthService.busy
                                        onAccepted: confirmInput.forceActiveFocus()
                                    }

                                    SkeuoButton {
                                        Layout.preferredWidth: 74
                                        text: root.showPassword ? "Ocultar" : "Ver"
                                        variant: "secondary"
                                        onClicked: root.showPassword = !root.showPassword
                                    }
                                }

                                RowLayout {
                                    Layout.fillWidth: true
                                    visible: passwordInput.text.length > 0
                                    spacing: 8

                                    Rectangle {
                                        Layout.fillWidth: true
                                        Layout.preferredHeight: 6
                                        radius: 3
                                        color: Theme.isDark ? "#1e293b" : "#e2e8f0"

                                        Rectangle {
                                            width: parent.width * (root.passwordScore / 4)
                                            height: parent.height
                                            radius: 3
                                            color: root.strengthColor

                                            Behavior on width {
                                                NumberAnimation { duration: 150; easing.type: Easing.OutQuad }
                                            }
                                        }
                                    }

                                    Text {
                                        text: root.strengthLabel
                                        font.family: Theme.fontFamily
                                        font.pixelSize: 11
                                        font.weight: Font.Bold
                                        color: root.strengthColor
                                    }
                                }
                            }

                            ColumnLayout {
                                Layout.fillWidth: true
                                spacing: 4

                                Text {
                                    text: "CONFIRMAR SENHA"
                                    font.family: Theme.fontFamily
                                    font.pixelSize: 11
                                    font.weight: Font.Bold
                                    color: Theme.textMuted
                                }

                                SkeuoInput {
                                    id: confirmInput
                                    Layout.fillWidth: true
                                    placeholderText: "Repita a senha"
                                    echoMode: root.showPassword ? TextInput.Normal : TextInput.Password
                                    enabled: !AuthService.busy
                                    onAccepted: root.submitRegister()
                                }
                            }
                        }
                    }

                    RowLayout {
                        Layout.fillWidth: true
                        spacing: 10

                        SkeuoButton {
                            Layout.fillWidth: true
                            text: "Voltar para Login"
                            variant: "secondary"
                            enabled: !AuthService.busy
                            onClicked: {
                                root.localError = ""
                                AuthService.clearError()
                                root.loginRequested()
                            }
                        }

                        SkeuoButton {
                            Layout.fillWidth: true
                            text: AuthService.busy ? "Criando..." : "Criar Conta"
                            variant: "primary"
                            enabled: !AuthService.busy
                            onClicked: root.submitRegister()
                        }
                    }
                }
            }
        }
    }
}
