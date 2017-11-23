/*
This file could help you collect the video data and
get some parameters about your peer connection
*/
var qChart = null;
var qChart2 = null;
var qChart3 = null;
//getResultFolder();
getPublishFile();
getAdroidDevices();



/*function pushFile(){
    var publishdevice=document.getElementById("publishdevices");
    var index=publishdevice.selectedIndex
    var publishdevicevalue = publishdevice.options[index].value;
    var subscribedevice=document.getElementById("subscribedevice");
    var index=subscribedevice.selectedIndex
    var subscribedevicevalue = subscribedevice.options[index].value;
    var yuvname=document.getElementById("yuvname");
    var index=yuvname.selectedIndex
    var yuvnamevalue = yuvname.options[index].value;
    console.log("yuvnamevalue:"+yuvnamevalue)
    var encodedname=document.getElementById("encodedname");
    var index=encodedname.selectedIndex
    var encodednamevalue = encodedname.options[index].value;
    console.log("encodednamevalue:"+encodednamevalue)
    $.ajax({
        data: {"publishdevice":publishdevicevalue,"subscribedevice":subscribedevicevalue,"yuvname":yuvnamevalue,"encodedname":encodednamevalue},
        url: '/pushPublishFile',
        type: 'post',
        cache: false,
        timeout: 800000,
        async:true,
        success: function(data){

        },
        error: function(jqXHR, textStatus, errorThrown){
            alert('error : ' + textStatus + " " + errorThrown);
        },
    });

}*/

function startlockserver(){
    var lockserver = $("#lockserver").val();
    $.ajax({
        data: {"ip":lockserver},
        url: '/startlockserver',
        type: 'post',
        cache: false,
        timeout: 800000,
        success: function(data){
            alert("lockserver is start ok")
        },
        error: function(jqXHR, textStatus, errorThrown){
            alert('error : ' + textStatus + " " + errorThrown);
        },
        complete: function(){
            console.log('timeout');
        }
    });
}


var starttest = false;
var istestok = false;
function startInterval(){
    var i = setInterval(function(){
        if(starttest){
            $.ajax({
                url: '/checktestok',
                type: 'GET',
                cache: false,
                timeout: 800000,
                success: function(data){
                    istestok = data.result;
                    console.log(istestok)
                },
                error: function(jqXHR, textStatus, errorThrown){
                    alert('error : ' + textStatus + " " + errorThrown);
                },
                complete: function(){
                    console.log('timeout');
                }
            });
        }
        if(istestok){
            $("#startAndroidTest").removeAttr('disabled');
            $("#quality-btn").removeAttr('disabled');
            $("#vmaf-btn").removeAttr('disabled');
            $("#NR-btn").removeAttr('disabled');
            $("#jitter-btn").removeAttr('disabled');
            $("#latency-btn").removeAttr('disabled');
            $("#fps-btn").removeAttr('disabled');
            $("#bitrate-btn").removeAttr('disabled');
            clearInterval(i);
        }
    }, 3000);
}

function startAndroidConferenceTest(){
    starttest = true;
    istestok = false;
    var isinstall = false;
/*    var fps = $("#fps").val();
    var bitrate = $("#bitrate").val();
    var testtime = $("#testtime").val();*/
    var publishdevice=document.getElementById("publishdevices");
    var index=publishdevice.selectedIndex
    var publishdevicevalue = publishdevice.options[index].value;
    var subscribedevice=document.getElementById("subscribedevice");
    var index=subscribedevice.selectedIndex
    var subscribedevicevalue = subscribedevice.options[index].value;
    var casename=document.getElementById("casename");
    var index=casename.selectedIndex
    var casenamevalue = casename.options[index].value;
    var lockserver = $("#lockserver").val();
    if ($('#isinstall').prop('checked')) {
        isinstall = true;
    }

    console.log("isinstall:"+isinstall)
    $.ajax({
        data: {"lockserver":lockserver,"casename":casenamevalue,"isinstall":isinstall,"publishdevice":publishdevicevalue,"subscribedevice":subscribedevicevalue},
        url: '/startandroidconferencetest',
        type: 'post',
        cache: false,
        timeout: 800000,
        async:true,
        success: function(data){
            $("#startAndroidTest").attr('disabled',' true');
            $("#quality-btn").attr('disabled',' true');
            $("#vmaf-btn").attr('disabled',' true');
            $("#NR-btn").attr('disabled',' true');
            $("#jitter-btn").attr('disabled',' true');
            $("#latency-btn").attr('disabled',' true');
            $("#fps-btn").attr('disabled',' true');
            $("#bitrate-btn").attr('disabled',' true');

        },
        error: function(jqXHR, textStatus, errorThrown){
            alert('error : ' + textStatus + " " + errorThrown);
        },
        complete: function(){
            console.log('timeout');
        }
    });
    startInterval();
}


