# QoS Framework
## Introduction
QOS Framework is a test framework help you anlysis real-time video/audio quality. Major components are included QoS Server, Preprocess module, Analysis module and Video transmission adapter module. It can also combined with IATF( Interactive API Test Framework) module to handle cross-platform and multi-device API test automation. Please following to install it.

## Architecture
The following figure shows the architecture of this framework.
![Architecture of QoS Framework](docs/images/arch.jpg)

## Design philosophy

- **Rich performance indicator**: Included Reference video quality indicators PSNR, SSIM , VMAF , Non-reference video quality indicators,blockniess, blockloss etc.

- ** High modular and scalable**: Each module can be run seperately and integrated to your system easily .

- ** visualization of analysis result**: All anlaysis results can be viewed remotely . visualization of comparative data for different scenarios was supported as well.

## Structure introduction

In this section, we introduce the four module in our framework.

1. **QoS server** : It is reponsible fo
2. **Preprocess module**: video pre-processing include raw files and encoded files
3. **Analysis module**: Performance data result analysis included reference video quality indicate e.g PSNR, SSIM , VMAF and non-reference video quality indicate e.g blockniess, blockloss etc.
4. **Web Application**: Test task trigger and  visualization of analysis result showing.
5. **Video transmission adapter module**: video transmission channels which is adaptation layer for different evaluated real-time video system.

## Install guide
## Preprocess module setup
This section describes the dependencies and steps for setup Preprocess module, all scripts and code can be found at preprocess folder.
### Install dependencies
To enable the deep learning module, you should compile the latest OpenCV. We recommend version 4.1.0. Refer https://opencv.org for the details and installation.
To use the ffmpeg tool you should compile the FFmpeg toolset. You can refer to the script `preprocess/encodedVideoGenerateScripts/compile_ffmpeg.sh`. And use the script to install the toolset.
### Generate tagged file as testing input video
Two format video stream format: raw file or encoded file as testing input video were provided.
#### Raw file:
1. Generate tagged avi file:
``` bash
tag input.y4m tagged.avi resolution_width resolution_height tagsize framenumber
```
*eg ./tag ./video/FourPeople_1280x720_60.y4m FourPeople_1280x720_30_tagged.avi 1280 720 3 600*

It will generate FourPeople_1280x720_30_taged.avi in native output folder, which resolution is 1280x720, one number tag size width is 20*3, total frame numberr is 60.

2. use `ffmpeg` to generate requested input format video
You can install the `ffmpeg` using PPA. Refer https://launchpad.net/~jonathonf/+archive/ubuntu/ffmpeg-4 for details.
```
ffmpeg -i tagged.avi tagged.yuv
```
*eg ffmpeg -i FourPeople_1280x720_30_taged.avi FourPeople_1280x720_30_taged.yuv*

It will generate FourPeople_1280x720_30_taged.yuv
#### Encoded file:
1. Generate mkv file
```
Python mkTestStream.py –w <width> -h <height> -b <bitrate> -o <output.mkv> -v <codec> <input_stream>
```
*e.g ./mkMCUTestStream.py -w 1280 -h  720 -b 2000 -o 1280x720-framerate30-vp8_bitrate1000k.mkv -v vp8 1280x720_30_taged.avi*

