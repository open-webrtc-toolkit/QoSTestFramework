//
//Intel License
//
// testclient.cc : Defines the entry point for the console application.
//
#include <iostream>
#include "ics/conference/conferenceclient.h"
#include "ics/conference/remotemixedstream.h"
#include "ics/conference/conferencepublication.h"
#include "ics/conference/conferencesubscription.h"
#include "ics/base/globalconfiguration.h"
#include "ics/base/localcamerastreamparameters.h"
#include "ics/base/stream.h"
#include "fileframegenerator.h"
#include "encodedframegenerator.h"
//#include "fileaudioframegenerator.h"
#include "asio_token.h"
#include "conferencesampleforwardobserver.h"
#include "basicserverConnector.h"
#include "directvideoencoder.h"
#include "myVideoRenderer.h"
#include <unistd.h>
#include <chrono>
#include <ctime>
#include <stdio.h>
#include <stdlib.h>
#include <sys/time.h>



using namespace std;
using namespace ics::base;
using namespace ics::conference;

std::shared_ptr<RemoteMixedStream> remote_mixed_stream;
ConferenceClientConfiguration configuration;

int main(int argc, char** argv)
{
  //daemon(1,1);
  using namespace ics::base;
  using namespace ics::conference;
 // std::string audiopath("");
  std::string videopath("");
  std::string roomId("");
  std::string scheme("http://");
  std::string suffix("/createToken");
  EncodedMimeType type;
  int width;
  int height;
  int fps;
  bool publish = true;
  bool subscribe = true;
  //true for mix mode, false for forward mode
  bool mode = true;
  std::string isp("");
  std::string region("");
  std::string codec_used("");

  if(argc >= 2){
    std::string hosturl(argv[1]);
    scheme.append(hosturl);
  }else{
    std::string fixed("10.239.44.59:3004");
    scheme.append(fixed);
  }

  if(argc >= 3){
    std::string roomStr(argv[2]);
    roomId.append(roomStr);
  }

  if(argc >= 4){
    std::string codec(argv[3]);
    if (codec.find("h264") != std::string::npos) {
      codec_used ="h264";
      type = EncodedMimeType::ENCODED_H264;
    }else{
      codec_used = "vp8";
      type = EncodedMimeType::ENCODED_VP8;
    }
  }else{
    codec_used = "vp8";
    type = EncodedMimeType::ENCODED_VP8;
  }

  if(argc >= 5){
    std::string res(argv[4]);
    if (res.find("1080") != std::string::npos) {
      width = 1920;
      height = 1080;
    }else if (res.find("720") != std::string::npos){
      width = 1280;
      height = 720;
      //cout <<"-------------------------------------------720P---------------------------------------"<<endl;
      //pause();
    }else if (res.find("vga") != std::string::npos){
      width = 640;
      height = 480;
    }else{
      width = 320;
      height = 240;
    }
  }else{
    width = 640;
    height = 480;
  }

  if(argc >= 6){
    fps = atoi(argv[5]);
  }else{
    fps = 20;
  }

  if(argc >= 7){
    std::string ps(argv[6]);
    cout <<" ============ps param:"<<ps;
    if ((ps.find("p") == std::string::npos) && (ps.find("P") == std::string::npos)) {
      cout <<" ============false publish==========";
      publish = false;
    }

    if ((ps.find("s") == std::string::npos) && (ps.find("S") == std::string::npos)) {
      cout <<" ============false subscribe==========";
      subscribe = false;
    }
  }

  if(argc >= 8){
    std::string sMode(argv[7]);
    if ((sMode.find("f") != std::string::npos) | (sMode.find("F") != std::string::npos)) {
      mode = false;
    }
  }
/*
  if(argc >= 9){
    std::string path(argv[8]);
    audiopath.append(path);
    audiopath.append("/audio_long16.pcm");
    videopath.append(path);
    //videopath.append("/source.avi");
    //videopath.append("/testFourPeopleHD720P.avi");
    videopath.append("/testFourPeopleHD720P.avi");
  }else{
    audiopath.append("./audio_long16.pcm");
    //videopath.append("./source.avi");
    //videopath.append("/testFourPeopleHD720P.avi");
    videopath.append("/testFourPeopleHD720P.avi");
  }

  std::unique_ptr<ics::base::AudioFrameGeneratorInterface> audio_generator(FileAudioFrameGenerator::Create(audiopath));
  if (audio_generator == nullptr){
    return -1;
  }*/
  //GlobalConfiguration::SetEncodedVideoFrameEnabled(true);
  //GlobalConfiguration::SetCustomizedAudioInputEnabled(true, std::move(audio_generator));

  ics::base::VideoCodec codec_name;
  if (codec_used.find("h264") != std::string::npos) {
    codec_name = ics::base::VideoCodec::kH264;
  } else if(codec_used.find("vp8") != std::string::npos) {
    codec_name = ics::base::VideoCodec::kVp8;
  } else {
    codec_name = ics::base::VideoCodec::kVp8;
  }


  IceServer ice;
  ice.urls.push_back("stun:61.152.239.56");
  ice.username = "";
  ice.password = "";
  vector<IceServer> ice_servers;
  ice_servers.push_back(ice);
  configuration.ice_servers = ice_servers;

  scheme.append(suffix);
  std::shared_ptr<ConferenceClient> room = ConferenceClient::Create(configuration);

  ConferenceSampleForwardObserver *forwardobserver = nullptr;
  if(subscribe) {
    if(mode) {
      cout <<" ============Mix mode==========";
    }
    else {
      cout <<" ============Forward mode==========";
      forwardobserver = new ConferenceSampleForwardObserver(room);
      room->AddObserver(*forwardobserver);
    }
  }

//  cout << "Press Enter to connect room." << std::endl;
 // cin.ignore();

  string token = getToken(scheme, roomId, "", "", false);

// following code is used for encoded file input
#if 0 
  std::unique_ptr<FileFrameGenerator> framer(new FileFrameGenerator(1280, 720, 30));
  std::shared_ptr<LocalCustomizedStreamParameters> lcsp(new LocalCustomizedStreamParameters(true, true));
  std::shared_ptr<ics::base::LocalStream> shared_stream;
  shared_stream = LocalStream::Create(lcsp, std::move(framer));
#endif
// following code is used for raw file input
#if 1 
   GlobalConfiguration::SetEncodedVideoFrameEnabled(true);
   VideoEncoderInterface* external_encoder = DirectVideoEncoder::Create(codec_name);
   Resolution res(1280, 720);
   shared_ptr<LocalCustomizedStreamParameters> lcsp(new LocalCustomizedStreamParameters(true, true, res, 30, 2000));
   std::shared_ptr<ics::base::LocalStream> shared_stream;
   shared_stream = LocalStream::Create(lcsp, external_encoder);
#endif

  if (token != "") {
      room->Join(token,
          [=](std::shared_ptr<ConferenceInfo> info) {
              // Subscribe mixed stream if indicated so 
              if (subscribe && mode) {
                std::vector<std::shared_ptr<RemoteStream>> remote_streams = info->RemoteStreams();
                for (auto& remote_stream : remote_streams) {
                  if (remote_stream->Source().video == VideoSourceInfo::kMixed) {
                    remote_mixed_stream = std::static_pointer_cast<RemoteMixedStream>(remote_stream);
                    break;
                  }
                }

                SubscribeOptions options;
                VideoCodecParameters codec_param1;
                codec_param1.name = codec_name;
                options.video.codecs.push_back(codec_param1);

                room->Subscribe(remote_mixed_stream,
                                options,
                                [&](std::shared_ptr<ConferenceSubscription> subscription) {
                                  cout << "==============Subscribe succeed===========" << endl;
                      MyVideoRenderer* myVideoRenderer = new MyVideoRenderer();
                      remote_mixed_stream->AttachVideoRenderer(*myVideoRenderer);
                      //  DFBVideoRenderer* dfbVideoRenderer = new DFBVideoRenderer();
                      //  rstream->AttachVideoRenderer(*dfbVideoRenderer);
                    
                      int remoteID=atoi((remote_mixed_stream->Origin()).c_str());
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
                                [=](std::unique_ptr<Exception>) {

                                  cout << "==============Subscribe failed============" << endl;
                                });
	      } else if(subscribe && !mode) { //subscribing existing forward stream instead
		      std::vector<std::shared_ptr<RemoteStream>> remote_streams = info->RemoteStreams();
		      for (auto& remote_stream : remote_streams) {
			      if (remote_stream->Source().video == VideoSourceInfo::kCamera) {
				      SubscribeOptions options;
				      VideoCodecParameters codec_param1;
				      codec_param1.name = codec_name;
				      options.video.codecs.push_back(codec_param1);

				      room->Subscribe(remote_stream,
						      options,
						      [&](std::shared_ptr<ConferenceSubscription> subscription) {
						      cout << "==============Subscribe succeed===========" << endl;
						      MyVideoRenderer* myVideoRenderer = new MyVideoRenderer();
						      remote_stream->AttachVideoRenderer(*myVideoRenderer);
						      //  DFBVideoRenderer* dfbVideoRenderer = new DFBVideoRenderer();
						      //  rstream->AttachVideoRenderer(*dfbVideoRenderer);

						      int remoteID=atoi((remote_stream->Origin()).c_str());
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
						      [=](std::unique_ptr<Exception>) {

							      cout << "==============Subscribe failed============" << endl;
						      });


			      }
		      }



	      }
              // Publish if indicated so
              if(publish) {
                PublishOptions options;
                VideoCodecParameters codec_param1;
                codec_param1.name = codec_name;
                VideoEncodingParameters encoding_param1(codec_param1, 0, false);

                room->Publish(shared_stream,
                              options,
                              [=](std::shared_ptr<ConferencePublication> publication) {
                                cout <<" ============Publish succeed=========="<<endl;
                                std::string pub_id = publication->Id();
                                mix(scheme, roomId, pub_id);
                              },
                              [=](std::unique_ptr<Exception> err) {
                                cout <<" ============Publish failed==========="<<endl;
                              });
                }
                cout << "Join succeeded!" << endl;
           }, // Join success callback
           [=](std::unique_ptr<Exception> err) {
             cout << "Join failed!" << endl;
           }); //End of join 
  } else {
     cout << "join error!" << endl;
  }




  int connectResult = MyBasicServerConnector::TestConnect();
//  std::thread publishDataSendThread(MyBasicServerConnector::SendpublishDatas);
  std::thread publishDataSaveThread(MyBasicServerConnector::SavepublishDatas);
  while(1){
    sleep(1);
  }

  if(forwardobserver) {
    delete forwardobserver;
    forwardobserver = nullptr;
  }
  return 0;
}

