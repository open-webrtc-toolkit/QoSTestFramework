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
var vChart = null;
var psnrChart = null;
var ssimChart = null;
var blocklossChart = null;
var blurChart = null;
var noiseChart = null;
var blockinessChart = null;
//new
var fChart = null;
var bChart = null;
var pesqChart = null;

var membercount = 0;
var roomsize =0; //2x2
var iamgeNeedwidth=0;
var numbertagwidth=0;
var iamgeNeedheight=0;
var numbertagheight=0;

var selectedResultFolder=[];

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




function getSelectedResultFolder(){
    var resultfolder=document.getElementById("resultfolder");
    var selectfolder = resultfolder.selectedOptions.length;
    if (selectfolder) {
        var strfolder = resultfolder.options[resultfolder.selectedIndex].text;
        $.ajax({
            data: {"folder" : strfolder},
            url: '/getResultFolder',
            type: 'post',
            cache: false,
            timeout: 800000,
            async:true,
            success: function(data){
                selectedResultFolder = data.folder.split("\n")
            },
            error: function(jqXHR, textStatus, errorThrown){
                alert('error : ' + textStatus + " " + errorThrown);
            },
        });
  }
}



function getJitter() {
    var div4 = document.getElementById("chartJitter");
    var DataArray=[];
    var DataFolder;
    if (selectedResultFolder.length) {
        for(var k = 0;k < selectedResultFolder.length-1;k++) {
             selectedResultFolder[k].trim();
             DataArray.push(selectedResultFolder[k]);
             dataFolder=DataArray.join();
             console.log(dataFolder);
         }
        $.ajax({
        data: {"folder":dataFolder,"file":"jitter.txt"},
        url: '/displayData',
        type: 'post',
        cache: false,
        timeout: 20000,
        success: function(data){
            var jitterarray = data.data.split("#");
            var average = 0;
            var num = 0;
            var ctx = document.getElementById("chartJitter").getContext("2d");
            var jitterData = { labels: [], datasets: []};
            //jitter = jitter.split("\n");
            var fnum = $("#jnum").val();
            fnum = parseInt(fnum);
            var threshold = $("#jthreshold").val();
            threshold = parseFloat(threshold);
            var colorNames = Object.keys(window.chartColors);
                //increase dataset
            for(var k = 0;k < selectedResultFolder.length-1;k++) {             
                var colorName = colorNames[jitterData.datasets.length % colorNames.length];
                var newColor = window.chartColors[colorName];
                var newDataset = {
                    label: selectedResultFolder[k],
                    backgroundColor: newColor,
                    borderColor: newColor,
                    data: [],
                    fill: false
            };
            jitterData.datasets.push(newDataset);
            }
            var lastlength=0;
            for(var j = 0;j < jitterarray.length-1;j++) {
                jitter= jitterarray[j].split(',');
                if (jitter.length > lastlength) {
                jitterData.labels=[];
                }
                for(var i = 0;i < jitter.length-1 && i < fnum;i++) {
                    jitter[0]=jitter[0].replace(/\[\'/i, '');
                    jitter[i]=jitter[i].replace(/\'/i, '');
                    //if(jitter[i] > threshold) continue;
                    if (jitter[i]!=null && !(jitter[i].trim()==''))
                    {
                        console.log("jitter is",jitter[i]);
                        if (jitter.length > lastlength) {

                           jitterData.labels.push(i);                                  
                        }
                        jitterData.datasets[j].data.push(jitter[i]);
                        average = average + parseFloat(jitter[i]);

                        num++;
                    }
                    console.log(jitter[i]);
                 
                }
                console.log("jitter.length is", jitter.length);
                console.log("lastlength is", lastlength);
                if (jitter.length > lastlength) {
                 lastlength =jitter.length; 
                }
           }
            average = parseFloat(average/num);
           // $("#jitter_avg").val(average);
            if (div4.style.display == 'none') {div4.style.display = 'inline'};
            if(jChart != null) jChart.destroy();
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
    var DataArray=[];
    var DataFolder;
    if (selectedResultFolder.length) {
        for(var k = 0;k < selectedResultFolder.length-1;k++) {
             selectedResultFolder[k].trim();
             DataArray.push(selectedResultFolder[k]);
             dataFolder=DataArray.join();
             console.log(dataFolder);
         }
        $.ajax({
        data: {"folder":dataFolder,"file":"latency.txt"},
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
            var latencyData = { labels: [], datasets: []};
            latencyarray = latency.split("#");
            var fnum = $("#lnum").val();
            fnum = parseInt(fnum);
            var threshold = $("#lthreshold").val();
            threshold = parseFloat(threshold);
            var colorNames = Object.keys(window.chartColors);
                //increase dataset
            for(var k = 0;k < selectedResultFolder.length-1;k++) {             
                var colorName = colorNames[latencyData.datasets.length % colorNames.length];
                var newColor = window.chartColors[colorName];
                var newDataset = {
                    label: selectedResultFolder[k],
                    backgroundColor: newColor,
                    borderColor: newColor,
                    data: [],
                    fill: false
            };
            latencyData.datasets.push(newDataset);
            }
            var lastlength=0;
            for(var j = 0;j < latencyarray.length-1;j++) {
                latency = latencyarray[j].split(',');
                if (latency.length > lastlength) {
                 latencyData.labels=[];
                }
                for(var i = 0;i < latency.length-1 && i < fnum;i++) {
                    latency[0]=latency[0].replace(/\[\'/i, '');
                    latency[i]=latency[i].replace(/\'/i, '');
                   // if(latency[i] > threshold) continue;
                    if (latency[i]!=null && !(latency[i].trim()==''))
                    {
                        console.log("latency is",latency[i]);
                        if (latency.length > lastlength) {

                           latencyData.labels.push(i);                                  
                        }
                        latencyData.datasets[j].data.push(latency[i]);
                        average = average + parseFloat(latency[i]);

                        num++;
                    }
                    console.log(latency[i]);
                 
                }
                console.log("latency.length is", latency.length);
                console.log("lastlength is", lastlength);
                if (latency.length > lastlength) {
                 lastlength =latency.length; 
                }
           }
            average = parseFloat(average/num);
            $("#latency_avg").val(average);
            if (div5.style.display == 'none') {div5.style.display = 'inline'};
            if(lChart != null) lChart.destroy();
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
    }
}
//new

function getFps() {
    var div6 = document.getElementById("chartgoogFps");
    var DataArray=[];
    var dataFolder;
    if (selectedResultFolder.length) {
        for(var k = 0;k < selectedResultFolder.length-1;k++) {
             selectedResultFolder[k].trim();
             DataArray.push(selectedResultFolder[k]);
             dataFolder=DataArray.join();
             console.log(dataFolder);
         }
         $.ajax({
            data: {"folder":dataFolder,"file":"fps.txt"},
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
                var fpsData = { labels: [],
                datasets: []
                };
                fpsarray = fps.split("#");
                var fnum = $("#fnum").val();
                fnum = parseInt(fnum);
                var threshold = $("#fthreshold").val();
                threshold = parseFloat(threshold);
                var colorNames = Object.keys(window.chartColors);
                //increase dataset
                for(var k = 0;k < selectedResultFolder.length-1;k++) {             
                    var colorName = colorNames[fpsData.datasets.length % colorNames.length];
                    var newColor = window.chartColors[colorName];
                    var newDataset = {
                        label: selectedResultFolder[k],
                        backgroundColor: newColor,
                        borderColor: newColor,
                        data: [],
                        fill: false
                };
                fpsData.datasets.push(newDataset);
                }

                var lastlength=0;
                for(var j = 0;j < fpsarray.length-1;j++) {
                    fps = fpsarray[j].split(',');
                    if (fps.length > lastlength) {
                         fpsData.labels=[];
                    }
                    for(var i = 0;i < fps.length-1 && i < fnum;i++) {
                        fps[0]=fps[0].replace(/\[\'/i, '');
                        fps[i]=fps[i].replace(/\'/i, '');
                        //if(fps[i] > threshold) continue;
                        if (fps[i]!=null && !(fps[i].trim()==''))
                        {
                            console.log("fps is",fps[i]);
                            if (fps.length > lastlength) {
                               fpsData.labels.push(i);                                  
                            }
                            fpsData.datasets[j].data.push(fps[i]);
                            average = average + parseFloat(fps[i]);

                            num++;
                        }
                        console.log(fps[i]);
                     
                    }
                    if (fps.length > lastlength) {
                     lastlength =fps.length; 
                 }
               }
                average = parseFloat(average/num);
                //$("#fps_avg").val(average);
                if (div6.style.display == 'none') {div6.style.display = 'inline'};
                if(fChart != null) fChart.destroy();

                fChart = Chart.Line(ctx, {
                data: fpsData,

                options: {
                    responsive: true,
                    title:{
                        display:true,
                        text:'FPS Chart'
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
    var DataArray=[];
    var dataFolder;
    if (selectedResultFolder.length) {
        for(var k = 0;k < selectedResultFolder.length-1;k++) {
             selectedResultFolder[k].trim();
             DataArray.push(selectedResultFolder[k]);
             dataFolder=DataArray.join();
             console.log(dataFolder);
         }
        $.ajax({
        data: {"folder":dataFolder,"file":"bitrate.txt"},
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
            var bitrateData = { labels: [], datasets: []};
            bitratearray = bitrate.split("#");
            var fnum = $("#bnum").val();
            fnum = parseInt(fnum);
            var threshold = $("#bthreshold").val();           
            threshold = parseFloat(threshold);
            var colorNames = Object.keys(window.chartColors);
                //increase dataset
            for(var k = 0;k < selectedResultFolder.length-1;k++) {             
                var colorName = colorNames[bitrateData.datasets.length % colorNames.length];
                var newColor = window.chartColors[colorName];
                var newDataset = {
                    label: selectedResultFolder[k],
                    backgroundColor: newColor,
                    borderColor: newColor,
                    data: [],
                    fill: false
            };
            bitrateData.datasets.push(newDataset);
            }
            var lastlength = 0;
            for(var j = 0;j < bitratearray.length-1;j++) {
                    bitrate = bitratearray[j].split(',');
                    if (bitrate.length > lastlength) {
                         bitrateData.labels=[];
                    }
                    for(var i = 0;i < bitrate.length-1 && i < fnum;i++) {
                        bitrate[0]=bitrate[0].replace(/\[\'/i, '');
                        bitrate[i]=bitrate[i].replace(/\'/i, '');
                        if(bitrate[i] > threshold) continue;
                        if (bitrate[i]!=null && !(bitrate[i].trim()==''))
                        {
                            console.log("bitrate is",bitrate[i]);
                            if (bitrate.length > lastlength) {
                               bitrateData.labels.push(i);                                  
                            }
                            bitrateData.datasets[j].data.push(bitrate[i]);
                            average = average + parseFloat(bitrate[i]);

                            num++;
                        }
                        console.log(bitrate[i]);
                     
                    }
                    if (bitrate.length > lastlength) {
                     lastlength =bitrate.length; 
                 }
               }
            average = parseFloat(average/num);
           // $("#bitrate_avg").val(average);
            console.log(bitrateData.datasets[0].data);
            if (div7.style.display == 'none') {div7.style.display = 'inline'};
            if(bChart != null) bChart.destroy();
             bChart = Chart.Line(ctx, {
                data: bitrateData,

                options: {
                    responsive: true,
                    title:{
                        display:true,
                        text:'FPS Chart'
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


function getPSNR() {

    var div1 = document.getElementById("chartPSNR");
    var DataArray=[];
    var num = 0;
    var dataFolder;
    if (selectedResultFolder.length) {
        for(var k = 0;k < selectedResultFolder.length-1;k++) {
             selectedResultFolder[k].trim();
             DataArray.push(selectedResultFolder[k]);
             dataFolder=DataArray.join();
             console.log(dataFolder);
         }
        $.ajax({
            data: {"folder":dataFolder,"file":"psnr.txt"},
            url: '/displayData',
            type: 'post',
            cache: false,
            timeout: 800000,
            success: function(data){
                var psnr = data.data;
                var ctx = document.getElementById("chartPSNR").getContext("2d");
                var psnrData = { labels: [], datasets: []};
                psnrarray = psnr.split("#");
                var colorNames = Object.keys(window.chartColors);
                //increase dataset
                for(var k = 0;k < selectedResultFolder.length-1;k++) {             
                    var colorName = colorNames[psnrData.datasets.length % colorNames.length];
                    var newColor = window.chartColors[colorName];
                    var newDataset = {
                        label: selectedResultFolder[k],
                        backgroundColor: newColor,
                        borderColor: newColor,
                        data: [],
                        fill: false
                };
                psnrData.datasets.push(newDataset);
                }
           
                var fnum = $("#qnum").val();
                fnum = parseInt(fnum);
                var lastlength = 0;
                for(var j = 0;j < psnrarray.length-1;j++) {
                    psnr = psnrarray[j].split(',');
                    if (psnr.length > lastlength) {
                         psnrData.labels=[];
                    }
                    for(var i = 0;i < psnr.length-1;i++) {
                        psnr[0]=psnr[0].replace(/\[\'/i, '');
                        psnr[i]=psnr[i].replace(/\'/i, '');
                        if (psnr[i]!=null && !(psnr[i].trim()==''))
                        {
                            console.log("psnr is",psnr[i]);
                            if (psnr.length > lastlength) {
                               psnrData.labels.push(i);                                  
                            }
                            psnrData.datasets[j].data.push(psnr[i]);

                            num++;
                        }
                        console.log(psnr[i]);
                     
                    }
                    if (psnr.length > lastlength) {
                     lastlength =psnr.length; 
                 }
               }
                if (div1.style.display == 'none') {div1.style.display = 'inline'};
                if(psnrChart != null) psnrChart.destroy();

                psnrChart = Chart.Line(ctx, {
                data: psnrData,

                    options: {
                        responsive: true,
                        title:{
                            display:true,
                            text:'PSNR Chart'
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
    var div1 = document.getElementById("chartSSIM");
    var DataArray=[];
    var num = 0;
    var dataFolder;
    if (selectedResultFolder.length) {
        for(var k = 0;k < selectedResultFolder.length-1;k++) {
             selectedResultFolder[k].trim();
             DataArray.push(selectedResultFolder[k]);
             dataFolder=DataArray.join();
             console.log(dataFolder);
         }
        $.ajax({
            data: {"folder":dataFolder,"file":"ssim.txt"},
            url: '/displayData',
            type: 'post',
            cache: false,
            timeout: 800000,
            success: function(data){
                var ssim = data.data;
                var ctx = document.getElementById("chartSSIM").getContext("2d");
                var ssimData = { labels: [], datasets: []};
                ssimarray = ssim.split("#");
                var colorNames = Object.keys(window.chartColors);
                //increase dataset
                for(var k = 0;k < selectedResultFolder.length-1;k++) {             
                    var colorName = colorNames[ssimData.datasets.length % colorNames.length];
                    var newColor = window.chartColors[colorName];
                    var newDataset = {
                        label: selectedResultFolder[k],
                        backgroundColor: newColor,
                        borderColor: newColor,
                        data: [],
                        fill: false
                };
                ssimData.datasets.push(newDataset);
                }
           
                var fnum = $("#qnum").val();
                fnum = parseInt(fnum);
                var lastlength = 0;
                for(var j = 0;j < ssimarray.length-1;j++) {
                    ssim = ssimarray[j].split(',');
                    if (ssim.length > lastlength) {
                         ssimData.labels=[];
                    }
                    for(var i = 0;i < ssim.length-1;i++) {
                        ssim[0]=ssim[0].replace(/\[\'/i, '');
                        ssim[i]=ssim[i].replace(/\'/i, '');
                        if (ssim[i]!=null && !(ssim[i].trim()==''))
                        {
                            console.log("ssim is",ssim[i]);
                            if (ssim.length > lastlength) {
                               ssimData.labels.push(i);                                  
                            }
                            ssimData.datasets[j].data.push(ssim[i]);

                            num++;
                        }
                        console.log(ssim[i]);
                     
                    }
                    if (ssim.length > lastlength) {
                     lastlength =ssim.length; 
                 }
               }
                if (div1.style.display == 'none') {div1.style.display = 'inline'};
                if(ssimChart != null) ssimChart.destroy();

                ssimChart = Chart.Line(ctx, {
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
}


function getVmaf() {
    var div1 = document.getElementById("chartVmaf");
    var DataArray=[];
    var num = 0;
    var dataFolder;
    if (selectedResultFolder.length) {
        for(var k = 0;k < selectedResultFolder.length-1;k++) {
             selectedResultFolder[k].trim();
             DataArray.push(selectedResultFolder[k]);
             dataFolder=DataArray.join();
             console.log(dataFolder);
         }
        $.ajax({
            data: {"folder":dataFolder,"file":"VMAF_score"},
            url: '/displayData',
            type: 'post',
            cache: false,
            timeout: 800000,
            success: function(data){
                var vmaf = data.data;
                var ctx = document.getElementById("chartVmaf").getContext("2d");
                var vmafData = { labels: [], datasets: []};
                vmafarray = vmaf.split("#");
                var colorNames = Object.keys(window.chartColors);
                //increase dataset
                for(var k = 0;k < selectedResultFolder.length-1;k++) {             
                    var colorName = colorNames[vmafData.datasets.length % colorNames.length];
                    var newColor = window.chartColors[colorName];
                    var newDataset = {
                        label: selectedResultFolder[k],
                        backgroundColor: newColor,
                        borderColor: newColor,
                        data: [],
                        fill: false
                };
                vmafData.datasets.push(newDataset);
                }
           
                var fnum = $("#qnum").val();
                fnum = parseInt(fnum);
                var lastlength = 0;
                for(var j = 0;j < vmafarray.length-1;j++) {
                    vmaf = vmafarray[j].split(',');
                    if (vmaf.length > lastlength) {
                         vmafData.labels=[];
                    }
                    for(var i = 0;i < vmaf.length-1;i++) {
                        vmaf[0]=vmaf[0].replace(/\[\'/i, '');
                        vmaf[i]=vmaf[i].replace(/\'/i, '');
                        if (vmaf[i]!=null && !(vmaf[i].trim()==''))
                        {
                            console.log("vmaf is",vmaf[i]);
                            if (vmaf.length > lastlength) {
                               vmafData.labels.push(i);                                  
                            }
                            vmafData.datasets[j].data.push(vmaf[i]);

                            num++;
                        }
                        console.log(vmaf[i]);
                     
                    }
                    if (vmaf.length > lastlength) {
                     lastlength =vmaf.length; 
                 }
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
            },
            error: function(jqXHR, textStatus, errorThrown){
                alert('error : ' + textStatus + " " + errorThrown);
            }
        });

     }
}


function getBlockiness() {
    var div1 = document.getElementById("chartBlockiness");
    var DataArray=[];
    var num = 0;
    var dataFolder;
    if (selectedResultFolder.length) {
        for(var k = 0;k < selectedResultFolder.length-1;k++) {
             selectedResultFolder[k].trim();
             DataArray.push(selectedResultFolder[k]);
             dataFolder=DataArray.join();
             console.log(dataFolder);
         }
        $.ajax({
            data: {"folder":dataFolder,"file":"Blockiness_score"},
            url: '/displayData',
            type: 'post',
            cache: false,
            timeout: 800000,
            success: function(data){
                var blockiness = data.data;
                var ctx = document.getElementById("chartBlockiness").getContext("2d");
                var blockinessData = { labels: [], datasets: []};
                blockinessarray = blockiness.split("#");
                var colorNames = Object.keys(window.chartColors);
                //increase dataset
                for(var k = 0;k < selectedResultFolder.length-1;k++) {             
                    var colorName = colorNames[blockinessData.datasets.length % colorNames.length];
                    var newColor = window.chartColors[colorName];
                    var newDataset = {
                        label: selectedResultFolder[k],
                        backgroundColor: newColor,
                        borderColor: newColor,
                        data: [],
                        fill: false
                };
                blockinessData.datasets.push(newDataset);
                }
           
                var fnum = $("#qnum").val();
                fnum = parseInt(fnum);
                var lastlength = 0;
                for(var j = 0;j < blockinessarray.length-1;j++) {
                    blockiness = blockinessarray[j].split(',');
                    if (blockiness.length > lastlength) {
                         blockinessData.labels=[];
                    }
                    for(var i = 0;i < blockiness.length-1;i++) {
                        blockiness[0]=blockiness[0].replace(/\[\'/i, '');
                        blockiness[i]=blockiness[i].replace(/\'/i, '');
                        if (blockiness[i]!=null && !(blockiness[i].trim()==''))
                        {
                            console.log("blockiness is",blockiness[i]);
                            if (blockiness.length > lastlength) {
                               blockinessData.labels.push(i);                                  
                            }
                            blockinessData.datasets[j].data.push(blockiness[i]);

                            num++;
                        }
                        console.log(blockiness[i]);
                     
                    }
                    if (blockiness.length > lastlength) {
                     lastlength =blockiness.length; 
                 }
               }
                if (div1.style.display == 'none') {div1.style.display = 'inline'};
                if(blockinessChart != null) blockinessChart.destroy();

                blockinessChart = Chart.Line(ctx, {
                data: blockinessData,

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
            },
            error: function(jqXHR, textStatus, errorThrown){
                alert('error : ' + textStatus + " " + errorThrown);
            }
        });

     }
}



function getBlockloss() {
    var div1 = document.getElementById("chartBlockloss");
    var DataArray=[];
    var num = 0;
    var dataFolder;
    if (selectedResultFolder.length) {
        for(var k = 0;k < selectedResultFolder.length-1;k++) {
             selectedResultFolder[k].trim();
             DataArray.push(selectedResultFolder[k]);
             dataFolder=DataArray.join();
             console.log(dataFolder);
         }
        $.ajax({
            data: {"folder":dataFolder,"file":"Blockloss_score"},
            url: '/displayData',
            type: 'post',
            cache: false,
            timeout: 800000,
            success: function(data){
                var blockloss = data.data;
                var ctx = document.getElementById("chartBlockloss").getContext("2d");
                var blocklossData = { labels: [], datasets: []};
                blocklossarray = blockloss.split("#");
                var colorNames = Object.keys(window.chartColors);
                //increase dataset
                for(var k = 0;k < selectedResultFolder.length-1;k++) {             
                    var colorName = colorNames[blocklossData.datasets.length % colorNames.length];
                    var newColor = window.chartColors[colorName];
                    var newDataset = {
                        label: selectedResultFolder[k],
                        backgroundColor: newColor,
                        borderColor: newColor,
                        data: [],
                        fill: false
                };
                blocklossData.datasets.push(newDataset);
                }
           
                var fnum = $("#qnum").val();
                fnum = parseInt(fnum);
                var lastlength = 0;
                for(var j = 0;j < blocklossarray.length-1;j++) {
                    blockloss = blocklossarray[j].split(',');
                    if (blockloss.length > lastlength) {
                         blocklossData.labels=[];
                    }
                    for(var i = 0;i < blockloss.length-1;i++) {
                        blockloss[0]=blockloss[0].replace(/\[\'/i, '');
                        blockloss[i]=blockloss[i].replace(/\'/i, '');
                        if (blockloss[i]!=null && !(blockloss[i].trim()==''))
                        {
                            console.log("blockloss is",blockloss[i]);
                            if (blockloss.length > lastlength) {
                               blocklossData.labels.push(i);                                  
                            }
                            blocklossData.datasets[j].data.push(blockloss[i]);

                            num++;
                        }
                        console.log(blockloss[i]);
                     
                    }
                    if (blockloss.length > lastlength) {
                     lastlength =blockloss.length; 
                 }
               }
                if (div1.style.display == 'none') {div1.style.display = 'inline'};
                if(blocklossChart != null) blocklossChart.destroy();

                blocklossChart = Chart.Line(ctx, {
                data: blocklossData,

                    options: {
                        responsive: true,
                        title:{
                            display:true,
                            text:'Blockloss Chart'
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

function getBlur() {
    var div1 = document.getElementById("chartBlur");
    var DataArray=[];
    var num = 0;
    var dataFolder;
    if (selectedResultFolder.length) {
        for(var k = 0;k < selectedResultFolder.length-1;k++) {
             selectedResultFolder[k].trim();
             DataArray.push(selectedResultFolder[k]);
             dataFolder=DataArray.join();
             console.log(dataFolder);
         }
        $.ajax({
            data: {"folder":dataFolder,"file":"Blur_score"},
            url: '/displayData',
            type: 'post',
            cache: false,
            timeout: 800000,
            success: function(data){
                var Blur = data.data;
                var ctx = document.getElementById("chartBlur").getContext("2d");
                var blurData = { labels: [], datasets: []};
                blurarray = Blur.split("#");
                var colorNames = Object.keys(window.chartColors);
                //increase dataset
                for(var k = 0;k < selectedResultFolder.length-1;k++) {             
                    var colorName = colorNames[blurData.datasets.length % colorNames.length];
                    var newColor = window.chartColors[colorName];
                    var newDataset = {
                        label: selectedResultFolder[k],
                        backgroundColor: newColor,
                        borderColor: newColor,
                        data: [],
                        fill: false
                };
                blurData.datasets.push(newDataset);
                }
           
                var fnum = $("#qnum").val();
                fnum = parseInt(fnum);
                var lastlength = 0;
                for(var j = 0;j < blurarray.length-1;j++) {
                    Blur = blurarray[j].split(',');
                    if (Blur.length > lastlength) {
                         blurData.labels=[];
                    }
                    for(var i = 0;i < Blur.length-1;i++) {
                        Blur[0]=Blur[0].replace(/\[\'/i, '');
                        Blur[i]=Blur[i].replace(/\'/i, '');
                        if (Blur[i]!=null && !(Blur[i].trim()==''))
                        {
                            console.log("Blur is",Blur[i]);
                            if (Blur.length > lastlength) {
                               blurData.labels.push(i);                                  
                            }
                            blurData.datasets[j].data.push(Blur[i]);

                            num++;
                        }
                        console.log(Blur[i]);
                     
                    }
                    if (Blur.length > lastlength) {
                     lastlength =Blur.length; 
                 }
               }
                if (div1.style.display == 'none') {div1.style.display = 'inline'};
                if(blurChart != null) blurChart.destroy();

                blurChart = Chart.Line(ctx, {
                data: blurData,

                    options: {
                        responsive: true,
                        title:{
                            display:true,
                            text:'Blur Chart'
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

function getNoise() {
    var div1 = document.getElementById("chartNoise");
    var DataArray=[];
    var num = 0;
    var dataFolder;
    if (selectedResultFolder.length) {
        for(var k = 0;k < selectedResultFolder.length-1;k++) {
             selectedResultFolder[k].trim();
             DataArray.push(selectedResultFolder[k]);
             dataFolder=DataArray.join();
             console.log(dataFolder);
         }
        $.ajax({
            data: {"folder":dataFolder,"file":"Noise_score"},
            url: '/displayData',
            type: 'post',
            cache: false,
            timeout: 800000,
            success: function(data){
                var noise = data.data;
                var ctx = document.getElementById("chartNoise").getContext("2d");
                var blurData = { labels: [], datasets: []};
                blurarray = noise.split("#");
                var colorNames = Object.keys(window.chartColors);
                //increase dataset
                for(var k = 0;k < selectedResultFolder.length-1;k++) {             
                    var colorName = colorNames[blurData.datasets.length % colorNames.length];
                    var newColor = window.chartColors[colorName];
                    var newDataset = {
                        label: selectedResultFolder[k],
                        backgroundColor: newColor,
                        borderColor: newColor,
                        data: [],
                        fill: false
                };
                blurData.datasets.push(newDataset);
                }
           
                var fnum = $("#qnum").val();
                fnum = parseInt(fnum);
                var lastlength = 0;
                for(var j = 0;j < blurarray.length-1;j++) {
                    noise = blurarray[j].split(',');
                    if (noise.length > lastlength) {
                         blurData.labels=[];
                    }
                    for(var i = 0;i < noise.length-1;i++) {
                        noise[0]=noise[0].replace(/\[\'/i, '');
                        noise[i]=noise[i].replace(/\'/i, '');
                        if (noise[i]!=null && !(noise[i].trim()==''))
                        {
                            console.log("noise is",noise[i]);
                            if (noise.length > lastlength) {
                               blurData.labels.push(i);                                  
                            }
                            blurData.datasets[j].data.push(noise[i]);

                            num++;
                        }
                        console.log(noise[i]);
                     
                    }
                    if (noise.length > lastlength) {
                     lastlength =noise.length; 
                 }
               }
                if (div1.style.display == 'none') {div1.style.display = 'inline'};
                if(noiseChart != null) noiseChart.destroy();

                noiseChart = Chart.Line(ctx, {
                data: blurData,

                    options: {
                        responsive: true,
                        title:{
                            display:true,
                            text:'Noise Chart'
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

function getInterlace() {
    var div1 = document.getElementById("chartInterlace");
    var DataArray=[];
    var num = 0;
    var dataFolder;
    if (selectedResultFolder.length) {
        for(var k = 0;k < selectedResultFolder.length-1;k++) {
             selectedResultFolder[k].trim();
             DataArray.push(selectedResultFolder[k]);
             dataFolder=DataArray.join();
             console.log(dataFolder);
         }
        $.ajax({
            data: {"folder":dataFolder,"file":"Interlace_score"},
            url: '/displayData',
            type: 'post',
            cache: false,
            timeout: 800000,
            success: function(data){
                var interlace = data.data;
                var ctx = document.getElementById("chartInterlace").getContext("2d");
                var interlaceData = { labels: [], datasets: []};
                interlacearray = interlace.split("#");
                var colorNames = Object.keys(window.chartColors);
                //increase dataset
                for(var k = 0;k < selectedResultFolder.length-1;k++) {             
                    var colorName = colorNames[interlaceData.datasets.length % colorNames.length];
                    var newColor = window.chartColors[colorName];
                    var newDataset = {
                        label: selectedResultFolder[k],
                        backgroundColor: newColor,
                        borderColor: newColor,
                        data: [],
                        fill: false
                };
                interlaceData.datasets.push(newDataset);
                }
           
                var fnum = $("#qnum").val();
                fnum = parseInt(fnum);
                var lastlength = 0;
                for(var j = 0;j < interlacearray.length-1;j++) {
                    interlace = interlacearray[j].split(',');
                    if (interlace.length > lastlength) {
                         interlaceData.labels=[];
                    }
                    for(var i = 0;i < interlace.length-1;i++) {
                        interlace[0]=interlace[0].replace(/\[\'/i, '');
                        interlace[i]=interlace[i].replace(/\'/i, '');
                        if (interlace[i]!=null && !(interlace[i].trim()==''))
                        {
                            console.log("interlace is",interlace[i]);
                            if (interlace.length > lastlength) {
                               interlaceData.labels.push(i);                                  
                            }
                            interlaceData.datasets[j].data.push(interlace[i]);

                            num++;
                        }
                        console.log(interlace[i]);
                     
                    }
                    if (interlace.length > lastlength) {
                     lastlength =interlace.length; 
                 }
               }
                if (div1.style.display == 'none') {div1.style.display = 'inline'};
                if(bChart != null) bChart.destroy();

                bChart = Chart.Line(ctx, {
                data: interlaceData,

                    options: {
                        responsive: true,
                        title:{
                            display:true,
                            text:'Interlacing Chart'
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
    var div1 = document.getElementById("chartgoogPESQ");
    var DataArray=[];
    var num = 0;
    var dataFolder;
    if (selectedResultFolder.length) {
        for(var k = 0;k < selectedResultFolder.length-1;k++) {
             selectedResultFolder[k].trim();
             DataArray.push(selectedResultFolder[k]);
             dataFolder=DataArray.join();
             console.log(dataFolder);
         }
        $.ajax({
            data: {"folder":dataFolder,"file":"pesq.txt"},
            url: '/displayData',
            type: 'post',
            cache: false,
            timeout: 800000,
            success: function(data){
                var pesq = data.data;
                console.log("pesq is", pesq);
                var ctx = document.getElementById("chartgoogPESQ").getContext("2d");
                var pesqData = { labels: [], datasets: []};
                pesqarray = pesq.split("#");
                var colorNames = Object.keys(window.chartColors);
                //increase dataset
                for(var k = 0;k < selectedResultFolder.length-1;k++) {             
                    var colorName = colorNames[pesqData.datasets.length % colorNames.length];
                    var newColor = window.chartColors[colorName];
                    var newDataset = {
                        label: selectedResultFolder[k],
                        backgroundColor: newColor,
                        borderColor: newColor,
                        data: [],
                        fill: false
                };
                pesqData.datasets.push(newDataset);
                }
           
                var pnum = $("#pnum").val();
                pnum = parseInt(pnum);
                var lastlength = 0;
                for(var j = 0;j < pesqarray.length-1;j++) {
                    pesq = pesqarray[j].split(',');
                    if (pesq.length > lastlength) {
                         pesqData.labels=[];
                    }
                    for(var i = 0;i < pesq.length-1;i++) {
                        pesq[0]=pesq[0].replace(/\[\'/i, '');
                        pesq[i]=pesq[i].replace(/\'/i, '');
                        if (pesq[i]!=null && !(pesq[i].trim()==''))
                        {
                            console.log("pesq is",pesq[i]);
                            if (pesq.length > lastlength) {
                               pesqData.labels.push(i);                                  
                            }
                            pesqData.datasets[j].data.push(pesq[i]);
                            num++;
                        }
                        console.log(pesq[i]);
                     
                    }
                    if (pesq.length > lastlength) {
                     lastlength =pesq.length; 
                 }
               }
                if (div1.style.display == 'none') {div1.style.display = 'inline'};
                if(pesqChart != null) pesqChart.destroy();

                pesqChart = Chart.Line(ctx, {
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

