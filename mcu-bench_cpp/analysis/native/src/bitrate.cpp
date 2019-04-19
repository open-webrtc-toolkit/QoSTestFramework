#include <iostream> // for standard I/O
#include <string>   // for strings
#include <iomanip>  // for controlling float print precision
#include <sstream>  // string to number conversion
#include <fstream>

#include <opencv2/core.hpp>    // Basic OpenCV structures (cv::Mat, Scalar)
#include <opencv2/imgproc.hpp> // Gaussian Blur
#include <opencv2/highgui.hpp> // OpenCV window I/O
#include <opencv2/ml.hpp>

#include <unistd.h> // change dir

using namespace std;
using namespace cv;
using namespace cv::ml;

#define ND 4
#define TBS 60

void help()
{
    cout << endl;
    cout << "/////////////////////////////////////////////////////////////////////////////////" << endl;
    cout << "This program measures WebRTC Video bitrate" << endl;
    cout << "If you want to run it in terminal instead of basicServer, please cd to mcu-bench_cpp folder and use ./native/xxx" << endl;
    cout << "For example: ./native/bitrate ./native/Data/localBitrate.txt" << endl;
    cout << "/////////////////////////////////////////////////////////////////////////////////" << endl
         << endl;
}

long bytes_pre(0);
long bytes_next(0);
int flag = 0;

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
    ofstream of("../dataset/output/bitrate.txt");

    send_tag >> c;
    for (;;)
    {
        ////////////////////////////////////////Get sender data/////////////////////////////////////////////////////
        ////////////////////////////////////////////////////////////////////////////////////////////////////////////
        if (flag == 0)
        {
            send_tag >> bytes_pre;
            send_tag >> c;
            flag = 1;
        }
        else
        {
            send_tag >> bytes_next;
            send_tag >> c;
            if ((bytes_next - bytes_pre) >= 0 && (bytes_pre != -1000) && (bytes_next != -1000))
            {
                cout << (bytes_next - bytes_pre) * 8 / 1024 / 3 << endl;
                of << (bytes_next - bytes_pre) * 8 / 1024 / 3 << ',';
            }
            bytes_pre = bytes_next;
            bytes_next = 0;
        }

        if (send_tag.eof())
            break;
    }

    of.close();

    chdir(old_cwd);

    return 0;
}
