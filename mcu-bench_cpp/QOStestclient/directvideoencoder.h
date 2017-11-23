/*
* Intel License
*/

#ifndef DIRECTVIDEOENCODER_H
#define DIRECTVIDEOENCODER_H
#include "woogeen/base/mediaformat.h"
#include "woogeen/base/videoencoderinterface.h"

/// This class defines the external video encoder
class DirectVideoEncoder : public woogeen::base::VideoEncoderInterface {
public:
	static DirectVideoEncoder* Create(woogeen::base::MediaCodec::VideoCodec codec);

	explicit DirectVideoEncoder(woogeen::base::MediaCodec::VideoCodec codec);

	virtual ~DirectVideoEncoder();

	virtual bool InitEncoderContext(woogeen::base::Resolution& resolution, uint32_t fps, uint32_t bitrate, woogeen::base::MediaCodec::VideoCodec video_codec) override;

	virtual bool EncodeOneFrame(std::vector<uint8_t>& buffer, bool keyFrame) override;

	virtual bool Release() override;

	virtual woogeen::base::VideoEncoderInterface* Copy() override;


	struct timeval tv_publish;
private:
	woogeen::base::MediaCodec::VideoCodec codec_;
	FILE* fd_;
};

#endif //DIRECTVIDEOENCODER_H

