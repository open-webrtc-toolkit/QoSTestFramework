// Copyright (C) <2019> Intel Corporation
//
// SPDX-License-Identifier: Apache-2.0
/*global require, __dirname, console, process*/
'use strict';

const express = require('express');
const morgan = require('morgan');
const fs = require('fs');
const https = require('https');
const crypto = require('crypto');
const exec = require('child_process').exec;
const path = require('path');
const conf = require('./conf.json');
const rootDir = __dirname + "/../";
const analysisDir = rootDir + "analysis/";
const nativeDir = analysisDir + "native/";
const dataDir = analysisDir + "dataset/Data/";
const sourceDir = analysisDir + "dataset/source/"
const clientDir = rootDir + "QOStestclient/";
const authorizationFileName  = 'token.txt'
const app = express();

const httpsOptions = {
  key: fs.readFileSync('cert/key.pem').toString(),
  cert: fs.readFileSync('cert/cert.pem').toString()
};

const httpServer = https.createServer(httpsOptions, app);
httpServer.listen(4004);

app.use(express.json());
app.use(express.urlencoded({
  extended: true
}));

app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods',
    'POST, GET, PUT, PATCH, OPTIONS, DELETE');
  res.header('Access-Control-Allow-Headers', 'origin, content-type');
  if (req.method == 'OPTIONS') {
    res.send(200);
  } else {
    next();
  }
});

app.get('/', function(req, res) {
  res.sendFile(__dirname + '/qostestframework.html');
});

app.get('/qostestframework_summary.html', function(req, res) {
  res.sendFile(__dirname + '/qostestframework_summary.html');
});

app.get('/js/stat.js', function(req, res) {
  res.sendFile(__dirname + '/js/stat.js');
});

app.get('/js/statAll.js', function(req, res) {
  res.sendFile(__dirname + '/js/statAll.js');
});

app.get('/js/util.js', function(req, res) {
  res.sendFile(__dirname + '/js/util.js');
});

const tokenStore = function(fileName) {
  if (fs.existsSync(fileName)) {
    fs.unlinkSync(fileName)
  }
  let id = crypto.randomBytes(32).toString('hex');
  let key = crypto.randomBytes(64).toString('hex');
  console.log("Id:", id);
  console.log("Key:", key);
  let writeStr = {
    'authorization': calculateClientSignature(id, key)
  };
  fs.writeFileSync(fileName, JSON.stringify(writeStr))
};

const checkFile = function(fileName) {
  return fs.existsSync(fileName) && !fs.lstatSync(fileName).isSymbolicLink()
}

const getAuthorization = function(fileName) {
  if (!checkFile(fileName)) {
    return undefined
  }
  return JSON.parse(fs.readFileSync(fileName).toString())['authorization'];
}

const calculateClientSignature = function(id, key) {
  let hash = crypto.createHmac('sha256', id)
    .update(key)
    .digest('hex');
  return hash
}

const parseHeader = function(header) {
  var params = {},
    array = [],
    p = header.split(','),
    i,
    j,
    val;

  for (i = 0; i < p.length; i += 1) {

    array = p[i].split('=');
    val = '';

    for (j = 1; j < array.length; j += 1) {
      if (array[j] === '') {
        val += '=';
      } else {
        val += array[j];
      }
    }

    params[array[0]] = val;

  }
  return params;
};

morgan.token('errormsg', function getErrorMsg(req) {
  return req.errormsg
})

var logDirectory = path.join(__dirname, 'logs')
fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory)
var accessLogStream = fs.createWriteStream(path.join(logDirectory, 'error.log'), {
  flags: 'a'
})

// setup the logger
app.use(morgan('combined', {
  stream: accessLogStream,
  skip: function(req, res) {
    return res.statusCode < 400
  }
}))
app.use(morgan(':errormsg', {
  stream: accessLogStream,
  skip: function(req, res) {
    return res.statusCode < 400
  }
}))

const authPath = ['/jitter', '/latency', '/fps', '/bitrate', '/quality',
  '/vmaf', '/NR', '/freezeRatio', '/getResultFolder', '/getCompareResultFolder',
  '/displayData', '/startTest', '/stopTest'
];
app.use(authPath, function(req, res, next) {
  let authorization = req.headers.authorization
  if (authorization === undefined) {
    return res.status(401).send('Unauthorized');
  } else {
    let parm = parseHeader(authorization)
    if (getAuthorization(authorizationFileName) != calculateClientSignature(parm.id, parm.key)) {
      return res.status(403).send('Forbidden');
    }
  }
  next();
});