function startAndroidp2pTest(){
    starttest = true;
    istestok = false;
    var isinstall = false;
    var publishdevice=document.getElementById("publishdevices");
    var index=publishdevice.selectedIndex
    var publishdevicevalue = publishdevice.options[index].value;
    console.log("publishdevicevalue:"+publishdevicevalue)
    var subscribedevice=document.getElementById("subscribedevice");
    var index=subscribedevice.selectedIndex
    var subscribedevicevalue = subscribedevice.options[index].value;
    var lockserver = $("#lockserver").val();
    var casename=document.getElementById("casename");
    var index=casename.selectedIndex
    var casenamevalue = casename.options[index].value;
    if ($('#isinstall').prop('checked')) {
        isinstall = true;
    }

    console.log("isinstall:"+isinstall)
    $.ajax({
        data: {"lockserver":lockserver,"casename":casenamevalue,"isinstall":isinstall,"publishdevice":publishdevicevalue,"subscribedevice":subscribedevicevalue},
        url: '/startandroidp2ptest',
        type: 'post',
        cache: false,
        timeout: 800000,
        async:true,
        success: function(data){
            if(data.result == "success"){
                $("#startAndroidTest").attr('disabled',' true');
                $("#quality-btn").attr('disabled',' true');
                $("#vmaf-btn").attr('disabled',' true');
                $("#NR-btn").attr('disabled',' true');
                $("#jitter-btn").attr('disabled',' true');
                $("#latency-btn").attr('disabled',' true');
                $("#fps-btn").attr('disabled',' true');
                $("#bitrate-btn").attr('disabled',' true');
            }else{
                alert(data.msg)
            }

        },
        error: function(jqXHR, textStatus, errorThrown){
            alert('error : ' + textStatus + " " + errorThrown);
        },
        complete: function(){
            console.log('timeout');
        }
    });
    startInterval();
}

function getPublishFile(){
    var yuvname=document.getElementById("yuvname");
    var encodedname=document.getElementById("encodedname");
    var size = yuvname.length
    for(var i = 0;i<size ;i++){
        yuvname.remove(0)
    }
    var size = encodedname.length
    for(var i = 0;i<size ;i++){
        encodedname.remove(0)
    }
    $.ajax({
        data: {"blank" : " "},
        url: '/getPublishFile',
        type: 'post',
        cache: false,
        timeout: 800000,
        async:true,
        success: function(data){
            var devices = data.result.split(",")
            console.log(data.result)
            for(var i = 0;i<devices.length;i++){
                var optionfile=document.createElement('option');
                optionfile.text=devices[i]
                optionfile.value=devices[i]
                yuvname.add(optionfile,null)
            }
            for(var i = 0;i<devices.length;i++){
                var optionfile=document.createElement('option');
                optionfile.text=devices[i]
                optionfile.value=devices[i]
                encodedname.add(optionfile,null)
            }
        },
        error: function(jqXHR, textStatus, errorThrown){
            alert('error : ' + textStatus + " " + errorThrown);
        },
    });
}


