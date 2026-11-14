#pragma once

#include <QTemporaryDir>
#include <memory>

class TestEnvironment
{
public:
    void init();
    void cleanup();

private:
    std::unique_ptr<QTemporaryDir> m_tempDir;
};
