// Copyright (C) <2019> Intel Corporation
//
// SPDX-License-Identifier: Apache-2.0
#pragma once

#include "owt.h"
#include <iostream>
#include <owt.h>
#include <stdio.h>
#include <stdlib.h>
#include <sys/time.h>
#include <unistd.h>

using namespace std;

class CMyVideoRenderer : public VideoRendererInterface
{
public:
	void RenderFrame(unique_ptr<VideoBuffer> videoFrame);
	VideoRendererType Type();
	CMyVideoRenderer();
	~CMyVideoRenderer();
	void SetLocalARGBFile(const string &file);
	void SetLocalLatencyFile(const string &file);

private:
	int m_width;
	int m_height;
	struct timeval m_tv;
	int m_num;
	FILE *m_fLocalARGB;
	FILE *m_fLocalLatency;
};
