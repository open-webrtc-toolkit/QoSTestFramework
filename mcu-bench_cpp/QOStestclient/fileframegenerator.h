// Copyright (C) <2019> Intel Corporation
//
// SPDX-License-Identifier: Apache-2.0
#pragma once

#include "owt.h"
#include <stdio.h>
#include <string>
#include <fstream>

using namespace std;

class CFileFrameGenerator : public VideoFrameGeneratorInterface
{
public:
  CFileFrameGenerator(int width, int height, int fps, string filename);
  ~CFileFrameGenerator();

  uint32_t GetNextFrameSize();
  uint32_t GenerateNextFrame(uint8_t *frame_buffer, const uint32_t capacity);
  int GetHeight();
  int GetWidth();
  int GetFps();
  VideoFrameGeneratorInterface::VideoFrameCodec GetType();
  void SetPublishTimeFile(const string &file);

private:
  int m_countTag;
  int m_width;
  int m_height;
  int m_fps;
  uint32_t m_frameDataSize;
  string m_videoPath;
  VideoFrameGeneratorInterface::VideoFrameCodec m_type;
  fstream m_fd;
  //FILE *m_fd;
  FILE *m_fLocalPublishTime;
};
