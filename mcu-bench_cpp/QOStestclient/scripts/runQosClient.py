# Copyright (C) <2019> Intel Corporation
#
# SPDX-License-Identifier: Apache-2.0
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
        self.address = ''
        self.room_id = ''
        self.codec = ''
        self.width = ''
        self.height = ''
        self.fps = 0
        self.publish = False
        self.subscribe = False
        self.video_file = ''
        self.bitrate = 1
        self.timeout = 0
        self.encode = False
        self.data_dir = ''
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
    cmd = 'export LD_LIBRARY_PATH=%s:$LD_LIBRARY_PATH;./owt_conf_sample -a=%s -r=%s -c=%s -w=%s -h=%s -f=%s -v=%s -b=%s -t=%s -d=%s' % (
        param.libs_path,
        param.address,
        param.room_id,
        param.codec,
        param.width,
        param.height,
        param.fps,
        param.video_file,
        param.bitrate,
        param.timeout,
        param.data_dir)
    if param.publish:
        cmd += " -p"
    if param.subscribe:
        cmd += " -s"
    if param.encode:
        cmd += " -e"
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
    param.address = conf.get('address', '')
    param.codec = conf.get('codec', '')
    param.width = conf.get('width', '')
    param.height = conf.get('height', '')
    param.fps = conf.get('fps', '')
    param.publish = conf.get('publish', False)
    param.subscribe = conf.get('subscribe', False)
    param.bitrate = conf.get('bitrate', '')
    param.timeout = conf.get('timeout', '')
    param.encode = conf.get('encode', False)
    param.libs_path = conf.get('libsPath', '')
    param.room_id = conf.get('roomId', '')
    param.video_file = conf.get('videoFile', '')
    param.data_dir = conf.get('dataDir', '')
    param.log = 'log.txt'
    thread = threading.Thread(target=run_qos_client, args=[param])
    thread.daemon = True
    thread.start()
    thread.join()
