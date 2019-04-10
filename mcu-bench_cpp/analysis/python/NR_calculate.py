# http://vq.kt.agh.edu.pl//metrics.html
# yonghao.zhao@intel.com
# 2017.6.1

import os
from string import atoi
from itertools import islice

#os.popen("ffmpeg -i ../../native/output/receive/%d.tiff -s 1280x720 -pix_fmt yuv420p ../../native/output/receive/rec.yuv")
#os.popen("ffmpeg -i ../../native/output/send/%d.tiff -s 1280x720 -pix_fmt yuv420p ../../native/output/send/send.yuv")
cmd = "./mitsu/mitsuLinuxMultithread" 
'''
yuv = "test_black_mosaic_1280*1024.yuv " 
width = "1280 "
height = "1024"
'''
yuv = "../dataset/output/rec.yuv" 
width = "540"
height = "360"
#os.popen("rm python/mitsu/metricsResultsCSV.txt")
output = os.popen(cmd + " " + yuv + " " + width + " " + height, "r")
output.read()
f = open("metricsResultsCSV.txt")
Blockiness_output = open('../dataset/output/Blockiness_score', 'w')
Blockloss_output = open('../dataset/output/Blockloss_score', 'w')
Blur_output = open('../dataset/output/Blur_score', 'w')
Noise_output = open('../dataset/output/Noise_score', 'w')
Freezing_output = open('../dataset/output/Freezing_score', 'w')
Interlace_output = open('../dataset/output/Interlace_score', 'w')
NR_output = open('../dataset/output/NR_score', 'w')
lines = f.readlines()
f.close()
os.popen("rm metricsResultsCSV.txt")
list_line = []
for line in islice(lines, 1, None):
    line = line.strip()
    line = line.split("\t")
    tuple_line = tuple(line)
    list_line.append(tuple_line)

for frame in list_line:
    ID = frame[0]
    Blockiness = frame[1]   # Greater value, less visible distortion. It's like mosaic
    SA = frame[2]
    Letterbox =  frame[3]   # Value 1 means that the entire frame is smooth (blackout).
    Pillarbox = frame[4]    # Value 1 means that the entire frame is smooth (blackout).
    Blockloss = frame[5]    # Greater value, more visible distortion
    Blur = frame[6]         # Greater value, more visible distortion
    TA = frame[7]
    Blackout = frame[8]
    Freezing = frame[9]     # Greater value, greater distortion (in this case distortion occurs)
    Exposure = frame[10]    # Greater value, greater exposure time
    Contrast = frame[11]    # Greater value, higher contrast
    Interlace = frame[12]   # Greater value, greater distortion
    Noise = frame[13]       # Greater value, greater distortion
    Slice = frame[14]
    Flickering = frame[15]

    #print "\n" + "Frame:" + ID
    print( Blockiness)
    print( Blockloss)
    print( Blur)
    print( Noise)
    print( Interlace)  
    print( Freezing)
    NR_output.write(Blockiness.strip(' '))
    NR_output.write(',')
    NR_output.write(Blockloss.strip(' '))
    NR_output.write(',')
    NR_output.write(Blur.strip(' '))
    NR_output.write(',')
    NR_output.write(Interlace.strip(' '))
    NR_output.write(',')
    NR_output.write(Noise.strip(' '))
    NR_output.write(',')
    NR_output.write(Freezing.strip(' '))
    NR_output.write(',')
    Blockiness_output.write(Blockiness.strip(' '))
    Blockiness_output.write(',')
    Blockloss_output.write(Blockloss.strip(' '))
    Blockloss_output.write(',')
    Blur_output.write(Blur.strip(' '))
    Blur_output.write(',')
    Interlace_output.write(Interlace.strip(' '))
    Interlace_output.write(',')
    Noise_output.write(Noise.strip(' '))
    Noise_output.write(',')
    Freezing_output.write(Freezing.strip(' '))
    Freezing_output.write(',')
'''
    if float(Blockiness) > 1.01:
       print "Blockiness detected! " + Blockiness + "(<0.9 or >1.01)"
    if float(Blockloss) > 5 :
       print "Blockloss detected! " + Blockloss + "(>5)"
    if float(Blur) > 5:
       print "Blur detected! " + Blur + "(>5)"
    if float(SA) > 60:
       print "Spatial Activity detected! " + SA + "(>60)"
    if float(Letterbox) == 1 and float(Blackout) == 1:
       print "Blackout detected!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! "
    if float(Pillarbox) != 0 :
       print "Pillarbox detected! " + Pillarbox + "(!=0)"
    if float(TA) > 20 :
       print "Temporal Activity detected! " + TA + "(>20)"
    if float(Blackout) == 1:
       print "Blackout dectected! " + Blackout + "(!=0)"
    if float(Freezing) != 0:
       print "Freezing detected! " + Freezing + "(!=0)"
    if float(Exposure) < 115 or float(Exposure) > 125:
       print "Exposure detected! " + Exposure + "(<115 or 125)"
    if float(Contrast) < 45 or float(Contrast) > 55:
       print "Contrast detected! " + Contrast + "(<45 or >55)"
    if float(Interlace) != 0:
       print "Interlace detected! " + Interlace + "(!=0)"
    if float(Noise) >3.5:
       print "Noise detected!" + Noise + "(>3.5)"
    if float(Slice) > 1000:
      print "Indicator doesn't work"'''
Blockiness_output.close()
Blockloss_output.close()
Blur_output.close()
Interlace_output.close()
Noise_output.close()
Freezing_output.close()
