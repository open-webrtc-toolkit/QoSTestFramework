// Copyright (C) <2019> Intel Corporation
//
// SPDX-License-Identifier: Apache-2.0
#pragma once

#include "owt.h"
#include "log.h"
#include "data.h"


class CConferenceForwardObserver
    : public ConferenceClientObserver
{
public:
  CConferenceForwardObserver(shared_ptr<ConferenceClient> client);
  virtual ~CConferenceForwardObserver() {}
  void OnStreamAdded(shared_ptr<RemoteStream> stream) override;
  void setPubId(string pubId);
  void setData(CData* data);

private:
  static void getStatus(string filenameBitrate, string filenameFps, shared_ptr<ConferenceSubscription> subscription);
  shared_ptr<RemoteStream> m_remoteStream;
  shared_ptr<ConferenceClient> m_client;
  string m_pubId;
  CData* m_data;
};

