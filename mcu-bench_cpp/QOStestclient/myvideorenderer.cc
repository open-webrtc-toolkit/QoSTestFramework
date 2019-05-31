// Copyright (C) <2019> Intel Corporation
//
// SPDX-License-Identifier: Apache-2.0
#include "myvideorenderer.h"
#include "log.h"
#include <cstring>
#include <iostream>

using namespace std;

CMyVideoRenderer::CMyVideoRenderer()
{
    LOG_DEBUG("");
    m_width = 0;
    m_height = 0;
    struct timeval m_tv;
    m_num = 0;
    m_fLocalARGB = nullptr;
    m_fLocalLatency = nullptr;
}

void CMyVideoRenderer::RenderFrame(unique_ptr<VideoBuffer> videoFrame)
{
    //LOG_DEBUG("");
    if (videoFrame && m_fLocalARGB && m_fLocalLatency)
    {
        m_width = videoFrame->resolution.width;
        m_height = videoFrame->resolution.height;
        m_num++;
        if (m_num == 40)
        {
            uint8_t *argb = new uint8_t[m_width * m_height * 4];
            memmove(argb, videoFrame->buffer, m_width * m_height * 4);
            gettimeofday(&m_tv, NULL);
            long timestamp = m_tv.tv_sec % 10000 * 1000 + m_tv.tv_usec / 1000;
            fprintf(m_fLocalARGB, "%ld,", timestamp);
            fprintf(m_fLocalLatency, "%ld,", timestamp);
            int value = 0;
            uint8_t *ptrTmp = argb;
            for (long i = 0; i < m_width * m_height * 4; ++i)
            {
                value = (int)(*ptrTmp);
                ptrTmp++;
                fprintf(m_fLocalARGB, "%d", value);
                fprintf(m_fLocalARGB, ",");

                if (i / 4 % m_width >= 0 && i / 4 % m_width <= 239 && i / 4 / m_width >= 0 && i / 4 / m_width <= 59)
                {
                    fprintf(m_fLocalLatency, "%d,", value);
                    fflush(m_fLocalLatency);
                }
                fflush(m_fLocalARGB);
            }
            m_num = 0;
            delete[] argb;
            argb = NULL;
        }
    }
    else
    {
        LOG_DEBUG("videoFrame is null");
    }
}

VideoRendererType CMyVideoRenderer::Type()
{
    //LOG_DEBUG("");
    return VideoRendererType::kARGB;
}

CMyVideoRenderer::~CMyVideoRenderer()
{
    LOG_DEBUG("");
    if (m_fLocalARGB)
    {
        fclose(m_fLocalARGB);
        m_fLocalARGB = nullptr;
    }
    if (m_fLocalLatency)
    {
        fclose(m_fLocalLatency);
        m_fLocalLatency = nullptr;
    }
}

void CMyVideoRenderer::SetLocalARGBFile(const string &file)
{
    LOG_DEBUG("");
    m_fLocalARGB = fopen(file.c_str(), "w");
}

void CMyVideoRenderer::SetLocalLatencyFile(const string &file)
{
    LOG_DEBUG("");
    m_fLocalLatency = fopen(file.c_str(), "w");
}