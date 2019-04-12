all: tag
.PHONY:all

CC = g++

tag:            tag.o
				$(CC) -o tag tag.o `pkg-config opencv4 --libs`;

tag.o:          ./src/tag.cpp
			$(CC) -c ./src/tag.cpp -std=c++11 `pkg-config opencv4 --cflags`;

clean:
		rm -rf *.o  tag
