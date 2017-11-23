#! /usr/bin/python

# @author       jianhui.j.dai@intel.com
# @brief
# @version      0.1
# @date         2015/01/23

import os
import sys
import getopt
import operator
import re
import shutil
import array
import struct


def PrintUsage():
    print ""
    print "  Usage: " + sys.argv[0] + " clip.mp4"
    print "      -o"
    print "          specify output filename (defaut is clip-resolution-bitrate.h264)"
    print "      -w"
    print "          specify output width, default 1920"
    print "      -h"
    print "          specify output height, default 1080"
    print "      -f"
    print "          specify output framerate, default 30"
    print "      -b"
    print "          specify output bitrate, default 4000k"
    print "      -g"
    print "          specify output gop, default 30"
    print "      -v"
    print "          specify output format, default h264"
    print ""
    print "  Sample: "
    print ""
    print "          " + sys.argv[0] + ' -o output.h264 -w 1920 -h 1080 -f 30 -b 4000k -g 30 clip.mp4'
    print "          " + sys.argv[0] + ' -w 1920 -h 1080 -f 30 -b 4000k -g 30 clip.mp4'
    print ""
    sys.exit(1)

def getBufSize(bitrate):
    bufsize = str(int(bitrate.rstrip('kK')) * 1) + 'k'

    return bufsize

def extraceBitSreamH264(inputFile, o_width, o_height, o_framerate, o_bitrate, o_gop, o_file):
    cmd = 'ffmpeg -y -i ' + inputFile \
        + ' -ss 0:0:0 -t 2' \
        + ' -c:v libx264 ' \
        + ' -g ' + o_gop \
        + ' -b:v ' + o_bitrate + ' -minrate ' + o_bitrate + ' -maxrate ' + o_bitrate + ' -bufsize ' + getBufSize(o_bitrate) \
        + ' -framerate ' + o_framerate \
        + ' -s ' + o_width + 'x' + o_height \
        + ' -movflags +faststart -vcodec h264 -profile:v baseline -level 3.0 -vbsf h264_mp4toannexb -f h264 ' \
        + o_file

    print cmd

    stream = os.popen(cmd)
    lines = stream.readlines()

    #sys.exit(1)

    return

def tagSkip57(input):
    output=0;
    len =1;
    while True :
        num = input%10;
        if(num==5 or num==7) :
           num=num+1;
        output += num*len;
        len=len*10;
        if (input/10):
          input = input/10;
        else:
          break
    return output;


def mkH264(g_output, g_input, g_width, g_height,
           g_framerate, g_bitrate, g_gop, g_rawBSFile):

    extraceBitSreamH264(g_input, g_width, g_height,
                        g_framerate, g_bitrate, g_gop, g_rawBSFile)

    if not os.path.exists(g_rawBSFile):
        print '*' * 10
        print 'Error:', 'Can not extract bitstream'
        print '*' * 10
        sys.exit(1)

    f_output = file(g_output, 'wb')

    f = open(g_rawBSFile, 'rb')
    data = f.read()

    f.seek(0, os.SEEK_END)
    size = f.tell()
    # print size

    f.close()

    if os.path.exists(g_rawBSFile):
        os.remove(g_rawBSFile)

    i = 0
    frameNum = 1
    startCodePosition = None
    nal_type = None
    last_nal_type = None
    j = frameNum
    print "size is ", size;
    while i < size:
        if ord(data[i]) == 0 and ord(data[i + 1]) == 0 and ord(data[i + 2]) == 0 and ord(data[i + 3]) == 1:
            nal_type = ord(data[i + 4])

            # merge sps, pps, skip sps and wait for next pps
            if not nal_type == 0x67:
                if startCodePosition is not None:
                    frame_size = i - startCodePosition
                    frame_size_str = struct.pack('I', frame_size)
                    if frameNum % 100 == 0:
                        print "Write ", frameNum, " frame..."
                    result=tagSkip57(j);
                    j=result+1;
                    tag_str = struct.pack("I",result)
                    print "tag is", result;
#########################write data #############################
                    f_output.write(frame_size_str)
                    f_output.write(tag_str)
                    f_output.write(data[startCodePosition:i])
                    print "frameNum is ", frameNum
                    frameNum += 1
                startCodePosition = i

            last_nal_type = nal_type

        i += 1

    f_output.close()
    print "Write ", frameNum-1, " frame...Done"


def extraceBitSreamVP8(inputFile, o_width, o_height, o_framerate, o_bitrate, o_gop, o_file):
    cmd = 'ffmpeg -y -i ' + inputFile \
        + ' -threads 8 ' \
        + ' -c:v libvpx ' \
        + ' -g ' + o_gop \
        + ' -b:v ' + o_bitrate + ' -minrate ' + o_bitrate + ' -maxrate ' + o_bitrate + ' -bufsize ' + getBufSize(o_bitrate) \
        + ' -framerate ' + o_framerate \
        + ' -s ' + o_width + 'x' + o_height \
        + ' -movflags +faststart -vcodec vp8 -f ivf ' \
        + o_file

    print cmd

    stream = os.popen(cmd)
    lines = stream.readlines()

    return

