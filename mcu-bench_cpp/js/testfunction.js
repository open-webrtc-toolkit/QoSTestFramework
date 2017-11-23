var video1;
var video2;
var datacanvas = document.getElementById("data-canvas");
var hiddenctx = datacanvas.getContext("2d");

//var messages = "";
var repeatInterval = 500; // 2000 ms == 2 seconds
var repeatTagInterval = 30 ; // 2000 ms == 2 seconds
//var uploadTimeInterval = 6666;
var TestTime = 10000;
var videoMixRawData = new Array(); //store data
var videoLocalTagData = new Array(); //store data
var videoMixTagData = new Array();

var tagWidth = 240;
var tagHeight = 60;

var vrdTimeID = 0;
var vtdTimeID = 0;
var stdTimeId = 0;
//var uploadTimeId = 0;

var jChart = null;
var lChart = null;
var qChart = null;
var qChart2 = null;
var qChart3 = null;

var membercount = 0; 
var roomsize =0; //2x2
var iamgeNeedwidth=0;
var numbertagwidth=0;
var iamgeNeedheight=0;
var numbertagheight=0;

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

function InitialRecord(){

	video1 = document.getElementById("mixed-streams").getElementsByTagName("video")[0];
	video2 = document.getElementById("myVideo").getElementsByTagName("video")[0];
	membercount = getRoomMembercount();
    if(membercount==0) alert('Room member count error');

    roomsize = getSizebycount(membercount);
    if(roomsize==0) alert('roomszie=0 error!');
    iamgeNeedwidth=Math.floor(datacanvas.width/roomsize);
    iamgeNeedheight=Math.floor(datacanvas.height/roomsize);
    numbertagwidth=Math.floor(tagWidth/roomsize);
    numbertagheight=Math.floor(tagHeight/roomsize);
    if(video1 === undefined || video2 === undefined)
	{
		//alert('empty');
		setTimeout(function () {
            InitialRecord();
        }, 2000);
	} else {
		$.ajax({
			data: {"blank" : " "},
			url: '/clear',
			type: 'post',
			cache: false,
			async: false,
			timeout: 40000,
			// success: function(data){
			// 	console.log("data transmit success");
   //                              alert("Data download to server.");
			// },
			error: function(jqXHR, textStatus, errorThrown){
				alert('error : ' + textStatus + " " + errorThrown);
			}
		});
		SaveLocalvideoTagData();
		SaveMixVideoRawData();
		SaveMixvideoTagData();
	}
 }

function GetAnalysisResult(){
	clearTimeout(vrdTimeID);
	clearTimeout(vtdTimeID);
	clearTimeout(stdTimeID);

	videoMixRawData.splice(0,0,roomsize);
	videoMixTagData.splice(0,0,roomsize);

	var vtd = videoMixTagData.join(",");
	var vrd = videoMixRawData.join(",");
	var std = videoLocalTagData.join(",");
	videoMixTagData.length=0;
	videoMixRawData.length=0;
	videoLocalTagData.length=0;

	$.ajax({
		data: {"vtd" : vtd, "vrd" : vrd, "std" : std},
		url: '/sender',
		type: 'post',
		cache: false,
		async: false,
		timeout: 400000,
		success: function(data){
			console.log("data transmit success");
                            //alert("Data download to server completed.");
		},
		error: function(jqXHR, textStatus, errorThrown){
				alert('error : ' + textStatus + " " + errorThrown);
		}
	});
	var Jitters = getJitter();
	var Latency = getLatency();
	var Quality = getQuality();
	console.log('Jitter:',Jitters);
	console.log('Latency:',Latency);
	console.log('Quality:',Quality);
}

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

function SaveLocalTag(){
	
	var mydate = new Date();
	var m = mydate.getTime();
	//console.log("save video tag :" + m);
	videoLocalTagData.push(m);

		hiddenctx.drawImage(video2, 0, 0, datacanvas.width, datacanvas.height);
		var imageData = hiddenctx.getImageData(0, 0, tagWidth, tagHeight);
		var data = imageData.data;
		var length = data.length;
		for (var i=0;i<length;i = i+4)
		{
			videoLocalTagData.push(data[i] + (data[i+1] << 8) + (data[i+2] << 16) );
		}
		var j =0;
	    for(j=0;j<videoLocalTagData.length;j+=(length+1))
	    {
	    	if(m - videoLocalTagData[j] < TestTime) break;
	    }
	    videoLocalTagData = videoLocalTagData.slice(j,videoLocalTagData.length);
}

