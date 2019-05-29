// Copyright (C) <2019> Intel Corporation
//
// SPDX-License-Identifier: Apache-2.0
#pragma once

#include <string>

using namespace std;

enum class LogLevel : int
{
    Debug = 1,
    Info,
    Warring,
    Error
};

#define LOG(level, ...) CLog::log(level, __FILE__, __FUNCTION__, __LINE__, __VA_ARGS__);
#define LOG_DEBUG(...) LOG(LogLevel::Debug, __VA_ARGS__);
#define LOG_INFO(...) LOG(LogLevel::Info, __VA_ARGS__);
#define LOG_WARRING(...) LOG(LogLevel::Warring, __VA_ARGS__);
#define LOG_ERROR(...) LOG(LogLevel::Error, __VA_ARGS__);

class CLog
{
public:
    static void log(LogLevel level, string file, string func, int line, const char *format, ...);
    static void setLogParam(LogLevel level, string path);

private:
    CLog();
    ~CLog();
};
