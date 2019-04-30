/*
*
*Intel License
*
*/

#ifndef CONFERENCE_SAMPLE_FORWARD_OBSERVER_H_
#define CONFERENCE_SAMPLE_FORWARD_OBSERVER_H_

#include "owt/base/stream.h"
#include "owt/conference/conferenceclient.h"

class ConferenceSampleForwardObserver
	: public owt::conference::ConferenceClientObserver {
 public:
  ConferenceSampleForwardObserver(std::shared_ptr<owt::conference::ConferenceClient> client);
  virtual ~ConferenceSampleForwardObserver(){}
  void OnStreamAdded(std::shared_ptr<owt::base::RemoteStream> stream) override;

 private:
  std::shared_ptr<owt::base::RemoteStream> remote_stream_;
  std::shared_ptr<owt::conference::ConferenceClient> client_;
};

#endif
