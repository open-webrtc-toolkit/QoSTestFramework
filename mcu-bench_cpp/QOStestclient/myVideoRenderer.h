#ifndef MY_VIDEO_RENDERER_H_
#define MY_VIDEO_RENDERER_H_

#include "owt/base/videorendererinterface.h"
#include <iostream>
#include <stdlib.h>
#include <stdio.h>
#include <sys/time.h>
#include <unistd.h>

using namespace owt::base;
//namespace owt {
//namespace base {

class MyVideoRenderer : public VideoRendererInterface
{
public:
	void RenderFrame(std::unique_ptr<VideoBuffer> buffer);
    VideoRendererType Type();
	MyVideoRenderer();
	~MyVideoRenderer();

	int width;
	int height;
	struct timeval tv;
	uint8_t* argb;
	int mynum;
};
//}
//}

#endif
