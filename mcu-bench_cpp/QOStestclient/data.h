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
// data.h : header file
//

#pragma once

#include "log.h"
#include "owt.h"
#include <stdio.h>
#include <string>

using namespace std;

class CData
{

public:
    bool ParsingParameters(int argc, char **argv);
    string GetRoomId();
    string GetServerAddress();
    string GetVideoPath();
    VideoCodec GetCodec();
    int GetWidth();
    int GetHeight();
    int GetFps();
    bool GetIfPublish();
    bool GetIfSubscribe();
    float GetBandwidthRate();
    int GetRunTime();
    bool GetIfEncoded();
    string GetLocalPublishTimeFilePath();
    string GetLocalARGBFilePath();
    string GetLocalLatencyFilePath();
    string GetLocalFpsFilePath();
    string GetLocalBitrateFilePath();

    CData();
    ~CData();

private:
    string m_dataDir;
    string m_roomId;
    string m_serverAddress;
    string m_videoPath;
    VideoCodec m_codec;
    int m_width;
    int m_height;
    int m_fps;
    bool m_publish;
    bool m_subscribe;
    bool m_encoded;
    float m_bandwidthRate;
    int m_runTime;
};
