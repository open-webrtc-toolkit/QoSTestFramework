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
   ./analysis/native/iq_yuv ${rawFilename} ${originFilename} ${resolution}
else
   echo "orgin video is avi file", $originVideo
   ./analysis/native/iq_avi ${rawFilename} ${originFilename} ${resolution}
fi
#quality testing for vmaf
python analysis/python/vmaf_calculate.py

#quality testing for no-reference video
python analysis/python/NR_calculate.py

#jitter
rTagFilename="./analysis/native/Data/localLatency.txt";
./analysis/native/FLR ${rTagFilename}

#latency
sTagFilename="./analysis/native/Data/localPublishTime.txt"
rTagFilename="./analysis/native/Data/localLatency.txt"
./analysis/native/latency ${sTagFilename} ${rTagFilename}

#fps
fpsFilename="./analysis/native/Data/localFPS.txt"
./analysis/native/fps ${fpsFilename}

#bitrate
bitrateFilename="./analysis/native/Data/localBitrate.txt"
./analysis/native/bitrate ${bitrateFilename}

if [ ! -d "report/${currentScenario}" ]; then
   mkdir report/${currentScenario}
else
   rm -rf report/${currentScenario}/*
fi
mv ./analysis/native/output/* ./analysis/report/${currentScenario}
