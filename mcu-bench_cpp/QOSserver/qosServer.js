/*global require, __dirname, console, process*/
'use strict';

var express = require('express'),
  bodyParser = require('body-parser'),
  errorhandler = require('errorhandler'),
  morgan = require('morgan'),
  fs = require('fs'),
  https = require('https');

var rootDir = __dirname + "/../";
var analysisDir = rootDir + "analysis/";
var nativeDir = analysisDir + "native/";
var dataDir = analysisDir + "dataset/Data/";
var sourceDir = analysisDir + "dataset/source/"
var clientDir = rootDir + "QOStestclient/";

var app = express();
app.use(errorhandler({
  dumpExceptions: true,
  showStack: true
}));

app.use(errorhandler());
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'POST, GET, PUT, PATCH, OPTIONS, DELETE');
  res.header('Access-Control-Allow-Headers', 'origin, content-type');
  if (req.method == 'OPTIONS') {
    res.send(200);
  } else {
    next();
  }
});


app.get('/',function(req,res){
    res.sendFile(__dirname + '/rtcmcubench_withoutjs.html');
});

app.get('/rtcmcubench_summary.html', function(req,res){
    res.sendFile(__dirname + '/rtcmcubench_summary.html');
});


app.get('/js/stat.js', function(req,res){
    res.sendFile(__dirname + '/js/stat.js');
});

app.get('/js/stat_c.js', function(req,res){
    res.sendFile(__dirname + '/js/stat_c.js');
});

app.get('/js/statAll.js', function(req,res){
    res.sendFile(__dirname + '/js/statAll.js');
});

app.get('/js/testfunction.js', function(req,res){
    res.sendFile(__dirname + '/js/testfunction.js');
});

app.post('/jitter', function(req, res){
    var rTagFilename = dataDir + "localLatency.txt";
    var exec = require('child_process').exec;
    exec(nativeDir + 'FLR ' + rTagFilename, function(err, data, stderr) {
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

app.post('/latency', function(req, res){
    var sTagFilename = dataDir + "localPublishTime.txt";
    var rTagFilename = dataDir + "localLatency.txt";
    var exec = require('child_process').exec;
    exec(nativeDir + 'latency ' + sTagFilename + ' ' + rTagFilename, function(err, data, stderr) {
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



app.post('/fps', function(req, res){
  var fpsFilename = dataDir + "localFPS.txt";
  var exec = require('child_process').exec;
  console.log('in fps post');
  exec(nativeDir + 'fps ' + fpsFilename, function(err, data, stderr) {
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
  var bitrateFilename = dataDir + "localBitrate.txt";
  var exec = require('child_process').exec;
  console.log('in bitrate post');
  exec(nativeDir + 'bitrate ' + bitrateFilename, function(err, data, stderr) {
    if(data.length > 1) {
      res.json({bitrate : data});
    } else {
      console.log('bitrate file trans error');
    }
    if(err) {
      console.info('stderr from bitrate:'+stderr);
    }
  });
});

app.post('/quality', function(req, res){
    var originFilename = req.body.filename || sourceDir + "FourPeople_540x360_30_taged.avi";
    var codec = req.body.codec || "hd540p";
    var rawFilename = dataDir + "localARGB.txt";
    var exec = require('child_process').exec;
    var exec_file;
    if (originFilename.endsWith('.avi')) {
        exec_file = 'iq_avi ';
    } else if (originFilename.endsWith('.yuv')) {
        exec_file = 'iq_yuv ';
    } else {
        console.info('wrong origin file format.');
    }
    exec(nativeDir + exec_file + rawFilename + ' ' + originFilename + ' ' + codec, function(err, data, stderr) {
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
    process.env['PYTHONPATH'] = (process.env['PYTHONPATH'] || '');

    exec('python ' + analysisDir + 'python/vmaf_calculate.py', {env: process.env}, function(err, data, stderr) {

        //if(data.length > 1) {
            res.json({vmaf : data});
        //} else {
        //  console.log('you did not offer args');
        //}
        if(err) {
            console.info('stderr from iq:'+stderr);
        }
    });
});

app.post('/NR', function(req, res){
    var exec = require('child_process').exec;
    exec('python ' + analysisDir + 'python/NR_calculate.py', function(err, data, stderr) {
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
    exec('python python/listFolder.py -l 1' , function(err, data, stderr) {
            console.log(data);
            res.json({folder : data});
        if(err) {
            console.info('stderr from iq:'+stderr);
        }
    });
});

app.post('/getCompareResultFolder', function(req, res){
    var exec = require('child_process').exec;
    var folder = req.body.folder;
    if(folder != undefined){
        console.log("folder is", folder);
        exec('python python/listFolder.py ' + '-f ' + folder , function(err, data, stderr) {
                console.log(data);
                res.json({folder : data});
            if(err) {
                console.info('stderr from iq:'+stderr);
            }
        });

    }
    else{
        exec('python python/listFolder.py -l 0', function(err, data, stderr) {
                console.log(data);
                res.json({folder : data});
            if(err) {
                console.info('stderr from iq:'+stderr);
            }
        });
    }
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

app.post('/startTest', function(req,res){
   var exec = require('child_process').exec;
   exec(clientDir + 'scripts/vp8_js.sh',function(err){
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
