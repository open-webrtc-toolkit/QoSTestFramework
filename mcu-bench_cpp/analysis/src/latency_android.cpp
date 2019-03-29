#include <iostream> // for standard I/O
#include <string>   // for strings
#include <iomanip>  // for controlling float print precision
#include <sstream>  // string to number conversion
#include <fstream>
#include <stdio.h>
#include <stdlib.h>
#include <math.h>
using namespace std;
#include <map>
#include <unistd.h>
#include <sys/time.h>

#define TBS 60
#define LATENCY_LIMIT_H 5000
#define LATENCY_LIMIT_L 20


multimap<int,long> sender;
multimap<int,long> receiver;

multimap<int,long>::iterator it1;
multimap<int,long>::iterator it2;
multimap<int,long>::iterator key;
pair<multimap<int,long>::iterator,multimap<int,long>::iterator> ret;

void help()
{
    cout << endl;
    cout << "/////////////////////////////////////////////////////////////////////////////////" << endl;
    cout << "This program measures WebRTC Video latency in Android" << endl;
    cout << "If you want to run it in terminal instead of basicServer, please cd to mcu-bench_cpp folder and use ./native/xxx" << endl;
    cout << "For example: ./native/latency ./native/Data/localPublishTime.txt ./native/Data/rec_timestamp.txt ./native/Data/devicestime.log" << endl;    
    cout << "/////////////////////////////////////////////////////////////////////////////////" << endl << endl;
}


int main(int argc, char** argv)
{

    ifstream send_tag(argv[1]);
    ifstream recv_tag(argv[2]);
    ifstream error(argv[3]);
    ofstream latency_out("./native/output/latency.txt");

    int tag_s(0);
    long timestamp_s(0);
    int tag_r(0);
    long timestamp_r(0);
    int latency(0);//ms
    char c;

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

/*
    char *p;
    long time[2];
    string str;
    for(int i = 0; i < 2; i++)
    {
        getline(error,str);
        string str2 = str.substr(21);
        time[i] = strtol(str2.c_str(),&p, 10);
    }
    long err;
    if (str.substr(0,3).compare("sub") == 0)
    {
        err = (time[0] - time[1])/1000;
    }
    else
    {
        err = (time[1] - time[0])/1000;
    }
*/
    int err;
    error >> err;

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

            latency = (it2->second) - (key->second) + err/1000;
            //if ((latency < LATENCY_LIMIT_H) && (latency > LATENCY_LIMIT_L))
            //{
                cout << latency << endl;
                latency_out << latency;
                latency_out << ",";
            //}
        }
        it2++;
    }

    return 0;

}

