#!/bin/bash
#####This function is used to get room id from server and save it to local file
set -x
this=`dirname $0`
echo ${this}
cd ${this}/../libs
export LD_LIBRARY_PATH=$PWD:$LD_LIBRARY_PATH
echo "scripts folder is"
cd ../scripts
roomId="5a8f857616eb0c350b476b35"
filename="football_720p_taged.vp8"
#filename="FourPeople_1280x720_30_taged.yuv"
originVideo="football_720p_taged_vp8_decoded.yuv"
folderName="vp8"
#######Please modify this room index if running in different devices
echo "User connect to room:"
./woogeen_conf_sample localhost:4004 $roomId vp8 hd720p 30 ps m $filename >vp8.log 2>&1 &

