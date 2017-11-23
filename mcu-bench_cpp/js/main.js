var dumpBlob ="";
var receivedFileInfo = {};
var receiveFileBuffer = [];

// Time before video measurements
var WAITING_STEPS= 1;
// Video measurement duration
var COLLECTION_STEPS = 70 ;

var defaultConstratints = false ;

//Google
var HD = false ;
var VGA = true ;
var QVGA = false ;
var vp9 = false ;


//Moz
var mozScreenShare = true ;
var mozFakeVideo = false ;
var h264 = false ;

// Datachannel ordered transfer
var dcOrdered = true;

// Dictionary that will contains experiment settings and WebRTC related events
var eventLogs = {};
eventLogs["events"] = {};
//Socket used for communication to signalling server
var signallingSocket;
var dataChannel;
/**
* This class collects events and store them into eventLogs dictionary
* This class collects events and store them into eventLogs dictionary
*/


var eventLogger = {
    isVerbose : false ,
    addEvent: function(event, timestamp){
        eventLogs["events"][event] = timestamp;
        var t1 = 0 ;
        switch (event)
        {
            case events.Events.PC_CREATED :
                if( eventLogs["events"][events.Events.CREATING_PC] !== null ) {
                    t1 = eventLogs["events"][events.Events.CREATING_PC];
                    log("Peer Connection Object created in " + (timestamp - t1).toString() + " ms"  );
                }
                break;
            case events.Events.LOCAL_MEDIA_CAPTURED:
                if( eventLogs["events"][events.Events.GETTING_MEDIA] !== null ) {
                    t1 = eventLogs["events"][events.Events.GETTING_MEDIA];
                    log("Got Stream from Device in " + (timestamp - t1).toString()  + " ms" );
                }
                break;
            case events.Events.LOCAL_PLAYBACK_STARTED:
                if( eventLogs["events"][events.Events.CREATING_PC] !== null ) {
                    t1 = eventLogs["events"][events.Events.CREATING_PC];
                    log("Local media playback started in " + (timestamp - t1).toString() + " ms" );
                }
                break;
            case events.Events.DATA_CHANNEL_OPENED:
                if( eventLogs["events"][events.Events.CREATING_DATA_CHANNEL] !== null ) {
                    t1 = eventLogs["events"][events.Events.CREATING_DATA_CHANNEL];
                    log("Datachannel opened in " + (timestamp - t1).toString() + " ms" );
                }
                break;
            case events.Events.ANSWER_CREATED:
                if( eventLogs["events"][events.Events.CREATING_ANSWER] !== null ) {
                    t1 = eventLogs["events"][events.Events.CREATING_ANSWER];
                    log("Answer created in " + (timestamp - t1).toString() + " ms" );
                }
                break;
        }
    },
    info :  function(event, timestamp){
        log(event + " at " + timestamp.toString());
        this.addEvent(event,timestamp);
    } ,
    verbose :  function(event, timestamp) {
        if( this.isVerbose ){
            log(event + " at " + timestamp.toString());
        }
        this.addEvent(event,timestamp);
    }
};



function DataStats()
{
    this.channelId = "";
    this.bytesSent = 0 ;
    this.bytesReceived = 0 ; // Current rate (over a second timestamp )
    this.packetsSent = 0 ;
}




function VideoStats()
{
    this.timestamp =0 ;
    this.decodedFrames = 0 ;
    this.decodeRate = 0 ; // Current rate (over a second timestamp )
    this.dropRate = 0 ;
    this.renderedFrames = 0 ;
    this.renderRate = 0 ; // Rendered in the last second
    this.width = 0 ;
    this.height = 0 ;
}



function Stat() {
    // Sender
    this.sender = {
        bitRate: 0,  //Encoder
        frameRate: 0,  //encoded
        inputFrameRate: 0, //Captured
        droppedFrames: 0,
        bytesSent: 0,
        googTargetEncoderBitRate: 0,
        renderRate: 0,// Local render?
        width: 0,
        height: 0,
        inputWidth:0 ,
        inputHeight:0
    };
    // Receiver
    this.receiver = {
        bitRate: 0,
        frameRate: 0,
        bytesReceived: 0,
        renderRate: 0, // Render rate
        width: 0,
        height: 0
    }
    ;
}


/*
 * Represents RTP stat (Mozilla)
 */
function MozStat()
{
    // Encoder
    this.encoderStats = {

        bitRateMean :0 ,
        bitRateSTDDev:0,
        frameRateMean:0,
        frameRateSTDDev:0,
        droppedFrames:0,
        bytesSent:0
    };
    // Decoder
    this.decoderStats = {
        bitRateMean :0 ,
        bitRateSTDDev:0,
        frameRateMean:0,
        frameRateSTDDev:0,
        bytesReceived:0
    }
    ;


    videoStats = {};
    // Network stuff

    this.videoInputJitter = 0 ;
    this.rtt = 0 ;
    this.sendBitRate =0 ;
    this.packetReceiveRate = 0 ;
    this.packetSendRate =0;
    this.packetsLost = 0 ;


}



function ChromeStats()
{
    this.availableSentBandwidth = 0 ;
    this.bitRate = 0 ;
    this.availableReceiveBandwidth = 0 ;
    this.jitter = 0 ;
    this.targetEncodingBitRate = 0 ;
    this.actualEncodingBitRate = 0 ;
    this.transmitBitrate = 0 ;
    this.sendBitRate = 0 ;
    this.rtt = 0 ;
    this.captureFrameRate = 0 ;
    this.sendFrameRate = 0 ;
    this.recieveFrameRate = 0 ;
    this.decodeFramRate = 0 ;
    this.sendFrameSize = {
        width : 0 ,
        height : 0
    };
    this.sendBitRate =0 ;
    this.packetReceiveRate = 0 ;
    this.packetSendRate =0;
    this.packetsLost = 0 ;
    this.videoStats = {};
}



var bytesPrev = 0;
var timestampPrev = 0;
var SentbytesPrev = 0;
var SenttimestampPrev = 0;
var PacketsSentPrev = 0;
var PacketsReceivedPrev =0;
var peerresult = 0;
var workloadcounter = 0;

//FPS workload
var decodedFrames = 0;
var decodedPerSec = 0;
var renderFrames = 0;
var renderPerSec = 0;
var droppedFrames = 0;
var droppedFramesPerSec = 0;
var tempDecodedFrames = 0;

var RmtdecodedFrames = 0;
var RmtdecodedPerSec = 0;
var RmtrenderFrames = 0;
var RmtrenderPerSec = 0;
var RmtdroppedFrames = 0;
var RmtdroppedFramesPerSec = 0;
var tempRmtDecodedFrames = 0;


dataStatsCounter = new DataStats();

function Mean() {
    this.count = 0;
    this.sum = 0;

    this.record = function(val) {
        this.count++;
        this.sum += val;
    };

    this.mean = function() {
        return this.count ? (this.sum / this.count).toFixed(3) : 0;
    };
}


var decodedMean = new Mean();
var dropMean = new Mean();

var RmtdecodedMean = new Mean();
var RmtdropMean = new Mean();


// Dumping a stats variable as a string.
function dumpStats(obj) {
    var statsString = 'Timestamp:';
    statsString += obj.timestamp;
    if (obj.id) {
        statsString += "<br>id ";
        statsString += obj.id;
    }
    if (obj.type) {
        statsString += " type ";
        statsString += obj.type;
    }
    if (obj.names) {
        names = obj.names();
        for (var i = 0; i < names.length; ++i) {
            statsString += '<br>';
            statsString += names[i];
            statsString += ':';
            statsString += obj.stat(names[i]);
        }
    } else {
        if (obj.stat('audioOutputLevel')) {
            statsString += "audioOutputLevel: ";
            statsString += obj.stat('audioOutputLevel');
            statsString += "<br>";
        }
    }
    return statsString;
}




var bytesSent = 0 ;
var bytesReceived = 0 ;
var packetsSent = 0 ;
var packetsReceived = 0 ;
var packetsLost = 0 ;


