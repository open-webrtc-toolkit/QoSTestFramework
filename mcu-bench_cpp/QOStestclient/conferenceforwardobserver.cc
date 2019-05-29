// Copyright (C) <2019> Intel Corporation
//
// SPDX-License-Identifier: Apache-2.0
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
