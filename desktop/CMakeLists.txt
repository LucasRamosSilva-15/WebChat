cmake_minimum_required(VERSION 3.21)

project(SkyRippleDesktop VERSION 0.1.0 LANGUAGES CXX)

set(CMAKE_CXX_STANDARD 20)
set(CMAKE_CXX_STANDARD_REQUIRED ON)
set(CMAKE_AUTOMOC ON)

find_package(Qt6 REQUIRED COMPONENTS Core Gui Qml Quick QuickControls2 Svg Network Test)

qt_standard_project_setup(REQUIRES 6.5)
qt_policy(SET QTP0004 NEW)

qt_add_library(SkyRippleCore STATIC
    src/core/ThemeController.hpp
    src/core/ThemeController.cpp
    src/core/AppConfig.hpp
    src/core/AppConfig.cpp
    src/core/SessionStore.hpp
    src/core/SessionStore.cpp
    src/models/RoomListModel.hpp
    src/models/RoomListModel.cpp
    src/models/MessageListModel.hpp
    src/models/MessageListModel.cpp
    src/models/MemberListModel.hpp
    src/models/MemberListModel.cpp
    src/network/ApiClient.hpp
    src/network/ApiClient.cpp
    src/network/OAuthLoopbackServer.hpp
    src/network/OAuthLoopbackServer.cpp
    src/network/AuthService.hpp
    src/network/AuthService.cpp
    src/network/RoomService.hpp
    src/network/RoomService.cpp
    src/network/MessageService.hpp
    src/network/MessageService.cpp
)

set_source_files_properties(qml/theme/Theme.qml PROPERTIES
    QT_QML_SINGLETON_TYPE TRUE
)

qt_add_qml_module(SkyRippleCore
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
        qml/components/Navbar.qml
        qml/components/MessageBubble.qml
        qml/pages/HomePage.qml
        qml/pages/LoginPage.qml
        qml/pages/RegisterPage.qml
        qml/pages/RoomsPage.qml
        qml/pages/ChatPage.qml
    RESOURCES
        assets/icons/skyripple_logo.svg
        assets/icons/google_g.svg
)

target_include_directories(SkyRippleCore PUBLIC
    src
    src/core
    src/models
    src/network
)

target_link_libraries(SkyRippleCore PUBLIC
    Qt6::Core
    Qt6::Gui
    Qt6::Qml
    Qt6::Quick
    Qt6::QuickControls2
    Qt6::Svg
    Qt6::Network
)

target_compile_options(SkyRippleCore PRIVATE
    -Wall
    -Wextra
    -Wpedantic
)

qt_add_executable(SkyRippleDesktop
    src/main.cpp
)

target_link_libraries(SkyRippleDesktop PRIVATE
    SkyRippleCore
    SkyRippleCoreplugin
)

target_compile_options(SkyRippleDesktop PRIVATE
    -Wall
    -Wextra
    -Wpedantic
)

set_target_properties(SkyRippleDesktop PROPERTIES
    WIN32_EXECUTABLE TRUE
    MACOSX_BUNDLE TRUE
)

enable_testing()

qt_add_library(SkyRippleTestSupport STATIC
    tests/support/MockHttpServer.hpp
    tests/support/MockHttpServer.cpp
    tests/support/TestEnvironment.hpp
    tests/support/TestEnvironment.cpp
)

target_include_directories(SkyRippleTestSupport PUBLIC
    tests/support
)

target_link_libraries(SkyRippleTestSupport PUBLIC
    SkyRippleCore
    Qt6::Test
)

target_compile_options(SkyRippleTestSupport PRIVATE
    -Wall
    -Wextra
    -Wpedantic
)

foreach(test_name IN ITEMS
    test_session_and_theme
    test_api_client
    test_auth_service
    test_google_oauth
    test_room_service
    test_message_and_pagination
    test_room_moderation_and_search
)
    qt_add_executable(${test_name}
        tests/${test_name}.cpp
    )
    target_link_libraries(${test_name} PRIVATE
        SkyRippleCore
        SkyRippleTestSupport
        Qt6::Test
    )
    target_compile_options(${test_name} PRIVATE
        -Wall
        -Wextra
        -Wpedantic
    )
    add_test(NAME ${test_name} COMMAND ${test_name})
endforeach()
