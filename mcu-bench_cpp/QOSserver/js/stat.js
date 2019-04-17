/*
This file could help you collect the video data and
get some parameters about your peer connection
*/

var video1;
var video2;
var datacanvas = document.getElementById("data-canvas");
var hiddenctx = datacanvas.getContext("2d");

var messages = "";
var repeatInterval = 3000; // 2000 ms == 2 seconds
var repeatTagInterval = 30 ; // 2000 ms == 2 seconds
var uploadTimeInterval = 3000;
var repeatFpsInterval = 1000;
var repeatBitrateInterval = 1000;
var TestTime = 10000;
var videoMixRawData = new Array(); //store data
var videoLocalTagData = new Array(); //store data
var videoMixTagData = new Array();
//new
var videoFpsData = new Array();
var videoBiterateData = new Array();





var tagWidth = 240;
var tagHeight = 60;

var vrdTimeID = 0;
var vtdTimeID = 0;
var stdTimeID = 0;
var uploadTimeId = 0;
//new
var fpsdTimeID = 0;
var brdTimeID = 0;


var jChart = null;
var lChart = null;
/*var qChart = null;
var qChart2 = null;
var qChart3 = null;*/
var pChart = null;
var vChart = null;
var NRChart = null;
var NRChart2 = null;
var NRChart3 = null;
var NRChart4 = null;
var NRChart5 = null;
var NRChart6 = null;
//new
var fChart = null;
var bChart = null;

var membercount = 0;
var roomsize =0; //2x2
var iamgeNeedwidth=0;
var numbertagwidth=0;
var iamgeNeedheight=0;
var numbertagheight=0;

window.chartColors = {
    red: 'rgb(255, 99, 132)',
    orange: 'rgb(255, 159, 64)',
    green: 'rgb(75, 192, 192)',
    blue: 'rgb(0, 64, 255)',
    purple: 'rgb(153, 102, 255)',
    grey: 'rgb(201, 203, 207)',
    yellow: 'rgb(255, 255, 0)',
    black: 'rgb(0,0,0)',
    skyblue: 'rgb(0,255,255)',
    bloodred: 'rgb(255,64,0)',
    lightgreen: 'rgb(0,255,0)'
    };

/*
 * doSave is a function
 * which could help you download your file
 * so that you could save your data in an array
 * then automatically download it
 */
function doSave(value, type, name) {
    var blob;
    if (typeof window.Blob == "function") {
        blob = new Blob([value], {type: type});
    } else {
        var BlobBuilder = window.BlobBuilder || window.MozBlobBuilder || window.WebKitBlobBuilder || window.MSBlobBuilder;
        var bb = new BlobBuilder();
        bb.append(value);
        blob = bb.getBlob(type);
    }
    var URL = window.URL || window.webkitURL;
    var bloburl = URL.createObjectURL(blob);
    var anchor = document.createElement("a");
    if ('download' in anchor) {
        anchor.style.visibility = "hidden";
        anchor.href = bloburl;
        anchor.download = name;
        document.body.appendChild(anchor);
        var evt = document.createEvent("MouseEvents");
        evt.initEvent("click", true, true);
        anchor.dispatchEvent(evt);
        document.body.removeChild(anchor);
    } else if (navigator.msSaveBlob) {
        navigator.msSaveBlob(blob, name);
    } else {
        location.href = bloburl;
    }
}

/*
 * Save is a function in which
 * you collect your data in canvas
 * then store in array and download
 */
function Save(){
    if(isCaller === true) {
        // do nothing
    }
    else if(isCaller === false){
        hiddenctx.drawImage(video1, 0, 0, datacanvas.width, datacanvas.height);
        var imageData = hiddenctx.getImageData(0, 0, datacanvas.width, datacanvas.height);
        var data = imageData.data;
        var length = data.length;
        for (var i=0;i<length;i = i+4)
        {
            videoMixRawData.push(data[i] + (data[i+1] << 8) + (data[i+2] << 16) );
        }
    }
    else {
        //do nothing
        alert("wrong branch");
    }
}


function SaveLocalTag(){

    var mydate = new Date();
    var m = mydate.getTime();
    console.log("save video tag :" + m);
    videoLocalTagData.push(m);

        hiddenctx.drawImage(video2, 0, 0, datacanvas.width, datacanvas.height);
        var imageData = hiddenctx.getImageData(0, 0, tagWidth, tagHeight);
        var data = imageData.data;
        var length = data.length;
        for (var i=0;i<length;i = i+4)
        {
            videoLocalTagData.push(data[i] + (data[i+1] << 8) + (data[i+2] << 16) );
        }
}

function SaveMixRaw(){


        hiddenctx.drawImage(video1, 0, 0, datacanvas.width, datacanvas.height);
        var imageData = hiddenctx.getImageData(0, 0, iamgeNeedwidth, iamgeNeedheight);
        var data = imageData.data;
        var length = data.length;
        for (var i=0;i<length;i = i+4)
        {
            videoMixRawData.push(data[i] + (data[i+1] << 8) + (data[i+2] << 16) );
        }
}

function SaveMixTag(){

    var mydate = new Date();
    var m = mydate.getTime();
    console.log("save video tag :" + m);
    videoMixTagData.push(m);

        hiddenctx.drawImage(video1, 0, 0, datacanvas.width, datacanvas.height);
        var imageData = hiddenctx.getImageData(0, 0, numbertagwidth, numbertagheight);
        var data = imageData.data;
        var length = data.length;
        for (var i=0;i<length;i = i+4)
        {
            videoMixTagData.push(data[i] + (data[i+1] << 8) + (data[i+2] << 16) );
        }
}


function SaveVideoFps(streamid){
    //var mydate = new Date();
    //var m = mydate.getTime();
    //console.log("save fps :" + m);
    //videoFpsData.push(m);
    var streamid = streamid;
    var stream=conference.remoteStreams[streamid]
    conference.getConnectionStats(stream, function(results)
    {
        //console.log(results);
        for (var i = 0; i < results.length; ++i)
        {
            var res = results[i];
            //console.log(res);
            //console.log(res.type);
            if(res.type == "ssrc_video_recv")
            {
                videoFpsData.push(res.stats["framerate_rcvd"]);
            }
        }
    },function(error){
        console.log(error);
    });

    //var lstream = conference.localStreams[localStreamId];
    //conference.getConnectionStats(lstream, function(results)
    //{
    //  console.log(results);
    // },function(error){
    //  console.log(error);
    // });




}

function SaveVideoBitrate(streamid){
    //var mydate = new Date();
    //var m = mydate.getTime();
    //console.log("save bitrate :" + m);
    //videoBiterateData.push(m);

    var streamid = streamid;
    var stream=conference.remoteStreams[streamid]
    if(streamid==-1000){

     videoBiterateData.push(-1000);


    }
    else{
    conference.getConnectionStats(stream, function(results)
    {
        for (var i = 0; i < results.length; ++i)
        {
            var res = results[i];
            //console.log(res);
            //console.log(res.type);
            if(res.type == "ssrc_video_recv")
            {
                videoBiterateData.push(res.stats["bytes_rcvd"]);
            }
        }
    },function(error){
        console.log(error);
    });
 }
}

function receiverInitVideoQualityMeasure() {
    video1 = document.getElementById("mixed-streams").getElementsByTagName("video")[0];
    video2 = document.getElementById("myVideo").getElementsByTagName("video")[0];

    //console.log(9/2);

    //if (video1 === undefined) {alert('video1 empty');}
    //if (video2 === undefined) {alert('video2 empty');}



    membercount = getRoomMembercount();
    if(membercount==0) alert('Room member count error');

    roomsize = getSizebycount(membercount);
    if(roomsize==0) alert('roomszie=0 error!');
    //if(roomsize!=0) alert(roomsize);

    iamgeNeedwidth=Math.floor(datacanvas.width/roomsize);
    iamgeNeedheight=Math.floor(datacanvas.height/roomsize);
    //alert(iamgeNeedwidth);
    //alert(iamgeNeedheight);
    numbertagwidth=Math.floor(tagWidth/roomsize);
    numbertagheight=Math.floor(tagHeight/roomsize);

    //alert(iamgeNeedwidth);
    //alert(iamgeNeedheight);
    //alert(numbertagwidth);
    //alert(numbertagheight);

    if(video1 === undefined || video2 === undefined)
    {
        //alert('empty');
        setTimeout(function () {
            receiverInitVideoQualityMeasure();
        }, 2000);
    } else {
        //alert('ok');
        videoMixTagData.push(roomsize);
        videoMixRawData.push(roomsize);
        //videoLocalTagData.push(roomsize);
        $.ajax({
            data: {"blank" : " "},
            url: '/clear',
            type: 'post',
            cache: false,
            async: false,
            timeout: 40000,
            // success: function(data){
            //  console.log("data transmit success");
   //                              alert("Data download to server.");
            // },
            error: function(jqXHR, textStatus, errorThrown){
                alert('error : ' + textStatus + " " + errorThrown);
            }
        });
        SaveLocalvideoTagData();
        SaveMixVideoRawData();
        SaveMixvideoTagData();
        //
        SaveVideoFpsData(remoteStreamId);
        SaveVideoBitrateData(remoteStreamId);
        //downloadVideoQualityData();
        setTimeout(function () {
            downloadVideoQualityData();
        downloadVideoQualityData1();
        downloadVideoQualityData2();
        }, uploadTimeInterval);
    }
}

