/*
 *Intel License
*/

#ifndef DIRECTVIDEODECODER_H
#define DIRECTVIDEODECODER_H

#include "owt/base/commontypes.h"
#include "owt/base/videodecoderinterface.h"

using namespace owt::base;

/// This class defines the external video decoder
class DirectVideoDecoder : public VideoDecoderInterface {
 public:
    static DirectVideoDecoder* Create(owt::base::VideoCodec codec);

    explicit DirectVideoDecoder(owt::base::VideoCodec codec);
    virtual ~DirectVideoDecoder();

    virtual bool InitDecodeContext(owt::base::VideoCodec video_codec) override;
    virtual bool Release() override;
    virtual bool OnEncodedFrame(std::unique_ptr<VideoEncodedFrame> frame) override;

    virtual VideoDecoderInterface* Copy() override;

 private:
  owt::base::VideoCodec codec_;
};

#endif  // DIRECTVIDEODECODER_H
