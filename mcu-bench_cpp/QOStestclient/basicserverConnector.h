#ifndef MY_BASICSERVER_CONNECTOR_H_
#define MY_BASICSERVER_CONNECTOR_H_

#include <iostream>
#include <stdio.h>
#include <sys/socket.h>
#include <sys/types.h>
#include <time.h>
#include <errno.h>
#include <signal.h>
#include <stdlib.h>
#include <string.h>
#include <unistd.h>
#include <sys/wait.h>
#include <sys/time.h>
#include <netinet/in.h>
#include <arpa/inet.h>
//for thread
#include <utility>
#include <thread>
#include <chrono>
#include <functional>
#include <atomic>
#include <ctime>
#include <unistd.h>
#include <pthread.h>
//for queue
#include <string.h>
#include <queue>
#include <cstdlib>
//file write
#include <cstring>
#include <unistd.h>
#include <errno.h>
#include <fcntl.h>
//for vector
#include <vector>
//for sleep
#include <unistd.h>
//for reading and writing files
#include <stdio.h>
#include <fstream>


//using namespace woogeen::base;
//namespace woogeen {
//namespace base {

using namespace std;

#define IPSTR "127.0.0.1"
#define PORT 4002
#define BUFSIZE 4096

#define video_width 1280
#define video_height 720

#define ARGB_sendBlock 2048
#define ARGB_str3len 6000
#define ARGB_str4len 8000
#define ARGB_oneframe_trans_gap 1//5
#define ARGB_thread_gap 5000//30000

class MyBasicServerConnector
{
public:
    static int TestConnect();
    //static void SendThread(int n);
    static bool Create(int width, int height);
    static void SendFps();
    static void SendBitrate();
    static void SendARGB();
    static void CloseConnection();
    static void SendpublishDatas();
    static void SaveFps();
    static void SaveARGB();
    static void SavepublishDatas();
    static void SaveBitrate();

    MyBasicServerConnector();
    ~MyBasicServerConnector();

    static int sockfd;
    static char str1[4096], str2[2048], str3[ARGB_str3len], str4[ARGB_str4len],buf[BUFSIZE], str5[2048], str6[4096], str7[2048], str8[4096],*lenstr1,*lenstr2,*lenstr3,*lenstr4,*FpsData,*TimeData,*pTagData,*pTimeData,*BitrateData;
    static socklen_t len1,len2,len3,len4;
    static int isConneted;

    static queue<int> FpsDataQ;
    static queue<long> BitrateDataQ;
    static queue<uint8_t *> ARGBDataQ;
    static queue<long> TimestampDataQ;
    static queue<int> publishTagDataQ;
    static queue<long> publish_TimestampDataQ;

    static char ARGBValueData[2];
    static unsigned char *ptr;
    static long sendedARGBBuffer;
    static long timestamp;
    static long ptimestamp;
    static int FpsInt;
    static long BitrateLong;
    static int TagInt;
    static int isAddPostBlockHead;
    static int ARGBsendLock;//when it is 1,means the thread should be locked.
    static int ARGBsockLock;
    static int isFirstTimeConnect;
    static int TagRound;
    static int width_;
    static int height_;
};
//}
//}



#endif
