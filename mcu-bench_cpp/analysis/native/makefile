all: iq_avi iq_yuv fps bitrate latency FLR
.PHONY:all

CC = g++

iq_avi:         imagequality_avi_dl.o
			$(CC) -g -o iq_avi imagequality_avi_dl.o `pkg-config opencv4 --libs`;

imagequality_avi_dl.o:  ./src/imagequality_avi_dl.cpp
			$(CC) -g -c ./src/imagequality_avi_dl.cpp -std=c++11 `pkg-config opencv4 --cflags`;

iq_yuv:         imagequality_yuv_dl.o
			$(CC) -g -o iq_yuv imagequality_yuv_dl.o `pkg-config opencv4 --libs`;

imagequality_yuv_dl.o:  ./src/imagequality_yuv_dl.cpp
			$(CC) -g -c ./src/imagequality_yuv_dl.cpp -std=c++11 `pkg-config opencv4 --cflags`;

convert:        convert.o
				$(CC) -o convert convert.o `pkg-config opencv4 --libs`;

convert.o:      ./src/convert.cpp
				$(CC) -c ./src/convert.cpp -std=c++11 `pkg-config opencv4 --cflags`;

fps:            fps.o
				$(CC) -o fps fps.o `pkg-config opencv4 --libs`;

fps.o:      ./src/fps.cpp
				$(CC) -c ./src/fps.cpp -std=c++11 `pkg-config opencv4 --cflags`;

bitrate:        bitrate.o
				$(CC) -o bitrate bitrate.o `pkg-config opencv4 --libs`;

bitrate.o:      ./src/bitrate.cpp
				$(CC) -c ./src/bitrate.cpp -std=c++11 `pkg-config opencv4 --cflags`;

saveImage:      saveImage.o
			$(CC) -o saveImage saveImage.o `pkg-config opencv4 --libs`;

saveImage.o:       ./src/saveImage.cpp
			$(CC) -c ./src/saveImage.cpp -std=c++11 `pkg-config opencv4 --cflags`;

latency:        latency.o
			$(CC) -o latency latency.o `pkg-config opencv4 --libs`;
latency.o:  ./src/latency.cpp
			$(CC) -c ./src/latency.cpp -std=c++11 `pkg-config opencv4 --cflags`;

FLR:            FLR.o
			$(CC) -o FLR FLR.o `pkg-config opencv4 --libs`;
FLR.o:          ./src/FLR.cpp
			$(CC) -c ./src/FLR.cpp -std=c++11 `pkg-config opencv4 --cflags`;

clean:
		rm -rf *.o  iq_avi iq_yuv convert saveImage latency FLR fps bitrate
