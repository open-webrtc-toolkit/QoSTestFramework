/*
*
*Intel License
*
*/

#ifndef CONFERENCE_SAMPLE_FORWARD_OBSERVER_H_
#define CONFERENCE_SAMPLE_FORWARD_OBSERVER_H_

#include "ics/base/stream.h"
#include "ics/conference/conferenceclient.h"

class ConferenceSampleForwardObserver
	: public ics::conference::ConferenceClientObserver {
 public:
  ConferenceSampleForwardObserver(std::shared_ptr<ics::conference::ConferenceClient> client);
  virtual ~ConferenceSampleForwardObserver(){}
  void OnStreamAdded(std::shared_ptr<ics::base::RemoteStream> stream) override;

 private:
  std::shared_ptr<ics::base::RemoteStream> remote_stream_;
  std::shared_ptr<ics::conference::ConferenceClient> client_;
};

#endif
