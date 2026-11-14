#pragma once

#include <QObject>
#include <QSettings>
#include <QString>
#include <QtQml/qqmlregistration.h>

class ThemeController : public QObject
{
    Q_OBJECT
    QML_ELEMENT
    QML_SINGLETON
    Q_PROPERTY(QString colorMode READ colorMode WRITE setColorMode NOTIFY colorModeChanged)
    Q_PROPERTY(QString primaryColor READ primaryColor WRITE setPrimaryColor NOTIFY primaryColorChanged)
    Q_PROPERTY(QString bgColor READ bgColor WRITE setBgColor NOTIFY bgColorChanged)
    Q_PROPERTY(QString bubbleFormat READ bubbleFormat WRITE setBubbleFormat NOTIFY bubbleFormatChanged)
    Q_PROPERTY(bool isDark READ isDark NOTIFY colorModeChanged)

public:
    explicit ThemeController(QObject *parent = nullptr);

    QString colorMode() const;
    QString primaryColor() const;
    QString bgColor() const;
    QString bubbleFormat() const;
    bool isDark() const;

    Q_INVOKABLE void setColorMode(const QString &mode);
    Q_INVOKABLE void toggleColorMode();
    Q_INVOKABLE void setPrimaryColor(const QString &color);
    Q_INVOKABLE void setBgColor(const QString &bg);
    Q_INVOKABLE void setBubbleFormat(const QString &format);

signals:
    void colorModeChanged();
    void primaryColorChanged();
    void bgColorChanged();
    void bubbleFormatChanged();

private:
    QSettings m_settings;
    QString m_colorMode;
    QString m_primaryColor;
    QString m_bgColor;
    QString m_bubbleFormat;
};
