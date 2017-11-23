'''
Created on Aug,30 2017

@author: Yanbin
This python scripts is used to generate send pcm file with silence sequence.
Currently , we support the default send file is mono and 16KHZ file
'''

import os
import sys, getopt, time

try:
   opts, args = getopt.getopt(sys.argv[1:],"h:s:f:a:c",["help", "testfile=","ar=","channel"])
except getopt.GetoptError:
   print 'error : generate_audio.py -s sendfile_no_silence.pcm -f sendfile_with_silence_long.pcm -a 16000 -c 1'
   sys.exit(2)
for opt, arg in opts:
   if opt in ("-h", "--help"):
      print 'sendfile should be single no silence 16khz and mono pcm file. python generate_audio.py -s sendfile_no_silence.pcm -f sendfile_with_silence_long -a 16000 -c 1'
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
import numpy, pylab
with open(sourcefile, 'wb') as f2:
    for x in range(2,7):
        with open(filename, 'rb') as f1: 
           length=16000*1*2*x;
           print length
           for y in range(length):
              f2.write('\x00')
           f2.write(f1.read())
        
data = numpy.memmap(sourcefile,dtype="h",mode="r")

data2 = numpy.memmap(filename,dtype="h",mode="r")
ax=pylab.subplot(211)
pylab.title("original")
pylab.plot(data)
pylab.legend()
pylab.subplot(212)
pylab.title("send")
pylab.grid(alpha=.2)
pylab.plot(data2)
fig1 = pylab.gcf()
pylab.show()
fig1.savefig('compared.png', dpi=100)
pylab.close()
f1.close()
f2.close()
