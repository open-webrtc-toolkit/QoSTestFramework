all: iq_yuv fps bitrate latency FLR gen_rec gen_send
.PHONY:all

CC = g++

iq_yuv:         imagequality_yuv_dl.o
			$(CC) -g -o iq_yuv imagequality_yuv_dl.o `pkg-config opencv --cflags --libs`;

imagequality_yuv_dl.o:  ./src/imagequality_yuv_dl.cpp
			$(CC) -g -c ./src/imagequality_yuv_dl.cpp

fps:            fps.o
				$(CC) -o fps fps.o `pkg-config opencv --cflags --libs`;

fps.o:      ./src/fps.cpp
				$(CC) -c ./src/fps.cpp

bitrate:        bitrate.o
				$(CC) -o bitrate bitrate.o `pkg-config opencv --cflags --libs`;

bitrate.o:      ./src/bitrate.cpp
				$(CC) -c ./src/bitrate.cpp

latency:        latency.o
				$(CC) -o latency latency.o `pkg-config opencv --cflags --libs`;
latency.o:  ./src/latency.cpp
				$(CC) -c ./src/latency.cpp

FLR:            FLR.o
				$(CC) -o FLR FLR.o `pkg-config opencv --cflags --libs`;
FLR.o:          ./src/FLR.cpp
				$(CC) -c ./src/FLR.cpp
gen_rec: generate_recieved_yuv.o
				$(CC) -g -o gen_rec generate_recieved_yuv.o `pkg-config opencv4 --libs`;

generate_recieved_yuv.o: ./src/generate_recieved_yuv.cpp
				$(CC) -g -c ./src/generate_recieved_yuv.cpp -std=c++11 `pkg-config opencv4 --cflags`;

gen_send: generate_send_yuv.o
				$(CC) -g -o gen_send generate_send_yuv.o `pkg-config opencv4 --libs`;

generate_send_yuv.o: ./src/generate_send_yuv.cpp
				$(CC) -g -c ./src/generate_send_yuv.cpp -std=c++11 `pkg-config opencv4 --cflags`;


clean:
		rm -rf *.o  iq_yuv latency FLR fps bitrate gen_rec gen_send
