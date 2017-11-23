#!/bin/bash

stream=/home/yanbin/workspace/project/webrtc-webrtc-qa/mcu-bench_cpp/videoGenerateScripts/FourPeople_640x480_30_taged.avi

#./mkMCUTestStream.py -w 1920 -h 1080 -b 4000 -v h264 $strea
./mkMCUTestStream_tag_key.py -w 640 -h  480 -b 1000 -o 640x480-framerate30-bitrate1000k.mkv -v vp8 $stream
#./mkMCUTestStream.py -w  640 -h  480 -b  800 -v h264 $stream

#./mkMCUTestStream.py -w 1920 -h 1080 -b 4000 -v vp8 $stream
#./mkMCUTestStream.py -w 1280 -h  720 -b 2000 -v vp8 $stream
#./mkMCUTestStream.py -w  640 -h  480 -b  800 -v vp8 $stream
