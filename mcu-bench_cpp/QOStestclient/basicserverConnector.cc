
#include "basicserverConnector.h"


using namespace std;
//using namespace woogeen::base;

int MyBasicServerConnector::sockfd = 0;
char MyBasicServerConnector::str1[4096];
char MyBasicServerConnector::str2[2048];
char MyBasicServerConnector::str3[ARGB_str3len];
char MyBasicServerConnector::str4[ARGB_str4len];
char MyBasicServerConnector::str5[2048];
char MyBasicServerConnector::str6[4096];
char MyBasicServerConnector::str7[2048];
char MyBasicServerConnector::str8[4096];
char *MyBasicServerConnector::lenstr1;
char *MyBasicServerConnector::lenstr2;
char *MyBasicServerConnector::lenstr3;
char *MyBasicServerConnector::lenstr4;
char *MyBasicServerConnector::FpsData;
char *MyBasicServerConnector::BitrateData;
char *MyBasicServerConnector::TimeData;
char *MyBasicServerConnector::pTagData;
char *MyBasicServerConnector::pTimeData;
socklen_t MyBasicServerConnector::len1;
socklen_t MyBasicServerConnector::len2;
socklen_t MyBasicServerConnector::len3;
socklen_t MyBasicServerConnector::len4;
int MyBasicServerConnector::isConneted = 0;
int MyBasicServerConnector::FpsInt = 0;
long MyBasicServerConnector::BitrateLong = 0;
int MyBasicServerConnector::TagInt = 0;
queue<uint8_t *> MyBasicServerConnector::ARGBDataQ;
queue<int> MyBasicServerConnector::FpsDataQ;
queue<long> MyBasicServerConnector::BitrateDataQ;
queue<long> MyBasicServerConnector::TimestampDataQ;
queue<int> MyBasicServerConnector::publishTagDataQ;
queue<long> MyBasicServerConnector::publish_TimestampDataQ;
char MyBasicServerConnector::ARGBValueData[2];
unsigned char *MyBasicServerConnector::ptr;
long MyBasicServerConnector::sendedARGBBuffer = 0;
long MyBasicServerConnector::timestamp = 0;
long MyBasicServerConnector::ptimestamp = 0;
int MyBasicServerConnector::isAddPostBlockHead = 0;
int MyBasicServerConnector::ARGBsendLock = 0;//at first ,the thread should not be locked,when it is sending data,it should be locked.
int MyBasicServerConnector::ARGBsockLock = 0;
int MyBasicServerConnector::isFirstTimeConnect = 0;
int MyBasicServerConnector::TagRound = 0;

MyBasicServerConnector::MyBasicServerConnector()
{
    ;//todo
}

MyBasicServerConnector::~MyBasicServerConnector()
{
    ;//todo
}



int MyBasicServerConnector::TestConnect()
{
  int result = 0;
  struct sockaddr_in servaddr;

  if ((sockfd = socket(AF_INET, SOCK_STREAM, 0)) < 0 )
  {
    printf("---------------------socket error!---------------------------------------------------------------\n");
    exit(0);
  }

  bzero(&servaddr,sizeof(servaddr)); //描述端口信息
  servaddr.sin_family = AF_INET;
  servaddr.sin_port = htons(PORT);

  if (inet_pton(AF_INET, IPSTR, &servaddr.sin_addr) <= 0 )
  {
    printf("---------------------inet_pton error!------------------------------------------\n");
    exit(0);
  }
  if (connect(sockfd, (struct sockaddr *)&servaddr, sizeof(servaddr)) < 0) //绑定端口
  {
    printf("---------------------connect error!---------------------\n");
    exit(0);
  }
  else
  {
    isConneted = 1;
    result = 1;
    std::cout <<"---------------------connect success------------------------------"<<endl;
  }
  if (isFirstTimeConnect == 0)//if it is the first time connect,send a /clear.
  {
    memset(str1, 0, 4096);
    strcat(str1, "POST /clear HTTP/1.1\r\n");
    strcat(str1, "Host: 127.0.0.1:4002\r\n");
    strcat(str1, "Connection: keep-alive\r\n");
    strcat(str1, "Accept: */*\r\n");
    strcat(str1, "Origin: http://127.0.0.1:4002\r\n");
    strcat(str1, "X-Requested-With: XMLHttpRequest\r\n");
    strcat(str1, "User-Agent: Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/57.0.2987.98 Safari/537.36\r\n");
    strcat(str1, "Content-Type: application/x-www-form-urlencoded; charset=UTF-8\r\n");
    strcat(str1, "Referer: http://127.0.0.1:4002/\r\n");
    strcat(str1, "Accept-Encoding: gzip, deflate, br\r\n");
    strcat(str1, "Accept-Language: en-US,en;q=0.8\r\n");
    strcat(str1, "\r\n");

    if (isConneted > 0)
    {
      if(send(sockfd,str1 ,strlen(str1),MSG_NOSIGNAL)>0)
      {
        cout<<"发送clear成功\n";
        isFirstTimeConnect = 1;
        //ready to send more data
      }
      else
      {
        cout<<"发送x\n";
      }
    }
  }

  return result;
}