function googmakeVp9Default(sdp) {
    console.log("Offer sdp vp8:" + sdp);
    updated_sdp = sdp.replace("a=rtpmap:100 VP8/90000\r\n","");
    updated_sdp = updated_sdp.replace(/m=video ([0-9]+) RTP\/SAVPF ([0-9 ]*) 100 ([0-9 ]*)/g, "m=video $1 RTP\/SAVPF $2 $3");
    updated_sdp = updated_sdp.replace("a=rtcp-fb:100 nack\r\n","");
    updated_sdp = updated_sdp.replace("a=rtcp-fb:100 nack pli\r\n","");
    updated_sdp = updated_sdp.replace("a=rtcp-fb:100 ccm fir\r\n","");
    updated_sdp = updated_sdp.replace("a=rtcp-fb:100 goog-remb\r\n","");
    updated_sdp = updated_sdp.replace("a=fmtp:96 apt=100","a=fmtp:96 apt=101");

    console.log("Offer sdp vp9:" + updated_sdp);
    return updated_sdp;
}

function mozRemoveVP8(sdp) {
    console.log("Offer sdp vp8:" + sdp);
    updated_sdp = sdp.replace("a=rtpmap:120 VP8/90000\r\n","");
    updated_sdp = updated_sdp.replace(/m=video ([0-9]+) RTP\/SAVPF ([0-9 ]*) 120/g, "m=video $1 RTP\/SAVPF $2");
    updated_sdp = updated_sdp.replace(/m=video ([0-9]+) RTP\/SAVPF 120([0-9 ]*)/g, "m=video $1 RTP\/SAVPF$2");
    updated_sdp = updated_sdp.replace("a=rtcp-fb:120 nack\r\n","");
    updated_sdp = updated_sdp.replace("a=rtcp-fb:120 nack pli\r\n","");
    updated_sdp = updated_sdp.replace("a=rtcp-fb:120 ccm fir\r\n","");
    console.log("Offer sdp h264:" + updated_sdp);
    return updated_sdp;
}
var bytesSent = 0;
var bytesReceived = 0;
var timer = 0 ;
var olddbrmean = 0 ;
var oldebrmean = 0 ;
var encSamples = 0 ;
if( detectedBrowser == "Firefox" ) {

    function x(stats) {
        var y = stats;
       // var results = stats.result();
        //for (var i = 0; i < results.length; ++i) {
        //    var res = results[i];
       // }
    }

    function collectDataChannelStats(doReport)
    {
        if (peerConnection ) {
            if (peerConnection.getStats) {
                peerConnection.getStats(null,x,x);
            }
        }
    }
    function recalcRates() {
        var localVideoStats = new VideoStats();
        var remoteVideoStats = new VideoStats();

        var v = this.get("localView");
        if( v  ){
            if (v.readyState <= HTMLMediaElement.HAVE_CURRENT_DATA || v.paused) {

            } else {
                decodedPerSec = (v.mozDecodedFrames - decodedFrames);
                decodedFrames = v.mozDecodedFrames;

                renderPerSec = v.mozPaintedFrames - renderFrames;
                renderFrames = v.mozPaintedFrames;

                droppedFramesPerSec = v.mozDecodedFrames - v.mozPresentedFrames - droppedFrames;
                droppedFrames = v.mozDecodedFrames - v.mozPresentedFrames;


                decodedMean.record(renderPerSec);
                dropMean.record(droppedFramesPerSec);

                if ((tempDecodedFrames - decodedFrames) != 0) {
                    tempDecodedFrames = decodedFrames;
                }

                localVideoStats.decodedFrames = decodedFrames;
                localVideoStats.decodeRate = decodedPerSec;
                localVideoStats.renderedFrames = renderFrames;
                localVideoStats.renderRate = renderPerSec;
                localVideoStats.droppedFrames = droppedFrames;
                localVideoStats.dropRate = droppedFramesPerSec;
                localVideoStats.width = v.videoWidth ;
                localVideoStats.height = v.videoHeight ;
            }
        }
        var vRmt = get("remoteView0");
        if( vRmt ) {
            if (vRmt.readyState <= HTMLMediaElement.HAVE_CURRENT_DATA || vRmt.paused) {

            } else {
                RmtdecodedPerSec = (vRmt.mozDecodedFrames - RmtdecodedFrames);
                RmtdecodedFrames = vRmt.mozDecodedFrames;

                RmtrenderPerSec = vRmt.mozPaintedFrames - RmtrenderFrames;
                RmtrenderFrames = vRmt.mozPaintedFrames;

                RmtdroppedFramesPerSec = vRmt.mozDecodedFrames - vRmt.mozPresentedFrames - RmtdroppedFrames;
                RmtdroppedFrames = vRmt.mozDecodedFrames - vRmt.mozPresentedFrames;


                RmtdecodedMean.record(RmtrenderPerSec);
                RmtdropMean.record(RmtdroppedFramesPerSec);

                if ((RmtdecodedFrames - tempRmtDecodedFrames) != 0) {
                    tempRmtDecodedFrames = RmtdecodedFrames;
                }

                remoteVideoStats.decodedFrames = RmtdecodedFrames;
                remoteVideoStats.decodeRate = RmtdecodedPerSec;
                remoteVideoStats.renderedFrames = RmtrenderFrames;
                remoteVideoStats.renderRate = RmtrenderPerSec;
                remoteVideoStats.droppedFrames = RmtdroppedFrames;
                remoteVideoStats.dropRate = RmtdroppedFramesPerSec;
                remoteVideoStats.width = vRmt.videoWidth ;
                remoteVideoStats.height = vRmt.videoHeight ;
            }
        }

        return {
            local:localVideoStats,
            remote:remoteVideoStats
        };

    }
    function collectStats(doReport, retArr){

            if (peerConnection && ( peerConnection.getRemoteStreams()[0]  || peerConnection.getLocalStreams()[0]  ) ) {
            if (peerConnection.getStats) {
                peerConnection.getStats(null, function(stats) {
                    var mozStats = new MozStat;

                    var newStat = new Stat();

                    var videoStats = recalcRates();

                    newStat.sender.renderRate = videoStats.local.renderRate ;
                    newStat.receiver.renderRate = videoStats.remote.renderRate ;

                    mozStats.videoStats = videoStats ;

                    var statsString = '';
                    var bitrateText = 'No bitrate stats';
                    var i = 0;

                    newStat.sender.width = videoStats.local.width ;
                    newStat.sender.height = videoStats.local.height ;
                    newStat.receiver.width = videoStats.remote.width ;
                    newStat.receiver.height = videoStats.remote.height ;

                    stats.forEach(function(res) {
                        statsString += '<h3>Report ';
                        statsString += i;
                        statsString += '</h3>';
                        //statsString += dumpStats(res);
                        // Find the bandwidth info for video
                        if (res.type === "inboundrtp") {
                            //audio & video

                            if( res.mediaType === "audio")
                            {
                                var audioBytesNow = res.bytesReceived;
                                var audioJitter = res.jitter ;
                                var audiortt = res.mozRTT ;
                                var audioPacketsLost = res.packetsLost;
                                var audioPacketsReceived = res.packetsReceived;
                            }
                            if ( res.mediaType === "video" && !res.isRemote)
                            {

                                mozStats.decoderStats.bitRateMean = res.bitrateMean ;
                                newStat.receiver.bitRate = res.bitrateMean;


                                mozStats.decoderStats.bitRateSTDDev = res.bitratStdDev ;
                                mozStats.decoderStats.frameRateMean = res.framerateMean;

                                newStat.receiver.frameRate = res.framerateMean ;

                                mozStats.decoderStats.frameRateSTDDev = res.framerateStdDev;

                                mozStats.decoderStats.bytesReceived = res.bytesReceived -  bytesReceived ;
                                bytesReceived = res.bytesReceived;

                                newStat.receiver.bytesReceived = mozStats.decoderStats.bytesReceived ;

                                mozStats.videoInputJitter = res.jitter;



                            }

                        } else if( res.type === "outboundrtp" ){
                            var id = res.id ; // Which channel
                            if ( res.mediaType === "video" && ! res.isRemote)
                            {
                                mozStats.encoderStats.bitRateMean = res.bitrateMean ;
                                mozStats.encoderStats.bitRateSTDDev = res.bitratStdDev ;
                                mozStats.encoderStats.frameRateMean = res.framerateMean;
                                mozStats.encoderStats.frameRateSTDDev = res.framerateStdDev;
                                mozStats.encoderStats.droppedFrames = res.droppedFrames ;
                                mozStats.encoderStats.bytesSent = res.bytesSent - bytesSent;
                                bytesSent = res.bytesSent;


                                newStat.sender.bitRate = res.bitrateMean ;


                                newStat.sender.frameRate = res.framerateMean ;
                                newStat.sender.bytesSent = mozStats.encoderStats.bytesSent ;

                            }
                            if ( res.mediaType === "audio"){

                            }
                            timestampPrev = res.timestamp;
                        }else if( res.type === "track"){
                            var id = res.id ; // Which channel
                        }
                    });
                    if( doReport )
                    {
                       // var result = [  "VInpJitter" , mozStats.videoInputJitter,  " Decode bytesR,br,fr " , mozStats.decoderStats.bytesReceived, mozStats.decoderStats.bitRateMean , mozStats.decoderStats.frameRateMean
                       //         , "Encode: bytesS,br,fr,df " , mozStats.encoderStats.bytesSent, mozStats.encoderStats.bitRateMean, mozStats.encoderStats.frameRateMean,
                       //     mozStats.encoderStats.droppedFrames
                       //    ,"l.render ", videoStats.local.renderRate , "r.render " , videoStats.remote.renderRate
                       // ];


                        var encBitRate = 0 ;
                        if( mozStats.encoderStats.bitRateMean > 0 ) {
                            encSamples += 1 ;
                            encBitRate = (encSamples) * mozStats.encoderStats.bitRateMean - (encSamples - 1) * oldebrmean ;
                            oldebrmean = mozStats.encoderStats.bitRateMean ;

                        }
                        newStat.timer = timer ;
                        var result = [ timer ,  " VInpJit" , mozStats.videoInputJitter,  " Decode brm,frm " ,  mozStats.decoderStats.bitRateMean , mozStats.decoderStats.frameRateMean
                            , "Encode: br,brm,fr,df " , encBitRate, mozStats.encoderStats.bitRateMean, mozStats.encoderStats.frameRateMean,
                            mozStats.encoderStats.droppedFrames
                            ,"l.render ", videoStats.local.renderRate , "r.render " , videoStats.remote.renderRate
                        ];


                        newStat.sender.bitRate =  encBitRate;
                        // TODO is this a bug? really high encoder bitrate for firefox

                        if( encBitRate > 3000000 ){
                            newStat.sender.bitRate = 3000000;
                        }


                        retArr.push( newStat );




                        log(result.join(","));
                        dumpBlob += result.join("\0") + "\n";
                        timer = timer + 1 ;
                        // statsArray.push(mozStats);

                    }
                }, log);


                
            } else {
                log('No stats function. Use at least Firefox 26');
            }
        }
        else {
            //display("No stream");
            //log('Not connected yet');
        }

    }
}
else if ( detectedBrowser == "Chrome"){
    var d1 = 0;
    var d2  = 0;

    function collectDataChannelStats(doReport)
    {
        if (peerConnection ) {
            chromeStats = new ChromeStats();
            if (peerConnection.getStats) {
                peerConnection.getStats(function(stats) {
                    var results = stats.result();

                    for (var i = 0; i < results.length; ++i) {
                        var res = results[i];
                        if (res.type == 'googCandidatePair' && res.stat('googActiveConnection') == 'true'  ){
                            var dchannelId = res.stat('googChannelId');
                            var dbytesSent = res.stat('bytesSent') | 0;
                            var dbytesReceived = res.stat('bytesReceived') | 0;
                            var dpacketsSent = res.stat('packetsSent') | 0 ;
                            var dpacketsDiscardedOnSend =  res.stat('packetsDiscardedOnSend') | 0 ;
                            var rtt = res.stat('googRtt') | 0;

                            var result = [  "channel: " + dchannelId,  "bytesSent" + dbytesSent ,  "bytesReceived" + dbytesReceived ,
                                "packetsSent" + dpacketsSent  , "packetsDiscardedOnSend", dpacketsDiscardedOnSend  , "rtt" , rtt
                            ];
                            log(result.join(","));
                        }
                    }
                });
            }
        }
    }


    function recalcRates() {
        var localVideoStats = new VideoStats();
        var remoteVideoStats = new VideoStats();



        var v = this.get("localView");


        if (v ) {
            if( v.readyState > HTMLMediaElement.HAVE_CURRENT_DATA && ! v.paused ) {
                decodedPerSec = (v.webkitDecodedFrameCount - decodedFrames);
                decodedFrames = v.webkitDecodedFrameCount;
                droppedFramesPerSec = v.webkitDroppedFrameCount - droppedFrames;
                droppedFrames = v.webkitDroppedFrameCount;

                renderFrames = decodedFrames - droppedFrames;
                renderPerSec = decodedPerSec - droppedFramesPerSec;

                decodedMean.record(renderPerSec);
                dropMean.record(droppedFramesPerSec);

                if ((tempDecodedFrames - decodedFrames) != 0) {
                    tempDecodedFrames = decodedFrames;
                }
                localVideoStats.decodedFrames = decodedFrames;
                localVideoStats.decodeRate = decodedPerSec;
                localVideoStats.renderedFrames = renderFrames;
                localVideoStats.renderRate = renderPerSec;
                localVideoStats.droppedFrames = droppedFrames;
                localVideoStats.dropRate = droppedFramesPerSec;
                localVideoStats.width = v.videoWidth ;
                localVideoStats.height = v.videoHeight ;
            }


        }
        var vRmt = get("remoteView0");
         if( vRmt ) {
            if( vRmt.readyState <= HTMLMediaElement.HAVE_CURRENT_DATA || vRmt.paused) {
                return {
                    local:localVideoStats,
                    remote:remoteVideoStats
            };
            }

            RmtdecodedPerSec = (vRmt.webkitDecodedFrameCount - RmtdecodedFrames);
            RmtdecodedFrames = vRmt.webkitDecodedFrameCount;

            RmtdroppedFramesPerSec = vRmt.webkitDroppedFrameCount - RmtdroppedFrames;
            RmtdroppedFrames = vRmt.webkitDroppedFrameCount;

            RmtrenderFrames = RmtdecodedFrames - RmtdroppedFrames;
            RmtrenderPerSec = RmtdecodedPerSec - RmtdroppedFramesPerSec;

            RmtdecodedMean.record(RmtrenderPerSec);
            d1 = RmtdecodedMean.mean();

            RmtdropMean.record(RmtdroppedFramesPerSec);

            remoteVideoStats.decodedFrames = RmtdecodedFrames;
            remoteVideoStats.decodeRate = RmtdecodedPerSec;
            remoteVideoStats.renderedFrames = RmtrenderFrames;
            remoteVideoStats.renderRate = RmtrenderPerSec;
            remoteVideoStats.droppedFrames = RmtdroppedFrames;
            remoteVideoStats.dropRate = RmtdroppedFramesPerSec;
            remoteVideoStats.width = vRmt.videoWidth ;
            remoteVideoStats.height = vRmt.videoHeight ;


            if ((RmtdecodedFrames - tempRmtDecodedFrames) != 0) {
                tempRmtDecodedFrames = RmtdecodedFrames;
            }
        }
        return {
            local:localVideoStats,
            remote:remoteVideoStats
        }
    }
    // Statistics
    function collectStats(doReport,retArr)
    {
        if (peerConnection && ( peerConnection.getRemoteStreams()[0]  || peerConnection.getLocalStreams()[0]   ) ) {
            chromeStats = new ChromeStats();
            if (peerConnection.getStats) {
                peerConnection.getStats(function(stats) {

                    var newStat = new Stat();
                    var videoStats = recalcRates();
                    chromeStats.videoStats = videoStats ;
                    var statsString = '';
                    var results = stats.result();
                    var bitrateText = 'No bitrate stats';
                    newStat.sender.width = videoStats.local.width ;
                    newStat.sender.height = videoStats.local.height ;
                    newStat.receiver.width = videoStats.remote.width ;
                    newStat.receiver.height = videoStats.remote.height ;



                    for (var i = 0; i < results.length; ++i) {
                        var res = results[i];
                        statsString += '<h3>Item ';
                        statsString += i;
                        statsString += '</h3>';
                        if (!res.local || res.local === res) {
                            statsString += dumpStats(res);
                            if (res.type == 'ssrc' && res.stat('googFrameHeightReceived')) {
                                var receiverFPS = res.stat('googFrameRateReceived');

                                chromeStats.recieveFrameRate = receiverFPS ;
                                var DecodedFPS = res.stat('googFrameRateDecoded');
                                newStat.receiver.frameRate = DecodedFPS ;
                                chromeStats.decodeFramRate = DecodedFPS ;
                                d2 = DecodedFPS ;
                                var packetsReceived = res.stat('packetsReceived');

                                var packetsLost = res.stat('packetsLost');
                                chromeStats.packetsLost = packetsLost ;
                                var bytesNow = res.stat('bytesReceived');
                                if (timestampPrev > 0) {
                                    var bitRate = Math.round((bytesNow - bytesPrev) * 8 /
                                        (res.timestamp - timestampPrev));
                                    chromeStats.bitRate = bitRate ;
                                    newStat.receiver.bitRate = bitRate ;
                                    bitrateText = bitRate + ' kbits/sec';
                                    var PacketsReceivedPerSec = Math.round((packetsReceived - PacketsReceivedPrev) * 1000 /
                                        (res.timestamp - timestampPrev));
                                    chromeStats.packetReceiveRate = PacketsReceivedPerSec ;
                                }
                                timestampPrev = res.timestamp;
                                bytesPrev = bytesNow;
                                PacketsReceivedPrev = packetsReceived;


                            } else if (res.type == 'ssrc' && res.stat('googFrameHeightSent')) {
                                var codecName = res.stat('googCodecName');
                                var frameHeightSent = res.stat('googFrameHeightSent');
                                chromeStats.sendFrameSize.height = frameHeightSent ;



                                var frameWidthSent = res.stat('googFrameWidthSent');
                                chromeStats.sendFrameSize.width = frameWidthSent ;
                                var captureFPS = res.stat('googFrameRateInput');
                                chromeStats.captureFrameRate = captureFPS ;
                                var senderFPS = res.stat('googFrameRateSent');
                                chromeStats.sendFrameRate = senderFPS ;
                                var packetsSent = res.stat('packetsSent');

                                var bytesSent = res.stat('bytesSent');
                                var Rtt = res.stat('googRtt');
                                if (SenttimestampPrev > 0) {
                                    var SentbitRate = Math.round((bytesSent - SentbytesPrev) * 8 /
                                        (res.timestamp - SenttimestampPrev));
                                    chromeStats.sendBitRate = SentbitRate ;
                                    var PacketsSentPerSec = Math.round((packetsSent - PacketsSentPrev) * 1000 /
                                        (res.timestamp - SenttimestampPrev));
                                    chromeStats.packetSendRate = PacketsSentPerSec ;
                                }
                                SenttimestampPrev = res.timestamp;
                                SentbytesPrev = bytesSent;
                                PacketsSentPrev = packetsSent;


                                newStat.sender.height = frameHeightSent ;
                                newStat.sender.width = frameWidthSent ;
                                newStat.sender.bytesSent = chromeStats.sendBitRate * 8 ;
                                newStat.sender.frameRate = senderFPS;
                                newStat.sender.inputFrameRate = captureFPS ;
                                newStat.sender.inputHeight = res.stat('googFrameHeightInput');
                                newStat.sender.inputWidth = res.stat('googFrameWidthInput');
                            } else if (res.type == 'VideoBwe') {
                                var ActualEncBitrate = res.stat('googActualEncBitrate');
                                var TargetEncBitrate = res.stat('googTargetEncBitrate');
                                chromeStats.actualEncodingBitRate = ActualEncBitrate ;
                                chromeStats.targetEncodingBitRate = TargetEncBitrate ;

                                newStat.sender.googTargetEncoderBitRate = TargetEncBitrate;
                                newStat.sender.bitRate = ActualEncBitrate ;




                                var AvailableSendBandwidth = res.stat('googAvailableSendBandwidth');
                                chromeStats.availableSentBandwidth = AvailableSendBandwidth ;
                                var RetransmitBitrate = res.stat('googRetransmitBitrate');
                                var AvailableReceiveBandwidth = res.stat('googAvailableReceiveBandwidth');
                                chromeStats.availableReceiveBandwidth = AvailableReceiveBandwidth ;
                                var BucketDelay = res.stat('googBucketDelay');
                                var TransmitBitrate = res.stat('googTransmitBitrate');
                                chromeStats.transmitBitrate = TransmitBitrate ;
                            } else if (res.type == 'ssrc' && res.stat('audioOutputLevel')) {  //audio
                                var audiopacketsReceived = res.stat('packetsReceived');
                                var audiopacketsLost = res.stat('packetsLost');
                                var audiobyteReceived = res.stat('bytesReceived');
                                var audioOutputLevel = res.stat('audioOutputLevel');
                                var audioJitterReceived = res.stat('googJitterReceived');
                            } else if (res.type == 'ssrc' && res.stat('audioInputLevel')) {
                                var audioInputLevel = res.stat('audioInputLevel');
                                var audioRtt = res.stat('googRtt');
                                var EchoCancellationReturnLoss = res.stat('googEchoCancellationReturnLoss');
                                var audioCodecName = res.stat('googCodecName');
                                var EchoCancellationEchoDelayMedian = res.stat('googEchoCancellationEchoDelayMedian');
                                var EchoCancellationQualityMin = res.stat('googEchoCancellationQualityMin');
                                var EchoCancellationReturnLossEnhancement = res.stat('googEchoCancellationReturnLossEnhancement');
                                var EchoCancellationEchoDelayStdDev = res.stat('googEchoCancellationEchoDelayMedian');
                                var audiopacketsSent = res.stat('packetsSent');
                                var audiobytesSent = res.stat('bytesSent');
                            }
                        } else {
                            // Pre-227.0.1445 (188719) browser
                            if (res.local) {
                                statsString += "<p>Local ";
                                statsString += dumpStats(res.local);
                            }
                            if (res.remote) {
                                statsString += "<p>Remote ";
                                statsString += dumpStats(res.remote);
                            }
                        }
                    }

//Capturer/Sender/Receiver/Decoder/Render/RenderDroppedFrames/TragetEncoderBitrate/ActualEncoderBitrate/PacketLoss/Txbitrate/RxBitrate/SenderBandwidth/ReceiverBandwidth

                    timer = timer + 1 ;
                    chromeStats.timer = timer ;
                    newStat.timer = timer ;
                    if( doReport )
                    {
                        var result = [timer, chromeStats.sendFrameSize.width + "*" + chromeStats.sendFrameSize.height , chromeStats.captureFrameRate  , chromeStats.sendFrameRate , chromeStats.videoStats.local.renderRate , chromeStats.videoStats.local.dropRate, chromeStats.recieveFrameRate  , chromeStats.decodeFramRate , chromeStats.videoStats.remote.renderRate , chromeStats.videoStats.remote.dropRate , chromeStats.targetEncodingBitRate  , chromeStats.actualEncodingBitRate , chromeStats.packetSendRate  , chromeStats.packetReceiveRate , chromeStats.packetsLost , chromeStats.sendBitRate, chromeStats.bitRate ,chromeStats.availableSentBandwidth  , chromeStats.availableReceiveBandwidth , chromeStats.transmitBitrate ];
                        retArr.push( newStat );
                        log(result.join(","));
                        dumpBlob += result.join("\0") + "\n";
                        //statsArray.push(chromeStats);

                    }

                    //if($('workload-done').innerHTML != "<font color=#FF0000>" + "Data collection started!" + "</font>") {
                    //    $('workload-done').innerHTML = "<font color=#FF0000>" + "Data collection started!" + "</font>";
                    //}
                    //}
                    //else if (workloadcounter == 180 ) {
                    //    $('workload-output').innerHTML += TextBlob;
                    //    $('workload-done').innerHTML = "<font color=#FF0000>" + "Data collection done!" + "</font>";
                    //    var tempBlob = new Blob([dumpBlob], { type: 'octet/stream'});
                    //    tempUrl = window.webkitURL.createObjectURL(tempBlob);
                    //    alert("Collection Done!");
                    // }

                    //}
                });

            } else {
                //log('No stats function. Use at least Chrome 24.0.1285');
            }
        } else {
            //log('Not connected yet');
        }
    }
}



