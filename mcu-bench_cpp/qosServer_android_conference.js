/*global require, __dirname, console, process*/
'use strict';

//var mcupath = '/home/webrtc/Documents/mcu/Release-v20170214'

var express = require('express'),
  bodyParser = require('body-parser'),
  errorhandler = require('errorhandler'),
  morgan = require('morgan'),
  fs = require('fs'),
  https = require('https'),
  N = require('./nuve');

var app = express();

app.use(bodyParser.json({limit: '100mb'}));
app.use(bodyParser.urlencoded({limit: '100mb'}));
app.use(bodyParser.urlencoded({extended:false}));

// app.configure ya no existe
app.use(errorhandler({
  dumpExceptions: true,
  showStack: true
}));
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'POST, GET, OPTIONS, DELETE');
  res.header('Access-Control-Allow-Headers', 'origin, content-type');
  if (req.method == 'OPTIONS') {
    res.send(200);
  } else {
    next();
  }
});




app.get('/',function(req,res){
    res.sendFile(__dirname + '/rtcandroidmcubench.html');
});

//app.get('/rtcp2pbench.html',function(req,res){
 //   res.sendFile(__dirname + '/rtcp2pbench.html');
//});

app.get('/public/socket.io.js', function(req,res){
    res.sendFile(__dirname + '/public/socket.io.js');
});


app.get('/public/adapter.js', function(req,res){
    res.sendFile(__dirname + '/public/adapter.js');
});

app.get('/public/woogeen.sdk.js', function(req,res){
    res.sendFile(__dirname + '/public/woogeen.sdk.js');
});

app.get('/public/woogeen.sdk.ui.js', function(req,res){
    res.sendFile(__dirname + '/public/woogeen.sdk.ui.js');
});


app.get('/css/style.css', function(req,res){
    res.sendFile(__dirname + '/css/style.css');
});

app.get('/js/Chart.js', function(req,res){
    res.sendFile(__dirname + '/js/Chart.js');
});

app.get('/js/stat.js', function(req,res){
    res.sendFile(__dirname + '/js/stat.js');
});


app.get('/js/stat_android.js', function(req,res){
    res.sendFile(__dirname + '/js/stat_android.js');
});

app.get('/js/testfunction.js', function(req,res){
    res.sendFile(__dirname + '/js/testfunction.js');
});

app.get('/js/jquery-2.1.4.min.js', function(req,res){
    res.sendFile(__dirname + '/js/jquery-2.1.4.min.js');
});



app.post('/jitter', function(req, res){
    var rTagFilename = "./native/Data/rec_timestamp.txt";
    var exec = require('child_process').exec;
    exec('./native/FLR_android ' + rTagFilename, function(err, data, stderr) {
        if(data.length > 1) {
            res.json({jitter : data});
        } else {
            console.log('you did not offer args');
        }
        if(err) {
            console.info('stderr:'+stderr);
        }
    });
});

app.post('/getAndroidDevices/getPublishFile', function(req, res){
    var exec = require('child_process').exec;
    exec('python python/getAndroidDevices.py ', function(err, data, stderr) {
        console.log(data)
        var real_data = data.slice(0,data.length-1)
        res.json({"result":real_data});
    });
});

app.post('/getConferenceTestCase', function(req, res){
    var exec = require('child_process').exec;
    exec('python python/getcasename.py -m conference', function(err, data, stderr) {
        console.log(data)
        var real_data = data.slice(0,data.length-1)
        res.json({"result":real_data});
    });
});


app.post('/getPublishFile', function(req, res){
    var exec = require('child_process').exec;
    exec('python python/getPublishFile.py', function(err, data, stderr) {
        console.log(data)
        var real_data = data.slice(0,data.length-1)
        res.json({"result":real_data});
    });
});

app.post('/startlockserver', function(req, res){
  var serverip = req.body.ip
  var exec = require('child_process').exec;
  exec('python python/lockserver.py -m 1 -i '+serverip);
  res.send("OK");
});

