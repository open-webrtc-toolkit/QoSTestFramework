#!/bin/bash

# this will download the opencv repository and the contributes
# compile and install to the os
# only use in Ubuntu 16.04

# install the essential library
sudo apt-get install build-essential
sudo apt-get install cmake git libgtk2.0-dev pkg-config libavcodec-dev libavformat-dev libswscale-dev
sudo apt-get install python-dev python-numpy libtbb2 libtbb-dev libjpeg-dev libpng-dev libtiff-dev  libdc1394-22-dev libjasper-dev

# checkout the opencv repository and contribute
mkdir -p opencv-build
cd opencv-build
git clone https://github.com/opencv/opencv.git
git clone https://github.com/opencv/opencv_contrib.git

# make the build dir
cd opencv
mkdir build
cd build

# configure
cmake -D CMAKE_BUILD_TYPE=Release \
-D CMAKE_INSTALL_PREFIX=/usr/local \
-D OPENCV_GENERATE_PKGCONFIG=ON \
-D OPENCV_EXTRA_MODULES_PATH=../../opencv_contrib/modules \
..

# build
make -j7

# install
sudo make install
