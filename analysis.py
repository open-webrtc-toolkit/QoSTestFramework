import os
import subprocess
import cv2

# 计算视频时长
def compute_duration(fcount, fps):
    # 视频时长 = 帧数 / 帧率
    duration = fcount / fps
    return duration

# 计算卡顿率
def compute_freeze_rate(input_frame_num, output_frame_num):
    int_input_frame_num = int(input_frame_num)
    int_output_frame_num = int(output_frame_num)
    freeze_rate = -1
    # 卡顿率 = 重复帧数/原视频帧数 = (原视频帧数-丢弃重复帧后的帧数)/原视频帧数
    if int_input_frame_num != 0:
        freeze_rate = (int_input_frame_num - int_output_frame_num) / int_input_frame_num
    return freeze_rate

# 获取视频帧率fps
def cmd_grep_fps(input_file):
    # Windows下不要给grep的内容加单引号！单引号也会被作为查找的内容
    # 如果不加重定向2>&1，grep命令将得不到输入，整个命令返回的是ffmpeg取到的所有信息，而不是期望grep到的那一行
    _cmd = "ffmpeg -i " + input_file + " -hide_banner 2>&1 | grep fps"
    return _cmd

# 获取视频时长Duration
def cmd_grep_duration(input_file):
    _cmd = "ffmpeg -i " + input_file + " -hide_banner 2>&1 | grep Duration"
    return _cmd

# crop：将视频的(x,y,w,h)区域裁剪成新视频
# 例：ffmpeg -hide_banner -i new_2.mp4 -vf crop=w=694:h=362:x=3:y=257 -c:v libx264 -crf 17 -c:a copy -y temp.mp4 -an -f null - 2>&1
# ### ffmpeg 参数说明：
# -hide_banner：隐藏横幅，横幅是不带参数运行ffmpeg看到的提示信息
# -i input_file：指定输入文件
# -c:v libx264 -crf 17：使用libx264编码，固定码率因子crf为17。
#  注：crf是使用libx264或libx265编码时用于控制视频质量的参数，范围0-51，数值越大，质量越差。0为完全无损，18为视觉无损
# -c:a copy：将音频直接复制到输出的视频中
# -y：覆盖原输出文件
# -an：不输出音频
# -f null - 2>&1：设置输出格式，允许不产生输出文件，仅输出处理过程信息。设置该参数后，即使不指定输出文件，ffmpeg命令也能正常执行
def cmd_ff_vf_crop(input_file, output_file, w, h, x, y):
    # !!! 视频质量会影响卡顿检测结果，因此需要对其进行控制
    # !!! 如果不加'-c:v libx264 -crf 17'，输出视频的质量与编译ffmpeg时configure的参数有关(仅考虑libx264，不考虑libx265)：
    # 1. 如果configure时没有enable libx264，默认使用'-c:v mpeg4 -q:v 31'，输出视频质量较差
    #    注：使用mpeg4编码时，q:v范围为1-31，数值越大，质量越差
    # 2. 如果configure时enable libx264，默认使用'-c:v libx264 -crf 23'，输出视频质量尚可
    #    注：libx264与mpeg4相比，输出视频质量相同时，libx264的压缩率更高，但编码时间更长

    # quality = ' -c:v mpeg4 -q:v 1'
    quality = ' -c:v libx264 -crf 17'
    _cmd = 'ffmpeg -hide_banner -i ' + input_file \
           + ' -vf crop=' + 'w=' + str(w) + ':' + 'h=' + str(h) + ':' + 'x=' + str(x) + ':' + 'y=' + str(y) \
           + quality + ' -c:a copy' + ' -y ' + output_file + ' -an -f null - 2>&1'
    return _cmd

# mpdecimate：对整个视频区域进行卡顿检测
# 例：ffmpeg -hide_banner -i new_2.mp4 -vf mpdecimate=max=0:hi=768:lo=320:frac=0.33 -loglevel debug -an -f null - 2>&1
# ### ffmpeg 参数说明：
# -loglevel debug：输出debug日志，其中详细记录了视频处理过程
def cmd_ff_vf_mpdecimate(input_file, max_drop_count, hi, lo, frac):
    vf_cmd = 'mpdecimate'
    _cmd = 'ffmpeg -hide_banner -i ' + input_file \
           + ' -vf ' + vf_cmd + '=' \
           + 'max=' + max_drop_count + ':' + 'hi=' + hi + ':' + 'lo=' + lo + ':' + 'frac=' + frac \
           + ' -loglevel debug -an -f null - 2>&1'
    return _cmd

