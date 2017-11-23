#!/usr/bin/python
import subprocess
import getopt
import sys
import datetime
import time
publishdevice = ''
subscribedevice = ''
pub_list=[]
sub_list=[]
pubisbig = False
subisbig = False
try:
   opts, args = getopt.getopt(sys.argv[1:],"hp:s:",["help"])
except getopt.GetoptError:
   print 'error :  -p <publish androiddevice>'
   sys.exit(2)
for opt, arg in opts:
   if opt in ("-h", "--help"):
      print '-p publish AndroidDevice' 
      sys.exit()
   elif opt == "-p":
      publishdevice = arg
   elif opt == "-s":
      subscribedevice = arg
   else:
      assert False, "unhandled option"

def parseTime(datetime):
   timelist = datetime.split(":")
   print timelist
   hour=int(timelist[0]) * 3600
   minutes=int(timelist[1]) * 60
   second =int(timelist[2])
   seconds = hour+minutes+second
   fsecond = second *1000000 +int(timelist[3])
   return fsecond

def doshell(publisheddevice,subscribedevice):
   for i in range(10):
      print "------------------------"
      firsttime =parseTime(datetime.datetime.now().strftime("%H:%M:%S:%f"))
      pub=subprocess.Popen("adb -s "+publisheddevice +" shell echo \$EPOCHREALTIME", shell=True,stdout=subprocess.PIPE)
      pub.wait()
      lastttime =parseTime(datetime.datetime.now().strftime("%H:%M:%S:%f"))
      pub_androidtimes,error= pub.communicate()
      pub_androidtime = int(pub_androidtimes.split(".")[0]) * 1000000 +int(pub_androidtimes.split(".")[1])
      print "firsttime:"+str(firsttime)
      print "lastttime:"+str(lastttime)
      errortime = lastttime-firsttime
      print "errortime:" +str(errortime)
      print "pub:"+str(pub_androidtime)
      pub_list.append(pub_androidtime)
      sub=subprocess.Popen("adb -s "+subscribedevice +" shell echo \$EPOCHREALTIME", shell=True,stdout=subprocess.PIPE)
      sub.wait()
      sub_androidtimes,error= sub.communicate()
      sub_androidtime = int(sub_androidtimes.split(".")[0]) * 1000000 +int(sub_androidtimes.split(".")[1])-errortime
      print "sub:"+str(sub_androidtime)
      sub_list.append(sub_androidtime)

def calctime():
   global pubisbig
   global subisbig
   print "1111111111111111111111111111111111"
   returnAvgTime = 0
   total_pubbigtime = 0
   count_pubbig = 0
   total_subbigtime = 0
   count_subbig = 0
   if len(pub_list) == len(sub_list):
      for i in range(len(pub_list)):
         if pub_list[i] > sub_list[i]:
            total_pubbigtime = total_pubbigtime+pub_list[i]-sub_list[i]
            count_pubbig = count_pubbig+1
         else:
            total_subbigtime = total_subbigtime+sub_list[i]-pub_list[i]
            count_subbig = count_subbig+1
   print "pubbig :"+str(count_pubbig)
   print "subbig :"+str(count_subbig)
   if(count_pubbig > count_subbig):
      pubisbig = True
      returnAvgTime = total_pubbigtime/count_pubbig
   else:
      subisbig = True
      returnAvgTime = total_subbigtime/count_subbig
   return returnAvgTime



def write(file,time):
   target = open(file, 'w');
   if time > 0:
      if pubisbig:
         target.write(str(time))
      if subisbig:
         target.write("-"+str(time))
   else:
      target.write("can not get time");

if __name__ =='__main__':
   print publishdevice
   doshell(publishdevice.strip("\n"),subscribedevice.strip("\n"))
   gettime = calctime()
   write("native/Data/devicestime.log",gettime)

