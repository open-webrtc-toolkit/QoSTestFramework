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
//app.use(express.static(__dirname + '/public'));
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

//app.set('views', __dirname + '/../views/');
//disable layout
//app.set("view options", {layout: false});

//N.API.init('5817d3cd7078d3261361b54e', 'Rn4UjVP+HVp3fK5FAizufM6qGc7VeOrZLyKhnhe3oqOfVOzGTa8L0CbDBTI5NN/dT2mnM1+v+me/KJBat6GQFeDtDPIp1gF+1ofP7piAMkVuT2GMNZeNVB1W/wJT8pnEXMD15PkPfhAtS4a2hSoXwSiJKI5LTAaej2Q/DCQ0g2E=',
//  'http://localhost:3000/');

//N.API.init('577cacfe3722a34c0f89bdcf', 'nmPHQ+qPuFbrBtG/cDZedRRcpgYAnS8RQXajYM7tZ6KixPmi2JLDak0wztsizwCleJewjwqPm6XEP+vVVKIGVR7n59Ge+GlIalX2dlI0ZqMpmBUbENZwNF9k7sasr39UPnCzv/UeIWFBblatBS/SzIFgT25A05+4gWicVr4HO8c=',
//  'http://localhost:3000/');
N.API.init('597b39370b2e872b6999c765', 'qUezlkVHkhT4DTNlkEU1Gqu/JEehG4VhctX3ZjxBs5nhI68Da197YxU8JLvhp6Kmd270j9EHTMq2riEU8s8enU3mHNe8qp+G1iPklAY1KklOz2nN/S4Sz9wwQ5eZlXiC7eBNYDORPUT2mnrmWQ1S2pfuqIx+uShWW3zR9saAe3s=',
  'http://localhost:3000/');


//N.API.rejectUnauthorizedCert(false);
var myRoom;

N.API.getRooms(function(roomlist) {
  var rooms = JSON.parse(roomlist);
  console.log(rooms.length + ' rooms in this service.');
  for (var i = 0; i < rooms.length; i++) {
    if (myRoom === undefined && rooms[i].name === 'myRoom') {
      myRoom = rooms[i]._id;
      console.log('MyRoom Id:', myRoom);
    }
    if (myRoom !== undefined) {
      break;
    }
  }
  var tryCreate = function(room, callback) {
    N.API.createRoom(room.name, function(roomID) {
      console.log('Created room:', roomID._id);
      callback(roomID._id);
    }, function(status, err) {
      console.log('Error in creating room:', err, '[Retry]');
      setTimeout(function() {
        tryCreate(room, callback);
      }, 100);
    }, room);
  };

  var room;
  if (!myRoom) {
    room = {
      name: 'myRoom'
    };
    tryCreate(room, function(Id) {
      myRoom = Id;
      console.log('myRoom Id:', myRoom);
    });
  }
});


app.get('/',function(req,res){
    res.sendFile(__dirname + '/rtcmcubench.html');
});

app.get('/rtcmcubench.html',function(req,res){
    res.sendFile(__dirname + '/rtcmcubench.html');
});
app.get('/WebRTCBenchGuide.html', function(req,res){
    res.sendFile(__dirname + '/RTCMCUBenchGuide.html');
});

app.get('/public/socket.io.js', function(req,res){
    res.sendFile(__dirname + '/public/socket.io.js');
});

