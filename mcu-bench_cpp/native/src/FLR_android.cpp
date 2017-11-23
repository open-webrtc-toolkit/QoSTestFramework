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

#include <unistd.h>
#include <stdio.h>

#define ND 4
#define INTERVAL 1000.0/24.0
int tagsize= 60;

void help()
{
    cout << endl;
    cout << "/////////////////////////////////////////////////////////////////////////////////" << endl;
    cout << "This program measures jitter, the time gap between two consecutive saved frames" << endl;
    cout << "If you want to run it in terminal instead of basicServer, please cd to mcu-bench_cpp folder and use ./native/xxx" << endl;
    cout << "For example: ./native/FLR_android ./native/Data/rec_timestamp.txt" << endl;
    cout << "/////////////////////////////////////////////////////////////////////////////////" << endl << endl;
}

vector<pair<unsigned long long, unsigned int> > datas;

int main(int argc, char *argv[])
{
    ifstream received_tag(argv[1]);
    ofstream jitter_out("./native/output/jitter.txt");
    unsigned long long int tt = 0;
    int tag(0);
    int framenum(0);
    char c;
//////////////////////////////////////////////////////////Load data ////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//for c++
    unsigned long long lastt = 0;
    int lastf = -1;
    int roomsize=1;//default
    received_tag>>c;//','
    for(;;)
    {
        received_tag >> tag;
        received_tag >> c;
        received_tag >> tt;
        received_tag >> c;
        framenum = tag;

        lastt = tt;
        if(lastf != framenum)
        {
            datas.push_back(make_pair(tt, framenum));
            lastf = framenum;
        }
        if(received_tag.eof())
            break;
    }

    // for(int i = 1;i < datas.size();i++)
    // {
    //  cout << datas[i].first << " " << datas[i].second << endl;
    // }
    //sleep(100);
    //cout << "---------------------------------------------------------------------------------------" << endl;
    //cout << "---------------------------------------jitter------------------------------------------" << endl;
    //cout << "---------------------------------------------------------------------------------------" << endl;
    //ofstream ofile2("./native/output/jitter2.data");
    for(int i = 2;i < datas.size();i++)
    {
        unsigned long long int temp = datas[i].first - datas[i-1].first;
        //if (temp < 2000)
    //  if (temp < 10000)
    //  {
            cout << abs(datas[i].first - datas[i-1].first - INTERVAL) << endl;//what's INTERVAL?
            jitter_out << abs(datas[i].first - datas[i-1].first - INTERVAL);
            jitter_out << ",";
    //  }

    }

    return 0;

}