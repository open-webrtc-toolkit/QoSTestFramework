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
int TagRound = 0;

int framesize;   //一副图所含的像素个数

class VIFP{
public:
    static const int NLEVS = 4;
    static const float SIGMA_NSQ = 2.0f;
    float compute(const cv::Mat& original, const cv::Mat& processed);
    void computeVIFP(const cv::Mat& ref, const cv::Mat& dist, int N, double& num, double& den);
    void applyGaussianBlur(const cv::Mat& src, cv::Mat& dst, int ksize, double sigma);
};

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

void help()
{
    cout << endl;
    cout << "/////////////////////////////////////////////////////////////////////////////////" << endl;
    cout << "This program measures PSNR/MSSIM by Deep Learning Recognition in Android" << endl;
    cout << "Please ensure your OPENCV is above 3.2 and complied with corresponding opencv_contrib. This is very important to enable Deep Learning modules" << endl;
    cout << "USAGE: ./iq rawdata sourcevideo" << endl;
    cout << "If you want to run it in terminal instead of basicServer, please cd to mcu-bench_cpp folder and use ./native/xxx" << endl;
    cout << "For example: ./native/imagequality_yuv_android ./native/output/rec.yuv ./video/vp8_raw_1280x720_framerate30-bitrate2000k-gop30.yuv 720p" << endl;
    cout << "/////////////////////////////////////////////////////////////////////////////////" << endl << endl;
}

int main(int argc, char *argv[])
{

    ifstream fin, frec;
    const string receivedVideoName = argv[1];
    const string originVideoName = argv[2];
    std::string res(argv[3]);
    if (res.find("1080") != std::string::npos) {
        video_width = 1920;
        video_height = 1080;
    }else if (res.find("720") != std::string::npos){
        video_width = 1280;
        video_height = 720;
        cout <<"-------------------------------------------720P---------------------------------------"<<endl;
        cout << video_width<< endl;
        cout << "----------------720--------"<<endl;
    }else if (res.find("vga") != std::string::npos){
        video_width = 640;
        video_height = 480;
    }else{
        video_width = 320;
        video_height = 240;
    } 
    framesize = video_width * video_height * 3 / 2;   //一副图所含的像素个数
    fin.open(originVideoName.c_str(), ios_base::in|ios_base::binary);
    frec.open(receivedVideoName.c_str(), ios_base::in|ios_base::binary);
    ofstream psnr_out("./native/output/psnr.txt");
    ofstream ssim_out("./native/output/ssim.txt");
    ofstream quality_out("./native/output/quality.txt");

    if(fin.fail())
    {
        cout << "the file is error" << endl;
        return -1;
    }
    if(frec.fail())
    {
        cout << "the file is error" << endl;
        return -1;
    }

    fin.seekg(0, ios::end);   //设置文件指针到文件流的尾部
    streampos ps = fin.tellg();  //指出当前的文件指针
    unsigned long NumberPixe = ps;
    unsigned FrameCount = ps / framesize; //帧大小
    fin.close();
    FILE* fileIn = fopen(originVideoName.c_str(), "rb+");
    unsigned char* pYuvBuf = new unsigned char[framesize]; //一帧数据大小  \

    frec.seekg(0, ios::end);   //设置文件指针到文件流的尾部
    streampos ps2 = frec.tellg();  //指出当前的文件指针
    unsigned long NumberPixe2 = ps2;
    unsigned FrameCount_rec = ps2 / framesize; //帧大小
    frec.close();
    FILE* fileRec = fopen(receivedVideoName.c_str(), "rb+");
    unsigned char* pYuvBuf_rec = new unsigned char[framesize]; //一帧数据大小

    //存储到图像
    int preframe=0;
    int framenum=0;
    Mat frameReference;
    map<int, Mat> originImages;
    const char* WIN_RF = "Reference";
    namedWindow(WIN_RF, CV_WINDOW_AUTOSIZE);
    cvMoveWindow(WIN_RF, 400, 0);
    int v(0);
    int width(video_width);
    int height(video_height);
    int overFlag(0);
    VIFP* vifp  = new VIFP();

/////////////////////////////////////////Load original video to map ////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    for(int i = 0; i < FrameCount; ++i)
    {
        fread(pYuvBuf, framesize*sizeof(unsigned char), 1, fileIn);
        cv::Mat yuvImg;
        yuvImg.create(height*3/2, width, CV_8UC1);
        memcpy(yuvImg.data, pYuvBuf, framesize*sizeof(unsigned char));
        cv::cvtColor(yuvImg, frameReference, CV_YUV2BGR_I420);
        originImages[i+1] = frameReference.clone();
        //cout<<framenum<<endl;
    }
//////////////////////////////////////////////////////////Load data ////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    FILE* sendyuv = fopen("./native/output/send.yuv","w");

    ofstream receive_timestamp("./native/Data/rec_timestamp.txt");
    receive_timestamp << ",";
    ifstream recTime("./native/Data/recTime.txt");
    char c;
    long t;
    initLookupTable();

    for (int i = 0; i < FrameCount_rec; ++i)
    {
        fread(pYuvBuf_rec, framesize*sizeof(unsigned char), 1, fileRec);
        cv::Mat yuvImg;
        yuvImg.create(height*3/2, width, CV_8UC1);
        memcpy(yuvImg.data, pYuvBuf_rec, framesize*sizeof(unsigned char));
        cv::cvtColor(yuvImg, frameReference, CV_YUV2BGR_I420);

        Mat img, img2;
        preframe = framenum;
        framenum = 0;
        //imshow("figure", frameReference);
        //waitKey(1000);

        for(int k = 0;k < ND;k++)
        {
          img = frameReference(Rect(k*tagsize, 0, tagsize, tagsize));
          img2 = 255 - img;
          int num = test_on_single_photo_dl(img2);
          framenum = framenum*10 + num;
        }

        if(framenum <= FrameCount)//skip the last received frame
        {
            float psnr = getPSNR(frameReference, originImages[framenum]);
            Scalar ssim = getMSSIM(frameReference, originImages[framenum]);

            //Mat M1, M2;
            //frameReference.convertTo(M1, CV_32F);
            //originImages[framenum].convertTo(M2, CV_32F);
            //float vif = vifp->compute(M1, M2);

            //cout <<  psnr << endl << (ssim[0]+ssim[1]+ssim[2])/3 << endl << vif << endl;
            cout <<  psnr << endl << (ssim[0]+ssim[1]+ssim[2])/3 << endl;
            quality_out << psnr << "," << (ssim[0]+ssim[1]+ssim[2])/3 << ',';
            psnr_out << psnr;
            psnr_out << ",";
            ssim_out << (ssim[0]+ssim[1]+ssim[2])/3;
            ssim_out << ",";
            Mat sendyuvtemp;
            unsigned char* pYuvBuf_send = new unsigned char[width*height*3/2];
            cvtColor(originImages[framenum],sendyuvtemp, CV_BGR2YUV_I420);
            memcpy(pYuvBuf_send, sendyuvtemp.data, width*height*3/2*sizeof(unsigned char));
            fwrite(pYuvBuf_send, 1, width*height*3/2*sizeof(unsigned char), sendyuv);
            delete[] pYuvBuf_send;
            recTime >> c;
            recTime >> t;
            if (preframe > framenum)
            {
                TagRound++;
            }
            receive_timestamp<<framenum + FrameCount*TagRound<<","<<t<<",";
        }
    }
    fclose(sendyuv);
    fclose(fileRec);
    fclose(fileIn);
    receive_timestamp.close();
    recTime.close();
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
