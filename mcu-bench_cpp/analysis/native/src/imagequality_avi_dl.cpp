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
int tagsize= 60;
float RGBYUV02990[256],RGBYUV05870[256],RGBYUV01140[256];
float RGBYUV01684[256],RGBYUV03316[256];
float RGBYUV04187[256],RGBYUV00813[256];
void initLookupTable();
void getMaxClass(const Mat &probBlob, int *classId, double *classProb);
int test_on_single_photo_dl(Mat img);
double getPSNR ( const Mat& I1, const Mat& I2);
Scalar getMSSIM( const Mat& I1, const Mat& I2);
int video_width;
int video_height;

class VIFP{
public:
    static const int NLEVS = 4;
    static const float SIGMA_NSQ = 2.0f;
    float compute(const cv::Mat& original, const cv::Mat& processed);
    void computeVIFP(const cv::Mat& ref, const cv::Mat& dist, int N, double& num, double& den);
    void applyGaussianBlur(const cv::Mat& src, cv::Mat& dst, int ksize, double sigma);
};

void help()
{
    cout << endl;
    cout << "/////////////////////////////////////////////////////////////////////////////////" << endl;
    cout << "This program measures PSNR/MSSIM by Deep Learning Recognition" << endl;
    cout << "Please ensure your OPENCV is above 3.2 and complied with corresponding opencv_contrib. This is very important to enable Deep Learning modules" << endl;
    cout << "If you want to run it in terminal instead of basicServer, please cd to mcu-bench_cpp folder and use ./native/xxx" << endl;
    cout << "USAGE: ./native/iq_avi rawdata sourcevideo" << endl;
    cout << "For example: ./native/iq_avi ./native/Data/localARGB ./native/video/testFourPeople.avi 1080p" << endl;
    cout << "/////////////////////////////////////////////////////////////////////////////////" << endl << endl;
}

