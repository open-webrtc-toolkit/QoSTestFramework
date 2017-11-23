while getopts "p:s:" opt; do
  case $opt in
    p)
      pub_device=$OPTARG
      echo $pub_device
      echo "this is -p the arg is ! $pub_device"
      ;;
    s)
      sub_device=$OPTARG
      echo $sub_device
      echo "this is -p the arg is ! $pub_device"
      ;;
  esac
done
if [ ! -d "native/Data" ]; then
 mkdir "native/Data"
else
 rm -rf native/Data/*
fi

if [ ! -d "native/output" ]; then
 mkdir "native/output"
else
 rm -rf native/output/*
fi
python python/androidtime.py -s $sub_device -p $pub_device
adb -s $sub_device pull sdcard/conferenceqos/recTime.txt native/Data/
adb -s $sub_device pull sdcard/conferenceqos/recStat.txt native/Data/
adb -s $sub_device pull sdcard/conferenceqos/rec.yuv native/output/
adb -s $pub_device pull sdcard/conferenceqos/localPublishTime.txt native/Data/