app.post('/jitter', function(req, res) {
  let rTagFilename = dataDir + "localLatency.txt";
  let frameCount = conf.jitter.frameCount || "600";
  exec(nativeDir + 'FLR ' + rTagFilename + ' ' + frameCount, function(err, data, stderr) {
    if (err) {
      console.info('stderr:' + err.message);
      req.errormsg = err.stack
      res.status(500).send("Internal Server Error")
      return
    }
    if (data.length > 1) {
      res.json({
        jitter: data
      });
    } else {
      console.log('you did not offer args');
      res.json({
        errmsg: 'you did not offer args'
      });
    }
  });
});

app.post('/latency', function(req, res) {
  let sTagFilename = dataDir + "localPublishTime.txt";
  let rTagFilename = dataDir + "localLatency.txt";
  let frameCount = conf.latency.frameCount || "600"; 
  exec(nativeDir + 'latency ' + sTagFilename + ' ' + rTagFilename + ' ' + frameCount, function(
    err, data, stderr) {
    if (err) {
      console.info('stderr:' + stderr);
      req.errormsg = err.stack
      res.status(500).send("Internal Server Error")
      return
    }
    if (data.length > 1) {
      res.json({
        latency: data
      });
    } else {
      console.log('you did not offer args');
      res.json({
        errmsg: 'you did not offer args'
      });
    }
  });
});

app.post('/fps', function(req, res) {
  let fpsFilename = dataDir + "localFps.txt";
  console.log('in fps post');
  exec(nativeDir + 'fps ' + fpsFilename, function(err, data, stderr) {
    if (err) {
      console.info('stderr from fps:' + stderr);
      req.errormsg = err.stack
      console.info('the error stack is:' + req.errormsg);
      res.status(500).send("Internal Server Error")
      return
    }
    if (data.length > 1) {
      res.json({
        fps: data
      });
    } else {
      console.log('fps file trans error');
      res.json({
        errmsg: 'fps file trans error'
      });
    }
  });
});

app.post('/bitrate', function(req, res) {
  let bitrateFilename = dataDir + "localBitrate.txt";
  console.log('in bitrate post');
  exec(nativeDir + 'bitrate ' + bitrateFilename, function(err, data,
    stderr) {
    if (err) {
      console.info('stderr from bitrate:' + stderr);
      req.errormsg = err.stack
      res.status(500).send("Internal Server Error")
      return
    }
    if (data.length > 1) {
      res.json({
        bitrate: data
      });
    } else {
      console.log('bitrate file trans error');
      res.json({
        errmsg: 'bitrate file trans error'
      });
    }
  });
});

app.post('/quality', function(req, res) {

  let originFilename = conf.quality.originFilename;
  let width = conf.quality.width;
  let height = conf.quality.height;
  let rawFilename = dataDir + "localARGB.txt";
  let exec_file = undefined;
  if (originFilename.indexOf(';') !== -1) {
    console.err("wrong file name");
    res.json({
      errmsg: "wrong file name"
    });
  }
  if (width.indexOf(';') !== -1) {
    console.err("wrong resolution width");
    res.json({
      errmsg: "wrong file name"
    });
  }
  if (height.indexOf(';') !== -1) {
    console.err("wrong resolution height");
    res.json({
      errmsg: "wrong file name"
    });
  }
  if (originFilename.endsWith('.yuv')) {
    exec_file = 'iq_yuv ';
  } else {
    exec_file = 'iq_avi ';
  }
  exec(nativeDir + exec_file + rawFilename + ' ' + originFilename + ' ' +
    width + ' ' + height, function(err, data, stderr) {
    if (err) {
      console.info('stderr from quality:' + stderr);
      req.errormsg = err.stack
      res.status(500).send("Internal Server Error")
      return
    }
    if (data.length > 1) {
      res.json({
        quality: data
      });
    } else {
      console.log('you did not offer args');
      res.json({
        errmsg: 'you did not offer args'
      });
    }
  });
});

app.post('/vmaf', function(req, res) {
  process.env['PYTHONPATH'] = (process.env['PYTHONPATH'] || '');
  exec('python ' + analysisDir + 'python/vmaf_calculate.py', {
    env: process.env
  }, function(err, data, stderr) {
    if (err) {
      console.info('stderr from vmaf:' + stderr);
      req.errormsg = err.stack
      res.status(500).send("Internal Server Error")
      return
    }
    res.json({
      vmaf: data
    });
  });
});

app.post('/NR', function(req, res) {
  exec('python ' + analysisDir + 'python/NR_calculate.py', function(err,
    data, stderr) {
    if (err) {
      console.info('stderr from NR:' + stderr);
      req.errormsg = err.stack
      res.status(500).send("Internal Server Error")
      return
    }
    res.json({
      NR: data
    });
  });
});

