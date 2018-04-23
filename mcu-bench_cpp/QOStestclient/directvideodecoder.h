/*
 *Intel License
*/

#ifndef DIRECTVIDEODECODER_H
#define DIRECTVIDEODECODER_H

#include "ics/base/commontypes.h"
#include "ics/base/videodecoderinterface.h"

using namespace ics::base;

/// This class defines the external video decoder
class DirectVideoDecoder : public VideoDecoderInterface {
 public:
    static DirectVideoDecoder* Create(ics::base::VideoCodec codec);

    explicit DirectVideoDecoder(ics::base::VideoCodec codec);
    virtual ~DirectVideoDecoder();

    virtual bool InitDecodeContext(ics::base::VideoCodec video_codec) override;
    virtual bool Release() override;
    virtual bool OnEncodedFrame(std::unique_ptr<VideoEncodedFrame> frame) override;

    virtual VideoDecoderInterface* Copy() override;

 private:
  ics::base::VideoCodec codec_;
};

#endif  // DIRECTVIDEODECODER_H
