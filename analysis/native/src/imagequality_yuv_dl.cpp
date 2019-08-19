// Copyright (C) <2019> Intel Corporation
//
// SPDX-License-Identifier: Apache-2.0
#include <fstream>
#include <iomanip>
#include <iostream>
#include <sstream>
#include <string>

#include "opencv2/imgcodecs.hpp"
#include <opencv2/core.hpp>
#include <opencv2/dnn.hpp>
#include <opencv2/highgui.hpp>
#include <opencv2/imgproc.hpp>
#include <opencv2/ml.hpp>

#include <map>
#include <stdio.h>
#include <unistd.h>

using namespace cv;
using namespace cv::ml;
using namespace cv::dnn;
using namespace std;

double getPSNR(const Mat &I1, const Mat &I2);
Scalar getMSSIM(const Mat &I1, const Mat &I2);

void help()
{
    cout << endl;
    cout << "/////////////////////////////////////////////////////////////////////////////////" << endl;
    cout << "This program measures PSNR/SSIM by Deep Learning Recognition" << endl;
    cout << "Please ensure your OPENCV is installed following readme file" << endl;
    cout << "USAGE: ./iq_yuv recieved_video send_video width height" << endl;
    cout << "For example: ./native/iq_yuv ./dataset/output/rec.yuv ./dataset/output/send.yuv 1280 720" << endl;
    cout << "/////////////////////////////////////////////////////////////////////////////////" << endl
         << endl;
}

int main(int argc, char *argv[])
{
    char old_cwd[4096] = {0};
    getcwd(old_cwd, 4096);
    string run_path = argv[0];
    string path = run_path.substr(0, run_path.rfind('/'));
    chdir(path.c_str());

    ofstream psnr_out("../dataset/output/psnr.txt");
    ofstream ssim_out("../dataset/output/ssim.txt");
    ofstream quality_out("../dataset/output/quality.txt");

    std::string res_width(argv[3]);
    std::string res_height(argv[4]);
    int video_width = std::stoi(res_width);
    int video_height = std::stoi(res_height);

    int framesize = video_width * video_height * 3 / 2; //pixels in one frame

    fstream recyuv(argv[1], ios::in);
    fstream sendyuv(argv[2], ios::in);

    while (true)
    {
        Mat yuvRecv;
        yuvRecv.create(video_height * 3 / 2, video_width, CV_8UC1);
        recyuv.read((char *)yuvRecv.data, framesize * sizeof(unsigned char));
        Mat image_rec;
        cv::cvtColor(yuvRecv, image_rec, COLOR_YUV2BGR_I420);

        Mat yuvSend;
        yuvSend.create(video_height * 3 / 2, video_width, CV_8UC1);
        sendyuv.read((char *)yuvSend.data, framesize * sizeof(unsigned char));
        Mat image_send;
        cv::cvtColor(yuvSend, image_send, COLOR_YUV2BGR_I420);

        if (recyuv.eof() || sendyuv.eof())
        {
            break;
        }
        float psnr = getPSNR(yuvRecv, yuvSend);
        Scalar ssim = getMSSIM(image_rec, image_send);
        cout << psnr << endl
             << (ssim[0] + ssim[1] + ssim[2]) / 3 << endl;
        quality_out << psnr << "," << (ssim[0] + ssim[1] + ssim[2]) / 3 << ',';
        psnr_out << psnr;
        psnr_out << ",";
        ssim_out << (ssim[0] + ssim[1] + ssim[2]) / 3;
        ssim_out << ",";
    }
    recyuv.close();
    sendyuv.close();
    psnr_out.close();
    ssim_out.close();

    chdir(old_cwd);

    return 0;
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