function logError(error){
    console.log(error);
}


// This method initiate input fields (OS,Device,...) based on experiment settings or from previous experiment
function initInputFields(){
    var OSType = "Unknown";
    var OSVersion = "";
    var index = -1 ;
    var ua = navigator.userAgent;
    // Find OS
    if ( ua.match(/iPad/i) || ua.match(/iPhone/i) )
    {
        OSType = "iOS";
        index  = ua.indexOf( "OS " );
    }
    else if ( ua.match(/Android/i) )
    {
        OSType = "Android";
        index  = ua.indexOf( "Android " );
    }
    else
    {
        if (ua.indexOf("Windows NT 6.3") != -1) OSType="Windows 8.1";
        if (ua.indexOf("Windows NT 6.2") != -1) OSType="Windows 8";
        if (ua.indexOf("Windows NT 6.1") != -1) OSType="Windows 7";
        if (ua.indexOf("Windows NT 6.0") != -1) OSType="Windows Vista";
        if (ua.indexOf("Windows NT 5.1") != -1) OSType="Windows XP";
        if (ua.indexOf("Windows NT 5.0") != -1) OSType="Windows 2000";
        if (ua.indexOf("Mac")!=-1) OSType="Mac/iOS";
        if (ua.indexOf("X11")!=-1) OSType="UNIX";
        if (ua.indexOf("Linux")!=-1) OSType="Linux";
    }
    // Find OS version
    if ( OSType === 'iOS'  &&  index > -1 )
    {
        OSVersion = ua.substr( index + 3, 3 ).replace( '_', '.' );
    }
    else if ( OSType === 'Android'  &&  index > -1 )
    {
        OSVersion = ua.substr( index + 8, 3 );
    }

    if( localStorage.getItem('operating-system') == null)
    {
        window.get('operating-system').value = OSType + " " + OSVersion;
    }
    else
    {
        window.get('operating-system').value = localStorage.getItem('operating-system');
    }
    window.get('processor').value = localStorage.getItem('processor');
    // Find browser type
    if( localStorage.getItem('browser')  == null )
    {
        window.get('browser').value= (function(){
            var ua= navigator.userAgent||navigator.vendor||window.opera, tem,
                M= ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*([\d\.]+)/i) || [];
            if(/trident/i.test(M[1])){
                tem=  /\brv[ :]+(\d+(\.\d+)?)/g.exec(ua) || [];
                return 'IE '+(tem[1] || '');
            }
            M= M[2]? [M[1], M[2]]:[navigator.appName, navigator.appVersion, '-?'];
            if((tem= ua.match(/version\/([\.\d]+)/i))!= null) M[2]= tem[1];
            return M.join(' ');
        })();
    }
    else
    {
        window.get('browser').value = localStorage.getItem('browser');
    }
    if( localStorage.getItem('device') != null )
    {
        window.get('device').selectedIndex = localStorage.getItem('device');
    }
    if( localStorage.getItem('verbose') != null ){
        if( localStorage.getItem('verbose') == "true" ) {
            window.get('verboseButton').className = "on";
            window.get('verboseButton').value = "Yes";
            eventLogger.isVerbose = true;
        }
        else {
            window.get('verboseButton').className = "off";
            window.get('verboseButton').value = "No";
            eventLogger.isVerbose = false;
        }
    }
    if( localStorage.getItem('sendEvents') != null ){
        if( localStorage.getItem('sendEvents') == "true" ) {
            window.get('sendButton').className = "on";
            window.get('sendButton').value = "Yes";
            sendEvents = true;
        }
        else {
            window.get('sendButton').className = "off";
            window.get('sendButton').value = "No";
            sendEvents = false ;
        }
    }
    if( localStorage.getItem('videoStats') != null ){
        if( localStorage.getItem('videoStats') == "true" ) {
            window.get('vStatsButton').className = "on";
            window.get('vStatsButton').value = "Yes";
            videoStats = true;
        }
        else {
            window.get('vStatsButton').className = "off";
            window.get('vStatsButton').value = "No";
            videoStats = false ;
        }
    }
    if( localStorage.getItem('dataStats') != null ){
        if( localStorage.getItem('dataStats') == "true" ) {
            window.get('dStatsButton').className = "on";
            window.get('dStatsButton').value = "Yes";
            dataStats = true;
        }
        else {
            window.get('dStatsButton').className = "off";
            window.get('dStatsButton').value = "No";
            dataStats = false ;
        }
    }

    //



}

