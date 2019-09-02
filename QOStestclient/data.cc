// Copyright (C) <2019> Intel Corporation
//
// SPDX-License-Identifier: Apache-2.0
#include "data.h"
#include <getopt.h>
#include <unistd.h>

CData::CData()
{
    LOG_DEBUG("");
    m_dataDir = "";
    m_roomId = "";
    m_serverAddress = "";
    m_videoPath = "";
    m_width = 0;
    m_height = 0;
    m_fps = 0;
    m_publish = false;
    m_subscribe = false;
    m_encode = false;
    m_codec = VideoCodec::kVp8;
    m_bandwidthRate = 0;
    m_timeout = 60;
}

CData::~CData()
{
    LOG_DEBUG("");
}

bool CData::ParsingParameters(int argc, char **argv)
{
    LOG_DEBUG("");
    int opt;
    static struct option longOptions[] =
        {
            {"address", required_argument, NULL, 'a'},
            {"room", required_argument, NULL, 'r'},
            {"codec", required_argument, NULL, 'c'},
            {"width", required_argument, NULL, 'w'},
            {"height", required_argument, NULL, 'h'},
            {"fps", required_argument, NULL, 'f'},
            {"subscribe", no_argument, NULL, 's'},
            {"publish", no_argument, NULL, 'p'},
            {"video", required_argument, NULL, 'v'},
            {"bitrate", required_argument, NULL, 'b'},
            {"timeout", required_argument, NULL, 't'},
            {"encode", no_argument, NULL, 'e'},
            {"dataDir", required_argument, NULL, 'd'},
            {0, 0, 0, 0}};
    string codecName = "";
    while (1)
    {
        int optIndex = 0;
        opt = getopt_long_only(argc, argv, "a:r:c:w:h:f:spv:b:t:ed:", longOptions, &optIndex);

        if (-1 == opt)
        {
            break;
        }
        switch (opt)
        {
        case 'a':
            LOG_DEBUG("address is %s", optarg);
            m_serverAddress = "http://" + string(optarg);
            break;
        case 'r':
            LOG_DEBUG("room is %s", optarg);
            m_roomId = optarg;
            break;
        case 'c':
            LOG_DEBUG("codec is %s", optarg);
            codecName = optarg;
            break;
        case 'w':
            LOG_DEBUG("width is %s", optarg);
            m_width = atoi(optarg);
            break;
        case 'h':
            LOG_DEBUG("height is %s", optarg);
            m_height = atoi(optarg);
            break;
        case 'f':
            LOG_DEBUG("fps is %s", optarg);
            m_fps = atoi(optarg);
            break;
        case 's':
            LOG_DEBUG("subscribe is true");
            m_subscribe = true;
            break;
        case 'p':
            LOG_DEBUG("publish is true");
            m_publish = true;
            break;
        case 'v':
            LOG_DEBUG("video is %s", optarg);
            m_videoPath = optarg;
            break;
        case 'b':
            LOG_DEBUG("bitrate is %s", optarg);
            m_bandwidthRate = atoi(optarg);
            break;
        case 't':
            LOG_DEBUG("timeout is %s", optarg);
            m_timeout = atoi(optarg);
            break;
        case 'e':
            LOG_DEBUG("encode is true");
            m_encode = true;
            break;
        case 'd':
            LOG_DEBUG("dataDir is %s", optarg);
            m_dataDir = optarg;
            break;
        default:
            LOG_DEBUG("error arg %s", optarg);
            return false;
        }
    }

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
    return m_timeout;
}

bool CData::GetIfEncoded()
{
    LOG_DEBUG("");
    return m_encode;
}

string CData::GetLocalPublishTimeFilePath()
{
    LOG_DEBUG("");
    return (m_dataDir + "/localPublishTime.txt");
}

string CData::GetLocalARGBFilePath()
{
    LOG_DEBUG("");
    return (m_dataDir + "/localARGB.txt");
}

string CData::GetLocalLatencyFilePath()
{
    LOG_DEBUG("");
    return (m_dataDir + "/localLatency.txt");
}

string CData::GetLocalFpsFilePath()
{
    LOG_DEBUG("");
    return (m_dataDir + "/localFps.txt");
}

string CData::GetLocalBitrateFilePath()
{
    LOG_DEBUG("");
    return (m_dataDir + "/localBitrate.txt");
}
