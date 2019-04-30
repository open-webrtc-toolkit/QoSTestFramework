/*
*
*Intel License
*
*/
#include <iostream>

#include "owt/conference/remotemixedstream.h"
#include "conferencesampleobserver.h"
#include "myVideoRenderer.h"
#include "basicserverConnector.h"
//#include "dfbvideorenderer.h"
using namespace std;
using namespace owt::base;
using namespace owt::conference;

ConferenceSampleObserver::ConferenceSampleObserver(shared_ptr<ConferenceClient> client)
  :client_(client) {
}

void ConferenceSampleObserver::OnStreamAdded(shared_ptr<RemoteMixedStream> stream) {
  remote_stream_ = stream;
  std::vector<VideoFormat> formats = stream->SupportedVideoFormats();
  SubscribeOptions options;

  

  for(auto it=formats.begin(); it!=formats.end(); it++){
    options.resolution.width = (*it).resolution.width;
    options.resolution.height = (*it).resolution.height;
    break;
  }
  client_->Subscribe(remote_stream_,
                     options,
                     [&](std::shared_ptr<RemoteStream> rstream){
                      std::cout <<"---------------------Subscribe succeed------------------------------"<<endl;
                      //std::shared_ptr<MyVideoRenderer> myVideoRenderer(new MyVideoRenderer);
                      MyVideoRenderer* myVideoRenderer = new MyVideoRenderer();
                      rstream->AttachVideoRenderer(*myVideoRenderer);
                      //  DFBVideoRenderer* dfbVideoRenderer = new DFBVideoRenderer();
                      //  rstream->AttachVideoRenderer(*dfbVideoRenderer);
                    
                      int remoteID=atoi((rstream->From()).c_str());
                    //  std::thread FpsSendThread(MyBasicServerConnector::SendFps);
                    //  std::thread BitrateSendThread(MyBasicServerConnector::SendBitrate);
                    //  std::thread ARGBSendThread(MyBasicServerConnector::SendARGB);
                      
                      std::thread FpsSaveThread(MyBasicServerConnector::SaveFps);
                      std::thread BitrateSaveThread(MyBasicServerConnector::SaveBitrate);
                      std::thread ARGBSaveThread(MyBasicServerConnector::SaveARGB);
                    //  std::thread publishDataSaveThread(MyBasicServerConnector::SavepublishDatas);
                      //getstats
                      //int interval = 0;
                      while(1) {
                        sleep(3);
                        //++interval;
                        //if (interval%2 == 0) {
                          client_->GetConnectionStats(rstream,
                                                  [=](std::shared_ptr<ConnectionStats> stats) {
                                                    MyBasicServerConnector::FpsDataQ.push(stats->video_receiver_reports[remoteID]->framerate_output);
                                                    MyBasicServerConnector::BitrateDataQ.push(stats->video_receiver_reports[remoteID]->bytes_rcvd);
                                                  },
                                                  [=](unique_ptr<ConferenceException>) {
                                                    cout << "GetConnectionStats failed" << endl;
                                                  });
                        //}
                      }
                     },
                     [=](std::unique_ptr<ConferenceException>){
                       std::cout <<"Subscribe failed"<<endl;
                     });
}
