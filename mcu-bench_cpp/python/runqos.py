#!/usr/bin/python
###################
#mode 0:  js to js
#mode 1:  js to android
#mode 2:  android to android
#mode 3:  android to ios
#mode 4:  js to ios
#####################
'''
Created on Jan,16 2016

@author: Yanbin
'''
from config import Config
from config import ConfigKeys as Keys
import sys, getopt, time
from socketIO_client import SocketIO, LoggingNamespace
import subprocess
import psutil
import commands
import re
import os
import json
print 'Number of arguments:', len(sys.argv), 'arguments.'
print 'Argument List:', str(sys.argv)

fps = '30'
bitrate = '2000'
testtime = "100"
publishDevice = ''
subscribeDevice = ''
casename = ''
mode = ''
install = ''
number=1
connectedNode = False
connectedNodeNumber = 0
deployAndroid = ''
deployAndroid1 = ''
deployAndroid2 = ''
deployAndroid3 = ''
androidTestDevices = ''
deployiOS_result = ''
ANDROID_P2P_QOS_CONFIG_FOLDER = Config.getConfig(Keys.ANDROID_P2P_QOS_CONFIG_FOLDER)
ANDROID_CONFERENCE_QOS_CONFIG_FOLDER = Config.getConfig(Keys.ANDROID_CONFERENCE_QOS_CONFIG_FOLDER)

try:
   opts, args = getopt.getopt(sys.argv[1:],"h:c:m:if:b:t:p:s:",["help", "caselistfile=","mode=","install"])
except getopt.GetoptError:
   print 'error : run.py -c <caselistfile> -m <mode>'
   sys.exit(2)
for opt, arg in opts:
   if opt in ("-h", "--help"):
      print 'runqos.py -c <caselistfile> -m <mode> -i\n mode 0: android-android conferenceQosTest\n mode 1: JS to Android \n mode 2: Android to Android \n install:will re-install test application use the latest one, without this tag , we will not install package.'
      sys.exit()
   elif opt == "-c":
      casename = arg
      print"getcaselist"
   elif opt == '-m':
      mode = arg
      print "getmode"
   elif opt == '-i':
      install = 'true'
   elif opt == '-f':
      fps = arg
   elif opt == '-b':
      bitrate = arg
   elif opt == '-t':
      testtime = arg
   elif opt == '-p':
      publishDevice = arg
   elif opt == '-s':
      subscribeDevice = arg
   else:
      assert False, "unhandled option"
if casename == ''or mode == '':
   print 'Error !!! \n Please use: run.py -c <caselistfile> -m <mode> \n mode 0:android-android conferenceQosTest \n mode 1: JS to Android \n mode 2: Android to Android'
   sys.exit()

print 'casename is:', casename
print 'mode is:', mode
print "ANDROID_P2P_QOS_CONFIG_FOLDER:"+ANDROID_P2P_QOS_CONFIG_FOLDER
print "ANDROID_CONFERENCE_QOS_CONFIG_FOLDER:"+ANDROID_CONFERENCE_QOS_CONFIG_FOLDER
def changeparmater(fps,bitrate,testtime):
    BasePath=ANDROID_CONFERENCE_QOS_CONFIG_FOLDER
    xmlpath = os.path.join(BasePath,"src/main/resources/mcu.xml")
    cmd_fps = "sed -i 's/<fps>[0-9]\+<\/fps>/<fps>"+fps+"<\/fps>/' "
    runtest=subprocess.Popen(cmd_fps+xmlpath, shell=True)
    runtest.wait()
    cmd_bitrate = "sed -i 's/<bitrate>[0-9]\+<\/bitrate>/<bitrate>"+bitrate+"<\/bitrate>/' "
    runtest=subprocess.Popen(cmd_bitrate+xmlpath, shell=True)
    runtest.wait()
    cmd_bitrate = "sed -i 's/<testTime>[0-9]\+<\/testTime>/<testTime>"+testtime+"<\/testTime>/' "
    runtest=subprocess.Popen(cmd_bitrate+xmlpath, shell=True)
    runtest.wait()

def start_test(casename, mode):
    global androidTestDevices
    global deployAndroid
    global deployAndroid1
    global deployAndroid2
    global deployAndroid3
    global deployiOS_result
    target = open("TestResult.txt", 'w');
    #lines = [line.rstrip('\n') for line in open(filename)]
    #####################################
    ##deploy test cases #################
    ######################################
    androidTestDevices=get_devices();
    print androidTestDevices
    if publishDevice in androidTestDevices and subscribeDevice in androidTestDevices:
        print "can do test"
    else:
        print "publishDevice or subscribeDevice is not found"
        return
    if install == 'true':
        if int(mode) == 0:
          deployAndroid=deploy_androidQos(publishDevice,"CONFERENCE")
          deployAndroid=deploy_androidQos(subscribeDevice,"CONFERENCE")
        else:
          deployAndroid=deploy_androidQos(publishDevice,"P2P")
          deployAndroid=deploy_androidQos(subscribeDevice,"P2P")
    deployAndroid1 = 0
    deployAndroid2 = 0