'''
bytes 0-3    signature: 'DKIF'
bytes 4-5    version (should be 0)
bytes 6-7    length of header in bytes
bytes 8-11   codec FourCC (e.g., 'VP80')
bytes 12-13  width in pixels
bytes 14-15  height in pixels
bytes 16-19  frame rate
bytes 20-23  time scale
bytes 24-27  number of frames in file
bytes 28-31  unused

The header is followed by a series of frames. Each frame consists of a 12-byte header followed by data:

bytes 0-3    size of frame in bytes (not including the 12-byte header)
bytes 4-11   64-bit presentation timestamp
bytes 12..   frame data
'''


def mkVP8(g_output, g_input, g_width, g_height,
          g_framerate, g_bitrate, g_gop, g_rawBSFile):

    extraceBitSreamVP8(g_input, g_width, g_height,
                       g_framerate, g_bitrate, g_gop, g_rawBSFile)

    if not os.path.exists(g_rawBSFile):
        print '*' * 10
        print 'Error:', 'Can not extract bitstream'
        print '*' * 10
        sys.exit(1)

    f_output = file(g_output, 'wb')

    f = open(g_rawBSFile, 'rb')
    data = f.read()

    f.seek(0, os.SEEK_END)
    size = f.tell()
    # print size

    f.close()

    if os.path.exists(g_rawBSFile):
        os.remove(g_rawBSFile)

    head = struct.unpack('4sHH4sHHIIII', data[0:32])
    print '%s, version %d, %s, %dx%d, %dfps, %d frames' % (head[0], head[1], head[3], head[4], head[5], head[6], head[8])

    i = 32
    frameNum = 1
    j=frameNum
    while i < size:

        frame_head = struct.unpack('III', data[i:i + 12])
        print frame_head

        frame_size = frame_head[0]

        frame_size_str = struct.pack('I', frame_size)


        if frameNum % 100 == 0:
            print "Write ", frameNum, " frame..."

        result=tagSkip57(j);
        j=result+1;
        tag_str = struct.pack("I",result)
        print "tag is", result;
#########################write data #############################
        f_output.write(frame_size_str)
        f_output.write(tag_str)
        f_output.write(data[i + 12:i + 12 + frame_size])
        print "frameNum is ", frameNum
        i += 12 + frame_head[0]
        frameNum += 1

    f_output.close()

    print "Write ", frameNum-1, " frame...Done"


def main(argv):
    try:
        options, arguments = getopt.getopt(argv[1:], "o:w:h:f:b:g:v:", [])
    except getopt.GetoptError, error:
        PrintUsage()

    g_input = None
    g_output = None

    g_width = '1920'
    g_height = '1080'

    g_framerate = '30'
    g_bitrate = '4000'
    g_gop = '30'

    g_format = 'h264'

    g_suffix = None
    g_rawBSFile = None

    if len(arguments) != 1:
        PrintUsage()

    g_input = arguments[0]

    for option, value in options:
        if option == "-o":
            g_output = value
        elif option == "-w":
            g_width = str(value)
        elif option == "-h":
            g_height = str(value)
        elif option == "-f":
            g_framerate = str(value)
        elif option == "-b":
            g_bitrate = int(value)
            g_bitrate = str(g_bitrate) + 'k'
        elif option == "-g":
            g_gop = str(value)
        elif option == "-v":
            g_format = str(value)
        else:
            PrintUsage()

    if not os.path.exists(g_input):
        print '*' * 10
        print 'Error:', 'Input dose not existed, ', os.path.abspath(g_input)
        print '*' * 10
        sys.exit(1)

    if g_format == 'h264':
        g_suffix = '.h624'
        g_rawBSFile = '.tmp.h264'
    elif g_format == 'vp8':
        g_suffix = '.vp8'
        g_rawBSFile = '.tmp.ivf'
    else:
        print '*' * 10
        print 'Error:', 'Invalid format, ', g_format
        print '*' * 10
        sys.exit(1)

    if g_output is None:
        g_output =  g_width + 'x' + g_height + '-framerate' + g_framerate + \
            '-bitrate' + g_bitrate + '-gop' + g_gop + g_suffix

    if os.path.exists(g_rawBSFile):
        os.remove(g_rawBSFile)

    if g_format == 'h264':
        mkH264(g_output, g_input, g_width, g_height, g_framerate, g_bitrate,
               g_gop, g_rawBSFile)
    else:
        mkVP8(g_output, g_input, g_width, g_height,
              g_framerate, g_bitrate, g_gop, g_rawBSFile)

    print "Generate Done: " + g_output


if __name__ == '__main__':
    main(sys.argv)
