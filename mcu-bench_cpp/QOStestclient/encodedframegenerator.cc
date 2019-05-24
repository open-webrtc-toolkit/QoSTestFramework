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
// encodedframegenerator.cpp : implementation file
//
#include "encodedframegenerator.h"
#include "log.h"
#include <iostream>
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
        int keyFrame_data;
        if (fread(&keyFrame_data, 1, sizeof(int), m_fd) != sizeof(int))
        {
            fseek(m_fd, 0, SEEK_SET);
            fread(&keyFrame_data, 1, sizeof(int), m_fd);
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

        uint8_t *data = new uint8_t[frameDataSize];
        fread(data, 1, frameDataSize, m_fd);
        buffer.insert(buffer.begin(), data, data + frameDataSize);
        delete[] data;
        return true;
    }
    else
    {
        int keyFrame_data;
        if (fread(&keyFrame_data, 1, sizeof(int), m_fd) != sizeof(int))
        {
            fseek(m_fd, 0, SEEK_SET);
            fread(&keyFrame_data, 1, sizeof(int), m_fd);
        }
        uint32_t frameDataSize;
        if (fread(&frameDataSize, 1, sizeof(int), m_fd) != sizeof(int))
        {
            fseek(m_fd, 0, SEEK_SET);
            fread(&frameDataSize, 1, sizeof(int), m_fd);
        }
        while (keyFrame_data != 1)
        {
            int temp;
            if (fread(&temp, 1, sizeof(int), m_fd) != sizeof(int))
            {
                fseek(m_fd, 0, SEEK_SET);
                fread(&temp, 1, sizeof(int), m_fd);
            }
            uint8_t *data = new uint8_t[frameDataSize];
            fread(data, 1, frameDataSize, m_fd);
            delete[] data;
            fread(&keyFrame_data, 1, sizeof(int), m_fd);
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

        uint8_t *data = new uint8_t[frameDataSize];
        fread(data, 1, frameDataSize, m_fd);
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