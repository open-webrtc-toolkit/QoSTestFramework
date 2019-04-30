/*
*
*Intel License
*
*/

#ifndef CONFERENCE_SAMPLE_OBSERVER_H_
#define CONFERENCE_SAMPLE_OBSERVER_H_

#include "owt/base/stream.h"
#include "owt/conference/conferenceclient.h"

class ConferenceSampleObserver
	: public owt::conference::ConferenceClientObserver {
 public:
  ConferenceSampleObserver(std::shared_ptr<owt::conference::ConferenceClient> client);
  virtual ~ConferenceSampleObserver(){}
  void OnStreamAdded(std::shared_ptr<owt::conference::RemoteMixedStream> stream) override;

 private:
  std::shared_ptr<owt::base::RemoteStream> remote_stream_;
  std::shared_ptr<owt::conference::ConferenceClient> client_;
};

#endif