//This function gets current time in milliseconds
function time(){
	return Date.now();
}

//This method send events to server
function sendEventLogs(){
	if (!signallingSocket) return;
	log("Sending event Logs To Server");
	eventLogs["device"]= window.get("device").value+ " " + window.get("processor").value;
	eventLogs["network-type"]= window.get("network-type").value;
	eventLogs["operating-system"]= window.get("operating-system").value;
	eventLogs["browser"]= window.get("browser").value;
	eventLogs["channel"]= window.get("channelId").value;
	eventLogs["isCaller"]= isCaller;
	eventLogs["timestamp"]= window.get("timestamp").value;
	eventLogs["session-type"]= window.get("session-type").value;
    if( videoStats ){
        //eventLogs["videoStats"] = statsArray ;
    }
//	signallingSocket.emit('events',update);
}


function sendFile () {

    var f = get('fileSelector').files[0];
    if (f) {
        var sendBlob = new Blob;
        // Send file info name, type, size
        dataChannel.send(JSON.stringify({message:'File' , name: f.name, size: f.size, type: f.type}));
        if (detectedBrowser === 'Firefox') {
            var reader = new FileReader();
            reader.onload = function (file) {
                if (reader.readyState == FileReader.DONE) {
                    sendBlob = file.target.result;
                    log("Started Sending file at " + time().toString());

                    //TODO out-of-order channel
                    dataChannel.send(sendBlob);
                }
            };
            //reader.readAsDataURL(f);
            reader.readAsArrayBuffer(f);
        }
        else {
            var chunkSize = 16384;
            var sliceFile = function (offset) {
                var reader = new FileReader();
                reader.onload = (function () {
                    return function (e) {
                        dataChannel.send(e.target.result);
                        if (f.size > offset + e.target.result.byteLength) {
                            window.setTimeout(sliceFile, 0, offset + chunkSize);
                        }
                    };
                })(f);
                var slice = f.slice(offset, offset + chunkSize);
                reader.readAsArrayBuffer(slice);
            };
            sliceFile(0);
        }
    }
};