app.post('/freezeRatio', function(req, res) {
  let g_input = conf.freezeRatio.g_input || "cut.mp4";
  let max_drop_count = conf.freezeRatio.max_drop_count || '0';
  let hi = conf.freezeRatio.hi || '768';
  let lo = conf.freezeRatio.lo || '320';
  let frac = conf.freezeRatio.frac || '0.330000';
  let freeze_threshold = conf.freezeRatio.freeze_threshold || '1';
  console.info('python ' + analysisDir + 'python/freeze_ratio.py ' + analysisDir +'dataset/output/' + g_input + ' -m ' + max_drop_count + ' -h ' + hi + ' -l ' + lo + ' -fr ' + frac + ' -len ' + freeze_threshold);
  exec('python ' + analysisDir + 'python/freeze_ratio.py ' + analysisDir +'dataset/output/' + g_input + ' -m ' + max_drop_count + ' -h ' + hi + ' -l ' + lo + ' -fr ' + frac + ' -len ' + freeze_threshold, function(err,
    data, stderr) {
    if (err) {
      console.info('stderr from freezeRatio:' + stderr);
      req.errormsg = err.stack
      res.status(500).send("Internal Server Error")
      return
    }
    res.json({
      freeze: data
    });
  });
});

app.post('/getResultFolder', function(req, res) {
  exec('python python/listFolder.py -l 1', function(err, data, stderr) {
    console.log(data);
    if (err) {
      console.info('stderr :' + stderr);
      req.errormsg = err.stack
      res.status(500).send("Internal Server Error")
      return
    }
    res.json({
      folder: data
    });
  });
});

app.post('/getCompareResultFolder', function(req, res) {
  let folder = req.body.folder;
  let ftFolder;
  if (folder != undefined) {
    console.log("folder is", folder);
    if(folder.indexOf(";") !== -1) {
      console.log("folder name invalid.");
      res.status(500).send("wrong parameter")
      return
    } else {
      ftFolder = folder;
      exec('python python/listFolder.py ' + '-f ' + ftFolder, function(err,
        data, stderr) {
        if (err) {
          console.info('stderr :' + stderr);
          req.errormsg = err.stack
          res.status(500).send("Internal Server Error");
          return;
        }
        console.log(data);
        res.json({
          folder: data
        });
      });
    }
  } else {
    exec('python python/listFolder.py -l 0', function(err, data, stderr) {
      console.log(data);
      if (err) {
        console.info('stderr :' + stderr);
        req.errormsg = err.stack
        res.status(500).send("Internal Server Error");
        return;
      }
      res.json({
        folder: data
      });
    });
  }
});

app.post('/displayData', function(req, res) {
  let folder = req.body.folder;
  let file = req.body.file;
  let ftFolder, ftFile;
  if(folder.indexOf(";") !== -1) {
    console.err("wrong folder ", folder);
    res.status(500).send("wrong parameter.");
    return;
  } else {
    ftFolder = folder;
  }

  if(file.indexOf(";") !== -1){
    console.err("wrong filename ", file);
    res.status(500).send("wrong VREyeParameters.");
    return;
  } else {
    ftFile = file;
  }
  
  exec('python python/display_data.py ' + '-c ' + ftFolder + ' ' + '-f ' +
    ftFile, function(err, data, stderr) {
    if (err) {
      console.info('stderr :' + stderr);
      req.errormsg = err.stack
      res.status(500).send("Internal Server Error")
      return
    }
    res.json({
      data: data
    });
  });
});

app.post('/startTest', function(req, res) {
  exec('python ' + clientDir + 'scripts/runQosClient.py', function(err) {
    if (err) {
      console.info('stderr owt_conf_sample:' + err);
    }
  });
  res.send("OK");
});

app.post('/stopTest', function(req, res) {
  exec(
    'ps aux | grep owt_conf_sample | grep -v \"grep\" | awk \'{print $2}\'|xargs kill -9 >/dev/null 2>&1 ',
    function(err) {
      if (err) {
        console.info('stderr form kill owt_conf_sample:' + err);
      }
    });
  res.send("OK");
});

app.use(function(err, req, res, next) {
  console.error(err); // Log error message in our server's console
  if (!err.statusCode) err.statusCode =
    500; // If err has no specified error code, set error code to 'Internal Server Error (500)'
  req.errormsg = err.stack
  res.status(err.statusCode).send(err.message); // All HTTP requests must have a response, so let's send back an error with its status code and message
});

tokenStore(authorizationFileName)
