// Copyright (C) <2019> Intel Corporation
//
// SPDX-License-Identifier: Apache-2.0
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
int tagsize = 60;
// declare lookup tables
float RGBYUV02990[256], RGBYUV05870[256], RGBYUV01140[256];
float RGBYUV01684[256], RGBYUV03316[256];
float RGBYUV04187[256], RGBYUV00813[256];
// declare functions
void initLookupTable();
void getMaxClass(const Mat &probBlob, int *classId, double *classProb);
int test_on_single_photo_dl(Mat img);
double getPSNR(const Mat &I1, const Mat &I2);
Scalar getMSSIM(const Mat &I1, const Mat &I2);
int video_width;
int video_height;

void help()
{
    cout << endl;
    cout << "/////////////////////////////////////////////////////////////////////////////////" << endl;
    cout << "This program measures PSNR/MSSIM by Deep Learning Recognition" << endl;
    cout << "Please ensure your OPENCV is installed following readme file." << endl;
    cout << "USAGE: ./native/iq_avi rawdata sourcevideo video_width video_height" << endl;
    cout << "For example: ./native/iq_avi ./native/Data/localARGB ./native/video/testFourPeople.avi 1280 720" << endl;
    cout << "/////////////////////////////////////////////////////////////////////////////////" << endl
         << endl;
}

int main(int argc, char *argv[])
{
    if (argc != 4)
    {
        help();
        return -1;
    }

    char old_cwd[4096] = {0};
    getcwd(old_cwd, 4096);
    string run_path = argv[0];
    string path = run_path.substr(0, run_path.rfind('/'));
    chdir(path.c_str());

    // open received video in argb format
    ifstream received_video(argv[1]);
    // open result outfile
    ofstream psnr_out("../dataset/output/psnr.txt");
    ofstream ssim_out("../dataset/output/ssim.txt");
    ofstream quality_out("../dataset/output/quality.txt");
    // resolution of video
    std::string res_width(argv[3]);
    std::string res_height(argv[4]);
    video_width = std::stoi(res_width);
    video_height = std::stoi(res_height);

    if (!received_video)
    {
        cout << "can't not open file" << endl;
        return -1;
    }

    // open original video
    const string originVideoName = argv[2];
    VideoCapture originVideo(originVideoName);
    if (!originVideo.isOpened())
    {
        cout << "Could not open original video " << originVideoName << endl;
        return -1;
    }

    map<int, Mat> originImages;

    const char *WIN_RF = "Reference";
    namedWindow(WIN_RF, WINDOW_AUTOSIZE);
    moveWindow(WIN_RF, 400, 0);

    int v(0);

    long t(0);                   //get timestamp from file "mixRawFile"
    unsigned int r1, g1, b1; //get ARGB from file "mixRawFile"
    int framecount(0);

    int width(video_width);
    int height(video_height);
    int overFlag(0);

    char c; //get ',' from file "mixRawFile"

    /////////////////////////////////////////Load original video to map ////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    int framenum = 0;
    Mat frameReference;
    for (int i = 0;; i++)
    {
        originVideo >> frameReference;
        if (frameReference.empty())
            break;
        originImages[i + 1] = frameReference.clone();
        framenum++;
    }
    int oriFramenum = framenum;
    originVideo.release();

    //////////////////////////////////////////////////////////Load data ////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    FILE *recyuv = fopen("../dataset/output/rec.yuv", "w");
    FILE *sendyuv = fopen("../dataset/output/send.yuv", "w");
    initLookupTable();

    int roomsize = 1; //default
    int isFirstData = 0;

    height /= roomsize;
    width /= roomsize;

    height = video_height;
    width = video_width;

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
        Mat image(height, width, CV_8UC3);
        // used for yuv sampling (Y411)
        unsigned char *utemp = (unsigned char *)malloc(width * height);
        unsigned char *vtemp = (unsigned char *)malloc(width * height);
        unsigned char *yy = (unsigned char *)malloc(width * height);
        unsigned char *vv = (unsigned char *)malloc(width * height / 4);
        unsigned char *uu = (unsigned char *)malloc(width * height / 4);
        int yuvNSize = 0;

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

                if (received_video.eof()) //the situation:the file over at ' '
                {
                    overFlag = 1; //file over
                    break;
                }
            }
            if (overFlag >= 1)
            {
                //break to do iq task when a frame over or the whole file over.(maybe a img didn't trans completely,so must make a force break.)
                break; 
            }
        }

        if (yuvNSize == width * height)
        {
            int kk = 0;
            unsigned long ii = 0;
            for (ii = 0; ii < height; ii += 2)
            {
                for (unsigned long jj = 0; jj < width; jj += 2)
                {
                    uu[kk] = (utemp[ii * width + jj] + utemp[(ii + 1) * width + jj] + utemp[ii * width + jj + 1] + utemp[(ii + 1) * width + jj + 1]) / 4;
                    vv[kk] = (vtemp[ii * width + jj] + vtemp[(ii + 1) * width + jj] + vtemp[ii * width + jj + 1] + vtemp[(ii + 1) * width + jj + 1]) / 4;
                    kk++;
                }
            }
            free(utemp);
            free(vtemp);

            fwrite(yy, 1, width * height, recyuv);
            fwrite(uu, 1, width * height / 4, recyuv);
            fwrite(vv, 1, width * height / 4, recyuv);

            free(yy);
            free(uu);
            free(vv);
        }

        Mat img2, img3;
        int framenum2(0);
        for (int k = 0; k < ND; k++)
        {
            img2 = image(Rect(k * tagsize, 0, tagsize, tagsize));
            img3 = 255 - img2;
            int num = test_on_single_photo_dl(img3);
            framenum2 = framenum2 * 10 + num;
        }

        if (framenum2 <= oriFramenum && !received_video.eof()) //skip the last received frame
        {
            float psnr = getPSNR(image, originImages[framenum2]);
            Scalar ssim = getMSSIM(image, originImages[framenum2]);

            cout << psnr << endl
                 << (ssim[0] + ssim[1] + ssim[2]) / 3 << endl;
            quality_out << psnr << "," << (ssim[0] + ssim[1] + ssim[2]) / 3 << ",";
            psnr_out << psnr;
            psnr_out << ",";
            ssim_out << (ssim[0] + ssim[1] + ssim[2]) / 3;
            ssim_out << ",";
            Mat sendyuvtemp;
            unsigned char *pYuvBuf = new unsigned char[width * height * 3 / 2];
            cvtColor(originImages[framenum2], sendyuvtemp, COLOR_BGR2YUV_I420);
            memset(pYuvBuf, '\0', sizeof(pYuvBuf));
            memcpy(pYuvBuf, sendyuvtemp.data, width * height * 3 / 2 * sizeof(unsigned char));
            pYuvBuf[sizeof(pYuvBuf)-1] = '\0';
            fwrite(pYuvBuf, 1, width * height * 3 / 2 * sizeof(unsigned char), sendyuv);
            delete[] pYuvBuf;
        }
        if (received_video.eof())
        {
            break;
        }
    }
    //receive_timestamp.close();
    fclose(recyuv);
    fclose(sendyuv);
    received_video.close();
    psnr_out.close();
    ssim_out.close();

    chdir(old_cwd);

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
    // cv::dnn::initModule();  //Required if OpenCV is built as static libs

    String modelTxt = "./ml/deploy.prototxt";
    String modelBin = "./ml/lenet_iter_10000.caffemodel";
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
    resize(img, img, Size(28, 28)); //GoogLeNet accepts only 224x224 RGB-images
    //Convert Mat to batch of images
    Mat inputBlob = blobFromImage(img);
    net.setInput(inputBlob);  //set the network input
    Mat prob = net.forward(); //gather output of "prob" layer
    int classId;
    double classProb;
    getMaxClass(prob, &classId, &classProb); //find the best class

    return classId;
}

