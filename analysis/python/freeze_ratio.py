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
import subprocess
old_cwd = os.getcwd()
targ_cwd = os.path.dirname(os.path.abspath(__file__))


def print_usage():
    print("")
    print("  Usage: " + sys.argv[0] + ' test.mp4')
    print("      -m")
    print("          specify max_drop_cout, default is 0")
    print("      -h")
    print("          specify hi, default is 768")
    print("      -l")
    print("          specify lo, default is 320")
    print("      -f")
    print("          specify frac, default is 0.3330000")
    print("      -e")
    print("          specify freeze threshold length")
    print("")
    print("  Sample: ")
    print("")
    print("          " + sys.argv[0] + ' -m 0 -h 768 -l 320 -f 0.1 test.mp4')
    print("")
    sys.exit(1)


def extrace_frame_rate(input_file):
    _cmd = "ffmpeg -i " + input_file + " 2>&1 | grep 'fps'"
    print(_cmd)
    _frame_rate_line = os.popen(_cmd)
    _lines = _frame_rate_line.readlines()
    for _i in _lines:
        for _sub_items in (_i.split(",")):
            if 'fps' in _sub_items:
                fps_value = _sub_items.split("fps")[0]
                print("fps_value is", fps_value)
    return fps_value


def extrace_freeze(input_file, max_drop_count, hi, lo, frac, freeze_threshold):
  # Only support encoded video analysis currently
    _cmd = 'ffmpeg -i ' + input_file \
        + ' -vf mpdecimate=' + max_drop_count + ':' + hi + ':' + lo + ':' + frac \
        + ' -loglevel debug -an -f null - 2>&1'
    print(_cmd)
    _output = os.popen(_cmd)
    _output_frame_num = 0
    _input_frame_num = 0
    _mark = 0
    _freeze_mark = 0
    _freeze_length = 0
    freeze_length_list = []
    freeze_list = []
    _fps_value = 0
    _inital_frame_time = 0
    _last_freeze_time_stamp = 0.0
    _lines = _output.readlines()
    frame_num = 0
    for _i in _lines:
        if 'fps' in _i and "Stream" in _i:
            for _sub_items in (_i.split(",")):

                if 'fps' in _sub_items:
                    _fps_value = _sub_items.split("fps")[0]
        if 'drop_count' in _i and 'pts_time' in _i:
            frame_num += 1
            for _sub_items in (_i.split(" ")):
                if 'drop_count' in _sub_items:
                    _value = _sub_items.split(":")[1]
                if 'pts_time' in _sub_items:
                    _time_stamp = _sub_items.split(":")[1]
            if int(_value) > 0:
                freeze_list.append(1)
                if(_freeze_mark == 0):
                    _freeze_mark = 1
                    _freeze_length = float(
                        _time_stamp)-float(_last_freeze_time_stamp)
                    freeze_length_list.append(_freeze_length)
                    _last_freeze_time_stamp = _time_stamp
                else:
                    _freeze_length = float(
                        _time_stamp)-float(_last_freeze_time_stamp)

                    freeze_length_list.append(_freeze_length)

            if int(_value) < 0:
                _mark += 1
                _freeze_mark = 0
                _last_freeze_time_stamp = _time_stamp
                freeze_length_list.append(0)
                freeze_list.append(0)
                if (_mark == 2):

                    for _items in (_i.split(" ")):
                        if 'pts_time' in _items:
                            _inital_frame_time = _items.split(":")[-1]

        if 'Input stream' in _i:
            for _items in (_i.split(";")):
                if 'frame' in _items:
                    _input_frame_num = (_items.split("frame"))[0]

        if 'Output stream' in _i:
            for _items in (_i.split(":")):
                if 'frame' in _items:
                    _output_frame_num = (_items.split("frame"))[0]

    freeze_rate = (float(_input_frame_num) -
                   float(_output_frame_num))/float(_input_frame_num)

    #print ("fps_value is ", _fps_value)
    #print ("inital_frame_time",_inital_frame_time)
    #print ("total freeze_rate is ", freeze_rate)
    #print ("freeze_list is ", freeze_list)

    return _fps_value, _inital_frame_time, freeze_list, freeze_length_list


def main(argv):
    try:
        options, arguments = getopt.getopt(sys.argv[1:], "m:h:l:f:e:", [
                                           "hi=", "lo=", "frac=", "len="])
    except getopt.GetoptError, error:
        print_usage()
    g_input = "test.mp4"
    max_drop_count = '0'
    hi = '768'
    lo = '320'
    frac = '0.33000'
    freeze_threshold = '1'
    path = os.path.dirname(os.path.abspath(__file__))
    list = []

    if len(arguments) == 0:
        print_usage()
    g_input = arguments[0]
    for option, value in options:
        if option == "-m":
            max_drop_count = value
        elif option in ("-h", "--hi"):
            hi = value
        elif option in ("-l", "--lo"):
            lo = value
        elif option in ("-f", "--frac"):
            frac = value
        elif option in ("-e", "--len"):
            freeze_threshold = value
        else:
            print_usage()

    if not os.path.exists(g_input):
        print '*' * 10
        print 'Error:', 'Input dose not existed, ', os.path.abspath(g_input)
        print '*' * 10
        sys.exit(1)

    # extrace_frame_rate(g_input)
    g_input.startswith("f")

    g_fps_value, g_inital_frame_time, g_freeze_list, g_freeze_length_list = extrace_freeze(
        g_input, max_drop_count, hi, lo, frac, freeze_threshold)
    os.chdir(targ_cwd)
    freeze_result = open("../dataset/output/freeze_result.txt", "w")
    freeze_ratio_result = open("../dataset/output/freeze_ratio.txt", "w")
    freeze_result.write(",".join(str(x) for x in g_freeze_list))
    freeze_ratio_result.write(",".join(str(x) for x in g_freeze_length_list))
    freeze_result.close()
    freeze_ratio_result.close()


if __name__ == '__main__':
    main(sys.argv)
