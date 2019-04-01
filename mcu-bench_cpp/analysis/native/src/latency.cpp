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
#include <sys/time.h>


#define TBS 60
#define LATENCY_LIMIT_H 5000
#define LATENCY_LIMIT_L 20

#define ND 4
int tagsize= 60;
void getMaxClass(const Mat &probBlob, int *classId, double *classProb);
int test_on_single_photo_dl(Mat img);

multimap<int,long> sender;
multimap<int,long> receiver;

multimap<int,long>::iterator it1;
multimap<int,long>::iterator it2;
multimap<int,long>::iterator key;
pair<multimap<int,long>::iterator,multimap<int,long>::iterator> ret;
int TagRound = 0;
int FrameCount = 600;


void help()
{
    cout << endl;
    cout << "/////////////////////////////////////////////////////////////////////////////////" << endl;
    cout << "This program measures WebRTC Video latency" << endl;
    cout << "If you want to run it in terminal instead of basicServer, please cd to mcu-bench_cpp folder and use ./native/xxx" << endl;
    cout << "For example: ./native/latency ./native/Data/localPublishTime.txt ./native/Data/localLatency" << endl;
    cout << "This program will read the tag photos from C++ and generate a new file call rec_timestamp.txt " << endl;
    cout << "/////////////////////////////////////////////////////////////////////////////////" << endl << endl;
}


