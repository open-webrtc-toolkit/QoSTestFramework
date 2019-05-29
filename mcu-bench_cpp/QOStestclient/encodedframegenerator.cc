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
    m_fd = nullptr;
}

CEncodedVideoInput::~CEncodedVideoInput()
{
    LOG_DEBUG("");
    if (m_fd)
    {
        fclose(m_fd);
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
    m_fd = fopen(m_videoPath.c_str(), "rb");

    if (!m_fd)
    {
        LOG_DEBUG("Failed to open the source.h264");
    }
    else
    {
        LOG_DEBUG("Successfully open the source.h264");
    }
    return true;
}

bool CEncodedVideoInput::EncodeOneFrame(std::vector<uint8_t> &buffer, bool keyFrame)
{
    if (keyFrame == false)
    {
        int keyFrameData;
        if (fread(&keyFrameData, 1, sizeof(int), m_fd) != sizeof(int))
        {
            fseek(m_fd, 0, SEEK_SET);
            fread(&keyFrameData, 1, sizeof(int), m_fd);
        }

        uint32_t frameDataSize;
        if (fread(&frameDataSize, 1, sizeof(int), m_fd) != sizeof(int))
        {
            fseek(m_fd, 0, SEEK_SET);
            fread(&frameDataSize, 1, sizeof(int), m_fd);
        }
        int countTag;
        if (fread(&countTag, 1, sizeof(int), m_fd) != sizeof(int))
        {
            fseek(m_fd, 0, SEEK_SET);
            fread(&countTag, 1, sizeof(int), m_fd);
        }
        if (m_fLocalPublishTime)
        {
            struct timeval tv_publish;
            gettimeofday(&tv_publish, NULL);
            long timeStamp = tv_publish.tv_sec % 10000 * 1000 + tv_publish.tv_usec / 1000;
            fprintf(m_fLocalPublishTime, ",%d", countTag);
            fprintf(m_fLocalPublishTime, ",%ld", timeStamp);
            fflush(m_fLocalPublishTime);
        }

        uint8_t *data = new uint8_t[frameDataSize + 1];
        memset(data, 0, frameDataSize + 1);
        fread(data, 1, frameDataSize, m_fd);
        data[frameDataSize] = '\0';
        buffer.insert(buffer.begin(), data, data + frameDataSize);
        delete[] data;
        return true;
    }
    else
    {
        int keyFrameData;
        if (fread(&keyFrameData, 1, sizeof(int), m_fd) != sizeof(int))
        {
            fseek(m_fd, 0, SEEK_SET);
            fread(&keyFrameData, 1, sizeof(int), m_fd);
        }
        uint32_t frameDataSize;
        if (fread(&frameDataSize, 1, sizeof(int), m_fd) != sizeof(int))
        {
            fseek(m_fd, 0, SEEK_SET);
            fread(&frameDataSize, 1, sizeof(int), m_fd);
        }
        while (keyFrameData != 1)
        {
            int temp;
            if (fread(&temp, 1, sizeof(int), m_fd) != sizeof(int))
            {
                fseek(m_fd, 0, SEEK_SET);
                fread(&temp, 1, sizeof(int), m_fd);
            }
            uint8_t *data = new uint8_t[frameDataSize + 1];
            memset(data, 0, frameDataSize + 1);
            fread(data, 1, frameDataSize, m_fd);
            data[frameDataSize] = '\0';
            delete[] data;
            fread(&keyFrameData, 1, sizeof(int), m_fd);
            fread(&frameDataSize, 1, sizeof(int), m_fd);
        }
        int countTag;
        if (fread(&countTag, 1, sizeof(int), m_fd) != sizeof(int))
        {
            fseek(m_fd, 0, SEEK_SET);
            fread(&countTag, 1, sizeof(int), m_fd);
        }
        if (m_fLocalPublishTime)
        {
            struct timeval tv_publish;
            gettimeofday(&tv_publish, NULL);
            long timeStamp = tv_publish.tv_sec % 10000 * 1000 + tv_publish.tv_usec / 1000;
            fprintf(m_fLocalPublishTime, ",%d", countTag);
            fprintf(m_fLocalPublishTime, ",%ld", timeStamp);
            fflush(m_fLocalPublishTime);
        }

        uint8_t *data = new uint8_t[frameDataSize + 1];
        memset(data, 0, frameDataSize + 1);
        fread(data, 1, frameDataSize, m_fd);
        data[frameDataSize] = '\0';
        buffer.insert(buffer.begin(), data, data + frameDataSize);
        delete[] data;
        return true;
    }
}

CEncodedVideoInput *CEncodedVideoInput::Create(const string &videoFile, VideoCodec codec)
{
    CEncodedVideoInput *videoEncoder = new CEncodedVideoInput(videoFile, codec);
    return videoEncoder;
}

VideoEncoderInterface *CEncodedVideoInput::Copy()
{
    CEncodedVideoInput *videoEncoder = new CEncodedVideoInput(m_videoPath, m_codec);
    return videoEncoder;
}

bool CEncodedVideoInput::Release()
{
    return true;
}

void CEncodedVideoInput::SetPublishTimeFile(const string &file)
{
    LOG_DEBUG("");
    m_fLocalPublishTime = fopen(file.c_str(), "w");
}