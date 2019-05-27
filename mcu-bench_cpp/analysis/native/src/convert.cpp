// Copyright (C) <2019> Intel Corporation
//
// SPDX-License-Identifier: Apache-2.0
#include <iostream> // for standard I/O
#include <string>   // for strings
#include <iomanip>  // for controlling float print precision
#include <sstream>  // string to number conversion
#include <fstream>
#include <vector>

#include <opencv2/core/core.hpp>       // Basic OpenCV structures (cv::Mat, Scalar)
#include <opencv2/imgproc/imgproc.hpp> // Gaussian Blur
#include <opencv2/highgui/highgui.hpp> // OpenCV window I/O
#include <opencv2/ml/ml.hpp>

#include <unistd.h>

using namespace std;
using namespace cv;

const char *WIN_RF = "Reference";

void help()
{
    cout << endl;
    cout << "/////////////////////////////////////////////////////////////////////////////////" << endl;
    cout << "This program measures Frame Loss Rate" << endl;
    cout << "USAGE: ./convert input output outputwidth outputheight" << endl;
    cout << "For example: ./convert video/Megamind.avi test.y4m 640 480" << endl;
    cout << "/////////////////////////////////////////////////////////////////////////////////" << endl
         << endl;
}

int main(int argc, char **argv)
{

    if (argc != 5)
    {
        help();
        return -1;
    }

    char old_cwd[4096] = {0};
    getcwd(old_cwd, 4096);
    string run_path = argv[0];
    string path = run_path.substr(0, run_path.rfind('/'));
    chdir(path.c_str());

    namedWindow(WIN_RF, WINDOW_AUTOSIZE);
    moveWindow(WIN_RF, 400, 0);

    const string inputVideoName = argv[1];
    int owidth = atoi(argv[3]);
    int oheight = atoi(argv[4]);

    int frameNum = -1; // Frame counter

    VideoCapture inputVideo(inputVideoName);

    const string name = argv[2];
    int ex = static_cast<int>(inputVideo.get(CAP_PROP_FOURCC));

    if (!inputVideo.isOpened())
    {
        cout << "Could not open reference " << inputVideoName << endl;
        return -1;
    }

    Size refS = Size((int)inputVideo.get(CAP_PROP_FRAME_WIDTH),
                     (int)inputVideo.get(CAP_PROP_FRAME_HEIGHT));

    cout << "input video frame resolution: Width=" << refS.width << "  Height=" << refS.height
         << " of nr#: " << inputVideo.get(CAP_PROP_FRAME_COUNT) << endl;

    Mat _frameReference, frameReference;

    VideoWriter output;
    cout << name << endl;
    int fcc = VideoWriter::fourcc('I', '4', '2', '0');
    output.open("./output/" + name, fcc, 30, Size(owidth, oheight), true);

    if (!output.isOpened())
    {
        cout << "Could not open output video " << name << endl;
        return -1;
    }

    inputVideo >> _frameReference;
    for (;;) //Show the image captured in the window and repeat
    {
        inputVideo >> _frameReference;

        if (_frameReference.empty())
        {
            cout << " < < <  Video over!  > > > ";
            break;
        }

        resize(_frameReference, frameReference, Size(owidth, oheight));

        ++frameNum;
        cout << "Frame: " << frameNum << "# " << endl;

        output << frameReference;

        ////////////////////////////////// Show Image /////////////////////////////////////////////
        imshow(WIN_RF, frameReference);

        char c = (char)waitKey(33);
        if (c == 27)
            break;
    }

    chdir(old_cwd);

    return 0;
}
