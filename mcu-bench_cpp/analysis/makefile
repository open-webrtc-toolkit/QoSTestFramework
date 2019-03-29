all: iq_avi iq_yuv tag convert fps bitrate saveImage latency FLR imagequality_yuv_android fps_android bitrate_android FLR_android latency_android
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

tag:            tag.o
				$(CC) -o tag tag.o `pkg-config opencv --cflags --libs`;

tag.o:          ./src/tag.cpp
			$(CC) -c ./src/tag.cpp

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

imagequality_yuv_android:       imagequality_yuv_android.o
			$(CC) -o imagequality_yuv_android imagequality_yuv_android.o `pkg-config opencv --cflags --libs`;
imagequality_yuv_android.o: ./src/imagequality_yuv_android.cpp
			$(CC) -c ./src/imagequality_yuv_android.cpp
fps_android:            fps_android.o
				$(CC) -o fps_android fps_android.o `pkg-config opencv --cflags --libs`;

fps_android.o:          ./src/fps_android.cpp
				$(CC) -c ./src/fps_android.cpp

bitrate_android:            bitrate_android.o
				$(CC) -o bitrate_android bitrate_android.o `pkg-config opencv --cflags --libs`;

bitrate_android.o:          ./src/bitrate_android.cpp
				$(CC) -c ./src/bitrate_android.cpp

FLR_android:            FLR_android.o
			$(CC) -o FLR_android FLR_android.o `pkg-config opencv --cflags --libs`;
FLR_android.o:          ./src/FLR_android.cpp
			$(CC) -c ./src/FLR_android.cpp

latency_android:        latency_android.o
			$(CC) -o latency_android latency_android.o `pkg-config opencv --cflags --libs`;
latency_android.o:  ./src/latency_android.cpp
			$(CC) -c ./src/latency_android.cpp

clean:
		rm -rf *.o  iq_avi iq_yuv tag convert saveImage latency FLR fps bitrate imagequality_yuv_android fps_android bitrate_android FLR_android latency_android
