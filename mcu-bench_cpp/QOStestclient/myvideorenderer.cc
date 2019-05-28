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
// myvideorenderer.cpp : implementation file
//

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
            memcpy(argb, videoFrame->buffer, m_width * m_height * 4);
            gettimeofday(&m_tv, NULL);

            long timestamp = m_tv.tv_sec % 10000 * 1000 + m_tv.tv_usec / 1000;
            fprintf(m_fLocalARGB, "%ld,", timestamp);
            fprintf(m_fLocalLatency, "%ld,", timestamp);
            int value = 0;
            unsigned char *ptrTmp = argb;
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