int main(int argc, char *argv[])
{
    if(argc != 4)
    {
        help();
        return -1;
    }

    ifstream received_video(argv[1]);
    ofstream psnr_out("../dataset/output/psnr.txt");
    ofstream ssim_out("../dataset/output/ssim.txt");
    ofstream quality_out("../dataset/output/quality.txt");
    std::string res(argv[3]);
    if (res.find("1080") != std::string::npos) {
        video_width = 1920;
        video_height = 1080;
    }else if (res.find("720") != std::string::npos){
        video_width = 1280;
        video_height = 720;
    }else if (res.find("vga") != std::string::npos){
        video_width = 640;
        video_height = 480;
    }else{
        video_width = 540;
        video_height = 360;
    } 
    if(!received_video)
    {
        cout << "can't not open file" << endl;
        return -1;
    }

    const string originVideoName = argv[2];
    VideoCapture originVideo(originVideoName);
    if (!originVideo.isOpened())
    {
            cout  << "Could not open original video " << originVideoName << endl;
            return -1;
    }
    else
    {
            //cout  << "originvideo Loaded" << originVideoName << endl;
    }
     //sleep(50);

    map<int, Mat> originImages;

    const char* WIN_RF = "Reference";
    namedWindow(WIN_RF, CV_WINDOW_AUTOSIZE);
    cvMoveWindow(WIN_RF, 400       , 0);

    int v(0);
    unsigned int r, g, b;

    long t(0);//get timestamp from file "mixRawFile"
    unsigned int a1, r1, g1, b1;//get ARGB from file "mixRawFile"
    int framecount(0);

    int width(video_width);
    int height(video_height);
    int overFlag(0);

    char c;//get ',' from file "mixRawFile"
    VIFP* vifp  = new VIFP();
    //system("rm -rf ./native/output/receive");
    //system("mkdir ./native/output/receive");
    //system("rm -rf ./native/output/send");
    //system("mkdir ./native/output/send");

/////////////////////////////////////////Load original video to map ////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    int preframe=0;
    int framenum=0;
    Mat frameReference;
    for(int i = 0;;i++)
    {
        originVideo >> frameReference;
        if(frameReference.empty())
          break;
      /*
        width = frameReference.cols;
        height = frameReference.rows;
        Mat img;
        preframe = framenum;
        framenum = 0;
        for(int k = 0;k <4;k++)
        {
          img = frameReference(Rect(k*tagsize, 0, tagsize, tagsize));
          img = 255 - img;
          int num = test_on_single_photo_dl(img);
          framenum = framenum*10 + num;
        }
        */
        originImages[i+1] = frameReference.clone();
        framenum++ ;
    }
    int oriFramenum = framenum;
    originVideo.release();

//////////////////////////////////////////////////////////Load data ////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    FILE* recyuv = fopen("../dataset/output/rec.yuv","w");
    FILE* sendyuv = fopen("../dataset/output/send.yuv","w");
    initLookupTable();

    //ofstream receive_timestamp("./native/Data/receive_timestamp.txt");
    //receive_timestamp<<",";

    int roomsize=1;//default
    int isFirstData = 0;

    height /= roomsize;
    width /= roomsize;

    height = video_height;
    width = video_width;
    cout << "yanbin height is " << endl;
    cout <<  height << endl;

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
        unsigned char *utemp = (unsigned char *)malloc(width*height);
        unsigned char *vtemp = (unsigned char *)malloc(width*height);
        unsigned char *yy= (unsigned char *)malloc(width*height);
        unsigned char *vv = (unsigned char *)malloc(width*height/4);
        unsigned char *uu = (unsigned char *)malloc(width*height/4);
        int yuvNSize = 0;

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
                //cout << a1 << " " << r1 << " " << g1 << " " << b1 << " " << endl;

                image.at<Vec3b>(i, j)[0] = b1;
                image.at<Vec3b>(i, j)[1] = g1;
                image.at<Vec3b>(i, j)[2] = r1;

                yy[yuvNSize] = (unsigned char)(RGBYUV02990[r1]+RGBYUV05870[r1]+RGBYUV01140[b1]);
                utemp[yuvNSize] = (unsigned char)(-RGBYUV01684[r1]-RGBYUV03316[g1]+b1/2+128);
                vtemp[yuvNSize] = (unsigned char)(r1/2-RGBYUV04187[g1]-RGBYUV00813[b1]+128);
                yuvNSize ++ ;
/*
                if ((c == 'f'))
                {
                    //cout<<"occ1"<<endl;
                    framecount = 0;
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
*/

                if (received_video.eof())//the situation:the file over at ' '
                {
                    //cout<<"occ5"<<endl;
                    overFlag = 1;//file over
                    break;
                }
            }
            if (overFlag >= 1)
            {

                break;//break to do iq task when a frame over or the whole file over.(maybe a img didn't trans completely,so must make a force break.)
            }
        }

        if(yuvNSize == width*height)
        {
            int kk = 0;
            unsigned long ii = 0;
            for (ii = 0;ii < height;ii += 2)
            {
                for(unsigned long jj=0;jj<width;jj+=2)
                {
                    uu[kk]=(utemp[ii*width+jj]+utemp[(ii+1)*width+jj]+utemp[ii*width+jj+1]+utemp[(ii+1)*width+jj+1])/4;
                    vv[kk]=(vtemp[ii*width+jj]+vtemp[(ii+1)*width+jj]+vtemp[ii*width+jj+1]+vtemp[(ii+1)*width+jj+1])/4;
                    kk++;
                }
            }
            free(utemp);
            free(vtemp);

            fwrite(yy,1,width*height,recyuv);
            fwrite(uu,1,width*height/4,recyuv);
            fwrite(vv,1,width*height/4,recyuv);

            free(yy);
            free(uu);
            free(vv);
        }


        
        Mat img2, img3;
        int framenum2(0);
        for(int k = 0;k < ND;k++)
        {
            img2 = image(Rect(k*tagsize, 0, tagsize, tagsize));
            img3 = 255 - img2;
            int num = test_on_single_photo_dl(img3);
            framenum2 = framenum2*10 + num;
        }
        /*
        char path[255];
        sprintf(path,"./native/output/receive/%d.tiff", f);
        imwrite(path,image);
        char path2[255];
        sprintf(path2,"./native/output/send/%d.tiff", f);
        imwrite(path2,originImages[framenum2]);
        */
        //receive_timestamp<<framenum2<<","<<t<<",";//save timestamp to file

        if(framenum2 <= oriFramenum && !received_video.eof())//skip the last received frame
        {
            float psnr = getPSNR(image, originImages[framenum2]);
            Scalar ssim = getMSSIM(image, originImages[framenum2]);
            //Mat M1, M2;
            //image.convertTo(M1, CV_32F);
            //originImages[framenum2].convertTo(M2, CV_32F);
            //float vif = vifp->compute(M1, M2);

            //cout <<  psnr << endl << (ssim[0]+ssim[1]+ssim[2])/3 << endl << vif << endl;
            cout <<  psnr << endl << (ssim[0]+ssim[1]+ssim[2])/3 << endl;
            quality_out << psnr << "," << (ssim[0]+ssim[1]+ssim[2])/3 << ",";
            psnr_out << psnr;
            psnr_out << ",";
            ssim_out << (ssim[0]+ssim[1]+ssim[2])/3;
            ssim_out << ",";
            Mat sendyuvtemp;
            unsigned char* pYuvBuf = new unsigned char[width*height*3/2];
            cvtColor(originImages[framenum2],sendyuvtemp, CV_BGR2YUV_I420);
            memcpy(pYuvBuf, sendyuvtemp.data, width*height*3/2*sizeof(unsigned char));
            fwrite(pYuvBuf, 1, width*height*3/2*sizeof(unsigned char), sendyuv);
            delete[] pYuvBuf;
        }
        if(received_video.eof())
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

