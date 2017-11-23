paramter=''
devices=''
while getopts "p:d:" opt; do
  case $opt in
    d)
      echo "this is -d the arg is ! $OPTARG"
    devices=$OPTARG
      ;;
    p)
      echo "this is -p the arg is ! $OPTARG"
      paramter=$OPTARG
      ;;
    \?)
      echo "Invalid option: -$OPTARG" 
      ;;
  esac
done


echo '<?xml version="1.0" encoding="utf-8"?>'>config.xml
echo "<config>">>config.xml
OLD_IFS="$IFS"
IFS=","
arr=($paramter)
IFS="$OLD_IFS"
for s in ${arr[@]}
do
  IFS=':' detail_arr=($s)
  if [ ${detail_arr[0]} == 'p2pserver' ];then
    echo "    <p2pServer>"${detail_arr[1]}"</p2pServer>">>config.xml
    elif [ ${detail_arr[0]} == 'lockserver' ];then
      echo "    <lockServer>"${detail_arr[1]}"</lockServer>">>config.xml
    elif [ ${detail_arr[0]} == 'yuvname' ];then
      echo "    <yuvStreamName>"${detail_arr[1]}"</yuvStreamName>">>config.xml
    elif [ ${detail_arr[0]} == 'encodedname' ];then
      echo "    <encodedStream>"${detail_arr[1]}"</encodedStream>">>config.xml
    elif [ ${detail_arr[0]} == 'fps' ];then
      echo "    <fps>"${detail_arr[1]}"</fps>">>config.xml
    elif [ ${detail_arr[0]} == 'bitrate' ];then
      echo "    <bitrate>"${detail_arr[1]}"</bitrate>">>config.xml
    elif [ ${detail_arr[0]} == 'testtime' ];then
      echo "    <testTime>"${detail_arr[1]}"</testTime>">>config.xml
    elif [ ${detail_arr[0]} == 'resolution' ];then
      echo "    <resolution>"${detail_arr[1]}"</resolution>">>config.xml
    elif [ ${detail_arr[0]} == 'framesize' ];then
      echo "    <framesize>"${detail_arr[1]}"</framesize>">>config.xml
  fi
    #echo "    <p2pServer>"${detail_arr[0]}"</p2pServer>">>mcu.xml
    echo "${detail_arr[0]}","${detail_arr[1]}"
    #echo "$s"
done

echo "</config>">>config.xml


OLD_IFS="$IFS"
IFS=","
arr=($devices)
IFS="$OLD_IFS"
for device in ${arr[@]}
do
  adb -s $device push config.xml sdcard/
done