int main(int argc, char** argv)
{
    string rec_timestamp = "./native/Data/rec_timestamp.txt";
    ofstream receive_timestamp(rec_timestamp.c_str());
    ifstream received_video(argv[2]);
    receive_timestamp<<",";

    int height = tagsize;
    int width = tagsize*ND;
    int isFirstData = 0;
    int overFlag = 0;
    int v(0);
    unsigned int r, g, b;
    long t(0);//get timestamp from file "mixRawFile"
    unsigned int a1, r1, g1, b1;//get ARGB from file "mixRawFile"
    char c;
    int preframe = 0;


    for(int f = 0;;f++)
    {

        if(overFlag == 1)//the whole file is over
        {
            overFlag = 0;
            //cout<<"over!"<<endl;
            break;
        }
        if(overFlag == 2)//one frame over
        {
            overFlag = 0;
        }
        Mat image(height, width, CV_8UC3);

        if (isFirstData == 0)
        {
            isFirstData = 1;
            received_video >> c;//get first ','
        }
        received_video >> t;//get a frame's timestamp
        received_video >> c;

        for(int i = 0;i < height;i++)
        {
            for(int j = 0;j < width;j++)
            {
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
                //cout << a1 << " " << r1 << " " << g1 << " " << b1 << " " << endl;

                image.at<Vec3b>(i, j)[0] = b1;
                image.at<Vec3b>(i, j)[1] = g1;
                image.at<Vec3b>(i, j)[2] = r1;

                if ((c == 'f'))
                {                   
                    for (int i = 0; i < 4; ++i)
                    {
                        received_video >> c;
                    }
                    received_video >> c;//get next char,such as ',' or 'e'.
                    if (c == ' ')
                    {
                        //cout<<"occ2"<<endl;
                        overFlag = 1;//file over
                        break;
                    }
                    if (received_video.eof())//the situation:the file over at 'frame'
                    {
                        //cout<<"occ3"<<endl;
                        overFlag = 1;//file over
                        break;
                    }
                    else
                    {
                        //cout<<"occ4"<<endl;
                        overFlag = 2;//one frame over
                        break;
                    }
                }
                if (received_video.eof())//the situation:the file over at ' '
                {
                    //cout<<"occ5"<<endl;
                    overFlag = 1;//file over
                    break;
                }
            }
            if (overFlag >= 1)
            {
                //cout<<"occ6"<<endl;
                break;//break to do iq task when a frame over or the whole file over.(maybe a img didn't trans completely,so must make a force break.)
            }
        }

        int framenum2(0);
        Mat img2;
        for(int k = 0;k < ND;k++)
        {
            img2 = image(Rect(k*tagsize, 0, tagsize, tagsize));
            img2 = 255 - img2 ;
            int num = test_on_single_photo_dl(img2);
            framenum2 = framenum2*10 + num;
        }
        //cout << "num is " << framenum2 << endl;
        if (framenum2 <= FrameCount)
        {
            if (preframe > framenum2)
            {
                TagRound++;
            }
            receive_timestamp << framenum2 + FrameCount * TagRound << "," << t << ",";//save timestamp to file
            preframe = framenum2;
            if(received_video.eof())
            {
                break;
            }
        }
    }
    receive_timestamp.close();
    ifstream send_tag(argv[1]);
    ifstream recv_tag(rec_timestamp.c_str());
    ofstream latency_out("./native/output/latency.txt");

    int tag_s(0);
    long timestamp_s(0);
    int tag_r(0);
    long timestamp_r(0);
    int latency(0);//ms


//////////////////////////////////////////////////////////Load data ////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    int lasts = -1;
    int lastr = -1;
    int roomsize = 1;//default

    send_tag>>c;//get first ','
    recv_tag>>c;//get first ','
    for (;;)
    {

        send_tag>>tag_s;//tag
        send_tag>>c;//','
        send_tag>>timestamp_s;//timestamp
        sender.insert(make_pair(tag_s,timestamp_s));
        //cout<<"1------"<<tag_s<<endl;
        //cout<<"2------"<<timestamp_s<<endl;
        send_tag>>c;//','
        if(send_tag.eof() || c ==' ')
        break;
    }
    for (;;)
    {
        recv_tag>>tag_r;//tag
        //cout<<"6------"<<tag_r<<endl;
        if(recv_tag.eof())
        break;
        recv_tag>>c;//','
        recv_tag>>timestamp_r;//timestamp
        receiver.insert(make_pair(tag_r,timestamp_r));
        //cout<<"3------"<<tag_r<<endl;
        //cout<<"4------"<<timestamp_r<<endl;
        recv_tag>>c;//get first ','
        //cout<<"5------"<<c<<endl;
    }


    it2 = receiver.begin();
    while(it2 != receiver.end())//datas in receiver is less than sender,so make a traversal for it.
    {
        //cout<<"receiver tag:"<<it2->first<<endl;
        //cout<<"receiver time:"<<it2->second<<endl;

        ret = sender.equal_range(it2->first);//got a tag's location
        for (key = ret.first; key != ret.second; ++key)
        {
            //cout<<"sender tag:"<<key->first<<endl;
            //cout<<"sender time:"<<key->second<<endl;

            latency = (it2->second) - (key->second);
            //if ((latency < LATENCY_LIMIT_H) && (latency > LATENCY_LIMIT_L))
            //{
                cout << latency << endl;
                latency_out << latency;
                latency_out << ",";
            //}
            //else
            //{
                //cout<<"wrong latency!"<<endl;
            //}
        }
        it2++;
    }

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
    cv::dnn::initModule();  //Required if OpenCV is built as static libs

    String modelTxt = "./native/ml/deploy.prototxt";
    String modelBin = "./native/ml/lenet_iter_10000.caffemodel";
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
    resize(img, img, Size(28, 28));        //GoogLeNet accepts only 224x224 RGB-images
    //Convert Mat to batch of images
    Mat inputBlob = blobFromImage(img);
    net.setBlob(".data", inputBlob);        //set the network input
    net.forward();                          //compute output
    Mat prob = net.getBlob("prob");   //gather output of "prob" layer
    int classId;
    double classProb;
    getMaxClass(prob, &classId, &classProb);//find the best class
    //std::vector<String> classNames = readClassNames();
   // std::cout << "result by dl: #" << classId << std::endl;
  //  std::cout << "Probability: " << classProb * 100 << "%" << std::endl;
    return classId;
}