//This method will be called by caller side, and initiate a WebRTC connection
    function initConnection(caller) {
        var userName = get("username");
        localName = userName.value || ("AnonUser" + Math.round(Math.random() * 1000 + Math.random() * 65));
        get("welcome").innerHTML = "Welcome " + localName;
        userName.disabled = true;
        userName.style.display = "none";
        eventLogger.verbose(events.Events.CREATING_PC, time());
        // create the WebRTC peer connection object

        options = undefined; // For interoperability between Chrome and FF32+
        options = {
            mandatory: { googIPv6: true }
        };
        var options = {
            "optional": [
                {DtlsSrtpKeyAgreement: true}//,
                //{RtpDataChannels: getData}
            ],
            mandatory: { googIPv6: true }
        };
        peerConnection = new RTCPeerConnection(null, options);//server, options);
        eventLogger.verbose(events.Events.PC_CREATED, time());
        peerConnection.oniceconnectionstatechange = function (ice_state) {

			if(peerConnection == null) return;

            //log(peerConnection.iceGatheringState + " " + peerConnection.iceConnectionState);
            if (peerConnection.iceConnectionState == "connected") {
                eventLogger.info(events.Events.ICE_CONNECTED, time());
            }
            if (peerConnection.iceConnectionState == "completed") {
                eventLogger.info(events.Events.ICE_COMPLETED, time());
            }
			if (peerConnection.iceConnectionState == "disconnected") {
				eventLogger.info(events.Events.ICE_COMPLETED, time());
                downloadVideoQualityData();
            }

        };



        // this handler sends ice candidates to other peer
        peerConnection.onicecandidate = function (iceEvent) {
            eventLogger.verbose(events.Events.NEW_ICE_CANDIDATE, time());
            if (iceEvent.candidate) {
                signallingSocket.emit("message",
                    JSON.stringify({
                        channel: get('channelId').value,
                        type: "new_ice_candidate",
                        candidate: iceEvent.candidate
                    })
                );
                if (detectedBrowser == "Firefox") {
                    //peerConnection.onicecandidate = null ;
                }
            }
        };
        if (getVideo || getAudio || receiveAudio || receiveVideo) {
            peerConnection.onaddstream = function (event) {
                eventLogger.info(events.Events.REMOTE_STREAM_ARRIVED, time());
                remoteStreamArrived = true;
                var media = document.createElement(receiveAudio && !receiveVideo ? 'audio' : 'video');
                media.setAttribute("Width", "640");
                media.setAttribute("Height", "480");
                media.id = "remoteView0";
                var status = document.createElement('div');
                status.id = "rmtStatus";

                if (detectedBrowser == "Chrome") {
                    media.src = webkitURL.createObjectURL(event.stream);
                    media.autoplay = true;
                } else {
                    if (window.URL) {
                        media.src = window.URL.createObjectURL(event.stream);
                    } else {
                        media.src = stream;
                    }
                    media.play();
                }

                var interval_r;
                media.addEventListener('play', function () {
                    interval_r = setInterval(function () {
                        if (media.videoWidth != 0) {
                            clearInterval(interval_r);
                            eventLogger.info(events.Events.REMOTE_PLAYBACK_STARTED, time());
                            log("W:" + media.videoWidth + " H:" + media.videoHeight);
                            if (sendEvents && ( !getData || (getData && dataChannelOpened) ) && !videoStats) {
                                sendEventLogs();
                            }
                        }
                    }, 50);

                }, false);
                window.get("remote-streams").appendChild(media);
                window.get("remote-streams").appendChild(status);


                if (videoStats) {
                    var decBitRateData = {
                        labels: [],
                        datasets: [
                            {
                                label: "Decoder Bitrate",
                                fillColor: "rgba(220,220,220,0.2)",
                                strokeColor: "rgba(220,220,220,1)",
                                pointColor: "rgba(220,220,220,1)",
                                pointStrokeColor: "#fff",
                                pointHighlightFill: "#fff",
                                pointHighlightStroke: "rgba(220,220,220,1)",
                                data: []
                            }
                        ]
                    };

                    var decFrameRateData = {
                        labels: [],
                        datasets: [
                            {
                                label: "Decoder FPS",
                                fillColor: "rgba(220,220,220,0.2)",
                                strokeColor: "rgba(220,220,220,1)",
                                pointColor: "rgba(220,220,220,1)",
                                pointStrokeColor: "#fff",
                                pointHighlightFill: "#fff",
                                pointHighlightStroke: "rgba(220,220,220,1)",
                                data: []
                            }
                        ]
                    };

                    var decResData = {
                        labels: [],
                        datasets: [
                            {
                                label: "Decoded Video Resolution",
                                fillColor: "rgba(220,220,220,0.2)",
                                strokeColor: "rgba(220,220,220,1)",
                                pointColor: "rgba(220,220,220,1)",
                                pointStrokeColor: "#fff",
                                pointHighlightFill: "#fff",
                                pointHighlightStroke: "rgba(220,220,220,1)",
                                data: []
                            }
                        ]
                    };

                    var collectionData = [ ];
                    var stepsRemained = WAITING_STEPS;
                    var videostatCollector = setInterval(function () {

						if(peerConnection === null)clearInterval(videostatCollector);
						
                        remoteVideo = get('remoteView0');
                        if (remoteVideo) {
				//console.log("DEC:"+stepsRemained+"\n");
                            if (stepsRemained === 0) {
                                --stepsRemained;
                                if (detectedBrowser == "Chrome")
                                    log("Capturer/Sender/LocalRender/LocalRenderDropped/Receiver/Decoder/Render/RenderDroppedFrames/TragetEncoderBitrate/ActualEncoderBitrate/PacketsSent/PacketsReceived/PacketLoss/Txbitrate/RxBitrate/AvbSent/AvbReceived/TransmitBitrate");
                                //else if ( detectedBrowser == "Firefox")
                                //    log("PacketsSent/PacketsReceived/PacketLoss/Txbitrate/RxBitrate");
                            } else if (stepsRemained == -1 * COLLECTION_STEPS || peerConnection === null) {
                                --stepsRemained;
                                get("rmtStatus").innerHTML = remoteVideo.videoWidth + "x" + remoteVideo.videoHeight + "<br>" +
                                    "Stats finished ";


                                for (i = 0; i < collectionData.length; ++i) {
                                    cdata = collectionData[i];

                                    //Decoder

                                    decBitRateData.labels.push(parseInt(cdata.timer));
                                    decBitRateData.datasets[0].data.push(cdata.receiver.bitRate);

                                    decFrameRateData.labels.push(parseInt(cdata.timer));
                                    decFrameRateData.datasets[0].data.push(cdata.receiver.frameRate);

                                    decResData.labels.push(parseInt(cdata.timer));
                                    decResData.datasets[0].data.push(cdata.receiver.height * cdata.receiver.width);


                                }

                                var ctx = document.getElementById("chartDecBitRate").getContext("2d");
                                var brChart = new Chart(ctx).Line(decBitRateData, {responsive: true, maintainAspectRatio: false, scaleShowLabels: true});
                                var ctx2 = document.getElementById("chartDecFPS").getContext("2d");
                                var frChart = new Chart(ctx2).Line(decFrameRateData, {responsive: true, maintainAspectRatio: false, scaleShowLabels: true});
                                var ctx3 = document.getElementById("chartDecRes").getContext("2d");
                                var rChart = new Chart(ctx3).Line(decResData, {responsive: true, maintainAspectRatio: false, scaleShowLabels: true});

                                //log(JSON.stringify(decFrameRateData));


                                sendEventLogs();
                            }
                            else if (stepsRemained < 0) {
                                --stepsRemained;
                                get("rmtStatus").innerHTML = remoteVideo.videoWidth + "x" + remoteVideo.videoHeight;
                            } else {
                                --stepsRemained;
                                get("rmtStatus").innerHTML = remoteVideo.videoWidth + "x" + remoteVideo.videoHeight + "<br>" +
                                    "Stats begin in " + stepsRemained + " seconds";
                            }
                            if (stepsRemained <= 0 && stepsRemained > -1 * COLLECTION_STEPS)
                                collectStats(true, collectionData);
                            else
                                collectStats(false, collectionData);
                        }


                    }, 1000);
                }
            };
            peerConnection.onremovestream = function (event) {
                log('Remote stream removed.');
            };
            if (getAudio || getVideo)
                getMedia();
        }
        if (getData) {
            // var onMessage = function (event) {
            //     var t_msg = time();
            //     appendDIV(event.data);
            //     log("Text message received at " + t_msg.toString());
            // };
            function tryParseJSON (jsonString){
                try {
                    var o = JSON.parse(jsonString);

                    // Handle non-exception-throwing cases:
                    // Neither JSON.parse(false) or JSON.parse(1234) throw errors, hence the type-checking,
                    // but... JSON.parse(null) returns 'null', and typeof null === "object",
                    // so we must check for that, too.
                    if (o && typeof o === "object" && o !== null) {
                        return o;
                    }
                }
                catch (e) { }

                return false;
            };
            var onMessage = function (event) {
                var t_msg = time();
                var blob = event.data;
                if (typeof blob === "object") {

                    if( detectedBrowser === 'Firefox'){ // Firefox allows sending blobs with no size limit
                        var blob = new Blob([event.data], {type: receivedFileInfo.type });

                        log("File received at " + time().toString());
                        console.log("File gotten");
                        dataChannel.send( "pong " + time());
                        get('download-file').href =  URL.createObjectURL(blob) ;
                        get('download-file').download =  receivedFileInfo.name ;
                    } else { // receive it with multiple chunks
                        receiveFileBuffer.push(event.data);
                        receivedFileInfo.receivedBytes += event.data.byteLength;
                        if (receivedFileInfo.receivedBytes === receivedFileInfo.size) {


                            var received = new window.Blob(receiveFileBuffer , {type: receivedFileInfo.type });
                            get('download-file').href =  URL.createObjectURL(received) ;
                            get('download-file').download =  receivedFileInfo.name ;
                            //
                            receiveFileBuffer = [];
                            console.log("File gotten");
                            dataChannel.send( "pong " + time());
                        }
                    }

                }
                else {
                    var json = tryParseJSON(blob.toString()) ;
                    if ( json ){
                        log( blob.toString() );
                        if( json.message === 'Ping' ){
                            dataChannel.send( JSON.stringify( { message:"Pong" , timestamp: time() }) );
                        } else if (json.message === 'Pong') {
                            log( blob.toString() + " received at " + json.timestamp );
                        } else if ( json.message  === 'File') {
                            //log( blob.toString() + " received at " + json.timestamp );
                            receivedFileInfo.name = json.name ;
                            receivedFileInfo.size = json.size;
                            receivedFileInfo.type = json.type ;
                            receivedFileInfo.receivedBytes = 0 ;
                        }
                    }
                    else {
                        log("text received at " + t_msg.toString());
                        appendDIV(event.data);
                    }


                }
            };
            var dcOpened = function () {
                eventLogger.info(events.Events.DATA_CHANNEL_OPENED, time());
                get('chat-input').disabled = false;
                dataChannelOpened = true;
                if (sendEvents && !videoStats && (  (!getAudio && !getVideo) || remoteStreamArrived )) {
                    sendEventLogs();
                }
                get('sendbtn').onclick = sendFile ;
                get('pingbtn').onclick = function() { dataChannel.send( JSON.stringify({type : 'Ping'}) ); };
            };
            if (caller) {
                var dataChannelOptions = dcOrdered ? {
                    ordered: true
                } : {
                    ordered: false, // do not guarantee order
                    maxRetransmitTime: 3000 // in milliseconds
                };
                dataChannel = peerConnection.createDataChannel("dc1", dataChannelOptions);
                eventLogger.verbose(events.Events.CREATING_DATA_CHANNEL, time());
                dataChannel.onerror = function (error) {
                    log("Data Channel Error:" + error);
                };
                dataChannel.onmessage = onMessage;
                dataChannel.onopen = dcOpened;
                dataChannel.onclose = function () {
                    log("The Data Channel is closed");
                };
            }
            else {
                peerConnection.ondatachannel = function (e) {
                    get('chat-input').disabled = false;
                    dataChannel = e.channel;
                    eventLogger.verbose(events.Events.CREATING_DATA_CHANNEL, time());
                    dataChannel.onerror = function (error) {
                        log("Data Channel Error:", error);
                    };
                    dataChannel.onmessage = onMessage;
                    dataChannel.onopen = dcOpened;
                    dataChannel.onclose = function () {
                        log("The Data Channel is closed");
                    };
                }
            }

            if (dataStats) {
                var statCollector = setInterval(function () {
                    if (dataChannelOpened) {
                        //if (detectedBrowser == "Chrome") {
                        collectDataChannelStats();
                        //}
                    }
                }, 1000);
            }

        }
        // Open Connection to Signalling Server
        var signallingServer = location.origin ;
        var channelId = window.get("channelId").value;
        var sender = Math.round(Math.random() * 60535) + 5000;
        eventLogger.verbose(events.Events.CONNECTING_TO_SIGNALLING_SERVER, time());
        signallingSocket = io.connect(signallingServer);
        signallingSocket.on('connect', function () {
            eventLogger.verbose(events.Events.CONNECTED_TO_SIGNALLING_SERVER, time());
            signallingSocket.emit("channel", channelId);
        });
        if (caller) {
            signallingSocket.on('message', function (event) {
                callerSignalHandler(event);
            });
        }
        else {
            signallingSocket.on('message', function (data) {
                calleeSignalHandler(data);
            });
        }
    }

    function onNewDescriptionCreatedAnswer(description) {
        if (caller) {
            eventLogger.info(events.Events.OFFER_CREATED, time().toString());
        }
        else {
            eventLogger.info(events.Events.ANSWER_CREATED, time().toString());
        }

        if (h264 && (!description.sdp.match(/a=rtpmap:[0-9]+ H264/g))) {
            log("No H264 found in the answer!!!");
        }

        peerConnection.setLocalDescription(description, function () {
                signallingSocket.emit("message",
                    JSON.stringify({
                        channel: get('channelId').value,
                        type: "new_description",
                        sdp: description
                    })
                );
            },
            logError
        );
    }

    function onNewDescriptionCreatedOffer(description) {
        if (caller) {
            eventLogger.info(events.Events.OFFER_CREATED, time().toString());
        }
        else {
            eventLogger.info(events.Events.ANSWER_CREATED, time().toString());
        }


        if (h264) {
            description.sdp = mozRemoveVP8(description.sdp)
        }
        if (vp9) {
            description.sdp = googmakeVp9Default(description.sdp);
        }

        peerConnection.setLocalDescription(description, function () {
                signallingSocket.emit("message",
                    JSON.stringify({
                        channel: get('channelId').value,
                        type: "new_description",
                        sdp: description
                    })
                );
            },
            logError
        );
    }


    function onAddIceCandidateSuccess() {
        log('AddIceCandidate success.');
    }

    function onAddIceCandidateError(error) {
        log('Failed to add Ice Candidate: ' + error.toString());
    }