app.get('/public/ieMediaStream.js', function(req,res){
    res.sendFile(__dirname + '/public/ieMediaStream.js');
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

app.get('/public/script2.js', function(req,res){
    res.sendFile(__dirname + '/public/script2.js');
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

app.get('/js/stat_c.js', function(req,res){
    res.sendFile(__dirname + '/js/stat_c.js');
});

app.get('/js/testfunction.js', function(req,res){
    res.sendFile(__dirname + '/js/testfunction.js');
});

app.get('/js/jquery-2.1.4.min.js', function(req,res){
    res.sendFile(__dirname + '/js/jquery-2.1.4.min.js');
});



/*app.get('/getUsers/:room', function(req, res) {
  var room = req.params.room;
  N.API.getUsers(room, function(users) {
    res.send(users);
  }, function(err) {
    res.send(err);
  });
});*/

app.post('/createToken/', function(req, res) {
  var room = req.body.room || myRoom,
    username = req.body.username,
    role = req.body.role;
  N.API.createToken(room, username, role, function(token) {
    res.send(token);
  }, function(err) {
    res.send(err);
  });
});


/*
app.post('/jitter', function(req, res){
    //var sTagFilename = "./native/Data/senderTagFile.txt";
    //var rTagFilename = "./native/Data/receive_timestamp.txt";
        var rTagFilename = "./native/Data/receive_timestamp.txt"

    var exec = require('child_process').exec;
    exec('./native/flr ' + rTagFilename, function(err, data, stderr) {
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
*/


app.post('/jitter', function(req, res){
    var rTagFilename = "./native/Data/localLatency.txt";
    var exec = require('child_process').exec;
    exec('./native/FLR ' + rTagFilename, function(err, data, stderr) {
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

/*
app.post('/latency', function(req, res){
    var sTagFilename = "./native/Data/localPublishTime.txt";
//  var rTagFilename = "./native/Data/localLatency.txt";

//  var sTagFilename = "./native/Data/PublishTagAndTimeFile.txt";
  var rTagFilename = "./native/Data/receive_timestamp.txt";
    var exec = require('child_process').exec;
    exec('./native/latency ' + sTagFilename + ' ' + rTagFilename, function(err, data, stderr) {
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
*/


app.post('/latency', function(req, res){
    var sTagFilename = "./native/Data/localPublishTime.txt";
    var rTagFilename = "./native/Data/localLatency.txt";
    var exec = require('child_process').exec;
    exec('./native/latency ' + sTagFilename + ' ' + rTagFilename, function(err, data, stderr) {
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
  var fpsFilename = "./native/Data/localFPS.txt";
  var exec = require('child_process').exec;
  console.log('in fps post');
  exec('./native/fps ' + fpsFilename, function(err, data, stderr) {
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
  var bitrateFilename = "./native/Data/localBitrate.txt";
  var exec = require('child_process').exec;
  console.log('in bitrate post');
  exec('./native/bitrate ' + bitrateFilename, function(err, data, stderr) {
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

/*
app.post('/quality', function(req, res){
    var rawFilename = "./native/Data/localARGB.txt";
    var originFilename = "./native/video/vp8_raw_1280x720_framerate30-bitrate2000k-gop30.yuv"
    var exec = require('child_process').exec;
    exec('./native/iq_yuv ' + rawFilename + ' ' + originFilename, function(err, data, stderr) {
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
*/

app.post('/quality', function(req, res){
    var rawFilename = "./native/Data/localARGB.txt";
    var originFilename = "./native/video/FourPeople_1280x720_30_taged.avi"
    var exec = require('child_process').exec;
    exec('./native/iq_avi ' + rawFilename + ' ' + originFilename, function(err, data, stderr) {
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
    process.env['PYTHONPATH']="/home/webrtc/Yonghao/webrtc-qos-bench/mcu-bench_cpp/python/vmaf/python/src:" + process.env['PYTHONPATH'];

    exec('python python/vmaf_calculate.py', {env: process.env}, function(err, data, stderr) {
        //console.log(err, data, stderr);
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
/*
    var forwardtag = "./native/Data/forwardTagFile.txt";
    var mixtagfile = "./native/Data/mixTagFile.txt";
    var mixrawfile = "./native/Data/mixRawFile.txt";
  //new
  var fpsfile = "./native/Data/FpsFile.txt";
  var bitratefile = "./native/Data/BitrateFile.txt";
  var pttfile = "./native/Data/PublishTagAndTimeFile.txt";


app.post('/clear',function(req,res){
    console.log('clear ajax') ;
    res.json({success : 1});
    fs.open(forwardtag, 'w', function(err) {
        if(err) {
            return console.log(err);
        }
        //console.log("append a comma");
    });
    fs.open(mixtagfile, 'w', function(err) {
        if(err) {
            return console.log(err);
        }
        //console.log("append a comma");
    });
    fs.open(mixrawfile, 'w', function(err) {
        if(err) {
            return console.log(err);
        }
        //console.log("append a comma");
    });
    //new
    fs.open(fpsfile, 'w', function(err) {
        if(err) {
            return console.log(err);
        }
        //console.log("append a comma");
    });
    fs.open(bitratefile, 'w', function(err) {
        if(err) {
            return console.log(err);
        }
        //console.log("append a comma");
    });
    fs.open(pttfile, 'w', function(err) {
        if(err) {
            return console.log(err);
        }
        //console.log("append a comma");
    });
});

app.post('/sender', function(req, res){
    console.log('sender ajax');
    res.json({success : 1});

    //console.log(req);
    fs.appendFile(forwardtag, ',', function(err) {
        if(err) {
            return console.log(err);
        }
        fs.appendFile(forwardtag, req.body.std, function(err) {
            if(err) {
                return console.log(err);
            }

            console.log("save sender local tag data");
        });
    });

    fs.appendFile(mixtagfile, ',', function(err) {
        if(err) {
            return console.log(err);
        }
        fs.appendFile(mixtagfile, req.body.vtd, function(err) {
            if(err) {
                return console.log(err);
            }

            console.log("save sender mix tag data");
        });
    });

    fs.appendFile(mixrawfile, ',', function(err) {
        if(err) {
            return console.log(err);
        }

        fs.appendFile(mixrawfile, req.body.vrd, function(err) {
            if(err) {
                return console.log(err);
            }

            console.log("save sender mix raw data");
        });
    });

    //new
    fs.appendFile(fpsfile, ',', function(err) {
        if(err) {
            return console.log(err);
        }

        fs.appendFile(fpsfile, req.body.fpsd, function(err) {
            if(err) {
                return console.log(err);
            }

            console.log("save sender fps data");
        });
    });

    fs.appendFile(bitratefile, ',', function(err) {
        if(err) {
            return console.log(err);
        }

        fs.appendFile(bitratefile, req.body.brd, function(err) {
            if(err) {
                return console.log(err);
            }

            console.log("save sender bitrate data");
        });
    });

});



app.post('/bitratesender', function(req, res){
    //console.log('fpssender ajax');

    //new
    fs.appendFile(bitratefile, ',', function(err) {
        if(err) {
            return console.log(err);
        }
        fs.appendFile(bitratefile, req.body.brd, function(err) {
            if(err) {
                return console.log(err);
            }

            //console.log("save sender fps data");
        });
    });
    res.json({success : 1});
});



app.post('/fpssender', function(req, res){
  //console.log('fpssender ajax');

    //new
    fs.appendFile(fpsfile, ',', function(err) {
        if(err) {
            return console.log(err);
        }
        fs.appendFile(fpsfile, req.body.fpsd, function(err) {
            if(err) {
                return console.log(err);
            }

            //console.log("save sender fps data");
        });
    });
  res.json({success : 1});
});



app.post('/pttsender', function(req, res){
    //new
    fs.appendFile(pttfile, ',', function(err) {
        if(err) {
            return console.log(err);
        }

        fs.appendFile(pttfile, req.body.ptt, function(err) {
            if(err) {
                return console.log(err);
            }
        });
    });
  res.json({success : 1});
});



app.post('/mixsender', function(req, res){
  //console.log('mixsender ajax');

  //console.log('mixsender',req.body.vrd);
        fs.appendFile(mixrawfile, req.body.vrd, function(err) {
            if(err) {
                return console.log(err);
              //res.json({success : 0});
            } else{
              res.json({success : 1});
            }
            //console.log("save sender mix raw data");
        });
});

*/


















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
