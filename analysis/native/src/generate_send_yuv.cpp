// Copyright (C) <2019> Intel Corporation
//
// SPDX-License-Identifier: Apache-2.0
#include <fstream>
#include <iomanip>
#include <iostream>
#include <sstream>
#include <string>

#include "opencv2/imgcodecs.hpp"
#include <opencv2/core.hpp>
#include <opencv2/dnn.hpp>
#include <opencv2/highgui.hpp>
#include <opencv2/imgproc.hpp>
#include <opencv2/ml.hpp>

#include <map>
#include <stdio.h>
#include <unistd.h>

using namespace cv;
using namespace cv::ml;
using namespace cv::dnn;
using namespace std;

const int ND = 4;
const int tagsize = 60;


void getMaxClass(const Mat &probBlob, int *classId, double *classProb);
int test_on_single_photo_dl(Mat img);

void help()
{
    cout << endl;
    cout << "/////////////////////////////////////////////////////////////////////////////////" << endl;
    cout << "This program measures PSNR/SSIM by Deep Learning Recognition" << endl;
    cout << "Please ensure your OPENCV is installed following readme file" << endl;
    cout << "USAGE: ./gen_send recieved_video sourcevideo width height" << endl;
    cout << "For example: ./native/gen_send ./dataset/output/rec.yuv ./native/video/vp8_raw_1280x720_framerate30-bitrate2000k-gop30.yuv 1280 720" << endl;
    cout << "/////////////////////////////////////////////////////////////////////////////////" << endl
         << endl;
}

int main(int argc, char *argv[])
{
    char old_cwd[4096] = {0};
    getcwd(old_cwd, 4096);
    string run_path = argv[0];
    string path = run_path.substr(0, run_path.rfind('/'));
    chdir(path.c_str());

    fstream recyuv(argv[1], ios::in);

    if (recyuv.fail())
    {
        cout << "can't not open file" << endl;
        return -1;
    }
    std::string res_width(argv[3]);
    std::string res_height(argv[4]);
    int video_width = std::stoi(res_width);
    int video_height = std::stoi(res_height);

    int framesize = video_width * video_height * 3 / 2; //pixels in one frame

    string originVideoName = argv[2];
    string suffix = ".yuv";
    if (originVideoName.length() < suffix.length())
    {
        cout << "wrong file name" << endl;
        return -1;
    }
    if (0 != originVideoName.compare(originVideoName.length() - suffix.length(), suffix.length(), suffix))
    {
        cout << "wrong file name" << endl;
        return -1;
    }

    fstream fileIn(originVideoName.c_str(), ios::in);

    //save to image
    Mat frameReference;
    map<int, Mat> originImages;

    /////////////////////////////////////////Load original video to map ////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    int FrameCount = 0;
    while (true)
    {
        static int i = 1;
        cv::Mat yuvImg;
        yuvImg.create(video_height * 3 / 2, video_width, CV_8UC1);
        fileIn.read((char *)yuvImg.data, framesize * sizeof(unsigned char));
        cv::cvtColor(yuvImg, frameReference, COLOR_YUV2BGR_I420);

        originImages[i] = frameReference.clone();
        FrameCount = i;
        if (fileIn.eof())
        {
            break;
        }
        i++;
    }
    fileIn.close();

    //////////////////////////////////////////////////////////Load data ////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    FILE *sendyuv = fopen(argv[5], "w");

    for (int i = 0;; i++)
    {
        Mat yuvImg;
        yuvImg.create(video_height * 3 / 2, video_width, CV_8UC1);
        recyuv.read((char *)yuvImg.data, framesize * sizeof(unsigned char));
        Mat image;//(video_height, video_width, CV_8UC3);
        cv::cvtColor(yuvImg, image, COLOR_YUV2BGR_I420);

        Mat img2, img3;
        int framenum2(0);
        for (int k = 0; k < ND; k++)
        {
            img2 = image(Rect(k * tagsize, 0, tagsize, tagsize));
            img3 = 255 - img2;
            int num = test_on_single_photo_dl(img3);
            framenum2 = framenum2 * 10 + num;
        }

        if (framenum2 <= FrameCount && !recyuv.eof()) //skip the last received frame
        {
            Mat sendyuvtemp;
            cvtColor(originImages[framenum2], sendyuvtemp, COLOR_BGR2YUV_I420);
            fwrite(sendyuvtemp.data, 1, video_width * video_height * 3 / 2 * sizeof(unsigned char), sendyuv);
        }

        if (recyuv.eof())
        {
            break;
        }
    }
    fclose(sendyuv);
    recyuv.close();
    chdir(old_cwd);

    return 0;
}

void getMaxClass(const Mat &probBlob, int *classId, double *classProb)
{
    Mat probMat = probBlob.reshape(1, 1); //reshape the blob to 1x1000 matrix
    Point classNumber;
    minMaxLoc(probMat, NULL, classProb, NULL, &classNumber);
    *classId = classNumber.x;
}

int test_on_single_photo_dl(Mat img)
{
    String modelTxt = "./ml/deploy.prototxt";
    String modelBin = "./ml/lenet_iter_10000.caffemodel";
    Net net = dnn::readNetFromCaffe(modelTxt, modelBin);
    if (net.empty())
    {
        std::cerr << "Can't load network by using the following files: " << std::endl;
        std::cerr << "prototxt:   " << modelTxt << std::endl;
        std::cerr << "caffemodel: " << modelBin << std::endl;
        exit(-1);
    }
    if (img.empty())
    {
        std::cerr << "Can't read the image " << std::endl;
        exit(-1);
    }
    resize(img, img, Size(28, 28)); //GoogLeNet accepts only 224x224 RGB-images
    //Convert Mat to batch of images
    Mat inputBlob = blobFromImage(img);
    net.setInput(inputBlob);  //set the network input
    Mat prob = net.forward(); //gather output of "prob" layer
    int classId;
    double classProb;
    getMaxClass(prob, &classId, &classProb); //find the best class
    return classId;
}
