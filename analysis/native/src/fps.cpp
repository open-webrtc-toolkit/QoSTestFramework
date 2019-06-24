// Copyright (C) <2019> Intel Corporation
//
// SPDX-License-Identifier: Apache-2.0
#include <iostream> // for standard I/O
#include <string>   // for strings
#include <iomanip>  // for controlling float print precision
#include <sstream>  // string to number conversion
#include <fstream>

#include <opencv2/core.hpp>    // Basic OpenCV structures (cv::Mat, Scalar)
#include <opencv2/imgproc.hpp> // Gaussian Blur
#include <opencv2/highgui.hpp> // OpenCV window I/O
#include <opencv2/ml.hpp>

#include <unistd.h>

using namespace std;
using namespace cv;
using namespace cv::ml;

#define ND 4
#define TBS 60

void help()
{
    cout << endl;
    cout << "/////////////////////////////////////////////////////////////////////////////////" << endl;
    cout << "This program measures Frames per second" << endl;
    cout << "Usage: ./native/fps ./native/Data/localFPS.txt" << endl;
    cout << "/////////////////////////////////////////////////////////////////////////////////" << endl
         << endl;
}

vector<pair<unsigned int, unsigned long long>> sender;
vector<pair<unsigned int, unsigned long long>> receiver;

vector<int> fps;

int main(int argc, char *argv[])
{
    if (argc != 2)
    {
        help();
        return -1;
    }

    char old_cwd[4096] = {0};
    getcwd(old_cwd, 4096);
    string run_path = argv[0];
    string path = run_path.substr(0, run_path.rfind('/'));
    chdir(path.c_str());

    ifstream send_tag(argv[1]);

    if (!send_tag)
    {
        cout << "can't not open file" << endl;
        return -1;
    }

    int v(0);
    char c;
    ofstream of("../dataset/output/fps.txt");

    send_tag >> c;
    for (;;)
    {
        ////////////////////////////////////////Get sender data/////////////////////////////////////////////////////
        ////////////////////////////////////////////////////////////////////////////////////////////////////////////

        send_tag >> v;

        cout << v << endl;
        of << v << ',';
        if (send_tag.eof())
        {
            break;
        }
        else
        {
            send_tag >> c;
        }
    }

    of.close();

    chdir(old_cwd);

    return 0;
}
