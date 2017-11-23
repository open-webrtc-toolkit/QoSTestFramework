//
//Intel License
//
// testclient.cc : Defines the entry point for the console application.
//
#include <iostream>
#include "woogeen/conference/conferenceclient.h"
#include "woogeen/base/localcamerastreamparameters.h"
#include "woogeen/base/stream.h"
#include "fileframegenerator.h"
#include "encodedframegenerator.h"
//#include "fileaudioframegenerator.h"
#include "asio_token.h"
#include "conferencesampleobserver.h"
#include "conferencesampleforwardobserver.h"
#include "basicserverConnector.h"
#include "directvideoencoder.h"
#include <unistd.h>
#include <chrono>
#include <ctime>
#include <stdio.h>
#include <stdlib.h>
#include <sys/time.h>



using namespace std;

/*std::function<void(std::shared_ptr<User>)>join_room_success {

}

std::function<void(std::unique_ptr<ConferenceException>)>join_room_failure {

}*/

int main(int argc, char** argv)
{
  //daemon(1,1);
  using namespace woogeen::base;
  using namespace woogeen::conference;
 // std::string audiopath("");
  std::string videopath("");
  std::string roomId("");
  std::string scheme("http://");
  std::string suffix("/createToken");
  ConferenceClientConfiguration configuration;
  EncodedMimeType type;
  int width;
  int height;
  int fps;
  bool publish = true;
  bool subscribe = true;
  //true for mix mode, false for forward mode
  bool mode = true;

  if(argc >= 2){
    std::string hosturl(argv[1]);
    scheme.append(hosturl);
  }else{
    std::string fixed("10.239.44.59:3001");
    scheme.append(fixed);
  }

  if(argc >= 3){
    std::string roomStr(argv[2]);
    roomId.append(roomStr);
  }

  if(argc >= 4){
    std::string codec(argv[3]);
    if (codec.find("h264") != std::string::npos) {
      configuration.media_codec.video_codec = MediaCodec::VideoCodec::H264;
      type = EncodedMimeType::ENCODED_H264;
    }else{
      configuration.media_codec.video_codec = MediaCodec::VideoCodec::VP8;
      type = EncodedMimeType::ENCODED_VP8;
    }
  }else{
    configuration.media_codec.video_codec = MediaCodec::VideoCodec::VP8;
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

  std::unique_ptr<woogeen::base::AudioFrameGeneratorInterface> audio_generator(FileAudioFrameGenerator::Create(audiopath));
  if (audio_generator == nullptr){
    return -1;
  }*/
  //GlobalConfiguration::SetEncodedVideoFrameEnabled(true);
  //GlobalConfiguration::SetCustomizedAudioInputEnabled(true, std::move(audio_generator));

  IceServer ice;
  ice.urls.push_back("stun:61.152.239.56");
  ice.username = "";
  ice.password = "";
  vector<IceServer> ice_servers;
  ice_servers.push_back(ice);
  configuration.ice_servers = ice_servers;

  scheme.append(suffix);
  std::shared_ptr<ConferenceClient> room(new ConferenceClient(configuration));

  ConferenceSampleObserver *observer = nullptr;
  ConferenceSampleForwardObserver *forwardobserver = nullptr;
  if(subscribe) {
    if(mode) {
      cout <<" ============Mix mode==========";
      observer = new ConferenceSampleObserver(room);
      room->AddObserver(*observer);
    }
    else {
      cout <<" ============Forward mode==========";
      forwardobserver = new ConferenceSampleForwardObserver(room);
      room->AddObserver(*forwardobserver);
    }
  }

//  cout << "Press Enter to connect room." << std::endl;
 // cin.ignore();

  string token = getToken(scheme, roomId);
/*
  LocalCustomizedStreamParameters lcsp(LocalCustomizedStreamParameters(true, true));
  FileFrameGenerator* framer = new FileFrameGenerator(1280, 720, 30);

  LocalCustomizedStream stream(std::make_shared<LocalCustomizedStreamParameters>(lcsp), framer);
  std::shared_ptr<LocalCustomizedStream> shared_stream(std::make_shared<LocalCustomizedStream>(stream));
*/
   GlobalConfiguration::SetEncodedVideoFrameEnabled(true);
   VideoEncoderInterface* external_encoder = DirectVideoEncoder::Create(MediaCodec::VideoCodec::VP8);
   Resolution res(1280, 720);
   shared_ptr<LocalCustomizedStreamParameters> lcsp(new LocalCustomizedStreamParameters(true, true, res, 30, 2000));
   shared_ptr<LocalCustomizedStream> shared_stream(new LocalCustomizedStream(lcsp, external_encoder));





  if (token != "") {
      room->Join(token,
          [=](std::shared_ptr<User> user) {
              if(publish) {
                room->Publish(shared_stream,
                [=] {
                      cout <<" ============Publish succeed==========";

                      //cout <<"";

                  },
                [=](std::unique_ptr<ConferenceException> err) {
                  cout <<" ============Publish failed===========";
                });
              }

              cout << "Join succeeded!" << endl;
                    },
                    [=](std::unique_ptr<ConferenceException> err) {
                      cout << "Join failed!" << endl;
                    });
  } else {
     cout << "create token error!" << endl;
  }

  int connectResult = MyBasicServerConnector::TestConnect();
//  std::thread publishDataSendThread(MyBasicServerConnector::SendpublishDatas);
  std::thread publishDataSaveThread(MyBasicServerConnector::SavepublishDatas);
  while(1){
    sleep(1);
  }




  if(observer) {
    delete observer;
    observer = nullptr;
  }
  if(forwardobserver) {
    delete forwardobserver;
    forwardobserver = nullptr;
  }
  return 0;
}