double getPSNR(const Mat &I1, const Mat &I2)
{
    Mat s1;
    absdiff(I1, I2, s1);      // |I1 - I2|
    s1.convertTo(s1, CV_32F); // cannot make a square on 8 bits
    s1 = s1.mul(s1);          // |I1 - I2|^2

    Scalar s = sum(s1); // sum elements per channel

    double sse = s.val[0] + s.val[1] + s.val[2]; // sum channels

    if (sse <= 1e-10) // for small values return zero
        return 0;
    else
    {
        double mse = sse / (double)(I1.channels() * I1.total());
        double psnr = 10.0 * log10((255 * 255) / mse);
        return psnr;
    }
}

Scalar getMSSIM(const Mat &i1, const Mat &i2)
{
    const double C1 = 6.5025, C2 = 58.5225;
    /***************************** INITS **********************************/
    int d = CV_32F;

    Mat I1, I2;
    i1.convertTo(I1, d); // cannot calculate on one byte large values
    i2.convertTo(I2, d);

    Mat I2_2 = I2.mul(I2);  // I2^2
    Mat I1_2 = I1.mul(I1);  // I1^2
    Mat I1_I2 = I1.mul(I2); // I1 * I2

    /*************************** END INITS **********************************/

    Mat mu1, mu2; // PRELIMINARY COMPUTING
    GaussianBlur(I1, mu1, Size(11, 11), 1.5);
    GaussianBlur(I2, mu2, Size(11, 11), 1.5);

    Mat mu1_2 = mu1.mul(mu1);
    Mat mu2_2 = mu2.mul(mu2);
    Mat mu1_mu2 = mu1.mul(mu2);

    Mat sigma1_2, sigma2_2, sigma12;

    GaussianBlur(I1_2, sigma1_2, Size(11, 11), 1.5);
    sigma1_2 -= mu1_2;

    GaussianBlur(I2_2, sigma2_2, Size(11, 11), 1.5);
    sigma2_2 -= mu2_2;

    GaussianBlur(I1_I2, sigma12, Size(11, 11), 1.5);
    sigma12 -= mu1_mu2;

    ///////////////////////////////// FORMULA ////////////////////////////////
    Mat t1, t2, t3;

    t1 = 2 * mu1_mu2 + C1;
    t2 = 2 * sigma12 + C2;
    t3 = t1.mul(t2); // t3 = ((2*mu1_mu2 + C1).*(2*sigma12 + C2))

    t1 = mu1_2 + mu2_2 + C1;
    t2 = sigma1_2 + sigma2_2 + C2;
    t1 = t1.mul(t2); // t1 =((mu1_2 + mu2_2 + C1).*(sigma1_2 + sigma2_2 + C2))

    Mat ssim_map;
    divide(t3, t1, ssim_map); // ssim_map =  t3./t1;

    Scalar mssim = mean(ssim_map); // mssim = average of ssim map
    return mssim;
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