function getAdroidDevices(){
    var publishdevices=document.getElementById("publishdevices");
    var subscribedevice = document.getElementById("subscribedevice");
    var size = publishdevices.length
    for(var i = 0;i<size ;i++){
        publishdevices.remove(0)
    }
    var size = subscribedevice.length
    for(var i = 0;i<size ;i++){
        subscribedevice.remove(0)
    }
    $.ajax({
        data: {"blank" : " "},
        url: '/getAndroidDevices',
        type: 'post',
        cache: false,
        timeout: 800000,
        async:true,
        success: function(data){
            //var publishdevices=document.getElementById("publishdevices");
            //var subscribedevice = document.getElementById("subscribedevice");
            var devices = data.result.split(",")
            console.log(data.result)
            for(var i = 0;i<devices.length;i++){
                var optiondevice=document.createElement('option');
                optiondevice.text=devices[i]
                optiondevice.value=devices[i]
                publishdevices.add(optiondevice,null)
            }
            for(var i = 0;i<devices.length;i++){
                var optiondevice=document.createElement('option');
                optiondevice.text=devices[i]
                optiondevice.value=devices[i]
                subscribedevice.add(optiondevice,null)
            }
        },
        error: function(jqXHR, textStatus, errorThrown){
            alert('error : ' + textStatus + " " + errorThrown);
        },
    });
}

