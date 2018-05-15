#include <iostream> // for standard I/O
#include <string>   // for strings
#include <iomanip>  // for controlling float print precision
#include <sstream>  // string to number conversion
#include <fstream>
#include <cstring>

#include <opencv2/core.hpp>        // Basic OpenCV structures (cv::Mat, Scalar)
#include <opencv2/imgproc.hpp>  // Gaussian Blur
#include <opencv2/highgui.hpp>  // OpenCV window I/O
#include <opencv2/ml.hpp>

using namespace std;
using namespace cv;
using namespace cv::ml;


void help()
{
    cout << endl;
    cout << "/////////////////////////////////////////////////////////////////////////////////" << endl;
    cout << "This program measures WebRTC Video FPS/bitrates" << endl;
    cout << "If you want to run it in terminal instead of basicServer, please cd to mcu-bench_cpp folder and use ./native/xxx" << endl;
    cout << "For example: ./native/bitrate_android ./native/Data/recStat.txt" << endl;
    cout << "/////////////////////////////////////////////////////////////////////////////////" << endl << endl;
}

vector<pair<unsigned int, unsigned long long> > sender;
vector<pair<unsigned int, unsigned long long> > receiver;

vector<int> fps;

int main(int argc, char *argv[])
{
    ifstream stat(argv[1], ios_base::in);
    ofstream bitrate_out("./native/output/bitrate.txt");
    string str;
    while(!stat.eof())
    {
        getline(stat,str);
        if(!str.find("bitrateReceive:"))
        {
            cout << str.substr(15) << endl;
            bitrate_out << str.substr(15);
            bitrate_out << ",";
        }
    }

    stat.close();
    return 0;
}