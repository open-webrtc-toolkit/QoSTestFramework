// Copyright (C) <2019> Intel Corporation
//
// SPDX-License-Identifier: Apache-2.0
#include "http.h"
#include "conferenceforwardobserver.h"
#include "data.h"
#include "encodedframegenerator.h"
#include "fileframegenerator.h"
#include "videorenderer.h"
#include "owt.h"
#include <chrono>
#include <cmath>
#include <ctime>
#include <iostream>
#include <stdio.h>
#include <stdlib.h>
#include <sys/time.h>
#include <thread>
#include <unistd.h>

using namespace std;

shared_ptr<RemoteMixedStream> remote_mixed_stream;
ConferenceClientConfiguration configuration;

int main(int argc, char **argv)
{
    LOG_DEBUG("");
    CData *data = new CData();
    bool retVal = data->ParsingParameters(argc, argv);
    if (!retVal)
    {
        LOG_DEBUG("ParsingParameters error");
        return 1;
    }

    shared_ptr<LocalStream> stream;
    if (data->GetIfEncoded())
    {
        GlobalConfiguration::SetEncodedVideoFrameEnabled(true);
        CEncodedVideoInput *externalEncoder = CEncodedVideoInput::Create(data->GetVideoPath(), data->GetCodec());
        externalEncoder->SetPublishTimeFile(data->GetLocalPublishTimeFilePath());
        shared_ptr<LocalCustomizedStreamParameters> lcsp(new LocalCustomizedStreamParameters(true, true));
        lcsp->Resolution(data->GetWidth(), data->GetHeight());
        lcsp->Fps(data->GetFps());
        lcsp->Bitrate(data->GetBandwidthRate());
        stream = LocalStream::Create(lcsp, externalEncoder);
    }
    else
    {
        LOG_DEBUG("VideoPath is %s", data->GetVideoPath().c_str());
        unique_ptr<CFileFrameGenerator> framer(new CFileFrameGenerator(data->GetWidth(), data->GetHeight(), data->GetFps(), data->GetVideoPath()));
        framer->SetPublishTimeFile(data->GetLocalPublishTimeFilePath());
        shared_ptr<LocalCustomizedStreamParameters> lcsp(new LocalCustomizedStreamParameters(true, true));
        stream = LocalStream::Create(lcsp, move(framer));
    }

    IceServer ice;
    ice.urls.push_back("stun:61.152.239.56");
    ice.username = "";
    ice.password = "";
    vector<IceServer> ice_servers;
    ice_servers.push_back(ice);
    configuration.ice_servers = ice_servers;

    shared_ptr<ConferenceClient> room = ConferenceClient::Create(configuration);
    CConferenceForwardObserver *forwardObserver = nullptr;
    if (data->GetIfSubscribe())
    {
        forwardObserver = new CConferenceForwardObserver(room);
        room->AddObserver(*forwardObserver);
    }

    string serverAddress = data->GetServerAddress();
    string roomId = data->GetRoomId();
    string token = CHttp::getToken(serverAddress, roomId);
    LOG_DEBUG("token is: %s", token.c_str());

    if (token != "")
    {
        room->Join(token,
                   [=](shared_ptr<ConferenceInfo> info) {
                       LOG_DEBUG("Join succeeded!");
                       if (data->GetIfPublish())
                       {
                           PublishOptions options;
                           VideoCodecParameters codecParam;
                           codecParam.name = data->GetCodec();
                           VideoEncodingParameters encodingParam(codecParam, 0, false);
                           options.video.push_back(encodingParam);

                           room->Publish(stream,
                                         options,
                                         [=](shared_ptr<ConferencePublication> publication) {
                                             LOG_DEBUG("Publish succeed");
                                             string pubId = publication->Id();
                                             forwardObserver->setPubId(pubId);
                                             forwardObserver->setData(data);
                                         },
                                         [=](unique_ptr<Exception> err) {
                                             LOG_DEBUG("Publish failed : %s!", err->Message().c_str());
                                         });
                       }
                       LOG_DEBUG("Join succeeded!");
                   },
                   [=](unique_ptr<Exception> err) {
                       LOG_DEBUG("Join failed : %s!", err->Message().c_str());
                   });
    }
    else
    {
        LOG_DEBUG("token is null!");
    }
    int cnt = data->GetRunTime();
    while (cnt)
    {
        sleep(1);
        cnt--;
    }

    if (forwardObserver)
    {
        delete forwardObserver;
        forwardObserver = nullptr;
    }
    if (data)
    {
        delete data;
        data = nullptr;
    }
    return 0;
}
