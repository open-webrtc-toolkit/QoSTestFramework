#! /usr/bin/python

# Copyright (C) <2019> Intel Corporation
#
# SPDX-License-Identifier: Apache-2.0

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
    print "          specify output format (vp8, vp9, h264,h265), default h264"
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
        + ' -c:v libx264 ' \
        + ' -g ' + o_gop \
        + ' -b:v ' + o_bitrate + ' -minrate ' + o_bitrate + ' -maxrate ' + o_bitrate + ' -bufsize ' + getBufSize(o_bitrate) \
        + ' -framerate ' + o_framerate \
        + ' -s ' + o_width + 'x' + o_height \
        + ' -movflags +faststart -vcodec h264 -profile:v baseline -level 3.0 -vbsf h264_mp4toannexb -f h264 ' \
        + o_file

    #        + ' -ss 0:0:0 -t 2' \
    print cmd

    stream = os.popen(cmd)
    lines = stream.readlines()

    #sys.exit(1)

    return

def extraceBitSreamH265(inputFile, o_width, o_height, o_framerate, o_bitrate, o_gop, o_file):
    cmd = 'ffmpeg -y -i ' + inputFile \
        + ' -c:v libx265 ' \
        + ' -g ' + o_gop \
        + ' -b:v ' + o_bitrate + ' -minrate ' + o_bitrate + ' -maxrate ' + o_bitrate + ' -bufsize ' + getBufSize(o_bitrate) \
        + ' -framerate ' + o_framerate \
        + ' -s ' + o_width + 'x' + o_height \
        + ' -vcodec hevc -vbsf hevc_mp4toannexb -f hevc ' \
        + o_file

    #        + ' -ss 0:0:0 -t 2' \
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


def mkH26x(g_output, g_input, g_width, g_height,
           g_framerate, g_bitrate, g_gop, g_rawBSFile,codec):
    if codec == "h264":
        extraceBitSreamH264(g_input, g_width, g_height,
                     g_framerate, g_bitrate, g_gop, g_rawBSFile)
    else:
        print "extrace H265"
        extraceBitSreamH265(g_input, g_width, g_height,
                     g_framerate, g_bitrate, g_gop, g_rawBSFile)
       

def extraceBitSreamVPx(inputFile, o_width, o_height, o_framerate, o_bitrate, o_gop, o_file, codec):
    cmd = 'ffmpeg -y -i ' + inputFile \
        + ' -threads 8 ' \
        + ' -c:v libvpx ' \
        + ' -g ' + o_gop \
        + ' -b:v ' + o_bitrate + ' -minrate ' + o_bitrate + ' -maxrate ' + o_bitrate + ' -bufsize ' + getBufSize(o_bitrate) \
        + ' -framerate ' + o_framerate \
        + ' -s ' + o_width + 'x' + o_height \
        + ' -movflags +faststart -vcodec ' + codec + ' ' \
        + o_file

    print cmd

    stream = os.popen(cmd)
    lines = stream.readlines()

    return



def mkVPx(g_output, g_input, g_width, g_height,
          g_framerate, g_bitrate, g_gop, g_rawBSFile, codec):

    extraceBitSreamVPx(g_input, g_width, g_height,
                       g_framerate, g_bitrate, g_gop, g_rawBSFile, codec)

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
            g_rawBSFile = value
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
        #g_rawBSFile = '.tmp.h264'
    elif g_format == 'vp8':
        g_suffix = '.vp8'
        #g_rawBSFile = '640x480-framerate30-bitrate1000k.mkv'
    elif g_format == 'vp9':
        g_suffix = '.vp9'
        #g_rawBSFile = '640x480-framerate30-bitrate1000k.mkv'
    elif g_format == 'h265':
        g_suffix = '.h265'
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
        mkH26x(g_output, g_input, g_width, g_height, g_framerate, g_bitrate,
               g_gop, g_rawBSFile,'h264')
    elif g_format == 'h265':
        mkH26x(g_output, g_input, g_width, g_height, g_framerate, g_bitrate,
               g_gop, g_rawBSFile,'h265')
    elif g_format == 'vp8':
        mkVPx(g_output, g_input, g_width, g_height,
              g_framerate, g_bitrate, g_gop, g_rawBSFile, 'vp8')
    elif g_format == 'vp9':
        mkVPx(g_output, g_input, g_width, g_height,
              g_framerate, g_bitrate, g_gop, g_rawBSFile, 'vp9')

    print "Generate Done: " + g_rawBSFile


if __name__ == '__main__':
    main(sys.argv)