# mpdecimate_area：对(x,y,w,h)区域进行卡顿检测
# 例：ffmpeg -hide_banner -i new_2.mp4 -vf mpdecimate_area=max=0:hi=768:lo=320:frac=0.33:x=0:y=0:w=360:h=780 -loglevel debug -an -f null - 2>&1
def cmd_ff_vf_mpdecimate_area(input_file, max_drop_count, hi, lo, frac, x, y, w, h):
    vf_cmd = 'mpdecimate_area'
    _cmd = 'ffmpeg -hide_banner -i ' + input_file \
           + ' -vf ' + vf_cmd + '=' \
           + 'max=' + max_drop_count + ':' + 'hi=' + hi + ':' + 'lo=' + lo + ':' + 'frac=' + frac \
           + ':' + 'x=' + x + ':' + 'y=' + y + ':' + 'w=' + w + ':' + 'h=' + h \
           + ' -loglevel debug -an -f null - 2>&1'
    return _cmd

# 获取视频宽高（从cv2.VideoCapture中获取）
def get_frame_shape(input_file):
    cap = cv2.VideoCapture(input_file)
    width, height = 0, 0
    if cap.isOpened():
        width = cap.get(cv2.CAP_PROP_FRAME_WIDTH)   # 宽度
        height = cap.get(cv2.CAP_PROP_FRAME_HEIGHT)  # 高度
    return width, height

# 获取视频时长（从cv2.VideoCapture中获取）
def get_duration(input_file):
    cap = cv2.VideoCapture(input_file)
    duration, fps, fcount = 0, 0, 0
    if cap.isOpened():
        fps = cap.get(cv2.CAP_PROP_FPS)  # 每秒传输帧数
        fcount = cap.get(cv2.CAP_PROP_FRAME_COUNT)  # 总帧数
        duration = compute_duration(fcount, fps)    # 视频时长
    return duration, fps, fcount

# 获取视频时长（从ffmpeg的输出信息中获取）
def extract_duration(input_file):
    # _cmd = "ffmpeg -i " + input_file + " 2>&1 | grep Duration"
    _cmd = cmd_grep_duration(input_file)
    print(_cmd)
    _time = os.popen(_cmd).readlines()
    # 如果命令正常执行，grep到的结果应当只有一行
    # 例：Duration: 00:03:10.01, start: 0.000000, bitrate: 774 kb/s
    duration_sec = 0
    for _i in _time:
        _time_list = _i.split(",")[0].split(":")
        duration_sec = float(_time_list[3]) + float(_time_list[2]) * 60
        break
    return duration_sec

# 获取视频帧率和宽高
def extract_frame_rate(input_file):
    # _cmd = "ffmpeg -i " + input_file + " 2>&1 | grep fps"
    _cmd = cmd_grep_fps(input_file)
    print(_cmd)
    _frame_rate_line = os.popen(_cmd)
    _lines = _frame_rate_line.readlines()
    # 如果命令正常执行，grep到的结果应当只有一行
    # 例：Stream #0:0(eng): Video: h264 (High) (avc1 / 0x31637661), yuv420p, 720x1560 [SAR 1:1 DAR 6:13], 402 kb/s, 31.13 fps, 31.13 tbr, 3459500.00 tbn, 62.25 tbc (default)
    fps_value, width, height = 0, 0, 0
    for line_str in _lines:
        _items = line_str.split(",")
        for _item in _items:
            # 获取视频帧率（找fps所在的项）
            # ... 402 kb/s, 31.13 fps, 31.13 tbr, ...
            if 'fps' in _item:
                fps_value = _item.split("fps")[0].strip()
                print("fps_value is", fps_value)
            # 获取视频宽度，高度（找SAR所在的项）
            # ... yuv420p, 720x1560 [SAR 1:1 DAR 6:13], 402 kb/s, ...
            if 'SAR' in _item:
                (width, height) = _item.split(" ")[1].split("x")
        # 如果命令正常执行，则grep到的结果只有一行
        break
    return fps_value, width, height

# 获取视频帧率
def extract_fps_from_line(line_str):
    # 例：Stream #0:0(eng): Video: h264 (High) (avc1 / 0x31637661), yuv420p, 720x1560 [SAR 1:1 DAR 6:13], 692 kb/s, 37.81 fps, 37.81 tbr, 16345800.00 tbn, 75.62 tbc (default)
    if 'fps' in line_str and "Stream" in line_str:
        for _items in (line_str.split(",")):
            if 'fps' in _items:
                fps_value = _items.split("fps")[0]
                return fps_value
    return 0