// handle signals received by caller
    function callerSignalHandler(event) {
        var signal = JSON.parse(event);
        if (signal.type === "callee_arrived") {
            eventLogger.info(events.Events.CALLEE_ARRIVED, time());
            eventLogger.info(events.Events.CREATING_OFFER, time());
            peerConnection.createOffer(
                onNewDescriptionCreatedOffer,
                logError
            );
        } else if (signal.type === "new_ice_candidate") {
            peerConnection.addIceCandidate(
                new RTCIceCandidate(signal.candidate),
                onAddIceCandidateSuccess, onAddIceCandidateError
            );
        } else if (signal.type === "new_description") {
            log("caller");
            eventLogger.verbose(events.Events.SETTING_REMOTE_DESCRIPTION, time());
            console.log(signal.sdp);
            peerConnection.setRemoteDescription(
                new RTCSessionDescription(signal.sdp),
                function () {
                    eventLogger.verbose(events.Events.REMOTE_DESCRIPTION_SET, time());
                },
                logError
            );
        }
    }

// handle signals received by callee
    function calleeSignalHandler(event) {
        var signal = JSON.parse(event);
        if (signal.type === "new_ice_candidate") {
            peerConnection.addIceCandidate(
                new RTCIceCandidate(signal.candidate),
                onAddIceCandidateSuccess, onAddIceCandidateError
            );
        } else if (signal.type === "new_description") {
            log("callee");
            eventLogger.verbose(events.Events.SETTING_REMOTE_DESCRIPTION, time());
            peerConnection.setRemoteDescription(
                new RTCSessionDescription(signal.sdp),
                function () {
                    eventLogger.verbose(events.Events.REMOTE_DESCRIPTION_SET, time());
                    if (peerConnection.remoteDescription.type == "offer") {
                        eventLogger.verbose(events.Events.CREATING_ANSWER, time());
                        peerConnection.createAnswer(onNewDescriptionCreatedAnswer, logError);
                    }
                }, logError);
        }
    }

