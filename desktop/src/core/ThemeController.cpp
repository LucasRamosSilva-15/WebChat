#include "ThemeController.hpp"

ThemeController::ThemeController(QObject *parent)
    : QObject(parent)
    , m_settings("SkyRipple", "SkyRippleDesktop")
    , m_colorMode(m_settings.value("theme/colorMode", "light").toString())
    , m_primaryColor(m_settings.value("theme/primaryColor", "blue").toString())
    , m_bgColor(m_settings.value("theme/bgColor", "neutral").toString())
    , m_bubbleFormat(m_settings.value("theme/bubbleFormat", "grande").toString())
{
}

QString ThemeController::colorMode() const
{
    return m_colorMode;
}

QString ThemeController::primaryColor() const
{
    return m_primaryColor;
}

QString ThemeController::bgColor() const
{
    return m_bgColor;
}

QString ThemeController::bubbleFormat() const
{
    return m_bubbleFormat;
}

bool ThemeController::isDark() const
{
    return m_colorMode == "dark";
}

void ThemeController::setColorMode(const QString &mode)
{
    const QString normalized = (mode == "dark") ? "dark" : "light";
    if (m_colorMode == normalized) {
        return;
    }
    m_colorMode = normalized;
    m_settings.setValue("theme/colorMode", m_colorMode);
    emit colorModeChanged();
}

void ThemeController::toggleColorMode()
{
    setColorMode(isDark() ? "light" : "dark");
}

void ThemeController::setPrimaryColor(const QString &color)
{
    QString normalized = "blue";
    if (color == "green" || color == "purple" || color == "red" || color == "slate" || color == "blue") {
        normalized = color;
    }
    if (m_primaryColor == normalized) {
        return;
    }
    m_primaryColor = normalized;
    m_settings.setValue("theme/primaryColor", m_primaryColor);
    emit primaryColorChanged();
}

void ThemeController::setBgColor(const QString &bg)
{
    QString normalized = "neutral";
    if (bg == "classic_blue" || bg == "smooth_gradient" || bg == "clean_light" || bg == "neutral") {
        normalized = bg;
    }
    if (m_bgColor == normalized) {
        return;
    }
    m_bgColor = normalized;
    m_settings.setValue("theme/bgColor", m_bgColor);
    emit bgColorChanged();
}

void ThemeController::setBubbleFormat(const QString &format)
{
    const QString normalized = (format == "classico") ? "classico" : "grande";
    if (m_bubbleFormat == normalized) {
        return;
    }
    m_bubbleFormat = normalized;
    m_settings.setValue("theme/bubbleFormat", m_bubbleFormat);
    emit bubbleFormatChanged();
}
