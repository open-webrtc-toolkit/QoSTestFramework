// Copyright (C) <2019> Intel Corporation
//
// SPDX-License-Identifier: Apache-2.0
#include "log.h"
#include <iostream>
#include <mutex>
#include <stdarg.h>
#include <stdio.h>
#include <string.h>

static mutex s_mtxLog;
static LogLevel s_level = LogLevel::Debug;

int _vscprintf(const char *format, va_list pargs)
{
    int retval;
    va_list argcopy;
    va_copy(argcopy, pargs);
    retval = vsnprintf(NULL, 0, format, argcopy);
    va_end(argcopy);
    return retval;
}

void CLog::log(LogLevel level, string file, string func, int line, const char *format, ...)
{
    if (s_level > level)
    {
        return;
    }
    s_mtxLog.lock();
    char *pszStr = NULL;
    if (NULL != format)
    {
        va_list marker;
        va_start(marker, format);
        size_t nLength = _vscprintf(format, marker) + 1;
        pszStr = new char[nLength];
        memset(pszStr, '\0', nLength);
        vsnprintf(pszStr, nLength, format, marker);
        va_end(marker);
    }
    string sLog = file + "::" + to_string(line) + "::" + func + "::" + pszStr + "\r\n";
    cout << sLog.c_str();
    delete[] pszStr;
    s_mtxLog.unlock();
}

void CLog::setLogParam(LogLevel level, string path)
{
    s_mtxLog.lock();
    s_level = level;
    if (path != "")
    {
        freopen(path.c_str(), "ab", stdout);
    }
    s_mtxLog.unlock();
}

CLog::CLog()
{
}

CLog::~CLog()
{
}