void MyBasicServerConnector::SendFps()
{
  FpsData = (char *)malloc(128);
  lenstr1=(char *)malloc(128);
 // ofstream localFPS;
 // localFPS.open("../../native/Data/localFPS.txt", ios::out | ios::trunc);


//  FILE *localFPS = fopen("../../native/Data/localFPS.txt", "w"); 
  while(true)
  {
    if (!FpsDataQ.empty())
    {
      FpsInt = FpsDataQ.front();
      sprintf(FpsData, "%d", FpsInt);//'int' to 'const char*'
//      fprintf(localFPS, ",%d", FpsInt);
//      fflush(localFPS);
     //localFPS << "," << FpsInt ;
     // cout << "FPS:" << FpsInt << endl;

      if (FpsInt > 0)
      {
        memset(str2, 0, 2048);
        strcat(str2, "fpsd=");
        strcat(str2, FpsData);
        len1 = strlen(str2);
        sprintf(lenstr1, "%d", len1);

        memset(str1, 0, 4096);
        strcat(str1, "POST /fpssender HTTP/1.1\r\n");
        strcat(str1, "Host: 127.0.0.1:4002\r\n");
        strcat(str1, "Connection: keep-alive\r\n");
        strcat(str1, "Content-Length: ");
        strcat(str1, lenstr1);
        strcat(str1, "\r\n");
        strcat(str1, "Accept: */*\r\n");
        strcat(str1, "Origin: http://127.0.0.1:4002\r\n");
        strcat(str1, "X-Requested-With: XMLHttpRequest\r\n");
        strcat(str1, "User-Agent: Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/57.0.2987.98 Safari/537.36\r\n");
        strcat(str1, "Content-Type: application/x-www-form-urlencoded; charset=UTF-8\r\n");
        strcat(str1, "Referer: http://127.0.0.1:4002/\r\n");
        strcat(str1, "Accept-Encoding: gzip, deflate, br\r\n");
        strcat(str1, "Accept-Language: en-US,en;q=0.8\r\n");
        strcat(str1, "\r\n");
        strcat(str1, str2);

        if (isConneted > 0)
        {
          if(send(sockfd,str1 ,strlen(str1),MSG_NOSIGNAL)>0)
          {
            //cout<<"发送FPSdata成功\n";
          }
          else
          {
            cout<<"FPS发送x\n";
          }
        }
      }
      FpsDataQ.pop();
    }
   // std::this_thread::sleep_for(std::chrono::milliseconds(3000));
  }
//  fclose(localFPS);
  std::this_thread::sleep_for(std::chrono::milliseconds(3000));
 // localFPS.close();
}