####################################################################################
# begin testing #
#####################################################################################
    #for index in range(len(lines)):
    interval=10
    #caseinfo=split_line(lines[index]);
    #print "case is", caseinfo[0];
    #print "classname is", caseinfo[1];
    ######clean enviroment befor start test suits#########
    if int(mode) == 0:
      print "start Android to Android"
      if (deployAndroid1 == 0) and (deployAndroid2 == 0):
        startAndroid1=start_android_qos_sync(publishDevice,casename,"TestDevice1","CONFERENCE");
        startAndroid2=start_android_qos_sync(subscribeDevice,casename,"TestDevice2","CONFERENCE");
        waitProcess(10, startAndroid1,startAndroid2)
        Android1Result = read_Qoscaselist("TestDevice1",casename,"CONFERENCE");
        Android2Result = read_Qoscaselist("TestDevice2",casename,"CONFERENCE");
        if (Android1Result == 0) and (Android2Result == 0):
          target.write("Android-Android case:: "+casename+": pass");
          target.write('\n');
          print "Android-Andorid case: ",casename,": pass"
          get_android_qos_file(publishDevice,subscribeDevice,"CONFERENCE")
        else:
          print "Android-Android case: ",casename,": fail"
          target.write("Android-Android case: "+casename+" : fail");
          target.write('\n');
    elif int(mode) == 1:
      #get_android_qos_file(publishDevice,subscribeDevice,"P2P")
      startAndroid1=start_android_qos_sync(publishDevice,casename,"TestDevice1","P2P");
      startAndroid2=start_android_qos_sync(subscribeDevice,casename,"TestDevice2","P2P");
      waitProcess(10, startAndroid1,startAndroid2)
      Android1Result = read_Qoscaselist("TestDevice1",casename,"P2P");
      Android2Result = read_Qoscaselist("TestDevice2",casename,"P2P");
      if (Android1Result == 0) and (Android2Result == 0):
        target.write("Android-Android case:: "+casename+": pass");
        target.write('\n');
        print "Android-Andorid case: ",casename,": pass"
        get_android_qos_file(publishDevice,subscribeDevice,"P2P")
      else:
        print "Android-Android case: ",casename,": fail"
        target.write("Android-Android case: "+casename+" : fail");
        target.write('\n');

    ###########################################################################################
    # close result file #
    ###########################################################################################
    target.close()

def get_devices():
        output = subprocess.check_output('adb devices', shell=True,)
        print '\tstdout:', output
        if len(output) == 0:
           return 1
        else:
            devicesArray=[];
            results=output.split("\n");
            for index in range(len(results)):
                #print 'Current results :', results[index]
                if "device" in results[index]:
                  if not "devices" in results[index]:
                      deviceName=results[index].split('\t')
                      devicesArray.append(deviceName[0]);
        return devicesArray

def deploy_androidQos(androidDevice,mode):
        if mode == 'P2P':
          AndroidPath=ANDROID_P2P_QOS_CONFIG_FOLDER
        else:
          AndroidPath=ANDROID_CONFERENCE_QOS_CONFIG_FOLDER
        print "run command to install android apk "+ AndroidPath + '/runTestQos.sh --buildlib --install -s ' + androidDevice;
        (status, output) = commands.getstatusoutput(AndroidPath + '/runTestQos.sh --buildlib --install -s ' + androidDevice)
        print 'status is: ',status;
        print "output is :",output;
        if status == 0 :
           return 0
        else:
           print "Install APK failed"
           return 1

def start_android_qos_sync(androidDevice, casename, classname, mode):
        AndroidPath = ''
        if mode == 'P2P':
          AndroidPath=ANDROID_P2P_QOS_CONFIG_FOLDER
        else:
          AndroidPath=ANDROID_CONFERENCE_QOS_CONFIG_FOLDER
        #print AndroidPath
        print "run command to run test case "+ AndroidPath + '/runTestQos.sh --runcase -s ' + androidDevice + ' -n ' + casename + ' -c ' + classname;
        runAndriodCase=subprocess.Popen(AndroidPath + '/runTestQos.sh --runcase -s ' + androidDevice + ' -n ' + casename + ' -c ' + classname, shell=True)
        return runAndriodCase.pid