double getPSNR(const Mat& I1, const Mat& I2)
{
    Mat s1;
    absdiff(I1, I2, s1);       // |I1 - I2|
    s1.convertTo(s1, CV_32F);  // cannot make a square on 8 bits
    s1 = s1.mul(s1);           // |I1 - I2|^2

    Scalar s = sum(s1);        // sum elements per channel

    double sse = s.val[0] + s.val[1] + s.val[2]; // sum channels

    if( sse <= 1e-10) // for small values return zero
        return 0;
    else
    {
        double mse  = sse / (double)(I1.channels() * I1.total());
        double psnr = 10.0 * log10((255 * 255) / mse);
        return psnr;
    }
}

Scalar getMSSIM( const Mat& i1, const Mat& i2)
{
    const double C1 = 6.5025, C2 = 58.5225;
    /***************************** INITS **********************************/
    int d = CV_32F;

    Mat I1, I2;
    i1.convertTo(I1, d);            // cannot calculate on one byte large values
    i2.convertTo(I2, d);

    Mat I2_2   = I2.mul(I2);        // I2^2
    Mat I1_2   = I1.mul(I1);        // I1^2
    Mat I1_I2  = I1.mul(I2);        // I1 * I2

    /*************************** END INITS **********************************/

    Mat mu1, mu2;                   // PRELIMINARY COMPUTING
    GaussianBlur(I1, mu1, Size(11, 11), 1.5);
    GaussianBlur(I2, mu2, Size(11, 11), 1.5);

    Mat mu1_2   =   mu1.mul(mu1);
    Mat mu2_2   =   mu2.mul(mu2);
    Mat mu1_mu2 =   mu1.mul(mu2);

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
    t3 = t1.mul(t2);                 // t3 = ((2*mu1_mu2 + C1).*(2*sigma12 + C2))

    t1 = mu1_2 + mu2_2 + C1;
    t2 = sigma1_2 + sigma2_2 + C2;
    t1 = t1.mul(t2);                 // t1 =((mu1_2 + mu2_2 + C1).*(sigma1_2 + sigma2_2 + C2))

    Mat ssim_map;
    divide(t3, t1, ssim_map);        // ssim_map =  t3./t1;

    Scalar mssim = mean(ssim_map);   // mssim = average of ssim map
    return mssim;
}