# 获取输入视频帧数
def extract_input_frame_from_line(line_str):
    # 例：Input stream #0:0 (video): 7184 packets read (16456681 bytes); 7184 frames decoded;
    if 'Input stream' in line_str:
        for _items in (line_str.split(";")):
            if 'frame' in _items:
                _input_frame_num = (_items.split("frame"))[0]
                return _input_frame_num
    return 0

# 获取输出视频帧数
def extract_output_frame_from_line(line_str):
    # 例：Output stream #0:0 (video): 3123 frames encoded; 3123 packets muxed (1673928 bytes);
    if 'Output stream' in line_str:
        for _items in (line_str.split(":")):
            if 'frame' in _items:
                _output_frame_num = (_items.split("frame"))[0]
                return _output_frame_num
    return 0

# 过滤短时卡顿
def filter_short_freeze(freeze_threshold, freeze_length_list, freeze_list):
    # 卡顿时长小于freeze_threshold，不算卡顿
    short_freeze_frame_num = 0
    f_freeze_threshold = float(freeze_threshold)
    if f_freeze_threshold > 0:
        freeze_mark = 0     # 卡顿标志
        filter_mark = 0     # 过滤短时卡顿标志
        # 逆序遍历，一次卡顿在末尾取到最大时长，若该时长小于freeze_threshold，则这次卡顿的所有帧都不算卡顿
        for i in range(len(freeze_length_list)-1, -1, -1):
            if freeze_mark == 0 and freeze_list[i] == 1:
                freeze_mark = 1         # 一次卡顿开始(逆序)
                if freeze_length_list[i] < f_freeze_threshold:
                    filter_mark = 1             # 开始过滤短时卡顿
                    short_freeze_frame_num += 1
                    freeze_length_list[i] = 0   # 卡顿时长清0
                    freeze_list[i] = 0          # 卡顿标志清0
            elif freeze_mark == 1:
                if freeze_list[i] == 0:
                    freeze_mark = 0         # 一次卡顿结束(逆序)
                    filter_mark = 0         # 停止过滤短时卡顿
                # 继续过滤短时卡顿
                elif filter_mark == 1:
                    short_freeze_frame_num += 1
                    freeze_length_list[i] = 0   # 卡顿时长清0
                    freeze_list[i] = 0          # 卡顿标志清0
    # 返回过滤的短时卡顿帧数
    return short_freeze_frame_num