function SaveMixRaw(){
    var mydate = new Date();
    var m = mydate.getTime();
    videoMixRawData.push(m);

		hiddenctx.drawImage(video1, 0, 0, datacanvas.width, datacanvas.height);
		var imageData = hiddenctx.getImageData(0, 0, iamgeNeedwidth, iamgeNeedheight);
		var data = imageData.data;
		var length = data.length;
		for (var i=0;i<length;i = i+4)
		{
			videoMixRawData.push(data[i] + (data[i+1] << 8) + (data[i+2] << 16) );
		}
		var j =0;
	    for(j=0;j<videoMixRawData.length;j+=(length+1))
	    {
	    	if(m - videoMixRawData[j] < TestTime) break;
	    }
	    videoMixRawData = videoMixRawData.slice(j,videoMixRawData.length);
}

function SaveMixTag(){
	
	var mydate = new Date();
	var m = mydate.getTime();
	//console.log("save video tag :" + m);
	videoMixTagData.push(m);

		hiddenctx.drawImage(video1, 0, 0, datacanvas.width, datacanvas.height);
		var imageData = hiddenctx.getImageData(0, 0, numbertagwidth, numbertagheight);
		var data = imageData.data;
		var length = data.length;
		for (var i=0;i<length;i = i+4)
		{
			videoMixTagData.push(data[i] + (data[i+1] << 8) + (data[i+2] << 16) );
		}
		var j =0;
	    for(j=0;j<videoMixTagData.length;j+=(length+1))
	    {
	    	if(m - videoMixTagData[j] < TestTime) break;
	    }
	    videoMixTagData = videoMixTagData.slice(j,videoMixTagData.length);
}

function getJitter() {
	var jr;
	$.ajax({
		data: {"blank" : " "},
		url: '/jitter',
		type: 'post',
		cache: false,
		async: false,
		timeout: 20000,
		success: function(data){
			var jitter = data.jitter;
			// var ctx = document.getElementById("chartJitter").getContext("2d");
			// var jitterData = { labels: [], datasets: [ {
   //          	label: "My First dataset",
   //          	fillColor: "rgba(151,187,205,0.5)",
   //          	strokeColor: "rgba(151,187,205,1)",
   //          	pointColor: "rgba(151,187,205,1)",
   //          	pointStrokeColor: "#fff",
   //          	pointHighlightFill: "#fff",
   //          	pointHighlightStroke: "rgba(151,187,205,1)",
   //          	data: []
   //      	}]};
			jitter = jitter.split("\n");
			jr = jitter;
			// var fnum = $("#jnum").val();
			// fnum = parseInt(fnum);
			// var threshold = $("#jthreshold").val();
			// threshold = parseFloat(threshold);
			// for(var i = 0;i < jitter.length && i < fnum;i++) {
			// 	if(jitter[i] > threshold) continue;
			// 	jitterData.labels.push(i);
			// 	jitterData.datasets[0].data.push(jitter[i]);
			// }
			// if(jChart != null) jChart.destroy();
   //          jChart = new Chart(ctx).Line(jitterData, {responsive: true, maintainAspectRatio: true, scaleShowLabels: true});
		},
		error: function(jqXHR, textStatus, errorThrown){
			alert('error : ' + textStatus + " " + errorThrown);
		}
	});
    return jr;
}

