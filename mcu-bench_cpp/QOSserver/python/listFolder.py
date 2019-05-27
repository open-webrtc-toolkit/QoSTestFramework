# Copyright (C) <2018> Intel Corporation
#
# SPDX-License-Identifier: Apache-2.0
import os
from itertools import islice
import sys
import getopt
import time
import subprocess
import re
import os
'''
this python scripts is used for read result folder
'''
folder = '../analysis/dataset/output'
level = 0
try:
    opts, args = getopt.getopt(sys.argv[1:], "h:f:l:", ["help", "folder=", "level="])
except getopt.GetoptError:
    print('error : listFolder.py -f <folder> -l <level>')
    sys.exit(2)
for opt, arg in opts:
    if opt in ("-h", "--help"):
        print('listFolder.py -f <folder> -l <level> \n')
    elif opt == '-f':
        folder = arg
    elif opt == '-l':
        level = int(arg)
    else:
        assert False, "unhandled option"

for dirname, dirnames, filenames in os.walk(folder):
    # print path to all subdirectories first.
    if dirname.count(os.sep) - folder.count(os.sep) == level:
        for subdirname in dirnames:
            print(os.path.join(dirname, subdirname))

    # Advanced usage:
    # editing the 'dirnames' list will stop os.walk() from recursing into there.
    if '.git' in dirnames:
        # don't go into any .git directories.
        dirnames.remove('.git')