float VIFP::compute(const cv::Mat& original, const cv::Mat& processed)
{
    double num = 0.0;
    double den = 0.0;

    cv::Mat ref[NLEVS];
    cv::Mat dist[NLEVS];
    cv::Mat tmp1, tmp2;

    int w = video_width;
    int h = video_height;

    // for scale=1:4
    for (int scale=0; scale<NLEVS; scale++) {
        // N=2^(4-scale+1)+1;
        int N = (2 << (NLEVS-scale-1)) + 1;
        if (scale == 0) {
            original.copyTo(ref[scale]);
            processed.copyTo(dist[scale]);
        }
        else {
            // ref=filter2(win,ref,'valid');
            applyGaussianBlur(ref[scale-1], tmp1, N, N/5.0);
            // dist=filter2(win,dist,'valid');
            applyGaussianBlur(dist[scale-1], tmp2, N, N/5.0);

            w = (w-(N-1)) / 2;
            h = (h-(N-1)) / 2;
            ref[scale] = cv::Mat(h,w,CV_32F);
            dist[scale] = cv::Mat(h,w,CV_32F);

            // ref=ref(1:2:end,1:2:end);
            cv::resize(tmp1, ref[scale], cv::Size(w,h), 0, 0, cv::INTER_NEAREST);
            // dist=dist(1:2:end,1:2:end);
            cv::resize(tmp2, dist[scale], cv::Size(w,h), 0, 0, cv::INTER_NEAREST);
        }

        computeVIFP(ref[scale], dist[scale], N, num, den);
    }

    return float(num/den);
}

