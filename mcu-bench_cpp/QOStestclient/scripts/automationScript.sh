#!/bin/bash
set -x
root=../..
originVideo=$1
echo $originVideo
currentScenario=$2
echo $currentScenario
resolution=$3
echo $resolution
cd ${root}
rawFilename="./native/Data/localARGB.txt"
originFilename="./native/video/$originVideo"
if [[ $originVideo =~ .*yuv ]]
then
   echo "origin video is yuv file", $originVideo
   ./native/iq_yuv ${rawFilename} ${originFilename} ${resolution}
else
   echo "orgin video is avi file", $originVideo
   ./native/iq_avi ${rawFilename} ${originFilename} ${resolution}
fi
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
