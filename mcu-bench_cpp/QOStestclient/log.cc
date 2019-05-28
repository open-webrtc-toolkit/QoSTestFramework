/*
 * Copyright © 2019 Intel Corporation. All Rights Reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *
 * 1. Redistributions of source code must retain the above copyright notice,
 *    this list of conditions and the following disclaimer.
 * 2. Redistributions in binary form must reproduce the above copyright notice,
 *    this list of conditions and the following disclaimer in the documentation
 *    and/or other materials provided with the distribution.
 * 3. The name of the author may not be used to endorse or promote products
 *    derived from this software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE AUTHOR "AS IS" AND ANY EXPRESS OR IMPLIED
 * WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF
 * MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO
 * EVENT SHALL THE AUTHOR BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
 * SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO,
 * PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS;
 * OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY,
 * WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR
 * OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF
 * ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */
// log.cpp : implementation file
//

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
