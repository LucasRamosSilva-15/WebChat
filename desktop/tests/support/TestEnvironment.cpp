#include "TestEnvironment.hpp"
#include "AppConfig.hpp"
#include "SessionStore.hpp"
#include <QSettings>

void TestEnvironment::init()
{
    m_tempDir = std::make_unique<QTemporaryDir>();
    QSettings::setDefaultFormat(QSettings::IniFormat);
    QSettings::setPath(QSettings::IniFormat, QSettings::UserScope, m_tempDir->path());
    QSettings settings("SkyRipple", "SkyRippleDesktop");
    settings.clear();
    settings.sync();

    AppConfig::instance()->reload();
    SessionStore::instance()->reload();
}

void TestEnvironment::cleanup()
{
    SessionStore::instance()->clearSession();
    AppConfig::instance()->resetApiBaseUrl();
    m_tempDir.reset();
}