function getConferenceTestCase(){
    var casename=document.getElementById("casename");
    var size = casename.length
    console.log(size)
    for(var i = 0;i<size ;i++){
        casename.remove(0)
    }
    $.ajax({
        data: {"blank" : " "},
        url: '/getConferenceTestCase',
        type: 'post',
        cache: false,
        timeout: 800000,
        async:true,
        success: function(data){
            var devices = data.result.split(",")
            console.log(data.result)
            for(var i = 0;i<devices.length;i++){
                var optiondevice=document.createElement('option');
                optiondevice.text=devices[i]
                optiondevice.value=devices[i]
                casename.add(optiondevice,null)
            }

        },
        error: function(jqXHR, textStatus, errorThrown){
            alert('error : ' + textStatus + " " + errorThrown);
        },
    });
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


function getp2pTestCase(){
    var casename=document.getElementById("casename");
    var size = casename.length
    console.log(size)
    for(var i = 0;i<size ;i++){
        casename.remove(0)
    }
    $.ajax({
        data: {"blank" : " "},
        url: '/getp2pTestCase',
        type: 'post',
        cache: false,
        timeout: 800000,
        async:true,
        success: function(data){
            var devices = data.result.split(",")
            console.log(data.result)
            for(var i = 0;i<devices.length;i++){
                var optiondevice=document.createElement('option');
                optiondevice.text=devices[i]
                optiondevice.value=devices[i]
                casename.add(optiondevice,null)
            }

        },
        error: function(jqXHR, textStatus, errorThrown){
            alert('error : ' + textStatus + " " + errorThrown);
        },
    });
}

function setp2pconfig(mode){
    var p2pserver = $("#p2pserver").val();
    var publishdevice=document.getElementById("publishdevices");
    var index=publishdevice.selectedIndex
    var publishdevicevalue = publishdevice.options[index].value;
    var subscribedevice=document.getElementById("subscribedevice");
    var index=subscribedevice.selectedIndex
    var subscribedevicevalue = subscribedevice.options[index].value;
    var lockserver = $("#lockserver").val();
    var yuvname=document.getElementById("yuvname");
    var index=yuvname.selectedIndex
    var yuvnamevalue = yuvname.options[index].value;
    console.log("yuvnamevalue:"+yuvnamevalue)
    var encodedname=document.getElementById("encodedname");
    var index=encodedname.selectedIndex
    var encodednamevalue = encodedname.options[index].value;
    console.log("encodednamevalue:"+encodednamevalue)
    var fps = $("#fps").val();
    var bitrate = $("#bitrate").val();
    var testtime = $("#testtime").val();
    var resolution = $("#resolution").val();
    var framesize = $("#framesize").val();
    var pushdevices = publishdevicevalue +","+subscribedevicevalue
    $.ajax({
        data: {"pushdevices":pushdevices,"p2pserver" : p2pserver, "lockserver":lockserver,"yuvname":yuvnamevalue,"encodedname":encodednamevalue,"fps":fps, "bitrate":bitrate,"testtime":testtime,"resolution":resolution,"framesize":framesize},
        url: '/setconfig',
        type: 'post',
        cache: false,
        timeout: 800000,
        async:true,
        success: function(data){
            alert("setp2pconfig.xml success")
        },
        error: function(jqXHR, textStatus, errorThrown){
            alert('error : ' + textStatus + " " + errorThrown);
        },
    });
}

function setconferenceconfig(mode){
    var publishdevice=document.getElementById("publishdevices");
    var index=publishdevice.selectedIndex
    var publishdevicevalue = publishdevice.options[index].value;
    var subscribedevice=document.getElementById("subscribedevice");
    var index=subscribedevice.selectedIndex
    var subscribedevicevalue = subscribedevice.options[index].value;
    var lockserver = $("#lockserver").val();
    var yuvname=document.getElementById("yuvname");
    var index=yuvname.selectedIndex
    var yuvnamevalue = yuvname.options[index].value;
    console.log("yuvnamevalue:"+yuvnamevalue)
    var encodedname=document.getElementById("encodedname");
    var index=encodedname.selectedIndex
    var encodednamevalue = encodedname.options[index].value;
    console.log("encodednamevalue:"+encodednamevalue)
    var fps = $("#fps").val();
    var bitrate = $("#bitrate").val();
    var testtime = $("#testtime").val();
    var resolution = $("#resolution").val();
    var framesize = $("#framesize").val();
    var pushdevices = publishdevicevalue +","+subscribedevicevalue
    $.ajax({
        data: {"pushdevices":pushdevices,"lockserver":lockserver,"yuvname":yuvnamevalue,"encodedname":encodednamevalue,"fps":fps, "bitrate":bitrate,"testtime":testtime,"resolution":resolution,"framesize":framesize},
        url: '/setconfig',
        type: 'post',
        cache: false,
        timeout: 800000,
        async:true,
        success: function(data){
            alert("setconferenceconfig.xml success")
        },
        error: function(jqXHR, textStatus, errorThrown){
            alert('error : ' + textStatus + " " + errorThrown);
        },
    });
}


function getQuality() {

    var div1 = document.getElementById("chartQuality");
    var div2 = document.getElementById("chartQuality2");
    var selectfolder = resultfolder.selectedOptions.length;
    if (selectfolder) {
        var strfolder = resultfolder.options[resultfolder.selectedIndex].text;
        $.ajax({
            data: {"folder":strfolder,"file":"quality.txt"},
            url: '/displayData',
            type: 'post',
            cache: false,
            timeout: 800000,
            success: function(data){
                $("#quality-btn").removeAttr('disabled');
                $("#vmaf-btn").removeAttr('disabled');
                $("#NR-btn").removeAttr('disabled');
                $("#jitter-btn").removeAttr('disabled');
                $("#latency-btn").removeAttr('disabled');
                var quality = data.data;
                var ctx = document.getElementById("chartQuality").getContext("2d");
                var ctx2 = document.getElementById("chartQuality2").getContext("2d");
                var psnrData = { labels: [], datasets: [ {
                        label: "PSNR",
                        fillColor: "rgba(151,187,205,0.5)",
                        strokeColor: "rgba(151,187,205,1)",
                        pointColor: "rgba(151,187,205,1)",
                        pointStrokeColor: "#fff",
                        pointHighlightFill: "#fff",
                        pointHighlightStroke: "rgba(151,187,205,1)",

                        data: []
                    }]};

                var ssimData = { labels: [], datasets: [ {
                        label: "SSIM",
                        fillColor: "rgba(151,187,205,0.5)",
                        strokeColor: "rgba(151,187,205,1)",
                        pointColor: "rgba(151,187,205,1)",
                        pointStrokeColor: "#fff",
                        pointHighlightFill: "#fff",
                        pointHighlightStroke: "rgba(151,187,205,1)",
                        data: []
                    }]};

                quality = quality.split(",");
                console.log(quality);
                var fnum = $("#qnum").val();
                fnum = parseInt(fnum);
                for(var i = 0;i < quality.length-1 && i < 2*fnum;i += 2) {
                    quality[0]=quality[0].replace(/\[\'/i, '');
                    psnrData.labels.push(i/2);
                    ssimData.labels.push(i/2);
                    psnrData.datasets[0].data.push(quality[i]);
                    ssimData.datasets[0].data.push(quality[i+1]);
                    //psData.labels.push(quality[i+1]);
                    //psData.labels.push(i/3);
                    //psData.datasets[0].data.push(quality[i+2]);
                }

                if (div1.style.display == 'none') {div1.style.display = 'inline'};
                if (div2.style.display == 'none') {div2.style.display = 'inline'};
               // if (div3.style.display == 'none') {div3.style.display = 'inline'};

                if(qChart != null) qChart.destroy();
                if(qChart2 != null) qChart2.destroy();
               // if(qChart3 != null) qChart3.destroy();
                qChart = new Chart(ctx).Line(psnrData, {responsive: true, maintainAspectRatio: true, scaleShowLabels: true});
                qChart2 = new Chart(ctx2).Line(ssimData, {responsive: true, maintainAspectRatio: true, scaleShowLabels: true});
               // qChart3 = new Chart(ctx3).Line(psData, {responsive: true, maintainAspectRatio: true, scaleShowLabels: true});
            },
            error: function(jqXHR, textStatus, errorThrown){
                alert('error : ' + textStatus + " " + errorThrown);
            }
        });
    }else{
         $.ajax({
            data: {"blank" : " "},
            url: '/quality',
            type: 'post',
            cache: false,
            timeout: 800000,
            success: function(data){
                $("#quality-btn").removeAttr('disabled');
                $("#vmaf-btn").removeAttr('disabled');
                $("#NR-btn").removeAttr('disabled');
                $("#jitter-btn").removeAttr('disabled');
                $("#latency-btn").removeAttr('disabled');
                var quality = data.quality;
                var ctx = document.getElementById("chartQuality").getContext("2d");
                var ctx2 = document.getElementById("chartQuality2").getContext("2d");
                var psnrData = { labels: [], datasets: [ {
                        label: "PSNR",
                        fillColor: "rgba(151,187,205,0.5)",
                        strokeColor: "rgba(151,187,205,1)",
                        pointColor: "rgba(151,187,205,1)",
                        pointStrokeColor: "#fff",
                        pointHighlightFill: "#fff",
                        pointHighlightStroke: "rgba(151,187,205,1)",

                        data: []
                    }]};

                var ssimData = { labels: [], datasets: [ {
                        label: "SSIM",
                        fillColor: "rgba(151,187,205,0.5)",
                        strokeColor: "rgba(151,187,205,1)",
                        pointColor: "rgba(151,187,205,1)",
                        pointStrokeColor: "#fff",
                        pointHighlightFill: "#fff",
                        pointHighlightStroke: "rgba(151,187,205,1)",
                        data: []
                    }]};

                quality = quality.split("\n");
                console.log(quality);
                var fnum = $("#qnum").val();
                fnum = parseInt(fnum);
                for(var i = 0;i < quality.length-1 && i < 2*fnum;i += 2) {
                    psnrData.labels.push(i/2);
                    ssimData.labels.push(i/2);
                    psnrData.datasets[0].data.push(quality[i]);
                    ssimData.datasets[0].data.push(quality[i+1]);
                    //psData.labels.push(quality[i+1]);
                    //psData.labels.push(i/3);
                    //psData.datasets[0].data.push(quality[i+2]);
                }

                if (div1.style.display == 'none') {div1.style.display = 'inline'};
                if (div2.style.display == 'none') {div2.style.display = 'inline'};
               // if (div3.style.display == 'none') {div3.style.display = 'inline'};

                if(qChart != null) qChart.destroy();
                if(qChart2 != null) qChart2.destroy();
               // if(qChart3 != null) qChart3.destroy();
                qChart = new Chart(ctx).Line(psnrData, {responsive: true, maintainAspectRatio: true, scaleShowLabels: true});
                qChart2 = new Chart(ctx2).Line(ssimData, {responsive: true, maintainAspectRatio: true, scaleShowLabels: true});
               // qChart3 = new Chart(ctx3).Line(psData, {responsive: true, maintainAspectRatio: true, scaleShowLabels: true});
            },
            error: function(jqXHR, textStatus, errorThrown){
                alert('error : ' + textStatus + " " + errorThrown);
            }
        });       
    }
    $("#quality-btn").attr('disabled',' true');
    $("#vmaf-btn").attr('disabled',' true');
    $("#NR-btn").attr('disabled',' true');
    $("#jitter-btn").attr('disabled',' true');
    $("#latency-btn").attr('disabled',' true');
}


