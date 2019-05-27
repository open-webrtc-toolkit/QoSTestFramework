# Copyright (C) <2019> Intel Corporation
#
# SPDX-License-Identifier: Apache-2.0
# http://vq.kt.agh.edu.pl//metrics.html

import os
import os.path
import subprocess
from itertools import islice

old_cwd = os.getcwd()
targ_cwd = os.path.dirname(os.path.abspath(__file__))
os.chdir(targ_cwd)

cmd = "./mitsu/mitsuLinuxMultithread"
yuv = "../dataset/output/rec.yuv"
width = "540"
height = "360"
_ = subprocess.run([cmd, yuv, width, height]).stdout
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
os.remove("metricsResultsCSV.txt")
list_line = []
for line in islice(lines, 1, None):
    line = line.strip()
    line = line.split("\t")
    tuple_line = tuple(line)
    list_line.append(tuple_line)

for frame in list_line:
    ID = frame[0]
    # Greater value, less visible distortion. It's like mosaic
    Blockiness = frame[1]
    SA = frame[2]
    # Value 1 means that the entire frame is smooth (blackout).
    Letterbox = frame[3]
    # Value 1 means that the entire frame is smooth (blackout).
    Pillarbox = frame[4]
    Blockloss = frame[5]    # Greater value, more visible distortion
    Blur = frame[6]         # Greater value, more visible distortion
    TA = frame[7]
    Blackout = frame[8]
    # Greater value, greater distortion (in this case distortion occurs)
    Freezing = frame[9]
    Exposure = frame[10]    # Greater value, greater exposure time
    Contrast = frame[11]    # Greater value, higher contrast
    Interlace = frame[12]   # Greater value, greater distortion
    Noise = frame[13]       # Greater value, greater distortion
    Slice = frame[14]
    Flickering = frame[15]

    # print "\n" + "Frame:" + ID
    print(Blockiness)
    print(Blockloss)
    print(Blur)
    print(Noise)
    print(Interlace)
    print(Freezing)
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
Blockiness_output.close()
Blockloss_output.close()
Blur_output.close()
Interlace_output.close()
Noise_output.close()
Freezing_output.close()

os.chdir(old_cwd)
