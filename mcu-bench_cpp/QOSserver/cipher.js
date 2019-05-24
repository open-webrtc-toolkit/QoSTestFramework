/* global require, module */
'use strict';

const crypto = require('crypto');
const algorithm = 'aes-256-ctr';
const stream = require('stream');
const fs = require('fs');
const zlib = require('zlib');

function encrypt(password, text) {
  let cipher = crypto.createCipher(algorithm, password);
  let enc = cipher.update(text, 'utf8', 'hex');
  enc += cipher.final('hex');
  return enc;
}

function decrypt(password, text) {
  let decipher = crypto.createDecipherv(algorithm, password, null);
  let dec = decipher.update(text, 'hex', 'utf8');
  dec += decipher.final('utf8');
  return dec;
}

function lock(password, object, filename, cb) {
  let s = new stream.Readable();
  s._read = function noop() {};
  s.push(JSON.stringify(object));
  s.push(null);
  let out = fs.createWriteStream(filename);
  out.on('error', function(e) {
    cb(e);
  });
  out.on('finish', function() {
    cb(null);
  });
  s.pipe(zlib.createGzip()).pipe(crypto.createCipher(algorithm, password)).pipe(
    out);
}

function unlock(password, filename, cb) {
  let s = fs.createReadStream(filename);
  s.on('error', function(e) {
    cb(e);
  });
  let unzip = zlib.createGunzip();
  let buf = '';
  unzip.on('data', function(chunk) {
    buf += chunk.toString();
  });
  unzip.on('end', function() {
    cb(null, JSON.parse(buf));
  });
  unzip.on('error', function(e) {
    cb(e);
  });
  s.pipe(crypto.createDecipher(algorithm, password)).pipe(unzip);
}

module.exports = {
  encrypt: encrypt,
  decrypt: decrypt,
  k: crypto.pbkdf2Sync('woogeen', 'mcu', 4000, 128, 'sha1'),
  lock: lock,
  unlock: unlock
};
