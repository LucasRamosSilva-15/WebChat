cmake_minimum_required(VERSION 3.21)

project(SkyRippleDesktop VERSION 0.1.0 LANGUAGES CXX)

set(CMAKE_CXX_STANDARD 20)
set(CMAKE_CXX_STANDARD_REQUIRED ON)
set(CMAKE_AUTOMOC ON)

find_package(Qt6 REQUIRED COMPONENTS Core Gui Qml Quick QuickControls2 Svg Network)

qt_standard_project_setup(REQUIRES 6.5)
qt_policy(SET QTP0004 NEW)

qt_add_executable(SkyRippleDesktop
    src/main.cpp
    src/core/ThemeController.hpp
    src/core/ThemeController.cpp
    src/core/AppConfig.hpp
    src/core/AppConfig.cpp
    src/core/SessionStore.hpp
    src/core/SessionStore.cpp
    src/network/ApiClient.hpp
    src/network/ApiClient.cpp
    src/network/AuthService.hpp
    src/network/AuthService.cpp
)

set_source_files_properties(qml/theme/Theme.qml PROPERTIES
    QT_QML_SINGLETON_TYPE TRUE
)

qt_add_qml_module(SkyRippleDesktop
    URI SkyRipple
    VERSION 1.0
    QML_FILES
        qml/Main.qml
        qml/theme/Theme.qml
        qml/components/SkeuoCard.qml
        qml/components/SkeuoPanel.qml
        qml/components/SkeuoWell.qml
        qml/components/SkeuoButton.qml
        qml/components/SkeuoInput.qml
        qml/components/SkeuoBadge.qml
        qml/pages/HomePage.qml
        qml/pages/LoginPage.qml
        qml/pages/RegisterPage.qml
        qml/pages/AuthenticatedStubPage.qml
    RESOURCES
        assets/icons/skyripple_logo.svg
)

target_include_directories(SkyRippleDesktop PRIVATE
    src
    src/core
    src/network
)

target_link_libraries(SkyRippleDesktop PRIVATE
    Qt6::Core
    Qt6::Gui
    Qt6::Qml
    Qt6::Quick
    Qt6::QuickControls2
    Qt6::Svg
    Qt6::Network
)

set_target_properties(SkyRippleDesktop PROPERTIES
    WIN32_EXECUTABLE TRUE
    MACOSX_BUNDLE TRUE
)
