/*
 *
 *
 */

#include <iostream>
#include "fileframegenerator.h"
#include "directvideoencoder.h"
#include "basicserverConnector.h"

struct timeval tv_publish;
int countTag = 1;

FileFrameGenerator::FileFrameGenerator(int width, int height, int fps) {
  width_ = width;
  height_ = height;
  type_ = ics::base::VideoFrameGeneratorInterface::I420;
  fps_ = fps;
  int size = width_ * height_;
  int qsize = size / 4;
  frame_data_size_ = size + 2 * qsize;
  fd = fopen("./FourPeople_1280x720_30_taged.yuv", "r");
  if(!fd) {
    std::cout << "failed to open the source.yuv." << std::endl;
  } else {
    std::cout << "sucessfully open the source.yuv." << std::endl;
  }
}

FileFrameGenerator::~FileFrameGenerator() {
  fclose(fd);
}

uint32_t FileFrameGenerator::GetNextFrameSize() {
  return frame_data_size_;
}

int FileFrameGenerator::GetHeight() { return height_; }
int FileFrameGenerator::GetWidth() { return width_; }
int FileFrameGenerator::GetFps() { return fps_; }

ics::base::VideoFrameGeneratorInterface::VideoFrameCodec FileFrameGenerator::GetType() { return type_; }

uint32_t FileFrameGenerator::GenerateNextFrame(uint8_t* frame_buffer, const uint32_t capacity) {
  if (capacity < frame_data_size_) {
    return 0;
  }
  if (fread(frame_buffer, 1, frame_data_size_, fd) != (size_t)frame_data_size_) {
    fseek(fd, 0, SEEK_SET);
    fread(frame_buffer, 1, frame_data_size_, fd);
  }
  gettimeofday(&tv_publish,NULL);
  MyBasicServerConnector::publishTagDataQ.push(countTag);//sample:2773862 usec
  countTag++;
  if (countTag == 601)
    countTag = 1;
  MyBasicServerConnector::publish_TimestampDataQ.push(tv_publish.tv_sec%10000*1000 + tv_publish.tv_usec/1000);//sample:2773862 usec
  cout << "succeed to pub one frame!" << endl << endl << endl;
  return frame_data_size_;
}
