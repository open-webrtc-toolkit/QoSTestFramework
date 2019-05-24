/*
 * Copyright © 2019 Intel Corporation. All Rights Reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *
 * 1. Redistributions of source code must retain the above copyright notice,
 *    this list of conditions and the following disclaimer.
 * 2. Redistributions in binary form must reproduce the above copyright notice,
 *    this list of conditions and the following disclaimer in the documentation
 *    and/or other materials provided with the distribution.
 * 3. The name of the author may not be used to endorse or promote products
 *    derived from this software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE AUTHOR "AS IS" AND ANY EXPRESS OR IMPLIED
 * WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF
 * MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO
 * EVENT SHALL THE AUTHOR BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
 * SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO,
 * PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS;
 * OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY,
 * WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR
 * OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF
 * ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */
// conferencesample.cpp : implementation file
//

#include "asio_token.h"
#include "conferenceforwardobserver.h"
#include "data.h"
#include "encodedframegenerator.h"
#include "fileframegenerator.h"
#include "myvideorenderer.h"
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
    string token = getToken(serverAddress, roomId, "", "", false, "presenter");
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
