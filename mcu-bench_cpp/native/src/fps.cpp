#include <iostream> // for standard I/O
#include <string>   // for strings
#include <iomanip>  // for controlling float print precision
#include <sstream>  // string to number conversion
#include <fstream>

#include <opencv2/core.hpp>        // Basic OpenCV structures (cv::Mat, Scalar)
#include <opencv2/imgproc.hpp>  // Gaussian Blur
#include <opencv2/highgui.hpp>  // OpenCV window I/O
#include <opencv2/ml.hpp>

using namespace std;
using namespace cv;
using namespace cv::ml;

#define ND 4
#define TBS 60

void help()
{
    cout << endl;
    cout << "/////////////////////////////////////////////////////////////////////////////////" << endl;
    cout << "This program measures WebRTC Video Frames per second" << endl;
    cout << "USAGE: ./latency senddata recvdata" << endl;
    cout << "If you want to run it in terminal instead of basicServer, please cd to mcu-bench_cpp folder and use ./native/xxx" << endl;
    cout << "For example: ./native/fps ./native/Data/localFPS.txt" << endl;
    cout << "/////////////////////////////////////////////////////////////////////////////////" << endl << endl;
}

vector<pair<unsigned int, unsigned long long> > sender;
vector<pair<unsigned int, unsigned long long> > receiver;

vector<int> fps;

int main(int argc, char *argv[])
{
    if(argc != 2)
    {
        help();
        return -1;
    }

    ifstream send_tag(argv[1]);
    //ifstream recv_tag(argv[2]);
    
    if(!send_tag)
    {
        cout << "can't not open file" << endl;
        return -1;
    }

    int v(0);
    char c;
    ofstream of("./native/output/fps.txt");

    send_tag>>c;
    for(;;)
    {
        ////////////////////////////////////////Get sender data/////////////////////////////////////////////////////
        ////////////////////////////////////////////////////////////////////////////////////////////////////////////

        send_tag>>v;

        cout << v << endl;
        of << v << ',';
        if(send_tag.eof())
        {
            break;
        }
        else{
            send_tag>>c;
        }
    }

    of.close();
    return 0;
}
