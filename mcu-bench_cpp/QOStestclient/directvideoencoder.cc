/*
* Intel License
*/
#include "directvideoencoder.h"
#include "basicserverConnector.h"
#include <stdio.h>
#include <iostream>
#include <stdlib.h>
#include <sys/time.h>
#include <unistd.h>

using namespace woogeen::base;

DirectVideoEncoder::DirectVideoEncoder(MediaCodec::VideoCodec codec) {
    codec_ = codec;
    timeval tv_publish;
}

DirectVideoEncoder::~DirectVideoEncoder() {
    // Release the encoder resource here.
    if (fd_)
        fclose(fd_);
}

bool DirectVideoEncoder::InitEncoderContext(Resolution& resolution, uint32_t fps, uint32_t bitrate, woogeen::base::MediaCodec::VideoCodec video_codec) {
    //Open the resource file.
    //fd_ = fopen("./source.vp8", "rb");
    //fd_ = fopen("./1280x720-framerate30-bitrate2000k-gop30.vp8", "rb");
    //fd_ = fopen("./FourPeopleH720p.vp8", "rb");
//    fd_ = fopen("./1280x720-framerate30-bitrate2000k.vp8", "rb");
    fd_ = fopen("./source.h264", "rb");

    if (!fd_) {
        std::cout << "Failed to open the source.h264" << std::endl;
    }
    else {
        std::cout << "Successfully open the source.h264" << std::endl;
    }
    return true;
}

/*
bool DirectVideoEncoder::EncodeOneFrame(std::vector<uint8_t>& buffer, bool keyFrame) {
    uint32_t frame_data_size;
    if (fread(&frame_data_size, 1, sizeof(int), fd_) != sizeof(int)) {
        fseek(fd_, 0, SEEK_SET);
        fread(&frame_data_size, 1, sizeof(int), fd_);
    }
    //std::cout<<"-------------------------------------------size"<<frame_data_size<<std::endl;
    int tag_data;
    if (fread(&tag_data, 1, sizeof(int), fd_) != sizeof(int)) {
        fseek(fd_, 0, SEEK_SET);
        fread(&tag_data, 1, sizeof(int), fd_);
    }
    //std::cout<<"-------------------------------------------tag"<<tag_data<<std::endl;
    gettimeofday(&tv_publish,NULL);
    MyBasicServerConnector::publishTagDataQ.push(tag_data);//sample:2773862 usec
    MyBasicServerConnector::publish_TimestampDataQ.push(tv_publish.tv_sec%10000*1000 + tv_publish.tv_usec/1000);//sample:2773862 usec
    //std::cout<<"-------------------------------------------size"<<MyBasicServerConnector::publishTagDataQ.size()<<std::endl;

    uint8_t* data = new uint8_t[frame_data_size];
    fread(data, 1, frame_data_size, fd_);
    buffer.insert(buffer.begin(), data, data + frame_data_size);
    delete[] data;
    return true;
}
*/

bool DirectVideoEncoder::EncodeOneFrame(std::vector<uint8_t>& buffer, bool keyFrame) {
    if (keyFrame == false) {
        int keyFrame_data;
        if (fread(&keyFrame_data, 1, sizeof(int), fd_) != sizeof(int)) {
            fseek(fd_, 0, SEEK_SET);
            fread(&keyFrame_data, 1, sizeof(int), fd_);
        }

        uint32_t frame_data_size;
        if (fread(&frame_data_size, 1, sizeof(int), fd_) != sizeof(int)) {
            fseek(fd_, 0, SEEK_SET);
            fread(&frame_data_size, 1, sizeof(int), fd_);
        }
        //std::cout<<"-------------------------------------------size"<<frame_data_size<<std::endl;
        int tag_data;
        if (fread(&tag_data, 1, sizeof(int), fd_) != sizeof(int)) {
            fseek(fd_, 0, SEEK_SET);
            fread(&tag_data, 1, sizeof(int), fd_);
        }
        //std::cout<<"-------------------------------------------tag"<<tag_data<<std::endl;
        gettimeofday(&tv_publish,NULL);
        MyBasicServerConnector::publishTagDataQ.push(tag_data);//sample:2773862 usec
        MyBasicServerConnector::publish_TimestampDataQ.push(tv_publish.tv_sec%10000*1000 + tv_publish.tv_usec/1000);//sample:2773862 usec
        //std::cout<<"-------------------------------------------size"<<MyBasicServerConnector::publishTagDataQ.size()<<std::endl;

        uint8_t* data = new uint8_t[frame_data_size];
        fread(data, 1, frame_data_size, fd_);
        buffer.insert(buffer.begin(), data, data + frame_data_size);
        delete[] data;
        return true;
    }
    else{
        int keyFrame_data;
        if (fread(&keyFrame_data, 1, sizeof(int), fd_) != sizeof(int)) {
            fseek(fd_, 0, SEEK_SET);
            fread(&keyFrame_data, 1, sizeof(int), fd_);
        }
        uint32_t frame_data_size;
        if (fread(&frame_data_size, 1, sizeof(int), fd_) != sizeof(int)) {
            fseek(fd_, 0, SEEK_SET);
            fread(&frame_data_size, 1, sizeof(int), fd_);
        }
        while (keyFrame_data != 1){
            int temp;
            if (fread(&temp, 1, sizeof(int), fd_) != sizeof(int)) {
                fseek(fd_, 0, SEEK_SET);
                fread(&temp, 1, sizeof(int), fd_);
            }
            uint8_t* data = new uint8_t[frame_data_size];
            fread(data, 1, frame_data_size, fd_);
            delete[] data;
            fread(&keyFrame_data, 1, sizeof(int), fd_);
            fread(&frame_data_size, 1, sizeof(int), fd_);
        }
        int tag_data;
        if (fread(&tag_data, 1, sizeof(int), fd_) != sizeof(int)) {
            fseek(fd_, 0, SEEK_SET);
            fread(&tag_data, 1, sizeof(int), fd_);
        }
        //std::cout<<"-------------------------------------------tag"<<tag_data<<std::endl;
        gettimeofday(&tv_publish,NULL);
        MyBasicServerConnector::publishTagDataQ.push(tag_data);//sample:2773862 usec
        MyBasicServerConnector::publish_TimestampDataQ.push(tv_publish.tv_sec%10000*1000 + tv_publish.tv_usec/1000);//sample:2773862 usec
        //std::cout<<"-------------------------------------------size"<<MyBasicServerConnector::publishTagDataQ.size()<<std::endl;

        uint8_t* data = new uint8_t[frame_data_size];
        fread(data, 1, frame_data_size, fd_);
        buffer.insert(buffer.begin(), data, data + frame_data_size);
        delete[] data;
    }
}


DirectVideoEncoder* DirectVideoEncoder::Create(MediaCodec::VideoCodec codec) {
    DirectVideoEncoder* video_encoder = new DirectVideoEncoder(codec);
    return video_encoder;
}

woogeen::base::VideoEncoderInterface* DirectVideoEncoder::Copy() {
    DirectVideoEncoder* video_encoder = new DirectVideoEncoder(codec_);
    return video_encoder;
}

bool DirectVideoEncoder::Release() {
    return true;
}