app.post('/setconfig', function(req, res){
    var pushdevices = req.body.pushdevices
    var lockserver = req.body.lockserver
    var yuvname = req.body.yuvname
    var encodedname = req.body.encodedname
    var fps = req.body.fps
    var bitrate = req.body.bitrate
    var testtime = req.body.testtime
    var resolution = req.body.resolution
    var framesize = req.body.framesize
    var parameter = "lockserver:"+lockserver+",yuvname:"+yuvname+",encodedname:"+encodedname+",fps:"+fps+",bitrate:"+bitrate+",testtime:"+testtime+",resolution:"+resolution+",framesize:"+framesize;
    console.log(parameter)
    var exec = require('child_process').exec;
    exec('./shell/setconfig.sh -p'+ parameter +" -d " +pushdevices, function(err, data, stderr) {
        console.log(data)
        res.send("OK");
    });
});

app.post('/latency', function(req, res){
    var sTagFilename = "./native/Data/localPublishTime.txt";
    var rTagFilename = "./native/Data/rec_timestamp.txt";
    var error = "./native/Data/devicestime.log"
    var exec = require('child_process').exec;
    exec('./native/latency_android ' + sTagFilename + ' ' + rTagFilename + ' ' + error, function(err, data, stderr) {
        if(data.length > 1) {
            res.json({latency : data});
        } else {
            console.log('you did not offer args');
        }
        if(err) {
            console.info('stderr:'+stderr);
        }
    });
});


//new
app.post('/fps', function(req, res){

  var fpsFilename = "./native/Data/recStat.txt";

  var exec = require('child_process').exec;
  console.log('in fps post');
  exec('./native/fps_android ' + fpsFilename, function(err, data, stderr) {
    if(data.length > 1) {
      res.json({fps : data});
    } else {
      console.log('fps file trans error');
    }
    if(err) {
      console.info('stderr from fps:'+stderr);
    }
  });
});

app.post('/bitrate', function(req, res){

  var bitrateFilename = "./native/Data/recStat.txt";
  var exec = require('child_process').exec;
  console.log('in bitrate post');
  exec('./native/bitrate_android ' + bitrateFilename, function(err, data, stderr) {
    if(data.length > 1) {
      console.log("aaaa");
      console.log(data);
      res.json({bitrate : data});
    } else {
      console.log('bitrate file trans error');
    }
    if(err) {
      console.info('stderr from bitrate:'+stderr);
    }
  });
});

app.post('/pesq', function(req, res){

  var send_no_silence_wav = "./audio_test/testAudio/short_mixed_mono_16_no_silence.wav";
  var rec_long_wav = ".audio_test/rec.pcm"
  var exec = require('child_process').exec;
  console.log('in pesq post');
  exec('python ./audio_test/scripts/generate_pesq.py -s '+send_no_silence_wav+' -f '+rec_long_wav+' -a 48000 -c 2 ', function(err, data, stderr) {
    if(data.length > 1) {
      console.log("pesq");
      console.log(data);
      res.json({pesq : data});
    } else {
      console.log('pesq file trans error');
    }
    if(err) {
      console.info('stderr from bitrate:'+stderr);
    }
  });
});

app.post('/quality', function(req, res){
  var rawFilename = "./native/output/rec.yuv";
  var originFilename = "./native/video/FourPeople_1280x720_30_taged.yuv"
  var exec = require('child_process').exec;
  exec('./native/imagequality_yuv_android ' + rawFilename + ' ' + originFilename, function(err, data, stderr) {
    if(data.length > 1) {
        res.json({quality : data});
    } else {
        console.log('you did not offer args');
    }
    if(err) {
        console.info('stderr from iq:'+stderr);
    }
    });
});

app.post('/vmaf', function(req, res){
    var exec = require('child_process').exec;
    var path = require('path');
    //var filePath = __filename;
    //var dirPath = path.dirname(filePath);
    //console.log('filename:', filePath, path.dirname(filePath), path.join(dirPath, '../abc'));
    process.env['PYTHONPATH'] = (process.env['PYTHONPATH'] || '');
    //process.env['PYTHONPATH']="/home/webrtc/Yonghao/webrtc-webrtc-qa/mcu-bench_cpp/python/vmaf/python/src:" + process.env['PYTHONPATH'];

    exec('python python/vmaf_calculate.py', {env: process.env}, function(err, data, stderr) {     
        res.json({vmaf : data});
        if(err) {
            console.info('stderr from iq:'+stderr);
        }
    });
});