It will generate encoded mkv file 1280x720-framerate30-bitrate1000k.mkv
2. Insert  key frame and tag information to encoded video file
You shold run the `compile_ffmpeg.sh' script to compile the ffmpeg libs and build the `genTestStream` tool.
```
./genTestStream -i <MKV file>
```
*e.g ./genTestStream -i 1280x720-framerate30-vp8_bitrate1000k.mkv*

It will generate corresponding encoded key frame and tag information format encode file , end with vp8/h264/vp9/h265

**This file format is "key frame"+ "frame length"+"tag"+"frame data"**

3. Decode encoded file to raw file for comparison
```
ffmpeg  -i <MKV file> -c:v rawvideo -pix_fmt yuv420p <Decoded file>
```
*e.g ffmpeg -i FourPeople_720p_taged_H264.mkv -c:v rawvideo -pix_fmt yuv420p FourPeople_720p_taged_H264_decoded.yuv*

It will decode FourPeople_720p_taged_H264.mkv to FourPeople_720p_taged_H264_decoded.yuv

## Analysis module setup
Analysis module help to do performance data result analysis included reference video quality indicate e.g PSNR, SSIM , VMAF and non-reference video quality indicate e.g blockniess, blockloss etc.
### Install Dependencies
To enable vmaf, clone the vmaf repo from the github and install all the requirements as instructed in https://github.com/Netflix/vmaf and finally "`make`".

To enable non-reference indicator, please go to http://vq.kt.agh.edu.pl//metrics.html to download executable binary and found detail description about each non-reference video quality indicators

To compile other module in src folder, you should compile the latest OpenCV and the OpenCV_contrib modules, We recommend version 4.1.0 . Refer  https://opencv.org for the details and installation.
### Generate analysis data
To generate analysis data follow these steps. Please copy the out `Data` folder of the QOStestclient into the `dataset` folder first.
1. Generate basic data for compare, use the iq_yuv to generate the basic data
```
iq_yuv <ARGBrawFile> <originalVideoFile> <width> <height>
```
*e.g iq_yuv localARGB.txt FourPeople_720p_taged.yuv 1280 720*

It will process the video and generate data for other analysis

2. Quality testing for vmaf
```
python /path/to/vmaf_calculate.py
```
*e.g python analysis/python/vmaf_calculate.py*

It will test the quality use vmaf module and generate result data.

3. Quality testing for no-reference video
```
python /path/to/NR_calculate.py
```
*e.g python analysis/python/NR_calculate.py*

It will test the quality use no-reference method and generate result data.

4. Calculate jitter
```
FLR {latencyFile}
```
*e.g ./analysis/native/FLR localLatency.txt*

It will calculate the jitter result
5. Caculate latency
```
latency {publishTimeFile} {latencyFile} {frameCount}
```
*e.g ./analysis/native/latency localPublishTime.txt localLatency.txt 600*

It will calculate the latency result

6. Calculate fps
```
fps {FpsFile}
```
*e.g ./analysis/native/fps localFPS.txt*

It will calculate the fps result

7. Calculate bitrate
```
bitrate {bitrateFile}
```
*e.g ./analysis/native/bitrate localBitrate.txt*

It will calculate the fps result

**All result data can be visual in QOS server page**

## Video transmission adapter module
Video transmission adapt module help to establish SUT( system under testing) transmission channel and generate corresponding performance input data for Analysis module. We provide one Simple sample named QoStestclient which used Linux SDK of owt-client-native to testing performance for Open WebRTC Toolkit owt-server conference mode.
#### Sample with Open WebRTC Tookit server and Client
1. Start Open WebRTC Tookit  Conference Server

Please following instruction at https://github.com/open-webrtc-toolkit/owt-server to start Conference Server

2. Build Open WebRTC Toolkit Native SDK

Please following instruction at  https://github.com/open-webrtc-toolkit/owt-client-native to build Open WebRTC Toolkit Native SDK.

3. Build QoStestclient

Go to QoStestclient directory run following command

```
mkdir build
cd build
cmake ../
make
```

4. Run QoStestclient
```
python runQosClient.py
```

#### QoS server and web application setup and usage
QoS server Test task trigger and visualization of analysis result showing. The result can be showed in two ways. 1. calculate and show the single indicator directly at web page. 2. genereate and show compared results

##### Install Dependencies and start QOS server
To run the server you need the latest nodejs and node modules. Please refer to https://nodejs.org/en/download/ for install nodejs in your system. And after that use npm to install the modules, eg. `‘npm install’`.

After install runtime environment and necessary modules, start the server with:
```
node qosServer.js
```

##### Web application setup and usage
After you run the analysis steps described in 1.1.2.2-2, the result file will locate in `analysis/dataset/out`, and you should create your own subfolder and move all the result file in it.

Create your own subfolder in the `analysis/dataset/`out folder
```
cd {analysisOutFolder}
mkdir –p {date}/{testnumber}
```
*eg:<br>
cd analysis/dataset/out<br>
mkdir –p 20190501/1*

this will create the necessary directory structure

**single indicator visualization**

After that you can visit https://localhost:4004 to get visual result for each indicators.

**multi indicators compared visualization**

To see the compared results, you can visit https://\<qosServerAddress\>:4004/webrtcmcubench_summary.html to get comparsion result for each indicators. It will compare data with different “testnumber” in the same “date” dir which created in last step.
