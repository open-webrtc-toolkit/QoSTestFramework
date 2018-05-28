#!/bin/bash
set -x
root=../..
originVideo=$1
echo $originVideo
currentScenario=$2
echo $currentScenario

cd ${root}
rawFilename="./native/Data/localARGB.txt"
originFilename="./native/video/$originVideo"
./native/iq_yuv ${rawFilename} ${originFilename}

#quality testing for vmaf
python python/vmaf_calculate.py

#quality testing for no-reference video
python python/NR_calculate.py

#jitter
rTagFilename="./native/Data/localLatency.txt";
./native/FLR ${rTagFilename}

#latency
sTagFilename="./native/Data/localPublishTime.txt"
rTagFilename="./native/Data/localLatency.txt"
./native/latency ${sTagFilename} ${rTagFilename}

#fps
fpsFilename="./native/Data/localFPS.txt"
./native/fps ${fpsFilename}

#bitrate
bitrateFilename="./native/Data/localBitrate.txt"
./native/bitrate ${bitrateFilename}

if [ ! -d "report/${currentScenario}" ]; then
   mkdir report/${currentScenario}
else
   rm -rf report/${currentScenario}/*
fi
mv ./native/output/* ./report/${currentScenario}
