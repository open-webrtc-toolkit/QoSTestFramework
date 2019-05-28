#
# Copyright © 2019 Intel Corporation. All Rights Reserved.
#
# Redistribution and use in source and binary forms, with or without
# modification, are permitted provided that the following conditions are met:
#
# 1. Redistributions of source code must retain the above copyright notice,
#    this list of conditions and the following disclaimer.
# 2. Redistributions in binary form must reproduce the above copyright notice,
#    this list of conditions and the following disclaimer in the documentation
#    and/or other materials provided with the distribution.
# 3. The name of the author may not be used to endorse or promote products
#    derived from this software without specific prior written permission.
#
# THIS SOFTWARE IS PROVIDED BY THE AUTHOR "AS IS" AND ANY EXPRESS OR IMPLIED
# WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF
# MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO
# EVENT SHALL THE AUTHOR BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
# SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO,
# PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS;
# OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY,
# WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR
# OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF
# ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
#
# runQosClient.py : implementation file
#

import os
import json
import logging
import time
from multiprocessing import Process, Queue
import argparse
import sys
import shutil
import setproctitle
import subprocess
import threading
import copy
import collections


class QosStartParam(object):
    def __init__(self):
        logging.debug('')
        self.server = ''
        self.room_id = ''
        self.codec = ''
        self.resolution = ''
        self.fps = 0
        self.pub_and_sub_flag = ''
        self.mode = ''
        self.video_file = ''
        self.bitrate = 1
        self.runTime = 0
        self.encoded = 0
        self.libs_path = ''
        self.log = ''


def get_debug_level(level):
    return {
        'critical': logging.CRITICAL,
        'error': logging.ERROR,
        'warning': logging.WARNING,
        'info': logging.INFO,
        'debug': logging.DEBUG,
        'notset': logging.NOTSET
    }.get(level, logging.ERROR)


def clean_env():
    logging.debug('')
    kill_process_by_name("owt_conf_sample")


def get_process_id(name):
    logging.debug('')
    child = subprocess.Popen(["pgrep", "-f", name],
                             stdout=subprocess.PIPE, shell=False)
    response = child.communicate()[0]
    return response


def run_cmd(cmd, log=None, timeout=None):
    logging.debug('')
    p = None
    p = subprocess.Popen(cmd, stdout=subprocess.PIPE,
                         stderr=subprocess.PIPE, shell=True)
    my_timer = None
    if timeout:
        my_timer = Timer(timeout, timeout_callback, [p])
        my_timer.start()
    logging.debug('pid is:' + str(p.pid))
    try:
        logging.debug(cmd)
        (out, err) = p.communicate()
        if not str(err).strip():
            logging.debug('err:\n' + str(err))
    finally:
        if timeout:
            my_timer.cancel()


def kill_process_by_name(name):
    logging.debug('')
    p = get_process_id(name)
    if p:
        logging.debug(p)
        pids = str(p).split('\n')
        for pid in pids:
            run_cmd(r"kill -9 " + pid)


def timeout_callback(p):
    logging.debug('exe time out call back')
    try:
        p.kill()
        clean_env()
    except Exception as error:
        logging.error(error)


def run_qos_client(param):
    logging.debug('')
    cmd = 'export LD_LIBRARY_PATH=%s:$LD_LIBRARY_PATH;./owt_conf_sample %s %s %s %s %s %s %s %s %s %s' % (
        param.libs_path,
        param.server,
        param.room_id,
        param.codec,
        param.resolution,
        param.fps,
        param.pub_and_sub_flag,
        param.video_file,
        param.bitrate,
        param.runTime,
        param.encoded)
    run_cmd(cmd)


if __name__ == '__main__':
    os.chdir(os.path.abspath(os.path.dirname(sys.argv[0])))
    file_path = os.path.abspath(os.path.dirname(__file__))
    conf_path = os.path.join(file_path, 'config.json')
    conf = json.loads(open(conf_path, 'r').read())
    log_format = '%(filename)s[%(lineno)d][%(levelname)s][%(funcName)s]:%(message)s'
    log_level = get_debug_level(conf.get('logLevel', None))
    if conf.get('logToFile', False):
        logging.basicConfig(level=log_level, filename=conf.get(
            'logFile', 'runQosClient.log'), filemode='w', format=log_format)
    else:
        logging.basicConfig(level=log_level, format=log_format)
    logging.debug('')
    parser = argparse.ArgumentParser(
        description='Run qos automation test framework')
    parser.add_argument('--name', dest='name', default='qosTest',
                        required=False,
                        help='Reset current process name of runQosCleint.py(default: qosTest')
    args = parser.parse_args()
    setproctitle.setproctitle(args.name)
    clean_env()
    logging.debug(conf)
    param = QosStartParam()
    param.server = conf.get('server', '')
    param.codec = conf.get('codec', '')
    param.resolution = conf.get('resolution', '')
    param.fps = conf.get('fps', '')
    param.pub_and_sub_flag = conf.get('pubAndSubFlag', '')
    param.bitrate = conf.get('bitrate', '')
    param.runTime = conf.get('runTime', '')
    param.encoded = conf.get('encoded', '')
    param.libs_path = conf.get('libsPath', '')
    user_cnt = conf.get('userCnt', '')
    room_id = conf.get('roomId', '')
    video_file = conf.get('videoFile', '')
    param.video_file = video_file
    param.room_id = room_id
    param.log = 'log.txt'
    thread = threading.Thread(target=run_qos_client, args=[param])
    thread.daemon = True
    thread.start()
    thread.join()
