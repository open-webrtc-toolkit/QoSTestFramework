import os
import os.path
import subprocess as sp


old_cwd = os.getcwd()
targ_cwd = os.path.dirname(os.path.abspath(__file__))
os.chdir(targ_cwd)

cmd = "./vmaf/run_vmaf"
ref1 = "../dataset/output/send.yuv"
ref2 = "../dataset/output/rec.yuv"
fmt = "yuv420p"
width = "540"
height = "360"
out = "--out-fmt.json"

cmd_out = sp.run([cmd, fmt, width, height, ref1, ref2, out], text=True).stdout
output = cmd_out.splitlines()

VMAF_score = []
f = open('../dataset/output/VMAF_score', 'w')
for frame in output:
    if frame[0:5] == "Frame":
        pos = frame.find("VMAF_score:")
        if pos != -1:
            print(frame[pos+11:].strip('\n'))
            f.write(frame[pos+11:].strip('\n'))
            f.write(',')
            VMAF_score.append(frame[pos+11:].strip('\n'))
f.close()

os.chdir(old_cwd)