// Get User Media
    function getMedia() {
        eventLogger.verbose(events.Events.GETTING_MEDIA, time());
        var video_constraints = !defaultConstratints ? HD ? {optional: [], mandatory: {minHeight: 720, minWidth: 1280}} : VGA ? {optional: [], mandatory: { minFrameRate: 30, maxHeight: 480, maxWidth: 640, minHeight: 480, minWidth: 640}} : {optional: [], mandatory: { minFrameRate: 30, maxHeight: 240, maxWidth: 320}} : true;
        var moz_video_constraints = {

                width: { min: 1280, max:1280 }

        };
       // if( detectedBrowser == "Firefox" && mozFakeVideo ){
        //    var vwc = window.get("wv");
        //    log(vwc);
         //   streaming(vwc.mozCaptureStream());




        //} else {
            getUserMedia(
                ( detectedBrowser == "Firefox"  ) ? //(Resolution) is not supported by FF yet
                {
                    audio: getAudio ? true : false,
                    video: getVideo ? moz_video_constraints : false,
                    fake: mozFakeVideo
                } :
                {
                    audio: getAudio ? true : false,
                    video: getVideo ? video_constraints : false
                }
                , streaming, function (e) {
                    console.error(e);
                    log(e);
                });
       // }
        function streaming(stream) {
            eventLogger.verbose(events.Events.LOCAL_MEDIA_CAPTURED, time());
            var localMedia = document.createElement((getAudio && !getVideo) ? 'audio' : 'video');
            if (getVideo) {
                 localMedia.setAttribute("width", "640");
                  localMedia.setAttribute("height", "480");
            }
            localMedia.id = "localView";
            if (detectedBrowser == "Chrome") {
                localMedia.src = webkitURL.createObjectURL(stream);
                localMedia.autoplay = true;
            } else {
                if (window.URL) {
                    localMedia.src = window.URL.createObjectURL(stream);
                } else {
                    localMedia.src = stream;
                }
            }

            var status = document.createElement('div');
            status.id = "localStatus";




            //  localMedia.addEventListener('play', function () {
            ///      log("onplaying @" + time() );
            //   }, false);


            //  localMedia.addEventListener('canplay', function () {
            //      log("oncanplay @" + time() );
            //  }, false);

            localMedia.addEventListener('canplaythrough', function () {
                log("canplaythrough @" + time() );
            }, false);



            localMedia.play();
            peerConnection.addStream(stream);


            // SENDER STATS
            if (videoStats) {
                if (receiveVideo === true) {
                    var collectionData = [];
                    var stepsRemained = WAITING_STEPS;

                    var encBitRateData = {
                        labels: [],
                        datasets: [
                            {
                                label: "Encoder Bitrate",
                                fillColor: "rgba(220,220,220,0.2)",
                                strokeColor: "rgba(220,220,220,1)",
                                pointColor: "rgba(220,220,220,1)",
                                pointStrokeColor: "#fff",
                                pointHighlightFill: "#fff",
                                pointHighlightStroke: "rgba(220,220,220,1)",
                                data: []
                            },
                            {
                                label: "Encoder Bitrate Target",
                                fillColor: "rgba(151,187,205,0.2)",
                                strokeColor: "rgba(151,187,205,1)",
                                pointColor: "rgba(151,187,205,1)",
                                pointStrokeColor: "#fff",
                                pointHighlightFill: "#fff",
                                pointHighlightStroke: "rgba(151,187,205,1)",
                                data: []
                            }
                        ]
                    };

                    var encFrameRateData = {
                        labels: [],
                        datasets: [
                            {
                                label: "Capture FPS",
                                fillColor: "rgba(120,120,120,0.2)",
                                strokeColor: "rgba(100,120,120,1)",
                                pointColor: "rgba(120,120,120,1)",
                                pointStrokeColor: "#fff",
                                pointHighlightFill: "#fff",
                                pointHighlightStroke: "rgba(120,120,120,1)",
                                data: []
                            } ,
                            {
                                label: "Encoder FPS",
                                fillColor: "rgba(220,220,220,0.2)",
                                strokeColor: "rgba(220,220,220,1)",
                                pointColor: "rgba(220,220,220,1)",
                                pointStrokeColor: "#fff",
                                pointHighlightFill: "#fff",
                                pointHighlightStroke: "rgba(220,220,220,1)",
                                data: []
                            }
                        ]
                    };


                    var encResoloutionData = {
                        labels: [],
                        datasets: [
                            {
                                label: "Capture Res",
                                fillColor: "rgba(120,120,120,0.2)",
                                strokeColor: "rgba(100,120,120,1)",
                                pointColor: "rgba(120,120,120,1)",
                                pointStrokeColor: "#fff",
                                pointHighlightFill: "#fff",
                                pointHighlightStroke: "rgba(120,120,120,1)",
                                data: []
                            } ,
                            {
                                label: "Encoder Res",
                                fillColor: "rgba(220,220,220,0.2)",
                                strokeColor: "rgba(220,220,220,1)",
                                pointColor: "rgba(220,220,220,1)",
                                pointStrokeColor: "#fff",
                                pointHighlightFill: "#fff",
                                pointHighlightStroke: "rgba(220,220,220,1)",
                                data: []
                            }
                        ]
                    };

                    var statCollector = setInterval(function () {
						if(peerConnection === null)clearInterval(statCollector);
			//console.log("ENC:"+stepsRemained+"\n");
                        if (stepsRemained === 0) {
                            --stepsRemained;
                            if (detectedBrowser == "Chrome")
                                log("Capturer/Sender/LocalRender/LocalRenderDropped/Receiver/Decoder/Render/RenderDroppedFrames/TragetEncoderBitrate/ActualEncoderBitrate/PacketsSent/PacketsReceived/PacketLoss/Txbitrate/RxBitrate/AvbSent/AvbReceived/TransmitBitrate");
                            //else if (detectedBrowser == "Firefox")
                            //     log("PacketsSent/PacketsReceived/PacketLoss/Txbitrate/RxBitrate");

                        } else if (stepsRemained == -1 * COLLECTION_STEPS || peerConnection === null) {
                            --stepsRemained;
                            get("localStatus").innerHTML = localMedia.videoWidth + "x" + localMedia.videoHeight + "<br>" +
                                "Stats finished ";
                            // Prepare the charts
                            for (i = 0; i < collectionData.length; ++i) {
                                cdata = collectionData[i];
                                if (true) {
                                    if (detectedBrowser == "Chrome") {
                                        encBitRateData.labels.push(parseInt(cdata.timer));
                                        encBitRateData.datasets[0].data.push(cdata.sender.bitRate);
                                        encBitRateData.datasets[1].data.push(cdata.sender.googTargetEncoderBitRate);


                                        encResoloutionData.labels.push(cdata.timer);
                                        encResoloutionData.datasets[0].data.push(cdata.sender.inputWidth * cdata.sender.inputHeight);
                                        encResoloutionData.datasets[1].data.push(cdata.sender.width * cdata.sender.height);


                                        encFrameRateData.labels.push(parseInt(cdata.timer));
                                        encFrameRateData.datasets[0].data.push(cdata.sender.inputFrameRate);
                                        encFrameRateData.datasets[1].data.push(cdata.sender.frameRate);
                                    } else {
                                        encBitRateData.labels.push(parseInt(cdata.timer));
                                        encBitRateData.datasets[0].data.push(cdata.sender.bitRate);

                                        encResoloutionData.labels.push(cdata.timer);
                                        encResoloutionData.datasets[0].data.push(localMedia.videoWidth * localMedia.videoHeight);

                                        encFrameRateData.labels.push(parseInt(cdata.timer));
                                        encFrameRateData.datasets[0].data.push(cdata.sender.frameRate);
                                    }

                                }

                            }

                            var ctx = document.getElementById("chartEncBitRate").getContext("2d");
                            var myNewChart = new Chart(ctx).Line(encBitRateData, {responsive: true, maintainAspectRatio: false, scaleShowLabels: true});
                            var ctx2 = document.getElementById("chartEncFPS").getContext("2d");
                            var myNewChart2 = new Chart(ctx2).Line(encFrameRateData, {responsive: true, maintainAspectRatio: false, scaleShowLabels: true});
                            var ctx3 = document.getElementById("chartEncRes").getContext("2d");
                            var myNewChart3 = new Chart(ctx3).Line(encResoloutionData, {responsive: true, maintainAspectRatio: false, scaleShowLabels: true});

                            sendEventLogs();
                        }
                        else if (stepsRemained < 0) {
                            --stepsRemained;
                            get("localStatus").innerHTML = localMedia.videoWidth + "x" + localMedia.videoHeight;
                        } else {
                            --stepsRemained;
                            get("localStatus").innerHTML = localMedia.videoWidth + "x" + localMedia.videoHeight + "<br>" +
                                "Stats begin in " + stepsRemained + " seconds";
                        }

                        if (stepsRemained <= 0 && stepsRemained > -1 * COLLECTION_STEPS) {
                            collectStats(true, collectionData);
                        }
                        else
                            collectStats(false, collectionData);



                    }, 1000);
                }
            }
            window.get("local-streams").appendChild(localMedia);
            window.get("local-streams").appendChild(status);
        }
}





//legend(document.getElementById('bitRateLegend'), data);

