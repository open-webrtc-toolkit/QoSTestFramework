// Copyright (C) <2019> Intel Corporation
//
// SPDX-License-Identifier: Apache-2.0
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
  LOG_DEBUG("m_videoPath is %s", m_videoPath.c_str());
  m_fd.open(m_videoPath.c_str(), ios::in);
  if (m_fd.is_open())
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
  if (!m_fd.is_open() && capacity < m_frameDataSize)
  {
    return 0;
  }
  if (m_fd.eof())
  {
    LOG_DEBUG("m_fd is eof");
    m_fd.clear();
    m_fd.seekg(0, ios::beg);
  }
  m_fd.read(reinterpret_cast<char *>(frameBuffer), m_frameDataSize);
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