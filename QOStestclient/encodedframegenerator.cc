// Copyright (C) <2019> Intel Corporation
//
// SPDX-License-Identifier: Apache-2.0
#include "encodedframegenerator.h"
#include "log.h"
#include <iostream>
#include <memory.h>
#include <sys/time.h>
#include <thread>

CEncodedVideoInput::CEncodedVideoInput(const string &videoFile, VideoCodec codec)
{
    LOG_DEBUG("");
    m_codec = codec;
    m_videoPath = videoFile;
    m_fLocalPublishTime = nullptr;
}

CEncodedVideoInput::~CEncodedVideoInput()
{
    LOG_DEBUG("");
    if (m_fd.is_open())
    {
        m_fd.close();
    }
    if (m_fLocalPublishTime)
    {
        fclose(m_fLocalPublishTime);
        m_fLocalPublishTime = nullptr;
    }
}

bool CEncodedVideoInput::InitEncoderContext(Resolution &resolution, uint32_t fps, uint32_t bitrate, VideoCodec video_codec)
{
    LOG_DEBUG("");
    m_fLocalPublishTime = fopen(m_publishTimeFile.c_str(), "w");
    m_fd.open(m_videoPath.c_str(), ios::in | ios::binary);
    if (m_fd.is_open())
    {
        LOG_DEBUG("Successfully open the source.h264");
    }
    else
    {
        LOG_DEBUG("Failed to open the source.h264");
    }
    return true;
}

bool CEncodedVideoInput::EncodeOneFrame(std::vector<uint8_t> &buffer, bool keyFrame)
{
    if (!m_fd.is_open())
    {
        LOG_DEBUG("m_fd is open");
        return false;
    }
    int keyFrameData;
    uint32_t frameDataSize;
    int countTag;
    uint8_t *data;
    if (!m_fd.read(reinterpret_cast<char *>(&keyFrameData), sizeof(keyFrameData)))
    {
        LOG_DEBUG("m_fd is eof");
        m_fd.clear();
        m_fd.seekg(0, ios::beg);
        m_fd.read(reinterpret_cast<char *>(&keyFrameData), sizeof(keyFrameData));
    }
    m_fd.read(reinterpret_cast<char *>(&frameDataSize), sizeof(frameDataSize));
    m_fd.read(reinterpret_cast<char *>(&countTag), sizeof(countTag));
    if (keyFrame)
    {
        while (keyFrameData != 1)
        {
            m_fd.seekg(frameDataSize, ios::cur);
            if (!m_fd.read(reinterpret_cast<char *>(&keyFrameData), sizeof(keyFrameData)))
            {
                LOG_DEBUG("m_fd is eof");
                m_fd.clear();
                m_fd.seekg(0, ios::beg);
                m_fd.read(reinterpret_cast<char *>(&keyFrameData), sizeof(keyFrameData));
            }
            m_fd.read(reinterpret_cast<char *>(&frameDataSize), sizeof(frameDataSize));
            m_fd.read(reinterpret_cast<char *>(&countTag), sizeof(countTag));
        }
    }
    data = new uint8_t[frameDataSize];
    m_fd.read(reinterpret_cast<char *>(data), frameDataSize);
    buffer.insert(buffer.begin(), data, data + frameDataSize);
    delete[] data;
    if (m_fLocalPublishTime)
    {
        struct timeval tv_publish;
        gettimeofday(&tv_publish, NULL);
        long timeStamp = tv_publish.tv_sec % 10000 * 1000 + tv_publish.tv_usec / 1000;
        fprintf(m_fLocalPublishTime, ",%d", countTag);
        fprintf(m_fLocalPublishTime, ",%ld", timeStamp);
        fflush(m_fLocalPublishTime);
    }
    return true;
}

CEncodedVideoInput *CEncodedVideoInput::Create(const string &videoFile, VideoCodec codec)
{
    CEncodedVideoInput *videoEncoder = new CEncodedVideoInput(videoFile, codec);
    return videoEncoder;
}

VideoEncoderInterface *CEncodedVideoInput::Copy()
{
    CEncodedVideoInput *videoEncoder = new CEncodedVideoInput(m_videoPath, m_codec);
    videoEncoder->SetPublishTimeFile(m_publishTimeFile);
    return videoEncoder;
}

bool CEncodedVideoInput::Release()
{
    return true;
}

void CEncodedVideoInput::SetPublishTimeFile(const string & file)
{
    LOG_DEBUG("");
    m_publishTimeFile = file;
}