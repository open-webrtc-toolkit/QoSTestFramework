import os
import os.path
import subprocess as sp
'''
os.system("rm send.yuv 1>/dev/null")
os.system("rm rec.yuv 1>/dev/null")
os.system("ffmpeg -i ../native/output/receive/%d.tiff -s 1280x720 -pix_fmt yuv420p rec.yuv 1>/dev/null")
os.system("ffmpeg -i ../native/output/send/%d.tiff -s 1280x720 -pix_fmt yuv420p send.yuv 1>/dev/null")
'''
'''
p = sp.call('rm python/send.yuv', shell=True, stdout=sp.PIPE, stderr=sp.STDOUT)
p = sp.call('rm python/rec.yuv', shell=True, stdout=sp.PIPE, stderr=sp.STDOUT)
p = sp.call('ffmpeg -i native/output/receive/%d.tiff -s 1280x720 -pix_fmt yuv420p python/rec.yuv', shell=True, stdout=sp.PIPE, stderr=sp.STDOUT)
p = sp.call('ffmpeg -i native/output/send/%d.tiff -s 1280x720 -pix_fmt yuv420p python/send.yuv', shell=True, stdout=sp.PIPE, stderr=sp.STDOUT)
'''

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

cmd_string = cmd + " " + fmt + " " + width + " " + height + " " + ref1 + " " + ref2 + " " + out
out = os.popen(cmd_string,"r")
output = out.readlines()
#out = sp.Popen([cmd], shell=False, stdout=sp.PIPE, stderr=sp.STDOUT, env=os.environ)
#output = out.communicate()

#print output


VMAF_score = []
f = open('../dataset/output/VMAF_score', 'w')
for frame in output:
    if frame[0:5] == "Frame":
        pos = frame.find("VMAF_score:")
        if pos != -1:
            print( frame[pos+11:].strip('\n'))
            f.write(frame[pos+11:].strip('\n'))
            f.write(',')
            VMAF_score.append(frame[pos+11:].strip('\n'))
f.close()

os.chdir(old_cwd)