#!/bin/bash

#This script is convert avi file to vp8/h264 mkv file

stream=/home/yanbin/workspace/project/webrtc-qos-bench/mcu-bench_cpp/videoGenerateScripts/football_720p_taged.avi
./mkMCUTestStream.py -w 1280 -h  720 -b 332329 -o football_720p_taged_vp9.mkv -v vp9 $stream
#./mkMCUTestStream.py -w  640 -h  480 -b  800 -v h264 $stream

#./mkMCUTestStream.py -w 1920 -h 1080 -b 4000 -v vp8 $stream
#./mkMCUTestStream.py -w 1280 -h  720 -b 2000 -v vp8 $stream
#./mkMCUTestStream.py -w  640 -h  480 -b  800 -v vp8 $stream
