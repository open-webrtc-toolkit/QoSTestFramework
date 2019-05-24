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
// data.cpp : implementation file
//

#include "data.h"
#include <unistd.h>

CData::CData()
{
    LOG_DEBUG("");
    m_dataDir = "./Data/";
    m_roomId = "";
    m_serverAddress = "";
    m_videoPath = "";
    m_width = 0;
    m_height = 0;
    m_fps = 0;
    m_publish = true;
    m_subscribe = true;
    m_encoded = false;
    m_codec = VideoCodec::kVp8;
    m_bandwidthRate = 0;
}

CData::~CData()
{
    LOG_DEBUG("");
}

bool CData::ParsingParameters(int argc, char **argv)
{
    LOG_DEBUG("");
    if (argc != 11)
    {
        LOG_DEBUG("args error!");
        return false;
    }
    LOG_DEBUG("argc is %d", argc);
    m_serverAddress = "http://" + string(argv[1]) + "/createToken";
    m_roomId = argv[2];
    string codecName = argv[3];
    if (codecName.find("h264") != string::npos)
    {
        m_codec = VideoCodec::kH264;
    }
    else if (codecName.find("vp9") != string::npos)
    {
        m_codec = VideoCodec::kVp9;
    }
    else if (codecName.find("vp8") != string::npos)
    {
        m_codec = VideoCodec::kVp8;
    }
    else if (codecName.find("h265") != string::npos)
    {
        m_codec = VideoCodec::kH265;
    }
    else
    {
        m_codec = VideoCodec::kVp8;
    }

    string resolution(argv[4]);
    string::size_type pos = resolution.find('*');
    m_width = atoi(resolution.substr(0, pos).c_str());
    m_height = atoi(resolution.substr(pos + 1, resolution.length() - 1).c_str());
    LOG_DEBUG("resolution is %d*%d", m_width, m_height);

    m_fps = atoi(argv[5]);

    string ps(argv[6]);
    LOG_DEBUG("ps param:%s", ps.c_str());
    if ((ps.find("p") == string::npos) && (ps.find("P") == string::npos))
    {
        m_publish = false;
    }
    if ((ps.find("s") == string::npos) && (ps.find("S") == string::npos))
    {
        m_subscribe = false;
    }

    m_videoPath = argv[7];

    m_bandwidthRate = atof(argv[8]);
    LOG_DEBUG("m_bandwidthRate is %d", m_bandwidthRate);
    m_runTime = atoi(argv[9]);
    LOG_DEBUG("m_runTime is %d", m_runTime);
    int encoded = atoi(argv[9]);
    if(encoded){
        m_encoded = true;
    }
    return true;
}

string CData::GetRoomId()
{
    LOG_DEBUG("");
    return m_roomId;
}

string CData::GetServerAddress()
{
    LOG_DEBUG("");
    return m_serverAddress;
}

string CData::GetVideoPath()
{
    LOG_DEBUG("");
    return m_videoPath;
}

VideoCodec CData::GetCodec()
{
    LOG_DEBUG("");
    return m_codec;
}

int CData::GetWidth()
{
    LOG_DEBUG("");
    return m_width;
}

int CData::GetHeight()
{
    LOG_DEBUG("");
    return m_height;
}

int CData::GetFps()
{
    LOG_DEBUG("");
    return m_fps;
}

bool CData::GetIfPublish()
{
    LOG_DEBUG("");
    return m_publish;
}

bool CData::GetIfSubscribe()
{
    LOG_DEBUG("");
    return m_subscribe;
}

float CData::GetBandwidthRate()
{
    LOG_DEBUG("");
    return m_bandwidthRate;
}

int CData::GetRunTime()
{
    LOG_DEBUG("");
    return m_runTime;
}

bool CData::GetIfEncoded()
{
    LOG_DEBUG("");
    return m_encoded;
}

string CData::GetLocalPublishTimeFilePath()
{
    LOG_DEBUG("");
    return (m_dataDir + "localPublishTime.txt");
}

string CData::GetLocalARGBFilePath()
{
    LOG_DEBUG("");
    return (m_dataDir + "localARGB.txt");
}

string CData::GetLocalLatencyFilePath()
{
    LOG_DEBUG("");
    return (m_dataDir + "localLatency.txt");
}

string CData::GetLocalFpsFilePath()
{
    LOG_DEBUG("");
    return (m_dataDir + "localFps.txt");
}

string CData::GetLocalBitrateFilePath()
{
    LOG_DEBUG("");
    return (m_dataDir + "localBitrate.txt");
}
