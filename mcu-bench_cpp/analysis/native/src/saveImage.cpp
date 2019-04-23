#include <iostream> // for standard I/O
#include <string>   // for strings
#include <iomanip>  // for controlling float print precision
#include <sstream>  // string to number conversion
#include <fstream>

#include <opencv2/core.hpp>
#include <opencv2/imgproc.hpp>
#include "opencv2/imgcodecs.hpp"
#include <opencv2/highgui.hpp>
#include <opencv2/ml.hpp>
#include <opencv2/dnn.hpp>

using namespace cv;
using namespace cv::ml;
using namespace cv::dnn;
using namespace std;

#include <map>
#include <unistd.h>
#include <stdio.h>

#define ND 4

void help()
{
    cout << endl;
    cout << "/////////////////////////////////////////////////////////////////////////////////" << endl;
    cout << "This program saves frames received" << endl;
    cout << "If you want to run it in terminal instead of basicServer, please cd to mcu-bench_cpp folder and use ./native/xxx" << endl;
    cout << "USAGE: ./saveImage rawdata" << endl;
    cout << "For example: ./native/saveImage ./native/Data/localARGB.txt hd720p" << endl;
    cout << "The output files will be saved in ./native/output" << endl;
    cout << "/////////////////////////////////////////////////////////////////////////////////" << endl
         << endl;
}
int video_width;
int video_height;

int main(int argc, char *argv[])
{

    ifstream received_video(argv[1]);
    std::string res(argv[3]);
    if (res.find("1080") != std::string::npos)
    {
        video_width = 1920;
        video_height = 1080;
    }
    else if (res.find("720") != std::string::npos)
    {
        video_width = 1280;
        video_height = 720;
        cout << "-------------------------------------------720P---------------------------------------" << endl;
        cout << video_width << endl;
        cout << "----------------720--------" << endl;
    }
    else if (res.find("vga") != std::string::npos)
    {
        video_width = 640;
        video_height = 480;
    }
    else
    {
        video_width = 320;
        video_height = 240;
    }
    int v(0);
    unsigned int r, g, b;

    long t(0);          //get timestamp from file "mixRawFile"
    int a1, r1, g1, b1; //get ARGB from file "mixRawFile"
    int framecount(0);

    int width(video_width);
    int height(video_height);
    int overFlag(0);

    char c; //get ',' from file "mixRawFile"

    //////////////////////////////////////////////////////////Load data ////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    int isFirstData = 0;

    for (int f = 0;; f++)
    {
        if (overFlag == 1) //the whole file is over
        {
            overFlag = 0;
            //cout<<"over!"<<endl;
            break;
        }
        if (overFlag == 2) //one frame over
        {
            overFlag = 0;
        }
        Mat image(height, width, CV_8UC3);

        if (isFirstData == 0)
        {
            isFirstData = 1;
            received_video >> c; //get first ','
        }
        received_video >> t; //get a frame's timestamp
        received_video >> c;

        for (int i = 0; i < height; i++)
        {
            for (int j = 0; j < width; j++)
            {
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
        char path[255];
        sprintf(path, "./output/%d.bmp", f);
        imwrite(path, image);
        if (received_video.eof())
        {
            break;
        }
    }
    return 0;
}