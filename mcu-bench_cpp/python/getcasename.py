from config import Config
from config import ConfigKeys as Keys
import os
import re
import getopt
import sys
mode = ''
try:
   opts, args = getopt.getopt(sys.argv[1:],"hm:",["help"])
except getopt.GetoptError:
   print 'error :  -p <publish androiddevice>'
   sys.exit(2)
for opt, arg in opts:
   if opt in ("-h", "--help"):
      print '-p publish AndroidDevice'
      sys.exit()
   elif opt == "-m":
      mode = arg
   else:
      assert False, "unhandled option"

if __name__ == '__main__':
    casename = ''
    basepath = ''
    casesfilepath = ''
    pattern = re.compile("public void ([t/T]est.*?)\(\)")
    if mode == 'conference':
        basepath = Config.getConfig(Keys.ANDROID_CONFERENCE_QOS_CONFIG_FOLDER)
        casesfilepath = os.path.join(basepath,"src/main/java/com/intel/webrtc/conferenceqostest")
    else:
        basepath = Config.getConfig(Keys.ANDROID_P2P_QOS_CONFIG_FOLDER)
        casesfilepath = os.path.join(basepath,"src/main/java/com/intel/p2pqostest")
    fileNamepath = os.path.join(casesfilepath,"TestDevice1.java")
    filename = open(fileNamepath,'r')
    for line in filename.readlines():
        s = pattern.search(line)
        if s is not None:
            casename=casename+s.group(1)+","
    print casename.strip(",")
