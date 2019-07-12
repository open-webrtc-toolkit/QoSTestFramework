##!/usr/bin/env bash
# Copyright (C) <2019> Intel Corporation
#
# SPDX-License-Identifier: Apache-2.0

this=$(pwd)

DOWNLOAD_DIR="${this}/ffmpeg"
SUDO=""
if [[ $EUID -ne 0 ]]; then
   SUDO="sudo -E"
fi

detect_OS() {
  lsb_release >/dev/null 2>/dev/null
  if [ $? = 0 ]
  then
    lsb_release -ds | sed 's/^\"//g;s/\"$//g'
  # a bunch of fallbacks if no lsb_release is available
  # first trying /etc/os-release which is provided by systemd
  elif [ -f /etc/os-release ]
  then
    source /etc/os-release
    if [ -n "${PRETTY_NAME}" ]
    then
      printf "${PRETTY_NAME}\n"
    else
      printf "${NAME}"
      [[ -n "${VERSION}" ]] && printf " ${VERSION}"
      printf "\n"
    fi
  # now looking at distro-specific files
  elif [ -f /etc/arch-release ]
  then
    printf "Arch Linux\n"
  elif [ -f /etc/gentoo-release ]
  then
    cat /etc/gentoo-release
  elif [ -f /etc/fedora-release ]
  then
    cat /etc/fedora-release
  elif [ -f /etc/redhat-release ]
  then
    cat /etc/redhat-release
  elif [ -f /etc/debian_version ]
  then
    printf "Debian GNU/Linux " ; cat /etc/debian_version
  else
    printf "Unknown\n"
  fi
}

install_build_deps() {
  local OS=$(detect_OS | awk '{print tolower($0)}')
  echo $OS

  if [[ "$OS" =~ .*centos.* ]]
  then
    echo -e "\x1b[32mInstalling dependent components and libraries via yum...\x1b[0m"
    ${SUDO} yum install gcc gcc-c++ nasm yasm -devel -y
  elif [[ "$OS" =~ .*ubuntu.* ]]
  then
    echo -e "\x1b[32mInstalling dependent components and libraries via apt-get...\x1b[0m"
    ${SUDO} apt-get update
    ${SUDO} apt-get install make gcc g++ nasm yasm -y
  else
    echo -e "\x1b[32mUnsupported platform...\x1b[0m"
  fi
}

install_ffmpeg(){
  local VERSION="4.1.3"
  local DIR="ffmpeg-${VERSION}"
  local SRC="${DIR}.tar.bz2"
  local SRC_URL="http://ffmpeg.org/releases/${SRC}"
  local SRC_MD5SUM="9985185a8de3678e5b55b1c63276f8b5"

  echo "Downloading ffmpeg-${VERSION}"
  [[ ! -s ${SRC} ]] && wget -c ${SRC_URL}
  if ! (echo "${SRC_MD5SUM} ${SRC}" | md5sum --check) ; then
      echo "Downloaded file ${SRC} is corrupted."
      rm -v ${SRC}
      return 1
  fi
  rm -fr ${DIR}
  tar xf ${SRC}

  echo "Building ffmpeg-${VERSION}"
  pushd ${DIR}
  PKG_CONFIG_PATH=${DOWNLOAD_DIR}/lib/pkgconfig CFLAGS=-fPIC ./configure --prefix=${DOWNLOAD_DIR} --enable-shared --disable-static --disable-opencl --disable-vaapi --enable-gpl --enable-libvpx --enable-libx264 && \
  make -j4 -s V=0 && make install
  popd
}

echo "Install building dependencies..."
install_build_deps

[[ ! -d ${DOWNLOAD_DIR} ]] && mkdir ${DOWNLOAD_DIR};

pushd ${DOWNLOAD_DIR}
install_ffmpeg
popd

echo "Compiling finish."
echo "Downloaded source dir: ${DOWNLOAD_DIR}"

