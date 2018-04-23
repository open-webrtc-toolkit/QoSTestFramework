/*
 *Intel License
*/
#include <iostream>

#include "directvideodecoder.h"

using namespace std;

DirectVideoDecoder::DirectVideoDecoder(ics::base::VideoCodec codec) {
  codec_ = codec;
}

DirectVideoDecoder::~DirectVideoDecoder() { }

bool DirectVideoDecoder::InitDecodeContext(ics::base::VideoCodec video_codec) {
  if (video_codec != codec_) {
//    cout << "Unsupported decoder codec type" << video_codec << " for " << codec_;
  } else {
    // Here to initialize your own dedicated decode context

  }

  return true;
  return true;
}

bool DirectVideoDecoder::Release() {
  // Remember to release your decoder resources here.
  return true;
}

bool DirectVideoDecoder::OnEncodedFrame(std::unique_ptr<VideoEncodedFrame> frame) {
  return true;
}

DirectVideoDecoder* DirectVideoDecoder::Create(ics::base::VideoCodec codec) {
  DirectVideoDecoder* video_decoder = new DirectVideoDecoder(codec);
  return video_decoder;
}

VideoDecoderInterface* DirectVideoDecoder::Copy() {
  DirectVideoDecoder* video_decoder = new DirectVideoDecoder(codec_);
  return video_decoder;
}
