// Copyright (C) <2019> Intel Corporation
//
// SPDX-License-Identifier: Apache-2.0
#include <iostream> // for standard I/O
#include <string>   // for strings
#include <iomanip>  // for controlling float print precision
#include <sstream>  // string to number conversion
#include <fstream>
#include <vector>

#include <opencv2/core.hpp>        // Basic OpenCV structures (cv::Mat, Scalar)
#include <opencv2/imgcodecs.hpp>
#include <opencv2/imgproc.hpp>  // Gaussian Blur
#include <opencv2/highgui.hpp>  // OpenCV window I/O
#include <opencv2/ml.hpp>
#include <math.h>

using namespace std;
using namespace cv;
using namespace cv::ml;

Mat tagImages(10, 400, CV_32FC1);

void GenTag(int num, Mat &dst);

#define ND 4
const char* WIN_RF = "Reference";
int tagsize;

Ptr<SVM> svm;

void help()
{
    cout << endl;
    cout << "/////////////////////////////////////////////////////////////////////////////////" << endl;
    cout << "This program tags the raw y4m" << endl;
    cout << "USAGE: ./tag input output outputwidth outputheight tagsize(20px*n) framewanted" << endl;
    cout << "For example: ./tag video/Megamind.avi test.y4m 640 480 1 10" << endl;
    cout << "If you want to Skip57, let it be. If not, edit tagSkip57 function to tag normally " << endl;
    cout << "/////////////////////////////////////////////////////////////////////////////////" << endl << endl;
}

int tagSkip57(int input);

int main(int argc, char **argv)
{

    if(argc != 7)
    {
        help();
        return -1;
    }

    string tagfilename = "./ml/tag.txt";
    ifstream tagfile(tagfilename.c_str());

    if(!tagfile) 
    {
        cout << "Open file ERROR!!!" << endl;
        return -1;
    }

    namedWindow(WIN_RF, WINDOW_AUTOSIZE);
    moveWindow(WIN_RF, 400       , 0);

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////// generate tag images ///////////////////////////////////////////////////////////////////

    for(int k = 0;k < 10;k++)
    {
        string flag;
        tagfile >> flag;

        float v;

        for(int i = 0;i < 20;i++)
        {
            for(int j = 0;j < 20;j++)
            {
                tagfile >> v;
                float _v = 1.0 * (int)(v*255+0.5);
                if(_v >= 255.0f) _v = 255.0f;
                if(_v < 0) _v = 0.0f;
                tagImages.at<float>(k,j + 20*i) = _v;
            }
        }
    }

    //CvSVM svm;
    //svm.load( "./ml/SVM_DATA.xml" );
    svm = StatModel::load<SVM>( "./ml/SVM_DATA2_opencv3.xml" );

    for(int k = 0;k < 10;k++)
    {
        Mat sampleMat = tagImages.row(k);
        cout << svm->predict(sampleMat) << endl;
    }

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////tag the input video//////////////////////////////////////////////////////////

    if(argc != 7) 
    {
        cout << "Not enough arguments" << endl;
        return -1;
    }

    const string inputVideoName = argv[1];
    int owidth = atoi(argv[3]);
    int oheight = atoi(argv[4]);
    int nsize = atoi(argv[5]);
    int framewanted = atoi(argv[6]);
    tagsize = nsize*20;
    int frameNum = 0;          // Frame counter

    VideoCapture inputVideo(inputVideoName);

    string::size_type pAt = inputVideoName.find_last_of('.');
    const string name = argv[2];
    int ex = static_cast<int>(inputVideo.get(CAP_PROP_FOURCC));

    if (!inputVideo.isOpened())
    {
        cout  << "Could not open reference " << inputVideoName << endl;
        return -1;
    }

    Size refS = Size((int) inputVideo.get(CAP_PROP_FRAME_WIDTH),
                     (int) inputVideo.get(CAP_PROP_FRAME_HEIGHT));

    char EXT[] = {(char)(ex & 0xff), (char)((ex & 0xff00) >> 8), (char)((ex & 0xff0000) >> 16), (char)((ex & 0xff000000) >> 24), 0};

    cout << "input video frame resolution: Width=" << refS.width << "  Height=" << refS.height
         << " of nr#: " << inputVideo.get(CAP_PROP_FRAME_COUNT) << endl;

    Mat _frameReference, frameReference;

    VideoWriter output;
    int fcc = VideoWriter::fourcc('I','4','2','0');
    const string video_name = "./output/"+name
    output.open(video_name, fcc, 30, Size(owidth, oheight), true);

    if (!output.isOpened())
    {
        cout  << "Could not open output video " << name << endl;
        return -1;
    }

    inputVideo >> _frameReference;
    for(;;) //Show the image captured in the window and repeat
    {

        if(framewanted == frameNum) 
        {
            waitKey(3000);
            break;
        }

        inputVideo >> _frameReference;

        if (_frameReference.empty() )
        {
            cout << " < < <  Video over!  > > > "<<endl;
            break;
        }

        resize(_frameReference, frameReference, Size(owidth, oheight));

        ++frameNum;
        //frameNum= tagSkip57(frameNum);
        cout << "Frame: " << frameNum << "# " << endl;

        int number = frameNum;
        int num = 0;

        for(int k = ND-1;k >= 0;k--)
        {
            Mat dst = Mat::zeros(tagsize, tagsize, CV_8UC1);
            num = number % 10;
            number = (number - num) / 10;
            GenTag(num, dst);

            for(int i = 0;i < tagsize;i++)
            {
                for(int j = 0;j < tagsize;j++)
                {
                    frameReference.at<Vec3b>(i,j+tagsize*k)[0] = dst.at<unsigned char>(i,j);
                    frameReference.at<Vec3b>(i,j+tagsize*k)[1] = dst.at<unsigned char>(i,j);
                    frameReference.at<Vec3b>(i,j+tagsize*k)[2] = dst.at<unsigned char>(i,j);
                }
            }

        }

        output << frameReference;

        ////////////////////////////////// Show Image /////////////////////////////////////////////
        imshow(WIN_RF, frameReference);
        //imshow(WIN_UT, frameUnderTest);

        char c = (char)waitKey(111);
        if (c == 27) break;
    }
        //cout<<"done"<<endl;
    //output.close();
    svm.release();
    return 0;
}


void GenTag(int num, Mat &dst)
{
    Mat _dst(20, 20, CV_8UC1);
    for(int i = 0;i < 20;i++)
    {
        for(int j = 0;j < 20;j++)
        {
            _dst.at<unsigned char>(i, j) = tagImages.at<float>(num, i+20*j);
        }
    }
    resize(_dst, dst, Size(tagsize, tagsize));
}

int tagSkip57(int input)
{
    int output=0;
    int len =0;
    do
    {
        int num = input%10;
        if(num==5 || num==7) num++;
        output += num*pow(10,len);
        len++;       
    } while(input/=10);
    return output;
}
