#include <QGuiApplication>
#include <QQmlApplicationEngine>
#include <QQuickStyle>
#include <QIcon>

int main(int argc, char *argv[])
{
    QGuiApplication app(argc, argv);
    app.setOrganizationName("SkyRipple");
    app.setApplicationName("SkyRippleDesktop");
    app.setApplicationDisplayName("SkyRipple");
    app.setWindowIcon(QIcon(":/qt/qml/SkyRipple/assets/icons/skyripple_logo.svg"));

    QQuickStyle::setStyle("Basic");

    QQmlApplicationEngine engine;
    QObject::connect(
        &engine,
        &QQmlApplicationEngine::objectCreationFailed,
        &app,
        []() { QCoreApplication::exit(-1); },
        Qt::QueuedConnection
    );

    engine.loadFromModule("SkyRipple", "Main");

    return app.exec();
}
