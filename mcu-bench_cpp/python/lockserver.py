import subprocess
import getopt
import sys


mode=''
ip=''
try:
  opts, args = getopt.getopt(sys.argv[1:],"h:m:i:",["help","mode="])
except getopt.GetoptError:
  print 'error : run.py -c <caselistfile> -m <mode>'
  sys.exit(2)
for opt, arg in opts:
  if opt in ("-h", "--help"):
    print 'runqos.py -c <caselistfile> -m <mode> '
    sys.exit()
  elif opt == "-m":
    mode = arg
    print"getcaselist"
  elif opt == "-i":
    ip = arg
    print"getcaselist"
  else:
    assert False, "unhandled option"
if mode == '':
   print 'Error !!! \n Please use: run.py -m <mode> \n mode 0:'
   sys.exit()

def killlockserver():
  killserver=subprocess.Popen('ps aux | grep lockserver_withcontrol.jar | grep -v \'grep\' | awk \'{print $2}\' |xargs kill -9 >/dev/null 2>&1', shell=True,stdout=subprocess.PIPE)
  killserver.wait()

def startockserver():
  print "start"
  subprocess.Popen('nohup java -jar lockserver_withcontrol.jar '+ ip +" 9091 9092 ~/lock.txt & ", shell=True)

def checklockserver():
  checkserver=subprocess.Popen('ps aux | grep lockserver_withcontrol.jar | grep -v \'grep\'', shell=True,stdout=subprocess.PIPE)
  out,err = checkserver.communicate()
  if out != '':
    print 1
  else:
    print 2

if __name__ == '__main__':
  if int(mode) == 0 :
    checklockserver()
  elif int(mode) == 1:
    killlockserver()
    startockserver()