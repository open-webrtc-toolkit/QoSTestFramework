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
// conferenceforwardobserver.cpp : implementation file
//

#include "conferenceforwardobserver.h"
#include "data.h"
#include "myvideorenderer.h"
#include <iostream>
#include <thread>

using namespace std;

void CConferenceForwardObserver::getStatus(string filenameBitrate, string filenameFps, shared_ptr<ConferenceSubscription> subscription)
{
    LOG_DEBUG("filenameBitrate=%s filenameFps=%s", filenameBitrate.c_str(), filenameFps.c_str());
    FILE *localBitrate = fopen(filenameBitrate.c_str(), "w");
    FILE *localFps = fopen(filenameFps.c_str(), "w");
    while (1)
    {
        LOG_DEBUG("filenameBitrate=%s filenameFps=%s", filenameBitrate.c_str(), filenameFps.c_str());
        std::this_thread::sleep_for(std::chrono::seconds(3));
        std::thread([&] {
            subscription->GetStats(
                [=](std::shared_ptr<ConnectionStats> stats) {
                    if ((stats.get() != NULL) && (stats->video_receiver_reports.size() > 0))
                    {
                        fprintf(localBitrate, ",%ld", stats->video_receiver_reports[0]->bytes_rcvd);
                        fflush(localBitrate);
                        fprintf(localFps, ",%d", stats->video_receiver_reports[0]->framerate_output);
                        fflush(localFps);
                    }
                },
                [=](unique_ptr<Exception> err) {
                    LOG_DEBUG("GetConnectionStats forward failed: %s", err->Message().c_str());
                });
        })
            .detach();
    }
}

CConferenceForwardObserver::CConferenceForwardObserver(shared_ptr<ConferenceClient> client)
    : m_client(client)
{
    LOG_DEBUG("");
    m_data = nullptr;
}

void CConferenceForwardObserver::OnStreamAdded(shared_ptr<RemoteStream> stream)
{
    LOG_DEBUG("");
    SubscribeOptions options;
    LOG_DEBUG("Subscribe forward stream:%s", stream->Id());

    if (m_pubId.compare(stream->Id()) != 0)
    {
        return;
    }
    m_client->Subscribe(stream,
                        //options,
                        [=](shared_ptr<ConferenceSubscription> subscription) {
                            LOG_DEBUG("Subscribe succeed");
                            CMyVideoRenderer *myVideoRenderer = new CMyVideoRenderer();
                            if (m_data)
                            {
                                myVideoRenderer->SetLocalARGBFile(m_data->GetLocalARGBFilePath());
                                myVideoRenderer->SetLocalLatencyFile(m_data->GetLocalLatencyFilePath().c_str());
                                std::thread *t = new std::thread(CConferenceForwardObserver::getStatus, m_data->GetLocalBitrateFilePath(), m_data->GetLocalFpsFilePath(), subscription);
                                t->detach();
                            }
                            stream->AttachVideoRenderer(*myVideoRenderer);
                        },
                        [=](std::unique_ptr<Exception>) {
                            LOG_DEBUG("Subscribe failed");
                        });
}

void CConferenceForwardObserver::setPubId(string pubId)
{
    LOG_DEBUG("");
    m_pubId = pubId;
}

void CConferenceForwardObserver::setData(CData *data)
{
    LOG_DEBUG("");
    m_data = data;
}