void MyBasicServerConnector::SendARGB()
{
  TimeData = (char *)malloc(128);
  lenstr2=(char *)malloc(512);
//  FILE *localARGB = fopen("../../native/Data/localARGB.txt", "w");
//  FILE *localLatency = fopen("../../native/Data/localLatency.txt", "w");
//  fprintf(localARGB, ",");
//  fprintf(localLatency, ",");
  while(true)
  {
    cout<<"--------------------------frames in queue:"<<ARGBDataQ.size()<<endl;

    if (!ARGBDataQ.empty() && !TimestampDataQ.empty())//one frame ARGBBuffer
    {
      timestamp = TimestampDataQ.front();
      TimestampDataQ.pop();
      sprintf(TimeData, "%ld", timestamp);//'int' to 'const char*'
//      fprintf(localARGB, "%ld,", timestamp);
//      fprintf(localLatency, "%ld,", timestamp);  
      int sendcount = 0;
      ptr = ARGBDataQ.front();
      int value = 0;
      memset(str3, 0, ARGB_str3len);
      strcat(str3, "vrd=,");//the first 'vrd'
      strcat(str3, TimeData);
      isAddPostBlockHead = 0;
      unsigned char *ptrTmp = ptr;

     // fprintf(result,",0,");
      if (ARGBsendLock == 0)
      {
        for (long i = 0; i < video_width*video_height*4; ++i)
        {
          //cout<<ptrTmp<<endl;
          value = (int)(*ptrTmp);
          ptrTmp++;
          sprintf(ARGBValueData,"%d",value);
  //        fprintf(localARGB, "%d", value);
   //       fprintf(localARGB, ",");

    //      if (i/4%1280 >= 0 && i/4%1280 <= 239 && i/4/1280 >=0 && i/4/1280 <= 59)
     //     {
     //       fprintf(localLatency, "%d,", value);
            //fflush(localLatency);
     //     }

          if (isAddPostBlockHead == 1)
          {
            strcat(str3, "vrd=");
            isAddPostBlockHead = 0;//only add once
          }
          strcat(str3,",");
          strcat(str3,ARGBValueData);
          sendedARGBBuffer = sendedARGBBuffer + 2;
          sendcount++;

          if ((sendedARGBBuffer >= ARGB_sendBlock) || (i >= (video_width*video_height*4-1)))
          {
            ARGBsendLock = 1;//data sending start,lock the thread
            if (i >= (video_width*video_height*4-1))//the last block,should add a over sign
            {
              strcat(str3,"frame");
            }

            //trans once
            len2 = strlen(str3);
            sprintf(lenstr2, "%d", len2);

            memset(str4, 0, ARGB_str4len);
            strcat(str4, "POST /mixsender HTTP/1.1\r\n");
            strcat(str4, "Host: 127.0.0.1:4002\r\n");
            strcat(str4, "Connection: keep-alive\r\n");
            strcat(str4, "Content-Length: ");
            strcat(str4, lenstr2);
            strcat(str4, "\r\n");
            strcat(str4, "Accept: */*\r\n");
            strcat(str4, "Origin: http://127.0.0.1:4002\r\n");
            strcat(str4, "X-Requested-With: XMLHttpRequest\r\n");
            strcat(str4, "User-Agent: Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/57.0.2987.98 Safari/537.36\r\n");
            strcat(str4, "Content-Type: application/x-www-form-urlencoded; charset=UTF-8\r\n");
            strcat(str4, "Referer: http://127.0.0.1:4002/\r\n");
            strcat(str4, "Accept-Encoding: gzip, deflate, br\r\n");
            strcat(str4, "Accept-Language: en-US,en;q=0.8\r\n");
            strcat(str4, "\r\n");
            strcat(str4, str3);

            if (i >= (video_width*video_height*4-1))//the last block,should add a over sign
            {
              //cout <<str4<<endl;
            }

            if (isConneted > 0)
            {
              if (ARGBsockLock == 2)
              {
                close (sockfd);
                int newConnectResult = MyBasicServerConnector::TestConnect();
                if (newConnectResult > 0)
                {
                  ARGBsockLock = 0;
                  cout<<"------socket reconnect------"<<endl;
                }
                else
                {
                  cout<<"------------------------------------------reconnect REEOR"<<endl;
                }
              }

              if (ARGBsockLock < 2)
              {
                if(send(sockfd,str4,strlen(str4),MSG_NOSIGNAL)>0)
                {
                  usleep(100);
                  //cout<<str4<<endl;
                }
                else
                {
                  cout<<"ARGB发送x\n";
                }
              }
            }

            memset(str3, 0, ARGB_str3len);//re_melloc
            sendedARGBBuffer = 0;
            isAddPostBlockHead = 1;//next time,a 'vrd=' should be added before the postdata.
            ARGBsendLock = 0;//a data pkg send over,unlock the thread
          }
        }
      }

      cout<<"--------------------------one frame trans over---------------------------"<<endl;
      sleep(ARGB_oneframe_trans_gap);
      ARGBsockLock++;
      //cout<<ARGBsockLock<<endl;
      delete [] ptr;
      ptr = NULL;
      ARGBDataQ.pop();
      //one frame trans done.
    }
  }
 // fclose(localARGB);
 // fclose(localLatency);
  std::this_thread::sleep_for(std::chrono::milliseconds(ARGB_thread_gap));
}



