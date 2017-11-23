import subprocess
import os
if __name__ =='__main__':
    str_file = ''
    basePath = os.getcwd()
    FilePath = os.path.join(basePath,"native/video")
    for publishfile in os.listdir(FilePath):
        str_file = str_file+publishfile+","
    print str_file.strip(",")