void VIFP::computeVIFP(const cv::Mat& ref, const cv::Mat& dist, int N, double& num, double& den)
{
    int w = ref.cols - (N-1);
    int h = ref.rows - (N-1);

    cv::Mat tmp(h,w,CV_32F);
    cv::Mat mu1(h,w,CV_32F), mu2(h,w,CV_32F), mu1_sq(h,w,CV_32F), mu2_sq(h,w,CV_32F), mu1_mu2(h,w,CV_32F), sigma1_sq(h,w,CV_32F), sigma2_sq(h,w,CV_32F), sigma12(h,w,CV_32F), g(h,w,CV_32F), sv_sq(h,w,CV_32F);
    cv::Mat sigma1_sq_th, sigma2_sq_th, g_th;

    // mu1 = filter2(win, ref, 'valid');
    applyGaussianBlur(ref, mu1, N, N/5.0);
    // mu2 = filter2(win, dist, 'valid');
    applyGaussianBlur(dist, mu2, N, N/5.0);

    const float EPSILON = 1e-10f;

    // mu1_sq = mu1.*mu1;
    cv::multiply(mu1, mu1, mu1_sq);
    // mu2_sq = mu2.*mu2;
    cv::multiply(mu2, mu2, mu2_sq);
    // mu1_mu2 = mu1.*mu2;
    cv::multiply(mu1, mu2, mu1_mu2);
    // sigma1_sq = filter2(win, ref.*ref, 'valid') - mu1_sq;
    cv::multiply(ref, ref, tmp);
    applyGaussianBlur(tmp, sigma1_sq, N, N/5.0);
    sigma1_sq -= mu1_sq;
    // sigma2_sq = filter2(win, dist.*dist, 'valid') - mu2_sq;
    cv::multiply(dist, dist, tmp);
    applyGaussianBlur(tmp, sigma2_sq, N, N/5.0);
    sigma2_sq -= mu2_sq;
    // sigma12 = filter2(win, ref.*dist, 'valid') - mu1_mu2;
    cv::multiply(ref, dist, tmp);
    applyGaussianBlur(tmp, sigma12, N, N/5.0);
    sigma12 -= mu1_mu2;

    // sigma1_sq(sigma1_sq<0)=0;
    cv::max(sigma1_sq, 0.0f, sigma1_sq);
    // sigma2_sq(sigma2_sq<0)=0;
    cv::max(sigma2_sq, 0.0f, sigma2_sq);

    // g=sigma12./(sigma1_sq+1e-10);
    tmp = sigma1_sq + EPSILON;
    cv::divide(sigma12, tmp, g);

    // sv_sq=sigma2_sq-g.*sigma12;
    cv::multiply(g, sigma12, tmp);
    sv_sq = sigma2_sq - tmp;
    cv::threshold(sigma1_sq, sigma1_sq_th, EPSILON, 1.0f, cv::THRESH_BINARY);

    // g(sigma1_sq<1e-10)=0;
    cv::multiply(g, sigma1_sq_th, g);

    // sv_sq(sigma1_sq<1e-10)=sigma2_sq(sigma1_sq<1e-10);
    cv::multiply(sv_sq, sigma1_sq_th, sv_sq);
    cv::multiply(sigma2_sq, 1.0f - sigma1_sq_th, tmp);
    sv_sq += tmp;

    // sigma1_sq(sigma1_sq<1e-10)=0;
    cv::threshold(sigma1_sq, sigma1_sq, EPSILON, 1.0f, cv::THRESH_TOZERO);

    cv::threshold(sigma2_sq, sigma2_sq_th, EPSILON, 1.0f, cv::THRESH_BINARY);
    // g(sigma2_sq<1e-10)=0;
    cv::multiply(g, sigma2_sq_th, g);

    // sv_sq(sigma2_sq<1e-10)=0;
    cv::multiply(sv_sq, sigma2_sq_th, sv_sq);

    cv::threshold(g, g_th, 0.0f, 1.0f, cv::THRESH_BINARY);

    // sv_sq(g<0)=sigma2_sq(g<0);
    cv::multiply(sv_sq, g_th, sv_sq);
    cv::multiply(sigma2_sq, 1.0f - g_th, tmp);
    cv::add(sv_sq, tmp, sv_sq);

    // g(g<0)=0;
    cv::max(g, 0.0f, g);

    // sv_sq(sv_sq<=1e-10)=1e-10;
    cv::max(sv_sq, EPSILON, sv_sq);

    // num=num+sum(sum(log10(1+g.^2.*sigma1_sq./(sv_sq+sigma_nsq))));
    sv_sq += SIGMA_NSQ;
    cv::multiply(g, g, g);
    cv::multiply(g, sigma1_sq, g);
    cv::divide(g, sv_sq, tmp);
    tmp += 1.0f;
    cv::log(tmp, tmp);
    num += cv::sum(tmp)[0] / log(10.0f);

    // den=den+sum(sum(log10(1+sigma1_sq./sigma_nsq)));
    tmp = 1.0f + sigma1_sq / SIGMA_NSQ;
    cv::log(tmp, tmp);
    den += cv::sum(tmp)[0] / log(10.0f);
}

void VIFP::applyGaussianBlur(const cv::Mat& src, cv::Mat& dst, int ksize, double sigma)
{
    int invalid = (ksize-1)/2;
    cv::Mat tmp(src.rows, src.cols, CV_32F);
    cv::GaussianBlur(src, tmp, cv::Size(ksize,ksize), sigma);
    tmp(cv::Range(invalid, tmp.rows-invalid), cv::Range(invalid, tmp.cols-invalid)).copyTo(dst);
}

void initLookupTable()
{
    for (int i=0;i<256;i++)
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