void MyBasicServerConnector::SendpublishDatas()
{
  pTagData = (char *)malloc(128);
  pTimeData = (char *)malloc(128);
  lenstr3=(char *)malloc(128);
  //FILE *localPublishTime = fopen("../../native/Data/localPublishTime.txt", "w");

  while(true)
  {
    if (!publishTagDataQ.empty() && !publish_TimestampDataQ.empty())
    {
      TagInt = publishTagDataQ.front();
      sprintf(pTagData, "%d", TagInt);//'int' to 'const char*'
      ptimestamp = publish_TimestampDataQ.front();
      sprintf(pTimeData, "%ld", ptimestamp);//'int' to 'const char*'
    //  fprintf(localPublishTime,",%d", TagInt);
    //  fprintf(localPublishTime,",%ld", ptimestamp);
    //  fflush(localPublishTime);

      memset(str5, 0, 2048);
      strcat(str5, "ptt=");
      strcat(str5, pTagData);
      strcat(str5, ",");
      strcat(str5, pTimeData);
      len3 = strlen(str5);
      sprintf(lenstr3, "%d", len3);

      memset(str6, 0, 4096);
      strcat(str6, "POST /pttsender HTTP/1.1\r\n");
      strcat(str6, "Host: 127.0.0.1:4002\r\n");
      strcat(str6, "Connection: keep-alive\r\n");
      strcat(str6, "Content-Length: ");
      strcat(str6, lenstr3);
      strcat(str6, "\r\n");
      strcat(str6, "Accept: */*\r\n");
      strcat(str6, "Origin: http://127.0.0.1:4002\r\n");
      strcat(str6, "X-Requested-With: XMLHttpRequest\r\n");
      strcat(str6, "User-Agent: Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/57.0.2987.98 Safari/537.36\r\n");
      strcat(str6, "Content-Type: application/x-www-form-urlencoded; charset=UTF-8\r\n");
      strcat(str6, "Referer: http://127.0.0.1:4002/\r\n");
      strcat(str6, "Accept-Encoding: gzip, deflate, br\r\n");
      strcat(str6, "Accept-Language: en-US,en;q=0.8\r\n");
      strcat(str6, "\r\n");
      strcat(str6, str5);

      if (isConneted > 0)
      {
        if(send(sockfd,str6 ,strlen(str6),MSG_NOSIGNAL)>0)
        {
          //cout<<"发送publishTag and Timestamp成功\n";
        }
        else
        {
          cout<<"ptt发送x\n";
        }
      }

      publish_TimestampDataQ.pop();
      publishTagDataQ.pop();
    }
    std::this_thread::sleep_for(std::chrono::milliseconds(300));
  }
  //fclose(localPublishTime);
}


void MyBasicServerConnector::SendBitrate()
{
  BitrateData = (char *)malloc(128);
  lenstr4=(char *)malloc(128);
 // FILE *localBitrate = fopen("../../native/Data/localBitrate.txt", "w"); 
  while(true)
  {
    //cout<<"--------------------------111111---------------------------"<<TimestampDataQ.size()<<endl;
    if (!BitrateDataQ.empty())
    {
      BitrateLong = BitrateDataQ.front();
      sprintf(BitrateData, "%ld", BitrateLong);//'int' to 'const char*'
    //  fprintf(localBitrate, ",%ld", BitrateLong);
    //  fflush(localBitrate);

      if (BitrateLong > 0)
      {
        memset(str7, 0, 2048);
        strcat(str7, "brd=");
        strcat(str7, BitrateData);
        len4 = strlen(str7);
        sprintf(lenstr4, "%d", len4);

        memset(str8, 0, 4096);
        strcat(str8, "POST /bitratesender HTTP/1.1\r\n");
        strcat(str8, "Host: 127.0.0.1:4002\r\n");
        strcat(str8, "Connection: keep-alive\r\n");
        strcat(str8, "Content-Length: ");
        strcat(str8, lenstr4);
        strcat(str8, "\r\n");
        strcat(str8, "Accept: */*\r\n");
        strcat(str8, "Origin: http://127.0.0.1:4002\r\n");
        strcat(str8, "X-Requested-With: XMLHttpRequest\r\n");
        strcat(str8, "User-Agent: Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/57.0.2987.98 Safari/537.36\r\n");
        strcat(str8, "Content-Type: application/x-www-form-urlencoded; charset=UTF-8\r\n");
        strcat(str8, "Referer: http://127.0.0.1:4002/\r\n");
        strcat(str8, "Accept-Encoding: gzip, deflate, br\r\n");
        strcat(str8, "Accept-Language: en-US,en;q=0.8\r\n");
        strcat(str8, "\r\n");
        strcat(str8, str7);

        if (isConneted > 0)
        {
          if(send(sockfd,str8 ,strlen(str8),MSG_NOSIGNAL)>0)
          {
            //cout<<"发送Bitratedata成功\n";
          }
          else
          {
            cout<<"Bitrate发送x\n";
          }
        }
      }
      //int FpsInt = Fps;
      BitrateDataQ.pop();
    }
    std::this_thread::sleep_for(std::chrono::milliseconds(3000));
  }
 // fclose(localBitrate);
}



