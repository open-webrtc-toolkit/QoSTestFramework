#!/bin/bash

rundir=$(pwd)
workdir=$(cd $(dirname $0);cd ../; pwd)
cd $workdir
if [ ! -d "out" ];then
  mkdir out
fi
if [ ! -d "build" ];then
  mkdir build
  cd build
  cmake ../
else
  cd build
  make clean
fi
make
cp -fr $workdir/out/owt_conf_sample $workdir/scripts/
cd $rundir
