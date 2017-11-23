'''
Created on Aug,30 2017

@author: Yanbin

This script is used to analysis received file: seperate the audio by silence sequences, generate the pesq result .
'''

import os
import sys, getopt, time

try:
   opts, args = getopt.getopt(sys.argv[1:],"h:s:f:a:c:",["help", "testfile=","ar=","channel"])
except getopt.GetoptError:
   print 'error : generate_pesq.py -s sendfile_no_silence.pcm -f received_filename.pcm -a 48000 -c 2'
   sys.exit(2)
for opt, arg in opts:
   if opt in ("-h", "--help"):
      print 'sendfile should be 16khz and mono pcm file. If received file is opus(48khz) and stereo: python generate_pesq.py -s sendfile_no_silence.pcm -f filename.pcm -a 48000 -c 2'
      sys.exit()
   elif opt == "-s":
      sourcefile = arg
   elif opt == "-f":
      filename = arg
   elif opt == '-a':
      rate = arg
   elif opt == '-c':
      channel = arg
   else:
      assert False, "unhandled option"
folder=os.path.dirname(os.getcwd())
workspace=folder+"/mcu-bench_cpp/audio_test"
os.system("ffmpeg -f s16le -ar "+rate+" -ac "+channel+" -i "+filename+" first.wav")
os.system("ffmpeg -i first.wav -af silencedetect=noise=-50dB:d=1 -f null - >"+workspace+"/a.txt 2>&1")
#print "ffmpeg -i first.wav -af silencedetect=noise=-50dB:d=1 -f null - >"+workspace+"/a.txt 2>&1"
if os.path.isfile(workspace+"/result.txt"): 
   os.system("rm -rf "+workspace+"/result.txt")
if os.path.isfile(workspace+"/../pesq_result.txt"): 
   os.system("rm -rf "+workspace+"/../pesq_result.txt")
if os.path.isfile(workspace+"/pesq.txt"): 
   os.system("rm -rf "+workspace+"/pesq.txt")
with open (workspace+"/a.txt", "r") as myfile:
    data = myfile.readlines()
    my_list =[];
    last_time = 0;
    num = 0;
    for line in data:
        if "silence_start" in line:
            startTime=line.split(":");
            for temp in startTime: 
                   if "silence_start" in temp:
                       continue
                   else:
                        if '0.0' in temp.strip():
                           continue
                           last_time=0.0
                        else:
                           time=temp.strip().split(".");
                           current_time=float(time[0])+1
                           duration=current_time-float(last_time)
                           if(long(last_time)>60):
                               minutes=int(last_time)/60
                               seconds=float(last_time)-(60*minutes)
                           else:
                               minutes=0
                               seconds=last_time
 #                          print "ffmpeg -i first.wav -ss 00:0"+str(minutes)+":"+str(seconds)+" -t "+str(duration)+" -acodec copy output"+str(num)+".wav"
                           os.system("ffmpeg -i first.wav -ss 00:0"+str(minutes)+":"+str(seconds)+" -t "+str(duration)+" -acodec copy output"+str(num)+".wav")
 #                         print "sox output"+str(num)+".wav no_silence_output"+str(num)+".wav silence 1 0 1% -1 0 1%"
                           os.system("sox output"+str(num)+".wav no_silence_output"+str(num)+".wav silence 1 0 1% -1 0 1%")
                           os.system("rm -rf output"+str(num)+".wav")
                           os.system("sox no_silence_output"+str(num)+".wav -b 16 -c 1 -r 16k "+workspace+"/"+str(num)+".wav")
                           os.system("rm -rf no_silence_output"+str(num)+".wav")
 #                          print "begining start pesq"
                           os.system(workspace+"/Software/P862_annex_A_2005_CD/source/PESQ +16000 "+sourcefile+" "+workspace+"/"+str(num)+".wav >>"+workspace+"/result.txt 2>&1")
#                           print("/home/yanbin/workspace/project/webrtc-webrtc-qa/mcu-bench_cpp/audio_test/Software/P862_annex_A_2005_CD/source/PESQ +16000 "+sourcefile+" "+workspace+"/"+str(num)+".wav >>"+workspace+"/result.txt 2>&1")
#                           print "end pesq"
                           last_time=float(time[0])+1
                           num = num + 1
f= open(workspace+"/output/pesq.txt","w+")
with open(workspace+"/result.txt","r") as resultfile:
     data = resultfile.readlines()
     for line in data:
          if "P.862 Prediction (Raw MOS, MOS-LQO):  = " in line:
              result=line.split("=");
              mos=result[1].split();
              print mos[0]
              f.write(mos[0])
              f.write(",")
f.close()
