import numpy, pylab
with open('send_no_silence_16_voice.pcm', 'wb') as f2:
    for y in range(26):
        with open('far16_stereo_no_silence.pcm', 'rb') as f1:
           print y
           f2.write(f1.read())
           f1.close()

data2 = numpy.memmap("send_no_silence_16_voice.pcm",dtype="h",mode="r")
print data2
pylab.plot(data2)
pylab.show()
f2.close()
