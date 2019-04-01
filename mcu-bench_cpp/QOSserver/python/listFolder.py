import os
from string import atoi
from itertools import islice
import sys, getopt, time
import subprocess
import psutil
import commands
import re
import os
'''
this python scripts is used for read result folder
'''
folder = 'report'
level  = 0
try:
   opts, args = getopt.getopt(sys.argv[1:],"h:f:l:",["help", "folder=","level="])


except getopt.GetoptError:
   print 'error : listFolder.py -f <folder> -l <level>'
   sys.exit(2)
for opt, arg in opts:
   if opt in ("-h","--help"):
      print 'listFolder.py -f <folder> -l <level> \n'
   elif opt == '-f':
      folder = arg
   elif opt == '-l':
      level = int(arg)
   else:
      assert False, "unhandled option"

for dirname, dirnames, filenames in os.walk(folder):
    # print path to all subdirectories first.
    #print (os.path.join(dirnames));
    if dirname.count(os.sep) - folder.count(os.sep) == level:
        for subdirname in dirnames:
            print(os.path.join(dirname, subdirname))

    # print path to all filenames.
    #for filename in filenames:
    #    print(os.path.join(dirname, filename))

    # Advanced usage:
    # editing the 'dirnames' list will stop os.walk() from recursing into there.
    if '.git' in dirnames:
        # don't go into any .git directories.
        dirnames.remove('.git')