function getRoomMembercount(){
    var obj = conference.remoteStreams;
    var count = -1;      //romotestrems include all forward streams and mix stream
    for(var temp in obj){
        count++
    };
    return count;
}

function getSizebycount(inputparm){
    if(inputparm==1) return 1;
    if(inputparm>1 && inputparm<=4) return 2; //2x2
    if(inputparm>4 && inputparm<=9) return 3;
    if(inputparm>9) return 4;
}
/*
 * it's an API
 * User use this function to get video data
 */

/*function SaveVideoData() {
    Save();
    vrdTimeID = setTimeout(function () {
            SaveVideoData();
        }, repeatInterval);
}


/*
 * it's an API
 * User use this function to get video data
 */
function SaveLocalvideoTagData() {
    SaveLocalTag();
    stdTimeID = setTimeout(function () {
            SaveLocalvideoTagData();
        }, repeatTagInterval);
}
function SaveMixVideoRawData() {
    SaveMixRaw();
    vrdTimeID = setTimeout(function () {
            SaveMixVideoRawData();
        }, repeatInterval);
}
function SaveMixvideoTagData() {
    SaveMixTag();
    vtdTimeID = setTimeout(function () {
            SaveMixvideoTagData();
        }, repeatTagInterval);
}
function downloadVideoQualityData() {
    downloadVideoQuality();
     uploadTimeId  = setTimeout(function(){
        downloadVideoQualityData();
    },uploadTimeInterval);
}

function downloadVideoQualityData1() {
    downloadVideoQuality1();
    uploadTimeId  = setTimeout(function(){
        downloadVideoQualityData1();
    },uploadTimeInterval);
}

function downloadVideoQualityData2() {

    downloadVideoQuality2();
    uploadTimeId  = setTimeout(function(){
        downloadVideoQualityData2();
    },uploadTimeInterval);
}


//new
function SaveVideoFpsData(remoteStreamId) {
    SaveVideoFps(remoteStreamId);
    //console.log("save fps");
    fpsdTimeID = setTimeout(function () {
            SaveVideoFpsData(remoteStreamId);
        }, repeatFpsInterval);
}

function SaveVideoBitrateData(remoteStreamId) {
    SaveVideoBitrate(remoteStreamId);
    //console.log("save fps");
    brdTimeID = setTimeout(function () {
            SaveVideoBitrateData(remoteStreamId);
        }, repeatBitrateInterval);
}

function SaveVideoBitrateDataNull() {
    SaveVideoBitrate(-1000);
}
function SaveLatencyDataNull() {
    //SaveMixTag(-1000);
}

function FinaldownloadVideoQualityData() {
    clearTimeout(uploadTimeId);
    clearTimeout(vrdTimeID);
    clearTimeout(vtdTimeID);
    clearTimeout(stdTimeID);
    //new
    clearTimeout(fpsdTimeID);
    clearTimeout(brdTimeID);
    //alert('Start donwload data to server');
        var vtd = videoMixTagData.join(",");
        var vrd = videoMixRawData.join(",");
        var std = videoLocalTagData.join(",");
        var fpsd = videoFpsData.join(",");
        var brd = videoBiterateData.join(",");
        videoMixTagData.length=0;
        videoMixRawData.length=0;
        videoLocalTagData.length=0;
        videoFpsData.length=0;
        videoBiterateData.length=0;
        //alert(vtd.length+' '+vrd.length+' '+std.length);
        //var test = "shortdata test";
        $.ajax({
            data: {"vtd" : vtd, "vrd" : vrd, "std" : std , "fpsd" : fpsd , "brd" : brd},
            url: '/sender',
            type: 'post',
            cache: false,
            timeout: 400000,
            success: function(data){
                console.log("data transmit success");
                                alert("Data download to server completed.");
            },
            error: function(jqXHR, textStatus, errorThrown){
                alert('error : ' + textStatus + " " + errorThrown);
            }
        });
    //alert('Finish donwload data to server');
}

function downloadVideoQuality() {

    clearTimeout(fpsdTimeID);
    clearTimeout(brdTimeID);
    //alert('Start donwload data to server');

        var fpsd = videoFpsData.join(",");
        var brd = videoBiterateData.join(",");

        videoFpsData.length=0;
        videoBiterateData.length=0;
        //alert(vtd.length+' '+vrd.length+' '+std.length);
        //var test = "shortdata test";
        $.ajax({
            data: {"fpsd" : fpsd , "brd" : brd},
            url: '/sender',
            type: 'post',
            cache: false,
            async: true,
            timeout: 400000,
            // success: function(data){
            //  console.log("data transmit success");
   //                              alert("Data download to server.");
            // },
            error: function(jqXHR, textStatus, errorThrown){
                alert('error ***************: ' + textStatus + " " + errorThrown);
            }
        });

        SaveVideoFpsData(remoteStreamId);
        SaveVideoBitrateData(remoteStreamId);
        SaveVideoBitrateDataNull();
}







function downloadVideoQuality1() {

    clearTimeout(stdTimeID);

    //alert('Start donwload data to server');

        var std = videoLocalTagData.join(",");

        videoMixTagData.length=0;
        videoMixRawData.length=0;
        videoLocalTagData.length=0;


        $.ajax({
            data: {"std" : std},
            url: '/sender',
            type: 'post',
            cache: false,
            async: true,
            timeout: 400000,
            // success: function(data){
            //  console.log("data transmit success");
   //                              alert("Data download to server.");
            // },
            error: function(jqXHR, textStatus, errorThrown){
                alert('error ***************: ' + textStatus + " " + errorThrown);
            }
        });
        //alert('Finish donwload data to server');
        SaveLocalvideoTagData();
        SaveMixvideoTagData();
}

function startVideoQualityMeasureTesting() {
        $.ajax({
                data: {"blank" : " "},
            url: '/startTest',
            type: 'post',
            cache: false,
            async: true,
            timeout: 400000,
            // success: function(data){
            //  console.log("data transmit success");
   //                              alert("Data download to server.");
            // },
            error: function(jqXHR, textStatus, errorThrown){
            //  alert('error ***************: ' + textStatus + " " + errorThrown);
            }
               });
}

function stopVideoQualityMeasureTesting() {
        $.ajax({
                data: {"blank" : " "},
            url: '/stopTest',
            type: 'post',
            cache: false,
            async: true,
            timeout: 400000,
            // success: function(data){
            //  console.log("data transmit success");
   //                              alert("Data download to server.");
            // },
            error: function(jqXHR, textStatus, errorThrown){
                //alert('error ***************: ' + textStatus + " " + errorThrown);
            }
        });
        //alert('Finish donwload data to server');
}


function downloadVideoQuality2() {

    clearTimeout(vtdTimeID);

    //alert('Start donwload data to server');
        var vtd = videoMixTagData.join(",");
        var vrd = videoMixRawData.join(",");
        var std = videoLocalTagData.join(",");

        videoMixTagData.length=0;
        videoMixRawData.length=0;
        videoLocalTagData.length=0;


        $.ajax({
            data: {"vtd" : vtd},
            url: '/sender',
            type: 'post',
            cache: false,
            async: true,
            timeout: 400000,
            // success: function(data){
            //  console.log("data transmit success");
   //                              alert("Data download to server.");
            // },
            error: function(jqXHR, textStatus, errorThrown){
                alert('error ***************: ' + textStatus + " " + errorThrown);
            }
        });
        //alert('Finish donwload data to server');
        SaveLocalvideoTagData();
        SaveMixvideoTagData();
}





function getResultFolder(){
    var resultfolder=document.getElementById("resultfolder");
    var size = resultfolder.length
    console.log(size)
    for(var i = 0;i<size ;i++){
        resultfolder.remove(0)
    }
    $.ajax({
        data: {"blank" : " "},
        url: '/getResultFolder',
        type: 'post',
        cache: false,
        timeout: 800000,
        async:true,
        success: function(data){
            var folders = data.folder.split("\n")
            console.log(data.folder)
            for(var i = 0;i<folders.length;i++){
                var optiondevice=document.createElement('option');
                optiondevice.text=folders[i]
                optiondevice.value=folders[i]
                resultfolder.add(optiondevice,null)
            }

        },
        error: function(jqXHR, textStatus, errorThrown){
            alert('error : ' + textStatus + " " + errorThrown);
        },
    });
}






