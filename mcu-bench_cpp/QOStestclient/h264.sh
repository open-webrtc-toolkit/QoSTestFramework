#!/bin/bash
#####This function is used to get room id from server and save it to local file
export LD_LIBRARY_PATH=$PWD:$LD_LIBRARY_PATH
this=`dirname $0`
echo ${this}
cd ${this}
roomId="5a8f857616eb0c350b476b35"
#######Please modify this room index if running in different devices
    echo "User connect to room:"
    ./woogeen_conf_sample localhost:3004 $roomId h264 hd720p 30 ps m
    
