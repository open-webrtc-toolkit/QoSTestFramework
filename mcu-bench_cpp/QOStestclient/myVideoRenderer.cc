#include <iostream>
#include "myVideoRenderer.h"
#include "basicserverConnector.h"

using namespace std;
//using namespace ics::base;



MyVideoRenderer::MyVideoRenderer() 
{
	timeval tv;
	mynum = 0;
}

void MyVideoRenderer::RenderFrame(std::unique_ptr<VideoBuffer> video_frame) 
{
	if (video_frame)
	{
		width = video_frame->resolution.width;
		height = video_frame->resolution.height;

		mynum++;
		if (mynum == 40)
		{
			uint8_t* argb = new uint8_t[width*height*4];
			memcpy(argb,video_frame->buffer,width*height*4);
			MyBasicServerConnector::ARGBDataQ.push(argb);
			gettimeofday(&tv,NULL);

			//printf("second:%ld\n",tv.tv_sec);  //秒
    		//printf("millisecond:%ld\n",tv.tv_sec*1000 + tv.tv_usec/1000);  //毫秒
    		//printf("microsecond:%ld\n",tv.tv_sec*1000000 + tv.tv_usec);  //微秒
			MyBasicServerConnector::TimestampDataQ.push(tv.tv_sec%10000*1000 + tv.tv_usec/1000);//sample:2773862 usec
			//got the last 4 numbers of the sec,and 
			mynum = 0;
		}

	}
	else
	{
		std::cout <<"---------------------null---"<<endl;
	}
	;//todo
}

VideoRendererType MyVideoRenderer::Type() {
   return ics::base::VideoRendererType::kARGB ;
}

MyVideoRenderer::~MyVideoRenderer() 
{
	;//todo
}
