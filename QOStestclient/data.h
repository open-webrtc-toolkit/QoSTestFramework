// Copyright (C) <2019> Intel Corporation
//
// SPDX-License-Identifier: Apache-2.0
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
    bool m_encode;
    float m_bandwidthRate;
    int m_timeout;
};
