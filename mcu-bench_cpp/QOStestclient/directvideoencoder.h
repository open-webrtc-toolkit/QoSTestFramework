/*
* Intel License
*/

#ifndef DIRECTVIDEOENCODER_H
#define DIRECTVIDEOENCODER_H
#include "owt/base/commontypes.h"
#include "owt/base/videoencoderinterface.h"

/// This class defines the external video encoder
class DirectVideoEncoder : public owt::base::VideoEncoderInterface {
public:
	static DirectVideoEncoder* Create(owt::base::VideoCodec codec, std::string encodedFile);

	explicit DirectVideoEncoder(owt::base::VideoCodec codec, std::string encodedFile);

	virtual ~DirectVideoEncoder();


	virtual bool InitEncoderContext(owt::base::Resolution& resolution, uint32_t fps, uint32_t bitrate, owt::base::VideoCodec video_codec) override;

	virtual bool EncodeOneFrame(std::vector<uint8_t>& buffer, bool keyFrame) override;

	virtual bool Release() override;

	virtual owt::base::VideoEncoderInterface* Copy() override;


	struct timeval tv_publish;
private:
	owt::base::VideoCodec codec_;
    std::string filename_;
	FILE* fd_;
};

#endif //DIRECTVIDEOENCODER_H

