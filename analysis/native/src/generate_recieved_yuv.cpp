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

float RGBYUV02990[256], RGBYUV05870[256], RGBYUV01140[256];
float RGBYUV01684[256], RGBYUV03316[256];
float RGBYUV04187[256], RGBYUV00813[256];
void initLookupTable();

void help()
{
    cout << endl;
    cout << "/////////////////////////////////////////////////////////////////////////////////" << endl;
    cout << "This program measures PSNR/SSIM by Deep Learning Recognition" << endl;
    cout << "Please ensure your OPENCV is installed following readme file" << endl;
    cout << "USAGE: ./gen_rec rawdata sourcevideo width height" << endl;
    cout << "For example: ./native/gen_rec ./native/Data/localARGB.txt ./dataset/output/rec.yuv 1280 720" << endl;
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

    ifstream received_video(argv[1]);

    if (!received_video)
    {
        cout << "can't not open file" << endl;
        return -1;
    }
    std::string res_width(argv[3]);
    std::string res_height(argv[4]);
    int video_width = std::stoi(res_width);
    int video_height = std::stoi(res_height);

    int v(0);
    long t(0);
    unsigned int r1, g1, b1;
    int framecount(0);
    int overFlag(0);

    char c; //get ',' from file "mixRawFile"

    //////////////////////////////////////////////////////////Load data ////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    int isFirstData = 0;

    FILE *recyuv = fopen(argv[2], "w");
    initLookupTable();

    for (int f = 0;; f++)
    {
        if (overFlag == 1) //the whole file is over
        {
            overFlag = 0;
            break;
        }
        if (overFlag == 2) //one frame over
        {
            overFlag = 0;
        }
        Mat image(video_height, video_width, CV_8UC3);
        unsigned char *utemp = (unsigned char *)malloc(video_width * video_height);
        unsigned char *vtemp = (unsigned char *)malloc(video_width * video_height);
        unsigned char *yy = (unsigned char *)malloc(video_width * video_height);
        unsigned char *vv = (unsigned char *)malloc(video_width * video_height / 4);
        unsigned char *uu = (unsigned char *)malloc(video_width * video_height / 4);
        int yuvNSize = 0;

        if (isFirstData == 0)
        {
            isFirstData = 1;
            received_video >> c; //get first ','
        }
        received_video >> t; //get a frame's timestamp
        received_video >> c;

        for (int i = 0; i < video_height; i++)
        {
            for (int j = 0; j < video_width; j++)
            {
                unsigned int a1;
                framecount++;
                received_video >> v;
                b1 = v;
                received_video >> c;
                received_video >> v;
                g1 = v;
                received_video >> c;
                received_video >> v;
                r1 = v;
                received_video >> c;
                received_video >> v;
                a1 = v;
                received_video >> c;

                image.at<Vec3b>(i, j)[0] = b1;
                image.at<Vec3b>(i, j)[1] = g1;
                image.at<Vec3b>(i, j)[2] = r1;

                yy[yuvNSize] = (unsigned char)(RGBYUV02990[r1] + RGBYUV05870[r1] + RGBYUV01140[b1]);
                utemp[yuvNSize] = (unsigned char)(-RGBYUV01684[r1] - RGBYUV03316[g1] + b1 / 2 + 128);
                vtemp[yuvNSize] = (unsigned char)(r1 / 2 - RGBYUV04187[g1] - RGBYUV00813[b1] + 128);
                yuvNSize++;

                if ((c == 'f'))
                {
                    framecount = 0;
                    for (int i = 0; i < 4; ++i)
                    {
                        received_video >> c;
                    }
                    received_video >> c; //get next char,such as ',' or 'e'.
                    if (c == ' ')
                    {
                        overFlag = 1; //file over
                        break;
                    }
                    if (received_video.eof()) //the situation:the file over at 'frame'
                    {
                        overFlag = 1; //file over
                        break;
                    }
                    else
                    {
                        overFlag = 2; //one frame over
                        break;
                    }
                }
                if (received_video.eof()) //the situation:the file over at ' '
                {
                    overFlag = 1; //file over
                    break;
                }
            }
            if (overFlag >= 1)
            {
                break; //break to do iq task when a frame over or the whole file over.(maybe a img didn't trans completely,so must make a force break.)
            }
        }

        if (yuvNSize == video_width * video_height)
        {
            int kk = 0;
            unsigned long ii = 0;
            for (ii = 0; ii < video_height; ii += 2)
            {
                for (unsigned long jj = 0; jj < video_width; jj += 2)
                {
                    uu[kk] = (utemp[ii * video_width + jj] + utemp[(ii + 1) * video_width + jj] + utemp[ii * video_width + jj + 1] + utemp[(ii + 1) * video_width + jj + 1]) / 4;
                    vv[kk] = (vtemp[ii * video_width + jj] + vtemp[(ii + 1) * video_width + jj] + vtemp[ii * video_width + jj + 1] + vtemp[(ii + 1) * video_width + jj + 1]) / 4;
                    kk++;
                }
            }
            free(utemp);
            free(vtemp);

            fwrite(yy, 1, video_width * video_height, recyuv);
            fwrite(uu, 1, video_width * video_height / 4, recyuv);
            fwrite(vv, 1, video_width * video_height / 4, recyuv);

            free(yy);
            free(uu);
            free(vv);
        }

        if (received_video.eof())
        {
            break;
        }
    }
    fclose(recyuv);
    received_video.close();

    chdir(old_cwd);

    return 0;
}

void initLookupTable()
{
    for (int i = 0; i < 256; i++)
    {
        RGBYUV02990[i] = (float)0.2990 * i;
        RGBYUV05870[i] = (float)0.5870 * i;
        RGBYUV01140[i] = (float)0.1140 * i;
        RGBYUV01684[i] = (float)0.1684 * i;
        RGBYUV03316[i] = (float)0.3316 * i;
        RGBYUV04187[i] = (float)0.4187 * i;
        RGBYUV00813[i] = (float)0.0813 * i;
    }
}