def read_Qoscaselist(devices, casename, mode):
        result = 1;
        filename_base = ''
        if mode == 'P2P':
          AndroidPath=ANDROID_P2P_QOS_CONFIG_FOLDER
          filename_base = "p2p-android-test-result--com.intel.p2pqostest."+devices+'-'+casename+'.txt';
        else:
          AndroidPath=ANDROID_CONFERENCE_QOS_CONFIG_FOLDER
          filename_base = "conference-android-test-result--com.intel.webrtc.conferenceqostest."+devices+'-'+casename+'.txt';
        filename = AndroidPath+'/log'+'/'+filename_base;
        print "filename is :" + filename;
        arrays = [line.rstrip('\n') for line in open(filename)]
        for index in range(len(arrays)):
            searchString = "OK: 1";
            if (searchString in arrays[index]):
                print "get OK number"
                result = 0;
        print "get ok number is ", result;
        return result;


def get_android_qos_file(publishDevice, subscribeDevice,mode):
        if mode == 'P2P':
          #mcuBenchCppPath=Config.getConfig(Keys.WEBRTC_WEBRTC_QA_MCU_BENCH_CPP)
          #os.chdir("../")
          mcuBenchCppPath = os.getcwd()
          #print AndroidPath
          print "run command to get android p2pqos file "+ mcuBenchCppPath + '/shell/runp2p.sh -s ' + subscribeDevice + ' -p ' + publishDevice;
          runAndroidQosFile=subprocess.Popen(mcuBenchCppPath + '/shell/runp2p.sh -s '+subscribeDevice +" -p " +publishDevice, shell=True,stdout=subprocess.PIPE)
          out,err =runAndroidQosFile.communicate()
          print "out :-----------"
          print out
          print "err :-----------"
          print err
        else:
          #mcuBenchCppPath=Config.getConfig(Keys.WEBRTC_WEBRTC_QA_MCU_BENCH_CPP)
          #os.chdir("../")
          mcuBenchCppPath = os.getcwd()
          #print AndroidPath
          print "run command to get android conferenceqos file "+ mcuBenchCppPath + '/shell/runconference.sh -s ' + subscribeDevice + ' -p ' + publishDevice;
          runAndroidQosFile=subprocess.Popen(mcuBenchCppPath + '/shell/runconference.sh -s '+subscribeDevice +" -p " +publishDevice, shell=True,stdout=subprocess.PIPE)
          out,err =runAndroidQosFile.communicate()
          print "out :-----------"
          print out
          print "err :-----------"
          print err


def split_line(text):
    casenumber, casename = text.split("=")
    if casename:
       caseInfoList = casename.split(";");
       caseInfoList[0] = caseInfoList[0].replace("\"", "");
       caseInfoList[-1] = caseInfoList[-1].replace("\"", "");
       return caseInfoList

def on_aaa_response(*args):
    print('connected', args)
    return 0;
def socket_connect():
    socketIO.on('connect', on_aaa_response)
    socketIO.wait(seconds=3)
    return socketIO;
    socketIO.emit("controlevent",{"lock":"STARTTEST"})
def emitmessage(message,data):
    socketIO.emit(message,data)

def print_ts(message):
    print "[%s] %s"%(time.strftime("%Y-%m-%d %H:%M:%S", time.localtime()), message)
def waitProcess(interval, processnumber1,processnumber2):
    print_ts("-"*100)
    print_ts("Starting every %s seconds."%interval)
    print_ts("-"*100)
    global number
    while number < 50:
      print "****waiting time is:", number*interval, "s";
      time_remaining = interval-time.time()%interval
      print_ts("Sleeping until %s (%s seconds)..."%((time.ctime(time.time()+time_remaining)), time_remaining))
      time.sleep(time_remaining)
      print_ts("Starting command.")
      p=psutil.pids();
      #print p
      if processnumber2:
        if (processnumber1 in p) or (processnumber2 in p):
          print_ts("-"*100)
          print("process ",processnumber1,',',processnumber2," still running");
          print("process ",processnumber1,"status is, ",psutil.Process(processnumber1).status());
          print("process ",processnumber2,"status is, ",psutil.Process(processnumber2).status());
          if (psutil.Process(processnumber1).status() == 'zombie') and (psutil.Process(processnumber2).status() == 'zombie'):
            break
        else:
          break
      else:
        print "*****only need detect single process", processnumber1
        if (processnumber1 in p):
          print_ts("-"*100)
          print("process ",processnumber1," still running");
          print("process ",processnumber1,"status is, ",psutil.Process(processnumber1).status());
          if (psutil.Process(processnumber1).status() == 'zombie'):
            break
        else:
          break
      number=number+1
#test#
#if __name__ == "__main__":
#    start_test(caselist,0)
if __name__ == "__main__":
  # if mode == 0:
  #   changeparmater(fps,bitrate,testtime)
  start_test(casename,mode)