void MyBasicServerConnector::CloseConnection()
{
     close (sockfd);
}


void MyBasicServerConnector::SaveFps()
{
  FILE *localFPS = fopen("../../native/Data/localFPS.txt", "w");
  while(true)
  {
    if (!FpsDataQ.empty())
    {
      FpsInt = FpsDataQ.front();
      fprintf(localFPS, ",%d", FpsInt);
      fflush(localFPS);

      FpsDataQ.pop();
    }
  }
  fclose(localFPS);
  std::this_thread::sleep_for(std::chrono::milliseconds(3000));
 // localFPS.close();
}


void MyBasicServerConnector::SaveARGB()
{
  FILE *localARGB = fopen("../../native/Data/localARGB.txt", "w");
  FILE *localLatency = fopen("../../native/Data/localLatency.txt", "w");
  fprintf(localARGB, ",");
  fprintf(localLatency, ",");
  while(true)
  {
    cout<<"--------------------------frames in queue:"<<ARGBDataQ.size()<<endl;

    if (!ARGBDataQ.empty() && !TimestampDataQ.empty())//one frame ARGBBuffer
    {
      timestamp = TimestampDataQ.front();
      TimestampDataQ.pop();
      fprintf(localARGB, "%ld,", timestamp);
      fprintf(localLatency, "%ld,", timestamp);

      ptr = ARGBDataQ.front();
      int value = 0;
      unsigned char *ptrTmp = ptr;
      for (long i = 0; i < video_width*video_height*4; ++i)
      {
          //cout<<ptrTmp<<endl;
          value = (int)(*ptrTmp);
          ptrTmp++;     
          fprintf(localARGB, "%d", value);
          fprintf(localARGB, ",");

          if (i/4%1280 >= 0 && i/4%1280 <= 239 && i/4/1280 >=0 && i/4/1280 <= 59)
          {
            fprintf(localLatency, "%d,", value);
            //fflush(localLatency);
          }
      }

      cout<<"--------------------------one frame trans over---------------------------"<<endl;
      sleep(ARGB_oneframe_trans_gap);
      delete [] ptr;
      ptr = NULL;
      ARGBDataQ.pop();
      //one frame trans done.
    }
  }
  fclose(localARGB);
  fclose(localLatency);
  std::this_thread::sleep_for(std::chrono::milliseconds(ARGB_thread_gap));
}


void MyBasicServerConnector::SaveBitrate()
{
  FILE *localBitrate = fopen("../../native/Data/localBitrate.txt", "w");
  while(true)
  {
    //cout<<"--------------------------111111---------------------------"<<TimestampDataQ.size()<<endl;
    if (!BitrateDataQ.empty())
    {
      BitrateLong = BitrateDataQ.front();
      fprintf(localBitrate, ",%ld", BitrateLong);
      fflush(localBitrate);
      BitrateDataQ.pop();
    }    
    std::this_thread::sleep_for(std::chrono::milliseconds(3000));
  }
  fclose(localBitrate);
}

void MyBasicServerConnector::SavepublishDatas()
{
  FILE *localPublishTime = fopen("../../native/Data/localPublishTime.txt", "w");

  while(true)
  {
    if (!publishTagDataQ.empty() && !publish_TimestampDataQ.empty())
    {
      TagInt = publishTagDataQ.front();
      ptimestamp = publish_TimestampDataQ.front();
      fprintf(localPublishTime,",%d", TagInt + 600*TagRound);
      fprintf(localPublishTime,",%ld", ptimestamp);
      fflush(localPublishTime);
      publish_TimestampDataQ.pop();
      publishTagDataQ.pop();
      if (TagInt == 600)
      {
        TagRound++;
      }
    }
    //std::this_thread::sleep_for(std::chrono::milliseconds(300));
    std::this_thread::sleep_for(std::chrono::milliseconds(20));
  }
  fclose(localPublishTime);
}
