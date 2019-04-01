all: iq_avi iq_yuv convert fps bitrate saveImage latency FLR
.PHONY:all

CC = g++

iq_avi:         imagequality_avi_dl.o
			$(CC) -g -o iq_avi imagequality_avi_dl.o `pkg-config opencv --cflags --libs`;

imagequality_avi_dl.o:  ./src/imagequality_avi_dl.cpp
			$(CC) -g -c ./src/imagequality_avi_dl.cpp

iq_yuv:         imagequality_yuv_dl.o
			$(CC) -g -o iq_yuv imagequality_yuv_dl.o `pkg-config opencv --cflags --libs`;

imagequality_yuv_dl.o:  ./src/imagequality_yuv_dl.cpp
			$(CC) -g -c ./src/imagequality_yuv_dl.cpp

convert:        convert.o
				$(CC) -o convert convert.o `pkg-config opencv --cflags --libs`;

convert.o:      ./src/convert.cpp
				$(CC) -c ./src/convert.cpp

fps:            fps.o
				$(CC) -o fps fps.o `pkg-config opencv --cflags --libs`;

fps.o:      ./src/fps.cpp
				$(CC) -c ./src/fps.cpp

bitrate:        bitrate.o
				$(CC) -o bitrate bitrate.o `pkg-config opencv --cflags --libs`;

bitrate.o:      ./src/bitrate.cpp
				$(CC) -c ./src/bitrate.cpp

saveImage:      saveImage.o
			$(CC) -o saveImage saveImage.o `pkg-config opencv --cflags --libs`;

saveImage.o:       ./src/saveImage.cpp
			$(CC) -c ./src/saveImage.cpp

latency:        latency.o
			$(CC) -o latency latency.o `pkg-config opencv --cflags --libs`;
latency.o:  ./src/latency.cpp
			$(CC) -c ./src/latency.cpp

FLR:            FLR.o
			$(CC) -o FLR FLR.o `pkg-config opencv --cflags --libs`;
FLR.o:          ./src/FLR.cpp
			$(CC) -c ./src/FLR.cpp

clean:
		rm -rf *.o  iq_avi iq_yuv convert saveImage latency FLR fps bitrate