# 检测卡顿情况
# !!! 目前只能分析编码后的视频
def extract_freeze(input_file, max_drop_count, hi, lo, frac, freeze_threshold, output_file="",  x='0', y='0', w='0', h='0'):
    # mpdecimate：对整个视频区域进行卡顿检测
    # _cmd = cmd_ff_vf_mpdecimate(input_file, max_drop_count, hi, lo, frac)
    # mpdecimate_area：对(x,y,w,h)区域进行卡顿检测
    _cmd = cmd_ff_vf_mpdecimate_area(input_file, max_drop_count, hi, lo, frac, x, y, w, h)
    print(_cmd)
    output_str = _cmd + "\n"
    # 初始化
    _output_frame_num = 0
    _input_frame_num = 0
    _freeze_mark = 0
    _freeze_length = 0
    _drop_count = 0
    _pts_time = 0
    _last_freeze_pts_time = 0.0
    freeze_length_list = []
    freeze_list = []
    drop_list = []

    print("### freeze analysis start......")
    p = subprocess.Popen(_cmd, shell=True,
                         stdout=subprocess.PIPE,
                         bufsize=-1)
    result, err = p.communicate()
    for line_bytes in result.splitlines():
        # line_str = line.decode("gbk", "ignore") # 汉字编码错误
        line_str = line_bytes.decode("utf-8", "ignore")
        if line_str[0] != '[':   # 视频处理细节信息不输出到文件
            output_str += line_str + "\n"
        # 获取丢弃帧数drop_count和帧显示时间pts_time，记录卡顿情况
        # 例：[Parsed_mpdecimate_area_0 @ 0000019cb2f5ee40] lo:0<348 lo:0<87 lo:0<87 drop pts:499349235 pts_time:30.5491 drop_count:1
        # drop_count为正，表示该帧重复，应当丢弃。若连续n帧重复，则重复的第n帧drop_count=n
        # drop_count为负，表示该帧不重复，不丢弃。若连续n帧不重复，则不重复的第n帧drop_count=-n
        # pts_time是播放时显示某一帧的时刻。 drop_count连续为正，即出现卡顿，用pts_time作差，即可求出卡顿时长
        if 'drop_count' in line_str and 'pts_time' in line_str:
            # 获取drop_count和pts_time
            for _items in (line_str.split(" ")):
                if 'drop_count' in _items:
                    _drop_count = _items.split(":")[1]
                if 'pts_time' in _items:
                    _pts_time = _items.split(":")[1]
            # drop_count为正，表示该帧重复，即出现卡顿
            if int(_drop_count) > 0:
                # 记录卡顿时长
                _freeze_length = float(_pts_time) - float(_last_freeze_pts_time)
                freeze_length_list.append(_freeze_length)
                freeze_list.append(1)   # 1表示卡顿
                # 卡顿开始
                if _freeze_mark == 0:
                    _freeze_mark = 1    # 卡顿标志置1
                    drop_list.append("start:" + _pts_time)  # 记录此次卡顿的开始时间
                    # 卡顿开始时，更新last_freeze_pts_time，一次卡顿过程中，last_freeze_pts_time保持不变
                    _last_freeze_pts_time = _pts_time
            # drop_count为负，表示该帧不重复，即没有卡顿
            if int(_drop_count) < 0:
                # 卡顿结束
                if _freeze_mark == 1:
                    _freeze_mark = 0    # 卡顿标志清0
                    drop_list.append("end:" + _pts_time)    # 记录此次卡顿的结束时间
                # 记录卡顿时长：未卡顿。时长为0
                freeze_length_list.append(0)
                freeze_list.append(0)   # 0表示未卡顿
                # 未卡顿时，last_freeze_pts_time与pts_time保持一致；发生卡顿时，pts_time-last_freeze_pts_time即可得到卡顿时长
                _last_freeze_pts_time = _pts_time

        # 获取输入视频帧数
        if _input_frame_num == 0:
            _input_frame_num = extract_input_frame_from_line(line_str)
        # 获取输出视频帧数
        if _output_frame_num == 0:
            _output_frame_num = extract_output_frame_from_line(line_str)

    # 过滤短时卡顿：卡顿时长小于freeze_threshold，不算卡顿
    short_freeze_frame_num = filter_short_freeze(freeze_threshold, freeze_length_list, freeze_list)
    # 从字符串中提取的frame_num本身是str，需要转换成数字
    _input_frame_num = int(_input_frame_num)
    _output_frame_num = int(_output_frame_num)
    _output_frame_num += short_freeze_frame_num     # 补上卡顿时长短不算卡顿的帧数

    # 计算卡顿率
    freeze_rate = compute_freeze_rate(_input_frame_num, _output_frame_num)
    temp_str = ("input_frame_num is %s\n""output_frame_num is %s\n""short_freeze_frame_num is %s\n"
                "freeze_threshold is %s s\n""freeze_rate is %s\n""freeze_list is %s\n"
                % (str(_input_frame_num), str(_output_frame_num), str(short_freeze_frame_num),
                   str(freeze_threshold), str(freeze_rate), str(freeze_list)))
    print(temp_str)
    output_str += temp_str + "\n"
    # 卡顿分析结果输出到文件
    if output_file != "":
        print("output_file is ", output_file)
        fp = open(output_file, "w")
        fp.write(output_str)
        fp.close()

    print("### freeze analysis completed!!!")
    # 输入视频帧数，输出视频帧数，卡顿列表，卡顿时长列表，丢帧列表
    return _input_frame_num, _output_frame_num, freeze_list, freeze_length_list, drop_list

# 裁剪视频(x,y,w,h)
def crop(input_file, width, height, x, y, output_file):
    # crop：将视频的(x,y,w,h)区域裁剪成新视频
    _cmd = cmd_ff_vf_crop(input_file, output_file, width, height, x, y)
    print(_cmd)
    print('### crop start......')
    p = subprocess.Popen(_cmd, shell=True,
                        stdout=subprocess.PIPE,
                        bufsize=-1)
    result, err = p.communicate()
    for line_bytes in result.splitlines():
        line_str = line_bytes.decode("utf-8", "ignore")
        # 例：frame= 7184 fps=397 q=-1.0 Lq=-0.0 size=   25597kB time=00:03:10.01 bitrate=1103.6kbits/s speed=10.5x
        if "frame" == line_str[0:5]:
            print(line_str)
    print("### crop completed!!!")
    return