function getJitter() {
    var div4 = document.getElementById("chartJitter");
    var selectfolder = resultfolder.selectedOptions.length;
    if (selectfolder) {
       var strfolder = resultfolder.options[resultfolder.selectedIndex].text;
        $.ajax({
        data: {"folder":strfolder,"file":"jitter.txt"},
        url: '/displayData',
        type: 'post',
        cache: false,
        timeout: 20000,
        success: function(data){
            var jitter = data.data.split(",");
            var average = 0;
            var num = 0;
            var ctx = document.getElementById("chartJitter").getContext("2d");
            var colorNames = Object.keys(window.chartColors);
            var Color = window.chartColors[colorNames[0]];
            var jitterData = { labels: [], datasets: [ {
                label: "Jitter Chart",
                backgroundColor: Color,
                borderColor: Color,
                data: [],
                fill: false
            }]};
            //jitter = jitter.split("\n");
            var fnum = $("#jnum").val();
            fnum = parseInt(fnum);
            var threshold = $("#jthreshold").val();
            threshold = parseFloat(threshold);
            for(var i = 0;i < jitter.length-1 && i < fnum;i++) {
                if(jitter[i] > threshold) continue;
                jitter[0]=jitter[0].replace(/\[\'/i, '');
                if (jitter[i]!="")
                {
                    jitterData.labels.push(i);
                    jitterData.datasets[0].data.push(jitter[i]);
                    average = average + parseFloat(jitter[i]);
                    num++;
                }
            }
            average = parseFloat(average/num);
            $("#jitter_avg").val(average);
            if (div4.style.display == 'none') {div4.style.display = 'inline'};
            if(jChart != null) jChart.destroy();
            //jChart = new Chart(ctx).Line(jitterData, {responsive: true, maintainAspectRatio: true, scaleShowLabels: true});
            jChart = Chart.Line(ctx, {
                data: jitterData,

                options: {
                    responsive: true,
                    title:{
                        display:true,
                        text:'Latency Chart'
                    },
                    tooltips: {
                        mode: 'index',
                        intersect: false,
                    },
                    hover: {
                        mode: 'nearest',
                        intersect: true
                    },
                    scales: {
                        xAxes: [{
                            display: true,
                            scaleLabel: {
                                display: true,
                            }
                        }],
                        yAxes: [{
                            display: true,
                            scaleLabel: {
                                display: true,
                            }
                        }]
                    }
                }
            })
        },
        error: function(jqXHR, textStatus, errorThrown){
            alert('error : ' + textStatus + " " + errorThrown);
        }
    });
    }else{
        $.ajax({
        data: {"blank" : " "},
        url: '/jitter',
        type: 'post',
        cache: false,
        timeout: 20000,
        success: function(data){
            var jitter = data.jitter.split("\n");
            var average = 0;
            var num = 0;
            var ctx = document.getElementById("chartJitter").getContext("2d");
            var colorNames = Object.keys(window.chartColors);
            var Color = window.chartColors[colorNames[0]];
            var jitterData = { labels: [], datasets: [ {
                label: "Jitter Chart",
                backgroundColor: Color,
                borderColor: Color,
                data: [],
                fill: false
            }]};
            //jitter = jitter.split("\n");
            var fnum = $("#jnum").val();
            fnum = parseInt(fnum);
            var threshold = $("#jthreshold").val();
            threshold = parseFloat(threshold);
            for(var i = 0;i < jitter.length && i < fnum;i++) {
                if(jitter[i] > threshold) continue;
                if (jitter[i]!="")
                {
                    jitterData.labels.push(i);
                    jitterData.datasets[0].data.push(jitter[i]);
                    average = average + parseFloat(jitter[i]);
                    num++;
                }
            }
            average = parseFloat(average/num);
            $("#jitter_avg").val(average);
            if (div4.style.display == 'none') {div4.style.display = 'inline'};
            if(jChart != null) jChart.destroy();
            //jChart = new Chart(ctx).Line(jitterData, {responsive: true, maintainAspectRatio: true, scaleShowLabels: true});
            jChart = Chart.Line(ctx, {
                data: jitterData,

                options: {
                    responsive: true,
                    title:{
                        display:true,
                        text:'Latency Chart'
                    },
                    tooltips: {
                        mode: 'index',
                        intersect: false,
                    },
                    hover: {
                        mode: 'nearest',
                        intersect: true
                    },
                    scales: {
                        xAxes: [{
                            display: true,
                            scaleLabel: {
                                display: true,
                            }
                        }],
                        yAxes: [{
                            display: true,
                            scaleLabel: {
                                display: true,
                            }
                        }]
                    }
                }
            })
        },
        error: function(jqXHR, textStatus, errorThrown){
            alert('error : ' + textStatus + " " + errorThrown);
        }
    });

    }

}


function getLatency() {
    var div5 = document.getElementById("chartLatency");
    var selectfolder = resultfolder.selectedOptions.length;
    if (selectfolder) {
       var strfolder = resultfolder.options[resultfolder.selectedIndex].text;
           $.ajax({
        data: {"folder":strfolder,"file":"latency.txt"},
        url: '/displayData',
        type: 'post',
        cache: false,
        timeout: 20000,
        success: function(data){
            var latency = data.data;
            console.log("latency is", latency);
            var average = 0;
            var num = 0;
            var ctx = document.getElementById("chartLatency").getContext("2d");
            var colorNames = Object.keys(window.chartColors);
            var Color = window.chartColors[colorNames[0]];
            var latencyData = { labels: [], datasets: [ {
                label: "Latency Chart",
                backgroundColor: Color,
                borderColor: Color,
                data: [],
                fill: false
            }]};
            latency = latency.split(",");
            var fnum = $("#lnum").val();
            fnum = parseInt(fnum);
            var threshold = $("#lthreshold").val();
            threshold = parseFloat(threshold);
            for(var i = 0;i < latency.length-1 && i < fnum;i++) {
                if(latency[i] > threshold) continue;
                latency[0]=latency[0].replace(/\[\'/i, '');
                if (latency[i]!="")
                {
                    latencyData.labels.push(i);
                    latencyData.datasets[0].data.push(latency[i]);
                    average = average + parseFloat(latency[i]);
                    num ++ ;
                }
            }
            average = parseFloat(average/num);
            $("#latency_avg").val(average);
            if (div5.style.display == 'none') {div5.style.display = 'inline'};
            if(lChart != null) lChart.destroy();
           // lChart = new Chart(ctx).Line(latencyData, {responsive: true, maintainAspectRatio: true, scaleShowLabels: true});
            lChart = Chart.Line(ctx, {
                data: latencyData,

                options: {
                    responsive: true,
                    title:{
                        display:true,
                        text:'Latency Chart'
                    },
                    tooltips: {
                        mode: 'index',
                        intersect: false,
                    },
                    hover: {
                        mode: 'nearest',
                        intersect: true
                    },
                    scales: {
                        xAxes: [{
                            display: true,
                            scaleLabel: {
                                display: true,
                            }
                        }],
                        yAxes: [{
                            display: true,
                            scaleLabel: {
                                display: true,
                            }
                        }]
                    }
                }
            })
        },
        error: function(jqXHR, textStatus, errorThrown){
            alert('error : ' + textStatus + " " + errorThrown);
        }
     });
    }else{
       $.ajax({
        data: {"blank" : " "},
        url: '/latency',
        type: 'post',
        cache: false,
        timeout: 20000,
        success: function(data){
            var latency = data.latency;
            console.log("latency is", latency);
            var average = 0;
            var num = 0;
            var ctx = document.getElementById("chartLatency").getContext("2d");
            var colorNames = Object.keys(window.chartColors);
            var Color = window.chartColors[colorNames[0]];
            var latencyData = { labels: [], datasets: [ {
                label: "Latency Chart",
                backgroundColor: Color,
                borderColor: Color,
                data: [],
                fill: false
            }]};
            latency = latency.split("\n");
            var fnum = $("#lnum").val();
            fnum = parseInt(fnum);
            var threshold = $("#lthreshold").val();
            threshold = parseFloat(threshold);
            for(var i = 0;i < latency.length && i < fnum;i++) {
                if(latency[i] > threshold) continue;
                if (latency[i]!="")
                {
                    latencyData.labels.push(i);
                    latencyData.datasets[0].data.push(latency[i]);
                    average = average + parseFloat(latency[i]);
                    num ++ ;
                }
            }
            average = parseFloat(average/num);
            $("#latency_avg").val(average);
            if (div5.style.display == 'none') {div5.style.display = 'inline'};
            if(lChart != null) lChart.destroy();
            //lChart = new Chart(ctx).Line(latencyData, {responsive: true, maintainAspectRatio: true, scaleShowLabels: true});
             lChart = Chart.Line(ctx, {
                data: latencyData,

                options: {
                    responsive: true,
                    title:{
                        display:true,
                        text:'Bitrate Chart'
                    },
                    tooltips: {
                        mode: 'index',
                        intersect: false,
                    },
                    hover: {
                        mode: 'nearest',
                        intersect: true
                    },
                    scales: {
                        xAxes: [{
                            display: true,
                            scaleLabel: {
                                display: true,
                            }
                        }],
                        yAxes: [{
                            display: true,
                            scaleLabel: {
                                display: true,
                            }
                        }]
                    }
                }
            })
        },  
        error: function(jqXHR, textStatus, errorThrown){
            alert('error : ' + textStatus + " " + errorThrown);
        }
    });

    }

}
//new

function getFps() {
    var div6 = document.getElementById("chartgoogFps");
    var selectfolder = resultfolder.selectedOptions.length;
    if (selectfolder) {
        var strfolder = resultfolder.options[resultfolder.selectedIndex].text;
    $.ajax({
        data: {"folder":strfolder,"file":"fps.txt"},
        url: '/displayData',
        type: 'post',
        cache: false,
        timeout: 20000,
        success: function(data){
            //alert("getfpsDataOK!");
            var fps = data.data;
            var average = 0;
            var num = 0;
            var ctx = document.getElementById("chartgoogFps").getContext("2d");
            var colorNames = Object.keys(window.chartColors);
            var Color = window.chartColors[colorNames[0]];
            var fpsData = { labels: [], datasets: [ {
                label: "FPS Chart",
                backgroundColor: Color,
                borderColor: Color,
                data: [],
                fill: false
            }]};
            fps = fps.split(",");
            var fnum = $("#fnum").val();
            fnum = parseInt(fnum);
            var threshold = $("#fthreshold").val();
            threshold = parseFloat(threshold);
            for(var i = 0;i < fps.length-1 && i < fnum;i++) {
                fps[0]=fps[0].replace(/\[\'/i, '');
                if(fps[i] > threshold) continue;
                if (fps[i]!=null)
                {
                    console.log(fps[i]);
                    fpsData.labels.push(i);
                    fpsData.datasets[0].data.push(fps[i]);
                    average = average + parseFloat(fps[i]);
                    num++;
                }
                console.log(fps[i]);
             
            }
            average = parseFloat(average/num);
            $("#fps_avg").val(average);
            if (div6.style.display == 'none') {div6.style.display = 'inline'};
            if(fChart != null) fChart.destroy();
            //fChart = new Chart(ctx).Line(fpsData, {responsive: true, maintainAspectRatio: true, scaleShowLabels: true,scaleBeginAtZero:true});
            fChart = Chart.Line(ctx, {
                data: fpsData,

                options: {
                    responsive: true,
                    title:{
                        display:true,
                        text:'Bitrate Chart'
                    },
                    tooltips: {
                        mode: 'index',
                        intersect: false,
                    },
                    hover: {
                        mode: 'nearest',
                        intersect: true
                    },
                    scales: {
                        xAxes: [{
                            display: true,
                            scaleLabel: {
                                display: true,
                            }
                        }],
                        yAxes: [{
                            display: true,
                            scaleLabel: {
                                display: true,
                            }
                        }]
                    }
                }
            })
        },
        error: function(jqXHR, textStatus, errorThrown){
            alert('error : ' + textStatus + " " + errorThrown);
        }
    });
}else{
         $.ajax({
        data: {"blank" : " "},
        url: '/fps',
        type: 'post',
        cache: false,
        timeout: 20000,
        success: function(data){
            //alert("getfpsDataOK!");
            var fps = data.fps;
            var average = 0;
            var num = 0;
            var ctx = document.getElementById("chartgoogFps").getContext("2d");
            var Color = window.chartColors[colorNames[0]];
            var fpsData = { labels: [], datasets: [ {
                label: "FPS Chart",
                backgroundColor: Color,
                borderColor: Color,
                data: [],
                fill: false
            }]};
            fps = fps.split("\n");
            var fnum = $("#fnum").val();
            fnum = parseInt(fnum);
            var threshold = $("#fthreshold").val();
            threshold = parseFloat(threshold);
            for(var i = 0;i < fps.length-1 && i < fnum;i++) {
                
                if(fps[i] > threshold) continue;
                if (fps[i]!=null)
                {
                    console.log(fps[i]);
                    fpsData.labels.push(i);
                    fpsData.datasets[0].data.push(fps[i]);
                    average = average + parseFloat(fps[i]);
                    num++;
                }
                console.log(fps[i]);
             
            }
            average = parseFloat(average/num);
            $("#fps_avg").val(average);
            if (div6.style.display == 'none') {div6.style.display = 'inline'};
            if(fChart != null) fChart.destroy();
            //fChart = new Chart(ctx).Line(fpsData, {responsive: true, maintainAspectRatio: true, scaleShowLabels: true,scaleBeginAtZero:true});
            fChart = Chart.Line(ctx, {
                data: fpsData,

                options: {
                    responsive: true,
                    title:{
                        display:true,
                        text:'Bitrate Chart'
                    },
                    tooltips: {
                        mode: 'index',
                        intersect: false,
                    },
                    hover: {
                        mode: 'nearest',
                        intersect: true
                    },
                    scales: {
                        xAxes: [{
                            display: true,
                            scaleLabel: {
                                display: true,
                            }
                        }],
                        yAxes: [{
                            display: true,
                            scaleLabel: {
                                display: true,
                            }
                        }]
                    }
                }
            })
        },
        error: function(jqXHR, textStatus, errorThrown){
            alert('error : ' + textStatus + " " + errorThrown);
        }
    });

 }
}

function getBitrate() {
    var div7 = document.getElementById("chartgoogBitrate");
    var resultfolder=document.getElementById("resultfolder");
    //var strfolder = resultfolder.options[resultfolder.selectedIndex].text;
    var selectfolder = resultfolder.selectedOptions.length;
    if (selectfolder) {
        var strfolder = resultfolder.options[resultfolder.selectedIndex].text;
        $.ajax({
        data: {"folder":strfolder,"file":"bitrate.txt"},
        url: '/displayData',
        type: 'post',
        cache: false,
        timeout: 20000,
        success: function(data){
            //alert("getbitrateDataOK!");
            var bitrate = data.data;
            var average = 0;
            var num = 0;
            var ctx = document.getElementById("chartgoogBitrate").getContext("2d");
            var colorNames = Object.keys(window.chartColors);
            var Color = window.chartColors[colorNames[0]];
            var bitrateData = { labels: [], datasets: [ {
                label: "Bitrate Chart",
                backgroundColor: Color,
                borderColor: Color,
                data: [],
                fill: false
            }]};
            bitrate = bitrate.split(",");
            var fnum = $("#bnum").val();
            fnum = parseInt(fnum);
            var threshold = $("#bthreshold").val();
            threshold = parseFloat(threshold);
            for(var i = 0;i < bitrate.length-1 && i < fnum;i++)
            {
                bitrate[0]=bitrate[0].replace(/\[\'/i, '');
                if(bitrate[i] > threshold) continue;
                if (bitrate[i]!="")
                {
                    bitrateData.labels.push(i);
                    bitrateData.datasets[0].data.push(bitrate[i]);
                    average = average + parseFloat(bitrate[i]);
                    num ++ ;
                }
            }
            average = parseFloat(average/num);
            $("#bitrate_avg").val(average);
            console.log(bitrateData.datasets[0].data);
            if (div7.style.display == 'none') {div7.style.display = 'inline'};
            if(bChart != null) bChart.destroy();
            //bChart = new Chart(ctx).Line(bitrateData, {responsive: true, maintainAspectRatio: true, scaleShowLabels:true,scaleSteps:3,showScale:true,scaleBeginAtZero:true});
            bChart = Chart.Line(ctx, {
                data: bitrateData,

                options: {
                    responsive: true,
                    title:{
                        display:true,
                        text:'Bitrate Chart'
                    },
                    tooltips: {
                        mode: 'index',
                        intersect: false,
                    },
                    hover: {
                        mode: 'nearest',
                        intersect: true
                    },
                    scales: {
                        xAxes: [{
                            display: true,
                            scaleLabel: {
                                display: true,
                            }
                        }],
                        yAxes: [{
                            display: true,
                            scaleLabel: {
                                display: true,
                            }
                        }]
                    }
                }
            })

        },
        error: function(jqXHR, textStatus, errorThrown){
            alert('error : ' + textStatus + " " + errorThrown);
        }
    });
    }
    else{
            $.ajax({
        data: {"blank" : " "},
        url: '/bitrate',
        type: 'post',
        cache: false,
        timeout: 20000,
        success: function(data){
            //alert("getbitrateDataOK!");
            var bitrate = data.bitrate;
            var average = 0;
            var num = 0;
            var ctx = document.getElementById("chartgoogBitrate").getContext("2d");
            var colorNames = Object.keys(window.chartColors);
            var Color = window.chartColors[colorNames[0]];
            console.log("Color is ",Color);
            var bitrateData = { labels: [], datasets: [ {
                label: "Bitrate Chart",
                backgroundColor: Color,
                borderColor: Color,
                data: [],
                fill: false
            }]};
            bitrate = bitrate.split("\n");
            var fnum = $("#bnum").val();
            fnum = parseInt(fnum);
            var threshold = $("#bthreshold").val();
            threshold = parseFloat(threshold);
            for(var i = 0;i < bitrate.length && i < fnum;i++)
            {
                if(bitrate[i] > threshold) continue;
                if (bitrate[i]!="")
                {
                    bitrateData.labels.push(i);
                    bitrateData.datasets[0].data.push(bitrate[i]);
                    average = average + parseFloat(bitrate[i]);
                    num ++ ;
                }
            }
            average = parseFloat(average/num);
            $("#bitrate_avg").val(average);
            console.log(bitrateData.datasets[0].data);
            if (div7.style.display == 'none') {div7.style.display = 'inline'};
            if(bChart != null) bChart.destroy();
            //bChart = new Chart(ctx).Line(bitrateData, {responsive: true, maintainAspectRatio: true, scaleShowLabels:true,scaleSteps:3,showScale:true,scaleBeginAtZero:true});
            bChart = Chart.Line(ctx, {
                data: bitrateData,

                options: {
                    responsive: true,
                    title:{
                        display:true,
                        text:'Bitrate Chart'
                    },
                    tooltips: {
                        mode: 'index',
                        intersect: false,
                    },
                    hover: {
                        mode: 'nearest',
                        intersect: true
                    },
                    scales: {
                        xAxes: [{
                            display: true,
                            scaleLabel: {
                                display: true,
                            }
                        }],
                        yAxes: [{
                            display: true,
                            scaleLabel: {
                                display: true,
                            }
                        }]
                    }
                }
            })
        },
        error: function(jqXHR, textStatus, errorThrown){
            alert('error : ' + textStatus + " " + errorThrown);
        }
    });

    }

}

function getPESQ() {
    var div7 = document.getElementById("chartgoogPESQ");
    var resultfolder=document.getElementById("resultfolder");
    //var strfolder = resultfolder.options[resultfolder.selectedIndex].text;
    var selectfolder = resultfolder.selectedOptions.length;
    if (selectfolder) {
        var strfolder = resultfolder.options[resultfolder.selectedIndex].text;
        $.ajax({
        data: {"folder":strfolder,"file":"pesq.txt"},
        url: '/displayData',
        type: 'post',
        cache: false,
        timeout: 20000,
        success: function(data){
            //alert("getbitrateDataOK!");
            var pesq = data.data;
            var average = 0;
            var num = 0;
            var ctx = document.getElementById("chartgoogPESQ").getContext("2d");
            var colorNames = Object.keys(window.chartColors);
            var Color = window.chartColors[colorNames[0]];
            var pesqData = { labels: [], datasets: [ {
                label: "PESQ data",
                backgroundColor: Color,
                borderColor: Color,
                data: [],
                fill: false
            }]};
            pesq = pesq.split(",");
            var fnum = $("#bnum").val();
            fnum = parseInt(fnum);
            var threshold = $("#bthreshold").val();
            threshold = parseFloat(threshold);
            for(var i = 0;i < pesq.length-1 && i < fnum;i++)
            {
                pesq[0]=pesq[0].replace(/\[\'/i, '');
                if(pesq[i] > threshold) continue;
                if (pesq[i]!="")
                {
                    pesqData.labels.push(i);
                    pesqData.datasets[0].data.push(pesq[i]);
                    average = average + parseFloat(pesq[i]);
                    num ++ ;
                }
            }
            average = parseFloat(average/num);
            $("#pesq_avg").val(average);
            console.log(pesqData.datasets[0].data);
            if (div7.style.display == 'none') {div7.style.display = 'inline'};
            if(bChart != null) bChart.destroy();
             bChart = Chart.Line(ctx, {
                data: pesqData,

                    options: {
                        responsive: true,
                        title:{
                            display:true,
                            text:'PESQ Chart'
                        },
                        tooltips: {
                            mode: 'index',
                            intersect: false,
                        },
                        hover: {
                            mode: 'nearest',
                            intersect: true
                        },
                        scales: {
                            xAxes: [{
                                display: true,
                                scaleLabel: {
                                    display: true,
                                }
                            }],
                            yAxes: [{
                                display: true,
                                scaleLabel: {
                                    display: true,
                                }
                            }]
                        }
                    }
                })
        },
        error: function(jqXHR, textStatus, errorThrown){
            alert('error : ' + textStatus + " " + errorThrown);
        }
    });
    }
    else{
            $.ajax({
        data: {"blank" : " "},
        url: '/pesq',
        type: 'post',
        cache: false,
        timeout: 20000,
        success: function(data){
            //alert("getbitrateDataOK!");
            var pesq = data.pesq;
            var average = 0;
            var num = 0;
            var ctx = document.getElementById("chartgoogPESQ").getContext("2d");
            var colorNames = Object.keys(window.chartColors);
            var Color = window.chartColors[colorNames[0]];
            var pesqData = { labels: [], datasets: [ {
                label: "PESQ data",
                backgroundColor: Color,
                borderColor: Color,
                data: [],
                fill: false
            }]};
            pesq = pesq.split("\n");
            var fnum = $("#bnum").val();
            fnum = parseInt(fnum);
            var threshold = $("#bthreshold").val();
            threshold = parseFloat(threshold);
            for(var i = 0;i < pesq.length && i < fnum;i++)
            {
                if(pesq[i] > threshold) continue;
                if (pesq[i]!="")
                {
                    pesqData.labels.push(i);
                    pesqData.datasets[0].data.push(pesq[i]);
                    average = average + parseFloat(pesq[i]);
                    num ++ ;
                }
            }
            average = parseFloat(average/num);
            $("#pesq_avg").val(average);
            console.log(pesqData.datasets[0].data);
            if (div7.style.display == 'none') {div7.style.display = 'inline'};
            if(bChart != null) bChart.destroy();
            //bChart = new Chart(ctx).Line(pesqData, {responsive: true, maintainAspectRatio: true, scaleShowLabels:true,scaleSteps:3,showScale:true,scaleBeginAtZero:true});
             bChart = Chart.Line(ctx, {
                data: pesqData,

                    options: {
                        responsive: true,
                        title:{
                            display:true,
                            text:'PESQ Chart'
                        },
                        tooltips: {
                            mode: 'index',
                            intersect: false,
                        },
                        hover: {
                            mode: 'nearest',
                            intersect: true
                        },
                        scales: {
                            xAxes: [{
                                display: true,
                                scaleLabel: {
                                    display: true,
                                }
                            }],
                            yAxes: [{
                                display: true,
                                scaleLabel: {
                                    display: true,
                                }
                            }]
                        }
                    }
                })
        },
        error: function(jqXHR, textStatus, errorThrown){
            alert('error : ' + textStatus + " " + errorThrown);
        }
    });

    }

}

function getSSIM() {

    var div1 = document.getElementById("chartSsim");
    var selectfolder = resultfolder.selectedOptions.length;
    if (selectfolder) {
        var strfolder = resultfolder.options[resultfolder.selectedIndex].text;
        $.ajax({
            data: {"folder":strfolder,"file":"ssim.txt"},
            url: '/displayData',
            type: 'post',
            cache: false,
            timeout: 800000,
            success: function(data){
                var ssim = data.data;
                var ctx = document.getElementById("chartSsim").getContext("2d");
                var colorNames = Object.keys(window.chartColors);
                var Color = window.chartColors[colorNames[0]];
                var ssimData = { labels: [], datasets: [ {
                label: "SSIM Chart",
                backgroundColor: Color,
                borderColor: Color,
                data: [],
                fill: false
               }]};
                ssim = ssim.split(",");
                console.log(ssim);
                var fnum = $("#qnum").val();
                fnum = parseInt(fnum);
                for(var i = 0;i < ssim.length-1;i += 1) {
                    ssim[0]=ssim[0].replace(/\[\'/i, '');       
                    ssimData.labels.push(i);
                    ssimData.datasets[0].data.push(ssim[i]);
                }
                if (div1.style.display == 'none') {div1.style.display = 'inline'};
                if(vChart != null) vChart.destroy();

                //vChart = new Chart(ctx).Line(vmafData, {responsive: true, maintainAspectRatio: true, scaleShowLabels: true});
                vChart = Chart.Line(ctx, {
                data: ssimData,

                    options: {
                        responsive: true,
                        title:{
                            display:true,
                            text:'SSIM Chart'
                        },
                        tooltips: {
                            mode: 'index',
                            intersect: false,
                        },
                        hover: {
                            mode: 'nearest',
                            intersect: true
                        },
                        scales: {
                            xAxes: [{
                                display: true,
                                scaleLabel: {
                                    display: true,
                                }
                            }],
                            yAxes: [{
                                display: true,
                                scaleLabel: {
                                    display: true,
                                }
                            }]
                        }
                    }
                })
            },
            error: function(jqXHR, textStatus, errorThrown){
                alert('error : ' + textStatus + " " + errorThrown);
            }
        });

     }
     else{   
        $.ajax({
            data: {"blank" : " "},
            url: '/quality',
            type: 'post',
            cache: false,
            timeout: 800000,
            success: function(data){
                var ssim = data.ssim;
                var ctx = document.getElementById("chartSsim").getContext("2d");
                var colorNames = Object.keys(window.chartColors);
                var Color = window.chartColors[colorNames[0]];
                var ssimData = { labels: [], datasets: [ {
                label: "SSIM Chart",
                backgroundColor: Color,
                borderColor: Color,
                data: [],
                fill: false
                }]};
                ssim = ssim.split("\n");
                console.log(ssim);
                var fnum = $("#qnum").val();
                fnum = parseInt(fnum);
                for(var i = 0;i < ssim.length-1;i += 1) {
                    ssimData.labels.push(i);
                    ssimData.datasets[0].data.push(ssim[i]);
                }
                if (div1.style.display == 'none') {div1.style.display = 'inline'};
                if(vChart != null) vChart.destroy();

                vChart = Chart.Line(ctx, {
                data: ssimData,

                    options: {
                        responsive: true,
                        title:{
                            display:true,
                            text:'SSIM Chart'
                        },
                        tooltips: {
                            mode: 'index',
                            intersect: false,
                        },
                        hover: {
                            mode: 'nearest',
                            intersect: true
                        },
                        scales: {
                            xAxes: [{
                                display: true,
                                scaleLabel: {
                                    display: true,
                                }
                            }],
                            yAxes: [{
                                display: true,
                                scaleLabel: {
                                    display: true,
                                }
                            }]
                        }
                    }
                })
               // vChart = new Chart(ctx).Line(vmafData, {responsive: true, maintainAspectRatio: true, scaleShowLabels: true});
            },
            error: function(jqXHR, textStatus, errorThrown){
                alert('error : ' + textStatus + " " + errorThrown);
            }
        });
    }
}

function getPSNR() {

    var div1 = document.getElementById("chartPsnr");
    var selectfolder = resultfolder.selectedOptions.length;
    if (selectfolder) {
        var strfolder = resultfolder.options[resultfolder.selectedIndex].text;
        $.ajax({
            data: {"folder":strfolder,"file":"psnr.txt"},
            url: '/displayData',
            type: 'post',
            cache: false,
            timeout: 800000,
            success: function(data){
                var psnr = data.data;
                var ctx = document.getElementById("chartPsnr").getContext("2d");
                var colorNames = Object.keys(window.chartColors);
                var Color = window.chartColors[colorNames[0]];
                var psnrData = { labels: [], datasets: [ {
                label: "psnr Chart",
                backgroundColor: Color,
                borderColor: Color,
                data: [],
                fill: false
               }]};
                psnr = psnr.split(",");
                console.log(psnr);
                var fnum = $("#qnum").val();
                fnum = parseInt(fnum);
                for(var i = 0;i < psnr.length-1;i += 1) {
                    psnr[0]=psnr[0].replace(/\[\'/i, '');       
                    psnrData.labels.push(i);
                    psnrData.datasets[0].data.push(psnr[i]);
                }
                if (div1.style.display == 'none') {div1.style.display = 'inline'};
                if(pChart != null) pChart.destroy();

             
                pChart = Chart.Line(ctx, {
                data: psnrData,

                    options: {
                        responsive: true,
                        title:{
                            display:true,
                            text:'psnr Chart'
                        },
                        tooltips: {
                            mode: 'index',
                            intersect: false,
                        },
                        hover: {
                            mode: 'nearest',
                            intersect: true
                        },
                        scales: {
                            xAxes: [{
                                display: true,
                                scaleLabel: {
                                    display: true,
                                }
                            }],
                            yAxes: [{
                                display: true,
                                scaleLabel: {
                                    display: true,
                                }
                            }]
                        }
                    }
                })
            },
            error: function(jqXHR, textStatus, errorThrown){
                alert('error : ' + textStatus + " " + errorThrown);
            }
        });

     }
     else{   
        $.ajax({
            data: {"blank" : " "},
            url: '/quality',
            type: 'post',
            cache: false,
            timeout: 800000,
            success: function(data){
                var psnr = data.psnr;
                var ctx = document.getElementById("chartPsnr").getContext("2d");
                var colorNames = Object.keys(window.chartColors);
                var Color = window.chartColors[colorNames[0]];
                var psnrData = { labels: [], datasets: [ {
                label: "psnr Chart",
                backgroundColor: Color,
                borderColor: Color,
                data: [],
                fill: false
                }]};
                psnr = psnr.split("\n");
                console.log(psnr);
                var fnum = $("#qnum").val();
                fnum = parseInt(fnum);
                for(var i = 0;i < psnr.length-1;i += 1) {
                    psnrData.labels.push(i);
                    psnrData.datasets[0].data.push(psnr[i]);
                }
                if (div1.style.display == 'none') {div1.style.display = 'inline'};
                if(pChart != null) pChart.destroy();

                pChart = Chart.Line(ctx, {
                data: psnrData,

                    options: {
                        responsive: true,
                        title:{
                            display:true,
                            text:'psnr Chart'
                        },
                        tooltips: {
                            mode: 'index',
                            intersect: false,
                        },
                        hover: {
                            mode: 'nearest',
                            intersect: true
                        },
                        scales: {
                            xAxes: [{
                                display: true,
                                scaleLabel: {
                                    display: true,
                                }
                            }],
                            yAxes: [{
                                display: true,
                                scaleLabel: {
                                    display: true,
                                }
                            }]
                        }
                    }
                })
             
            },
            error: function(jqXHR, textStatus, errorThrown){
                alert('error : ' + textStatus + " " + errorThrown);
            }
        });
    }
}

function getVmaf() {

    var div1 = document.getElementById("chartVmaf");
    var selectfolder = resultfolder.selectedOptions.length;
    if (selectfolder) {
        var strfolder = resultfolder.options[resultfolder.selectedIndex].text;
        $.ajax({
            data: {"folder":strfolder,"file":"VMAF_score"},
            url: '/displayData',
            type: 'post',
            cache: false,
            timeout: 800000,
            success: function(data){
                var vmaf = data.data;
                var ctx = document.getElementById("chartVmaf").getContext("2d");
                var colorNames = Object.keys(window.chartColors);
                var Color = window.chartColors[colorNames[0]];
                var vmafData = { labels: [], datasets: [ {
                label: "VMAF Chart",
                backgroundColor: Color,
                borderColor: Color,
                data: [],
                fill: false
               }]};
                vmaf = vmaf.split(",");
                console.log(vmaf);
                var fnum = $("#qnum").val();
                fnum = parseInt(fnum);
                for(var i = 0;i < vmaf.length-1;i += 1) {
                    vmaf[0]=vmaf[0].replace(/\[\'/i, '');       
                    vmafData.labels.push(i);
                    vmafData.datasets[0].data.push(vmaf[i]);
                }
                if (div1.style.display == 'none') {div1.style.display = 'inline'};
                if(vChart != null) vChart.destroy();

                //vChart = new Chart(ctx).Line(vmafData, {responsive: true, maintainAspectRatio: true, scaleShowLabels: true});
                vChart = Chart.Line(ctx, {
                data: vmafData,

                    options: {
                        responsive: true,
                        title:{
                            display:true,
                            text:'VMAF Chart'
                        },
                        tooltips: {
                            mode: 'index',
                            intersect: false,
                        },
                        hover: {
                            mode: 'nearest',
                            intersect: true
                        },
                        scales: {
                            xAxes: [{
                                display: true,
                                scaleLabel: {
                                    display: true,
                                }
                            }],
                            yAxes: [{
                                display: true,
                                scaleLabel: {
                                    display: true,
                                }
                            }]
                        }
                    }
                })
            },
            error: function(jqXHR, textStatus, errorThrown){
                alert('error : ' + textStatus + " " + errorThrown);
            }
        });

     }
     else{   
        $.ajax({
            data: {"blank" : " "},
            url: '/vmaf',
            type: 'post',
            cache: false,
            timeout: 800000,
            success: function(data){
                var vmaf = data.vmaf;
                var ctx = document.getElementById("chartVmaf").getContext("2d");
                var colorNames = Object.keys(window.chartColors);
                var Color = window.chartColors[colorNames[0]];
                var vmafData = { labels: [], datasets: [ {
                label: "VMAF Chart",
                backgroundColor: Color,
                borderColor: Color,
                data: [],
                fill: false
                }]};
                vmaf = vmaf.split("\n");
                console.log(vmaf);
                var fnum = $("#qnum").val();
                fnum = parseInt(fnum);
                for(var i = 0;i < vmaf.length-1;i += 1) {
                    vmafData.labels.push(i);
                    vmafData.datasets[0].data.push(vmaf[i]);
                }
                if (div1.style.display == 'none') {div1.style.display = 'inline'};
                if(vChart != null) vChart.destroy();

                vChart = Chart.Line(ctx, {
                data: vmafData,

                    options: {
                        responsive: true,
                        title:{
                            display:true,
                            text:'VMAF Chart'
                        },
                        tooltips: {
                            mode: 'index',
                            intersect: false,
                        },
                        hover: {
                            mode: 'nearest',
                            intersect: true
                        },
                        scales: {
                            xAxes: [{
                                display: true,
                                scaleLabel: {
                                    display: true,
                                }
                            }],
                            yAxes: [{
                                display: true,
                                scaleLabel: {
                                    display: true,
                                }
                            }]
                        }
                    }
                })
               // vChart = new Chart(ctx).Line(vmafData, {responsive: true, maintainAspectRatio: true, scaleShowLabels: true});
            },
            error: function(jqXHR, textStatus, errorThrown){
                alert('error : ' + textStatus + " " + errorThrown);
            }
        });
    }
}


function getNR() {

    var div1 = document.getElementById("chartNR1");
    var div2 = document.getElementById("chartNR2");
    var div3 = document.getElementById("chartNR3");
    var div4 = document.getElementById("chartNR4");
    var div5 = document.getElementById("chartNR5");
    var div6 = document.getElementById("chartNR6");
    var selectfolder = resultfolder.selectedOptions.length;
    if (selectfolder) {
        var strfolder = resultfolder.options[resultfolder.selectedIndex].text;
            $.ajax({
        data: {"folder":strfolder,"file":"NR_score"},
        url: '/displayData',
        type: 'post',
        cache: false,
        timeout: 800000,
        success: function(data){
            console.log(data);
            var NR = data.data;
            var ctx = document.getElementById("chartNR1").getContext("2d");
            var ctx2 = document.getElementById("chartNR2").getContext("2d");
            var ctx3 = document.getElementById("chartNR3").getContext("2d");
            var ctx4 = document.getElementById("chartNR4").getContext("2d");
            var ctx5 = document.getElementById("chartNR5").getContext("2d");
            var ctx6 = document.getElementById("chartNR6").getContext("2d");
            var colorNames = Object.keys(window.chartColors);
            var Color = window.chartColors[colorNames[0]];

            var BlockinessData = { labels: [], datasets: [ {
                    label: "blockiness",
                    backgroundColor: Color,
                    borderColor: Color,
                    data: [],
                    fill: false
                }]};

            var BlocklossData = { labels: [], datasets: [ {
                    label: "Blockloss",
                    backgroundColor: Color,
                    borderColor: Color,
                    data: [],
                    fill: false
                }]};

            var BlurData = { labels: [], datasets: [ {
                    //label: "SSIM&PSNR",
                    label: "Blur",
                    backgroundColor: Color,
                    borderColor: Color,
                    data: [],
                    fill: false
                }]};

            var NoiseData = { labels: [], datasets: [ {
                    //label: "SSIM&PSNR",
                    label: "Noise",
                    backgroundColor: Color,
                    borderColor: Color,
                    data: [],
                    fill: false
                }]};

            var InterlaceData = { labels: [], datasets: [ {
                    //label: "SSIM&PSNR",
                    label: "Interlace",
                    backgroundColor: Color,
                    borderColor: Color,
                    data: [],
                    fill: false
                }]};
           var FreezeData = { labels: [], datasets: [ {
                    //label: "SSIM&PSNR",
                    label: "Freeze",
                    backgroundColor: Color,
                    borderColor: Color,
                    data: [],
                    fill: false
                }]};

            NR = NR.split(",");
            console.log(NR);
            console.log(NR.length);
            var fnum = $("#qnum").val();
            fnum = parseInt(fnum);
            console.log("fnum");
            console.log(fnum);
            for(var i = 0;i < NR.length-1; i += 6) {
                NR[0]=NR[0].replace(/\[\'/i, ''); 
                BlockinessData.labels.push(i/6);
                BlocklossData.labels.push(i/6);
                BlurData.labels.push(i/6);
                NoiseData.labels.push(i/6);
                InterlaceData.labels.push(i/6);
                FreezeData.labels.push(i/6);
                BlockinessData.datasets[0].data.push(NR[i]);
                BlocklossData.datasets[0].data.push(NR[i+1]);
                BlurData.datasets[0].data.push(NR[i+2]);
                NoiseData.datasets[0].data.push(NR[i+3]);
                InterlaceData.datasets[0].data.push(NR[i+4]);
                FreezeData.datasets[0].data.push(NR[i+5]);
            }

            if (div1.style.display == 'none') {div1.style.display = 'inline'};
            if (div2.style.display == 'none') {div2.style.display = 'inline'};
            if (div3.style.display == 'none') {div3.style.display = 'inline'};
            if (div4.style.display == 'none') {div4.style.display = 'inline'};
            if (div5.style.display == 'none') {div5.style.display = 'inline'};
            if (div6.style.display == 'none') {div6.style.display = 'inline'};

            if(NRChart != null) NRChart.destroy();
            if(NRChart2 != null) NRChart2.destroy();
            if(NRChart3 != null) NRChart3.destroy();
            if(NRChart4 != null) NRChart4.destroy();
            if(NRChart5 != null) NRChart5.destroy();
            if(NRChart6 != null) NRChart6.destroy();
            NRChart = Chart.Line(ctx, {
                data: BlockinessData,

                    options: {
                        responsive: true,
                        title:{
                            display:true,
                            text:'Blockiness Chart'
                        },
                        tooltips: {
                            mode: 'index',
                            intersect: false,
                        },
                        hover: {
                            mode: 'nearest',
                            intersect: true
                        },
                        scales: {
                            xAxes: [{
                                display: true,
                                scaleLabel: {
                                    display: true,
                                }
                            }],
                            yAxes: [{
                                display: true,
                                scaleLabel: {
                                    display: true,
                                }
                            }]
                        }
                    }
                })
               NRChart2 = Chart.Line(ctx2, {
                data: BlocklossData,

                    options: {
                        responsive: true,
                        title:{
                            display:true,
                            text:'BlocklossData Chart'
                        },
                        tooltips: {
                            mode: 'index',
                            intersect: false,
                        },
                        hover: {
                            mode: 'nearest',
                            intersect: true
                        },
                        scales: {
                            xAxes: [{
                                display: true,
                                scaleLabel: {
                                    display: true,
                                }
                            }],
                            yAxes: [{
                                display: true,
                                scaleLabel: {
                                    display: true,
                                }
                            }]
                        }
                    }
                })
             NRChart3 = Chart.Line(ctx3, {
                data: BlurData,

                    options: {
                        responsive: true,
                        title:{
                            display:true,
                            text:'BlurData Chart'
                        },
                        tooltips: {
                            mode: 'index',
                            intersect: false,
                        },
                        hover: {
                            mode: 'nearest',
                            intersect: true
                        },
                        scales: {
                            xAxes: [{
                                display: true,
                                scaleLabel: {
                                    display: true,
                                }
                            }],
                            yAxes: [{
                                display: true,
                                scaleLabel: {
                                    display: true,
                                }
                            }]
                        }
                    }
                })
            NRChart4 = Chart.Line(ctx4, {
                data: NoiseData,

                    options: {
                        responsive: true,
                        title:{
                            display:true,
                            text:'NoiseData Chart'
                        },
                        tooltips: {
                            mode: 'index',
                            intersect: false,
                        },
                        hover: {
                            mode: 'nearest',
                            intersect: true
                        },
                        scales: {
                            xAxes: [{
                                display: true,
                                scaleLabel: {
                                    display: true,
                                }
                            }],
                            yAxes: [{
                                display: true,
                                scaleLabel: {
                                    display: true,
                                }
                            }]
                        }
                    }
                })
               NRChart5 = Chart.Line(ctx5, {
                data: InterlaceData,

                    options: {
                        responsive: true,
                        title:{
                            display:true,
                            text:'InterlaceData Chart'
                        },
                        tooltips: {
                            mode: 'index',
                            intersect: false,
                        },
                        hover: {
                            mode: 'nearest',
                            intersect: true
                        },
                        scales: {
                            xAxes: [{
                                display: true,
                                scaleLabel: {
                                    display: true,
                                }
                            }],
                            yAxes: [{
                                display: true,
                                scaleLabel: {
                                    display: true,
                                }
                            }]
                        }
                    }
                })
             NRChart6 = Chart.Line(ctx6, {
                data: FreezeData,

                    options: {
                        responsive: true,
                        title:{
                            display:true,
                            text:'FreezeData Chart'
                        },
                        tooltips: {
                            mode: 'index',
                            intersect: false,
                        },
                        hover: {
                            mode: 'nearest',
                            intersect: true
                        },
                        scales: {
                            xAxes: [{
                                display: true,
                                scaleLabel: {
                                    display: true,
                                }
                            }],
                            yAxes: [{
                                display: true,
                                scaleLabel: {
                                    display: true,
                                }
                            }]
                        }
                    }
                })
         

        },
        error: function(jqXHR, textStatus, errorThrown){
            alert('error : ' + textStatus + " " + errorThrown);
        }
    });
    }else{
    $.ajax({
        data: {"blank" : " "},
        url: '/NR',
        type: 'post',
        cache: false,
        timeout: 800000,
        success: function(data){
            console.log(data);
            var NR = data.NR;
            var ctx = document.getElementById("chartNR1").getContext("2d");
            var ctx2 = document.getElementById("chartNR2").getContext("2d");
            var ctx3 = document.getElementById("chartNR3").getContext("2d");
            var ctx4 = document.getElementById("chartNR4").getContext("2d");
            var ctx5 = document.getElementById("chartNR5").getContext("2d");
            var ctx6 = document.getElementById("chartNR6").getContext("2d");
            var BlockinessData = { labels: [], datasets: [ {
                    label: "blockiness",
                    backgroundColor: Color,
                    borderColor: Color,
                    data: [],
                    fill: false
                }]};

            var BlocklossData = { labels: [], datasets: [ {
                    label: "Blockloss",
                     backgroundColor: Color,
                    borderColor: Color,
                    data: [],
                    fill: false
                }]};

            var BlurData = { labels: [], datasets: [ {
                    //label: "SSIM&PSNR",
                    label: "Blur",
                    backgroundColor: Color,
                    borderColor: Color,
                    data: [],
                    fill: false
                }]};

            var NoiseData = { labels: [], datasets: [ {
                    //label: "SSIM&PSNR",
                    label: "Noise",
                    backgroundColor: Color,
                    borderColor: Color,
                    data: [],
                    fill: false
                }]};

            var InterlaceData = { labels: [], datasets: [ {
                    //label: "SSIM&PSNR",
                    label: "Interlace",
                    backgroundColor: Color,
                    borderColor: Color,
                    data: [],
                    fill: false
                }]};
           var FreezeData = { labels: [], datasets: [ {
                    //label: "SSIM&PSNR",
                    label: "Freeze",
                    backgroundColor: Color,
                    borderColor: Color,
                    data: [],
                    fill: false
                }]};

            NR = NR.split("\n");
            console.log(NR);
            console.log(NR.length);
            var fnum = $("#qnum").val();
            fnum = parseInt(fnum);
            console.log("fnum");
            console.log(fnum);
            for(var i = 0;i < NR.length-1; i += 6) {

                BlockinessData.labels.push(i/6);
                BlocklossData.labels.push(i/6);
                BlurData.labels.push(i/6);
                NoiseData.labels.push(i/6);
                FreezeData.labels.push(i/6);
                InterlaceData.labels.push(i/6);
                BlockinessData.datasets[0].data.push(NR[i]);
                BlocklossData.datasets[0].data.push(NR[i+1]);
                BlurData.datasets[0].data.push(NR[i+2]);
                NoiseData.datasets[0].data.push(NR[i+3]);
                InterlaceData.datasets[0].data.push(NR[i+4]);
                FreezeData.datasets[0].data.push(NR[i+5]);
            }

            if (div1.style.display == 'none') {div1.style.display = 'inline'};
            if (div2.style.display == 'none') {div2.style.display = 'inline'};
            if (div3.style.display == 'none') {div3.style.display = 'inline'};
            if (div4.style.display == 'none') {div4.style.display = 'inline'};
            if (div5.style.display == 'none') {div5.style.display = 'inline'};
            if (div6.style.display == 'none') {div6.style.display = 'inline'};
            if(NRChart != null) NRChart.destroy();
            if(NRChart2 != null) NRChart2.destroy();
            if(NRChart3 != null) NRChart3.destroy();
            if(NRChart4 != null) NRChart4.destroy();
            if(NRChart5 != null) NRChart5.destroy();
            if(NRChart6 != null) NRChart6.destroy();
            NRChart = Chart.Line(ctx, {
                data: BlockinessData,

                    options: {
                        responsive: true,
                        title:{
                            display:true,
                            text:'Blockiness Chart'
                        },
                        tooltips: {
                            mode: 'index',
                            intersect: false,
                        },
                        hover: {
                            mode: 'nearest',
                            intersect: true
                        },
                        scales: {
                            xAxes: [{
                                display: true,
                                scaleLabel: {
                                    display: true,
                                }
                            }],
                            yAxes: [{
                                display: true,
                                scaleLabel: {
                                    display: true,
                                }
                            }]
                        }
                    }
                })
               NRChart2 = Chart.Line(ctx2, {
                data: BlocklossData,

                    options: {
                        responsive: true,
                        title:{
                            display:true,
                            text:'BlocklossData Chart'
                        },
                        tooltips: {
                            mode: 'index',
                            intersect: false,
                        },
                        hover: {
                            mode: 'nearest',
                            intersect: true
                        },
                        scales: {
                            xAxes: [{
                                display: true,
                                scaleLabel: {
                                    display: true,
                                }
                            }],
                            yAxes: [{
                                display: true,
                                scaleLabel: {
                                    display: true,
                                }
                            }]
                        }
                    }
                })
             NRChart3 = Chart.Line(ctx3, {
                data: BlurData,

                    options: {
                        responsive: true,
                        title:{
                            display:true,
                            text:'BlurData Chart'
                        },
                        tooltips: {
                            mode: 'index',
                            intersect: false,
                        },
                        hover: {
                            mode: 'nearest',
                            intersect: true
                        },
                        scales: {
                            xAxes: [{
                                display: true,
                                scaleLabel: {
                                    display: true,
                                }
                            }],
                            yAxes: [{
                                display: true,
                                scaleLabel: {
                                    display: true,
                                }
                            }]
                        }
                    }
                })
            NRChart4 = Chart.Line(ctx4, {
                data: NoiseData,

                    options: {
                        responsive: true,
                        title:{
                            display:true,
                            text:'NoiseData Chart'
                        },
                        tooltips: {
                            mode: 'index',
                            intersect: false,
                        },
                        hover: {
                            mode: 'nearest',
                            intersect: true
                        },
                        scales: {
                            xAxes: [{
                                display: true,
                                scaleLabel: {
                                    display: true,
                                }
                            }],
                            yAxes: [{
                                display: true,
                                scaleLabel: {
                                    display: true,
                                }
                            }]
                        }
                    }
                })
               NRChart5 = Chart.Line(ctx5, {
                data: InterlaceData,

                    options: {
                        responsive: true,
                        title:{
                            display:true,
                            text:'InterlaceData Chart'
                        },
                        tooltips: {
                            mode: 'index',
                            intersect: false,
                        },
                        hover: {
                            mode: 'nearest',
                            intersect: true
                        },
                        scales: {
                            xAxes: [{
                                display: true,
                                scaleLabel: {
                                    display: true,
                                }
                            }],
                            yAxes: [{
                                display: true,
                                scaleLabel: {
                                    display: true,
                                }
                            }]
                        }
                    }
                })
             NRChart6 = Chart.Line(ctx6, {
                data: FreezeData,

                    options: {
                        responsive: true,
                        title:{
                            display:true,
                            text:'FreezeData Chart'
                        },
                        tooltips: {
                            mode: 'index',
                            intersect: false,
                        },
                        hover: {
                            mode: 'nearest',
                            intersect: true
                        },
                        scales: {
                            xAxes: [{
                                display: true,
                                scaleLabel: {
                                    display: true,
                                }
                            }],
                            yAxes: [{
                                display: true,
                                scaleLabel: {
                                    display: true,
                                }
                            }]
                        }
                    }
                })
         

        },
        error: function(jqXHR, textStatus, errorThrown){
            alert('error : ' + textStatus + " " + errorThrown);
        }
    });
    }

}




