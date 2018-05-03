(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.Ics = f()}})(function(){var define,module,exports;return (function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
/*global unescape*/
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var Base64 = exports.Base64 = function () {
  var END_OF_INPUT, base64Chars, reverseBase64Chars, base64Str, base64Count, i, setBase64Str, readBase64, encodeBase64, readReverseBase64, ntos, decodeBase64;

  END_OF_INPUT = -1;

  base64Chars = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '+', '/'];

  reverseBase64Chars = [];

  for (i = 0; i < base64Chars.length; i = i + 1) {
    reverseBase64Chars[base64Chars[i]] = i;
  }

  setBase64Str = function setBase64Str(str) {
    base64Str = str;
    base64Count = 0;
  };

  readBase64 = function readBase64() {
    var c;
    if (!base64Str) {
      return END_OF_INPUT;
    }
    if (base64Count >= base64Str.length) {
      return END_OF_INPUT;
    }
    c = base64Str.charCodeAt(base64Count) & 0xff;
    base64Count = base64Count + 1;
    return c;
  };

  encodeBase64 = function encodeBase64(str) {
    var result, inBuffer, done;
    setBase64Str(str);
    result = '';
    inBuffer = new Array(3);
    done = false;
    while (!done && (inBuffer[0] = readBase64()) !== END_OF_INPUT) {
      inBuffer[1] = readBase64();
      inBuffer[2] = readBase64();
      result = result + base64Chars[inBuffer[0] >> 2];
      if (inBuffer[1] !== END_OF_INPUT) {
        result = result + base64Chars[inBuffer[0] << 4 & 0x30 | inBuffer[1] >> 4];
        if (inBuffer[2] !== END_OF_INPUT) {
          result = result + base64Chars[inBuffer[1] << 2 & 0x3c | inBuffer[2] >> 6];
          result = result + base64Chars[inBuffer[2] & 0x3F];
        } else {
          result = result + base64Chars[inBuffer[1] << 2 & 0x3c];
          result = result + '=';
          done = true;
        }
      } else {
        result = result + base64Chars[inBuffer[0] << 4 & 0x30];
        result = result + '=';
        result = result + '=';
        done = true;
      }
    }
    return result;
  };

  readReverseBase64 = function readReverseBase64() {
    if (!base64Str) {
      return END_OF_INPUT;
    }
    while (true) {
      if (base64Count >= base64Str.length) {
        return END_OF_INPUT;
      }
      var nextCharacter = base64Str.charAt(base64Count);
      base64Count = base64Count + 1;
      if (reverseBase64Chars[nextCharacter]) {
        return reverseBase64Chars[nextCharacter];
      }
      if (nextCharacter === 'A') {
        return 0;
      }
    }
  };

  ntos = function ntos(n) {
    n = n.toString(16);
    if (n.length === 1) {
      n = "0" + n;
    }
    n = "%" + n;
    return unescape(n);
  };

  decodeBase64 = function decodeBase64(str) {
    var result, inBuffer, done;
    setBase64Str(str);
    result = "";
    inBuffer = new Array(4);
    done = false;
    while (!done && (inBuffer[0] = readReverseBase64()) !== END_OF_INPUT && (inBuffer[1] = readReverseBase64()) !== END_OF_INPUT) {
      inBuffer[2] = readReverseBase64();
      inBuffer[3] = readReverseBase64();
      result = result + ntos(inBuffer[0] << 2 & 0xff | inBuffer[1] >> 4);
      if (inBuffer[2] !== END_OF_INPUT) {
        result += ntos(inBuffer[1] << 4 & 0xff | inBuffer[2] >> 2);
        if (inBuffer[3] !== END_OF_INPUT) {
          result = result + ntos(inBuffer[2] << 6 & 0xff | inBuffer[3]);
        } else {
          done = true;
        }
      } else {
        done = true;
      }
    }
    return result;
  };

  return {
    encodeBase64: encodeBase64,
    decodeBase64: decodeBase64
  };
}();

},{}],2:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var AudioCodec = exports.AudioCodec = {
  PCMU: 'pcmu',
  PCMA: 'pcma',
  OPUS: 'opus',
  G722: 'g722',
  ISAC: 'iSAC',
  ILBC: 'iLBC',
  AAC: 'aac',
  AC3: 'ac3',
  NELLYMOSER: 'nellymoser'
};
/**
 * @class AudioCodecParameters
 * @memberOf Ics.Base
 * @classDesc Codec parameters for an audio track.
 * @hideconstructor
 */

var AudioCodecParameters = exports.AudioCodecParameters = function AudioCodecParameters(name, channelCount, clockRate) {
  _classCallCheck(this, AudioCodecParameters);

  /**
   * @member {string} name
   * @memberof Ics.Base.AudioCodecParameters
   * @instance
   * @desc Name of a codec. Please a value in Ics.Base.AudioCodec. However, some functions do not support all the values in Ics.Base.AudioCodec.
   */
  this.name = name;
  /**
   * @member {?number} channelCount
   * @memberof Ics.Base.AudioCodecParameters
   * @instance
   * @desc Numbers of channels for an audio track.
   */
  this.channelCount = channelCount;
  /**
   * @member {?number} clockRate
   * @memberof Ics.Base.AudioCodecParameters
   * @instance
   * @desc The codec clock rate expressed in Hertz.
   */
  this.clockRate = clockRate;
};

/**
 * @class AudioEncodingParameters
 * @memberOf Ics.Base
 * @classDesc Encoding parameters for sending an audio track.
 * @hideconstructor
 */


var AudioEncodingParameters = exports.AudioEncodingParameters = function AudioEncodingParameters(codec, maxBitrate) {
  _classCallCheck(this, AudioEncodingParameters);

  /**
   * @member {?Ics.Base.AudioCodecParameters} codec
   * @instance
   * @memberof Ics.Base.AudioEncodingParameters
   */
  this.codec = codec;
  /**
   * @member {?number} maxBitrate
   * @instance
   * @memberof Ics.Base.AudioEncodingParameters
   * @desc Max bitrate expressed in kbps.
   */
  this.maxBitrate = maxBitrate;
};

var VideoCodec = exports.VideoCodec = {
  VP8: 'vp8',
  VP9: 'vp9',
  H264: 'h264',
  H265: 'h265'
};

/**
 * @class VideoCodecParameters
 * @memberOf Ics.Base
 * @classDesc Codec parameters for a video track.
 * @hideconstructor
 */

var VideoCodecParameters = exports.VideoCodecParameters = function VideoCodecParameters(name, profile) {
  _classCallCheck(this, VideoCodecParameters);

  /**
   * @member {string} name
   * @memberof Ics.Base.VideoCodecParameters
   * @instance
   * @desc Name of a codec. Please a value in Ics.Base.AudioCodec. However, some functions do not support all the values in Ics.Base.AudioCodec.
   */
  this.name = name;
  /**
   * @member {?string} profile
   * @memberof Ics.Base.VideoCodecParameters
   * @instance
   * @desc The profile of a codec. Profile may not apply to all codecs.
   */
  this.profile = profile;
};

/**
 * @class VideoEncodingParameters
 * @memberOf Ics.Base
 * @classDesc Encoding parameters for sending a video track.
 * @hideconstructor
 */


var VideoEncodingParameters = exports.VideoEncodingParameters = function VideoEncodingParameters(codec, maxBitrate) {
  _classCallCheck(this, VideoEncodingParameters);

  /**
   * @member {?Ics.Base.VideoCodecParameters} codec
   * @instance
   * @memberof Ics.Base.VideoEncodingParameters
   */
  this.codec = codec;
  /**
   * @member {?number} maxBitrate
   * @instance
   * @memberof Ics.Base.VideoEncodingParameters
   * @desc Max bitrate expressed in bps.
   */
  this.maxBitrate = maxBitrate;
};

},{}],3:[function(require,module,exports){
// Copyright © 2017 Intel Corporation. All Rights Reserved.

'use strict';

/**
 * @class EventDispatcher
 * @classDesc A shim for EventTarget. Might be changed to EventTarget later.
 * @memberof Ics.Base
 * @hideconstructor
 */

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var EventDispatcher = exports.EventDispatcher = function EventDispatcher() {
  // Private vars
  var spec = {};
  spec.dispatcher = {};
  spec.dispatcher.eventListeners = {};

  /**
   * @function addEventListener
   * @desc This function registers a callback function as a handler for the corresponding event. It's shortened form is on(eventType, listener). See the event description in the following table.<br>
   * @instance
   * @memberof Ics.Base.EventDispatcher
   * @param {string} eventType Event string.
   * @param {function} listener Callback function.
   */
  this.addEventListener = function (eventType, listener) {
    if (spec.dispatcher.eventListeners[eventType] === undefined) {
      spec.dispatcher.eventListeners[eventType] = [];
    }
    spec.dispatcher.eventListeners[eventType].push(listener);
  };

  /**
   * @function removeEventListener
   * @desc This function removes a registered event listener.
   * @instance
   * @memberof Ics.Base.EventDispatcher
   * @param {string} eventType Event string.
   * @param {function} listener Callback function.
   */
  this.removeEventListener = function (eventType, listener) {
    if (!spec.dispatcher.eventListeners[eventType]) {
      return;
    }
    var index = spec.dispatcher.eventListeners[eventType].indexOf(listener);
    if (index !== -1) {
      spec.dispatcher.eventListeners[eventType].splice(index, 1);
    }
  };

  /**
   * @function clearEventListener
   * @desc This function removes all event listeners for one type.
   * @instance
   * @memberof Ics.Base.EventDispatcher
   * @param {string} eventType Event string.
   */
  this.clearEventListener = function (eventType) {
    spec.dispatcher.eventListeners[eventType] = [];
  };

  // It dispatch a new event to the event listeners, based on the type
  // of event. All events are intended to be LicodeEvents.
  this.dispatchEvent = function (event) {
    if (!spec.dispatcher.eventListeners[event.type]) {
      return;
    }
    spec.dispatcher.eventListeners[event.type].map(function (listener) {
      listener(event);
    });
  };
};

/**
 * @class IcsEvent
 * @classDesc Class IcsEvent represents a generic Event in the library.
 * @memberof Ics.Base
 * @hideconstructor
 */

var IcsEvent = exports.IcsEvent = function IcsEvent(type) {
  _classCallCheck(this, IcsEvent);

  this.type = type;
};

/**
 * @class MessageEvent
 * @classDesc Class MessageEvent represents a message Event in the library.
 * @memberof Ics.Base
 * @hideconstructor
 */


var MessageEvent = exports.MessageEvent = function (_IcsEvent) {
  _inherits(MessageEvent, _IcsEvent);

  function MessageEvent(type, init) {
    _classCallCheck(this, MessageEvent);

    /**
     * @member {string} origin
     * @instance
     * @memberof Ics.Base.MessageEvent
     * @desc ID of the remote endpoint who published this stream.
     */
    var _this = _possibleConstructorReturn(this, (MessageEvent.__proto__ || Object.getPrototypeOf(MessageEvent)).call(this, type));

    _this.origin = init.origin;
    /**
     * @member {string} message
     * @instance
     * @memberof Ics.Base.MessageEvent
     */
    _this.message = init.message;
    return _this;
  }

  return MessageEvent;
}(IcsEvent);

/**
 * @class ErrorEvent
 * @classDesc Class ErrorEvent represents an error Event in the library.
 * @memberof Ics.Base
 * @hideconstructor
 */


var ErrorEvent = exports.ErrorEvent = function (_IcsEvent2) {
  _inherits(ErrorEvent, _IcsEvent2);

  function ErrorEvent(type, init) {
    _classCallCheck(this, ErrorEvent);

    /**
     * @member {Error} error
     * @instance
     * @memberof Ics.Base.ErrorEvent
     */
    var _this2 = _possibleConstructorReturn(this, (ErrorEvent.__proto__ || Object.getPrototypeOf(ErrorEvent)).call(this, type));

    _this2.error = init.error;
    return _this2;
  }

  return ErrorEvent;
}(IcsEvent);

/**
 * @class MuteEvent
 * @classDesc Class MuteEvent represents a mute or unmute event.
 * @memberof Ics.Base
 * @hideconstructor
 */


var MuteEvent = exports.MuteEvent = function (_IcsEvent3) {
  _inherits(MuteEvent, _IcsEvent3);

  function MuteEvent(type, init) {
    _classCallCheck(this, MuteEvent);

    /**
     * @member {Ics.Base.TrackKind} kind
     * @instance
     * @memberof Ics.Base.MuteEvent
     */
    var _this3 = _possibleConstructorReturn(this, (MuteEvent.__proto__ || Object.getPrototypeOf(MuteEvent)).call(this, type));

    _this3.kind = init.kind;
    return _this3;
  }

  return MuteEvent;
}(IcsEvent);

},{}],4:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _mediastreamFactory = require('./mediastream-factory.js');

Object.keys(_mediastreamFactory).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _mediastreamFactory[key];
    }
  });
});

var _stream = require('./stream.js');

Object.keys(_stream).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _stream[key];
    }
  });
});

var _mediaformat = require('./mediaformat.js');

Object.keys(_mediaformat).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _mediaformat[key];
    }
  });
});

},{"./mediaformat.js":6,"./mediastream-factory.js":7,"./stream.js":10}],5:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
/*global console*/

/*
 * API to write logs based on traditional logging mechanisms: debug, trace, info, warning, error
 */
var Logger = function () {
  "use strict";

  var DEBUG = 0,
      TRACE = 1,
      INFO = 2,
      WARNING = 3,
      ERROR = 4,
      NONE = 5;

  var noOp = function noOp() {};

  // |that| is the object to be returned.
  var that = {
    DEBUG: DEBUG,
    TRACE: TRACE,
    INFO: INFO,
    WARNING: WARNING,
    ERROR: ERROR,
    NONE: NONE
  };

  that.log = window.console.log.bind(window.console);

  var bindType = function bindType(type) {
    if (typeof window.console[type] === 'function') {
      return window.console[type].bind(window.console);
    } else {
      return window.console.log.bind(window.console);
    }
  };

  var setLogLevel = function setLogLevel(level) {
    if (level <= DEBUG) {
      that.debug = bindType('log');
    } else {
      that.debug = noOp;
    }
    if (level <= TRACE) {
      that.trace = bindType('trace');
    } else {
      that.trace = noOp;
    }
    if (level <= INFO) {
      that.info = bindType('info');
    } else {
      that.info = noOp;
    }
    if (level <= WARNING) {
      that.warning = bindType('warn');
    } else {
      that.warning = noOp;
    }
    if (level <= ERROR) {
      that.error = bindType('error');
    } else {
      that.error = noOp;
    }
  };

  setLogLevel(DEBUG); // Default level is debug.

  that.setLogLevel = setLogLevel;

  return that;
}();

exports.default = Logger;

},{}],6:[function(require,module,exports){
'use strict';

/**
 * Source info about an audio track.
 * @memberOf Ics.Base
 * @readonly
 * @enum {string}
 */

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var AudioSourceInfo = exports.AudioSourceInfo = {
  MIC: 'mic',
  SCREENCAST: 'screen-cast',
  FILE: 'file',
  MIXED: 'mixed'
};

/**
 * Source info about a video track.
 * @memberOf Ics.Base
 * @readonly
 * @enum {string}
 */
var VideoSourceInfo = exports.VideoSourceInfo = {
  CAMERA: 'camera',
  SCREENCAST: 'screen-cast',
  FILE: 'file',
  MIXED: 'mixed'
};

/**
 * Kind of a track.
 * @memberOf Ics.Base
 * @readonly
 * @enum {string}
 */
var TrackKind = exports.TrackKind = {
  /**
   * Audio tracks.
   * @type string
   */
  AUDIO: 'audio',
  /**
   * Video tracks.
   * @type string
   */
  VIDEO: 'video',
  /**
   * Both audio and video tracks.
   * @type string
   */
  AUDIO_AND_VIDEO: 'av'
};

/**
 * @class Resolution
 * @memberOf Ics.Base
 * @classDesc The Resolution defines the size of a rectangle.
 * @constructor
 * @param {number} width
 * @param {number} height
 */

var Resolution = exports.Resolution = function Resolution(width, height) {
  _classCallCheck(this, Resolution);

  /**
   * @member {number} width
   * @instance
   * @memberof Ics.Base.Resolution
   */
  this.width = width;
  /**
   * @member {number} height
   * @instance
   * @memberof Ics.Base.Resolution
   */
  this.height = height;
};

},{}],7:[function(require,module,exports){
// Copyright © 2017 Intel Corporation. All Rights Reserved.
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.MediaStreamFactory = exports.StreamConstraints = exports.VideoTrackConstraints = exports.AudioTrackConstraints = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _utils = require('./utils.js');

var utils = _interopRequireWildcard(_utils);

var _logger = require('./logger.js');

var _logger2 = _interopRequireDefault(_logger);

var _mediaformat = require('./mediaformat.js');

var MediaFormatModule = _interopRequireWildcard(_mediaformat);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * @class AudioTrackConstraints
 * @classDesc Constraints for creating an audio MediaStreamTrack.
 * @memberof Ics.Base
 * @constructor
 * @param {Ics.Base.AudioSourceInfo} source Source info of this audio track.
 */
var AudioTrackConstraints = exports.AudioTrackConstraints = function AudioTrackConstraints(source) {
  _classCallCheck(this, AudioTrackConstraints);

  if (!Object.values(MediaFormatModule.AudioSourceInfo).some(function (v) {
    return v === source;
  })) {
    throw new TypeError('Invalid source.');
  }
  /**
   * @member {string} source
   * @memberof Ics.Base.AudioTrackConstraints
   * @desc Values could be "mic", "screen-cast", "file" or "mixed".
   * @instance
   */
  this.source = source;
  /**
   * @member {string} deviceId
   * @memberof Ics.Base.AudioTrackConstraints
   * @desc Do not provide deviceId if source is not "mic".
   * @instance
   * @see https://w3c.github.io/mediacapture-main/#def-constraint-deviceId
   */
  this.deviceId = undefined;
};

/**
 * @class VideoTrackConstraints
 * @classDesc Constraints for creating a video MediaStreamTrack.
 * @memberof Ics.Base
 * @constructor
 * @param {Ics.Base.VideoSourceInfo} source Source info of this video track.
 */


var VideoTrackConstraints = exports.VideoTrackConstraints = function VideoTrackConstraints(source) {
  _classCallCheck(this, VideoTrackConstraints);

  if (!Object.values(MediaFormatModule.VideoSourceInfo).some(function (v) {
    return v === source;
  })) {
    throw new TypeError('Invalid source.');
  }
  /**
   * @member {string} source
   * @memberof Ics.Base.VideoTrackConstraints
   * @desc Values could be "camera", "screen-cast", "file" or "mixed".
   * @instance
   */
  this.source = source;
  /**
   * @member {string} deviceId
   * @memberof Ics.Base.VideoTrackConstraints
   * @desc Do not provide deviceId if source is not "camera".
   * @instance
   * @see https://w3c.github.io/mediacapture-main/#def-constraint-deviceId
   */

  this.deviceId = undefined;

  /**
   * @member {Ics.Base.Resolution} resolution
   * @memberof Ics.Base.VideoTrackConstraints
   * @instance
   */
  this.resolution = undefined;

  /**
   * @member {number} frameRate
   * @memberof Ics.Base.VideoTrackConstraints
   * @instance
   */
  this.frameRate = undefined;
};
/**
 * @class StreamConstraints
 * @classDesc Constraints for creating a MediaStream from screen mic and camera.
 * @memberof Ics.Base
 * @constructor
 * @param {?Ics.Base.AudioTrackConstraints} audioConstraints
 * @param {?Ics.Base.VideoTrackConstraints} videoConstraints
 */


var StreamConstraints = exports.StreamConstraints = function StreamConstraints() {
  var audioConstraints = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
  var videoConstraints = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

  _classCallCheck(this, StreamConstraints);

  /**
   * @member {Ics.Base.MediaStreamTrackDeviceConstraintsForAudio} audio
   * @memberof Ics.Base.MediaStreamDeviceConstraints
   * @instance
   */
  this.audio = audioConstraints;
  /**
   * @member {Ics.Base.MediaStreamTrackDeviceConstraintsForVideo} Video
   * @memberof Ics.Base.MediaStreamDeviceConstraints
   * @instance
   */
  this.video = videoConstraints;
  /**
   * @member {string} extensionId
   * @memberof Ics.Base.MediaStreamDeviceConstraints
   * @desc The ID of Chrome Extension for screen sharing.
   * @instance
   */
};

function isVideoConstrainsForScreenCast(constraints) {
  return _typeof(constraints.video) === 'object' && constraints.video.source === MediaFormatModule.VideoSourceInfo.SCREENCAST;
}

/**
 * @class MediaStreamFactory
 * @classDesc A factory to create MediaStream. You can also create MediaStream by yourself.
 * @memberof Ics.Base
 */

var MediaStreamFactory = exports.MediaStreamFactory = function () {
  function MediaStreamFactory() {
    _classCallCheck(this, MediaStreamFactory);
  }

  _createClass(MediaStreamFactory, null, [{
    key: 'createMediaStream',

    /**
     * @function createMediaStream
     * @static
     * @desc Create a MediaStream with given constraints. If you want to create a MediaStream for screen cast, please make sure both audio and video's source are "screen-cast".
     * @memberof Ics.Base.MediaStreamFactory
     * @returns {Promise<MediaStream, Error>} Return a promise that is resolved when stream is successfully created, or rejected if one of the following error happened:
     * - One or more parameters cannot be satisfied.
     * - Specified device is busy.
     * - Cannot obtain necessary permission or operation is canceled by user.
     * - Video source is screen cast, while audio source is not.
     * - Audio source is screen cast, while video source is disabled.
     * @param {Ics.Base.MediaStreamDeviceConstraints|Ics.Base.MediaStreamScreenCastConstraints} constraints
     */
    value: function createMediaStream(constraints) {
      if ((typeof constraints === 'undefined' ? 'undefined' : _typeof(constraints)) !== 'object' || !constraints.audio && !constraints.video) {
        return Promise.reject(new TypeError('Invalid constrains'));
      }
      if (!isVideoConstrainsForScreenCast(constraints) && _typeof(constraints.audio) === 'object' && constraints.audio.source === MediaFormatModule.AudioSourceInfo.SCREENCAST) {
        return Promise.reject(new TypeError('Cannot share screen without video.'));
      }
      if (isVideoConstrainsForScreenCast(constraints) && !utils.isChrome() && !utils.isFirefox()) {
        return Promise.reject(new TypeError('Screen sharing only supports Chrome and Firefox.'));
      }
      if (isVideoConstrainsForScreenCast(constraints) && _typeof(constraints.audio) === 'object' && constraints.audio.source !== MediaFormatModule.AudioSourceInfo.SCREENCAST) {
        return Promise.reject(new TypeError('Cannot capture video from screen cast while capture audio from other source.'));
      };
      // Screen sharing on Chrome does not work with the latest constraints format.
      if (isVideoConstrainsForScreenCast(constraints) && utils.isChrome()) {
        if (!constraints.extensionId) {
          return Promise.reject(new TypeError('Extension ID must be specified for screen sharing on Chrome.'));
        }
        var desktopCaptureSources = ['screen', 'window', 'tab'];
        if (constraints.audio) {
          desktopCaptureSources.push('audio');
        }
        return new Promise(function (resolve, reject) {
          chrome.runtime.sendMessage(constraints.extensionId, {
            getStream: desktopCaptureSources
          }, function (response) {
            if (response === undefined) {
              return reject(new Error(chrome.runtime.lastError.message));
            }
            if (constraints.audio && _typeof(response.options) !== 'object') {
              _logger2.default.warning('Desktop sharing with audio requires the latest Chrome extension. Your audio constraints will be ignored.');
            }
            var mediaConstraints = Object.create({});
            if (constraints.audio && _typeof(response.options) === 'object') {
              if (response.options.canRequestAudioTrack) {
                mediaConstraints.audio = {
                  mandatory: {
                    chromeMediaSource: 'desktop',
                    chromeMediaSourceId: response.streamId
                  }
                };
              } else {
                _logger2.default.warning('Sharing screen with audio was not selected by user.');
              }
            }
            mediaConstraints.video = Object.create({});
            mediaConstraints.video.mandatory = Object.create({});
            mediaConstraints.video.mandatory.chromeMediaSource = 'desktop';
            mediaConstraints.video.mandatory.chromeMediaSourceId = response.streamId;
            // Transform new constraint format to the old style. Because chromeMediaSource only supported in the old style, and mix new and old style will result type error: "Cannot use both optional/mandatory and specific or advanced constraints.".
            if (constraints.video.resolution) {
              mediaConstraints.video.mandatory.maxHeight = mediaConstraints.video.mandatory.minHeight = constraints.video.resolution.height;
              mediaConstraints.video.mandatory.maxWidth = mediaConstraints.video.mandatory.minWidth = constraints.video.resolution.width;
            }
            if (constraints.video.frameRate) {
              mediaConstraints.video.mandatory.minFrameRate = constraints.video.frameRate;
              mediaConstraints.video.mandatory.maxFrameRate = constraints.video.frameRate;
            }
            resolve(navigator.mediaDevices.getUserMedia(mediaConstraints));
          });
        });
      } else {
        if (!constraints.audio && !constraints.video) {
          return Promise.reject(new TypeError('At least one of audio and video must be requested.'));
        }
        var mediaConstraints = Object.create({});
        if (_typeof(constraints.audio) === 'object' && constraints.audio.source === MediaFormatModule.AudioSourceInfo.MIC) {
          mediaConstraints.audio = Object.create({});
          mediaConstraints.audio.deviceId = constraints.audio.deviceId;
        } else {
          mediaConstraints.audio = constraints.audio;
        }
        if (_typeof(constraints.audio) === 'object' && constraints.audio.source === MediaFormatModule.AudioSourceInfo.SCREENCAST) {
          _logger2.default.warning('Screen sharing with audio is not supported in Firefox.');
          mediaConstraints.audio = false;
        }
        if (_typeof(constraints.video) === 'object') {
          mediaConstraints.video = Object.create({});
          if (typeof constraints.video.frameRate === 'number') {
            mediaConstraints.video.frameRate = constraints.video.frameRate;
          }
          if (constraints.video.resolution && constraints.video.resolution.width && constraints.video.resolution.height) {
            mediaConstraints.video.width = Object.create({});
            mediaConstraints.video.width.exact = constraints.video.resolution.width;
            mediaConstraints.video.height = Object.create({});
            mediaConstraints.video.height.exact = constraints.video.resolution.height;
          }
          if (constraints.video.deviceId instanceof String) {
            mediaConstraints.video.deviceId = constraints.video.deviceId;
          }
          if (utils.isFirefox() && constraints.video.source === MediaFormatModule.VideoSourceInfo.SCREENCAST) {
            mediaConstraints.video.mediaSource = 'screen';
          }
        } else {
          mediaConstraints.video = constraints.video;
        }
        return navigator.mediaDevices.getUserMedia(mediaConstraints);
      }
    }
  }]);

  return MediaStreamFactory;
}();

},{"./logger.js":5,"./mediaformat.js":6,"./utils.js":11}],8:[function(require,module,exports){
// Copyright © 2017 Intel Corporation. All Rights Reserved.

'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.PublishOptions = exports.Publication = exports.PublicationSettings = exports.VideoPublicationSettings = exports.AudioPublicationSettings = undefined;

var _utils = require('./utils.js');

var Utils = _interopRequireWildcard(_utils);

var _mediaformat = require('./mediaformat.js');

var MediaFormat = _interopRequireWildcard(_mediaformat);

var _event = require('../base/event.js');

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * @class AudioPublicationSettings
 * @memberOf Ics.Base
 * @classDesc The audio settings of a publication.
 * @hideconstructor
 */
var AudioPublicationSettings = exports.AudioPublicationSettings = function AudioPublicationSettings(codec) {
  _classCallCheck(this, AudioPublicationSettings);

  /**
   * @member {?Ics.Base.AudioCodecParameters} codec
   * @instance
   * @memberof Ics.Base.AudioPublicationSettings
   */
  this.codec = codec;
};

/**
 * @class VideoPublicationSettings
 * @memberOf Ics.Base
 * @classDesc The video settings of a publication.
 * @hideconstructor
 */


var VideoPublicationSettings = exports.VideoPublicationSettings = function VideoPublicationSettings(codec, resolution, frameRate, bitrate, keyFrameInterval) {
  _classCallCheck(this, VideoPublicationSettings);

  /**
   * @member {?Ics.Base.VideoCodecParameters} codec
   * @instance
   * @memberof Ics.Base.VideoPublicationSettings
   */
  this.codec = codec,
  /**
   * @member {?Ics.Base.Resolution} resolution
   * @instance
   * @memberof Ics.Base.VideoPublicationSettings
   */
  this.resolution = resolution;
  /**
   * @member {?number} frameRates
   * @instance
   * @memberof Ics.Base.VideoPublicationSettings
   */
  this.frameRate = frameRate;
  /**
   * @member {?number} bitrate
   * @instance
   * @memberof Ics.Base.VideoPublicationSettings
   */
  this.bitrate = bitrate;
  /**
   * @member {?number} keyFrameIntervals
   * @instance
   * @memberof Ics.Base.VideoPublicationSettings
   */
  this.keyFrameInterval = keyFrameInterval;
};

/**
 * @class PublicationSettings
 * @memberOf Ics.Base
 * @classDesc The settings of a publication.
 * @hideconstructor
 */


var PublicationSettings = exports.PublicationSettings = function PublicationSettings(audio, video) {
  _classCallCheck(this, PublicationSettings);

  /**
   * @member {Ics.Base.AudioPublicationSettings} audio
   * @instance
   * @memberof Ics.Base.PublicationSettings
   */
  this.audio = audio;
  /**
   * @member {Ics.Base.VideoPublicationSettings} video
   * @instance
   * @memberof Ics.Base.PublicationSettings
   */
  this.video = video;
};

/**
 * @class Publication
 * @memberOf Ics.Base
 * @classDesc Publication represents a sender for publishing a stream. It handles the actions on a LocalStream published to a conference.
 * Events:
 *
 * | Event Name      | Argument Type    | Fired when       |
 * | ----------------| ---------------- | ---------------- |
 * | ended           | Event            | Publication is ended. |
 * | mute            | MuteEvent        | Publication is muted. Client stopped sending audio and/or video data to remote endpoint. |
 * | unmute          | MuteEvent        | Publication is unmuted. Client continued sending audio and/or video data to remote endpoint. |
 *
 * @hideconstructor
 */


var Publication = exports.Publication = function (_EventDispatcher) {
  _inherits(Publication, _EventDispatcher);

  function Publication(id, stop, getStats, mute, unmute) {
    _classCallCheck(this, Publication);

    /**
     * @member {string} id
     * @instance
     * @memberof Ics.Base.Publication
     */
    var _this = _possibleConstructorReturn(this, (Publication.__proto__ || Object.getPrototypeOf(Publication)).call(this));

    Object.defineProperty(_this, 'id', {
      configurable: false,
      writable: false,
      value: id ? id : Utils.createUuid()
    });
    /**
     * @function stop
     * @instance
     * @desc Stop certain publication. Once a subscription is stopped, it cannot be recovered.
     * @memberof Ics.Base.Publication
     * @returns {undefined}
     */
    _this.stop = stop;
    /**
     * @function getStats
     * @instance
     * @desc Get stats of underlying PeerConnection.
     * @memberof Ics.Base.Publication
     * @returns {Promise<RTCStatsReport, Error>}
     */
    _this.getStats = getStats;
    /**
     * @function mute
     * @instance
     * @desc Stop sending data to remote endpoint.
     * @memberof Ics.Base.Publication
     * @param {Ics.Base.TrackKind } kind Kind of tracks to be muted.
     * @returns {Promise<undefined, Error>}
     */
    _this.mute = mute;
    /**
     * @function unmute
     * @instance
     * @desc Continue sending data to remote endpoint.
     * @memberof Ics.Base.Publication
     * @param {Ics.Base.TrackKind } kind Kind of tracks to be unmuted.
     * @returns {Promise<undefined, Error>}
     */
    _this.unmute = unmute;
    return _this;
  }

  return Publication;
}(_event.EventDispatcher);

/**
 * @class PublishOptions
 * @memberOf Ics.Base
 * @classDesc PublishOptions defines options for publishing a Ics.Base.LocalStream.
 */


var PublishOptions = exports.PublishOptions = function PublishOptions(audio, video) {
  _classCallCheck(this, PublishOptions);

  /**
   * @member {?Array<Ics.Base.AudioEncodingParameters>} audio
   * @instance
   * @memberof Ics.Base.PublishOptions
   */
  this.audio = audio;
  /**
   * @member {?Array<Ics.Base.VideoEncodingParameters>} video
   * @instance
   * @memberof Ics.Base.PublishOptions
   */
  this.video = video;
};

},{"../base/event.js":3,"./mediaformat.js":6,"./utils.js":11}],9:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.reorderCodecs = reorderCodecs;
exports.setMaxBitrate = setMaxBitrate;

var _logger = require('./logger.js');

var _logger2 = _interopRequireDefault(_logger);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

'use strict'; /*
               *  Copyright (c) 2014 The WebRTC project authors. All Rights Reserved.
               *
               *  Use of this source code is governed by a BSD-style license
               *  that can be found in the LICENSE file in the root of the source
               *  tree.
               */

/* More information about these options at jshint.com/docs/options */

/* globals  adapter, trace */
/* exported setCodecParam, iceCandidateType, formatTypePreference,
   maybeSetOpusOptions, maybePreferAudioReceiveCodec,
   maybePreferAudioSendCodec, maybeSetAudioReceiveBitRate,
   maybeSetAudioSendBitRate, maybePreferVideoReceiveCodec,
   maybePreferVideoSendCodec, maybeSetVideoReceiveBitRate,
   maybeSetVideoSendBitRate, maybeSetVideoSendInitialBitRate,
   maybeRemoveVideoFec, mergeConstraints, removeCodecParam*/

/* This file is borrowed from apprtc with some modifications. */
/* Commit hash: c6af0c25e9af527f71b3acdd6bfa1389d778f7bd + PR 530 */

function mergeConstraints(cons1, cons2) {
  if (!cons1 || !cons2) {
    return cons1 || cons2;
  }
  var merged = cons1;
  for (var key in cons2) {
    merged[key] = cons2[key];
  }
  return merged;
}

function iceCandidateType(candidateStr) {
  return candidateStr.split(' ')[7];
}

// Turns the local type preference into a human-readable string.
// Note that this mapping is browser-specific.
function formatTypePreference(pref) {
  if (adapter.browserDetails.browser === 'chrome') {
    switch (pref) {
      case 0:
        return 'TURN/TLS';
      case 1:
        return 'TURN/TCP';
      case 2:
        return 'TURN/UDP';
      default:
        break;
    }
  } else if (adapter.browserDetails.browser === 'firefox') {
    switch (pref) {
      case 0:
        return 'TURN/TCP';
      case 5:
        return 'TURN/UDP';
      default:
        break;
    }
  }
  return '';
}

function maybeSetOpusOptions(sdp, params) {
  // Set Opus in Stereo, if stereo is true, unset it, if stereo is false, and
  // do nothing if otherwise.
  if (params.opusStereo === 'true') {
    sdp = setCodecParam(sdp, 'opus/48000', 'stereo', '1');
  } else if (params.opusStereo === 'false') {
    sdp = removeCodecParam(sdp, 'opus/48000', 'stereo');
  }

  // Set Opus FEC, if opusfec is true, unset it, if opusfec is false, and
  // do nothing if otherwise.
  if (params.opusFec === 'true') {
    sdp = setCodecParam(sdp, 'opus/48000', 'useinbandfec', '1');
  } else if (params.opusFec === 'false') {
    sdp = removeCodecParam(sdp, 'opus/48000', 'useinbandfec');
  }

  // Set Opus DTX, if opusdtx is true, unset it, if opusdtx is false, and
  // do nothing if otherwise.
  if (params.opusDtx === 'true') {
    sdp = setCodecParam(sdp, 'opus/48000', 'usedtx', '1');
  } else if (params.opusDtx === 'false') {
    sdp = removeCodecParam(sdp, 'opus/48000', 'usedtx');
  }

  // Set Opus maxplaybackrate, if requested.
  if (params.opusMaxPbr) {
    sdp = setCodecParam(sdp, 'opus/48000', 'maxplaybackrate', params.opusMaxPbr);
  }
  return sdp;
}

function maybeSetAudioSendBitRate(sdp, params) {
  if (!params.audioSendBitrate) {
    return sdp;
  }
  _logger2.default.debug('Prefer audio send bitrate: ' + params.audioSendBitrate);
  return preferBitRate(sdp, params.audioSendBitrate, 'audio');
}

function maybeSetAudioReceiveBitRate(sdp, params) {
  if (!params.audioRecvBitrate) {
    return sdp;
  }
  _logger2.default.debug('Prefer audio receive bitrate: ' + params.audioRecvBitrate);
  return preferBitRate(sdp, params.audioRecvBitrate, 'audio');
}

function maybeSetVideoSendBitRate(sdp, params) {
  if (!params.videoSendBitrate) {
    return sdp;
  }
  _logger2.default.debug('Prefer video send bitrate: ' + params.videoSendBitrate);
  return preferBitRate(sdp, params.videoSendBitrate, 'video');
}

function maybeSetVideoReceiveBitRate(sdp, params) {
  if (!params.videoRecvBitrate) {
    return sdp;
  }
  _logger2.default.debug('Prefer video receive bitrate: ' + params.videoRecvBitrate);
  return preferBitRate(sdp, params.videoRecvBitrate, 'video');
}

// Add a b=AS:bitrate line to the m=mediaType section.
function preferBitRate(sdp, bitrate, mediaType) {
  var sdpLines = sdp.split('\r\n');

  // Find m line for the given mediaType.
  var mLineIndex = findLine(sdpLines, 'm=', mediaType);
  if (mLineIndex === null) {
    _logger2.default.debug('Failed to add bandwidth line to sdp, as no m-line found');
    return sdp;
  }

  // Find next m-line if any.
  var nextMLineIndex = findLineInRange(sdpLines, mLineIndex + 1, -1, 'm=');
  if (nextMLineIndex === null) {
    nextMLineIndex = sdpLines.length;
  }

  // Find c-line corresponding to the m-line.
  var cLineIndex = findLineInRange(sdpLines, mLineIndex + 1, nextMLineIndex, 'c=');
  if (cLineIndex === null) {
    _logger2.default.debug('Failed to add bandwidth line to sdp, as no c-line found');
    return sdp;
  }

  // Check if bandwidth line already exists between c-line and next m-line.
  var bLineIndex = findLineInRange(sdpLines, cLineIndex + 1, nextMLineIndex, 'b=AS');
  if (bLineIndex) {
    sdpLines.splice(bLineIndex, 1);
  }

  // Create the b (bandwidth) sdp line.
  var bwLine = 'b=AS:' + bitrate;
  // As per RFC 4566, the b line should follow after c-line.
  sdpLines.splice(cLineIndex + 1, 0, bwLine);
  sdp = sdpLines.join('\r\n');
  return sdp;
}

// Add an a=fmtp: x-google-min-bitrate=kbps line, if videoSendInitialBitrate
// is specified. We'll also add a x-google-min-bitrate value, since the max
// must be >= the min.
function maybeSetVideoSendInitialBitRate(sdp, params) {
  var initialBitrate = parseInt(params.videoSendInitialBitrate);
  if (!initialBitrate) {
    return sdp;
  }

  // Validate the initial bitrate value.
  var maxBitrate = parseInt(initialBitrate);
  var bitrate = parseInt(params.videoSendBitrate);
  if (bitrate) {
    if (initialBitrate > bitrate) {
      _logger2.default.debug('Clamping initial bitrate to max bitrate of ' + bitrate + ' kbps.');
      initialBitrate = bitrate;
      params.videoSendInitialBitrate = initialBitrate;
    }
    maxBitrate = bitrate;
  }

  var sdpLines = sdp.split('\r\n');

  // Search for m line.
  var mLineIndex = findLine(sdpLines, 'm=', 'video');
  if (mLineIndex === null) {
    _logger2.default.debug('Failed to find video m-line');
    return sdp;
  }
  // Figure out the first codec payload type on the m=video SDP line.
  var videoMLine = sdpLines[mLineIndex];
  var pattern = new RegExp('m=video\\s\\d+\\s[A-Z/]+\\s');
  var sendPayloadType = videoMLine.split(pattern)[1].split(' ')[0];
  var fmtpLine = sdpLines[findLine(sdpLines, 'a=rtpmap', sendPayloadType)];
  var codecName = fmtpLine.split('a=rtpmap:' + sendPayloadType)[1].split('/')[0];

  // Use codec from params if specified via URL param, otherwise use from SDP.
  var codec = params.videoSendCodec || codecName;
  sdp = setCodecParam(sdp, codec, 'x-google-min-bitrate', params.videoSendInitialBitrate.toString());
  sdp = setCodecParam(sdp, codec, 'x-google-max-bitrate', maxBitrate.toString());

  return sdp;
}

function removePayloadTypeFromMline(mLine, payloadType) {
  mLine = mLine.split(' ');
  for (var i = 0; i < mLine.length; ++i) {
    if (mLine[i] === payloadType.toString()) {
      mLine.splice(i, 1);
    }
  }
  return mLine.join(' ');
}

function removeCodecByName(sdpLines, codec) {
  var index = findLine(sdpLines, 'a=rtpmap', codec);
  if (index === null) {
    return sdpLines;
  }
  var payloadType = getCodecPayloadTypeFromLine(sdpLines[index]);
  sdpLines.splice(index, 1);

  // Search for the video m= line and remove the codec.
  var mLineIndex = findLine(sdpLines, 'm=', 'video');
  if (mLineIndex === null) {
    return sdpLines;
  }
  sdpLines[mLineIndex] = removePayloadTypeFromMline(sdpLines[mLineIndex], payloadType);
  return sdpLines;
}

function removeCodecByPayloadType(sdpLines, payloadType) {
  var index = findLine(sdpLines, 'a=rtpmap', payloadType.toString());
  if (index === null) {
    return sdpLines;
  }
  sdpLines.splice(index, 1);

  // Search for the video m= line and remove the codec.
  var mLineIndex = findLine(sdpLines, 'm=', 'video');
  if (mLineIndex === null) {
    return sdpLines;
  }
  sdpLines[mLineIndex] = removePayloadTypeFromMline(sdpLines[mLineIndex], payloadType);
  return sdpLines;
}

function maybeRemoveVideoFec(sdp, params) {
  if (params.videoFec !== 'false') {
    return sdp;
  }

  var sdpLines = sdp.split('\r\n');

  var index = findLine(sdpLines, 'a=rtpmap', 'red');
  if (index === null) {
    return sdp;
  }
  var redPayloadType = getCodecPayloadTypeFromLine(sdpLines[index]);
  sdpLines = removeCodecByPayloadType(sdpLines, redPayloadType);

  sdpLines = removeCodecByName(sdpLines, 'ulpfec');

  // Remove fmtp lines associated with red codec.
  index = findLine(sdpLines, 'a=fmtp', redPayloadType.toString());
  if (index === null) {
    return sdp;
  }
  var fmtpLine = parseFmtpLine(sdpLines[index]);
  var rtxPayloadType = fmtpLine.pt;
  if (rtxPayloadType === null) {
    return sdp;
  }
  sdpLines.splice(index, 1);

  sdpLines = removeCodecByPayloadType(sdpLines, rtxPayloadType);
  return sdpLines.join('\r\n');
}

// Promotes |audioSendCodec| to be the first in the m=audio line, if set.
function maybePreferAudioSendCodec(sdp, params) {
  return maybePreferCodec(sdp, 'audio', 'send', params.audioSendCodec);
}

// Promotes |audioRecvCodec| to be the first in the m=audio line, if set.
function maybePreferAudioReceiveCodec(sdp, params) {
  return maybePreferCodec(sdp, 'audio', 'receive', params.audioRecvCodec);
}

// Promotes |videoSendCodec| to be the first in the m=audio line, if set.
function maybePreferVideoSendCodec(sdp, params) {
  return maybePreferCodec(sdp, 'video', 'send', params.videoSendCodec);
}

// Promotes |videoRecvCodec| to be the first in the m=audio line, if set.
function maybePreferVideoReceiveCodec(sdp, params) {
  return maybePreferCodec(sdp, 'video', 'receive', params.videoRecvCodec);
}

// Sets |codec| as the default |type| codec if it's present.
// The format of |codec| is 'NAME/RATE', e.g. 'opus/48000'.
function maybePreferCodec(sdp, type, dir, codec) {
  var str = type + ' ' + dir + ' codec';
  if (!codec) {
    _logger2.default.debug('No preference on ' + str + '.');
    return sdp;
  }

  _logger2.default.debug('Prefer ' + str + ': ' + codec);

  var sdpLines = sdp.split('\r\n');

  // Search for m line.
  var mLineIndex = findLine(sdpLines, 'm=', type);
  if (mLineIndex === null) {
    return sdp;
  }

  // If the codec is available, set it as the default in m line.
  var payload = null;
  for (var i = 0; i < sdpLines.length; i++) {
    var index = findLineInRange(sdpLines, i, -1, 'a=rtpmap', codec);
    if (index !== null) {
      payload = getCodecPayloadTypeFromLine(sdpLines[index]);
      if (payload) {
        sdpLines[mLineIndex] = setDefaultCodec(sdpLines[mLineIndex], payload);
      }
    }
  }

  sdp = sdpLines.join('\r\n');
  return sdp;
}

// Set fmtp param to specific codec in SDP. If param does not exists, add it.
function setCodecParam(sdp, codec, param, value) {
  var sdpLines = sdp.split('\r\n');
  // SDPs sent from MCU use \n as line break.
  if (sdpLines.length <= 1) {
    sdpLines = sdp.split('\n');
  }

  var fmtpLineIndex = findFmtpLine(sdpLines, codec);

  var fmtpObj = {};
  if (fmtpLineIndex === null) {
    var index = findLine(sdpLines, 'a=rtpmap', codec);
    if (index === null) {
      return sdp;
    }
    var payload = getCodecPayloadTypeFromLine(sdpLines[index]);
    fmtpObj.pt = payload.toString();
    fmtpObj.params = {};
    fmtpObj.params[param] = value;
    sdpLines.splice(index + 1, 0, writeFmtpLine(fmtpObj));
  } else {
    fmtpObj = parseFmtpLine(sdpLines[fmtpLineIndex]);
    fmtpObj.params[param] = value;
    sdpLines[fmtpLineIndex] = writeFmtpLine(fmtpObj);
  }

  sdp = sdpLines.join('\r\n');
  return sdp;
}

// Remove fmtp param if it exists.
function removeCodecParam(sdp, codec, param) {
  var sdpLines = sdp.split('\r\n');

  var fmtpLineIndex = findFmtpLine(sdpLines, codec);
  if (fmtpLineIndex === null) {
    return sdp;
  }

  var map = parseFmtpLine(sdpLines[fmtpLineIndex]);
  delete map.params[param];

  var newLine = writeFmtpLine(map);
  if (newLine === null) {
    sdpLines.splice(fmtpLineIndex, 1);
  } else {
    sdpLines[fmtpLineIndex] = newLine;
  }

  sdp = sdpLines.join('\r\n');
  return sdp;
}

// Split an fmtp line into an object including 'pt' and 'params'.
function parseFmtpLine(fmtpLine) {
  var fmtpObj = {};
  var spacePos = fmtpLine.indexOf(' ');
  var keyValues = fmtpLine.substring(spacePos + 1).split(';');

  var pattern = new RegExp('a=fmtp:(\\d+)');
  var result = fmtpLine.match(pattern);
  if (result && result.length === 2) {
    fmtpObj.pt = result[1];
  } else {
    return null;
  }

  var params = {};
  for (var i = 0; i < keyValues.length; ++i) {
    var pair = keyValues[i].split('=');
    if (pair.length === 2) {
      params[pair[0]] = pair[1];
    }
  }
  fmtpObj.params = params;

  return fmtpObj;
}

// Generate an fmtp line from an object including 'pt' and 'params'.
function writeFmtpLine(fmtpObj) {
  if (!fmtpObj.hasOwnProperty('pt') || !fmtpObj.hasOwnProperty('params')) {
    return null;
  }
  var pt = fmtpObj.pt;
  var params = fmtpObj.params;
  var keyValues = [];
  var i = 0;
  for (var key in params) {
    keyValues[i] = key + '=' + params[key];
    ++i;
  }
  if (i === 0) {
    return null;
  }
  return 'a=fmtp:' + pt.toString() + ' ' + keyValues.join(';');
}

// Find fmtp attribute for |codec| in |sdpLines|.
function findFmtpLine(sdpLines, codec) {
  // Find payload of codec.
  var payload = getCodecPayloadType(sdpLines, codec);
  // Find the payload in fmtp line.
  return payload ? findLine(sdpLines, 'a=fmtp:' + payload.toString()) : null;
}

// Find the line in sdpLines that starts with |prefix|, and, if specified,
// contains |substr| (case-insensitive search).
function findLine(sdpLines, prefix, substr) {
  return findLineInRange(sdpLines, 0, -1, prefix, substr);
}

// Find the line in sdpLines[startLine...endLine - 1] that starts with |prefix|
// and, if specified, contains |substr| (case-insensitive search).
function findLineInRange(sdpLines, startLine, endLine, prefix, substr) {
  var realEndLine = endLine !== -1 ? endLine : sdpLines.length;
  for (var i = startLine; i < realEndLine; ++i) {
    if (sdpLines[i].indexOf(prefix) === 0) {
      if (!substr || sdpLines[i].toLowerCase().indexOf(substr.toLowerCase()) !== -1) {
        return i;
      }
    }
  }
  return null;
}

// Gets the codec payload type from sdp lines.
function getCodecPayloadType(sdpLines, codec) {
  var index = findLine(sdpLines, 'a=rtpmap', codec);
  return index ? getCodecPayloadTypeFromLine(sdpLines[index]) : null;
}

// Gets the codec payload type from an a=rtpmap:X line.
function getCodecPayloadTypeFromLine(sdpLine) {
  var pattern = new RegExp('a=rtpmap:(\\d+) [a-zA-Z0-9-]+\\/\\d+');
  var result = sdpLine.match(pattern);
  return result && result.length === 2 ? result[1] : null;
}

// Returns a new m= line with the specified codec as the first one.
function setDefaultCodec(mLine, payload) {
  var elements = mLine.split(' ');

  // Just copy the first three parameters; codec order starts on fourth.
  var newLine = elements.slice(0, 3);

  // Put target payload first and copy in the rest.
  newLine.push(payload);
  for (var i = 3; i < elements.length; i++) {
    if (elements[i] !== payload) {
      newLine.push(elements[i]);
    }
  }
  return newLine.join(' ');
}

/* Below are newly added functions */

// Following codecs will not be removed from SDP event they are not in the
// user-specified codec list.
var audioCodecWhiteList = ['CN', 'telephone-event'];
var videoCodecWhiteList = ['red', 'ulpfec'];

// Returns a new m= line with the specified codec order.
function setCodecOrder(mLine, payloads) {
  var elements = mLine.split(' ');

  // Just copy the first three parameters; codec order starts on fourth.
  var newLine = elements.slice(0, 3);

  // Concat payload types.
  newLine = newLine.concat(payloads);

  return newLine.join(' ');
}

// Append RTX payloads for existing payloads.
function appendRtxPayloads(sdpLines, payloads) {
  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = payloads[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var payload = _step.value;

      var index = findLine(sdpLines, 'a=fmtp', 'apt=' + payload);
      if (index !== null) {
        var fmtpLine = parseFmtpLine(sdpLines[index]);
        payloads.push(fmtpLine.pt);
      }
    }
  } catch (err) {
    _didIteratorError = true;
    _iteratorError = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion && _iterator.return) {
        _iterator.return();
      }
    } finally {
      if (_didIteratorError) {
        throw _iteratorError;
      }
    }
  }

  return payloads;
}

// Remove a codec with all its associated a lines.
function removeCodecFramALine(sdpLines, payload) {
  var pattern = new RegExp('a=(rtpmap|rtcp-fb|fmtp):' + payload + '\\s');
  for (var i = sdpLines.length - 1; i > 0; i--) {
    if (sdpLines[i].match(pattern)) {
      sdpLines.splice(i, 1);
    }
  }
  return sdpLines;
}

// Reorder codecs in m-line according the order of |codecs|. Remove codecs from
// m-line if it is not present in |codecs|
// The format of |codec| is 'NAME/RATE', e.g. 'opus/48000'.
function reorderCodecs(sdp, type, codecs) {
  if (!codecs || codecs.length === 0) {
    return sdp;
  }

  codecs = type === 'audio' ? codecs.concat(audioCodecWhiteList) : codecs.concat(videoCodecWhiteList);

  var sdpLines = sdp.split('\r\n');

  // Search for m line.
  var mLineIndex = findLine(sdpLines, 'm=', type);
  if (mLineIndex === null) {
    return sdp;
  }

  var originPayloads = sdpLines[mLineIndex].split(' ');
  originPayloads.splice(0, 3);

  // If the codec is available, set it as the default in m line.
  var payloads = [];
  var _iteratorNormalCompletion2 = true;
  var _didIteratorError2 = false;
  var _iteratorError2 = undefined;

  try {
    for (var _iterator2 = codecs[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
      var codec = _step2.value;

      for (var i = 0; i < sdpLines.length; i++) {
        var index = findLineInRange(sdpLines, i, -1, 'a=rtpmap', codec);
        if (index !== null) {
          var _payload = getCodecPayloadTypeFromLine(sdpLines[index]);
          if (_payload) {
            payloads.push(_payload);
            i = index;
          }
        }
      }
    }
  } catch (err) {
    _didIteratorError2 = true;
    _iteratorError2 = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion2 && _iterator2.return) {
        _iterator2.return();
      }
    } finally {
      if (_didIteratorError2) {
        throw _iteratorError2;
      }
    }
  }

  payloads = appendRtxPayloads(sdpLines, payloads);
  sdpLines[mLineIndex] = setCodecOrder(sdpLines[mLineIndex], payloads);

  // Remove a lines.
  var _iteratorNormalCompletion3 = true;
  var _didIteratorError3 = false;
  var _iteratorError3 = undefined;

  try {
    for (var _iterator3 = originPayloads[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
      var payload = _step3.value;

      if (payloads.indexOf(payload) === -1) {
        sdpLines = removeCodecFramALine(sdpLines, payload);
      }
    }
  } catch (err) {
    _didIteratorError3 = true;
    _iteratorError3 = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion3 && _iterator3.return) {
        _iterator3.return();
      }
    } finally {
      if (_didIteratorError3) {
        throw _iteratorError3;
      }
    }
  }

  sdp = sdpLines.join('\r\n');
  return sdp;
}

function setMaxBitrate(sdp, encodingParametersList) {
  var _iteratorNormalCompletion4 = true;
  var _didIteratorError4 = false;
  var _iteratorError4 = undefined;

  try {
    for (var _iterator4 = encodingParametersList[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
      var encodingParameters = _step4.value;

      if (encodingParameters.maxBitrate) {
        sdp = setCodecParam(sdp, encodingParameters.codec.name, 'x-google-max-bitrate', encodingParameters.maxBitrate.toString());
      }
    }
  } catch (err) {
    _didIteratorError4 = true;
    _iteratorError4 = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion4 && _iterator4.return) {
        _iterator4.return();
      }
    } finally {
      if (_didIteratorError4) {
        throw _iteratorError4;
      }
    }
  }

  return sdp;
}

},{"./logger.js":5}],10:[function(require,module,exports){
// Copyright © 2017 Intel Corporation. All Rights Reserved.

'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.StreamEvent = exports.RemoteStream = exports.LocalStream = exports.Stream = exports.StreamSourceInfo = undefined;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _logger = require('./logger.js');

var _logger2 = _interopRequireDefault(_logger);

var _event = require('./event.js');

var _utils = require('./utils.js');

var Utils = _interopRequireWildcard(_utils);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function isAllowedValue(obj, allowedValues) {
  return allowedValues.some(function (ele) {
    return ele === obj;
  });
}
/**
 * @class StreamSourceInfo
 * @memberOf Ics.Base
 * @classDesc Information of a stream's source.
 * @constructor
 * @description Audio source info or video source info could be undefined if a stream does not have audio/video track.
 * @param {?string} audioSourceInfo Audio source info. Accepted values are: "mic", "screen-cast", "file", "mixed" or undefined.
 * @param {?string} videoSourceInfo Video source info. Accepted values are: "camera", "screen-cast", "file", "mixed" or undefined.
 */

var StreamSourceInfo = exports.StreamSourceInfo = function StreamSourceInfo(audioSourceInfo, videoSourceInfo) {
  _classCallCheck(this, StreamSourceInfo);

  if (!isAllowedValue(audioSourceInfo, [undefined, 'mic', 'screen-cast', 'file', 'mixed'])) {
    throw new TypeError('Incorrect value for audioSourceInfo');
  }
  if (!isAllowedValue(videoSourceInfo, [undefined, 'camera', 'screen-cast', 'file', 'mixed'])) {
    throw new TypeError('Incorrect value for videoSourceInfo');
  }
  this.audio = audioSourceInfo;
  this.video = videoSourceInfo;
};
/**
 * @class Stream
 * @memberOf Ics.Base
 * @classDesc Base class of streams.
 * @extends Ics.Base.EventDispatcher
 * @hideconstructor
 */


var Stream = exports.Stream = function (_EventDispatcher) {
  _inherits(Stream, _EventDispatcher);

  function Stream(stream, sourceInfo, attributes) {
    _classCallCheck(this, Stream);

    var _this = _possibleConstructorReturn(this, (Stream.__proto__ || Object.getPrototypeOf(Stream)).call(this));

    if (stream && !(stream instanceof MediaStream) || (typeof sourceInfo === 'undefined' ? 'undefined' : _typeof(sourceInfo)) !== 'object') {
      throw new TypeError('Invalid stream or sourceInfo.');
    }
    if (stream && (stream.getAudioTracks().length > 0 && !sourceInfo.audio || stream.getVideoTracks().length > 0 && !sourceInfo.video)) {
      throw new TypeError('Missing audio source info or video source info.');
    }
    /**
     * @member {?MediaStream} mediaStream
     * @instance
     * @memberof Ics.Base.Stream
     * @see {@link https://www.w3.org/TR/mediacapture-streams/#mediastream|MediaStream API of Media Capture and Streams}.
     */
    Object.defineProperty(_this, 'mediaStream', {
      configurable: false,
      writable: true,
      value: stream
    });
    /**
     * @member {Ics.Base.StreamSourceInfo} source
     * @instance
     * @memberof Ics.Base.Stream
     * @desc Source info of a stream.
     */
    Object.defineProperty(_this, 'source', {
      configurable: false,
      writable: false,
      value: sourceInfo
    });
    /**
     * @member {string} attributes
     * @instance
     * @memberof Ics.Base.Stream
     * @desc Custom attributes of a stream.
     */
    Object.defineProperty(_this, 'attributes', {
      configurable: true,
      writable: false,
      value: attributes
    });
    return _this;
  }

  return Stream;
}(_event.EventDispatcher);
/**
 * @class LocalStream
 * @classDesc Stream captured from current endpoint.
 * @memberOf Ics.Base
 * @extends Ics.Base.Stream
 * @constructor
 * @param {MediaStream} stream Underlying MediaStream.
 * @param {Ics.Base.StreamSourceInfo} sourceInfo Information about stream's source.
 * @param {object} attributes Custom attributes of the stream.
 */


var LocalStream = exports.LocalStream = function (_Stream) {
  _inherits(LocalStream, _Stream);

  function LocalStream(stream, sourceInfo, attributes) {
    _classCallCheck(this, LocalStream);

    if (!(stream instanceof MediaStream)) {
      throw new TypeError('Invalid stream.');
    }

    /**
     * @member {string} id
     * @instance
     * @memberof Ics.Base.LocalStream
     */
    var _this2 = _possibleConstructorReturn(this, (LocalStream.__proto__ || Object.getPrototypeOf(LocalStream)).call(this, stream, sourceInfo, attributes));

    Object.defineProperty(_this2, 'id', {
      configurable: false,
      writable: false,
      value: Utils.createUuid()
    });
    return _this2;
  }

  return LocalStream;
}(Stream);
/**
 * @class RemoteStream
 * @classDesc Stream sent from a remote endpoint.
 * Events:
 *
 * | Event Name      | Argument Type    | Fired when       |
 * | ----------------| ---------------- | ---------------- |
 * | ended           | Event            | Stream is ended. |
 *
 * @memberOf Ics.Base
 * @extends Ics.Base.Stream
 * @hideconstructor
 */


var RemoteStream = exports.RemoteStream = function (_Stream2) {
  _inherits(RemoteStream, _Stream2);

  function RemoteStream(id, origin, stream, sourceInfo, attributes) {
    _classCallCheck(this, RemoteStream);

    /**
     * @member {string} id
     * @instance
     * @memberof Ics.Base.RemoteStream
     */
    var _this3 = _possibleConstructorReturn(this, (RemoteStream.__proto__ || Object.getPrototypeOf(RemoteStream)).call(this, stream, sourceInfo, attributes));

    Object.defineProperty(_this3, 'id', {
      configurable: false,
      writable: false,
      value: id ? id : Utils.createUuid()
    });
    /**
     * @member {string} origin
     * @instance
     * @memberof Ics.Base.RemoteStream
     * @desc ID of the remote endpoint who published this stream.
     */
    Object.defineProperty(_this3, 'origin', {
      configurable: false,
      writable: false,
      value: origin
    });
    /**
     * @member {Ics.Base.PublicationSettings} settings
     * @instance
     * @memberof Ics.Base.RemoteStream
     * @desc Original settings for publishing this stream. This property is only valid in conference mode.
     */
    _this3.settings = undefined;
    /**
     * @member {Ics.Conference.SubscriptionCapabilities} capabilities
     * @instance
     * @memberof Ics.Base.RemoteStream
     * @desc Capabilities remote endpoint provides for subscription. This property is only valid in conference mode.
     */
    _this3.capabilities = undefined;
    return _this3;
  }

  return RemoteStream;
}(Stream);

/**
 * @class StreamEvent
 * @classDesc Event for Stream.
 * @extends Ics.Base.IcsEvent
 * @memberof Ics.Base
 * @hideconstructor
 */


var StreamEvent = exports.StreamEvent = function (_IcsEvent) {
  _inherits(StreamEvent, _IcsEvent);

  function StreamEvent(type, init) {
    _classCallCheck(this, StreamEvent);

    var _this4 = _possibleConstructorReturn(this, (StreamEvent.__proto__ || Object.getPrototypeOf(StreamEvent)).call(this, type));

    _this4.stream = init.stream;
    return _this4;
  }

  return StreamEvent;
}(_event.IcsEvent);

},{"./event.js":3,"./logger.js":5,"./utils.js":11}],11:[function(require,module,exports){
// Copyright © 2017 Intel Corporation. All Rights Reserved.
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isFirefox = isFirefox;
exports.isChrome = isChrome;
exports.isSafari = isSafari;
exports.createUuid = createUuid;
exports.sysInfo = sysInfo;
var sdkVersion = '4.0';

function isFirefox() {
  return window.navigator.userAgent.match("Firefox") !== null;
}
function isChrome() {
  return window.navigator.userAgent.match('Chrome') !== null;
}
function isSafari() {
  return (/^((?!chrome|android).)*safari/i.test(window.navigator.userAgent)
  );
}
function createUuid() {
  return 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = Math.random() * 16 | 0,
        v = c === 'x' ? r : r & 0x3 | 0x8;
    return v.toString(16);
  });
}

// Returns system information.
// Format: {sdk:{version:**, type:**}, runtime:{version:**, name:**}, os:{version:**, name:**}};
function sysInfo() {
  var info = Object.create({});
  info.sdk = {
    version: sdkVersion,
    type: 'JavaScript'
  };
  // Runtime info.
  var userAgent = navigator.userAgent;
  var firefoxRegex = /Firefox\/([0-9\.]+)/;
  var chromeRegex = /Chrome\/([0-9\.]+)/;
  var edgeRegex = /Edge\/([0-9\.]+)/;
  var safariVersionRegex = /Version\/([0-9\.]+) Safari/;
  var result = chromeRegex.exec(userAgent);
  if (result) {
    info.runtime = {
      name: 'Chrome',
      version: result[1]
    };
  } else if (result = firefoxRegex.exec(userAgent)) {
    info.runtime = {
      name: 'Firefox',
      version: result[1]
    };
  } else if (result = edgeRegex.exec(userAgent)) {
    info.runtime = {
      name: 'Edge',
      version: result[1]
    };
  } else if (isSafari()) {
    result = safariVersionRegex.exec(userAgent);
    info.runtime = {
      name: 'Safari'
    };
    info.runtime.version = result ? result[1] : 'Unknown';
  } else {
    info.runtime = {
      name: 'Unknown',
      version: 'Unknown'
    };
  }
  // OS info.
  var windowsRegex = /Windows NT ([0-9\.]+)/;
  var macRegex = /Intel Mac OS X ([0-9_\.]+)/;
  var iPhoneRegex = /iPhone OS ([0-9_\.]+)/;
  var linuxRegex = /X11; Linux/;
  var androidRegex = /Android( ([0-9\.]+))?/;
  var chromiumOsRegex = /CrOS/;
  if (result = windowsRegex.exec(userAgent)) {
    info.os = {
      name: 'Windows NT',
      version: result[1]
    };
  } else if (result = macRegex.exec(userAgent)) {
    info.os = {
      name: 'Mac OS X',
      version: result[1].replace(/_/g, '.')
    };
  } else if (result = iPhoneRegex.exec(userAgent)) {
    info.os = {
      name: 'iPhone OS',
      version: result[1].replace(/_/g, '.')
    };
  } else if (result = linuxRegex.exec(userAgent)) {
    info.os = {
      name: 'Linux',
      version: 'Unknown'
    };
  } else if (result = androidRegex.exec(userAgent)) {
    info.os = {
      name: 'Android',
      version: result[1] || 'Unknown'
    };
  } else if (result = chromiumOsRegex.exec(userAgent)) {
    info.os = {
      name: 'Chrome OS',
      version: 'Unknown'
    };
  } else {
    info.os = {
      name: 'Unknown',
      version: 'Unknown'
    };
  }
  return info;
};

},{}],12:[function(require,module,exports){
// Copyright © 2017 Intel Corporation. All Rights Reserved.
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ConferencePeerConnectionChannel = undefined;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _logger = require('../base/logger.js');

var _logger2 = _interopRequireDefault(_logger);

var _event = require('../base/event.js');

var _mediaformat = require('../base/mediaformat.js');

var _publication = require('../base/publication.js');

var _subscription = require('./subscription.js');

var _error2 = require('./error.js');

var ErrorModule = _interopRequireWildcard(_error2);

var _utils = require('../base/utils.js');

var Utils = _interopRequireWildcard(_utils);

var _stream = require('../base/stream.js');

var StreamModule = _interopRequireWildcard(_stream);

var _sdputils = require('../base/sdputils.js');

var SdpUtils = _interopRequireWildcard(_sdputils);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ConferencePeerConnectionChannel = exports.ConferencePeerConnectionChannel = function (_EventDispatcher) {
  _inherits(ConferencePeerConnectionChannel, _EventDispatcher);

  function ConferencePeerConnectionChannel(config, signaling) {
    _classCallCheck(this, ConferencePeerConnectionChannel);

    var _this = _possibleConstructorReturn(this, (ConferencePeerConnectionChannel.__proto__ || Object.getPrototypeOf(ConferencePeerConnectionChannel)).call(this));

    _this._config = config;
    _this._options = null;
    _this._signaling = signaling;
    _this._pc = null;
    _this._internalId = null; // It's publication ID or subscription ID.
    _this._pendingCandidates = [];
    _this._subscribePromise = null;
    _this._publishPromise = null;
    _this._subscribedStream = null;
    _this._publishedStream = null;
    _this._publication = null;
    _this._subscription = null;
    _this._disconnectTimer = null; // Timer for PeerConnection disconnected. Will stop connection after timer.
    return _this;
  }

  _createClass(ConferencePeerConnectionChannel, [{
    key: 'onMessage',
    value: function onMessage(notification, message) {
      switch (notification) {
        case 'progress':
          if (message.status === 'soac') this._sdpHandler(message.data);else if (message.status === 'ready') this._readyHandler();else if (message.status === 'error') this._errorHandler(message.data);
          break;
        case 'stream':
          this._onStreamEvent(message);
          break;
        default:
          _logger2.default.warning('Unknown notification from MCU.');
      }
    }
  }, {
    key: 'publish',
    value: function publish(stream, options) {
      var _this2 = this;

      if (options === undefined) {
        options = { audio: !!stream.mediaStream.getAudioTracks(), video: !!stream.mediaStream.getVideoTracks() };
      }
      if ((typeof options === 'undefined' ? 'undefined' : _typeof(options)) !== 'object') {
        return Promise.reject(new TypeError('Options should be an object.'));
      }
      if (options.audio === undefined) {
        options.audio = !!stream.mediaStream.getAudioTracks();
      }
      if (options.video === undefined) {
        options.video = !!stream.mediaStream.getVideoTracks();
      }
      if (options.audio && !stream.mediaStream.getAudioTracks() || options.video && !stream.mediaStream.getVideoTracks()) {
        return Promise.reject(new _error2.ConferenceError('options.audio/video cannot be true or an object if there is no audio/video track present in the MediaStream.'));
      }
      if (options.audio === false && options.video === false) {
        return Promise.reject(new _error2.ConferenceError('Cannot publish a stream without audio and video.'));
      }
      if (_typeof(options.audio) === 'object') {
        if (!Array.isArray(options.audio)) {
          return Promise.reject(new TypeError('options.audio should be a boolean or an array.'));
        }
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
          for (var _iterator = options.audio[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var parameters = _step.value;

            if (!parameters.codec || typeof parameters.codec.name !== 'string' || parameters.maxBitrate !== undefined && typeof parameters.maxBitrate !== 'number') {
              return Promise.reject(new TypeError('options.audio has incorrect parameters.'));
            }
          }
        } catch (err) {
          _didIteratorError = true;
          _iteratorError = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion && _iterator.return) {
              _iterator.return();
            }
          } finally {
            if (_didIteratorError) {
              throw _iteratorError;
            }
          }
        }
      }
      if (_typeof(options.video) === 'object') {
        if (!Array.isArray(options.video)) {
          return Promise.reject(new TypeError('options.video should be a boolean or an array.'));
        }
        var _iteratorNormalCompletion2 = true;
        var _didIteratorError2 = false;
        var _iteratorError2 = undefined;

        try {
          for (var _iterator2 = options.video[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
            var _parameters = _step2.value;

            if (!_parameters.codec || typeof _parameters.codec.name !== 'string' || _parameters.maxBitrate !== undefined && typeof _parameters.maxBitrate !== 'number' || _parameters.codec.profile !== undefined && typeof _parameters.codec.profile !== 'string') {
              return Promise.reject(new TypeError('options.video has incorrect parameters.'));
            }
          }
        } catch (err) {
          _didIteratorError2 = true;
          _iteratorError2 = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion2 && _iterator2.return) {
              _iterator2.return();
            }
          } finally {
            if (_didIteratorError2) {
              throw _iteratorError2;
            }
          }
        }
      }
      this._options = options;
      var mediaOptions = {};
      if (stream.mediaStream.getAudioTracks().length > 0) {
        if (stream.mediaStream.getAudioTracks().length > 1) {
          _logger2.default.warning('Publishing a stream with multiple audio tracks is not fully supported.');
        }
        if (typeof options.audio !== 'boolean' && _typeof(options.audio) !== 'object') {
          return Promise.reject(new _error2.ConferenceError('Type of audio options should be boolean or an object.'));
        }
        mediaOptions.audio = {};
        mediaOptions.audio.source = stream.source.audio;
      } else {
        mediaOptions.audio = false;
      }
      if (stream.mediaStream.getVideoTracks().length > 0) {
        if (stream.mediaStream.getVideoTracks().length > 1) {
          _logger2.default.warning('Publishing a stream with multiple video tracks is not fully supported.');
        }
        mediaOptions.video = {};
        mediaOptions.video.source = stream.source.video;
        var trackSettings = stream.mediaStream.getVideoTracks()[0].getSettings();
        mediaOptions.video.parameters = {
          resolution: {
            width: trackSettings.width,
            height: trackSettings.height
          },
          framerate: trackSettings.frameRate
        };
      } else {
        mediaOptions.video = false;
      }
      this._publishedStream = stream;
      this._signaling.sendSignalingMessage('publish', {
        media: mediaOptions,
        attributes: stream.attributes
      }).then(function (data) {
        var messageEvent = new _event.MessageEvent('id', {
          message: data.id,
          origin: _this2._remoteId
        });
        _this2.dispatchEvent(messageEvent);
        _this2._internalId = data.id;
        _this2._createPeerConnection();
        _this2._pc.addStream(stream.mediaStream);
        var offerOptions = {
          offerToReceiveAudio: false,
          offerToReceiveVideo: false
        };
        if (typeof _this2._pc.addTransceiver === 'function') {
          // |direction| seems not working on Safari.
          if (mediaOptions.audio && stream.mediaStream.getAudioTracks() > 0) {
            var audioTransceiver = _this2._pc.addTransceiver('audio', { direction: 'sendonly' });
          }
          if (mediaOptions.video && stream.mediaStream.getVideoTracks() > 0) {
            var videoTransceiver = _this2._pc.addTransceiver('video', { direction: 'sendonly' });
          }
        }
        var localDesc = void 0;
        _this2._pc.createOffer(offerOptions).then(function (desc) {
          if (options) {
            desc.sdp = _this2._setRtpReceiverOptions(desc.sdp, options);
          }
          return desc;
        }).then(function (desc) {
          localDesc = desc;
          return _this2._pc.setLocalDescription(desc);
        }).then(function () {
          _this2._signaling.sendSignalingMessage('soac', {
            id: _this2._internalId,
            signaling: localDesc
          });
        }).catch(function (e) {
          _logger2.default.error('Failed to create offer or set SDP. Message: ' + e.message);
          _this2._rejectPromise(e);
          _this2._fireEndedEventOnPublicationOrSubscription();
        });
      });
      return new Promise(function (resolve, reject) {
        _this2._publishPromise = { resolve: resolve, reject: reject };
      });
    }
  }, {
    key: 'subscribe',
    value: function subscribe(stream, options) {
      var _this3 = this;

      if (options === undefined) {
        options = {
          audio: !!stream.capabilities.audio,
          video: !!stream.capabilities.video
        };
      }
      if ((typeof options === 'undefined' ? 'undefined' : _typeof(options)) !== 'object') {
        return Promise.reject(new TypeError('Options should be an object.'));
      }
      if (options.audio === undefined) {
        options.audio = !!stream.capabilities.audio;
      }
      if (options.video === undefined) {
        options.video = !!stream.capabilities.video;
      }
      if (options.audio !== undefined && _typeof(options.audio) !== 'object' && typeof options.audio !== 'boolean' && options.audio !== null || options.video !== undefined && _typeof(options.video) !== 'object' && typeof options.video !== 'boolean' && options.video !== null) {
        return Promise.reject(new TypeError('Invalid options type.'));
      }
      if (options.audio && !stream.capabilities.audio || options.video && !stream.capabilities.video) {
        return Promise.reject(new _error2.ConferenceError('options.audio/video cannot be true or an object if there is no audio/video track in remote stream.'));
      }
      if (options.audio === false && options.video === false) {
        return Promise.reject(new _error2.ConferenceError('Cannot subscribe a stream without audio and video.'));
      }
      this._options = options;
      var mediaOptions = {};
      if (options.audio) {
        mediaOptions.audio = {};
        mediaOptions.audio.from = stream.id;
      } else {
        mediaOptions.audio = false;
      }
      if (options.video) {
        mediaOptions.video = {};
        mediaOptions.video.from = stream.id;
        if (options.video.resolution || options.video.frameRate || options.video.bitrateMultiplier && options.video.bitrateMultiplier !== 1 || options.video.keyFrameInterval) {
          mediaOptions.video.parameters = {
            resolution: options.video.resolution,
            framerate: options.video.frameRate,
            bitrate: options.video.bitrateMultiplier ? 'x' + options.video.bitrateMultiplier.toString() : undefined,
            keyFrameInterval: options.video.keyFrameInterval
          };
        }
      } else {
        mediaOptions.video = false;
      }
      this._subscribedStream = stream;
      this._signaling.sendSignalingMessage('subscribe', {
        media: mediaOptions
      }).then(function (data) {
        var messageEvent = new _event.MessageEvent('id', {
          message: data.id,
          origin: _this3._remoteId
        });
        _this3.dispatchEvent(messageEvent);
        _this3._internalId = data.id;
        _this3._createPeerConnection();
        var offerOptions = {
          offerToReceiveAudio: !!options.audio,
          offerToReceiveVideo: !!options.video
        };
        if (typeof _this3._pc.addTransceiver === 'function') {
          // |direction| seems not working on Safari.
          if (mediaOptions.audio) {
            var audioTransceiver = _this3._pc.addTransceiver('audio', { direction: 'recvonly' });
          }
          if (mediaOptions.video) {
            var videoTransceiver = _this3._pc.addTransceiver('video', { direction: 'recvonly' });
          }
        }
        _this3._pc.createOffer(offerOptions).then(function (desc) {
          if (options) {
            desc.sdp = _this3._setRtpReceiverOptions(desc.sdp, options);
          }
          _this3._pc.setLocalDescription(desc).then(function () {
            _this3._signaling.sendSignalingMessage('soac', {
              id: _this3._internalId,
              signaling: desc
            });
          }, function (errorMessage) {
            _logger2.default.error('Set local description failed. Message: ' + JSON.stringify(errorMessage));
          });
        }, function (error) {
          _logger2.default.error('Create offer failed. Error info: ' + JSON.stringify(error));
        });
      });
      return new Promise(function (resolve, reject) {
        _this3._subscribePromise = { resolve: resolve, reject: reject };
      });
    }
  }, {
    key: '_unpublish',
    value: function _unpublish() {
      this._signaling.sendSignalingMessage('unpublish', { id: this._internalId }).catch(function (e) {
        _logger2.default.warning('MCU returns negative ack for unpublishing, ' + e);
      });
      if (this._pc.signalingState !== 'closed') {
        this._pc.close();
      }
    }
  }, {
    key: '_unsubscribe',
    value: function _unsubscribe() {
      this._signaling.sendSignalingMessage('unsubscribe', {
        id: this._internalId
      }).catch(function (e) {
        _logger2.default.warning('MCU returns negative ack for unsubscribing, ' + e);
      });
      if (this._pc.signalingState !== 'closed') {
        this._pc.close();
      }
    }
  }, {
    key: '_muteOrUnmute',
    value: function _muteOrUnmute(isMute, isPub, trackKind) {
      var _this4 = this;

      var eventName = isPub ? 'stream-control' : 'subscription-control';
      var operation = isMute ? 'pause' : 'play';
      return this._signaling.sendSignalingMessage(eventName, {
        id: this._internalId,
        operation: operation,
        data: trackKind
      }).then(function () {
        if (!isPub) {
          var muteEventName = isMute ? 'mute' : 'unmute';
          _this4._subscription.dispatchEvent(new _event.MuteEvent(muteEventName, { kind: trackKind }));
        }
      });
    }
  }, {
    key: '_applyOptions',
    value: function _applyOptions(options) {
      if ((typeof options === 'undefined' ? 'undefined' : _typeof(options)) !== 'object' || _typeof(options.video) !== 'object') {
        return Promise.reject(new _error2.ConferenceError('Options should be an object.'));
      }
      var videoOptions = {};
      videoOptions.resolution = options.video.resolution;
      videoOptions.framerate = options.video.frameRate;
      videoOptions.bitrate = options.video.bitrateMultiplier ? 'x' + options.video.bitrateMultiplier.toString() : undefined;
      videoOptions.keyFrameInterval = options.video.keyFrameInterval;
      return this._signaling.sendSignalingMessage('subscription-control', {
        id: this._internalId,
        operation: 'update',
        data: {
          video: { parameters: videoOptions }
        }
      }).then();
    }
  }, {
    key: '_onRemoteStreamAdded',
    value: function _onRemoteStreamAdded(event) {
      _logger2.default.debug('Remote stream added.');
      if (this._subscribedStream) {
        this._subscribedStream.mediaStream = event.stream;
      } else {
        // This is not expected path. However, this is going to happen on Safari
        // because it does not support setting direction of transceiver.
        _logger2.default.warning('Received remote stream without subscription.');
      }
    }
  }, {
    key: '_onLocalIceCandidate',
    value: function _onLocalIceCandidate(event) {
      if (event.candidate) {
        if (this._pc.signalingState !== 'stable') {
          this._pendingCandidates.push(event.candidate);
        } else {
          this._sendCandidate(event.candidate);
        }
      } else {
        _logger2.default.debug('Empty candidate.');
      }
    }
  }, {
    key: '_fireEndedEventOnPublicationOrSubscription',
    value: function _fireEndedEventOnPublicationOrSubscription() {
      var event = new _event.IcsEvent('ended');
      if (this._publication) {
        this._publication.dispatchEvent(event);
        this._publication.stop();
      } else if (this._subscription) {
        this._subscription.dispatchEvent(event);
        this._subscription.stop();
      }
    }
  }, {
    key: '_rejectPromise',
    value: function _rejectPromise(error) {
      if (!error) {
        var _error = new _error2.ConferenceError('Connection failed or closed.');
      }
      // Rejecting corresponding promise if publishing and subscribing is ongoing.
      if (this._publishPromise) {
        this._publishPromise.reject(error);
        this._publishPromise = undefined;
      } else if (this._subscribePromise) {
        this._subscribePromise.reject(error);
        this._subscribePromise = undefined;
      }
    }
  }, {
    key: '_onIceConnectionStateChange',
    value: function _onIceConnectionStateChange(event) {
      if (!event || !event.currentTarget) return;

      _logger2.default.debug('ICE connection state changed to ' + event.currentTarget.iceConnectionState);
      if (event.currentTarget.iceConnectionState === 'closed' || event.currentTarget.iceConnectionState === 'failed') {
        this._rejectPromise(new _error2.ConferenceError('ICE connection failed or closed.'));
        // Fire ended event if publication or subscription exists.
        this._fireEndedEventOnPublicationOrSubscription();
      }
    }
  }, {
    key: '_sendCandidate',
    value: function _sendCandidate(candidate) {
      this._signaling.sendSignalingMessage('soac', {
        id: this._internalId,
        signaling: {
          type: 'candidate',
          candidate: {
            candidate: 'a=' + candidate.candidate,
            sdpMid: candidate.sdpMid,
            sdpMLineIndex: candidate.sdpMLineIndex
          }
        }
      });
    }
  }, {
    key: '_createPeerConnection',
    value: function _createPeerConnection() {
      var _this5 = this;

      this._pc = new RTCPeerConnection(this._config.rtcConfiguration);
      this._pc.onicecandidate = function (event) {
        _this5._onLocalIceCandidate.apply(_this5, [event]);
      };
      this._pc.onaddstream = function (event) {
        _this5._onRemoteStreamAdded.apply(_this5, [event]);
      };
      this._pc.oniceconnectionstatechange = function (event) {
        _this5._onIceConnectionStateChange.apply(_this5, [event]);
      };
    }
  }, {
    key: '_getStats',
    value: function _getStats() {
      if (this._pc) {
        return this._pc.getStats();
      } else {
        return Promise.reject(new _error2.ConferenceError('PeerConnection is not available.'));
      }
    }
  }, {
    key: '_readyHandler',
    value: function _readyHandler() {
      var _this6 = this;

      if (this._subscribePromise) {
        this._subscription = new _subscription.Subscription(this._internalId, function () {
          _this6._unsubscribe();
          return Promise.resolve();
        }, function () {
          return _this6._getStats();
        }, function (trackKind) {
          return _this6._muteOrUnmute(true, false, trackKind);
        }, function (trackKind) {
          return _this6._muteOrUnmute(false, false, trackKind);
        }, function (options) {
          return _this6._applyOptions(options);
        });
        // Fire subscription's ended event when associated stream is ended.
        this._subscribedStream.addEventListener('ended', function () {
          _this6._subscription.dispatchEvent('ended', new _event.IcsEvent('ended'));
        });
        this._subscribePromise.resolve(this._subscription);
      } else if (this._publishPromise) {
        this._publication = new _publication.Publication(this._internalId, function () {
          _this6._unpublish();
          return Promise.resolve();
        }, function () {
          return _this6._getStats();
        }, function (trackKind) {
          return _this6._muteOrUnmute(true, true, trackKind);
        }, function (trackKind) {
          return _this6._muteOrUnmute(false, true, trackKind);
        });
        this._publishPromise.resolve(this._publication);
        // Do not fire publication's ended event when associated stream is ended.
        // It may still sending silence or black frames.
        // Refer to https://w3c.github.io/webrtc-pc/#rtcrtpsender-interface.
      }
      this._publishPromise = null;
      this._subscribePromise = null;
    }
  }, {
    key: '_sdpHandler',
    value: function _sdpHandler(sdp) {
      var _this7 = this;

      if (sdp.type === 'answer') {
        if ((this._publication || this._publishPromise) && this._options) {
          sdp.sdp = this._setRtpSenderOptions(sdp.sdp, this._options);
        }
        this._pc.setRemoteDescription(sdp).then(function () {
          if (_this7._pendingCandidates.length > 0) {
            var _iteratorNormalCompletion3 = true;
            var _didIteratorError3 = false;
            var _iteratorError3 = undefined;

            try {
              for (var _iterator3 = _this7._pendingCandidates[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
                var candidate = _step3.value;

                _this7._sendCandidate(candidate);
              }
            } catch (err) {
              _didIteratorError3 = true;
              _iteratorError3 = err;
            } finally {
              try {
                if (!_iteratorNormalCompletion3 && _iterator3.return) {
                  _iterator3.return();
                }
              } finally {
                if (_didIteratorError3) {
                  throw _iteratorError3;
                }
              }
            }
          }
        }, function (error) {
          _logger2.default.error('Set remote description failed: ' + error);
          _this7._rejectPromise(error);
          _this7._fireEndedEventOnPublicationOrSubscription();
        });
      }
    }
  }, {
    key: '_errorHandler',
    value: function _errorHandler(errorMessage) {
      var p = this._publishPromise || this._subscribePromise;
      if (p) {
        p.reject(new _error2.ConferenceError(errorMessage));
        return;
      }
      var dispatcher = this._publication || this._subscription;
      if (!dispatcher) {
        _logger2.default.warning('Neither publication nor subscription is available.');
        return;
      }
      var error = new _error2.ConferenceError(errorMessage);
      var errorEvent = new _event.ErrorEvent('error', {
        error: error
      });
      dispatcher.dispatchEvent(errorEvent);
    }
  }, {
    key: '_setCodecOrder',
    value: function _setCodecOrder(sdp, options) {
      if (this._publication || this._publishPromise) {
        if (options.audio) {
          var audioCodecNames = Array.from(options.audio, function (encodingParameters) {
            return encodingParameters.codec.name;
          });
          sdp = SdpUtils.reorderCodecs(sdp, 'audio', audioCodecNames);
        }
        if (options.video) {
          var videoCodecNames = Array.from(options.video, function (encodingParameters) {
            return encodingParameters.codec.name;
          });
          sdp = SdpUtils.reorderCodecs(sdp, 'video', videoCodecNames);
        }
      } else {
        if (options.audio && options.audio.codecs) {
          var _audioCodecNames = Array.from(options.audio.codecs, function (codec) {
            return codec.name;
          });
          sdp = SdpUtils.reorderCodecs(sdp, 'audio', _audioCodecNames);
        }
        if (options.video && options.video.codecs) {
          var _videoCodecNames = Array.from(options.video.codecs, function (codec) {
            return codec.name;
          });
          sdp = SdpUtils.reorderCodecs(sdp, 'video', _videoCodecNames);
        }
      }
      return sdp;
    }
  }, {
    key: '_setMaxBitrate',
    value: function _setMaxBitrate(sdp, options) {
      if (_typeof(options.audio) === 'object') {
        sdp = SdpUtils.setMaxBitrate(sdp, options.audio);
      }
      if (_typeof(options.video) === 'object') {
        sdp = SdpUtils.setMaxBitrate(sdp, options.video);
      }
      return sdp;
    }
  }, {
    key: '_setRtpSenderOptions',
    value: function _setRtpSenderOptions(sdp, options) {
      sdp = this._setMaxBitrate(sdp, options);
      return sdp;
    }
  }, {
    key: '_setRtpReceiverOptions',
    value: function _setRtpReceiverOptions(sdp, options) {
      sdp = this._setCodecOrder(sdp, options);
      return sdp;
    }

    // Handle stream event sent from MCU. Some stream events should be publication event or subscription event. It will be handled here.

  }, {
    key: '_onStreamEvent',
    value: function _onStreamEvent(message) {
      var eventTarget = void 0;
      if (this._publication && message.id === this._publication.id) {
        eventTarget = this._publication;
      } else if (this._subscribedStream && message.id === this._subscribedStream.id) {
        eventTarget = this._subscription;
      }
      if (!eventTarget) {
        _logger2.default.debug('Cannot find valid event target.');
        return;
      }
      var trackKind = void 0;
      if (message.data.field === 'audio.status') {
        trackKind = _mediaformat.TrackKind.AUDIO;
      } else if (message.data.field === 'video.status') {
        trackKind = _mediaformat.TrackKind.VIDEO;
      } else {
        _logger2.default.warning('Invalid data field for stream update info.');
      }
      if (message.data.value === 'active') {
        eventTarget.dispatchEvent(new _event.MuteEvent('unmute', { kind: trackKind }));
      } else if (message.data.value === 'inactive') {
        eventTarget.dispatchEvent(new _event.MuteEvent('mute', { kind: trackKind }));
      } else {
        _logger2.default.warning('Invalid data value for stream update info.');
      }
    }
  }]);

  return ConferencePeerConnectionChannel;
}(_event.EventDispatcher);

},{"../base/event.js":3,"../base/logger.js":5,"../base/mediaformat.js":6,"../base/publication.js":8,"../base/sdputils.js":9,"../base/stream.js":10,"../base/utils.js":11,"./error.js":14,"./subscription.js":21}],13:[function(require,module,exports){
// Copyright © 2017 Intel Corporation. All Rights Reserved.
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ConferenceClient = undefined;

var _event = require('../base/event.js');

var EventModule = _interopRequireWildcard(_event);

var _signaling = require('./signaling.js');

var _logger = require('../base/logger.js');

var _logger2 = _interopRequireDefault(_logger);

var _base = require('../base/base64.js');

var _error = require('./error.js');

var _utils = require('../base/utils.js');

var Utils = _interopRequireWildcard(_utils);

var _stream = require('../base/stream.js');

var StreamModule = _interopRequireWildcard(_stream);

var _participant2 = require('./participant.js');

var _info = require('./info.js');

var _channel = require('./channel.js');

var _mixedstream = require('./mixedstream.js');

var _streamutils = require('./streamutils.js');

var StreamUtilsModule = _interopRequireWildcard(_streamutils);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var SignalingState = {
  READY: 1,
  CONNECTING: 2,
  CONNECTED: 3
};

var protocolVersion = '1.0';

var ParticipantEvent = function ParticipantEvent(type, init) {
  var that = new EventModule.IcsEvent(type, init);
  that.participant = init.participant;
  return that;
};

/**
 * @class ConferenceClientConfiguration
 * @classDesc Configuration for ConferenceClient.
 * @memberOf Ics.Conference
 * @hideconstructor
 */

var ConferenceClientConfiguration = function ConferenceClientConfiguration() {
  _classCallCheck(this, ConferenceClientConfiguration);

  /**
   * @member {?RTCConfiguration} rtcConfiguration
   * @instance
   * @memberof Ics.Conference.ConferenceClientConfiguration
   * @desc It will be used for creating PeerConnection.
   * @see {@link https://www.w3.org/TR/webrtc/#rtcconfiguration-dictionary|RTCConfiguration Dictionary of WebRTC 1.0}.
   * @example
   * // Following object can be set to conferenceClientConfiguration.rtcConfiguration.
   * {
   *   iceServers: [{
   *      urls: "stun:example.com:3478"
   *   }, {
   *     urls: [
   *       "turn:example.com:3478?transport=udp",
   *       "turn:example.com:3478?transport=tcp"
   *     ],
   *      credential: "password",
   *      username: "username"
   *   }
   * }
   */
  this.rtcConfiguration = undefined;
};

/**
 * @class ConferenceClient
 * @classdesc The ConferenceClient handles PeerConnections between client and server. For conference controlling, please refer to REST API guide.
 * Events:
 *
 * | Event Name            | Argument Type    | Fired when       |
 * | --------------------- | ---------------- | ---------------- |
 * | streamadded           | StreamEvent      | A new stream is available in the conference. |
 * | participantjoined     | ParticipantEvent | A new participant joined the conference. |
 * | messagereceived       | MessageEvent     | A new message is received. |
 * | serverdisconnected    | IcsEvent         | Disconnected from conference server. |
 *
 * @memberof Ics.Conference
 * @extends Ics.Base.EventDispatcher
 * @constructor
 * @param {?Ics.Conference.ConferenceClientConfiguration } config Configuration for ConferenceClient.
 * @param {?Ics.Conference.SioSignaling } signalingImpl Signaling channel implementation for ConferenceClient. SDK uses default signaling channel implementation if this parameter is undefined. Currently, a Socket.IO signaling channel implementation was provided as ics.conference.SioSignaling. However, it is not recommended to directly access signaling channel or customize signaling channel for ConferenceClient as this time.
 */


var ConferenceClient = exports.ConferenceClient = function ConferenceClient(config, signalingImpl) {
  config = config || {};
  var self = this;
  var signalingState = SignalingState.READY;
  var signaling = signalingImpl ? signalingImpl : new _signaling.SioSignaling();
  var me = void 0;
  var room = void 0;
  var remoteStreams = new Map(); // Key is stream ID, value is a RemoteStream.
  var participants = new Map(); // Key is participant ID, value is a Participant object.
  var publishChannels = new Map(); // Key is MediaStream's ID, value is pc channel.
  var channels = new Map(); // Key is channel's internal ID, value is channel.

  function onSignalingMessage(notification, data) {
    if (notification === 'soac' || notification === 'progress') {
      if (!channels.has(data.id)) {
        _logger2.default.warning('Cannot find a channel for incoming data.');
        return;
      }
      channels.get(data.id).onMessage(notification, data);
    } else if (notification === 'stream') {
      if (data.status === 'add') {
        fireStreamAdded(data.data);
      } else if (data.status === 'remove') {
        fireStreamRemoved(data);
      } else if (data.status === 'update') {
        // Boardcast audio/video update status to channel so specific events can be fired on publication or subscription.
        if (data.data.field === 'audio.status' || data.data.field === 'video.status') {
          channels.forEach(function (c) {
            c.onMessage(notification, data);
          });
        } else if (data.data.field === 'activeInput') {
          fireActiveAudioInputChange(data);
        } else if (data.data.field === 'video.layout') {
          fireLayoutChange(data);
        } else {
          _logger2.default.warning('Unknown stream event from MCU.');
        }
      }
    } else if (notification === 'text') {
      fireMessageReceived(data);
    } else if (notification === 'participant') {
      fireParticipantEvent(data);
    }
  };

  signaling.addEventListener('data', function (event) {
    onSignalingMessage(event.message.notification, event.message.data);
  });

  signaling.addEventListener('disconnect', function () {
    signalingState = SignalingState.READY;
    self.dispatchEvent(new EventModule.IcsEvent('serverdisconnected'));
  });

  function fireParticipantEvent(data) {
    if (data.action === 'join') {
      data = data.data;
      var participant = new _participant2.Participant(data.id, data.role, data.user);
      participants.set(data.id, participant);
      var event = new ParticipantEvent('participantjoined', { participant: participant });
      self.dispatchEvent(event);
    } else if (data.action === 'leave') {
      var participantId = data.data;
      if (!participants.has(participantId)) {
        _logger2.default.warning('Received leave message from MCU for an unknown participant.');
        return;
      }
      var _participant = participants.get(participantId);
      participants.delete(participantId);
      _participant.dispatchEvent(new EventModule.IcsEvent('left'));
    }
  }

  function fireMessageReceived(data) {
    var messageEvent = new EventModule.MessageEvent('messagereceived', {
      message: data.message,
      origin: data.from
    });
    self.dispatchEvent(messageEvent);
  }

  function fireStreamAdded(info) {
    var stream = createRemoteStream(info);
    remoteStreams.set(stream.id, stream);
    var streamEvent = new StreamModule.StreamEvent('streamadded', {
      stream: stream
    });
    self.dispatchEvent(streamEvent);
  }

  function fireStreamRemoved(info) {
    if (!remoteStreams.has(info.id)) {
      _logger2.default.warning('Cannot find specific remote stream.');
      return;
    }
    var stream = remoteStreams.get(info.id);
    var streamEvent = new EventModule.IcsEvent('ended');
    remoteStreams.delete(stream.id);
    stream.dispatchEvent(streamEvent);
  }

  function fireActiveAudioInputChange(info) {
    if (!remoteStreams.has(info.id)) {
      _logger2.default.warning('Cannot find specific remote stream.');
      return;
    }
    var stream = remoteStreams.get(info.id);
    var streamEvent = new _mixedstream.ActiveAudioInputChangeEvent('activeaudioinputchange', {
      activeAudioInputStreamId: info.data.value
    });
    stream.dispatchEvent(streamEvent);
  }

  function fireLayoutChange(info) {
    if (!remoteStreams.has(info.id)) {
      _logger2.default.warning('Cannot find specific remote stream.');
      return;
    }
    var stream = remoteStreams.get(info.id);
    var streamEvent = new _mixedstream.LayoutChangeEvent('layoutchange', {
      layout: info.data.value
    });
    stream.dispatchEvent(streamEvent);
  }

  function createRemoteStream(streamInfo) {
    if (streamInfo.type === 'mixed') {
      return new _mixedstream.RemoteMixedStream(streamInfo);
    } else {
      var audioSourceInfo = void 0,
          videoSourceInfo = void 0;
      if (streamInfo.media.audio) {
        audioSourceInfo = streamInfo.media.audio.source;
      }
      if (streamInfo.media.video) {
        videoSourceInfo = streamInfo.media.video.source;
      }
      var stream = new StreamModule.RemoteStream(streamInfo.id, streamInfo.info.owner, undefined, new StreamModule.StreamSourceInfo(audioSourceInfo, videoSourceInfo), streamInfo.info.attributes);
      stream.settings = StreamUtilsModule.convertToPublicationSettings(streamInfo.media);
      stream.capabilities = new StreamUtilsModule.convertToSubscriptionCapabilities(streamInfo.media);
      return stream;
    }
  }

  function sendSignalingMessage(type, message) {
    return signaling.send(type, message);
  };

  function createPeerConnectionChannel() {
    // Construct an signaling sender/receiver for ConferencePeerConnection.
    var signalingForChannel = Object.create(EventModule.EventDispatcher);
    signalingForChannel.sendSignalingMessage = sendSignalingMessage;
    var pcc = new _channel.ConferencePeerConnectionChannel(config, signalingForChannel);
    pcc.addEventListener('id', function (messageEvent) {
      channels.set(messageEvent.message, pcc);
    });
    return pcc;
  }

  function clean() {
    participants.clear();
    remoteStreams.clear();
  }

  Object.defineProperty(this, 'info', {
    configurable: false,
    get: function get() {
      if (!room) {
        return null;
      }
      return new _info.ConferenceInfo(room.id, Array.from(participants, function (x) {
        return x[1];
      }), Array.from(remoteStreams, function (x) {
        return x[1];
      }), me);
    }
  });

  /**
   * @function join
   * @instance
   * @desc Join a conference.
   * @memberof Ics.Conference.ConferenceClient
   * @returns {Promise<ConferenceInfo, Error>} Return a promise resolved with current conference's information if successfully join the conference. Or return a promise rejected with a newly created Ics.Error if failed to join the conference.
   * @param {string} token Token is issued by conference server(nuve).
   */
  this.join = function (tokenString) {
    return new Promise(function (resolve, reject) {
      var token = JSON.parse(_base.Base64.decodeBase64(tokenString));
      var isSecured = token.secure === true;
      var host = token.host;
      if (typeof host !== 'string') {
        reject(new _error.ConferenceError('Invalid host.'));
        return;
      }
      if (host.indexOf('http') === -1) {
        host = isSecured ? 'https://' + host : 'http://' + host;
      }
      if (signalingState !== SignalingState.READY) {
        reject(new _error.ConferenceError('connection state invalid'));
        return;
      }

      signalingState = SignalingState.CONNECTING;

      var loginInfo = {
        token: tokenString,
        userAgent: Utils.sysInfo(),
        protocol: protocolVersion
      };

      signaling.connect(host, isSecured, loginInfo).then(function (resp) {
        signalingState = SignalingState.CONNECTED;
        room = resp.room;
        if (room.streams !== undefined) {
          var _iteratorNormalCompletion = true;
          var _didIteratorError = false;
          var _iteratorError = undefined;

          try {
            for (var _iterator = room.streams[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
              var st = _step.value;

              if (st.type === 'mixed') {
                st.viewport = st.info.label;
              }
              remoteStreams.set(st.id, createRemoteStream(st));
            }
          } catch (err) {
            _didIteratorError = true;
            _iteratorError = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion && _iterator.return) {
                _iterator.return();
              }
            } finally {
              if (_didIteratorError) {
                throw _iteratorError;
              }
            }
          }

          ;
        }
        if (resp.room && resp.room.participants !== undefined) {
          var _iteratorNormalCompletion2 = true;
          var _didIteratorError2 = false;
          var _iteratorError2 = undefined;

          try {
            for (var _iterator2 = resp.room.participants[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
              var p = _step2.value;

              participants.set(p.id, new _participant2.Participant(p.id, p.role, p.user));
              if (p.id === resp.id) {
                me = participants.get(p.id);
              }
            }
          } catch (err) {
            _didIteratorError2 = true;
            _iteratorError2 = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion2 && _iterator2.return) {
                _iterator2.return();
              }
            } finally {
              if (_didIteratorError2) {
                throw _iteratorError2;
              }
            }
          }
        }
        resolve(new _info.ConferenceInfo(resp.room.id, Array.from(participants.values()), Array.from(remoteStreams.values()), me));
      }, function (e) {
        signalingState = SignalingState.READY;
        reject(new _error.ConferenceError(e));
      });
    });
  };

  /**
   * @function publish
   * @memberof Ics.Conference.ConferenceClient
   * @instance
   * @desc Publish a LocalStream to conference server. Other participants will be able to subscribe this stream when it is successfully published.
   * @param {Ics.Base.LocalStream} stream The stream to be published.
   * @param {Ics.Base.PublishOptions} options Options for publication.
   * @returns {Promise<Publication, Error>} Returned promise will be resolved with a newly created Publication once specific stream is successfully published, or rejected with a newly created Error if stream is invalid or options cannot be satisfied. Successfully published means PeerConnection is established and server is able to process media data.
   */
  this.publish = function (stream, options) {
    if (!(stream instanceof StreamModule.LocalStream)) {
      return Promise.reject(new _error.ConferenceError('Invalid stream.'));
    }
    if (publishChannels.has(stream.mediaStream.id)) {
      return Promise.reject(new _error.ConferenceError('Cannot publish a published stream.'));
    }
    var channel = createPeerConnectionChannel();
    return channel.publish(stream, options);
  };

  /**
   * @function subscribe
   * @memberof Ics.Conference.ConferenceClient
   * @instance
   * @desc Subscribe a RemoteStream from conference server.
   * @param {Ics.Base.RemoteStream} stream The stream to be subscribed.
   * @param {Ics.Conference.SubscribeOptions} options Options for subscription.
   * @returns {Promise<Subscription, Error>} Returned promise will be resolved with a newly created Subscription once specific stream is successfully subscribed, or rejected with a newly created Error if stream is invalid or options cannot be satisfied. Successfully subscribed means PeerConnection is established and server was started to send media data.
   */
  this.subscribe = function (stream, options) {
    if (!(stream instanceof StreamModule.RemoteStream)) {
      return Promise.reject(new _error.ConferenceError('Invalid stream.'));
    }
    var channel = createPeerConnectionChannel();
    return channel.subscribe(stream, options);
  };

  /**
   * @function send
   * @memberof Ics.Conference.ConferenceClient
   * @instance
   * @desc Send a text message to a participant or all participants.
   * @param {string} message Message to be sent.
   * @param {string} participantId Receiver of this message. Message will be sent to all participants if participantId is undefined.
   * @returns {Promise<void, Error>} Returned promise will be resolved when conference server received certain message.
   */
  this.send = function (message, participantId) {
    if (participantId === undefined) {
      participantId = 'all';
    }
    return sendSignalingMessage('text', { to: participantId, message: message });
  };

  /**
   * @function leave
   * @memberOf Ics.Conference.ConferenceClient
   * @instance
   * @desc Leave a conference.
   * @returns {Promise<void, Error>} Returned promise will be resolved with undefined once the connection is disconnected.
   */
  this.leave = function () {
    return signaling.disconnect().then(function () {
      clean();
      signalingState = SignalingState.READY;
    });
  };
};

ConferenceClient.prototype = new EventModule.EventDispatcher();

},{"../base/base64.js":1,"../base/event.js":3,"../base/logger.js":5,"../base/stream.js":10,"../base/utils.js":11,"./channel.js":12,"./error.js":14,"./info.js":16,"./mixedstream.js":17,"./participant.js":18,"./signaling.js":19,"./streamutils.js":20}],14:[function(require,module,exports){
// Copyright © 2017 Intel Corporation. All Rights Reserved.

'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ConferenceError = exports.ConferenceError = function (_Error) {
  _inherits(ConferenceError, _Error);

  function ConferenceError(message) {
    _classCallCheck(this, ConferenceError);

    return _possibleConstructorReturn(this, (ConferenceError.__proto__ || Object.getPrototypeOf(ConferenceError)).call(this, message));
  }

  return ConferenceError;
}(Error);

},{}],15:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _client = require('./client.js');

Object.defineProperty(exports, 'ConferenceClient', {
  enumerable: true,
  get: function get() {
    return _client.ConferenceClient;
  }
});

var _signaling = require('./signaling.js');

Object.defineProperty(exports, 'SioSignaling', {
  enumerable: true,
  get: function get() {
    return _signaling.SioSignaling;
  }
});

},{"./client.js":13,"./signaling.js":19}],16:[function(require,module,exports){
// Copyright © 2017 Intel Corporation. All Rights Reserved.
'use strict';

/**
 * @class ConferenceInfo
 * @classDesc Information for a conference.
 * @memberOf Ics.Conference
 * @hideconstructor
 */

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ConferenceInfo = exports.ConferenceInfo = function ConferenceInfo(id, participants, remoteStreams, myInfo) {
  _classCallCheck(this, ConferenceInfo);

  /**
   * @member {string} id
   * @instance
   * @memberof Ics.Conference.ConferenceInfo
   * @desc Conference ID.
   */
  this.id = id;
  /**
   * @member {Array<Ics.Conference.Participant>} participants
   * @instance
   * @memberof Ics.Conference.ConferenceInfo
   * @desc Participants in the conference.
   */
  this.participants = participants;
  /**
   * @member {Array<Ics.Base.RemoteStream>} remoteStreams
   * @instance
   * @memberof Ics.Conference.ConferenceInfo
   * @desc Streams published by participants. It also includes streams published by current user.
   */
  this.remoteStreams = remoteStreams;
  /**
   * @member {Ics.Base.Participant} self
   * @instance
   * @memberof Ics.Conference.ConferenceInfo
   */
  this.self = myInfo;
};

},{}],17:[function(require,module,exports){
// Copyright © 2017 Intel Corporation. All Rights Reserved.
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.LayoutChangeEvent = exports.ActiveAudioInputChangeEvent = exports.RemoteMixedStream = undefined;

var _stream = require('../base/stream.js');

var StreamModule = _interopRequireWildcard(_stream);

var _streamutils = require('./streamutils.js');

var StreamUtilsModule = _interopRequireWildcard(_streamutils);

var _event = require('../base/event.js');

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * @class RemoteMixedStream
 * @classDesc Mixed stream from conference server.
 * Events:
 *
 * | Event Name             | Argument Type    | Fired when       |
 * | -----------------------| ---------------- | ---------------- |
 * | activeaudioinputchange | Event            | Audio activeness of input stream(of the mixed stream) is changed. |
 * | layoutchange           | Event            | Video's layout has been changed. It usually happens when a new video is mixed into the target mixed stream or an existing video has been removed from mixed stream. |
 *
 * @memberOf Ics.Conference
 * @extends Ics.Base.RemoteStream
 * @hideconstructor
 */
var RemoteMixedStream = exports.RemoteMixedStream = function (_StreamModule$RemoteS) {
  _inherits(RemoteMixedStream, _StreamModule$RemoteS);

  function RemoteMixedStream(info) {
    _classCallCheck(this, RemoteMixedStream);

    if (info.type !== 'mixed') {
      throw new TypeError('Not a mixed stream');
    }

    var _this = _possibleConstructorReturn(this, (RemoteMixedStream.__proto__ || Object.getPrototypeOf(RemoteMixedStream)).call(this, info.id, undefined, undefined, new StreamModule.StreamSourceInfo('mixed', 'mixed')));

    _this.settings = StreamUtilsModule.convertToPublicationSettings(info.media);

    _this.capabilities = new StreamUtilsModule.convertToSubscriptionCapabilities(info.media);
    return _this;
  }

  return RemoteMixedStream;
}(StreamModule.RemoteStream);

/**
 * @class ActiveAudioInputChangeEvent
 * @classDesc Class ActiveInputChangeEvent represents an active audio input change event.
 * @memberof Ics.Conference
 * @hideconstructor
 */


var ActiveAudioInputChangeEvent = exports.ActiveAudioInputChangeEvent = function (_IcsEvent) {
  _inherits(ActiveAudioInputChangeEvent, _IcsEvent);

  function ActiveAudioInputChangeEvent(type, init) {
    _classCallCheck(this, ActiveAudioInputChangeEvent);

    /**
     * @member {string} activeAudioInputStreamId
     * @instance
     * @memberof Ics.Conference.ActiveAudioInputChangeEvent
     * @desc The ID of input stream(of the mixed stream) whose audio is active.
     */
    var _this2 = _possibleConstructorReturn(this, (ActiveAudioInputChangeEvent.__proto__ || Object.getPrototypeOf(ActiveAudioInputChangeEvent)).call(this, type));

    _this2.activeAudioInputStreamId = init.activeAudioInputStreamId;
    return _this2;
  }

  return ActiveAudioInputChangeEvent;
}(_event.IcsEvent);

/**
 * @class LayoutChangeEvent
 * @classDesc Class LayoutChangeEvent represents an video layout change event.
 * @memberof Ics.Conference
 * @hideconstructor
 */


var LayoutChangeEvent = exports.LayoutChangeEvent = function (_IcsEvent2) {
  _inherits(LayoutChangeEvent, _IcsEvent2);

  function LayoutChangeEvent(type, init) {
    _classCallCheck(this, LayoutChangeEvent);

    /**
     * @member {object} layout
     * @instance
     * @memberof Ics.Conference.LayoutChangeEvent
     * @desc Current video's layout. It's an array of map which maps each stream to a region.
     */
    var _this3 = _possibleConstructorReturn(this, (LayoutChangeEvent.__proto__ || Object.getPrototypeOf(LayoutChangeEvent)).call(this, type));

    _this3.layout = init.layout;
    return _this3;
  }

  return LayoutChangeEvent;
}(_event.IcsEvent);

},{"../base/event.js":3,"../base/stream.js":10,"./streamutils.js":20}],18:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Participant = undefined;

var _event = require('../base/event.js');

var EventModule = _interopRequireWildcard(_event);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } // Copyright © 2017 Intel Corporation. All Rights Reserved.

'use strict';

/**
 * @class Participant
 * @memberOf Ics.Conference
 * @classDesc The Participant defines a participant in a conference.
 * Events:
 *
 * | Event Name      | Argument Type    | Fired when       |
 * | ----------------| ---------------- | ---------------- |
 * | left            | Event            | The participant left the conference. |
 *
 * @extends Ics.Base.EventDispatcher
 * @hideconstructor
 */

var Participant = exports.Participant = function (_EventModule$EventDis) {
  _inherits(Participant, _EventModule$EventDis);

  function Participant(id, role, userId) {
    _classCallCheck(this, Participant);

    /**
     * @member {string} id
     * @instance
     * @memberof Ics.Conference.Participant
     * @desc The ID of the participant. It varies when a single user join different conferences.
     */
    var _this = _possibleConstructorReturn(this, (Participant.__proto__ || Object.getPrototypeOf(Participant)).call(this));

    Object.defineProperty(_this, 'id', {
      configurable: false,
      writable: false,
      value: id
    });
    /**
     * @member {string} role
     * @instance
     * @memberof Ics.Conference.Participant
     */
    Object.defineProperty(_this, 'role', {
      configurable: false,
      writable: false,
      value: role
    });
    /**
     * @member {string} userId
     * @instance
     * @memberof Ics.Conference.Participant
     * @desc The user ID of the participant. It can be integrated into existing account management system.
     */
    Object.defineProperty(_this, 'userId', {
      configurable: false,
      writable: false,
      value: userId
    });
    return _this;
  }

  return Participant;
}(EventModule.EventDispatcher);

},{"../base/event.js":3}],19:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SioSignaling = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _logger = require('../base/logger.js');

var _logger2 = _interopRequireDefault(_logger);

var _event = require('../base/event.js');

var EventModule = _interopRequireWildcard(_event);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /* global io */


'use strict';

function handleResponse(status, data, resolve, reject) {
  if (status === 'ok' || status === 'success') {
    resolve(data);
  } else if (status === 'error') {
    reject(data);
  } else {
    _logger2.default.error('MCU returns unknown ack.');
  }
};

/**
 * @class SioSignaling
 * @classdesc Socket.IO signaling channel for ConferenceClient. It is not recommended to directly access this class.
 * @memberof Ics.Conference
 * @extends Ics.Base.EventDispatcher
 * @constructor
 * @param {?Object } sioConfig Configuration for Socket.IO options.
 * @see https://socket.io/docs/client-api/#io-url-options
 */

var SioSignaling = exports.SioSignaling = function (_EventModule$EventDis) {
  _inherits(SioSignaling, _EventModule$EventDis);

  function SioSignaling(sioConfig) {
    _classCallCheck(this, SioSignaling);

    var _this = _possibleConstructorReturn(this, (SioSignaling.__proto__ || Object.getPrototypeOf(SioSignaling)).call(this));

    _this._socket = null;
    _this._sioConfig = sioConfig || {};
    return _this;
  }

  _createClass(SioSignaling, [{
    key: 'connect',
    value: function connect(host, isSecured, loginInfo) {
      var _this2 = this;

      this._sioConfig.secure = isSecured;
      if (this._sioConfig['force new connection'] === undefined) {
        this._sioConfig['force new connection'] = true;
      }
      return new Promise(function (resolve, reject) {
        _this2._socket = io.connect(host, _this2._sioConfig);
        ['drop', 'participant', 'text', 'stream', 'progress'].forEach(function (notification) {
          _this2._socket.on(notification, function (data) {
            _this2.dispatchEvent(new EventModule.MessageEvent('data', {
              message: {
                notification: notification,
                data: data
              }
            }));
          });
        });
        _this2._socket.on('disconnect', function () {
          _this2.dispatchEvent(new EventModule.IcsEvent('disconnect'));
        });
        _this2._socket.emit('login', loginInfo, function (status, data) {
          handleResponse(status, data, resolve, reject);
        });
      });
    }
  }, {
    key: 'disconnect',
    value: function disconnect() {
      var _this3 = this;

      return new Promise(function (resolve, reject) {
        _this3._socket.emit('logout', function (status, data) {
          _this3._socket.disconnect();
          handleResponse(status, data, resolve, reject);
        });
      });
    }
  }, {
    key: 'send',
    value: function send(requestName, requestData) {
      var _this4 = this;

      return new Promise(function (resolve, reject) {
        _this4._socket.emit(requestName, requestData, function (status, data) {
          handleResponse(status, data, resolve, reject);
        });
      });
    }
  }]);

  return SioSignaling;
}(EventModule.EventDispatcher);

},{"../base/event.js":3,"../base/logger.js":5}],20:[function(require,module,exports){
// Copyright © 2017 Intel Corporation. All Rights Reserved.
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.convertToPublicationSettings = convertToPublicationSettings;
exports.convertToSubscriptionCapabilities = convertToSubscriptionCapabilities;

var _publication = require('../base/publication.js');

var PublicationModule = _interopRequireWildcard(_publication);

var _mediaformat = require('../base/mediaformat.js');

var MediaFormatModule = _interopRequireWildcard(_mediaformat);

var _codec = require('../base/codec.js');

var CodecModule = _interopRequireWildcard(_codec);

var _subscription = require('./subscription.js');

var SubscriptionModule = _interopRequireWildcard(_subscription);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function extractBitrateMultiplier(input) {
  if (typeof input !== 'string' || !input.startsWith('x')) {
    L.Logger.warning('Invalid bitrate multiplier input.');
    return 0;
  }
  return Number.parseFloat(input.replace(/^x/, ''));
}

function sortNumbers(x, y) {
  return x - y;
}

function sortResolutions(x, y) {
  if (x.width !== y.width) {
    return x.width - y.width;
  } else {
    return x.height - y.height;
  }
}

function convertToPublicationSettings(mediaInfo) {
  var audio = void 0,
      audioCodec = void 0,
      video = void 0,
      videoCodec = void 0,
      resolution = void 0,
      framerate = void 0,
      bitrate = void 0,
      keyFrameInterval = void 0;
  if (mediaInfo.audio) {
    if (mediaInfo.audio.format) {
      audioCodec = new CodecModule.AudioCodecParameters(mediaInfo.audio.format.codec, mediaInfo.audio.format.channelNum, mediaInfo.audio.format.sampleRate);
    }
    audio = new PublicationModule.AudioPublicationSettings(audioCodec);
  }
  if (mediaInfo.video) {
    if (mediaInfo.video.format) {
      videoCodec = new CodecModule.VideoCodecParameters(mediaInfo.video.format.codec, mediaInfo.video.format.profile);
    }
    if (mediaInfo.video.parameters) {
      if (mediaInfo.video.parameters.resolution) {
        resolution = new MediaFormatModule.Resolution(mediaInfo.video.parameters.resolution.width, mediaInfo.video.parameters.resolution.height);
      }
      framerate = mediaInfo.video.parameters.framerate;
      bitrate = mediaInfo.video.parameters.bitrate * 1000;
      keyFrameInterval = mediaInfo.video.parameters.keyFrameInterval;
    }
    video = new PublicationModule.VideoPublicationSettings(videoCodec, resolution, framerate, bitrate, keyFrameInterval);
  }
  return new PublicationModule.PublicationSettings(audio, video);
}

function convertToSubscriptionCapabilities(mediaInfo) {
  var audio = void 0,
      video = void 0;
  if (mediaInfo.audio) {
    var audioCodecs = [];
    if (mediaInfo.audio && mediaInfo.audio.format) {
      audioCodecs.push(new CodecModule.AudioCodecParameters(mediaInfo.audio.format.codec, mediaInfo.audio.format.channelNum, mediaInfo.audio.format.sampleRate));
    }
    if (mediaInfo.audio && mediaInfo.audio.optional && mediaInfo.audio.optional.format) {
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = mediaInfo.audio.optional.format[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var audioCodecInfo = _step.value;

          var audioCodec = new CodecModule.AudioCodecParameters(audioCodecInfo.codec, audioCodecInfo.channelNum, audioCodecInfo.sampleRate);
          audioCodecs.push(audioCodec);
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator.return) {
            _iterator.return();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }
    }
    audioCodecs.sort();
    audio = new SubscriptionModule.AudioSubscriptionCapabilities(audioCodecs);
  }
  if (mediaInfo.video) {
    var videoCodecs = [];
    if (mediaInfo.video && mediaInfo.video.format) {
      videoCodecs.push(new CodecModule.VideoCodecParameters(mediaInfo.video.format.codec, mediaInfo.video.format.profile));
    }
    if (mediaInfo.video && mediaInfo.video.optional && mediaInfo.video.optional.format) {
      var _iteratorNormalCompletion2 = true;
      var _didIteratorError2 = false;
      var _iteratorError2 = undefined;

      try {
        for (var _iterator2 = mediaInfo.video.optional.format[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
          var videoCodecInfo = _step2.value;

          var videoCodec = new CodecModule.VideoCodecParameters(videoCodecInfo.codec, videoCodecInfo.profile);
          videoCodecs.push(videoCodec);
        }
      } catch (err) {
        _didIteratorError2 = true;
        _iteratorError2 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion2 && _iterator2.return) {
            _iterator2.return();
          }
        } finally {
          if (_didIteratorError2) {
            throw _iteratorError2;
          }
        }
      }
    }
    videoCodecs.sort();
    var resolutions = Array.from(mediaInfo.video.optional.parameters.resolution, function (r) {
      return new MediaFormatModule.Resolution(r.width, r.height);
    });
    if (mediaInfo.video && mediaInfo.video.parameters && mediaInfo.video.parameters.resolution) {
      resolutions.push(new MediaFormatModule.Resolution(mediaInfo.video.parameters.resolution.width, mediaInfo.video.parameters.resolution.height));
    }
    resolutions.sort(sortResolutions);
    var bitrates = Array.from(mediaInfo.video.optional.parameters.bitrate, function (bitrate) {
      return extractBitrateMultiplier(bitrate);
    });
    bitrates.push(1.0);
    bitrates.sort(sortNumbers);
    var frameRates = JSON.parse(JSON.stringify(mediaInfo.video.optional.parameters.framerate));
    if (mediaInfo.video && mediaInfo.video.parameters && mediaInfo.video.parameters.framerate) {
      frameRates.push(mediaInfo.video.parameters.framerate);
    }
    frameRates.sort(sortNumbers);
    var keyFrameIntervals = JSON.parse(JSON.stringify(mediaInfo.video.optional.parameters.keyFrameInterval));
    if (mediaInfo.video && mediaInfo.video.parameters && mediaInfo.video.parameters.keyFrameInterval) {
      keyFrameIntervals.push(mediaInfo.video.parameters.keyFrameInterval);
    }
    keyFrameIntervals.sort(sortNumbers);
    video = new SubscriptionModule.VideoSubscriptionCapabilities(videoCodecs, resolutions, frameRates, bitrates, keyFrameIntervals);
  }
  return new SubscriptionModule.SubscriptionCapabilities(audio, video);
}

},{"../base/codec.js":2,"../base/mediaformat.js":6,"../base/publication.js":8,"./subscription.js":21}],21:[function(require,module,exports){
// Copyright © 2017 Intel Corporation. All Rights Reserved.

'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Subscription = exports.SubscriptionUpdateOptions = exports.VideoSubscriptionUpdateOptions = exports.SubscribeOptions = exports.VideoSubscriptionConstraints = exports.AudioSubscriptionConstraints = exports.SubscriptionCapabilities = exports.VideoSubscriptionCapabilities = exports.AudioSubscriptionCapabilities = undefined;

var _mediaformat = require('../base/mediaformat.js');

var MediaFormatModule = _interopRequireWildcard(_mediaformat);

var _codec = require('../base/codec.js');

var CodecModule = _interopRequireWildcard(_codec);

var _event = require('../base/event.js');

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * @class AudioSubscriptionCapabilities
 * @memberOf Ics.Conference
 * @classDesc Represents the audio capability for subscription.
 * @hideconstructor
 */
var AudioSubscriptionCapabilities = exports.AudioSubscriptionCapabilities = function AudioSubscriptionCapabilities(codecs) {
  _classCallCheck(this, AudioSubscriptionCapabilities);

  /**
   * @member {Array.<Ics.Base.AudioCodecParameters>} codecs
   * @instance
   * @memberof Ics.Conference.AudioSubscriptionCapabilities
   */
  this.codecs = codecs;
};

/**
 * @class VideoSubscriptionCapabilities
 * @memberOf Ics.Conference
 * @classDesc Represents the video capability for subscription.
 * @hideconstructor
 */


var VideoSubscriptionCapabilities = exports.VideoSubscriptionCapabilities = function VideoSubscriptionCapabilities(codecs, resolutions, frameRates, bitrateMultipliers, keyFrameIntervals) {
  _classCallCheck(this, VideoSubscriptionCapabilities);

  /**
   * @member {Array.<Ics.Base.VideoCodecParameters>} codecs
   * @instance
   * @memberof Ics.Conference.VideoSubscriptionCapabilities
   */
  this.codecs = codecs;
  /**
   * @member {Array.<Ics.Base.Resolution>} resolution
   * @instance
   * @memberof Ics.Conference.VideoSubscriptionCapabilities
   */
  this.resolutions = resolutions;
  /**
   * @member {Array.<number>} frameRates
   * @instance
   * @memberof Ics.Conference.VideoSubscriptionCapabilities
   */
  this.frameRates = frameRates;
  /**
   * @member {Array.<number>} bitrateMultipliers
   * @instance
   * @memberof Ics.Conference.VideoSubscriptionCapabilities
   */
  this.bitrateMultipliers = bitrateMultipliers;
  /**
   * @member {Array.<number>} keyFrameIntervals
   * @instance
   * @memberof Ics.Conference.VideoSubscriptionCapabilities
   */
  this.keyFrameIntervals = keyFrameIntervals;
};

/**
 * @class SubscriptionCapabilities
 * @memberOf Ics.Conference
 * @classDesc Represents the capability for subscription.
 * @hideconstructor
 */


var SubscriptionCapabilities = exports.SubscriptionCapabilities = function SubscriptionCapabilities(audio, video) {
  _classCallCheck(this, SubscriptionCapabilities);

  /**
   * @member {?AudioSubscriptionCapabilities} audio
   * @instance
   * @memberof Ics.Conference.SubscriptionCapabilities
   */
  this.audio = audio;
  /**
   * @member {?VideoSubscriptionCapabilities} video
   * @instance
   * @memberof Ics.Conference.SubscriptionCapabilities
   */
  this.video = video;
};

/**
 * @class AudioSubscriptionConstraints
 * @memberOf Ics.Conference
 * @classDesc Represents the audio constraints for subscription.
 * @hideconstructor
 */


var AudioSubscriptionConstraints = exports.AudioSubscriptionConstraints = function AudioSubscriptionConstraints(codecs) {
  _classCallCheck(this, AudioSubscriptionConstraints);

  /**
   * @member {?Array.<Ics.Base.AudioCodecParameters>} codecs
   * @instance
   * @memberof Ics.Conference.AudioSubscriptionConstraints
   * @desc Codecs accepted. If none of `codecs` supported by both sides, connection fails. Leave it undefined will use all possible codecs.
   */
  this.codecs = codecs;
};

/**
 * @class VideoSubscriptionConstraints
 * @memberOf Ics.Conference
 * @classDesc Represents the video constraints for subscription.
 * @hideconstructor
 */


var VideoSubscriptionConstraints = exports.VideoSubscriptionConstraints = function VideoSubscriptionConstraints(codecs, resolution, frameRate, bitrateMultiplier, keyFrameInterval) {
  _classCallCheck(this, VideoSubscriptionConstraints);

  /**
   * @member {?Array.<Ics.Base.VideoCodecParameters>} codecs
   * @instance
   * @memberof Ics.Conference.VideoSubscriptionConstraints
   * @desc Codecs accepted. If none of `codecs` supported by both sides, connection fails. Leave it undefined will use all possible codecs.
   */
  this.codecs = codecs;
  /**
   * @member {?Ics.Base.Resolution} resolution
   * @instance
   * @memberof Ics.Conference.VideoSubscriptionConstraints
   * @desc Only resolutions listed in VideoSubscriptionCapabilities are allowed.
   */
  this.resolution = resolution;
  /**
   * @member {?number} frameRates
   * @instance
   * @memberof Ics.Conference.VideoSubscriptionConstraints
   * @desc Only frameRates listed in VideoSubscriptionCapabilities are allowed.
   */
  this.frameRate = frameRate;
  /**
   * @member {?number} bitrateMultipliers
   * @instance
   * @memberof Ics.Conference.VideoSubscriptionConstraints
   * @desc Only bitrateMultipliers listed in VideoSubscriptionCapabilities are allowed.
   */
  this.bitrateMultiplier = bitrateMultiplier;
  /**
   * @member {?number} keyFrameIntervals
   * @instance
   * @memberof Ics.Conference.VideoSubscriptionConstraints
   * @desc Only keyFrameIntervals listed in VideoSubscriptionCapabilities are allowed.
   */
  this.keyFrameInterval = keyFrameInterval;
};

/**
 * @class SubscribeOptions
 * @memberOf Ics.Conference
 * @classDesc SubscribeOptions defines options for subscribing a Ics.Base.RemoteStream.
 */


var SubscribeOptions = exports.SubscribeOptions = function SubscribeOptions(audio, video) {
  _classCallCheck(this, SubscribeOptions);

  /**
   * @member {?AudioSubscriptionConstraints} audio
   * @instance
   * @memberof Ics.Conference.SubscribeOptions
   */
  this.audio = audio;
  /**
   * @member {?VideoSubscriptionConstraints} video
   * @instance
   * @memberof Ics.Conference.SubscribeOptions
   */
  this.video = video;
};

/**
 * @class VideoSubscriptionUpdateOptions
 * @memberOf Ics.Conference
 * @classDesc VideoSubscriptionUpdateOptions defines options for updating a subscription's video part.
 * @hideconstructor
 */


var VideoSubscriptionUpdateOptions = exports.VideoSubscriptionUpdateOptions = function VideoSubscriptionUpdateOptions() {
  _classCallCheck(this, VideoSubscriptionUpdateOptions);

  /**
   * @member {?Ics.Base.Resolution} resolution
   * @instance
   * @memberof Ics.Conference.VideoSubscriptionUpdateOptions
   * @desc Only resolutions listed in VideoSubscriptionCapabilities are allowed.
   */
  this.resolution = undefined;
  /**
   * @member {?number} frameRates
   * @instance
   * @memberof Ics.Conference.VideoSubscriptionUpdateOptions
   * @desc Only frameRates listed in VideoSubscriptionCapabilities are allowed.
   */
  this.frameRate = undefined;
  /**
   * @member {?number} bitrateMultipliers
   * @instance
   * @memberof Ics.Conference.VideoSubscriptionUpdateOptions
   * @desc Only bitrateMultipliers listed in VideoSubscriptionCapabilities are allowed.
   */
  this.bitrateMultipliers = undefined;
  /**
   * @member {?number} keyFrameIntervals
   * @instance
   * @memberof Ics.Conference.VideoSubscriptionUpdateOptions
   * @desc Only keyFrameIntervals listed in VideoSubscriptionCapabilities are allowed.
   */
  this.keyFrameInterval = undefined;
};

/**
 * @class SubscriptionUpdateOptions
 * @memberOf Ics.Conference
 * @classDesc SubscriptionUpdateOptions defines options for updating a subscription.
 * @hideconstructor
 */


var SubscriptionUpdateOptions = exports.SubscriptionUpdateOptions = function SubscriptionUpdateOptions() {
  _classCallCheck(this, SubscriptionUpdateOptions);

  /**
   * @member {?VideoSubscriptionUpdateOptions} video
   * @instance
   * @memberof Ics.Conference.SubscriptionUpdateOptions
   */
  this.video = undefined;
};

/**
 * @class Subscription
 * @memberof Ics.Conference
 * @classDesc Subscription is a receiver for receiving a stream.
 * Events:
 *
 * | Event Name      | Argument Type    | Fired when       |
 * | ----------------| ---------------- | ---------------- |
 * | ended           | Event            | Subscription is ended. |
 * | mute            | MuteEvent        | Publication is muted. Remote side stopped sending audio and/or video data. |
 * | unmute          | MuteEvent        | Publication is unmuted. Remote side continued sending audio and/or video data. |
 *
 * @extends Ics.Base.EventDispatcher
 * @hideconstructor
 */


var Subscription = exports.Subscription = function (_EventDispatcher) {
  _inherits(Subscription, _EventDispatcher);

  function Subscription(id, stop, getStats, mute, unmute, applyOptions) {
    _classCallCheck(this, Subscription);

    var _this = _possibleConstructorReturn(this, (Subscription.__proto__ || Object.getPrototypeOf(Subscription)).call(this));

    if (!id) {
      throw new TypeError('ID cannot be null or undefined.');
    }
    /**
     * @member {string} id
     * @instance
     * @memberof Ics.Conference.Subscription
     */
    Object.defineProperty(_this, 'id', {
      configurable: false,
      writable: false,
      value: id
    });
    /**
     * @function stop
     * @instance
     * @desc Stop certain subscription. Once a subscription is stopped, it cannot be recovered.
     * @memberof Ics.Conference.Subscription
     * @returns {undefined}
     */
    _this.stop = stop;
    /**
     * @function getStats
     * @instance
     * @desc Get stats of underlying PeerConnection.
     * @memberof Ics.Conference.Subscription
     * @returns {Promise<RTCStatsReport, Error>}
     */
    _this.getStats = getStats;
    /**
     * @function mute
     * @instance
     * @desc Stop reeving data from remote endpoint.
     * @memberof Ics.Conference.Subscription
     * @param {Ics.Base.TrackKind } kind Kind of tracks to be muted.
     * @returns {Promise<undefined, Error>}
     */
    _this.mute = mute;
    /**
     * @function unmute
     * @instance
     * @desc Continue reeving data from remote endpoint.
     * @memberof Ics.Conference.Subscription
     * @param {Ics.Base.TrackKind } kind Kind of tracks to be unmuted.
     * @returns {Promise<undefined, Error>}
     */
    _this.unmute = unmute;
    /**
     * @function applyOptions
     * @instance
     * @desc Update subscription with given options.
     * @memberof Ics.Conference.Subscription
     * @param {Ics.Conference.SubscriptionUpdateOptions } options Subscription update options.
     * @returns {Promise<undefined, Error>}
     */
    _this.applyOptions = applyOptions;
    return _this;
  }

  return Subscription;
}(_event.EventDispatcher);

},{"../base/codec.js":2,"../base/event.js":3,"../base/mediaformat.js":6}],22:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Conference = exports.P2P = exports.Base = undefined;

var _export = require('./base/export.js');

var base = _interopRequireWildcard(_export);

var _export2 = require('./p2p/export.js');

var p2p = _interopRequireWildcard(_export2);

var _export3 = require('./conference/export.js');

var conference = _interopRequireWildcard(_export3);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

/**
 * Base objects for both P2P and conference.
 * @namespace Ics.Base
 */
var Base = exports.Base = base;

/**
 * P2P WebRTC connections.
 * @namespace Ics.P2P
 */
var P2P = exports.P2P = p2p;

/**
 * WebRTC connections with conference server.
 * @namespace Ics.Conference
 */
var Conference = exports.Conference = conference;

},{"./base/export.js":4,"./conference/export.js":15,"./p2p/export.js":24}],23:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getErrorByCode = getErrorByCode;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var errors = exports.errors = {
  // 2100-2999 for P2P errors
  // 2100-2199 for connection errors
  // 2100-2109 for server errors
  P2P_CONN_SERVER_UNKNOWN: {
    code: 2100,
    message: 'Server unknown error.'
  },
  P2P_CONN_SERVER_UNAVAILABLE: {
    code: 2101,
    message: 'Server is unavaliable.'
  },
  P2P_CONN_SERVER_BUSY: {
    code: 2102,
    message: 'Server is too busy.'
  },
  P2P_CONN_SERVER_NOT_SUPPORTED: {
    code: 2103,
    message: 'Method has not been supported by server.'
  },
  // 2110-2119 for client errors
  P2P_CONN_CLIENT_UNKNOWN: {
    code: 2110,
    message: 'Client unknown error.'
  },
  P2P_CONN_CLIENT_NOT_INITIALIZED: {
    code: 2111,
    message: 'Connection is not initialized.'
  },
  // 2120-2129 for authentication errors
  P2P_CONN_AUTH_UNKNOWN: {
    code: 2120,
    message: 'Authentication unknown error.'
  },
  P2P_CONN_AUTH_FAILED: {
    code: 2121,
    message: 'Wrong username or token.'
  },
  // 2200-2299 for message transport errors
  P2P_MESSAGING_TARGET_UNREACHABLE: {
    code: 2201,
    message: 'Remote user cannot be reached.'
  },
  // 2301-2399 for chat room errors
  // 2401-2499 for client errors
  P2P_CLIENT_UNKNOWN: {
    code: 2400,
    message: 'Unknown errors.'
  },
  P2P_CLIENT_UNSUPPORTED_METHOD: {
    code: 2401,
    message: 'This method is unsupported in current browser.'
  },
  P2P_CLIENT_ILLEGAL_ARGUMENT: {
    code: 2402,
    message: 'Illegal argument.'
  },
  P2P_CLIENT_INVALID_STATE: {
    code: 2403,
    message: 'Invalid peer state.'
  },
  P2P_CLIENT_NOT_ALLOWED: {
    code: 2404,
    message: 'Remote user is not allowed.'
  },
  // 2501-2599 for WebRTC erros.
  P2P_WEBRTC_UNKNOWN: {
    code: 2500,
    message: 'WebRTC error.'
  },
  P2P_WEBRTC_SDP: {
    code: 2502,
    message: 'SDP error.'
  }
};

function getErrorByCode(errorCode) {
  var codeErrorMap = {
    2100: errors.P2P_CONN_SERVER_UNKNOWN,
    2101: errors.P2P_CONN_SERVER_UNAVAILABLE,
    2102: errors.P2P_CONN_SERVER_BUSY,
    2103: errors.P2P_CONN_SERVER_NOT_SUPPORTED,
    2110: errors.P2P_CONN_CLIENT_UNKNOWN,
    2111: errors.P2P_CONN_CLIENT_NOT_INITIALIZED,
    2120: errors.P2P_CONN_AUTH_UNKNOWN,
    2121: errors.P2P_CONN_AUTH_FAILED,
    2201: errors.P2P_MESSAGING_TARGET_UNREACHABLE,
    2400: errors.P2P_CLIENT_UNKNOWN,
    2401: errors.P2P_CLIENT_UNSUPPORTED_METHOD,
    2402: errors.P2P_CLIENT_ILLEGAL_ARGUMENT,
    2403: errors.P2P_CLIENT_INVALID_STATE,
    2404: errors.P2P_CLIENT_NOT_ALLOWED,
    2500: errors.P2P_WEBRTC_UNKNOWN,
    2501: errors.P2P_WEBRTC_SDP
  };
  return codeErrorMap[errorCode];
}

var P2PError = exports.P2PError = function (_Error) {
  _inherits(P2PError, _Error);

  function P2PError(error, message) {
    _classCallCheck(this, P2PError);

    var _this = _possibleConstructorReturn(this, (P2PError.__proto__ || Object.getPrototypeOf(P2PError)).call(this, message));

    if (typeof error === 'number') {
      _this.code = error;
    } else {
      _this.code = error.code;
    }
    return _this;
  }

  return P2PError;
}(Error);

},{}],24:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _p2pclient = require('./p2pclient.js');

Object.defineProperty(exports, 'P2PClient', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_p2pclient).default;
  }
});

var _error = require('./error.js');

Object.defineProperty(exports, 'P2PError', {
  enumerable: true,
  get: function get() {
    return _error.P2PError;
  }
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

},{"./error.js":23,"./p2pclient.js":25}],25:[function(require,module,exports){
// Copyright © 2017 Intel Corporation. All Rights Reserved.
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _logger = require('../base/logger.js');

var _logger2 = _interopRequireDefault(_logger);

var _event = require('../base/event.js');

var _utils = require('../base/utils.js');

var Utils = _interopRequireWildcard(_utils);

var _error = require('./error.js');

var ErrorModule = _interopRequireWildcard(_error);

var _peerconnectionChannel = require('./peerconnection-channel.js');

var _peerconnectionChannel2 = _interopRequireDefault(_peerconnectionChannel);

var _stream = require('../base/stream.js');

var StreamModule = _interopRequireWildcard(_stream);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ConnectionState = {
  READY: 1,
  CONNECTING: 2,
  CONNECTED: 3
};

var pcDisconnectTimeout = 15000; // Close peerconnection after disconnect 15s.let isConnectedToSignalingChannel = false;
var offerOptions = {
  'offerToReceiveAudio': true,
  'offerToReceiveVideo': true
};
var sysInfo = Utils.sysInfo();
var supportsPlanB = navigator.mozGetUserMedia ? false : true;
var supportsUnifiedPlan = navigator.mozGetUserMedia ? true : false;
/**
 * @function isArray
 * @desc Test if an object is an array.
 * @return {boolean} DESCRIPTION
 * @private
 */
function isArray(obj) {
  return Object.prototype.toString.call(obj) === '[object Array]';
}
/*
 * Return negative value if id1<id2, positive value if id1>id2
 */
var compareID = function compareID(id1, id2) {
  return id1.localeCompare(id2);
};
// If targetId is peerId, then return targetId.
var getPeerId = function getPeerId(targetId) {
  return targetId;
};
var changeNegotiationState = function changeNegotiationState(peer, state) {
  peer.negotiationState = state;
};
// Do stop chat locally.
var stopChatLocally = function stopChatLocally(peer, originatorId) {
  if (peer.state === PeerState.CONNECTED || peer.state === PeerState.CONNECTING) {
    if (peer.sendDataChannel) {
      peer.sendDataChannel.close();
    }
    if (peer.receiveDataChannel) {
      peer.receiveDataChannel.close();
    }
    if (peer.connection && peer.connection.iceConnectionState !== 'closed') {
      peer.connection.close();
    }
    if (peer.state !== PeerState.READY) {
      peer.state = PeerState.READY;
      that.dispatchEvent(new Woogeen.ChatEvent({
        type: 'chat-stopped',
        peerId: peer.id,
        senderId: originatorId
      }));
    }
    // Unbind events for the pc, so the old pc will not impact new peerconnections created for the same target later.
    unbindEvetsToPeerConnection(peer.connection);
  }
};

/**
 * @class P2PClientConfiguration
 * @classDesc Configuration for P2PClient.
 * @memberOf Ics.P2P
 * @hideconstructor
 */
var P2PClientConfiguration = function P2PClientConfiguration() {
  /**
   * @member {?Array<Ics.Base.AudioEncodingParameters>} audioEncoding
   * @instance
   * @desc Encoding parameters for publishing audio tracks.
   * @memberof Ics.P2P.P2PClientConfiguration
   */
  this.audioEncoding = undefined;
  /**
   * @member {?Array<Ics.Base.VideoEncodingParameters>} videoEncoding
   * @instance
   * @desc Encoding parameters for publishing video tracks.
   * @memberof Ics.P2P.P2PClientConfiguration
   */
  this.videoEncoding = undefined;
  /**
   * @member {?RTCConfiguration} rtcConfiguration
   * @instance
   * @memberof Ics.P2P.P2PClientConfiguration
   * @desc It will be used for creating PeerConnection.
   * @see {@link https://www.w3.org/TR/webrtc/#rtcconfiguration-dictionary|RTCConfiguration Dictionary of WebRTC 1.0}.
   * @example
   * // Following object can be set to p2pClientConfiguration.rtcConfiguration.
   * {
   *   iceServers: [{
   *      urls: "stun:example.com:3478"
   *   }, {
   *     urls: [
   *       "turn:example.com:3478?transport=udp",
   *       "turn:example.com:3478?transport=tcp"
   *     ],
   *      credential: "password",
   *      username: "username"
   *   }
   * }
   */
  this.rtcConfiguration = undefined;
};

/**
 * @class P2PClient
 * @classDesc The P2PClient handles PeerConnections between different clients.
 * Events:
 *
 * | Event Name            | Argument Type    | Fired when       |
 * | --------------------- | ---------------- | ---------------- |
 * | streamadded           | StreamEvent      | A new stream is sent from remote endpoint. |
 * | messagereceived       | MessageEvent     | A new message is received. |
 * | serverdisconnected    | IcsEvent         | Disconnected from signaling server. |
 *
 * @memberof Ics.P2P
 * @extends Ics.Base.EventDispatcher
 * @constructor
 * @param {?Ics.P2P.P2PClientConfiguration } config Configuration for P2PClient.
 */
var P2PClient = function P2PClient(configuration, signalingChannel) {
  Object.setPrototypeOf(this, new _event.EventDispatcher());
  var config = configuration;
  var signaling = signalingChannel;
  var channels = new Map(); // Map of PeerConnectionChannels.
  var self = this;
  var state = ConnectionState.READY;
  var myId = void 0;

  signaling.onMessage = function (origin, message) {
    _logger2.default.debug('Received signaling message from ' + origin + ': ' + message);
    var data = JSON.parse(message);
    if (data.type === 'chat-closed' && !channels.has(origin)) {
      return;
    }
    if (self.allowedRemoteIds.indexOf(origin) >= 0) {
      getOrCreateChannel(origin).onMessage(data);
    } else if (data.type !== 'chat-denied') {
      sendSignalingMessage(origin, 'chat-denied');
    }
  };

  signaling.onServerDisconnected = function () {
    state = ConnectionState.READY;
    self.dispatchEvent(new _event.IcsEvent('serverdisconnected'));
  };

  /**
   * @member {array} allowedRemoteIds
   * @memberof Ics.P2P.P2PClient
   * @instance
   * @desc Only allowed remote endpoint IDs are able to publish stream or send message to current endpoint. Removing an ID from allowedRemoteIds does stop existing connection with certain endpoint. Please call stop to stop the PeerConnection.
   */
  this.allowedRemoteIds = [];

  /**
   * @function connect
   * @instance
   * @desc Connect to signaling server. Since signaling can be customized, this method does not define how a token looks like. SDK passes token to signaling channel without changes.
   * @memberof Ics.P2P.P2PClient
   * @returns {Promise<object, Error>} It returns a promise resolved with an object returned by signaling channel once signaling channel reports connection has been established.
   */
  this.connect = function (token) {
    if (state === ConnectionState.READY) {
      state = ConnectionState.CONNECTING;
    } else {
      _logger2.default.warning('Invalid connection state: ' + state);
      return Promise.reject(new ErrorModule.P2PError(ErrorModule.errors.P2P_CLIENT_INVALID_STATE));
    }
    return new Promise(function (resolve, reject) {
      signaling.connect(token).then(function (id) {
        myId = id;
        state = ConnectionState.CONNECTED;
        resolve(myId);
      }, function (errCode) {
        reject(new ErrorModule.P2PError(ErrorModule.getErrorByCode(errCode)));
      });
    });
  };

  /**
   * @function disconnect
   * @instance
   * @desc Disconnect from the signaling channel. It stops all existing sessions with remote endpoints.
   * @memberof Ics.P2P.P2PClient
   * @returns {Promise<undefined, Error>}
   */
  this.disconnect = function () {
    if (state == ConnectionState.READY) {
      return;
    }
    channels.forEach(function (channel) {
      channel.stop();
    });
    channels.clear();
    signaling.disconnect();
  };

  /**
   * @function publish
   * @instance
   * @desc Publish a stream to a remote endpoint.
   * @memberof Ics.P2P.P2PClient
   * @param {string} remoteId Remote endpoint's ID.
   * @param {LocalStream} stream A LocalStream to be published.
   * @returns {Promise<Publication, Error>} A promised resolved when remote side received the certain stream. However, remote endpoint may not display this stream, or ignore it.
   */
  this.publish = function (remoteId, stream) {
    if (state !== ConnectionState.CONNECTED) {
      return Promise.reject(new ErrorModule.P2PError(ErrorModule.errors.P2P_CLIENT_INVALID_STATE, 'P2P Client is not connected to signaling channel.'));
    }
    if (this.allowedRemoteIds.indexOf(remoteId) < 0) {
      return Promise.reject(new ErrorModule.P2PError(ErrorModule.errors.P2P_CLIENT_NOT_ALLOWED));
    }
    return getOrCreateChannel(remoteId).publish(stream);
  };

  /**
   * @function send
   * @instance
   * @desc Send a message to remote endpoint.
   * @memberof Ics.P2P.P2PClient
   * @param {string} remoteId Remote endpoint's ID.
   * @param {string} message Message to be sent. It should be a string.
   * @returns {Promise<undefined, Error>} It returns a promise resolved when remote endpoint received certain message.
   */
  this.send = function (remoteId, message) {
    if (state !== ConnectionState.CONNECTED) {
      return Promise.reject(new ErrorModule.P2PError(ErrorModule.errors.P2P_CLIENT_INVALID_STATE, 'P2P Client is not connected to signaling channel.'));
    }
    if (this.allowedRemoteIds.indexOf(remoteId) < 0) {
      return Promise.reject(new ErrorModule.P2PError(ErrorModule.errors.P2P_CLIENT_NOT_ALLOWED));
    }
    return getOrCreateChannel(remoteId).send(message);
  };

  /**
   * @function stop
   * @instance
   * @desc Clean all resources associated with given remote endpoint. It may include RTCPeerConnection, RTCRtpTransceiver and RTCDataChannel. It still possible to publish a stream, or send a message to given remote endpoint after stop.
   * @memberof Ics.P2P.P2PClient
   * @param {string} remoteId Remote endpoint's ID.
   * @returns {undefined}
   */
  this.stop = function (remoteId) {
    if (!channels.has(remoteId)) {
      _logger2.default.warning('No PeerConnection between current endpoint and specific remote endpoint.');
      return;
    }
    channels.get(remoteId).stop();
    channels.delete(remoteId);
  };

  /**
   * @function getStats
   * @instance
   * @desc Get stats of underlying PeerConnection.
   * @memberof Ics.P2P.P2PClient
   * @param {string} remoteId Remote endpoint's ID.
   * @returns {Promise<RTCStatsReport, Error>} It returns a promise resolved with an RTCStatsReport or reject with an Error if there is no connection with specific user.
   */
  this.getStats = function (remoteId) {
    if (!channels.has(remoteId)) {
      return Promise.reject(new ErrorModule.P2PError(ErrorModule.errors.P2P_CLIENT_INVALID_STATE, 'No PeerConnection between current endpoint and specific remote endpoint.'));
    }
    return channels.get(remoteId).getStats();
  };

  var sendSignalingMessage = function sendSignalingMessage(remoteId, type, message) {
    var msg = {
      type: type
    };
    if (message) {
      msg.data = message;
    }
    return signaling.send(remoteId, JSON.stringify(msg)).catch(function (e) {
      if (typeof e === 'number') {
        throw ErrorModule.getErrorByCode(e);
      }
    });
  };

  var getOrCreateChannel = function getOrCreateChannel(remoteId) {
    if (!channels.has(remoteId)) {
      // Construct an signaling sender/receiver for P2PPeerConnection.
      var signalingForChannel = Object.create(_event.EventDispatcher);
      signalingForChannel.sendSignalingMessage = sendSignalingMessage;
      var pcc = new _peerconnectionChannel2.default(config, myId, remoteId, signalingForChannel);
      pcc.addEventListener('streamadded', function (streamEvent) {
        self.dispatchEvent(streamEvent);
      });
      pcc.addEventListener('messagereceived', function (messageEvent) {
        self.dispatchEvent(messageEvent);
      });
      pcc.addEventListener('ended', function () {
        channels.delete(remoteId);
      });
      channels.set(remoteId, pcc);
    }
    return channels.get(remoteId);
  };
};

exports.default = P2PClient;

},{"../base/event.js":3,"../base/logger.js":5,"../base/stream.js":10,"../base/utils.js":11,"./error.js":23,"./peerconnection-channel.js":26}],26:[function(require,module,exports){
// Copyright © 2017 Intel Corporation. All Rights Reserved.
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.P2PPeerConnectionChannelEvent = undefined;

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _logger = require('../base/logger.js');

var _logger2 = _interopRequireDefault(_logger);

var _event2 = require('../base/event.js');

var _publication = require('../base/publication.js');

var _utils = require('../base/utils.js');

var Utils = _interopRequireWildcard(_utils);

var _error2 = require('./error.js');

var ErrorModule = _interopRequireWildcard(_error2);

var _stream = require('../base/stream.js');

var StreamModule = _interopRequireWildcard(_stream);

var _sdputils = require('../base/sdputils.js');

var SdpUtils = _interopRequireWildcard(_sdputils);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/*
  Event for Stream.
*/
var P2PPeerConnectionChannelEvent = exports.P2PPeerConnectionChannelEvent = function (_Event) {
  _inherits(P2PPeerConnectionChannelEvent, _Event);

  function P2PPeerConnectionChannelEvent(init) {
    _classCallCheck(this, P2PPeerConnectionChannelEvent);

    var _this = _possibleConstructorReturn(this, (P2PPeerConnectionChannelEvent.__proto__ || Object.getPrototypeOf(P2PPeerConnectionChannelEvent)).call(this, init));

    _this.stream = init.stream;
    return _this;
  }

  return P2PPeerConnectionChannelEvent;
}(Event);

var DataChannelLabel = {
  MESSAGE: 'message',
  FILE: 'file'
};

var SignalingType = {
  DENIED: 'chat-denied',
  CLOSED: 'chat-closed',
  NEGOTIATION_NEEDED: 'chat-negotiation-needed',
  TRACK_SOURCES: 'chat-track-sources',
  STREAM_INFO: 'chat-stream-info',
  SDP: 'chat-signal',
  TRACKS_ADDED: 'chat-tracks-added',
  TRACKS_REMOVED: 'chat-tracks-removed',
  DATA_RECEIVED: 'chat-data-received',
  UA: 'chat-ua'
};

var offerOptions = {
  'offerToReceiveAudio': true,
  'offerToReceiveVideo': true
};

var sysInfo = Utils.sysInfo();

var P2PPeerConnectionChannel = function (_EventDispatcher) {
  _inherits(P2PPeerConnectionChannel, _EventDispatcher);

  // |signaling| is an object has a method |sendSignalingMessage|.
  function P2PPeerConnectionChannel(config, localId, remoteId, signaling) {
    _classCallCheck(this, P2PPeerConnectionChannel);

    var _this2 = _possibleConstructorReturn(this, (P2PPeerConnectionChannel.__proto__ || Object.getPrototypeOf(P2PPeerConnectionChannel)).call(this));

    _this2._config = config;
    _this2._localId = localId;
    _this2._remoteId = remoteId;
    _this2._signaling = signaling;
    _this2._pc = null;
    _this2._publishedStreams = new Map(); // Key is streams published, value is its publication.
    _this2._pendingStreams = []; // Streams going to be added to PeerConnection.
    _this2._publishingStreams = []; // Streams have been added to PeerConnection, but does not receive ack from remote side.
    _this2._pendingUnpublishStreams = []; // Streams going to be removed.
    _this2._remoteStreams = [];
    _this2._remoteTrackSourceInfo = new Map(); // Key is MediaStreamTrack's ID, value is source info.
    _this2._remoteStreamSourceInfo = new Map(); // Key is MediaStream's ID, value is source info. Only used in Safari.
    _this2._remoteStreamAttributes = new Map(); // Key is MediaStream's ID, value is its attributes.
    _this2._remoteStreamOriginalTrackIds = new Map(); // Key is MediaStream's ID, value is its track ID list. This member is used when some browsers implemented the latest WebRTC spec that MID in SDP does not equal to track ID.
    _this2._publishPromises = new Map(); // Key is MediaStream's ID, value is an object has |resolve| and |reject|.
    _this2._unpublishPromises = new Map(); // Key is MediaStream's ID, value is an object has |resolve| and |reject|.
    _this2._publishingStreamTracks = new Map(); // Key is MediaStream's ID, value is an array of the ID of its MediaStreamTracks that haven't been acked.
    _this2._publishedStreamTracks = new Map(); // Key is MediaStream's ID, value is an array of the ID of its MediaStreamTracks that haven't been removed.
    _this2._remoteStreamTracks = new Map(); // Key is MediaStream's ID, value is an array of the ID of its MediaStreamTracks.
    _this2._isNegotiationNeeded = false;
    _this2._negotiating = false;
    _this2._remoteSideSupportsRemoveStream = true;
    _this2._remoteSideSupportsPlanB = true;
    _this2._remoteSideSupportsUnifiedPlan = true;
    _this2._remoteIceCandidates = [];
    _this2._dataChannels = new Map(); // Key is data channel's label, value is a RTCDataChannel.
    _this2._pendingMessages = [];
    _this2._dataSeq = 1; // Sequence number for data channel messages.
    _this2._sendDataPromises = new Map(); // Key is data sequence number, value is an object has |resolve| and |reject|.
    _this2._addedTrackIds = []; // Tracks that have been added after receiving remote SDP but before connection is established. Draining these messages when ICE connection state is connected.
    _this2._isCaller = true;
    _this2._infoSent = false;
    _this2._createPeerConnection();
    return _this2;
  }

  _createClass(P2PPeerConnectionChannel, [{
    key: 'publish',
    value: function publish(stream) {
      var _this3 = this;

      if (!(stream instanceof StreamModule.LocalStream)) {
        return Promise.reject(new TypeError('Invalid stream.'));
      }
      if (this._publishedStreams.has(stream)) {
        return Promise.reject(new ErrorModule.P2PError(ErrorModule.errors.P2P_CLIENT_ILLEGAL_ARGUMENT, 'Duplicated stream.'));
      }
      if (this._areAllTracksEnded(stream.mediaStream)) {
        return Promise.reject(new ErrorModule.P2PError(ErrorModule.errors.P2P_CLIENT_INVALID_STATE, 'All tracks are ended.'));
      }
      return Promise.all([this._sendClosedMsgIfNecessary(), this._sendSysInfoIfNecessary(), this._sendStreamInfo(stream)]).then(function () {
        return new Promise(function (resolve, reject) {
          // Replace |addStream| with PeerConnection.addTrack when all browsers are ready.
          _this3._pc.addStream(stream.mediaStream);
          _this3._publishingStreams.push(stream);
          var trackIds = Array.from(stream.mediaStream.getTracks(), function (track) {
            return track.id;
          });
          _this3._publishingStreamTracks.set(stream.mediaStream.id, trackIds);
          _this3._publishPromises.set(stream.mediaStream.id, {
            resolve: resolve,
            reject: reject
          });
          if (!_this3._dataChannels.has(DataChannelLabel.MESSAGE)) {
            _this3._createDataChannel(DataChannelLabel.MESSAGE);
          }
        });
      });
    }
  }, {
    key: 'send',
    value: function send(message) {
      var _this4 = this;

      if (!(typeof message === 'string')) {
        return Promise.reject(new TypeError('Invalid message.'));
      }
      var data = {
        id: this._dataSeq++,
        data: message
      };
      var promise = new Promise(function (resolve, reject) {
        _this4._sendDataPromises.set(data.id, {
          resolve: resolve,
          reject: reject
        });
      });
      if (!this._dataChannels.has(DataChannelLabel.MESSAGE)) {
        this._createDataChannel(DataChannelLabel.MESSAGE);
      }

      this._sendSysInfoIfNecessary().catch(function (err) {
        _logger2.default.debug('Failed to send sysInfo.' + err.message);
      });

      var dc = this._dataChannels.get(DataChannelLabel.MESSAGE);
      if (dc.readyState === 'open') {
        this._dataChannels.get(DataChannelLabel.MESSAGE).send(JSON.stringify(data));
      } else {
        this._pendingMessages.push(data);
      }
      return promise;
    }
  }, {
    key: 'stop',
    value: function stop() {
      this._stop(undefined, true);
    }
  }, {
    key: 'getStats',
    value: function getStats(mediaStream) {
      var _this5 = this;

      if (this._pc) {
        if (mediaStream === undefined) {
          return this._pc.getStats();
        } else {
          var tracksStatsReports = [];
          return Promise.all([mediaStream.getTracks().forEach(function (track) {
            _this5._getStats(track, tracksStatsReports);
          })]).then(function () {
            return new Promise(function (resolve, reject) {
              resolve(tracksStatsReports);
            });
          });
        }
      } else {
        return Promise.reject(new ErrorModule.P2PError(ErrorModule.errors.P2P_CLIENT_INVALID_STATE));
      }
    }
  }, {
    key: '_getStats',
    value: function _getStats(mediaStreamTrack, reportsResult) {
      return this._pc.getStats(mediaStreamTrack).then(function (statsReport) {
        reportsResult.push(statsReport);
      });
    }

    // This method is called by P2PClient when there is new signaling message arrived.

  }, {
    key: 'onMessage',
    value: function onMessage(message) {
      this._SignalingMesssageHandler(message);
    }
  }, {
    key: '_sendSdp',
    value: function _sendSdp(sdp) {
      return this._signaling.sendSignalingMessage(this._remoteId, SignalingType.SDP, sdp);
    }
  }, {
    key: '_sendSignalingMessage',
    value: function _sendSignalingMessage(type, message) {
      return this._signaling.sendSignalingMessage(this._remoteId, type, message);
    }
  }, {
    key: '_SignalingMesssageHandler',
    value: function _SignalingMesssageHandler(message) {
      _logger2.default.debug('Channel received message: ' + message);
      switch (message.type) {
        case SignalingType.DENIED:
          this._chatDeniedHandler();
          break;
        case SignalingType.UA:
          this._handleRemoteCapability(message.data);
          this._sendSysInfoIfNecessary();
          break;
        case SignalingType.TRACK_SOURCES:
          this._trackSourcesHandler(message.data);
          break;
        case SignalingType.STREAM_INFO:
          this._streamInfoHandler(message.data);
          break;
        case SignalingType.SDP:
          this._sdpHandler(message.data);
          break;
        case SignalingType.TRACKS_ADDED:
          this._tracksAddedHandler(message.data);
          break;
        case SignalingType.TRACKS_REMOVED:
          this._tracksRemovedHandler(message.data);
          break;
        case SignalingType.DATA_RECEIVED:
          this._dataReceivedHandler(message.data);
          break;
        case SignalingType.CLOSED:
          this._chatClosedHandler();
          break;
        case SignalingType.NEGOTIATION_NEEDED:
          this._doNegotiate();
          break;
        default:
          _logger2.default.error('Invalid signaling message received. Type: ' + message.type);
      }
    }
  }, {
    key: '_tracksAddedHandler',
    value: function _tracksAddedHandler(ids) {
      var _this6 = this;

      var _loop = function _loop(id) {
        // It could be a problem if there is a track published with different MediaStreams.
        _this6._publishingStreamTracks.forEach(function (mediaTrackIds, mediaStreamId) {
          for (var i = 0; i < mediaTrackIds.length; i++) {
            if (mediaTrackIds[i] === id) {
              // Move this track from publishing tracks to published tracks.
              if (!_this6._publishedStreamTracks.has(mediaStreamId)) {
                _this6._publishedStreamTracks.set(mediaStreamId, []);
              }
              _this6._publishedStreamTracks.get(mediaStreamId).push(mediaTrackIds[i]);
              mediaTrackIds.splice(i, 1);
            }
            // Resolving certain publish promise when remote endpoint received all tracks of a MediaStream.
            if (mediaTrackIds.length == 0) {
              var _ret2 = function () {
                if (!_this6._publishPromises.has(mediaStreamId)) {
                  _logger2.default.warning('Cannot find the promise for publishing ' + mediaStreamId);
                  return 'continue';
                }
                var targetStreamIndex = _this6._publishingStreams.findIndex(function (element) {
                  return element.mediaStream.id == mediaStreamId;
                });
                var targetStream = _this6._publishingStreams[targetStreamIndex];
                _this6._publishingStreams.splice(targetStreamIndex, 1);
                var publication = new _publication.Publication(id, function () {
                  _this6._unpublish(targetStream).then(function () {
                    publication.dispatchEvent(new _event2.IcsEvent('ended'));
                  }, function (err) {
                    // Use debug mode because this error usually doesn't block stopping a publication.
                    _logger2.default.debug('Something wrong happened during stopping a publication. ' + err.message);
                  });
                }, function () {
                  if (!targetStream || !targetStream.mediaStream) {
                    return Promise.reject(new ErrorModule.P2PError(ErrorModule.errors.P2P_CLIENT_INVALID_STATE, 'Publication is not available.'));
                  }
                  return _this6.getStats(targetStream.mediaStream);
                });
                _this6._publishedStreams.set(targetStream, publication);
                _this6._publishPromises.get(mediaStreamId).resolve(publication);
                _this6._publishPromises.delete(mediaStreamId);
              }();

              if (_ret2 === 'continue') continue;
            }
          }
        });
      };

      // Currently, |ids| contains all track IDs of a MediaStream. Following algorithm also handles |ids| is a part of a MediaStream's tracks.
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = ids[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var id = _step.value;

          _loop(id);
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator.return) {
            _iterator.return();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }
    }
  }, {
    key: '_tracksRemovedHandler',
    value: function _tracksRemovedHandler(ids) {
      var _this7 = this;

      var _loop2 = function _loop2(id) {
        // It could be a problem if there is a track published with different MediaStreams.
        _this7._publishedStreamTracks.forEach(function (mediaTrackIds, mediaStreamId) {
          for (var i = 0; i < mediaTrackIds.length; i++) {
            if (mediaTrackIds[i] === id) {
              mediaTrackIds.splice(i, 1);
            }
          }
        });
      };

      // Currently, |ids| contains all track IDs of a MediaStream. Following algorithm also handles |ids| is a part of a MediaStream's tracks.
      var _iteratorNormalCompletion2 = true;
      var _didIteratorError2 = false;
      var _iteratorError2 = undefined;

      try {
        for (var _iterator2 = ids[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
          var id = _step2.value;

          _loop2(id);
        }
      } catch (err) {
        _didIteratorError2 = true;
        _iteratorError2 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion2 && _iterator2.return) {
            _iterator2.return();
          }
        } finally {
          if (_didIteratorError2) {
            throw _iteratorError2;
          }
        }
      }
    }
  }, {
    key: '_dataReceivedHandler',
    value: function _dataReceivedHandler(id) {
      if (!this._sendDataPromises.has(id)) {
        _logger2.default.warning('Received unknown data received message. ID: ' + id);
        return;
      } else {
        this._sendDataPromises.get(id).resolve();
      }
    }
  }, {
    key: '_sdpHandler',
    value: function _sdpHandler(sdp) {
      if (sdp.type === 'offer') {
        this._onOffer(sdp);
      } else if (sdp.type === 'answer') {
        this._onAnswer(sdp);
      } else if (sdp.type === 'candidates') {
        this._onRemoteIceCandidate(sdp);
      }
    }
  }, {
    key: '_trackSourcesHandler',
    value: function _trackSourcesHandler(data) {
      var _iteratorNormalCompletion3 = true;
      var _didIteratorError3 = false;
      var _iteratorError3 = undefined;

      try {
        for (var _iterator3 = data[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
          var info = _step3.value;

          this._remoteTrackSourceInfo.set(info.id, info.source);
        }
      } catch (err) {
        _didIteratorError3 = true;
        _iteratorError3 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion3 && _iterator3.return) {
            _iterator3.return();
          }
        } finally {
          if (_didIteratorError3) {
            throw _iteratorError3;
          }
        }
      }
    }
  }, {
    key: '_streamInfoHandler',
    value: function _streamInfoHandler(data) {
      if (!data) {
        _logger2.default.warning('Unexpected stream info.');
        return;
      }
      this._remoteStreamSourceInfo.set(data.id, data.source);
      this._remoteStreamAttributes.set(data.id, data.attributes);
      this._remoteStreamOriginalTrackIds.set(data.id, data.tracks);
    }
  }, {
    key: '_chatClosedHandler',
    value: function _chatClosedHandler(data) {
      this._stop(data, false);
    }
  }, {
    key: '_chatDeniedHandler',
    value: function _chatDeniedHandler() {
      this._stop();
    }
  }, {
    key: '_onOffer',
    value: function _onOffer(sdp) {
      var _this8 = this;

      _logger2.default.debug('About to set remote description. Signaling state: ' + this._pc.signalingState);
      sdp.sdp = this._setRtpSenderOptions(sdp.sdp, this._config);
      var sessionDescription = new RTCSessionDescription(sdp);
      this._pc.setRemoteDescription(sessionDescription).then(function () {
        _this8._createAndSendAnswer();
      }, function (error) {
        _logger2.default.debug('Set remote description failed. Message: ' + error.message);
        _this8._stop(error, true);
      });
    }
  }, {
    key: '_onAnswer',
    value: function _onAnswer(sdp) {
      var _this9 = this;

      _logger2.default.debug('About to set remote description. Signaling state: ' + this._pc.signalingState);
      sdp.sdp = this._setRtpSenderOptions(sdp.sdp, this._config);
      var sessionDescription = new RTCSessionDescription(sdp);
      this._pc.setRemoteDescription(new RTCSessionDescription(sessionDescription)).then(function () {
        _logger2.default.debug('Set remote descripiton successfully.');
        _this9._drainPendingMessages();
      }, function (error) {
        _logger2.default.debug('Set remote description failed. Message: ' + error.message);
        _this9._stop(error, true);
      });
    }
  }, {
    key: '_onLocalIceCandidate',
    value: function _onLocalIceCandidate(event) {
      if (event.candidate) {
        this._sendSdp({
          type: 'candidates',
          candidate: event.candidate.candidate,
          sdpMid: event.candidate.sdpMid,
          sdpMLineIndex: event.candidate.sdpMLineIndex
        }).catch(function (e) {
          _logger2.default.warning('Failed to send candidate.');
        });
      } else {
        _logger2.default.debug('Empty candidate.');
      }
    }
  }, {
    key: '_onRemoteTrackAdded',
    value: function _onRemoteTrackAdded(event) {
      _logger2.default.debug('Remote track added.');
    }
  }, {
    key: '_onRemoteStreamAdded',
    value: function _onRemoteStreamAdded(event) {
      var _this10 = this;

      _logger2.default.debug('Remote stream added.');
      this._remoteStreamTracks.set(event.stream.id, []);
      // Ack track added when onaddstream/onaddtrack is fired for a specific track. It's better to check the state of PeerConnection before acknowledge since media data will not flow if ICE fails.
      var tracksInfo = [];
      event.stream.getTracks().forEach(function (track) {
        tracksInfo.push(track.id);
        _this10._remoteStreamTracks.get(event.stream.id).push(track.id);
      });
      tracksInfo = tracksInfo.concat(this._remoteStreamOriginalTrackIds.get(event.stream.id));
      if (this._pc.iceConnectionState === 'connected' || this._pc.iceConnectionState === 'completed') {
        this._sendSignalingMessage(SignalingType.TRACKS_ADDED, tracksInfo);
      } else {
        this._addedTrackIds = this._addedTrackIds.concat(tracksInfo);
      }
      var audioTrackSource = void 0,
          videoTrackSource = void 0;
      // Safari and Firefox generates new ID for remote tracks.
      if (Utils.isSafari() || Utils.isFirefox()) {
        if (!this._remoteStreamSourceInfo.has(event.stream.id)) {
          _logger2.default.warning('Cannot find source info for stream ' + event.stream.id);
        }
        audioTrackSource = this._remoteStreamSourceInfo.get(event.stream.id).audio;
        videoTrackSource = this._remoteStreamSourceInfo.get(event.stream.id).video;
        this._remoteStreamSourceInfo.delete(event.stream.id);
      } else {
        audioTrackSource = this._getAndDeleteTrackSourceInfo(event.stream.getAudioTracks());
        videoTrackSource = this._getAndDeleteTrackSourceInfo(event.stream.getVideoTracks());
      }
      var sourceInfo = new StreamModule.StreamSourceInfo(audioTrackSource, videoTrackSource);
      if (Utils.isSafari()) {
        if (!sourceInfo.audio) {
          event.stream.getAudioTracks().forEach(function (track) {
            event.stream.removeTrack(track);
          });
        }
        if (!sourceInfo.video) {
          event.stream.getVideoTracks().forEach(function (track) {
            event.stream.removeTrack(track);
          });
        }
      }
      var attributes = this._remoteStreamAttributes.get(event.stream.id);
      var stream = new StreamModule.RemoteStream(undefined, this._remoteId, event.stream, sourceInfo, attributes);
      if (stream) {
        this._remoteStreams.push(stream);
        var streamEvent = new StreamModule.StreamEvent('streamadded', {
          stream: stream
        });
        this.dispatchEvent(streamEvent);
      }
    }
  }, {
    key: '_onRemoteStreamRemoved',
    value: function _onRemoteStreamRemoved(event) {
      _logger2.default.debug('Remote stream removed.');
      if (!this._remoteStreamTracks.has(event.stream.id)) {
        _logger2.default.warning('Cannot find stream info when it is being removed.');
        return;
      }
      var trackIds = [];
      this._remoteStreamTracks.get(event.stream.id).forEach(function (trackId) {
        trackIds.push(trackId);
      });
      this._sendSignalingMessage(SignalingType.TRACKS_REMOVED, trackIds);
      this._remoteStreamTracks.delete(event.stream.id);
      var i = this._remoteStreams.findIndex(function (s) {
        return s.mediaStream.id === event.stream.id;
      });
      if (i !== -1) {
        var stream = this._remoteStreams[i];
        var _event = new _event2.IcsEvent('ended');
        stream.dispatchEvent(_event);
        this._remoteStreams.splice(i, 1);
      }
    }
  }, {
    key: '_onNegotiationneeded',
    value: function _onNegotiationneeded() {
      _logger2.default.debug('On negotiation needed.');

      if (this._pc.signalingState === 'stable' && this._negotiating === false) {
        this._negotiating = true;
        this._doNegotiate();
        this._isNegotiationNeeded = false;
      } else {
        this._isNegotiationNeeded = true;
      }
    }
  }, {
    key: '_onRemoteIceCandidate',
    value: function _onRemoteIceCandidate(candidateInfo) {
      var candidate = new RTCIceCandidate({
        candidate: candidateInfo.candidate,
        sdpMid: candidateInfo.sdpMid,
        sdpMLineIndex: candidateInfo.sdpMLineIndex
      });
      if (this._pc.remoteDescription && this._pc.remoteDescription.sdp !== "") {
        _logger2.default.debug('Add remote ice candidates.');
        this._pc.addIceCandidate(candidate).catch(function (error) {
          _logger2.default.warning('Error processing ICE candidate: ' + error);
        });
      } else {
        _logger2.default.debug('Cache remote ice candidates.');
        this._remoteIceCandidates.push(candidate);
      }
    }
  }, {
    key: '_onSignalingStateChange',
    value: function _onSignalingStateChange(event) {
      _logger2.default.debug('Signaling state changed: ' + this._pc.signalingState);
      if (this._pc.signalingState === 'closed') {
        //stopChatLocally(peer, peer.id);
      } else if (this._pc.signalingState === 'stable') {
        this._negotiating = false;
        if (this._isNegotiationNeeded) {
          this._onNegotiationneeded();
        } else {
          this._drainPendingStreams();
          this._drainPendingMessages();
        }
      } else if (this._pc.signalingState === 'have-remote-offer') {
        this._drainPendingRemoteIceCandidates();
      }
    }
  }, {
    key: '_onIceConnectionStateChange',
    value: function _onIceConnectionStateChange(event) {
      if (event.currentTarget.iceConnectionState === 'closed' || event.currentTarget.iceConnectionState === 'failed') {
        var _error = new ErrorModule.P2PError(ErrorModule.errors.P2P_WEBRTC_UNKNOWN, 'ICE connection failed or closed.');
        this._stop(_error, true);
      } else if (event.currentTarget.iceConnectionState === 'connected' || event.currentTarget.iceConnectionState === 'completed') {
        this._sendSignalingMessage(SignalingType.TRACKS_ADDED, this._addedTrackIds);
        this._addedTrackIds = [];
      }
    }
  }, {
    key: '_onDataChannelMessage',
    value: function _onDataChannelMessage(event) {
      var message = JSON.parse(event.data);
      _logger2.default.debug('Data channel message received: ' + message.data);
      this._sendSignalingMessage(SignalingType.DATA_RECEIVED, message.id);
      var messageEvent = new _event2.MessageEvent('messagereceived', {
        message: message.data,
        origin: this._remoteId
      });
      this.dispatchEvent(messageEvent);
    }
  }, {
    key: '_onDataChannelOpen',
    value: function _onDataChannelOpen(event) {
      _logger2.default.debug("Data Channel is opened.");
      if (event.target.label === DataChannelLabel.MESSAGE) {
        _logger2.default.debug('Data channel for messages is opened.');
        this._drainPendingMessages();
      }
    }
  }, {
    key: '_onDataChannelClose',
    value: function _onDataChannelClose(event) {
      _logger2.default.debug('Data Channel is closed.');
    }
  }, {
    key: '_createPeerConnection',
    value: function _createPeerConnection() {
      var _this11 = this;

      this._pc = new RTCPeerConnection(this._config.rtcConfiguration);
      // Firefox 59 implemented addTransceiver. However, mid in SDP will differ from track's ID in this case. And transceiver's mid is null.
      if (typeof this._pc.addTransceiver === 'function' && Utils.isSafari()) {
        this._pc.addTransceiver('audio');
        this._pc.addTransceiver('video');
      }
      this._pc.onaddstream = function (event) {
        _this11._onRemoteStreamAdded.apply(_this11, [event]);
      };
      this._pc.ontrack = function (event) {
        _this11._onRemoteTrackAdded.apply(_this11, [event]);
      };
      this._pc.onremovestream = function (event) {
        _this11._onRemoteStreamRemoved.apply(_this11, [event]);
      };
      this._pc.onnegotiationneeded = function (event) {
        _this11._onNegotiationneeded.apply(_this11, [event]);
      };
      this._pc.onicecandidate = function (event) {
        _this11._onLocalIceCandidate.apply(_this11, [event]);
      };
      this._pc.onsignalingstatechange = function (event) {
        _this11._onSignalingStateChange.apply(_this11, [event]);
      };
      this._pc.ondatachannel = function (event) {
        _logger2.default.debug('On data channel.');
        // Save remote created data channel.
        if (!_this11._dataChannels.has(event.channel.label)) {
          _this11._dataChannels.set(event.channel.label, event.channel);
          _logger2.default.debug('Save remote created data channel.');
        }
        _this11._bindEventsToDataChannel(event.channel);
      };
      this._pc.oniceconnectionstatechange = function (event) {
        _this11._onIceConnectionStateChange.apply(_this11, [event]);
      };
      /*
      this._pc.oniceChannelStatechange = function(event) {
        _onIceChannelStateChange(peer, event);
      };
       = function() {
        onNegotiationneeded(peers[peer.id]);
      };
       //DataChannel
      this._pc.ondatachannel = function(event) {
        Logger.debug(myId + ': On data channel');
        // Save remote created data channel.
        if (!peer.dataChannels[event.channel.label]) {
          peer.dataChannels[event.channel.label] = event.channel;
          Logger.debug('Save remote created data channel.');
        }
        bindEventsToDataChannel(event.channel, peer);
      };*/
    }
  }, {
    key: '_drainPendingStreams',
    value: function _drainPendingStreams() {
      _logger2.default.debug('Draining pending streams.');
      if (this._pc && this._pc.signalingState === 'stable') {
        _logger2.default.debug('Peer connection is ready for draining pending streams.');
        for (var i = 0; i < this._pendingStreams.length; i++) {
          var stream = this._pendingStreams[i];
          // OnNegotiationNeeded event will be triggered immediately after adding stream to PeerConnection in Firefox.
          // And OnNegotiationNeeded handler will execute drainPendingStreams. To avoid add the same stream multiple times,
          // shift it from pending stream list before adding it to PeerConnection.
          this._pendingStreams.shift();
          if (!stream.mediaStream) {
            continue;
          }
          this._pc.addStream(stream.mediaStream);
          _logger2.default.debug('Added stream to peer connection.');
          this._publishingStreams.push(stream);
        }
        this._pendingStreams.length = 0;
        for (var j = 0; j < this._pendingUnpublishStreams.length; j++) {
          if (!this._pendingUnpublishStreams[j].mediaStream) {
            continue;
          }
          this._pc.removeStream(this._pendingUnpublishStreams[j].mediaStream);
          this._publishedStreams.delete(this._pendingUnpublishStreams[j]);
          _logger2.default.debug('Remove stream.');
        }
        this._pendingUnpublishStreams.length = 0;
      }
    }
  }, {
    key: '_drainPendingRemoteIceCandidates',
    value: function _drainPendingRemoteIceCandidates() {
      for (var i = 0; i < this._remoteIceCandidates.length; i++) {
        _logger2.default.debug('Add candidate');
        this._pc.addIceCandidate(this._remoteIceCandidates[i]).catch(function (error) {
          _logger2.default.warning('Error processing ICE candidate: ' + error);
        });
      }
      this._remoteIceCandidates.length = 0;
    }
  }, {
    key: '_drainPendingMessages',
    value: function _drainPendingMessages() {
      _logger2.default.debug('Draining pending messages.');
      if (this._pendingMessages.length == 0) {
        return;
      }
      var dc = this._dataChannels.get(DataChannelLabel.MESSAGE);
      if (dc && dc.readyState === 'open') {
        for (var i = 0; i < this._pendingMessages.length; i++) {
          _logger2.default.debug('Sending message via data channel: ' + this._pendingMessages[i]);
          dc.send(JSON.stringify(this._pendingMessages[i]));
        }
        this._pendingMessages.length = 0;
      } else if (this._pc && !dc) {
        this._createDataChannel(DataChannelLabel.MESSAGE);
      }
    }
  }, {
    key: '_sendStreamInfo',
    value: function _sendStreamInfo(stream) {
      if (!stream || !stream.mediaStream) {
        return new ErrorModule.P2PError(ErrorModule.errors.P2P_CLIENT_ILLEGAL_ARGUMENT);
      }
      var info = [];
      stream.mediaStream.getTracks().map(function (track) {
        info.push({
          id: track.id,
          source: stream.source[track.kind]
        });
      });
      return Promise.all([this._sendSignalingMessage(SignalingType.TRACK_SOURCES, info), this._sendSignalingMessage(SignalingType.STREAM_INFO, {
        id: stream.mediaStream.id,
        attributes: stream.attributes,
        // Track IDs may be useful in the future when onaddstream is removed. It maintains the relationship of tracks and streams.
        tracks: Array.from(info, function (item) {
          return item.id;
        }),
        // This is a workaround for Safari. Please use track-sources if possible.
        source: stream.source
      })]);
    }
  }, {
    key: '_sendSysInfoIfNecessary',
    value: function _sendSysInfoIfNecessary() {
      if (this._infoSent) {
        return Promise.resolve();
      }
      this._infoSent = true;
      return this._sendSignalingMessage(SignalingType.UA, sysInfo);
    }
  }, {
    key: '_sendClosedMsgIfNecessary',
    value: function _sendClosedMsgIfNecessary() {
      if (this._pc.remoteDescription === null || this._pc.remoteDescription.sdp === "") {
        return this._sendSignalingMessage(SignalingType.CLOSED);
      }
      return Promise.resolve();
    }
  }, {
    key: '_handleRemoteCapability',
    value: function _handleRemoteCapability(ua) {
      if (ua.sdk && ua.sdk && ua.sdk.type === "JavaScript" && ua.runtime && ua.runtime.name === "Firefox") {
        this._remoteSideSupportsRemoveStream = false;
        this._remoteSideSupportsPlanB = false;
        this._remoteSideSupportsUnifiedPlan = true;
      } else {
        // Remote side is iOS/Android/C++ which uses Google's WebRTC stack.
        this._remoteSideSupportsRemoveStream = true;
        this._remoteSideSupportsPlanB = true;
        this._remoteSideSupportsUnifiedPlan = false;
      }
    }
  }, {
    key: '_doNegotiate',
    value: function _doNegotiate() {
      if (this._isCaller) {
        this._createAndSendOffer();
      } else {
        this._sendSignalingMessage(SignalingType.NEGOTIATION_NEEDED);
      }
    }
  }, {
    key: '_setCodecOrder',
    value: function _setCodecOrder(sdp) {
      if (this._config.audioEncodings) {
        var audioCodecNames = Array.from(this._config.audioEncodings, function (encodingParameters) {
          return encodingParameters.codec.name;
        });
        sdp = SdpUtils.reorderCodecs(sdp, 'audio', audioCodecNames);
      }
      if (this._config.videoEncodings) {
        var videoCodecNames = Array.from(this._config.videoEncodings, function (encodingParameters) {
          return encodingParameters.codec.name;
        });
        sdp = SdpUtils.reorderCodecs(sdp, 'video', videoCodecNames);
      }
      return sdp;
    }
  }, {
    key: '_setMaxBitrate',
    value: function _setMaxBitrate(sdp, options) {
      if (_typeof(options.audioEncodings) === 'object') {
        sdp = SdpUtils.setMaxBitrate(sdp, options.audioEncodings);
      }
      if (_typeof(options.videoEncodings) === 'object') {
        sdp = SdpUtils.setMaxBitrate(sdp, options.videoEncodings);
      }
      return sdp;
    }
  }, {
    key: '_setRtpSenderOptions',
    value: function _setRtpSenderOptions(sdp, options) {
      sdp = this._setMaxBitrate(sdp, options);
      return sdp;
    }
  }, {
    key: '_setRtpReceiverOptions',
    value: function _setRtpReceiverOptions(sdp) {
      sdp = this._setCodecOrder(sdp);
      return sdp;
    }
  }, {
    key: '_createAndSendOffer',
    value: function _createAndSendOffer() {
      var _this12 = this;

      if (!this._pc) {
        _logger2.default.error('Peer connection have not been created.');
        return;
      }
      this._isNegotiationNeeded = false;
      this._isCaller = true;
      var localDesc = void 0;
      this._pc.createOffer(offerOptions).then(function (desc) {
        desc.sdp = _this12._setRtpReceiverOptions(desc.sdp);
        localDesc = desc;
        return _this12._pc.setLocalDescription(desc);
      }).then(function () {
        return _this12._sendSdp(localDesc);
      }).catch(function (e) {
        _logger2.default.error(e.message + ' Please check your codec settings.');
        var error = new ErrorModule.P2PError(ErrorModule.errors.P2P_WEBRTC_SDP, e.message);
        _this12._stop(error, true);
      });
    }
  }, {
    key: '_createAndSendAnswer',
    value: function _createAndSendAnswer() {
      var _this13 = this;

      this._drainPendingStreams();
      this._isNegotiationNeeded = false;
      this._isCaller = false;
      var localDesc = void 0;
      this._pc.createAnswer().then(function (desc) {
        desc.sdp = _this13._setRtpReceiverOptions(desc.sdp);
        localDesc = desc;
        return _this13._pc.setLocalDescription(desc);
      }).then(function () {
        return _this13._sendSdp(localDesc);
      }).catch(function (e) {
        _logger2.default.error(e.message + ' Please check your codec settings.');
        var error = new ErrorModule.P2PError(ErrorModule.errors.P2P_WEBRTC_SDP, e.message);
        _this13._stop(error, true);
      });
    }
  }, {
    key: '_getAndDeleteTrackSourceInfo',
    value: function _getAndDeleteTrackSourceInfo(tracks) {
      if (tracks.length > 0) {
        var trackId = tracks[0].id;
        if (this._remoteTrackSourceInfo.has(trackId)) {
          var sourceInfo = this._remoteTrackSourceInfo.get(trackId);
          this._remoteTrackSourceInfo.delete(trackId);
          return sourceInfo;
        } else {
          _logger2.default.warning('Cannot find source info for ' + trackId);
        }
      }
    }
  }, {
    key: '_unpublish',
    value: function _unpublish(stream) {
      var _this14 = this;

      if (navigator.mozGetUserMedia || !this._remoteSideSupportsRemoveStream) {
        // Actually unpublish is supported. It is a little bit complex since Firefox implemented WebRTC spec while Chrome implemented an old API.
        _logger2.default.error('Stopping a publication is not supported on Firefox. Please use P2PClient.stop() to stop the connection with remote endpoint.');
        return Promise.reject(new ErrorModule.P2PError(ErrorModule.errors.P2P_CLIENT_UNSUPPORTED_METHOD));
      }
      if (!this._publishedStreams.has(stream)) {
        return Promise.reject(new ErrorModule.P2PError(ErrorModule.errors.P2P_CLIENT_ILLEGAL_ARGUMENT));
      }
      this._pendingUnpublishStreams.push(stream);
      return new Promise(function (resolve, reject) {
        _this14._unpublishPromises.set(stream.mediaStream.id, {
          resolve: resolve,
          reject: reject
        });
        _this14._drainPendingStreams();
      });
    }
  }, {
    key: '_createDataChannel',


    // Make sure |_pc| is available before calling this method.
    value: function _createDataChannel(label) {
      if (this._dataChannels.has(label)) {
        _logger2.default.warning('Data channel labeled ' + label + ' already exists.');
        return;
      }
      if (!this._pc) {
        _logger2.default.debug('PeerConnection is not available before creating DataChannel.');
        return;
      }
      _logger2.default.debug('Create data channel.');
      var dc = this._pc.createDataChannel(label);
      this._bindEventsToDataChannel(dc);
      this._dataChannels.set(DataChannelLabel.MESSAGE, dc);
    }
  }, {
    key: '_bindEventsToDataChannel',
    value: function _bindEventsToDataChannel(dc) {
      var _this15 = this;

      dc.onmessage = function (event) {
        _this15._onDataChannelMessage.apply(_this15, [event]);
      };
      dc.onopen = function (event) {
        _this15._onDataChannelOpen.apply(_this15, [event]);
      };
      dc.onclose = function (event) {
        _this15._onDataChannelClose.apply(_this15, [event]);
      };
      dc.onerror = function (event) {
        _logger2.default.debug("Data Channel Error:", error);
      };
    }
  }, {
    key: '_areAllTracksEnded',
    value: function _areAllTracksEnded(mediaStream) {
      var _iteratorNormalCompletion4 = true;
      var _didIteratorError4 = false;
      var _iteratorError4 = undefined;

      try {
        for (var _iterator4 = mediaStream.getTracks()[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
          var track = _step4.value;

          if (track.readyState === 'live') {
            return false;
          }
        }
      } catch (err) {
        _didIteratorError4 = true;
        _iteratorError4 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion4 && _iterator4.return) {
            _iterator4.return();
          }
        } finally {
          if (_didIteratorError4) {
            throw _iteratorError4;
          }
        }
      }

      return true;
    }
  }, {
    key: '_stop',
    value: function _stop(error, notifyRemote) {
      var promiseError = error;
      if (!promiseError) {
        promiseError = new ErrorModule.P2PError(ErrorModule.errors.P2P_CLIENT_UNKNOWN);
      }
      var _iteratorNormalCompletion5 = true;
      var _didIteratorError5 = false;
      var _iteratorError5 = undefined;

      try {
        for (var _iterator5 = this._dataChannels[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
          var _ref = _step5.value;

          var _ref2 = _slicedToArray(_ref, 2);

          var label = _ref2[0];
          var dc = _ref2[1];

          dc.close();
        }
      } catch (err) {
        _didIteratorError5 = true;
        _iteratorError5 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion5 && _iterator5.return) {
            _iterator5.return();
          }
        } finally {
          if (_didIteratorError5) {
            throw _iteratorError5;
          }
        }
      }

      this._dataChannels.clear();
      if (this._pc && this._pc.iceConnectionState !== 'closed') {
        this._pc.close();
      }
      var _iteratorNormalCompletion6 = true;
      var _didIteratorError6 = false;
      var _iteratorError6 = undefined;

      try {
        for (var _iterator6 = this._publishPromises[Symbol.iterator](), _step6; !(_iteratorNormalCompletion6 = (_step6 = _iterator6.next()).done); _iteratorNormalCompletion6 = true) {
          var _ref3 = _step6.value;

          var _ref4 = _slicedToArray(_ref3, 2);

          var id = _ref4[0];
          var promise = _ref4[1];

          promise.reject(promiseError);
        }
      } catch (err) {
        _didIteratorError6 = true;
        _iteratorError6 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion6 && _iterator6.return) {
            _iterator6.return();
          }
        } finally {
          if (_didIteratorError6) {
            throw _iteratorError6;
          }
        }
      }

      this._publishPromises.clear();
      var _iteratorNormalCompletion7 = true;
      var _didIteratorError7 = false;
      var _iteratorError7 = undefined;

      try {
        for (var _iterator7 = this._unpublishPromises[Symbol.iterator](), _step7; !(_iteratorNormalCompletion7 = (_step7 = _iterator7.next()).done); _iteratorNormalCompletion7 = true) {
          var _ref5 = _step7.value;

          var _ref6 = _slicedToArray(_ref5, 2);

          var _id = _ref6[0];
          var _promise = _ref6[1];

          _promise.reject(promiseError);
        }
      } catch (err) {
        _didIteratorError7 = true;
        _iteratorError7 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion7 && _iterator7.return) {
            _iterator7.return();
          }
        } finally {
          if (_didIteratorError7) {
            throw _iteratorError7;
          }
        }
      }

      this._unpublishPromises.clear();
      var _iteratorNormalCompletion8 = true;
      var _didIteratorError8 = false;
      var _iteratorError8 = undefined;

      try {
        for (var _iterator8 = this._sendDataPromises[Symbol.iterator](), _step8; !(_iteratorNormalCompletion8 = (_step8 = _iterator8.next()).done); _iteratorNormalCompletion8 = true) {
          var _ref7 = _step8.value;

          var _ref8 = _slicedToArray(_ref7, 2);

          var _id2 = _ref8[0];
          var _promise2 = _ref8[1];

          _promise2.reject(promiseError);
        }
      } catch (err) {
        _didIteratorError8 = true;
        _iteratorError8 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion8 && _iterator8.return) {
            _iterator8.return();
          }
        } finally {
          if (_didIteratorError8) {
            throw _iteratorError8;
          }
        }
      }

      this._sendDataPromises.clear();
      // Fire ended event if publication or remote stream exists.
      this._publishedStreams.forEach(function (publication) {
        publication.dispatchEvent(new _event2.IcsEvent('ended'));
      });
      this._publishedStreams.clear();
      this._remoteStreams.forEach(function (stream) {
        stream.dispatchEvent(new _event2.IcsEvent('ended'));
      });
      this._remoteStreams = [];
      if (notifyRemote) {
        var sendError = void 0;
        if (error) {
          sendError = JSON.parse(JSON.stringify(error));
          // Avoid to leak detailed error to remote side.
          sendError.message = 'Error happened at remote side.';
        }
        this._sendSignalingMessage(SignalingType.CLOSED, sendError).catch(function (err) {
          _logger2.default.debug('Failed to send close.' + err.message);
        });
      }
      this.dispatchEvent(new Event('ended'));
    }
  }]);

  return P2PPeerConnectionChannel;
}(_event2.EventDispatcher);

exports.default = P2PPeerConnectionChannel;

},{"../base/event.js":3,"../base/logger.js":5,"../base/publication.js":8,"../base/sdputils.js":9,"../base/stream.js":10,"../base/utils.js":11,"./error.js":23}]},{},[22])(22)
});

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9ncnVudC1icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvc2RrL2Jhc2UvYmFzZTY0LmpzIiwic3JjL3Nkay9iYXNlL2NvZGVjLmpzIiwic3JjL3Nkay9iYXNlL2V2ZW50LmpzIiwic3JjL3Nkay9iYXNlL2V4cG9ydC5qcyIsInNyYy9zZGsvYmFzZS9sb2dnZXIuanMiLCJzcmMvc2RrL2Jhc2UvbWVkaWFmb3JtYXQuanMiLCJzcmMvc2RrL2Jhc2UvbWVkaWFzdHJlYW0tZmFjdG9yeS5qcyIsInNyYy9zZGsvYmFzZS9wdWJsaWNhdGlvbi5qcyIsInNyYy9zZGsvYmFzZS9zZHB1dGlscy5qcyIsInNyYy9zZGsvYmFzZS9zdHJlYW0uanMiLCJzcmMvc2RrL2Jhc2UvdXRpbHMuanMiLCJzcmMvc2RrL2NvbmZlcmVuY2UvY2hhbm5lbC5qcyIsInNyYy9zZGsvY29uZmVyZW5jZS9jbGllbnQuanMiLCJzcmMvc2RrL2NvbmZlcmVuY2UvZXJyb3IuanMiLCJzcmMvc2RrL2NvbmZlcmVuY2UvZXhwb3J0LmpzIiwic3JjL3Nkay9jb25mZXJlbmNlL2luZm8uanMiLCJzcmMvc2RrL2NvbmZlcmVuY2UvbWl4ZWRzdHJlYW0uanMiLCJzcmMvc2RrL2NvbmZlcmVuY2UvcGFydGljaXBhbnQuanMiLCJzcmMvc2RrL2NvbmZlcmVuY2Uvc2lnbmFsaW5nLmpzIiwic3JjL3Nkay9jb25mZXJlbmNlL3N0cmVhbXV0aWxzLmpzIiwic3JjL3Nkay9jb25mZXJlbmNlL3N1YnNjcmlwdGlvbi5qcyIsInNyYy9zZGsvZXhwb3J0LmpzIiwic3JjL3Nkay9wMnAvZXJyb3IuanMiLCJzcmMvc2RrL3AycC9leHBvcnQuanMiLCJzcmMvc2RrL3AycC9wMnBjbGllbnQuanMiLCJzcmMvc2RrL3AycC9wZWVyY29ubmVjdGlvbi1jaGFubmVsLmpzIl0sIm5hbWVzIjpbXSwibWFwcGlu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S0FBNUQsQ0FBa0UsZUFBTztBQUN2RSwyQkFBTyxLQUFQLENBQWEsMEJBQTBCLElBQUksT0FBM0M7QUFDRCxTQUZEO0FBR0Q7QUFDRCxXQUFLLGFBQUwsQ0FBbUIsSUFBSSxLQUFKLENBQVUsT0FBVixDQUFuQjtBQUNEOzs7Ozs7a0JBR1ksd0IiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbigpe2Z1bmN0aW9uIHIoZSxuLHQpe2Z1bmN0aW9uIG8oaSxmKXtpZighbltpXSl7aWYoIWVbaV0pe3ZhciBjPVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmU7aWYoIWYmJmMpcmV0dXJuIGMoaSwhMCk7aWYodSlyZXR1cm4gdShpLCEwKTt2YXIgYT1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK2krXCInXCIpO3Rocm93IGEuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixhfXZhciBwPW5baV09e2V4cG9ydHM6e319O2VbaV1bMF0uY2FsbChwLmV4cG9ydHMsZnVuY3Rpb24ocil7dmFyIG49ZVtpXVsxXVtyXTtyZXR1cm4gbyhufHxyKX0scCxwLmV4cG9ydHMscixlLG4sdCl9cmV0dXJuIG5baV0uZXhwb3J0c31mb3IodmFyIHU9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZSxpPTA7aTx0Lmxlbmd0aDtpKyspbyh0W2ldKTtyZXR1cm4gb31yZXR1cm4gcn0pKCkiLCIvKmdsb2JhbCB1bmVzY2FwZSovXG5cInVzZSBzdHJpY3RcIjtcbmV4cG9ydCBjb25zdCBCYXNlNjQgPSAoZnVuY3Rpb24oKSB7XG4gIHZhciBFTkRfT0ZfSU5QVVQsIGJhc2U2NENoYXJzLCByZXZlcnNlQmFzZTY0Q2hhcnMsIGJhc2U2NFN0ciwgYmFzZTY0Q291bnQsXG4gICAgaSwgc2V0QmFzZTY0U3RyLCByZWFkQmFzZTY0LCBlbmNvZGVCYXNlNjQsIHJlYWRSZXZlcnNlQmFzZTY0LCBudG9zLFxuICAgIGRlY29kZUJhc2U2NDtcblxuICBFTkRfT0ZfSU5QVVQgPSAtMTtcblxuICBiYXNlNjRDaGFycyA9IFtcbiAgICAnQScsICdCJywgJ0MnLCAnRCcsICdFJywgJ0YnLCAnRycsICdIJyxcbiAgICAnSScsICdKJywgJ0snLCAnTCcsICdNJywgJ04nLCAnTycsICdQJyxcbiAgICAnUScsICdSJywgJ1MnLCAnVCcsICdVJywgJ1YnLCAnVycsICdYJyxcbiAgICAnWScsICdaJywgJ2EnLCAnYicsICdjJywgJ2QnLCAnZScsICdmJyxcbiAgICAnZycsICdoJywgJ2knLCAnaicsICdrJywgJ2wnLCAnbScsICduJyxcbiAgICAnbycsICdwJywgJ3EnLCAncicsICdzJywgJ3QnLCAndScsICd2JyxcbiAgICAndycsICd4JywgJ3knLCAneicsICcwJywgJzEnLCAnMicsICczJyxcbiAgICAnNCcsICc1JywgJzYnLCAnNycsICc4JywgJzknLCAnKycsICcvJ1xuICBdO1xuXG4gIHJldmVyc2VCYXNlNjRDaGFycyA9IFtdO1xuXG4gIGZvciAoaSA9IDA7IGkgPCBiYXNlNjRDaGFycy5sZW5ndGg7IGkgPSBpICsgMSkge1xuICAgIHJldmVyc2VCYXNlNjRDaGFyc1tiYXNlNjRDaGFyc1tpXV0gPSBpO1xuICB9XG5cbiAgc2V0QmFzZTY0U3RyID0gZnVuY3Rpb24oc3RyKSB7XG4gICAgYmFzZTY0U3RyID0gc3RyO1xuICAgIGJhc2U2NENvdW50ID0gMDtcbiAgfTtcblxuICByZWFkQmFzZTY0ID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIGM7XG4gICAgaWYgKCFiYXNlNjRTdHIpIHtcbiAgICAgIHJldHVybiBFTkRfT0ZfSU5QVVQ7XG4gICAgfVxuICAgIGlmIChiYXNlNjRDb3VudCA+PSBiYXNlNjRTdHIubGVuZ3RoKSB7XG4gICAgICByZXR1cm4gRU5EX09GX0lOUFVUO1xuICAgIH1cbiAgICBjID0gYmFzZTY0U3RyLmNoYXJDb2RlQXQoYmFzZTY0Q291bnQpICYgMHhmZjtcbiAgICBiYXNlNjRDb3VudCA9IGJhc2U2NENvdW50ICsgMTtcbiAgICByZXR1cm4gYztcbiAgfTtcblxuICBlbmNvZGVCYXNlNjQgPSBmdW5jdGlvbihzdHIpIHtcbiAgICB2YXIgcmVzdWx0LCBpbkJ1ZmZlciwgZG9uZTtcbiAgICBzZXRCYXNlNjRTdHIoc3RyKTtcbiAgICByZXN1bHQgPSAnJztcbiAgICBpbkJ1ZmZlciA9IG5ldyBBcnJheSgzKTtcbiAgICBkb25lID0gZmFsc2U7XG4gICAgd2hpbGUgKCFkb25lICYmIChpbkJ1ZmZlclswXSA9IHJlYWRCYXNlNjQoKSkgIT09IEVORF9PRl9JTlBVVCkge1xuICAgICAgaW5CdWZmZXJbMV0gPSByZWFkQmFzZTY0KCk7XG4gICAgICBpbkJ1ZmZlclsyXSA9IHJlYWRCYXNlNjQoKTtcbiAgICAgIHJlc3VsdCA9IHJlc3VsdCArIChiYXNlNjRDaGFyc1tpbkJ1ZmZlclswXSA+PiAyXSk7XG4gICAgICBpZiAoaW5CdWZmZXJbMV0gIT09IEVORF9PRl9JTlBVVCkge1xuICAgICAgICByZXN1bHQgPSByZXN1bHQgKyAoYmFzZTY0Q2hhcnNbKChpbkJ1ZmZlclswXSA8PCA0KSAmIDB4MzApIHwgKFxuICAgICAgICAgIGluQnVmZmVyWzFdID4+IDQpXSk7XG4gICAgICAgIGlmIChpbkJ1ZmZlclsyXSAhPT0gRU5EX09GX0lOUFVUKSB7XG4gICAgICAgICAgcmVzdWx0ID0gcmVzdWx0ICsgKGJhc2U2NENoYXJzWygoaW5CdWZmZXJbMV0gPDwgMikgJiAweDNjKSB8IChcbiAgICAgICAgICAgIGluQnVmZmVyWzJdID4+IDYpXSk7XG4gICAgICAgICAgcmVzdWx0ID0gcmVzdWx0ICsgKGJhc2U2NENoYXJzW2luQnVmZmVyWzJdICYgMHgzRl0pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJlc3VsdCA9IHJlc3VsdCArIChiYXNlNjRDaGFyc1soKGluQnVmZmVyWzFdIDw8IDIpICYgMHgzYyldKTtcbiAgICAgICAgICByZXN1bHQgPSByZXN1bHQgKyAoJz0nKTtcbiAgICAgICAgICBkb25lID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmVzdWx0ID0gcmVzdWx0ICsgKGJhc2U2NENoYXJzWygoaW5CdWZmZXJbMF0gPDwgNCkgJiAweDMwKV0pO1xuICAgICAgICByZXN1bHQgPSByZXN1bHQgKyAoJz0nKTtcbiAgICAgICAgcmVzdWx0ID0gcmVzdWx0ICsgKCc9Jyk7XG4gICAgICAgIGRvbmUgPSB0cnVlO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gcmVzdWx0O1xuICB9O1xuXG4gIHJlYWRSZXZlcnNlQmFzZTY0ID0gZnVuY3Rpb24oKSB7XG4gICAgaWYgKCFiYXNlNjRTdHIpIHtcbiAgICAgIHJldHVybiBFTkRfT0ZfSU5QVVQ7XG4gICAgfVxuICAgIHdoaWxlICh0cnVlKSB7XG4gICAgICBpZiAoYmFzZTY0Q291bnQgPj0gYmFzZTY0U3RyLmxlbmd0aCkge1xuICAgICAgICByZXR1cm4gRU5EX09GX0lOUFVUO1xuICAgICAgfVxuICAgICAgdmFyIG5leHRDaGFyYWN0ZXIgPSBiYXNlNjRTdHIuY2hhckF0KGJhc2U2NENvdW50KTtcbiAgICAgIGJhc2U2NENvdW50ID0gYmFzZTY0Q291bnQgKyAxO1xuICAgICAgaWYgKHJldmVyc2VCYXNlNjRDaGFyc1tuZXh0Q2hhcmFjdGVyXSkge1xuICAgICAgICByZXR1cm4gcmV2ZXJzZUJhc2U2NENoYXJzW25leHRDaGFyYWN0ZXJdO1xuICAgICAgfVxuICAgICAgaWYgKG5leHRDaGFyYWN0ZXIgPT09ICdBJykge1xuICAgICAgICByZXR1cm4gMDtcbiAgICAgIH1cbiAgICB9XG4gIH07XG5cbiAgbnRvcyA9IGZ1bmN0aW9uKG4pIHtcbiAgICBuID0gbi50b1N0cmluZygxNik7XG4gICAgaWYgKG4ubGVuZ3RoID09PSAxKSB7XG4gICAgICBuID0gXCIwXCIgKyBuO1xuICAgIH1cbiAgICBuID0gXCIlXCIgKyBuO1xuICAgIHJldHVybiB1bmVzY2FwZShuKTtcbiAgfTtcblxuICBkZWNvZGVCYXNlNjQgPSBmdW5jdGlvbihzdHIpIHtcbiAgICB2YXIgcmVzdWx0LCBpbkJ1ZmZlciwgZG9uZTtcbiAgICBzZXRCYXNlNjRTdHIoc3RyKTtcbiAgICByZXN1bHQgPSBcIlwiO1xuICAgIGluQnVmZmVyID0gbmV3IEFycmF5KDQpO1xuICAgIGRvbmUgPSBmYWxzZTtcbiAgICB3aGlsZSAoIWRvbmUgJiYgKGluQnVmZmVyWzBdID0gcmVhZFJldmVyc2VCYXNlNjQoKSkgIT09IEVORF9PRl9JTlBVVCAmJlxuICAgICAgKGluQnVmZmVyWzFdID0gcmVhZFJldmVyc2VCYXNlNjQoKSkgIT09IEVORF9PRl9JTlBVVCkge1xuICAgICAgaW5CdWZmZXJbMl0gPSByZWFkUmV2ZXJzZUJhc2U2NCgpO1xuICAgICAgaW5CdWZmZXJbM10gPSByZWFkUmV2ZXJzZUJhc2U2NCgpO1xuICAgICAgcmVzdWx0ID0gcmVzdWx0ICsgbnRvcygoKChpbkJ1ZmZlclswXSA8PCAyKSAmIDB4ZmYpIHwgaW5CdWZmZXJbMV0gPj5cbiAgICAgICAgNCkpO1xuICAgICAgaWYgKGluQnVmZmVyWzJdICE9PSBFTkRfT0ZfSU5QVVQpIHtcbiAgICAgICAgcmVzdWx0ICs9IG50b3MoKCgoaW5CdWZmZXJbMV0gPDwgNCkgJiAweGZmKSB8IGluQnVmZmVyWzJdID4+IDIpKTtcbiAgICAgICAgaWYgKGluQnVmZmVyWzNdICE9PSBFTkRfT0ZfSU5QVVQpIHtcbiAgICAgICAgICByZXN1bHQgPSByZXN1bHQgKyBudG9zKCgoKGluQnVmZmVyWzJdIDw8IDYpICYgMHhmZikgfCBpbkJ1ZmZlcltcbiAgICAgICAgICAgIDNdKSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgZG9uZSA9IHRydWU7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGRvbmUgPSB0cnVlO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gcmVzdWx0O1xuICB9O1xuXG4gIHJldHVybiB7XG4gICAgZW5jb2RlQmFzZTY0OiBlbmNvZGVCYXNlNjQsXG4gICAgZGVjb2RlQmFzZTY0OiBkZWNvZGVCYXNlNjRcbiAgfTtcbn0oKSk7XG4iLCIndXNlIHN0cmljdCc7XG5cbmV4cG9ydCBjb25zdCBBdWRpb0NvZGVjID0ge1xuICBQQ01VOiAncGNtdScsXG4gIFBDTUE6ICdwY21hJyxcbiAgT1BVUzogJ29wdXMnLFxuICBHNzIyOiAnZzcyMicsXG4gIElTQUM6ICdpU0FDJyxcbiAgSUxCQzogJ2lMQkMnLFxuICBBQUM6ICdhYWMnLFxuICBBQzM6ICdhYzMnLFxuICBORUxMWU1PU0VSOiAnbmVsbHltb3Nlcidcbn07XG4vKipcbiAqIEBjbGFzcyBBdWRpb0NvZGVjUGFyYW1ldGVyc1xuICogQG1lbWJlck9mIEljcy5CYXNlXG4gKiBAY2xhc3NEZXNjIENvZGVjIHBhcmFtZXRlcnMgZm9yIGFuIGF1ZGlvIHRyYWNrLlxuICogQGhpZGVjb25zdHJ1Y3RvclxuICovXG5leHBvcnQgY2xhc3MgQXVkaW9Db2RlY1BhcmFtZXRlcnMge1xuICBjb25zdHJ1Y3RvcihuYW1lLCBjaGFubmVsQ291bnQsIGNsb2NrUmF0ZSkge1xuICAgIC8qKlxuICAgICAqIEBtZW1iZXIge3N0cmluZ30gbmFtZVxuICAgICAqIEBtZW1iZXJvZiBJY3MuQmFzZS5BdWRpb0NvZGVjUGFyYW1ldGVyc1xuICAgICAqIEBpbnN0YW5jZVxuICAgICAqIEBkZXNjIE5hbWUgb2YgYSBjb2RlYy4gUGxlYXNlIGEgdmFsdWUgaW4gSWNzLkJhc2UuQXVkaW9Db2RlYy4gSG93ZXZlciwgc29tZSBmdW5jdGlvbnMgZG8gbm90IHN1cHBvcnQgYWxsIHRoZSB2YWx1ZXMgaW4gSWNzLkJhc2UuQXVkaW9Db2RlYy5cbiAgICAgKi9cbiAgICB0aGlzLm5hbWUgPSBuYW1lO1xuICAgIC8qKlxuICAgICAqIEBtZW1iZXIgez9udW1iZXJ9IGNoYW5uZWxDb3VudFxuICAgICAqIEBtZW1iZXJvZiBJY3MuQmFzZS5BdWRpb0NvZGVjUGFyYW1ldGVyc1xuICAgICAqIEBpbnN0YW5jZVxuICAgICAqIEBkZXNjIE51bWJlcnMgb2YgY2hhbm5lbHMgZm9yIGFuIGF1ZGlvIHRyYWNrLlxuICAgICAqL1xuICAgIHRoaXMuY2hhbm5lbENvdW50ID0gY2hhbm5lbENvdW50O1xuICAgIC8qKlxuICAgICAqIEBtZW1iZXIgez9udW1iZXJ9IGNsb2NrUmF0ZVxuICAgICAqIEBtZW1iZXJvZiBJY3MuQmFzZS5BdWRpb0NvZGVjUGFyYW1ldGVyc1xuICAgICAqIEBpbnN0YW5jZVxuICAgICAqIEBkZXNjIFRoZSBjb2RlYyBjbG9jayByYXRlIGV4cHJlc3NlZCBpbiBIZXJ0ei5cbiAgICAgKi9cbiAgICB0aGlzLmNsb2NrUmF0ZSA9IGNsb2NrUmF0ZTtcbiAgfVxufVxuXG4vKipcbiAqIEBjbGFzcyBBdWRpb0VuY29kaW5nUGFyYW1ldGVyc1xuICogQG1lbWJlck9mIEljcy5CYXNlXG4gKiBAY2xhc3NEZXNjIEVuY29kaW5nIHBhcmFtZXRlcnMgZm9yIHNlbmRpbmcgYW4gYXVkaW8gdHJhY2suXG4gKiBAaGlkZWNvbnN0cnVjdG9yXG4gKi9cbmV4cG9ydCBjbGFzcyBBdWRpb0VuY29kaW5nUGFyYW1ldGVycyB7XG4gIGNvbnN0cnVjdG9yKGNvZGVjLCBtYXhCaXRyYXRlKSB7XG4gICAgLyoqXG4gICAgICogQG1lbWJlciB7P0ljcy5CYXNlLkF1ZGlvQ29kZWNQYXJhbWV0ZXJzfSBjb2RlY1xuICAgICAqIEBpbnN0YW5jZVxuICAgICAqIEBtZW1iZXJvZiBJY3MuQmFzZS5BdWRpb0VuY29kaW5nUGFyYW1ldGVyc1xuICAgICAqL1xuICAgIHRoaXMuY29kZWMgPSBjb2RlYztcbiAgICAvKipcbiAgICAgKiBAbWVtYmVyIHs/bnVtYmVyfSBtYXhCaXRyYXRlXG4gICAgICogQGluc3RhbmNlXG4gICAgICogQG1lbWJlcm9mIEljcy5CYXNlLkF1ZGlvRW5jb2RpbmdQYXJhbWV0ZXJzXG4gICAgICogQGRlc2MgTWF4IGJpdHJhdGUgZXhwcmVzc2VkIGluIGticHMuXG4gICAgICovXG4gICAgdGhpcy5tYXhCaXRyYXRlID0gbWF4Qml0cmF0ZTtcbiAgfVxufVxuXG5leHBvcnQgY29uc3QgVmlkZW9Db2RlYyA9IHtcbiAgVlA4OiAndnA4JyxcbiAgVlA5OiAndnA5JyxcbiAgSDI2NDogJ2gyNjQnLFxuICBIMjY1OiAnaDI2NSdcbn07XG5cbi8qKlxuICogQGNsYXNzIFZpZGVvQ29kZWNQYXJhbWV0ZXJzXG4gKiBAbWVtYmVyT2YgSWNzLkJhc2VcbiAqIEBjbGFzc0Rlc2MgQ29kZWMgcGFyYW1ldGVycyBmb3IgYSB2aWRlbyB0cmFjay5cbiAqIEBoaWRlY29uc3RydWN0b3JcbiAqL1xuZXhwb3J0IGNsYXNzIFZpZGVvQ29kZWNQYXJhbWV0ZXJzIHtcbiAgY29uc3RydWN0b3IobmFtZSwgcHJvZmlsZSkge1xuICAgIC8qKlxuICAgICAqIEBtZW1iZXIge3N0cmluZ30gbmFtZVxuICAgICAqIEBtZW1iZXJvZiBJY3MuQmFzZS5WaWRlb0NvZGVjUGFyYW1ldGVyc1xuICAgICAqIEBpbnN0YW5jZVxuICAgICAqIEBkZXNjIE5hbWUgb2YgYSBjb2RlYy4gUGxlYXNlIGEgdmFsdWUgaW4gSWNzLkJhc2UuQXVkaW9Db2RlYy4gSG93ZXZlciwgc29tZSBmdW5jdGlvbnMgZG8gbm90IHN1cHBvcnQgYWxsIHRoZSB2YWx1ZXMgaW4gSWNzLkJhc2UuQXVkaW9Db2RlYy5cbiAgICAgKi9cbiAgICB0aGlzLm5hbWUgPSBuYW1lO1xuICAgIC8qKlxuICAgICAqIEBtZW1iZXIgez9zdHJpbmd9IHByb2ZpbGVcbiAgICAgKiBAbWVtYmVyb2YgSWNzLkJhc2UuVmlkZW9Db2RlY1BhcmFtZXRlcnNcbiAgICAgKiBAaW5zdGFuY2VcbiAgICAgKiBAZGVzYyBUaGUgcHJvZmlsZSBvZiBhIGNvZGVjLiBQcm9maWxlIG1heSBub3QgYXBwbHkgdG8gYWxsIGNvZGVjcy5cbiAgICAgKi9cbiAgICB0aGlzLnByb2ZpbGUgPSBwcm9maWxlO1xuICB9XG59XG5cbi8qKlxuICogQGNsYXNzIFZpZGVvRW5jb2RpbmdQYXJhbWV0ZXJzXG4gKiBAbWVtYmVyT2YgSWNzLkJhc2VcbiAqIEBjbGFzc0Rlc2MgRW5jb2RpbmcgcGFyYW1ldGVycyBmb3Igc2VuZGluZyBhIHZpZGVvIHRyYWNrLlxuICogQGhpZGVjb25zdHJ1Y3RvclxuICovXG5leHBvcnQgY2xhc3MgVmlkZW9FbmNvZGluZ1BhcmFtZXRlcnMge1xuICBjb25zdHJ1Y3Rvcihjb2RlYywgbWF4Qml0cmF0ZSkge1xuICAgIC8qKlxuICAgICAqIEBtZW1iZXIgez9JY3MuQmFzZS5WaWRlb0NvZGVjUGFyYW1ldGVyc30gY29kZWNcbiAgICAgKiBAaW5zdGFuY2VcbiAgICAgKiBAbWVtYmVyb2YgSWNzLkJhc2UuVmlkZW9FbmNvZGluZ1BhcmFtZXRlcnNcbiAgICAgKi9cbiAgICB0aGlzLmNvZGVjID0gY29kZWM7XG4gICAgLyoqXG4gICAgICogQG1lbWJlciB7P251bWJlcn0gbWF4Qml0cmF0ZVxuICAgICAqIEBpbnN0YW5jZVxuICAgICAqIEBtZW1iZXJvZiBJY3MuQmFzZS5WaWRlb0VuY29kaW5nUGFyYW1ldGVyc1xuICAgICAqIEBkZXNjIE1heCBiaXRyYXRlIGV4cHJlc3NlZCBpbiBicHMuXG4gICAgICovXG4gICAgdGhpcy5tYXhCaXRyYXRlID0gbWF4Qml0cmF0ZTtcbiAgfVxufVxuIiwiLy8gQ29weXJpZ2h0IMKpIDIwMTcgSW50ZWwgQ29ycG9yYXRpb24uIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG5cbid1c2Ugc3RyaWN0JztcblxuLyoqXG4gKiBAY2xhc3MgRXZlbnREaXNwYXRjaGVyXG4gKiBAY2xhc3NEZXNjIEEgc2hpbSBmb3IgRXZlbnRUYXJnZXQuIE1pZ2h0IGJlIGNoYW5nZWQgdG8gRXZlbnRUYXJnZXQgbGF0ZXIuXG4gKiBAbWVtYmVyb2YgSWNzLkJhc2VcbiAqIEBoaWRlY29uc3RydWN0b3JcbiAqL1xuZXhwb3J0IGNvbnN0IEV2ZW50RGlzcGF0Y2hlciA9IGZ1bmN0aW9uKCkge1xuICAvLyBQcml2YXRlIHZhcnNcbiAgY29uc3Qgc3BlYyA9IHt9O1xuICBzcGVjLmRpc3BhdGNoZXIgPSB7fTtcbiAgc3BlYy5kaXNwYXRjaGVyLmV2ZW50TGlzdGVuZXJzID0ge307XG5cbiAgLyoqXG4gICAqIEBmdW5jdGlvbiBhZGRFdmVudExpc3RlbmVyXG4gICAqIEBkZXNjIFRoaXMgZnVuY3Rpb24gcmVnaXN0ZXJzIGEgY2FsbGJhY2sgZnVuY3Rpb24gYXMgYSBoYW5kbGVyIGZvciB0aGUgY29ycmVzcG9uZGluZyBldmVudC4gSXQncyBzaG9ydGVuZWQgZm9ybSBpcyBvbihldmVudFR5cGUsIGxpc3RlbmVyKS4gU2VlIHRoZSBldmVudCBkZXNjcmlwdGlvbiBpbiB0aGUgZm9sbG93aW5nIHRhYmxlLjxicj5cbiAgICogQGluc3RhbmNlXG4gICAqIEBtZW1iZXJvZiBJY3MuQmFzZS5FdmVudERpc3BhdGNoZXJcbiAgICogQHBhcmFtIHtzdHJpbmd9IGV2ZW50VHlwZSBFdmVudCBzdHJpbmcuXG4gICAqIEBwYXJhbSB7ZnVuY3Rpb259IGxpc3RlbmVyIENhbGxiYWNrIGZ1bmN0aW9uLlxuICAgKi9cbiAgdGhpcy5hZGRFdmVudExpc3RlbmVyID0gZnVuY3Rpb24oZXZlbnRUeXBlLCBsaXN0ZW5lcikge1xuICAgIGlmIChzcGVjLmRpc3BhdGNoZXIuZXZlbnRMaXN0ZW5lcnNbZXZlbnRUeXBlXSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICBzcGVjLmRpc3BhdGNoZXIuZXZlbnRMaXN0ZW5lcnNbZXZlbnRUeXBlXSA9IFtdO1xuICAgIH1cbiAgICBzcGVjLmRpc3BhdGNoZXIuZXZlbnRMaXN0ZW5lcnNbZXZlbnRUeXBlXS5wdXNoKGxpc3RlbmVyKTtcbiAgfTtcblxuICAvKipcbiAgICogQGZ1bmN0aW9uIHJlbW92ZUV2ZW50TGlzdGVuZXJcbiAgICogQGRlc2MgVGhpcyBmdW5jdGlvbiByZW1vdmVzIGEgcmVnaXN0ZXJlZCBldmVudCBsaXN0ZW5lci5cbiAgICogQGluc3RhbmNlXG4gICAqIEBtZW1iZXJvZiBJY3MuQmFzZS5FdmVudERpc3BhdGNoZXJcbiAgICogQHBhcmFtIHtzdHJpbmd9IGV2ZW50VHlwZSBFdmVudCBzdHJpbmcuXG4gICAqIEBwYXJhbSB7ZnVuY3Rpb259IGxpc3RlbmVyIENhbGxiYWNrIGZ1bmN0aW9uLlxuICAgKi9cbiAgdGhpcy5yZW1vdmVFdmVudExpc3RlbmVyID0gZnVuY3Rpb24oZXZlbnRUeXBlLCBsaXN0ZW5lcikge1xuICAgIGlmICghc3BlYy5kaXNwYXRjaGVyLmV2ZW50TGlzdGVuZXJzW2V2ZW50VHlwZV0pIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgdmFyIGluZGV4ID0gc3BlYy5kaXNwYXRjaGVyLmV2ZW50TGlzdGVuZXJzW2V2ZW50VHlwZV0uaW5kZXhPZihsaXN0ZW5lcik7XG4gICAgaWYgKGluZGV4ICE9PSAtMSkge1xuICAgICAgc3BlYy5kaXNwYXRjaGVyLmV2ZW50TGlzdGVuZXJzW2V2ZW50VHlwZV0uc3BsaWNlKGluZGV4LCAxKTtcbiAgICB9XG4gIH07XG5cbiAgLyoqXG4gICAqIEBmdW5jdGlvbiBjbGVhckV2ZW50TGlzdGVuZXJcbiAgICogQGRlc2MgVGhpcyBmdW5jdGlvbiByZW1vdmVzIGFsbCBldmVudCBsaXN0ZW5lcnMgZm9yIG9uZSB0eXBlLlxuICAgKiBAaW5zdGFuY2VcbiAgICogQG1lbWJlcm9mIEljcy5CYXNlLkV2ZW50RGlzcGF0Y2hlclxuICAgKiBAcGFyYW0ge3N0cmluZ30gZXZlbnRUeXBlIEV2ZW50IHN0cmluZy5cbiAgICovXG4gIHRoaXMuY2xlYXJFdmVudExpc3RlbmVyID0gZnVuY3Rpb24oZXZlbnRUeXBlKSB7XG4gICAgc3BlYy5kaXNwYXRjaGVyLmV2ZW50TGlzdGVuZXJzW2V2ZW50VHlwZV0gPSBbXTtcbiAgfTtcblxuICAvLyBJdCBkaXNwYXRjaCBhIG5ldyBldmVudCB0byB0aGUgZXZlbnQgbGlzdGVuZXJzLCBiYXNlZCBvbiB0aGUgdHlwZVxuICAvLyBvZiBldmVudC4gQWxsIGV2ZW50cyBhcmUgaW50ZW5kZWQgdG8gYmUgTGljb2RlRXZlbnRzLlxuICB0aGlzLmRpc3BhdGNoRXZlbnQgPSBmdW5jdGlvbihldmVudCkge1xuICAgIGlmICghc3BlYy5kaXNwYXRjaGVyLmV2ZW50TGlzdGVuZXJzW2V2ZW50LnR5cGVdKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIHNwZWMuZGlzcGF0Y2hlci5ldmVudExpc3RlbmVyc1tldmVudC50eXBlXS5tYXAoZnVuY3Rpb24obGlzdGVuZXIpIHtcbiAgICAgIGxpc3RlbmVyKGV2ZW50KTtcbiAgICB9KTtcbiAgfTtcbn07XG5cbi8qKlxuICogQGNsYXNzIEljc0V2ZW50XG4gKiBAY2xhc3NEZXNjIENsYXNzIEljc0V2ZW50IHJlcHJlc2VudHMgYSBnZW5lcmljIEV2ZW50IGluIHRoZSBsaWJyYXJ5LlxuICogQG1lbWJlcm9mIEljcy5CYXNlXG4gKiBAaGlkZWNvbnN0cnVjdG9yXG4gKi9cbmV4cG9ydCBjbGFzcyBJY3NFdmVudCB7XG4gIGNvbnN0cnVjdG9yKHR5cGUpIHtcbiAgICB0aGlzLnR5cGUgPSB0eXBlO1xuICB9XG59XG5cbi8qKlxuICogQGNsYXNzIE1lc3NhZ2VFdmVudFxuICogQGNsYXNzRGVzYyBDbGFzcyBNZXNzYWdlRXZlbnQgcmVwcmVzZW50cyBhIG1lc3NhZ2UgRXZlbnQgaW4gdGhlIGxpYnJhcnkuXG4gKiBAbWVtYmVyb2YgSWNzLkJhc2VcbiAqIEBoaWRlY29uc3RydWN0b3JcbiAqL1xuZXhwb3J0IGNsYXNzIE1lc3NhZ2VFdmVudCBleHRlbmRzIEljc0V2ZW50IHtcbiAgY29uc3RydWN0b3IodHlwZSwgaW5pdCkge1xuICAgIHN1cGVyKHR5cGUpO1xuICAgIC8qKlxuICAgICAqIEBtZW1iZXIge3N0cmluZ30gb3JpZ2luXG4gICAgICogQGluc3RhbmNlXG4gICAgICogQG1lbWJlcm9mIEljcy5CYXNlLk1lc3NhZ2VFdmVudFxuICAgICAqIEBkZXNjIElEIG9mIHRoZSByZW1vdGUgZW5kcG9pbnQgd2hvIHB1Ymxpc2hlZCB0aGlzIHN0cmVhbS5cbiAgICAgKi9cbiAgICB0aGlzLm9yaWdpbiA9IGluaXQub3JpZ2luO1xuICAgIC8qKlxuICAgICAqIEBtZW1iZXIge3N0cmluZ30gbWVzc2FnZVxuICAgICAqIEBpbnN0YW5jZVxuICAgICAqIEBtZW1iZXJvZiBJY3MuQmFzZS5NZXNzYWdlRXZlbnRcbiAgICAgKi9cbiAgICB0aGlzLm1lc3NhZ2UgPSBpbml0Lm1lc3NhZ2U7XG4gIH1cbn1cblxuLyoqXG4gKiBAY2xhc3MgRXJyb3JFdmVudFxuICogQGNsYXNzRGVzYyBDbGFzcyBFcnJvckV2ZW50IHJlcHJlc2VudHMgYW4gZXJyb3IgRXZlbnQgaW4gdGhlIGxpYnJhcnkuXG4gKiBAbWVtYmVyb2YgSWNzLkJhc2VcbiAqIEBoaWRlY29uc3RydWN0b3JcbiAqL1xuZXhwb3J0IGNsYXNzIEVycm9yRXZlbnQgZXh0ZW5kcyBJY3NFdmVudHtcbiAgY29uc3RydWN0b3IodHlwZSwgaW5pdCkge1xuICAgIHN1cGVyKHR5cGUpO1xuICAgIC8qKlxuICAgICAqIEBtZW1iZXIge0Vycm9yfSBlcnJvclxuICAgICAqIEBpbnN0YW5jZVxuICAgICAqIEBtZW1iZXJvZiBJY3MuQmFzZS5FcnJvckV2ZW50XG4gICAgICovXG4gICAgdGhpcy5lcnJvciA9IGluaXQuZXJyb3I7XG4gIH1cbn1cblxuLyoqXG4gKiBAY2xhc3MgTXV0ZUV2ZW50XG4gKiBAY2xhc3NEZXNjIENsYXNzIE11dGVFdmVudCByZXByZXNlbnRzIGEgbXV0ZSBvciB1bm11dGUgZXZlbnQuXG4gKiBAbWVtYmVyb2YgSWNzLkJhc2VcbiAqIEBoaWRlY29uc3RydWN0b3JcbiAqL1xuZXhwb3J0IGNsYXNzIE11dGVFdmVudCBleHRlbmRzIEljc0V2ZW50IHtcbiAgY29uc3RydWN0b3IodHlwZSwgaW5pdCl7XG4gICAgc3VwZXIodHlwZSk7XG4gICAgLyoqXG4gICAgICogQG1lbWJlciB7SWNzLkJhc2UuVHJhY2tLaW5kfSBraW5kXG4gICAgICogQGluc3RhbmNlXG4gICAgICogQG1lbWJlcm9mIEljcy5CYXNlLk11dGVFdmVudFxuICAgICAqL1xuICAgIHRoaXMua2luZCA9IGluaXQua2luZDtcbiAgfVxufVxuIiwiLy8gQ29weXJpZ2h0IMKpIDIwMTcgSW50ZWwgQ29ycG9yYXRpb24uIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG5cbmV4cG9ydCAqIGZyb20gJy4vbWVkaWFzdHJlYW0tZmFjdG9yeS5qcydcbmV4cG9ydCAqIGZyb20gJy4vc3RyZWFtLmpzJ1xuZXhwb3J0ICogZnJvbSAnLi9tZWRpYWZvcm1hdC5qcydcbiIsIi8qZ2xvYmFsIGNvbnNvbGUqL1xuXG4vKlxuICogQVBJIHRvIHdyaXRlIGxvZ3MgYmFzZWQgb24gdHJhZGl0aW9uYWwgbG9nZ2luZyBtZWNoYW5pc21zOiBkZWJ1ZywgdHJhY2UsIGluZm8sIHdhcm5pbmcsIGVycm9yXG4gKi9cbnZhciBMb2dnZXIgPSAoZnVuY3Rpb24oKSB7XG4gIFwidXNlIHN0cmljdFwiO1xuICB2YXIgREVCVUcgPSAwLFxuICAgIFRSQUNFID0gMSxcbiAgICBJTkZPID0gMixcbiAgICBXQVJOSU5HID0gMyxcbiAgICBFUlJPUiA9IDQsXG4gICAgTk9ORSA9IDU7XG5cbiAgdmFyIG5vT3AgPSBmdW5jdGlvbigpIHt9O1xuXG4gIC8vIHx0aGF0fCBpcyB0aGUgb2JqZWN0IHRvIGJlIHJldHVybmVkLlxuICB2YXIgdGhhdCA9IHtcbiAgICBERUJVRzogREVCVUcsXG4gICAgVFJBQ0U6IFRSQUNFLFxuICAgIElORk86IElORk8sXG4gICAgV0FSTklORzogV0FSTklORyxcbiAgICBFUlJPUjogRVJST1IsXG4gICAgTk9ORTogTk9ORVxuICB9O1xuXG4gIHRoYXQubG9nID0gd2luZG93LmNvbnNvbGUubG9nLmJpbmQod2luZG93LmNvbnNvbGUpO1xuXG4gIHZhciBiaW5kVHlwZSA9IGZ1bmN0aW9uKHR5cGUpIHtcbiAgICBpZiAodHlwZW9mIHdpbmRvdy5jb25zb2xlW3R5cGVdID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICByZXR1cm4gd2luZG93LmNvbnNvbGVbdHlwZV0uYmluZCh3aW5kb3cuY29uc29sZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiB3aW5kb3cuY29uc29sZS5sb2cuYmluZCh3aW5kb3cuY29uc29sZSk7XG4gICAgfVxuICB9O1xuXG4gIHZhciBzZXRMb2dMZXZlbCA9IGZ1bmN0aW9uKGxldmVsKSB7XG4gICAgaWYgKGxldmVsIDw9IERFQlVHKSB7XG4gICAgICB0aGF0LmRlYnVnID0gYmluZFR5cGUoJ2xvZycpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGF0LmRlYnVnID0gbm9PcDtcbiAgICB9XG4gICAgaWYgKGxldmVsIDw9IFRSQUNFKSB7XG4gICAgICB0aGF0LnRyYWNlID0gYmluZFR5cGUoJ3RyYWNlJyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoYXQudHJhY2UgPSBub09wO1xuICAgIH1cbiAgICBpZiAobGV2ZWwgPD0gSU5GTykge1xuICAgICAgdGhhdC5pbmZvID0gYmluZFR5cGUoJ2luZm8nKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhhdC5pbmZvID0gbm9PcDtcbiAgICB9XG4gICAgaWYgKGxldmVsIDw9IFdBUk5JTkcpIHtcbiAgICAgIHRoYXQud2FybmluZyA9IGJpbmRUeXBlKCd3YXJuJyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoYXQud2FybmluZyA9IG5vT3A7XG4gICAgfVxuICAgIGlmIChsZXZlbCA8PSBFUlJPUikge1xuICAgICAgdGhhdC5lcnJvciA9IGJpbmRUeXBlKCdlcnJvcicpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGF0LmVycm9yID0gbm9PcDtcbiAgICB9XG4gIH07XG5cbiAgc2V0TG9nTGV2ZWwoREVCVUcpOyAvLyBEZWZhdWx0IGxldmVsIGlzIGRlYnVnLlxuXG4gIHRoYXQuc2V0TG9nTGV2ZWwgPSBzZXRMb2dMZXZlbDtcblxuICByZXR1cm4gdGhhdDtcbn0oKSk7XG5cbmV4cG9ydCBkZWZhdWx0IExvZ2dlcjtcbiIsIid1c2Ugc3RyaWN0JztcblxuLyoqXG4gKiBTb3VyY2UgaW5mbyBhYm91dCBhbiBhdWRpbyB0cmFjay5cbiAqIEBtZW1iZXJPZiBJY3MuQmFzZVxuICogQHJlYWRvbmx5XG4gKiBAZW51bSB7c3RyaW5nfVxuICovXG5leHBvcnQgY29uc3QgQXVkaW9Tb3VyY2VJbmZvID0ge1xuICBNSUM6ICdtaWMnLFxuICBTQ1JFRU5DQVNUOiAnc2NyZWVuLWNhc3QnLFxuICBGSUxFOiAnZmlsZScsXG4gIE1JWEVEOiAnbWl4ZWQnXG59O1xuXG4vKipcbiAqIFNvdXJjZSBpbmZvIGFib3V0IGEgdmlkZW8gdHJhY2suXG4gKiBAbWVtYmVyT2YgSWNzLkJhc2VcbiAqIEByZWFkb25seVxuICogQGVudW0ge3N0cmluZ31cbiAqL1xuZXhwb3J0IGNvbnN0IFZpZGVvU291cmNlSW5mbyA9IHtcbiAgQ0FNRVJBOiAnY2FtZXJhJyxcbiAgU0NSRUVOQ0FTVDogJ3NjcmVlbi1jYXN0JyxcbiAgRklMRTogJ2ZpbGUnLFxuICBNSVhFRDogJ21peGVkJ1xufTtcblxuLyoqXG4gKiBLaW5kIG9mIGEgdHJhY2suXG4gKiBAbWVtYmVyT2YgSWNzLkJhc2VcbiAqIEByZWFkb25seVxuICogQGVudW0ge3N0cmluZ31cbiAqL1xuZXhwb3J0IGNvbnN0IFRyYWNrS2luZCA9IHtcbiAgLyoqXG4gICAqIEF1ZGlvIHRyYWNrcy5cbiAgICogQHR5cGUgc3RyaW5nXG4gICAqL1xuICBBVURJTzogJ2F1ZGlvJyxcbiAgLyoqXG4gICAqIFZpZGVvIHRyYWNrcy5cbiAgICogQHR5cGUgc3RyaW5nXG4gICAqL1xuICBWSURFTzogJ3ZpZGVvJyxcbiAgLyoqXG4gICAqIEJvdGggYXVkaW8gYW5kIHZpZGVvIHRyYWNrcy5cbiAgICogQHR5cGUgc3RyaW5nXG4gICAqL1xuICBBVURJT19BTkRfVklERU86ICdhdidcbn07XG5cbi8qKlxuICogQGNsYXNzIFJlc29sdXRpb25cbiAqIEBtZW1iZXJPZiBJY3MuQmFzZVxuICogQGNsYXNzRGVzYyBUaGUgUmVzb2x1dGlvbiBkZWZpbmVzIHRoZSBzaXplIG9mIGEgcmVjdGFuZ2xlLlxuICogQGNvbnN0cnVjdG9yXG4gKiBAcGFyYW0ge251bWJlcn0gd2lkdGhcbiAqIEBwYXJhbSB7bnVtYmVyfSBoZWlnaHRcbiAqL1xuZXhwb3J0IGNsYXNzIFJlc29sdXRpb24ge1xuICBjb25zdHJ1Y3Rvcih3aWR0aCwgaGVpZ2h0KSB7XG4gICAgLyoqXG4gICAgICogQG1lbWJlciB7bnVtYmVyfSB3aWR0aFxuICAgICAqIEBpbnN0YW5jZVxuICAgICAqIEBtZW1iZXJvZiBJY3MuQmFzZS5SZXNvbHV0aW9uXG4gICAgICovXG4gICAgdGhpcy53aWR0aCA9IHdpZHRoO1xuICAgIC8qKlxuICAgICAqIEBtZW1iZXIge251bWJlcn0gaGVpZ2h0XG4gICAgICogQGluc3RhbmNlXG4gICAgICogQG1lbWJlcm9mIEljcy5CYXNlLlJlc29sdXRpb25cbiAgICAgKi9cbiAgICB0aGlzLmhlaWdodCA9IGhlaWdodDtcbiAgfVxufVxuIiwiLy8gQ29weXJpZ2h0IMKpIDIwMTcgSW50ZWwgQ29ycG9yYXRpb24uIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4ndXNlIHN0cmljdCc7XG5pbXBvcnQgKiBhcyB1dGlscyBmcm9tICcuL3V0aWxzLmpzJ1xuaW1wb3J0IExvZ2dlciBmcm9tICcuL2xvZ2dlci5qcydcbmltcG9ydCB7IFJlc29sdXRpb24gfSBmcm9tICcuL21lZGlhZm9ybWF0LmpzJ1xuaW1wb3J0ICogYXMgTWVkaWFGb3JtYXRNb2R1bGUgZnJvbSAnLi9tZWRpYWZvcm1hdC5qcydcblxuLyoqXG4gKiBAY2xhc3MgQXVkaW9UcmFja0NvbnN0cmFpbnRzXG4gKiBAY2xhc3NEZXNjIENvbnN0cmFpbnRzIGZvciBjcmVhdGluZyBhbiBhdWRpbyBNZWRpYVN0cmVhbVRyYWNrLlxuICogQG1lbWJlcm9mIEljcy5CYXNlXG4gKiBAY29uc3RydWN0b3JcbiAqIEBwYXJhbSB7SWNzLkJhc2UuQXVkaW9Tb3VyY2VJbmZvfSBzb3VyY2UgU291cmNlIGluZm8gb2YgdGhpcyBhdWRpbyB0cmFjay5cbiAqL1xuZXhwb3J0IGNsYXNzIEF1ZGlvVHJhY2tDb25zdHJhaW50cyB7XG4gIGNvbnN0cnVjdG9yKHNvdXJjZSkge1xuICAgIGlmICghT2JqZWN0LnZhbHVlcyhNZWRpYUZvcm1hdE1vZHVsZS5BdWRpb1NvdXJjZUluZm8pXG4gICAgICAgICAgICAgLnNvbWUodiA9PiB2ID09PSBzb3VyY2UpKSB7XG4gICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdJbnZhbGlkIHNvdXJjZS4nKTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogQG1lbWJlciB7c3RyaW5nfSBzb3VyY2VcbiAgICAgKiBAbWVtYmVyb2YgSWNzLkJhc2UuQXVkaW9UcmFja0NvbnN0cmFpbnRzXG4gICAgICogQGRlc2MgVmFsdWVzIGNvdWxkIGJlIFwibWljXCIsIFwic2NyZWVuLWNhc3RcIiwgXCJmaWxlXCIgb3IgXCJtaXhlZFwiLlxuICAgICAqIEBpbnN0YW5jZVxuICAgICAqL1xuICAgIHRoaXMuc291cmNlID0gc291cmNlO1xuICAgIC8qKlxuICAgICAqIEBtZW1iZXIge3N0cmluZ30gZGV2aWNlSWRcbiAgICAgKiBAbWVtYmVyb2YgSWNzLkJhc2UuQXVkaW9UcmFja0NvbnN0cmFpbnRzXG4gICAgICogQGRlc2MgRG8gbm90IHByb3ZpZGUgZGV2aWNlSWQgaWYgc291cmNlIGlzIG5vdCBcIm1pY1wiLlxuICAgICAqIEBpbnN0YW5jZVxuICAgICAqIEBzZWUgaHR0cHM6Ly93M2MuZ2l0aHViLmlvL21lZGlhY2FwdHVyZS1tYWluLyNkZWYtY29uc3RyYWludC1kZXZpY2VJZFxuICAgICAqL1xuICAgICB0aGlzLmRldmljZUlkID0gdW5kZWZpbmVkO1xuICB9XG59XG5cbi8qKlxuICogQGNsYXNzIFZpZGVvVHJhY2tDb25zdHJhaW50c1xuICogQGNsYXNzRGVzYyBDb25zdHJhaW50cyBmb3IgY3JlYXRpbmcgYSB2aWRlbyBNZWRpYVN0cmVhbVRyYWNrLlxuICogQG1lbWJlcm9mIEljcy5CYXNlXG4gKiBAY29uc3RydWN0b3JcbiAqIEBwYXJhbSB7SWNzLkJhc2UuVmlkZW9Tb3VyY2VJbmZvfSBzb3VyY2UgU291cmNlIGluZm8gb2YgdGhpcyB2aWRlbyB0cmFjay5cbiAqL1xuZXhwb3J0IGNsYXNzIFZpZGVvVHJhY2tDb25zdHJhaW50cyB7XG4gIGNvbnN0cnVjdG9yKHNvdXJjZSkge1xuICAgIGlmICghT2JqZWN0LnZhbHVlcyhNZWRpYUZvcm1hdE1vZHVsZS5WaWRlb1NvdXJjZUluZm8pXG4gICAgICAgICAgICAgLnNvbWUodiA9PiB2ID09PSBzb3VyY2UpKSB7XG4gICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdJbnZhbGlkIHNvdXJjZS4nKTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogQG1lbWJlciB7c3RyaW5nfSBzb3VyY2VcbiAgICAgKiBAbWVtYmVyb2YgSWNzLkJhc2UuVmlkZW9UcmFja0NvbnN0cmFpbnRzXG4gICAgICogQGRlc2MgVmFsdWVzIGNvdWxkIGJlIFwiY2FtZXJhXCIsIFwic2NyZWVuLWNhc3RcIiwgXCJmaWxlXCIgb3IgXCJtaXhlZFwiLlxuICAgICAqIEBpbnN0YW5jZVxuICAgICAqL1xuICAgIHRoaXMuc291cmNlID0gc291cmNlO1xuICAgIC8qKlxuICAgICAqIEBtZW1iZXIge3N0cmluZ30gZGV2aWNlSWRcbiAgICAgKiBAbWVtYmVyb2YgSWNzLkJhc2UuVmlkZW9UcmFja0NvbnN0cmFpbnRzXG4gICAgICogQGRlc2MgRG8gbm90IHByb3ZpZGUgZGV2aWNlSWQgaWYgc291cmNlIGlzIG5vdCBcImNhbWVyYVwiLlxuICAgICAqIEBpbnN0YW5jZVxuICAgICAqIEBzZWUgaHR0cHM6Ly93M2MuZ2l0aHViLmlvL21lZGlhY2FwdHVyZS1tYWluLyNkZWYtY29uc3RyYWludC1kZXZpY2VJZFxuICAgICAqL1xuXG4gICAgdGhpcy5kZXZpY2VJZCA9IHVuZGVmaW5lZDtcblxuICAgIC8qKlxuICAgICAqIEBtZW1iZXIge0ljcy5CYXNlLlJlc29sdXRpb259IHJlc29sdXRpb25cbiAgICAgKiBAbWVtYmVyb2YgSWNzLkJhc2UuVmlkZW9UcmFja0NvbnN0cmFpbnRzXG4gICAgICogQGluc3RhbmNlXG4gICAgICovXG4gICAgdGhpcy5yZXNvbHV0aW9uID0gdW5kZWZpbmVkO1xuXG4gICAgLyoqXG4gICAgICogQG1lbWJlciB7bnVtYmVyfSBmcmFtZVJhdGVcbiAgICAgKiBAbWVtYmVyb2YgSWNzLkJhc2UuVmlkZW9UcmFja0NvbnN0cmFpbnRzXG4gICAgICogQGluc3RhbmNlXG4gICAgICovXG4gICAgdGhpcy5mcmFtZVJhdGUgPSB1bmRlZmluZWQ7XG4gIH1cbn1cbi8qKlxuICogQGNsYXNzIFN0cmVhbUNvbnN0cmFpbnRzXG4gKiBAY2xhc3NEZXNjIENvbnN0cmFpbnRzIGZvciBjcmVhdGluZyBhIE1lZGlhU3RyZWFtIGZyb20gc2NyZWVuIG1pYyBhbmQgY2FtZXJhLlxuICogQG1lbWJlcm9mIEljcy5CYXNlXG4gKiBAY29uc3RydWN0b3JcbiAqIEBwYXJhbSB7P0ljcy5CYXNlLkF1ZGlvVHJhY2tDb25zdHJhaW50c30gYXVkaW9Db25zdHJhaW50c1xuICogQHBhcmFtIHs/SWNzLkJhc2UuVmlkZW9UcmFja0NvbnN0cmFpbnRzfSB2aWRlb0NvbnN0cmFpbnRzXG4gKi9cbmV4cG9ydCBjbGFzcyBTdHJlYW1Db25zdHJhaW50cyB7XG4gIGNvbnN0cnVjdG9yKGF1ZGlvQ29uc3RyYWludHMgPSBmYWxzZSwgdmlkZW9Db25zdHJhaW50cyA9IGZhbHNlKSB7XG4gICAgLyoqXG4gICAgICogQG1lbWJlciB7SWNzLkJhc2UuTWVkaWFTdHJlYW1UcmFja0RldmljZUNvbnN0cmFpbnRzRm9yQXVkaW99IGF1ZGlvXG4gICAgICogQG1lbWJlcm9mIEljcy5CYXNlLk1lZGlhU3RyZWFtRGV2aWNlQ29uc3RyYWludHNcbiAgICAgKiBAaW5zdGFuY2VcbiAgICAgKi9cbiAgICB0aGlzLmF1ZGlvID0gYXVkaW9Db25zdHJhaW50cztcbiAgICAvKipcbiAgICAgKiBAbWVtYmVyIHtJY3MuQmFzZS5NZWRpYVN0cmVhbVRyYWNrRGV2aWNlQ29uc3RyYWludHNGb3JWaWRlb30gVmlkZW9cbiAgICAgKiBAbWVtYmVyb2YgSWNzLkJhc2UuTWVkaWFTdHJlYW1EZXZpY2VDb25zdHJhaW50c1xuICAgICAqIEBpbnN0YW5jZVxuICAgICAqL1xuICAgIHRoaXMudmlkZW8gPSB2aWRlb0NvbnN0cmFpbnRzO1xuICAgIC8qKlxuICAgICAqIEBtZW1iZXIge3N0cmluZ30gZXh0ZW5zaW9uSWRcbiAgICAgKiBAbWVtYmVyb2YgSWNzLkJhc2UuTWVkaWFTdHJlYW1EZXZpY2VDb25zdHJhaW50c1xuICAgICAqIEBkZXNjIFRoZSBJRCBvZiBDaHJvbWUgRXh0ZW5zaW9uIGZvciBzY3JlZW4gc2hhcmluZy5cbiAgICAgKiBAaW5zdGFuY2VcbiAgICAgKi9cbiAgfVxufVxuXG5mdW5jdGlvbiBpc1ZpZGVvQ29uc3RyYWluc0ZvclNjcmVlbkNhc3QoY29uc3RyYWludHMpIHtcbiAgcmV0dXJuICh0eXBlb2YgY29uc3RyYWludHMudmlkZW8gPT09ICdvYmplY3QnICYmIGNvbnN0cmFpbnRzLnZpZGVvLnNvdXJjZSA9PT1cbiAgICBNZWRpYUZvcm1hdE1vZHVsZS5WaWRlb1NvdXJjZUluZm8uU0NSRUVOQ0FTVCk7XG59XG5cbi8qKlxuICogQGNsYXNzIE1lZGlhU3RyZWFtRmFjdG9yeVxuICogQGNsYXNzRGVzYyBBIGZhY3RvcnkgdG8gY3JlYXRlIE1lZGlhU3RyZWFtLiBZb3UgY2FuIGFsc28gY3JlYXRlIE1lZGlhU3RyZWFtIGJ5IHlvdXJzZWxmLlxuICogQG1lbWJlcm9mIEljcy5CYXNlXG4gKi9cbmV4cG9ydCBjbGFzcyBNZWRpYVN0cmVhbUZhY3Rvcnkge1xuICAvKipcbiAgICogQGZ1bmN0aW9uIGNyZWF0ZU1lZGlhU3RyZWFtXG4gICAqIEBzdGF0aWNcbiAgICogQGRlc2MgQ3JlYXRlIGEgTWVkaWFTdHJlYW0gd2l0aCBnaXZlbiBjb25zdHJhaW50cy4gSWYgeW91IHdhbnQgdG8gY3JlYXRlIGEgTWVkaWFTdHJlYW0gZm9yIHNjcmVlbiBjYXN0LCBwbGVhc2UgbWFrZSBzdXJlIGJvdGggYXVkaW8gYW5kIHZpZGVvJ3Mgc291cmNlIGFyZSBcInNjcmVlbi1jYXN0XCIuXG4gICAqIEBtZW1iZXJvZiBJY3MuQmFzZS5NZWRpYVN0cmVhbUZhY3RvcnlcbiAgICogQHJldHVybnMge1Byb21pc2U8TWVkaWFTdHJlYW0sIEVycm9yPn0gUmV0dXJuIGEgcHJvbWlzZSB0aGF0IGlzIHJlc29sdmVkIHdoZW4gc3RyZWFtIGlzIHN1Y2Nlc3NmdWxseSBjcmVhdGVkLCBvciByZWplY3RlZCBpZiBvbmUgb2YgdGhlIGZvbGxvd2luZyBlcnJvciBoYXBwZW5lZDpcbiAgICogLSBPbmUgb3IgbW9yZSBwYXJhbWV0ZXJzIGNhbm5vdCBiZSBzYXRpc2ZpZWQuXG4gICAqIC0gU3BlY2lmaWVkIGRldmljZSBpcyBidXN5LlxuICAgKiAtIENhbm5vdCBvYnRhaW4gbmVjZXNzYXJ5IHBlcm1pc3Npb24gb3Igb3BlcmF0aW9uIGlzIGNhbmNlbGVkIGJ5IHVzZXIuXG4gICAqIC0gVmlkZW8gc291cmNlIGlzIHNjcmVlbiBjYXN0LCB3aGlsZSBhdWRpbyBzb3VyY2UgaXMgbm90LlxuICAgKiAtIEF1ZGlvIHNvdXJjZSBpcyBzY3JlZW4gY2FzdCwgd2hpbGUgdmlkZW8gc291cmNlIGlzIGRpc2FibGVkLlxuICAgKiBAcGFyYW0ge0ljcy5CYXNlLk1lZGlhU3RyZWFtRGV2aWNlQ29uc3RyYWludHN8SWNzLkJhc2UuTWVkaWFTdHJlYW1TY3JlZW5DYXN0Q29uc3RyYWludHN9IGNvbnN0cmFpbnRzXG4gICAqL1xuICBzdGF0aWMgY3JlYXRlTWVkaWFTdHJlYW0oY29uc3RyYWludHMpIHtcbiAgICBpZiAodHlwZW9mIGNvbnN0cmFpbnRzICE9PSAnb2JqZWN0JyB8fCAoIWNvbnN0cmFpbnRzLmF1ZGlvICYmICFcbiAgICAgICAgY29uc3RyYWludHMudmlkZW8pKSB7XG4gICAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QobmV3IFR5cGVFcnJvcignSW52YWxpZCBjb25zdHJhaW5zJykpO1xuICAgIH1cbiAgICBpZiAoIWlzVmlkZW9Db25zdHJhaW5zRm9yU2NyZWVuQ2FzdChjb25zdHJhaW50cykgJiYgKHR5cGVvZiBjb25zdHJhaW50cy5hdWRpbyA9PT1cbiAgICAgICAgJ29iamVjdCcpICYmIGNvbnN0cmFpbnRzLmF1ZGlvLnNvdXJjZSA9PT0gTWVkaWFGb3JtYXRNb2R1bGUuQXVkaW9Tb3VyY2VJbmZvXG4gICAgICAuU0NSRUVOQ0FTVCkge1xuICAgICAgcmV0dXJuIFByb21pc2UucmVqZWN0KG5ldyBUeXBlRXJyb3IoJ0Nhbm5vdCBzaGFyZSBzY3JlZW4gd2l0aG91dCB2aWRlby4nKSk7XG4gICAgfVxuICAgIGlmIChpc1ZpZGVvQ29uc3RyYWluc0ZvclNjcmVlbkNhc3QoY29uc3RyYWludHMpICYmICF1dGlscy5pc0Nocm9tZSgpICYmICF1dGlsc1xuICAgICAgLmlzRmlyZWZveCgpKSB7XG4gICAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QobmV3IFR5cGVFcnJvcihcbiAgICAgICAgJ1NjcmVlbiBzaGFyaW5nIG9ubHkgc3VwcG9ydHMgQ2hyb21lIGFuZCBGaXJlZm94LicpKTtcbiAgICB9XG4gICAgaWYgKGlzVmlkZW9Db25zdHJhaW5zRm9yU2NyZWVuQ2FzdChjb25zdHJhaW50cykgJiYgdHlwZW9mIGNvbnN0cmFpbnRzLmF1ZGlvID09PVxuICAgICAgJ29iamVjdCcgJiYgY29uc3RyYWludHMuYXVkaW8uc291cmNlICE9PSBNZWRpYUZvcm1hdE1vZHVsZS5BdWRpb1NvdXJjZUluZm9cbiAgICAgIC5TQ1JFRU5DQVNUKSB7XG4gICAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QobmV3IFR5cGVFcnJvcihcbiAgICAgICAgJ0Nhbm5vdCBjYXB0dXJlIHZpZGVvIGZyb20gc2NyZWVuIGNhc3Qgd2hpbGUgY2FwdHVyZSBhdWRpbyBmcm9tIG90aGVyIHNvdXJjZS4nXG4gICAgICApKTtcbiAgICB9O1xuICAgIC8vIFNjcmVlbiBzaGFyaW5nIG9uIENocm9tZSBkb2VzIG5vdCB3b3JrIHdpdGggdGhlIGxhdGVzdCBjb25zdHJhaW50cyBmb3JtYXQuXG4gICAgaWYgKGlzVmlkZW9Db25zdHJhaW5zRm9yU2NyZWVuQ2FzdChjb25zdHJhaW50cykgJiYgdXRpbHMuaXNDaHJvbWUoKSkge1xuICAgICAgaWYgKCFjb25zdHJhaW50cy5leHRlbnNpb25JZCkge1xuICAgICAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QobmV3IFR5cGVFcnJvcihcbiAgICAgICAgICAnRXh0ZW5zaW9uIElEIG11c3QgYmUgc3BlY2lmaWVkIGZvciBzY3JlZW4gc2hhcmluZyBvbiBDaHJvbWUuJykpO1xuICAgICAgfVxuICAgICAgY29uc3QgZGVza3RvcENhcHR1cmVTb3VyY2VzID0gWydzY3JlZW4nLCAnd2luZG93JywgJ3RhYiddO1xuICAgICAgaWYgKGNvbnN0cmFpbnRzLmF1ZGlvKSB7XG4gICAgICAgIGRlc2t0b3BDYXB0dXJlU291cmNlcy5wdXNoKCdhdWRpbycpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgY2hyb21lLnJ1bnRpbWUuc2VuZE1lc3NhZ2UoY29uc3RyYWludHMuZXh0ZW5zaW9uSWQsIHtcbiAgICAgICAgICBnZXRTdHJlYW06IGRlc2t0b3BDYXB0dXJlU291cmNlc1xuICAgICAgICB9LCBmdW5jdGlvbihyZXNwb25zZSkge1xuICAgICAgICAgIGlmIChyZXNwb25zZSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICByZXR1cm4gcmVqZWN0KG5ldyBFcnJvcihjaHJvbWUucnVudGltZS5sYXN0RXJyb3IubWVzc2FnZSkpO1xuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAoY29uc3RyYWludHMuYXVkaW8gJiYgdHlwZW9mIHJlc3BvbnNlLm9wdGlvbnMgIT09XG4gICAgICAgICAgICAnb2JqZWN0Jykge1xuICAgICAgICAgICAgTG9nZ2VyLndhcm5pbmcoXG4gICAgICAgICAgICAgICdEZXNrdG9wIHNoYXJpbmcgd2l0aCBhdWRpbyByZXF1aXJlcyB0aGUgbGF0ZXN0IENocm9tZSBleHRlbnNpb24uIFlvdXIgYXVkaW8gY29uc3RyYWludHMgd2lsbCBiZSBpZ25vcmVkLidcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgfVxuICAgICAgICAgIGNvbnN0IG1lZGlhQ29uc3RyYWludHMgPSBPYmplY3QuY3JlYXRlKHt9KTtcbiAgICAgICAgICBpZiAoY29uc3RyYWludHMuYXVkaW8gJiYgKHR5cGVvZiByZXNwb25zZS5vcHRpb25zID09PVxuICAgICAgICAgICAgICAnb2JqZWN0JykpIHtcbiAgICAgICAgICAgIGlmIChyZXNwb25zZS5vcHRpb25zLmNhblJlcXVlc3RBdWRpb1RyYWNrKSB7XG4gICAgICAgICAgICAgIG1lZGlhQ29uc3RyYWludHMuYXVkaW8gPSB7XG4gICAgICAgICAgICAgICAgbWFuZGF0b3J5OiB7XG4gICAgICAgICAgICAgICAgICBjaHJvbWVNZWRpYVNvdXJjZTogJ2Rlc2t0b3AnLFxuICAgICAgICAgICAgICAgICAgY2hyb21lTWVkaWFTb3VyY2VJZDogcmVzcG9uc2Uuc3RyZWFtSWRcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIExvZ2dlci53YXJuaW5nKFxuICAgICAgICAgICAgICAgICdTaGFyaW5nIHNjcmVlbiB3aXRoIGF1ZGlvIHdhcyBub3Qgc2VsZWN0ZWQgYnkgdXNlci4nXG4gICAgICAgICAgICAgICk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICAgIG1lZGlhQ29uc3RyYWludHMudmlkZW8gPSBPYmplY3QuY3JlYXRlKHt9KTtcbiAgICAgICAgICBtZWRpYUNvbnN0cmFpbnRzLnZpZGVvLm1hbmRhdG9yeSA9IE9iamVjdC5jcmVhdGUoe30pO1xuICAgICAgICAgIG1lZGlhQ29uc3RyYWludHMudmlkZW8ubWFuZGF0b3J5LmNocm9tZU1lZGlhU291cmNlID1cbiAgICAgICAgICAgICdkZXNrdG9wJztcbiAgICAgICAgICBtZWRpYUNvbnN0cmFpbnRzLnZpZGVvLm1hbmRhdG9yeS5jaHJvbWVNZWRpYVNvdXJjZUlkID1cbiAgICAgICAgICAgIHJlc3BvbnNlLnN0cmVhbUlkO1xuICAgICAgICAgIC8vIFRyYW5zZm9ybSBuZXcgY29uc3RyYWludCBmb3JtYXQgdG8gdGhlIG9sZCBzdHlsZS4gQmVjYXVzZSBjaHJvbWVNZWRpYVNvdXJjZSBvbmx5IHN1cHBvcnRlZCBpbiB0aGUgb2xkIHN0eWxlLCBhbmQgbWl4IG5ldyBhbmQgb2xkIHN0eWxlIHdpbGwgcmVzdWx0IHR5cGUgZXJyb3I6IFwiQ2Fubm90IHVzZSBib3RoIG9wdGlvbmFsL21hbmRhdG9yeSBhbmQgc3BlY2lmaWMgb3IgYWR2YW5jZWQgY29uc3RyYWludHMuXCIuXG4gICAgICAgICAgaWYgKGNvbnN0cmFpbnRzLnZpZGVvLnJlc29sdXRpb24pIHtcbiAgICAgICAgICAgIG1lZGlhQ29uc3RyYWludHMudmlkZW8ubWFuZGF0b3J5Lm1heEhlaWdodCA9XG4gICAgICAgICAgICAgIG1lZGlhQ29uc3RyYWludHMudmlkZW8ubWFuZGF0b3J5Lm1pbkhlaWdodCA9XG4gICAgICAgICAgICAgIGNvbnN0cmFpbnRzLnZpZGVvLnJlc29sdXRpb24uaGVpZ2h0O1xuICAgICAgICAgICAgbWVkaWFDb25zdHJhaW50cy52aWRlby5tYW5kYXRvcnkubWF4V2lkdGggPVxuICAgICAgICAgICAgICBtZWRpYUNvbnN0cmFpbnRzLnZpZGVvLm1hbmRhdG9yeS5taW5XaWR0aCA9XG4gICAgICAgICAgICAgIGNvbnN0cmFpbnRzLnZpZGVvLnJlc29sdXRpb24ud2lkdGg7XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmIChjb25zdHJhaW50cy52aWRlby5mcmFtZVJhdGUpIHtcbiAgICAgICAgICAgIG1lZGlhQ29uc3RyYWludHMudmlkZW8ubWFuZGF0b3J5Lm1pbkZyYW1lUmF0ZSA9IGNvbnN0cmFpbnRzLnZpZGVvLmZyYW1lUmF0ZTtcbiAgICAgICAgICAgIG1lZGlhQ29uc3RyYWludHMudmlkZW8ubWFuZGF0b3J5Lm1heEZyYW1lUmF0ZSA9XG4gICAgICAgICAgICAgIGNvbnN0cmFpbnRzLnZpZGVvLmZyYW1lUmF0ZTtcbiAgICAgICAgICB9XG4gICAgICAgICAgcmVzb2x2ZShuYXZpZ2F0b3IubWVkaWFEZXZpY2VzLmdldFVzZXJNZWRpYShcbiAgICAgICAgICAgIG1lZGlhQ29uc3RyYWludHMpKTtcbiAgICAgICAgfSk7XG4gICAgICB9KVxuICAgIH0gZWxzZSB7XG4gICAgICBpZiAoIWNvbnN0cmFpbnRzLmF1ZGlvICYmICFjb25zdHJhaW50cy52aWRlbykge1xuICAgICAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QobmV3IFR5cGVFcnJvcihcbiAgICAgICAgICAnQXQgbGVhc3Qgb25lIG9mIGF1ZGlvIGFuZCB2aWRlbyBtdXN0IGJlIHJlcXVlc3RlZC4nKSk7XG4gICAgICB9XG4gICAgICBjb25zdCBtZWRpYUNvbnN0cmFpbnRzID0gT2JqZWN0LmNyZWF0ZSh7fSk7XG4gICAgICBpZiAodHlwZW9mIGNvbnN0cmFpbnRzLmF1ZGlvID09PSAnb2JqZWN0JyAmJiBjb25zdHJhaW50cy5hdWRpby5zb3VyY2UgPT09XG4gICAgICAgIE1lZGlhRm9ybWF0TW9kdWxlLkF1ZGlvU291cmNlSW5mby5NSUMpIHtcbiAgICAgICAgbWVkaWFDb25zdHJhaW50cy5hdWRpbyA9IE9iamVjdC5jcmVhdGUoe30pO1xuICAgICAgICBtZWRpYUNvbnN0cmFpbnRzLmF1ZGlvLmRldmljZUlkID0gY29uc3RyYWludHMuYXVkaW8uZGV2aWNlSWQ7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBtZWRpYUNvbnN0cmFpbnRzLmF1ZGlvID0gY29uc3RyYWludHMuYXVkaW87XG4gICAgICB9XG4gICAgICBpZiAodHlwZW9mIGNvbnN0cmFpbnRzLmF1ZGlvID09PSAnb2JqZWN0JyAmJiBjb25zdHJhaW50cy5hdWRpby5zb3VyY2UgPT09XG4gICAgICAgIE1lZGlhRm9ybWF0TW9kdWxlLkF1ZGlvU291cmNlSW5mby5TQ1JFRU5DQVNUKSB7XG4gICAgICAgIExvZ2dlci53YXJuaW5nKFxuICAgICAgICAgICdTY3JlZW4gc2hhcmluZyB3aXRoIGF1ZGlvIGlzIG5vdCBzdXBwb3J0ZWQgaW4gRmlyZWZveC4nKTtcbiAgICAgICAgbWVkaWFDb25zdHJhaW50cy5hdWRpbyA9IGZhbHNlO1xuICAgICAgfVxuICAgICAgaWYgKHR5cGVvZiBjb25zdHJhaW50cy52aWRlbyA9PT0gJ29iamVjdCcpIHtcbiAgICAgICAgbWVkaWFDb25zdHJhaW50cy52aWRlbyA9IE9iamVjdC5jcmVhdGUoe30pO1xuICAgICAgICBpZiAodHlwZW9mIGNvbnN0cmFpbnRzLnZpZGVvLmZyYW1lUmF0ZSA9PT0gJ251bWJlcicpIHtcbiAgICAgICAgICBtZWRpYUNvbnN0cmFpbnRzLnZpZGVvLmZyYW1lUmF0ZSA9IGNvbnN0cmFpbnRzLnZpZGVvLmZyYW1lUmF0ZTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoY29uc3RyYWludHMudmlkZW8ucmVzb2x1dGlvbiAmJiBjb25zdHJhaW50cy52aWRlby5yZXNvbHV0aW9uLndpZHRoICYmXG4gICAgICAgICAgY29uc3RyYWludHMudmlkZW8ucmVzb2x1dGlvbi5oZWlnaHQpIHtcbiAgICAgICAgICBtZWRpYUNvbnN0cmFpbnRzLnZpZGVvLndpZHRoID0gT2JqZWN0LmNyZWF0ZSh7fSk7XG4gICAgICAgICAgbWVkaWFDb25zdHJhaW50cy52aWRlby53aWR0aC5leGFjdCA9IGNvbnN0cmFpbnRzLnZpZGVvLnJlc29sdXRpb24ud2lkdGg7XG4gICAgICAgICAgbWVkaWFDb25zdHJhaW50cy52aWRlby5oZWlnaHQgPSBPYmplY3QuY3JlYXRlKHt9KTtcbiAgICAgICAgICBtZWRpYUNvbnN0cmFpbnRzLnZpZGVvLmhlaWdodC5leGFjdCA9IGNvbnN0cmFpbnRzLnZpZGVvLnJlc29sdXRpb24uaGVpZ2h0O1xuICAgICAgICB9XG4gICAgICAgIGlmIChjb25zdHJhaW50cy52aWRlby5kZXZpY2VJZCBpbnN0YW5jZW9mIFN0cmluZykge1xuICAgICAgICAgIG1lZGlhQ29uc3RyYWludHMudmlkZW8uZGV2aWNlSWQgPSBjb25zdHJhaW50cy52aWRlby5kZXZpY2VJZDtcbiAgICAgICAgfVxuICAgICAgICBpZiAodXRpbHMuaXNGaXJlZm94KCkgJiYgY29uc3RyYWludHMudmlkZW8uc291cmNlID09PVxuICAgICAgICAgIE1lZGlhRm9ybWF0TW9kdWxlLlZpZGVvU291cmNlSW5mby5TQ1JFRU5DQVNUKSB7XG4gICAgICAgICAgbWVkaWFDb25zdHJhaW50cy52aWRlby5tZWRpYVNvdXJjZSA9ICdzY3JlZW4nO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBtZWRpYUNvbnN0cmFpbnRzLnZpZGVvID0gY29uc3RyYWludHMudmlkZW87XG4gICAgICB9XG4gICAgICByZXR1cm4gbmF2aWdhdG9yLm1lZGlhRGV2aWNlcy5nZXRVc2VyTWVkaWEobWVkaWFDb25zdHJhaW50cyk7XG4gICAgfVxuICB9XG59XG4iLCIvLyBDb3B5cmlnaHQgwqkgMjAxNyBJbnRlbCBDb3Jwb3JhdGlvbi4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cblxuJ3VzZSBzdHJpY3QnO1xuXG5pbXBvcnQgKiBhcyBVdGlscyBmcm9tICcuL3V0aWxzLmpzJ1xuaW1wb3J0ICogYXMgTWVkaWFGb3JtYXQgZnJvbSAnLi9tZWRpYWZvcm1hdC5qcydcbmltcG9ydCB7IEV2ZW50RGlzcGF0Y2hlcn0gZnJvbSAnLi4vYmFzZS9ldmVudC5qcydcblxuLyoqXG4gKiBAY2xhc3MgQXVkaW9QdWJsaWNhdGlvblNldHRpbmdzXG4gKiBAbWVtYmVyT2YgSWNzLkJhc2VcbiAqIEBjbGFzc0Rlc2MgVGhlIGF1ZGlvIHNldHRpbmdzIG9mIGEgcHVibGljYXRpb24uXG4gKiBAaGlkZWNvbnN0cnVjdG9yXG4gKi9cbmV4cG9ydCBjbGFzcyBBdWRpb1B1YmxpY2F0aW9uU2V0dGluZ3Mge1xuICBjb25zdHJ1Y3Rvcihjb2RlYykge1xuICAgIC8qKlxuICAgICAqIEBtZW1iZXIgez9JY3MuQmFzZS5BdWRpb0NvZGVjUGFyYW1ldGVyc30gY29kZWNcbiAgICAgKiBAaW5zdGFuY2VcbiAgICAgKiBAbWVtYmVyb2YgSWNzLkJhc2UuQXVkaW9QdWJsaWNhdGlvblNldHRpbmdzXG4gICAgICovXG4gICAgdGhpcy5jb2RlYyA9IGNvZGVjO1xuICB9XG59XG5cbi8qKlxuICogQGNsYXNzIFZpZGVvUHVibGljYXRpb25TZXR0aW5nc1xuICogQG1lbWJlck9mIEljcy5CYXNlXG4gKiBAY2xhc3NEZXNjIFRoZSB2aWRlbyBzZXR0aW5ncyBvZiBhIHB1YmxpY2F0aW9uLlxuICogQGhpZGVjb25zdHJ1Y3RvclxuICovXG5leHBvcnQgY2xhc3MgVmlkZW9QdWJsaWNhdGlvblNldHRpbmdzIHtcbiAgY29uc3RydWN0b3IoY29kZWMsIHJlc29sdXRpb24sIGZyYW1lUmF0ZSwgYml0cmF0ZSwga2V5RnJhbWVJbnRlcnZhbCl7XG4gICAgLyoqXG4gICAgICogQG1lbWJlciB7P0ljcy5CYXNlLlZpZGVvQ29kZWNQYXJhbWV0ZXJzfSBjb2RlY1xuICAgICAqIEBpbnN0YW5jZVxuICAgICAqIEBtZW1iZXJvZiBJY3MuQmFzZS5WaWRlb1B1YmxpY2F0aW9uU2V0dGluZ3NcbiAgICAgKi9cbiAgICB0aGlzLmNvZGVjPWNvZGVjLFxuICAgIC8qKlxuICAgICAqIEBtZW1iZXIgez9JY3MuQmFzZS5SZXNvbHV0aW9ufSByZXNvbHV0aW9uXG4gICAgICogQGluc3RhbmNlXG4gICAgICogQG1lbWJlcm9mIEljcy5CYXNlLlZpZGVvUHVibGljYXRpb25TZXR0aW5nc1xuICAgICAqL1xuICAgIHRoaXMucmVzb2x1dGlvbj1yZXNvbHV0aW9uO1xuICAgIC8qKlxuICAgICAqIEBtZW1iZXIgez9udW1iZXJ9IGZyYW1lUmF0ZXNcbiAgICAgKiBAaW5zdGFuY2VcbiAgICAgKiBAbWVtYmVyb2YgSWNzLkJhc2UuVmlkZW9QdWJsaWNhdGlvblNldHRpbmdzXG4gICAgICovXG4gICAgdGhpcy5mcmFtZVJhdGU9ZnJhbWVSYXRlO1xuICAgIC8qKlxuICAgICAqIEBtZW1iZXIgez9udW1iZXJ9IGJpdHJhdGVcbiAgICAgKiBAaW5zdGFuY2VcbiAgICAgKiBAbWVtYmVyb2YgSWNzLkJhc2UuVmlkZW9QdWJsaWNhdGlvblNldHRpbmdzXG4gICAgICovXG4gICAgdGhpcy5iaXRyYXRlPWJpdHJhdGU7XG4gICAgLyoqXG4gICAgICogQG1lbWJlciB7P251bWJlcn0ga2V5RnJhbWVJbnRlcnZhbHNcbiAgICAgKiBAaW5zdGFuY2VcbiAgICAgKiBAbWVtYmVyb2YgSWNzLkJhc2UuVmlkZW9QdWJsaWNhdGlvblNldHRpbmdzXG4gICAgICovXG4gICAgdGhpcy5rZXlGcmFtZUludGVydmFsPWtleUZyYW1lSW50ZXJ2YWw7XG4gIH1cbn1cblxuLyoqXG4gKiBAY2xhc3MgUHVibGljYXRpb25TZXR0aW5nc1xuICogQG1lbWJlck9mIEljcy5CYXNlXG4gKiBAY2xhc3NEZXNjIFRoZSBzZXR0aW5ncyBvZiBhIHB1YmxpY2F0aW9uLlxuICogQGhpZGVjb25zdHJ1Y3RvclxuICovXG5leHBvcnQgY2xhc3MgUHVibGljYXRpb25TZXR0aW5ncyB7XG4gIGNvbnN0cnVjdG9yKGF1ZGlvLCB2aWRlbyl7XG4gICAgLyoqXG4gICAgICogQG1lbWJlciB7SWNzLkJhc2UuQXVkaW9QdWJsaWNhdGlvblNldHRpbmdzfSBhdWRpb1xuICAgICAqIEBpbnN0YW5jZVxuICAgICAqIEBtZW1iZXJvZiBJY3MuQmFzZS5QdWJsaWNhdGlvblNldHRpbmdzXG4gICAgICovXG4gICAgdGhpcy5hdWRpbz1hdWRpbztcbiAgICAvKipcbiAgICAgKiBAbWVtYmVyIHtJY3MuQmFzZS5WaWRlb1B1YmxpY2F0aW9uU2V0dGluZ3N9IHZpZGVvXG4gICAgICogQGluc3RhbmNlXG4gICAgICogQG1lbWJlcm9mIEljcy5CYXNlLlB1YmxpY2F0aW9uU2V0dGluZ3NcbiAgICAgKi9cbiAgICB0aGlzLnZpZGVvPXZpZGVvO1xuICB9XG59XG5cbi8qKlxuICogQGNsYXNzIFB1YmxpY2F0aW9uXG4gKiBAbWVtYmVyT2YgSWNzLkJhc2VcbiAqIEBjbGFzc0Rlc2MgUHVibGljYXRpb24gcmVwcmVzZW50cyBhIHNlbmRlciBmb3IgcHVibGlzaGluZyBhIHN0cmVhbS4gSXQgaGFuZGxlcyB0aGUgYWN0aW9ucyBvbiBhIExvY2FsU3RyZWFtIHB1Ymxpc2hlZCB0byBhIGNvbmZlcmVuY2UuXG4gKiBFdmVudHM6XG4gKlxuICogfCBFdmVudCBOYW1lICAgICAgfCBBcmd1bWVudCBUeXBlICAgIHwgRmlyZWQgd2hlbiAgICAgICB8XG4gKiB8IC0tLS0tLS0tLS0tLS0tLS18IC0tLS0tLS0tLS0tLS0tLS0gfCAtLS0tLS0tLS0tLS0tLS0tIHxcbiAqIHwgZW5kZWQgICAgICAgICAgIHwgRXZlbnQgICAgICAgICAgICB8IFB1YmxpY2F0aW9uIGlzIGVuZGVkLiB8XG4gKiB8IG11dGUgICAgICAgICAgICB8IE11dGVFdmVudCAgICAgICAgfCBQdWJsaWNhdGlvbiBpcyBtdXRlZC4gQ2xpZW50IHN0b3BwZWQgc2VuZGluZyBhdWRpbyBhbmQvb3IgdmlkZW8gZGF0YSB0byByZW1vdGUgZW5kcG9pbnQuIHxcbiAqIHwgdW5tdXRlICAgICAgICAgIHwgTXV0ZUV2ZW50ICAgICAgICB8IFB1YmxpY2F0aW9uIGlzIHVubXV0ZWQuIENsaWVudCBjb250aW51ZWQgc2VuZGluZyBhdWRpbyBhbmQvb3IgdmlkZW8gZGF0YSB0byByZW1vdGUgZW5kcG9pbnQuIHxcbiAqXG4gKiBAaGlkZWNvbnN0cnVjdG9yXG4gKi9cbmV4cG9ydCBjbGFzcyBQdWJsaWNhdGlvbiBleHRlbmRzIEV2ZW50RGlzcGF0Y2hlciB7XG4gIGNvbnN0cnVjdG9yKGlkLCBzdG9wLCBnZXRTdGF0cywgbXV0ZSwgdW5tdXRlKSB7XG4gICAgc3VwZXIoKTtcbiAgICAvKipcbiAgICAgKiBAbWVtYmVyIHtzdHJpbmd9IGlkXG4gICAgICogQGluc3RhbmNlXG4gICAgICogQG1lbWJlcm9mIEljcy5CYXNlLlB1YmxpY2F0aW9uXG4gICAgICovXG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsICdpZCcsIHtcbiAgICAgIGNvbmZpZ3VyYWJsZTogZmFsc2UsXG4gICAgICB3cml0YWJsZTogZmFsc2UsXG4gICAgICB2YWx1ZTogaWQgPyBpZCA6IFV0aWxzLmNyZWF0ZVV1aWQoKVxuICAgIH0pO1xuICAgIC8qKlxuICAgICAqIEBmdW5jdGlvbiBzdG9wXG4gICAgICogQGluc3RhbmNlXG4gICAgICogQGRlc2MgU3RvcCBjZXJ0YWluIHB1YmxpY2F0aW9uLiBPbmNlIGEgc3Vic2NyaXB0aW9uIGlzIHN0b3BwZWQsIGl0IGNhbm5vdCBiZSByZWNvdmVyZWQuXG4gICAgICogQG1lbWJlcm9mIEljcy5CYXNlLlB1YmxpY2F0aW9uXG4gICAgICogQHJldHVybnMge3VuZGVmaW5lZH1cbiAgICAgKi9cbiAgICB0aGlzLnN0b3AgPSBzdG9wO1xuICAgIC8qKlxuICAgICAqIEBmdW5jdGlvbiBnZXRTdGF0c1xuICAgICAqIEBpbnN0YW5jZVxuICAgICAqIEBkZXNjIEdldCBzdGF0cyBvZiB1bmRlcmx5aW5nIFBlZXJDb25uZWN0aW9uLlxuICAgICAqIEBtZW1iZXJvZiBJY3MuQmFzZS5QdWJsaWNhdGlvblxuICAgICAqIEByZXR1cm5zIHtQcm9taXNlPFJUQ1N0YXRzUmVwb3J0LCBFcnJvcj59XG4gICAgICovXG4gICAgdGhpcy5nZXRTdGF0cyA9IGdldFN0YXRzO1xuICAgIC8qKlxuICAgICAqIEBmdW5jdGlvbiBtdXRlXG4gICAgICogQGluc3RhbmNlXG4gICAgICogQGRlc2MgU3RvcCBzZW5kaW5nIGRhdGEgdG8gcmVtb3RlIGVuZHBvaW50LlxuICAgICAqIEBtZW1iZXJvZiBJY3MuQmFzZS5QdWJsaWNhdGlvblxuICAgICAqIEBwYXJhbSB7SWNzLkJhc2UuVHJhY2tLaW5kIH0ga2luZCBLaW5kIG9mIHRyYWNrcyB0byBiZSBtdXRlZC5cbiAgICAgKiBAcmV0dXJucyB7UHJvbWlzZTx1bmRlZmluZWQsIEVycm9yPn1cbiAgICAgKi9cbiAgICB0aGlzLm11dGUgPSBtdXRlO1xuICAgIC8qKlxuICAgICAqIEBmdW5jdGlvbiB1bm11dGVcbiAgICAgKiBAaW5zdGFuY2VcbiAgICAgKiBAZGVzYyBDb250aW51ZSBzZW5kaW5nIGRhdGEgdG8gcmVtb3RlIGVuZHBvaW50LlxuICAgICAqIEBtZW1iZXJvZiBJY3MuQmFzZS5QdWJsaWNhdGlvblxuICAgICAqIEBwYXJhbSB7SWNzLkJhc2UuVHJhY2tLaW5kIH0ga2luZCBLaW5kIG9mIHRyYWNrcyB0byBiZSB1bm11dGVkLlxuICAgICAqIEByZXR1cm5zIHtQcm9taXNlPHVuZGVmaW5lZCwgRXJyb3I+fVxuICAgICAqL1xuICAgIHRoaXMudW5tdXRlID0gdW5tdXRlO1xuICB9XG59XG5cbi8qKlxuICogQGNsYXNzIFB1Ymxpc2hPcHRpb25zXG4gKiBAbWVtYmVyT2YgSWNzLkJhc2VcbiAqIEBjbGFzc0Rlc2MgUHVibGlzaE9wdGlvbnMgZGVmaW5lcyBvcHRpb25zIGZvciBwdWJsaXNoaW5nIGEgSWNzLkJhc2UuTG9jYWxTdHJlYW0uXG4gKi9cbmV4cG9ydCBjbGFzcyBQdWJsaXNoT3B0aW9ucyB7XG4gIGNvbnN0cnVjdG9yKGF1ZGlvLCB2aWRlbykge1xuICAgIC8qKlxuICAgICAqIEBtZW1iZXIgez9BcnJheTxJY3MuQmFzZS5BdWRpb0VuY29kaW5nUGFyYW1ldGVycz59IGF1ZGlvXG4gICAgICogQGluc3RhbmNlXG4gICAgICogQG1lbWJlcm9mIEljcy5CYXNlLlB1Ymxpc2hPcHRpb25zXG4gICAgICovXG4gICAgdGhpcy5hdWRpbyA9IGF1ZGlvO1xuICAgIC8qKlxuICAgICAqIEBtZW1iZXIgez9BcnJheTxJY3MuQmFzZS5WaWRlb0VuY29kaW5nUGFyYW1ldGVycz59IHZpZGVvXG4gICAgICogQGluc3RhbmNlXG4gICAgICogQG1lbWJlcm9mIEljcy5CYXNlLlB1Ymxpc2hPcHRpb25zXG4gICAgICovXG4gICAgdGhpcy52aWRlbyA9IHZpZGVvO1xuICB9XG59XG4iLCIvKlxuICogIENvcHlyaWdodCAoYykgMjAxNCBUaGUgV2ViUlRDIHByb2plY3QgYXV0aG9ycy4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiAgVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYSBCU0Qtc3R5bGUgbGljZW5zZVxuICogIHRoYXQgY2FuIGJlIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgaW4gdGhlIHJvb3Qgb2YgdGhlIHNvdXJjZVxuICogIHRyZWUuXG4gKi9cblxuLyogTW9yZSBpbmZvcm1hdGlvbiBhYm91dCB0aGVzZSBvcHRpb25zIGF0IGpzaGludC5jb20vZG9jcy9vcHRpb25zICovXG5cbi8qIGdsb2JhbHMgIGFkYXB0ZXIsIHRyYWNlICovXG4vKiBleHBvcnRlZCBzZXRDb2RlY1BhcmFtLCBpY2VDYW5kaWRhdGVUeXBlLCBmb3JtYXRUeXBlUHJlZmVyZW5jZSxcbiAgIG1heWJlU2V0T3B1c09wdGlvbnMsIG1heWJlUHJlZmVyQXVkaW9SZWNlaXZlQ29kZWMsXG4gICBtYXliZVByZWZlckF1ZGlvU2VuZENvZGVjLCBtYXliZVNldEF1ZGlvUmVjZWl2ZUJpdFJhdGUsXG4gICBtYXliZVNldEF1ZGlvU2VuZEJpdFJhdGUsIG1heWJlUHJlZmVyVmlkZW9SZWNlaXZlQ29kZWMsXG4gICBtYXliZVByZWZlclZpZGVvU2VuZENvZGVjLCBtYXliZVNldFZpZGVvUmVjZWl2ZUJpdFJhdGUsXG4gICBtYXliZVNldFZpZGVvU2VuZEJpdFJhdGUsIG1heWJlU2V0VmlkZW9TZW5kSW5pdGlhbEJpdFJhdGUsXG4gICBtYXliZVJlbW92ZVZpZGVvRmVjLCBtZXJnZUNvbnN0cmFpbnRzLCByZW1vdmVDb2RlY1BhcmFtKi9cblxuLyogVGhpcyBmaWxlIGlzIGJvcnJvd2VkIGZyb20gYXBwcnRjIHdpdGggc29tZSBtb2RpZmljYXRpb25zLiAqL1xuLyogQ29tbWl0IGhhc2g6IGM2YWYwYzI1ZTlhZjUyN2Y3MWIzYWNkZDZiZmExMzg5ZDc3OGY3YmQgKyBQUiA1MzAgKi9cblxuaW1wb3J0IExvZ2dlciBmcm9tICcuL2xvZ2dlci5qcyc7XG5cbid1c2Ugc3RyaWN0JztcblxuZnVuY3Rpb24gbWVyZ2VDb25zdHJhaW50cyhjb25zMSwgY29uczIpIHtcbiAgaWYgKCFjb25zMSB8fCAhY29uczIpIHtcbiAgICByZXR1cm4gY29uczEgfHwgY29uczI7XG4gIH1cbiAgdmFyIG1lcmdlZCA9IGNvbnMxO1xuICBmb3IgKHZhciBrZXkgaW4gY29uczIpIHtcbiAgICBtZXJnZWRba2V5XSA9IGNvbnMyW2tleV07XG4gIH1cbiAgcmV0dXJuIG1lcmdlZDtcbn1cblxuZnVuY3Rpb24gaWNlQ2FuZGlkYXRlVHlwZShjYW5kaWRhdGVTdHIpIHtcbiAgcmV0dXJuIGNhbmRpZGF0ZVN0ci5zcGxpdCgnICcpWzddO1xufVxuXG4vLyBUdXJucyB0aGUgbG9jYWwgdHlwZSBwcmVmZXJlbmNlIGludG8gYSBodW1hbi1yZWFkYWJsZSBzdHJpbmcuXG4vLyBOb3RlIHRoYXQgdGhpcyBtYXBwaW5nIGlzIGJyb3dzZXItc3BlY2lmaWMuXG5mdW5jdGlvbiBmb3JtYXRUeXBlUHJlZmVyZW5jZShwcmVmKSB7XG4gIGlmIChhZGFwdGVyLmJyb3dzZXJEZXRhaWxzLmJyb3dzZXIgPT09ICdjaHJvbWUnKSB7XG4gICAgc3dpdGNoIChwcmVmKSB7XG4gICAgICBjYXNlIDA6XG4gICAgICAgIHJldHVybiAnVFVSTi9UTFMnO1xuICAgICAgY2FzZSAxOlxuICAgICAgICByZXR1cm4gJ1RVUk4vVENQJztcbiAgICAgIGNhc2UgMjpcbiAgICAgICAgcmV0dXJuICdUVVJOL1VEUCc7XG4gICAgICBkZWZhdWx0OlxuICAgICAgICBicmVhaztcbiAgICB9XG4gIH0gZWxzZSBpZiAoYWRhcHRlci5icm93c2VyRGV0YWlscy5icm93c2VyID09PSAnZmlyZWZveCcpIHtcbiAgICBzd2l0Y2ggKHByZWYpIHtcbiAgICAgIGNhc2UgMDpcbiAgICAgICAgcmV0dXJuICdUVVJOL1RDUCc7XG4gICAgICBjYXNlIDU6XG4gICAgICAgIHJldHVybiAnVFVSTi9VRFAnO1xuICAgICAgZGVmYXVsdDpcbiAgICAgICAgYnJlYWs7XG4gICAgfVxuICB9XG4gIHJldHVybiAnJztcbn1cblxuZnVuY3Rpb24gbWF5YmVTZXRPcHVzT3B0aW9ucyhzZHAsIHBhcmFtcykge1xuICAvLyBTZXQgT3B1cyBpbiBTdGVyZW8sIGlmIHN0ZXJlbyBpcyB0cnVlLCB1bnNldCBpdCwgaWYgc3RlcmVvIGlzIGZhbHNlLCBhbmRcbiAgLy8gZG8gbm90aGluZyBpZiBvdGhlcndpc2UuXG4gIGlmIChwYXJhbXMub3B1c1N0ZXJlbyA9PT0gJ3RydWUnKSB7XG4gICAgc2RwID0gc2V0Q29kZWNQYXJhbShzZHAsICdvcHVzLzQ4MDAwJywgJ3N0ZXJlbycsICcxJyk7XG4gIH0gZWxzZSBpZiAocGFyYW1zLm9wdXNTdGVyZW8gPT09ICdmYWxzZScpIHtcbiAgICBzZHAgPSByZW1vdmVDb2RlY1BhcmFtKHNkcCwgJ29wdXMvNDgwMDAnLCAnc3RlcmVvJyk7XG4gIH1cblxuICAvLyBTZXQgT3B1cyBGRUMsIGlmIG9wdXNmZWMgaXMgdHJ1ZSwgdW5zZXQgaXQsIGlmIG9wdXNmZWMgaXMgZmFsc2UsIGFuZFxuICAvLyBkbyBub3RoaW5nIGlmIG90aGVyd2lzZS5cbiAgaWYgKHBhcmFtcy5vcHVzRmVjID09PSAndHJ1ZScpIHtcbiAgICBzZHAgPSBzZXRDb2RlY1BhcmFtKHNkcCwgJ29wdXMvNDgwMDAnLCAndXNlaW5iYW5kZmVjJywgJzEnKTtcbiAgfSBlbHNlIGlmIChwYXJhbXMub3B1c0ZlYyA9PT0gJ2ZhbHNlJykge1xuICAgIHNkcCA9IHJlbW92ZUNvZGVjUGFyYW0oc2RwLCAnb3B1cy80ODAwMCcsICd1c2VpbmJhbmRmZWMnKTtcbiAgfVxuXG4gIC8vIFNldCBPcHVzIERUWCwgaWYgb3B1c2R0eCBpcyB0cnVlLCB1bnNldCBpdCwgaWYgb3B1c2R0eCBpcyBmYWxzZSwgYW5kXG4gIC8vIGRvIG5vdGhpbmcgaWYgb3RoZXJ3aXNlLlxuICBpZiAocGFyYW1zLm9wdXNEdHggPT09ICd0cnVlJykge1xuICAgIHNkcCA9IHNldENvZGVjUGFyYW0oc2RwLCAnb3B1cy80ODAwMCcsICd1c2VkdHgnLCAnMScpO1xuICB9IGVsc2UgaWYgKHBhcmFtcy5vcHVzRHR4ID09PSAnZmFsc2UnKSB7XG4gICAgc2RwID0gcmVtb3ZlQ29kZWNQYXJhbShzZHAsICdvcHVzLzQ4MDAwJywgJ3VzZWR0eCcpO1xuICB9XG5cbiAgLy8gU2V0IE9wdXMgbWF4cGxheWJhY2tyYXRlLCBpZiByZXF1ZXN0ZWQuXG4gIGlmIChwYXJhbXMub3B1c01heFBicikge1xuICAgIHNkcCA9IHNldENvZGVjUGFyYW0oXG4gICAgICAgIHNkcCwgJ29wdXMvNDgwMDAnLCAnbWF4cGxheWJhY2tyYXRlJywgcGFyYW1zLm9wdXNNYXhQYnIpO1xuICB9XG4gIHJldHVybiBzZHA7XG59XG5cbmZ1bmN0aW9uIG1heWJlU2V0QXVkaW9TZW5kQml0UmF0ZShzZHAsIHBhcmFtcykge1xuICBpZiAoIXBhcmFtcy5hdWRpb1NlbmRCaXRyYXRlKSB7XG4gICAgcmV0dXJuIHNkcDtcbiAgfVxuICBMb2dnZXIuZGVidWcoJ1ByZWZlciBhdWRpbyBzZW5kIGJpdHJhdGU6ICcgKyBwYXJhbXMuYXVkaW9TZW5kQml0cmF0ZSk7XG4gIHJldHVybiBwcmVmZXJCaXRSYXRlKHNkcCwgcGFyYW1zLmF1ZGlvU2VuZEJpdHJhdGUsICdhdWRpbycpO1xufVxuXG5mdW5jdGlvbiBtYXliZVNldEF1ZGlvUmVjZWl2ZUJpdFJhdGUoc2RwLCBwYXJhbXMpIHtcbiAgaWYgKCFwYXJhbXMuYXVkaW9SZWN2Qml0cmF0ZSkge1xuICAgIHJldHVybiBzZHA7XG4gIH1cbiAgTG9nZ2VyLmRlYnVnKCdQcmVmZXIgYXVkaW8gcmVjZWl2ZSBiaXRyYXRlOiAnICsgcGFyYW1zLmF1ZGlvUmVjdkJpdHJhdGUpO1xuICByZXR1cm4gcHJlZmVyQml0UmF0ZShzZHAsIHBhcmFtcy5hdWRpb1JlY3ZCaXRyYXRlLCAnYXVkaW8nKTtcbn1cblxuZnVuY3Rpb24gbWF5YmVTZXRWaWRlb1NlbmRCaXRSYXRlKHNkcCwgcGFyYW1zKSB7XG4gIGlmICghcGFyYW1zLnZpZGVvU2VuZEJpdHJhdGUpIHtcbiAgICByZXR1cm4gc2RwO1xuICB9XG4gIExvZ2dlci5kZWJ1ZygnUHJlZmVyIHZpZGVvIHNlbmQgYml0cmF0ZTogJyArIHBhcmFtcy52aWRlb1NlbmRCaXRyYXRlKTtcbiAgcmV0dXJuIHByZWZlckJpdFJhdGUoc2RwLCBwYXJhbXMudmlkZW9TZW5kQml0cmF0ZSwgJ3ZpZGVvJyk7XG59XG5cbmZ1bmN0aW9uIG1heWJlU2V0VmlkZW9SZWNlaXZlQml0UmF0ZShzZHAsIHBhcmFtcykge1xuICBpZiAoIXBhcmFtcy52aWRlb1JlY3ZCaXRyYXRlKSB7XG4gICAgcmV0dXJuIHNkcDtcbiAgfVxuICBMb2dnZXIuZGVidWcoJ1ByZWZlciB2aWRlbyByZWNlaXZlIGJpdHJhdGU6ICcgKyBwYXJhbXMudmlkZW9SZWN2Qml0cmF0ZSk7XG4gIHJldHVybiBwcmVmZXJCaXRSYXRlKHNkcCwgcGFyYW1zLnZpZGVvUmVjdkJpdHJhdGUsICd2aWRlbycpO1xufVxuXG4vLyBBZGQgYSBiPUFTOmJpdHJhdGUgbGluZSB0byB0aGUgbT1tZWRpYVR5cGUgc2VjdGlvbi5cbmZ1bmN0aW9uIHByZWZlckJpdFJhdGUoc2RwLCBiaXRyYXRlLCBtZWRpYVR5cGUpIHtcbiAgdmFyIHNkcExpbmVzID0gc2RwLnNwbGl0KCdcXHJcXG4nKTtcblxuICAvLyBGaW5kIG0gbGluZSBmb3IgdGhlIGdpdmVuIG1lZGlhVHlwZS5cbiAgdmFyIG1MaW5lSW5kZXggPSBmaW5kTGluZShzZHBMaW5lcywgJ209JywgbWVkaWFUeXBlKTtcbiAgaWYgKG1MaW5lSW5kZXggPT09IG51bGwpIHtcbiAgICBMb2dnZXIuZGVidWcoJ0ZhaWxlZCB0byBhZGQgYmFuZHdpZHRoIGxpbmUgdG8gc2RwLCBhcyBubyBtLWxpbmUgZm91bmQnKTtcbiAgICByZXR1cm4gc2RwO1xuICB9XG5cbiAgLy8gRmluZCBuZXh0IG0tbGluZSBpZiBhbnkuXG4gIHZhciBuZXh0TUxpbmVJbmRleCA9IGZpbmRMaW5lSW5SYW5nZShzZHBMaW5lcywgbUxpbmVJbmRleCArIDEsIC0xLCAnbT0nKTtcbiAgaWYgKG5leHRNTGluZUluZGV4ID09PSBudWxsKSB7XG4gICAgbmV4dE1MaW5lSW5kZXggPSBzZHBMaW5lcy5sZW5ndGg7XG4gIH1cblxuICAvLyBGaW5kIGMtbGluZSBjb3JyZXNwb25kaW5nIHRvIHRoZSBtLWxpbmUuXG4gIHZhciBjTGluZUluZGV4ID0gZmluZExpbmVJblJhbmdlKHNkcExpbmVzLCBtTGluZUluZGV4ICsgMSxcbiAgICAgIG5leHRNTGluZUluZGV4LCAnYz0nKTtcbiAgaWYgKGNMaW5lSW5kZXggPT09IG51bGwpIHtcbiAgICBMb2dnZXIuZGVidWcoJ0ZhaWxlZCB0byBhZGQgYmFuZHdpZHRoIGxpbmUgdG8gc2RwLCBhcyBubyBjLWxpbmUgZm91bmQnKTtcbiAgICByZXR1cm4gc2RwO1xuICB9XG5cbiAgLy8gQ2hlY2sgaWYgYmFuZHdpZHRoIGxpbmUgYWxyZWFkeSBleGlzdHMgYmV0d2VlbiBjLWxpbmUgYW5kIG5leHQgbS1saW5lLlxuICB2YXIgYkxpbmVJbmRleCA9IGZpbmRMaW5lSW5SYW5nZShzZHBMaW5lcywgY0xpbmVJbmRleCArIDEsXG4gICAgICBuZXh0TUxpbmVJbmRleCwgJ2I9QVMnKTtcbiAgaWYgKGJMaW5lSW5kZXgpIHtcbiAgICBzZHBMaW5lcy5zcGxpY2UoYkxpbmVJbmRleCwgMSk7XG4gIH1cblxuICAvLyBDcmVhdGUgdGhlIGIgKGJhbmR3aWR0aCkgc2RwIGxpbmUuXG4gIHZhciBid0xpbmUgPSAnYj1BUzonICsgYml0cmF0ZTtcbiAgLy8gQXMgcGVyIFJGQyA0NTY2LCB0aGUgYiBsaW5lIHNob3VsZCBmb2xsb3cgYWZ0ZXIgYy1saW5lLlxuICBzZHBMaW5lcy5zcGxpY2UoY0xpbmVJbmRleCArIDEsIDAsIGJ3TGluZSk7XG4gIHNkcCA9IHNkcExpbmVzLmpvaW4oJ1xcclxcbicpO1xuICByZXR1cm4gc2RwO1xufVxuXG4vLyBBZGQgYW4gYT1mbXRwOiB4LWdvb2dsZS1taW4tYml0cmF0ZT1rYnBzIGxpbmUsIGlmIHZpZGVvU2VuZEluaXRpYWxCaXRyYXRlXG4vLyBpcyBzcGVjaWZpZWQuIFdlJ2xsIGFsc28gYWRkIGEgeC1nb29nbGUtbWluLWJpdHJhdGUgdmFsdWUsIHNpbmNlIHRoZSBtYXhcbi8vIG11c3QgYmUgPj0gdGhlIG1pbi5cbmZ1bmN0aW9uIG1heWJlU2V0VmlkZW9TZW5kSW5pdGlhbEJpdFJhdGUoc2RwLCBwYXJhbXMpIHtcbiAgdmFyIGluaXRpYWxCaXRyYXRlID0gcGFyc2VJbnQocGFyYW1zLnZpZGVvU2VuZEluaXRpYWxCaXRyYXRlKTtcbiAgaWYgKCFpbml0aWFsQml0cmF0ZSkge1xuICAgIHJldHVybiBzZHA7XG4gIH1cblxuICAvLyBWYWxpZGF0ZSB0aGUgaW5pdGlhbCBiaXRyYXRlIHZhbHVlLlxuICB2YXIgbWF4Qml0cmF0ZSA9IHBhcnNlSW50KGluaXRpYWxCaXRyYXRlKTtcbiAgdmFyIGJpdHJhdGUgPSBwYXJzZUludChwYXJhbXMudmlkZW9TZW5kQml0cmF0ZSk7XG4gIGlmIChiaXRyYXRlKSB7XG4gICAgaWYgKGluaXRpYWxCaXRyYXRlID4gYml0cmF0ZSkge1xuICAgICAgTG9nZ2VyLmRlYnVnKCdDbGFtcGluZyBpbml0aWFsIGJpdHJhdGUgdG8gbWF4IGJpdHJhdGUgb2YgJyArIGJpdHJhdGUgKyAnIGticHMuJyk7XG4gICAgICBpbml0aWFsQml0cmF0ZSA9IGJpdHJhdGU7XG4gICAgICBwYXJhbXMudmlkZW9TZW5kSW5pdGlhbEJpdHJhdGUgPSBpbml0aWFsQml0cmF0ZTtcbiAgICB9XG4gICAgbWF4Qml0cmF0ZSA9IGJpdHJhdGU7XG4gIH1cblxuICB2YXIgc2RwTGluZXMgPSBzZHAuc3BsaXQoJ1xcclxcbicpO1xuXG4gIC8vIFNlYXJjaCBmb3IgbSBsaW5lLlxuICB2YXIgbUxpbmVJbmRleCA9IGZpbmRMaW5lKHNkcExpbmVzLCAnbT0nLCAndmlkZW8nKTtcbiAgaWYgKG1MaW5lSW5kZXggPT09IG51bGwpIHtcbiAgICBMb2dnZXIuZGVidWcoJ0ZhaWxlZCB0byBmaW5kIHZpZGVvIG0tbGluZScpO1xuICAgIHJldHVybiBzZHA7XG4gIH1cbiAgLy8gRmlndXJlIG91dCB0aGUgZmlyc3QgY29kZWMgcGF5bG9hZCB0eXBlIG9uIHRoZSBtPXZpZGVvIFNEUCBsaW5lLlxuICB2YXIgdmlkZW9NTGluZSA9IHNkcExpbmVzW21MaW5lSW5kZXhdO1xuICB2YXIgcGF0dGVybiA9IG5ldyBSZWdFeHAoJ209dmlkZW9cXFxcc1xcXFxkK1xcXFxzW0EtWi9dK1xcXFxzJyk7XG4gIHZhciBzZW5kUGF5bG9hZFR5cGUgPSB2aWRlb01MaW5lLnNwbGl0KHBhdHRlcm4pWzFdLnNwbGl0KCcgJylbMF07XG4gIHZhciBmbXRwTGluZSA9IHNkcExpbmVzW2ZpbmRMaW5lKHNkcExpbmVzLCAnYT1ydHBtYXAnLCBzZW5kUGF5bG9hZFR5cGUpXTtcbiAgdmFyIGNvZGVjTmFtZSA9IGZtdHBMaW5lLnNwbGl0KCdhPXJ0cG1hcDonICtcbiAgICAgIHNlbmRQYXlsb2FkVHlwZSlbMV0uc3BsaXQoJy8nKVswXTtcblxuICAvLyBVc2UgY29kZWMgZnJvbSBwYXJhbXMgaWYgc3BlY2lmaWVkIHZpYSBVUkwgcGFyYW0sIG90aGVyd2lzZSB1c2UgZnJvbSBTRFAuXG4gIHZhciBjb2RlYyA9IHBhcmFtcy52aWRlb1NlbmRDb2RlYyB8fCBjb2RlY05hbWU7XG4gIHNkcCA9IHNldENvZGVjUGFyYW0oc2RwLCBjb2RlYywgJ3gtZ29vZ2xlLW1pbi1iaXRyYXRlJyxcbiAgICAgIHBhcmFtcy52aWRlb1NlbmRJbml0aWFsQml0cmF0ZS50b1N0cmluZygpKTtcbiAgc2RwID0gc2V0Q29kZWNQYXJhbShzZHAsIGNvZGVjLCAneC1nb29nbGUtbWF4LWJpdHJhdGUnLFxuICAgICAgbWF4Qml0cmF0ZS50b1N0cmluZygpKTtcblxuICByZXR1cm4gc2RwO1xufVxuXG5mdW5jdGlvbiByZW1vdmVQYXlsb2FkVHlwZUZyb21NbGluZShtTGluZSwgcGF5bG9hZFR5cGUpIHtcbiAgbUxpbmUgPSBtTGluZS5zcGxpdCgnICcpO1xuICBmb3IgKHZhciBpID0gMDsgaSA8IG1MaW5lLmxlbmd0aDsgKytpKSB7XG4gICAgaWYgKG1MaW5lW2ldID09PSBwYXlsb2FkVHlwZS50b1N0cmluZygpKSB7XG4gICAgICBtTGluZS5zcGxpY2UoaSwgMSk7XG4gICAgfVxuICB9XG4gIHJldHVybiBtTGluZS5qb2luKCcgJyk7XG59XG5cbmZ1bmN0aW9uIHJlbW92ZUNvZGVjQnlOYW1lKHNkcExpbmVzLCBjb2RlYykge1xuICB2YXIgaW5kZXggPSBmaW5kTGluZShzZHBMaW5lcywgJ2E9cnRwbWFwJywgY29kZWMpO1xuICBpZiAoaW5kZXggPT09IG51bGwpIHtcbiAgICByZXR1cm4gc2RwTGluZXM7XG4gIH1cbiAgdmFyIHBheWxvYWRUeXBlID0gZ2V0Q29kZWNQYXlsb2FkVHlwZUZyb21MaW5lKHNkcExpbmVzW2luZGV4XSk7XG4gIHNkcExpbmVzLnNwbGljZShpbmRleCwgMSk7XG5cbiAgLy8gU2VhcmNoIGZvciB0aGUgdmlkZW8gbT0gbGluZSBhbmQgcmVtb3ZlIHRoZSBjb2RlYy5cbiAgdmFyIG1MaW5lSW5kZXggPSBmaW5kTGluZShzZHBMaW5lcywgJ209JywgJ3ZpZGVvJyk7XG4gIGlmIChtTGluZUluZGV4ID09PSBudWxsKSB7XG4gICAgcmV0dXJuIHNkcExpbmVzO1xuICB9XG4gIHNkcExpbmVzW21MaW5lSW5kZXhdID0gcmVtb3ZlUGF5bG9hZFR5cGVGcm9tTWxpbmUoc2RwTGluZXNbbUxpbmVJbmRleF0sXG4gICAgICBwYXlsb2FkVHlwZSk7XG4gIHJldHVybiBzZHBMaW5lcztcbn1cblxuZnVuY3Rpb24gcmVtb3ZlQ29kZWNCeVBheWxvYWRUeXBlKHNkcExpbmVzLCBwYXlsb2FkVHlwZSkge1xuICB2YXIgaW5kZXggPSBmaW5kTGluZShzZHBMaW5lcywgJ2E9cnRwbWFwJywgcGF5bG9hZFR5cGUudG9TdHJpbmcoKSk7XG4gIGlmIChpbmRleCA9PT0gbnVsbCkge1xuICAgIHJldHVybiBzZHBMaW5lcztcbiAgfVxuICBzZHBMaW5lcy5zcGxpY2UoaW5kZXgsIDEpO1xuXG4gIC8vIFNlYXJjaCBmb3IgdGhlIHZpZGVvIG09IGxpbmUgYW5kIHJlbW92ZSB0aGUgY29kZWMuXG4gIHZhciBtTGluZUluZGV4ID0gZmluZExpbmUoc2RwTGluZXMsICdtPScsICd2aWRlbycpO1xuICBpZiAobUxpbmVJbmRleCA9PT0gbnVsbCkge1xuICAgIHJldHVybiBzZHBMaW5lcztcbiAgfVxuICBzZHBMaW5lc1ttTGluZUluZGV4XSA9IHJlbW92ZVBheWxvYWRUeXBlRnJvbU1saW5lKHNkcExpbmVzW21MaW5lSW5kZXhdLFxuICAgICAgcGF5bG9hZFR5cGUpO1xuICByZXR1cm4gc2RwTGluZXM7XG59XG5cbmZ1bmN0aW9uIG1heWJlUmVtb3ZlVmlkZW9GZWMoc2RwLCBwYXJhbXMpIHtcbiAgaWYgKHBhcmFtcy52aWRlb0ZlYyAhPT0gJ2ZhbHNlJykge1xuICAgIHJldHVybiBzZHA7XG4gIH1cblxuICB2YXIgc2RwTGluZXMgPSBzZHAuc3BsaXQoJ1xcclxcbicpO1xuXG4gIHZhciBpbmRleCA9IGZpbmRMaW5lKHNkcExpbmVzLCAnYT1ydHBtYXAnLCAncmVkJyk7XG4gIGlmIChpbmRleCA9PT0gbnVsbCkge1xuICAgIHJldHVybiBzZHA7XG4gIH1cbiAgdmFyIHJlZFBheWxvYWRUeXBlID0gZ2V0Q29kZWNQYXlsb2FkVHlwZUZyb21MaW5lKHNkcExpbmVzW2luZGV4XSk7XG4gIHNkcExpbmVzID0gcmVtb3ZlQ29kZWNCeVBheWxvYWRUeXBlKHNkcExpbmVzLCByZWRQYXlsb2FkVHlwZSk7XG5cbiAgc2RwTGluZXMgPSByZW1vdmVDb2RlY0J5TmFtZShzZHBMaW5lcywgJ3VscGZlYycpO1xuXG4gIC8vIFJlbW92ZSBmbXRwIGxpbmVzIGFzc29jaWF0ZWQgd2l0aCByZWQgY29kZWMuXG4gIGluZGV4ID0gZmluZExpbmUoc2RwTGluZXMsICdhPWZtdHAnLCByZWRQYXlsb2FkVHlwZS50b1N0cmluZygpKTtcbiAgaWYgKGluZGV4ID09PSBudWxsKSB7XG4gICAgcmV0dXJuIHNkcDtcbiAgfVxuICB2YXIgZm10cExpbmUgPSBwYXJzZUZtdHBMaW5lKHNkcExpbmVzW2luZGV4XSk7XG4gIHZhciBydHhQYXlsb2FkVHlwZSA9IGZtdHBMaW5lLnB0O1xuICBpZiAocnR4UGF5bG9hZFR5cGUgPT09IG51bGwpIHtcbiAgICByZXR1cm4gc2RwO1xuICB9XG4gIHNkcExpbmVzLnNwbGljZShpbmRleCwgMSk7XG5cbiAgc2RwTGluZXMgPSByZW1vdmVDb2RlY0J5UGF5bG9hZFR5cGUoc2RwTGluZXMsIHJ0eFBheWxvYWRUeXBlKTtcbiAgcmV0dXJuIHNkcExpbmVzLmpvaW4oJ1xcclxcbicpO1xufVxuXG4vLyBQcm9tb3RlcyB8YXVkaW9TZW5kQ29kZWN8IHRvIGJlIHRoZSBmaXJzdCBpbiB0aGUgbT1hdWRpbyBsaW5lLCBpZiBzZXQuXG5mdW5jdGlvbiBtYXliZVByZWZlckF1ZGlvU2VuZENvZGVjKHNkcCwgcGFyYW1zKSB7XG4gIHJldHVybiBtYXliZVByZWZlckNvZGVjKHNkcCwgJ2F1ZGlvJywgJ3NlbmQnLCBwYXJhbXMuYXVkaW9TZW5kQ29kZWMpO1xufVxuXG4vLyBQcm9tb3RlcyB8YXVkaW9SZWN2Q29kZWN8IHRvIGJlIHRoZSBmaXJzdCBpbiB0aGUgbT1hdWRpbyBsaW5lLCBpZiBzZXQuXG5mdW5jdGlvbiBtYXliZVByZWZlckF1ZGlvUmVjZWl2ZUNvZGVjKHNkcCwgcGFyYW1zKSB7XG4gIHJldHVybiBtYXliZVByZWZlckNvZGVjKHNkcCwgJ2F1ZGlvJywgJ3JlY2VpdmUnLCBwYXJhbXMuYXVkaW9SZWN2Q29kZWMpO1xufVxuXG4vLyBQcm9tb3RlcyB8dmlkZW9TZW5kQ29kZWN8IHRvIGJlIHRoZSBmaXJzdCBpbiB0aGUgbT1hdWRpbyBsaW5lLCBpZiBzZXQuXG5mdW5jdGlvbiBtYXliZVByZWZlclZpZGVvU2VuZENvZGVjKHNkcCwgcGFyYW1zKSB7XG4gIHJldHVybiBtYXliZVByZWZlckNvZGVjKHNkcCwgJ3ZpZGVvJywgJ3NlbmQnLCBwYXJhbXMudmlkZW9TZW5kQ29kZWMpO1xufVxuXG4vLyBQcm9tb3RlcyB8dmlkZW9SZWN2Q29kZWN8IHRvIGJlIHRoZSBmaXJzdCBpbiB0aGUgbT1hdWRpbyBsaW5lLCBpZiBzZXQuXG5mdW5jdGlvbiBtYXliZVByZWZlclZpZGVvUmVjZWl2ZUNvZGVjKHNkcCwgcGFyYW1zKSB7XG4gIHJldHVybiBtYXliZVByZWZlckNvZGVjKHNkcCwgJ3ZpZGVvJywgJ3JlY2VpdmUnLCBwYXJhbXMudmlkZW9SZWN2Q29kZWMpO1xufVxuXG4vLyBTZXRzIHxjb2RlY3wgYXMgdGhlIGRlZmF1bHQgfHR5cGV8IGNvZGVjIGlmIGl0J3MgcHJlc2VudC5cbi8vIFRoZSBmb3JtYXQgb2YgfGNvZGVjfCBpcyAnTkFNRS9SQVRFJywgZS5nLiAnb3B1cy80ODAwMCcuXG5mdW5jdGlvbiBtYXliZVByZWZlckNvZGVjKHNkcCwgdHlwZSwgZGlyLCBjb2RlYykge1xuICB2YXIgc3RyID0gdHlwZSArICcgJyArIGRpciArICcgY29kZWMnO1xuICBpZiAoIWNvZGVjKSB7XG4gICAgTG9nZ2VyLmRlYnVnKCdObyBwcmVmZXJlbmNlIG9uICcgKyBzdHIgKyAnLicpO1xuICAgIHJldHVybiBzZHA7XG4gIH1cblxuICBMb2dnZXIuZGVidWcoJ1ByZWZlciAnICsgc3RyICsgJzogJyArIGNvZGVjKTtcblxuICB2YXIgc2RwTGluZXMgPSBzZHAuc3BsaXQoJ1xcclxcbicpO1xuXG4gIC8vIFNlYXJjaCBmb3IgbSBsaW5lLlxuICB2YXIgbUxpbmVJbmRleCA9IGZpbmRMaW5lKHNkcExpbmVzLCAnbT0nLCB0eXBlKTtcbiAgaWYgKG1MaW5lSW5kZXggPT09IG51bGwpIHtcbiAgICByZXR1cm4gc2RwO1xuICB9XG5cbiAgLy8gSWYgdGhlIGNvZGVjIGlzIGF2YWlsYWJsZSwgc2V0IGl0IGFzIHRoZSBkZWZhdWx0IGluIG0gbGluZS5cbiAgdmFyIHBheWxvYWQgPSBudWxsO1xuICBmb3IgKHZhciBpID0gMDsgaSA8IHNkcExpbmVzLmxlbmd0aDsgaSsrKSB7XG4gICAgdmFyIGluZGV4ID0gZmluZExpbmVJblJhbmdlKHNkcExpbmVzLCBpLCAtMSwgJ2E9cnRwbWFwJywgY29kZWMpO1xuICAgIGlmIChpbmRleCAhPT0gbnVsbCkge1xuICAgICAgcGF5bG9hZCA9IGdldENvZGVjUGF5bG9hZFR5cGVGcm9tTGluZShzZHBMaW5lc1tpbmRleF0pO1xuICAgICAgaWYgKHBheWxvYWQpIHtcbiAgICAgICAgc2RwTGluZXNbbUxpbmVJbmRleF0gPSBzZXREZWZhdWx0Q29kZWMoc2RwTGluZXNbbUxpbmVJbmRleF0sIHBheWxvYWQpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHNkcCA9IHNkcExpbmVzLmpvaW4oJ1xcclxcbicpO1xuICByZXR1cm4gc2RwO1xufVxuXG4vLyBTZXQgZm10cCBwYXJhbSB0byBzcGVjaWZpYyBjb2RlYyBpbiBTRFAuIElmIHBhcmFtIGRvZXMgbm90IGV4aXN0cywgYWRkIGl0LlxuZnVuY3Rpb24gc2V0Q29kZWNQYXJhbShzZHAsIGNvZGVjLCBwYXJhbSwgdmFsdWUpIHtcbiAgdmFyIHNkcExpbmVzID0gc2RwLnNwbGl0KCdcXHJcXG4nKTtcbiAgLy8gU0RQcyBzZW50IGZyb20gTUNVIHVzZSBcXG4gYXMgbGluZSBicmVhay5cbiAgaWYgKHNkcExpbmVzLmxlbmd0aCA8PSAxKSB7XG4gICAgc2RwTGluZXMgPSBzZHAuc3BsaXQoJ1xcbicpO1xuICB9XG5cbiAgdmFyIGZtdHBMaW5lSW5kZXggPSBmaW5kRm10cExpbmUoc2RwTGluZXMsIGNvZGVjKTtcblxuICB2YXIgZm10cE9iaiA9IHt9O1xuICBpZiAoZm10cExpbmVJbmRleCA9PT0gbnVsbCkge1xuICAgIHZhciBpbmRleCA9IGZpbmRMaW5lKHNkcExpbmVzLCAnYT1ydHBtYXAnLCBjb2RlYyk7XG4gICAgaWYgKGluZGV4ID09PSBudWxsKSB7XG4gICAgICByZXR1cm4gc2RwO1xuICAgIH1cbiAgICB2YXIgcGF5bG9hZCA9IGdldENvZGVjUGF5bG9hZFR5cGVGcm9tTGluZShzZHBMaW5lc1tpbmRleF0pO1xuICAgIGZtdHBPYmoucHQgPSBwYXlsb2FkLnRvU3RyaW5nKCk7XG4gICAgZm10cE9iai5wYXJhbXMgPSB7fTtcbiAgICBmbXRwT2JqLnBhcmFtc1twYXJhbV0gPSB2YWx1ZTtcbiAgICBzZHBMaW5lcy5zcGxpY2UoaW5kZXggKyAxLCAwLCB3cml0ZUZtdHBMaW5lKGZtdHBPYmopKTtcbiAgfSBlbHNlIHtcbiAgICBmbXRwT2JqID0gcGFyc2VGbXRwTGluZShzZHBMaW5lc1tmbXRwTGluZUluZGV4XSk7XG4gICAgZm10cE9iai5wYXJhbXNbcGFyYW1dID0gdmFsdWU7XG4gICAgc2RwTGluZXNbZm10cExpbmVJbmRleF0gPSB3cml0ZUZtdHBMaW5lKGZtdHBPYmopO1xuICB9XG5cbiAgc2RwID0gc2RwTGluZXMuam9pbignXFxyXFxuJyk7XG4gIHJldHVybiBzZHA7XG59XG5cbi8vIFJlbW92ZSBmbXRwIHBhcmFtIGlmIGl0IGV4aXN0cy5cbmZ1bmN0aW9uIHJlbW92ZUNvZGVjUGFyYW0oc2RwLCBjb2RlYywgcGFyYW0pIHtcbiAgdmFyIHNkcExpbmVzID0gc2RwLnNwbGl0KCdcXHJcXG4nKTtcblxuICB2YXIgZm10cExpbmVJbmRleCA9IGZpbmRGbXRwTGluZShzZHBMaW5lcywgY29kZWMpO1xuICBpZiAoZm10cExpbmVJbmRleCA9PT0gbnVsbCkge1xuICAgIHJldHVybiBzZHA7XG4gIH1cblxuICB2YXIgbWFwID0gcGFyc2VGbXRwTGluZShzZHBMaW5lc1tmbXRwTGluZUluZGV4XSk7XG4gIGRlbGV0ZSBtYXAucGFyYW1zW3BhcmFtXTtcblxuICB2YXIgbmV3TGluZSA9IHdyaXRlRm10cExpbmUobWFwKTtcbiAgaWYgKG5ld0xpbmUgPT09IG51bGwpIHtcbiAgICBzZHBMaW5lcy5zcGxpY2UoZm10cExpbmVJbmRleCwgMSk7XG4gIH0gZWxzZSB7XG4gICAgc2RwTGluZXNbZm10cExpbmVJbmRleF0gPSBuZXdMaW5lO1xuICB9XG5cbiAgc2RwID0gc2RwTGluZXMuam9pbignXFxyXFxuJyk7XG4gIHJldHVybiBzZHA7XG59XG5cbi8vIFNwbGl0IGFuIGZtdHAgbGluZSBpbnRvIGFuIG9iamVjdCBpbmNsdWRpbmcgJ3B0JyBhbmQgJ3BhcmFtcycuXG5mdW5jdGlvbiBwYXJzZUZtdHBMaW5lKGZtdHBMaW5lKSB7XG4gIHZhciBmbXRwT2JqID0ge307XG4gIHZhciBzcGFjZVBvcyA9IGZtdHBMaW5lLmluZGV4T2YoJyAnKTtcbiAgdmFyIGtleVZhbHVlcyA9IGZtdHBMaW5lLnN1YnN0cmluZyhzcGFjZVBvcyArIDEpLnNwbGl0KCc7Jyk7XG5cbiAgdmFyIHBhdHRlcm4gPSBuZXcgUmVnRXhwKCdhPWZtdHA6KFxcXFxkKyknKTtcbiAgdmFyIHJlc3VsdCA9IGZtdHBMaW5lLm1hdGNoKHBhdHRlcm4pO1xuICBpZiAocmVzdWx0ICYmIHJlc3VsdC5sZW5ndGggPT09IDIpIHtcbiAgICBmbXRwT2JqLnB0ID0gcmVzdWx0WzFdO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgdmFyIHBhcmFtcyA9IHt9O1xuICBmb3IgKHZhciBpID0gMDsgaSA8IGtleVZhbHVlcy5sZW5ndGg7ICsraSkge1xuICAgIHZhciBwYWlyID0ga2V5VmFsdWVzW2ldLnNwbGl0KCc9Jyk7XG4gICAgaWYgKHBhaXIubGVuZ3RoID09PSAyKSB7XG4gICAgICBwYXJhbXNbcGFpclswXV0gPSBwYWlyWzFdO1xuICAgIH1cbiAgfVxuICBmbXRwT2JqLnBhcmFtcyA9IHBhcmFtcztcblxuICByZXR1cm4gZm10cE9iajtcbn1cblxuLy8gR2VuZXJhdGUgYW4gZm10cCBsaW5lIGZyb20gYW4gb2JqZWN0IGluY2x1ZGluZyAncHQnIGFuZCAncGFyYW1zJy5cbmZ1bmN0aW9uIHdyaXRlRm10cExpbmUoZm10cE9iaikge1xuICBpZiAoIWZtdHBPYmouaGFzT3duUHJvcGVydHkoJ3B0JykgfHwgIWZtdHBPYmouaGFzT3duUHJvcGVydHkoJ3BhcmFtcycpKSB7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cbiAgdmFyIHB0ID0gZm10cE9iai5wdDtcbiAgdmFyIHBhcmFtcyA9IGZtdHBPYmoucGFyYW1zO1xuICB2YXIga2V5VmFsdWVzID0gW107XG4gIHZhciBpID0gMDtcbiAgZm9yICh2YXIga2V5IGluIHBhcmFtcykge1xuICAgIGtleVZhbHVlc1tpXSA9IGtleSArICc9JyArIHBhcmFtc1trZXldO1xuICAgICsraTtcbiAgfVxuICBpZiAoaSA9PT0gMCkge1xuICAgIHJldHVybiBudWxsO1xuICB9XG4gIHJldHVybiAnYT1mbXRwOicgKyBwdC50b1N0cmluZygpICsgJyAnICsga2V5VmFsdWVzLmpvaW4oJzsnKTtcbn1cblxuLy8gRmluZCBmbXRwIGF0dHJpYnV0ZSBmb3IgfGNvZGVjfCBpbiB8c2RwTGluZXN8LlxuZnVuY3Rpb24gZmluZEZtdHBMaW5lKHNkcExpbmVzLCBjb2RlYykge1xuICAvLyBGaW5kIHBheWxvYWQgb2YgY29kZWMuXG4gIHZhciBwYXlsb2FkID0gZ2V0Q29kZWNQYXlsb2FkVHlwZShzZHBMaW5lcywgY29kZWMpO1xuICAvLyBGaW5kIHRoZSBwYXlsb2FkIGluIGZtdHAgbGluZS5cbiAgcmV0dXJuIHBheWxvYWQgPyBmaW5kTGluZShzZHBMaW5lcywgJ2E9Zm10cDonICsgcGF5bG9hZC50b1N0cmluZygpKSA6IG51bGw7XG59XG5cbi8vIEZpbmQgdGhlIGxpbmUgaW4gc2RwTGluZXMgdGhhdCBzdGFydHMgd2l0aCB8cHJlZml4fCwgYW5kLCBpZiBzcGVjaWZpZWQsXG4vLyBjb250YWlucyB8c3Vic3RyfCAoY2FzZS1pbnNlbnNpdGl2ZSBzZWFyY2gpLlxuZnVuY3Rpb24gZmluZExpbmUoc2RwTGluZXMsIHByZWZpeCwgc3Vic3RyKSB7XG4gIHJldHVybiBmaW5kTGluZUluUmFuZ2Uoc2RwTGluZXMsIDAsIC0xLCBwcmVmaXgsIHN1YnN0cik7XG59XG5cbi8vIEZpbmQgdGhlIGxpbmUgaW4gc2RwTGluZXNbc3RhcnRMaW5lLi4uZW5kTGluZSAtIDFdIHRoYXQgc3RhcnRzIHdpdGggfHByZWZpeHxcbi8vIGFuZCwgaWYgc3BlY2lmaWVkLCBjb250YWlucyB8c3Vic3RyfCAoY2FzZS1pbnNlbnNpdGl2ZSBzZWFyY2gpLlxuZnVuY3Rpb24gZmluZExpbmVJblJhbmdlKHNkcExpbmVzLCBzdGFydExpbmUsIGVuZExpbmUsIHByZWZpeCwgc3Vic3RyKSB7XG4gIHZhciByZWFsRW5kTGluZSA9IGVuZExpbmUgIT09IC0xID8gZW5kTGluZSA6IHNkcExpbmVzLmxlbmd0aDtcbiAgZm9yICh2YXIgaSA9IHN0YXJ0TGluZTsgaSA8IHJlYWxFbmRMaW5lOyArK2kpIHtcbiAgICBpZiAoc2RwTGluZXNbaV0uaW5kZXhPZihwcmVmaXgpID09PSAwKSB7XG4gICAgICBpZiAoIXN1YnN0ciB8fFxuICAgICAgICAgIHNkcExpbmVzW2ldLnRvTG93ZXJDYXNlKCkuaW5kZXhPZihzdWJzdHIudG9Mb3dlckNhc2UoKSkgIT09IC0xKSB7XG4gICAgICAgIHJldHVybiBpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuICByZXR1cm4gbnVsbDtcbn1cblxuLy8gR2V0cyB0aGUgY29kZWMgcGF5bG9hZCB0eXBlIGZyb20gc2RwIGxpbmVzLlxuZnVuY3Rpb24gZ2V0Q29kZWNQYXlsb2FkVHlwZShzZHBMaW5lcywgY29kZWMpIHtcbiAgdmFyIGluZGV4ID0gZmluZExpbmUoc2RwTGluZXMsICdhPXJ0cG1hcCcsIGNvZGVjKTtcbiAgcmV0dXJuIGluZGV4ID8gZ2V0Q29kZWNQYXlsb2FkVHlwZUZyb21MaW5lKHNkcExpbmVzW2luZGV4XSkgOiBudWxsO1xufVxuXG4vLyBHZXRzIHRoZSBjb2RlYyBwYXlsb2FkIHR5cGUgZnJvbSBhbiBhPXJ0cG1hcDpYIGxpbmUuXG5mdW5jdGlvbiBnZXRDb2RlY1BheWxvYWRUeXBlRnJvbUxpbmUoc2RwTGluZSkge1xuICB2YXIgcGF0dGVybiA9IG5ldyBSZWdFeHAoJ2E9cnRwbWFwOihcXFxcZCspIFthLXpBLVowLTktXStcXFxcL1xcXFxkKycpO1xuICB2YXIgcmVzdWx0ID0gc2RwTGluZS5tYXRjaChwYXR0ZXJuKTtcbiAgcmV0dXJuIChyZXN1bHQgJiYgcmVzdWx0Lmxlbmd0aCA9PT0gMikgPyByZXN1bHRbMV0gOiBudWxsO1xufVxuXG4vLyBSZXR1cm5zIGEgbmV3IG09IGxpbmUgd2l0aCB0aGUgc3BlY2lmaWVkIGNvZGVjIGFzIHRoZSBmaXJzdCBvbmUuXG5mdW5jdGlvbiBzZXREZWZhdWx0Q29kZWMobUxpbmUsIHBheWxvYWQpIHtcbiAgdmFyIGVsZW1lbnRzID0gbUxpbmUuc3BsaXQoJyAnKTtcblxuICAvLyBKdXN0IGNvcHkgdGhlIGZpcnN0IHRocmVlIHBhcmFtZXRlcnM7IGNvZGVjIG9yZGVyIHN0YXJ0cyBvbiBmb3VydGguXG4gIHZhciBuZXdMaW5lID0gZWxlbWVudHMuc2xpY2UoMCwgMyk7XG5cbiAgLy8gUHV0IHRhcmdldCBwYXlsb2FkIGZpcnN0IGFuZCBjb3B5IGluIHRoZSByZXN0LlxuICBuZXdMaW5lLnB1c2gocGF5bG9hZCk7XG4gIGZvciAodmFyIGkgPSAzOyBpIDwgZWxlbWVudHMubGVuZ3RoOyBpKyspIHtcbiAgICBpZiAoZWxlbWVudHNbaV0gIT09IHBheWxvYWQpIHtcbiAgICAgIG5ld0xpbmUucHVzaChlbGVtZW50c1tpXSk7XG4gICAgfVxuICB9XG4gIHJldHVybiBuZXdMaW5lLmpvaW4oJyAnKTtcbn1cblxuLyogQmVsb3cgYXJlIG5ld2x5IGFkZGVkIGZ1bmN0aW9ucyAqL1xuXG4vLyBGb2xsb3dpbmcgY29kZWNzIHdpbGwgbm90IGJlIHJlbW92ZWQgZnJvbSBTRFAgZXZlbnQgdGhleSBhcmUgbm90IGluIHRoZVxuLy8gdXNlci1zcGVjaWZpZWQgY29kZWMgbGlzdC5cbmNvbnN0IGF1ZGlvQ29kZWNXaGl0ZUxpc3QgPSBbJ0NOJywgJ3RlbGVwaG9uZS1ldmVudCddO1xuY29uc3QgdmlkZW9Db2RlY1doaXRlTGlzdCA9IFsncmVkJywgJ3VscGZlYyddO1xuXG4vLyBSZXR1cm5zIGEgbmV3IG09IGxpbmUgd2l0aCB0aGUgc3BlY2lmaWVkIGNvZGVjIG9yZGVyLlxuZnVuY3Rpb24gc2V0Q29kZWNPcmRlcihtTGluZSwgcGF5bG9hZHMpIHtcbiAgdmFyIGVsZW1lbnRzID0gbUxpbmUuc3BsaXQoJyAnKTtcblxuICAvLyBKdXN0IGNvcHkgdGhlIGZpcnN0IHRocmVlIHBhcmFtZXRlcnM7IGNvZGVjIG9yZGVyIHN0YXJ0cyBvbiBmb3VydGguXG4gIHZhciBuZXdMaW5lID0gZWxlbWVudHMuc2xpY2UoMCwgMyk7XG5cbiAgLy8gQ29uY2F0IHBheWxvYWQgdHlwZXMuXG4gIG5ld0xpbmUgPSBuZXdMaW5lLmNvbmNhdChwYXlsb2Fkcyk7XG5cbiAgcmV0dXJuIG5ld0xpbmUuam9pbignICcpO1xufVxuXG4vLyBBcHBlbmQgUlRYIHBheWxvYWRzIGZvciBleGlzdGluZyBwYXlsb2Fkcy5cbmZ1bmN0aW9uIGFwcGVuZFJ0eFBheWxvYWRzKHNkcExpbmVzLCBwYXlsb2Fkcykge1xuICBmb3IgKGNvbnN0IHBheWxvYWQgb2YgcGF5bG9hZHMpIHtcbiAgICBjb25zdCBpbmRleCA9IGZpbmRMaW5lKHNkcExpbmVzLCAnYT1mbXRwJywgJ2FwdD0nICsgcGF5bG9hZCk7XG4gICAgaWYgKGluZGV4ICE9PSBudWxsKSB7XG4gICAgICBjb25zdCBmbXRwTGluZSA9IHBhcnNlRm10cExpbmUoc2RwTGluZXNbaW5kZXhdKTtcbiAgICAgIHBheWxvYWRzLnB1c2goZm10cExpbmUucHQpO1xuICAgIH1cbiAgfVxuICByZXR1cm4gcGF5bG9hZHM7XG59XG5cbi8vIFJlbW92ZSBhIGNvZGVjIHdpdGggYWxsIGl0cyBhc3NvY2lhdGVkIGEgbGluZXMuXG5mdW5jdGlvbiByZW1vdmVDb2RlY0ZyYW1BTGluZShzZHBMaW5lcywgcGF5bG9hZCl7XG4gIGNvbnN0IHBhdHRlcm4gPSBuZXcgUmVnRXhwKCdhPShydHBtYXB8cnRjcC1mYnxmbXRwKTonK3BheWxvYWQrJ1xcXFxzJyk7XG4gIGZvcihsZXQgaT1zZHBMaW5lcy5sZW5ndGgtMTtpPjA7aS0tKXtcbiAgICBpZihzZHBMaW5lc1tpXS5tYXRjaChwYXR0ZXJuKSl7XG4gICAgICBzZHBMaW5lcy5zcGxpY2UoaSwgMSk7XG4gICAgfVxuICB9XG4gIHJldHVybiBzZHBMaW5lcztcbn1cblxuLy8gUmVvcmRlciBjb2RlY3MgaW4gbS1saW5lIGFjY29yZGluZyB0aGUgb3JkZXIgb2YgfGNvZGVjc3wuIFJlbW92ZSBjb2RlY3MgZnJvbVxuLy8gbS1saW5lIGlmIGl0IGlzIG5vdCBwcmVzZW50IGluIHxjb2RlY3N8XG4vLyBUaGUgZm9ybWF0IG9mIHxjb2RlY3wgaXMgJ05BTUUvUkFURScsIGUuZy4gJ29wdXMvNDgwMDAnLlxuZXhwb3J0IGZ1bmN0aW9uIHJlb3JkZXJDb2RlY3Moc2RwLCB0eXBlLCBjb2RlY3Mpe1xuICBpZiAoIWNvZGVjcyB8fCBjb2RlY3MubGVuZ3RoID09PSAwKSB7XG4gICAgcmV0dXJuIHNkcDtcbiAgfVxuXG4gIGNvZGVjcyA9IHR5cGUgPT09ICdhdWRpbycgPyBjb2RlY3MuY29uY2F0KGF1ZGlvQ29kZWNXaGl0ZUxpc3QpIDogY29kZWNzLmNvbmNhdChcbiAgICB2aWRlb0NvZGVjV2hpdGVMaXN0KTtcblxuICB2YXIgc2RwTGluZXMgPSBzZHAuc3BsaXQoJ1xcclxcbicpO1xuXG4gIC8vIFNlYXJjaCBmb3IgbSBsaW5lLlxuICB2YXIgbUxpbmVJbmRleCA9IGZpbmRMaW5lKHNkcExpbmVzLCAnbT0nLCB0eXBlKTtcbiAgaWYgKG1MaW5lSW5kZXggPT09IG51bGwpIHtcbiAgICByZXR1cm4gc2RwO1xuICB9XG5cbiAgbGV0IG9yaWdpblBheWxvYWRzID0gc2RwTGluZXNbbUxpbmVJbmRleF0uc3BsaXQoJyAnKTtcbiAgb3JpZ2luUGF5bG9hZHMuc3BsaWNlKDAsIDMpO1xuXG4gIC8vIElmIHRoZSBjb2RlYyBpcyBhdmFpbGFibGUsIHNldCBpdCBhcyB0aGUgZGVmYXVsdCBpbiBtIGxpbmUuXG4gIHZhciBwYXlsb2FkcyA9IFtdO1xuICBmb3IgKGNvbnN0IGNvZGVjIG9mIGNvZGVjcykge1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgc2RwTGluZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgIHZhciBpbmRleCA9IGZpbmRMaW5lSW5SYW5nZShzZHBMaW5lcywgaSwgLTEsICdhPXJ0cG1hcCcsIGNvZGVjKTtcbiAgICAgIGlmIChpbmRleCAhPT0gbnVsbCkge1xuICAgICAgICBjb25zdCBwYXlsb2FkID0gZ2V0Q29kZWNQYXlsb2FkVHlwZUZyb21MaW5lKHNkcExpbmVzW2luZGV4XSk7XG4gICAgICAgIGlmIChwYXlsb2FkKSB7XG4gICAgICAgICAgcGF5bG9hZHMucHVzaChwYXlsb2FkKTtcbiAgICAgICAgICBpID0gaW5kZXg7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgcGF5bG9hZHMgPSBhcHBlbmRSdHhQYXlsb2FkcyhzZHBMaW5lcywgcGF5bG9hZHMpO1xuICBzZHBMaW5lc1ttTGluZUluZGV4XSA9IHNldENvZGVjT3JkZXIoc2RwTGluZXNbbUxpbmVJbmRleF0sIHBheWxvYWRzKTtcblxuICAvLyBSZW1vdmUgYSBsaW5lcy5cbiAgZm9yKGNvbnN0IHBheWxvYWQgb2Ygb3JpZ2luUGF5bG9hZHMpe1xuICAgIGlmIChwYXlsb2Fkcy5pbmRleE9mKHBheWxvYWQpPT09LTEpIHtcbiAgICAgIHNkcExpbmVzID0gcmVtb3ZlQ29kZWNGcmFtQUxpbmUoc2RwTGluZXMsIHBheWxvYWQpO1xuICAgIH1cbiAgfVxuXG4gIHNkcCA9IHNkcExpbmVzLmpvaW4oJ1xcclxcbicpO1xuICByZXR1cm4gc2RwO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gc2V0TWF4Qml0cmF0ZShzZHAsIGVuY29kaW5nUGFyYW1ldGVyc0xpc3QpIHtcbiAgZm9yIChjb25zdCBlbmNvZGluZ1BhcmFtZXRlcnMgb2YgZW5jb2RpbmdQYXJhbWV0ZXJzTGlzdCkge1xuICAgIGlmIChlbmNvZGluZ1BhcmFtZXRlcnMubWF4Qml0cmF0ZSkge1xuICAgICAgc2RwID0gc2V0Q29kZWNQYXJhbShcbiAgICAgICAgICBzZHAsIGVuY29kaW5nUGFyYW1ldGVycy5jb2RlYy5uYW1lLCAneC1nb29nbGUtbWF4LWJpdHJhdGUnLFxuICAgICAgICAgIChlbmNvZGluZ1BhcmFtZXRlcnMubWF4Qml0cmF0ZSkudG9TdHJpbmcoKSk7XG4gICAgfVxuICB9XG4gIHJldHVybiBzZHA7XG59XG4iLCIvLyBDb3B5cmlnaHQgwqkgMjAxNyBJbnRlbCBDb3Jwb3JhdGlvbi4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cblxuJ3VzZSBzdHJpY3QnO1xuaW1wb3J0IExvZ2dlciBmcm9tICcuL2xvZ2dlci5qcydcbmltcG9ydCB7SWNzRXZlbnR9IGZyb20gJy4vZXZlbnQuanMnXG5pbXBvcnQgKiBhcyBVdGlscyBmcm9tICcuL3V0aWxzLmpzJ1xuaW1wb3J0IHsgRXZlbnREaXNwYXRjaGVyfSBmcm9tICcuL2V2ZW50LmpzJztcblxuZnVuY3Rpb24gaXNBbGxvd2VkVmFsdWUob2JqLCBhbGxvd2VkVmFsdWVzKSB7XG4gIHJldHVybiAoYWxsb3dlZFZhbHVlcy5zb21lKChlbGUpID0+IHtcbiAgICByZXR1cm4gZWxlID09PSBvYmo7XG4gIH0pKTtcbn1cbi8qKlxuICogQGNsYXNzIFN0cmVhbVNvdXJjZUluZm9cbiAqIEBtZW1iZXJPZiBJY3MuQmFzZVxuICogQGNsYXNzRGVzYyBJbmZvcm1hdGlvbiBvZiBhIHN0cmVhbSdzIHNvdXJjZS5cbiAqIEBjb25zdHJ1Y3RvclxuICogQGRlc2NyaXB0aW9uIEF1ZGlvIHNvdXJjZSBpbmZvIG9yIHZpZGVvIHNvdXJjZSBpbmZvIGNvdWxkIGJlIHVuZGVmaW5lZCBpZiBhIHN0cmVhbSBkb2VzIG5vdCBoYXZlIGF1ZGlvL3ZpZGVvIHRyYWNrLlxuICogQHBhcmFtIHs/c3RyaW5nfSBhdWRpb1NvdXJjZUluZm8gQXVkaW8gc291cmNlIGluZm8uIEFjY2VwdGVkIHZhbHVlcyBhcmU6IFwibWljXCIsIFwic2NyZWVuLWNhc3RcIiwgXCJmaWxlXCIsIFwibWl4ZWRcIiBvciB1bmRlZmluZWQuXG4gKiBAcGFyYW0gez9zdHJpbmd9IHZpZGVvU291cmNlSW5mbyBWaWRlbyBzb3VyY2UgaW5mby4gQWNjZXB0ZWQgdmFsdWVzIGFyZTogXCJjYW1lcmFcIiwgXCJzY3JlZW4tY2FzdFwiLCBcImZpbGVcIiwgXCJtaXhlZFwiIG9yIHVuZGVmaW5lZC5cbiAqL1xuZXhwb3J0IGNsYXNzIFN0cmVhbVNvdXJjZUluZm8ge1xuICBjb25zdHJ1Y3RvcihhdWRpb1NvdXJjZUluZm8sIHZpZGVvU291cmNlSW5mbykge1xuICAgIGlmICghaXNBbGxvd2VkVmFsdWUoYXVkaW9Tb3VyY2VJbmZvLCBbdW5kZWZpbmVkLCAnbWljJywgJ3NjcmVlbi1jYXN0JyxcbiAgICAgICAgJ2ZpbGUnLCAnbWl4ZWQnXG4gICAgICBdKSkge1xuICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignSW5jb3JyZWN0IHZhbHVlIGZvciBhdWRpb1NvdXJjZUluZm8nKTtcbiAgICB9XG4gICAgaWYgKCFpc0FsbG93ZWRWYWx1ZSh2aWRlb1NvdXJjZUluZm8sIFt1bmRlZmluZWQsICdjYW1lcmEnLCAnc2NyZWVuLWNhc3QnLFxuICAgICAgICAnZmlsZScsICdtaXhlZCdcbiAgICAgIF0pKSB7XG4gICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdJbmNvcnJlY3QgdmFsdWUgZm9yIHZpZGVvU291cmNlSW5mbycpO1xuICAgIH1cbiAgICB0aGlzLmF1ZGlvID0gYXVkaW9Tb3VyY2VJbmZvO1xuICAgIHRoaXMudmlkZW8gPSB2aWRlb1NvdXJjZUluZm87XG4gIH1cbn1cbi8qKlxuICogQGNsYXNzIFN0cmVhbVxuICogQG1lbWJlck9mIEljcy5CYXNlXG4gKiBAY2xhc3NEZXNjIEJhc2UgY2xhc3Mgb2Ygc3RyZWFtcy5cbiAqIEBleHRlbmRzIEljcy5CYXNlLkV2ZW50RGlzcGF0Y2hlclxuICogQGhpZGVjb25zdHJ1Y3RvclxuICovXG5leHBvcnQgY2xhc3MgU3RyZWFtIGV4dGVuZHMgRXZlbnREaXNwYXRjaGVyIHtcbiAgY29uc3RydWN0b3Ioc3RyZWFtLCBzb3VyY2VJbmZvLCBhdHRyaWJ1dGVzKSB7XG4gICAgc3VwZXIoKTtcbiAgICBpZiAoKHN0cmVhbSAmJiAhKHN0cmVhbSBpbnN0YW5jZW9mIE1lZGlhU3RyZWFtKSkgfHwgKHR5cGVvZiBzb3VyY2VJbmZvICE9PSAnb2JqZWN0JykpIHtcbiAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignSW52YWxpZCBzdHJlYW0gb3Igc291cmNlSW5mby4nKTtcbiAgICAgIH1cbiAgICBpZiAoc3RyZWFtICYmICgoc3RyZWFtLmdldEF1ZGlvVHJhY2tzKCkubGVuZ3RoID4gMCAmJiAhc291cmNlSW5mby5hdWRpbykgfHxcbiAgICAgICAgc3RyZWFtLmdldFZpZGVvVHJhY2tzKCkubGVuZ3RoID4gMCAmJiAhc291cmNlSW5mby52aWRlbykpIHtcbiAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ01pc3NpbmcgYXVkaW8gc291cmNlIGluZm8gb3IgdmlkZW8gc291cmNlIGluZm8uJyk7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIEBtZW1iZXIgez9NZWRpYVN0cmVhbX0gbWVkaWFTdHJlYW1cbiAgICAgKiBAaW5zdGFuY2VcbiAgICAgKiBAbWVtYmVyb2YgSWNzLkJhc2UuU3RyZWFtXG4gICAgICogQHNlZSB7QGxpbmsgaHR0cHM6Ly93d3cudzMub3JnL1RSL21lZGlhY2FwdHVyZS1zdHJlYW1zLyNtZWRpYXN0cmVhbXxNZWRpYVN0cmVhbSBBUEkgb2YgTWVkaWEgQ2FwdHVyZSBhbmQgU3RyZWFtc30uXG4gICAgICovXG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsICdtZWRpYVN0cmVhbScsIHtcbiAgICAgIGNvbmZpZ3VyYWJsZTogZmFsc2UsXG4gICAgICB3cml0YWJsZTogdHJ1ZSxcbiAgICAgIHZhbHVlOiBzdHJlYW1cbiAgICB9KTtcbiAgICAvKipcbiAgICAgKiBAbWVtYmVyIHtJY3MuQmFzZS5TdHJlYW1Tb3VyY2VJbmZvfSBzb3VyY2VcbiAgICAgKiBAaW5zdGFuY2VcbiAgICAgKiBAbWVtYmVyb2YgSWNzLkJhc2UuU3RyZWFtXG4gICAgICogQGRlc2MgU291cmNlIGluZm8gb2YgYSBzdHJlYW0uXG4gICAgICovXG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsICdzb3VyY2UnLCB7XG4gICAgICBjb25maWd1cmFibGU6IGZhbHNlLFxuICAgICAgd3JpdGFibGU6IGZhbHNlLFxuICAgICAgdmFsdWU6IHNvdXJjZUluZm9cbiAgICB9KTtcbiAgICAvKipcbiAgICAgKiBAbWVtYmVyIHtzdHJpbmd9IGF0dHJpYnV0ZXNcbiAgICAgKiBAaW5zdGFuY2VcbiAgICAgKiBAbWVtYmVyb2YgSWNzLkJhc2UuU3RyZWFtXG4gICAgICogQGRlc2MgQ3VzdG9tIGF0dHJpYnV0ZXMgb2YgYSBzdHJlYW0uXG4gICAgICovXG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsICdhdHRyaWJ1dGVzJywge1xuICAgICAgY29uZmlndXJhYmxlOiB0cnVlLFxuICAgICAgd3JpdGFibGU6IGZhbHNlLFxuICAgICAgdmFsdWU6IGF0dHJpYnV0ZXNcbiAgICB9KTtcbiAgfTtcbn1cbi8qKlxuICogQGNsYXNzIExvY2FsU3RyZWFtXG4gKiBAY2xhc3NEZXNjIFN0cmVhbSBjYXB0dXJlZCBmcm9tIGN1cnJlbnQgZW5kcG9pbnQuXG4gKiBAbWVtYmVyT2YgSWNzLkJhc2VcbiAqIEBleHRlbmRzIEljcy5CYXNlLlN0cmVhbVxuICogQGNvbnN0cnVjdG9yXG4gKiBAcGFyYW0ge01lZGlhU3RyZWFtfSBzdHJlYW0gVW5kZXJseWluZyBNZWRpYVN0cmVhbS5cbiAqIEBwYXJhbSB7SWNzLkJhc2UuU3RyZWFtU291cmNlSW5mb30gc291cmNlSW5mbyBJbmZvcm1hdGlvbiBhYm91dCBzdHJlYW0ncyBzb3VyY2UuXG4gKiBAcGFyYW0ge29iamVjdH0gYXR0cmlidXRlcyBDdXN0b20gYXR0cmlidXRlcyBvZiB0aGUgc3RyZWFtLlxuICovXG5leHBvcnQgY2xhc3MgTG9jYWxTdHJlYW0gZXh0ZW5kcyBTdHJlYW0ge1xuICBjb25zdHJ1Y3RvcihzdHJlYW0sIHNvdXJjZUluZm8sIGF0dHJpYnV0ZXMpIHtcbiAgICBpZighKHN0cmVhbSBpbnN0YW5jZW9mIE1lZGlhU3RyZWFtKSl7XG4gICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdJbnZhbGlkIHN0cmVhbS4nKTtcbiAgICB9XG4gICAgc3VwZXIoc3RyZWFtLCBzb3VyY2VJbmZvLCBhdHRyaWJ1dGVzKTtcbiAgICAvKipcbiAgICAgKiBAbWVtYmVyIHtzdHJpbmd9IGlkXG4gICAgICogQGluc3RhbmNlXG4gICAgICogQG1lbWJlcm9mIEljcy5CYXNlLkxvY2FsU3RyZWFtXG4gICAgICovXG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsICdpZCcsIHtcbiAgICAgIGNvbmZpZ3VyYWJsZTogZmFsc2UsXG4gICAgICB3cml0YWJsZTogZmFsc2UsXG4gICAgICB2YWx1ZTogVXRpbHMuY3JlYXRlVXVpZCgpXG4gICAgfSk7XG4gIH07XG59XG4vKipcbiAqIEBjbGFzcyBSZW1vdGVTdHJlYW1cbiAqIEBjbGFzc0Rlc2MgU3RyZWFtIHNlbnQgZnJvbSBhIHJlbW90ZSBlbmRwb2ludC5cbiAqIEV2ZW50czpcbiAqXG4gKiB8IEV2ZW50IE5hbWUgICAgICB8IEFyZ3VtZW50IFR5cGUgICAgfCBGaXJlZCB3aGVuICAgICAgIHxcbiAqIHwgLS0tLS0tLS0tLS0tLS0tLXwgLS0tLS0tLS0tLS0tLS0tLSB8IC0tLS0tLS0tLS0tLS0tLS0gfFxuICogfCBlbmRlZCAgICAgICAgICAgfCBFdmVudCAgICAgICAgICAgIHwgU3RyZWFtIGlzIGVuZGVkLiB8XG4gKlxuICogQG1lbWJlck9mIEljcy5CYXNlXG4gKiBAZXh0ZW5kcyBJY3MuQmFzZS5TdHJlYW1cbiAqIEBoaWRlY29uc3RydWN0b3JcbiAqL1xuZXhwb3J0IGNsYXNzIFJlbW90ZVN0cmVhbSBleHRlbmRzIFN0cmVhbSB7XG4gIGNvbnN0cnVjdG9yKGlkLCBvcmlnaW4sIHN0cmVhbSwgc291cmNlSW5mbywgYXR0cmlidXRlcykge1xuICAgIHN1cGVyKHN0cmVhbSwgc291cmNlSW5mbywgYXR0cmlidXRlcyk7XG4gICAgLyoqXG4gICAgICogQG1lbWJlciB7c3RyaW5nfSBpZFxuICAgICAqIEBpbnN0YW5jZVxuICAgICAqIEBtZW1iZXJvZiBJY3MuQmFzZS5SZW1vdGVTdHJlYW1cbiAgICAgKi9cbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcywgJ2lkJywge1xuICAgICAgY29uZmlndXJhYmxlOiBmYWxzZSxcbiAgICAgIHdyaXRhYmxlOiBmYWxzZSxcbiAgICAgIHZhbHVlOiBpZCA/IGlkIDogVXRpbHMuY3JlYXRlVXVpZCgpXG4gICAgfSk7XG4gICAgLyoqXG4gICAgICogQG1lbWJlciB7c3RyaW5nfSBvcmlnaW5cbiAgICAgKiBAaW5zdGFuY2VcbiAgICAgKiBAbWVtYmVyb2YgSWNzLkJhc2UuUmVtb3RlU3RyZWFtXG4gICAgICogQGRlc2MgSUQgb2YgdGhlIHJlbW90ZSBlbmRwb2ludCB3aG8gcHVibGlzaGVkIHRoaXMgc3RyZWFtLlxuICAgICAqL1xuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCAnb3JpZ2luJywge1xuICAgICAgY29uZmlndXJhYmxlOiBmYWxzZSxcbiAgICAgIHdyaXRhYmxlOiBmYWxzZSxcbiAgICAgIHZhbHVlOiBvcmlnaW5cbiAgICB9KTtcbiAgICAvKipcbiAgICAgKiBAbWVtYmVyIHtJY3MuQmFzZS5QdWJsaWNhdGlvblNldHRpbmdzfSBzZXR0aW5nc1xuICAgICAqIEBpbnN0YW5jZVxuICAgICAqIEBtZW1iZXJvZiBJY3MuQmFzZS5SZW1vdGVTdHJlYW1cbiAgICAgKiBAZGVzYyBPcmlnaW5hbCBzZXR0aW5ncyBmb3IgcHVibGlzaGluZyB0aGlzIHN0cmVhbS4gVGhpcyBwcm9wZXJ0eSBpcyBvbmx5IHZhbGlkIGluIGNvbmZlcmVuY2UgbW9kZS5cbiAgICAgKi9cbiAgICB0aGlzLnNldHRpbmdzID0gdW5kZWZpbmVkO1xuICAgIC8qKlxuICAgICAqIEBtZW1iZXIge0ljcy5Db25mZXJlbmNlLlN1YnNjcmlwdGlvbkNhcGFiaWxpdGllc30gY2FwYWJpbGl0aWVzXG4gICAgICogQGluc3RhbmNlXG4gICAgICogQG1lbWJlcm9mIEljcy5CYXNlLlJlbW90ZVN0cmVhbVxuICAgICAqIEBkZXNjIENhcGFiaWxpdGllcyByZW1vdGUgZW5kcG9pbnQgcHJvdmlkZXMgZm9yIHN1YnNjcmlwdGlvbi4gVGhpcyBwcm9wZXJ0eSBpcyBvbmx5IHZhbGlkIGluIGNvbmZlcmVuY2UgbW9kZS5cbiAgICAgKi9cbiAgICB0aGlzLmNhcGFiaWxpdGllcyA9IHVuZGVmaW5lZDtcbiAgfVxufVxuXG4vKipcbiAqIEBjbGFzcyBTdHJlYW1FdmVudFxuICogQGNsYXNzRGVzYyBFdmVudCBmb3IgU3RyZWFtLlxuICogQGV4dGVuZHMgSWNzLkJhc2UuSWNzRXZlbnRcbiAqIEBtZW1iZXJvZiBJY3MuQmFzZVxuICogQGhpZGVjb25zdHJ1Y3RvclxuICovXG5leHBvcnQgY2xhc3MgU3RyZWFtRXZlbnQgZXh0ZW5kcyBJY3NFdmVudCB7XG4gIGNvbnN0cnVjdG9yKHR5cGUsIGluaXQpIHtcbiAgICBzdXBlcih0eXBlKTtcbiAgICB0aGlzLnN0cmVhbSA9IGluaXQuc3RyZWFtO1xuICB9XG59XG4iLCIvLyBDb3B5cmlnaHQgwqkgMjAxNyBJbnRlbCBDb3Jwb3JhdGlvbi4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cblwidXNlIHN0cmljdFwiO1xuY29uc3Qgc2RrVmVyc2lvbiA9ICc0LjAnO1xuXG5leHBvcnQgZnVuY3Rpb24gaXNGaXJlZm94KCkge1xuICByZXR1cm4gd2luZG93Lm5hdmlnYXRvci51c2VyQWdlbnQubWF0Y2goXCJGaXJlZm94XCIpICE9PSBudWxsO1xufVxuZXhwb3J0IGZ1bmN0aW9uIGlzQ2hyb21lKCkge1xuICByZXR1cm4gd2luZG93Lm5hdmlnYXRvci51c2VyQWdlbnQubWF0Y2goJ0Nocm9tZScpICE9PSBudWxsO1xufVxuZXhwb3J0IGZ1bmN0aW9uIGlzU2FmYXJpKCkge1xuICByZXR1cm4gL14oKD8hY2hyb21lfGFuZHJvaWQpLikqc2FmYXJpL2kudGVzdCh3aW5kb3cubmF2aWdhdG9yLnVzZXJBZ2VudCk7XG59XG5leHBvcnQgZnVuY3Rpb24gY3JlYXRlVXVpZCgpIHtcbiAgcmV0dXJuICd4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eCcucmVwbGFjZSgvW3h5XS9nLCBmdW5jdGlvbihjKSB7XG4gICAgdmFyIHIgPSBNYXRoLnJhbmRvbSgpICogMTYgfCAwLFxuICAgICAgdiA9IGMgPT09ICd4JyA/IHIgOiAociAmIDB4MyB8IDB4OCk7XG4gICAgcmV0dXJuIHYudG9TdHJpbmcoMTYpO1xuICB9KTtcbn1cblxuLy8gUmV0dXJucyBzeXN0ZW0gaW5mb3JtYXRpb24uXG4vLyBGb3JtYXQ6IHtzZGs6e3ZlcnNpb246KiosIHR5cGU6Kip9LCBydW50aW1lOnt2ZXJzaW9uOioqLCBuYW1lOioqfSwgb3M6e3ZlcnNpb246KiosIG5hbWU6Kip9fTtcbmV4cG9ydCBmdW5jdGlvbiBzeXNJbmZvKCkge1xuICB2YXIgaW5mbyA9IE9iamVjdC5jcmVhdGUoe30pO1xuICBpbmZvLnNkayA9IHtcbiAgICB2ZXJzaW9uOiBzZGtWZXJzaW9uLFxuICAgIHR5cGU6ICdKYXZhU2NyaXB0J1xuICB9O1xuICAvLyBSdW50aW1lIGluZm8uXG4gIHZhciB1c2VyQWdlbnQgPSBuYXZpZ2F0b3IudXNlckFnZW50O1xuICB2YXIgZmlyZWZveFJlZ2V4ID0gL0ZpcmVmb3hcXC8oWzAtOVxcLl0rKS87XG4gIHZhciBjaHJvbWVSZWdleCA9IC9DaHJvbWVcXC8oWzAtOVxcLl0rKS87XG4gIHZhciBlZGdlUmVnZXggPSAvRWRnZVxcLyhbMC05XFwuXSspLztcbiAgdmFyIHNhZmFyaVZlcnNpb25SZWdleCA9IC9WZXJzaW9uXFwvKFswLTlcXC5dKykgU2FmYXJpLztcbiAgdmFyIHJlc3VsdCA9IGNocm9tZVJlZ2V4LmV4ZWModXNlckFnZW50KTtcbiAgaWYgKHJlc3VsdCkge1xuICAgIGluZm8ucnVudGltZSA9IHtcbiAgICAgIG5hbWU6ICdDaHJvbWUnLFxuICAgICAgdmVyc2lvbjogcmVzdWx0WzFdXG4gICAgfTtcbiAgfSBlbHNlIGlmIChyZXN1bHQgPSBmaXJlZm94UmVnZXguZXhlYyh1c2VyQWdlbnQpKSB7XG4gICAgaW5mby5ydW50aW1lID0ge1xuICAgICAgbmFtZTogJ0ZpcmVmb3gnLFxuICAgICAgdmVyc2lvbjogcmVzdWx0WzFdXG4gICAgfTtcbiAgfSBlbHNlIGlmIChyZXN1bHQgPSBlZGdlUmVnZXguZXhlYyh1c2VyQWdlbnQpKSB7XG4gICAgaW5mby5ydW50aW1lID0ge1xuICAgICAgbmFtZTogJ0VkZ2UnLFxuICAgICAgdmVyc2lvbjogcmVzdWx0WzFdXG4gICAgfTtcbiAgfSBlbHNlIGlmIChpc1NhZmFyaSgpKSB7XG4gICAgcmVzdWx0ID0gc2FmYXJpVmVyc2lvblJlZ2V4LmV4ZWModXNlckFnZW50KTtcbiAgICBpbmZvLnJ1bnRpbWUgPSB7XG4gICAgICBuYW1lOiAnU2FmYXJpJyxcbiAgICB9XG4gICAgaW5mby5ydW50aW1lLnZlcnNpb24gPSByZXN1bHQgPyByZXN1bHRbMV0gOiAnVW5rbm93bic7XG4gIH0gZWxzZSB7XG4gICAgaW5mby5ydW50aW1lID0ge1xuICAgICAgbmFtZTogJ1Vua25vd24nLFxuICAgICAgdmVyc2lvbjogJ1Vua25vd24nXG4gICAgfTtcbiAgfVxuICAvLyBPUyBpbmZvLlxuICB2YXIgd2luZG93c1JlZ2V4ID0gL1dpbmRvd3MgTlQgKFswLTlcXC5dKykvO1xuICB2YXIgbWFjUmVnZXggPSAvSW50ZWwgTWFjIE9TIFggKFswLTlfXFwuXSspLztcbiAgdmFyIGlQaG9uZVJlZ2V4ID0gL2lQaG9uZSBPUyAoWzAtOV9cXC5dKykvO1xuICB2YXIgbGludXhSZWdleCA9IC9YMTE7IExpbnV4LztcbiAgdmFyIGFuZHJvaWRSZWdleCA9IC9BbmRyb2lkKCAoWzAtOVxcLl0rKSk/LztcbiAgdmFyIGNocm9taXVtT3NSZWdleCA9IC9Dck9TLztcbiAgaWYgKHJlc3VsdCA9IHdpbmRvd3NSZWdleC5leGVjKHVzZXJBZ2VudCkpIHtcbiAgICBpbmZvLm9zID0ge1xuICAgICAgbmFtZTogJ1dpbmRvd3MgTlQnLFxuICAgICAgdmVyc2lvbjogcmVzdWx0WzFdXG4gICAgfTtcbiAgfSBlbHNlIGlmIChyZXN1bHQgPSBtYWNSZWdleC5leGVjKHVzZXJBZ2VudCkpIHtcbiAgICBpbmZvLm9zID0ge1xuICAgICAgbmFtZTogJ01hYyBPUyBYJyxcbiAgICAgIHZlcnNpb246IHJlc3VsdFsxXS5yZXBsYWNlKC9fL2csICcuJylcbiAgICB9O1xuICB9IGVsc2UgaWYgKHJlc3VsdCA9IGlQaG9uZVJlZ2V4LmV4ZWModXNlckFnZW50KSkge1xuICAgIGluZm8ub3MgPSB7XG4gICAgICBuYW1lOiAnaVBob25lIE9TJyxcbiAgICAgIHZlcnNpb246IHJlc3VsdFsxXS5yZXBsYWNlKC9fL2csICcuJylcbiAgICB9O1xuICB9IGVsc2UgaWYgKHJlc3VsdCA9IGxpbnV4UmVnZXguZXhlYyh1c2VyQWdlbnQpKSB7XG4gICAgaW5mby5vcyA9IHtcbiAgICAgIG5hbWU6ICdMaW51eCcsXG4gICAgICB2ZXJzaW9uOiAnVW5rbm93bidcbiAgICB9O1xuICB9IGVsc2UgaWYgKHJlc3VsdCA9IGFuZHJvaWRSZWdleC5leGVjKHVzZXJBZ2VudCkpIHtcbiAgICBpbmZvLm9zID0ge1xuICAgICAgbmFtZTogJ0FuZHJvaWQnLFxuICAgICAgdmVyc2lvbjogcmVzdWx0WzFdIHx8ICdVbmtub3duJ1xuICAgIH07XG4gIH0gZWxzZSBpZiAocmVzdWx0ID0gY2hyb21pdW1Pc1JlZ2V4LmV4ZWModXNlckFnZW50KSkge1xuICAgIGluZm8ub3MgPSB7XG4gICAgICBuYW1lOiAnQ2hyb21lIE9TJyxcbiAgICAgIHZlcnNpb246ICdVbmtub3duJ1xuICAgIH07XG4gIH0gZWxzZSB7XG4gICAgaW5mby5vcyA9IHtcbiAgICAgIG5hbWU6ICdVbmtub3duJyxcbiAgICAgIHZlcnNpb246ICdVbmtub3duJ1xuICAgIH07XG4gIH1cbiAgcmV0dXJuIGluZm87XG59O1xuIiwiLy8gQ29weXJpZ2h0IMKpIDIwMTcgSW50ZWwgQ29ycG9yYXRpb24uIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4ndXNlIHN0cmljdCc7XG5cbmltcG9ydCBMb2dnZXIgZnJvbSAnLi4vYmFzZS9sb2dnZXIuanMnO1xuaW1wb3J0IHsgRXZlbnREaXNwYXRjaGVyLCBNZXNzYWdlRXZlbnQsIEljc0V2ZW50LCBFcnJvckV2ZW50LCBNdXRlRXZlbnQgfSBmcm9tICcuLi9iYXNlL2V2ZW50LmpzJztcbmltcG9ydCB7IFRyYWNrS2luZCB9IGZyb20gJy4uL2Jhc2UvbWVkaWFmb3JtYXQuanMnXG5pbXBvcnQgeyBQdWJsaWNhdGlvbiB9IGZyb20gJy4uL2Jhc2UvcHVibGljYXRpb24uanMnO1xuaW1wb3J0IHsgU3Vic2NyaXB0aW9uIH0gZnJvbSAnLi9zdWJzY3JpcHRpb24uanMnXG5pbXBvcnQgeyBDb25mZXJlbmNlRXJyb3IgfSBmcm9tICcuL2Vycm9yLmpzJ1xuaW1wb3J0ICogYXMgVXRpbHMgZnJvbSAnLi4vYmFzZS91dGlscy5qcyc7XG5pbXBvcnQgKiBhcyBFcnJvck1vZHVsZSBmcm9tICcuL2Vycm9yLmpzJztcbmltcG9ydCAqIGFzIFN0cmVhbU1vZHVsZSBmcm9tICcuLi9iYXNlL3N0cmVhbS5qcyc7XG5pbXBvcnQgKiBhcyBTZHBVdGlscyBmcm9tICcuLi9iYXNlL3NkcHV0aWxzLmpzJztcblxuZXhwb3J0IGNsYXNzIENvbmZlcmVuY2VQZWVyQ29ubmVjdGlvbkNoYW5uZWwgZXh0ZW5kcyBFdmVudERpc3BhdGNoZXIge1xuICBjb25zdHJ1Y3Rvcihjb25maWcsIHNpZ25hbGluZykge1xuICAgIHN1cGVyKCk7XG4gICAgdGhpcy5fY29uZmlnID0gY29uZmlnO1xuICAgIHRoaXMuX29wdGlvbnMgPSBudWxsO1xuICAgIHRoaXMuX3NpZ25hbGluZyA9IHNpZ25hbGluZztcbiAgICB0aGlzLl9wYyA9IG51bGw7XG4gICAgdGhpcy5faW50ZXJuYWxJZCA9IG51bGw7IC8vIEl0J3MgcHVibGljYXRpb24gSUQgb3Igc3Vic2NyaXB0aW9uIElELlxuICAgIHRoaXMuX3BlbmRpbmdDYW5kaWRhdGVzID0gW107XG4gICAgdGhpcy5fc3Vic2NyaWJlUHJvbWlzZSA9IG51bGw7XG4gICAgdGhpcy5fcHVibGlzaFByb21pc2UgPSBudWxsO1xuICAgIHRoaXMuX3N1YnNjcmliZWRTdHJlYW0gPSBudWxsO1xuICAgIHRoaXMuX3B1Ymxpc2hlZFN0cmVhbSA9IG51bGw7XG4gICAgdGhpcy5fcHVibGljYXRpb24gPSBudWxsO1xuICAgIHRoaXMuX3N1YnNjcmlwdGlvbiA9IG51bGw7XG4gICAgdGhpcy5fZGlzY29ubmVjdFRpbWVyID0gbnVsbDsgIC8vIFRpbWVyIGZvciBQZWVyQ29ubmVjdGlvbiBkaXNjb25uZWN0ZWQuIFdpbGwgc3RvcCBjb25uZWN0aW9uIGFmdGVyIHRpbWVyLlxuICB9XG5cbiAgb25NZXNzYWdlKG5vdGlmaWNhdGlvbiwgbWVzc2FnZSkge1xuICAgIHN3aXRjaCAobm90aWZpY2F0aW9uKSB7XG4gICAgICBjYXNlICdwcm9ncmVzcyc6XG4gICAgICAgIGlmIChtZXNzYWdlLnN0YXR1cyA9PT0gJ3NvYWMnKVxuICAgICAgICAgIHRoaXMuX3NkcEhhbmRsZXIobWVzc2FnZS5kYXRhKTtcbiAgICAgICAgZWxzZSBpZiAobWVzc2FnZS5zdGF0dXMgPT09ICdyZWFkeScpXG4gICAgICAgICAgdGhpcy5fcmVhZHlIYW5kbGVyKCk7XG4gICAgICAgIGVsc2UgaWYobWVzc2FnZS5zdGF0dXMgPT09ICdlcnJvcicpXG4gICAgICAgICAgdGhpcy5fZXJyb3JIYW5kbGVyKG1lc3NhZ2UuZGF0YSk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAnc3RyZWFtJzpcbiAgICAgICAgdGhpcy5fb25TdHJlYW1FdmVudChtZXNzYWdlKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBkZWZhdWx0OlxuICAgICAgICBMb2dnZXIud2FybmluZygnVW5rbm93biBub3RpZmljYXRpb24gZnJvbSBNQ1UuJyk7XG4gICAgfVxuICB9XG5cbiAgcHVibGlzaChzdHJlYW0sIG9wdGlvbnMpIHtcbiAgICBpZiAob3B0aW9ucyA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICBvcHRpb25zID0geyBhdWRpbzogISFzdHJlYW0ubWVkaWFTdHJlYW0uZ2V0QXVkaW9UcmFja3MoKSwgdmlkZW86ICEhc3RyZWFtXG4gICAgICAgICAgLm1lZGlhU3RyZWFtLmdldFZpZGVvVHJhY2tzKCkgfTtcbiAgICB9XG4gICAgaWYgKHR5cGVvZiBvcHRpb25zICE9PSAnb2JqZWN0Jykge1xuICAgICAgcmV0dXJuIFByb21pc2UucmVqZWN0KG5ldyBUeXBlRXJyb3IoJ09wdGlvbnMgc2hvdWxkIGJlIGFuIG9iamVjdC4nKSk7XG4gICAgfVxuICAgIGlmIChvcHRpb25zLmF1ZGlvID09PSB1bmRlZmluZWQpIHtcbiAgICAgIG9wdGlvbnMuYXVkaW8gPSAhIXN0cmVhbS5tZWRpYVN0cmVhbS5nZXRBdWRpb1RyYWNrcygpO1xuICAgIH1cbiAgICBpZiAob3B0aW9ucy52aWRlbyA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICBvcHRpb25zLnZpZGVvID0gISFzdHJlYW0ubWVkaWFTdHJlYW0uZ2V0VmlkZW9UcmFja3MoKTtcbiAgICB9XG4gICAgaWYgKG9wdGlvbnMuYXVkaW8gJiYgIXN0cmVhbS5tZWRpYVN0cmVhbS5nZXRBdWRpb1RyYWNrcygpIHx8IChvcHRpb25zLnZpZGVvICYmXG4gICAgICAgICFzdHJlYW0ubWVkaWFTdHJlYW0uZ2V0VmlkZW9UcmFja3MoKSkpIHtcbiAgICAgIHJldHVybiBQcm9taXNlLnJlamVjdChuZXcgQ29uZmVyZW5jZUVycm9yKFxuICAgICAgICAnb3B0aW9ucy5hdWRpby92aWRlbyBjYW5ub3QgYmUgdHJ1ZSBvciBhbiBvYmplY3QgaWYgdGhlcmUgaXMgbm8gYXVkaW8vdmlkZW8gdHJhY2sgcHJlc2VudCBpbiB0aGUgTWVkaWFTdHJlYW0uJ1xuICAgICAgKSk7XG4gICAgfVxuICAgIGlmIChvcHRpb25zLmF1ZGlvID09PSBmYWxzZSAmJiBvcHRpb25zLnZpZGVvID09PSBmYWxzZSkge1xuICAgICAgcmV0dXJuIFByb21pc2UucmVqZWN0KG5ldyBDb25mZXJlbmNlRXJyb3IoXG4gICAgICAgICdDYW5ub3QgcHVibGlzaCBhIHN0cmVhbSB3aXRob3V0IGF1ZGlvIGFuZCB2aWRlby4nKSk7XG4gICAgfVxuICAgIGlmICh0eXBlb2Ygb3B0aW9ucy5hdWRpbyA9PT0gJ29iamVjdCcpIHtcbiAgICAgIGlmICghQXJyYXkuaXNBcnJheShvcHRpb25zLmF1ZGlvKSkge1xuICAgICAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QobmV3IFR5cGVFcnJvcihcbiAgICAgICAgICAnb3B0aW9ucy5hdWRpbyBzaG91bGQgYmUgYSBib29sZWFuIG9yIGFuIGFycmF5LicpKTtcbiAgICAgIH1cbiAgICAgIGZvciAoY29uc3QgcGFyYW1ldGVycyBvZiBvcHRpb25zLmF1ZGlvKSB7XG4gICAgICAgIGlmICghcGFyYW1ldGVycy5jb2RlYyB8fCB0eXBlb2YgcGFyYW1ldGVycy5jb2RlYy5uYW1lICE9PSAnc3RyaW5nJyB8fCAoXG4gICAgICAgICAgICBwYXJhbWV0ZXJzLm1heEJpdHJhdGUgIT09IHVuZGVmaW5lZCAmJiB0eXBlb2YgcGFyYW1ldGVycy5tYXhCaXRyYXRlICE9PVxuICAgICAgICAgICAgJ251bWJlcicpKSB7XG4gICAgICAgICAgcmV0dXJuIFByb21pc2UucmVqZWN0KG5ldyBUeXBlRXJyb3IoXG4gICAgICAgICAgICAnb3B0aW9ucy5hdWRpbyBoYXMgaW5jb3JyZWN0IHBhcmFtZXRlcnMuJykpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIGlmICh0eXBlb2Ygb3B0aW9ucy52aWRlbyA9PT0gJ29iamVjdCcpIHtcbiAgICAgIGlmICghQXJyYXkuaXNBcnJheShvcHRpb25zLnZpZGVvKSkge1xuICAgICAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QobmV3IFR5cGVFcnJvcihcbiAgICAgICAgICAnb3B0aW9ucy52aWRlbyBzaG91bGQgYmUgYSBib29sZWFuIG9yIGFuIGFycmF5LicpKTtcbiAgICAgIH1cbiAgICAgIGZvciAoY29uc3QgcGFyYW1ldGVycyBvZiBvcHRpb25zLnZpZGVvKSB7XG4gICAgICAgIGlmICghcGFyYW1ldGVycy5jb2RlYyB8fCB0eXBlb2YgcGFyYW1ldGVycy5jb2RlYy5uYW1lICE9PSAnc3RyaW5nJyB8fCAoXG4gICAgICAgICAgICBwYXJhbWV0ZXJzLm1heEJpdHJhdGUgIT09IHVuZGVmaW5lZCAmJiB0eXBlb2YgcGFyYW1ldGVycy5tYXhCaXRyYXRlICE9PVxuICAgICAgICAgICAgJ251bWJlcicpIHx8IChwYXJhbWV0ZXJzLmNvZGVjLnByb2ZpbGUgIT09IHVuZGVmaW5lZCAmJiB0eXBlb2YgcGFyYW1ldGVyc1xuICAgICAgICAgICAgLmNvZGVjLnByb2ZpbGUgIT09ICdzdHJpbmcnKSkge1xuICAgICAgICAgIHJldHVybiBQcm9taXNlLnJlamVjdChuZXcgVHlwZUVycm9yKFxuICAgICAgICAgICAgJ29wdGlvbnMudmlkZW8gaGFzIGluY29ycmVjdCBwYXJhbWV0ZXJzLicpKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICB0aGlzLl9vcHRpb25zID0gb3B0aW9ucztcbiAgICBjb25zdCBtZWRpYU9wdGlvbnMgPSB7fTtcbiAgICBpZiAoc3RyZWFtLm1lZGlhU3RyZWFtLmdldEF1ZGlvVHJhY2tzKCkubGVuZ3RoID4gMCkge1xuICAgICAgaWYgKHN0cmVhbS5tZWRpYVN0cmVhbS5nZXRBdWRpb1RyYWNrcygpLmxlbmd0aCA+IDEpIHtcbiAgICAgICAgTG9nZ2VyLndhcm5pbmcoXG4gICAgICAgICAgJ1B1Ymxpc2hpbmcgYSBzdHJlYW0gd2l0aCBtdWx0aXBsZSBhdWRpbyB0cmFja3MgaXMgbm90IGZ1bGx5IHN1cHBvcnRlZC4nXG4gICAgICAgICk7XG4gICAgICB9XG4gICAgICBpZiAodHlwZW9mIG9wdGlvbnMuYXVkaW8gIT09ICdib29sZWFuJyAmJiB0eXBlb2Ygb3B0aW9ucy5hdWRpbyAhPT1cbiAgICAgICAgJ29iamVjdCcpIHtcbiAgICAgICAgcmV0dXJuIFByb21pc2UucmVqZWN0KG5ldyBDb25mZXJlbmNlRXJyb3IoXG4gICAgICAgICAgJ1R5cGUgb2YgYXVkaW8gb3B0aW9ucyBzaG91bGQgYmUgYm9vbGVhbiBvciBhbiBvYmplY3QuJ1xuICAgICAgICApKTtcbiAgICAgIH1cbiAgICAgIG1lZGlhT3B0aW9ucy5hdWRpbyA9IHt9O1xuICAgICAgbWVkaWFPcHRpb25zLmF1ZGlvLnNvdXJjZSA9IHN0cmVhbS5zb3VyY2UuYXVkaW87XG4gICAgfSBlbHNlIHtcbiAgICAgIG1lZGlhT3B0aW9ucy5hdWRpbyA9IGZhbHNlO1xuICAgIH1cbiAgICBpZiAoc3RyZWFtLm1lZGlhU3RyZWFtLmdldFZpZGVvVHJhY2tzKCkubGVuZ3RoID4gMCkge1xuICAgICAgaWYgKHN0cmVhbS5tZWRpYVN0cmVhbS5nZXRWaWRlb1RyYWNrcygpLmxlbmd0aCA+IDEpIHtcbiAgICAgICAgTG9nZ2VyLndhcm5pbmcoXG4gICAgICAgICAgJ1B1Ymxpc2hpbmcgYSBzdHJlYW0gd2l0aCBtdWx0aXBsZSB2aWRlbyB0cmFja3MgaXMgbm90IGZ1bGx5IHN1cHBvcnRlZC4nXG4gICAgICAgICk7XG4gICAgICB9XG4gICAgICBtZWRpYU9wdGlvbnMudmlkZW8gPSB7fTtcbiAgICAgIG1lZGlhT3B0aW9ucy52aWRlby5zb3VyY2UgPSBzdHJlYW0uc291cmNlLnZpZGVvO1xuICAgICAgY29uc3QgdHJhY2tTZXR0aW5ncyA9IHN0cmVhbS5tZWRpYVN0cmVhbS5nZXRWaWRlb1RyYWNrcygpWzBdLmdldFNldHRpbmdzKCk7XG4gICAgICBtZWRpYU9wdGlvbnMudmlkZW8ucGFyYW1ldGVycyA9IHtcbiAgICAgICAgcmVzb2x1dGlvbjoge1xuICAgICAgICAgIHdpZHRoOiB0cmFja1NldHRpbmdzLndpZHRoLFxuICAgICAgICAgIGhlaWdodDogdHJhY2tTZXR0aW5ncy5oZWlnaHRcbiAgICAgICAgfSxcbiAgICAgICAgZnJhbWVyYXRlOiB0cmFja1NldHRpbmdzLmZyYW1lUmF0ZVxuICAgICAgfTtcbiAgICB9IGVsc2Uge1xuICAgICAgbWVkaWFPcHRpb25zLnZpZGVvID0gZmFsc2U7XG4gICAgfVxuICAgIHRoaXMuX3B1Ymxpc2hlZFN0cmVhbSA9IHN0cmVhbTtcbiAgICB0aGlzLl9zaWduYWxpbmcuc2VuZFNpZ25hbGluZ01lc3NhZ2UoJ3B1Ymxpc2gnLCB7XG4gICAgICBtZWRpYTogbWVkaWFPcHRpb25zLFxuICAgICAgYXR0cmlidXRlczogc3RyZWFtLmF0dHJpYnV0ZXNcbiAgICB9KS50aGVuKChkYXRhKSA9PiB7XG4gICAgICBjb25zdCBtZXNzYWdlRXZlbnQgPSBuZXcgTWVzc2FnZUV2ZW50KCdpZCcsIHtcbiAgICAgICAgbWVzc2FnZTogZGF0YS5pZCxcbiAgICAgICAgb3JpZ2luOiB0aGlzLl9yZW1vdGVJZFxuICAgICAgfSk7XG4gICAgICB0aGlzLmRpc3BhdGNoRXZlbnQobWVzc2FnZUV2ZW50KTtcbiAgICAgIHRoaXMuX2ludGVybmFsSWQgPSBkYXRhLmlkO1xuICAgICAgdGhpcy5fY3JlYXRlUGVlckNvbm5lY3Rpb24oKTtcbiAgICAgIHRoaXMuX3BjLmFkZFN0cmVhbShzdHJlYW0ubWVkaWFTdHJlYW0pO1xuICAgICAgY29uc3Qgb2ZmZXJPcHRpb25zID0ge1xuICAgICAgICBvZmZlclRvUmVjZWl2ZUF1ZGlvOiBmYWxzZSxcbiAgICAgICAgb2ZmZXJUb1JlY2VpdmVWaWRlbzogZmFsc2VcbiAgICAgIH07XG4gICAgICBpZiAodHlwZW9mIHRoaXMuX3BjLmFkZFRyYW5zY2VpdmVyID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgIC8vIHxkaXJlY3Rpb258IHNlZW1zIG5vdCB3b3JraW5nIG9uIFNhZmFyaS5cbiAgICAgICAgaWYgKG1lZGlhT3B0aW9ucy5hdWRpbyAmJiBzdHJlYW0ubWVkaWFTdHJlYW0uZ2V0QXVkaW9UcmFja3MoKSA+IDApIHtcbiAgICAgICAgICBjb25zdCBhdWRpb1RyYW5zY2VpdmVyID0gdGhpcy5fcGMuYWRkVHJhbnNjZWl2ZXIoJ2F1ZGlvJywgeyBkaXJlY3Rpb246ICdzZW5kb25seScgfSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKG1lZGlhT3B0aW9ucy52aWRlbyAmJiBzdHJlYW0ubWVkaWFTdHJlYW0uZ2V0VmlkZW9UcmFja3MoKSA+IDApIHtcbiAgICAgICAgICBjb25zdCB2aWRlb1RyYW5zY2VpdmVyID0gdGhpcy5fcGMuYWRkVHJhbnNjZWl2ZXIoJ3ZpZGVvJywgeyBkaXJlY3Rpb246ICdzZW5kb25seScgfSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGxldCBsb2NhbERlc2M7XG4gICAgICB0aGlzLl9wYy5jcmVhdGVPZmZlcihvZmZlck9wdGlvbnMpLnRoZW4oZGVzYyA9PiB7XG4gICAgICAgIGlmIChvcHRpb25zKSB7XG4gICAgICAgICAgZGVzYy5zZHAgPSB0aGlzLl9zZXRSdHBSZWNlaXZlck9wdGlvbnMoZGVzYy5zZHAsIG9wdGlvbnMpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBkZXNjO1xuICAgICAgfSkudGhlbihkZXNjID0+IHtcbiAgICAgICAgbG9jYWxEZXNjID0gZGVzYztcbiAgICAgICAgcmV0dXJuIHRoaXMuX3BjLnNldExvY2FsRGVzY3JpcHRpb24oZGVzYyk7XG4gICAgICB9KS50aGVuKCgpID0+IHtcbiAgICAgICAgdGhpcy5fc2lnbmFsaW5nLnNlbmRTaWduYWxpbmdNZXNzYWdlKCdzb2FjJywge1xuICAgICAgICAgIGlkOiB0aGlzXG4gICAgICAgICAgICAuX2ludGVybmFsSWQsXG4gICAgICAgICAgc2lnbmFsaW5nOiBsb2NhbERlc2NcbiAgICAgICAgfSk7XG4gICAgICB9KS5jYXRjaChlID0+IHtcbiAgICAgICAgTG9nZ2VyLmVycm9yKCdGYWlsZWQgdG8gY3JlYXRlIG9mZmVyIG9yIHNldCBTRFAuIE1lc3NhZ2U6ICcgKyBlLm1lc3NhZ2UpO1xuICAgICAgICB0aGlzLl9yZWplY3RQcm9taXNlKGUpO1xuICAgICAgICB0aGlzLl9maXJlRW5kZWRFdmVudE9uUHVibGljYXRpb25PclN1YnNjcmlwdGlvbigpO1xuICAgICAgfSk7XG4gICAgfSk7XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgIHRoaXMuX3B1Ymxpc2hQcm9taXNlID0geyByZXNvbHZlOiByZXNvbHZlLCByZWplY3Q6IHJlamVjdCB9O1xuICAgIH0pO1xuICB9XG5cbiAgc3Vic2NyaWJlKHN0cmVhbSwgb3B0aW9ucykge1xuICAgIGlmIChvcHRpb25zID09PSB1bmRlZmluZWQpIHtcbiAgICAgIG9wdGlvbnMgPSB7XG4gICAgICAgIGF1ZGlvOiAhIXN0cmVhbS5jYXBhYmlsaXRpZXMuYXVkaW8sXG4gICAgICAgIHZpZGVvOiAhIXN0cmVhbS5jYXBhYmlsaXRpZXMudmlkZW9cbiAgICAgIH07XG4gICAgfVxuICAgIGlmICh0eXBlb2Ygb3B0aW9ucyAhPT0gJ29iamVjdCcpIHtcbiAgICAgIHJldHVybiBQcm9taXNlLnJlamVjdChuZXcgVHlwZUVycm9yKCdPcHRpb25zIHNob3VsZCBiZSBhbiBvYmplY3QuJykpO1xuICAgIH1cbiAgICBpZiAob3B0aW9ucy5hdWRpbyA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICBvcHRpb25zLmF1ZGlvID0gISFzdHJlYW0uY2FwYWJpbGl0aWVzLmF1ZGlvXG4gICAgfVxuICAgIGlmIChvcHRpb25zLnZpZGVvID09PSB1bmRlZmluZWQpIHtcbiAgICAgIG9wdGlvbnMudmlkZW8gPSAhIXN0cmVhbS5jYXBhYmlsaXRpZXMudmlkZW9cbiAgICB9XG4gICAgaWYgKChvcHRpb25zLmF1ZGlvICE9PSB1bmRlZmluZWQgJiYgdHlwZW9mIG9wdGlvbnMuYXVkaW8gIT09ICdvYmplY3QnICYmXG4gICAgICAgIHR5cGVvZiBvcHRpb25zLmF1ZGlvICE9PSAnYm9vbGVhbicgJiYgb3B0aW9ucy5hdWRpbyAhPT0gbnVsbCkgfHwgKFxuICAgICAgICBvcHRpb25zLnZpZGVvICE9PSB1bmRlZmluZWQgJiYgdHlwZW9mIG9wdGlvbnMudmlkZW8gIT09ICdvYmplY3QnICYmXG4gICAgICAgIHR5cGVvZiBvcHRpb25zLnZpZGVvICE9PSAnYm9vbGVhbicgJiYgb3B0aW9ucy52aWRlbyAhPT0gbnVsbCkpIHtcbiAgICAgIHJldHVybiBQcm9taXNlLnJlamVjdChuZXcgVHlwZUVycm9yKCdJbnZhbGlkIG9wdGlvbnMgdHlwZS4nKSlcbiAgICB9XG4gICAgaWYgKG9wdGlvbnMuYXVkaW8gJiYgIXN0cmVhbS5jYXBhYmlsaXRpZXMuYXVkaW8gfHwgKG9wdGlvbnMudmlkZW8gJiZcbiAgICAgICAgIXN0cmVhbS5jYXBhYmlsaXRpZXMudmlkZW8pKSB7XG4gICAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QobmV3IENvbmZlcmVuY2VFcnJvcihcbiAgICAgICAgJ29wdGlvbnMuYXVkaW8vdmlkZW8gY2Fubm90IGJlIHRydWUgb3IgYW4gb2JqZWN0IGlmIHRoZXJlIGlzIG5vIGF1ZGlvL3ZpZGVvIHRyYWNrIGluIHJlbW90ZSBzdHJlYW0uJ1xuICAgICAgKSk7XG4gICAgfVxuICAgIGlmIChvcHRpb25zLmF1ZGlvID09PSBmYWxzZSAmJiBvcHRpb25zLnZpZGVvID09PSBmYWxzZSkge1xuICAgICAgcmV0dXJuIFByb21pc2UucmVqZWN0KG5ldyBDb25mZXJlbmNlRXJyb3IoXG4gICAgICAgICdDYW5ub3Qgc3Vic2NyaWJlIGEgc3RyZWFtIHdpdGhvdXQgYXVkaW8gYW5kIHZpZGVvLicpKTtcbiAgICB9XG4gICAgdGhpcy5fb3B0aW9ucyA9IG9wdGlvbnM7XG4gICAgY29uc3QgbWVkaWFPcHRpb25zID0ge307XG4gICAgaWYgKG9wdGlvbnMuYXVkaW8pIHtcbiAgICAgIG1lZGlhT3B0aW9ucy5hdWRpbyA9IHt9O1xuICAgICAgbWVkaWFPcHRpb25zLmF1ZGlvLmZyb20gPSBzdHJlYW0uaWQ7XG4gICAgfSBlbHNlIHtcbiAgICAgIG1lZGlhT3B0aW9ucy5hdWRpbyA9IGZhbHNlO1xuICAgIH1cbiAgICBpZiAob3B0aW9ucy52aWRlbykge1xuICAgICAgbWVkaWFPcHRpb25zLnZpZGVvID0ge307XG4gICAgICBtZWRpYU9wdGlvbnMudmlkZW8uZnJvbSA9IHN0cmVhbS5pZDtcbiAgICAgIGlmIChvcHRpb25zLnZpZGVvLnJlc29sdXRpb24gfHwgb3B0aW9ucy52aWRlby5mcmFtZVJhdGUgfHwgKG9wdGlvbnMudmlkZW9cbiAgICAgICAgICAuYml0cmF0ZU11bHRpcGxpZXIgJiYgb3B0aW9ucy52aWRlby5iaXRyYXRlTXVsdGlwbGllciAhPT0gMSkgfHxcbiAgICAgICAgb3B0aW9ucy52aWRlby5rZXlGcmFtZUludGVydmFsKSB7XG4gICAgICAgIG1lZGlhT3B0aW9ucy52aWRlby5wYXJhbWV0ZXJzID0ge1xuICAgICAgICAgIHJlc29sdXRpb246IG9wdGlvbnMudmlkZW8ucmVzb2x1dGlvbixcbiAgICAgICAgICBmcmFtZXJhdGU6IG9wdGlvbnMudmlkZW8uZnJhbWVSYXRlLFxuICAgICAgICAgIGJpdHJhdGU6IG9wdGlvbnMudmlkZW8uYml0cmF0ZU11bHRpcGxpZXIgPyAneCcgKyBvcHRpb25zLnZpZGVvLmJpdHJhdGVNdWx0aXBsaWVyXG4gICAgICAgICAgICAudG9TdHJpbmcoKSA6IHVuZGVmaW5lZCxcbiAgICAgICAgICBrZXlGcmFtZUludGVydmFsOiBvcHRpb25zLnZpZGVvLmtleUZyYW1lSW50ZXJ2YWxcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBtZWRpYU9wdGlvbnMudmlkZW8gPSBmYWxzZTtcbiAgICB9XG4gICAgdGhpcy5fc3Vic2NyaWJlZFN0cmVhbSA9IHN0cmVhbTtcbiAgICB0aGlzLl9zaWduYWxpbmcuc2VuZFNpZ25hbGluZ01lc3NhZ2UoJ3N1YnNjcmliZScsIHtcbiAgICAgIG1lZGlhOiBtZWRpYU9wdGlvbnNcbiAgICB9KS50aGVuKChkYXRhKSA9PiB7XG4gICAgICBjb25zdCBtZXNzYWdlRXZlbnQgPSBuZXcgTWVzc2FnZUV2ZW50KCdpZCcsIHtcbiAgICAgICAgbWVzc2FnZTogZGF0YS5pZCxcbiAgICAgICAgb3JpZ2luOiB0aGlzLl9yZW1vdGVJZFxuICAgICAgfSk7XG4gICAgICB0aGlzLmRpc3BhdGNoRXZlbnQobWVzc2FnZUV2ZW50KTtcbiAgICAgIHRoaXMuX2ludGVybmFsSWQgPSBkYXRhLmlkO1xuICAgICAgdGhpcy5fY3JlYXRlUGVlckNvbm5lY3Rpb24oKTtcbiAgICAgIGNvbnN0IG9mZmVyT3B0aW9ucyA9IHtcbiAgICAgICAgb2ZmZXJUb1JlY2VpdmVBdWRpbzogISFvcHRpb25zLmF1ZGlvLFxuICAgICAgICBvZmZlclRvUmVjZWl2ZVZpZGVvOiAhIW9wdGlvbnMudmlkZW9cbiAgICAgIH07XG4gICAgICBpZiAodHlwZW9mIHRoaXMuX3BjLmFkZFRyYW5zY2VpdmVyID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgIC8vIHxkaXJlY3Rpb258IHNlZW1zIG5vdCB3b3JraW5nIG9uIFNhZmFyaS5cbiAgICAgICAgaWYgKG1lZGlhT3B0aW9ucy5hdWRpbykge1xuICAgICAgICAgIGNvbnN0IGF1ZGlvVHJhbnNjZWl2ZXIgPSB0aGlzLl9wYy5hZGRUcmFuc2NlaXZlcignYXVkaW8nLCB7IGRpcmVjdGlvbjogJ3JlY3Zvbmx5JyB9KTtcbiAgICAgICAgfVxuICAgICAgICBpZiAobWVkaWFPcHRpb25zLnZpZGVvKSB7XG4gICAgICAgICAgY29uc3QgdmlkZW9UcmFuc2NlaXZlciA9IHRoaXMuX3BjLmFkZFRyYW5zY2VpdmVyKCd2aWRlbycsIHsgZGlyZWN0aW9uOiAncmVjdm9ubHknIH0pO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICB0aGlzLl9wYy5jcmVhdGVPZmZlcihvZmZlck9wdGlvbnMpLnRoZW4oZGVzYyA9PiB7XG4gICAgICAgIGlmIChvcHRpb25zKSB7XG4gICAgICAgICAgZGVzYy5zZHAgPSB0aGlzLl9zZXRSdHBSZWNlaXZlck9wdGlvbnMoZGVzYy5zZHAsIG9wdGlvbnMpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuX3BjLnNldExvY2FsRGVzY3JpcHRpb24oZGVzYykudGhlbigoKSA9PiB7XG4gICAgICAgICAgdGhpcy5fc2lnbmFsaW5nLnNlbmRTaWduYWxpbmdNZXNzYWdlKCdzb2FjJywge1xuICAgICAgICAgICAgaWQ6IHRoaXNcbiAgICAgICAgICAgICAgLl9pbnRlcm5hbElkLFxuICAgICAgICAgICAgc2lnbmFsaW5nOiBkZXNjXG4gICAgICAgICAgfSlcbiAgICAgICAgfSwgZnVuY3Rpb24oZXJyb3JNZXNzYWdlKSB7XG4gICAgICAgICAgTG9nZ2VyLmVycm9yKCdTZXQgbG9jYWwgZGVzY3JpcHRpb24gZmFpbGVkLiBNZXNzYWdlOiAnICtcbiAgICAgICAgICAgIEpTT04uc3RyaW5naWZ5KGVycm9yTWVzc2FnZSkpO1xuICAgICAgICB9KTtcbiAgICAgIH0sIGZ1bmN0aW9uKGVycm9yKSB7XG4gICAgICAgIExvZ2dlci5lcnJvcignQ3JlYXRlIG9mZmVyIGZhaWxlZC4gRXJyb3IgaW5mbzogJyArIEpTT04uc3RyaW5naWZ5KFxuICAgICAgICAgIGVycm9yKSk7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgdGhpcy5fc3Vic2NyaWJlUHJvbWlzZSA9IHsgcmVzb2x2ZTogcmVzb2x2ZSwgcmVqZWN0OiByZWplY3QgfTtcbiAgICB9KTtcbiAgfVxuXG4gIF91bnB1Ymxpc2goKSB7XG4gICAgdGhpcy5fc2lnbmFsaW5nLnNlbmRTaWduYWxpbmdNZXNzYWdlKCd1bnB1Ymxpc2gnLCB7IGlkOiB0aGlzLl9pbnRlcm5hbElkIH0pXG4gICAgICAuY2F0Y2goZSA9PiB7XG4gICAgICAgIExvZ2dlci53YXJuaW5nKCdNQ1UgcmV0dXJucyBuZWdhdGl2ZSBhY2sgZm9yIHVucHVibGlzaGluZywgJyArIGUpO1xuICAgICAgfSk7XG4gICAgaWYgKHRoaXMuX3BjLnNpZ25hbGluZ1N0YXRlICE9PSAnY2xvc2VkJykge1xuICAgICAgdGhpcy5fcGMuY2xvc2UoKTtcbiAgICB9XG4gIH1cblxuICBfdW5zdWJzY3JpYmUoKSB7XG4gICAgdGhpcy5fc2lnbmFsaW5nLnNlbmRTaWduYWxpbmdNZXNzYWdlKCd1bnN1YnNjcmliZScsIHtcbiAgICAgICAgaWQ6IHRoaXMuX2ludGVybmFsSWRcbiAgICAgIH0pXG4gICAgICAuY2F0Y2goZSA9PiB7XG4gICAgICAgIExvZ2dlci53YXJuaW5nKCdNQ1UgcmV0dXJucyBuZWdhdGl2ZSBhY2sgZm9yIHVuc3Vic2NyaWJpbmcsICcgKyBlKTtcbiAgICAgIH0pO1xuICAgIGlmICh0aGlzLl9wYy5zaWduYWxpbmdTdGF0ZSAhPT0gJ2Nsb3NlZCcpIHtcbiAgICAgIHRoaXMuX3BjLmNsb3NlKCk7XG4gICAgfVxuICB9XG5cbiAgX211dGVPclVubXV0ZShpc011dGUsIGlzUHViLCB0cmFja0tpbmQpIHtcbiAgICBjb25zdCBldmVudE5hbWUgPSBpc1B1YiA/ICdzdHJlYW0tY29udHJvbCcgOlxuICAgICAgJ3N1YnNjcmlwdGlvbi1jb250cm9sJztcbiAgICBjb25zdCBvcGVyYXRpb24gPSBpc011dGUgPyAncGF1c2UnIDogJ3BsYXknO1xuICAgIHJldHVybiB0aGlzLl9zaWduYWxpbmcuc2VuZFNpZ25hbGluZ01lc3NhZ2UoZXZlbnROYW1lLCB7XG4gICAgICBpZDogdGhpcy5faW50ZXJuYWxJZCxcbiAgICAgIG9wZXJhdGlvbjogb3BlcmF0aW9uLFxuICAgICAgZGF0YTogdHJhY2tLaW5kXG4gICAgfSkudGhlbigoKSA9PiB7XG4gICAgICBpZiAoIWlzUHViKSB7XG4gICAgICAgIGNvbnN0IG11dGVFdmVudE5hbWUgPSBpc011dGUgPyAnbXV0ZScgOiAndW5tdXRlJztcbiAgICAgICAgdGhpcy5fc3Vic2NyaXB0aW9uLmRpc3BhdGNoRXZlbnQobmV3IE11dGVFdmVudChtdXRlRXZlbnROYW1lLCB7IGtpbmQ6IHRyYWNrS2luZCB9KSk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICBfYXBwbHlPcHRpb25zKG9wdGlvbnMpIHtcbiAgICBpZiAodHlwZW9mIG9wdGlvbnMgIT09ICdvYmplY3QnIHx8IHR5cGVvZiBvcHRpb25zLnZpZGVvICE9PSAnb2JqZWN0Jykge1xuICAgICAgcmV0dXJuIFByb21pc2UucmVqZWN0KG5ldyBDb25mZXJlbmNlRXJyb3IoXG4gICAgICAgICdPcHRpb25zIHNob3VsZCBiZSBhbiBvYmplY3QuJykpO1xuICAgIH1cbiAgICBjb25zdCB2aWRlb09wdGlvbnMgPSB7fTtcbiAgICB2aWRlb09wdGlvbnMucmVzb2x1dGlvbiA9IG9wdGlvbnMudmlkZW8ucmVzb2x1dGlvbjtcbiAgICB2aWRlb09wdGlvbnMuZnJhbWVyYXRlID0gb3B0aW9ucy52aWRlby5mcmFtZVJhdGU7XG4gICAgdmlkZW9PcHRpb25zLmJpdHJhdGUgPSBvcHRpb25zLnZpZGVvLmJpdHJhdGVNdWx0aXBsaWVyID8gJ3gnICsgb3B0aW9ucy52aWRlb1xuICAgICAgLmJpdHJhdGVNdWx0aXBsaWVyXG4gICAgICAudG9TdHJpbmcoKSA6IHVuZGVmaW5lZDtcbiAgICB2aWRlb09wdGlvbnMua2V5RnJhbWVJbnRlcnZhbCA9IG9wdGlvbnMudmlkZW8ua2V5RnJhbWVJbnRlcnZhbDtcbiAgICByZXR1cm4gdGhpcy5fc2lnbmFsaW5nLnNlbmRTaWduYWxpbmdNZXNzYWdlKCdzdWJzY3JpcHRpb24tY29udHJvbCcsIHtcbiAgICAgIGlkOiB0aGlzLl9pbnRlcm5hbElkLFxuICAgICAgb3BlcmF0aW9uOiAndXBkYXRlJyxcbiAgICAgIGRhdGE6IHtcbiAgICAgICAgdmlkZW86IHsgcGFyYW1ldGVyczogdmlkZW9PcHRpb25zIH1cbiAgICAgIH1cbiAgICB9KS50aGVuKCk7XG4gIH1cblxuICBfb25SZW1vdGVTdHJlYW1BZGRlZChldmVudCkge1xuICAgIExvZ2dlci5kZWJ1ZygnUmVtb3RlIHN0cmVhbSBhZGRlZC4nKTtcbiAgICBpZiAodGhpcy5fc3Vic2NyaWJlZFN0cmVhbSkge1xuICAgICAgdGhpcy5fc3Vic2NyaWJlZFN0cmVhbS5tZWRpYVN0cmVhbSA9IGV2ZW50LnN0cmVhbTtcbiAgICB9IGVsc2Uge1xuICAgICAgLy8gVGhpcyBpcyBub3QgZXhwZWN0ZWQgcGF0aC4gSG93ZXZlciwgdGhpcyBpcyBnb2luZyB0byBoYXBwZW4gb24gU2FmYXJpXG4gICAgICAvLyBiZWNhdXNlIGl0IGRvZXMgbm90IHN1cHBvcnQgc2V0dGluZyBkaXJlY3Rpb24gb2YgdHJhbnNjZWl2ZXIuXG4gICAgICBMb2dnZXIud2FybmluZygnUmVjZWl2ZWQgcmVtb3RlIHN0cmVhbSB3aXRob3V0IHN1YnNjcmlwdGlvbi4nKTtcbiAgICB9XG4gIH1cblxuICBfb25Mb2NhbEljZUNhbmRpZGF0ZShldmVudCkge1xuICAgIGlmIChldmVudC5jYW5kaWRhdGUpIHtcbiAgICAgIGlmICh0aGlzLl9wYy5zaWduYWxpbmdTdGF0ZSAhPT0gJ3N0YWJsZScpIHtcbiAgICAgICAgdGhpcy5fcGVuZGluZ0NhbmRpZGF0ZXMucHVzaChldmVudC5jYW5kaWRhdGUpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5fc2VuZENhbmRpZGF0ZShldmVudC5jYW5kaWRhdGUpO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBMb2dnZXIuZGVidWcoJ0VtcHR5IGNhbmRpZGF0ZS4nKTtcbiAgICB9XG4gIH1cblxuICBfZmlyZUVuZGVkRXZlbnRPblB1YmxpY2F0aW9uT3JTdWJzY3JpcHRpb24oKSB7XG4gICAgY29uc3QgZXZlbnQgPSBuZXcgSWNzRXZlbnQoJ2VuZGVkJylcbiAgICBpZiAodGhpcy5fcHVibGljYXRpb24pIHtcbiAgICAgIHRoaXMuX3B1YmxpY2F0aW9uLmRpc3BhdGNoRXZlbnQoZXZlbnQpO1xuICAgICAgdGhpcy5fcHVibGljYXRpb24uc3RvcCgpO1xuICAgIH0gZWxzZSBpZiAodGhpcy5fc3Vic2NyaXB0aW9uKSB7XG4gICAgICB0aGlzLl9zdWJzY3JpcHRpb24uZGlzcGF0Y2hFdmVudChldmVudCk7XG4gICAgICB0aGlzLl9zdWJzY3JpcHRpb24uc3RvcCgpO1xuICAgIH1cbiAgfVxuXG4gIF9yZWplY3RQcm9taXNlKGVycm9yKSB7XG4gICAgaWYgKCFlcnJvcikge1xuICAgICAgY29uc3QgZXJyb3IgPSBuZXcgQ29uZmVyZW5jZUVycm9yKCdDb25uZWN0aW9uIGZhaWxlZCBvciBjbG9zZWQuJyk7XG4gICAgfVxuICAgIC8vIFJlamVjdGluZyBjb3JyZXNwb25kaW5nIHByb21pc2UgaWYgcHVibGlzaGluZyBhbmQgc3Vic2NyaWJpbmcgaXMgb25nb2luZy5cbiAgICBpZiAodGhpcy5fcHVibGlzaFByb21pc2UpIHtcbiAgICAgIHRoaXMuX3B1Ymxpc2hQcm9taXNlLnJlamVjdChlcnJvcik7XG4gICAgICB0aGlzLl9wdWJsaXNoUHJvbWlzZSA9IHVuZGVmaW5lZDtcbiAgICB9IGVsc2UgaWYgKHRoaXMuX3N1YnNjcmliZVByb21pc2UpIHtcbiAgICAgIHRoaXMuX3N1YnNjcmliZVByb21pc2UucmVqZWN0KGVycm9yKTtcbiAgICAgIHRoaXMuX3N1YnNjcmliZVByb21pc2UgPSB1bmRlZmluZWQ7XG4gICAgfVxuICB9XG5cbiAgX29uSWNlQ29ubmVjdGlvblN0YXRlQ2hhbmdlKGV2ZW50KSB7XG4gICAgaWYgKCFldmVudCB8fCAhZXZlbnQuY3VycmVudFRhcmdldClcbiAgICAgIHJldHVybjtcblxuICAgIExvZ2dlci5kZWJ1ZygnSUNFIGNvbm5lY3Rpb24gc3RhdGUgY2hhbmdlZCB0byAnICsgZXZlbnQuY3VycmVudFRhcmdldC5pY2VDb25uZWN0aW9uU3RhdGUpO1xuICAgIGlmIChldmVudC5jdXJyZW50VGFyZ2V0LmljZUNvbm5lY3Rpb25TdGF0ZSA9PT0gJ2Nsb3NlZCcgfHwgZXZlbnQuY3VycmVudFRhcmdldFxuICAgICAgLmljZUNvbm5lY3Rpb25TdGF0ZSA9PT0gJ2ZhaWxlZCcpIHtcbiAgICAgIHRoaXMuX3JlamVjdFByb21pc2UobmV3IENvbmZlcmVuY2VFcnJvcignSUNFIGNvbm5lY3Rpb24gZmFpbGVkIG9yIGNsb3NlZC4nKSk7XG4gICAgICAvLyBGaXJlIGVuZGVkIGV2ZW50IGlmIHB1YmxpY2F0aW9uIG9yIHN1YnNjcmlwdGlvbiBleGlzdHMuXG4gICAgICB0aGlzLl9maXJlRW5kZWRFdmVudE9uUHVibGljYXRpb25PclN1YnNjcmlwdGlvbigpO1xuICAgIH1cbiAgfVxuXG4gIF9zZW5kQ2FuZGlkYXRlKGNhbmRpZGF0ZSkge1xuICAgIHRoaXMuX3NpZ25hbGluZy5zZW5kU2lnbmFsaW5nTWVzc2FnZSgnc29hYycsIHtcbiAgICAgIGlkOiB0aGlzLl9pbnRlcm5hbElkLFxuICAgICAgc2lnbmFsaW5nOiB7XG4gICAgICAgIHR5cGU6ICdjYW5kaWRhdGUnLFxuICAgICAgICBjYW5kaWRhdGU6IHtcbiAgICAgICAgICBjYW5kaWRhdGU6ICdhPScgKyBjYW5kaWRhdGUuY2FuZGlkYXRlLFxuICAgICAgICAgIHNkcE1pZDogY2FuZGlkYXRlLnNkcE1pZCxcbiAgICAgICAgICBzZHBNTGluZUluZGV4OiBjYW5kaWRhdGUuc2RwTUxpbmVJbmRleFxuICAgICAgICB9XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICBfY3JlYXRlUGVlckNvbm5lY3Rpb24oKSB7XG4gICAgdGhpcy5fcGMgPSBuZXcgUlRDUGVlckNvbm5lY3Rpb24odGhpcy5fY29uZmlnLnJ0Y0NvbmZpZ3VyYXRpb24pO1xuICAgIHRoaXMuX3BjLm9uaWNlY2FuZGlkYXRlID0gKGV2ZW50KSA9PiB7XG4gICAgICB0aGlzLl9vbkxvY2FsSWNlQ2FuZGlkYXRlLmFwcGx5KHRoaXMsIFtldmVudF0pO1xuICAgIH07XG4gICAgdGhpcy5fcGMub25hZGRzdHJlYW0gPSAoZXZlbnQpID0+IHtcbiAgICAgIHRoaXMuX29uUmVtb3RlU3RyZWFtQWRkZWQuYXBwbHkodGhpcywgW2V2ZW50XSk7XG4gICAgfTtcbiAgICB0aGlzLl9wYy5vbmljZWNvbm5lY3Rpb25zdGF0ZWNoYW5nZSA9IChldmVudCkgPT4ge1xuICAgICAgdGhpcy5fb25JY2VDb25uZWN0aW9uU3RhdGVDaGFuZ2UuYXBwbHkodGhpcywgW2V2ZW50XSk7XG4gICAgfTtcbiAgfVxuXG4gIF9nZXRTdGF0cygpIHtcbiAgICBpZiAodGhpcy5fcGMpIHtcbiAgICAgIHJldHVybiB0aGlzLl9wYy5nZXRTdGF0cygpO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QobmV3IENvbmZlcmVuY2VFcnJvcihcbiAgICAgICAgJ1BlZXJDb25uZWN0aW9uIGlzIG5vdCBhdmFpbGFibGUuJykpO1xuICAgIH1cbiAgfVxuXG4gIF9yZWFkeUhhbmRsZXIoKSB7XG4gICAgaWYgKHRoaXMuX3N1YnNjcmliZVByb21pc2UpIHtcbiAgICAgIHRoaXMuX3N1YnNjcmlwdGlvbiA9IG5ldyBTdWJzY3JpcHRpb24odGhpcy5faW50ZXJuYWxJZCwgKCkgPT4ge1xuICAgICAgICAgIHRoaXMuX3Vuc3Vic2NyaWJlKCk7XG4gICAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSgpO1xuICAgICAgICB9LCAoKSA9PiB0aGlzLl9nZXRTdGF0cygpLFxuICAgICAgICB0cmFja0tpbmQgPT4gdGhpcy5fbXV0ZU9yVW5tdXRlKHRydWUsIGZhbHNlLCB0cmFja0tpbmQpLFxuICAgICAgICB0cmFja0tpbmQgPT4gdGhpcy5fbXV0ZU9yVW5tdXRlKGZhbHNlLCBmYWxzZSwgdHJhY2tLaW5kKSxcbiAgICAgICAgb3B0aW9ucyA9PiB0aGlzLl9hcHBseU9wdGlvbnMob3B0aW9ucykpO1xuICAgICAgLy8gRmlyZSBzdWJzY3JpcHRpb24ncyBlbmRlZCBldmVudCB3aGVuIGFzc29jaWF0ZWQgc3RyZWFtIGlzIGVuZGVkLlxuICAgICAgdGhpcy5fc3Vic2NyaWJlZFN0cmVhbS5hZGRFdmVudExpc3RlbmVyKCdlbmRlZCcsICgpID0+IHtcbiAgICAgICAgdGhpcy5fc3Vic2NyaXB0aW9uLmRpc3BhdGNoRXZlbnQoJ2VuZGVkJywgbmV3IEljc0V2ZW50KCdlbmRlZCcpKTtcbiAgICAgIH0pO1xuICAgICAgdGhpcy5fc3Vic2NyaWJlUHJvbWlzZS5yZXNvbHZlKHRoaXMuX3N1YnNjcmlwdGlvbik7XG4gICAgfSBlbHNlIGlmICh0aGlzLl9wdWJsaXNoUHJvbWlzZSkge1xuICAgICAgdGhpcy5fcHVibGljYXRpb24gPSBuZXcgUHVibGljYXRpb24odGhpcy5faW50ZXJuYWxJZCwgKCkgPT4ge1xuICAgICAgICAgIHRoaXMuX3VucHVibGlzaCgpO1xuICAgICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoKTtcbiAgICAgICAgfSwgKCkgPT4gdGhpcy5fZ2V0U3RhdHMoKSxcbiAgICAgICAgdHJhY2tLaW5kID0+IHRoaXMuX211dGVPclVubXV0ZSh0cnVlLCB0cnVlLCB0cmFja0tpbmQpLFxuICAgICAgICB0cmFja0tpbmQgPT4gdGhpcy5fbXV0ZU9yVW5tdXRlKGZhbHNlLCB0cnVlLCB0cmFja0tpbmQpKTtcbiAgICAgIHRoaXMuX3B1Ymxpc2hQcm9taXNlLnJlc29sdmUodGhpcy5fcHVibGljYXRpb24pO1xuICAgICAgLy8gRG8gbm90IGZpcmUgcHVibGljYXRpb24ncyBlbmRlZCBldmVudCB3aGVuIGFzc29jaWF0ZWQgc3RyZWFtIGlzIGVuZGVkLlxuICAgICAgLy8gSXQgbWF5IHN0aWxsIHNlbmRpbmcgc2lsZW5jZSBvciBibGFjayBmcmFtZXMuXG4gICAgICAvLyBSZWZlciB0byBodHRwczovL3czYy5naXRodWIuaW8vd2VicnRjLXBjLyNydGNydHBzZW5kZXItaW50ZXJmYWNlLlxuICAgIH1cbiAgICB0aGlzLl9wdWJsaXNoUHJvbWlzZSA9IG51bGw7XG4gICAgdGhpcy5fc3Vic2NyaWJlUHJvbWlzZSA9IG51bGw7XG4gIH1cblxuICBfc2RwSGFuZGxlcihzZHApIHtcbiAgICBpZiAoc2RwLnR5cGUgPT09ICdhbnN3ZXInKSB7XG4gICAgICBpZiAoKHRoaXMuX3B1YmxpY2F0aW9uIHx8IHRoaXMuX3B1Ymxpc2hQcm9taXNlKSAmJiB0aGlzLl9vcHRpb25zKSB7XG4gICAgICAgIHNkcC5zZHAgPSB0aGlzLl9zZXRSdHBTZW5kZXJPcHRpb25zKHNkcC5zZHAsIHRoaXMuX29wdGlvbnMpO1xuICAgICAgfVxuICAgICAgdGhpcy5fcGMuc2V0UmVtb3RlRGVzY3JpcHRpb24oc2RwKS50aGVuKCgpID0+IHtcbiAgICAgICAgaWYgKHRoaXMuX3BlbmRpbmdDYW5kaWRhdGVzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICBmb3IgKGNvbnN0IGNhbmRpZGF0ZSBvZiB0aGlzLl9wZW5kaW5nQ2FuZGlkYXRlcykge1xuICAgICAgICAgICAgdGhpcy5fc2VuZENhbmRpZGF0ZShjYW5kaWRhdGUpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSwgKGVycm9yKSA9PiB7XG4gICAgICAgIExvZ2dlci5lcnJvcignU2V0IHJlbW90ZSBkZXNjcmlwdGlvbiBmYWlsZWQ6ICcgKyBlcnJvcik7XG4gICAgICAgIHRoaXMuX3JlamVjdFByb21pc2UoZXJyb3IpO1xuICAgICAgICB0aGlzLl9maXJlRW5kZWRFdmVudE9uUHVibGljYXRpb25PclN1YnNjcmlwdGlvbigpO1xuICAgICAgfSk7XG4gICAgfVxuICB9XG5cbiAgX2Vycm9ySGFuZGxlcihlcnJvck1lc3NhZ2UpIHtcbiAgICBjb25zdCBwID0gdGhpcy5fcHVibGlzaFByb21pc2UgfHwgdGhpcy5fc3Vic2NyaWJlUHJvbWlzZTtcbiAgICBpZiAocCkge1xuICAgICAgcC5yZWplY3QobmV3IENvbmZlcmVuY2VFcnJvcihlcnJvck1lc3NhZ2UpKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgY29uc3QgZGlzcGF0Y2hlciA9IHRoaXMuX3B1YmxpY2F0aW9uIHx8IHRoaXMuX3N1YnNjcmlwdGlvbjtcbiAgICBpZiAoIWRpc3BhdGNoZXIpIHtcbiAgICAgIExvZ2dlci53YXJuaW5nKCdOZWl0aGVyIHB1YmxpY2F0aW9uIG5vciBzdWJzY3JpcHRpb24gaXMgYXZhaWxhYmxlLicpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBjb25zdCBlcnJvciA9IG5ldyBDb25mZXJlbmNlRXJyb3IoZXJyb3JNZXNzYWdlKTtcbiAgICBjb25zdCBlcnJvckV2ZW50ID0gbmV3IEVycm9yRXZlbnQoJ2Vycm9yJywge1xuICAgICAgZXJyb3I6IGVycm9yXG4gICAgfSk7XG4gICAgZGlzcGF0Y2hlci5kaXNwYXRjaEV2ZW50KGVycm9yRXZlbnQpO1xuICB9XG5cbiAgX3NldENvZGVjT3JkZXIoc2RwLCBvcHRpb25zKSB7XG4gICAgaWYgKHRoaXMuX3B1YmxpY2F0aW9uIHx8IHRoaXMuX3B1Ymxpc2hQcm9taXNlKSB7XG4gICAgICBpZiAob3B0aW9ucy5hdWRpbykge1xuICAgICAgICBjb25zdCBhdWRpb0NvZGVjTmFtZXMgPSBBcnJheS5mcm9tKG9wdGlvbnMuYXVkaW8sXG4gICAgICAgICAgZW5jb2RpbmdQYXJhbWV0ZXJzID0+IGVuY29kaW5nUGFyYW1ldGVycy5jb2RlYy5uYW1lKTtcbiAgICAgICAgc2RwID0gU2RwVXRpbHMucmVvcmRlckNvZGVjcyhzZHAsICdhdWRpbycsIGF1ZGlvQ29kZWNOYW1lcyk7XG4gICAgICB9XG4gICAgICBpZiAob3B0aW9ucy52aWRlbykge1xuICAgICAgICBjb25zdCB2aWRlb0NvZGVjTmFtZXMgPSBBcnJheS5mcm9tKG9wdGlvbnMudmlkZW8sXG4gICAgICAgICAgZW5jb2RpbmdQYXJhbWV0ZXJzID0+IGVuY29kaW5nUGFyYW1ldGVycy5jb2RlYy5uYW1lKTtcbiAgICAgICAgc2RwID0gU2RwVXRpbHMucmVvcmRlckNvZGVjcyhzZHAsICd2aWRlbycsIHZpZGVvQ29kZWNOYW1lcyk7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGlmIChvcHRpb25zLmF1ZGlvICYmIG9wdGlvbnMuYXVkaW8uY29kZWNzKSB7XG4gICAgICAgIGNvbnN0IGF1ZGlvQ29kZWNOYW1lcyA9IEFycmF5LmZyb20ob3B0aW9ucy5hdWRpby5jb2RlY3MsIGNvZGVjID0+XG4gICAgICAgICAgY29kZWMubmFtZSk7XG4gICAgICAgIHNkcCA9IFNkcFV0aWxzLnJlb3JkZXJDb2RlY3Moc2RwLCAnYXVkaW8nLCBhdWRpb0NvZGVjTmFtZXMpO1xuICAgICAgfVxuICAgICAgaWYgKG9wdGlvbnMudmlkZW8gJiYgb3B0aW9ucy52aWRlby5jb2RlY3MpIHtcbiAgICAgICAgY29uc3QgdmlkZW9Db2RlY05hbWVzID0gQXJyYXkuZnJvbShvcHRpb25zLnZpZGVvLmNvZGVjcywgY29kZWMgPT5cbiAgICAgICAgICBjb2RlYy5uYW1lKTtcbiAgICAgICAgc2RwID0gU2RwVXRpbHMucmVvcmRlckNvZGVjcyhzZHAsICd2aWRlbycsIHZpZGVvQ29kZWNOYW1lcyk7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBzZHA7XG4gIH1cblxuICBfc2V0TWF4Qml0cmF0ZShzZHAsIG9wdGlvbnMpIHtcbiAgICBpZiAodHlwZW9mIG9wdGlvbnMuYXVkaW8gPT09ICdvYmplY3QnKSB7XG4gICAgICBzZHAgPSBTZHBVdGlscy5zZXRNYXhCaXRyYXRlKHNkcCwgb3B0aW9ucy5hdWRpbyk7XG4gICAgfVxuICAgIGlmICh0eXBlb2Ygb3B0aW9ucy52aWRlbyA9PT0gJ29iamVjdCcpIHtcbiAgICAgIHNkcCA9IFNkcFV0aWxzLnNldE1heEJpdHJhdGUoc2RwLCBvcHRpb25zLnZpZGVvKTtcbiAgICB9XG4gICAgcmV0dXJuIHNkcDtcbiAgfVxuXG4gIF9zZXRSdHBTZW5kZXJPcHRpb25zKHNkcCwgb3B0aW9ucykge1xuICAgIHNkcCA9IHRoaXMuX3NldE1heEJpdHJhdGUoc2RwLCBvcHRpb25zKTtcbiAgICByZXR1cm4gc2RwO1xuICB9XG5cbiAgX3NldFJ0cFJlY2VpdmVyT3B0aW9ucyhzZHAsIG9wdGlvbnMpIHtcbiAgICBzZHAgPSB0aGlzLl9zZXRDb2RlY09yZGVyKHNkcCwgb3B0aW9ucyk7XG4gICAgcmV0dXJuIHNkcDtcbiAgfVxuXG4gIC8vIEhhbmRsZSBzdHJlYW0gZXZlbnQgc2VudCBmcm9tIE1DVS4gU29tZSBzdHJlYW0gZXZlbnRzIHNob3VsZCBiZSBwdWJsaWNhdGlvbiBldmVudCBvciBzdWJzY3JpcHRpb24gZXZlbnQuIEl0IHdpbGwgYmUgaGFuZGxlZCBoZXJlLlxuICBfb25TdHJlYW1FdmVudChtZXNzYWdlKSB7XG4gICAgbGV0IGV2ZW50VGFyZ2V0O1xuICAgIGlmICh0aGlzLl9wdWJsaWNhdGlvbiAmJiBtZXNzYWdlLmlkID09PSB0aGlzLl9wdWJsaWNhdGlvbi5pZCkge1xuICAgICAgZXZlbnRUYXJnZXQgPSB0aGlzLl9wdWJsaWNhdGlvbjtcbiAgICB9IGVsc2UgaWYgKFxuICAgICAgdGhpcy5fc3Vic2NyaWJlZFN0cmVhbSAmJiBtZXNzYWdlLmlkID09PSB0aGlzLl9zdWJzY3JpYmVkU3RyZWFtLmlkKSB7XG4gICAgICBldmVudFRhcmdldCA9IHRoaXMuX3N1YnNjcmlwdGlvbjtcbiAgICB9XG4gICAgaWYgKCFldmVudFRhcmdldCkge1xuICAgICAgTG9nZ2VyLmRlYnVnKCdDYW5ub3QgZmluZCB2YWxpZCBldmVudCB0YXJnZXQuJyk7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGxldCB0cmFja0tpbmQ7XG4gICAgaWYgKG1lc3NhZ2UuZGF0YS5maWVsZCA9PT0gJ2F1ZGlvLnN0YXR1cycpIHtcbiAgICAgIHRyYWNrS2luZCA9IFRyYWNrS2luZC5BVURJTztcbiAgICB9IGVsc2UgaWYgKG1lc3NhZ2UuZGF0YS5maWVsZCA9PT0gJ3ZpZGVvLnN0YXR1cycpIHtcbiAgICAgIHRyYWNrS2luZCA9IFRyYWNrS2luZC5WSURFTztcbiAgICB9IGVsc2Uge1xuICAgICAgTG9nZ2VyLndhcm5pbmcoJ0ludmFsaWQgZGF0YSBmaWVsZCBmb3Igc3RyZWFtIHVwZGF0ZSBpbmZvLicpO1xuICAgIH1cbiAgICBpZiAobWVzc2FnZS5kYXRhLnZhbHVlID09PSAnYWN0aXZlJykge1xuICAgICAgZXZlbnRUYXJnZXQuZGlzcGF0Y2hFdmVudChuZXcgTXV0ZUV2ZW50KCd1bm11dGUnLCB7IGtpbmQ6IHRyYWNrS2luZCB9KSk7XG4gICAgfSBlbHNlIGlmIChtZXNzYWdlLmRhdGEudmFsdWUgPT09ICdpbmFjdGl2ZScpIHtcbiAgICAgIGV2ZW50VGFyZ2V0LmRpc3BhdGNoRXZlbnQobmV3IE11dGVFdmVudCgnbXV0ZScsIHsga2luZDogdHJhY2tLaW5kIH0pKTtcbiAgICB9IGVsc2Uge1xuICAgICAgTG9nZ2VyLndhcm5pbmcoJ0ludmFsaWQgZGF0YSB2YWx1ZSBmb3Igc3RyZWFtIHVwZGF0ZSBpbmZvLicpO1xuICAgIH1cbiAgfVxufVxuIiwiLy8gQ29weXJpZ2h0IMKpIDIwMTcgSW50ZWwgQ29ycG9yYXRpb24uIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4ndXNlIHN0cmljdCc7XG5cbmltcG9ydCAqIGFzIEV2ZW50TW9kdWxlIGZyb20gJy4uL2Jhc2UvZXZlbnQuanMnXG5pbXBvcnQgeyBTaW9TaWduYWxpbmcgYXMgU2lnbmFsaW5nIH0gZnJvbSAnLi9zaWduYWxpbmcuanMnXG5pbXBvcnQgTG9nZ2VyIGZyb20gJy4uL2Jhc2UvbG9nZ2VyLmpzJ1xuaW1wb3J0IHsgQmFzZTY0IH0gZnJvbSAnLi4vYmFzZS9iYXNlNjQuanMnXG5pbXBvcnQgeyBDb25mZXJlbmNlRXJyb3IgfSBmcm9tICcuL2Vycm9yLmpzJ1xuaW1wb3J0ICogYXMgVXRpbHMgZnJvbSAnLi4vYmFzZS91dGlscy5qcydcbmltcG9ydCAqIGFzIFN0cmVhbU1vZHVsZSBmcm9tICcuLi9iYXNlL3N0cmVhbS5qcydcbmltcG9ydCB7IFBhcnRpY2lwYW50IH0gZnJvbSAnLi9wYXJ0aWNpcGFudC5qcydcbmltcG9ydCB7IENvbmZlcmVuY2VJbmZvIH0gZnJvbSAnLi9pbmZvLmpzJ1xuaW1wb3J0IHsgQ29uZmVyZW5jZVBlZXJDb25uZWN0aW9uQ2hhbm5lbCB9IGZyb20gJy4vY2hhbm5lbC5qcydcbmltcG9ydCB7IFJlbW90ZU1peGVkU3RyZWFtLCBBY3RpdmVBdWRpb0lucHV0Q2hhbmdlRXZlbnQsIExheW91dENoYW5nZUV2ZW50IH0gZnJvbSAnLi9taXhlZHN0cmVhbS5qcydcbmltcG9ydCAqIGFzIFN0cmVhbVV0aWxzTW9kdWxlIGZyb20gJy4vc3RyZWFtdXRpbHMuanMnXG5cbmNvbnN0IFNpZ25hbGluZ1N0YXRlID0ge1xuICBSRUFEWTogMSxcbiAgQ09OTkVDVElORzogMixcbiAgQ09OTkVDVEVEOiAzXG59O1xuXG5jb25zdCBwcm90b2NvbFZlcnNpb24gPSAnMS4wJztcblxuY29uc3QgUGFydGljaXBhbnRFdmVudCA9IGZ1bmN0aW9uKHR5cGUsIGluaXQpIHtcbiAgY29uc3QgdGhhdCA9IG5ldyBFdmVudE1vZHVsZS5JY3NFdmVudCh0eXBlLCBpbml0KTtcbiAgdGhhdC5wYXJ0aWNpcGFudCA9IGluaXQucGFydGljaXBhbnQ7XG4gIHJldHVybiB0aGF0O1xufTtcblxuLyoqXG4gKiBAY2xhc3MgQ29uZmVyZW5jZUNsaWVudENvbmZpZ3VyYXRpb25cbiAqIEBjbGFzc0Rlc2MgQ29uZmlndXJhdGlvbiBmb3IgQ29uZmVyZW5jZUNsaWVudC5cbiAqIEBtZW1iZXJPZiBJY3MuQ29uZmVyZW5jZVxuICogQGhpZGVjb25zdHJ1Y3RvclxuICovXG5jbGFzcyBDb25mZXJlbmNlQ2xpZW50Q29uZmlndXJhdGlvbiB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIC8qKlxuICAgICAqIEBtZW1iZXIgez9SVENDb25maWd1cmF0aW9ufSBydGNDb25maWd1cmF0aW9uXG4gICAgICogQGluc3RhbmNlXG4gICAgICogQG1lbWJlcm9mIEljcy5Db25mZXJlbmNlLkNvbmZlcmVuY2VDbGllbnRDb25maWd1cmF0aW9uXG4gICAgICogQGRlc2MgSXQgd2lsbCBiZSB1c2VkIGZvciBjcmVhdGluZyBQZWVyQ29ubmVjdGlvbi5cbiAgICAgKiBAc2VlIHtAbGluayBodHRwczovL3d3dy53My5vcmcvVFIvd2VicnRjLyNydGNjb25maWd1cmF0aW9uLWRpY3Rpb25hcnl8UlRDQ29uZmlndXJhdGlvbiBEaWN0aW9uYXJ5IG9mIFdlYlJUQyAxLjB9LlxuICAgICAqIEBleGFtcGxlXG4gICAgICogLy8gRm9sbG93aW5nIG9iamVjdCBjYW4gYmUgc2V0IHRvIGNvbmZlcmVuY2VDbGllbnRDb25maWd1cmF0aW9uLnJ0Y0NvbmZpZ3VyYXRpb24uXG4gICAgICoge1xuICAgICAqICAgaWNlU2VydmVyczogW3tcbiAgICAgKiAgICAgIHVybHM6IFwic3R1bjpleGFtcGxlLmNvbTozNDc4XCJcbiAgICAgKiAgIH0sIHtcbiAgICAgKiAgICAgdXJsczogW1xuICAgICAqICAgICAgIFwidHVybjpleGFtcGxlLmNvbTozNDc4P3RyYW5zcG9ydD11ZHBcIixcbiAgICAgKiAgICAgICBcInR1cm46ZXhhbXBsZS5jb206MzQ3OD90cmFuc3BvcnQ9dGNwXCJcbiAgICAgKiAgICAgXSxcbiAgICAgKiAgICAgIGNyZWRlbnRpYWw6IFwicGFzc3dvcmRcIixcbiAgICAgKiAgICAgIHVzZXJuYW1lOiBcInVzZXJuYW1lXCJcbiAgICAgKiAgIH1cbiAgICAgKiB9XG4gICAgICovXG4gICAgdGhpcy5ydGNDb25maWd1cmF0aW9uID0gdW5kZWZpbmVkO1xuICB9XG59XG5cbi8qKlxuICogQGNsYXNzIENvbmZlcmVuY2VDbGllbnRcbiAqIEBjbGFzc2Rlc2MgVGhlIENvbmZlcmVuY2VDbGllbnQgaGFuZGxlcyBQZWVyQ29ubmVjdGlvbnMgYmV0d2VlbiBjbGllbnQgYW5kIHNlcnZlci4gRm9yIGNvbmZlcmVuY2UgY29udHJvbGxpbmcsIHBsZWFzZSByZWZlciB0byBSRVNUIEFQSSBndWlkZS5cbiAqIEV2ZW50czpcbiAqXG4gKiB8IEV2ZW50IE5hbWUgICAgICAgICAgICB8IEFyZ3VtZW50IFR5cGUgICAgfCBGaXJlZCB3aGVuICAgICAgIHxcbiAqIHwgLS0tLS0tLS0tLS0tLS0tLS0tLS0tIHwgLS0tLS0tLS0tLS0tLS0tLSB8IC0tLS0tLS0tLS0tLS0tLS0gfFxuICogfCBzdHJlYW1hZGRlZCAgICAgICAgICAgfCBTdHJlYW1FdmVudCAgICAgIHwgQSBuZXcgc3RyZWFtIGlzIGF2YWlsYWJsZSBpbiB0aGUgY29uZmVyZW5jZS4gfFxuICogfCBwYXJ0aWNpcGFudGpvaW5lZCAgICAgfCBQYXJ0aWNpcGFudEV2ZW50IHwgQSBuZXcgcGFydGljaXBhbnQgam9pbmVkIHRoZSBjb25mZXJlbmNlLiB8XG4gKiB8IG1lc3NhZ2VyZWNlaXZlZCAgICAgICB8IE1lc3NhZ2VFdmVudCAgICAgfCBBIG5ldyBtZXNzYWdlIGlzIHJlY2VpdmVkLiB8XG4gKiB8IHNlcnZlcmRpc2Nvbm5lY3RlZCAgICB8IEljc0V2ZW50ICAgICAgICAgfCBEaXNjb25uZWN0ZWQgZnJvbSBjb25mZXJlbmNlIHNlcnZlci4gfFxuICpcbiAqIEBtZW1iZXJvZiBJY3MuQ29uZmVyZW5jZVxuICogQGV4dGVuZHMgSWNzLkJhc2UuRXZlbnREaXNwYXRjaGVyXG4gKiBAY29uc3RydWN0b3JcbiAqIEBwYXJhbSB7P0ljcy5Db25mZXJlbmNlLkNvbmZlcmVuY2VDbGllbnRDb25maWd1cmF0aW9uIH0gY29uZmlnIENvbmZpZ3VyYXRpb24gZm9yIENvbmZlcmVuY2VDbGllbnQuXG4gKiBAcGFyYW0gez9JY3MuQ29uZmVyZW5jZS5TaW9TaWduYWxpbmcgfSBzaWduYWxpbmdJbXBsIFNpZ25hbGluZyBjaGFubmVsIGltcGxlbWVudGF0aW9uIGZvciBDb25mZXJlbmNlQ2xpZW50LiBTREsgdXNlcyBkZWZhdWx0IHNpZ25hbGluZyBjaGFubmVsIGltcGxlbWVudGF0aW9uIGlmIHRoaXMgcGFyYW1ldGVyIGlzIHVuZGVmaW5lZC4gQ3VycmVudGx5LCBhIFNvY2tldC5JTyBzaWduYWxpbmcgY2hhbm5lbCBpbXBsZW1lbnRhdGlvbiB3YXMgcHJvdmlkZWQgYXMgaWNzLmNvbmZlcmVuY2UuU2lvU2lnbmFsaW5nLiBIb3dldmVyLCBpdCBpcyBub3QgcmVjb21tZW5kZWQgdG8gZGlyZWN0bHkgYWNjZXNzIHNpZ25hbGluZyBjaGFubmVsIG9yIGN1c3RvbWl6ZSBzaWduYWxpbmcgY2hhbm5lbCBmb3IgQ29uZmVyZW5jZUNsaWVudCBhcyB0aGlzIHRpbWUuXG4gKi9cbmV4cG9ydCBjb25zdCBDb25mZXJlbmNlQ2xpZW50ID0gZnVuY3Rpb24oY29uZmlnLCBzaWduYWxpbmdJbXBsKSB7XG4gIGNvbmZpZyA9IGNvbmZpZyB8fCB7fTtcbiAgY29uc3Qgc2VsZiA9IHRoaXM7XG4gIGxldCBzaWduYWxpbmdTdGF0ZSA9IFNpZ25hbGluZ1N0YXRlLlJFQURZO1xuICBjb25zdCBzaWduYWxpbmcgPSBzaWduYWxpbmdJbXBsID8gc2lnbmFsaW5nSW1wbCA6IChuZXcgU2lnbmFsaW5nKCkpO1xuICBsZXQgbWU7XG4gIGxldCByb29tO1xuICBsZXQgcmVtb3RlU3RyZWFtcyA9IG5ldyBNYXAoKTsgLy8gS2V5IGlzIHN0cmVhbSBJRCwgdmFsdWUgaXMgYSBSZW1vdGVTdHJlYW0uXG4gIGNvbnN0IHBhcnRpY2lwYW50cyA9IG5ldyBNYXAoKTsgLy8gS2V5IGlzIHBhcnRpY2lwYW50IElELCB2YWx1ZSBpcyBhIFBhcnRpY2lwYW50IG9iamVjdC5cbiAgY29uc3QgcHVibGlzaENoYW5uZWxzID0gbmV3IE1hcCgpOyAvLyBLZXkgaXMgTWVkaWFTdHJlYW0ncyBJRCwgdmFsdWUgaXMgcGMgY2hhbm5lbC5cbiAgY29uc3QgY2hhbm5lbHMgPSBuZXcgTWFwKCk7IC8vIEtleSBpcyBjaGFubmVsJ3MgaW50ZXJuYWwgSUQsIHZhbHVlIGlzIGNoYW5uZWwuXG5cbiAgZnVuY3Rpb24gb25TaWduYWxpbmdNZXNzYWdlIChub3RpZmljYXRpb24sIGRhdGEpIHtcbiAgICBpZiAobm90aWZpY2F0aW9uID09PSAnc29hYycgfHwgbm90aWZpY2F0aW9uID09PSAncHJvZ3Jlc3MnKSB7XG4gICAgICBpZiAoIWNoYW5uZWxzLmhhcyhkYXRhLmlkKSkge1xuICAgICAgICBMb2dnZXIud2FybmluZygnQ2Fubm90IGZpbmQgYSBjaGFubmVsIGZvciBpbmNvbWluZyBkYXRhLicpO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBjaGFubmVscy5nZXQoZGF0YS5pZCkub25NZXNzYWdlKG5vdGlmaWNhdGlvbiwgZGF0YSk7XG4gICAgfSBlbHNlIGlmIChub3RpZmljYXRpb24gPT09ICdzdHJlYW0nKSB7XG4gICAgICBpZiAoZGF0YS5zdGF0dXMgPT09ICdhZGQnKSB7XG4gICAgICAgIGZpcmVTdHJlYW1BZGRlZChkYXRhLmRhdGEpO1xuICAgICAgfSBlbHNlIGlmIChkYXRhLnN0YXR1cyA9PT0gJ3JlbW92ZScpIHtcbiAgICAgICAgZmlyZVN0cmVhbVJlbW92ZWQoZGF0YSk7XG4gICAgICB9IGVsc2UgaWYoZGF0YS5zdGF0dXMgPT09ICd1cGRhdGUnKSB7XG4gICAgICAgIC8vIEJvYXJkY2FzdCBhdWRpby92aWRlbyB1cGRhdGUgc3RhdHVzIHRvIGNoYW5uZWwgc28gc3BlY2lmaWMgZXZlbnRzIGNhbiBiZSBmaXJlZCBvbiBwdWJsaWNhdGlvbiBvciBzdWJzY3JpcHRpb24uXG4gICAgICAgIGlmIChkYXRhLmRhdGEuZmllbGQgPT09ICdhdWRpby5zdGF0dXMnIHx8IGRhdGEuZGF0YS5maWVsZCA9PT1cbiAgICAgICAgICAndmlkZW8uc3RhdHVzJykge1xuICAgICAgICAgIGNoYW5uZWxzLmZvckVhY2goYyA9PiB7XG4gICAgICAgICAgICBjLm9uTWVzc2FnZShub3RpZmljYXRpb24sIGRhdGEpO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9IGVsc2UgaWYgKGRhdGEuZGF0YS5maWVsZCA9PT0gJ2FjdGl2ZUlucHV0Jykge1xuICAgICAgICAgIGZpcmVBY3RpdmVBdWRpb0lucHV0Q2hhbmdlKGRhdGEpO1xuICAgICAgICB9IGVsc2UgaWYgKGRhdGEuZGF0YS5maWVsZCA9PT0gJ3ZpZGVvLmxheW91dCcpIHtcbiAgICAgICAgICBmaXJlTGF5b3V0Q2hhbmdlKGRhdGEpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIExvZ2dlci53YXJuaW5nKCdVbmtub3duIHN0cmVhbSBldmVudCBmcm9tIE1DVS4nKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0gZWxzZSBpZiAobm90aWZpY2F0aW9uID09PSAndGV4dCcpIHtcbiAgICAgIGZpcmVNZXNzYWdlUmVjZWl2ZWQoZGF0YSk7XG4gICAgfSBlbHNlIGlmKG5vdGlmaWNhdGlvbiA9PT0gJ3BhcnRpY2lwYW50Jyl7XG4gICAgICBmaXJlUGFydGljaXBhbnRFdmVudChkYXRhKTtcbiAgICB9XG4gIH07XG5cbiAgc2lnbmFsaW5nLmFkZEV2ZW50TGlzdGVuZXIoJ2RhdGEnLCAoZXZlbnQpID0+IHtcbiAgICBvblNpZ25hbGluZ01lc3NhZ2UoZXZlbnQubWVzc2FnZS5ub3RpZmljYXRpb24sIGV2ZW50Lm1lc3NhZ2UuZGF0YSk7XG4gIH0pO1xuXG4gIHNpZ25hbGluZy5hZGRFdmVudExpc3RlbmVyKCdkaXNjb25uZWN0JywgKCkgPT4ge1xuICAgIHNpZ25hbGluZ1N0YXRlID0gU2lnbmFsaW5nU3RhdGUuUkVBRFk7XG4gICAgc2VsZi5kaXNwYXRjaEV2ZW50KG5ldyBFdmVudE1vZHVsZS5JY3NFdmVudCgnc2VydmVyZGlzY29ubmVjdGVkJykpO1xuICB9KTtcblxuICBmdW5jdGlvbiBmaXJlUGFydGljaXBhbnRFdmVudChkYXRhKSB7XG4gICAgaWYgKGRhdGEuYWN0aW9uID09PSAnam9pbicpIHtcbiAgICAgIGRhdGEgPSBkYXRhLmRhdGE7XG4gICAgICBjb25zdCBwYXJ0aWNpcGFudCA9IG5ldyBQYXJ0aWNpcGFudChkYXRhLmlkLCBkYXRhLnJvbGUsIGRhdGEudXNlcilcbiAgICAgIHBhcnRpY2lwYW50cy5zZXQoZGF0YS5pZCwgcGFydGljaXBhbnQpO1xuICAgICAgY29uc3QgZXZlbnQgPSBuZXcgUGFydGljaXBhbnRFdmVudCgncGFydGljaXBhbnRqb2luZWQnLCB7IHBhcnRpY2lwYW50OiBwYXJ0aWNpcGFudCB9KTtcbiAgICAgIHNlbGYuZGlzcGF0Y2hFdmVudChldmVudCk7XG4gICAgfSBlbHNlIGlmIChkYXRhLmFjdGlvbiA9PT0gJ2xlYXZlJykge1xuICAgICAgY29uc3QgcGFydGljaXBhbnRJZCA9IGRhdGEuZGF0YTtcbiAgICAgIGlmICghcGFydGljaXBhbnRzLmhhcyhwYXJ0aWNpcGFudElkKSkge1xuICAgICAgICBMb2dnZXIud2FybmluZyhcbiAgICAgICAgICAnUmVjZWl2ZWQgbGVhdmUgbWVzc2FnZSBmcm9tIE1DVSBmb3IgYW4gdW5rbm93biBwYXJ0aWNpcGFudC4nKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgY29uc3QgcGFydGljaXBhbnQgPSBwYXJ0aWNpcGFudHMuZ2V0KHBhcnRpY2lwYW50SWQpO1xuICAgICAgcGFydGljaXBhbnRzLmRlbGV0ZShwYXJ0aWNpcGFudElkKTtcbiAgICAgIHBhcnRpY2lwYW50LmRpc3BhdGNoRXZlbnQobmV3IEV2ZW50TW9kdWxlLkljc0V2ZW50KCdsZWZ0JykpO1xuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIGZpcmVNZXNzYWdlUmVjZWl2ZWQoZGF0YSkge1xuICAgIGNvbnN0IG1lc3NhZ2VFdmVudCA9IG5ldyBFdmVudE1vZHVsZS5NZXNzYWdlRXZlbnQoJ21lc3NhZ2VyZWNlaXZlZCcsIHtcbiAgICAgIG1lc3NhZ2U6IGRhdGEubWVzc2FnZSxcbiAgICAgIG9yaWdpbjogZGF0YS5mcm9tXG4gICAgfSk7XG4gICAgc2VsZi5kaXNwYXRjaEV2ZW50KG1lc3NhZ2VFdmVudCk7XG4gIH1cblxuICBmdW5jdGlvbiBmaXJlU3RyZWFtQWRkZWQoaW5mbykge1xuICAgIGNvbnN0IHN0cmVhbSA9IGNyZWF0ZVJlbW90ZVN0cmVhbShpbmZvKTtcbiAgICByZW1vdGVTdHJlYW1zLnNldChzdHJlYW0uaWQsIHN0cmVhbSk7XG4gICAgY29uc3Qgc3RyZWFtRXZlbnQgPSBuZXcgU3RyZWFtTW9kdWxlLlN0cmVhbUV2ZW50KCdzdHJlYW1hZGRlZCcsIHtcbiAgICAgIHN0cmVhbTogc3RyZWFtXG4gICAgfSk7XG4gICAgc2VsZi5kaXNwYXRjaEV2ZW50KHN0cmVhbUV2ZW50KTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGZpcmVTdHJlYW1SZW1vdmVkKGluZm8pIHtcbiAgICBpZiAoIXJlbW90ZVN0cmVhbXMuaGFzKGluZm8uaWQpKSB7XG4gICAgICBMb2dnZXIud2FybmluZygnQ2Fubm90IGZpbmQgc3BlY2lmaWMgcmVtb3RlIHN0cmVhbS4nKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgY29uc3Qgc3RyZWFtID0gcmVtb3RlU3RyZWFtcy5nZXQoaW5mby5pZCk7XG4gICAgY29uc3Qgc3RyZWFtRXZlbnQgPSBuZXcgRXZlbnRNb2R1bGUuSWNzRXZlbnQoJ2VuZGVkJyk7XG4gICAgcmVtb3RlU3RyZWFtcy5kZWxldGUoc3RyZWFtLmlkKTtcbiAgICBzdHJlYW0uZGlzcGF0Y2hFdmVudChzdHJlYW1FdmVudCk7XG4gIH1cblxuICBmdW5jdGlvbiBmaXJlQWN0aXZlQXVkaW9JbnB1dENoYW5nZShpbmZvKSB7XG4gICAgaWYgKCFyZW1vdGVTdHJlYW1zLmhhcyhpbmZvLmlkKSkge1xuICAgICAgTG9nZ2VyLndhcm5pbmcoJ0Nhbm5vdCBmaW5kIHNwZWNpZmljIHJlbW90ZSBzdHJlYW0uJyk7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGNvbnN0IHN0cmVhbSA9IHJlbW90ZVN0cmVhbXMuZ2V0KGluZm8uaWQpO1xuICAgIGNvbnN0IHN0cmVhbUV2ZW50ID0gbmV3IEFjdGl2ZUF1ZGlvSW5wdXRDaGFuZ2VFdmVudChcbiAgICAgICdhY3RpdmVhdWRpb2lucHV0Y2hhbmdlJywge1xuICAgICAgICBhY3RpdmVBdWRpb0lucHV0U3RyZWFtSWQ6IGluZm8uZGF0YS52YWx1ZVxuICAgICAgfSk7XG4gICAgc3RyZWFtLmRpc3BhdGNoRXZlbnQoc3RyZWFtRXZlbnQpO1xuICB9XG5cbiAgZnVuY3Rpb24gZmlyZUxheW91dENoYW5nZShpbmZvKSB7XG4gICAgaWYgKCFyZW1vdGVTdHJlYW1zLmhhcyhpbmZvLmlkKSkge1xuICAgICAgTG9nZ2VyLndhcm5pbmcoJ0Nhbm5vdCBmaW5kIHNwZWNpZmljIHJlbW90ZSBzdHJlYW0uJyk7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGNvbnN0IHN0cmVhbSA9IHJlbW90ZVN0cmVhbXMuZ2V0KGluZm8uaWQpO1xuICAgIGNvbnN0IHN0cmVhbUV2ZW50ID0gbmV3IExheW91dENoYW5nZUV2ZW50KFxuICAgICAgJ2xheW91dGNoYW5nZScsIHtcbiAgICAgICAgbGF5b3V0OiBpbmZvLmRhdGEudmFsdWVcbiAgICAgIH0pO1xuICAgIHN0cmVhbS5kaXNwYXRjaEV2ZW50KHN0cmVhbUV2ZW50KTtcbiAgfVxuXG5cbiAgZnVuY3Rpb24gY3JlYXRlUmVtb3RlU3RyZWFtKHN0cmVhbUluZm8pIHtcbiAgICBpZiAoc3RyZWFtSW5mby50eXBlID09PSAnbWl4ZWQnKSB7XG4gICAgICByZXR1cm4gbmV3IFJlbW90ZU1peGVkU3RyZWFtKHN0cmVhbUluZm8pO1xuICAgIH0gZWxzZSB7XG4gICAgICBsZXQgYXVkaW9Tb3VyY2VJbmZvLCB2aWRlb1NvdXJjZUluZm87XG4gICAgICBpZiAoc3RyZWFtSW5mby5tZWRpYS5hdWRpbykge1xuICAgICAgICBhdWRpb1NvdXJjZUluZm8gPSBzdHJlYW1JbmZvLm1lZGlhLmF1ZGlvLnNvdXJjZTtcbiAgICAgIH1cbiAgICAgIGlmIChzdHJlYW1JbmZvLm1lZGlhLnZpZGVvKSB7XG4gICAgICAgIHZpZGVvU291cmNlSW5mbyA9IHN0cmVhbUluZm8ubWVkaWEudmlkZW8uc291cmNlO1xuICAgICAgfVxuICAgICAgY29uc3Qgc3RyZWFtID0gbmV3IFN0cmVhbU1vZHVsZS5SZW1vdGVTdHJlYW0oc3RyZWFtSW5mby5pZCwgc3RyZWFtSW5mby5pbmZvXG4gICAgICAgIC5vd25lciwgdW5kZWZpbmVkLCBuZXcgU3RyZWFtTW9kdWxlLlN0cmVhbVNvdXJjZUluZm8oYXVkaW9Tb3VyY2VJbmZvLFxuICAgICAgICAgIHZpZGVvU291cmNlSW5mbyksIHN0cmVhbUluZm8uaW5mby5hdHRyaWJ1dGVzKTtcbiAgICAgIHN0cmVhbS5zZXR0aW5ncyA9IFN0cmVhbVV0aWxzTW9kdWxlLmNvbnZlcnRUb1B1YmxpY2F0aW9uU2V0dGluZ3MoXG4gICAgICAgIHN0cmVhbUluZm8ubWVkaWEpO1xuICAgICAgc3RyZWFtLmNhcGFiaWxpdGllcyA9IG5ldyBTdHJlYW1VdGlsc01vZHVsZS5jb252ZXJ0VG9TdWJzY3JpcHRpb25DYXBhYmlsaXRpZXMoXG4gICAgICAgIHN0cmVhbUluZm8ubWVkaWEpO1xuICAgICAgcmV0dXJuIHN0cmVhbTtcbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiBzZW5kU2lnbmFsaW5nTWVzc2FnZSh0eXBlLCBtZXNzYWdlKSB7XG4gICAgcmV0dXJuIHNpZ25hbGluZy5zZW5kKHR5cGUsIG1lc3NhZ2UpO1xuICB9O1xuXG4gIGZ1bmN0aW9uIGNyZWF0ZVBlZXJDb25uZWN0aW9uQ2hhbm5lbCgpIHtcbiAgICAvLyBDb25zdHJ1Y3QgYW4gc2lnbmFsaW5nIHNlbmRlci9yZWNlaXZlciBmb3IgQ29uZmVyZW5jZVBlZXJDb25uZWN0aW9uLlxuICAgIGNvbnN0IHNpZ25hbGluZ0ZvckNoYW5uZWwgPSBPYmplY3QuY3JlYXRlKEV2ZW50TW9kdWxlLkV2ZW50RGlzcGF0Y2hlcik7XG4gICAgc2lnbmFsaW5nRm9yQ2hhbm5lbC5zZW5kU2lnbmFsaW5nTWVzc2FnZSA9IHNlbmRTaWduYWxpbmdNZXNzYWdlO1xuICAgIGNvbnN0IHBjYyA9IG5ldyBDb25mZXJlbmNlUGVlckNvbm5lY3Rpb25DaGFubmVsKGNvbmZpZywgc2lnbmFsaW5nRm9yQ2hhbm5lbCk7XG4gICAgcGNjLmFkZEV2ZW50TGlzdGVuZXIoJ2lkJywgKG1lc3NhZ2VFdmVudCkgPT4ge1xuICAgICAgY2hhbm5lbHMuc2V0KG1lc3NhZ2VFdmVudC5tZXNzYWdlLCBwY2MpO1xuICAgIH0pO1xuICAgIHJldHVybiBwY2M7XG4gIH1cblxuICBmdW5jdGlvbiBjbGVhbigpIHtcbiAgICBwYXJ0aWNpcGFudHMuY2xlYXIoKTtcbiAgICByZW1vdGVTdHJlYW1zLmNsZWFyKCk7XG4gIH1cblxuICBPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcywgJ2luZm8nLCB7XG4gICAgY29uZmlndXJhYmxlOiBmYWxzZSxcbiAgICBnZXQ6ICgpID0+IHtcbiAgICAgIGlmICghcm9vbSkge1xuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgIH1cbiAgICAgIHJldHVybiBuZXcgQ29uZmVyZW5jZUluZm8ocm9vbS5pZCwgQXJyYXkuZnJvbShwYXJ0aWNpcGFudHMsIHggPT4geFtcbiAgICAgICAgMV0pLCBBcnJheS5mcm9tKHJlbW90ZVN0cmVhbXMsIHggPT4geFsxXSksIG1lKTtcbiAgICB9XG4gIH0pO1xuXG4gIC8qKlxuICAgKiBAZnVuY3Rpb24gam9pblxuICAgKiBAaW5zdGFuY2VcbiAgICogQGRlc2MgSm9pbiBhIGNvbmZlcmVuY2UuXG4gICAqIEBtZW1iZXJvZiBJY3MuQ29uZmVyZW5jZS5Db25mZXJlbmNlQ2xpZW50XG4gICAqIEByZXR1cm5zIHtQcm9taXNlPENvbmZlcmVuY2VJbmZvLCBFcnJvcj59IFJldHVybiBhIHByb21pc2UgcmVzb2x2ZWQgd2l0aCBjdXJyZW50IGNvbmZlcmVuY2UncyBpbmZvcm1hdGlvbiBpZiBzdWNjZXNzZnVsbHkgam9pbiB0aGUgY29uZmVyZW5jZS4gT3IgcmV0dXJuIGEgcHJvbWlzZSByZWplY3RlZCB3aXRoIGEgbmV3bHkgY3JlYXRlZCBJY3MuRXJyb3IgaWYgZmFpbGVkIHRvIGpvaW4gdGhlIGNvbmZlcmVuY2UuXG4gICAqIEBwYXJhbSB7c3RyaW5nfSB0b2tlbiBUb2tlbiBpcyBpc3N1ZWQgYnkgY29uZmVyZW5jZSBzZXJ2ZXIobnV2ZSkuXG4gICAqL1xuICB0aGlzLmpvaW4gPSBmdW5jdGlvbih0b2tlblN0cmluZykge1xuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICBjb25zdCB0b2tlbiA9IEpTT04ucGFyc2UoQmFzZTY0LmRlY29kZUJhc2U2NCh0b2tlblN0cmluZykpO1xuICAgICAgY29uc3QgaXNTZWN1cmVkID0gKHRva2VuLnNlY3VyZSA9PT0gdHJ1ZSk7XG4gICAgICBsZXQgaG9zdCA9IHRva2VuLmhvc3Q7XG4gICAgICBpZiAodHlwZW9mIGhvc3QgIT09ICdzdHJpbmcnKSB7XG4gICAgICAgIHJlamVjdChuZXcgQ29uZmVyZW5jZUVycm9yKCdJbnZhbGlkIGhvc3QuJykpO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBpZiAoaG9zdC5pbmRleE9mKCdodHRwJykgPT09IC0xKSB7XG4gICAgICAgIGhvc3QgPSBpc1NlY3VyZWQgPyAoJ2h0dHBzOi8vJyArIGhvc3QpIDogKCdodHRwOi8vJyArIGhvc3QpO1xuICAgICAgfVxuICAgICAgaWYgKHNpZ25hbGluZ1N0YXRlICE9PSBTaWduYWxpbmdTdGF0ZS5SRUFEWSkge1xuICAgICAgICByZWplY3QobmV3IENvbmZlcmVuY2VFcnJvcignY29ubmVjdGlvbiBzdGF0ZSBpbnZhbGlkJykpO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIHNpZ25hbGluZ1N0YXRlID0gU2lnbmFsaW5nU3RhdGUuQ09OTkVDVElORztcblxuICAgICAgY29uc3QgbG9naW5JbmZvID0ge1xuICAgICAgICB0b2tlbjogdG9rZW5TdHJpbmcsXG4gICAgICAgIHVzZXJBZ2VudDogVXRpbHMuc3lzSW5mbygpLFxuICAgICAgICBwcm90b2NvbDogcHJvdG9jb2xWZXJzaW9uXG4gICAgICB9O1xuXG4gICAgICBzaWduYWxpbmcuY29ubmVjdChob3N0LCBpc1NlY3VyZWQsIGxvZ2luSW5mbykudGhlbigocmVzcCkgPT4ge1xuICAgICAgICBzaWduYWxpbmdTdGF0ZSA9IFNpZ25hbGluZ1N0YXRlLkNPTk5FQ1RFRDtcbiAgICAgICAgcm9vbSA9IHJlc3Aucm9vbTtcbiAgICAgICAgaWYgKHJvb20uc3RyZWFtcyAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgZm9yIChjb25zdCBzdCBvZiByb29tLnN0cmVhbXMpIHtcbiAgICAgICAgICAgIGlmIChzdC50eXBlID09PSAnbWl4ZWQnKSB7XG4gICAgICAgICAgICAgIHN0LnZpZXdwb3J0ID0gc3QuaW5mby5sYWJlbDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJlbW90ZVN0cmVhbXMuc2V0KHN0LmlkLCBjcmVhdGVSZW1vdGVTdHJlYW0oc3QpKTtcbiAgICAgICAgICB9O1xuICAgICAgICB9XG4gICAgICAgIGlmIChyZXNwLnJvb20gJiYgcmVzcC5yb29tLnBhcnRpY2lwYW50cyAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgZm9yIChjb25zdCBwIG9mIHJlc3Aucm9vbS5wYXJ0aWNpcGFudHMpIHtcbiAgICAgICAgICAgIHBhcnRpY2lwYW50cy5zZXQocC5pZCwgbmV3IFBhcnRpY2lwYW50KHAuaWQsIHAucm9sZSwgcC51c2VyKSk7XG4gICAgICAgICAgICBpZiAocC5pZCA9PT0gcmVzcC5pZCkge1xuICAgICAgICAgICAgICBtZSA9IHBhcnRpY2lwYW50cy5nZXQocC5pZCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJlc29sdmUobmV3IENvbmZlcmVuY2VJbmZvKHJlc3Aucm9vbS5pZCwgQXJyYXkuZnJvbShwYXJ0aWNpcGFudHNcbiAgICAgICAgICAudmFsdWVzKCkpLCBBcnJheS5mcm9tKHJlbW90ZVN0cmVhbXMudmFsdWVzKCkpLCBtZSkpO1xuICAgICAgfSwgKGUpID0+IHtcbiAgICAgICAgc2lnbmFsaW5nU3RhdGUgPSBTaWduYWxpbmdTdGF0ZS5SRUFEWTtcbiAgICAgICAgcmVqZWN0KG5ldyBDb25mZXJlbmNlRXJyb3IoZSkpXG4gICAgICB9KTtcbiAgICB9KTtcbiAgfTtcblxuICAvKipcbiAgICogQGZ1bmN0aW9uIHB1Ymxpc2hcbiAgICogQG1lbWJlcm9mIEljcy5Db25mZXJlbmNlLkNvbmZlcmVuY2VDbGllbnRcbiAgICogQGluc3RhbmNlXG4gICAqIEBkZXNjIFB1Ymxpc2ggYSBMb2NhbFN0cmVhbSB0byBjb25mZXJlbmNlIHNlcnZlci4gT3RoZXIgcGFydGljaXBhbnRzIHdpbGwgYmUgYWJsZSB0byBzdWJzY3JpYmUgdGhpcyBzdHJlYW0gd2hlbiBpdCBpcyBzdWNjZXNzZnVsbHkgcHVibGlzaGVkLlxuICAgKiBAcGFyYW0ge0ljcy5CYXNlLkxvY2FsU3RyZWFtfSBzdHJlYW0gVGhlIHN0cmVhbSB0byBiZSBwdWJsaXNoZWQuXG4gICAqIEBwYXJhbSB7SWNzLkJhc2UuUHVibGlzaE9wdGlvbnN9IG9wdGlvbnMgT3B0aW9ucyBmb3IgcHVibGljYXRpb24uXG4gICAqIEByZXR1cm5zIHtQcm9taXNlPFB1YmxpY2F0aW9uLCBFcnJvcj59IFJldHVybmVkIHByb21pc2Ugd2lsbCBiZSByZXNvbHZlZCB3aXRoIGEgbmV3bHkgY3JlYXRlZCBQdWJsaWNhdGlvbiBvbmNlIHNwZWNpZmljIHN0cmVhbSBpcyBzdWNjZXNzZnVsbHkgcHVibGlzaGVkLCBvciByZWplY3RlZCB3aXRoIGEgbmV3bHkgY3JlYXRlZCBFcnJvciBpZiBzdHJlYW0gaXMgaW52YWxpZCBvciBvcHRpb25zIGNhbm5vdCBiZSBzYXRpc2ZpZWQuIFN1Y2Nlc3NmdWxseSBwdWJsaXNoZWQgbWVhbnMgUGVlckNvbm5lY3Rpb24gaXMgZXN0YWJsaXNoZWQgYW5kIHNlcnZlciBpcyBhYmxlIHRvIHByb2Nlc3MgbWVkaWEgZGF0YS5cbiAgICovXG4gIHRoaXMucHVibGlzaCA9IGZ1bmN0aW9uKHN0cmVhbSwgb3B0aW9ucykge1xuICAgIGlmICghKHN0cmVhbSBpbnN0YW5jZW9mIFN0cmVhbU1vZHVsZS5Mb2NhbFN0cmVhbSkpIHtcbiAgICAgIHJldHVybiBQcm9taXNlLnJlamVjdChuZXcgQ29uZmVyZW5jZUVycm9yKCdJbnZhbGlkIHN0cmVhbS4nKSk7XG4gICAgfVxuICAgIGlmIChwdWJsaXNoQ2hhbm5lbHMuaGFzKHN0cmVhbS5tZWRpYVN0cmVhbS5pZCkpIHtcbiAgICAgIHJldHVybiBQcm9taXNlLnJlamVjdChuZXcgQ29uZmVyZW5jZUVycm9yKFxuICAgICAgICAnQ2Fubm90IHB1Ymxpc2ggYSBwdWJsaXNoZWQgc3RyZWFtLicpKTtcbiAgICB9XG4gICAgY29uc3QgY2hhbm5lbCA9IGNyZWF0ZVBlZXJDb25uZWN0aW9uQ2hhbm5lbCgpO1xuICAgIHJldHVybiBjaGFubmVsLnB1Ymxpc2goc3RyZWFtLCBvcHRpb25zKTtcbiAgfTtcblxuICAvKipcbiAgICogQGZ1bmN0aW9uIHN1YnNjcmliZVxuICAgKiBAbWVtYmVyb2YgSWNzLkNvbmZlcmVuY2UuQ29uZmVyZW5jZUNsaWVudFxuICAgKiBAaW5zdGFuY2VcbiAgICogQGRlc2MgU3Vic2NyaWJlIGEgUmVtb3RlU3RyZWFtIGZyb20gY29uZmVyZW5jZSBzZXJ2ZXIuXG4gICAqIEBwYXJhbSB7SWNzLkJhc2UuUmVtb3RlU3RyZWFtfSBzdHJlYW0gVGhlIHN0cmVhbSB0byBiZSBzdWJzY3JpYmVkLlxuICAgKiBAcGFyYW0ge0ljcy5Db25mZXJlbmNlLlN1YnNjcmliZU9wdGlvbnN9IG9wdGlvbnMgT3B0aW9ucyBmb3Igc3Vic2NyaXB0aW9uLlxuICAgKiBAcmV0dXJucyB7UHJvbWlzZTxTdWJzY3JpcHRpb24sIEVycm9yPn0gUmV0dXJuZWQgcHJvbWlzZSB3aWxsIGJlIHJlc29sdmVkIHdpdGggYSBuZXdseSBjcmVhdGVkIFN1YnNjcmlwdGlvbiBvbmNlIHNwZWNpZmljIHN0cmVhbSBpcyBzdWNjZXNzZnVsbHkgc3Vic2NyaWJlZCwgb3IgcmVqZWN0ZWQgd2l0aCBhIG5ld2x5IGNyZWF0ZWQgRXJyb3IgaWYgc3RyZWFtIGlzIGludmFsaWQgb3Igb3B0aW9ucyBjYW5ub3QgYmUgc2F0aXNmaWVkLiBTdWNjZXNzZnVsbHkgc3Vic2NyaWJlZCBtZWFucyBQZWVyQ29ubmVjdGlvbiBpcyBlc3RhYmxpc2hlZCBhbmQgc2VydmVyIHdhcyBzdGFydGVkIHRvIHNlbmQgbWVkaWEgZGF0YS5cbiAgICovXG4gIHRoaXMuc3Vic2NyaWJlID0gZnVuY3Rpb24oc3RyZWFtLCBvcHRpb25zKSB7XG4gICAgaWYgKCEoc3RyZWFtIGluc3RhbmNlb2YgU3RyZWFtTW9kdWxlLlJlbW90ZVN0cmVhbSkpIHtcbiAgICAgIHJldHVybiBQcm9taXNlLnJlamVjdChuZXcgQ29uZmVyZW5jZUVycm9yKCdJbnZhbGlkIHN0cmVhbS4nKSk7XG4gICAgfVxuICAgIGNvbnN0IGNoYW5uZWwgPSBjcmVhdGVQZWVyQ29ubmVjdGlvbkNoYW5uZWwoKTtcbiAgICByZXR1cm4gY2hhbm5lbC5zdWJzY3JpYmUoc3RyZWFtLCBvcHRpb25zKTtcbiAgfTtcblxuICAvKipcbiAgICogQGZ1bmN0aW9uIHNlbmRcbiAgICogQG1lbWJlcm9mIEljcy5Db25mZXJlbmNlLkNvbmZlcmVuY2VDbGllbnRcbiAgICogQGluc3RhbmNlXG4gICAqIEBkZXNjIFNlbmQgYSB0ZXh0IG1lc3NhZ2UgdG8gYSBwYXJ0aWNpcGFudCBvciBhbGwgcGFydGljaXBhbnRzLlxuICAgKiBAcGFyYW0ge3N0cmluZ30gbWVzc2FnZSBNZXNzYWdlIHRvIGJlIHNlbnQuXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBwYXJ0aWNpcGFudElkIFJlY2VpdmVyIG9mIHRoaXMgbWVzc2FnZS4gTWVzc2FnZSB3aWxsIGJlIHNlbnQgdG8gYWxsIHBhcnRpY2lwYW50cyBpZiBwYXJ0aWNpcGFudElkIGlzIHVuZGVmaW5lZC5cbiAgICogQHJldHVybnMge1Byb21pc2U8dm9pZCwgRXJyb3I+fSBSZXR1cm5lZCBwcm9taXNlIHdpbGwgYmUgcmVzb2x2ZWQgd2hlbiBjb25mZXJlbmNlIHNlcnZlciByZWNlaXZlZCBjZXJ0YWluIG1lc3NhZ2UuXG4gICAqL1xuICB0aGlzLnNlbmQgPSBmdW5jdGlvbihtZXNzYWdlLCBwYXJ0aWNpcGFudElkKSB7XG4gICAgaWYgKHBhcnRpY2lwYW50SWQgPT09IHVuZGVmaW5lZCkge1xuICAgICAgcGFydGljaXBhbnRJZCA9ICdhbGwnO1xuICAgIH1cbiAgICByZXR1cm4gc2VuZFNpZ25hbGluZ01lc3NhZ2UoJ3RleHQnLCB7IHRvOiBwYXJ0aWNpcGFudElkLCBtZXNzYWdlOiBtZXNzYWdlIH0pO1xuICB9O1xuXG4gIC8qKlxuICAgKiBAZnVuY3Rpb24gbGVhdmVcbiAgICogQG1lbWJlck9mIEljcy5Db25mZXJlbmNlLkNvbmZlcmVuY2VDbGllbnRcbiAgICogQGluc3RhbmNlXG4gICAqIEBkZXNjIExlYXZlIGEgY29uZmVyZW5jZS5cbiAgICogQHJldHVybnMge1Byb21pc2U8dm9pZCwgRXJyb3I+fSBSZXR1cm5lZCBwcm9taXNlIHdpbGwgYmUgcmVzb2x2ZWQgd2l0aCB1bmRlZmluZWQgb25jZSB0aGUgY29ubmVjdGlvbiBpcyBkaXNjb25uZWN0ZWQuXG4gICAqL1xuICB0aGlzLmxlYXZlID0gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHNpZ25hbGluZy5kaXNjb25uZWN0KCkudGhlbigoKSA9PiB7XG4gICAgICBjbGVhbigpO1xuICAgICAgc2lnbmFsaW5nU3RhdGUgPSBTaWduYWxpbmdTdGF0ZS5SRUFEWTtcbiAgICB9KTtcbiAgfTtcbn07XG5cbkNvbmZlcmVuY2VDbGllbnQucHJvdG90eXBlID0gbmV3IEV2ZW50TW9kdWxlLkV2ZW50RGlzcGF0Y2hlcigpO1xuIiwiLy8gQ29weXJpZ2h0IMKpIDIwMTcgSW50ZWwgQ29ycG9yYXRpb24uIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG5cbid1c2Ugc3RyaWN0JztcblxuZXhwb3J0IGNsYXNzIENvbmZlcmVuY2VFcnJvciBleHRlbmRzIEVycm9yIHtcbiAgY29uc3RydWN0b3IobWVzc2FnZSkge1xuICAgIHN1cGVyKG1lc3NhZ2UpO1xuICB9XG59XG4iLCIvLyBDb3B5cmlnaHQgwqkgMjAxNyBJbnRlbCBDb3Jwb3JhdGlvbi4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cblxuZXhwb3J0IHtDb25mZXJlbmNlQ2xpZW50fSBmcm9tICcuL2NsaWVudC5qcydcbmV4cG9ydCB7U2lvU2lnbmFsaW5nfSBmcm9tICcuL3NpZ25hbGluZy5qcydcbiIsIi8vIENvcHlyaWdodCDCqSAyMDE3IEludGVsIENvcnBvcmF0aW9uLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuJ3VzZSBzdHJpY3QnO1xuXG4vKipcbiAqIEBjbGFzcyBDb25mZXJlbmNlSW5mb1xuICogQGNsYXNzRGVzYyBJbmZvcm1hdGlvbiBmb3IgYSBjb25mZXJlbmNlLlxuICogQG1lbWJlck9mIEljcy5Db25mZXJlbmNlXG4gKiBAaGlkZWNvbnN0cnVjdG9yXG4gKi9cbmV4cG9ydCBjbGFzcyBDb25mZXJlbmNlSW5mbyB7XG4gIGNvbnN0cnVjdG9yKGlkLCBwYXJ0aWNpcGFudHMsIHJlbW90ZVN0cmVhbXMsIG15SW5mbykge1xuICAgIC8qKlxuICAgICAqIEBtZW1iZXIge3N0cmluZ30gaWRcbiAgICAgKiBAaW5zdGFuY2VcbiAgICAgKiBAbWVtYmVyb2YgSWNzLkNvbmZlcmVuY2UuQ29uZmVyZW5jZUluZm9cbiAgICAgKiBAZGVzYyBDb25mZXJlbmNlIElELlxuICAgICAqL1xuICAgIHRoaXMuaWQgPSBpZDtcbiAgICAvKipcbiAgICAgKiBAbWVtYmVyIHtBcnJheTxJY3MuQ29uZmVyZW5jZS5QYXJ0aWNpcGFudD59IHBhcnRpY2lwYW50c1xuICAgICAqIEBpbnN0YW5jZVxuICAgICAqIEBtZW1iZXJvZiBJY3MuQ29uZmVyZW5jZS5Db25mZXJlbmNlSW5mb1xuICAgICAqIEBkZXNjIFBhcnRpY2lwYW50cyBpbiB0aGUgY29uZmVyZW5jZS5cbiAgICAgKi9cbiAgICB0aGlzLnBhcnRpY2lwYW50cyA9IHBhcnRpY2lwYW50cztcbiAgICAvKipcbiAgICAgKiBAbWVtYmVyIHtBcnJheTxJY3MuQmFzZS5SZW1vdGVTdHJlYW0+fSByZW1vdGVTdHJlYW1zXG4gICAgICogQGluc3RhbmNlXG4gICAgICogQG1lbWJlcm9mIEljcy5Db25mZXJlbmNlLkNvbmZlcmVuY2VJbmZvXG4gICAgICogQGRlc2MgU3RyZWFtcyBwdWJsaXNoZWQgYnkgcGFydGljaXBhbnRzLiBJdCBhbHNvIGluY2x1ZGVzIHN0cmVhbXMgcHVibGlzaGVkIGJ5IGN1cnJlbnQgdXNlci5cbiAgICAgKi9cbiAgICB0aGlzLnJlbW90ZVN0cmVhbXMgPSByZW1vdGVTdHJlYW1zO1xuICAgIC8qKlxuICAgICAqIEBtZW1iZXIge0ljcy5CYXNlLlBhcnRpY2lwYW50fSBzZWxmXG4gICAgICogQGluc3RhbmNlXG4gICAgICogQG1lbWJlcm9mIEljcy5Db25mZXJlbmNlLkNvbmZlcmVuY2VJbmZvXG4gICAgICovXG4gICAgdGhpcy5zZWxmID0gbXlJbmZvO1xuICB9XG59XG4iLCIvLyBDb3B5cmlnaHQgwqkgMjAxNyBJbnRlbCBDb3Jwb3JhdGlvbi4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbid1c2Ugc3RyaWN0JztcblxuaW1wb3J0ICogYXMgU3RyZWFtTW9kdWxlIGZyb20gJy4uL2Jhc2Uvc3RyZWFtLmpzJ1xuaW1wb3J0ICogYXMgU3RyZWFtVXRpbHNNb2R1bGUgZnJvbSAnLi9zdHJlYW11dGlscy5qcydcbmltcG9ydCB7IEljc0V2ZW50IH0gZnJvbSAnLi4vYmFzZS9ldmVudC5qcydcblxuLyoqXG4gKiBAY2xhc3MgUmVtb3RlTWl4ZWRTdHJlYW1cbiAqIEBjbGFzc0Rlc2MgTWl4ZWQgc3RyZWFtIGZyb20gY29uZmVyZW5jZSBzZXJ2ZXIuXG4gKiBFdmVudHM6XG4gKlxuICogfCBFdmVudCBOYW1lICAgICAgICAgICAgIHwgQXJndW1lbnQgVHlwZSAgICB8IEZpcmVkIHdoZW4gICAgICAgfFxuICogfCAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLXwgLS0tLS0tLS0tLS0tLS0tLSB8IC0tLS0tLS0tLS0tLS0tLS0gfFxuICogfCBhY3RpdmVhdWRpb2lucHV0Y2hhbmdlIHwgRXZlbnQgICAgICAgICAgICB8IEF1ZGlvIGFjdGl2ZW5lc3Mgb2YgaW5wdXQgc3RyZWFtKG9mIHRoZSBtaXhlZCBzdHJlYW0pIGlzIGNoYW5nZWQuIHxcbiAqIHwgbGF5b3V0Y2hhbmdlICAgICAgICAgICB8IEV2ZW50ICAgICAgICAgICAgfCBWaWRlbydzIGxheW91dCBoYXMgYmVlbiBjaGFuZ2VkLiBJdCB1c3VhbGx5IGhhcHBlbnMgd2hlbiBhIG5ldyB2aWRlbyBpcyBtaXhlZCBpbnRvIHRoZSB0YXJnZXQgbWl4ZWQgc3RyZWFtIG9yIGFuIGV4aXN0aW5nIHZpZGVvIGhhcyBiZWVuIHJlbW92ZWQgZnJvbSBtaXhlZCBzdHJlYW0uIHxcbiAqXG4gKiBAbWVtYmVyT2YgSWNzLkNvbmZlcmVuY2VcbiAqIEBleHRlbmRzIEljcy5CYXNlLlJlbW90ZVN0cmVhbVxuICogQGhpZGVjb25zdHJ1Y3RvclxuICovXG5leHBvcnQgY2xhc3MgUmVtb3RlTWl4ZWRTdHJlYW0gZXh0ZW5kcyBTdHJlYW1Nb2R1bGUuUmVtb3RlU3RyZWFtIHtcbiAgY29uc3RydWN0b3IoaW5mbykge1xuICAgIGlmIChpbmZvLnR5cGUgIT09ICdtaXhlZCcpIHtcbiAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ05vdCBhIG1peGVkIHN0cmVhbScpO1xuICAgIH1cbiAgICBzdXBlcihpbmZvLmlkLCB1bmRlZmluZWQsIHVuZGVmaW5lZCwgbmV3IFN0cmVhbU1vZHVsZS5TdHJlYW1Tb3VyY2VJbmZvKFxuICAgICAgJ21peGVkJywgJ21peGVkJykpO1xuXG4gICAgdGhpcy5zZXR0aW5ncyA9IFN0cmVhbVV0aWxzTW9kdWxlLmNvbnZlcnRUb1B1YmxpY2F0aW9uU2V0dGluZ3MoaW5mby5tZWRpYSk7XG5cbiAgICB0aGlzLmNhcGFiaWxpdGllcyA9IG5ldyBTdHJlYW1VdGlsc01vZHVsZS5jb252ZXJ0VG9TdWJzY3JpcHRpb25DYXBhYmlsaXRpZXMoXG4gICAgICBpbmZvLm1lZGlhKTtcbiAgfVxufVxuXG4vKipcbiAqIEBjbGFzcyBBY3RpdmVBdWRpb0lucHV0Q2hhbmdlRXZlbnRcbiAqIEBjbGFzc0Rlc2MgQ2xhc3MgQWN0aXZlSW5wdXRDaGFuZ2VFdmVudCByZXByZXNlbnRzIGFuIGFjdGl2ZSBhdWRpbyBpbnB1dCBjaGFuZ2UgZXZlbnQuXG4gKiBAbWVtYmVyb2YgSWNzLkNvbmZlcmVuY2VcbiAqIEBoaWRlY29uc3RydWN0b3JcbiAqL1xuZXhwb3J0IGNsYXNzIEFjdGl2ZUF1ZGlvSW5wdXRDaGFuZ2VFdmVudCBleHRlbmRzIEljc0V2ZW50IHtcbiAgY29uc3RydWN0b3IodHlwZSwgaW5pdCkge1xuICAgIHN1cGVyKHR5cGUpO1xuICAgIC8qKlxuICAgICAqIEBtZW1iZXIge3N0cmluZ30gYWN0aXZlQXVkaW9JbnB1dFN0cmVhbUlkXG4gICAgICogQGluc3RhbmNlXG4gICAgICogQG1lbWJlcm9mIEljcy5Db25mZXJlbmNlLkFjdGl2ZUF1ZGlvSW5wdXRDaGFuZ2VFdmVudFxuICAgICAqIEBkZXNjIFRoZSBJRCBvZiBpbnB1dCBzdHJlYW0ob2YgdGhlIG1peGVkIHN0cmVhbSkgd2hvc2UgYXVkaW8gaXMgYWN0aXZlLlxuICAgICAqL1xuICAgIHRoaXMuYWN0aXZlQXVkaW9JbnB1dFN0cmVhbUlkID0gaW5pdC5hY3RpdmVBdWRpb0lucHV0U3RyZWFtSWQ7XG4gIH1cbn1cblxuLyoqXG4gKiBAY2xhc3MgTGF5b3V0Q2hhbmdlRXZlbnRcbiAqIEBjbGFzc0Rlc2MgQ2xhc3MgTGF5b3V0Q2hhbmdlRXZlbnQgcmVwcmVzZW50cyBhbiB2aWRlbyBsYXlvdXQgY2hhbmdlIGV2ZW50LlxuICogQG1lbWJlcm9mIEljcy5Db25mZXJlbmNlXG4gKiBAaGlkZWNvbnN0cnVjdG9yXG4gKi9cbmV4cG9ydCBjbGFzcyBMYXlvdXRDaGFuZ2VFdmVudCBleHRlbmRzIEljc0V2ZW50e1xuICBjb25zdHJ1Y3Rvcih0eXBlLCBpbml0KSB7XG4gICAgc3VwZXIodHlwZSk7XG4gICAgLyoqXG4gICAgICogQG1lbWJlciB7b2JqZWN0fSBsYXlvdXRcbiAgICAgKiBAaW5zdGFuY2VcbiAgICAgKiBAbWVtYmVyb2YgSWNzLkNvbmZlcmVuY2UuTGF5b3V0Q2hhbmdlRXZlbnRcbiAgICAgKiBAZGVzYyBDdXJyZW50IHZpZGVvJ3MgbGF5b3V0LiBJdCdzIGFuIGFycmF5IG9mIG1hcCB3aGljaCBtYXBzIGVhY2ggc3RyZWFtIHRvIGEgcmVnaW9uLlxuICAgICAqL1xuICAgIHRoaXMubGF5b3V0ID0gaW5pdC5sYXlvdXQ7XG4gIH1cbn1cblxuIiwiLy8gQ29weXJpZ2h0IMKpIDIwMTcgSW50ZWwgQ29ycG9yYXRpb24uIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG5cbmltcG9ydCAqIGFzIEV2ZW50TW9kdWxlIGZyb20gJy4uL2Jhc2UvZXZlbnQuanMnO1xuXG4ndXNlIHN0cmljdCc7XG5cbi8qKlxuICogQGNsYXNzIFBhcnRpY2lwYW50XG4gKiBAbWVtYmVyT2YgSWNzLkNvbmZlcmVuY2VcbiAqIEBjbGFzc0Rlc2MgVGhlIFBhcnRpY2lwYW50IGRlZmluZXMgYSBwYXJ0aWNpcGFudCBpbiBhIGNvbmZlcmVuY2UuXG4gKiBFdmVudHM6XG4gKlxuICogfCBFdmVudCBOYW1lICAgICAgfCBBcmd1bWVudCBUeXBlICAgIHwgRmlyZWQgd2hlbiAgICAgICB8XG4gKiB8IC0tLS0tLS0tLS0tLS0tLS18IC0tLS0tLS0tLS0tLS0tLS0gfCAtLS0tLS0tLS0tLS0tLS0tIHxcbiAqIHwgbGVmdCAgICAgICAgICAgIHwgRXZlbnQgICAgICAgICAgICB8IFRoZSBwYXJ0aWNpcGFudCBsZWZ0IHRoZSBjb25mZXJlbmNlLiB8XG4gKlxuICogQGV4dGVuZHMgSWNzLkJhc2UuRXZlbnREaXNwYXRjaGVyXG4gKiBAaGlkZWNvbnN0cnVjdG9yXG4gKi9cbmV4cG9ydCBjbGFzcyBQYXJ0aWNpcGFudCBleHRlbmRzIEV2ZW50TW9kdWxlLkV2ZW50RGlzcGF0Y2hlciB7XG4gIGNvbnN0cnVjdG9yKGlkLCByb2xlLCB1c2VySWQpIHtcbiAgICBzdXBlcigpO1xuICAgIC8qKlxuICAgICAqIEBtZW1iZXIge3N0cmluZ30gaWRcbiAgICAgKiBAaW5zdGFuY2VcbiAgICAgKiBAbWVtYmVyb2YgSWNzLkNvbmZlcmVuY2UuUGFydGljaXBhbnRcbiAgICAgKiBAZGVzYyBUaGUgSUQgb2YgdGhlIHBhcnRpY2lwYW50LiBJdCB2YXJpZXMgd2hlbiBhIHNpbmdsZSB1c2VyIGpvaW4gZGlmZmVyZW50IGNvbmZlcmVuY2VzLlxuICAgICAqL1xuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCAnaWQnLCB7XG4gICAgICBjb25maWd1cmFibGU6IGZhbHNlLFxuICAgICAgd3JpdGFibGU6IGZhbHNlLFxuICAgICAgdmFsdWU6IGlkXG4gICAgfSk7XG4gICAgLyoqXG4gICAgICogQG1lbWJlciB7c3RyaW5nfSByb2xlXG4gICAgICogQGluc3RhbmNlXG4gICAgICogQG1lbWJlcm9mIEljcy5Db25mZXJlbmNlLlBhcnRpY2lwYW50XG4gICAgICovXG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsICdyb2xlJywge1xuICAgICAgY29uZmlndXJhYmxlOiBmYWxzZSxcbiAgICAgIHdyaXRhYmxlOiBmYWxzZSxcbiAgICAgIHZhbHVlOiByb2xlXG4gICAgfSk7XG4gICAgLyoqXG4gICAgICogQG1lbWJlciB7c3RyaW5nfSB1c2VySWRcbiAgICAgKiBAaW5zdGFuY2VcbiAgICAgKiBAbWVtYmVyb2YgSWNzLkNvbmZlcmVuY2UuUGFydGljaXBhbnRcbiAgICAgKiBAZGVzYyBUaGUgdXNlciBJRCBvZiB0aGUgcGFydGljaXBhbnQuIEl0IGNhbiBiZSBpbnRlZ3JhdGVkIGludG8gZXhpc3RpbmcgYWNjb3VudCBtYW5hZ2VtZW50IHN5c3RlbS5cbiAgICAgKi9cbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcywgJ3VzZXJJZCcsIHtcbiAgICAgIGNvbmZpZ3VyYWJsZTogZmFsc2UsXG4gICAgICB3cml0YWJsZTogZmFsc2UsXG4gICAgICB2YWx1ZTogdXNlcklkXG4gICAgfSk7XG4gIH1cbn1cbiIsIi8qIGdsb2JhbCBpbyAqL1xuaW1wb3J0IExvZ2dlciBmcm9tICcuLi9iYXNlL2xvZ2dlci5qcydcbmltcG9ydCAqIGFzIEV2ZW50TW9kdWxlIGZyb20gJy4uL2Jhc2UvZXZlbnQuanMnXG5cbid1c2Ugc3RyaWN0JztcblxuZnVuY3Rpb24gaGFuZGxlUmVzcG9uc2Uoc3RhdHVzLCBkYXRhLCByZXNvbHZlLCByZWplY3QpIHtcbiAgaWYgKHN0YXR1cyA9PT0gJ29rJyB8fCBzdGF0dXMgPT09ICdzdWNjZXNzJykge1xuICAgIHJlc29sdmUoZGF0YSk7XG4gIH0gZWxzZSBpZiAoc3RhdHVzID09PSAnZXJyb3InKSB7XG4gICAgcmVqZWN0KGRhdGEpO1xuICB9IGVsc2Uge1xuICAgIExvZ2dlci5lcnJvcignTUNVIHJldHVybnMgdW5rbm93biBhY2suJyk7XG4gIH1cbn07XG5cbi8qKlxuICogQGNsYXNzIFNpb1NpZ25hbGluZ1xuICogQGNsYXNzZGVzYyBTb2NrZXQuSU8gc2lnbmFsaW5nIGNoYW5uZWwgZm9yIENvbmZlcmVuY2VDbGllbnQuIEl0IGlzIG5vdCByZWNvbW1lbmRlZCB0byBkaXJlY3RseSBhY2Nlc3MgdGhpcyBjbGFzcy5cbiAqIEBtZW1iZXJvZiBJY3MuQ29uZmVyZW5jZVxuICogQGV4dGVuZHMgSWNzLkJhc2UuRXZlbnREaXNwYXRjaGVyXG4gKiBAY29uc3RydWN0b3JcbiAqIEBwYXJhbSB7P09iamVjdCB9IHNpb0NvbmZpZyBDb25maWd1cmF0aW9uIGZvciBTb2NrZXQuSU8gb3B0aW9ucy5cbiAqIEBzZWUgaHR0cHM6Ly9zb2NrZXQuaW8vZG9jcy9jbGllbnQtYXBpLyNpby11cmwtb3B0aW9uc1xuICovXG5leHBvcnQgY2xhc3MgU2lvU2lnbmFsaW5nIGV4dGVuZHMgRXZlbnRNb2R1bGUuRXZlbnREaXNwYXRjaGVyIHtcbiAgY29uc3RydWN0b3Ioc2lvQ29uZmlnKSB7XG4gICAgc3VwZXIoKTtcbiAgICB0aGlzLl9zb2NrZXQgPSBudWxsO1xuICAgIHRoaXMuX3Npb0NvbmZpZyA9IHNpb0NvbmZpZyB8fCB7fTtcbiAgfVxuXG4gIGNvbm5lY3QoaG9zdCwgaXNTZWN1cmVkLCBsb2dpbkluZm8pIHtcbiAgICB0aGlzLl9zaW9Db25maWcuc2VjdXJlID0gaXNTZWN1cmVkO1xuICAgIGlmICh0aGlzLl9zaW9Db25maWdbJ2ZvcmNlIG5ldyBjb25uZWN0aW9uJ10gPT09IHVuZGVmaW5lZCkge1xuICAgICAgdGhpcy5fc2lvQ29uZmlnWydmb3JjZSBuZXcgY29ubmVjdGlvbiddID0gdHJ1ZTtcbiAgICB9XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgIHRoaXMuX3NvY2tldCA9IGlvLmNvbm5lY3QoaG9zdCwgdGhpcy5fc2lvQ29uZmlnKTtcbiAgICAgIFsnZHJvcCcsICdwYXJ0aWNpcGFudCcsICd0ZXh0JywgJ3N0cmVhbScsICdwcm9ncmVzcyddLmZvckVhY2goKFxuICAgICAgICBub3RpZmljYXRpb24pID0+IHtcbiAgICAgICAgdGhpcy5fc29ja2V0Lm9uKG5vdGlmaWNhdGlvbiwgKGRhdGEpID0+IHtcbiAgICAgICAgICB0aGlzLmRpc3BhdGNoRXZlbnQobmV3IEV2ZW50TW9kdWxlLk1lc3NhZ2VFdmVudCgnZGF0YScsIHtcbiAgICAgICAgICAgIG1lc3NhZ2U6IHtcbiAgICAgICAgICAgICAgbm90aWZpY2F0aW9uOiBub3RpZmljYXRpb24sXG4gICAgICAgICAgICAgIGRhdGE6IGRhdGFcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KSk7XG4gICAgICAgIH0pO1xuICAgICAgfSk7XG4gICAgICB0aGlzLl9zb2NrZXQub24oJ2Rpc2Nvbm5lY3QnLCAoKSA9PiB7XG4gICAgICAgIHRoaXMuZGlzcGF0Y2hFdmVudChuZXcgRXZlbnRNb2R1bGUuSWNzRXZlbnQoJ2Rpc2Nvbm5lY3QnKSk7XG4gICAgICB9KTtcbiAgICAgIHRoaXMuX3NvY2tldC5lbWl0KCdsb2dpbicsIGxvZ2luSW5mbywgKHN0YXR1cywgZGF0YSkgPT4ge1xuICAgICAgICBoYW5kbGVSZXNwb25zZShzdGF0dXMsIGRhdGEsIHJlc29sdmUsIHJlamVjdCk7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfVxuXG4gIGRpc2Nvbm5lY3QoKSB7XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgIHRoaXMuX3NvY2tldC5lbWl0KCdsb2dvdXQnLCAoc3RhdHVzLCBkYXRhKSA9PiB7XG4gICAgICAgIHRoaXMuX3NvY2tldC5kaXNjb25uZWN0KCk7XG4gICAgICAgIGhhbmRsZVJlc3BvbnNlKHN0YXR1cywgZGF0YSwgcmVzb2x2ZSwgcmVqZWN0KTtcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9XG5cbiAgc2VuZChyZXF1ZXN0TmFtZSwgcmVxdWVzdERhdGEpIHtcbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgdGhpcy5fc29ja2V0LmVtaXQocmVxdWVzdE5hbWUsIHJlcXVlc3REYXRhLCAoc3RhdHVzLCBkYXRhKSA9PiB7XG4gICAgICAgIGhhbmRsZVJlc3BvbnNlKHN0YXR1cywgZGF0YSwgcmVzb2x2ZSwgcmVqZWN0KTtcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9XG59XG4iLCIvLyBDb3B5cmlnaHQgwqkgMjAxNyBJbnRlbCBDb3Jwb3JhdGlvbi4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbid1c2Ugc3RyaWN0JztcblxuaW1wb3J0ICogYXMgUHVibGljYXRpb25Nb2R1bGUgZnJvbSAnLi4vYmFzZS9wdWJsaWNhdGlvbi5qcydcbmltcG9ydCAqIGFzIE1lZGlhRm9ybWF0TW9kdWxlIGZyb20gJy4uL2Jhc2UvbWVkaWFmb3JtYXQuanMnXG5pbXBvcnQgKiBhcyBDb2RlY01vZHVsZSBmcm9tICcuLi9iYXNlL2NvZGVjLmpzJ1xuaW1wb3J0ICogYXMgU3Vic2NyaXB0aW9uTW9kdWxlIGZyb20gJy4vc3Vic2NyaXB0aW9uLmpzJ1xuXG5mdW5jdGlvbiBleHRyYWN0Qml0cmF0ZU11bHRpcGxpZXIoaW5wdXQpIHtcbiAgaWYgKHR5cGVvZiBpbnB1dCAhPT0gJ3N0cmluZycgfHwgIWlucHV0LnN0YXJ0c1dpdGgoJ3gnKSkge1xuICAgIEwuTG9nZ2VyLndhcm5pbmcoJ0ludmFsaWQgYml0cmF0ZSBtdWx0aXBsaWVyIGlucHV0LicpO1xuICAgIHJldHVybiAwO1xuICB9XG4gIHJldHVybiBOdW1iZXIucGFyc2VGbG9hdChpbnB1dC5yZXBsYWNlKC9eeC8sICcnKSk7XG59XG5cbmZ1bmN0aW9uIHNvcnROdW1iZXJzKHgsIHkpIHtcbiAgcmV0dXJuIHggLSB5O1xufVxuXG5mdW5jdGlvbiBzb3J0UmVzb2x1dGlvbnMoeCwgeSkge1xuICBpZiAoeC53aWR0aCAhPT0geS53aWR0aCkge1xuICAgIHJldHVybiB4LndpZHRoIC0geS53aWR0aDtcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4geC5oZWlnaHQgLSB5LmhlaWdodDtcbiAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gY29udmVydFRvUHVibGljYXRpb25TZXR0aW5ncyhtZWRpYUluZm8pIHtcbiAgbGV0IGF1ZGlvLCBhdWRpb0NvZGVjLCB2aWRlbywgdmlkZW9Db2RlYywgcmVzb2x1dGlvbiwgZnJhbWVyYXRlLCBiaXRyYXRlLFxuICAgIGtleUZyYW1lSW50ZXJ2YWw7XG4gIGlmIChtZWRpYUluZm8uYXVkaW8pIHtcbiAgICBpZiAobWVkaWFJbmZvLmF1ZGlvLmZvcm1hdCkge1xuICAgICAgYXVkaW9Db2RlYyA9IG5ldyBDb2RlY01vZHVsZS5BdWRpb0NvZGVjUGFyYW1ldGVycyhtZWRpYUluZm8uYXVkaW8uZm9ybWF0XG4gICAgICAgIC5jb2RlYywgbWVkaWFJbmZvLmF1ZGlvLmZvcm1hdC5jaGFubmVsTnVtLCBtZWRpYUluZm8uYXVkaW8uZm9ybWF0LnNhbXBsZVJhdGVcbiAgICAgICk7XG4gICAgfVxuICAgIGF1ZGlvID0gbmV3IFB1YmxpY2F0aW9uTW9kdWxlLkF1ZGlvUHVibGljYXRpb25TZXR0aW5ncyhhdWRpb0NvZGVjKTtcbiAgfVxuICBpZiAobWVkaWFJbmZvLnZpZGVvKSB7XG4gICAgaWYgKG1lZGlhSW5mby52aWRlby5mb3JtYXQpIHtcbiAgICAgIHZpZGVvQ29kZWMgPSBuZXcgQ29kZWNNb2R1bGUuVmlkZW9Db2RlY1BhcmFtZXRlcnMobWVkaWFJbmZvLnZpZGVvXG4gICAgICAgIC5mb3JtYXQuY29kZWMsIG1lZGlhSW5mby52aWRlby5mb3JtYXQucHJvZmlsZSk7XG4gICAgfVxuICAgIGlmIChtZWRpYUluZm8udmlkZW8ucGFyYW1ldGVycykge1xuICAgICAgaWYgKG1lZGlhSW5mby52aWRlby5wYXJhbWV0ZXJzLnJlc29sdXRpb24pIHtcbiAgICAgICAgcmVzb2x1dGlvbiA9IG5ldyBNZWRpYUZvcm1hdE1vZHVsZS5SZXNvbHV0aW9uKG1lZGlhSW5mby52aWRlby5wYXJhbWV0ZXJzXG4gICAgICAgICAgLnJlc29sdXRpb24ud2lkdGgsIG1lZGlhSW5mby52aWRlby5wYXJhbWV0ZXJzLnJlc29sdXRpb24uaGVpZ2h0KTtcbiAgICAgIH1cbiAgICAgIGZyYW1lcmF0ZSA9IG1lZGlhSW5mby52aWRlby5wYXJhbWV0ZXJzLmZyYW1lcmF0ZTtcbiAgICAgIGJpdHJhdGUgPSBtZWRpYUluZm8udmlkZW8ucGFyYW1ldGVycy5iaXRyYXRlICogMTAwMDtcbiAgICAgIGtleUZyYW1lSW50ZXJ2YWwgPSBtZWRpYUluZm8udmlkZW8ucGFyYW1ldGVycy5rZXlGcmFtZUludGVydmFsO1xuICAgIH1cbiAgICB2aWRlbyA9IG5ldyBQdWJsaWNhdGlvbk1vZHVsZS5WaWRlb1B1YmxpY2F0aW9uU2V0dGluZ3ModmlkZW9Db2RlYyxcbiAgICAgIHJlc29sdXRpb24sIGZyYW1lcmF0ZSwgYml0cmF0ZSwga2V5RnJhbWVJbnRlcnZhbFxuICAgICk7XG4gIH1cbiAgcmV0dXJuIG5ldyBQdWJsaWNhdGlvbk1vZHVsZS5QdWJsaWNhdGlvblNldHRpbmdzKGF1ZGlvLCB2aWRlbyk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBjb252ZXJ0VG9TdWJzY3JpcHRpb25DYXBhYmlsaXRpZXMobWVkaWFJbmZvKSB7XG4gIGxldCBhdWRpbywgdmlkZW87XG4gIGlmIChtZWRpYUluZm8uYXVkaW8pIHtcbiAgICBjb25zdCBhdWRpb0NvZGVjcyA9IFtdO1xuICAgIGlmIChtZWRpYUluZm8uYXVkaW8gJiYgbWVkaWFJbmZvLmF1ZGlvLmZvcm1hdCkge1xuICAgICAgYXVkaW9Db2RlY3MucHVzaChuZXcgQ29kZWNNb2R1bGUuQXVkaW9Db2RlY1BhcmFtZXRlcnMoXG4gICAgICAgIG1lZGlhSW5mby5hdWRpby5mb3JtYXQuY29kZWMsIG1lZGlhSW5mby5hdWRpby5mb3JtYXQuY2hhbm5lbE51bSxcbiAgICAgICAgbWVkaWFJbmZvLmF1ZGlvLmZvcm1hdC5zYW1wbGVSYXRlKSk7XG4gICAgfVxuICAgIGlmIChtZWRpYUluZm8uYXVkaW8gJiYgbWVkaWFJbmZvLmF1ZGlvLm9wdGlvbmFsICYmXG4gICAgICBtZWRpYUluZm8uYXVkaW8ub3B0aW9uYWwuZm9ybWF0KSB7XG4gICAgICBmb3IgKGNvbnN0IGF1ZGlvQ29kZWNJbmZvIG9mIG1lZGlhSW5mby5hdWRpby5vcHRpb25hbC5mb3JtYXQpIHtcbiAgICAgICAgY29uc3QgYXVkaW9Db2RlYyA9IG5ldyBDb2RlY01vZHVsZS5BdWRpb0NvZGVjUGFyYW1ldGVycyhcbiAgICAgICAgICBhdWRpb0NvZGVjSW5mby5jb2RlYywgYXVkaW9Db2RlY0luZm8uY2hhbm5lbE51bSxcbiAgICAgICAgICBhdWRpb0NvZGVjSW5mby5zYW1wbGVSYXRlKTtcbiAgICAgICAgYXVkaW9Db2RlY3MucHVzaChhdWRpb0NvZGVjKTtcbiAgICAgIH1cbiAgICB9XG4gICAgYXVkaW9Db2RlY3Muc29ydCgpO1xuICAgIGF1ZGlvID0gbmV3IFN1YnNjcmlwdGlvbk1vZHVsZS5BdWRpb1N1YnNjcmlwdGlvbkNhcGFiaWxpdGllcyhhdWRpb0NvZGVjcyk7XG4gIH1cbiAgaWYgKG1lZGlhSW5mby52aWRlbykge1xuICAgIGNvbnN0IHZpZGVvQ29kZWNzID0gW107XG4gICAgaWYgKG1lZGlhSW5mby52aWRlbyAmJiBtZWRpYUluZm8udmlkZW8uZm9ybWF0KSB7XG4gICAgICB2aWRlb0NvZGVjcy5wdXNoKG5ldyBDb2RlY01vZHVsZS5WaWRlb0NvZGVjUGFyYW1ldGVycyhcbiAgICAgICAgbWVkaWFJbmZvLnZpZGVvLmZvcm1hdC5jb2RlYywgbWVkaWFJbmZvLnZpZGVvLmZvcm1hdC5wcm9maWxlKSk7XG4gICAgfVxuICAgIGlmIChtZWRpYUluZm8udmlkZW8gJiYgbWVkaWFJbmZvLnZpZGVvLm9wdGlvbmFsICYmXG4gICAgICBtZWRpYUluZm8udmlkZW8ub3B0aW9uYWwuZm9ybWF0KSB7XG4gICAgICBmb3IgKGNvbnN0IHZpZGVvQ29kZWNJbmZvIG9mIG1lZGlhSW5mby52aWRlby5vcHRpb25hbC5mb3JtYXQpIHtcbiAgICAgICAgY29uc3QgdmlkZW9Db2RlYyA9IG5ldyBDb2RlY01vZHVsZS5WaWRlb0NvZGVjUGFyYW1ldGVycyhcbiAgICAgICAgICB2aWRlb0NvZGVjSW5mby5jb2RlYywgdmlkZW9Db2RlY0luZm8ucHJvZmlsZSk7XG4gICAgICAgIHZpZGVvQ29kZWNzLnB1c2godmlkZW9Db2RlYyk7XG4gICAgICB9XG4gICAgfVxuICAgIHZpZGVvQ29kZWNzLnNvcnQoKTtcbiAgICBjb25zdCByZXNvbHV0aW9ucyA9IEFycmF5LmZyb20oXG4gICAgICBtZWRpYUluZm8udmlkZW8ub3B0aW9uYWwucGFyYW1ldGVycy5yZXNvbHV0aW9uLFxuICAgICAgciA9PiBuZXcgTWVkaWFGb3JtYXRNb2R1bGUuUmVzb2x1dGlvbihyLndpZHRoLCByLmhlaWdodCkpO1xuICAgIGlmIChtZWRpYUluZm8udmlkZW8gJiYgbWVkaWFJbmZvLnZpZGVvLnBhcmFtZXRlcnMgJiZcbiAgICAgIG1lZGlhSW5mby52aWRlby5wYXJhbWV0ZXJzLnJlc29sdXRpb24pIHtcbiAgICAgIHJlc29sdXRpb25zLnB1c2gobmV3IE1lZGlhRm9ybWF0TW9kdWxlLlJlc29sdXRpb24oXG4gICAgICAgIG1lZGlhSW5mby52aWRlby5wYXJhbWV0ZXJzLnJlc29sdXRpb24ud2lkdGgsXG4gICAgICAgIG1lZGlhSW5mby52aWRlby5wYXJhbWV0ZXJzLnJlc29sdXRpb24uaGVpZ2h0KSk7XG4gICAgfVxuICAgIHJlc29sdXRpb25zLnNvcnQoc29ydFJlc29sdXRpb25zKTtcbiAgICBjb25zdCBiaXRyYXRlcyA9IEFycmF5LmZyb20oXG4gICAgICBtZWRpYUluZm8udmlkZW8ub3B0aW9uYWwucGFyYW1ldGVycy5iaXRyYXRlLFxuICAgICAgYml0cmF0ZSA9PiBleHRyYWN0Qml0cmF0ZU11bHRpcGxpZXIoYml0cmF0ZSkpO1xuICAgIGJpdHJhdGVzLnB1c2goMS4wKTtcbiAgICBiaXRyYXRlcy5zb3J0KHNvcnROdW1iZXJzKTtcbiAgICBjb25zdCBmcmFtZVJhdGVzID0gSlNPTi5wYXJzZShcbiAgICAgIEpTT04uc3RyaW5naWZ5KG1lZGlhSW5mby52aWRlby5vcHRpb25hbC5wYXJhbWV0ZXJzLmZyYW1lcmF0ZSkpO1xuICAgIGlmIChtZWRpYUluZm8udmlkZW8gJiYgbWVkaWFJbmZvLnZpZGVvLnBhcmFtZXRlcnMgJiYgbWVkaWFJbmZvLnZpZGVvLnBhcmFtZXRlcnNcbiAgICAgIC5mcmFtZXJhdGUpIHtcbiAgICAgIGZyYW1lUmF0ZXMucHVzaChtZWRpYUluZm8udmlkZW8ucGFyYW1ldGVycy5mcmFtZXJhdGUpO1xuICAgIH1cbiAgICBmcmFtZVJhdGVzLnNvcnQoc29ydE51bWJlcnMpO1xuICAgIGNvbnN0IGtleUZyYW1lSW50ZXJ2YWxzID0gSlNPTi5wYXJzZShcbiAgICAgIEpTT04uc3RyaW5naWZ5KG1lZGlhSW5mby52aWRlby5vcHRpb25hbC5wYXJhbWV0ZXJzLmtleUZyYW1lSW50ZXJ2YWwpKTtcbiAgICBpZiAobWVkaWFJbmZvLnZpZGVvICYmIG1lZGlhSW5mby52aWRlby5wYXJhbWV0ZXJzICYmIG1lZGlhSW5mby52aWRlby5wYXJhbWV0ZXJzXG4gICAgICAua2V5RnJhbWVJbnRlcnZhbCkge1xuICAgICAga2V5RnJhbWVJbnRlcnZhbHMucHVzaChtZWRpYUluZm8udmlkZW8ucGFyYW1ldGVycy5rZXlGcmFtZUludGVydmFsKTtcbiAgICB9XG4gICAga2V5RnJhbWVJbnRlcnZhbHMuc29ydChzb3J0TnVtYmVycyk7XG4gICAgdmlkZW8gPSBuZXcgU3Vic2NyaXB0aW9uTW9kdWxlLlZpZGVvU3Vic2NyaXB0aW9uQ2FwYWJpbGl0aWVzKFxuICAgICAgdmlkZW9Db2RlY3MsIHJlc29sdXRpb25zLCBmcmFtZVJhdGVzLCBiaXRyYXRlcywga2V5RnJhbWVJbnRlcnZhbHMpO1xuICB9XG4gIHJldHVybiBuZXcgU3Vic2NyaXB0aW9uTW9kdWxlLlN1YnNjcmlwdGlvbkNhcGFiaWxpdGllcyhhdWRpbywgdmlkZW8pO1xufVxuIiwiLy8gQ29weXJpZ2h0IMKpIDIwMTcgSW50ZWwgQ29ycG9yYXRpb24uIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG5cbid1c2Ugc3RyaWN0JztcblxuaW1wb3J0ICogYXMgTWVkaWFGb3JtYXRNb2R1bGUgZnJvbSAnLi4vYmFzZS9tZWRpYWZvcm1hdC5qcydcbmltcG9ydCAqIGFzIENvZGVjTW9kdWxlIGZyb20gJy4uL2Jhc2UvY29kZWMuanMnXG5pbXBvcnQgeyBFdmVudERpc3BhdGNoZXJ9IGZyb20gJy4uL2Jhc2UvZXZlbnQuanMnXG5cbi8qKlxuICogQGNsYXNzIEF1ZGlvU3Vic2NyaXB0aW9uQ2FwYWJpbGl0aWVzXG4gKiBAbWVtYmVyT2YgSWNzLkNvbmZlcmVuY2VcbiAqIEBjbGFzc0Rlc2MgUmVwcmVzZW50cyB0aGUgYXVkaW8gY2FwYWJpbGl0eSBmb3Igc3Vic2NyaXB0aW9uLlxuICogQGhpZGVjb25zdHJ1Y3RvclxuICovXG5leHBvcnQgY2xhc3MgQXVkaW9TdWJzY3JpcHRpb25DYXBhYmlsaXRpZXMge1xuICBjb25zdHJ1Y3Rvcihjb2RlY3MpIHtcbiAgICAvKipcbiAgICAgKiBAbWVtYmVyIHtBcnJheS48SWNzLkJhc2UuQXVkaW9Db2RlY1BhcmFtZXRlcnM+fSBjb2RlY3NcbiAgICAgKiBAaW5zdGFuY2VcbiAgICAgKiBAbWVtYmVyb2YgSWNzLkNvbmZlcmVuY2UuQXVkaW9TdWJzY3JpcHRpb25DYXBhYmlsaXRpZXNcbiAgICAgKi9cbiAgICB0aGlzLmNvZGVjcyA9IGNvZGVjcztcbiAgfVxufVxuXG4vKipcbiAqIEBjbGFzcyBWaWRlb1N1YnNjcmlwdGlvbkNhcGFiaWxpdGllc1xuICogQG1lbWJlck9mIEljcy5Db25mZXJlbmNlXG4gKiBAY2xhc3NEZXNjIFJlcHJlc2VudHMgdGhlIHZpZGVvIGNhcGFiaWxpdHkgZm9yIHN1YnNjcmlwdGlvbi5cbiAqIEBoaWRlY29uc3RydWN0b3JcbiAqL1xuZXhwb3J0IGNsYXNzIFZpZGVvU3Vic2NyaXB0aW9uQ2FwYWJpbGl0aWVzIHtcbiAgY29uc3RydWN0b3IoY29kZWNzLCByZXNvbHV0aW9ucywgZnJhbWVSYXRlcywgYml0cmF0ZU11bHRpcGxpZXJzLFxuICAgIGtleUZyYW1lSW50ZXJ2YWxzKSB7XG4gICAgLyoqXG4gICAgICogQG1lbWJlciB7QXJyYXkuPEljcy5CYXNlLlZpZGVvQ29kZWNQYXJhbWV0ZXJzPn0gY29kZWNzXG4gICAgICogQGluc3RhbmNlXG4gICAgICogQG1lbWJlcm9mIEljcy5Db25mZXJlbmNlLlZpZGVvU3Vic2NyaXB0aW9uQ2FwYWJpbGl0aWVzXG4gICAgICovXG4gICAgdGhpcy5jb2RlY3MgPSBjb2RlY3M7XG4gICAgLyoqXG4gICAgICogQG1lbWJlciB7QXJyYXkuPEljcy5CYXNlLlJlc29sdXRpb24+fSByZXNvbHV0aW9uXG4gICAgICogQGluc3RhbmNlXG4gICAgICogQG1lbWJlcm9mIEljcy5Db25mZXJlbmNlLlZpZGVvU3Vic2NyaXB0aW9uQ2FwYWJpbGl0aWVzXG4gICAgICovXG4gICAgdGhpcy5yZXNvbHV0aW9ucyA9IHJlc29sdXRpb25zO1xuICAgIC8qKlxuICAgICAqIEBtZW1iZXIge0FycmF5LjxudW1iZXI+fSBmcmFtZVJhdGVzXG4gICAgICogQGluc3RhbmNlXG4gICAgICogQG1lbWJlcm9mIEljcy5Db25mZXJlbmNlLlZpZGVvU3Vic2NyaXB0aW9uQ2FwYWJpbGl0aWVzXG4gICAgICovXG4gICAgdGhpcy5mcmFtZVJhdGVzID0gZnJhbWVSYXRlcztcbiAgICAvKipcbiAgICAgKiBAbWVtYmVyIHtBcnJheS48bnVtYmVyPn0gYml0cmF0ZU11bHRpcGxpZXJzXG4gICAgICogQGluc3RhbmNlXG4gICAgICogQG1lbWJlcm9mIEljcy5Db25mZXJlbmNlLlZpZGVvU3Vic2NyaXB0aW9uQ2FwYWJpbGl0aWVzXG4gICAgICovXG4gICAgdGhpcy5iaXRyYXRlTXVsdGlwbGllcnMgPSBiaXRyYXRlTXVsdGlwbGllcnM7XG4gICAgLyoqXG4gICAgICogQG1lbWJlciB7QXJyYXkuPG51bWJlcj59IGtleUZyYW1lSW50ZXJ2YWxzXG4gICAgICogQGluc3RhbmNlXG4gICAgICogQG1lbWJlcm9mIEljcy5Db25mZXJlbmNlLlZpZGVvU3Vic2NyaXB0aW9uQ2FwYWJpbGl0aWVzXG4gICAgICovXG4gICAgdGhpcy5rZXlGcmFtZUludGVydmFscyA9IGtleUZyYW1lSW50ZXJ2YWxzO1xuICB9XG59XG5cbi8qKlxuICogQGNsYXNzIFN1YnNjcmlwdGlvbkNhcGFiaWxpdGllc1xuICogQG1lbWJlck9mIEljcy5Db25mZXJlbmNlXG4gKiBAY2xhc3NEZXNjIFJlcHJlc2VudHMgdGhlIGNhcGFiaWxpdHkgZm9yIHN1YnNjcmlwdGlvbi5cbiAqIEBoaWRlY29uc3RydWN0b3JcbiAqL1xuZXhwb3J0IGNsYXNzIFN1YnNjcmlwdGlvbkNhcGFiaWxpdGllcyB7XG4gIGNvbnN0cnVjdG9yKGF1ZGlvLCB2aWRlbykge1xuICAgIC8qKlxuICAgICAqIEBtZW1iZXIgez9BdWRpb1N1YnNjcmlwdGlvbkNhcGFiaWxpdGllc30gYXVkaW9cbiAgICAgKiBAaW5zdGFuY2VcbiAgICAgKiBAbWVtYmVyb2YgSWNzLkNvbmZlcmVuY2UuU3Vic2NyaXB0aW9uQ2FwYWJpbGl0aWVzXG4gICAgICovXG4gICAgdGhpcy5hdWRpbyA9IGF1ZGlvO1xuICAgIC8qKlxuICAgICAqIEBtZW1iZXIgez9WaWRlb1N1YnNjcmlwdGlvbkNhcGFiaWxpdGllc30gdmlkZW9cbiAgICAgKiBAaW5zdGFuY2VcbiAgICAgKiBAbWVtYmVyb2YgSWNzLkNvbmZlcmVuY2UuU3Vic2NyaXB0aW9uQ2FwYWJpbGl0aWVzXG4gICAgICovXG4gICAgdGhpcy52aWRlbyA9IHZpZGVvO1xuICB9XG59XG5cbi8qKlxuICogQGNsYXNzIEF1ZGlvU3Vic2NyaXB0aW9uQ29uc3RyYWludHNcbiAqIEBtZW1iZXJPZiBJY3MuQ29uZmVyZW5jZVxuICogQGNsYXNzRGVzYyBSZXByZXNlbnRzIHRoZSBhdWRpbyBjb25zdHJhaW50cyBmb3Igc3Vic2NyaXB0aW9uLlxuICogQGhpZGVjb25zdHJ1Y3RvclxuICovXG5leHBvcnQgY2xhc3MgQXVkaW9TdWJzY3JpcHRpb25Db25zdHJhaW50cyB7XG4gIGNvbnN0cnVjdG9yKGNvZGVjcykge1xuICAgIC8qKlxuICAgICAqIEBtZW1iZXIgez9BcnJheS48SWNzLkJhc2UuQXVkaW9Db2RlY1BhcmFtZXRlcnM+fSBjb2RlY3NcbiAgICAgKiBAaW5zdGFuY2VcbiAgICAgKiBAbWVtYmVyb2YgSWNzLkNvbmZlcmVuY2UuQXVkaW9TdWJzY3JpcHRpb25Db25zdHJhaW50c1xuICAgICAqIEBkZXNjIENvZGVjcyBhY2NlcHRlZC4gSWYgbm9uZSBvZiBgY29kZWNzYCBzdXBwb3J0ZWQgYnkgYm90aCBzaWRlcywgY29ubmVjdGlvbiBmYWlscy4gTGVhdmUgaXQgdW5kZWZpbmVkIHdpbGwgdXNlIGFsbCBwb3NzaWJsZSBjb2RlY3MuXG4gICAgICovXG4gICAgdGhpcy5jb2RlY3MgPSBjb2RlY3M7XG4gIH1cbn1cblxuLyoqXG4gKiBAY2xhc3MgVmlkZW9TdWJzY3JpcHRpb25Db25zdHJhaW50c1xuICogQG1lbWJlck9mIEljcy5Db25mZXJlbmNlXG4gKiBAY2xhc3NEZXNjIFJlcHJlc2VudHMgdGhlIHZpZGVvIGNvbnN0cmFpbnRzIGZvciBzdWJzY3JpcHRpb24uXG4gKiBAaGlkZWNvbnN0cnVjdG9yXG4gKi9cbmV4cG9ydCBjbGFzcyBWaWRlb1N1YnNjcmlwdGlvbkNvbnN0cmFpbnRzIHtcbiAgY29uc3RydWN0b3IoY29kZWNzLCByZXNvbHV0aW9uLCBmcmFtZVJhdGUsIGJpdHJhdGVNdWx0aXBsaWVyLFxuICAgIGtleUZyYW1lSW50ZXJ2YWwpIHtcbiAgICAvKipcbiAgICAgKiBAbWVtYmVyIHs/QXJyYXkuPEljcy5CYXNlLlZpZGVvQ29kZWNQYXJhbWV0ZXJzPn0gY29kZWNzXG4gICAgICogQGluc3RhbmNlXG4gICAgICogQG1lbWJlcm9mIEljcy5Db25mZXJlbmNlLlZpZGVvU3Vic2NyaXB0aW9uQ29uc3RyYWludHNcbiAgICAgKiBAZGVzYyBDb2RlY3MgYWNjZXB0ZWQuIElmIG5vbmUgb2YgYGNvZGVjc2Agc3VwcG9ydGVkIGJ5IGJvdGggc2lkZXMsIGNvbm5lY3Rpb24gZmFpbHMuIExlYXZlIGl0IHVuZGVmaW5lZCB3aWxsIHVzZSBhbGwgcG9zc2libGUgY29kZWNzLlxuICAgICAqL1xuICAgIHRoaXMuY29kZWNzID0gY29kZWNzO1xuICAgIC8qKlxuICAgICAqIEBtZW1iZXIgez9JY3MuQmFzZS5SZXNvbHV0aW9ufSByZXNvbHV0aW9uXG4gICAgICogQGluc3RhbmNlXG4gICAgICogQG1lbWJlcm9mIEljcy5Db25mZXJlbmNlLlZpZGVvU3Vic2NyaXB0aW9uQ29uc3RyYWludHNcbiAgICAgKiBAZGVzYyBPbmx5IHJlc29sdXRpb25zIGxpc3RlZCBpbiBWaWRlb1N1YnNjcmlwdGlvbkNhcGFiaWxpdGllcyBhcmUgYWxsb3dlZC5cbiAgICAgKi9cbiAgICB0aGlzLnJlc29sdXRpb24gPSByZXNvbHV0aW9uO1xuICAgIC8qKlxuICAgICAqIEBtZW1iZXIgez9udW1iZXJ9IGZyYW1lUmF0ZXNcbiAgICAgKiBAaW5zdGFuY2VcbiAgICAgKiBAbWVtYmVyb2YgSWNzLkNvbmZlcmVuY2UuVmlkZW9TdWJzY3JpcHRpb25Db25zdHJhaW50c1xuICAgICAqIEBkZXNjIE9ubHkgZnJhbWVSYXRlcyBsaXN0ZWQgaW4gVmlkZW9TdWJzY3JpcHRpb25DYXBhYmlsaXRpZXMgYXJlIGFsbG93ZWQuXG4gICAgICovXG4gICAgdGhpcy5mcmFtZVJhdGUgPSBmcmFtZVJhdGU7XG4gICAgLyoqXG4gICAgICogQG1lbWJlciB7P251bWJlcn0gYml0cmF0ZU11bHRpcGxpZXJzXG4gICAgICogQGluc3RhbmNlXG4gICAgICogQG1lbWJlcm9mIEljcy5Db25mZXJlbmNlLlZpZGVvU3Vic2NyaXB0aW9uQ29uc3RyYWludHNcbiAgICAgKiBAZGVzYyBPbmx5IGJpdHJhdGVNdWx0aXBsaWVycyBsaXN0ZWQgaW4gVmlkZW9TdWJzY3JpcHRpb25DYXBhYmlsaXRpZXMgYXJlIGFsbG93ZWQuXG4gICAgICovXG4gICAgdGhpcy5iaXRyYXRlTXVsdGlwbGllciA9IGJpdHJhdGVNdWx0aXBsaWVyO1xuICAgIC8qKlxuICAgICAqIEBtZW1iZXIgez9udW1iZXJ9IGtleUZyYW1lSW50ZXJ2YWxzXG4gICAgICogQGluc3RhbmNlXG4gICAgICogQG1lbWJlcm9mIEljcy5Db25mZXJlbmNlLlZpZGVvU3Vic2NyaXB0aW9uQ29uc3RyYWludHNcbiAgICAgKiBAZGVzYyBPbmx5IGtleUZyYW1lSW50ZXJ2YWxzIGxpc3RlZCBpbiBWaWRlb1N1YnNjcmlwdGlvbkNhcGFiaWxpdGllcyBhcmUgYWxsb3dlZC5cbiAgICAgKi9cbiAgICB0aGlzLmtleUZyYW1lSW50ZXJ2YWwgPSBrZXlGcmFtZUludGVydmFsO1xuICB9XG59XG5cbi8qKlxuICogQGNsYXNzIFN1YnNjcmliZU9wdGlvbnNcbiAqIEBtZW1iZXJPZiBJY3MuQ29uZmVyZW5jZVxuICogQGNsYXNzRGVzYyBTdWJzY3JpYmVPcHRpb25zIGRlZmluZXMgb3B0aW9ucyBmb3Igc3Vic2NyaWJpbmcgYSBJY3MuQmFzZS5SZW1vdGVTdHJlYW0uXG4gKi9cbmV4cG9ydCBjbGFzcyBTdWJzY3JpYmVPcHRpb25zIHtcbiAgY29uc3RydWN0b3IoYXVkaW8sIHZpZGVvKSB7XG4gICAgLyoqXG4gICAgICogQG1lbWJlciB7P0F1ZGlvU3Vic2NyaXB0aW9uQ29uc3RyYWludHN9IGF1ZGlvXG4gICAgICogQGluc3RhbmNlXG4gICAgICogQG1lbWJlcm9mIEljcy5Db25mZXJlbmNlLlN1YnNjcmliZU9wdGlvbnNcbiAgICAgKi9cbiAgICB0aGlzLmF1ZGlvID0gYXVkaW87XG4gICAgLyoqXG4gICAgICogQG1lbWJlciB7P1ZpZGVvU3Vic2NyaXB0aW9uQ29uc3RyYWludHN9IHZpZGVvXG4gICAgICogQGluc3RhbmNlXG4gICAgICogQG1lbWJlcm9mIEljcy5Db25mZXJlbmNlLlN1YnNjcmliZU9wdGlvbnNcbiAgICAgKi9cbiAgICB0aGlzLnZpZGVvID0gdmlkZW87XG4gIH1cbn1cblxuLyoqXG4gKiBAY2xhc3MgVmlkZW9TdWJzY3JpcHRpb25VcGRhdGVPcHRpb25zXG4gKiBAbWVtYmVyT2YgSWNzLkNvbmZlcmVuY2VcbiAqIEBjbGFzc0Rlc2MgVmlkZW9TdWJzY3JpcHRpb25VcGRhdGVPcHRpb25zIGRlZmluZXMgb3B0aW9ucyBmb3IgdXBkYXRpbmcgYSBzdWJzY3JpcHRpb24ncyB2aWRlbyBwYXJ0LlxuICogQGhpZGVjb25zdHJ1Y3RvclxuICovXG5leHBvcnQgY2xhc3MgVmlkZW9TdWJzY3JpcHRpb25VcGRhdGVPcHRpb25zIHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgLyoqXG4gICAgICogQG1lbWJlciB7P0ljcy5CYXNlLlJlc29sdXRpb259IHJlc29sdXRpb25cbiAgICAgKiBAaW5zdGFuY2VcbiAgICAgKiBAbWVtYmVyb2YgSWNzLkNvbmZlcmVuY2UuVmlkZW9TdWJzY3JpcHRpb25VcGRhdGVPcHRpb25zXG4gICAgICogQGRlc2MgT25seSByZXNvbHV0aW9ucyBsaXN0ZWQgaW4gVmlkZW9TdWJzY3JpcHRpb25DYXBhYmlsaXRpZXMgYXJlIGFsbG93ZWQuXG4gICAgICovXG4gICAgdGhpcy5yZXNvbHV0aW9uID0gdW5kZWZpbmVkO1xuICAgIC8qKlxuICAgICAqIEBtZW1iZXIgez9udW1iZXJ9IGZyYW1lUmF0ZXNcbiAgICAgKiBAaW5zdGFuY2VcbiAgICAgKiBAbWVtYmVyb2YgSWNzLkNvbmZlcmVuY2UuVmlkZW9TdWJzY3JpcHRpb25VcGRhdGVPcHRpb25zXG4gICAgICogQGRlc2MgT25seSBmcmFtZVJhdGVzIGxpc3RlZCBpbiBWaWRlb1N1YnNjcmlwdGlvbkNhcGFiaWxpdGllcyBhcmUgYWxsb3dlZC5cbiAgICAgKi9cbiAgICB0aGlzLmZyYW1lUmF0ZSA9IHVuZGVmaW5lZDtcbiAgICAvKipcbiAgICAgKiBAbWVtYmVyIHs/bnVtYmVyfSBiaXRyYXRlTXVsdGlwbGllcnNcbiAgICAgKiBAaW5zdGFuY2VcbiAgICAgKiBAbWVtYmVyb2YgSWNzLkNvbmZlcmVuY2UuVmlkZW9TdWJzY3JpcHRpb25VcGRhdGVPcHRpb25zXG4gICAgICogQGRlc2MgT25seSBiaXRyYXRlTXVsdGlwbGllcnMgbGlzdGVkIGluIFZpZGVvU3Vic2NyaXB0aW9uQ2FwYWJpbGl0aWVzIGFyZSBhbGxvd2VkLlxuICAgICAqL1xuICAgIHRoaXMuYml0cmF0ZU11bHRpcGxpZXJzID0gdW5kZWZpbmVkO1xuICAgIC8qKlxuICAgICAqIEBtZW1iZXIgez9udW1iZXJ9IGtleUZyYW1lSW50ZXJ2YWxzXG4gICAgICogQGluc3RhbmNlXG4gICAgICogQG1lbWJlcm9mIEljcy5Db25mZXJlbmNlLlZpZGVvU3Vic2NyaXB0aW9uVXBkYXRlT3B0aW9uc1xuICAgICAqIEBkZXNjIE9ubHkga2V5RnJhbWVJbnRlcnZhbHMgbGlzdGVkIGluIFZpZGVvU3Vic2NyaXB0aW9uQ2FwYWJpbGl0aWVzIGFyZSBhbGxvd2VkLlxuICAgICAqL1xuICAgIHRoaXMua2V5RnJhbWVJbnRlcnZhbCA9IHVuZGVmaW5lZDtcbiAgfVxufVxuXG4vKipcbiAqIEBjbGFzcyBTdWJzY3JpcHRpb25VcGRhdGVPcHRpb25zXG4gKiBAbWVtYmVyT2YgSWNzLkNvbmZlcmVuY2VcbiAqIEBjbGFzc0Rlc2MgU3Vic2NyaXB0aW9uVXBkYXRlT3B0aW9ucyBkZWZpbmVzIG9wdGlvbnMgZm9yIHVwZGF0aW5nIGEgc3Vic2NyaXB0aW9uLlxuICogQGhpZGVjb25zdHJ1Y3RvclxuICovXG5leHBvcnQgY2xhc3MgU3Vic2NyaXB0aW9uVXBkYXRlT3B0aW9ucyB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIC8qKlxuICAgICAqIEBtZW1iZXIgez9WaWRlb1N1YnNjcmlwdGlvblVwZGF0ZU9wdGlvbnN9IHZpZGVvXG4gICAgICogQGluc3RhbmNlXG4gICAgICogQG1lbWJlcm9mIEljcy5Db25mZXJlbmNlLlN1YnNjcmlwdGlvblVwZGF0ZU9wdGlvbnNcbiAgICAgKi9cbiAgICB0aGlzLnZpZGVvID0gdW5kZWZpbmVkO1xuICB9XG59XG5cbi8qKlxuICogQGNsYXNzIFN1YnNjcmlwdGlvblxuICogQG1lbWJlcm9mIEljcy5Db25mZXJlbmNlXG4gKiBAY2xhc3NEZXNjIFN1YnNjcmlwdGlvbiBpcyBhIHJlY2VpdmVyIGZvciByZWNlaXZpbmcgYSBzdHJlYW0uXG4gKiBFdmVudHM6XG4gKlxuICogfCBFdmVudCBOYW1lICAgICAgfCBBcmd1bWVudCBUeXBlICAgIHwgRmlyZWQgd2hlbiAgICAgICB8XG4gKiB8IC0tLS0tLS0tLS0tLS0tLS18IC0tLS0tLS0tLS0tLS0tLS0gfCAtLS0tLS0tLS0tLS0tLS0tIHxcbiAqIHwgZW5kZWQgICAgICAgICAgIHwgRXZlbnQgICAgICAgICAgICB8IFN1YnNjcmlwdGlvbiBpcyBlbmRlZC4gfFxuICogfCBtdXRlICAgICAgICAgICAgfCBNdXRlRXZlbnQgICAgICAgIHwgUHVibGljYXRpb24gaXMgbXV0ZWQuIFJlbW90ZSBzaWRlIHN0b3BwZWQgc2VuZGluZyBhdWRpbyBhbmQvb3IgdmlkZW8gZGF0YS4gfFxuICogfCB1bm11dGUgICAgICAgICAgfCBNdXRlRXZlbnQgICAgICAgIHwgUHVibGljYXRpb24gaXMgdW5tdXRlZC4gUmVtb3RlIHNpZGUgY29udGludWVkIHNlbmRpbmcgYXVkaW8gYW5kL29yIHZpZGVvIGRhdGEuIHxcbiAqXG4gKiBAZXh0ZW5kcyBJY3MuQmFzZS5FdmVudERpc3BhdGNoZXJcbiAqIEBoaWRlY29uc3RydWN0b3JcbiAqL1xuZXhwb3J0IGNsYXNzIFN1YnNjcmlwdGlvbiBleHRlbmRzIEV2ZW50RGlzcGF0Y2hlciB7XG4gIGNvbnN0cnVjdG9yKGlkLCBzdG9wLCBnZXRTdGF0cywgbXV0ZSwgdW5tdXRlLCBhcHBseU9wdGlvbnMpIHtcbiAgICBzdXBlcigpO1xuICAgIGlmICghaWQpIHtcbiAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ0lEIGNhbm5vdCBiZSBudWxsIG9yIHVuZGVmaW5lZC4nKTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogQG1lbWJlciB7c3RyaW5nfSBpZFxuICAgICAqIEBpbnN0YW5jZVxuICAgICAqIEBtZW1iZXJvZiBJY3MuQ29uZmVyZW5jZS5TdWJzY3JpcHRpb25cbiAgICAgKi9cbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcywgJ2lkJywge1xuICAgICAgY29uZmlndXJhYmxlOiBmYWxzZSxcbiAgICAgIHdyaXRhYmxlOiBmYWxzZSxcbiAgICAgIHZhbHVlOiBpZFxuICAgIH0pO1xuICAgIC8qKlxuICAgICAqIEBmdW5jdGlvbiBzdG9wXG4gICAgICogQGluc3RhbmNlXG4gICAgICogQGRlc2MgU3RvcCBjZXJ0YWluIHN1YnNjcmlwdGlvbi4gT25jZSBhIHN1YnNjcmlwdGlvbiBpcyBzdG9wcGVkLCBpdCBjYW5ub3QgYmUgcmVjb3ZlcmVkLlxuICAgICAqIEBtZW1iZXJvZiBJY3MuQ29uZmVyZW5jZS5TdWJzY3JpcHRpb25cbiAgICAgKiBAcmV0dXJucyB7dW5kZWZpbmVkfVxuICAgICAqL1xuICAgIHRoaXMuc3RvcCA9IHN0b3A7XG4gICAgLyoqXG4gICAgICogQGZ1bmN0aW9uIGdldFN0YXRzXG4gICAgICogQGluc3RhbmNlXG4gICAgICogQGRlc2MgR2V0IHN0YXRzIG9mIHVuZGVybHlpbmcgUGVlckNvbm5lY3Rpb24uXG4gICAgICogQG1lbWJlcm9mIEljcy5Db25mZXJlbmNlLlN1YnNjcmlwdGlvblxuICAgICAqIEByZXR1cm5zIHtQcm9taXNlPFJUQ1N0YXRzUmVwb3J0LCBFcnJvcj59XG4gICAgICovXG4gICAgdGhpcy5nZXRTdGF0cyA9IGdldFN0YXRzO1xuICAgIC8qKlxuICAgICAqIEBmdW5jdGlvbiBtdXRlXG4gICAgICogQGluc3RhbmNlXG4gICAgICogQGRlc2MgU3RvcCByZWV2aW5nIGRhdGEgZnJvbSByZW1vdGUgZW5kcG9pbnQuXG4gICAgICogQG1lbWJlcm9mIEljcy5Db25mZXJlbmNlLlN1YnNjcmlwdGlvblxuICAgICAqIEBwYXJhbSB7SWNzLkJhc2UuVHJhY2tLaW5kIH0ga2luZCBLaW5kIG9mIHRyYWNrcyB0byBiZSBtdXRlZC5cbiAgICAgKiBAcmV0dXJucyB7UHJvbWlzZTx1bmRlZmluZWQsIEVycm9yPn1cbiAgICAgKi9cbiAgICB0aGlzLm11dGUgPSBtdXRlO1xuICAgIC8qKlxuICAgICAqIEBmdW5jdGlvbiB1bm11dGVcbiAgICAgKiBAaW5zdGFuY2VcbiAgICAgKiBAZGVzYyBDb250aW51ZSByZWV2aW5nIGRhdGEgZnJvbSByZW1vdGUgZW5kcG9pbnQuXG4gICAgICogQG1lbWJlcm9mIEljcy5Db25mZXJlbmNlLlN1YnNjcmlwdGlvblxuICAgICAqIEBwYXJhbSB7SWNzLkJhc2UuVHJhY2tLaW5kIH0ga2luZCBLaW5kIG9mIHRyYWNrcyB0byBiZSB1bm11dGVkLlxuICAgICAqIEByZXR1cm5zIHtQcm9taXNlPHVuZGVmaW5lZCwgRXJyb3I+fVxuICAgICAqL1xuICAgIHRoaXMudW5tdXRlID0gdW5tdXRlO1xuICAgIC8qKlxuICAgICAqIEBmdW5jdGlvbiBhcHBseU9wdGlvbnNcbiAgICAgKiBAaW5zdGFuY2VcbiAgICAgKiBAZGVzYyBVcGRhdGUgc3Vic2NyaXB0aW9uIHdpdGggZ2l2ZW4gb3B0aW9ucy5cbiAgICAgKiBAbWVtYmVyb2YgSWNzLkNvbmZlcmVuY2UuU3Vic2NyaXB0aW9uXG4gICAgICogQHBhcmFtIHtJY3MuQ29uZmVyZW5jZS5TdWJzY3JpcHRpb25VcGRhdGVPcHRpb25zIH0gb3B0aW9ucyBTdWJzY3JpcHRpb24gdXBkYXRlIG9wdGlvbnMuXG4gICAgICogQHJldHVybnMge1Byb21pc2U8dW5kZWZpbmVkLCBFcnJvcj59XG4gICAgICovXG4gICAgdGhpcy5hcHBseU9wdGlvbnMgPSBhcHBseU9wdGlvbnM7XG4gIH1cbn1cbiIsImltcG9ydCAqIGFzIGJhc2UgZnJvbSAnLi9iYXNlL2V4cG9ydC5qcydcbmltcG9ydCAqIGFzIHAycCBmcm9tICcuL3AycC9leHBvcnQuanMnXG5pbXBvcnQgKiBhcyBjb25mZXJlbmNlIGZyb20gJy4vY29uZmVyZW5jZS9leHBvcnQuanMnXG5cbi8qKlxuICogQmFzZSBvYmplY3RzIGZvciBib3RoIFAyUCBhbmQgY29uZmVyZW5jZS5cbiAqIEBuYW1lc3BhY2UgSWNzLkJhc2VcbiAqL1xuZXhwb3J0IGNvbnN0IEJhc2UgPSBiYXNlO1xuXG4vKipcbiAqIFAyUCBXZWJSVEMgY29ubmVjdGlvbnMuXG4gKiBAbmFtZXNwYWNlIEljcy5QMlBcbiAqL1xuZXhwb3J0IGNvbnN0IFAyUCA9IHAycDtcblxuLyoqXG4gKiBXZWJSVEMgY29ubmVjdGlvbnMgd2l0aCBjb25mZXJlbmNlIHNlcnZlci5cbiAqIEBuYW1lc3BhY2UgSWNzLkNvbmZlcmVuY2VcbiAqL1xuZXhwb3J0IGNvbnN0IENvbmZlcmVuY2UgPSBjb25mZXJlbmNlO1xuIiwiZXhwb3J0IGNvbnN0IGVycm9ycyA9IHtcbiAgLy8gMjEwMC0yOTk5IGZvciBQMlAgZXJyb3JzXG4gIC8vIDIxMDAtMjE5OSBmb3IgY29ubmVjdGlvbiBlcnJvcnNcbiAgLy8gMjEwMC0yMTA5IGZvciBzZXJ2ZXIgZXJyb3JzXG4gIFAyUF9DT05OX1NFUlZFUl9VTktOT1dOOiB7XG4gICAgY29kZTogMjEwMCxcbiAgICBtZXNzYWdlOiAnU2VydmVyIHVua25vd24gZXJyb3IuJ1xuICB9LFxuICBQMlBfQ09OTl9TRVJWRVJfVU5BVkFJTEFCTEU6IHtcbiAgICBjb2RlOiAyMTAxLFxuICAgIG1lc3NhZ2U6ICdTZXJ2ZXIgaXMgdW5hdmFsaWFibGUuJ1xuICB9LFxuICBQMlBfQ09OTl9TRVJWRVJfQlVTWToge1xuICAgIGNvZGU6IDIxMDIsXG4gICAgbWVzc2FnZTogJ1NlcnZlciBpcyB0b28gYnVzeS4nXG4gIH0sXG4gIFAyUF9DT05OX1NFUlZFUl9OT1RfU1VQUE9SVEVEOiB7XG4gICAgY29kZTogMjEwMyxcbiAgICBtZXNzYWdlOiAnTWV0aG9kIGhhcyBub3QgYmVlbiBzdXBwb3J0ZWQgYnkgc2VydmVyLidcbiAgfSxcbiAgLy8gMjExMC0yMTE5IGZvciBjbGllbnQgZXJyb3JzXG4gIFAyUF9DT05OX0NMSUVOVF9VTktOT1dOOiB7XG4gICAgY29kZTogMjExMCxcbiAgICBtZXNzYWdlOiAnQ2xpZW50IHVua25vd24gZXJyb3IuJ1xuICB9LFxuICBQMlBfQ09OTl9DTElFTlRfTk9UX0lOSVRJQUxJWkVEOiB7XG4gICAgY29kZTogMjExMSxcbiAgICBtZXNzYWdlOiAnQ29ubmVjdGlvbiBpcyBub3QgaW5pdGlhbGl6ZWQuJ1xuICB9LFxuICAvLyAyMTIwLTIxMjkgZm9yIGF1dGhlbnRpY2F0aW9uIGVycm9yc1xuICBQMlBfQ09OTl9BVVRIX1VOS05PV046IHtcbiAgICBjb2RlOiAyMTIwLFxuICAgIG1lc3NhZ2U6ICdBdXRoZW50aWNhdGlvbiB1bmtub3duIGVycm9yLidcbiAgfSxcbiAgUDJQX0NPTk5fQVVUSF9GQUlMRUQ6IHtcbiAgICBjb2RlOiAyMTIxLFxuICAgIG1lc3NhZ2U6ICdXcm9uZyB1c2VybmFtZSBvciB0b2tlbi4nXG4gIH0sXG4gIC8vIDIyMDAtMjI5OSBmb3IgbWVzc2FnZSB0cmFuc3BvcnQgZXJyb3JzXG4gIFAyUF9NRVNTQUdJTkdfVEFSR0VUX1VOUkVBQ0hBQkxFOiB7XG4gICAgY29kZTogMjIwMSxcbiAgICBtZXNzYWdlOiAnUmVtb3RlIHVzZXIgY2Fubm90IGJlIHJlYWNoZWQuJ1xuICB9LFxuICAvLyAyMzAxLTIzOTkgZm9yIGNoYXQgcm9vbSBlcnJvcnNcbiAgLy8gMjQwMS0yNDk5IGZvciBjbGllbnQgZXJyb3JzXG4gIFAyUF9DTElFTlRfVU5LTk9XTjoge1xuICAgIGNvZGU6IDI0MDAsXG4gICAgbWVzc2FnZTogJ1Vua25vd24gZXJyb3JzLidcbiAgfSxcbiAgUDJQX0NMSUVOVF9VTlNVUFBPUlRFRF9NRVRIT0Q6IHtcbiAgICBjb2RlOiAyNDAxLFxuICAgIG1lc3NhZ2U6ICdUaGlzIG1ldGhvZCBpcyB1bnN1cHBvcnRlZCBpbiBjdXJyZW50IGJyb3dzZXIuJ1xuICB9LFxuICBQMlBfQ0xJRU5UX0lMTEVHQUxfQVJHVU1FTlQ6IHtcbiAgICBjb2RlOiAyNDAyLFxuICAgIG1lc3NhZ2U6ICdJbGxlZ2FsIGFyZ3VtZW50LidcbiAgfSxcbiAgUDJQX0NMSUVOVF9JTlZBTElEX1NUQVRFOiB7XG4gICAgY29kZTogMjQwMyxcbiAgICBtZXNzYWdlOiAnSW52YWxpZCBwZWVyIHN0YXRlLidcbiAgfSxcbiAgUDJQX0NMSUVOVF9OT1RfQUxMT1dFRDoge1xuICAgIGNvZGU6IDI0MDQsXG4gICAgbWVzc2FnZTogJ1JlbW90ZSB1c2VyIGlzIG5vdCBhbGxvd2VkLidcbiAgfSxcbiAgLy8gMjUwMS0yNTk5IGZvciBXZWJSVEMgZXJyb3MuXG4gIFAyUF9XRUJSVENfVU5LTk9XTjp7XG4gICAgY29kZTogMjUwMCxcbiAgICBtZXNzYWdlOiAnV2ViUlRDIGVycm9yLidcbiAgfSxcbiAgUDJQX1dFQlJUQ19TRFA6e1xuICAgIGNvZGU6MjUwMixcbiAgICBtZXNzYWdlOiAnU0RQIGVycm9yLidcbiAgfVxufTtcblxuZXhwb3J0IGZ1bmN0aW9uIGdldEVycm9yQnlDb2RlKGVycm9yQ29kZSkge1xuICBjb25zdCBjb2RlRXJyb3JNYXAgPSB7XG4gICAgMjEwMDogZXJyb3JzLlAyUF9DT05OX1NFUlZFUl9VTktOT1dOLFxuICAgIDIxMDE6IGVycm9ycy5QMlBfQ09OTl9TRVJWRVJfVU5BVkFJTEFCTEUsXG4gICAgMjEwMjogZXJyb3JzLlAyUF9DT05OX1NFUlZFUl9CVVNZLFxuICAgIDIxMDM6IGVycm9ycy5QMlBfQ09OTl9TRVJWRVJfTk9UX1NVUFBPUlRFRCxcbiAgICAyMTEwOiBlcnJvcnMuUDJQX0NPTk5fQ0xJRU5UX1VOS05PV04sXG4gICAgMjExMTogZXJyb3JzLlAyUF9DT05OX0NMSUVOVF9OT1RfSU5JVElBTElaRUQsXG4gICAgMjEyMDogZXJyb3JzLlAyUF9DT05OX0FVVEhfVU5LTk9XTixcbiAgICAyMTIxOiBlcnJvcnMuUDJQX0NPTk5fQVVUSF9GQUlMRUQsXG4gICAgMjIwMTogZXJyb3JzLlAyUF9NRVNTQUdJTkdfVEFSR0VUX1VOUkVBQ0hBQkxFLFxuICAgIDI0MDA6IGVycm9ycy5QMlBfQ0xJRU5UX1VOS05PV04sXG4gICAgMjQwMTogZXJyb3JzLlAyUF9DTElFTlRfVU5TVVBQT1JURURfTUVUSE9ELFxuICAgIDI0MDI6IGVycm9ycy5QMlBfQ0xJRU5UX0lMTEVHQUxfQVJHVU1FTlQsXG4gICAgMjQwMzogZXJyb3JzLlAyUF9DTElFTlRfSU5WQUxJRF9TVEFURSxcbiAgICAyNDA0OiBlcnJvcnMuUDJQX0NMSUVOVF9OT1RfQUxMT1dFRCxcbiAgICAyNTAwOiBlcnJvcnMuUDJQX1dFQlJUQ19VTktOT1dOLFxuICAgIDI1MDE6IGVycm9ycy5QMlBfV0VCUlRDX1NEUFxuICB9O1xuICByZXR1cm4gY29kZUVycm9yTWFwW2Vycm9yQ29kZV07XG59XG5leHBvcnQgY2xhc3MgUDJQRXJyb3IgZXh0ZW5kcyBFcnJvciB7XG4gIGNvbnN0cnVjdG9yKGVycm9yLCBtZXNzYWdlKSB7XG4gICAgc3VwZXIobWVzc2FnZSk7XG4gICAgaWYgKHR5cGVvZiBlcnJvciA9PT0gJ251bWJlcicpIHtcbiAgICAgIHRoaXMuY29kZSA9IGVycm9yO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmNvZGUgPSBlcnJvci5jb2RlO1xuICAgIH1cbiAgfVxufVxuIiwiLy8gQ29weXJpZ2h0IMKpIDIwMTcgSW50ZWwgQ29ycG9yYXRpb24uIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG5cbmV4cG9ydCB7ZGVmYXVsdCBhcyBQMlBDbGllbnR9IGZyb20gJy4vcDJwY2xpZW50LmpzJ1xuZXhwb3J0IHtQMlBFcnJvcn0gZnJvbSAnLi9lcnJvci5qcydcbiIsIi8vIENvcHlyaWdodCDCqSAyMDE3IEludGVsIENvcnBvcmF0aW9uLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuJ3VzZSBzdHJpY3QnO1xuaW1wb3J0IExvZ2dlciBmcm9tICcuLi9iYXNlL2xvZ2dlci5qcyc7XG5pbXBvcnQge0V2ZW50RGlzcGF0Y2hlciwgSWNzRXZlbnR9IGZyb20gJy4uL2Jhc2UvZXZlbnQuanMnO1xuaW1wb3J0ICogYXMgVXRpbHMgZnJvbSAnLi4vYmFzZS91dGlscy5qcyc7XG5pbXBvcnQgKiBhcyBFcnJvck1vZHVsZSBmcm9tICcuL2Vycm9yLmpzJztcbmltcG9ydCBQMlBQZWVyQ29ubmVjdGlvbkNoYW5uZWwgZnJvbSAnLi9wZWVyY29ubmVjdGlvbi1jaGFubmVsLmpzJztcbmltcG9ydCAqIGFzIFN0cmVhbU1vZHVsZSBmcm9tICcuLi9iYXNlL3N0cmVhbS5qcyc7XG5cbmNvbnN0IENvbm5lY3Rpb25TdGF0ZSA9IHtcbiAgUkVBRFk6IDEsXG4gIENPTk5FQ1RJTkc6IDIsXG4gIENPTk5FQ1RFRDogM1xufTtcblxuY29uc3QgcGNEaXNjb25uZWN0VGltZW91dCA9IDE1MDAwOyAvLyBDbG9zZSBwZWVyY29ubmVjdGlvbiBhZnRlciBkaXNjb25uZWN0IDE1cy5sZXQgaXNDb25uZWN0ZWRUb1NpZ25hbGluZ0NoYW5uZWwgPSBmYWxzZTtcbmNvbnN0IG9mZmVyT3B0aW9ucyA9IHtcbiAgJ29mZmVyVG9SZWNlaXZlQXVkaW8nOiB0cnVlLFxuICAnb2ZmZXJUb1JlY2VpdmVWaWRlbyc6IHRydWVcbn07XG5jb25zdCBzeXNJbmZvID0gVXRpbHMuc3lzSW5mbygpO1xuY29uc3Qgc3VwcG9ydHNQbGFuQiA9IG5hdmlnYXRvci5tb3pHZXRVc2VyTWVkaWEgPyBmYWxzZSA6IHRydWU7XG5jb25zdCBzdXBwb3J0c1VuaWZpZWRQbGFuID0gbmF2aWdhdG9yLm1vekdldFVzZXJNZWRpYSA/IHRydWUgOiBmYWxzZTtcbi8qKlxuICogQGZ1bmN0aW9uIGlzQXJyYXlcbiAqIEBkZXNjIFRlc3QgaWYgYW4gb2JqZWN0IGlzIGFuIGFycmF5LlxuICogQHJldHVybiB7Ym9vbGVhbn0gREVTQ1JJUFRJT05cbiAqIEBwcml2YXRlXG4gKi9cbmZ1bmN0aW9uIGlzQXJyYXkob2JqKSB7XG4gIHJldHVybiAoT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKG9iaikgPT09ICdbb2JqZWN0IEFycmF5XScpO1xufVxuLypcbiAqIFJldHVybiBuZWdhdGl2ZSB2YWx1ZSBpZiBpZDE8aWQyLCBwb3NpdGl2ZSB2YWx1ZSBpZiBpZDE+aWQyXG4gKi9cbnZhciBjb21wYXJlSUQgPSBmdW5jdGlvbihpZDEsIGlkMikge1xuICByZXR1cm4gaWQxLmxvY2FsZUNvbXBhcmUoaWQyKTtcbn07XG4vLyBJZiB0YXJnZXRJZCBpcyBwZWVySWQsIHRoZW4gcmV0dXJuIHRhcmdldElkLlxudmFyIGdldFBlZXJJZCA9IGZ1bmN0aW9uKHRhcmdldElkKSB7XG4gIHJldHVybiB0YXJnZXRJZDtcbn07XG52YXIgY2hhbmdlTmVnb3RpYXRpb25TdGF0ZSA9IGZ1bmN0aW9uKHBlZXIsIHN0YXRlKSB7XG4gIHBlZXIubmVnb3RpYXRpb25TdGF0ZSA9IHN0YXRlO1xufTtcbi8vIERvIHN0b3AgY2hhdCBsb2NhbGx5LlxudmFyIHN0b3BDaGF0TG9jYWxseSA9IGZ1bmN0aW9uKHBlZXIsIG9yaWdpbmF0b3JJZCkge1xuICBpZiAocGVlci5zdGF0ZSA9PT0gUGVlclN0YXRlLkNPTk5FQ1RFRCB8fCBwZWVyLnN0YXRlID09PSBQZWVyU3RhdGUuQ09OTkVDVElORykge1xuICAgIGlmIChwZWVyLnNlbmREYXRhQ2hhbm5lbCkge1xuICAgICAgcGVlci5zZW5kRGF0YUNoYW5uZWwuY2xvc2UoKTtcbiAgICB9XG4gICAgaWYgKHBlZXIucmVjZWl2ZURhdGFDaGFubmVsKSB7XG4gICAgICBwZWVyLnJlY2VpdmVEYXRhQ2hhbm5lbC5jbG9zZSgpO1xuICAgIH1cbiAgICBpZiAocGVlci5jb25uZWN0aW9uICYmIHBlZXIuY29ubmVjdGlvbi5pY2VDb25uZWN0aW9uU3RhdGUgIT09ICdjbG9zZWQnKSB7XG4gICAgICBwZWVyLmNvbm5lY3Rpb24uY2xvc2UoKTtcbiAgICB9XG4gICAgaWYgKHBlZXIuc3RhdGUgIT09IFBlZXJTdGF0ZS5SRUFEWSkge1xuICAgICAgcGVlci5zdGF0ZSA9IFBlZXJTdGF0ZS5SRUFEWTtcbiAgICAgIHRoYXQuZGlzcGF0Y2hFdmVudChuZXcgV29vZ2Vlbi5DaGF0RXZlbnQoe1xuICAgICAgICB0eXBlOiAnY2hhdC1zdG9wcGVkJyxcbiAgICAgICAgcGVlcklkOiBwZWVyLmlkLFxuICAgICAgICBzZW5kZXJJZDogb3JpZ2luYXRvcklkXG4gICAgICB9KSk7XG4gICAgfVxuICAgIC8vIFVuYmluZCBldmVudHMgZm9yIHRoZSBwYywgc28gdGhlIG9sZCBwYyB3aWxsIG5vdCBpbXBhY3QgbmV3IHBlZXJjb25uZWN0aW9ucyBjcmVhdGVkIGZvciB0aGUgc2FtZSB0YXJnZXQgbGF0ZXIuXG4gICAgdW5iaW5kRXZldHNUb1BlZXJDb25uZWN0aW9uKHBlZXIuY29ubmVjdGlvbik7XG4gIH1cbn07XG5cbi8qKlxuICogQGNsYXNzIFAyUENsaWVudENvbmZpZ3VyYXRpb25cbiAqIEBjbGFzc0Rlc2MgQ29uZmlndXJhdGlvbiBmb3IgUDJQQ2xpZW50LlxuICogQG1lbWJlck9mIEljcy5QMlBcbiAqIEBoaWRlY29uc3RydWN0b3JcbiAqL1xuY29uc3QgUDJQQ2xpZW50Q29uZmlndXJhdGlvbiA9IGZ1bmN0aW9uKCkge1xuICAvKipcbiAgICogQG1lbWJlciB7P0FycmF5PEljcy5CYXNlLkF1ZGlvRW5jb2RpbmdQYXJhbWV0ZXJzPn0gYXVkaW9FbmNvZGluZ1xuICAgKiBAaW5zdGFuY2VcbiAgICogQGRlc2MgRW5jb2RpbmcgcGFyYW1ldGVycyBmb3IgcHVibGlzaGluZyBhdWRpbyB0cmFja3MuXG4gICAqIEBtZW1iZXJvZiBJY3MuUDJQLlAyUENsaWVudENvbmZpZ3VyYXRpb25cbiAgICovXG4gIHRoaXMuYXVkaW9FbmNvZGluZyA9IHVuZGVmaW5lZDtcbiAgLyoqXG4gICAqIEBtZW1iZXIgez9BcnJheTxJY3MuQmFzZS5WaWRlb0VuY29kaW5nUGFyYW1ldGVycz59IHZpZGVvRW5jb2RpbmdcbiAgICogQGluc3RhbmNlXG4gICAqIEBkZXNjIEVuY29kaW5nIHBhcmFtZXRlcnMgZm9yIHB1Ymxpc2hpbmcgdmlkZW8gdHJhY2tzLlxuICAgKiBAbWVtYmVyb2YgSWNzLlAyUC5QMlBDbGllbnRDb25maWd1cmF0aW9uXG4gICAqL1xuICB0aGlzLnZpZGVvRW5jb2RpbmcgPSB1bmRlZmluZWQ7XG4gIC8qKlxuICAgKiBAbWVtYmVyIHs/UlRDQ29uZmlndXJhdGlvbn0gcnRjQ29uZmlndXJhdGlvblxuICAgKiBAaW5zdGFuY2VcbiAgICogQG1lbWJlcm9mIEljcy5QMlAuUDJQQ2xpZW50Q29uZmlndXJhdGlvblxuICAgKiBAZGVzYyBJdCB3aWxsIGJlIHVzZWQgZm9yIGNyZWF0aW5nIFBlZXJDb25uZWN0aW9uLlxuICAgKiBAc2VlIHtAbGluayBodHRwczovL3d3dy53My5vcmcvVFIvd2VicnRjLyNydGNjb25maWd1cmF0aW9uLWRpY3Rpb25hcnl8UlRDQ29uZmlndXJhdGlvbiBEaWN0aW9uYXJ5IG9mIFdlYlJUQyAxLjB9LlxuICAgKiBAZXhhbXBsZVxuICAgKiAvLyBGb2xsb3dpbmcgb2JqZWN0IGNhbiBiZSBzZXQgdG8gcDJwQ2xpZW50Q29uZmlndXJhdGlvbi5ydGNDb25maWd1cmF0aW9uLlxuICAgKiB7XG4gICAqICAgaWNlU2VydmVyczogW3tcbiAgICogICAgICB1cmxzOiBcInN0dW46ZXhhbXBsZS5jb206MzQ3OFwiXG4gICAqICAgfSwge1xuICAgKiAgICAgdXJsczogW1xuICAgKiAgICAgICBcInR1cm46ZXhhbXBsZS5jb206MzQ3OD90cmFuc3BvcnQ9dWRwXCIsXG4gICAqICAgICAgIFwidHVybjpleGFtcGxlLmNvbTozNDc4P3RyYW5zcG9ydD10Y3BcIlxuICAgKiAgICAgXSxcbiAgICogICAgICBjcmVkZW50aWFsOiBcInBhc3N3b3JkXCIsXG4gICAqICAgICAgdXNlcm5hbWU6IFwidXNlcm5hbWVcIlxuICAgKiAgIH1cbiAgICogfVxuICAgKi9cbiAgdGhpcy5ydGNDb25maWd1cmF0aW9uID0gdW5kZWZpbmVkO1xufTtcblxuLyoqXG4gKiBAY2xhc3MgUDJQQ2xpZW50XG4gKiBAY2xhc3NEZXNjIFRoZSBQMlBDbGllbnQgaGFuZGxlcyBQZWVyQ29ubmVjdGlvbnMgYmV0d2VlbiBkaWZmZXJlbnQgY2xpZW50cy5cbiAqIEV2ZW50czpcbiAqXG4gKiB8IEV2ZW50IE5hbWUgICAgICAgICAgICB8IEFyZ3VtZW50IFR5cGUgICAgfCBGaXJlZCB3aGVuICAgICAgIHxcbiAqIHwgLS0tLS0tLS0tLS0tLS0tLS0tLS0tIHwgLS0tLS0tLS0tLS0tLS0tLSB8IC0tLS0tLS0tLS0tLS0tLS0gfFxuICogfCBzdHJlYW1hZGRlZCAgICAgICAgICAgfCBTdHJlYW1FdmVudCAgICAgIHwgQSBuZXcgc3RyZWFtIGlzIHNlbnQgZnJvbSByZW1vdGUgZW5kcG9pbnQuIHxcbiAqIHwgbWVzc2FnZXJlY2VpdmVkICAgICAgIHwgTWVzc2FnZUV2ZW50ICAgICB8IEEgbmV3IG1lc3NhZ2UgaXMgcmVjZWl2ZWQuIHxcbiAqIHwgc2VydmVyZGlzY29ubmVjdGVkICAgIHwgSWNzRXZlbnQgICAgICAgICB8IERpc2Nvbm5lY3RlZCBmcm9tIHNpZ25hbGluZyBzZXJ2ZXIuIHxcbiAqXG4gKiBAbWVtYmVyb2YgSWNzLlAyUFxuICogQGV4dGVuZHMgSWNzLkJhc2UuRXZlbnREaXNwYXRjaGVyXG4gKiBAY29uc3RydWN0b3JcbiAqIEBwYXJhbSB7P0ljcy5QMlAuUDJQQ2xpZW50Q29uZmlndXJhdGlvbiB9IGNvbmZpZyBDb25maWd1cmF0aW9uIGZvciBQMlBDbGllbnQuXG4gKi9cbmNvbnN0IFAyUENsaWVudCA9IGZ1bmN0aW9uKGNvbmZpZ3VyYXRpb24sIHNpZ25hbGluZ0NoYW5uZWwpIHtcbiAgT2JqZWN0LnNldFByb3RvdHlwZU9mKHRoaXMsIG5ldyBFdmVudERpc3BhdGNoZXIoKSk7XG4gIGNvbnN0IGNvbmZpZyA9IGNvbmZpZ3VyYXRpb247XG4gIGNvbnN0IHNpZ25hbGluZyA9IHNpZ25hbGluZ0NoYW5uZWw7XG4gIGNvbnN0IGNoYW5uZWxzID0gbmV3IE1hcCgpOyAvLyBNYXAgb2YgUGVlckNvbm5lY3Rpb25DaGFubmVscy5cbiAgY29uc3Qgc2VsZj10aGlzO1xuICBsZXQgc3RhdGUgPSBDb25uZWN0aW9uU3RhdGUuUkVBRFk7XG4gIGxldCBteUlkO1xuXG4gIHNpZ25hbGluZy5vbk1lc3NhZ2UgPSBmdW5jdGlvbihvcmlnaW4sIG1lc3NhZ2UpIHtcbiAgICBMb2dnZXIuZGVidWcoJ1JlY2VpdmVkIHNpZ25hbGluZyBtZXNzYWdlIGZyb20gJyArIG9yaWdpbiArICc6ICcgKyBtZXNzYWdlKTtcbiAgICBjb25zdCBkYXRhID0gSlNPTi5wYXJzZShtZXNzYWdlKTtcbiAgICBpZiAoZGF0YS50eXBlID09PSAnY2hhdC1jbG9zZWQnICYmICFjaGFubmVscy5oYXMob3JpZ2luKSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBpZiAoc2VsZi5hbGxvd2VkUmVtb3RlSWRzLmluZGV4T2Yob3JpZ2luKSA+PSAwKSB7XG4gICAgICBnZXRPckNyZWF0ZUNoYW5uZWwob3JpZ2luKS5vbk1lc3NhZ2UoZGF0YSk7XG4gICAgfSBlbHNlIGlmIChkYXRhLnR5cGUgIT09ICdjaGF0LWRlbmllZCcpIHtcbiAgICAgIHNlbmRTaWduYWxpbmdNZXNzYWdlKG9yaWdpbiwgJ2NoYXQtZGVuaWVkJyk7XG4gICAgfVxuICB9O1xuXG4gIHNpZ25hbGluZy5vblNlcnZlckRpc2Nvbm5lY3RlZCA9IGZ1bmN0aW9uKCkge1xuICAgIHN0YXRlID0gQ29ubmVjdGlvblN0YXRlLlJFQURZO1xuICAgIHNlbGYuZGlzcGF0Y2hFdmVudChuZXcgSWNzRXZlbnQoJ3NlcnZlcmRpc2Nvbm5lY3RlZCcpKTtcbiAgfTtcblxuICAvKipcbiAgICogQG1lbWJlciB7YXJyYXl9IGFsbG93ZWRSZW1vdGVJZHNcbiAgICogQG1lbWJlcm9mIEljcy5QMlAuUDJQQ2xpZW50XG4gICAqIEBpbnN0YW5jZVxuICAgKiBAZGVzYyBPbmx5IGFsbG93ZWQgcmVtb3RlIGVuZHBvaW50IElEcyBhcmUgYWJsZSB0byBwdWJsaXNoIHN0cmVhbSBvciBzZW5kIG1lc3NhZ2UgdG8gY3VycmVudCBlbmRwb2ludC4gUmVtb3ZpbmcgYW4gSUQgZnJvbSBhbGxvd2VkUmVtb3RlSWRzIGRvZXMgc3RvcCBleGlzdGluZyBjb25uZWN0aW9uIHdpdGggY2VydGFpbiBlbmRwb2ludC4gUGxlYXNlIGNhbGwgc3RvcCB0byBzdG9wIHRoZSBQZWVyQ29ubmVjdGlvbi5cbiAgICovXG4gIHRoaXMuYWxsb3dlZFJlbW90ZUlkcz1bXTtcblxuICAvKipcbiAgICogQGZ1bmN0aW9uIGNvbm5lY3RcbiAgICogQGluc3RhbmNlXG4gICAqIEBkZXNjIENvbm5lY3QgdG8gc2lnbmFsaW5nIHNlcnZlci4gU2luY2Ugc2lnbmFsaW5nIGNhbiBiZSBjdXN0b21pemVkLCB0aGlzIG1ldGhvZCBkb2VzIG5vdCBkZWZpbmUgaG93IGEgdG9rZW4gbG9va3MgbGlrZS4gU0RLIHBhc3NlcyB0b2tlbiB0byBzaWduYWxpbmcgY2hhbm5lbCB3aXRob3V0IGNoYW5nZXMuXG4gICAqIEBtZW1iZXJvZiBJY3MuUDJQLlAyUENsaWVudFxuICAgKiBAcmV0dXJucyB7UHJvbWlzZTxvYmplY3QsIEVycm9yPn0gSXQgcmV0dXJucyBhIHByb21pc2UgcmVzb2x2ZWQgd2l0aCBhbiBvYmplY3QgcmV0dXJuZWQgYnkgc2lnbmFsaW5nIGNoYW5uZWwgb25jZSBzaWduYWxpbmcgY2hhbm5lbCByZXBvcnRzIGNvbm5lY3Rpb24gaGFzIGJlZW4gZXN0YWJsaXNoZWQuXG4gICAqL1xuICB0aGlzLmNvbm5lY3QgPSBmdW5jdGlvbih0b2tlbikge1xuICAgIGlmIChzdGF0ZSA9PT0gQ29ubmVjdGlvblN0YXRlLlJFQURZKSB7XG4gICAgICBzdGF0ZSA9IENvbm5lY3Rpb25TdGF0ZS5DT05ORUNUSU5HO1xuICAgIH0gZWxzZSB7XG4gICAgICBMb2dnZXIud2FybmluZygnSW52YWxpZCBjb25uZWN0aW9uIHN0YXRlOiAnICsgc3RhdGUpO1xuICAgICAgcmV0dXJuIFByb21pc2UucmVqZWN0KG5ldyBFcnJvck1vZHVsZS5QMlBFcnJvcihFcnJvck1vZHVsZS5lcnJvcnMuUDJQX0NMSUVOVF9JTlZBTElEX1NUQVRFKSk7XG4gICAgfVxuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICBzaWduYWxpbmcuY29ubmVjdCh0b2tlbikudGhlbigoaWQpID0+IHtcbiAgICAgICAgbXlJZCA9IGlkO1xuICAgICAgICBzdGF0ZSA9IENvbm5lY3Rpb25TdGF0ZS5DT05ORUNURUQ7XG4gICAgICAgIHJlc29sdmUobXlJZCk7XG4gICAgICB9LCAoZXJyQ29kZSkgPT4ge1xuICAgICAgICByZWplY3QobmV3IEVycm9yTW9kdWxlLlAyUEVycm9yKEVycm9yTW9kdWxlLmdldEVycm9yQnlDb2RlKFxuICAgICAgICAgIGVyckNvZGUpKSk7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfTtcblxuICAvKipcbiAgICogQGZ1bmN0aW9uIGRpc2Nvbm5lY3RcbiAgICogQGluc3RhbmNlXG4gICAqIEBkZXNjIERpc2Nvbm5lY3QgZnJvbSB0aGUgc2lnbmFsaW5nIGNoYW5uZWwuIEl0IHN0b3BzIGFsbCBleGlzdGluZyBzZXNzaW9ucyB3aXRoIHJlbW90ZSBlbmRwb2ludHMuXG4gICAqIEBtZW1iZXJvZiBJY3MuUDJQLlAyUENsaWVudFxuICAgKiBAcmV0dXJucyB7UHJvbWlzZTx1bmRlZmluZWQsIEVycm9yPn1cbiAgICovXG4gIHRoaXMuZGlzY29ubmVjdCA9IGZ1bmN0aW9uKCkge1xuICAgIGlmIChzdGF0ZSA9PSBDb25uZWN0aW9uU3RhdGUuUkVBRFkpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgY2hhbm5lbHMuZm9yRWFjaCgoY2hhbm5lbCk9PntcbiAgICAgIGNoYW5uZWwuc3RvcCgpO1xuICAgIH0pO1xuICAgIGNoYW5uZWxzLmNsZWFyKCk7XG4gICAgc2lnbmFsaW5nLmRpc2Nvbm5lY3QoKTtcbiAgfTtcblxuICAvKipcbiAgICogQGZ1bmN0aW9uIHB1Ymxpc2hcbiAgICogQGluc3RhbmNlXG4gICAqIEBkZXNjIFB1Ymxpc2ggYSBzdHJlYW0gdG8gYSByZW1vdGUgZW5kcG9pbnQuXG4gICAqIEBtZW1iZXJvZiBJY3MuUDJQLlAyUENsaWVudFxuICAgKiBAcGFyYW0ge3N0cmluZ30gcmVtb3RlSWQgUmVtb3RlIGVuZHBvaW50J3MgSUQuXG4gICAqIEBwYXJhbSB7TG9jYWxTdHJlYW19IHN0cmVhbSBBIExvY2FsU3RyZWFtIHRvIGJlIHB1Ymxpc2hlZC5cbiAgICogQHJldHVybnMge1Byb21pc2U8UHVibGljYXRpb24sIEVycm9yPn0gQSBwcm9taXNlZCByZXNvbHZlZCB3aGVuIHJlbW90ZSBzaWRlIHJlY2VpdmVkIHRoZSBjZXJ0YWluIHN0cmVhbS4gSG93ZXZlciwgcmVtb3RlIGVuZHBvaW50IG1heSBub3QgZGlzcGxheSB0aGlzIHN0cmVhbSwgb3IgaWdub3JlIGl0LlxuICAgKi9cbiAgdGhpcy5wdWJsaXNoID0gZnVuY3Rpb24ocmVtb3RlSWQsIHN0cmVhbSkge1xuICAgIGlmIChzdGF0ZSAhPT0gQ29ubmVjdGlvblN0YXRlLkNPTk5FQ1RFRCkge1xuICAgICAgcmV0dXJuIFByb21pc2UucmVqZWN0KG5ldyBFcnJvck1vZHVsZS5QMlBFcnJvcihFcnJvck1vZHVsZS5lcnJvcnMuUDJQX0NMSUVOVF9JTlZBTElEX1NUQVRFLFxuICAgICAgICAnUDJQIENsaWVudCBpcyBub3QgY29ubmVjdGVkIHRvIHNpZ25hbGluZyBjaGFubmVsLicpKTtcbiAgICB9XG4gICAgaWYgKHRoaXMuYWxsb3dlZFJlbW90ZUlkcy5pbmRleE9mKHJlbW90ZUlkKSA8IDApIHtcbiAgICAgIHJldHVybiBQcm9taXNlLnJlamVjdChuZXcgRXJyb3JNb2R1bGUuUDJQRXJyb3IoRXJyb3JNb2R1bGUuZXJyb3JzLlAyUF9DTElFTlRfTk9UX0FMTE9XRUQpKTtcbiAgICB9XG4gICAgcmV0dXJuIGdldE9yQ3JlYXRlQ2hhbm5lbChyZW1vdGVJZCkucHVibGlzaChzdHJlYW0pO1xuICB9O1xuXG4gIC8qKlxuICAgKiBAZnVuY3Rpb24gc2VuZFxuICAgKiBAaW5zdGFuY2VcbiAgICogQGRlc2MgU2VuZCBhIG1lc3NhZ2UgdG8gcmVtb3RlIGVuZHBvaW50LlxuICAgKiBAbWVtYmVyb2YgSWNzLlAyUC5QMlBDbGllbnRcbiAgICogQHBhcmFtIHtzdHJpbmd9IHJlbW90ZUlkIFJlbW90ZSBlbmRwb2ludCdzIElELlxuICAgKiBAcGFyYW0ge3N0cmluZ30gbWVzc2FnZSBNZXNzYWdlIHRvIGJlIHNlbnQuIEl0IHNob3VsZCBiZSBhIHN0cmluZy5cbiAgICogQHJldHVybnMge1Byb21pc2U8dW5kZWZpbmVkLCBFcnJvcj59IEl0IHJldHVybnMgYSBwcm9taXNlIHJlc29sdmVkIHdoZW4gcmVtb3RlIGVuZHBvaW50IHJlY2VpdmVkIGNlcnRhaW4gbWVzc2FnZS5cbiAgICovXG4gIHRoaXMuc2VuZD1mdW5jdGlvbihyZW1vdGVJZCwgbWVzc2FnZSl7XG4gICAgaWYgKHN0YXRlICE9PSBDb25uZWN0aW9uU3RhdGUuQ09OTkVDVEVEKSB7XG4gICAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QobmV3IEVycm9yTW9kdWxlLlAyUEVycm9yKEVycm9yTW9kdWxlLmVycm9ycy5QMlBfQ0xJRU5UX0lOVkFMSURfU1RBVEUsXG4gICAgICAgICdQMlAgQ2xpZW50IGlzIG5vdCBjb25uZWN0ZWQgdG8gc2lnbmFsaW5nIGNoYW5uZWwuJykpO1xuICAgIH1cbiAgICBpZiAodGhpcy5hbGxvd2VkUmVtb3RlSWRzLmluZGV4T2YocmVtb3RlSWQpIDwgMCkge1xuICAgICAgcmV0dXJuIFByb21pc2UucmVqZWN0KG5ldyBFcnJvck1vZHVsZS5QMlBFcnJvcihFcnJvck1vZHVsZS5lcnJvcnMuUDJQX0NMSUVOVF9OT1RfQUxMT1dFRCkpO1xuICAgIH1cbiAgICByZXR1cm4gZ2V0T3JDcmVhdGVDaGFubmVsKHJlbW90ZUlkKS5zZW5kKG1lc3NhZ2UpO1xuICB9O1xuXG4gIC8qKlxuICAgKiBAZnVuY3Rpb24gc3RvcFxuICAgKiBAaW5zdGFuY2VcbiAgICogQGRlc2MgQ2xlYW4gYWxsIHJlc291cmNlcyBhc3NvY2lhdGVkIHdpdGggZ2l2ZW4gcmVtb3RlIGVuZHBvaW50LiBJdCBtYXkgaW5jbHVkZSBSVENQZWVyQ29ubmVjdGlvbiwgUlRDUnRwVHJhbnNjZWl2ZXIgYW5kIFJUQ0RhdGFDaGFubmVsLiBJdCBzdGlsbCBwb3NzaWJsZSB0byBwdWJsaXNoIGEgc3RyZWFtLCBvciBzZW5kIGEgbWVzc2FnZSB0byBnaXZlbiByZW1vdGUgZW5kcG9pbnQgYWZ0ZXIgc3RvcC5cbiAgICogQG1lbWJlcm9mIEljcy5QMlAuUDJQQ2xpZW50XG4gICAqIEBwYXJhbSB7c3RyaW5nfSByZW1vdGVJZCBSZW1vdGUgZW5kcG9pbnQncyBJRC5cbiAgICogQHJldHVybnMge3VuZGVmaW5lZH1cbiAgICovXG4gIHRoaXMuc3RvcCA9IGZ1bmN0aW9uKHJlbW90ZUlkKSB7XG4gICAgaWYgKCFjaGFubmVscy5oYXMocmVtb3RlSWQpKSB7XG4gICAgICBMb2dnZXIud2FybmluZyhcbiAgICAgICAgJ05vIFBlZXJDb25uZWN0aW9uIGJldHdlZW4gY3VycmVudCBlbmRwb2ludCBhbmQgc3BlY2lmaWMgcmVtb3RlIGVuZHBvaW50LidcbiAgICAgICk7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGNoYW5uZWxzLmdldChyZW1vdGVJZCkuc3RvcCgpO1xuICAgIGNoYW5uZWxzLmRlbGV0ZShyZW1vdGVJZCk7XG4gIH07XG5cbiAgLyoqXG4gICAqIEBmdW5jdGlvbiBnZXRTdGF0c1xuICAgKiBAaW5zdGFuY2VcbiAgICogQGRlc2MgR2V0IHN0YXRzIG9mIHVuZGVybHlpbmcgUGVlckNvbm5lY3Rpb24uXG4gICAqIEBtZW1iZXJvZiBJY3MuUDJQLlAyUENsaWVudFxuICAgKiBAcGFyYW0ge3N0cmluZ30gcmVtb3RlSWQgUmVtb3RlIGVuZHBvaW50J3MgSUQuXG4gICAqIEByZXR1cm5zIHtQcm9taXNlPFJUQ1N0YXRzUmVwb3J0LCBFcnJvcj59IEl0IHJldHVybnMgYSBwcm9taXNlIHJlc29sdmVkIHdpdGggYW4gUlRDU3RhdHNSZXBvcnQgb3IgcmVqZWN0IHdpdGggYW4gRXJyb3IgaWYgdGhlcmUgaXMgbm8gY29ubmVjdGlvbiB3aXRoIHNwZWNpZmljIHVzZXIuXG4gICAqL1xuICB0aGlzLmdldFN0YXRzID0gZnVuY3Rpb24ocmVtb3RlSWQpe1xuICAgIGlmKCFjaGFubmVscy5oYXMocmVtb3RlSWQpKXtcbiAgICAgIHJldHVybiBQcm9taXNlLnJlamVjdChuZXcgRXJyb3JNb2R1bGUuUDJQRXJyb3IoRXJyb3JNb2R1bGUuZXJyb3JzLlAyUF9DTElFTlRfSU5WQUxJRF9TVEFURSwnTm8gUGVlckNvbm5lY3Rpb24gYmV0d2VlbiBjdXJyZW50IGVuZHBvaW50IGFuZCBzcGVjaWZpYyByZW1vdGUgZW5kcG9pbnQuJykpO1xuICAgIH1cbiAgICByZXR1cm4gY2hhbm5lbHMuZ2V0KHJlbW90ZUlkKS5nZXRTdGF0cygpO1xuICB9XG5cbiAgY29uc3Qgc2VuZFNpZ25hbGluZ01lc3NhZ2UgPSBmdW5jdGlvbihyZW1vdGVJZCwgdHlwZSwgbWVzc2FnZSkge1xuICAgIGNvbnN0IG1zZyA9IHtcbiAgICAgIHR5cGU6IHR5cGVcbiAgICB9O1xuICAgIGlmIChtZXNzYWdlKSB7XG4gICAgICBtc2cuZGF0YSA9IG1lc3NhZ2U7XG4gICAgfVxuICAgIHJldHVybiBzaWduYWxpbmcuc2VuZChyZW1vdGVJZCwgSlNPTi5zdHJpbmdpZnkobXNnKSkuY2F0Y2goZSA9PiB7XG4gICAgICBpZiAodHlwZW9mIGUgPT09ICdudW1iZXInKSB7XG4gICAgICAgIHRocm93IEVycm9yTW9kdWxlLmdldEVycm9yQnlDb2RlKGUpO1xuICAgICAgfVxuICAgIH0pO1xuICB9O1xuXG4gIGNvbnN0IGdldE9yQ3JlYXRlQ2hhbm5lbCA9IGZ1bmN0aW9uKHJlbW90ZUlkKSB7XG4gICAgaWYgKCFjaGFubmVscy5oYXMocmVtb3RlSWQpKSB7XG4gICAgICAvLyBDb25zdHJ1Y3QgYW4gc2lnbmFsaW5nIHNlbmRlci9yZWNlaXZlciBmb3IgUDJQUGVlckNvbm5lY3Rpb24uXG4gICAgICBjb25zdCBzaWduYWxpbmdGb3JDaGFubmVsID0gT2JqZWN0LmNyZWF0ZShFdmVudERpc3BhdGNoZXIpO1xuICAgICAgc2lnbmFsaW5nRm9yQ2hhbm5lbC5zZW5kU2lnbmFsaW5nTWVzc2FnZSA9IHNlbmRTaWduYWxpbmdNZXNzYWdlO1xuICAgICAgY29uc3QgcGNjID0gbmV3IFAyUFBlZXJDb25uZWN0aW9uQ2hhbm5lbChjb25maWcsIG15SWQsIHJlbW90ZUlkLFxuICAgICAgICBzaWduYWxpbmdGb3JDaGFubmVsKTtcbiAgICAgIHBjYy5hZGRFdmVudExpc3RlbmVyKCdzdHJlYW1hZGRlZCcsIChzdHJlYW1FdmVudCk9PntcbiAgICAgICAgc2VsZi5kaXNwYXRjaEV2ZW50KHN0cmVhbUV2ZW50KTtcbiAgICAgIH0pO1xuICAgICAgcGNjLmFkZEV2ZW50TGlzdGVuZXIoJ21lc3NhZ2VyZWNlaXZlZCcsIChtZXNzYWdlRXZlbnQpPT57XG4gICAgICAgIHNlbGYuZGlzcGF0Y2hFdmVudChtZXNzYWdlRXZlbnQpO1xuICAgICAgfSk7XG4gICAgICBwY2MuYWRkRXZlbnRMaXN0ZW5lcignZW5kZWQnLCAoKT0+e1xuICAgICAgICBjaGFubmVscy5kZWxldGUocmVtb3RlSWQpO1xuICAgICAgfSlcbiAgICAgIGNoYW5uZWxzLnNldChyZW1vdGVJZCwgcGNjKTtcbiAgICB9XG4gICAgcmV0dXJuIGNoYW5uZWxzLmdldChyZW1vdGVJZCk7XG4gIH07XG59O1xuXG5leHBvcnQgZGVmYXVsdCBQMlBDbGllbnQ7XG4iLCIvLyBDb3B5cmlnaHQgwqkgMjAxNyBJbnRlbCBDb3Jwb3JhdGlvbi4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbid1c2Ugc3RyaWN0JztcblxuaW1wb3J0IExvZ2dlciBmcm9tICcuLi9iYXNlL2xvZ2dlci5qcyc7XG5pbXBvcnQge0V2ZW50RGlzcGF0Y2hlciwgTWVzc2FnZUV2ZW50LCBJY3NFdmVudH0gZnJvbSAnLi4vYmFzZS9ldmVudC5qcyc7XG5pbXBvcnQge1B1YmxpY2F0aW9ufSBmcm9tICcuLi9iYXNlL3B1YmxpY2F0aW9uLmpzJztcbmltcG9ydCAqIGFzIFV0aWxzIGZyb20gJy4uL2Jhc2UvdXRpbHMuanMnO1xuaW1wb3J0ICogYXMgRXJyb3JNb2R1bGUgZnJvbSAnLi9lcnJvci5qcyc7XG5pbXBvcnQgKiBhcyBTdHJlYW1Nb2R1bGUgZnJvbSAnLi4vYmFzZS9zdHJlYW0uanMnO1xuaW1wb3J0ICogYXMgU2RwVXRpbHMgZnJvbSAnLi4vYmFzZS9zZHB1dGlscy5qcyc7XG5cbi8qXG4gIEV2ZW50IGZvciBTdHJlYW0uXG4qL1xuZXhwb3J0IGNsYXNzIFAyUFBlZXJDb25uZWN0aW9uQ2hhbm5lbEV2ZW50IGV4dGVuZHMgRXZlbnQge1xuICBjb25zdHJ1Y3Rvcihpbml0KSB7XG4gICAgc3VwZXIoaW5pdCk7XG4gICAgdGhpcy5zdHJlYW0gPSBpbml0LnN0cmVhbTtcbiAgfVxufVxuXG5jb25zdCBEYXRhQ2hhbm5lbExhYmVsID0ge1xuICBNRVNTQUdFOiAnbWVzc2FnZScsXG4gIEZJTEU6ICdmaWxlJ1xufTtcblxuY29uc3QgU2lnbmFsaW5nVHlwZSA9IHtcbiAgREVOSUVEOiAnY2hhdC1kZW5pZWQnLFxuICBDTE9TRUQ6ICdjaGF0LWNsb3NlZCcsXG4gIE5FR09USUFUSU9OX05FRURFRDonY2hhdC1uZWdvdGlhdGlvbi1uZWVkZWQnLFxuICBUUkFDS19TT1VSQ0VTOiAnY2hhdC10cmFjay1zb3VyY2VzJyxcbiAgU1RSRUFNX0lORk86ICdjaGF0LXN0cmVhbS1pbmZvJyxcbiAgU0RQOiAnY2hhdC1zaWduYWwnLFxuICBUUkFDS1NfQURERUQ6ICdjaGF0LXRyYWNrcy1hZGRlZCcsXG4gIFRSQUNLU19SRU1PVkVEOiAnY2hhdC10cmFja3MtcmVtb3ZlZCcsXG4gIERBVEFfUkVDRUlWRUQ6ICdjaGF0LWRhdGEtcmVjZWl2ZWQnLFxuICBVQTogJ2NoYXQtdWEnXG59XG5cbmNvbnN0IG9mZmVyT3B0aW9ucyA9IHtcbiAgJ29mZmVyVG9SZWNlaXZlQXVkaW8nOiB0cnVlLFxuICAnb2ZmZXJUb1JlY2VpdmVWaWRlbyc6IHRydWVcbn07XG5cbmNvbnN0IHN5c0luZm8gPSBVdGlscy5zeXNJbmZvKCk7XG5cbmNsYXNzIFAyUFBlZXJDb25uZWN0aW9uQ2hhbm5lbCBleHRlbmRzIEV2ZW50RGlzcGF0Y2hlciB7XG4gIC8vIHxzaWduYWxpbmd8IGlzIGFuIG9iamVjdCBoYXMgYSBtZXRob2QgfHNlbmRTaWduYWxpbmdNZXNzYWdlfC5cbiAgY29uc3RydWN0b3IoY29uZmlnLCBsb2NhbElkLCByZW1vdGVJZCwgc2lnbmFsaW5nKSB7XG4gICAgc3VwZXIoKTtcbiAgICB0aGlzLl9jb25maWcgPSBjb25maWc7XG4gICAgdGhpcy5fbG9jYWxJZCA9IGxvY2FsSWQ7XG4gICAgdGhpcy5fcmVtb3RlSWQgPSByZW1vdGVJZDtcbiAgICB0aGlzLl9zaWduYWxpbmcgPSBzaWduYWxpbmc7XG4gICAgdGhpcy5fcGMgPSBudWxsO1xuICAgIHRoaXMuX3B1Ymxpc2hlZFN0cmVhbXMgPSBuZXcgTWFwKCk7IC8vIEtleSBpcyBzdHJlYW1zIHB1Ymxpc2hlZCwgdmFsdWUgaXMgaXRzIHB1YmxpY2F0aW9uLlxuICAgIHRoaXMuX3BlbmRpbmdTdHJlYW1zID0gW107IC8vIFN0cmVhbXMgZ29pbmcgdG8gYmUgYWRkZWQgdG8gUGVlckNvbm5lY3Rpb24uXG4gICAgdGhpcy5fcHVibGlzaGluZ1N0cmVhbXMgPSBbXTsgLy8gU3RyZWFtcyBoYXZlIGJlZW4gYWRkZWQgdG8gUGVlckNvbm5lY3Rpb24sIGJ1dCBkb2VzIG5vdCByZWNlaXZlIGFjayBmcm9tIHJlbW90ZSBzaWRlLlxuICAgIHRoaXMuX3BlbmRpbmdVbnB1Ymxpc2hTdHJlYW1zID0gW107ICAvLyBTdHJlYW1zIGdvaW5nIHRvIGJlIHJlbW92ZWQuXG4gICAgdGhpcy5fcmVtb3RlU3RyZWFtcyA9IFtdO1xuICAgIHRoaXMuX3JlbW90ZVRyYWNrU291cmNlSW5mbyA9IG5ldyBNYXAoKTsgLy8gS2V5IGlzIE1lZGlhU3RyZWFtVHJhY2sncyBJRCwgdmFsdWUgaXMgc291cmNlIGluZm8uXG4gICAgdGhpcy5fcmVtb3RlU3RyZWFtU291cmNlSW5mbyA9IG5ldyBNYXAoKTsgLy8gS2V5IGlzIE1lZGlhU3RyZWFtJ3MgSUQsIHZhbHVlIGlzIHNvdXJjZSBpbmZvLiBPbmx5IHVzZWQgaW4gU2FmYXJpLlxuICAgIHRoaXMuX3JlbW90ZVN0cmVhbUF0dHJpYnV0ZXMgPSBuZXcgTWFwKCkgLy8gS2V5IGlzIE1lZGlhU3RyZWFtJ3MgSUQsIHZhbHVlIGlzIGl0cyBhdHRyaWJ1dGVzLlxuICAgIHRoaXMuX3JlbW90ZVN0cmVhbU9yaWdpbmFsVHJhY2tJZHMgPSBuZXcgTWFwKCk7IC8vIEtleSBpcyBNZWRpYVN0cmVhbSdzIElELCB2YWx1ZSBpcyBpdHMgdHJhY2sgSUQgbGlzdC4gVGhpcyBtZW1iZXIgaXMgdXNlZCB3aGVuIHNvbWUgYnJvd3NlcnMgaW1wbGVtZW50ZWQgdGhlIGxhdGVzdCBXZWJSVEMgc3BlYyB0aGF0IE1JRCBpbiBTRFAgZG9lcyBub3QgZXF1YWwgdG8gdHJhY2sgSUQuXG4gICAgdGhpcy5fcHVibGlzaFByb21pc2VzID0gbmV3IE1hcCgpOyAvLyBLZXkgaXMgTWVkaWFTdHJlYW0ncyBJRCwgdmFsdWUgaXMgYW4gb2JqZWN0IGhhcyB8cmVzb2x2ZXwgYW5kIHxyZWplY3R8LlxuICAgIHRoaXMuX3VucHVibGlzaFByb21pc2VzID0gbmV3IE1hcCgpOyAvLyBLZXkgaXMgTWVkaWFTdHJlYW0ncyBJRCwgdmFsdWUgaXMgYW4gb2JqZWN0IGhhcyB8cmVzb2x2ZXwgYW5kIHxyZWplY3R8LlxuICAgIHRoaXMuX3B1Ymxpc2hpbmdTdHJlYW1UcmFja3MgPSBuZXcgTWFwKCk7ICAvLyBLZXkgaXMgTWVkaWFTdHJlYW0ncyBJRCwgdmFsdWUgaXMgYW4gYXJyYXkgb2YgdGhlIElEIG9mIGl0cyBNZWRpYVN0cmVhbVRyYWNrcyB0aGF0IGhhdmVuJ3QgYmVlbiBhY2tlZC5cbiAgICB0aGlzLl9wdWJsaXNoZWRTdHJlYW1UcmFja3MgPSBuZXcgTWFwKCk7ICAvLyBLZXkgaXMgTWVkaWFTdHJlYW0ncyBJRCwgdmFsdWUgaXMgYW4gYXJyYXkgb2YgdGhlIElEIG9mIGl0cyBNZWRpYVN0cmVhbVRyYWNrcyB0aGF0IGhhdmVuJ3QgYmVlbiByZW1vdmVkLlxuICAgIHRoaXMuX3JlbW90ZVN0cmVhbVRyYWNrcyA9IG5ldyBNYXAoKTsgIC8vIEtleSBpcyBNZWRpYVN0cmVhbSdzIElELCB2YWx1ZSBpcyBhbiBhcnJheSBvZiB0aGUgSUQgb2YgaXRzIE1lZGlhU3RyZWFtVHJhY2tzLlxuICAgIHRoaXMuX2lzTmVnb3RpYXRpb25OZWVkZWQgPSBmYWxzZTtcbiAgICB0aGlzLl9uZWdvdGlhdGluZyA9IGZhbHNlO1xuICAgIHRoaXMuX3JlbW90ZVNpZGVTdXBwb3J0c1JlbW92ZVN0cmVhbSA9IHRydWU7XG4gICAgdGhpcy5fcmVtb3RlU2lkZVN1cHBvcnRzUGxhbkIgPSB0cnVlO1xuICAgIHRoaXMuX3JlbW90ZVNpZGVTdXBwb3J0c1VuaWZpZWRQbGFuID0gdHJ1ZTtcbiAgICB0aGlzLl9yZW1vdGVJY2VDYW5kaWRhdGVzID0gW107XG4gICAgdGhpcy5fZGF0YUNoYW5uZWxzID0gbmV3IE1hcCgpOyAgLy8gS2V5IGlzIGRhdGEgY2hhbm5lbCdzIGxhYmVsLCB2YWx1ZSBpcyBhIFJUQ0RhdGFDaGFubmVsLlxuICAgIHRoaXMuX3BlbmRpbmdNZXNzYWdlcyA9IFtdO1xuICAgIHRoaXMuX2RhdGFTZXEgPSAxOyAgLy8gU2VxdWVuY2UgbnVtYmVyIGZvciBkYXRhIGNoYW5uZWwgbWVzc2FnZXMuXG4gICAgdGhpcy5fc2VuZERhdGFQcm9taXNlcyA9IG5ldyBNYXAoKTsgIC8vIEtleSBpcyBkYXRhIHNlcXVlbmNlIG51bWJlciwgdmFsdWUgaXMgYW4gb2JqZWN0IGhhcyB8cmVzb2x2ZXwgYW5kIHxyZWplY3R8LlxuICAgIHRoaXMuX2FkZGVkVHJhY2tJZHMgPSBbXTsgLy8gVHJhY2tzIHRoYXQgaGF2ZSBiZWVuIGFkZGVkIGFmdGVyIHJlY2VpdmluZyByZW1vdGUgU0RQIGJ1dCBiZWZvcmUgY29ubmVjdGlvbiBpcyBlc3RhYmxpc2hlZC4gRHJhaW5pbmcgdGhlc2UgbWVzc2FnZXMgd2hlbiBJQ0UgY29ubmVjdGlvbiBzdGF0ZSBpcyBjb25uZWN0ZWQuXG4gICAgdGhpcy5faXNDYWxsZXIgPSB0cnVlO1xuICAgIHRoaXMuX2luZm9TZW50ID0gZmFsc2U7XG4gICAgdGhpcy5fY3JlYXRlUGVlckNvbm5lY3Rpb24oKTtcbiAgfVxuXG4gIHB1Ymxpc2goc3RyZWFtKSB7XG4gICAgaWYgKCEoc3RyZWFtIGluc3RhbmNlb2YgU3RyZWFtTW9kdWxlLkxvY2FsU3RyZWFtKSkge1xuICAgICAgcmV0dXJuIFByb21pc2UucmVqZWN0KG5ldyBUeXBlRXJyb3IoJ0ludmFsaWQgc3RyZWFtLicpKTtcbiAgICB9XG4gICAgaWYgKHRoaXMuX3B1Ymxpc2hlZFN0cmVhbXMuaGFzKHN0cmVhbSkpIHtcbiAgICAgIHJldHVybiBQcm9taXNlLnJlamVjdChuZXcgRXJyb3JNb2R1bGUuUDJQRXJyb3IoRXJyb3JNb2R1bGUuZXJyb3JzLlAyUF9DTElFTlRfSUxMRUdBTF9BUkdVTUVOVCxcbiAgICAgICAgJ0R1cGxpY2F0ZWQgc3RyZWFtLicpKTtcbiAgICB9XG4gICAgaWYgKHRoaXMuX2FyZUFsbFRyYWNrc0VuZGVkKHN0cmVhbS5tZWRpYVN0cmVhbSkpIHtcbiAgICAgIHJldHVybiBQcm9taXNlLnJlamVjdChuZXcgRXJyb3JNb2R1bGUuUDJQRXJyb3IoRXJyb3JNb2R1bGUuZXJyb3JzLlAyUF9DTElFTlRfSU5WQUxJRF9TVEFURSxcbiAgICAgICAgJ0FsbCB0cmFja3MgYXJlIGVuZGVkLicpKTtcbiAgICB9XG4gICAgcmV0dXJuIFByb21pc2UuYWxsKFt0aGlzLl9zZW5kQ2xvc2VkTXNnSWZOZWNlc3NhcnkoKSwgdGhpcy5fc2VuZFN5c0luZm9JZk5lY2Vzc2FyeSgpLCB0aGlzLl9zZW5kU3RyZWFtSW5mbyhzdHJlYW0pXSkudGhlbihcbiAgICAgICgpID0+IHtcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgICAvLyBSZXBsYWNlIHxhZGRTdHJlYW18IHdpdGggUGVlckNvbm5lY3Rpb24uYWRkVHJhY2sgd2hlbiBhbGwgYnJvd3NlcnMgYXJlIHJlYWR5LlxuICAgICAgICAgIHRoaXMuX3BjLmFkZFN0cmVhbShzdHJlYW0ubWVkaWFTdHJlYW0pO1xuICAgICAgICAgIHRoaXMuX3B1Ymxpc2hpbmdTdHJlYW1zLnB1c2goc3RyZWFtKTtcbiAgICAgICAgICBjb25zdCB0cmFja0lkcyA9IEFycmF5LmZyb20oc3RyZWFtLm1lZGlhU3RyZWFtLmdldFRyYWNrcygpLFxuICAgICAgICAgICAgdHJhY2sgPT4gdHJhY2suaWQpO1xuICAgICAgICAgIHRoaXMuX3B1Ymxpc2hpbmdTdHJlYW1UcmFja3Muc2V0KHN0cmVhbS5tZWRpYVN0cmVhbS5pZCxcbiAgICAgICAgICAgIHRyYWNrSWRzKTtcbiAgICAgICAgICB0aGlzLl9wdWJsaXNoUHJvbWlzZXMuc2V0KHN0cmVhbS5tZWRpYVN0cmVhbS5pZCwge1xuICAgICAgICAgICAgcmVzb2x2ZTogcmVzb2x2ZSxcbiAgICAgICAgICAgIHJlamVjdDogcmVqZWN0XG4gICAgICAgICAgfSk7XG4gICAgICAgICAgaWYgKCF0aGlzLl9kYXRhQ2hhbm5lbHMuaGFzKERhdGFDaGFubmVsTGFiZWwuTUVTU0FHRSkpIHtcbiAgICAgICAgICAgIHRoaXMuX2NyZWF0ZURhdGFDaGFubmVsKERhdGFDaGFubmVsTGFiZWwuTUVTU0FHRSk7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIH0pO1xuICB9XG5cblxuICBzZW5kKG1lc3NhZ2UpIHtcbiAgICBpZiAoISh0eXBlb2YgbWVzc2FnZSA9PT0gJ3N0cmluZycpKSB7XG4gICAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QobmV3IFR5cGVFcnJvcignSW52YWxpZCBtZXNzYWdlLicpKTtcbiAgICB9XG4gICAgY29uc3QgZGF0YSA9IHtcbiAgICAgIGlkOiB0aGlzLl9kYXRhU2VxKyssXG4gICAgICBkYXRhOiBtZXNzYWdlXG4gICAgfTtcbiAgICBjb25zdCBwcm9taXNlID0gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgdGhpcy5fc2VuZERhdGFQcm9taXNlcy5zZXQoZGF0YS5pZCwge1xuICAgICAgICByZXNvbHZlOiByZXNvbHZlLFxuICAgICAgICByZWplY3Q6IHJlamVjdFxuICAgICAgfSk7XG4gICAgfSk7XG4gICAgaWYgKCF0aGlzLl9kYXRhQ2hhbm5lbHMuaGFzKERhdGFDaGFubmVsTGFiZWwuTUVTU0FHRSkpIHtcbiAgICAgIHRoaXMuX2NyZWF0ZURhdGFDaGFubmVsKERhdGFDaGFubmVsTGFiZWwuTUVTU0FHRSk7XG4gICAgfVxuXG4gICAgdGhpcy5fc2VuZFN5c0luZm9JZk5lY2Vzc2FyeSgpLmNhdGNoKGVyciA9PiB7XG4gICAgICAgIExvZ2dlci5kZWJ1ZygnRmFpbGVkIHRvIHNlbmQgc3lzSW5mby4nICsgZXJyLm1lc3NhZ2UpO1xuICAgIH0pO1xuXG4gICAgY29uc3QgZGMgPSB0aGlzLl9kYXRhQ2hhbm5lbHMuZ2V0KERhdGFDaGFubmVsTGFiZWwuTUVTU0FHRSk7XG4gICAgaWYgKGRjLnJlYWR5U3RhdGUgPT09ICdvcGVuJykge1xuICAgICAgdGhpcy5fZGF0YUNoYW5uZWxzLmdldChEYXRhQ2hhbm5lbExhYmVsLk1FU1NBR0UpLnNlbmQoSlNPTi5zdHJpbmdpZnkoZGF0YSkpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLl9wZW5kaW5nTWVzc2FnZXMucHVzaChkYXRhKTtcbiAgICB9XG4gICAgcmV0dXJuIHByb21pc2U7XG4gIH1cblxuICBzdG9wKCkge1xuICAgIHRoaXMuX3N0b3AodW5kZWZpbmVkLCB0cnVlKTtcbiAgfVxuXG4gIGdldFN0YXRzKG1lZGlhU3RyZWFtKSB7XG4gICAgaWYgKHRoaXMuX3BjKSB7XG4gICAgICBpZiAobWVkaWFTdHJlYW0gPT09IHVuZGVmaW5lZCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fcGMuZ2V0U3RhdHMoKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNvbnN0IHRyYWNrc1N0YXRzUmVwb3J0cyA9IFtdO1xuICAgICAgICByZXR1cm4gUHJvbWlzZS5hbGwoW21lZGlhU3RyZWFtLmdldFRyYWNrcygpLmZvckVhY2goKHRyYWNrKSA9PiB7dGhpcy5fZ2V0U3RhdHModHJhY2ssIHRyYWNrc1N0YXRzUmVwb3J0cyl9KV0pLnRoZW4oXG4gICAgICAgICAgKCkgPT4ge1xuICAgICAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgICAgICAgcmVzb2x2ZSh0cmFja3NTdGF0c1JlcG9ydHMpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBQcm9taXNlLnJlamVjdChuZXcgRXJyb3JNb2R1bGUuUDJQRXJyb3IoRXJyb3JNb2R1bGUuZXJyb3JzLlAyUF9DTElFTlRfSU5WQUxJRF9TVEFURSkpO1xuICAgIH1cbiAgfVxuXG4gIF9nZXRTdGF0cyhtZWRpYVN0cmVhbVRyYWNrLCByZXBvcnRzUmVzdWx0KSB7XG4gICAgcmV0dXJuIHRoaXMuX3BjLmdldFN0YXRzKG1lZGlhU3RyZWFtVHJhY2spLnRoZW4oXG4gICAgICAoc3RhdHNSZXBvcnQpID0+IHtyZXBvcnRzUmVzdWx0LnB1c2goc3RhdHNSZXBvcnQpO30pO1xuICB9XG5cbiAgLy8gVGhpcyBtZXRob2QgaXMgY2FsbGVkIGJ5IFAyUENsaWVudCB3aGVuIHRoZXJlIGlzIG5ldyBzaWduYWxpbmcgbWVzc2FnZSBhcnJpdmVkLlxuICBvbk1lc3NhZ2UobWVzc2FnZSl7XG4gICAgdGhpcy5fU2lnbmFsaW5nTWVzc3NhZ2VIYW5kbGVyKG1lc3NhZ2UpO1xuICB9XG5cbiAgX3NlbmRTZHAoc2RwKSB7XG4gICAgcmV0dXJuIHRoaXMuX3NpZ25hbGluZy5zZW5kU2lnbmFsaW5nTWVzc2FnZSh0aGlzLl9yZW1vdGVJZCwgU2lnbmFsaW5nVHlwZS5TRFAsXG4gICAgICBzZHApO1xuICB9XG5cbiAgX3NlbmRTaWduYWxpbmdNZXNzYWdlKHR5cGUsIG1lc3NhZ2UpIHtcbiAgICByZXR1cm4gdGhpcy5fc2lnbmFsaW5nLnNlbmRTaWduYWxpbmdNZXNzYWdlKHRoaXMuX3JlbW90ZUlkLCB0eXBlLCBtZXNzYWdlKTtcbiAgfVxuXG4gIF9TaWduYWxpbmdNZXNzc2FnZUhhbmRsZXIobWVzc2FnZSkge1xuICAgIExvZ2dlci5kZWJ1ZygnQ2hhbm5lbCByZWNlaXZlZCBtZXNzYWdlOiAnICsgbWVzc2FnZSk7XG4gICAgc3dpdGNoIChtZXNzYWdlLnR5cGUpIHtcbiAgICAgIGNhc2UgU2lnbmFsaW5nVHlwZS5ERU5JRUQ6XG4gICAgICAgIHRoaXMuX2NoYXREZW5pZWRIYW5kbGVyKCk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBTaWduYWxpbmdUeXBlLlVBOlxuICAgICAgICB0aGlzLl9oYW5kbGVSZW1vdGVDYXBhYmlsaXR5KG1lc3NhZ2UuZGF0YSk7XG4gICAgICAgIHRoaXMuX3NlbmRTeXNJbmZvSWZOZWNlc3NhcnkoKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIFNpZ25hbGluZ1R5cGUuVFJBQ0tfU09VUkNFUzpcbiAgICAgICAgdGhpcy5fdHJhY2tTb3VyY2VzSGFuZGxlcihtZXNzYWdlLmRhdGEpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgU2lnbmFsaW5nVHlwZS5TVFJFQU1fSU5GTzpcbiAgICAgICAgdGhpcy5fc3RyZWFtSW5mb0hhbmRsZXIobWVzc2FnZS5kYXRhKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIFNpZ25hbGluZ1R5cGUuU0RQOlxuICAgICAgICB0aGlzLl9zZHBIYW5kbGVyKG1lc3NhZ2UuZGF0YSk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBTaWduYWxpbmdUeXBlLlRSQUNLU19BRERFRDpcbiAgICAgICAgdGhpcy5fdHJhY2tzQWRkZWRIYW5kbGVyKG1lc3NhZ2UuZGF0YSk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBTaWduYWxpbmdUeXBlLlRSQUNLU19SRU1PVkVEOlxuICAgICAgICB0aGlzLl90cmFja3NSZW1vdmVkSGFuZGxlcihtZXNzYWdlLmRhdGEpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgU2lnbmFsaW5nVHlwZS5EQVRBX1JFQ0VJVkVEOlxuICAgICAgICB0aGlzLl9kYXRhUmVjZWl2ZWRIYW5kbGVyKG1lc3NhZ2UuZGF0YSk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBTaWduYWxpbmdUeXBlLkNMT1NFRDpcbiAgICAgICAgdGhpcy5fY2hhdENsb3NlZEhhbmRsZXIoKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIFNpZ25hbGluZ1R5cGUuTkVHT1RJQVRJT05fTkVFREVEOlxuICAgICAgICB0aGlzLl9kb05lZ290aWF0ZSgpO1xuICAgICAgICBicmVhaztcbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIExvZ2dlci5lcnJvcignSW52YWxpZCBzaWduYWxpbmcgbWVzc2FnZSByZWNlaXZlZC4gVHlwZTogJyArIG1lc3NhZ2UudHlwZSk7XG4gICAgfVxuICB9XG5cbiAgX3RyYWNrc0FkZGVkSGFuZGxlcihpZHMpIHtcbiAgICAvLyBDdXJyZW50bHksIHxpZHN8IGNvbnRhaW5zIGFsbCB0cmFjayBJRHMgb2YgYSBNZWRpYVN0cmVhbS4gRm9sbG93aW5nIGFsZ29yaXRobSBhbHNvIGhhbmRsZXMgfGlkc3wgaXMgYSBwYXJ0IG9mIGEgTWVkaWFTdHJlYW0ncyB0cmFja3MuXG4gICAgZm9yIChjb25zdCBpZCBvZiBpZHMpIHtcbiAgICAgIC8vIEl0IGNvdWxkIGJlIGEgcHJvYmxlbSBpZiB0aGVyZSBpcyBhIHRyYWNrIHB1Ymxpc2hlZCB3aXRoIGRpZmZlcmVudCBNZWRpYVN0cmVhbXMuXG4gICAgICB0aGlzLl9wdWJsaXNoaW5nU3RyZWFtVHJhY2tzLmZvckVhY2goKG1lZGlhVHJhY2tJZHMsIG1lZGlhU3RyZWFtSWQpID0+IHtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBtZWRpYVRyYWNrSWRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgaWYgKG1lZGlhVHJhY2tJZHNbaV0gPT09IGlkKSB7XG4gICAgICAgICAgICAvLyBNb3ZlIHRoaXMgdHJhY2sgZnJvbSBwdWJsaXNoaW5nIHRyYWNrcyB0byBwdWJsaXNoZWQgdHJhY2tzLlxuICAgICAgICAgICAgaWYgKCF0aGlzLl9wdWJsaXNoZWRTdHJlYW1UcmFja3MuaGFzKG1lZGlhU3RyZWFtSWQpKSB7XG4gICAgICAgICAgICAgIHRoaXMuX3B1Ymxpc2hlZFN0cmVhbVRyYWNrcy5zZXQobWVkaWFTdHJlYW1JZCwgW10pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5fcHVibGlzaGVkU3RyZWFtVHJhY2tzLmdldChtZWRpYVN0cmVhbUlkKS5wdXNoKFxuICAgICAgICAgICAgICBtZWRpYVRyYWNrSWRzW2ldKTtcbiAgICAgICAgICAgIG1lZGlhVHJhY2tJZHMuc3BsaWNlKGksIDEpO1xuICAgICAgICAgIH1cbiAgICAgICAgICAvLyBSZXNvbHZpbmcgY2VydGFpbiBwdWJsaXNoIHByb21pc2Ugd2hlbiByZW1vdGUgZW5kcG9pbnQgcmVjZWl2ZWQgYWxsIHRyYWNrcyBvZiBhIE1lZGlhU3RyZWFtLlxuICAgICAgICAgIGlmIChtZWRpYVRyYWNrSWRzLmxlbmd0aCA9PSAwKSB7XG4gICAgICAgICAgICBpZiAoIXRoaXMuX3B1Ymxpc2hQcm9taXNlcy5oYXMobWVkaWFTdHJlYW1JZCkpIHtcbiAgICAgICAgICAgICAgTG9nZ2VyLndhcm5pbmcoJ0Nhbm5vdCBmaW5kIHRoZSBwcm9taXNlIGZvciBwdWJsaXNoaW5nICcgK1xuICAgICAgICAgICAgICAgIG1lZGlhU3RyZWFtSWQpO1xuICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNvbnN0IHRhcmdldFN0cmVhbUluZGV4ID0gdGhpcy5fcHVibGlzaGluZ1N0cmVhbXMuZmluZEluZGV4KFxuICAgICAgICAgICAgICBlbGVtZW50ID0+IGVsZW1lbnQubWVkaWFTdHJlYW0uaWQgPT0gbWVkaWFTdHJlYW1JZCk7XG4gICAgICAgICAgICBjb25zdCB0YXJnZXRTdHJlYW0gPSB0aGlzLl9wdWJsaXNoaW5nU3RyZWFtc1t0YXJnZXRTdHJlYW1JbmRleF07XG4gICAgICAgICAgICB0aGlzLl9wdWJsaXNoaW5nU3RyZWFtcy5zcGxpY2UodGFyZ2V0U3RyZWFtSW5kZXgsIDEpO1xuICAgICAgICAgICAgY29uc3QgcHVibGljYXRpb24gPSBuZXcgUHVibGljYXRpb24oXG4gICAgICAgICAgICAgIGlkLCAoKSA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy5fdW5wdWJsaXNoKHRhcmdldFN0cmVhbSkudGhlbigoKSA9PiB7XG4gICAgICAgICAgICAgICAgICBwdWJsaWNhdGlvbi5kaXNwYXRjaEV2ZW50KG5ldyBJY3NFdmVudCgnZW5kZWQnKSk7XG4gICAgICAgICAgICAgICAgfSwgKGVycikgPT4ge1xuICAgICAgICAgICAgICAgICAgLy8gVXNlIGRlYnVnIG1vZGUgYmVjYXVzZSB0aGlzIGVycm9yIHVzdWFsbHkgZG9lc24ndCBibG9jayBzdG9wcGluZyBhIHB1YmxpY2F0aW9uLlxuICAgICAgICAgICAgICAgICAgTG9nZ2VyLmRlYnVnKFxuICAgICAgICAgICAgICAgICAgICAnU29tZXRoaW5nIHdyb25nIGhhcHBlbmVkIGR1cmluZyBzdG9wcGluZyBhIHB1YmxpY2F0aW9uLiAnICtcbiAgICAgICAgICAgICAgICAgICAgZXJyLm1lc3NhZ2UpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICB9LCAoKSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKCF0YXJnZXRTdHJlYW0gfHwgIXRhcmdldFN0cmVhbS5tZWRpYVN0cmVhbSkge1xuICAgICAgICAgICAgICAgICAgcmV0dXJuIFByb21pc2UucmVqZWN0KG5ldyBFcnJvck1vZHVsZS5QMlBFcnJvcihFcnJvck1vZHVsZS5lcnJvcnNcbiAgICAgICAgICAgICAgICAgICAgLlAyUF9DTElFTlRfSU5WQUxJRF9TVEFURSxcbiAgICAgICAgICAgICAgICAgICAgJ1B1YmxpY2F0aW9uIGlzIG5vdCBhdmFpbGFibGUuJykpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5nZXRTdGF0cyh0YXJnZXRTdHJlYW0ubWVkaWFTdHJlYW0pO1xuICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHRoaXMuX3B1Ymxpc2hlZFN0cmVhbXMuc2V0KHRhcmdldFN0cmVhbSwgcHVibGljYXRpb24pO1xuICAgICAgICAgICAgdGhpcy5fcHVibGlzaFByb21pc2VzLmdldChtZWRpYVN0cmVhbUlkKS5yZXNvbHZlKHB1YmxpY2F0aW9uKTtcbiAgICAgICAgICAgIHRoaXMuX3B1Ymxpc2hQcm9taXNlcy5kZWxldGUobWVkaWFTdHJlYW1JZCk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9XG4gIH1cblxuICBfdHJhY2tzUmVtb3ZlZEhhbmRsZXIoaWRzKSB7XG4gICAgLy8gQ3VycmVudGx5LCB8aWRzfCBjb250YWlucyBhbGwgdHJhY2sgSURzIG9mIGEgTWVkaWFTdHJlYW0uIEZvbGxvd2luZyBhbGdvcml0aG0gYWxzbyBoYW5kbGVzIHxpZHN8IGlzIGEgcGFydCBvZiBhIE1lZGlhU3RyZWFtJ3MgdHJhY2tzLlxuICAgIGZvciAoY29uc3QgaWQgb2YgaWRzKSB7XG4gICAgICAvLyBJdCBjb3VsZCBiZSBhIHByb2JsZW0gaWYgdGhlcmUgaXMgYSB0cmFjayBwdWJsaXNoZWQgd2l0aCBkaWZmZXJlbnQgTWVkaWFTdHJlYW1zLlxuICAgICAgdGhpcy5fcHVibGlzaGVkU3RyZWFtVHJhY2tzLmZvckVhY2goKG1lZGlhVHJhY2tJZHMsIG1lZGlhU3RyZWFtSWQpID0+IHtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBtZWRpYVRyYWNrSWRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgaWYgKG1lZGlhVHJhY2tJZHNbaV0gPT09IGlkKSB7XG4gICAgICAgICAgICBtZWRpYVRyYWNrSWRzLnNwbGljZShpLCAxKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuXG4gIF9kYXRhUmVjZWl2ZWRIYW5kbGVyKGlkKSB7XG4gICAgaWYgKCF0aGlzLl9zZW5kRGF0YVByb21pc2VzLmhhcyhpZCkpIHtcbiAgICAgIExvZ2dlci53YXJuaW5nKCdSZWNlaXZlZCB1bmtub3duIGRhdGEgcmVjZWl2ZWQgbWVzc2FnZS4gSUQ6ICcgKyBpZCk7XG4gICAgICByZXR1cm47XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuX3NlbmREYXRhUHJvbWlzZXMuZ2V0KGlkKS5yZXNvbHZlKCk7XG4gICAgfVxuICB9XG5cbiAgX3NkcEhhbmRsZXIoc2RwKSB7XG4gICAgaWYgKHNkcC50eXBlID09PSAnb2ZmZXInKSB7XG4gICAgICB0aGlzLl9vbk9mZmVyKHNkcCk7XG4gICAgfSBlbHNlIGlmIChzZHAudHlwZSA9PT0gJ2Fuc3dlcicpIHtcbiAgICAgIHRoaXMuX29uQW5zd2VyKHNkcCk7XG4gICAgfSBlbHNlIGlmIChzZHAudHlwZSA9PT0gJ2NhbmRpZGF0ZXMnKSB7XG4gICAgICB0aGlzLl9vblJlbW90ZUljZUNhbmRpZGF0ZShzZHApO1xuICAgIH1cbiAgfVxuXG4gIF90cmFja1NvdXJjZXNIYW5kbGVyKGRhdGEpIHtcbiAgICBmb3IgKGNvbnN0IGluZm8gb2YgZGF0YSkge1xuICAgICAgdGhpcy5fcmVtb3RlVHJhY2tTb3VyY2VJbmZvLnNldChpbmZvLmlkLCBpbmZvLnNvdXJjZSk7XG4gICAgfVxuICB9XG5cbiAgX3N0cmVhbUluZm9IYW5kbGVyKGRhdGEpe1xuICAgIGlmICghZGF0YSkge1xuICAgICAgTG9nZ2VyLndhcm5pbmcoJ1VuZXhwZWN0ZWQgc3RyZWFtIGluZm8uJyk7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIHRoaXMuX3JlbW90ZVN0cmVhbVNvdXJjZUluZm8uc2V0KGRhdGEuaWQsIGRhdGEuc291cmNlKTtcbiAgICB0aGlzLl9yZW1vdGVTdHJlYW1BdHRyaWJ1dGVzLnNldChkYXRhLmlkLCBkYXRhLmF0dHJpYnV0ZXMpO1xuICAgIHRoaXMuX3JlbW90ZVN0cmVhbU9yaWdpbmFsVHJhY2tJZHMuc2V0KGRhdGEuaWQsIGRhdGEudHJhY2tzKTtcbiAgfVxuXG4gIF9jaGF0Q2xvc2VkSGFuZGxlcihkYXRhKSB7XG4gICAgdGhpcy5fc3RvcChkYXRhLCBmYWxzZSk7XG4gIH1cblxuICBfY2hhdERlbmllZEhhbmRsZXIoKSB7XG4gICAgdGhpcy5fc3RvcCgpO1xuICB9XG5cbiAgX29uT2ZmZXIoc2RwKSB7XG4gICAgTG9nZ2VyLmRlYnVnKCdBYm91dCB0byBzZXQgcmVtb3RlIGRlc2NyaXB0aW9uLiBTaWduYWxpbmcgc3RhdGU6ICcgK1xuICAgICAgdGhpcy5fcGMuc2lnbmFsaW5nU3RhdGUpO1xuICAgIHNkcC5zZHAgPSB0aGlzLl9zZXRSdHBTZW5kZXJPcHRpb25zKHNkcC5zZHAsIHRoaXMuX2NvbmZpZyk7XG4gICAgY29uc3Qgc2Vzc2lvbkRlc2NyaXB0aW9uID0gbmV3IFJUQ1Nlc3Npb25EZXNjcmlwdGlvbihzZHApO1xuICAgIHRoaXMuX3BjLnNldFJlbW90ZURlc2NyaXB0aW9uKHNlc3Npb25EZXNjcmlwdGlvbikudGhlbigoKSA9PiB7XG4gICAgICB0aGlzLl9jcmVhdGVBbmRTZW5kQW5zd2VyKCk7XG4gICAgfSwgKGVycm9yKSA9PiB7XG4gICAgICBMb2dnZXIuZGVidWcoJ1NldCByZW1vdGUgZGVzY3JpcHRpb24gZmFpbGVkLiBNZXNzYWdlOiAnICsgZXJyb3IubWVzc2FnZSk7XG4gICAgICB0aGlzLl9zdG9wKGVycm9yLCB0cnVlKTtcbiAgICB9KTtcbiAgfVxuXG4gIF9vbkFuc3dlcihzZHApIHtcbiAgICBMb2dnZXIuZGVidWcoJ0Fib3V0IHRvIHNldCByZW1vdGUgZGVzY3JpcHRpb24uIFNpZ25hbGluZyBzdGF0ZTogJyArXG4gICAgICB0aGlzLl9wYy5zaWduYWxpbmdTdGF0ZSk7XG4gICAgc2RwLnNkcCA9IHRoaXMuX3NldFJ0cFNlbmRlck9wdGlvbnMoc2RwLnNkcCwgdGhpcy5fY29uZmlnKTtcbiAgICBjb25zdCBzZXNzaW9uRGVzY3JpcHRpb24gPSBuZXcgUlRDU2Vzc2lvbkRlc2NyaXB0aW9uKHNkcCk7XG4gICAgdGhpcy5fcGMuc2V0UmVtb3RlRGVzY3JpcHRpb24obmV3IFJUQ1Nlc3Npb25EZXNjcmlwdGlvbihcbiAgICAgIHNlc3Npb25EZXNjcmlwdGlvbikpLnRoZW4oKCkgPT4ge1xuICAgICAgTG9nZ2VyLmRlYnVnKCdTZXQgcmVtb3RlIGRlc2NyaXBpdG9uIHN1Y2Nlc3NmdWxseS4nKTtcbiAgICAgIHRoaXMuX2RyYWluUGVuZGluZ01lc3NhZ2VzKCk7XG4gICAgfSwgKGVycm9yKSA9PiB7XG4gICAgICBMb2dnZXIuZGVidWcoJ1NldCByZW1vdGUgZGVzY3JpcHRpb24gZmFpbGVkLiBNZXNzYWdlOiAnICsgZXJyb3IubWVzc2FnZSk7XG4gICAgICB0aGlzLl9zdG9wKGVycm9yLCB0cnVlKTtcbiAgICB9KTtcbiAgfVxuXG4gIF9vbkxvY2FsSWNlQ2FuZGlkYXRlKGV2ZW50KSB7XG4gICAgaWYgKGV2ZW50LmNhbmRpZGF0ZSkge1xuICAgICAgdGhpcy5fc2VuZFNkcCh7XG4gICAgICAgIHR5cGU6ICdjYW5kaWRhdGVzJyxcbiAgICAgICAgY2FuZGlkYXRlOiBldmVudC5jYW5kaWRhdGUuY2FuZGlkYXRlLFxuICAgICAgICBzZHBNaWQ6IGV2ZW50LmNhbmRpZGF0ZS5zZHBNaWQsXG4gICAgICAgIHNkcE1MaW5lSW5kZXg6IGV2ZW50LmNhbmRpZGF0ZS5zZHBNTGluZUluZGV4XG4gICAgICB9KS5jYXRjaChlPT57XG4gICAgICAgIExvZ2dlci53YXJuaW5nKCdGYWlsZWQgdG8gc2VuZCBjYW5kaWRhdGUuJyk7XG4gICAgICB9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgTG9nZ2VyLmRlYnVnKCdFbXB0eSBjYW5kaWRhdGUuJyk7XG4gICAgfVxuICB9XG5cbiAgX29uUmVtb3RlVHJhY2tBZGRlZChldmVudCkge1xuICAgIExvZ2dlci5kZWJ1ZygnUmVtb3RlIHRyYWNrIGFkZGVkLicpO1xuICB9XG5cbiAgX29uUmVtb3RlU3RyZWFtQWRkZWQoZXZlbnQpIHtcbiAgICBMb2dnZXIuZGVidWcoJ1JlbW90ZSBzdHJlYW0gYWRkZWQuJyk7XG4gICAgdGhpcy5fcmVtb3RlU3RyZWFtVHJhY2tzLnNldChldmVudC5zdHJlYW0uaWQsIFtdKTtcbiAgICAvLyBBY2sgdHJhY2sgYWRkZWQgd2hlbiBvbmFkZHN0cmVhbS9vbmFkZHRyYWNrIGlzIGZpcmVkIGZvciBhIHNwZWNpZmljIHRyYWNrLiBJdCdzIGJldHRlciB0byBjaGVjayB0aGUgc3RhdGUgb2YgUGVlckNvbm5lY3Rpb24gYmVmb3JlIGFja25vd2xlZGdlIHNpbmNlIG1lZGlhIGRhdGEgd2lsbCBub3QgZmxvdyBpZiBJQ0UgZmFpbHMuXG4gICAgbGV0IHRyYWNrc0luZm89W107XG4gICAgZXZlbnQuc3RyZWFtLmdldFRyYWNrcygpLmZvckVhY2goKHRyYWNrKT0+e1xuICAgICAgdHJhY2tzSW5mby5wdXNoKHRyYWNrLmlkKTtcbiAgICAgIHRoaXMuX3JlbW90ZVN0cmVhbVRyYWNrcy5nZXQoZXZlbnQuc3RyZWFtLmlkKS5wdXNoKHRyYWNrLmlkKTtcbiAgICB9KTtcbiAgICB0cmFja3NJbmZvID0gdHJhY2tzSW5mby5jb25jYXQodGhpcy5fcmVtb3RlU3RyZWFtT3JpZ2luYWxUcmFja0lkcy5nZXQoZXZlbnRcbiAgICAgIC5zdHJlYW0uaWQpKTtcbiAgICBpZiAodGhpcy5fcGMuaWNlQ29ubmVjdGlvblN0YXRlID09PSAnY29ubmVjdGVkJyB8fCB0aGlzLl9wYy5pY2VDb25uZWN0aW9uU3RhdGUgPT09XG4gICAgICAnY29tcGxldGVkJykge1xuICAgICAgdGhpcy5fc2VuZFNpZ25hbGluZ01lc3NhZ2UoU2lnbmFsaW5nVHlwZS5UUkFDS1NfQURERUQsIHRyYWNrc0luZm8pO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLl9hZGRlZFRyYWNrSWRzID0gdGhpcy5fYWRkZWRUcmFja0lkcy5jb25jYXQodHJhY2tzSW5mbyk7XG4gICAgfVxuICAgIGxldCBhdWRpb1RyYWNrU291cmNlLCB2aWRlb1RyYWNrU291cmNlO1xuICAgIC8vIFNhZmFyaSBhbmQgRmlyZWZveCBnZW5lcmF0ZXMgbmV3IElEIGZvciByZW1vdGUgdHJhY2tzLlxuICAgIGlmIChVdGlscy5pc1NhZmFyaSgpIHx8IFV0aWxzLmlzRmlyZWZveCgpKSB7XG4gICAgICBpZiAoIXRoaXMuX3JlbW90ZVN0cmVhbVNvdXJjZUluZm8uaGFzKGV2ZW50LnN0cmVhbS5pZCkpIHtcbiAgICAgICAgTG9nZ2VyLndhcm5pbmcoJ0Nhbm5vdCBmaW5kIHNvdXJjZSBpbmZvIGZvciBzdHJlYW0gJyArIGV2ZW50LnN0cmVhbS5pZCk7XG4gICAgICB9XG4gICAgICBhdWRpb1RyYWNrU291cmNlID0gdGhpcy5fcmVtb3RlU3RyZWFtU291cmNlSW5mby5nZXQoZXZlbnQuc3RyZWFtLmlkKS5hdWRpbztcbiAgICAgIHZpZGVvVHJhY2tTb3VyY2UgPSB0aGlzLl9yZW1vdGVTdHJlYW1Tb3VyY2VJbmZvLmdldChldmVudC5zdHJlYW0uaWQpLnZpZGVvO1xuICAgICAgdGhpcy5fcmVtb3RlU3RyZWFtU291cmNlSW5mby5kZWxldGUoZXZlbnQuc3RyZWFtLmlkKTtcbiAgICB9IGVsc2Uge1xuICAgICAgYXVkaW9UcmFja1NvdXJjZSA9IHRoaXMuX2dldEFuZERlbGV0ZVRyYWNrU291cmNlSW5mbyhcbiAgICAgICAgZXZlbnQuc3RyZWFtLmdldEF1ZGlvVHJhY2tzKCkpO1xuICAgICAgdmlkZW9UcmFja1NvdXJjZSA9IHRoaXMuX2dldEFuZERlbGV0ZVRyYWNrU291cmNlSW5mbyhldmVudC5zdHJlYW0uZ2V0VmlkZW9UcmFja3MoKSk7XG4gICAgfVxuICAgIGNvbnN0IHNvdXJjZUluZm8gPSBuZXcgU3RyZWFtTW9kdWxlLlN0cmVhbVNvdXJjZUluZm8oYXVkaW9UcmFja1NvdXJjZSxcbiAgICAgIHZpZGVvVHJhY2tTb3VyY2UpO1xuICAgIGlmIChVdGlscy5pc1NhZmFyaSgpKSB7XG4gICAgICBpZiAoIXNvdXJjZUluZm8uYXVkaW8pIHtcbiAgICAgICAgZXZlbnQuc3RyZWFtLmdldEF1ZGlvVHJhY2tzKCkuZm9yRWFjaCgodHJhY2spID0+IHtcbiAgICAgICAgICBldmVudC5zdHJlYW0ucmVtb3ZlVHJhY2sodHJhY2spO1xuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICAgIGlmICghc291cmNlSW5mby52aWRlbykge1xuICAgICAgICBldmVudC5zdHJlYW0uZ2V0VmlkZW9UcmFja3MoKS5mb3JFYWNoKCh0cmFjaykgPT4ge1xuICAgICAgICAgIGV2ZW50LnN0cmVhbS5yZW1vdmVUcmFjayh0cmFjayk7XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH1cbiAgICBjb25zdCBhdHRyaWJ1dGVzID0gdGhpcy5fcmVtb3RlU3RyZWFtQXR0cmlidXRlcy5nZXQoZXZlbnQuc3RyZWFtLmlkKTtcbiAgICBjb25zdCBzdHJlYW0gPSBuZXcgU3RyZWFtTW9kdWxlLlJlbW90ZVN0cmVhbSh1bmRlZmluZWQsIHRoaXMuX3JlbW90ZUlkLCBldmVudC5zdHJlYW0sXG4gICAgICBzb3VyY2VJbmZvLCBhdHRyaWJ1dGVzKTtcbiAgICBpZiAoc3RyZWFtKSB7XG4gICAgICB0aGlzLl9yZW1vdGVTdHJlYW1zLnB1c2goc3RyZWFtKTtcbiAgICAgIGNvbnN0IHN0cmVhbUV2ZW50ID0gbmV3IFN0cmVhbU1vZHVsZS5TdHJlYW1FdmVudCgnc3RyZWFtYWRkZWQnLCB7XG4gICAgICAgIHN0cmVhbTogc3RyZWFtXG4gICAgICB9KTtcbiAgICAgIHRoaXMuZGlzcGF0Y2hFdmVudChzdHJlYW1FdmVudCk7XG4gICAgfVxuICB9XG5cbiAgX29uUmVtb3RlU3RyZWFtUmVtb3ZlZChldmVudCkge1xuICAgIExvZ2dlci5kZWJ1ZygnUmVtb3RlIHN0cmVhbSByZW1vdmVkLicpO1xuICAgIGlmICghdGhpcy5fcmVtb3RlU3RyZWFtVHJhY2tzLmhhcyhldmVudC5zdHJlYW0uaWQpKSB7XG4gICAgICBMb2dnZXIud2FybmluZygnQ2Fubm90IGZpbmQgc3RyZWFtIGluZm8gd2hlbiBpdCBpcyBiZWluZyByZW1vdmVkLicpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBjb25zdCB0cmFja0lkcyA9IFtdO1xuICAgIHRoaXMuX3JlbW90ZVN0cmVhbVRyYWNrcy5nZXQoZXZlbnQuc3RyZWFtLmlkKS5mb3JFYWNoKCh0cmFja0lkKSA9PiB7XG4gICAgICB0cmFja0lkcy5wdXNoKHRyYWNrSWQpO1xuICAgIH0pO1xuICAgIHRoaXMuX3NlbmRTaWduYWxpbmdNZXNzYWdlKFNpZ25hbGluZ1R5cGUuVFJBQ0tTX1JFTU9WRUQsIHRyYWNrSWRzKTtcbiAgICB0aGlzLl9yZW1vdGVTdHJlYW1UcmFja3MuZGVsZXRlKGV2ZW50LnN0cmVhbS5pZCk7XG4gICAgY29uc3QgaT10aGlzLl9yZW1vdGVTdHJlYW1zLmZpbmRJbmRleCgocyk9PntcbiAgICAgIHJldHVybiBzLm1lZGlhU3RyZWFtLmlkPT09ZXZlbnQuc3RyZWFtLmlkO1xuICAgIH0pO1xuICAgIGlmIChpICE9PSAtMSkge1xuICAgICAgY29uc3Qgc3RyZWFtID0gdGhpcy5fcmVtb3RlU3RyZWFtc1tpXTtcbiAgICAgIGNvbnN0IGV2ZW50ID0gbmV3IEljc0V2ZW50KCdlbmRlZCcpO1xuICAgICAgc3RyZWFtLmRpc3BhdGNoRXZlbnQoZXZlbnQpO1xuICAgICAgdGhpcy5fcmVtb3RlU3RyZWFtcy5zcGxpY2UoaSwgMSk7XG4gICAgfVxuICB9XG5cbiAgX29uTmVnb3RpYXRpb25uZWVkZWQoKSB7XG4gICAgTG9nZ2VyLmRlYnVnKCdPbiBuZWdvdGlhdGlvbiBuZWVkZWQuJyk7XG5cbiAgICBpZiAodGhpcy5fcGMuc2lnbmFsaW5nU3RhdGUgPT09ICdzdGFibGUnICYmIHRoaXMuX25lZ290aWF0aW5nID09PSBmYWxzZSkge1xuICAgICAgdGhpcy5fbmVnb3RpYXRpbmcgPSB0cnVlO1xuICAgICAgdGhpcy5fZG9OZWdvdGlhdGUoKTtcbiAgICAgIHRoaXMuX2lzTmVnb3RpYXRpb25OZWVkZWQgPSBmYWxzZTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5faXNOZWdvdGlhdGlvbk5lZWRlZCA9IHRydWU7XG4gICAgfVxuICB9XG5cbiAgX29uUmVtb3RlSWNlQ2FuZGlkYXRlKGNhbmRpZGF0ZUluZm8pIHtcbiAgICBjb25zdCBjYW5kaWRhdGUgPSBuZXcgUlRDSWNlQ2FuZGlkYXRlKHtcbiAgICAgIGNhbmRpZGF0ZTogY2FuZGlkYXRlSW5mby5jYW5kaWRhdGUsXG4gICAgICBzZHBNaWQ6IGNhbmRpZGF0ZUluZm8uc2RwTWlkLFxuICAgICAgc2RwTUxpbmVJbmRleDogY2FuZGlkYXRlSW5mby5zZHBNTGluZUluZGV4XG4gICAgfSk7XG4gICAgaWYgKHRoaXMuX3BjLnJlbW90ZURlc2NyaXB0aW9uICYmIHRoaXMuX3BjLnJlbW90ZURlc2NyaXB0aW9uLnNkcCAhPT0gXCJcIikge1xuICAgICAgTG9nZ2VyLmRlYnVnKCdBZGQgcmVtb3RlIGljZSBjYW5kaWRhdGVzLicpO1xuICAgICAgdGhpcy5fcGMuYWRkSWNlQ2FuZGlkYXRlKGNhbmRpZGF0ZSkuY2F0Y2goZXJyb3IgPT4ge1xuICAgICAgICBMb2dnZXIud2FybmluZygnRXJyb3IgcHJvY2Vzc2luZyBJQ0UgY2FuZGlkYXRlOiAnICsgZXJyb3IpO1xuICAgICAgfSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIExvZ2dlci5kZWJ1ZygnQ2FjaGUgcmVtb3RlIGljZSBjYW5kaWRhdGVzLicpO1xuICAgICAgdGhpcy5fcmVtb3RlSWNlQ2FuZGlkYXRlcy5wdXNoKGNhbmRpZGF0ZSk7XG4gICAgfVxuICB9O1xuXG4gIF9vblNpZ25hbGluZ1N0YXRlQ2hhbmdlKGV2ZW50KSB7XG4gICAgTG9nZ2VyLmRlYnVnKCdTaWduYWxpbmcgc3RhdGUgY2hhbmdlZDogJyArIHRoaXMuX3BjLnNpZ25hbGluZ1N0YXRlKTtcbiAgICBpZiAodGhpcy5fcGMuc2lnbmFsaW5nU3RhdGUgPT09ICdjbG9zZWQnKSB7XG4gICAgICAvL3N0b3BDaGF0TG9jYWxseShwZWVyLCBwZWVyLmlkKTtcbiAgICB9IGVsc2UgaWYgKHRoaXMuX3BjLnNpZ25hbGluZ1N0YXRlID09PSAnc3RhYmxlJykge1xuICAgICAgdGhpcy5fbmVnb3RpYXRpbmcgPSBmYWxzZTtcbiAgICAgIGlmICh0aGlzLl9pc05lZ290aWF0aW9uTmVlZGVkKSB7XG4gICAgICAgIHRoaXMuX29uTmVnb3RpYXRpb25uZWVkZWQoKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuX2RyYWluUGVuZGluZ1N0cmVhbXMoKTtcbiAgICAgICAgdGhpcy5fZHJhaW5QZW5kaW5nTWVzc2FnZXMoKTtcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKHRoaXMuX3BjLnNpZ25hbGluZ1N0YXRlID09PSAnaGF2ZS1yZW1vdGUtb2ZmZXInKSB7XG4gICAgICB0aGlzLl9kcmFpblBlbmRpbmdSZW1vdGVJY2VDYW5kaWRhdGVzKCk7XG4gICAgfVxuICB9O1xuXG4gIF9vbkljZUNvbm5lY3Rpb25TdGF0ZUNoYW5nZShldmVudCkge1xuICAgIGlmIChldmVudC5jdXJyZW50VGFyZ2V0LmljZUNvbm5lY3Rpb25TdGF0ZSA9PT0gJ2Nsb3NlZCcgfHwgZXZlbnQuY3VycmVudFRhcmdldFxuICAgICAgLmljZUNvbm5lY3Rpb25TdGF0ZSA9PT0gJ2ZhaWxlZCcpIHtcbiAgICAgIGNvbnN0IGVycm9yID0gbmV3IEVycm9yTW9kdWxlLlAyUEVycm9yKEVycm9yTW9kdWxlLmVycm9ycy5QMlBfV0VCUlRDX1VOS05PV04sXG4gICAgICAgICdJQ0UgY29ubmVjdGlvbiBmYWlsZWQgb3IgY2xvc2VkLicpO1xuICAgICAgdGhpcy5fc3RvcChlcnJvciwgdHJ1ZSk7XG4gICAgfSBlbHNlIGlmIChldmVudC5jdXJyZW50VGFyZ2V0LmljZUNvbm5lY3Rpb25TdGF0ZSA9PT0gJ2Nvbm5lY3RlZCcgfHxcbiAgICAgIGV2ZW50LmN1cnJlbnRUYXJnZXRcbiAgICAgIC5pY2VDb25uZWN0aW9uU3RhdGUgPT09ICdjb21wbGV0ZWQnKSB7XG4gICAgICB0aGlzLl9zZW5kU2lnbmFsaW5nTWVzc2FnZShTaWduYWxpbmdUeXBlLlRSQUNLU19BRERFRCwgdGhpcy5fYWRkZWRUcmFja0lkcyk7XG4gICAgICB0aGlzLl9hZGRlZFRyYWNrSWRzID0gW107XG4gICAgfVxuICB9XG5cbiAgX29uRGF0YUNoYW5uZWxNZXNzYWdlKGV2ZW50KSB7XG4gICAgY29uc3QgbWVzc2FnZT1KU09OLnBhcnNlKGV2ZW50LmRhdGEpO1xuICAgIExvZ2dlci5kZWJ1ZygnRGF0YSBjaGFubmVsIG1lc3NhZ2UgcmVjZWl2ZWQ6ICcrbWVzc2FnZS5kYXRhKTtcbiAgICB0aGlzLl9zZW5kU2lnbmFsaW5nTWVzc2FnZShTaWduYWxpbmdUeXBlLkRBVEFfUkVDRUlWRUQsIG1lc3NhZ2UuaWQpO1xuICAgIGNvbnN0IG1lc3NhZ2VFdmVudCA9IG5ldyBNZXNzYWdlRXZlbnQoJ21lc3NhZ2VyZWNlaXZlZCcsIHtcbiAgICAgIG1lc3NhZ2U6IG1lc3NhZ2UuZGF0YSxcbiAgICAgIG9yaWdpbjogdGhpcy5fcmVtb3RlSWRcbiAgICB9KTtcbiAgICB0aGlzLmRpc3BhdGNoRXZlbnQobWVzc2FnZUV2ZW50KTtcbiAgfTtcblxuICBfb25EYXRhQ2hhbm5lbE9wZW4oZXZlbnQpIHtcbiAgICBMb2dnZXIuZGVidWcoXCJEYXRhIENoYW5uZWwgaXMgb3BlbmVkLlwiKTtcbiAgICBpZiAoZXZlbnQudGFyZ2V0LmxhYmVsID09PSBEYXRhQ2hhbm5lbExhYmVsLk1FU1NBR0UpIHtcbiAgICAgIExvZ2dlci5kZWJ1ZygnRGF0YSBjaGFubmVsIGZvciBtZXNzYWdlcyBpcyBvcGVuZWQuJyk7XG4gICAgICB0aGlzLl9kcmFpblBlbmRpbmdNZXNzYWdlcygpO1xuICAgIH1cbiAgfTtcblxuICBfb25EYXRhQ2hhbm5lbENsb3NlKGV2ZW50KSB7XG4gICAgTG9nZ2VyLmRlYnVnKCdEYXRhIENoYW5uZWwgaXMgY2xvc2VkLicpO1xuICB9O1xuXG4gIF9jcmVhdGVQZWVyQ29ubmVjdGlvbigpe1xuICAgIHRoaXMuX3BjID0gbmV3IFJUQ1BlZXJDb25uZWN0aW9uKHRoaXMuX2NvbmZpZy5ydGNDb25maWd1cmF0aW9uKTtcbiAgICAvLyBGaXJlZm94IDU5IGltcGxlbWVudGVkIGFkZFRyYW5zY2VpdmVyLiBIb3dldmVyLCBtaWQgaW4gU0RQIHdpbGwgZGlmZmVyIGZyb20gdHJhY2sncyBJRCBpbiB0aGlzIGNhc2UuIEFuZCB0cmFuc2NlaXZlcidzIG1pZCBpcyBudWxsLlxuICAgIGlmICh0eXBlb2YgdGhpcy5fcGMuYWRkVHJhbnNjZWl2ZXIgPT09ICdmdW5jdGlvbicgJiYgVXRpbHMuaXNTYWZhcmkoKSkge1xuICAgICAgdGhpcy5fcGMuYWRkVHJhbnNjZWl2ZXIoJ2F1ZGlvJyk7XG4gICAgICB0aGlzLl9wYy5hZGRUcmFuc2NlaXZlcigndmlkZW8nKTtcbiAgICB9XG4gICAgdGhpcy5fcGMub25hZGRzdHJlYW0gPSAoZXZlbnQpID0+IHtcbiAgICAgIHRoaXMuX29uUmVtb3RlU3RyZWFtQWRkZWQuYXBwbHkodGhpcywgW2V2ZW50XSk7XG4gICAgfTtcbiAgICB0aGlzLl9wYy5vbnRyYWNrID0gKGV2ZW50KSA9PiB7XG4gICAgICB0aGlzLl9vblJlbW90ZVRyYWNrQWRkZWQuYXBwbHkodGhpcywgW2V2ZW50XSk7XG4gICAgfTtcbiAgICB0aGlzLl9wYy5vbnJlbW92ZXN0cmVhbSA9IChldmVudCkgPT4ge1xuICAgICAgdGhpcy5fb25SZW1vdGVTdHJlYW1SZW1vdmVkLmFwcGx5KHRoaXMsIFtldmVudF0pO1xuICAgIH07XG4gICAgdGhpcy5fcGMub25uZWdvdGlhdGlvbm5lZWRlZCA9IChldmVudCk9PntcbiAgICAgIHRoaXMuX29uTmVnb3RpYXRpb25uZWVkZWQuYXBwbHkodGhpcywgW2V2ZW50XSk7XG4gICAgfTtcbiAgICB0aGlzLl9wYy5vbmljZWNhbmRpZGF0ZSA9IChldmVudCkgPT4ge1xuICAgICAgdGhpcy5fb25Mb2NhbEljZUNhbmRpZGF0ZS5hcHBseSh0aGlzLCBbZXZlbnRdKTtcbiAgICB9O1xuICAgIHRoaXMuX3BjLm9uc2lnbmFsaW5nc3RhdGVjaGFuZ2UgPSAoZXZlbnQpID0+IHtcbiAgICAgIHRoaXMuX29uU2lnbmFsaW5nU3RhdGVDaGFuZ2UuYXBwbHkodGhpcywgW2V2ZW50XSlcbiAgICB9O1xuICAgIHRoaXMuX3BjLm9uZGF0YWNoYW5uZWwgPSAoZXZlbnQpID0+IHtcbiAgICAgIExvZ2dlci5kZWJ1ZygnT24gZGF0YSBjaGFubmVsLicpO1xuICAgICAgLy8gU2F2ZSByZW1vdGUgY3JlYXRlZCBkYXRhIGNoYW5uZWwuXG4gICAgICBpZiAoIXRoaXMuX2RhdGFDaGFubmVscy5oYXMoZXZlbnQuY2hhbm5lbC5sYWJlbCkpIHtcbiAgICAgICAgdGhpcy5fZGF0YUNoYW5uZWxzLnNldChldmVudC5jaGFubmVsLmxhYmVsLCBldmVudC5jaGFubmVsKTtcbiAgICAgICAgTG9nZ2VyLmRlYnVnKCdTYXZlIHJlbW90ZSBjcmVhdGVkIGRhdGEgY2hhbm5lbC4nKTtcbiAgICAgIH1cbiAgICAgIHRoaXMuX2JpbmRFdmVudHNUb0RhdGFDaGFubmVsKGV2ZW50LmNoYW5uZWwpO1xuICAgIH07XG4gICAgdGhpcy5fcGMub25pY2Vjb25uZWN0aW9uc3RhdGVjaGFuZ2UgPSAoZXZlbnQpID0+IHtcbiAgICAgIHRoaXMuX29uSWNlQ29ubmVjdGlvblN0YXRlQ2hhbmdlLmFwcGx5KHRoaXMsIFtldmVudF0pO1xuICAgIH07XG4gICAgLypcbiAgICB0aGlzLl9wYy5vbmljZUNoYW5uZWxTdGF0ZWNoYW5nZSA9IGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgICBfb25JY2VDaGFubmVsU3RhdGVDaGFuZ2UocGVlciwgZXZlbnQpO1xuICAgIH07XG4gICAgID0gZnVuY3Rpb24oKSB7XG4gICAgICBvbk5lZ290aWF0aW9ubmVlZGVkKHBlZXJzW3BlZXIuaWRdKTtcbiAgICB9O1xuXG4gICAgLy9EYXRhQ2hhbm5lbFxuICAgIHRoaXMuX3BjLm9uZGF0YWNoYW5uZWwgPSBmdW5jdGlvbihldmVudCkge1xuICAgICAgTG9nZ2VyLmRlYnVnKG15SWQgKyAnOiBPbiBkYXRhIGNoYW5uZWwnKTtcbiAgICAgIC8vIFNhdmUgcmVtb3RlIGNyZWF0ZWQgZGF0YSBjaGFubmVsLlxuICAgICAgaWYgKCFwZWVyLmRhdGFDaGFubmVsc1tldmVudC5jaGFubmVsLmxhYmVsXSkge1xuICAgICAgICBwZWVyLmRhdGFDaGFubmVsc1tldmVudC5jaGFubmVsLmxhYmVsXSA9IGV2ZW50LmNoYW5uZWw7XG4gICAgICAgIExvZ2dlci5kZWJ1ZygnU2F2ZSByZW1vdGUgY3JlYXRlZCBkYXRhIGNoYW5uZWwuJyk7XG4gICAgICB9XG4gICAgICBiaW5kRXZlbnRzVG9EYXRhQ2hhbm5lbChldmVudC5jaGFubmVsLCBwZWVyKTtcbiAgICB9OyovXG4gIH1cblxuICBfZHJhaW5QZW5kaW5nU3RyZWFtcygpIHtcbiAgICBMb2dnZXIuZGVidWcoJ0RyYWluaW5nIHBlbmRpbmcgc3RyZWFtcy4nKTtcbiAgICBpZiAodGhpcy5fcGMgJiYgdGhpcy5fcGMuc2lnbmFsaW5nU3RhdGUgPT09ICdzdGFibGUnKSB7XG4gICAgICBMb2dnZXIuZGVidWcoJ1BlZXIgY29ubmVjdGlvbiBpcyByZWFkeSBmb3IgZHJhaW5pbmcgcGVuZGluZyBzdHJlYW1zLicpO1xuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLl9wZW5kaW5nU3RyZWFtcy5sZW5ndGg7IGkrKykge1xuICAgICAgICBjb25zdCBzdHJlYW0gPSB0aGlzLl9wZW5kaW5nU3RyZWFtc1tpXTtcbiAgICAgICAgLy8gT25OZWdvdGlhdGlvbk5lZWRlZCBldmVudCB3aWxsIGJlIHRyaWdnZXJlZCBpbW1lZGlhdGVseSBhZnRlciBhZGRpbmcgc3RyZWFtIHRvIFBlZXJDb25uZWN0aW9uIGluIEZpcmVmb3guXG4gICAgICAgIC8vIEFuZCBPbk5lZ290aWF0aW9uTmVlZGVkIGhhbmRsZXIgd2lsbCBleGVjdXRlIGRyYWluUGVuZGluZ1N0cmVhbXMuIFRvIGF2b2lkIGFkZCB0aGUgc2FtZSBzdHJlYW0gbXVsdGlwbGUgdGltZXMsXG4gICAgICAgIC8vIHNoaWZ0IGl0IGZyb20gcGVuZGluZyBzdHJlYW0gbGlzdCBiZWZvcmUgYWRkaW5nIGl0IHRvIFBlZXJDb25uZWN0aW9uLlxuICAgICAgICB0aGlzLl9wZW5kaW5nU3RyZWFtcy5zaGlmdCgpO1xuICAgICAgICBpZiAoIXN0cmVhbS5tZWRpYVN0cmVhbSkge1xuICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuX3BjLmFkZFN0cmVhbShzdHJlYW0ubWVkaWFTdHJlYW0pO1xuICAgICAgICBMb2dnZXIuZGVidWcoJ0FkZGVkIHN0cmVhbSB0byBwZWVyIGNvbm5lY3Rpb24uJyk7XG4gICAgICAgIHRoaXMuX3B1Ymxpc2hpbmdTdHJlYW1zLnB1c2goc3RyZWFtKTtcbiAgICAgIH1cbiAgICAgIHRoaXMuX3BlbmRpbmdTdHJlYW1zLmxlbmd0aCA9IDA7XG4gICAgICBmb3IgKGxldCBqID0gMDsgaiA8IHRoaXMuX3BlbmRpbmdVbnB1Ymxpc2hTdHJlYW1zLmxlbmd0aDsgaisrKSB7XG4gICAgICAgIGlmICghdGhpcy5fcGVuZGluZ1VucHVibGlzaFN0cmVhbXNbal0ubWVkaWFTdHJlYW0pIHtcbiAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLl9wYy5yZW1vdmVTdHJlYW0odGhpcy5fcGVuZGluZ1VucHVibGlzaFN0cmVhbXNbal0ubWVkaWFTdHJlYW0pO1xuICAgICAgICB0aGlzLl9wdWJsaXNoZWRTdHJlYW1zLmRlbGV0ZSh0aGlzLl9wZW5kaW5nVW5wdWJsaXNoU3RyZWFtc1tqXSk7XG4gICAgICAgIExvZ2dlci5kZWJ1ZygnUmVtb3ZlIHN0cmVhbS4nKTtcbiAgICAgIH1cbiAgICAgIHRoaXMuX3BlbmRpbmdVbnB1Ymxpc2hTdHJlYW1zLmxlbmd0aCA9IDA7XG4gICAgfVxuICB9XG5cbiAgX2RyYWluUGVuZGluZ1JlbW90ZUljZUNhbmRpZGF0ZXMoKSB7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLl9yZW1vdGVJY2VDYW5kaWRhdGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICBMb2dnZXIuZGVidWcoJ0FkZCBjYW5kaWRhdGUnKTtcbiAgICAgIHRoaXMuX3BjLmFkZEljZUNhbmRpZGF0ZSh0aGlzLl9yZW1vdGVJY2VDYW5kaWRhdGVzW2ldKS5jYXRjaChlcnJvcj0+e1xuICAgICAgICBMb2dnZXIud2FybmluZygnRXJyb3IgcHJvY2Vzc2luZyBJQ0UgY2FuZGlkYXRlOiAnK2Vycm9yKTtcbiAgICAgIH0pO1xuICAgIH1cbiAgICB0aGlzLl9yZW1vdGVJY2VDYW5kaWRhdGVzLmxlbmd0aCA9IDA7XG4gIH1cblxuICBfZHJhaW5QZW5kaW5nTWVzc2FnZXMoKXtcbiAgICBMb2dnZXIuZGVidWcoJ0RyYWluaW5nIHBlbmRpbmcgbWVzc2FnZXMuJyk7XG4gICAgaWYgKHRoaXMuX3BlbmRpbmdNZXNzYWdlcy5sZW5ndGggPT0gMCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBjb25zdCBkYyA9IHRoaXMuX2RhdGFDaGFubmVscy5nZXQoRGF0YUNoYW5uZWxMYWJlbC5NRVNTQUdFKTtcbiAgICBpZiAoZGMgJiYgZGMucmVhZHlTdGF0ZSA9PT0gJ29wZW4nKSB7XG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMuX3BlbmRpbmdNZXNzYWdlcy5sZW5ndGg7IGkrKykge1xuICAgICAgICBMb2dnZXIuZGVidWcoJ1NlbmRpbmcgbWVzc2FnZSB2aWEgZGF0YSBjaGFubmVsOiAnK3RoaXMuX3BlbmRpbmdNZXNzYWdlc1tpXSk7XG4gICAgICAgIGRjLnNlbmQoSlNPTi5zdHJpbmdpZnkodGhpcy5fcGVuZGluZ01lc3NhZ2VzW2ldKSk7XG4gICAgICB9XG4gICAgICB0aGlzLl9wZW5kaW5nTWVzc2FnZXMubGVuZ3RoID0gMDtcbiAgICB9IGVsc2UgaWYodGhpcy5fcGMmJiFkYyl7XG4gICAgICB0aGlzLl9jcmVhdGVEYXRhQ2hhbm5lbChEYXRhQ2hhbm5lbExhYmVsLk1FU1NBR0UpO1xuICAgIH1cbiAgfVxuXG4gIF9zZW5kU3RyZWFtSW5mbyhzdHJlYW0pIHtcbiAgICBpZiAoIXN0cmVhbSB8fCAhc3RyZWFtLm1lZGlhU3RyZWFtKSB7XG4gICAgICByZXR1cm4gbmV3IEVycm9yTW9kdWxlLlAyUEVycm9yKEVycm9yTW9kdWxlLmVycm9ycy5QMlBfQ0xJRU5UX0lMTEVHQUxfQVJHVU1FTlQpO1xuICAgIH1cbiAgICBjb25zdCBpbmZvID0gW107XG4gICAgc3RyZWFtLm1lZGlhU3RyZWFtLmdldFRyYWNrcygpLm1hcCgodHJhY2spID0+IHtcbiAgICAgIGluZm8ucHVzaCh7XG4gICAgICAgIGlkOiB0cmFjay5pZCxcbiAgICAgICAgc291cmNlOiBzdHJlYW0uc291cmNlW3RyYWNrLmtpbmRdXG4gICAgICB9KTtcbiAgICB9KTtcbiAgICByZXR1cm4gUHJvbWlzZS5hbGwoW3RoaXMuX3NlbmRTaWduYWxpbmdNZXNzYWdlKFNpZ25hbGluZ1R5cGUuVFJBQ0tfU09VUkNFUyxcbiAgICAgICAgaW5mbyksXG4gICAgICB0aGlzLl9zZW5kU2lnbmFsaW5nTWVzc2FnZShTaWduYWxpbmdUeXBlLlNUUkVBTV9JTkZPLCB7XG4gICAgICAgIGlkOiBzdHJlYW0ubWVkaWFTdHJlYW0uaWQsXG4gICAgICAgIGF0dHJpYnV0ZXM6IHN0cmVhbS5hdHRyaWJ1dGVzLFxuICAgICAgICAvLyBUcmFjayBJRHMgbWF5IGJlIHVzZWZ1bCBpbiB0aGUgZnV0dXJlIHdoZW4gb25hZGRzdHJlYW0gaXMgcmVtb3ZlZC4gSXQgbWFpbnRhaW5zIHRoZSByZWxhdGlvbnNoaXAgb2YgdHJhY2tzIGFuZCBzdHJlYW1zLlxuICAgICAgICB0cmFja3M6IEFycmF5LmZyb20oaW5mbywgaXRlbSA9PiBpdGVtLmlkKSxcbiAgICAgICAgLy8gVGhpcyBpcyBhIHdvcmthcm91bmQgZm9yIFNhZmFyaS4gUGxlYXNlIHVzZSB0cmFjay1zb3VyY2VzIGlmIHBvc3NpYmxlLlxuICAgICAgICBzb3VyY2U6IHN0cmVhbS5zb3VyY2VcbiAgICAgIH0pXG4gICAgXSk7XG4gIH1cblxuXG4gIF9zZW5kU3lzSW5mb0lmTmVjZXNzYXJ5KCkge1xuICAgIGlmICh0aGlzLl9pbmZvU2VudCkge1xuICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSgpO1xuICAgIH1cbiAgICB0aGlzLl9pbmZvU2VudCA9IHRydWU7XG4gICAgcmV0dXJuIHRoaXMuX3NlbmRTaWduYWxpbmdNZXNzYWdlKFNpZ25hbGluZ1R5cGUuVUEsIHN5c0luZm8pO1xuICB9XG5cbiAgX3NlbmRDbG9zZWRNc2dJZk5lY2Vzc2FyeSgpIHtcbiAgICBpZiAodGhpcy5fcGMucmVtb3RlRGVzY3JpcHRpb24gPT09IG51bGwgfHwgdGhpcy5fcGMucmVtb3RlRGVzY3JpcHRpb24uc2RwID09PSBcIlwiKSB7XG4gICAgICByZXR1cm4gdGhpcy5fc2VuZFNpZ25hbGluZ01lc3NhZ2UoU2lnbmFsaW5nVHlwZS5DTE9TRUQpO1xuICAgIH1cbiAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKCk7XG4gIH1cblxuICBfaGFuZGxlUmVtb3RlQ2FwYWJpbGl0eSh1YSkge1xuICAgIGlmICh1YS5zZGsgJiYgdWEuc2RrICYmIHVhLnNkay50eXBlID09PSBcIkphdmFTY3JpcHRcIiAmJiB1YS5ydW50aW1lICYmIHVhLnJ1bnRpbWVcbiAgICAgIC5uYW1lID09PSBcIkZpcmVmb3hcIikge1xuICAgICAgdGhpcy5fcmVtb3RlU2lkZVN1cHBvcnRzUmVtb3ZlU3RyZWFtID0gZmFsc2U7XG4gICAgICB0aGlzLl9yZW1vdGVTaWRlU3VwcG9ydHNQbGFuQiA9IGZhbHNlO1xuICAgICAgdGhpcy5fcmVtb3RlU2lkZVN1cHBvcnRzVW5pZmllZFBsYW4gPSB0cnVlO1xuICAgIH0gZWxzZSB7IC8vIFJlbW90ZSBzaWRlIGlzIGlPUy9BbmRyb2lkL0MrKyB3aGljaCB1c2VzIEdvb2dsZSdzIFdlYlJUQyBzdGFjay5cbiAgICAgIHRoaXMuX3JlbW90ZVNpZGVTdXBwb3J0c1JlbW92ZVN0cmVhbSA9IHRydWU7XG4gICAgICB0aGlzLl9yZW1vdGVTaWRlU3VwcG9ydHNQbGFuQiA9IHRydWU7XG4gICAgICB0aGlzLl9yZW1vdGVTaWRlU3VwcG9ydHNVbmlmaWVkUGxhbiA9IGZhbHNlO1xuICAgIH1cbiAgfVxuXG4gIF9kb05lZ290aWF0ZSgpIHtcbiAgICBpZiAodGhpcy5faXNDYWxsZXIpIHtcbiAgICAgIHRoaXMuX2NyZWF0ZUFuZFNlbmRPZmZlcigpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLl9zZW5kU2lnbmFsaW5nTWVzc2FnZShTaWduYWxpbmdUeXBlLk5FR09USUFUSU9OX05FRURFRCk7XG4gICAgfVxuICB9O1xuXG4gIF9zZXRDb2RlY09yZGVyKHNkcCkge1xuICAgIGlmICh0aGlzLl9jb25maWcuYXVkaW9FbmNvZGluZ3MpIHtcbiAgICAgIGNvbnN0IGF1ZGlvQ29kZWNOYW1lcyA9IEFycmF5LmZyb20odGhpcy5fY29uZmlnLmF1ZGlvRW5jb2RpbmdzLFxuICAgICAgICBlbmNvZGluZ1BhcmFtZXRlcnMgPT4gZW5jb2RpbmdQYXJhbWV0ZXJzLmNvZGVjLm5hbWUpO1xuICAgICAgc2RwID0gU2RwVXRpbHMucmVvcmRlckNvZGVjcyhzZHAsICdhdWRpbycsIGF1ZGlvQ29kZWNOYW1lcyk7XG4gICAgfVxuICAgIGlmICh0aGlzLl9jb25maWcudmlkZW9FbmNvZGluZ3MpIHtcbiAgICAgIGNvbnN0IHZpZGVvQ29kZWNOYW1lcyA9IEFycmF5LmZyb20odGhpcy5fY29uZmlnLnZpZGVvRW5jb2RpbmdzLFxuICAgICAgICBlbmNvZGluZ1BhcmFtZXRlcnMgPT4gZW5jb2RpbmdQYXJhbWV0ZXJzLmNvZGVjLm5hbWUpO1xuICAgICAgc2RwID0gU2RwVXRpbHMucmVvcmRlckNvZGVjcyhzZHAsICd2aWRlbycsIHZpZGVvQ29kZWNOYW1lcyk7XG4gICAgfVxuICAgIHJldHVybiBzZHA7XG4gIH1cblxuICBfc2V0TWF4Qml0cmF0ZShzZHAsIG9wdGlvbnMpIHtcbiAgICBpZiAodHlwZW9mIG9wdGlvbnMuYXVkaW9FbmNvZGluZ3MgPT09ICdvYmplY3QnKSB7XG4gICAgICBzZHAgPSBTZHBVdGlscy5zZXRNYXhCaXRyYXRlKHNkcCwgb3B0aW9ucy5hdWRpb0VuY29kaW5ncyk7XG4gICAgfVxuICAgIGlmICh0eXBlb2Ygb3B0aW9ucy52aWRlb0VuY29kaW5ncyA9PT0gJ29iamVjdCcpIHtcbiAgICAgIHNkcCA9IFNkcFV0aWxzLnNldE1heEJpdHJhdGUoc2RwLCBvcHRpb25zLnZpZGVvRW5jb2RpbmdzKTtcbiAgICB9XG4gICAgcmV0dXJuIHNkcDtcbiAgfVxuXG4gIF9zZXRSdHBTZW5kZXJPcHRpb25zKHNkcCwgb3B0aW9ucykge1xuICAgIHNkcCA9IHRoaXMuX3NldE1heEJpdHJhdGUoc2RwLCBvcHRpb25zKTtcbiAgICByZXR1cm4gc2RwO1xuICB9XG5cbiAgX3NldFJ0cFJlY2VpdmVyT3B0aW9ucyhzZHApIHtcbiAgICBzZHAgPSB0aGlzLl9zZXRDb2RlY09yZGVyKHNkcCk7XG4gICAgcmV0dXJuIHNkcDtcbiAgfVxuXG4gIF9jcmVhdGVBbmRTZW5kT2ZmZXIoKSB7XG4gICAgaWYgKCF0aGlzLl9wYykge1xuICAgICAgTG9nZ2VyLmVycm9yKCdQZWVyIGNvbm5lY3Rpb24gaGF2ZSBub3QgYmVlbiBjcmVhdGVkLicpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICB0aGlzLl9pc05lZ290aWF0aW9uTmVlZGVkID0gZmFsc2U7XG4gICAgdGhpcy5faXNDYWxsZXIgPSB0cnVlO1xuICAgIGxldCBsb2NhbERlc2M7XG4gICAgdGhpcy5fcGMuY3JlYXRlT2ZmZXIob2ZmZXJPcHRpb25zKS50aGVuKGRlc2MgPT4ge1xuICAgICAgZGVzYy5zZHAgPSB0aGlzLl9zZXRSdHBSZWNlaXZlck9wdGlvbnMoZGVzYy5zZHApO1xuICAgICAgbG9jYWxEZXNjID0gZGVzYztcbiAgICAgIHJldHVybiB0aGlzLl9wYy5zZXRMb2NhbERlc2NyaXB0aW9uKGRlc2MpO1xuICAgIH0pLnRoZW4oKCkgPT4ge1xuICAgICAgcmV0dXJuIHRoaXMuX3NlbmRTZHAobG9jYWxEZXNjKTtcbiAgICB9KS5jYXRjaChlID0+IHtcbiAgICAgIExvZ2dlci5lcnJvcihlLm1lc3NhZ2UgKyAnIFBsZWFzZSBjaGVjayB5b3VyIGNvZGVjIHNldHRpbmdzLicpO1xuICAgICAgY29uc3QgZXJyb3IgPSBuZXcgRXJyb3JNb2R1bGUuUDJQRXJyb3IoRXJyb3JNb2R1bGUuZXJyb3JzLlAyUF9XRUJSVENfU0RQLFxuICAgICAgICBlLm1lc3NhZ2UpO1xuICAgICAgdGhpcy5fc3RvcChlcnJvciwgdHJ1ZSk7XG4gICAgfSk7XG4gIH1cblxuICBfY3JlYXRlQW5kU2VuZEFuc3dlcigpIHtcbiAgICB0aGlzLl9kcmFpblBlbmRpbmdTdHJlYW1zKCk7XG4gICAgdGhpcy5faXNOZWdvdGlhdGlvbk5lZWRlZCA9IGZhbHNlO1xuICAgIHRoaXMuX2lzQ2FsbGVyID0gZmFsc2U7XG4gICAgbGV0IGxvY2FsRGVzYztcbiAgICB0aGlzLl9wYy5jcmVhdGVBbnN3ZXIoKS50aGVuKGRlc2MgPT4ge1xuICAgICAgZGVzYy5zZHAgPSB0aGlzLl9zZXRSdHBSZWNlaXZlck9wdGlvbnMoZGVzYy5zZHApO1xuICAgICAgbG9jYWxEZXNjPWRlc2M7XG4gICAgICByZXR1cm4gdGhpcy5fcGMuc2V0TG9jYWxEZXNjcmlwdGlvbihkZXNjKTtcbiAgICB9KS50aGVuKCgpPT57XG4gICAgICByZXR1cm4gdGhpcy5fc2VuZFNkcChsb2NhbERlc2MpO1xuICAgIH0pLmNhdGNoKGUgPT4ge1xuICAgICAgTG9nZ2VyLmVycm9yKGUubWVzc2FnZSArICcgUGxlYXNlIGNoZWNrIHlvdXIgY29kZWMgc2V0dGluZ3MuJyk7XG4gICAgICBjb25zdCBlcnJvciA9IG5ldyBFcnJvck1vZHVsZS5QMlBFcnJvcihFcnJvck1vZHVsZS5lcnJvcnMuUDJQX1dFQlJUQ19TRFAsXG4gICAgICAgIGUubWVzc2FnZSk7XG4gICAgICB0aGlzLl9zdG9wKGVycm9yLCB0cnVlKTtcbiAgICB9KTtcbiAgfVxuXG5cbiAgX2dldEFuZERlbGV0ZVRyYWNrU291cmNlSW5mbyh0cmFja3MpIHtcbiAgICBpZiAodHJhY2tzLmxlbmd0aCA+IDApIHtcbiAgICAgIGNvbnN0IHRyYWNrSWQgPSB0cmFja3NbMF0uaWQ7XG4gICAgICBpZiAodGhpcy5fcmVtb3RlVHJhY2tTb3VyY2VJbmZvLmhhcyh0cmFja0lkKSkge1xuICAgICAgICBjb25zdCBzb3VyY2VJbmZvID0gdGhpcy5fcmVtb3RlVHJhY2tTb3VyY2VJbmZvLmdldCh0cmFja0lkKTtcbiAgICAgICAgdGhpcy5fcmVtb3RlVHJhY2tTb3VyY2VJbmZvLmRlbGV0ZSh0cmFja0lkKTtcbiAgICAgICAgcmV0dXJuIHNvdXJjZUluZm87XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBMb2dnZXIud2FybmluZygnQ2Fubm90IGZpbmQgc291cmNlIGluZm8gZm9yICcgKyB0cmFja0lkKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBfdW5wdWJsaXNoKHN0cmVhbSkge1xuICAgIGlmIChuYXZpZ2F0b3IubW96R2V0VXNlck1lZGlhIHx8ICF0aGlzLl9yZW1vdGVTaWRlU3VwcG9ydHNSZW1vdmVTdHJlYW0pIHtcbiAgICAgIC8vIEFjdHVhbGx5IHVucHVibGlzaCBpcyBzdXBwb3J0ZWQuIEl0IGlzIGEgbGl0dGxlIGJpdCBjb21wbGV4IHNpbmNlIEZpcmVmb3ggaW1wbGVtZW50ZWQgV2ViUlRDIHNwZWMgd2hpbGUgQ2hyb21lIGltcGxlbWVudGVkIGFuIG9sZCBBUEkuXG4gICAgICBMb2dnZXIuZXJyb3IoXG4gICAgICAgICdTdG9wcGluZyBhIHB1YmxpY2F0aW9uIGlzIG5vdCBzdXBwb3J0ZWQgb24gRmlyZWZveC4gUGxlYXNlIHVzZSBQMlBDbGllbnQuc3RvcCgpIHRvIHN0b3AgdGhlIGNvbm5lY3Rpb24gd2l0aCByZW1vdGUgZW5kcG9pbnQuJ1xuICAgICAgKTtcbiAgICAgIHJldHVybiBQcm9taXNlLnJlamVjdChuZXcgRXJyb3JNb2R1bGUuUDJQRXJyb3IoRXJyb3JNb2R1bGUuZXJyb3JzLlAyUF9DTElFTlRfVU5TVVBQT1JURURfTUVUSE9EKSk7XG4gICAgfVxuICAgIGlmICghdGhpcy5fcHVibGlzaGVkU3RyZWFtcy5oYXMoc3RyZWFtKSkge1xuICAgICAgcmV0dXJuIFByb21pc2UucmVqZWN0KG5ldyBFcnJvck1vZHVsZS5QMlBFcnJvcihFcnJvck1vZHVsZS5lcnJvcnMuUDJQX0NMSUVOVF9JTExFR0FMX0FSR1VNRU5UKSk7XG4gICAgfVxuICAgIHRoaXMuX3BlbmRpbmdVbnB1Ymxpc2hTdHJlYW1zLnB1c2goc3RyZWFtKTtcbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgdGhpcy5fdW5wdWJsaXNoUHJvbWlzZXMuc2V0KHN0cmVhbS5tZWRpYVN0cmVhbS5pZCwge1xuICAgICAgICByZXNvbHZlOiByZXNvbHZlLFxuICAgICAgICByZWplY3Q6IHJlamVjdFxuICAgICAgfSk7XG4gICAgICB0aGlzLl9kcmFpblBlbmRpbmdTdHJlYW1zKCk7XG4gICAgfSk7XG4gIH07XG5cbiAgLy8gTWFrZSBzdXJlIHxfcGN8IGlzIGF2YWlsYWJsZSBiZWZvcmUgY2FsbGluZyB0aGlzIG1ldGhvZC5cbiAgX2NyZWF0ZURhdGFDaGFubmVsKGxhYmVsKSB7XG4gICAgaWYgKHRoaXMuX2RhdGFDaGFubmVscy5oYXMobGFiZWwpKSB7XG4gICAgICBMb2dnZXIud2FybmluZygnRGF0YSBjaGFubmVsIGxhYmVsZWQgJysgbGFiZWwrJyBhbHJlYWR5IGV4aXN0cy4nKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgaWYoIXRoaXMuX3BjKXtcbiAgICAgIExvZ2dlci5kZWJ1ZygnUGVlckNvbm5lY3Rpb24gaXMgbm90IGF2YWlsYWJsZSBiZWZvcmUgY3JlYXRpbmcgRGF0YUNoYW5uZWwuJyk7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIExvZ2dlci5kZWJ1ZygnQ3JlYXRlIGRhdGEgY2hhbm5lbC4nKTtcbiAgICBjb25zdCBkYyA9IHRoaXMuX3BjLmNyZWF0ZURhdGFDaGFubmVsKGxhYmVsKTtcbiAgICB0aGlzLl9iaW5kRXZlbnRzVG9EYXRhQ2hhbm5lbChkYyk7XG4gICAgdGhpcy5fZGF0YUNoYW5uZWxzLnNldChEYXRhQ2hhbm5lbExhYmVsLk1FU1NBR0UsZGMpO1xuICB9XG5cbiAgX2JpbmRFdmVudHNUb0RhdGFDaGFubmVsKGRjKXtcbiAgICBkYy5vbm1lc3NhZ2UgPSAoZXZlbnQpID0+IHtcbiAgICAgIHRoaXMuX29uRGF0YUNoYW5uZWxNZXNzYWdlLmFwcGx5KHRoaXMsIFtldmVudF0pO1xuICAgIH07XG4gICAgZGMub25vcGVuID0gKGV2ZW50KSA9PiB7XG4gICAgICB0aGlzLl9vbkRhdGFDaGFubmVsT3Blbi5hcHBseSh0aGlzLCBbZXZlbnRdKTtcbiAgICB9O1xuICAgIGRjLm9uY2xvc2UgPSAoZXZlbnQpID0+IHtcbiAgICAgIHRoaXMuX29uRGF0YUNoYW5uZWxDbG9zZS5hcHBseSh0aGlzLCBbZXZlbnRdKTtcbiAgICB9O1xuICAgIGRjLm9uZXJyb3IgPSAoZXZlbnQpID0+IHtcbiAgICAgIExvZ2dlci5kZWJ1ZyhcIkRhdGEgQ2hhbm5lbCBFcnJvcjpcIiwgZXJyb3IpO1xuICAgIH07XG4gIH1cblxuICBfYXJlQWxsVHJhY2tzRW5kZWQobWVkaWFTdHJlYW0pIHtcbiAgICBmb3IgKGNvbnN0IHRyYWNrIG9mIG1lZGlhU3RyZWFtLmdldFRyYWNrcygpKSB7XG4gICAgICBpZiAodHJhY2sucmVhZHlTdGF0ZSA9PT0gJ2xpdmUnKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cblxuICBfc3RvcChlcnJvciwgbm90aWZ5UmVtb3RlKSB7XG4gICAgbGV0IHByb21pc2VFcnJvciA9IGVycm9yO1xuICAgIGlmICghcHJvbWlzZUVycm9yKSB7XG4gICAgICBwcm9taXNlRXJyb3IgPSBuZXcgRXJyb3JNb2R1bGUuUDJQRXJyb3IoRXJyb3JNb2R1bGUuZXJyb3JzLlAyUF9DTElFTlRfVU5LTk9XTik7XG4gICAgfVxuICAgIGZvciAoY29uc3QgW2xhYmVsLCBkY10gb2YgdGhpcy5fZGF0YUNoYW5uZWxzKSB7XG4gICAgICBkYy5jbG9zZSgpO1xuICAgIH1cbiAgICB0aGlzLl9kYXRhQ2hhbm5lbHMuY2xlYXIoKTtcbiAgICBpZiAodGhpcy5fcGMgJiYgdGhpcy5fcGMuaWNlQ29ubmVjdGlvblN0YXRlICE9PSAnY2xvc2VkJykge1xuICAgICAgdGhpcy5fcGMuY2xvc2UoKTtcbiAgICB9XG4gICAgZm9yIChjb25zdCBbaWQsIHByb21pc2VdIG9mIHRoaXMuX3B1Ymxpc2hQcm9taXNlcykge1xuICAgICAgcHJvbWlzZS5yZWplY3QocHJvbWlzZUVycm9yKTtcbiAgICB9XG4gICAgdGhpcy5fcHVibGlzaFByb21pc2VzLmNsZWFyKCk7XG4gICAgZm9yIChjb25zdCBbaWQsIHByb21pc2VdIG9mIHRoaXMuX3VucHVibGlzaFByb21pc2VzKSB7XG4gICAgICBwcm9taXNlLnJlamVjdChwcm9taXNlRXJyb3IpO1xuICAgIH1cbiAgICB0aGlzLl91bnB1Ymxpc2hQcm9taXNlcy5jbGVhcigpO1xuICAgIGZvciAoY29uc3QgW2lkLCBwcm9taXNlXSBvZiB0aGlzLl9zZW5kRGF0YVByb21pc2VzKSB7XG4gICAgICBwcm9taXNlLnJlamVjdChwcm9taXNlRXJyb3IpO1xuICAgIH1cbiAgICB0aGlzLl9zZW5kRGF0YVByb21pc2VzLmNsZWFyKCk7XG4gICAgLy8gRmlyZSBlbmRlZCBldmVudCBpZiBwdWJsaWNhdGlvbiBvciByZW1vdGUgc3RyZWFtIGV4aXN0cy5cbiAgICB0aGlzLl9wdWJsaXNoZWRTdHJlYW1zLmZvckVhY2gocHVibGljYXRpb24gPT4ge1xuICAgICAgcHVibGljYXRpb24uZGlzcGF0Y2hFdmVudChuZXcgSWNzRXZlbnQoJ2VuZGVkJykpO1xuICAgIH0pO1xuICAgIHRoaXMuX3B1Ymxpc2hlZFN0cmVhbXMuY2xlYXIoKTtcbiAgICB0aGlzLl9yZW1vdGVTdHJlYW1zLmZvckVhY2goc3RyZWFtID0+IHtcbiAgICAgIHN0cmVhbS5kaXNwYXRjaEV2ZW50KG5ldyBJY3NFdmVudCgnZW5kZWQnKSk7XG4gICAgfSk7XG4gICAgdGhpcy5fcmVtb3RlU3RyZWFtcyA9IFtdO1xuICAgIGlmIChub3RpZnlSZW1vdGUpIHtcbiAgICAgIGxldCBzZW5kRXJyb3I7XG4gICAgICBpZiAoZXJyb3IpIHtcbiAgICAgICAgc2VuZEVycm9yID0gSlNPTi5wYXJzZShKU09OLnN0cmluZ2lmeShlcnJvcikpO1xuICAgICAgICAvLyBBdm9pZCB0byBsZWFrIGRldGFpbGVkIGVycm9yIHRvIHJlbW90ZSBzaWRlLlxuICAgICAgICBzZW5kRXJyb3IubWVzc2FnZSA9ICdFcnJvciBoYXBwZW5lZCBhdCByZW1vdGUgc2lkZS4nO1xuICAgICAgfVxuICAgICAgdGhpcy5fc2VuZFNpZ25hbGluZ01lc3NhZ2UoU2lnbmFsaW5nVHlwZS5DTE9TRUQsIHNlbmRFcnJvcikuY2F0Y2goZXJyID0+IHtcbiAgICAgICAgTG9nZ2VyLmRlYnVnKCdGYWlsZWQgdG8gc2VuZCBjbG9zZS4nICsgZXJyLm1lc3NhZ2UpO1xuICAgICAgfSk7XG4gICAgfVxuICAgIHRoaXMuZGlzcGF0Y2hFdmVudChuZXcgRXZlbnQoJ2VuZGVkJykpO1xuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IFAyUFBlZXJDb25uZWN0aW9uQ2hhbm5lbDtcbiJdfQ==
