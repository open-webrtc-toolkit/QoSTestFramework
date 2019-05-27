// Copyright (C) <2019> Intel Corporation
//
// SPDX-License-Identifier: Apache-2.0
#include <stdio.h>
#include <getopt.h>
#include <unistd.h>
#include <libgen.h>

#include <sys/time.h>

extern "C" {
#include <libavformat/avformat.h>
#include <libavutil/mathematics.h>
#include <libavutil/time.h>
}

#define LOG(format, ...) printf("" format, ##__VA_ARGS__)

#define RB24(x)                           \
    ((((const uint8_t*)(x))[0] << 16) |         \
     (((const uint8_t*)(x))[1] <<  8) |         \
     ((const uint8_t*)(x))[2])

#define RB32(x)                                \
    (((uint32_t)((const uint8_t*)(x))[0] << 24) |    \
     (((const uint8_t*)(x))[1] << 16) |    \
     (((const uint8_t*)(x))[2] <<  8) |    \
     ((const uint8_t*)(x))[3])

static void printfMark(void)
{
    int i;

    for(i = 0; i < 20; i++)
        printf("#");

    printf("\n");
}

static void usage(int argc, char *argv[]) {
    printfMark();
    fprintf(stderr, "usage: %s\n", argv[0]);
    fprintf(stderr, "       -i \tinput file path\n");
    fprintf(stderr, "       -h \thelp\n");

    fprintf(stderr, "example:\n");
    fprintf(stderr, "       %s -i 1280x720.mkv\n", argv[0]);
    fprintf(stderr, "       \t\tGenerate MCU test stream\n");

    printfMark();
    exit(1);
}

static bool m_needCheckVBS = true;
static bool m_needApplyVBSF = false;
static AVBitStreamFilterContext *m_vbsf = NULL;

void checkVideoBitstream(AVStream *st, const AVPacket *pkt)
{
    if (!m_needCheckVBS)
        return;

    m_needApplyVBSF = false;
    switch(st->codecpar->codec_id) {
        case AV_CODEC_ID_H264:
            if (pkt->size < 5 || RB32(pkt->data) == 0x0000001 || RB24(pkt->data) == 0x000001)
                break;

            m_vbsf = av_bitstream_filter_init("h264_mp4toannexb");
            if(!m_vbsf)
                LOG("Fail to init h264_mp4toannexb filter\n");

            m_needApplyVBSF = true;
            break;
        case AV_CODEC_ID_HEVC:
            if (pkt->size < 5 || RB32(pkt->data) == 0x0000001 || RB24(pkt->data) == 0x000001)
                break;

            m_vbsf = av_bitstream_filter_init("hevc_mp4toannexb");
            if(!m_vbsf)
                LOG("Fail to init hevc_mp4toannexb filter\n");

            m_needApplyVBSF = true;
            break;
        default:
            break;
    }
    m_needCheckVBS = false;
    LOG("%s video bitstream filter\n", m_needApplyVBSF ? "Apply" : "Not apply");
}

bool filterVBS(AVStream *st, AVPacket *pkt) {
    int ret;

    checkVideoBitstream(st, pkt);
    if (!m_needApplyVBSF)
        return true;

    if (!m_vbsf) {
        LOG("Invalid vbs filter\n");
        return false;
    }

    av_packet_split_side_data(pkt);
    ret = av_apply_bitstream_filters(st->codec, pkt, m_vbsf);
    if(ret < 0) {
        LOG("Fail to filter video bitstream, len(%d)(0x%x 0x%x 0x%x 0x%x)\n"
                , pkt->size
                , pkt->data[0], pkt->data[1], pkt->data[2], pkt->data[3]);
        return false;
    }

    return true;
}

int main(int argc, char* argv[])
{
    char *I_in_filename = NULL;

    int ret;

    AVFormatContext *inCtx = NULL;
    int streamIndex = -1;
    AVStream *stream = NULL;
    AVPacket packet;

    char outFilename[128];
    FILE *outFp = NULL;

    int frameCount = 0;

    // parse input parameters
    int c;
    while(1)
    {
        c = getopt_long(argc, argv, "i:h", NULL, NULL);
        if (c == -1)
            break;

        switch (c)
        {
            case 'i':
                I_in_filename = optarg;
                break;
            case 'h':
                usage(argc, argv);
                break;
            default:
                LOG("Invalid opt: %c\n", c);
                usage(argc, argv);
                return 1;
        }
    }

    if (!I_in_filename)
    {
        LOG("Error, no input file\n");

        usage(argc, argv);
        return 1;
    }

    av_log_set_level(AV_LOG_DEBUG);
    av_register_all();

    inCtx = avformat_alloc_context();
    ret = avformat_open_input(&inCtx, I_in_filename, 0, 0);
    if (ret < 0) {
        LOG("Error: avformat_open_input, %s\n", I_in_filename);
        goto end;
    }

    ret = avformat_find_stream_info(inCtx, 0);
    if (ret < 0) {
        LOG("Error: avformat_find_stream_info\n");
        goto end;
    }

    av_dump_format(inCtx, 0, I_in_filename, 0);

    streamIndex = av_find_best_stream(inCtx, AVMEDIA_TYPE_VIDEO, -1, -1, NULL, 0);
    if (streamIndex < 0) {
        LOG("Error: no video stream\n");
        goto end;
    }

    stream = inCtx->streams[streamIndex];
    switch (stream->codec->codec_id) {
        case AV_CODEC_ID_VP8:
        case AV_CODEC_ID_VP9:
        case AV_CODEC_ID_H264:
        case AV_CODEC_ID_H265:
            break;

        default:
            LOG("Video codec %s is not supported", avcodec_get_name(stream->codec->codec_id));
            goto end;
    }

    {
        char *inBasename = basename(I_in_filename);
        char *p = strrchr(inBasename, '.');

        if (p) {
            memcpy(outFilename, inBasename, strlen(inBasename) - strlen(p + 1));
            outFilename[strlen(inBasename) - strlen(p + 1)] = '\0';
            strcat(outFilename, avcodec_get_name(stream->codec->codec_id));
        } else {
            strcat(outFilename, inBasename);
            strcat(outFilename, ".");
            strcat(outFilename, avcodec_get_name(stream->codec->codec_id));
        }
    }

    outFp = fopen(outFilename, "w");
    if (!outFp) {
        LOG("fopen error, %s\n", outFilename);
        goto end;
    }

    frameCount = 0;
    while (true) {
        ret = av_read_frame(inCtx, &packet);
        if (ret < 0) {
            //LOG("Error: av_read_frame EOS\n");
            break;
        }

        if (!filterVBS(stream, &packet)) {
            goto end;
        }

        int32_t len = packet.size;
        int32_t is_key = packet.flags & AV_PKT_FLAG_KEY;
        int32_t tag = frameCount + 1;
        LOG("LEN: %d KEY: %d TAG: %d\n",len, is_key, tag);
        fwrite(&is_key, 1, 4, outFp);
        fwrite(&len, 1, 4, outFp);
        fwrite(&tag, 1, 4, outFp);
        fwrite(packet.data, 1, packet.size, outFp);
        frameCount++;
    }

    printfMark();
    LOG("Output %d frames: %s\n", frameCount, outFilename);
    printfMark();

end:
    if (inCtx) {
        avformat_close_input(&inCtx);
        avformat_free_context(inCtx);
    }

    if (outFp) {
        fclose(outFp);
    }

    return 0;
}
