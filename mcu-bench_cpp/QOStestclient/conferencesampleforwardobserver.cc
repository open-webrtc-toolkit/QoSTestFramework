/*
*
*Intel License
*
*/
#include <iostream>

#include "conferencesampleforwardobserver.h"
#include "myVideoRenderer.h"
//#include "dfbvideorenderer.h"
#include "basicserverConnector.h"

using namespace std;
using namespace woogeen::base;
using namespace woogeen::conference;

ConferenceSampleForwardObserver::ConferenceSampleForwardObserver(shared_ptr<ConferenceClient> client)
  :client_(client) {
}

void ConferenceSampleForwardObserver::OnStreamAdded(shared_ptr<RemoteCameraStream> stream) {
  remote_stream_ = stream;
  SubscribeOptions options;
  std::cout <<"Subscribe forward stream"<<endl;



  client_->Subscribe(remote_stream_,
                     options,
                     [&](std::shared_ptr<RemoteStream> rstream){
                      std::cout <<"---------------------Subscribe succeed------------------------------"<<endl;
                      //std::shared_ptr<MyVideoRenderer> myVideoRenderer(new MyVideoRenderer);
                      MyVideoRenderer* myVideoRenderer = new MyVideoRenderer();
                      //rstream->AttachVideoRenderer(*myVideoRenderer);

//                      DFBVideoRenderer* myVideoRenderer = new DFBVideoRenderer();
                      rstream->AttachVideoRenderer(*myVideoRenderer);
                      int remoteID=atoi((rstream->From()).c_str());
                    //  std::thread FpsSendThread(MyBasicServerConnector::SendFps);
                    //  std::thread BitrateSendThread(MyBasicServerConnector::SendBitrate);
                    //  std::thread ARGBSendThread(MyBasicServerConnector::SendARGB);

                      std::thread FpsSaveThread(MyBasicServerConnector::SaveFps);
                      std::thread BitrateSaveThread(MyBasicServerConnector::SaveBitrate);
                      std::thread ARGBSaveThread(MyBasicServerConnector::SaveARGB);

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
