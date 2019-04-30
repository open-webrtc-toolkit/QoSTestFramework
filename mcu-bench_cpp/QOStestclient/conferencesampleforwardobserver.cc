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
using namespace owt::base;
using namespace owt::conference;

ConferenceSampleForwardObserver::ConferenceSampleForwardObserver(shared_ptr<ConferenceClient> client)
  :client_(client) {
}

void ConferenceSampleForwardObserver::OnStreamAdded(shared_ptr<RemoteStream> stream) {
  remote_stream_ = stream;
  SubscribeOptions options;
  std::cout <<"Subscribe forward stream"<<endl;



  client_->Subscribe(remote_stream_,
                     options,
                     [&](std::shared_ptr<ConferenceSubscription> subscription){
                      std::cout <<"---------------------Subscribe succeed------------------------------"<<endl;
                      //std::shared_ptr<MyVideoRenderer> myVideoRenderer(new MyVideoRenderer);
                      MyVideoRenderer* myVideoRenderer = new MyVideoRenderer();
                      //rstream->AttachVideoRenderer(*myVideoRenderer);

//                      DFBVideoRenderer* myVideoRenderer = new DFBVideoRenderer();
                      remote_stream_->AttachVideoRenderer(*myVideoRenderer);
                      int remoteID=atoi((remote_stream_->Origin()).c_str());
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
                          subscription->GetStats(
                                                  [=](std::shared_ptr<ConnectionStats> stats) {
                                                    MyBasicServerConnector::FpsDataQ.push(stats->video_receiver_reports[remoteID]->framerate_output);
                                                    MyBasicServerConnector::BitrateDataQ.push(stats->video_receiver_reports[remoteID]->bytes_rcvd);
                                                  },
                                                  [=](unique_ptr<Exception>) {
                                                    cout << "GetConnectionStats failed" << endl;
                                                  });
                        //}
                      }
                     },
                     [=](std::unique_ptr<Exception>){
                       std::cout <<"Subscribe failed"<<endl;
                     });













}
