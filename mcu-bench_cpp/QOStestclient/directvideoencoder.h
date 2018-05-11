/*
* Intel License
*/

#ifndef DIRECTVIDEOENCODER_H
#define DIRECTVIDEOENCODER_H
#include "ics/base/commontypes.h"
#include "ics/base/videoencoderinterface.h"

/// This class defines the external video encoder
class DirectVideoEncoder : public ics::base::VideoEncoderInterface {
public:
	static DirectVideoEncoder* Create(ics::base::VideoCodec codec, std::string encodedFile);

	explicit DirectVideoEncoder(ics::base::VideoCodec codec, std::string encodedFile);

	virtual ~DirectVideoEncoder();


	virtual bool InitEncoderContext(ics::base::Resolution& resolution, uint32_t fps, uint32_t bitrate, ics::base::VideoCodec video_codec) override;

	virtual bool EncodeOneFrame(std::vector<uint8_t>& buffer, bool keyFrame) override;

	virtual bool Release() override;

	virtual ics::base::VideoEncoderInterface* Copy() override;


	struct timeval tv_publish;
private:
	ics::base::VideoCodec codec_;
    std::string filename_;
	FILE* fd_;
};

#endif //DIRECTVIDEOENCODER_H

