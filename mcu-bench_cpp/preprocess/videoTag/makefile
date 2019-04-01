all: tag
.PHONY:all

CC = g++

tag:            tag.o
				$(CC) -o tag tag.o `pkg-config opencv --cflags --libs`;

tag.o:          ./src/tag.cpp
			$(CC) -c ./src/tag.cpp

clean:
		rm -rf *.o  tag