app.post('/NR', function(req, res){
    var exec = require('child_process').exec;
    exec('python python/NR_calculate.py', function(err, data, stderr) {
        //console.log(err, data, stderr);
        //if(data.length > 1) {
            res.json({NR : data});
        //} else {
        //  console.log('you did not offer args');
        //}
        if(err) {
            console.info('stderr from iq:'+stderr);
        }
    });
});

app.post('/getResultFolder', function(req, res){
    var exec = require('child_process').exec;
    exec('python python/listFolder.py' , function(err, data, stderr) {
            console.log(data);
            res.json({folder : data});
        if(err) {
            console.info('stderr from iq:'+stderr);
        }
    });
});

app.post('/displayData', function(req, res){
    var exec = require('child_process').exec;
    var folder = req.body.folder;
    var file = req.body.file;
    console.log("folder is", folder, "file is", file);
    exec('python python/display_data.py '+ '-c ' + folder + ' ' + '-f '+ file , function(err, data, stderr) {
            res.json({data : data});
        if(err) {
            console.info('stderr from iq:'+stderr);
        }
    });
});
var istestok = false
app.post('/startandroidconferencetest', function(req,res){
  var cmd = ''
   istestok = false
   console.log("exec androidconferencetest")
   var serverip = req.body.lockserver
   var casename = req.body.casename
   console.log("casename:"+casename)
   var isinstall = req.body.isinstall
   console.log("isinstall:"+isinstall)
   var publishdevice = req.body.publishdevice
   console.log("publishdevice:"+publishdevice)
   var subscribedevice = req.body.subscribedevice
   console.log("subscribedevice:"+subscribedevice)
   var exec = require('child_process').exec;

   exec('adb -s '+publishdevice +' shell ls sdcard/ | grep config.xml', function(err, data, stderr) {
        console.log(data)
        if (data != ''){
          exec('adb -s '+subscribedevice +' shell ls sdcard/ | grep config.xml', function(err, data, stderr) {
            console.log(data)
            if (data == ''){
              res.json({"result":"failure","msg":subscribedevice+" can not find config.xml in sdcard ,please setconfig first"})
            }else{
              res.json({"result":"success","msg":""})
            }
          });
        }else{
          res.json({"result":"failure","msg":publishdevice+" can not find config.xml in sdcard ,please setconfig first"})
        }
    });

   exec('ps aux | grep lockserver_withcontrol.jar | grep -v \'grep\'', function(err, data, stderr) {
        console.log(data)
        if (data == ''){
          console.log("startlockserver")
          exec('python python/lockserver.py -m 1 -i '+serverip);
        }
    });
   if(isinstall == 'true'){
      console.log("app will install again")
      cmd = 'python python/runqos.py -c '+ casename +' -m 0 -i '+" -p "+publishdevice +" -s "+subscribedevice;
   }else{
      console.log("================================")
      cmd = 'python python/runqos.py -c '+ casename +' -m 0 '+ " -p "+publishdevice +" -s "+subscribedevice
   }
   exec(cmd, function(err, data, stderr) {
        console.log(data)
        istestok = true
        if(err) {
            console.info('stderr from iq:'+stderr);
        }
    });

});


app.get('/checktestok', function(req,res){
    res.json({"result":istestok})
});

app.post('/startTest', function(req,res){

   var exec = require('child_process').exec;
   exec('./QOStestclient/out/vp8.sh',function(err){
        if(err) {
            console.info('stderr form vp8.sh:'+err);
          }
   });
   res.send("OK");
});


app.post('/stopTest', function(req,res){

   var exec = require('child_process').exec;
   exec('ps aux | grep woogeen_conf_sample | grep -v \"grep\" | awk \'{print $2}\'|xargs kill -9 >/dev/null 2>&1 ',function(err){
        if(err) {
            console.info('stderr form kill woogeen_conf_sample:'+err);
          }
   });
   res.send("OK");
});

app.listen(4002);

var cipher = require('./cipher');
cipher.unlock(cipher.k, 'cert/.woogeen.keystore', function cb(err, obj) {
  if (!err) {
    try {
      https.createServer({
        pfx: fs.readFileSync('cert/certificate.pfx'),
        passphrase: obj.sample
      }, app).listen(4004);
    } catch (e) {
      err = e;
    }
  }
  if (err) {
    console.error('Failed to setup secured server:', err);
    return process.exit();
  }
});
