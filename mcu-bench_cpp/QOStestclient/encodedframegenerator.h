// Copyright (C) <2019> Intel Corporation
//
// SPDX-License-Identifier: Apache-2.0
#pragma once

#include "owt.h"
#include <stdio.h>
#include <string>

using namespace std;

class CEncodedVideoInput : public VideoEncoderInterface
{
public:
    static CEncodedVideoInput *Create(const string &videoFile, VideoCodec codec);
    CEncodedVideoInput(const string &videoFile, VideoCodec codec);
    ~CEncodedVideoInput();

    virtual bool InitEncoderContext(Resolution &resolution, uint32_t fps, uint32_t bitrate, VideoCodec video_codec) override;
    virtual bool EncodeOneFrame(vector<uint8_t> &buffer, bool keyFrame) override;
    virtual bool Release() override;
    virtual VideoEncoderInterface *Copy() override;
    void SetPublishTimeFile(const string &file);

private:
    string m_videoPath;
    VideoCodec m_codec;
    FILE *m_fd;
    FILE *m_fLocalPublishTime;
};
