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
// fileframegenerator.cpp : implementation file
//

#include "fileframegenerator.h"
#include "log.h"
#include <iostream>
#include <sys/time.h>
#include <thread>

CFileFrameGenerator::CFileFrameGenerator(int width, int height, int fps, string filename)
{
  LOG_DEBUG("");
  m_countTag = 1;
  m_width = width;
  m_height = height;
  m_type = VideoFrameGeneratorInterface::I420;
  m_fps = fps;
  m_videoPath = filename;
  int size = m_width * m_height;
  int qsize = size / 4;
  m_fLocalPublishTime = nullptr;
  m_frameDataSize = size + 2 * qsize;
  LOG_DEBUG("m_videoPath is : %s", m_videoPath.c_str());
  m_fd = fopen(m_videoPath.c_str(), "r");
  if (m_fd)
  {
    LOG_DEBUG("sucessfully to open the %s file.", m_videoPath.c_str());
  }
  else
  {
    LOG_DEBUG("failed to open the %s file.", m_videoPath.c_str());
  }
}

CFileFrameGenerator::~CFileFrameGenerator()
{
  LOG_DEBUG("");
  if (m_fd)
  {
    fclose(m_fd);
    m_fd = nullptr;
  }
  if (m_fLocalPublishTime)
  {
    fclose(m_fLocalPublishTime);
    m_fLocalPublishTime = nullptr;
  }
}

uint32_t CFileFrameGenerator::GetNextFrameSize()
{
  //LOG_DEBUG("");
  return m_frameDataSize;
}

int CFileFrameGenerator::GetHeight()
{
  LOG_DEBUG("");
  return m_height;
}

int CFileFrameGenerator::GetWidth()
{
  LOG_DEBUG("");
  return m_width;
}

int CFileFrameGenerator::GetFps()
{
  LOG_DEBUG("");
  return m_fps;
}

VideoFrameGeneratorInterface::VideoFrameCodec CFileFrameGenerator::GetType()
{
  LOG_DEBUG("");
  return m_type;
}

uint32_t CFileFrameGenerator::GenerateNextFrame(uint8_t *frameBuffer, const uint32_t capacity)
{
  //LOG_DEBUG("");
  if (!m_fd && capacity < m_frameDataSize)
  {
    return 0;
  }
  if (fread(frameBuffer, 1, m_frameDataSize, m_fd) != (size_t)m_frameDataSize)
  {
    fseek(m_fd, 0, SEEK_SET);
    fread(frameBuffer, 1, m_frameDataSize, m_fd);
  }
  if (m_fLocalPublishTime)
  {
    struct timeval tv_publish;
    gettimeofday(&tv_publish, NULL);
    m_countTag++;
    long timeStamp = tv_publish.tv_sec % 10000 * 1000 + tv_publish.tv_usec / 1000;
    fprintf(m_fLocalPublishTime, ",%d", m_countTag);
    fprintf(m_fLocalPublishTime, ",%ld", timeStamp);
    fflush(m_fLocalPublishTime);
  }
  return m_frameDataSize;
}

void CFileFrameGenerator::SetPublishTimeFile(const string &file)
{
  LOG_DEBUG("");
  m_fLocalPublishTime = fopen(file.c_str(), "w");
}