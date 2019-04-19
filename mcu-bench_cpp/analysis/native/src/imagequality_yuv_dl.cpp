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

int framesize; //一副图所含的像素个数

float RGBYUV02990[256], RGBYUV05870[256], RGBYUV01140[256];
float RGBYUV01684[256], RGBYUV03316[256];
float RGBYUV04187[256], RGBYUV00813[256];
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
    cout << "Please ensure your OPENCV is above 3.2 and complied with corresponding opencv_contrib. This is very important to enable Deep Learning modules" << endl;
    cout << "USAGE: ./iq_yuv rawdata sourcevideo" << endl;
    cout << "If you want to run it in terminal instead of basicServer, please cd to mcu-bench_cpp folder and use ./native/xxx" << endl;
    cout << "For example: ./native/iq_yuv ./native/Data/localARGB.txt ./native/video/vp8_raw_1280x720_framerate30-bitrate2000k-gop30.yuv 720p" << endl;
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

    ifstream received_video(argv[1]);
    ofstream psnr_out("../dataset/output/psnr.txt");
    ofstream ssim_out("../dataset/output/ssim.txt");
    ofstream quality_out("../dataset/output/quality.txt");

    if (!received_video)
    {
        cout << "can't not open file" << endl;
        return -1;
    }
    std::string res(argv[3]);
    if (res.find("1080") != std::string::npos)
    {
        video_width = 1920;
        video_height = 1080;
    }
    else if (res.find("720") != std::string::npos)
    {
        video_width = 1280;
        video_height = 720;
    }
    else if (res.find("vga") != std::string::npos)
    {
        video_width = 640;
        video_height = 480;
    }
    else
    {
        video_width = 540;
        video_height = 360;
    }
    framesize = video_width * video_height * 3 / 2; //一副图所含的像素个数
                                                    // typedef struct planet
                                                    // {
                                                    // char name[framesize];
                                                    // double population;
                                                    // double g;
                                                    // } PLANET;

    // PLANET pl;
    ifstream fin;
    const string originVideoName = argv[2];
    fin.open(originVideoName.c_str(), ios_base::in | ios_base::binary);
    if (fin.fail())
    {
        cout << "the file is error" << endl;
        return -1;
    }
    fin.seekg(0, ios::end);     //设置文件指针到文件流的尾部
    streampos ps = fin.tellg(); //指出当前的文件指针
    unsigned long NumberPixe = ps;
    //cout << "file size: " << ps << endl;  //输出指针的位置
    unsigned FrameCount = ps / framesize; //帧大小
    //cout << "frameNuber: " << FrameCount << endl; //输出帧数
    fin.close();
    FILE *fileIn = fopen(originVideoName.c_str(), "rb+");
    unsigned char *pYuvBuf = new unsigned char[framesize]; //一帧数据大小

    //存储到图像
    int preframe = 0;
    int framenum = 0;
    Mat frameReference;
    map<int, Mat> originImages;
    Mat ROI;
    const char *WIN_RF = "Reference";
    namedWindow(WIN_RF, WINDOW_AUTOSIZE);
    moveWindow(WIN_RF, 400, 0);

    int v(0);

    long t(0);                   //get timestamp from file "mixRawFile"
    unsigned int a1, r1, g1, b1; //get ARGB from file "mixRawFile"
    int framecount(0);

    int width(video_width);
    int height(video_height);
    int overFlag(0);

    char c; //get ',' from file "mixRawFile"

    /////////////////////////////////////////Load original video to map ////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    for (int i = 0; i < FrameCount; ++i)
    {
        fread(pYuvBuf, framesize * sizeof(unsigned char), 1, fileIn);
        cv::Mat yuvImg;
        yuvImg.create(height * 3 / 2, width, CV_8UC1);
        memcpy(yuvImg.data, pYuvBuf, framesize * sizeof(unsigned char));
        cv::cvtColor(yuvImg, frameReference, COLOR_YUV2BGR_I420);

        originImages[i + 1] = frameReference.clone();
    }
    fclose(fileIn);

    //////////////////////////////////////////////////////////Load data ////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    int roomsize = 1; //default
    int isFirstData = 0;

    height /= roomsize;
    width /= roomsize;

    height = video_height;
    width = video_width;
    FILE *recyuv = fopen("../dataset/output/rec.yuv", "w");
    FILE *sendyuv = fopen("../dataset/output/send.yuv", "w");
    initLookupTable();

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

                if ((c == 'f'))
                {
                    framecount = 0;
                    for (int i = 0; i < 4; ++i)
                    {
                        received_video >> c;
                    }
                    received_video >> c; //get next char,such as ',' or 'e'.
                    if (c == ' ')
                    {
                        overFlag = 1; //file over
                        break;
                    }
                    if (received_video.eof()) //the situation:the file over at 'frame'
                    {
                        overFlag = 1; //file over
                        break;
                    }
                    else
                    {
                        overFlag = 2; //one frame over
                        break;
                    }
                }
                if (received_video.eof()) //the situation:the file over at ' '
                {
                    overFlag = 1; //file over
                    break;
                }
            }
            if (overFlag >= 1)
            {
                break; //break to do iq task when a frame over or the whole file over.(maybe a img didn't trans completely,so must make a force break.)
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

        if (framenum2 <= FrameCount && !received_video.eof()) //skip the last received frame
        {
            float psnr = getPSNR(image, originImages[framenum2]);
            Scalar ssim = getMSSIM(image, originImages[framenum2]);
            cout << psnr << endl
                 << (ssim[0] + ssim[1] + ssim[2]) / 3 << endl;
            quality_out << psnr << "," << (ssim[0] + ssim[1] + ssim[2]) / 3 << ',';
            psnr_out << psnr;
            psnr_out << ",";
            ssim_out << (ssim[0] + ssim[1] + ssim[2]) / 3;
            ssim_out << ",";
            Mat sendyuvtemp;
            unsigned char *pYuvBuf = new unsigned char[width * height * 3 / 2];
            cvtColor(originImages[framenum2], sendyuvtemp, COLOR_BGR2YUV_I420);
            memcpy(pYuvBuf, sendyuvtemp.data, width * height * 3 / 2 * sizeof(unsigned char));
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