function getLatency() {
	var la;
	$.ajax({
		data: {"blank" : " "},
		url: '/latency',
		type: 'post',
		cache: false,
		async: false,
		timeout: 20000,
		success: function(data){
			var latency = data.latency;
			latency = latency.split("\n");
			la = latency;
			// var ctx = document.getElementById("chartLatency").getContext("2d");
			// var latencyData = { labels: [], datasets: [ {
   //          	label: "My First dataset",
   //              fillColor: "rgba(151,187,205,0.5)",
   //              strokeColor: "rgba(151,187,205,1)",
   //          	pointColor: "rgba(151,187,205,1)",
   //          	pointStrokeColor: "#fff",
   //          	pointHighlightFill: "#fff",
   //          	pointHighlightStroke: "rgba(151,187,205,1)",
   //          	data: []
   //      	}]};
			
		// 	var fnum = $("#lnum").val();
		// 	fnum = parseInt(fnum);
		// 	var threshold = $("#lthreshold").val();
		// 	threshold = parseFloat(threshold);
		// 	for(var i = 0;i < latency.length && i < fnum;i++) {
		// 		if(latency[i] > threshold) continue;
		// 		latencyData.labels.push(i);
		// 		latencyData.datasets[0].data.push(latency[i]);
		// 	}
		// 	if(lChart != null) lChart.destroy();
  //           lChart = new Chart(ctx).Line(latencyData, {responsive: true, maintainAspectRatio: true, scaleShowLabels: true});
		// 
	    },
		error: function(jqXHR, textStatus, errorThrown){
			alert('error : ' + textStatus + " " + errorThrown);
		}
	});
    return la;
}

function getQuality() {
	var qa;
	$.ajax({
		data: {"blank" : " "},
		url: '/quality',
		type: 'post',
		cache: false,
		async: false,
		timeout: 20000,
		success: function(data){
			var quality = data.quality;
			// var ctx = document.getElementById("chartQuality").getContext("2d");
			// var ctx2 = document.getElementById("chartQuality2").getContext("2d");
			// var ctx3 = document.getElementById("chartQuality3").getContext("2d");
			// var psnrData = { labels: [], datasets: [ {
   //          		label: "PSNR",
   //          		fillColor: "rgba(151,187,205,0.5)",
   //          		strokeColor: "rgba(151,187,205,1)",
   //          		pointColor: "rgba(151,187,205,1)",
   //          		pointStrokeColor: "#fff",
   //          		pointHighlightFill: "#fff",
   //          		pointHighlightStroke: "rgba(151,187,205,1)",
   //          		data: []
			// 	}]};

			// var ssimData = { labels: [], datasets: [ {
   //          		label: "SSIM",
   //          		fillColor: "rgba(151,187,205,0.5)",
   //          		strokeColor: "rgba(151,187,205,1)",
   //          		pointColor: "rgba(151,187,205,1)",
   //          		pointStrokeColor: "#fff",
   //          		pointHighlightFill: "#fff",
   //          		pointHighlightStroke: "rgba(151,187,205,1)",
   //          		data: []
			// 	}]};

			// var psData = { labels: [], datasets: [ {
   //          		label: "SSIM&PSNR",
   //          		fillColor: "rgba(151,187,205,0.5)",
   //          		strokeColor: "rgba(151,187,205,1)",
   //          		pointColor: "rgba(151,187,205,1)",
   //          		pointStrokeColor: "#fff",
   //          		pointHighlightFill: "#fff",
   //          		pointHighlightStroke: "rgba(151,187,205,1)",
   //          		data: []
			// 	}]};
			quality = quality.split("\n");
			qa = quality;
			// console.log(quality);
			// var fnum = $("#qnum").val();
			// fnum = parseInt(fnum);
			// for(var i = 0;i < quality.length-1 && i < 2*fnum;i += 2) {
			// 	psnrData.labels.push(i/2);
			// 	ssimData.labels.push(i/2);
			// 	psnrData.datasets[0].data.push(quality[i]);
			// 	ssimData.datasets[0].data.push(quality[i+1]);
			// 	psData.labels.push(quality[i+1]);
			// 	psData.datasets[0].data.push(quality[i]);
			// }
			// if(qChart != null) qChart.destroy();
			// if(qChart2 != null) qChart2.destroy();
			// if(qChart3 != null) qChart3.destroy();
   //          qChart = new Chart(ctx).Line(psnrData, {responsive: true, maintainAspectRatio: true, scaleShowLabels: true});
   //          qChart2 = new Chart(ctx2).Line(ssimData, {responsive: true, maintainAspectRatio: true, scaleShowLabels: true});
   //          qChart3 = new Chart(ctx3).Line(psData, {responsive: true, maintainAspectRatio: true, scaleShowLabels: true});
		},
		error: function(jqXHR, textStatus, errorThrown){
			alert('error : ' + textStatus + " " + errorThrown);
		}
	});
    return qa;
}