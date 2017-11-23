/*
 * Intel WebRTC SDK version 3.3.0
 * Copyright (c) 2017 Intel <http://webrtc.intel.com>
 * Homepage: http://webrtc.intel.com
 */


(function(window) {


var Woogeen = (function() {
  'use strict';

  var Woogeen = {};

  Object.defineProperties(Woogeen, {
    version: {
      get: function() {
        return '3.3.0';
      }
    },
    name: {
      get: function() {
        return 'Intel WebRTC SDK';
      }
    }
  });

  return Woogeen;
})();

var L = {};
var Erizo = {};



/*
 * Class EventDispatcher provides event handling to sub-classes.
 * It is inherited from Publisher, Room, etc.
 */
Woogeen.EventDispatcher = function(spec) {
  'use strict';
  var that = {};
  // Private vars
  spec.dispatcher = {};
  spec.dispatcher.eventListeners = {};

  // Public functions

  /**
     * @function addEventListener
     * @desc This function registers a callback function as a handler for the corresponding event. It's shortened form is on(eventType, listener). See the event description in the following table.<br>
     @htmlonly
  <table class="doxtable">
      <thead>
          <tr valign="top">
              <th><b>Event name</b></th>
              <th><b>Description</b></th>
          </tr>
          <tr valign="top">
              <td>server-disconnected</td>
              <td>Indicates the client has been disconnected to the server.</td>
          </tr>
          <tr valign="top">
              <td>user-joined</td>
              <td>Indicates that there is a new user joined. </td>
          </tr>
          <tr valign="top">
              <td>user-left</td>
              <td>Indicates that a user has left conference.</td>
          </tr>
          <tr valign="top">
              <td>message-received</td>
              <td>Indicates there is a new message delivered by server</td>
          </tr>
          <tr valign="top">
              <td>stream-added</td>
              <td>Indicates there is a new stream available.</td>
          </tr>
          <tr valign="top">
              <td>stream-removed </td>
              <td>Indicates one existed stream has been removed. </td>
          </tr>
          <tr valign="top">
              <td>stream-failed</td>
              <td>Indicates the connection to specific stream is broken.</td>
          </tr>
          <tr valign="top">
              <td>recorder-removed</td>
              <td>Indicates the recorder has been removed.</td>
          </tr>
      </thead>
  </table>
  @endhtmlonly
     * @memberOf Woogeen.ConferenceClient
     * @instance
     * @param {string} eventType Event string.
     * @param {function} listener Callback function.
     * @example
  <script type="text/JavaScript">
  ...
  //client.on("server-disconnected", function (evt) {...});
  client.addEventListener("server-disconnected", function (evt) {...});
  </script>
     */
  /**
   * @function addEventListener
   * @desc This function registers a callback function as a handler for the corresponding event. It's shortened form is on(eventType, listener). See the event description in the following table.<br>
   @htmlonly
<table class="doxtable">
    <thead>
        <tr valign="top">
            <th><b>Event name</b></th>
            <th><b>Description</b></th>
        </tr>
        <tr valign="top">
            <td>server-disconnected</td>
            <td>Indicates the client has been disconnected to the server.</td>
        </tr>
        <tr valign="top">
            <td>user-joined </td>
            <td>Indicates a incoming sip call. </td>
        </tr>
        <tr valign="top">
            <td>stream-published </td>
            <td>Indicates the local stream has been publisded.</td>
        </tr>
        <tr valign="top">
            <td>stream-subscribed </td>
            <td>Indicates the remote stream has been subscribed. </td>
        </tr>
        <tr valign="top">
            <td>stream-added </td>
            <td>Indicates the sip call has been established. </td>
        </tr>
        <tr valign="top">
            <td>stream-removed </td>
            <td>Indicates the sip call has been hangup. </td>
        </tr>
        <tr valign="top">
            <td>message-received</td>
            <td>Indicates there is a new message delivered by server</td>
        </tr>
    </thead>
</table>
@endhtmlonly
   * @memberOf Woogeen.SipClient
   * @instance
   * @param {string} eventType Event string.
   * @param {function} listener Callback function.
   * @example
<script type="text/JavaScript">
...
//client.on("server-disconnected", function (evt) {...});
client.addEventListener("server-disconnected", function (evt) {...});
</script>
   */
  /**
   * @function addEventListener
   * @desc This function registers a callback function as a handler for the corresponding event. It's shortened form is on(eventType, listener). See the event description in the following table.<br>
   @htmlonly
<table class="doxtable">
    <thead>
        <tr valign="top">
            <th><b>Event name</b></th>
            <th><b>Description</b></th>
        </tr>
    </thead>
        <tr valign="top">
           <td>server-disconnected</td>
            <td>The client is disconnected from the peer server.</td>
        </tr>
        <tr valign="top">
            <td>chat-invited</td>
            <td>Received an invitation from a remote user. Parameter: senderId for the remote user's ID.</td>
        </tr>
        <tr valign="top">
            <td>chat-denied</td>
            <td>Remote user denied the invitation. Parameter: senderId for the remote user's ID.</td>
        </tr>
        <tr valign="top">
            <td>chat-started</td>
            <td>A new chat is started. Parameter: peerId for the remote user's ID.</td>
        </tr>
        <tr valign="top">
            <td>chat-stopped</td>
            <td>Current chat is stopped. This event is triggered when the chat is stopped by current user. Parameter: peerId for the remote user's ID and senderID for the event sender's ID.</td>
        </tr>
        <tr valign="top">
            <td>stream-added</td>
            <td>A stream is ready to show. Parameter: stream for remote stream, which is an instance of Woogeen.RemoteStream.</td>
        </tr>
        <tr valign="top">
            <td>stream-removed</td>
            <td>A stream has been removed. Parameter: stream for remote stream, which is an instance of Woogeen.RemoteStream.</td>
        </tr>
        <tr valign="top">
            <td>data-received</td>
            <td>Indicates there is new data content arrived which is sent by peer through data channel.</td>
        </tr>
</table>
@endhtmlonly
   * @memberOf Woogeen.PeerClient
   * @instance
   * @param {string} eventType Event string.
   * @param {function} listener Callback function.
   * @example
<script type="text/JavaScript">
...
//client.on("server-disconnected", function (evt) {...});
client.addEventListener("server-disconnected", function (evt) {...});
</script>
   */
  that.addEventListener = function(eventType, listener) {
    if (spec.dispatcher.eventListeners[eventType] === undefined) {
      spec.dispatcher.eventListeners[eventType] = [];
    }
    spec.dispatcher.eventListeners[eventType].push(listener);
  };

  /**
   * @function on
   * @desc This function equals to {@link Woogeen.ConferenceClient#addEventListener addEventListener}.
   * @memberOf Woogeen.ConferenceClient
   * @instance
   * @param {string} eventType Event string.
   * @param {function} listener Callback function.
   */
  that.on = that.addEventListener;

  /**
   * @function removeEventListener
   * @desc This function removes a registered event listener.
   * @memberOf Woogeen.ConferenceClient&Woogeen.SipClient
   * @instance
   * @param {string} eventType Event string.
   * @param {function} listener Callback function.
   */
  that.removeEventListener = function(eventType, listener) {
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
   * @memberOf Woogeen.ConferenceClient&Woogeen.SipClient
   * @instance
   * @param {string} eventType Event string.
   */
  that.clearEventListener = function(eventType) {
    spec.dispatcher.eventListeners[eventType] = [];
  };

  // It dispatch a new event to the event listeners, based on the type
  // of event. All events are intended to be LicodeEvents.
  that.dispatchEvent = function(event) {
    if (!spec.dispatcher.eventListeners[event.type]) {
      return;
    }
    spec.dispatcher.eventListeners[event.type].map(function(listener) {
      listener(event);
    });
  };

  return that;
};

// **** EVENTS ****

function WoogeenEvent(spec) { // base event class
  'use strict';
  this.type = spec.type;
  this.attributes = spec.attributes;
}

/*
 * Class StreamEvent represents an event related to a stream.
 * It is usually initialized this way:
 * var streamEvent = StreamEvent({type:'stream-added', stream:stream1});
 * Event types:
 * 'stream-added' - indicates that there is a new stream available in the room.
 * 'stream-removed' - shows that a previous available stream has been removed from the room.
 */
Woogeen.StreamEvent = function WoogeenStreamEvent(spec) {
  'use strict';
  WoogeenEvent.call(this, spec);
  this.stream = spec.stream;
  this.msg = spec.msg;
};

/*
 * Class ClientEvent represents an event related to a client.
 * It is usually initialized this way:
 * var clientEvent = ClientEvent({type:'peer-left', user: user1, attr: attributes});
 * Event types:
 * 'client-disconnected' - shows that the user has been already disconnected.
 * 'peer-joined' - indicates that there is a new peer joined.
 * 'peer-left' - indicates that a peer has left.
 */
Woogeen.ClientEvent = function WoogeenClientEvent(spec) {
  'use strict';
  WoogeenEvent.call(this, spec);
  this.user = spec.user;
};

/*
 * Class MessageEvent represents an event related to a custom message.
 */
Woogeen.MessageEvent = function WoogeenMessageEvent(spec) {
  'use strict';
  WoogeenEvent.call(this, spec);
  this.msg = spec.msg;
};

/*
 * Class ChatEvent represents an event related to P2P chat.
 */
Woogeen.ChatEvent = function WoogeenChatEvent(spec) {
  'use strict';
  WoogeenEvent.call(this, spec);
  this.type = spec.type;
  this.senderId = spec.senderId;
  this.peerId = spec.peerId;
};

/*
 * Class DataEvent represents an event related to data channel.
 */
Woogeen.DataEvent = function WoogeenDataEvent(spec) {
  'use strict';
  WoogeenEvent.call(this, spec);
  this.type = spec.type;
  this.senderId = spec.senderId;
  this.data = spec.data;
};

/*
 * Class RecorderEvent represents an event related to media recording.
 */
Woogeen.RecorderEvent = function WoogeenRecorderEvent(spec) {
  'use strict';
  WoogeenEvent.call(this, spec);
  this.recorderId = spec.id;
};

// inheritance
Woogeen.StreamEvent.prototype = Object.create(WoogeenEvent.prototype);
Woogeen.StreamEvent.prototype.constructor = Woogeen.StreamEvent;
Woogeen.ClientEvent.prototype = Object.create(WoogeenEvent.prototype);
Woogeen.ClientEvent.prototype.constructor = Woogeen.ClientEvent;
Woogeen.MessageEvent.prototype = Object.create(WoogeenEvent.prototype);
Woogeen.MessageEvent.prototype.constructor = Woogeen.MessageEvent;
Woogeen.ChatEvent.prototype = Object.create(WoogeenEvent.prototype);
Woogeen.ChatEvent.prototype.constructor = Woogeen.ChatEvent;
Woogeen.DataEvent.prototype = Object.create(WoogeenEvent.prototype);
Woogeen.DataEvent.prototype.constructor = Woogeen.DataEvent;
Woogeen.RecorderEvent.prototype = Object.create(WoogeenEvent.prototype);
Woogeen.RecorderEvent.prototype.constructor = Woogeen.RecorderEvent;



/*global adapter, attachMediaStream:true*/

/*
 * Woogeen.Common provides common functions for WooGeen SDK
 */
Woogeen.Common = (function() {

  var sdkVersion = '3.3';

  // Convert W3C defined statistic data to SDK format.
  var parseStats = function(stats) {
    'use strict';
    var index = 0;
    var statusReport = [];
    if (navigator.mozGetUserMedia) { // Firefox, unsupported properties return -1 or ""
      stats.forEach(function(stat, id) {
        var curStat;
        var match = false;
        if (id.indexOf("outbound_rtp_audio_") >= 0) {
          match = true;
          curStat = {
            "type": "ssrc_audio_send",
            "id": stat.id,
            "stats": {
              "bytes_sent": stat.bytesSent,
              "codec_name": "",
              "packets_sent": stat.packetsSent,
              "packets_lost": stats.get("outbound_rtcp_audio_" + id
                .slice(19)).packetsLost,
              "rtt_ms": stats.get("outbound_rtcp_audio_" + id.slice(
                19)).mozRtt
            }
          };
        } else if (id.indexOf("outbound_rtp_video_") >= 0) {
          match = true;
          curStat = {
            "type": "ssrc_video_send",
            "id": stat.id,
            "stats": {
              "bytes_sent": stat.bytesSent,
              "codec_name": "",
              "packets_sent": stat.packetsSent,
              "packets_lost": stats.get("outbound_rtcp_video_" + id
                .slice(19)).packetsLost,
              "firs_rcvd": -1,
              "plis_rcvd": -1,
              "nacks_rcvd": -1,
              "send_frame_width": -1,
              "send_frame_height": -1,
              "adapt_reason": -1,
              "adapt_changes": -1,
              "framerate_sent": stat.framerateMean,
              "rtt_ms": stats.get("outbound_rtcp_video_" + id.slice(
                19)).mozRtt
            }
          };
        } else if (id.indexOf("inbound_rtp_audio_") >= 0) {
          match = true;
          curStat = {
            "type": "ssrc_audio_recv",
            "id": stat.id,
            "stats": {
              "bytes_rcvd": stat.bytesReceived,
              "delay_estimated_ms": -1,
              "packets_rcvd": stat.packetsReceived,
              "packets_lost": stat.packetsLost,
              "codec_name": ""
            }
          };
        } else if (id.indexOf("inbound_rtp_video_") >= 0) {
          match = true;
          curStat = {
            "type": "ssrc_video_recv",
            "id": stat.id,
            "stats": {
              "bytes_rcvd": stat.bytesReceived,
              "packets_rcvd": stat.packetsReceived,
              "packets_lost": stat.packetsLost,
              "firs_sent": -1,
              "nacks_sent": -1,
              "plis_sent": -1,
              "frame_width": -1,
              "frame_height": -1,
              "framerate_rcvd": stat.framerateMean,
              "framerate_output": -1,
              "current_delay_ms": -1,
              "codec_name": ""
            }
          };
        }
        if (match) {
          statusReport[index] = curStat;
          index++;
        }
      });
    } else {
      stats.forEach(function(res) {
        var curStat;
        var match = false;
        if (res.type === "ssrc") {
          // This is a ssrc report. Check if it is send/recv
          match = true;
          if (res.bytesSent) {
            // check if it"s audio or video
            if (res.googFrameHeightSent) {
              // video send
              var adaptReason;
              if (res.googCpuLimitedResolution === true) {
                adaptReason = 1;
              } else if (res.googBandwidthLimitedResolution === true) {
                adaptReason = 2;
              } else if (res.googViewLimitedResolution === true) {
                adaptReason = 3;
              } else {
                adaptReason = 99;
              }
              curStat = {
                "type": "ssrc_video_send",
                "id": res.id,
                "stats": {
                  "bytes_sent": res.bytesSent,
                  "codec_name": res.googCodecName,
                  "packets_sent": res.packetsSent,
                  "packets_lost": res.packetsLost,
                  "firs_rcvd": res.googFirsReceived,
                  "plis_rcvd": res.googPlisReceived,
                  "nacks_rcvd": res.googNacksReceived,
                  "send_frame_width": res.googFrameWidthSent,
                  "send_frame_height": res.googFrameHeightSent,
                  "adapt_reason": adaptReason,
                  "adapt_changes": res.googAdaptationChanges,
                  "framerate_sent": res.googFrameRateSent,
                  "rtt_ms": res.googRtt
                }
              };
            } else {
              // audio send
              curStat = {
                "type": "ssrc_audio_send",
                "id": res.id,
                "stats": {
                  "bytes_sent": res.bytesSent,
                  "codec_name": res.googCodecName,
                  "packets_sent": res.packetsSent,
                  "packets_lost": res.packetsLost,
                  "rtt_ms": res.googRtt
                }
              };
            }
          } else {
            // this is ssrc receive report.
            if (res.googFrameHeightReceived) {
              // video receive
              curStat = {
                "type": "ssrc_video_recv",
                "id": res.id,
                "stats": {
                  "bytes_rcvd": res.bytesReceived,
                  "packets_rcvd": res.packetsReceived,
                  "packets_lost": res.packetsLost,
                  "firs_sent": res.googFirsSent,
                  "nacks_sent": res.googNacksSent,
                  "plis_sent": res.googPlisSent,
                  "frame_width": res.googFrameWidthReceived,
                  "frame_height": res.googFrameHeightReceived,
                  "framerate_rcvd": res.googFrameRateReceived,
                  "framerate_output": res.googFrameRateDecoded,
                  "current_delay_ms": res.googCurrentDelayMs,
                  "codec_name": res.googCodecName
                }
              };
            } else {
              // audio receive
              curStat = {
                "type": "ssrc_audio_recv",
                "id": res.id,
                "stats": {
                  "bytes_rcvd": res.bytesReceived,
                  "delay_estimated_ms": res.googCurrentDelayMs,
                  "packets_rcvd": res.packetsReceived,
                  "packets_lost": res.packetsLost,
                  "codec_name": res.googCodecName
                }
              };
            }
          }
        } else if (res.type === "VideoBwe") {
          match = true;
          curStat = {
            "type": "VideoBWE",
            "id": "",
            "stats": {
              "available_send_bandwidth": res.googAvailableSendBandwidth,
              "available_receive_bandwidth": res.googAvailableReceiveBandwidth,
              "transmit_bitrate": res.googTransmitBitrate,
              "retransmit_bitrate": res.googRetransmitBitrate
            }
          };
        }
        if (match) {
          statusReport[index] = curStat;
          index++;
        }
      });
    }
    return statusReport;
  };

  var parseAudioLevel = function(stats) {
    var inLevelIdx = 0;
    var outLevelIdx = 0;
    var stats_Report = {};
    var curInputLevels = [];
    var curOutputLevels = [];
    var match = false;
    var results = stats.result();
    for (var i = 0; i < results.length; i++) {
      var res = results[i];
      if (res.type === "ssrc") {
        //This is a ssrc report. Check if it is send/recv
        if (res.stat("bytesSent")) {
          //check if it"s audio or video
          if (res.stat("googFrameHeightSent")) {
            //video send, not setting audio levels
          } else {
            //audio send
            match = true;
            var curObj = {};
            curObj.ssrc = res.id;
            curObj.level = res.stat("audioInputLevel");
            curInputLevels[inLevelIdx] = curObj;
            inLevelIdx++;
          }
        } else {
          //this is ssrc receive report.
          if (res.stat("googFrameHeightReceived")) {
            //video receive
          } else {
            //audio receive
            match = true;
            var curObj = {}; /*jshint ignore:line*/
            curObj.ssrc = res.id;
            curObj.level = res.stat("audioOutputLevel");
            curOutputLevels[outLevelIdx] = curObj;
            outLevelIdx++;
          }
        }
      }
    }
    if (match) {
      if (inLevelIdx > 0) {
        stats_Report.audioInputLevels = curInputLevels;
      }
      if (outLevelIdx > 0) {
        stats_Report.audioOutputLevels = curOutputLevels;
      }
    }
    return stats_Report;
  };

  /* Following functions are copied from apprtc with modifications */

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
        if (!substr ||
          sdpLines[i].toLowerCase().indexOf(substr.toLowerCase()) !== -1) {
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
    var pattern = new RegExp('a=rtpmap:(\\d+) [a-zA-Z0-9-]+\\/\\d+', 'i');
    var result = sdpLine.match(pattern);
    return (result && result.length === 2) ? result[1] : null;
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

  // Modify m-line. Put preferred payload type in the front of other types.
  // mediaType is 'audio' or 'video'.
  var setPreferredCodec = function(sdp, mediaType, codecName) {
    if (!mediaType || !codecName) {
      L.Logger.warning('Media type or codec name is not provided.');
      return sdp;
    }

    var sdpLines = sdp.split('\r\n');

    // Search for m line.
    var mLineIndex = findLine(sdpLines, 'm=', mediaType);
    if (mLineIndex === null) {
      return sdp;
    }

    // If the codec is available, set it as the default in m line.
    var payload = getCodecPayloadType(sdpLines, codecName);
    if (payload) {
      sdpLines[mLineIndex] = setDefaultCodec(sdpLines[mLineIndex],
        payload);
    }

    sdp = sdpLines.join('\r\n');
    return sdp;
  };

  // Add a b=AS:bitrate line to the m=mediaType section.
  function preferBitRate(sdp, mediaType, bitrate) {
    var sdpLines = sdp.split('\r\n');

    // Find m line for the given mediaType.
    var mLineIndex = findLine(sdpLines, 'm=', mediaType);
    if (mLineIndex === null) {
      L.Logger.debug(
        'Failed to add bandwidth line to sdp, as no m-line found');
      return sdp;
    }

    // Find next m-line if any.
    var nextMLineIndex = findLineInRange(sdpLines, mLineIndex + 1, -1, 'm=');
    if (nextMLineIndex === null) {
      nextMLineIndex = sdpLines.length;
    }

    // Find c-line corresponding to the m-line.
    var cLineIndex = findLineInRange(sdpLines, mLineIndex + 1,
      nextMLineIndex, 'c=');
    if (cLineIndex === null) {
      L.Logger.debug(
        'Failed to add bandwidth line to sdp, as no c-line found');
      return sdp;
    }

    // Check if bandwidth line already exists between c-line and next m-line.
    var bLineIndex = findLineInRange(sdpLines, cLineIndex + 1,
      nextMLineIndex, 'b=AS');
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

  /* Above functions are copied from apprtc with modifications */

  // Returns system information.
  // Format: {sdk:{version:**, type:**}, runtime:{version:**, name:**}, os:{version:**, name:**}};
  var sysInfo = function() {
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
    var result = chromeRegex.exec(userAgent);
    if (result) {
      info.runtime = {
        name: 'Chrome',
        version: result[1]
      };
    } else if (result = firefoxRegex.exec(userAgent)) {
      info.runtime = {
        name: 'FireFox',
        version: result[1]
      };
    } else if (result = edgeRegex.exec(userAgent)) {
      info.runtime = {
        name: 'Edge',
        version: result[1]
      };
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

  return {
    parseStats: parseStats,
    parseAudioLevel: parseAudioLevel,
    setPreferredCodec: setPreferredCodec,
    setPreferredBitrate: preferBitRate,
    sysInfo: sysInfo
  };
}());

/*
 * Following UI code is for backward compability. Delete it when it is old enough.
 * Detailed reason: we provide global function |attachMediaStream| in the old adapter.js. However, it has been move to adapter.browserShim.attachMediaStream in the latest code, and it will be removed in the future. We should modify adapter.js as less as possible. So we provide |attachMediaStream| in Woogeen.UI namespace.
 */
attachMediaStream = function() {
  L.Logger.warning(
    'Global attachMediaStream is deprecated, pleause include woogeen.sdk.ui.js and use Woogeen.UI.attachMediaStream instead.'
  );
  adapter.browserShim.attachMediaStream.apply(this, arguments);
};



/*global unescape*/
L.Base64 = (function() {
  "use strict";
  var END_OF_INPUT, base64Chars, reverseBase64Chars, base64Str, base64Count,
    i, setBase64Str, readBase64, encodeBase64, readReverseBase64, ntos,
    decodeBase64;

  END_OF_INPUT = -1;

  base64Chars = [
    'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H',
    'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P',
    'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X',
    'Y', 'Z', 'a', 'b', 'c', 'd', 'e', 'f',
    'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n',
    'o', 'p', 'q', 'r', 's', 't', 'u', 'v',
    'w', 'x', 'y', 'z', '0', '1', '2', '3',
    '4', '5', '6', '7', '8', '9', '+', '/'
  ];

  reverseBase64Chars = [];

  for (i = 0; i < base64Chars.length; i = i + 1) {
    reverseBase64Chars[base64Chars[i]] = i;
  }

  setBase64Str = function(str) {
    base64Str = str;
    base64Count = 0;
  };

  readBase64 = function() {
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

  encodeBase64 = function(str) {
    var result, inBuffer, done;
    setBase64Str(str);
    result = '';
    inBuffer = new Array(3);
    done = false;
    while (!done && (inBuffer[0] = readBase64()) !== END_OF_INPUT) {
      inBuffer[1] = readBase64();
      inBuffer[2] = readBase64();
      result = result + (base64Chars[inBuffer[0] >> 2]);
      if (inBuffer[1] !== END_OF_INPUT) {
        result = result + (base64Chars[((inBuffer[0] << 4) & 0x30) | (
          inBuffer[1] >> 4)]);
        if (inBuffer[2] !== END_OF_INPUT) {
          result = result + (base64Chars[((inBuffer[1] << 2) & 0x3c) | (
            inBuffer[2] >> 6)]);
          result = result + (base64Chars[inBuffer[2] & 0x3F]);
        } else {
          result = result + (base64Chars[((inBuffer[1] << 2) & 0x3c)]);
          result = result + ('=');
          done = true;
        }
      } else {
        result = result + (base64Chars[((inBuffer[0] << 4) & 0x30)]);
        result = result + ('=');
        result = result + ('=');
        done = true;
      }
    }
    return result;
  };

  readReverseBase64 = function() {
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

  ntos = function(n) {
    n = n.toString(16);
    if (n.length === 1) {
      n = "0" + n;
    }
    n = "%" + n;
    return unescape(n);
  };

  decodeBase64 = function(str) {
    var result, inBuffer, done;
    setBase64Str(str);
    result = "";
    inBuffer = new Array(4);
    done = false;
    while (!done && (inBuffer[0] = readReverseBase64()) !== END_OF_INPUT &&
      (inBuffer[1] = readReverseBase64()) !== END_OF_INPUT) {
      inBuffer[2] = readReverseBase64();
      inBuffer[3] = readReverseBase64();
      result = result + ntos((((inBuffer[0] << 2) & 0xff) | inBuffer[1] >>
        4));
      if (inBuffer[2] !== END_OF_INPUT) {
        result += ntos((((inBuffer[1] << 4) & 0xff) | inBuffer[2] >> 2));
        if (inBuffer[3] !== END_OF_INPUT) {
          result = result + ntos((((inBuffer[2] << 6) & 0xff) | inBuffer[
            3]));
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
}());



/*global console*/

/*
 * API to write logs based on traditional logging mechanisms: debug, trace, info, warning, error
 */
L.Logger = (function() {
  "use strict";
  var DEBUG = 0,
    TRACE = 1,
    INFO = 2,
    WARNING = 3,
    ERROR = 4,
    NONE = 5,
    logLevel = DEBUG,
    setLogLevel, log, debug, trace, info, warning, error;

  // It sets the new log level. We can set it to NONE if we do not want to print logs
  setLogLevel = function(level) {
    if (level > NONE) {
      level = NONE;
    } else if (level < DEBUG) {
      level = DEBUG;
    }
    logLevel = level;
  };

  // Generic function to print logs for a given level: [DEBUG, TRACE, INFO, WARNING, ERROR]
  log = function() {
    var level = arguments[0];
    var args = arguments;
    if (level < logLevel) {
      return;
    }
    switch (level) {
      case DEBUG:
        args[0] = 'DEBUG:';
        break;
      case TRACE:
        args[0] = 'TRACE:';
        break;
      case INFO:
        args[0] = 'INFO:';
        break;
      case WARNING:
        args[0] = 'WARNING:';
        break;
      case ERROR:
        args[0] = 'ERROR:';
        break;
      default:
        return;
    }
    console.log.apply(console, args);
  };

  // It prints debug logs
  debug = function() {
    var args = [DEBUG];
    for (var i = 0; i < arguments.length; i++) {
      args.push(arguments[i]);
    }
    log.apply(this, args);
  };

  // It prints trace logs
  trace = function() {
    var args = [TRACE];
    for (var i = 0; i < arguments.length; i++) {
      args.push(arguments[i]);
    }
    log.apply(this, args);
  };

  // It prints info logs
  info = function() {
    var args = [INFO];
    for (var i = 0; i < arguments.length; i++) {
      args.push(arguments[i]);
    }
    log.apply(this, args);
  };

  // It prints warning logs
  warning = function() {
    var args = [WARNING];
    for (var i = 0; i < arguments.length; i++) {
      args.push(arguments[i]);
    }
    log.apply(this, args);
  };

  // It prints error logs
  error = function() {
    var args = [ERROR];
    for (var i = 0; i < arguments.length; i++) {
      args.push(arguments[i]);
    }
    log.apply(this, args);
  };

  return {
    DEBUG: DEBUG,
    TRACE: TRACE,
    INFO: INFO,
    WARNING: WARNING,
    ERROR: ERROR,
    NONE: NONE,
    setLogLevel: setLogLevel,
    log: log,
    debug: debug,
    trace: trace,
    info: info,
    warning: warning,
    error: error
  };
}());



/* global webkitURL, chrome */
(function() {
  'use strict';
  /**
   *@namespace Woogeen
   *@classDesc Namespace for client API.
   */
  /**
   * @class Woogeen.Stream
   * @classDesc Handles the WebRTC (audio, video) stream, identifies the stream, and identifies the location where the stream should be displayed. There are two stream classes: LocalStream and RemoteStream.
   */
  function WoogeenStream(spec) {
    // if (!(this instanceof WoogeenStream)) {
    //   return new WoogeenStream();
    // }
    this.mediaStream = spec.mediaStream;
    spec.attributes = spec.attributes || {};
    this.url = function() {
      if (typeof spec.url === 'string' && spec.url !== '') {
        return spec.url;
      }
      return undefined;
    };
    /**
       * @function hasVideo
       * @desc This function returns true when stream has video track otherwise false.
       * @memberOf Woogeen.Stream
       * @instance
       * @return {boolean} true The stream has video.<br>false The stream does not have video.
       * @example
    <script type="text/JavaScript">
    L.Logger.info('stream hasVideo:', stream.hasVideo());
    </script>
       */
    this.hasVideo = function() {
      return !!spec.video;
    };
    /**
       * @function hasAudio
       * @desc This function returns true when stream has audio track otherwise false.
       * @memberOf Woogeen.Stream
       * @instance
       * @return {boolean} true The stream has audio.<br>false The stream does not have audio.
       * @example
    <script type="text/JavaScript">
    L.Logger.info('stream hasAudio:', stream.hasAudio());
    </script>
       */
    this.hasAudio = function() {
      return !!spec.audio;
    };
    /**
       * @function attributes
       * @desc This function returns all user-defined attributes in stream.
       * @memberOf Woogeen.Stream
       * @instance
       * @return {string} All the user-defined attributes.
       * @example
    <script type="text/JavaScript">
    L.Logger.info('stream attibutes:', stream.attributes());
    </script>
       */
    this.attributes = function() {
      return spec.attributes;
    };
    /**
       * @function attr
       * @desc This function sets user-defined value in attributes when value is provided; otherwise returns corresponding attribute.
       * @memberOf Woogeen.Stream
       * @instance
       * @param {string} key attribute key.
       * @param {string} value attribute value.
       * @return {string} Existing attribute value if it's not specified in parameter
       * @example
    <script type="text/JavaScript">
    stream.attr("custom_key", "custom_value");
    </script>
       */
    this.attr = function(key, value) {
      if (arguments.length > 1) {
        spec.attributes[key] = value;
      }
      return spec.attributes[key];
    };
    /**
       * @function id
       * @desc This function returns stream Id.
    <br><b>Remarks:</b><br>
    For local stream, it returns MediaStream's ID if the stream has not been published; once published, stream Id should be updated by server.
       * @memberOf Woogeen.Stream
       * @instance
       * @return {string} Stream ID.
       * @example
    <script type="text/JavaScript">
    L.Logger.info('stream added:', stream.id());
    </script>
       */
    this.id = function() {
      return spec.id || null;
    };
    /**
       * @function isScreen
       * @desc This function returns true when stream's video track is from screen sharing otherwise false.
       * @memberOf Woogeen.Stream
       * @instance
       * @return {boolean} true The stream is from screen;<br>otherwise false.
       * @example
    <script type="text/JavaScript">
    L.Logger.info('stream is from screen?', stream.isScreen());
    </script>
       */
    this.isScreen = function() {
      return (!!spec.video) && (spec.video.device === 'screen'); // device: 'camera', 'screen'
    };
    this.bitRate = {
      maxVideoBW: undefined,
      maxAudioBW: undefined
    }; // mutable;
    this.toJson = function() {
      return {
        id: this.id(),
        audio: spec.audio,
        video: spec.video,
        attributes: spec.attributes
      };
    };
  }
  /**
     * @function close
     * @desc This function closes the stream.
  <br><b>Remarks:</b><br>
  If the stream has audio and/or video, it also stops capturing camera/microphone. If the stream is published to a conference, the function also un-publishes it. If the stream is published to a P2P session, the function does NOT un-publish it. If the stream is showing in an HTML element, the stream would be hidden. Once a LocalStream is closed, it is no longer usable.
     * @memberOf Woogeen.Stream
     * @instance
     * @example
  <script type="text/JavaScript">
  var stream = Woogeen.Stream({audio:true, video:true, data: false, attributes:
  {name:'WoogeenStream'}});
  stream.close();
  </script>
     */
  WoogeenStream.prototype.close = function() {
    if (typeof this.hide === 'function') {
      this.hide();
    }
    if (this.mediaStream) {
      this.mediaStream.getTracks().map(function(track) {
        if (typeof track.stop === 'function') {
          track.stop();
        }
      });
    }
    this.mediaStream = null;
    if (typeof this.unpublish === 'function') {
      this.unpublish();
    }
    // close peer connection if necessary
    if (this.channel && typeof this.channel.close === 'function') {
      this.channel.close();
    }
  };

  WoogeenStream.prototype.createObjectURL = function() {
    if (!this.mediaStream) {
      return '';
    }
    return (window.URL || webkitURL).createObjectURL(this.mediaStream);
  };
  /**
     * @function disableAudio
     * @desc This function disables underlying audio track in the stream if it has audio capacity; otherwise it does nothing.
  <br><b>Remarks:</b><br>
  For remote stream, it stops decoding audio; for local stream, it also stops capturing audio. But capturing cannot be stopped currently in Edge by this API.
     * @memberOf Woogeen.Stream
     * @instance
     * @return {boolean} true The stream has audio and the audio track is enabled previously; <br> otherwise false.
     * @example
  <script type="text/JavaScript">
  stream.disableAudio();
  </script>
     */
  WoogeenStream.prototype.disableAudio = function(tracknum) {
    var self = this;
    if (self.hasAudio() && self.mediaStream) {
      if (tracknum === undefined) {
        tracknum = 0;
      }
      if (tracknum === -1) {
        return self.mediaStream.getAudioTracks().map(function(track) {
          if (track.enabled) {
            track.enabled = false;
            return true;
          }
          return false;
        });
      }
      var tracks = self.mediaStream.getAudioTracks();
      if (tracks && tracks[tracknum] && tracks[tracknum].enabled) {
        tracks[tracknum].enabled = false;
        return true;
      }
    }
    return false;
  };
  /**
     * @function enableAudio
     * @desc This function enables underlying audio track in the stream if it has audio capacity.
  <br><b>Remarks:</b><br>
  For remote stream, it continues decoding audio; for local stream, it also continues capturing audio.
     * @memberOf Woogeen.Stream
     * @instance
     * @return {boolean} true The stream has audio and the audio track is disabled previously; <br> otherwise false.
     * @example
  <script type="text/JavaScript">
  stream.enableAudio();
  </script>
     */
  WoogeenStream.prototype.enableAudio = function(tracknum) {
    var self = this;
    if (self.hasAudio() && self.mediaStream) {
      if (tracknum === undefined) {
        tracknum = 0;
      }
      if (tracknum === -1) {
        return self.mediaStream.getAudioTracks().map(function(track) {
          if (track.enabled !== true) {
            track.enabled = true;
            return true;
          }
          return false;
        });
      }
      var tracks = self.mediaStream.getAudioTracks();
      if (tracks && tracks[tracknum] && tracks[tracknum].enabled !== true) {
        tracks[tracknum].enabled = true;
        return true;
      }
    }
    return false;
  };

  /**
     * @function disableVideo
     * @desc This function disables underlying video track in the stream if it has video capacity; otherwise it does nothing.
  <br><b>Remarks:</b><br>
  For remote stream, it stops decoding video; for local stream, it also stops capturing video. But capturing cannot be stopped currently in Edge by this API.
     * @memberOf Woogeen.Stream
     * @instance
     * @return {boolean} true The stream has video and the video track is enabled previously; <br> otherwise false.
     * @example
  <script type="text/JavaScript">
  stream.disableVideo();
  </script>
     */
  WoogeenStream.prototype.disableVideo = function(tracknum) {
    var self = this;
    if (self.hasVideo() && self.mediaStream) {
      if (tracknum === undefined) {
        tracknum = 0;
      }
      if (tracknum === -1) {
        return self.mediaStream.getVideoTracks().map(function(track) {
          if (track.enabled) {
            track.enabled = false;
            return true;
          }
          return false;
        });
      }
      var tracks = self.mediaStream.getVideoTracks();
      if (tracks && tracks[tracknum] && tracks[tracknum].enabled) {
        tracks[tracknum].enabled = false;
        return true;
      }
    }
    return false;
  };

  /**
     * @function enableVideo
     * @desc This function enables underlying video track in the stream if it has video capacity.
  <br><b>Remarks:</b><br>
  For remote stream, it continues decoding video; for local stream, it also continues capturing video.
     * @memberOf Woogeen.Stream
     * @instance
     * @return {boolean} true The stream has video and the video track is disabled previously; <br> otherwise false.
     * @example
  <script type="text/JavaScript">
  stream.enableVideo();
  </script>
     */
  WoogeenStream.prototype.enableVideo = function(tracknum) {
    var self = this;
    if (self.hasVideo() && self.mediaStream) {
      if (tracknum === undefined) {
        tracknum = 0;
      }
      if (tracknum === -1) {
        return self.mediaStream.getVideoTracks().map(function(track) {
          if (track.enabled !== true) {
            track.enabled = true;
            return true;
          }
          return false;
        });
      }
      var tracks = self.mediaStream.getVideoTracks();
      if (tracks && tracks[tracknum] && tracks[tracknum].enabled !== true) {
        tracks[tracknum].enabled = true;
        return true;
      }
    }
    return false;
  };

  WoogeenStream.prototype.updateConfiguration = function(config, callback) {
    if (config === undefined) {
      return;
    }
    if (this.channel) {
      this.channel.updateSpec(config, callback);
    } else {
      return ("This stream has not been published, ignoring");
    }
  };

  function WoogeenLocalStream(spec) {
    WoogeenStream.call(this, spec);
  }

  function WoogeenRemoteStream(spec) {
    WoogeenStream.call(this, spec);
    /**
       * @function isMixed
       * @desc This function returns true when stream's video track is mixed by server otherwise false.
    <br><b>Remarks:</b><br>
    Deprecated, use <code>instanceof Woogeen.RemoteMixedStream</code> instead.
       * @memberOf Woogeen.RemoteStream
       * @instance
       * @return {boolean} true The stream is mixed stream.<br>false The stream is not mixed stream
       * @example
    <script type="text/JavaScript">
    L.Logger.info('stream isMixed:', stream.isMixed());
    </script>
       */
    this.isMixed = function() {
      return false;
    };

    this.from = spec.from;
    var listeners = {};
    var self = this;
    Object.defineProperties(this, {
      /**
         * @function on
         * @desc This function registers a listener for a specified event, which would be called when the event occurred.
      <br><b>Remarks:</b><br>
      Reserved events from MCU:<br>
      @htmlonly
      <table class="doxtable">
      <thead>
        <tr><th align="center">Event Name</th><th align="center">Description</th><th align="center">Status</th></tr>
      </thead>
      <tbody>
        <tr><td align="center"><code>VideoLayoutChanged</code></td><td align="center">Video layout of the mix (remote) stream changed</td><td align="center">stable</td></tr>
        <tr><td align="center"><code>VideoEnabled</code></td><td align="center">Video track of the remote stream enabled</td><td align="center">stable</td></tr>
        <tr><td align="center"><code>VideoDisabled</code></td><td align="center">Video track of the remote stream disabled</td><td align="center">stable</td></tr>
        <tr><td align="center"><code>AudioEnabled</code></td><td align="center">Audio track of the remote stream enabled</td><td align="center">stable</td></tr>
        <tr><td align="center"><code>AudioDisabled</code></td><td align="center">Audio track of the remote stream disabled</td><td align="center">stable</td></tr>
      </tbody>
      </table>
      @endhtmlonly
      User-defined events and listeners are also supported, See {@link Woogeen.RemoteStream#emit stream.emit(event, data)} method.
         * @memberOf Woogeen.RemoteStream
         * @param {string} event Event name.
         * @param {function} listener(data) Callback function.
         * @instance
         * @example
      <script type="text/JavaScript">
      if (stream.isMixed()) {
        stream.on('VideoLayoutChanged', function () {
          L.Logger.info('stream', stream.id(), 'video layout changed');
        });
      }
      </script>
         */
      on: {
        get: function() {
          return function(event, listener) {
            listeners[event] = listeners[event] || [];
            listeners[event].push(listener);
            return self;
          };
        }
      },
      /**
       * @function emit
       * @desc This function triggers a specified event, which would invoke corresponding event listener(s).
       * @memberOf Woogeen.RemoteStream
       * @param {string} event Event name.
       * @param {user-defined} data Data fed to listener function.
       * @instance
       */
      emit: {
        get: function() {
          return function(event) {
            if (listeners[event]) {
              var args = [].slice.call(arguments, 1);
              listeners[event].map(function(fn) {
                fn.apply(self, args);
              });
            }
            return self;
          };
        }
      },
      /**
       * @function removeListener
       * @desc This function removes listener(s) for a specified event. If listener is unspecified, all the listener(s) of the event would be removed; or if the listener is in the event listener list, it would be removed; otherwise this function does nothing.
       * @memberOf Woogeen.RemoteStream
       * @param {string} event Event name.
       * @param {function} listener Corresponding callback function (optional).
       * @instance
       */
      removeListener: {
        get: function() {
          return function(event, cb) {
            if (cb === undefined) {
              listeners[event] = [];
            } else {
              if (listeners[event]) {
                listeners[event].map(function(fn, index) {
                  if (fn === cb) {
                    listeners[event].splice(index, 1);
                  }
                });
              }
            }
            return self;
          };
        }
      },
      /**
       * @function clearListeners
       * @desc This function removes all registered listener(s) for all events on the stream.
       * @memberOf Woogeen.RemoteStream
       * @instance
       */
      clearListeners: {
        get: function() {
          return function() {
            listeners = {};
            return self;
          };
        }
      }
    });
  }

  function WoogeenRemoteMixedStream(spec) {
    WoogeenRemoteStream.call(this, spec);
    /**
     * @function resolutions
     * @desc This function returns an array of supported resolutions for mixed stream.
     * @memberOf Woogeen.RemoteMixedStream
     * @instance
     * @return {Array}
     */
    this.resolutions = function() {
      if (spec.video.resolutions instanceof Array) {
        return spec.video.resolutions.map(function(resolution) {
          return resolution;
        });
      }
      return [];
    };

    this.isMixed = function() {
      return true;
    };
  }

  function WoogeenExternalStream(spec) {
    this.url = function() {
      if (typeof spec.url === 'string' && spec.url !== '') {
        return spec.url;
      }
      return undefined;
    };
    /* @function id
   * @desc This function returns stream Id assigned by server.
<br><b>Remarks:</b><br>
For unpublished external stream, it returns null if the stream has not been published; once published, stream Id should be updated by server.
   * @memberOf Woogeen.ExternalStream
   * @instance
   * @return {string} Stream Id assigned by server.
   * @example
<script type="text/JavaScript">
L.Logger.info('stream added:', stream.id());
</script>
   */
    this.id = function() {
      return spec.id || null;
    };
    // Actually, we don't know whether this external stream has audio/video, but publish function will not publish audio/video if hasAudio/hasVideo returns false.
    this.hasVideo = function() {
      return !!spec.video;
    };
    this.hasAudio = function() {
      return !!spec.audio;
    };
    this.toJson = function() {
      var videoOpt;
      if (spec.video === true) {
        videoOpt = {
          device: 'camera'
        };
      } else if (spec.video === false) {
        videoOpt = spec.video;
      } else if (typeof spec.video === 'object') {
        videoOpt = spec.video;
        videoOpt.device = spec.video.device || 'camera';
      }
      return {
        id: this.id(),
        audio: spec.audio,
        video: videoOpt,
        url: this.url()
      };
    };
  }

  WoogeenLocalStream.prototype = Object.create(WoogeenStream.prototype);
  WoogeenRemoteStream.prototype = Object.create(WoogeenStream.prototype);
  WoogeenRemoteMixedStream.prototype = Object.create(WoogeenRemoteStream.prototype);
  WoogeenExternalStream.prototype = Object.create({});
  WoogeenLocalStream.prototype.constructor = WoogeenLocalStream;
  WoogeenRemoteStream.prototype.constructor = WoogeenRemoteStream;
  WoogeenRemoteMixedStream.prototype.constructor = WoogeenRemoteMixedStream;
  WoogeenExternalStream.prototype.constructor = WoogeenExternalStream;


  function isLegacyChrome() {
    return window.navigator.appVersion.match(/Chrome\/([\w\W]*?)\./) !== null &&
      window.navigator.appVersion.match(/Chrome\/([\w\W]*?)\./)[1] <= 35;
  }

  function isLegacyIE() {
    return window.navigator.appVersion.indexOf('Trident') > -1;
  }

  function isFirefox() {
    return window.navigator.userAgent.match("Firefox") !== null;
  }

  function canShareScreen() {
    return isFirefox() ||
      (window.navigator.appVersion.match(/Chrome\/([\w\W]*?)\./) !== null &&
        window.navigator.appVersion.match(/Chrome\/([\w\W]*?)\./)[1] >= 34);
  }

  function getReso(w, h) {
    return {
      width: w,
      height: h
    };
  }

  var supportedVideoList = {
    'true': {},
    'unspecified': {},
    'sif': getReso(320, 240),
    'vga': getReso(640, 480),
    'hd720p': getReso(1280, 720),
    'hd1080p': getReso(1920, 1080)
  };

  var getMedia = (navigator.getUserMedia || navigator.webkitGetUserMedia ||
    navigator.mozGetUserMedia || navigator.msGetUserMedia);


  /*
  createLocalStream({
    video: {
      device: 'camera',
      resolution: '720p',
      frameRate: [200, 500]
    },
    audio: true,
    attribtues: null
  }, function () {});
  */
  function createLocalStream(option, callback) {
    if (typeof option === 'object' && option !== null && option.url !==
      undefined) {
      var warnMessage =
        'URL for LocalStream is deprecated, please use ExternalStream instead.';
      if (typeof console.warn === 'function') {
        console.warn(warnMessage);
      } else {
        L.Logger.warning(warnMessage);
      }
      var localStream = new Woogeen.LocalStream(option);
      if (typeof callback === 'function') {
        callback(null, localStream);
      }
      return;
    }
    if (typeof getMedia !== 'function' && !isLegacyIE()) {
      if (typeof callback === 'function') {
        callback({
          code: 1100,
          msg: 'webrtc support not available'
        });
      }
      return;
    }
    var init_retry = arguments[3];
    if (init_retry === undefined) {
      init_retry = 2;
    }
    var mediaOption = {};

    if (option !== null && typeof option === 'object') {
      if (!option.audio && !option.video) {
        if (typeof callback === 'function') {
          callback({
            code: 1107,
            msg: 'At least one of audio and video must be requested.'
          });
        }
        return;
      }

      if (option.video) {
        if (typeof option.video !== 'object' && !!option.video) {
          option.video = Object.create({});
        }
        if (typeof option.video.device !== 'string') {
          option.video.device = 'camera';
        }

        if (option.video.device === 'screen') {
          if (!canShareScreen()) {
            if (typeof callback === 'function') {
              callback({
                code: 1103,
                msg: 'browser screen sharing not supported'
              });
              return;
            }
          }
        }

        if (typeof option.video.resolution === 'object' && option.video.resolution
          .width !== undefined && option.video.resolution.height !==
          undefined) {
          mediaOption.video = JSON.parse(JSON.stringify(getReso(option.video.resolution
            .width, option.video.resolution.height)));
        } else {
          mediaOption.video = JSON.parse(JSON.stringify(supportedVideoList[
            option.video.resolution] || supportedVideoList.unspecified));
        }

        if (!isLegacyIE() && !isLegacyChrome()) {
          if (option.video.frameRate instanceof Array && option.video.frameRate
            .length >= 2) {
            mediaOption.video.frameRate = {
              min: option.video.frameRate[0],
              max: option.video.frameRate[1]
            };
          } else if (typeof option.video.frameRate === 'number') {
            mediaOption.video.frameRate = option.video.frameRate;
          } else {
            L.Logger.warning('Invalid frame rate value, ignored.');
          }
        }
      }
      if (option.audio) {
        mediaOption.audio = true;
      }
    } else {
      if (typeof callback === 'function') {
        callback({
          code: 1107,
          msg: 'USER_INPUT_INVALID'
        });
        return;
      }
    }

    var onSuccess = function(mediaStream) {
      // Check whether the media stream has audio/video track as requested.
      if ((option.audio && mediaStream.getAudioTracks().length === 0) || (
          option.video && mediaStream.getVideoTracks().length === 0)) {
        for (var i = 0; i < mediaStream.getTracks().length; i++) {
          mediaStream.getTracks()[i].stop();
        }
        var err = {
          code: 1104,
          msg: 'Not all device requests are satisfied.'
        };
        callback(err);
        return;
      }

      option.mediaStream = mediaStream;
      option.id = mediaStream.id;
      var localStream = new Woogeen.LocalStream(option);
      if (option.video && option.video.device === 'screen') {
        // when <Stop sharing> button in Browser was pressed, `onended' would
        // be triggered; then we need to close the screen sharing stream.
        // `onended' is a EventHandler containing the action
        // to perform when an ended event is fired on the object,
        // that is when the streaming is terminating.
        var videoTracks = mediaStream.getVideoTracks();
        if (videoTracks.length > 0) {
          videoTracks[0].onended = function() {
            localStream.close();
          };
        }
      }
      if (mediaOption.video) {
        // set default bit rate
        /*switch (mediaOption.video.width) {
          case 320:
            localStream.bitRate.maxVideoBW = 512;
            break;
          case 640:
            localStream.bitRate.maxVideoBW = 1024;
            break;
          case 1280:
            localStream.bitRate.maxVideoBW = 2048;
            break;
          default:
            // localStream.bitRate.maxVideoBW = undefined;
            break;
        }*/
        localStream.bitRate.maxVideoBW = undefined;
      }
      if (typeof callback === 'function') {
        callback(null, localStream);
      }
    };

    var onFailure = function(error) {
      var err = {
        code: 1100,
        msg: error.name || error
      };
      switch (err.msg) {
        // below - internally handled
        case 'Starting video failed': // firefox: camera possessed by other process?
        case 'TrackStartError': // chrome: probably resolution not supported
          option.video = {
            device: option.video.device,
            extensionId: option.video.extensionId
          };
          if (init_retry > 0) {
            setTimeout(function() {
              createLocalStream(option, callback, init_retry - 1);
            }, 1);
            return;
          } else {
            err.msg = 'MEDIA_OPTION_INVALID';
            err.code = 1104;
          }
          break;
          // below - exposed
        case 'DevicesNotFoundError': // chrome
          err.msg = 'DEVICES_NOT_FOUND';
          err.code = 1102;
          break;
        case 'NotSupportedError': // chrome
          err.msg = 'NOT_SUPPORTED';
          err.code = 1105;
          break;
        case 'PermissionDeniedError': // chrome
          err.msg = 'PERMISSION_DENIED';
          err.code = 1101;
          break;
        case 'PERMISSION_DENIED': // firefox
          err.code = 1101;
          break;
        case 'ConstraintNotSatisfiedError': // chrome
          err.msg = 'CONSTRAINT_NOT_SATISFIED';
          err.code = 1106;
          break;
        default:
          if (!err.msg) {
            err.msg = 'UNDEFINED';
          }
      }
      if (typeof callback === 'function') {
        callback(err);
      }
    };

    if (option.video && option.video.device === 'screen') {
      if (isFirefox()) {
        if (mediaOption.video !== undefined) {
          mediaOption.video.mediaSource = 'window' || 'screen';
        } else {
          mediaOption.video = {
            mediaSource: 'window' || 'screen'
          };
        }
        getMedia.apply(navigator, [mediaOption, onSuccess, onFailure]);
        return;
      }
      var extensionId = option.video.extensionId ||
        'pndohhifhheefbpeljcmnhnkphepimhe';
      mediaOption.audio = false;
      try {
        chrome.runtime.sendMessage(extensionId, {
          getStream: true
        }, function(response) {
          if (response === undefined) {
            if (typeof callback === 'function') {
              callback({
                code: 1103,
                msg: 'screen sharing plugin inaccessible'
              });
            }
            return;
          }
          mediaOption.video.mandatory = mediaOption.video.mandatory || {};
          mediaOption.video.mandatory.chromeMediaSource = 'desktop';
          mediaOption.video.mandatory.chromeMediaSourceId = response.streamId;
          // Transfrom new constraint format to the old style. Because chromeMediaSource only supported in the old style, and mix new and old style will result type error: "Cannot use both optional/mandatory and specific or advanced constraints.".
          if (mediaOption.video.height) {
            mediaOption.video.mandatory.maxHeight = mediaOption.video.mandatory
              .minHeight = mediaOption.video.height;
            delete mediaOption.video.height;
          }
          if (mediaOption.video.width) {
            mediaOption.video.mandatory.maxWidth = mediaOption.video.mandatory
              .minWidth = mediaOption.video.width;
            delete mediaOption.video.width;
          }
          if (mediaOption.video.frameRate) {
            if (typeof mediaOption.video.frameRate === 'object') {
              mediaOption.video.mandatory.minFrameRate = mediaOption.video
                .frameRate
                .min;
              mediaOption.video.mandatory.maxFrameRate = mediaOption.video
                .frameRate
                .max;
            } else if (typeof mediaOption.video.frameRate === 'number') {
              mediaOption.video.mandatory.minFrameRate = mediaOption.video
                .frameRate;
              mediaOption.video.mandatory.maxFrameRate = mediaOption.video
                .frameRate;
            } else {
              L.Logger.warning(
                'Invalid frame rate value for screen sharing.');
            }
            delete mediaOption.video.frameRate;
          }
          getMedia.apply(navigator, [mediaOption, onSuccess, onFailure]);
        });
      } catch (err) {
        if (typeof callback === 'function') {
          callback({
            code: 1103,
            msg: 'screen sharing plugin inaccessible',
            err: err
          });
        }
      }
      return;
    }

    if (!isLegacyIE()) {
      getMedia.apply(navigator, [mediaOption, onSuccess, onFailure]);
    } else {
      navigator.getUserMedia(mediaOption, onSuccess, onFailure);
    }
  }
  /**
     * @function create
     * @desc This factory returns a Woogeen.LocalStream instance with user defined options.<br>
  <br><b>Remarks:</b><br>
  Creating LocalStream requires secure connection(HTTPS). When one or more parameters cannot be satisfied, or end user denied to grant mic/camera permission, failure callback will be triggered.
  <br><b>options:</b>
  <ul>
      <li>audio: true/false. Default is false.</li>
      <li>video: boolean or object. Default is false. If the value is a boolean, it indicates whether video is enabled or not. If the value is an object, it may have following properties: device, resolution, frameRate, extensionId.</li>
          <ul>
              <li>Valid device list:</li>
                  <ul>
                      <li>'camera' for stream from camera;</li>
                      <li>'screen' for stream from screen;</br>
                      Video quality may not good if screen sharing stream is published with H.264.</li>
                  </ul>
              <li>Valid resolution list:</li>
                  <ul>
                      <li>'unspecified'</li>
                      <li>'sif'</li>
                      <li>'vga'</li>
                      <li>'hd720p'</li>
                      <li>'hd1080p'</li>
                  </ul>
              <li>frameRate is a number indicating frames per second. Actual frame rate on browser may not be exactly the same as specified here.</li>
              <li>extensionId is id of Chrome Extension for screen sharing. </li>
          </ul>
  </ul>
  <br><b>callback:</b>
  <br>Upon success, err is null, and localStream is an instance of Woogeen.LocalStream; upon failure localStream is undefined and err is one of the following:<br>
  <ul>
    <li><b>code: 1100</b> - general stream creation error, e.g., no WebRTC support in browser, uncategorized error, etc.</li>
    <li><b>code: 1101</b> – access media (camera, microphone, etc) denied.</li>
    <li><b>code: 1102</b> – no camera or microphone available.</li>
    <li><b>code: 1103</b> - error in accessing screen sharing plugin: not supported, not installed or disabled.</li>
    <li><b>code: 1104</b> – video/audio parameters are invalid on browser and fallback fails.</li>
    <li><b>code: 1105</b> - media option not supported by the browser.</li>
    <li><b>code: 1106</b> – one of the mandatory constraints could not be satisfied.</li>
    <li><b>code: 1107</b> – user input media option is invalid.</li>
  </ul>
     * @memberOf Woogeen.LocalStream
     * @static
     * @param {json} options Stream creation options.
     * @param {function} callback callback(err, localStream) will be invoked when LocalStream creation is done.
     * @example
  <script type="text/javascript">
  // LocalStream
  var localStream;
  Woogeen.LocalStream.create({
    video: {
      device: 'camera',
      resolution: 'vga',
    },
    audio: true
  }, function (err, stream) {
    if (err) {
      return console.log('create LocalStream failed:', err);
    }
    localStream = stream;
  });
  </script>
     */
  WoogeenLocalStream.create = function() {
    createLocalStream.apply(this, arguments);
  };

  /*
  createExternalStream({
    url:'http://www.example.com/'
  }, function () {});
  */
  function createExternalStream(option, callback) {
    if (typeof option !== 'object' || !option.url) {
      if (typeof callback === 'function') {
        callback({
          code: 1107,
          msg: 'External stream must have url property'
        });
      }
      return;
    }
    if (!option.audio && !option.video) {
      if (typeof callback === 'function') {
        callback({
          code: 1107,
          msg: 'External stream must have video or audio'
        });
      }
      return;
    }
    var externalStream = new Woogeen.ExternalStream(option);
    if (typeof callback === 'function') {
      callback(null, externalStream);
    }
    return;
  }

  /**
     * @function create
     * @desc This factory returns a Woogeen.ExternalStream instance with user defined options.<br>
  <br><b>options:</b>
  <ul>
      <li>url: RTSP stream URL</li>
      <li>video: boolean or object. Default is false. If the value is a boolean, it indicates whether video is enabled or not. If the value is an object, it may have device property ,e.g.,{device: 'camera'} indicates the stream is from camera.</li>
      <li>audio: true/false. Default is false.</li>
      <li><b>Note:</b>if both video and audio are false or undefined, it will fail to publish an ExternalStream.</li>
  </ul>
  <br><b>callback:</b>
  <br>Upon success, err is null, and externalStream is an instance of Woogeen.ExternalStream; upon failure externalStream is undefined and err is one of the following:<br>
  <ul>
    <li><b>{code: 1107, msg: 'USER_INPUT_INVALID'}</b> – user input media option is invalid.</li>
  </ul>
     * @memberOf Woogeen.ExternalStream
     * @static
     * @param {json} options Stream creation options.The options must have url property and must have video or audio.
     * @param {function} callback callback(err, externalStream) will be invoked when ExternalStream creation is done.
     * @example
  <script type="text/javascript">
  // ExternalStream
  var externalStream;
  Woogeen.ExternalStream.create({
    url: 'http://www.example.com/camera',
    video: true,
    audio: true
  }, function (err, stream) {
    if (err) {
      return console.log('create ExternalStream failed:', err);
    }
    externalStream = stream;
  });
  </script>
     */
  WoogeenExternalStream.create = function() {
    createExternalStream.apply(this, arguments);
  };

  Woogeen.Stream = WoogeenStream;

  /**
   * @class Woogeen.LocalStream
   * @extends Woogeen.Stream
   * @classDesc Stream from browser constructed from camera, screen... Use create(options, callback) factory to create an instance.
   */
  Woogeen.LocalStream = WoogeenLocalStream;
  /**
   * @class Woogeen.RemoteStream
   * @extends Woogeen.Stream
   * @classDesc Stream from server retrieved by 'stream-added' event. RemoteStreams are automatically constructed upon the occurrence of the event.
  <br><b>Example:</b>

  ~~~~~~~{.js}
  <script type="text/javascript">
  conference.on('stream-added', function (event) {
    var remoteStream = event.stream;
    console.log('stream added:', stream.id());
  });
  </script>
  ~~~~~~~

   */
  Woogeen.RemoteStream = WoogeenRemoteStream;
  /**
   * @class Woogeen.RemoteMixedStream
   * @extends Woogeen.RemoteStream
   * @classDesc A RemoteStream whose video track is mixed by server.
   */
  Woogeen.RemoteMixedStream = WoogeenRemoteMixedStream;

  /**
   * @class Woogeen.ExternalStream
   * @classDesc Stream from external input(like rtsp). Use create(options, callback) factory to create an instance.
   */
  Woogeen.ExternalStream = WoogeenExternalStream;

}());



/* global io */
(function() {

  function safeCall() {
    var callback = arguments[0];
    if (typeof callback === 'function') {
      var args = Array.prototype.slice.call(arguments, 1);
      callback.apply(null, args);
    }
  }

  Woogeen.sessionId = 103;

  var getBrowser = function() {
    var browser = "none";

    if (window.navigator.userAgent.match("Firefox") !== null) {
      // Firefox
      browser = "mozilla";
    } else if (window.navigator.userAgent.match("Bowser") !== null) {
      browser = "bowser";
    } else if (window.navigator.userAgent.match(/Edge\/(\d+).(\d+)$/) !==
      null) {
      browser = "edge";
    } else if (window.navigator.userAgent.match("Chrome") !== null) {
      if (window.navigator.appVersion.match(/Chrome\/([\w\W]*?)\./)[1] >=
        26) {
        browser = "chrome-stable";
      }
    } else if (window.navigator.userAgent.match("Safari") !== null) {
      browser = "bowser";
    } else if (window.navigator.userAgent.match("WebKit") !== null) {
      browser = "bowser";
    }

    return browser;
  };

  function createChannel(spec) {
    spec.session_id = (Woogeen.sessionId += 1);
    var that = {};

    that.browser = getBrowser();
    if (that.browser === 'mozilla') {
      L.Logger.debug("Firefox Stack");
      that = Erizo.FirefoxStack(spec);
    } else if (that.browser === 'bowser') {
      L.Logger.debug("Bowser Stack");
      that = Erizo.BowserStack(spec);
    } else if (that.browser === 'chrome-stable') {
      L.Logger.debug("Stable!");
      that = Erizo.ChromeStableStack(spec);
    } else if (that.browser === 'edge') {
      L.Logger.debug("Edge Stack");
      that = Erizo.EdgeORTCStack(spec);
    } else {
      L.Logger.debug("None!");
      throw "WebRTC stack not available";
    }
    if (!that.updateSpec) {
      that.updateSpec = function(newSpec, callback) {
        L.Logger.error(
          "Update Configuration not implemented in this browser");
        if (callback) {
          callback("unimplemented");
        }
      };
    }

    return that;
  }

  function createRemoteStream(spec) {
    if (!spec.video) {
      return new Woogeen.RemoteStream(spec);
    }
    switch (spec.video.device) {
      case 'mcu':
        return new Woogeen.RemoteMixedStream(spec);
      default:
        return new Woogeen.RemoteStream(spec);
    }
  }

  function sendEvent(socket, type, callback) {
    if (!socket || !socket.connected) {
      return callback('socket not ready');
    }
    try {
      socket.emit(type, function(resp, mesg) {
        if (resp === 'success') {
          return callback(null, mesg);
        }
        return callback(mesg || 'response error');
      });
    } catch (err) {
      callback('socket emit error');
    }
  }

  function sendMsg(socket, type, message, callback) {
    if (!socket || !socket.connected) {
      return callback('socket not ready');
    }
    try {
      socket.emit(type, message, function(resp, mesg) {
        if (resp === 'success') {
          return callback(null, mesg);
        }
        return callback(mesg || 'response error');
      });
    } catch (err) {
      callback('socket emit error');
    }
  }

  function sendSdp(socket, type, option, sdp, callback) {
    if (!socket || !socket.connected) {
      return callback('error', 'socket not ready');
    }
    try {
      socket.emit(type, option, sdp, function(status, resp) {
        callback(status, resp);
      });
    } catch (err) {
      callback('error', 'socket emit error');
    }
  }

  function sendCtrlPayload(socket, action, streamId, onSuccess, onFailure) {
    var payload = {
      type: 'control',
      payload: {
        action: action,
        streamId: streamId
      }
    };
    sendMsg(socket, 'customMessage', payload, function(err, resp) {
      if (err) {
        return safeCall(onFailure, err);
      }
      safeCall(onSuccess, resp);
    });
  }

  var DISCONNECTED = 0,
    CONNECTING = 1,
    CONNECTED = 2;

  var WoogeenConferenceBase = function WoogeenConferenceBase(spec) {
    this.internalDispatcher = Woogeen.EventDispatcher({});
    this.spec = spec || {};
    this.remoteStreams = {};
    this.localStreams = {};
    this.state = DISCONNECTED;
  };

  WoogeenConferenceBase.prototype = Woogeen.EventDispatcher({}); // make WoogeenConferenceBase a eventDispatcher

  /**
     * @function setIceServers
     * @desc This function establishes a connection to server and joins a certain conference.
  <br><b>Remarks:</b><br>
  This method accepts array (multiple ones) type of ice server item as argument. Typical description of each valid value should be as below:<br>
  <ul>
  <li>For turn: {urls: array or single "url", username: "username", credential: "password"}.</li>
  <li>For stun: {urls: array or single "url"}.</li>
  </ul>
  Each time this method is called, previous saved value would be discarded. Specifically, if parameter servers is not provided, the result would be an empty array, meaning any predefined servers are discarded.
     * @instance
     * @memberOf Woogeen.ConferenceClient&Woogeen.SipClient
     * @param {string/object/array} servers turn or stun server configuration.
     * @return {array} Result of the user-set of ice servers.
     * @example
  <script type="text/JavaScript">
  ...
  client.setIceServers([{
      urls: "stun:x.x.x.x:3478"
    }, {
      urls: ["turn:x.x.x.x:443?transport=udp", "turn:x.x.x.x:443?transport=tcp"],
      username: "abc",
      credential: "xyz"
    }]);
  </script>
     */

  WoogeenConferenceBase.prototype.setIceServers = function() {
    var that = this.spec;
    that.userSetIceServers = [];
    Array.prototype.slice.call(arguments, 0).map(function(arg) {
      if (arg instanceof Array) {
        arg.map(function(server) {
          if (typeof server === 'object' && server !== null) {
            if (typeof server.urls === 'string' && server.urls !==
              '' || server.urls instanceof Array) {
              that.userSetIceServers.push(server);
            } else if (typeof server.url === 'string' && server.url !==
              '') {
              server.urls = server.url;
              delete server.url;
              that.userSetIceServers.push(server);
            }
          } else if (typeof server === 'string' && server !== '') {
            that.userSetIceServers.push({
              urls: server
            });
          }
        });
      } else if (typeof arg === 'object' && arg !== null) {
        if (typeof arg.urls === 'string' && arg.urls !== '' || arg.urls instanceof Array) {
          that.userSetIceServers.push(arg);
        } else if (typeof arg.url === 'string' && arg.url !== '') {
          arg.urls = arg.url;
          delete arg.url;
          that.userSetIceServers.push(arg);
        }
      } else if (typeof arg === 'string' && arg !== '') {
        that.userSetIceServers.push({
          urls: arg
        });
      }
    });
    return that.userSetIceServers;
  };

  WoogeenConferenceBase.prototype.getIceServers = function() {
    return this.spec.userSetIceServers;
  };


  WoogeenConferenceBase.prototype.join = function(tokenString, onSuccess,
    onFailure) {
    var token;
    try {
      token = JSON.parse(L.Base64.decodeBase64(tokenString));
    } catch (err) {
      return safeCall(onFailure, 'invalid token');
    }
    var self = this;
    var isSecured = (token.secure === true);
    var host = token.host;
    if (typeof host !== 'string') {
      return safeCall(onFailure, 'invalid host');
    }
    if (host.indexOf('http') === -1) {
      host = isSecured ? ('https://' + host) : ('http://' + host);
    }
    // check connection>host< state
    if (self.state !== DISCONNECTED) {
      return safeCall(onFailure, 'connection state invalid');
    }

    self.state = CONNECTING;

    if (self.socket !== undefined) { // whether reconnect
      self.socket.connect();
    } else {
      self.socket = io.connect(host, {
        reconnect: false,
        secure: isSecured,
        'force new connection': true
      });

      self.socket.on('add_stream', function(spec) {
        if (self.remoteStreams[spec.id] !== undefined) {
          L.Logger.warning('stream already added:', spec.id);
          return;
        }
        var stream = createRemoteStream({
          video: spec.video,
          audio: spec.audio,
          id: spec.id,
          from: spec.from,
          attributes: spec.attributes
        });
        var evt = new Woogeen.StreamEvent({
          type: 'stream-added',
          stream: stream
        });
        self.remoteStreams[spec.id] = stream;
        self.dispatchEvent(evt);
      });

      self.socket.on('update_stream', function(spec) {
        // Handle: 'VideoEnabled', 'VideoDisabled', 'AudioEnabled', 'AudioDisabled', 'VideoLayoutChanged', [etc]
        var stream = self.remoteStreams[spec.id];
        if (stream) {
          stream.emit(spec.event, spec.data);
        }
      });

      self.socket.on('remove_stream', function(spec) {
        var stream = self.remoteStreams[spec.id];
        if (stream) {
          stream.close(); // >removeStream<
          delete self.remoteStreams[spec.id];
          var evt = new Woogeen.StreamEvent({
            type: 'stream-removed',
            stream: stream
          });
          self.dispatchEvent(evt);
        }
      });

      self.socket.on('signaling_message_erizo', function(arg) {
        var stream;
        if (arg.peerId) {
          stream = self.remoteStreams[arg.peerId];
        } else {
          stream = self.localStreams[arg.streamId];
        }

        if (stream && stream.channel) {
          stream.channel.processSignalingMessage(arg.mess);
        }
      });

      self.socket.on('add_recorder', function(spec) {
        var evt = new Woogeen.RecorderEvent({
          type: 'recorder-added',
          id: spec.id
        });
        self.dispatchEvent(evt);
      });

      self.socket.on('reuse_recorder', function(spec) {
        var evt = new Woogeen.RecorderEvent({
          type: 'recorder-continued',
          id: spec.id
        });
        self.dispatchEvent(evt);
      });

      self.socket.on('remove_recorder', function(spec) {
        var evt = new Woogeen.RecorderEvent({
          type: 'recorder-removed',
          id: spec.id
        });
        self.dispatchEvent(evt);
      });

      self.socket.on('disconnect', function() {
        var triggerEvent = false;
        if (self.state !== DISCONNECTED) {
          triggerEvent = true;
          L.Logger.info('Will trigger server-disconnect');
        } else {
          L.Logger.info('Will not trigger server-disconnect');
        }
        self.state = DISCONNECTED;
        self.myId = null;
        var i, stream;
        // remove all remote streams
        for (i in self.remoteStreams) {
          if (self.remoteStreams.hasOwnProperty(i)) {
            stream = self.remoteStreams[i];
            stream.close();
            delete self.remoteStreams[i];
          }
        }

        // close all channel
        for (i in self.localStreams) {
          if (self.localStreams.hasOwnProperty(i)) {
            stream = self.localStreams[i];
            if (stream.channel && typeof stream.channel.close ===
              'function') {
              stream.channel.close();
            }
            delete self.localStreams[i];
          }
        }

        // close socket.io
        try {
          self.socket.disconnect();
        } catch (err) {}
        if (triggerEvent) {
          var evtDisconnect = new Woogeen.ClientEvent({
            type: 'server-disconnected'
          });
          self.dispatchEvent(evtDisconnect);
        }
      });


      self.socket.on('user_join', function(spec) {
        var evt = new Woogeen.ClientEvent({
          type: 'user-joined',
          user: spec.user
        });
        self.dispatchEvent(evt);
      });

      self.socket.on('user_leave', function(spec) {
        var evt = new Woogeen.ClientEvent({
          type: 'user-left',
          user: spec.user
        });
        self.dispatchEvent(evt);
      });

      self.socket.on('custom_message', function(spec) {
        var evt = new Woogeen.MessageEvent({
          type: 'message-received',
          msg: spec
        });
        self.dispatchEvent(evt);
      });

      self.socket.on('connect_failed', function(err) {
        safeCall(onFailure, err || 'connection_failed');
      });

      self.socket.on('error', function(err) {
        safeCall(onFailure, err || 'connection_error');
      });

      self.socket.on('connection_failed', function(args) {
        L.Logger.error("MCU reports connection failed for stream: " + args.streamId);
        if (self.localStreams[args.streamId] !== undefined) {
          var stream = self.localStreams[args.streamId];
          self.unpublish(stream);
          // It is deleted if MCU ack "success" for unpublish. But I'm not
          // sure if MCU will ack "success" if the original access agent is
          // down.
          delete self.localStreams[args.streamId];
        } else {
          self.unsubscribe(self.remoteStreams[args.streamId]);
        }

        if (self.state !== DISCONNECTED) {
          var disconnectEvt = new Woogeen.StreamEvent({
            type: 'stream-failed'
          });
          self.dispatchEvent(disconnectEvt);
        }
      });

      // Seems MCU no longer emits this event.
      self.socket.on('stream-publish', function(spec) {
        var myStream = self.localStreams[spec.id];
        if (myStream) {
          console.log('Stream published');
          self.dispatchEvent(new Woogeen.StreamEvent({
            type: 'stream-published',
            stream: myStream
          }));
        }
      });

    }

    try {
      var loginInfo = {
        token: tokenString,
        userAgent: Woogeen.Common.sysInfo()
      };
      self.socket.emit('login', loginInfo, function(status, resp) {
        if (status === 'success') {
          self.myId = resp.clientId;
          self.conferenceId = resp.id;
          self.state = CONNECTED;
          var streams = [];
          self.conferenceId = resp.id;
          if (resp.streams !== undefined) {
            streams = resp.streams.map(function(st) {
              self.remoteStreams[st.id] = createRemoteStream(st);
              return self.remoteStreams[st.id];
            });
          }
          var me;
          if (resp.users !== undefined) {
            for (var i = 0; i < resp.users.length; i++) {
              if (resp.users[i].id === resp.clientId) {
                me = resp.users[i];
                break;
              }
            }
          }
          return safeCall(onSuccess, {
            streams: streams,
            users: resp.users,
            self: me
          });
        }
        return safeCall(onFailure, resp || 'response error');
      });
    } catch (e) {
      safeCall(onFailure, 'socket emit error');
    }
  };

  /**
     * @function publish
     * @instance
     * @desc This function publishes the local stream to the server. The stream should be a valid LocalStream instance. 'stream-added' event would be triggered when the stream is published successfully.
     * @memberOf Woogeen.ConferenceClient&Woogeen.SipClient
     * @param {stream} stream Stream to publish.
     * @param {json} options Publish options. Following properties are supported:<br>
      <ul>
        <li>maxAudioBW: xxx. It does not work on Edge.</li>
        <li>maxVideoBW: xxx. It does not work on Edge.</li>
        <li>unmix: false/true. If true, this stream would not be included in mixed stream.</li>
        <li>audioCodec: 'opus'/'pcmu'/'pcma'. Preferred audio codec.</li>
        <li>videoCodec: 'h264'/'vp8'/'vp9'. Preferred video codec. Note for Firefox vp9 is not stable, so please do not specify vp9 for Firefox.</li>
        <li>transport: 'udp'/'tcp'. RTSP connection transport type, default 'udp'; only for RTSP input.</li>
        <li>bufferSize: integer number in bytes. UDP receiving buffer size, default 2 MB. Only for RTSP input (UDP transport).</li>
      </ul>
      Each codec has its own supported bitrate range. Setting incorrect maxAudioBW/maxVideoBW value may lead to connection failure. Bandwidth settings don't work on FireFox.
     * @param {function} onSuccess(stream) (optional) Success callback.
     * @param {function} onFailure(err) (optional) Failure callback.
     * @example
  <script type="text/JavaScript">
  ...
  // ……
  client.publish(localStream, {maxVideoBW: 300}, function (st) {
      L.Logger.info('stream published:', st.id());
    }, function (err) {
      L.Logger.error('publish failed:', err);
    }
  );
  </script>
     */

  WoogeenConferenceBase.prototype.publish = function(stream, options,
    onSuccess, onFailure) {
    var self = this;
    stream = stream || {};
    if (typeof options === 'function') {
      onFailure = onSuccess;
      onSuccess = options;
      options = stream.bitRate;
    } else if (typeof options !== 'object' || options === null) {
      options = stream.bitRate;
    }
    if (!(stream instanceof Woogeen.LocalStream || stream instanceof Woogeen
        .ExternalStream) ||
      ((typeof stream.mediaStream !== 'object' || stream.mediaStream ===
          null) &&
        stream.url() === undefined)) {
      return safeCall(onFailure, 'invalid stream');
    }

    if (self.localStreams[stream.id()] === undefined) { // not pulished
      var opt = stream.toJson();
      if (options.unmix === true) {
        opt.unmix = true;
      }
      if (stream.url() !== undefined) {
        opt.state = 'url';
        opt.transport = options.transport;
        opt.bufferSize = options.bufferSize;
        sendSdp(self.socket, 'publish', opt, stream.url(), function(answer,
          id) {
          if (answer !== 'success') {
            return safeCall(onFailure, answer);
          }
          stream.id = function() {
            return id;
          };
          stream.unpublish = function(onSuccess, onFailure) {
            self.unpublish(stream, onSuccess, onFailure);
          };
          self.localStreams[id] = stream;
          safeCall(onSuccess, stream);
        });
        return;
      }

      opt.state = 'erizo';
      sendSdp(self.socket, 'publish', opt, undefined, function(answer, id) {
        if (answer === 'error') {
          return safeCall(onFailure, id);
        }
        if (answer === 'timeout') {
          return safeCall(onFailure, answer);
        }
        stream.id = function() {
          return id;
        };
        self.localStreams[id] = stream;

        stream.channel = createChannel({
          callback: function(message) {
            console.log("Sending message", message);
            sendSdp(self.socket, 'signaling_message', {
              streamId: id,
              msg: message
            }, undefined, function() {});
          },
          video: stream.hasVideo(),
          audio: stream.hasAudio(),
          iceServers: self.getIceServers(),
          maxAudioBW: options.maxAudioBW,
          maxVideoBW: options.maxVideoBW,
          audioCodec: options.audioCodec,
          videoCodec: options.videoCodec
        });

        var onChannelReady = function() {
          stream.signalOnPlayAudio = function(onSuccess, onFailure) {
            sendCtrlPayload(self.socket, 'audio-out-on', id,
              onSuccess, onFailure);
          };
          stream.signalOnPauseAudio = function(onSuccess, onFailure) {
            sendCtrlPayload(self.socket, 'audio-out-off', id,
              onSuccess, onFailure);
          };
          stream.signalOnPlayVideo = function(onSuccess, onFailure) {
            sendCtrlPayload(self.socket, 'video-out-on', id,
              onSuccess, onFailure);
          };
          stream.signalOnPauseVideo = function(onSuccess, onFailure) {
            sendCtrlPayload(self.socket, 'video-out-off', id,
              onSuccess, onFailure);
          };
          stream.unpublish = function(onSuccess, onFailure) {
            self.unpublish(stream, onSuccess, onFailure);
          };
          safeCall(onSuccess, stream);
          onFailure = function() {};
          onChannelReady = function() {};
        };
        var onChannelFailed = function() {
          sendMsg(self.socket, 'unpublish', id, function() {},
            function() {}); // FIXME: still need this?
          stream.channel.close();
          stream.channel = undefined;
          safeCall(onFailure, 'peer connection failed');
          onChannelReady = function() {};
          onChannelFailed = function() {};
        };
        stream.channel.oniceconnectionstatechange = function(state) {
          switch (state) {
            case 'completed': // chrome
            case 'connected': // firefox
              onChannelReady();
              break;
            case 'checking':
            case 'closed':
              break;
            case 'failed':
              onChannelFailed();
              break;
            default:
              L.Logger.warning('unknown ice connection state:', state);
          }
        };

        stream.channel.addStream(stream.mediaStream);
        stream.channel.createOffer();
      });
    } else {
      return safeCall(onFailure, 'already published');
    }
  };

  /**
     * @function unpublish
     * @instance
     * @desc This function unpublishes the local stream. 'stream-removed' event would be triggered when the stream is removed from server.
     * @memberOf Woogeen.ConferenceClient&Woogeen.SipClient
     * @param {stream} stream Stream to un-publish.
     * @param {function} onSuccess() (optional) Success callback.
     * @param {function} onFailure(err) (optional) Failure callback.
     * @example
  <script type="text/JavaScript">
  ...
  // ……
  client.unpublish(localStream, function (st) {
      L.Logger.info('stream unpublished:', st.id());
    }, function (err) {
      L.Logger.error('unpublish failed:', err);
    }
  );
  </script>
     */

  WoogeenConferenceBase.prototype.unpublish = function(stream, onSuccess,
    onFailure) {
    var self = this;
    if (!(stream instanceof Woogeen.LocalStream || stream instanceof Woogeen
        .ExternalStream)) {
      return safeCall(onFailure, 'invalid stream');
    }
    sendMsg(self.socket, 'unpublish', stream.id(), function(err) {
      /* TODO(jianlin): for now we close corresponding channel as long as we request unpublishing.
         futher we need to parse the err from mcu to decide if channel needs to
         be closed*/
      if (stream.channel && typeof stream.channel.close === 'function') {
        stream.channel.close();
        stream.channel = null;
      }
      delete self.localStreams[stream.id()];
      stream.id = function() {
        return null;
      };
      stream.signalOnPlayAudio = undefined;
      stream.signalOnPauseAudio = undefined;
      stream.signalOnPlayVideo = undefined;
      stream.signalOnPauseVideo = undefined;
      delete stream.unpublish;
      if (err) {
        return safeCall(onFailure, err);
      }
      safeCall(onSuccess, null);
    });
  };

  /**
     * @function subscribe
     * @instance
     * @desc This function subscribes to a remote stream. The stream should be a RemoteStream instance.
     <br><b>options:</b><br>
  {<br>
  video: true/false, {resolution: {width:xxx, height:xxx}, qualityLevel:'xxx'},<br>
  audio: true/false,<br>
  videoCodec: 'h264'/'vp8'/'vp9'. This property specifies preferred video codec. Note for Firefox vp9 is not stable, so please do not sepcify vp9 for Firefox.<br>
  }
  <br><b>Remarks:</b><br>
  Video resolution choice is only valid for subscribing {@link Woogeen.RemoteMixedStream Woogeen.RemoteMixedStream} when multistreaming output is enabled.　See {@link N.API.createRoom N.API.createRoom()} for detailed description of multistreaming.<br>
     * @memberOf Woogeen.ConferenceClient&Woogeen.SipClient
     * @param {stream} stream Stream to subscribe.
     * @param {json} options (optional) Subscribe options. Options could be a boolean value or an object. If it is an boolean value, it indicates whether video is enabled or not. If it is an object, video will be enabled and this object is video options. The object may have following properties:</br>
       resolution: An object has width and height. Both width and height are number.</br>
       qualityLevel: A string which is one of these values "BestQuality", "BetterQuality", "Standard", "BetterSpeed", "BestSpeed". It does not change resolution, but better quality leads to higher bitrate.
     * @param {function} onSuccess(stream) (optional) Success callback.
     * @param {function} onFailure(err) (optional) Failure callback.
     * @example
  <script type="text/JavaScript">
  ...
  // ……
  client.subscribe(remoteStream, function (st) {
      L.Logger.info('stream subscribed:', st.id());
    }, function (err) {
      L.Logger.error('subscribe failed:', err);
    }
  );
  </script>
     */

  WoogeenConferenceBase.prototype.subscribe = function(stream, options,
    onSuccess, onFailure) {
    var self = this;
    var mediaStreamIsReady = false;
    var channelIsReady = false;
    if (typeof options === 'function') {
      onFailure = onSuccess;
      onSuccess = options;
      options = {};
    } else if (typeof options !== 'object' || options === null) {
      options = {};
    }
    if (!(stream instanceof Woogeen.RemoteStream)) {
      return safeCall(onFailure, 'invalid stream');
    }

    if (options.audio === false && options.video === false) {
      return safeCall(onFailure, 'no audio or video to subscribe.');
    }

    if (!stream.isMixed() && typeof options.video === 'object' && (options.video
      .resolution || options.video.qualityLevel)) {
      return safeCall(onFailure,
        'Resolution and quality level settings are not available for non-mixed stream.');
    }

    if (typeof options.video === 'object' && options.video.qualityLevel) {
      // Socket.IO message is "quality_level" while SDK style is "qualityLevel".
      options.video.quality_level = options.video.qualityLevel;
      delete options.video.qualityLevel;
    }

    sendSdp(self.socket, 'subscribe', {
      streamId: stream.id(),
      audio: stream.hasAudio() && (options.audio !== false),
      video: stream.hasVideo() && options.video,
      browser: getBrowser()
    }, undefined, function(answer, errText) {
      if (answer === 'error' || answer === 'timeout') {
        return safeCall(onFailure, errText || answer);
      }

      stream.channel = createChannel({
        callback: function(message) {
          sendSdp(self.socket, 'signaling_message', {
            streamId: stream.id(),
            msg: message,
            browser: stream.channel.browser
          }, undefined, function() {});
        },
        audio: stream.hasAudio() && (options.audio !== false),
        video: stream.hasVideo() && (options.video !== false),
        iceServers: self.getIceServers(),
        videoCodec: options.videoCodec
      });

      stream.channel.onaddstream = function(evt) {
        stream.mediaStream = evt.stream;
        if (channelIsReady && (mediaStreamIsReady === false)) {
          mediaStreamIsReady = true;
          safeCall(onSuccess, stream);
        } else {
          mediaStreamIsReady = true;
        }
      };
      var onChannelReady = function() {
        stream.signalOnPlayAudio = function(onSuccess, onFailure) {
          sendCtrlPayload(self.socket, 'audio-in-on', stream.id(),
            onSuccess, onFailure);
        };
        stream.signalOnPauseAudio = function(onSuccess, onFailure) {
          sendCtrlPayload(self.socket, 'audio-in-off', stream.id(),
            onSuccess, onFailure);
        };
        stream.signalOnPlayVideo = function(onSuccess, onFailure) {
          sendCtrlPayload(self.socket, 'video-in-on', stream.id(),
            onSuccess, onFailure);
        };
        stream.signalOnPauseVideo = function(onSuccess, onFailure) {
          sendCtrlPayload(self.socket, 'video-in-off', stream.id(),
            onSuccess, onFailure);
        };
        if (mediaStreamIsReady && (channelIsReady === false)) {
          channelIsReady = true;
          safeCall(onSuccess, stream);
        } else {
          channelIsReady = true;
        }
        onFailure = function() {};
        onChannelReady = function() {};
      };
      var onChannelFailed = function() {
        sendMsg(self.socket, 'unsubscribe', stream.id(), function() {},
          function() {});
        stream.close();
        stream.signalOnPlayAudio = undefined;
        stream.signalOnPauseAudio = undefined;
        stream.signalOnPlayVideo = undefined;
        stream.signalOnPauseVideo = undefined;
        safeCall(onFailure, 'peer connection failed');
        onChannelReady = function() {};
        onChannelFailed = function() {};
      };
      stream.channel.oniceconnectionstatechange = function(state) {
        switch (state) {
          case 'completed': // chrome
          case 'connected': // firefox
            onChannelReady();
            break;
          case 'checking':
          case 'closed':
            break;
          case 'failed':
            onChannelFailed();
            break;
          default:
            L.Logger.warning('unknown ice connection state:', state);
        }
      };
      stream.channel.createOffer(true);
    });
  };

  /**
     * @function unsubscribe
     * @instance
     * @desc This function unsubscribes the remote stream.
     * @memberOf Woogeen.ConferenceClient&Woogeen.SipClient
     * @param {stream} stream Stream to unsubscribe.
     * @param {function} onSuccess() (optional) Success callback.
     * @param {function} onFailure(err) (optional) Failure callback.
     * @example
  <script type="text/JavaScript">
  ...
  // ……
  client.unsubscribe(remoteStream, function (st) {
      L.Logger.info('stream unsubscribed:', st.id());
    }, function (err) {
      L.Logger.error('unsubscribe failed:', err);
    }
  );
  </script>
     */

  WoogeenConferenceBase.prototype.unsubscribe = function(stream, onSuccess,
    onFailure) {
    var self = this;
    if (!(stream instanceof Woogeen.RemoteStream)) {
      return safeCall(onFailure, 'invalid stream');
    }
    sendMsg(self.socket, 'unsubscribe', stream.id(), function(err, resp) {
      if (err) {
        return safeCall(onFailure, err);
      }
      stream.close();
      stream.signalOnPlayAudio = undefined;
      stream.signalOnPauseAudio = undefined;
      stream.signalOnPlayVideo = undefined;
      stream.signalOnPauseVideo = undefined;
      safeCall(onSuccess, resp);
    });
  };

  /**
     * @function onMessage
     * @instance
     * @desc This function is the shortcut of on('message-received', callback).
  <br><b>Remarks:</b><br>Once the message is received, the callback is invoked.
     * @memberOf Woogeen.ConferenceClient&Woogeen.SipClient
     * @param {function} callback callback function to the message.
     * @example
  <script type="text/JavaScript">
    ...
    // ……
    client.onMessage(function (event) {
      L.Logger.info('Message Received:', event.msg);
    });
  </script>
     */

  WoogeenConferenceBase.prototype.onMessage = function(callback) {
    if (typeof callback === 'function') {
      this.on('message-received', callback);
    }
  };

  /**
   * @class Woogeen.ConferenceClient
   * @classDesc Provides connection, local stream publication, and remote stream subscription for a video conference. The conference client is created by the server side API. The conference client is retrieved by the client API with the access token for the connection.
   */

  Woogeen.ConferenceClient = (function() {
    'use strict';
    var WoogeenConference = function WoogeenConference(spec) {
      WoogeenConferenceBase.call(this, spec);

      /**
         * @function join
         * @instance
         * @desc This function establishes a connection to server and joins a certain　conference.
      <br><b>Remarks:</b><br>
      On success, successCallback is called (if provided); otherwise, failureCallback is called (if provided).
      <br><b>resp:</b><br>
      {<br>
       streams:, an array of remote streams that have been published in the conference.<br>
       users:, an array of users that have joined in the conference.<br>
       self:, an object for current user's infomation.<br>
      }
         * @memberOf Woogeen.ConferenceClient
         * @param {string} token Token used to join conference room.
         * @param {function} onSuccess(resp) (optional) Success callback function.
         * @param {function} onFailure(err) (optional) Failure callback function.
         * @example
      <script type="text/JavaScript">
      conference.join(token, function(response) {...}, function(error) {...});
      </script>
         */

      this.join = function(token, onSuccess, onFailure) {
        WoogeenConferenceBase.prototype.join.call(this, token,
          onSuccess, onFailure);
      };

      /**
         * @function leave
         * @instance
         * @desc This function leaves conference and disconnects from server. Once it is done, 'server-disconnected' event would be triggered.
         * @memberOf Woogeen.ConferenceClient
         * @example
      <script type="text/JavaScript">
      var conference = Woogeen.ConferenceClient.create();
      // ......
      conference.leave();
      </script>
         */
      this.leave = function() {
        sendEvent(this.socket, 'logout', function(err) {
          if (err) {
            L.Logger.warning(
              'Server returns error for logout event');
          }
        });
        this.socket.disconnect();
      };

      /**
     * @function send
     * @instance
     * @desc This function send message to conference room. The receiver should be a valid clientId, which is carried by 'user-joined' event; or default 0, which means send to all participants in the conference (broadcast) except himself.
     * @memberOf Woogeen.ConferenceClient
     * @param {string} data text message to send.
     * @param {string} receiver Receiver, optional. Sending message to all participants if receiver is undefined.
     * @param {function} onSuccess() (optional) Success callback.
     * @param {function} onFailure(err) (optional) Failure callback.
     * @example
  <script type="text/JavaScript">
  var conference = Woogeen.ConferenceClient.create();
  // ……
  conference.send(message, receiver, function () {
      L.Logger.info('mesage send success.');
    }, function (err) {
      L.Logger.error('send failed:', err);
    }
  );
  </script>
     */
      this.send = function(data, receiver, onSuccess, onFailure) {
        if (data === undefined || data === null || typeof data ===
          'function') {
          return safeCall(onFailure, 'nothing to send');
        }
        if (typeof receiver === 'undefined') {
          receiver = 'all';
        } else if (typeof receiver === 'string') {
          // supposed to be a valid receiverId.
          // pass.
        } else if (typeof receiver === 'function') {
          onFailure = onSuccess;
          onSuccess = receiver;
          receiver = 'all';
        } else {
          return safeCall(onFailure, 'invalid receiver');
        }
        sendMsg(this.socket, 'customMessage', {
          type: 'data',
          data: data,
          receiver: receiver
        }, function(err, resp) {
          if (err) {
            return safeCall(onFailure, err);
          }
          safeCall(onSuccess, resp);
        });
      };


      /**
         * @function mix
         * @instance
         * @desc This function tells server to add published LocalStream to mix stream.
         * @memberOf Woogeen.ConferenceClient
         * @param {LocalStream} stream LocalStream instance; it should be published before this call.
         * @param {function} onSuccess() (optional) Success callback.
         * @param {function} onFailure(err) (optional) Failure callback.
         * @example
      <script type="text/JavaScript">
      var conference = Woogeen.ConferenceClient.create();
      // ……
      conference.mix(localStream, function () {
          L.Logger.info('success');
        }, function (err) {
          L.Logger.error('failed:', err);
        }
      );
      </script>
         */
      this.mix = function(stream, onSuccess, onFailure) {
        if (!(stream instanceof Woogeen.LocalStream) && !(stream instanceof Woogeen.ExternalStream)) {
          return safeCall(onFailure, 'invalid stream');
        }
        sendMsg(this.socket, 'addToMixer', stream.id(), function(err) {
          if (err) {
            return safeCall(onFailure, err);
          }
          safeCall(onSuccess, null);
        });
      };

      /**
         * @function unmix
         * @instance
         * @desc This function tells server to remove published LocalStream from mix stream.
         * @memberOf Woogeen.ConferenceClient
         * @param {stream} stream LocalStream instance; it should be published before this call.
         * @param {function} onSuccess() (optional) Success callback.
         * @param {function} onFailure(err) (optional) Failure callback.
         * @example
      <script type="text/JavaScript">
      var conference = Woogeen.ConferenceClient.create();
      // ……
      conference.unmix(localStream, function () {
          L.Logger.info('success');
        }, function (err) {
          L.Logger.error('failed:', err);
        }
      );
      </script>
         */
      this.unmix = function(stream, onSuccess, onFailure) {
        if (!(stream instanceof Woogeen.LocalStream) && !(stream instanceof Woogeen.ExternalStream)) {
          return safeCall(onFailure, 'invalid stream');
        }
        sendMsg(this.socket, 'removeFromMixer', stream.id(), function(
          err) {
          if (err) {
            return safeCall(onFailure, err);
          }
          safeCall(onSuccess, null);
        });
      };


      /**
     * @function shareScreen
     * @instance
     * @desc This function creates a LocalStream from screen and publishes it to the　server.
      <br><b>Remarks:</b><br>
      This API is not supported on Edge browser currently.
     * @memberOf Woogeen.ConferenceClient
     * @param {string} options (optional) : extensionId, resolution, frameRate, maxVideoBW, videoCodec.<br/>
        <ul>
          <li>extensionId is id of Chrome Extension for screen sharing.</li>
          <li>Valid resolution list:</li>
              <ul>
                  <li>'sif'</li>
                  <li>'vga'</li>
                  <li>'hd720p'</li>
                  <li>'hd1080p'</li>
                  <li>If not provided, the resolution is decided by the screen size.</li>
              </ul>
          <li>frameRate is a number indicating frames per second. Actual frame rate on browser may not be exactly the same as specified here.</li>
          <li>maxVideoBW: xxx</li>
          <li>videoCodec: 'h264'/'vp8'/'vp9'. Note for Firefox vp9 is not stable, so please do not specify vp9 for Firefox.</li>
        </ul>
        Each codec has its own supported bitrate range. Setting incorrect maxAudioBW/maxVideoBW value may lead to connection failure. Bandwidth settings don't work on FireFox.<br/>
     * @param {function} onSuccess(stream) (optional) Success callback.
     * @param {function} onFailure(err) (optional) Failure callback. See details about error definition in {@link Woogeen.LocalStream#create LocalStream.create}.
     * @example
  <script type="text/JavaScript">
  var conference = Woogeen.ConferenceClient.create();
  // ……
  conference.shareScreen({ extensionId:'pndohhifhheefbpeljcmnhnkphepimhe', resolution: 'hd1080p', frameRate:10, maxVideoBW:2000, videoCodec:'vp8'}, function (st) {
      L.Logger.info('screen shared:', st.id());
    }, function (err) {
      L.Logger.error('sharing failed:', err);
    }
  );
  </script>
     */
      this.shareScreen = function(option, onSuccess, onFailure) {
        var self = this;
        if (typeof option === 'function') {
          onFailure = onSuccess;
          onSuccess = option;
          option = {};
        }
        option = option || {};
        Woogeen.LocalStream.create({
          video: {
            device: 'screen',
            extensionId: option.extensionId,
            resolution: option.resolution ? option.resolution : {
              width: screen.width,
              height: screen.height
            },
            frameRate: option.frameRate
          },
          audio: false
        }, function(err, stream) {
          if (err) {
            return safeCall(onFailure, err);
          }
          self.publish(stream, {
              maxVideoBW: option.maxVideoBW,
              videoCodec: option.videoCodec
            },
            function(st) {
              safeCall(onSuccess, st);
            },
            function(err) {
              safeCall(onFailure, err);
            });
        });
      };


      /**
         * @function playAudio
         * @desc This function tells server to continue sending/receiving audio data of the RemoteStream/LocalStream.
      <br><b>Remarks:</b><br>
      The audio track of the stream should be enabled to be played correctly. For RemoteStream, it should be subscribed; for LocalStream, it should be published. playAudio with video only stream will succeed without any action.<br>
      External Stream does not support this function.
         * @memberOf Woogeen.ConferenceClient
         * @param {WoogeenStream} stream instance.
         * @param {function} onSuccess() (optional) Success callback.
         * @param {function} onFailure(err) (optional) Failure callback.
         * @instance
         */
      this.playAudio = function(stream, onSuccess, onFailure) {
        if ((stream instanceof Woogeen.Stream) && stream.hasAudio() &&
          typeof stream.signalOnPlayAudio === 'function') {
          return stream.signalOnPlayAudio(onSuccess, onFailure);
        }
        if (typeof onFailure === 'function') {
          onFailure('unable to call playAudio');
        }
      };

      /**
         * @function pauseAudio
         * @desc This function tells server to stop sending/receiving audio data of the subscribed RemoteStream/LocalStream.
      <br><b>Remarks:</b><br>
      Upon success, the audio of the stream would be hold, and you can call disableAudio() method to disable the audio track locally to stop playing. For RemoteStream, it should be subscribed; for LocalStream, it should be published. puaseAudio with video only stream will succeed without any action.<br>
      External Stream does not support this function.
         * @memberOf Woogeen.ConferenceClient
         * @param {WoogeenStream} stream instance.
         * @param {function} onSuccess() (optional) Success callback.
         * @param {function} onFailure(err) (optional) Failure callback.
         * @instance
         */
      this.pauseAudio = function(stream, onSuccess, onFailure) {
        if ((stream instanceof Woogeen.Stream) && stream.hasAudio() &&
          typeof stream.signalOnPauseAudio === 'function') {
          return stream.signalOnPauseAudio(onSuccess, onFailure);
        }
        if (typeof onFailure === 'function') {
          onFailure('unable to call pauseAudio');
        }
      };

      /**
         * @function playVideo
         * @desc This function tells server to continue sending/receiving video data of the subscribed RemoteStream/LocalStream.
      <br><b>Remarks:</b><br>
      The video track of the stream should be enabled to be played correctly. For RemoteStream, it should be subscribed; for LocalStream, it should be published. playVideo with audio only stream will succeed without any action.<br>
      External Stream does not support this function.
         * @memberOf Woogeen.ConferenceClient
         * @param {WoogeenStream} stream instance.
         * @param {function} onSuccess() (optional) Success callback.
         * @param {function} onFailure(err) (optional) Failure callback.
         * @instance
         */
      this.playVideo = function(stream, onSuccess, onFailure) {
        if ((stream instanceof Woogeen.Stream) && stream.hasVideo() &&
          typeof stream.signalOnPlayVideo === 'function') {
          return stream.signalOnPlayVideo(onSuccess, onFailure);
        }
        if (typeof onFailure === 'function') {
          onFailure('unable to call playVideo');
        }
      };

      /**
         * @function pauseVideo
         * @desc This function tells server to stop sending/receiving video data of the subscribed RemoteStream/LocalStream.
      <br><b>Remarks:</b><br>
      Upon success, the video of the stream would be hold, and you can call disableVideo() method to disable the video track locally to stop playing. For RemoteStream, it should be subscribed; for LocalStream, it should be published. pauseVideo with audio only stream will succeed without any action.<br>
      External Stream does not support this function.
         * @memberOf Woogeen.ConferenceClient
         * @param {WoogeenStream} stream instance.
         * @param {function} onSuccess() (optional) Success callback.
         * @param {function} onFailure(err) (optional) Failure callback.
         * @instance
         */
      this.pauseVideo = function(stream, onSuccess, onFailure) {
        if ((stream instanceof Woogeen.Stream) && stream.hasVideo() &&
          typeof stream.signalOnPauseVideo === 'function') {
          return stream.signalOnPauseVideo(onSuccess, onFailure);
        }
        if (typeof onFailure === 'function') {
          onFailure('unable to call pauseVideo');
        }
      };

      /**
     * @function addExternalOutput
     * @instance
     * @desc This function starts streaming corresponding media stream in the conference room to a specified target.
     <b>options:</b><br>
     {<br>
    streamId: xxxxxx,<br>
    }
     * @memberOf Woogeen.ConferenceClient
     * @param {string} url Target URL.
     * @param {string} options External output options.<br>
      <ul>
     <li>streamId: stream id to be streamed. (optional, if unspecified, the mixed stream will be streamed by default)</li>
     <li>resolution: an json object with format {width:xxx,height:xxx} or a string like 'vga'.
        Retrieve resolution information of a mixed stream: <code>stream.resolutions()</code>.
       (optional)</li>
     </ul>
     Adding external output for audio only or video only stream is not supported yet.
     * @param {function} onSuccess() (optional) Success callback.
     * @param {function} onFailure(err) (optional) Failure callback.
     * @example
  <script type="text/JavaScript">
  var conference = Woogeen.ConferenceClient.create();
  // ……
  conference.addExternalOutput(url: 'rtsp://localhost:1935/live', {streamId: xxx
  }, function () {
    L.Logger.info('Start external streaming success.');
  }, function (err) {
    L.Logger.error('Start external streaming failed:', err);
  });
  </script>
     */
      this.addExternalOutput = function(url, options, onSuccess,
        onFailure) {
        var self = this;
        if (typeof options === 'function') {
          onFailure = onSuccess;
          onSuccess = options;
          options = {};
        } else if (typeof options !== 'object' || options === null) {
          options = {};
        }
        options.url = url;

        // See http://shilv018.sh.intel.com/bugzilla_WebRTC/show_bug.cgi?id=976#c8 .
        if (options.video && options.video.resolution) {
          options.resolution = options.video.resolution;
        }

        sendMsg(self.socket, 'addExternalOutput', options, function(
          err) {
          if (err) {
            return safeCall(onFailure, err);
          }
          safeCall(onSuccess);
        });
      };

      /**
     * @function updateExternalOutput
     * @instance
     * @desc This function updates target URL's content with specified stream.
     <b>options:</b><br>
     {<br>
    streamId: xxxxxx,<br>
    }
     * @memberOf Woogeen.ConferenceClient
     * @param {string} url Target URL.
     * @param {string} options External output options.<br>
      <ul>
     <li>streamId: stream id to be streamed. (optional, if unspecified, the mixed stream will be streamed by default)</li>
     <li>resolution: an json object with format {width:xxx,height:xxx} or a string like 'vga'.
        Retrieve resolution information of a mixed stream: <code>stream.resolutions()</code>.
       (optional)</li>
     </ul>
     * @param {function} onSuccess() (optional) Success callback.
     * @param {function} onFailure(err) (optional) Failure callback.
     * @example
  <script type="text/JavaScript">
  var conference = Woogeen.ConferenceClient.create();
  // ……
  conference.updateExternalOutput(url: 'rtsp://localhost:1935/live', {streamId: xxx
  }, function () {
    L.Logger.info('Update external streaming success.');
  }, function (err) {
    L.Logger.error('Update external streaming failed:', err);
  });
  </script>
     */
      this.updateExternalOutput = function(url, options, onSuccess,
        onFailure) {
        var self = this;
        if (typeof options === 'function') {
          onFailure = onSuccess;
          onSuccess = options;
          options = {};
        } else if (typeof options !== 'object' || options === null) {
          options = {};
        }
        options.url = url;

        // See http://shilv018.sh.intel.com/bugzilla_WebRTC/show_bug.cgi?id=976#c8 .
        if (options.video && options.video.resolution) {
          options.resolution = options.video.resolution;
        }

        sendMsg(self.socket, 'updateExternalOutput', options,
          function(err) {
            if (err) {
              return safeCall(onFailure, err);
            }
            safeCall(onSuccess);
          });
      };

      /**
     * @function removeExternalOutput
     * @instance
     * @desc This function stops streaming media stream in the conference room to specified URL.
     <br><b>options:</b><br>
  {<br>
    id: xxxxxx<br>
  }
     * @memberOf Woogeen.ConferenceClient
     * @param {string} url (required) Target URL.
     * @param {function} onSuccess(resp) (optional) Success callback.
     * @param {function} onFailure(error) (optional) Failure callback.
     * @example
  <script type="text/JavaScript">
  var conference = Woogeen.ConferenceClient.create();
  // ……
  conference.removeExternalOutput({id: rtspIdToStop}, function () {
    L.Logger.info('Stop external streaming success.');
  }, function (err) {
    L.Logger.error('Stop external streaming failed:', err);
  });
  </script>
   */
      this.removeExternalOutput = function(url, onSuccess, onFailure) {
        var self = this;
        if (typeof url !== 'string') {
          safeCall(onFailure, 'URL should be string.');
          return;
        }
        sendMsg(self.socket, 'removeExternalOutput', {
          url: url
        }, function(err) {
          if (err) {
            return safeCall(onFailure, err);
          }
          safeCall(onSuccess);
        });
      };

      /**
         * @function startRecorder
         * @instance
         * @desc This function starts the recording of a video stream and an audio stream in the conference room and saves it to a .mkv file, according to the configurable "recording.path" in agent.toml file.<br>
      Three events are defined for media recording: 'recorder-added' for the creation of media recorder; 'recorder-removed' for the removal of media recorder.
         <br><b>options:</b><br>
         {<br>
        videoStreamId: xxxxxx,<br>
        audioStreamId: yyyyyy,<br>
        videoCodec: 'vp8'/'h264',<br>
        audioCodec: 'pcmu'/'opus',<br>
        recorderId: zzzzzz<br>
        }
         * @memberOf Woogeen.ConferenceClient
         * @param {string} options (optional)Media recorder options. If unspecified, the mixed stream will be recorded as default.<br>
          <ul>
         <li>videoStreamId: video stream id to be recorded. If unspecified and audioStreamId is valid, audio stream will be recorded without video.</li>
         <li>audioStreamId: audio stream id to be recorded. If unspecified and videoStreamId is valid, video stream will be recorded without audio.</li>
         <li>videoCodec: preferred video codec to be recorded. If unspecified, 'vp8' will be used by default. Currently, there is no video transcoding for forward stream with the consideration of system load.</li>
         <li>audioCodec: preferred audio codec to be recorded. If unspecified, 'opus' will be used by default.</li>
         <li>recorderId: recorder id to be reused. Id can only be alphanumeric. If the id is not set, server will generate one.</li>
         </ul>
         Important Note: In the case of continuous media recording among different streams, the recorderId is the key to make sure each switched stream go to the same recording url. Do not stop the recorder when you want the continuous media recording functionality, unless all the required media content has been recorded successfully.<br>
      The recommendation is to invoke another startRecorder with new videoStreamId and audioStreamId (default to mixed stream) right after the previous call of startRecorder, but the same recorderId should be kept.
      Another important thing is that the storage availability of the recording path needs to be guaranteed when using media recording.
         * @param {function} onSuccess(resp) (optional) Success callback. The following information will be
       returned as well:<br>
          <ul>
         <li>recorderId: Recorder id.</li>
         <li>host: Host server address.</li>
         <li>path: Recorded file path.</li>
         </ul>
         * @param {function} onFailure(err) (optional) Failure callback.
         * @example
      <script type="text/JavaScript">
      var conference = Woogeen.ConferenceClient.create();
      // ……
      conference.startRecorder({videoStreamId: videoStreamIdToRec, audioStreamId: audioStreamIdToRec, videoCodec: 'h264', audioCodec: 'pcmu'}, function (file) {
          L.Logger.info('Stream recording with recorder ID: ', file.recorderId);
        }, function (err) {
          L.Logger.error('Media recorder failed:', err);
        }
      );
      </script>
         */
      this.startRecorder = function(options, onSuccess, onFailure) {
        var self = this;
        if (typeof options === 'function') {
          onFailure = onSuccess;
          onSuccess = options;
          options = {};
        } else if (typeof options !== 'object' || options === null) {
          options = {};
        }

        sendMsg(self.socket, 'startRecorder', options, function(err,
          resp) {
          if (err) {
            return safeCall(onFailure, err);
          }
          safeCall(onSuccess, resp);
        });
      };

      /**
         * @function stopRecorder
         * @instance
         * @desc This function stops the recording of a video stream and an audio stream in the conference room and saves it to a .mkv file, according to the configurable "recording.path" in agent.toml file.
         <br><b>options:</b><br>
      {<br>
        recorderId: xxxxxx<br>
      }
         * @memberOf Woogeen.ConferenceClient
         * @param {string} options (required) Media recording options. recorderId: recorder id to be stopped.
         * @param {function} onSuccess(resp) (optional) Success callback. The following information will be returned as well:
         <ul>
         <li>host: Host server address.</li>
         <li>recorderId: recorder id.</li>
         </ul>
         * @param {function} onFailure(error) (optional) Failure callback.
         * @example
      <script type="text/JavaScript">
      var conference = Woogeen.ConferenceClient.create();
      // ……
      conference.stopRecorder({recorderId: recorderIdToStop}, function (file) {
          L.Logger.info('Stream recorded with recorder ID: ', file.recorderId);
        }, function (err) {
          L.Logger.error('Media recorder cannot stop with failure: ', err);
        }
      );
      </script>
       */
      this.stopRecorder = function(options, onSuccess, onFailure) {
        var self = this;
        if (typeof options === 'function') {
          onFailure = onSuccess;
          onSuccess = options;
          options = {};
        } else if (typeof options !== 'object' || options === null) {
          options = {};
        }

        sendMsg(self.socket, 'stopRecorder', options, function(err,
          resp) {
          if (err) {
            return safeCall(onFailure, err);
          }
          safeCall(onSuccess, resp);
        });
      };

      /**
         * @function getRegion
         * @instance
         * @desc This function gets the region ID of the given stream in the mixed stream.
         <br><b>options:</b><br>
      {<br>
        id: 'the stream id'<br>
      }
         * @memberOf Woogeen.ConferenceClient
         * @param {json} options getRegion options.
         * @param {function} onSuccess(resp) (optional) Success callback.
         * @param {function} onFailure(error) (optional) Failure callback.
         * @example
      <script type="text/JavaScript">
      var conference = Woogeen.ConferenceClient.create();
      // ......
      conference.getRegion({id: 'streamId'}, function (resp) {
          L.Logger.info('Region for streamId: ', resp.region);
        }, function (err) {
          L.Logger.error('getRegion failed:', err);
        }
      );
      </script>
       */
      this.getRegion = function(options, onSuccess, onFailure) {
        var self = this;
        if (typeof options !== 'object' || options === null ||
          typeof options.id !== 'string' || options.id === '') {
          return safeCall(onFailure, 'invalid options');
        }

        sendMsg(self.socket, 'getRegion', {
          id: options.id
        }, function(err, resp) {
          if (err) {
            return safeCall(onFailure, err);
          }
          safeCall(onSuccess, resp);
        });
      };

      /**
         * @function setRegion
         * @instance
         * @desc This function sets the region for the given stream in the mixed stream with the given region id.
         <br><b>options:</b><br>
      {<br>
        id: 'the stream id'<br>
        region: 'the region id'<br>
      }
         * @memberOf Woogeen.ConferenceClient
         * @param {json} options setRegion options.
         * @param {function} onSuccess() (optional) Success callback.
         * @param {function} onFailure(error) (optional) Failure callback.
         * @example
      <script type="text/JavaScript">
      var conference = Woogeen.ConferenceClient.create();
      // ......
      conference.setRegion({id: 'streamId', region: 'regionId'}, function () {
          L.Logger.info('setRegion succeeded');
        }, function (err) {
          L.Logger.error('setRegion failed:', err);
        }
      );
      </script>
       */
      this.setRegion = function(options, onSuccess, onFailure) {
        var self = this;
        if (typeof options !== 'object' || options === null ||
          typeof options.id !== 'string' || options.id === '' ||
          typeof options.region !== 'string' || options.region === ''
        ) {
          return safeCall(onFailure, 'invalid options');
        }

        sendMsg(self.socket, 'setRegion', {
          id: options.id,
          region: options.region
        }, function(err, resp) {
          if (err) {
            return safeCall(onFailure, err);
          }
          safeCall(onSuccess, resp);
        });
      };

      /**
         * @function setVideoBitrate
         * @instance
         * @desc This function sets the video bitrate (kbps) for the given participant. Currently it works only if the participant's video stream is being mixed in the conference.
      <br><b>Remarks:</b><br>
      This method also depends on whether client side support dynamically video stream bitrate change, now only Chrome browser is verified to be workable.
         <br><b>options:</b><br>
      {<br>
        id: 'target stream id'<br>
        bitrate: an integer value with the unit in kbps, e.g., 300<br>
      }
         * @memberOf Woogeen.ConferenceClient
         * @param {json} options setVideoBitrate options.
         * @param {function} onSuccess(resp) (optional) Success callback.
         * @param {function} onFailure(error) (optional) Failure callback.
         * @example
      <script type="text/JavaScript">
      var conference = Woogeen.ConferenceClient.create();
      // ......
      conference.setVideoBitrate({id: 'stream ID', bitrate: 300}, function (resp) {
          L.Logger.info('setVideoBitrate succeeds for stream ID: ', resp);
        }, function (err) {
          L.Logger.error('setVideoBitrate failed:', err);
        }
      );
      </script>
       */
      this.setVideoBitrate = function(options, onSuccess, onFailure) {
        var self = this;
        if (typeof options === 'function') {
          onFailure = onSuccess;
          onSuccess = options;
          options = {};
        } else if (typeof options !== 'object' || options === null) {
          options = {};
        }

        sendMsg(self.socket, 'setVideoBitrate', options, function(err,
          resp) {
          if (err) {
            return safeCall(onFailure, err);
          }
          safeCall(onSuccess, resp);
        });
      };

      /**
         * @function getConnectionStats
         * @instance
         * @desc This function gets statistic information about the given stream and its associated connection.
      <br><b>Remarks:</b><br>
      Unsupported statistics in firefox return -1 or "". This API is not supported on Edge browser.
         * @memberOf Woogeen.ConferenceClient
         * @param {WoogeenStream} stream Stream instance.
         * @param {function} onSuccess(stats) (optional) Success callback.
         * @param {function} onFailure(error) (optional) Failure callback.
         * @example
      <script type="text/JavaScript">
      var conference = Woogeen.ConferenceClient.create();
      // ......
      conference.getConnectionStats(stream, function (stats) {
          L.Logger.info('Statistic information: ', stats);
        }, function (err) {
          L.Logger.error('Get statistic information failed:', err);
        }
      );
      </script>
       */
      this.getConnectionStats = function(stream, onSuccess, onFailure) {
        if (stream.channel && typeof stream.channel.getConnectionStats ===
          'function') {
          stream.channel.getConnectionStats(function(stats) {
            safeCall(onSuccess, stats);
          }, function(err) {
            safeCall(onFailure, err);
          });
        } else {
          safeCall(onFailure, 'invalid stream.');
        }
      };
    };

    WoogeenConference.prototype = Object.create(WoogeenConferenceBase.prototype); // make WoogeenConference a WoogeenConferenceBase
    WoogeenConference.prototype.constructor = WoogeenConference;

    /**
       * @function create
       * @desc This factory returns a Woogeen.ConferenceClient instance.
       * @memberOf Woogeen.ConferenceClient
       * @static
       * @return {Woogeen.ConferenceClient} An instance of Woogeen.ConferenceClient.
       * @example
    <script type="text/JavaScript">
    var conference = Woogeen.ConferenceClient.create();
    </script>
       */
    WoogeenConference.create = function factory(spec) { // factory, not in prototype
      return new WoogeenConference(spec);
    };
    return WoogeenConference;
  }());


  /**
   * @class Woogeen.SipClient
   * @classDesc Provides to initiate, accept, reject and hangup a sip audio or video call.
   */

  Woogeen.SipClient = (function() {

    var WoogeenSipGateway = function WoogeenSipGateway(spec) {
      WoogeenConferenceBase.call(this, spec);
      this.sip = true;

      /**
         * @function join
         * @instance
         * @desc This function establishes a connection to sip server and joins a certain conference.
      <br><b>Remarks:</b><br>
      On success, onSuccess is called (if provided); otherwise, onFailure is called (if provided).
      <br><b>resp:</b><br>
         * @memberOf Woogeen.SipClient
         * @param {array} userInfo The sip user information with the structure {display_name:, sip_name:, sip_password:, sip_server:}.
         * @param {function} onSuccess(resp) (optional) Success callback function.
         * @param {function} onFailure(err) (optional) Failure callback function.
         * @example
      <script type="text/JavaScript">
       var userInfo = {
                display_name: $('input#display_name').val(),
                sip_name:      $('input#sip_name').val(),
                sip_password: $('input#sip_password').val(),
                sip_server:   $('input#sip_server').val()
       };
       sipClient.join(userInfo, function(msg){}, function(error){});
      </script>
         */

      this.join = function(token, onSuccess, onFailure) {
        token.host = this.spec.host;
        token.secure = this.spec.secure;
        // WoogeenConferenceBase.join requires base 64 encoded token. So encode it first.
        token = L.Base64.encodeBase64(JSON.stringify(token));
        WoogeenConferenceBase.prototype.join.call(this, token,
          onSuccess, onFailure);
      };

      this.subscribe = function(stream, options, onSuccess, onFailure) {
        var self = this;
        if (typeof options === 'function') {
          onFailure = onSuccess;
          onSuccess = options;
          options = {};
        } else if (typeof options !== 'object' || options === null) {
          options = {};
        }
        var subscribeSuccess = function(stream) {
          self.dispatchEvent(new Woogeen.StreamEvent({
            type: 'stream-subscribed',
            stream: stream
          }));
          onSuccess(stream);
        };
        WoogeenConferenceBase.prototype.subscribe.call(this, stream,
          options, subscribeSuccess, onFailure);
      };
      /**
     * @function acceptCall
     * @instance
     * @desc Accept the sip call to respond to a incoming call.
     * @memberOf Woogeen.SipClient
     * @param {function} onSuccess(resp) (optional) Success callback.
     * @param {function} onFailure(error) (optional) Failure callback.
     * @example
<script type="text/JavaScript">
sipClient.acceptCall(function(msg){});
</script>
   */
      this.acceptCall = function(onSuccess, onFailure) {
        var self = this;
        var payload = {
          type: 'acceptCall',
        };
        sendMsg(self.socket, 'customMessage', payload, function(err,
          resp) {
          if (err) {
            return safeCall(onFailure, err);
          }
          safeCall(onSuccess, resp);
        });
      };

      /**
     * @function rejectCall
     * @instance
     * @desc Reject the sip call to respond to a incoming call.
     * @memberOf Woogeen.SipClient
     * @param {function} onSuccess(resp) (optional) Success callback.
     * @param {function} onFailure(error) (optional) Failure callback.
     * @example
<script type="text/JavaScript">
sipClient.rejectCall(function(msg){});
</script>
*/
      this.rejectCall = function(onSuccess, onFailure) {
        var self = this;
        var payload = {
          type: 'rejectCall',
        };
        sendMsg(self.socket, 'customMessage', payload, function(err,
          resp) {
          if (err) {
            return safeCall(onFailure, err);
          }
          safeCall(onSuccess, resp);
        });
      };
      /**
       * @function hangupCall
       * @instance
       * @desc Hangup the sip call after the sip call established.
       * @memberOf Woogeen.SipClient
       * @param {function} onSuccess(resp) (optional) Success callback.
       * @param {function} onFailure(error) (optional) Failure callback.
       * @example
       <script type="text/JavaScript">
       sipClient.hangupCall(function(msg){});
       </script>
       */
      this.hangupCall = function(onSuccess, onFailure) {
        var self = this;
        var payload = {
          type: 'hangupCall',
        };
        sendMsg(self.socket, 'customMessage', payload, function(err,
          resp) {
          if (err) {
            return safeCall(onFailure, err);
          }
          safeCall(onSuccess, resp);
        });
      };
      /**
     * @function makeCall
     * @instance
     * @desc Initiate a sip call.
     * @memberOf Woogeen.SipClient
     * @param {array} callee The option of the callee with the structure {calleeURI:, audio:, video:}.
     * @param {function} onSuccess(resp) (optional) Success callback.
     * @param {function} onFailure(error) (optional) Failure callback.
     * @example
  <script type="text/JavaScript">
        var option = {
            calleeURI: $('input#calleeURI').val(),
            audio: true,
            video: true
        };
        sipclient.makeCall(option, function(msg));
  </script>
   */
      this.makeCall = function(callee, onSuccess, onFailure) {
        var self = this;
        var payload = {
          type: 'makeCall',
          payload: callee
        };
        sendMsg(self.socket, 'customMessage', payload, function(err,
          resp) {
          if (err) {
            return safeCall(onFailure, err);
          }
          safeCall(onSuccess, resp);
        });
      };
    };
    WoogeenSipGateway.prototype = Object.create(WoogeenConferenceBase.prototype); // make WoogeenConference a eventDispatcher
    WoogeenSipGateway.prototype.constructor = WoogeenSipGateway;
    /**
   * @function create
   * @desc This factory returns a Woogeen.SipClient instance.
   * @memberOf Woogeen.SipClient
   * @static
   * @return {Woogeen.SipClient} An instance of Woogeen.SipClient.
   * @example
<script type="text/JavaScript">
var gateway_host = location.hostname;
var isSecured = window.location.protocol === 'https:';
if (isSecured) {
  gateway_host += ':8443';
} else {
  gateway_host += ':8080';
}
sipClient = Woogeen.SipClient.create({
    host: gateway_host,
    secure: isSecured,
  });
</script>
   */
    WoogeenSipGateway.create = function factory(spec) { // factory, not in prototype
      return new WoogeenSipGateway(spec);
    };
    return WoogeenSipGateway;
  }());

}());



/*global window, console, RTCSessionDescription, RTCIceCandidate, RTCPeerConnection*/

Erizo.ChromeStableStack = function(spec) {
  "use strict";

  var that = {},
    WebkitRTCPeerConnection = RTCPeerConnection;

  that.pc_config = {
    "iceServers": []
  };


  that.con = {
    'optional': [{
      'DtlsSrtpKeyAgreement': true
    }]
  };

  if (spec.iceServers instanceof Array) {
    that.pc_config.iceServers = spec.iceServers;
  }

  if (spec.audio === undefined) {
    spec.audio = true;
  }

  if (spec.video === undefined) {
    spec.video = true;
  }

  that.mediaConstraints = {
    mandatory: {
      'OfferToReceiveVideo': spec.video,
      'OfferToReceiveAudio': spec.audio
    }
  };

  var errorCallback = function(message) {
    console.log("Error in Stack ", message);
  };

  that.peerConnection = new WebkitRTCPeerConnection(that.pc_config, that.con);

  var setMaxBW = function(sdp) {
    var a, r;
    if (spec.video && spec.maxVideoBW) {
      sdp = sdp.replace(/b=AS:.*\r\n/g, "");
      a = sdp.match(/m=video.*\r\n/);
      if (a == null) {
        a = sdp.match(/m=video.*\n/);
      }
      if (a && (a.length > 0)) {
        r = a[0] + "b=AS:" + spec.maxVideoBW + "\r\n";
        sdp = sdp.replace(a[0], r);
      }
    }

    if (spec.audio && spec.maxAudioBW) {
      a = sdp.match(/m=audio.*\r\n/);
      if (a == null) {
        a = sdp.match(/m=audio.*\n/);
      }
      if (a && (a.length > 0)) {
        r = a[0] + "b=AS:" + spec.maxAudioBW + "\r\n";
        sdp = sdp.replace(a[0], r);
      }
    }

    return sdp;
  };

  var setAudioCodec = function(sdp) {
    if (!spec.audioCodec) {
      return sdp;
    }
    return Woogeen.Common.setPreferredCodec(sdp, 'audio', spec.audioCodec);
  };

  var setVideoCodec = function(sdp) {
    if (!spec.videoCodec) {
      return sdp;
    }
    return Woogeen.Common.setPreferredCodec(sdp, 'video', spec.videoCodec);
  };

  var updateSdp = function(sdp) {
    var newSdp = setAudioCodec(sdp);
    newSdp = setVideoCodec(newSdp);
    return newSdp;
  };

  /**
   * Closes the connection.
   */
  that.close = function() {
    that.state = 'closed';
    if (that.peerConnection.signalingState !== 'closed') {
      that.peerConnection.close();
    }
  };

  spec.localCandidates = [];

  that.peerConnection.onicecandidate = function(event) {
    if (event.candidate) {

      if (!event.candidate.candidate.match(/a=/)) {
        event.candidate.candidate = "a=" + event.candidate.candidate;
      }

      var candidateObject = {
        sdpMLineIndex: event.candidate.sdpMLineIndex,
        sdpMid: event.candidate.sdpMid,
        candidate: event.candidate.candidate
      };

      if (spec.remoteDescriptionSet) {
        spec.callback({
          type: 'candidate',
          candidate: candidateObject
        });
      } else {
        spec.localCandidates.push(candidateObject);
        L.Logger.info("Storing candidate: ", spec.localCandidates.length,
          candidateObject);
      }

    } else {
      console.log("End of candidates.");
    }
  };

  that.peerConnection.onaddstream = function(stream) {
    if (that.onaddstream) {
      that.onaddstream(stream);
    }
  };

  that.peerConnection.onremovestream = function(stream) {
    if (that.onremovestream) {
      that.onremovestream(stream);
    }
  };

  that.peerConnection.oniceconnectionstatechange = function(e) {
    if (that.oniceconnectionstatechange) {
      that.oniceconnectionstatechange(e.currentTarget.iceConnectionState);
    }
  };

  var localDesc;
  var remoteDesc;

  var setLocalDesc = function(sessionDescription) {
    sessionDescription.sdp = setMaxBW(sessionDescription.sdp);
    sessionDescription.sdp = updateSdp(sessionDescription.sdp.replace(
      /a=ice-options:google-ice\r\n/g, ""));
    spec.callback({
      type: sessionDescription.type,
      sdp: sessionDescription.sdp
    });
    localDesc = sessionDescription;
    //that.peerConnection.setLocalDescription(sessionDescription);
  };

  var setLocalDescp2p = function(sessionDescription) {
    sessionDescription.sdp = setMaxBW(sessionDescription.sdp);
    spec.callback({
      type: sessionDescription.type,
      sdp: sessionDescription.sdp
    });
    localDesc = sessionDescription;
    that.peerConnection.setLocalDescription(sessionDescription);
  };

  that.updateSpec = function(config, callback) {
    if (config.maxVideoBW || config.maxAudioBW) {
      if (config.maxVideoBW) {
        console.log("Maxvideo Requested", config.maxVideoBW);
        spec.maxVideoBW = config.maxVideoBW;
      }
      if (config.maxAudioBW) {
        console.log("Maxaudio Requested", config.maxAudioBW);
        spec.maxAudioBW = config.maxAudioBW;
      }

      localDesc.sdp = setMaxBW(localDesc.sdp);
      that.peerConnection.setLocalDescription(localDesc, function() {
        remoteDesc.sdp = setMaxBW(remoteDesc.sdp);
        that.peerConnection.setRemoteDescription(new RTCSessionDescription(
          remoteDesc), function() {
          spec.remoteDescriptionSet = true;
          if (callback) {
            callback("success");
          }

        });
      });
    }

  };

  that.createOffer = function(isSubscribe) {
    if (isSubscribe === true) {
      that.peerConnection.createOffer(setLocalDesc, errorCallback, that.mediaConstraints);
    } else {
      that.peerConnection.createOffer(setLocalDesc, errorCallback);
    }

  };

  that.addStream = function(stream) {
    that.peerConnection.addStream(stream);
  };
  spec.remoteCandidates = [];
  spec.remoteDescriptionSet = false;

  that.processSignalingMessage = function(msg) {
    //L.Logger.info("Process Signaling Message", msg);

    if (msg.type === 'offer') {
      msg.sdp = setMaxBW(msg.sdp);
      that.peerConnection.setRemoteDescription(new RTCSessionDescription(
        msg), function() {
        that.peerConnection.createAnswer(setLocalDescp2p, function(
          error) {
          L.Logger.error("Error: ", error);
        }, that.mediaConstraints);
        spec.remoteDescriptionSet = true;
      }, function(error) {
        L.Logger.error("Error setting Remote Description", error);
      });
    } else if (msg.type === 'answer') {
      // // For compatibility with only audio in Firefox Revisar
      // if (answer.match(/a=ssrc:55543/)) {
      //     answer = answer.replace(/a=sendrecv\\r\\na=mid:video/, 'a=recvonly\\r\\na=mid:video');
      //     answer = answer.split('a=ssrc:55543')[0] + '"}';
      // }

      console.log("Set remote and local description", msg.sdp);

      msg.sdp = setMaxBW(msg.sdp);

      remoteDesc = msg;
      that.peerConnection.setLocalDescription(localDesc, function() {
        that.peerConnection.setRemoteDescription(new RTCSessionDescription(
          msg), function() {
          spec.remoteDescriptionSet = true;
          console.log("Candidates to be added: ", spec.remoteCandidates
            .length, spec.remoteCandidates);
          while (spec.remoteCandidates.length > 0) {
            // IMPORTANT: preserve ordering of candidates
            that.peerConnection.addIceCandidate(spec.remoteCandidates
              .shift());
          }
          console.log("Local candidates to send:", spec.localCandidates
            .length);
          while (spec.localCandidates.length > 0) {
            // IMPORTANT: preserve ordering of candidates
            spec.callback({
              type: 'candidate',
              candidate: spec.localCandidates.shift()
            });
          }
        });
      });

    } else if (msg.type === 'candidate') {
      try {
        var obj;
        if (typeof(msg.candidate) === 'object') {
          obj = msg.candidate;
        } else {
          obj = JSON.parse(msg.candidate);
        }
        obj.candidate = obj.candidate.replace(/a=/g, "");
        obj.sdpMLineIndex = parseInt(obj.sdpMLineIndex, 10);
        var candidate = new RTCIceCandidate(obj);
        if (spec.remoteDescriptionSet) {
          that.peerConnection.addIceCandidate(candidate);
        } else {
          spec.remoteCandidates.push(candidate);
          console.log("Candidates stored: ", spec.remoteCandidates.length,
            spec.remoteCandidates);
        }
      } catch (e) {
        L.Logger.error("Error parsing candidate", msg.candidate);
      }
    }
  };

  that.getConnectionStats = function(onSuccess, onFailure) {
    that.peerConnection.getStats(null, function(stats) {
      onSuccess(Woogeen.Common.parseStats(stats));
    }, onFailure);
  };

  return that;
};



/* global window, mozRTCSessionDescription, mozRTCPeerConnection, mozRTCIceCandidate */

Erizo.FirefoxStack = function(spec) {
  'use strict';

  var that = {},
    WebkitRTCPeerConnection = mozRTCPeerConnection,
    RTCSessionDescription = mozRTCSessionDescription,
    RTCIceCandidate = mozRTCIceCandidate;

  that.pc_config = {
    iceServers: []
  };

  if (spec.iceServers instanceof Array) {
    that.pc_config.iceServers = spec.iceServers;
  }

  if (spec.audio === undefined) {
    spec.audio = true;
  }

  if (spec.video === undefined) {
    spec.video = true;
  }

  that.mediaConstraints = {
    offerToReceiveAudio: spec.audio,
    offerToReceiveVideo: spec.video,
    mozDontOfferDataChannel: true
  };

  var errorCallback = function(message) {
    L.Logger.error("Error in Stack ", message);
  };
  var gotCandidate = false;
  that.peerConnection = new WebkitRTCPeerConnection(that.pc_config);

  spec.localCandidates = [];

  that.peerConnection.onicecandidate = function(event) {
    if (event.candidate) {
      gotCandidate = true;

      if (!event.candidate.candidate.match(/a=/)) {
        event.candidate.candidate = "a=" + event.candidate.candidate;
      }

      if (spec.remoteDescriptionSet) {
        spec.callback({
          type: 'candidate',
          candidate: event.candidate
        });
      } else {
        spec.localCandidates.push(event.candidate);
        console.log("Local Candidates stored: ", spec.localCandidates.length,
          spec.localCandidates);
      }

    } else {
      console.log("End of candidates.");
    }
  };

  var setAudioCodec = function(sdp) {
    if (!spec.audioCodec) {
      return sdp;
    }
    return Woogeen.Common.setPreferredCodec(sdp, 'audio', spec.audioCodec);
  };

  var setVideoCodec = function(sdp) {
    if (!spec.videoCodec) {
      return sdp;
    }
    return Woogeen.Common.setPreferredCodec(sdp, 'video', spec.videoCodec);
  };

  var updateSdp = function(sdp) {
    var newSdp = setAudioCodec(sdp);
    newSdp = setVideoCodec(newSdp);
    return newSdp;
  };

  that.peerConnection.onaddstream = function(stream) {
    if (that.onaddstream) {
      that.onaddstream(stream);
    }
  };

  that.peerConnection.onremovestream = function(stream) {
    if (that.onremovestream) {
      that.onremovestream(stream);
    }
  };

  that.peerConnection.oniceconnectionstatechange = function(e) {
    if (that.oniceconnectionstatechange) {
      that.oniceconnectionstatechange(e.currentTarget.iceConnectionState);
    }
  };

  var setMaxBW = function(sdp) {
    var a, r;
    if (spec.video && spec.maxVideoBW) {
      a = sdp.match(/m=video.*\r\n/);
      if (a == null) {
        a = sdp.match(/m=video.*\n/);
      }
      if (a && (a.length > 0)) {
        r = a[0] + "b=AS:" + spec.maxVideoBW + "\r\n";
        sdp = sdp.replace(a[0], r);
      }
    }

    if (spec.audio && spec.maxAudioBW) {
      a = sdp.match(/m=audio.*\r\n/);
      if (a == null) {
        a = sdp.match(/m=audio.*\n/);
      }
      if (a && (a.length > 0)) {
        r = a[0] + "b=AS:" + spec.maxAudioBW + "\r\n";
        sdp = sdp.replace(a[0], r);
      }
    }

    return sdp;
  };

  var localDesc;

  var setLocalDesc = function(sessionDescription) {
    sessionDescription.sdp = setMaxBW(sessionDescription.sdp);
    sessionDescription.sdp = updateSdp(sessionDescription.sdp.replace(
      /a=ice-options:google-ice\r\n/g, ''));
    spec.callback(sessionDescription);
    localDesc = sessionDescription;
  };

  var setLocalDescp2p = function(sessionDescription) {
    sessionDescription.sdp = setMaxBW(sessionDescription.sdp);
    sessionDescription.sdp = sessionDescription.sdp.replace(
      /a=ice-options:google-ice\r\n/g, "");
    spec.callback(sessionDescription);
    localDesc = sessionDescription;
    that.peerConnection.setLocalDescription(localDesc);
  };

  that.createOffer = function(isSubscribe) {
    if (isSubscribe === true) {
      that.peerConnection.createOffer(setLocalDesc, errorCallback, that.mediaConstraints);
    } else {
      that.peerConnection.createOffer(setLocalDesc, errorCallback);
    }
  };

  that.addStream = function(stream) {
    that.peerConnection.addStream(stream);
  };
  spec.remoteCandidates = [];
  spec.remoteDescriptionSet = false;

  /**
   * Closes the connection.
   */
  that.close = function() {
    that.state = 'closed';
    if (that.peerConnection.signalingState !== 'closed') {
      that.peerConnection.close();
    }
  };

  that.processSignalingMessage = function(msg) {

    //      L.Logger.debug("Process Signaling Message", msg);

    if (msg.type === 'offer') {
      msg.sdp = setMaxBW(msg.sdp);
      that.peerConnection.setRemoteDescription(new RTCSessionDescription(
        msg), function() {
        that.peerConnection.createAnswer(setLocalDescp2p, function(
          error) {
          L.Logger.error("Error", error);
        }, that.mediaConstraints);
        spec.remoteDescriptionSet = true;
      }, function(error) {
        L.Logger.error("Error setting Remote Description", error);
      });
    } else if (msg.type === 'answer') {

      // // For compatibility with only audio in Firefox Revisar
      // if (answer.match(/a=ssrc:55543/)) {
      //     answer = answer.replace(/a=sendrecv\\r\\na=mid:video/, 'a=recvonly\\r\\na=mid:video');
      //     answer = answer.split('a=ssrc:55543')[0] + '"}';
      // }

      console.log("Set remote and local description", msg.sdp);

      msg.sdp = setMaxBW(msg.sdp);

      that.peerConnection.setLocalDescription(localDesc, function() {
        that.peerConnection.setRemoteDescription(new RTCSessionDescription(
          msg), function() {
          spec.remoteDescriptionSet = true;
          L.Logger.info("Remote Description successfully set");
          while (spec.remoteCandidates.length > 0 && gotCandidate) {
            L.Logger.info("Setting stored remote candidates");
            // IMPORTANT: preserve ordering of candidates
            that.peerConnection.addIceCandidate(spec.remoteCandidates
              .shift());
          }
          while (spec.localCandidates.length > 0) {
            L.Logger.info("Sending Candidate from list");
            // IMPORTANT: preserve ordering of candidates
            spec.callback({
              type: 'candidate',
              candidate: spec.localCandidates.shift()
            });
          }
        }, function(error) {
          L.Logger.error("Error Setting Remote Description", error);
        });
      }, function(error) {
        L.Logger.error("Failure setting Local Description", error);
      });
    } else if (msg.type === 'candidate') {
      try {
        var obj;
        if (typeof(msg.candidate) === 'object') {
          obj = msg.candidate;
        } else {
          obj = JSON.parse(msg.candidate);
        }
        obj.candidate = obj.candidate.replace(/ generation 0/g, "");
        obj.candidate = obj.candidate.replace(/ udp /g, " UDP ");
        obj.sdpMLineIndex = parseInt(obj.sdpMLineIndex, 10);
        var candidate = new RTCIceCandidate(obj);
        //              L.Logger.debug("Remote Candidate",candidate);
        if (spec.remoteDescriptionSet && gotCandidate) {
          that.peerConnection.addIceCandidate(candidate);
          while (spec.remoteCandidates.length > 0) {
            L.Logger.info("Setting stored remote candidates");
            // IMPORTANT: preserve ordering of candidates
            that.peerConnection.addIceCandidate(spec.remoteCandidates.shift());
          }
        } else {
          spec.remoteCandidates.push(candidate);
        }
      } catch (e) {
        L.Logger.error("Error parsing candidate", msg.candidate, e);
      }
    }
  };

  that.getConnectionStats = function(onSuccess, onFailure) {
    that.peerConnection.getStats(null, function(stats) {
      onSuccess(Woogeen.Common.parseStats(stats));
    }, onFailure);
  };

  return that;
};



/* global window, console */

Erizo.EdgeORTCStack = function(spec) {
  'use strict';

  // SDP helpers.
  var SDPUtils = {};

  // Generate an alphanumeric identifier for cname or mids.
  // TODO: use UUIDs instead? https://gist.github.com/jed/982883
  SDPUtils.generateIdentifier = function() {
    return Math.random().toString(36).substr(2, 10);
  };

  // The RTCP CNAME used by all peerconnections from the same JS.
  SDPUtils.localCName = SDPUtils.generateIdentifier();

  // Splits SDP into lines, dealing with both CRLF and LF.
  SDPUtils.splitLines = function(blob) {
    return blob.trim().split('\n').map(function(line) {
      return line.trim();
    });
  };
  // Splits SDP into sessionpart and mediasections. Ensures CRLF.
  SDPUtils.splitSections = function(blob) {
    var parts = blob.split('\nm=');
    return parts.map(function(part, index) {
      return (index > 0 ? 'm=' + part : part).trim() + '\r\n';
    });
  };

  // Returns lines that start with a certain prefix.
  SDPUtils.matchPrefix = function(blob, prefix) {
    return SDPUtils.splitLines(blob).filter(function(line) {
      return line.indexOf(prefix) === 0;
    });
  };

  // Parses an ICE candidate line. Sample input:
  // candidate:702786350 2 udp 41819902 8.8.8.8 60769 typ relay raddr 8.8.8.8
  // rport 55996"
  SDPUtils.parseCandidate = function(line) {
    var parts;
    // Parse both variants.
    if (line.indexOf('a=candidate:') === 0) {
      parts = line.substring(12).split(' ');
    } else {
      parts = line.substring(10).split(' ');
    }

    var candidate = {
      foundation: parts[0],
      component: parts[1],
      protocol: parts[2].toLowerCase(),
      priority: parseInt(parts[3], 10),
      ip: parts[4],
      port: parseInt(parts[5], 10),
      // skip parts[6] == 'typ'
      type: parts[7]
    };

    for (var i = 8; i < parts.length; i += 2) {
      switch (parts[i]) {
        case 'raddr':
          candidate.relatedAddress = parts[i + 1];
          break;
        case 'rport':
          candidate.relatedPort = parseInt(parts[i + 1], 10);
          break;
        case 'tcptype':
          candidate.tcpType = parts[i + 1];
          break;
        default: // Unknown extensions are silently ignored.
          break;
      }
    }
    return candidate;
  };

  // Translates a candidate object into SDP candidate attribute.
  SDPUtils.writeCandidate = function(candidate) {
    var sdp = [];
    sdp.push(candidate.foundation);
    sdp.push(candidate.component);
    sdp.push(candidate.protocol.toUpperCase());
    sdp.push(candidate.priority);
    sdp.push(candidate.ip);
    sdp.push(candidate.port);

    var type = candidate.type;
    sdp.push('typ');
    sdp.push(type);
    if (type !== 'host' && candidate.relatedAddress &&
      candidate.relatedPort) {
      sdp.push('raddr');
      sdp.push(candidate.relatedAddress); // was: relAddr
      sdp.push('rport');
      sdp.push(candidate.relatedPort); // was: relPort
    }
    if (candidate.tcpType && candidate.protocol.toLowerCase() === 'tcp') {
      sdp.push('tcptype');
      sdp.push(candidate.tcpType);
    }
    return 'candidate:' + sdp.join(' ');
  };

  // Parses an rtpmap line, returns RTCRtpCoddecParameters. Sample input:
  // a=rtpmap:111 opus/48000/2
  SDPUtils.parseRtpMap = function(line) {
    var parts = line.substr(9).split(' ');
    var parsed = {
      payloadType: parseInt(parts.shift(), 10) // was: id
    };

    parts = parts[0].split('/');

    parsed.name = parts[0];
    parsed.clockRate = parseInt(parts[1], 10); // was: clockrate
    // was: channels
    parsed.numChannels = parts.length === 3 ? parseInt(parts[2], 10) : 1;
    return parsed;
  };

  // Generate an a=rtpmap line from RTCRtpCodecCapability or
  // RTCRtpCodecParameters.
  SDPUtils.writeRtpMap = function(codec) {
    var pt = codec.payloadType;
    if (codec.preferredPayloadType !== undefined) {
      pt = codec.preferredPayloadType;
    }
    return 'a=rtpmap:' + pt + ' ' + codec.name + '/' + codec.clockRate +
      (codec.numChannels !== 1 ? '/' + codec.numChannels : '') + '\r\n';
  };

  // Parses an a=extmap line (headerextension from RFC 5285). Sample input:
  // a=extmap:2 urn:ietf:params:rtp-hdrext:toffset
  SDPUtils.parseExtmap = function(line) {
    var parts = line.substr(9).split(' ');
    return {
      id: parseInt(parts[0], 10),
      uri: parts[1]
    };
  };

  // Generates a=extmap line from RTCRtpHeaderExtensionParameters or
  // RTCRtpHeaderExtension.
  SDPUtils.writeExtmap = function(headerExtension) {
    return 'a=extmap:' + (headerExtension.id || headerExtension.preferredId) +
      ' ' + headerExtension.uri + '\r\n';
  };

  // Parses an ftmp line, returns dictionary. Sample input:
  // a=fmtp:96 vbr=on;cng=on
  // Also deals with vbr=on; cng=on
  SDPUtils.parseFmtp = function(line) {
    var parsed = {};
    var kv;
    var parts = line.substr(line.indexOf(' ') + 1).split(';');
    for (var j = 0; j < parts.length; j++) {
      kv = parts[j].trim().split('=');
      parsed[kv[0].trim()] = kv[1];
    }
    return parsed;
  };

  // Generates an a=ftmp line from RTCRtpCodecCapability or RTCRtpCodecParameters.
  SDPUtils.writeFmtp = function(codec) {
    var line = '';
    var pt = codec.payloadType;
    if (codec.preferredPayloadType !== undefined) {
      pt = codec.preferredPayloadType;
    }
    if (codec.parameters && Object.keys(codec.parameters).length) {
      var params = [];
      Object.keys(codec.parameters).forEach(function(param) {
        params.push(param + '=' + codec.parameters[param]);
      });
      line += 'a=fmtp:' + pt + ' ' + params.join(';') + '\r\n';
    }
    return line;
  };

  // Parses an rtcp-fb line, returns RTCPRtcpFeedback object. Sample input:
  // a=rtcp-fb:98 nack rpsi
  SDPUtils.parseRtcpFb = function(line) {
    var parts = line.substr(line.indexOf(' ') + 1).split(' ');
    return {
      type: parts.shift(),
      parameter: parts.join(' ')
    };
  };
  // Generate a=rtcp-fb lines from RTCRtpCodecCapability or RTCRtpCodecParameters.
  SDPUtils.writeRtcpFb = function(codec) {
    var lines = '';
    var pt = codec.payloadType;
    if (codec.preferredPayloadType !== undefined) {
      pt = codec.preferredPayloadType;
    }
    if (codec.rtcpFeedback && codec.rtcpFeedback.length) {
      // FIXME: special handling for trr-int?
      codec.rtcpFeedback.forEach(function(fb) {
        lines += 'a=rtcp-fb:' + pt + ' ' + fb.type + ' ' + fb.parameter +
          '\r\n';
      });
    }
    return lines;
  };

  // Parses an RFC 5576 ssrc media attribute. Sample input:
  // a=ssrc:3735928559 cname:something
  SDPUtils.parseSsrcMedia = function(line) {
    var sp = line.indexOf(' ');
    var parts = {
      ssrc: parseInt(line.substr(7, sp - 7), 10)
    };
    var colon = line.indexOf(':', sp);
    if (colon > -1) {
      parts.attribute = line.substr(sp + 1, colon - sp - 1);
      parts.value = line.substr(colon + 1);
    } else {
      parts.attribute = line.substr(sp + 1);
    }
    return parts;
  };

  // Extracts DTLS parameters from SDP media section or sessionpart.
  // FIXME: for consistency with other functions this should only
  //   get the fingerprint line as input. See also getIceParameters.
  SDPUtils.getDtlsParameters = function(mediaSection, sessionpart) {
    var lines = SDPUtils.splitLines(mediaSection);
    // Search in session part, too.
    lines = lines.concat(SDPUtils.splitLines(sessionpart));
    var fpLine = lines.filter(function(line) {
      return line.indexOf('a=fingerprint:') === 0;
    })[0].substr(14);
    // Note: a=setup line is ignored since we use the 'auto' role.
    var dtlsParameters = {
      role: 'auto',
      fingerprints: [{
        algorithm: fpLine.split(' ')[0],
        value: fpLine.split(' ')[1]
      }]
    };
    return dtlsParameters;
  };

  // Serializes DTLS parameters to SDP.
  SDPUtils.writeDtlsParameters = function(params, setupType) {
    var sdp = 'a=setup:' + setupType + '\r\n';
    params.fingerprints.forEach(function(fp) {
      sdp += 'a=fingerprint:' + fp.algorithm + ' ' + fp.value + '\r\n';
    });
    return sdp;
  };
  // Parses ICE information from SDP media section or sessionpart.
  // FIXME: for consistency with other functions this should only
  //   get the ice-ufrag and ice-pwd lines as input.
  SDPUtils.getIceParameters = function(mediaSection, sessionpart) {
    var lines = SDPUtils.splitLines(mediaSection);
    // Search in session part, too.
    lines = lines.concat(SDPUtils.splitLines(sessionpart));
    var iceParameters = {
      usernameFragment: lines.filter(function(line) {
        return line.indexOf('a=ice-ufrag:') === 0;
      })[0].substr(12),
      password: lines.filter(function(line) {
        return line.indexOf('a=ice-pwd:') === 0;
      })[0].substr(10)
    };
    return iceParameters;
  };

  // Serializes ICE parameters to SDP.
  SDPUtils.writeIceParameters = function(params) {
    return 'a=ice-ufrag:' + params.usernameFragment + '\r\n' +
      'a=ice-pwd:' + params.password + '\r\n';
  };

  // Parses the SDP media section and returns RTCRtpParameters.
  SDPUtils.parseRtpParameters = function(mediaSection) {
    var description = {
      codecs: [],
      headerExtensions: [],
      fecMechanisms: [],
      rtcp: []
    };
    var lines = SDPUtils.splitLines(mediaSection);
    var mline = lines[0].split(' ');
    for (var i = 3; i < mline.length; i++) { // find all codecs from mline[3..]
      var pt = mline[i];
      var rtpmapline = SDPUtils.matchPrefix(
        mediaSection, 'a=rtpmap:' + pt + ' ')[0];
      if (rtpmapline) {
        var codec = SDPUtils.parseRtpMap(rtpmapline);
        var fmtps = SDPUtils.matchPrefix(
          mediaSection, 'a=fmtp:' + pt + ' ');
        // Only the first a=fmtp:<pt> is considered.
        codec.parameters = fmtps.length ? SDPUtils.parseFmtp(fmtps[0]) : {};
        codec.rtcpFeedback = SDPUtils.matchPrefix(
            mediaSection, 'a=rtcp-fb:' + pt + ' ')
          .map(SDPUtils.parseRtcpFb);
        description.codecs.push(codec);
        // parse FEC mechanisms from rtpmap lines.
        switch (codec.name.toUpperCase()) {
          case 'RED':
          case 'ULPFEC':
            description.fecMechanisms.push(codec.name.toUpperCase());
            break;
          default: // only RED and ULPFEC are recognized as FEC mechanisms.
            break;
        }
      }
    }
    SDPUtils.matchPrefix(mediaSection, 'a=extmap:').forEach(function(line) {
      description.headerExtensions.push(SDPUtils.parseExtmap(line));
    });
    // FIXME: parse rtcp.
    return description;
  };

  // Generates parts of the SDP media section describing the capabilities /
  // parameters.
  SDPUtils.writeRtpDescription = function(kind, caps) {
    var sdp = '';

    // Build the mline.
    sdp += 'm=' + kind + ' ';
    sdp += caps.codecs.length > 0 ? '9' : '0'; // reject if no codecs.
    sdp += ' UDP/TLS/RTP/SAVPF ';
    sdp += caps.codecs.map(function(codec) {
      if (codec.preferredPayloadType !== undefined) {
        return codec.preferredPayloadType;
      }
      return codec.payloadType;
    }).join(' ') + '\r\n';

    sdp += 'c=IN IP4 0.0.0.0\r\n';
    sdp += 'a=rtcp:9 IN IP4 0.0.0.0\r\n';

    // Add a=rtpmap lines for each codec. Also fmtp and rtcp-fb.
    caps.codecs.forEach(function(codec) {
      sdp += SDPUtils.writeRtpMap(codec);
      sdp += SDPUtils.writeFmtp(codec);
      sdp += SDPUtils.writeRtcpFb(codec);
    });
    // FIXME: add headerExtensions, fecMechanismş and rtcp.
    sdp += 'a=rtcp-mux\r\n';
    return sdp;
  };

  // Parses the SDP media section and returns an array of
  // RTCRtpEncodingParameters.
  SDPUtils.parseRtpEncodingParameters = function(mediaSection) {
    var encodingParameters = [];
    var description = SDPUtils.parseRtpParameters(mediaSection);
    var hasRed = description.fecMechanisms.indexOf('RED') !== -1;
    var hasUlpfec = description.fecMechanisms.indexOf('ULPFEC') !== -1;

    // filter a=ssrc:... cname:, ignore PlanB-msid
    var ssrcs = SDPUtils.matchPrefix(mediaSection, 'a=ssrc:')
      .map(function(line) {
        return SDPUtils.parseSsrcMedia(line);
      })
      .filter(function(parts) {
        return parts.attribute === 'cname';
      });
    var primarySsrc = ssrcs.length > 0 && ssrcs[0].ssrc;
    var secondarySsrc;

    var flows = SDPUtils.matchPrefix(mediaSection, 'a=ssrc-group:FID')
      .map(function(line) {
        var parts = line.split(' ');
        parts.shift();
        return parts.map(function(part) {
          return parseInt(part, 10);
        });
      });
    if (flows.length > 0 && flows[0].length > 1 && flows[0][0] ===
      primarySsrc) {
      secondarySsrc = flows[0][1];
    }

    description.codecs.forEach(function(codec) {
      if (codec.name.toUpperCase() === 'RTX' && codec.parameters.apt) {
        var encParam = {
          ssrc: primarySsrc,
          codecPayloadType: parseInt(codec.parameters.apt, 10),
          rtx: {
            payloadType: codec.payloadType,
            ssrc: secondarySsrc
          }
        };
        encodingParameters.push(encParam);
        if (hasRed) {
          encParam = JSON.parse(JSON.stringify(encParam));
          encParam.fec = {
            ssrc: secondarySsrc,
            mechanism: hasUlpfec ? 'red+ulpfec' : 'red'
          };
          encodingParameters.push(encParam);
        }
      }
    });
    if (encodingParameters.length === 0 && primarySsrc) {
      encodingParameters.push({
        ssrc: primarySsrc
      });
    }

    // we support both b=AS and b=TIAS but interpret AS as TIAS.
    var bandwidth = SDPUtils.matchPrefix(mediaSection, 'b=');
    if (bandwidth.length) {
      if (bandwidth[0].indexOf('b=TIAS:') === 0) {
        bandwidth = parseInt(bandwidth[0].substr(7), 10);
      } else if (bandwidth[0].indexOf('b=AS:') === 0) {
        bandwidth = parseInt(bandwidth[0].substr(5), 10);
      }
      encodingParameters.forEach(function(params) {
        params.maxBitrate = bandwidth;
      });
    }
    return encodingParameters;
  };

  SDPUtils.writeSessionBoilerplate = function() {
    // FIXME: sess-id should be an NTP timestamp.
    return 'v=0\r\n' +
      'o=thisisadapterortc 8169639915646943137 2 IN IP4 127.0.0.1\r\n' +
      's=-\r\n' +
      't=0 0\r\n';
  };

  SDPUtils.writeMediaSection = function(transceiver, caps, type, stream) {
    var sdp = SDPUtils.writeRtpDescription(transceiver.kind, caps);

    // Map ICE parameters (ufrag, pwd) to SDP.
    sdp += SDPUtils.writeIceParameters(
      transceiver.iceGatherer.getLocalParameters());

    // Map DTLS parameters to SDP.
    sdp += SDPUtils.writeDtlsParameters(
      transceiver.dtlsTransport.getLocalParameters(),
      type === 'offer' ? 'actpass' : 'active');

    sdp += 'a=mid:' + transceiver.mid + '\r\n';

    if (transceiver.rtpSender && transceiver.rtpReceiver) {
      sdp += 'a=sendrecv\r\n';
    } else if (transceiver.rtpSender) {
      sdp += 'a=sendonly\r\n';
    } else if (transceiver.rtpReceiver) {
      sdp += 'a=recvonly\r\n';
    } else {
      sdp += 'a=inactive\r\n';
    }

    // FIXME: for RTX there might be multiple SSRCs. Not implemented in Edge yet.
    if (transceiver.rtpSender) {
      var msid = 'msid:' + stream.id + ' ' +
        transceiver.rtpSender.track.id + '\r\n';
      sdp += 'a=' + msid;
      sdp += 'a=ssrc:' + transceiver.sendEncodingParameters[0].ssrc +
        ' ' + msid;
    }
    // FIXME: this should be written by writeRtpDescription.
    sdp += 'a=ssrc:' + transceiver.sendEncodingParameters[0].ssrc +
      ' cname:' + SDPUtils.localCName + '\r\n';
    return sdp;
  };

  // Gets the direction from the mediaSection or the sessionpart.
  SDPUtils.getDirection = function(mediaSection, sessionpart) {
    // Look for sendrecv, sendonly, recvonly, inactive, default to sendrecv.
    var lines = SDPUtils.splitLines(mediaSection);
    for (var i = 0; i < lines.length; i++) {
      switch (lines[i]) {
        case 'a=sendrecv':
        case 'a=sendonly':
        case 'a=recvonly':
        case 'a=inactive':
          return lines[i].substr(2);
        default:
          // FIXME: What should happen here?
      }
    }
    if (sessionpart) {
      return SDPUtils.getDirection(sessionpart);
    }
    return 'sendrecv';
  };

  if (window.RTCIceGatherer) {
    // ORTC defines an RTCIceCandidate object but no constructor.
    // Not implemented in Edge.
    if (!window.RTCIceCandidate) {
      window.RTCIceCandidate = function(args) {
        return args;
      };
    }
    // ORTC does not have a session description object but
    // other browsers (i.e. Chrome) that will support both PC and ORTC
    // in the future might have this defined already.
    if (!window.RTCSessionDescription) {
      window.RTCSessionDescription = function(args) {
        return args;
      };
    }
  }

  var that = {};
  that.pc_config = {
    iceServers: []
  };

  if (spec.iceServers instanceof Array) {
    that.pc_config.iceServers = spec.iceServers;
  }

  if (spec.audio === undefined) {
    spec.audio = true;
  }

  if (spec.video === undefined) {
    spec.video = true;
  }

  window.RTCPeerConnection = function(config) {
    var self = this;

    var _eventTarget = document.createDocumentFragment();
    ['addEventListener', 'removeEventListener', 'dispatchEvent']
    .forEach(function(method) {
      self[method] = _eventTarget[method].bind(_eventTarget);
    });

    this.onicecandidate = null;
    this.onaddstream = null;
    this.ontrack = null;
    this.onremovestream = null;
    this.onsignalingstatechange = null;
    this.oniceconnectionstatechange = null;
    this.onnegotiationneeded = null;
    this.ondatachannel = null;

    this.localStreams = [];
    this.remoteStreams = [];
    this.getLocalStreams = function() {
      return self.localStreams;
    };
    this.getRemoteStreams = function() {
      return self.remoteStreams;
    };

    this.localDescription = new RTCSessionDescription({
      type: '',
      sdp: ''
    });
    this.remoteDescription = new RTCSessionDescription({
      type: '',
      sdp: ''
    });
    this.signalingState = 'stable';
    this.iceConnectionState = 'new';
    this.iceGatheringState = 'new';

    this.iceOptions = {
      gatherPolicy: 'all',
      iceServers: []
    };
    if (config && config.iceTransportPolicy) {
      switch (config.iceTransportPolicy) {
        case 'all':
        case 'relay':
          this.iceOptions.gatherPolicy = config.iceTransportPolicy;
          break;
        case 'none':
          // FIXME: remove once implementation and spec have added this.
          throw new TypeError('iceTransportPolicy "none" not supported');
        default:
          // don't set iceTransportPolicy.
          break;
      }
    }
    this.usingBundle = config && config.bundlePolicy === 'max-bundle';

    if (config && config.iceServers) {
      // Edge does not like
      // 1) stun:
      // 2) turn: that does not have all of turn:host:port?transport=udp
      var iceServers = JSON.parse(JSON.stringify(config.iceServers));
      this.iceOptions.iceServers = iceServers.filter(function(server) {
        if (server && server.urls) {
          var urls = server.urls;
          if (typeof urls === 'string') {
            urls = [urls];
          }
          urls = urls.filter(function(url) {
            return url.indexOf('turn:') === 0 &&
              url.indexOf('transport=udp') !== -1;
          })[0];
          return !!urls;
        }
        return false;
      });
    }

    // per-track iceGathers, iceTransports, dtlsTransports, rtpSenders, ...
    // everything that is needed to describe a SDP m-line.
    this.transceivers = [];

    // since the iceGatherer is currently created in createOffer but we
    // must not emit candidates until after setLocalDescription we buffer
    // them in this array.
    this._localIceCandidatesBuffer = [];
  };

  window.RTCPeerConnection.prototype.addStream = function(stream) {
    // Clone is necessary for local demos mostly, attaching directly
    // to two different senders does not work (build 10547).
    this.localStreams.push(stream.clone());
    this._maybeFireNegotiationNeeded();
  };

  window.RTCPeerConnection.prototype.removeStream = function(stream) {
    var idx = this.localStreams.indexOf(stream);
    if (idx > -1) {
      this.localStreams.splice(idx, 1);
      this._maybeFireNegotiationNeeded();
    }
  };

  window.RTCPeerConnection.prototype.getSenders = function() {
    return this.transceivers.filter(function(transceiver) {
        return !!transceiver.rtpSender;
      })
      .map(function(transceiver) {
        return transceiver.rtpSender;
      });
  };

  window.RTCPeerConnection.prototype.getReceivers = function() {
    return this.transceivers.filter(function(transceiver) {
        return !!transceiver.rtpReceiver;
      })
      .map(function(transceiver) {
        return transceiver.rtpReceiver;
      });
  };

  window.RTCPeerConnection.prototype._emitBufferedCandidates =
    function() {
      var self = this;
      var sections = SDPUtils.splitSections(self.localDescription.sdp);
      // FIXME: need to apply ice candidates in a way which is async but
      // in-order
      this._localIceCandidatesBuffer.forEach(function(event) {
        var end = !event.candidate || Object.keys(event.candidate).length ===
          0;
        if (end) {
          for (var j = 1; j < sections.length; j++) {
            if (sections[j].indexOf('\r\na=end-of-candidates\r\n') === -1) {
              sections[j] += 'a=end-of-candidates\r\n';
            }
          }
        } else if (event.candidate.candidate.indexOf(
            'typ endOfCandidates') === -1) {
          sections[event.candidate.sdpMLineIndex + 1] +=
            'a=' + event.candidate.candidate + '\r\n';
        }
        self.localDescription.sdp = sections.join('');
        if (self.dispatchEvent !== null) {
          self.dispatchEvent(event);
        }

        if (self.onicecandidate !== null) {
          self.onicecandidate(event);
        }
        if (!event.candidate && self.iceGatheringState !== 'complete') {
          var complete = self.transceivers.every(function(transceiver) {
            return transceiver.iceGatherer &&
              transceiver.iceGatherer.state === 'completed';
          });
          if (complete) {
            self.iceGatheringState = 'complete';
          }
        }
      });
      this._localIceCandidatesBuffer = [];
    };

  // Determines the intersection of local and remote capabilities.
  window.RTCPeerConnection.prototype._getCommonCapabilities =
    function(localCapabilities, remoteCapabilities) {
      var commonCapabilities = {
        codecs: [],
        headerExtensions: [],
        fecMechanisms: []
      };
      localCapabilities.codecs.forEach(function(lCodec) {
        for (var i = 0; i < remoteCapabilities.codecs.length; i++) {
          var rCodec = remoteCapabilities.codecs[i];
          if (lCodec.name.toLowerCase() === rCodec.name.toLowerCase() &&
            lCodec.clockRate === rCodec.clockRate &&
            lCodec.numChannels === rCodec.numChannels) {
            // push rCodec so we reply with offerer payload type
            commonCapabilities.codecs.push(rCodec);

            // FIXME: also need to determine intersection between
            // .rtcpFeedback and .parameters
            break;
          }
        }
      });

      localCapabilities.headerExtensions
        .forEach(function(lHeaderExtension) {
          for (var i = 0; i < remoteCapabilities.headerExtensions.length; i++) {
            var rHeaderExtension = remoteCapabilities.headerExtensions[i];
            if (lHeaderExtension.uri === rHeaderExtension.uri) {
              commonCapabilities.headerExtensions.push(rHeaderExtension);
              break;
            }
          }
        });

      // FIXME: fecMechanisms
      return commonCapabilities;
    };

  // Create ICE gatherer, ICE transport and DTLS transport.
  window.RTCPeerConnection.prototype._createIceAndDtlsTransports =
    function(mid, sdpMLineIndex) {
      var self = this;
      var iceGatherer = new window.RTCIceGatherer(self.iceOptions);
      var iceTransport = new window.RTCIceTransport(iceGatherer);
      iceGatherer.onlocalcandidate = function(evt) {
        var event = new Event('icecandidate');
        event.candidate = {
          sdpMid: mid,
          sdpMLineIndex: sdpMLineIndex
        };

        var cand = evt.candidate;
        var end = !cand || Object.keys(cand).length === 0;
        // Edge emits an empty object for RTCIceCandidateComplete‥
        if (end) {
          // polyfill since RTCIceGatherer.state is not implemented in
          // Edge 10547 yet.
          if (iceGatherer.state === undefined) {
            iceGatherer.state = 'completed';
          }

          // Emit a candidate with type endOfCandidates to make the samples
          // work. Edge requires addIceCandidate with this empty candidate
          // to start checking. The real solution is to signal
          // end-of-candidates to the other side when getting the null
          // candidate but some apps (like the samples) don't do that.
          event.candidate.candidate =
            'candidate:1 1 udp 1 0.0.0.0 9 typ endOfCandidates';
        } else {
          // RTCIceCandidate doesn't have a component, needs to be added
          cand.component = iceTransport.component === 'RTCP' ? 2 : 1;
          event.candidate.candidate = SDPUtils.writeCandidate(cand);
        }

        // update local description.
        var sections = SDPUtils.splitSections(self.localDescription.sdp);
        if (event.candidate.candidate.indexOf('typ endOfCandidates') === -1) {
          sections[event.candidate.sdpMLineIndex + 1] +=
            'a=' + event.candidate.candidate + '\r\n';
        } else {
          sections[event.candidate.sdpMLineIndex + 1] +=
            'a=end-of-candidates\r\n';
        }
        self.localDescription.sdp = sections.join('');

        var complete = self.transceivers.every(function(transceiver) {
          return transceiver.iceGatherer &&
            transceiver.iceGatherer.state === 'completed';
        });

        // Emit candidate if localDescription is set.
        // Also emits null candidate when all gatherers are complete.
        switch (self.iceGatheringState) {
          case 'new':
            self._localIceCandidatesBuffer.push(event);
            if (end && complete) {
              self._localIceCandidatesBuffer.push(
                new Event('icecandidate'));
            }
            break;
          case 'gathering':
            self._emitBufferedCandidates();
            if (self.dispatchEvent !== null) {
              self.dispatchEvent(event);
            }
            if (self.onicecandidate !== null) {
              self.onicecandidate(event);
            }
            if (complete) {
              if (self.dispatchEvent !== null) {
                self.dispatchEvent(new Event('icecandidate'));
              }
              if (self.onicecandidate !== null) {
                self.onicecandidate(new Event('icecandidate'));
              }
              self.iceGatheringState = 'complete';
            }
            break;
          case 'complete':
            // should not happen... currently!
            break;
          default: // no-op.
            break;
        }
      };
      iceTransport.onicestatechange = function() {
        self._updateConnectionState();
      };

      var dtlsTransport = new window.RTCDtlsTransport(iceTransport);
      dtlsTransport.ondtlsstatechange = function() {
        self._updateConnectionState();
      };
      dtlsTransport.onerror = function() {
        // Chunbo - onerror does not set state to failed by itself.
        //dtlsTransport.state = 'failed';
        self._updateConnectionState();
      };

      return {
        iceGatherer: iceGatherer,
        iceTransport: iceTransport,
        dtlsTransport: dtlsTransport
      };
    };

  // Start the RTP Sender and Receiver for a transceiver.
  window.RTCPeerConnection.prototype._transceive =
    function(transceiver,
      send, recv) {
      var params = this._getCommonCapabilities(transceiver.localCapabilities,
        transceiver.remoteCapabilities);
      if (send && transceiver.rtpSender) {
        params.encodings = transceiver.sendEncodingParameters;
        params.rtcp = {
          cname: SDPUtils.localCName
        };
        if (transceiver.recvEncodingParameters.length) {
          params.rtcp.ssrc = transceiver.recvEncodingParameters[0].ssrc;
        }
        transceiver.rtpSender.send(params);
      }
      if (recv && transceiver.rtpReceiver) {
        params.encodings = transceiver.recvEncodingParameters;
        params.rtcp = {
          cname: transceiver.cname
        };
        if (transceiver.sendEncodingParameters.length) {
          params.rtcp.ssrc = transceiver.sendEncodingParameters[0].ssrc;
        }
        transceiver.rtpReceiver.receive(params);
      }
    };

  // Update the signaling state.
  window.RTCPeerConnection.prototype._updateSignalingState =
    function(newState) {
      this.signalingState = newState;
      var event = new Event('signalingstatechange');
      if (this.dispatchEvent !== null) {
        this.dispatchEvent(event);
      }
      if (this.onsignalingstatechange !== null) {
        this.onsignalingstatechange(event);
      }
    };

  // Determine whether to fire the negotiationneeded event.
  window.RTCPeerConnection.prototype._maybeFireNegotiationNeeded =
    function() {
      // Fire away (for now).
      var event = new Event('negotiationneeded');
      if (this.dispatchEvent !== null) {
        this.dispatchEvent(event);
      }
      if (this.onnegotiationneeded !== null) {
        this.onnegotiationneeded(event);
      }
    };

  // Update the connection state.
  window.RTCPeerConnection.prototype._updateConnectionState =
    function() {
      var self = this;
      var newState;
      var states = {
        'new': 0,
        closed: 0,
        connecting: 0,
        checking: 0,
        connected: 0,
        completed: 0,
        failed: 0
      };
      this.transceivers.forEach(function(transceiver) {
        states[transceiver.iceTransport.state]++;
        states[transceiver.dtlsTransport.state]++;
      });
      // ICETransport.completed and connected are the same for this purpose.
      states.connected += states.completed;

      newState = 'new';
      if (states.failed > 0) {
        newState = 'failed';
      } else if (states.connecting > 0 || states.checking > 0) {
        newState = 'connecting';
      } else if (states.disconnected > 0) {
        newState = 'disconnected';
      } else if (states.new > 0) {
        newState = 'new';
      } else if (states.connected > 0 || states.completed > 0) {
        newState = 'connected';
      }

      if (newState !== self.iceConnectionState) {
        self.iceConnectionState = newState;
        var event = new Event('iceconnectionstatechange');
        if (this.dispatchEvent !== null) {
          this.dispatchEvent(event);
        }
        if (this.oniceconnectionstatechange !== null) {
          // Chunbo - Set the new state to the iceconnectionstatechange event
          this.oniceconnectionstatechange(newState);
        }
      }
    };

  window.RTCPeerConnection.prototype.setLocalDescription =
    function(description) {
      var self = this;
      var sections;
      var sessionpart;
      if (description.type === 'offer') {
        // FIXME: What was the purpose of this empty if statement?
        // if (!this._pendingOffer) {
        // } else {
        if (this._pendingOffer) {
          // VERY limited support for SDP munging. Limited to:
          // * changing the order of codecs
          sections = SDPUtils.splitSections(description.sdp);
          sessionpart = sections.shift();
          sections.forEach(function(mediaSection, sdpMLineIndex) {
            var caps = SDPUtils.parseRtpParameters(mediaSection);
            self._pendingOffer[sdpMLineIndex].localCapabilities = caps;
          });
          this.transceivers = this._pendingOffer;
          delete this._pendingOffer;
        }
      } else if (description.type === 'answer') {
        sections = SDPUtils.splitSections(self.remoteDescription.sdp);
        sessionpart = sections.shift();
        var isIceLite = SDPUtils.matchPrefix(sessionpart,
          'a=ice-lite').length > 0;
        sections.forEach(function(mediaSection, sdpMLineIndex) {
          var transceiver = self.transceivers[sdpMLineIndex];
          var iceGatherer = transceiver.iceGatherer;
          var iceTransport = transceiver.iceTransport;
          var dtlsTransport = transceiver.dtlsTransport;
          var localCapabilities = transceiver.localCapabilities;
          var remoteCapabilities = transceiver.remoteCapabilities;
          var rejected = mediaSection.split('\n', 1)[0]
            .split(' ', 2)[1] === '0';

          if (!rejected) {
            var remoteIceParameters = SDPUtils.getIceParameters(
              mediaSection, sessionpart);
            if (isIceLite) {
              var cands = SDPUtils.matchPrefix(mediaSection,
                  'a=candidate:')
                .map(function(cand) {
                  return SDPUtils.parseCandidate(cand);
                })
                .filter(function(cand) {
                  return cand.component === '1';
                });
              // ice-lite only includes host candidates in the SDP so we can
              // use setRemoteCandidates (which implies an
              // RTCIceCandidateComplete)
              if (cands.length) {
                iceTransport.setRemoteCandidates(cands);
              }
            }
            var remoteDtlsParameters = SDPUtils.getDtlsParameters(
              mediaSection, sessionpart);
            if (isIceLite) {
              remoteDtlsParameters.role = 'server';
            }

            // Chunbo - Set the dtls parameter as client for the remote peer
            remoteDtlsParameters.role = 'client';

            if (!self.usingBundle || sdpMLineIndex === 0) {
              iceTransport.start(iceGatherer, remoteIceParameters,
                isIceLite ? 'controlling' : 'controlled');
              dtlsTransport.start(remoteDtlsParameters);
            }

            // Calculate intersection of capabilities.
            var params = self._getCommonCapabilities(localCapabilities,
              remoteCapabilities);

            // Start the RTCRtpSender. The RTCRtpReceiver for this
            // transceiver has already been started in setRemoteDescription.
            self._transceive(transceiver,
              params.codecs.length > 0,
              false);
          }
        });
      }

      this.localDescription = {
        type: description.type,
        sdp: description.sdp
      };
      switch (description.type) {
        case 'offer':
          this._updateSignalingState('have-local-offer');
          break;
        case 'answer':
          this._updateSignalingState('stable');
          break;
        default:
          throw new TypeError('unsupported type "' + description.type +
            '"');
      }

      // If a success callback was provided, emit ICE candidates after it
      // has been executed. Otherwise, emit callback after the Promise is
      // resolved.
      var hasCallback = arguments.length > 1 &&
        typeof arguments[1] === 'function';
      if (hasCallback) {
        var cb = arguments[1];
        window.setTimeout(function() {
          cb();
          if (self.iceGatheringState === 'new') {
            self.iceGatheringState = 'gathering';
          }
          self._emitBufferedCandidates();
        }, 0);
      }
      var p = window.Promise.resolve();
      p.then(function() {
        if (!hasCallback) {
          if (self.iceGatheringState === 'new') {
            self.iceGatheringState = 'gathering';
          }
          // Usually candidates will be emitted earlier.
          window.setTimeout(self._emitBufferedCandidates.bind(self), 500);
        }
      });
      return p;
    };

  window.RTCPeerConnection.prototype.setRemoteDescription =
    function(description) {
      var self = this;
      var stream = new window.MediaStream();
      var receiverList = [];
      var sections = SDPUtils.splitSections(description.sdp);
      var sessionpart = sections.shift();
      var isIceLite = SDPUtils.matchPrefix(sessionpart,
        'a=ice-lite').length > 0;
      this.usingBundle = SDPUtils.matchPrefix(sessionpart,
        'a=group:BUNDLE ').length > 0;
      sections.forEach(function(mediaSection, sdpMLineIndex) {
        var lines = SDPUtils.splitLines(mediaSection);
        var mline = lines[0].substr(2).split(' ');
        var kind = mline[0];
        var rejected = mline[1] === '0';
        var direction = SDPUtils.getDirection(mediaSection, sessionpart);

        var transceiver;
        var iceGatherer;
        var iceTransport;
        var dtlsTransport;
        var rtpSender;
        var rtpReceiver;
        var sendEncodingParameters;
        var recvEncodingParameters;
        var localCapabilities;

        var track;
        // FIXME: ensure the mediaSection has rtcp-mux set.
        var remoteCapabilities = SDPUtils.parseRtpParameters(mediaSection);
        var remoteIceParameters;
        var remoteDtlsParameters;
        if (!rejected) {
          remoteIceParameters = SDPUtils.getIceParameters(mediaSection,
            sessionpart);
          remoteDtlsParameters = SDPUtils.getDtlsParameters(mediaSection,
            sessionpart);
          remoteDtlsParameters.role = 'client';
        }

        // Chunbo - Set the dtls parameter as client for the remote peer
        remoteDtlsParameters.role = 'client';

        recvEncodingParameters =
          SDPUtils.parseRtpEncodingParameters(mediaSection);

        var mid = SDPUtils.matchPrefix(mediaSection, 'a=mid:');
        if (mid.length) {
          mid = mid[0].substr(6);
        } else {
          mid = SDPUtils.generateIdentifier();
        }

        var cname;
        // Gets the first SSRC. Note that with RTX there might be multiple
        // SSRCs.
        var remoteSsrc = SDPUtils.matchPrefix(mediaSection, 'a=ssrc:')
          .map(function(line) {
            return SDPUtils.parseSsrcMedia(line);
          })
          .filter(function(obj) {
            return obj.attribute === 'cname';
          })[0];
        if (remoteSsrc) {
          cname = remoteSsrc.value;
        }

        // Chunbo - Hard-coded isComplete currently
        // var isComplete = SDPUtils.matchPrefix(mediaSection,
        //     'a=end-of-candidates').length > 0;
        var isComplete = true;
        var cands = SDPUtils.matchPrefix(mediaSection, 'a=candidate:')
          .map(function(cand) {
            return SDPUtils.parseCandidate(cand);
          })
          .filter(function(cand) {
            return cand.component === '1';
          });
        cands.push({});
        if (description.type === 'offer' && !rejected) {
          var transports = self.usingBundle && sdpMLineIndex > 0 ? {
            iceGatherer: self.transceivers[0].iceGatherer,
            iceTransport: self.transceivers[0].iceTransport,
            dtlsTransport: self.transceivers[0].dtlsTransport
          } : self._createIceAndDtlsTransports(mid, sdpMLineIndex);

          if (isComplete) {
            transports.iceTransport.setRemoteCandidates(cands);
          }

          localCapabilities = window.RTCRtpReceiver.getCapabilities(kind);
          sendEncodingParameters = [{
            ssrc: (2 * sdpMLineIndex + 2) * 1001
          }];

          rtpReceiver = new window.RTCRtpReceiver(transports.dtlsTransport,
            kind);

          track = rtpReceiver.track;
          receiverList.push([track, rtpReceiver]);
          // FIXME: not correct when there are multiple streams but that is
          // not currently supported in this shim.
          stream.addTrack(track);

          // FIXME: look at direction.
          if (self.localStreams.length > 0 &&
            self.localStreams[0].getTracks().length >= sdpMLineIndex) {
            var localTrack;
            if (kind === 'audio') {
              localTrack = self.localStreams[0].getAudioTracks()[0];
            } else if (kind === 'video') {
              localTrack = self.localStreams[0].getVideoTracks()[0];
            }
            if (localTrack) {
              rtpSender = new window.RTCRtpSender(localTrack,
                transports.dtlsTransport);
            }
          }

          self.transceivers[sdpMLineIndex] = {
            iceGatherer: transports.iceGatherer,
            iceTransport: transports.iceTransport,
            dtlsTransport: transports.dtlsTransport,
            localCapabilities: localCapabilities,
            remoteCapabilities: remoteCapabilities,
            rtpSender: rtpSender,
            rtpReceiver: rtpReceiver,
            kind: kind,
            mid: mid,
            cname: cname,
            sendEncodingParameters: sendEncodingParameters,
            recvEncodingParameters: recvEncodingParameters
          };
          // Start the RTCRtpReceiver now. The RTPSender is started in
          // setLocalDescription.
          self._transceive(self.transceivers[sdpMLineIndex],
            false,
            direction === 'sendrecv' || direction === 'sendonly');
        } else if (description.type === 'answer' && !rejected) {
          transceiver = self.transceivers[sdpMLineIndex];
          iceGatherer = transceiver.iceGatherer;
          iceTransport = transceiver.iceTransport;
          dtlsTransport = transceiver.dtlsTransport;
          rtpSender = transceiver.rtpSender;
          rtpReceiver = transceiver.rtpReceiver;
          sendEncodingParameters = transceiver.sendEncodingParameters;
          localCapabilities = transceiver.localCapabilities;

          self.transceivers[sdpMLineIndex].recvEncodingParameters =
            recvEncodingParameters;
          self.transceivers[sdpMLineIndex].remoteCapabilities =
            remoteCapabilities;
          self.transceivers[sdpMLineIndex].cname = cname;

          if ((isIceLite || isComplete) && cands.length) {
            iceTransport.setRemoteCandidates(cands);
          }
          if (!self.usingBundle || sdpMLineIndex === 0) {
            iceTransport.start(iceGatherer, remoteIceParameters,
              'controlling');
            dtlsTransport.start(remoteDtlsParameters);
          }

          self._transceive(transceiver,
            direction === 'sendrecv' || direction === 'recvonly',
            direction === 'sendrecv' || direction === 'sendonly');

          if (rtpReceiver &&
            (direction === 'sendrecv' || direction === 'sendonly')) {
            track = rtpReceiver.track;
            receiverList.push([track, rtpReceiver]);
            stream.addTrack(track);
          } else {
            // FIXME: actually the receiver should be created later.
            delete transceiver.rtpReceiver;
          }
        }
      });

      this.remoteDescription = {
        type: description.type,
        sdp: description.sdp
      };
      switch (description.type) {
        case 'offer':
          this._updateSignalingState('have-remote-offer');
          break;
        case 'answer':
          this._updateSignalingState('stable');
          break;
        default:
          throw new TypeError('unsupported type "' + description.type +
            '"');
      }
      if (stream.getTracks().length) {
        self.remoteStreams.push(stream);
        window.setTimeout(function() {
          var event = new Event('addstream');
          event.stream = stream;
          if (self.dispatchEvent !== null) {
            self.dispatchEvent(event);
          }
          if (self.onaddstream !== null) {
            window.setTimeout(function() {
              self.onaddstream(event);
            }, 0);
          }

          receiverList.forEach(function(item) {
            var track = item[0];
            var receiver = item[1];
            var trackEvent = new Event('track');
            trackEvent.track = track;
            trackEvent.receiver = receiver;
            trackEvent.streams = [stream];
            if (self.dispatchEvent !== null) {
              self.dispatchEvent(event);
            }
            if (self.ontrack !== null) {
              window.setTimeout(function() {
                self.ontrack(trackEvent);
              }, 0);
            }
          });
        }, 0);
      }
      if (arguments.length > 1 && typeof arguments[1] === 'function') {
        window.setTimeout(arguments[1], 0);
      }
      return window.Promise.resolve();
    };

  window.RTCPeerConnection.prototype.close = function() {
    this.transceivers.forEach(function(transceiver) {
      /* not yet
      if (transceiver.iceGatherer) {
        transceiver.iceGatherer.close();
      }
      */
      if (transceiver.iceTransport) {
        transceiver.iceTransport.stop();
      }
      if (transceiver.dtlsTransport) {
        transceiver.dtlsTransport.stop();
      }
      if (transceiver.rtpSender) {
        transceiver.rtpSender.stop();
      }
      if (transceiver.rtpReceiver) {
        transceiver.rtpReceiver.stop();
      }
    });
    // FIXME: clean up tracks, local streams, remote streams, etc
    this._updateSignalingState('closed');
  };

  window.RTCPeerConnection.prototype.createOffer = function() {
    var self = this;
    if (this._pendingOffer) {
      throw new Error('createOffer called while there is a pending offer.');
    }
    var offerOptions;
    if (arguments.length === 1 && typeof arguments[0] !== 'function') {
      offerOptions = arguments[0];
    } else if (arguments.length === 3) {
      offerOptions = arguments[2];
    }

    var tracks = [];
    var numAudioTracks = 0;
    var numVideoTracks = 0;
    // Default to sendrecv.
    if (this.localStreams.length) {
      numAudioTracks = this.localStreams[0].getAudioTracks().length;
      numVideoTracks = this.localStreams[0].getVideoTracks().length;
    }
    // Determine number of audio and video tracks we need to send/recv.
    if (offerOptions) {
      // Reject Chrome legacy constraints.
      if (offerOptions.mandatory || offerOptions.optional) {
        throw new TypeError(
          'Legacy mandatory/optional constraints not supported.');
      }
      if (offerOptions.offerToReceiveAudio !== undefined) {
        numAudioTracks = offerOptions.offerToReceiveAudio;
      }
      if (offerOptions.offerToReceiveVideo !== undefined) {
        numVideoTracks = offerOptions.offerToReceiveVideo;
      }
    }
    if (this.localStreams.length) {
      // Push local streams.
      this.localStreams[0].getTracks().forEach(function(track) {
        tracks.push({
          kind: track.kind,
          track: track,
          wantReceive: track.kind === 'audio' ?
            numAudioTracks > 0 : numVideoTracks > 0
        });
        if (track.kind === 'audio') {
          numAudioTracks--;
        } else if (track.kind === 'video') {
          numVideoTracks--;
        }
      });
    }
    // Create M-lines for recvonly streams.
    while (numAudioTracks > 0 || numVideoTracks > 0) {
      if (numAudioTracks > 0) {
        tracks.push({
          kind: 'audio',
          wantReceive: true
        });
        numAudioTracks--;
      }
      if (numVideoTracks > 0) {
        tracks.push({
          kind: 'video',
          wantReceive: true
        });
        numVideoTracks--;
      }
    }

    var sdp = SDPUtils.writeSessionBoilerplate();
    var transceivers = [];
    tracks.forEach(function(mline, sdpMLineIndex) {
      // For each track, create an ice gatherer, ice transport,
      // dtls transport, potentially rtpsender and rtpreceiver.
      var track = mline.track;
      var kind = mline.kind;
      var mid = SDPUtils.generateIdentifier();

      var transports = self.usingBundle && sdpMLineIndex > 0 ? {
        iceGatherer: transceivers[0].iceGatherer,
        iceTransport: transceivers[0].iceTransport,
        dtlsTransport: transceivers[0].dtlsTransport
      } : self._createIceAndDtlsTransports(mid, sdpMLineIndex);

      var localCapabilities = window.RTCRtpSender.getCapabilities(kind);
      var rtpSender;
      var rtpReceiver;

      // generate an ssrc now, to be used later in rtpSender.send
      var sendEncodingParameters = [{
        ssrc: (2 * sdpMLineIndex + 1) * 1001
      }];
      if (track) {
        rtpSender = new window.RTCRtpSender(track, transports.dtlsTransport);
      }

      if (mline.wantReceive) {
        rtpReceiver = new window.RTCRtpReceiver(transports.dtlsTransport,
          kind);
      }

      transceivers[sdpMLineIndex] = {
        iceGatherer: transports.iceGatherer,
        iceTransport: transports.iceTransport,
        dtlsTransport: transports.dtlsTransport,
        localCapabilities: localCapabilities,
        remoteCapabilities: null,
        rtpSender: rtpSender,
        rtpReceiver: rtpReceiver,
        kind: kind,
        mid: mid,
        sendEncodingParameters: sendEncodingParameters,
        recvEncodingParameters: null
      };
    });
    if (this.usingBundle) {
      sdp += 'a=group:BUNDLE ' + transceivers.map(function(t) {
        return t.mid;
      }).join(' ') + '\r\n';
    }
    tracks.forEach(function(mline, sdpMLineIndex) {
      var transceiver = transceivers[sdpMLineIndex];
      sdp += SDPUtils.writeMediaSection(transceiver,
        transceiver.localCapabilities, 'offer', self.localStreams[0]);
    });

    this._pendingOffer = transceivers;
    var desc = new RTCSessionDescription({
      type: 'offer',
      sdp: sdp
    });
    if (arguments.length && typeof arguments[0] === 'function') {
      window.setTimeout(arguments[0], 0, desc);
    }
    return window.Promise.resolve(desc);
  };

  window.RTCPeerConnection.prototype.createAnswer = function() {
    var self = this;

    var sdp = SDPUtils.writeSessionBoilerplate();
    if (this.usingBundle) {
      sdp += 'a=group:BUNDLE ' + this.transceivers.map(function(t) {
        return t.mid;
      }).join(' ') + '\r\n';
    }
    this.transceivers.forEach(function(transceiver) {
      // Calculate intersection of capabilities.
      var commonCapabilities = self._getCommonCapabilities(
        transceiver.localCapabilities,
        transceiver.remoteCapabilities);

      sdp += SDPUtils.writeMediaSection(transceiver, commonCapabilities,
        'answer', self.localStreams[0]);
    });

    var desc = new RTCSessionDescription({
      type: 'answer',
      sdp: sdp
    });
    if (arguments.length && typeof arguments[0] === 'function') {
      window.setTimeout(arguments[0], 0, desc);
    }
    return window.Promise.resolve(desc);
  };

  window.RTCPeerConnection.prototype.addIceCandidate = function(candidate) {
    if (candidate === null) {
      this.transceivers.forEach(function(transceiver) {
        transceiver.iceTransport.addRemoteCandidate({});
      });
    } else {
      var mLineIndex = candidate.sdpMLineIndex;
      if (candidate.sdpMid) {
        for (var i = 0; i < this.transceivers.length; i++) {
          if (this.transceivers[i].mid === candidate.sdpMid) {
            mLineIndex = i;
            break;
          }
        }
      }
      var transceiver = this.transceivers[mLineIndex];
      if (transceiver) {
        var cand = Object.keys(candidate.candidate).length > 0 ?
          SDPUtils.parseCandidate(candidate.candidate) : {};
        // Ignore Chrome's invalid candidates since Edge does not like them.
        if (cand.protocol === 'tcp' && cand.port === 0) {
          return;
        }
        // Ignore RTCP candidates, we assume RTCP-MUX.
        if (cand.component !== '1') {
          return;
        }
        // A dirty hack to make samples work.
        if (cand.type === 'endOfCandidates') {
          cand = {};
        }
        transceiver.iceTransport.addRemoteCandidate(cand);

        // update the remoteDescription.
        var sections = SDPUtils.splitSections(this.remoteDescription.sdp);
        sections[mLineIndex + 1] += (cand.type ? candidate.candidate.trim() :
          'a=end-of-candidates') + '\r\n';
        this.remoteDescription.sdp = sections.join('');
      }
    }
    if (arguments.length > 1 && typeof arguments[1] === 'function') {
      window.setTimeout(arguments[1], 0);
    }
    return window.Promise.resolve();
  };
  /*
      window.RTCPeerConnection.prototype.getStats = function() {
        var promises = [];
        this.transceivers.forEach(function(transceiver) {
          ['rtpSender', 'rtpReceiver', 'iceGatherer', 'iceTransport',
              'dtlsTransport'].forEach(function(method) {
                if (transceiver[method]) {
                  promises.push(transceiver[method].getStats());
                }
              });
        });
        var cb = arguments.length > 1 && typeof arguments[1] === 'function' &&
            arguments[1];
        return new Promise(function(resolve) {
          // shim getStats with maplike support
          var results = new Map();
          Promise.all(promises).then(function(res) {
            res.forEach(function(result) {
              Object.keys(result).forEach(function(id) {
                results.set(id, result[id]);
                results[id] = result[id];
              });
            });
            if (cb) {
              window.setTimeout(cb, 0, results);
            }
            resolve(results);
          });
        });
      };
  */

  // Chunbo - MCU conference sdk part goes here
  that.mediaConstraints = {
    offerToReceiveVideo: spec.video,
    offerToReceiveAudio: spec.audio
  };

  var localDesc;

  var errorCallback = function(message) {
    L.Logger.error("Error in Edge Stack ", message);
  };

  var setVideoCodec = function(sdp) {
    if (spec.videoCodec !== 'H264' && spec.videoCodec !== 'h264') {
      return sdp;
    }
    // Put H264 in front of VP8(120)
    try {
      var mLine = sdp.match(/m=video.*\r\n/g)[0];
      var newMLine = mLine.replace(/\s120/, '').replace('\r\n', '') +
        ' 120\r\n';
      return sdp.replace(mLine, newMLine);
    } catch (e) {
      return sdp;
    }
  };

  var updateSdp = function(sdp) {
    var newSdp = setVideoCodec(sdp);
    // Add other operations here, e.g. set bandwidth.
    return newSdp;
  };

  var setMaxBW = function(sdp) {
    var a, r;
    if (spec.video && spec.maxVideoBW) {
      a = sdp.match(/m=video.*\r\n/);
      if (a == null) {
        a = sdp.match(/m=video.*\n/);
      }
      if (a && (a.length > 0)) {
        r = a[0] + "b=AS:" + spec.maxVideoBW + "\r\n";
        sdp = sdp.replace(a[0], r);
      }
    }

    if (spec.audio && spec.maxAudioBW) {
      a = sdp.match(/m=audio.*\r\n/);
      if (a == null) {
        a = sdp.match(/m=audio.*\n/);
      }
      if (a && (a.length > 0)) {
        r = a[0] + "b=AS:" + spec.maxAudioBW + "\r\n";
        sdp = sdp.replace(a[0], r);
      }
    }

    return sdp;
  };

  var setLocalDesc = function(sessionDescription) {
    sessionDescription.sdp = setMaxBW(sessionDescription.sdp);
    sessionDescription.sdp = updateSdp(sessionDescription.sdp.replace(
      /a=ice-options:google-ice\r\n/g, ''));
    spec.callback(sessionDescription);
    localDesc = sessionDescription;
  };

  var setLocalDescp2p = function(sessionDescription) {
    sessionDescription.sdp = setMaxBW(sessionDescription.sdp);
    sessionDescription.sdp = sessionDescription.sdp.replace(
      /a=ice-options:google-ice\r\n/g, "");
    spec.callback(sessionDescription);
    localDesc = sessionDescription;
    that.peerConnection.setLocalDescription(localDesc);
  };

  // Edge stack goes here
  that.peerConnection = new window.RTCPeerConnection(that.pc_config);
  spec.localCandidates = [];
  spec.remoteCandidates = [];
  spec.remoteDescriptionSet = false;

  that.peerConnection.onicecandidate = function(event) {
    if (event.candidate) {
      if (!event.candidate.candidate.match(/a=/)) {
        event.candidate.candidate = "a=" + event.candidate.candidate;
      }

      var candidateObject = {
        sdpMLineIndex: event.candidate.sdpMLineIndex,
        sdpMid: event.candidate.sdpMid,
        candidate: event.candidate.candidate
      };

      if (spec.remoteDescriptionSet) {
        spec.callback({
          type: 'candidate',
          candidate: candidateObject
        });
      } else {
        spec.localCandidates.push(candidateObject);
      }
    } else {
      // Chunbo - Push an empty candidate as the end of local candidates collection
      spec.localCandidates.push({
        candidate: {}
      });
      console.log("End of candidates.");
    }
  };

  that.peerConnection.onaddstream = function(stream) {
    if (that.onaddstream) {
      that.onaddstream(stream);
    }
  };

  that.peerConnection.onremovestream = function(stream) {
    if (that.onremovestream) {
      that.onremovestream(stream);
    }
  };

  that.peerConnection.oniceconnectionstatechange = function(e) {
    if (that.oniceconnectionstatechange) {
      that.oniceconnectionstatechange(e);
    }
  };

  that.createOffer = function(isSubscribe) {
    if (isSubscribe === true) {
      that.peerConnection.createOffer(setLocalDesc, errorCallback, that.mediaConstraints);
    } else {
      that.peerConnection.createOffer(setLocalDesc, errorCallback);
    }
  };

  that.addStream = function(stream) {
    that.peerConnection.addStream(stream);
  };

  that.processSignalingMessage = function(msg) {
    L.Logger.debug("Process Signaling Message", msg.type);
    if (msg.type === 'offer') {
      msg.sdp = setMaxBW(msg.sdp);
      console.log("Set offer description \n", msg.sdp);
      that.peerConnection.setRemoteDescription(new RTCSessionDescription(
        msg), function() {
        that.peerConnection.createAnswer(setLocalDescp2p, function(
          error) {
          L.Logger.error("Error", error);
        }, that.mediaConstraints);
        spec.remoteDescriptionSet = true;
      }, function(error) {
        L.Logger.error("Error setting Remote Description", error);
      });
    } else if (msg.type === 'answer') {
      console.log("Set remote description", msg.sdp);

      msg.sdp = setMaxBW(msg.sdp);

      that.peerConnection.setLocalDescription(localDesc, function() {
        that.peerConnection.setRemoteDescription(new RTCSessionDescription(
          msg), function() {
          spec.remoteDescriptionSet = true;
          L.Logger.info("Remote Description successfully set");
          while (spec.remoteCandidates.length > 0) {
            // IMPORTANT: preserve ordering of candidates
            that.peerConnection.addIceCandidate(spec.remoteCandidates
              .shift());
          }
          while (spec.localCandidates.length > 0) {
            // IMPORTANT: preserve ordering of candidates
            spec.callback({
              type: 'candidate',
              candidate: spec.localCandidates.shift()
            });
          }
        }, function(error) {
          L.Logger.error("Failure Setting Remote Description",
            error);
        });
      }, function(error) {
        L.Logger.error("Failure Setting Local Description", error);
      });
    } else if (msg.type === 'candidate') {
      try {
        var obj;
        if (typeof(msg.candidate) === 'object') {
          obj = msg.candidate;
        } else {
          obj = JSON.parse(msg.candidate);
        }

        obj.candidate = obj.candidate.replace(/a=/g, "");
        obj.sdpMLineIndex = parseInt(obj.sdpMLineIndex, 10);
        var candidate = new RTCIceCandidate(obj);
        if (spec.remoteDescriptionSet) {
          that.peerConnection.addIceCandidate(candidate);
          while (spec.remoteCandidates.length > 0) {
            L.Logger.info("Setting stored remote candidates");
            // IMPORTANT: preserve ordering of candidates
            that.peerConnection.addIceCandidate(spec.remoteCandidates.shift());
          }
        } else {
          spec.remoteCandidates.push(candidate);
        }
      } catch (e) {
        L.Logger.error("Error parsing candidate", msg.candidate, e);
      }
    }
  };

  that.close = function() {
    that.state = 'closed';
    if (that.peerConnection.signalingState !== 'closed') {
      that.peerConnection.close();
    }
  };

  that.getConnectionStats = function(onSuccess, onFailure) {
    onFailure('getConnectionStats is not supported on Edge.');
  };

  return that;
};



var Woogeen = Woogeen || {}; /*jshint ignore:line*/ //Woogeen is defined.

Woogeen.Error = {
  // 1000-1999 for media stream errors
  STREAM_LOCAL_ACCESS_DENIED: {
    code: 1101,
    message: 'Cannot access to camera or micphone.'
  },

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
    message: 'Method has not been supported by server'
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
  P2P_CHATROOM_ATTENDEE_EXCEED: {
    code: 2301,
    message: "Exceed room's limitation"
  },
  P2P_CHATROOM_PEER_NOT_FOUND: {
    code: 2302,
    message: "Peer not found. Only one client in the room."
  },

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

  getErrorByCode: function(errorCode) {
    var codeErrorMap = {
      1101: Woogeen.Error.STREAM_LOCAL_ACCESS_DENIED,
      2100: Woogeen.Error.P2P_CONN_SERVER_UNKNOWN,
      2101: Woogeen.Error.P2P_CONN_SERVER_UNAVAILABLE,
      2102: Woogeen.Error.P2P_CONN_SERVER_BUSY,
      2103: Woogeen.Error.P2P_CONN_SERVER_NOT_SUPPORTED,
      2110: Woogeen.Error.P2P_CONN_CLIENT_UNKNOWN,
      2111: Woogeen.Error.P2P_CONN_CLIENT_NOT_INITIALIZED,
      2120: Woogeen.Error.P2P_CONN_AUTH_UNKNOWN,
      2121: Woogeen.Error.P2P_CONN_AUTH_FAILED,
      2201: Woogeen.Error.P2P_MESSAGING_TARGET_UNREACHABLE,
      2301: Woogeen.Error.P2P_CHATROOM_ATTENDEE_EXCEED,
      2302: Woogeen.Error.P2P_CHATROOM_PEER_NOT_FOUND,
      2400: Woogeen.Error.P2P_CLIENT_UNKNOWN,
      2401: Woogeen.Error.P2P_CLIENT_UNSUPPORTED_METHOD,
      2402: Woogeen.Error.P2P_CLIENT_ILLEGAL_ARGUMENT,
      2403: Woogeen.Error.P2P_CLIENT_INVALID_STATE
    };
    return codeErrorMap[errorCode];
  }
};



/* global SignalingChannel*/
/* exported Gab*/
/**
 * @class Gab
 * @classDesc A proxy to bridge old gab to new signaling channel.
 */
function Gab(loginInfo) { /*jshint ignore:line*/ //loginInfo is unused.
  'use strict';

  var self = this;

  var sc = new SignalingChannel();

  // Event handlers.
  /**
   * @property {function} onConnected
   * @memberOf Gab#
   */
  this.onConnected = null;
  /**
   * @property {function} onDisconnect
   * @memberOf Gab#
   */
  this.onDisconnected = null;
  /**
   * @property {function} onConnectFailed This function will be executed after connect to server failed. Parameter: errorCode for error code.
   * @memberOf Gab#
   */
  this.onConnectFailed = null;
  /**
   * @property {function} onChatInvitation Parameter: senderId for sender's ID.
   * @memberOf Gab#
   */
  this.onChatInvitation = null;
  /**
   * @property {function} onChatDenied Parameter: senderId for sender's ID.
   * @memberOf Gab#
   */
  this.onChatDenied = null;
  /**
   * @property {function} onChatStopped Parameter: senderId for sender's ID.
   * @memberOf Gab#
   */
  this.onChatStopped = null;
  /**
   * @property {function} onChatAccepted Parameter: senderId for sender's ID.
   * @memberOf Gab#
   */
  this.onChatAccepted = null;
  /**
   * @property {function} onChatError Parameter: errorCode.
   * @memberOf Gab#
   */
  //this.onChatError=null;
  /**
   * @property {function} onChatSignal Parameter: signaling message, sender ID.
   * @memberOf Gab#
   */
  this.onChatSignal = null;
  /**
   * @property {function} onStreamType Parameter: video type message, sender ID.
   * @memberOf Gab#
   */
  this.onStreamType = null;
  /**
   * @property {function} onAuthenticated
   * @memberOf Gab#
   */
  this.onAuthenticated = null;

  sc.onMessage = function(data, from) {
    var dataObj = JSON.parse(data);
    switch (dataObj.type) {
      case 'chat-invitation':
        if (self.onChatInvitation) {
          self.onChatInvitation(from, dataObj.ua);
        }
        break;
      case 'chat-accepted':
        if (self.onChatAccepted) {
          self.onChatAccepted(from, dataObj.ua);
        }
        break;
      case 'chat-denied':
        if (self.onChatDenied) {
          self.onChatDenied(from);
        }
        break;
      case 'chat-closed':
        if (self.onChatStopped) {
          self.onChatStopped(from);
        }
        break;
      case 'stream-type':
        if (self.onStreamType) {
          self.onStreamType(dataObj.data, from);
        }
        break;
      case 'chat-signal':
        if (self.onChatSignal) {
          self.onChatSignal(dataObj.data, from);
        }
        break;
      case 'chat-negotiation-needed':
        if (self.onNegotiationNeeded) {
          self.onNegotiationNeeded(from);
        }
        break;
      case 'chat-negotiation-accepted':
        if (self.onNegotiationAccepted) {
          self.onNegotiationAccepted(from);
        }
        break;
      default:
        L.Logger.error('Received unkown message');
    }
  };

  sc.onServerDisconnected = function() {
    if (self.onDisconnected) {
      self.onDisconnected();
    }
  };

  /**
   * Send a video invitation to a remote user
   * @memberOf Gab#
   * @param {string} uid Remote user's ID
   */
  this.sendChatInvitation = function(uid, ua, successCallback, failureCallback) {
    var msg = {
      type: 'chat-closed'
    };
    sc.sendMessage(JSON.stringify(msg), uid);
    msg = {
      type: 'chat-invitation',
      ua: ua
    };
    sc.sendMessage(JSON.stringify(msg), uid, successCallback, failureCallback);
  };

  /**
   * Send video agreed message to a remote user
   * @memberOf Gab#
   * @param {string} uid Remote user's ID
   */
  this.sendChatAccepted = function(uid, ua, successCallback, failureCallback) {
    var msg = {
      type: 'chat-accepted',
      ua: ua
    };
    sc.sendMessage(JSON.stringify(msg), uid, successCallback, failureCallback);
  };

  /**
   * Send video denied message to a remote user
   * @memberOf Gab#
   * @param {string} uid Remote user's ID
   */
  this.sendChatDenied = function(uid, successCallback, failureCallback) {
    var msg = {
      type: 'chat-denied'
    };
    sc.sendMessage(JSON.stringify(msg), uid, successCallback, failureCallback);
  };

  /**
   * Send video stopped message to a remote user
   * @memberOf Gab#
   * @param {string} uid Remote user's ID
   */
  this.sendChatStopped = function(uid, successCallback, failureCallback) {
    var msg = {
      type: 'chat-closed'
    };
    sc.sendMessage(JSON.stringify(msg), uid, successCallback, failureCallback);
  };

  /**
   * Send video type message to a remote user
   * @memberOf Gab#
   * @param {string} uid Remote user's ID
   * @param {string} stream to Remote user, it is like: {streamId:'label of stream', type:'audio'} or {streamId:'label of stream', type:'video'} or {streamId:'label of stream', type:'screen'}
   */
  this.sendStreamType = function(uid, stream, successCallback, failureCallback) {
    var msg = {
      type: 'stream-type',
      data: stream
    };
    sc.sendMessage(JSON.stringify(msg), uid, successCallback, failureCallback);
  };

  /**
   * Send signal message to a remote user
   * @memberOf Gab#
   * @param {string} uid Remote user's ID
   * @param {string} message Signal message
   */
  this.sendSignalMessage = function(uid, message, successCallback,
    failureCallback) {
    var msg = {
      type: 'chat-signal',
      data: message
    };
    sc.sendMessage(JSON.stringify(msg), uid, successCallback, failureCallback);
  };

  /**
   * Send negotiation needed message to a remote user
   * @memberOf Gab#
   * @param {string} uid Remote user's ID
   */
  this.sendNegotiationNeeded = function(uid, successCallback, failureCallback) {
    var msg = {
      type: 'chat-negotiation-needed'
    };
    sc.sendMessage(JSON.stringify(msg), uid, successCallback, failureCallback);
  };

  /**
   * Send negotiation accept message to a remote user
   * @memberOf Gab#
   * @param {string} uid Remote user's ID
   */
  this.sendNegotiationAccepted = function(uid, successCallback, failureCallback) {
    var msg = {
      type: 'chat-negotiation-accepted'
    };
    sc.sendMessage(JSON.stringify(msg), uid, successCallback, failureCallback);
  };

  /**
   * Finalize
   * @memberOf Gab#
   */
  this.finalize = function() {
    sc.disconnect();
  };

  /**
   * Connect to signaling server
   * @memberOf Gab#
   */
  this.connect = function(loginInfo, successCallback, failureCallback) {
    sc.connect(loginInfo, function(id) {
      if (self.onConnected) {
        self.onConnected();
      }
      if (self.onAuthenticated) {
        self.onAuthenticated(id);
      }
      if (successCallback) {
        successCallback(id);
      }
    }, failureCallback);
  };
}



/* global Gab,RTCIceCandidate,RTCSessionDescription,remoteIceCandidates*/
/* Depend on woogeen.js, gab-websocket.js, WooGeen.Error.js*/

var Woogeen = Woogeen || {}; /*jshint ignore:line*/ //Woogeen is defined.
/**
 * @class Woogeen.PeerClient
 * @classDesc Sets up a P2P WebRTC session.
 */
/**
 * @function PeerClient
 * @desc Constructor of PeerClient
 * @memberOf Woogeen.PeerClient
 * @param {json} config (Optional)Specifies the configurations for the PeerClient object created. Following properties are supported:<br>
@htmlonly
<table class="doxtable">
    <tr>
        <th>bandWidth</th>
        <td>Defines the maximum bandwidth in kbps for each tracks sent by this client. It should have a property - maxVideoBW which limits maximum bandwidth of each outgoing video tracks. Bandwidth limitation for audio track is not supported yet.</td>
    </tr>
    <tr>
        <th>iceServers</th>
        <td>Each ICE server instance has three properties: URIs, username (optional), credential (optional). URIs Could be an array of STUN/TURN server URIs which shared the same username and credential. STUN is described at http://tools.ietf.org/html/draft-nandakumar-rtcweb-stun-uri-08, and TURN is described at http://tools.ietf.org/html/rfc5766.</td>
    </tr>
    <tr>
        <th>audioCodec</th>
        <td>Specify preferred audio codec. Available values are "opus", "pcma", "pcmu", "isac". If specified codec is not supported by browser, it will be silently ignored. If this value is undefined, codec preference will be determined by browser.</td>
    </tr>
    <tr>
        <th>videoCodec</th>
        <td>Specify preferred video codec. Available values are "vp8", "vp9", "h264". If specified codec is not supported by browser, it will be silently ignored. If this value is undefined, codec preference will be determined by browser. Note for Firefox, vp8 will be preferred even if you specify vp9/h264 as preferred.</td>
    </tr>
</tbody>
</table>
@endhtmlonly
   Each codec has its own supported bitrate range. Setting incorrect maxAudioBW/maxVideoBW value may lead to connection failure. Bandwidth settings don't work on FireFox.
 * @return {Woogeen.PeerClient} An instance of Woogeen.PeerClient.
 * @example
var p2p=new Woogeen.PeerClient({
  bandWidth:{maxVideoBW:300},
  iceServers : [{
    urls : "stun:example.com"
  }, {
    urls : ["turn:example.com:3478?transport=tcp", "turn:example.com:3478?transport=udp"],
    credential : "master",
    username : "woogeen"
  }]
});
 */
Woogeen.PeerClient = function(pcConfig) {
  'use strict';

  var that = Woogeen.EventDispatcher({});

  var PeerState = {
    READY: 1, // Ready to chat.
    MATCHED: 2, // Another client joined the same room.
    OFFERED: 3, // Sent invitation to remote user.
    PENDING: 4, // Received an invitation.
    CONNECTING: 5, // Exchange SDP and prepare for video chat.
    CONNECTED: 6, // Chat.
    ERROR: 9 // Haven't been used yet.
  };

  var NegotiationState = {
    READY: 1,
    REQUESTED: 2,
    ACCEPTED: 3,
    NEGOTIATING: 4
  };

  var DataChannelLabel = {
    MESSAGE: 'message',
    FILE: 'file'
  };

  var ConnectionState = {
    READY: 1,
    CONNECTING: 2,
    CONNECTED: 3
  };
  var state = ConnectionState.READY;

  var spec = pcConfig;

  /**
   * @function isArray
   * @desc Test if an object is an array.
   * @return {boolean} DESCRIPTION
   * @private
   */
  var isArray = function(obj) {
    return (Object.prototype.toString.call(obj) === '[object Array]');
  };

  var pcDisconnectTimeout = 15000; // Close peerconnection after disconnect 15s.

  var connectSuccessCallback; // Callback for connect success.
  var connectFailureCallback; // Callback for connect failure.

  var gab = null;
  var peers = {}; // A map, key is target's UID, and value is an object with status and connection.
  var streams = {}; //A map, key is the stream's ID, and the value is : audio, video or screen.
  var chats = {}; // Same as room.
  var myId = null;
  var roomStreams = {};
  var isConnectedToSignalingChannel = false;
  var streamPeers = {}; // Key is stream id, value is an array of peer id.

  var pcConstraints = {
    'optional': [{
      'DtlsSrtpKeyAgreement': 'true'
    }]
  };
  //var pcConstraints=null;
  //var dataConstraints = {'ordered': true,
  //                     'maxRetransmitTime': 3000,  // in milliseconds
  //                     'protocol': 'SCTP'
  //                    };
  var dataConstraints = null;
  var sdpConstraints = {
    'offerToReceiveAudio': true,
    'offerToReceiveVideo': true
  };
  var config = null;

  var sysInfo = Woogeen.Common.sysInfo();
  var supportsPlanB = navigator.mozGetUserMedia ? false : true;
  var supportsUnifiedPlan = navigator.mozGetUserMedia ? true : false;

  // Set configuration for PeerConnection
  if (pcConfig) {
    config = {
      iceServers: pcConfig.iceServers
    };
  }

  /*
   * Return negative value if id1<id2, positive value if id1>id2
   */
  var compareID = function(id1, id2) {
    return id1.localeCompare(id2);
  };

  // If targetId is peerId, then return targetId.
  var getPeerId = function(targetId) {
    return targetId;
  };

  var changeNegotiationState = function(peer, state) {
    peer.negotiationState = state;
  };

  // Do stop chat locally.
  var stopChatLocally = function(peer, originatorId) {
    if (peer.state === PeerState.CONNECTED || peer.state === PeerState.CONNECTING) {
      if (peer.sendDataChannel) {
        peer.sendDataChannel.close();
      }
      if (peer.receiveDataChannel) {
        peer.receiveDataChannel.close();
      }
      if (peer.connection && peer.connection.iceConnectionState !==
        'closed') {
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

  var handleRemoteCapability = function(peer, ua) {
    if (ua.sdk && ua.sdk && ua.sdk.type === "JavaScript" && ua.runtime &&
      ua.runtime.name === "FireFox") {
      peer.remoteSideSupportsRemoveStream = false;
      peer.remoteSideSupportsPlanB = false;
      peer.remoteSideSupportsUnifiedPlan = true;
      peer.preferredVideoCodec = 'vp8';
    } else { // Remote side is iOS/Android/C++ which uses Chrome stack.
      peer.remoteSideSupportsRemoveStream = true;
      peer.remoteSideSupportsPlanB = true;
      peer.remoteSideSupportsUnifiedPlan = false;
    }
  };

  /* Event handlers name convention:
   *
   * **Handler for network events.
   * on** for PeerConnection events.
   */

  var connectedHandler = function() {
    isConnectedToSignalingChannel = true;
    state = ConnectionState.CONNECTED;
  };

  var connectFailedHandler = function() {
    if (connectFailureCallback) {
      connectFailureCallback();
    }
    connectSuccessCallback = undefined;
    connectFailureCallback = undefined;
  };

  var disconnectedHandler = function() {
    isConnectedToSignalingChannel = false;
    state = ConnectionState.READY;
    that.dispatchEvent(new Woogeen.ClientEvent({
      type: 'server-disconnected'
    }));
  };

  var chatInvitationHandler = function(senderId, ua) {
    // !peers[senderId] means this peer haven't been interacted before, so we
    // can treat it as READY.
    var peer = peers[senderId];
    if (!peer) {
      // Initialize a peer in peers array for new interacted peer
      createPeer(senderId);
      peer = peers[senderId];
    }
    handleRemoteCapability(peer, ua);
    if (peer.state === PeerState.READY || peer.state === PeerState.PENDING) {
      peers[senderId].state = PeerState.PENDING;
      that.dispatchEvent(new Woogeen.ChatEvent({
        type: 'chat-invited',
        senderId: senderId
      }));
    }
    // If both sides send invitation, the client with smaller ID send accept.
    else if (peer.state === PeerState.OFFERED && (compareID(myId, senderId) <
        0)) {
      peer.state = PeerState.PENDING;
      accept(senderId, function() {
        that.dispatchEvent(new Woogeen.ChatEvent({
          type: 'chat-accepted',
          senderId: senderId
        }));
      });
    }
  };

  var chatDeniedHandler = function(senderId) {
    var peer = peers[senderId];
    if (peer && peer.connection) {
      // Close PeerConnection if it has been established for this sender.
      if (peer.sendDataChannel) {
        peer.sendDataChannel.close();
      }
      if (peer.receiveDataChannel) {
        peer.receiveDataChannel.close();
      }
      peer.connection.close();
    }
    // Delete this peer's information from peers list since the
    // chat is stopped.
    delete peers[senderId];
    that.dispatchEvent(new Woogeen.ChatEvent({
      type: 'chat-denied',
      senderId: senderId
    }));
  };

  var chatAcceptedHandler = function(senderId, ua) {
    L.Logger.debug('Received chat accepted.');
    var peer = peers[senderId];
    if (peer) {
      peer.state = PeerState.MATCHED;
      handleRemoteCapability(peer, ua);
      createPeerConnection(peer);
      peer.state = PeerState.CONNECTING;
      createDataChannel(peer.id); // PeerConnection without streams and data channel is not allowed by FireFox.
      that.dispatchEvent(new Woogeen.ChatEvent({
        type: 'chat-accepted',
        senderId: senderId
      }));
    }
  };

  // Chat stop is very similar with chat denied
  var chatStoppedHandler = function(senderId) {
    var peer = peers[senderId];
    if (peer && peer.connection) {
      stopChatLocally(peer, senderId);
    }
    delete peers[senderId];
  };

  var chatSignalHandler = function(message, senderId) {
    var peer = peers[senderId];
    if (peer && peer.state === PeerState.CONNECTING) {
      if (!peer.connection) {
        createPeerConnection(peer);
      }
    }
    SignalingMessageHandler(peer, message);
  };

  var streamTypeHandler = function(message, senderId) { /*jshint ignore:line*/ //sendId is unused.
    streams[message.streamId] = message.type;
    L.Logger.debug('remote stream ID:' + message.streamId + ',type:' +
      streams[message.streamId]);
  };

  var authenticatedHandler = function(uid) {
    myId = uid;
    if (connectSuccessCallback) {
      connectSuccessCallback(uid);
    }
    connectSuccessCallback = undefined;
    connectFailureCallback = undefined;
  };

  var forceDisconnectHandler = function() {
    stop();
  };

  var onNegotiationneeded = function(peer) {
    L.Logger.debug('On negotiation needed.');
    if (peer.isCaller && peer.connection.signalingState === 'stable' &&
      peer.negotiationState === NegotiationState.READY) {
      doRenegotiate(peer);
    } else if (!peer.isCaller && gab) {
      gab.sendNegotiationNeeded(peer.id);
    } else {
      peer.isNegotiationNeeded = true;
    }
  };

  var onLocalIceCandidate = function(peer, event) {
    if (event.candidate && gab) {
      gab.sendSignalMessage(peer.id, {
        type: 'candidates',
        candidate: event.candidate.candidate,
        sdpMid: event.candidate.sdpMid,
        sdpMLineIndex: event.candidate.sdpMLineIndex
      });
    }
  };

  var onRemoteIceCandidate = function(peer, event) {
    if (peer) {
      L.Logger.debug('On remote ice candidate from peer ' + peer.id);
    }
    if (peer && (peer.state === PeerState.OFFERED || peer.state ===
        PeerState.CONNECTING || peer.state === PeerState.CONNECTED)) {
      var candidate = new RTCIceCandidate({
        candidate: event.message.candidate,
        sdpMid: event.message.sdpMid,
        sdpMLineIndex: event.message.sdpMLineIndex
      });
      if (peer.connection) {
        L.Logger.debug('Add remote ice candidates.');
        peer.connection.addIceCandidate(candidate, onAddIceCandidateSuccess,
          onAddIceCandidateFailure);
      } else {
        L.Logger.debug('Cache remote ice candidates.');
        if (!peer.remoteIceCandidates) {
          peer.remoteIceCandidates = [];
        }
        peer.remoteIceCandidates.push(candidate);
      }
    }
  };

  var onOffer = function(peer, event) {
    if (!peer) {
      L.Logger.debug('"peer" cannot be null or undefined');
      return;
    }

    switch (peer.state) {
      case PeerState.OFFERED:
      case PeerState.MATCHED:
        peer.state = PeerState.CONNECTING;
        createPeerConnection(peer); /*jshint ignore:line*/ //Expected a break before case.
      case PeerState.CONNECTING:
      case PeerState.CONNECTED:
        L.Logger.debug('About to set remote description. Signaling state: ' +
          peer.connection.signalingState);
        var sessionDescription = new RTCSessionDescription(event.message);
        sessionDescription.sdp = setRtpSenderOptions(sessionDescription.sdp);
        peer.connection.setRemoteDescription(sessionDescription, function() {
          createAndSendAnswer(peer);
          drainIceCandidates(peer);
        }, function(errorMessage) {
          L.Logger.debug('Set remote description failed. Message: ' +
            JSON.stringify(errorMessage));
        });
        break;
      default:
        L.Logger.debug('Unexpected peer state: ' + peer.state);
    }
  };

  var onAnswer = function(peer, event) {
    if (peer && (peer.state === PeerState.CONNECTING || peer.state ===
        PeerState.CONNECTED)) {
      L.Logger.debug('About to set remote description. Signaling state: ' +
        peer.connection.signalingState);
      var sessionDescription = new RTCSessionDescription(event.message);
      sessionDescription.sdp = setRtpSenderOptions(sessionDescription.sdp);
      peer.connection.setRemoteDescription(new RTCSessionDescription(
          sessionDescription),
        function() {
          L.Logger.debug('Set remote descripiton successfully.');
          drainIceCandidates(peer);
          drainPendingMessages(peer);
        },
        function(errorMessage) {
          L.Logger.debug('Set remote description failed. Message: ' +
            errorMessage);
        });
    }
  };

  var createRemoteStream = function(mediaStream, peer) {
    var type = streams[mediaStream.id];
    if (!type) {
      return null;
    } else {
      var streamSpec = {};
      if (type === 'screen') {
        streamSpec.video = {
          device: 'screen'
        };
      } else {
        streamSpec.video = mediaStream.getVideoTracks().length > 0 ? {
          device: 'camera'
        } : false;
        streamSpec.audio = mediaStream.getAudioTracks().length > 0;
      }
      var stream = new Woogeen.RemoteStream(streamSpec);
      stream.mediaStream = mediaStream;
      stream.from = peer.id;
      stream.id = function() {
        return mediaStream.id;
      };
      return stream;
    }
  };

  var onRemoteStreamAdded = function(peer, event) {
    L.Logger.debug('Remote stream added.');
    var stream = createRemoteStream(event.stream, peer);
    if (stream) {
      var streamEvent = new Woogeen.StreamEvent({
        type: 'stream-added',
        senderId: peer.id,
        stream: stream
      });
      that.dispatchEvent(streamEvent);
    }
  };

  var onRemoteStreamRemoved = function(peer, event) {
    L.Logger.debug('Remote stream removed.');
    var stream = createRemoteStream(event.stream, peer);
    if (stream) {
      var streamEvent = new Woogeen.StreamEvent({
        type: 'stream-removed',
        stream: stream
      });
      that.dispatchEvent(streamEvent);
    }
  };

  var SignalingMessageHandler = function(peer, message) {
    L.Logger.debug('S->C: ' + JSON.stringify(message));
    if (message.type === 'offer') {
      onOffer(peer, {
        message: message
      });
    } else if (message.type === 'answer') {
      onAnswer(peer, {
        message: message
      });
    } else if (message.type === 'candidates') {
      onRemoteIceCandidate(peer, {
        message: message
      });
    }
  };

  var onIceConnectionStateChange = function(peer, event) { /*jshint ignore:line*/ //event is unused.
    if (peer) {
      L.Logger.debug('Ice connection state changed. State: ' + peer.connection
        .iceConnectionState);
      if ((peer.connection.iceConnectionState === 'closed' || peer.connection
          .iceConnectionState === 'failed') && peer.state === PeerState.CONNECTED) {
        stopChatLocally(peer, peer.id);
        if (gab) {
          gab.sendChatStopped(peer.id);
        }
        delete peers[peer.id];
      }
      if (peer.connection.iceConnectionState === 'connected' || peer.connection
        .iceConnectionState === 'completed') {
        peer.lastDisconnect = (new Date('2099/12/31')).getTime();
        if (peer.state !== PeerState.CONNECTED) {
          peer.state = PeerState.CONNECTED;
          that.dispatchEvent(new Woogeen.ChatEvent({
            type: 'chat-started',
            peerId: peer.id
          }));
        }
      }
      if (peer.connection.iceConnectionState === 'checking') {
        peer.lastDisconnect = (new Date('2099/12/31')).getTime();
      }
      if (peer.connection.iceConnectionState === 'disconnected') {
        peer.lastDisconnect = (new Date()).getTime();
        setTimeout(function() {
          if ((new Date()).getTime() - peer.lastDisconnect >=
            pcDisconnectTimeout) {
            L.Logger.debug('Disconnect timeout.');
            stopChatLocally(peer, peer.id);
            // peers[peer.id] may be a new instance, we only want to delete the old one from peer list.
            if (peer === peers[peer.id]) {
              delete peers[peer.id];
            }
          }
        }, pcDisconnectTimeout);
      }
    }
  };

  var onAddIceCandidateSuccess = function() {
    L.Logger.debug('Add ice candidate success.');
  };

  var onAddIceCandidateFailure = function(error) {
    L.Logger.debug('Add ice candidate failed. Error: ' + error);
  };

  var onSignalingStateChange = function(peer) {
    L.Logger.debug('Signaling state changed: ' + peer.connection.signalingState);
    if (peer.connection.signalingState === 'closed') {
      stopChatLocally(peer, peer.id);
      delete peers[peer.id];
    } else if (peer.connection.signalingState === 'stable') {
      changeNegotiationState(peer, NegotiationState.READY);
      if (peer.isCaller && peer.isNegotiationNeeded && gab) {
        doRenegotiate(peer);
      } else {
        drainPendingStreams(peer);
      }
    }
  };

  // Return true if create PeerConnection successfully.
  var createPeerConnection = function(peer) {
    if (!peer || peer.connection) {
      return true;
    }
    try {
      peer.connection = new RTCPeerConnection(config, pcConstraints); /*jshint ignore:line*/
      peer.connection.onicecandidate = function(event) {
        onLocalIceCandidate(peer, event);
      };
      peer.connection.onaddstream = function(event) {
        onRemoteStreamAdded(peer, event);
      };
      peer.connection.onremovestream = function(event) {
        onRemoteStreamRemoved(peer, event);
      };
      peer.connection.oniceconnectionstatechange = function(event) {
        onIceConnectionStateChange(peer, event);
      };
      peer.connection.onnegotiationneeded = function() {
        onNegotiationneeded(peers[peer.id]);
      };
      peer.connection.onsignalingstatechange = function() {
        onSignalingStateChange(peer);
      };
      //DataChannel
      peer.connection.ondatachannel = function(event) {
        L.Logger.debug(myId + ': On data channel');
        // Save remote created data channel.
        if (!peer.dataChannels[event.channel.label]) {
          peer.dataChannels[event.channel.label] = event.channel;
          L.Logger.debug('Save remote created data channel.');
        }
        bindEventsToDataChannel(event.channel, peer);
      };
    } catch (e) {
      L.Logger.debug('Failed to create PeerConnection, exception: ' + e.message);
      return false;
    }
    return true;
  };

  var unbindEvetsToPeerConnection = function(pc) {
    pc.onicecandidate = undefined;
    pc.onaddstream = undefined;
    pc.onremovestream = undefined;
    pc.oniceconnectionstatechange = undefined;
    pc.onnegotiationneeded = undefined;
    pc.onsignalingstatechange = undefined;
  };

  var bindEventsToDataChannel = function(channel, peer) {
    channel.onmessage = function(event) {
      onDataChannelMessage(peer, event);
    };
    channel.onopen = function(event) {
      onDataChannelOpen(peer, event);
    };
    channel.onclose = function(event) {
      onDataChannelClose(peer, event);
    };
    channel.onerror = function(error) {
      L.Logger.debug("Data Channel Error:", error);
    };
  };

  var createDataChannel = function(targetId, label) {
    if (!label) {
      label = DataChannelLabel.MESSAGE;
    }
    doCreateDataChannel(getPeerId(targetId), label);
  };

  var doCreateDataChannel = function(peerId, label) {
    var peer = peers[peerId];
    // If a data channel with specified label already existed, then send data by it.
    if (peer && !peer.dataChannels[label]) {
      L.Logger.debug('Do create data channel.');
      try {
        var dc = peer.connection.createDataChannel(label, dataConstraints);
        bindEventsToDataChannel(dc, peer);
        peer.dataChannels[DataChannelLabel.MESSAGE] = dc;
      } catch (e) {
        L.Logger.error('Failed to create SendDataChannel, exception: ' + e.message);
      }
    }
  };

  // Do renegotiate when remote client allowed
  var doRenegotiate = function(peer) {
    L.Logger.debug('Do renegotiation.');
    createAndSendOffer(peer);
  };

  var createPeer = function(peerId) {
    if (!peers[peerId]) {
      // Default value for |lastDisconnect| makes sure now-|lastDisconnect| < 0.
      // Default value for |isCaller| is true, it will be changed to false when send acceptance. If both sides send invitation at the same time, one side will send acceptance and change |isCaller| to false. This is handled in |chatInvitationHandler|.
      peers[peerId] = {
        state: PeerState.READY,
        id: peerId,
        pendingStreams: [],
        pendingUnpublishStreams: [],
        remoteIceCandidates: [],
        dataChannels: {},
        pendingMessages: [],
        negotiationState: NegotiationState.READY,
        lastDisconnect: (new Date('2099/12/31')).getTime(),
        publishedStreams: [],
        isCaller: true,
        remoteSideSupportsRemoveStream: false,
        remoteSideSupportsPlanB: false,
        remoteSideSupportsUnifiedPlan: false
      };
    }
    return peers[peerId];
  };

  var negotiationNeededHandler = function(peerId) {
    var peer = peers[peerId];
    L.Logger.debug(myId + ': Remote side needs negotiation.');
    if (peer) {
      if (peer.isCaller && peer.connection.signalingState === 'stable' &&
        peer.negotiationState === NegotiationState.READY) {
        doRenegotiate(peer);
      } else {
        peer.isNegotiationNeeded = true;
        L.Logger.error(
          'Should not receive negotiation needed request because user is callee.'
        );
      }
    }
  };

  /**
     * @function connect
     * @instance
     * @desc This function establishes a connection to the signaling server.
     * @memberOf Woogeen.PeerClient
     * @param {object} loginInfo  An objects contains login information. For peer server, this object has two properties: host and token. Please make sure the host is correct.
     * @example
  <script type="text/JavaScript">
  var p2p=new Woogeen.PeerClient();
  p2p.connect({host:'http://example.com:8095/',token:'user1'});
  </script>
  */
  var connect = function(loginInfo, successCallback, failureCallback) {
    if (state === ConnectionState.READY) {
      state = ConnectionState.CONNECTING;
    } else {
      L.Logger.warning('Another peer has already connected');
      if (failureCallback) {
        failureCallback(Woogeen.Error.P2P_CLIENT_INVALID_STATE);
      }
      return;
    }
    gab = new Gab(loginInfo);
    gab.onConnected = connectedHandler;
    gab.onDisconnected = disconnectedHandler;
    gab.onConnectFailed = connectFailedHandler;
    gab.onChatStopped = chatStoppedHandler;
    gab.onChatAccepted = chatAcceptedHandler;
    gab.onChatDenied = chatDeniedHandler;
    gab.onChatInvitation = chatInvitationHandler;
    gab.onChatSignal = chatSignalHandler;
    gab.onStreamType = streamTypeHandler;
    gab.onNegotiationNeeded = negotiationNeededHandler;
    gab.onAuthenticated = authenticatedHandler;
    gab.onForceDisconnect = forceDisconnectHandler;
    gab.connect(loginInfo, successCallback, failureCallback);
    /* After we merge p2p and conf sdk, this creation should be removed
        if(window.navigator.appVersion.indexOf("Trident") > -1){
          var plugin = document.getElementById("WebRTC.ActiveX");
          if(!plugin){
            plugin = document.createElement("OBJECT");
            plugin.setAttribute("ID", "WebRTC.ActiveX");
            plugin.setAttribute("height", "0");
            plugin.setAttribute("width", "0");
            plugin.setAttribute("CLASSID", "CLSID:1D117433-FD6F-48D2-BF76-26E2DC5390FC");
            document.body.appendChild(plugin);
          }
        }
    */
  };

  /**
   * @function disconnect
   *@instance
   * @desc This function disconnects from the peer server.
   * @memberOf Woogeen.PeerClient
   * @param {function} successCallback callback function to be invoked if connection is disconnected.
   * @param {function} failureCallback callback function to be invoked if error occurred. Paramter: error.
   * @example
<script type="text/JavaScript">
var p2p=new Woogeen.PeerClient();
p2p.connect({host:'http://example.com:8095/',token:'user1'});
p2p.disconnect();
</script>
*/
  var disconnect = function(successCallback, failureCallback) {
    if (!isConnectedToSignalingChannel) {
      if (failureCallback) {
        failureCallback(Woogeen.Error.P2P_CLIENT_INVALID_STATE);
      }
      return;
    }
    stop();
    if (gab) {
      gab.finalize();
    }
    gab = null;
    if (successCallback) {
      successCallback();
    }
  };

  /**
     * @function invite
     *@instance
     * @desc This function invites a remote client to establish a connection for chatting.
     * @memberOf Woogeen.PeerClient
     * @param {string} peerId Remote user's ID.
     * @param {function} successCallback callback function to be invoked if invitation is sent.
     * @param {function} failureCallback callback function to be invoked if error occurred. Paramter: error.
     * @example
  <script type="text/JavaScript">
  var p2p=new Woogeen.PeerClient();
  p2p.connect({host:'http://example.com:8095/',token:'user1'});
  p2p.invite('user2');
  </script>
  */
  var invite = function(peerId, successCallback, failureCallback) {
    if (!gab) {
      if (failureCallback) {
        failureCallback(Woogeen.Error.P2P_CONN_CLIENT_NOT_INITIALIZED);
      }
      return;
    }
    if (peerId === myId) {
      if (failureCallback) {
        failureCallback(Woogeen.Error.P2P_CLIENT_ILLEGAL_ARGUMENT);
      }
      return;
    }
    if (!peers[peerId]) {
      createPeer(peerId);
    }
    var peer = peers[peerId];
    if (peer.state === PeerState.READY || peer.state === PeerState.OFFERED) {
      L.Logger.debug('Send invitation to ' + peerId);
      peer.state = PeerState.OFFERED;
      gab.sendChatInvitation(peerId, sysInfo, function() {
        if (successCallback) {
          successCallback();
        }
      }, function(err) {
        peer.state = PeerState.READY;
        if (failureCallback) {
          failureCallback(Woogeen.Error.getErrorByCode(err));
        }
      });
    } else {
      L.Logger.debug('Invalid state. Will not send invitation.');
      if (failureCallback) {
        failureCallback(Woogeen.Error.P2P_CLIENT_INVALID_STATE);
      }
    }
  };
  /**
     * @function inviteWithStream
     * @instance
     * @desc This function invites a remote client to establish a connection for chatting. The stream will be published as soon as the connection is established.<br><b>Remarks:</b><br>This method is intended to be used with Firefox. Please avoid using this method if your application only runs on Chrome.
     * @memberOf Woogeen.PeerClient
     * @private
     * @param {string} peerId Remote user's ID.
     * @param {stream} stream Stream to be published. An instance of Woogeen.Stream.
     * @param {function} successCallback callback function to be invoked if invitation is sent.
     * @param {function} failureCallback callback function to be invoked if error occurred. Paramter: error.
     * @example
  <script type="text/JavaScript">
  var p2p=new Woogeen.PeerClient();
  p2p.connect({host:'http://example.com:8095/',token:'user1'});
  p2p.inviteWithStream('user2',localStream);
  </script>
  */
  var inviteWithStream = function(peerId, stream, successCallback,
    failureCallback) {
    invite(peerId, function() {
      publish(stream, peerId);
    }, failureCallback);
  };

  /**
     * @function accept
     * @instance
     * @desc This function accepts a remote client to establish a connection for chatting.<br><b>Remarks:</b><br>This method is intended to be used with Firefox. Please avoid using this method if your application only runs on Chrome.
     * @memberOf Woogeen.PeerClient
     * @param {string} peerId Remote user's ID.
     * @param {function} successCallback callback function to be invoked if acceptance is sent to server successfully.
     * @param {function} failureCallback callback function to be invoked if error occurred. Paramter: error.
     * @example
  <script type="text/JavaScript">
  var p2p=new Woogeen.PeerClient();
  p2p.connect({host:'http://example.com:8095/',token:'user1'});
  p2p.addEventListener('chat-invited',function(e){
   p2p.accept(e.senderId);
  };
  </script>
  */
  var accept = function(peerId, successCallback, failureCallback) {
    if (!gab && failureCallback) {
      failureCallback(Woogeen.Error.P2P_CONN_CLIENT_NOT_INITIALIZED);
    }
    if (!peers[peerId]) {
      createPeer(peerId);
    }
    var peer = peers[peerId];
    peer.isCaller = false;
    if (peer.state === PeerState.PENDING) {
      peer.state = PeerState.MATCHED;
      gab.sendChatAccepted(peerId, sysInfo, successCallback, function(
        errCode) {
        peer.state = PeerState.PENDING;
        if (failureCallback) {
          failureCallback(Woogeen.Error.getErrorByCode(errCode));
        }
      });
    } else {
      L.Logger.debug('Invalid state. Will not send acceptance.');
      if (failureCallback) {
        failureCallback(Woogeen.Error.P2P_CLIENT_INVALID_STATE);
      }
    }
  };
  /**
     * @function acceptWithStream
     * @instance
     * @desc This function accepts a remote client to establish a connection for chatting. The stream will be published as soon as the connection is established.<br><b>Remarks:</b><br> This API is aimed to compatable with ealier version of FireFox which doesn't support renegotiation. It may be removed once FireFox supports renegotiation well.
     * @memberOf Woogeen.PeerClient
     * @private
     * @param {string} peerId Remote user's ID.
     * @param {stream} stream Stream to be published.An instance of Woogeen.Stream.
     * @param {function} successCallback callback function to be invoked if acceptance is sent to remote user.
     * @param {function} failureCallback callback function to be invoked if error occurred. Paramter: error.
     * @example
  <script type="text/JavaScript">
  var p2p=new Woogeen.PeerClient();
  p2p.connect({host:'http://example.com:8095/',token:'user1'});
  p2p.addEventListener('chat-invited',function(e){
   p2p.acceptWithStream(e.senderId, localStream);
  };
  </script>
  */
  var acceptWithStream = function(peerId, stream, successCallback,
    failureCallback) {
    accept(peerId, function() {
      publish(stream, peerId);
    }, failureCallback);
  };

  var createAndSendOffer = function(peer) {
    if (!peer.connection) {
      L.Logger.error('Peer connection have not been created.');
      return;
    }
    if (peer.connection.signalingState !== 'stable') {
      changeNegotiationState(peer, NegotiationState.NEGOTIATING);
      return;
    }
    drainPendingStreams(peer);
    peer.isNegotiationNeeded = false;
    peer.connection.createOffer(function(desc) {
      desc.sdp = setRtpReceiverOptions(desc.sdp, peer);
      peer.connection.setLocalDescription(desc, function() {
        L.Logger.debug('Set local descripiton successfully.');
        changeNegotiationState(peer, NegotiationState.READY);
        if (gab) {
          gab.sendSignalMessage(peer.id, desc);
        }
      }, function(errorMessage) {
        L.Logger.debug('Set local description failed. Message: ' +
          JSON.stringify(errorMessage));
      });
    }, function(error) {
      L.Logger.debug('Create offer failed. Error info: ' + JSON.stringify(
        error));
    }, sdpConstraints);
  };

  var drainIceCandidates = function(peer) {
    if (peer && peer.connection && peer.remoteIceCandidates && peer.remoteIceCandidates
      .length !== 0) {
      for (var i = 0; i < peer.remoteIceCandidates.length; i++) {
        L.Logger.debug("remoteIce, length:" + remoteIceCandidates.length +
          ", current:" + i);
        if (peer.state === PeerState.CONNECTED || peer.state === PeerState.CONNECTING) {
          peer.connection.addIceCandidate(remoteIceCandidates[i],
            onAddIceCandidateSuccess, onAddIceCandidateFailure);
        }
      }
      peer.remoteIceCandidates = [];
    }
  };

  var drainPendingStreams = function(peer) {
    L.Logger.debug('Draining pending streams.');
    if (peer.connection) {
      L.Logger.debug(
        'Peer connection is ready for draining pending streams.');
      for (var i = 0; i < peer.pendingStreams.length; i++) {
        var stream = peer.pendingStreams[i];
        // OnNegotiationNeeded event will be triggered immediately after adding stream to PeerConnection in FireFox.
        // And OnNegotiationNeeded handler will execute drainPendingStreams. To avoid add the same stream multiple times,
        // shift it from pending stream list before adding it to PeerConnection.
        peer.pendingStreams.shift();
        if (!stream.mediaStream) { // The stream has been closed. Skip it.
          continue;
        }
        bindStreamAndPeer(stream, peer);
        if (!stream.onClose) {
          stream.onClose = function() {
            onLocalStreamEnded(stream);
          }; /*jshint ignore:line*/ //Function within a loop.
        }
        peer.connection.addStream(stream.mediaStream);
        L.Logger.debug('Added stream to peer connection.');
        sendStreamType(stream, peer);
        L.Logger.debug('Sent stream type.');
      }
      peer.pendingStreams = [];
      for (var j = 0; j < peer.pendingUnpublishStreams.length; j++) {
        if (!peer.pendingUnpublishStreams[j].mediaStream) {
          continue;
        }
        peer.connection.removeStream(peer.pendingUnpublishStreams[j].mediaStream);
        L.Logger.debug('Remove stream.');
      }
      peer.pendingUnpublishStreams = [];
    }
  };

  var drainPendingMessages = function(peer) {
    L.Logger.debug('Draining pendding messages.');
    var dc = peer.dataChannels[DataChannelLabel.MESSAGE];
    if (dc && dc.readyState !== 'closed') {
      for (var i = 0; i < peer.pendingMessages.length; i++) {
        dc.send(peer.pendingMessages[i]);
      }
      peer.pendingMessages = [];
    }
  };

  var bindStreamAndPeer = function(stream, peer) {
    var streamId = stream.id();
    if (!streamPeers[streamId]) {
      streamPeers[streamId] = [];
    }
    streamPeers[streamId].push(peer.id);
  };

  var createAndSendAnswer = function(peer) {
    if (!peer.connection) {
      L.Logger.error('Peer connection have not been created.');
      return;
    }
    drainPendingStreams(peer);
    peer.isNegotiationNeeded = false;
    peer.connection.createAnswer(function(desc) {
      desc.sdp = setRtpReceiverOptions(desc.sdp, peer);
      peer.connection.setLocalDescription(desc, function() {
        L.Logger.debug("Set local description successfully.");
        if (gab) {
          gab.sendSignalMessage(peer.id, desc);
        }
        L.Logger.debug('Sent answer.');
      }, function(errorMessage) {
        L.Logger.error(
          "Error occurred while setting local description. Error message:" +
          errorMessage);
      });
    }, function(error) {
      L.Logger.error('Create answer failed. Message: ' + error);
    });
  };

  /**
   * @function addStreamToRoom
   * @instance
   * @desc Add a stream or streams to a room
   * @private
   * @param {array} streams A Woogeen.Stream or an array of Woogeen.Stream.
   * @param {string} roomId Room ID.
   */
  var addStreamToRoom = function(streams, roomId) { /*jshint ignore:line*/ //addStreamToRoom is defined but never used.
    if (!streams || !roomId) {
      return;
    }
    if (!roomStreams[roomId]) {
      roomStreams[roomId] = [];
    }
    var streamsInRoom = roomStreams[roomId];
    if (isArray(streams)) {
      streamsInRoom = streamsInRoom.concat(streams);
    } else {
      streamsInRoom.push(streams);
    }
  };

  /**
   * @function deleteStreamFromRoom
   * @instance
   * @desc Delete a stream froom a room
   * @private
   * @param {Woogeen.Stream} stream An instance of Woogeen.Stream
   * @param {string} roomId Room ID
   */
  var deleteStreamFromRoom = function(stream, roomId) { /*jshint ignore:line*/ //deleteStreamFromRoom is defined but never used.
    if (!stream || !roomId) {
      return;
    }
    if (!roomStreams[roomId]) {
      return;
    }
    var savedStreams = roomStreams[roomId];
    for (var i = 0; i < savedStreams.length; i++) {
      if (stream.getID() === savedStreams[i].getID()) {
        savedStreams.splice(i, 1);
        break;
      }
    }
  };

  var contains = function(arr, obj) {
    for (var i = 0; i < arr.length; i++) {
      if (arr[i] === obj) {
        return i;
      }
    }
    return -1;
  };
  /**
     * @function publish
     * @instance
     * @desc This function publishes the local stream to the remote client.<br><b>Remarks:</b><br>This function should be called after invite or joinRoom. Streams in publish queue will be added in remote side soon.
     * @memberOf Woogeen.PeerClient
     * @param {stream} stream Local stream. An instance of Woogeen.Stream.
     * @param {string} targetId Remote peer's ID or roomToken.
     * @param {function} successCallback callback function to be invoked if stream is added.
     * @param {function} failureCallback callback function to be invoked if error occurred.
     * @example
  <script type="text/JavaScript">
  var p2p=new Woogeen.PeerClient();
  p2p.connect({host:'http://example.com:8095/',token:'user1'});
  p2p.invite('user2');
  p2p.publish(localStream,'user1');
  </script>
  */
  var publish = function(stream, targetId, successCallback, failureCallback) {
    if (!(stream instanceof Woogeen.LocalStream && stream.mediaStream) || !
      targetId) {
      if (failureCallback) {
        failureCallback(Woogeen.Error.P2P_CLIENT_ILLEGAL_ARGUMENT);
      }
      return;
    }
    doPublish(stream, targetId, successCallback, failureCallback);
  };

  /**
   * @function doPublish
   * @instance
   * @desc Publish stream to peer
   * @private
   * @param {stream} stream Local stream. A instance of Woogeen.Stream.
   * @param {string} targetId Remote peer's ID or roomToken.
   */
  var doPublish = function(streams, targetId, successCallback,
    failureCallback) {
    L.Logger.debug('Publish to: ' + targetId);

    var peerId = getPeerId(targetId);
    if (!peerId) {
      if (failureCallback) {
        failureCallback(Woogeen.Error.P2P_CLIENT_ILLEGAL_ARGUMENT);
      }
      return;
    }

    if (!peers[peerId]) {
      createPeer(peerId);
    }
    var peer = peers[peerId];

    var multipleStreams = (peer.publishedStreams.length + peer.pendingStreams
      .length > 0);
    var sameMultipleMediaSourcesPlan = ((peer.remoteSideSupportsUnifiedPlan &&
        supportsUnifiedPlan) || peer.remoteSideSupportsPlanB &&
      supportsPlanB);
    if (multipleStreams && !sameMultipleMediaSourcesPlan) {
      L.Logger.warning(
        'Cannot publish more than one streams if local and remote use different multiple media sources plan.'
      );
      if (failureCallback) {
        failureCallback(Woogeen.Error.P2P_CLIENT_UNSUPPORTED_METHOD);
      }
      return;
    }

    // Check peer state
    switch (peer.state) {
      case PeerState.OFFERED:
      case PeerState.MATCHED:
      case PeerState.CONNECTING:
      case PeerState.CONNECTED:
        break;
      default:
        L.Logger.warning('Cannot publish stream in this state: ' + peer.state);
        if (failureCallback) {
          failureCallback(Woogeen.Error.P2P_CLIENT_INVALID_STATE);
        }
        return;
    }
    // Publish stream or streams
    if (contains(peer.publishedStreams, streams) > -1) {
      if (failureCallback) {
        failureCallback("The stream has been published.");
      }
      return;
    } else {
      peer.publishedStreams.push(streams);
    }
    if (isArray(streams)) {
      peer.pendingStreams = peer.pendingStreams.concat(streams);
    } else if (streams) {
      peer.pendingStreams.push(streams);
    }
    switch (peer.state) {
      case PeerState.CONNECTING:
      case PeerState.CONNECTED:
        if (peer.pendingStreams.length > 0) {
          drainPendingStreams(peer);
        }
        break;
      default:
        L.Logger.debug('Unexpected peer state: ' + peer.state);
        if (failureCallback) {
          failureCallback(Woogeen.Error.P2P_CLIENT_INVALID_STATE);
        }
        return;
    }
    if (successCallback) {
      successCallback();
    }
  };

  /**
     * @function unpublish
     * @instance
     * @desc This function revokes a local stream's publish.<br><b>Remarks:</b><br>This stream will be removed on remote side if unpublish successfully.
     * @memberOf Woogeen.PeerClient
     * @param {stream} stream Local stream. An instance of Woogeen.Stream.
     * @param {string} targetId Remote Peer's ID.
     * @param {function} successCallback callback function to be invoked if stream is unpublished.
     * @param {function} failureCallback callback function to be invoked if error occurred.
     * @example
  <script type="text/JavaScript">
  var p2p=new Woogeen.PeerClient();
  p2p.connect({host:'http://example.com:8095/',token:'user1'});
  p2p.invite('user2');
  p2p.publish(localStream,'user1');
  p2p.unpublish(localStream,'user1');
  </script>
  */
  var unpublish = function(stream, targetId, successCallback, failureCallback) {
    L.Logger.debug('Unpublish stream.');
    if (!(stream instanceof Woogeen.LocalStream)) {
      L.Logger.warning('Invalid argument stream');
      if (failureCallback) {
        failureCallback(Woogeen.Error.P2P_CLIENT_ILLEGAL_ARGUMENT);
      }
      return;
    }

    var peerId = getPeerId(targetId);
    if (!peerId) {
      if (failureCallback) {
        L.Logger.warning('Invalid argument targetId');
        failureCallback(Woogeen.Error.P2P_CLIENT_ILLEGAL_ARGUMENT);
      }
      return;
    }

    if (!peers[peerId] || contains(peers[peerId].publishedStreams, stream) <
      0) {
      if (failureCallback) {
        failureCallback(Woogeen.Error.P2P_CLIENT_ILLEGAL_ARGUMENT);
      }
      return;
    }
    var peer = peers[peerId];
    if (navigator.mozGetUserMedia || !peer.remoteSideSupportsRemoveStream) {
      L.Logger.error('Unpublish is not supported on FireFox.');
      if (failureCallback) {
        failureCallback(Woogeen.Error.P2P_CLIENT_UNSUPPORTED_METHOD);
      }
      return;
    }
    var i = contains(peer.publishedStreams, stream);
    peer.publishedStreams.splice(i, 1);
    peer.pendingUnpublishStreams.push(stream);
    if (peer.state === PeerState.CONNECTED) {
      drainPendingStreams(peer);
    }
    if (successCallback) {
      successCallback();
    }
  };

  /**
   * @function sendStreamType
   * @instance
   * @desc Send video type to remote clientInformation
   * @memberOf Woogeen.PeerClient
   * @private
   * @param {stream} stream Local stream. A instance of Woogeen.Stream.
   */
  var sendStreamType = function(stream, peer) {
    if (stream !== null) {
      var type = 'audio';
      if (stream.isScreen()) {
        type = 'screen';
        stream.hide = function() { // bind hide() because hide() is invoked before dispose mediaStream.
          L.Logger.debug('Unpublish screen sharing.');
          unpublish(stream, peer.id);
        };
      } else if (stream.hasVideo()) {
        type = 'video';
      }
      if (gab) {
        gab.sendStreamType(peer.id, {
          streamId: stream.mediaStream.id,
          type: type
        });
      }
    }
  };
  /**
     * @function deny
     * @instance
     * @desc This function denies a remote client's invitation.
     * @memberOf Woogeen.PeerClient
     * @param {string} uid Remote user's ID.
     * @param {function} successCallback callback function to be invoked if server received deny message.
     * @param {function} failureCallback callback function to be invoked if error occurred. Parameter: error.
     * @example
  <script type="text/JavaScript">
  var p2p=new Woogeen.PeerClient();
  p2p.connect({host:'http://example.com:8095/',token:'user1'});
  p2p.deny('user2');
  </script>
  */
  var deny = function(peerId, successCallback, failureCallback) {
    if (peers[peerId] && peers[peerId].state === PeerState.PENDING) {
      if (!gab && failureCallback) {
        failureCallback(Woogeen.Error.P2P_CONN_CLIENT_NOT_INITIALIZED);
        return;
      }
      gab.sendChatDenied(peerId, successCallback, function(errCode) {
        if (failureCallback) {
          failureCallback(Woogeen.Error.getErrorByCode(errCode));
        }
      });
      delete peers[peerId];
    } else {
      if (failureCallback) {
        failureCallback(Woogeen.Error.P2P_CLIENT_INVALID_STATE);
      }
    }
  };

  /**
     * @function stop
     * @instance
     * @desc This function stops the connection with specified remote user. <br><b>Remarks:</b><br> If peerId is unspecified, it will stop all P2P connections.
     * @memberOf Woogeen.PeerClient
     * @param {string} uid Remote user's ID.
     * @param {function} successCallback callback function to be invoked if the session is stopped.
     * @param {function} failureCallback callback function to be invoked if error occurred. Parameter: error.
     * @example
  <script type="text/JavaScript">
  p2p.stop();
  </script>
  */
  var stop = function(peerId, successCallback, failureCallback) {
    if (!gab) {
      if (failureCallback) {
        failureCallback(Woogeen.Error.P2P_CONN_CLIENT_NOT_INITIALIZED);
      }
      return;
    }
    if (peerId) { // Stop chat with peerId
      var peer = peers[peerId];
      if (!peer) {
        if (failureCallback) {
          L.Logger.warning('Invalid target ID for stopping chat.');
          failureCallback(Woogeen.Error.P2P_CLIENT_ILLEGAL_ARGUMENT);
        }
        return;
      }
      gab.sendChatStopped(peer.id);
      stopChatLocally(peer, myId);
      delete peers[peerId];
    } else { // Stop all chats
      var isEmpty = true;
      for (var peerIndex in peers) {
        isEmpty = false;
        var peer_all = peers[peerIndex];
        gab.sendChatStopped(peer_all.id);
        stopChatLocally(peer_all, myId);
        delete peers[peer_all.id];
      }
      if (isEmpty) {
        if (failureCallback) {
          L.Logger.warning('No active connections can be stopped.');
          failureCallback(Woogeen.Error.P2P_CLIENT_INVALID_STATE);
        }
        return;
      }
    }
    if (successCallback) {
      successCallback();
    }
  };

  var stopChat = function(chatId, successCallback, failureCallback) { /*jshint ignore:line*/ //stopChat is defined but never used.
    var chat = chats[chatId];
    if (chat) {
      var peer = chat.peer;
      stop(peer.id);
      if (!gab) {
        if (failureCallback) {
          failureCallback(Woogeen.Error.P2P_CONN_CLIENT_NOT_INITIALIZED);
        }
        return;
      }
      gab.sendLeaveRoom(chatId);
      delete chats[chatId];
    }
    if (successCallback) {
      successCallback();
    }
  };

  /**
     * @function getConnectionStats
     * @instance
     * @desc This function returns connection statistics to a remote client. Unsupported statistics in firefox return -1 or "". More details about [connection status](@ref status).
     * @memberOf Woogeen.PeerClient
     * @param {string} targetId Remote user's ID.
     * @param {function} successCallback callback function to be invoked when statistics is available
     * @param {function} failureCallback callback function to be invoked when statistics is not available
     * @example
  <script type="text/JavaScript">
  var successcallback=function(stats){
    console.log("stats:"+JSON.stringify(stats));
  }
  var failurecallback=function(msg){
    console.log("error getting stats:"+msg);
  }
  p2p.getConnectionStats($('#target-uid').val(), successcallback, failurecallback);
  </script>
  */
  var getConnectionStats = function(targetId, successCallback,
    failureCallback) {
    var peerId = getPeerId(targetId);
    var peer = peers[peerId];
    if (!peer || (!peer.connection) || (peer.state !== PeerState.CONNECTED)) {
      if (failureCallback) {
        failureCallback("failed to get peerconnection statistics");
      }
      return;
    }
    if (!successCallback) {
      // If user doesn't provide a success callback, no reason to getStats().
      return;
    }
    peer.connection.getStats(null, function(stats) {
      if (window.navigator.appVersion.indexOf("Trident") > -1) {
        successCallback(stats);
      } else {
        successCallback(Woogeen.Common.parseStats(stats));
      }
    }, function(err) {
      if (failureCallback) {
        failureCallback(err);
      }
    });
  };

  /**
     * @function getAudioLevels
     * @instance
     * @desc This function returns audio output levels associated with current client. It is not supported on Firefox. More details about [audio levels](@ref audiolevel).
     * @memberOf Woogeen.PeerClient
     * @param {string} targetId Remote user's ID.
     * @param {function} successCallback callback function to be invoked when audio level information is available.
     * @param {funciton} failureCallback callback function to be invoked when fail to get the audio level information.
     * @example
  <script type="text/JavaScript">
  var successcallback=function(levels){
    console.log("current level"+JSON.stringify(levels));
  }
  var failurecallback=function(msg){
    console.log("error getting audio levels:"+msg);
  }
  p2p.getAudioLevels($('#target-uid').val(), successcallback, failurecallback);
  </script>
  */
  var getAudioLevels = function(targetId, successCallback, failureCallback) {
    var peerId = getPeerId(targetId);
    var peer = peers[peerId];
    if (!peer || (!peer.connection) || (peer.state !== PeerState.CONNECTED)) {
      failureCallback("Invalid peer connection status.");
    }
    if (navigator.mozGetUserMedia) {
      L.Logger.error('GetAudioLevels is not supported on FireFox.');
      if (failureCallback) {
        failureCallback(Woogeen.Error.P2P_CLIENT_UNSUPPORTED_METHOD);
      }
      return;
    }
    if (!successCallback) {
      // If user doesn't provide a success callback, no reason to getStats().
      return;
    }
    peer.connection.getStats(function(stats) {
      successCallback(Woogeen.Common.parseAudioLevel(stats));
    }, function(err) {
      if (failureCallback) {
        failureCallback(err);
      }
    });
  };

  /**
     * @function send
     * @instance
     * @desc This function sends message data to a remote client.
     * @memberOf Woogeen.PeerClient
     * @param {string} message Message to be sent to remote user.
     * @param {string} targetId Remote user's ID.
     * @param {function} successCallback callback function to be invoked if the message is sent.
     * @param {function} failureCallback callback function to be invoked if error occurred. Parameter: error.
     * @example
  <script type="text/JavaScript">
  p2p.send($('#data').val(), $('#target-uid').val());
  </script>
  */
  var send = function(message, targetId, successCallback, failureCallback) {
    if (!message) {
      L.Logger.warning("Message cannot be undefined, null or empty.");
      if (failureCallback) {
        failureCallback(Woogeen.Error.P2P_CLIENT_ILLEGAL_ARGUMENT);
      }
      return;
    }
    if (message.length > 65535) {
      L.Logger.warning("Message too long. Max size: 65535.");
      if (failureCallback) {
        failureCallback(Woogeen.Error.P2P_CLIENT_ILLEGAL_ARGUMENT);
      }
      return;
    }
    doSendData(message, getPeerId(targetId), successCallback,
      failureCallback);
  };

  //Data channel send data
  var doSendData = function(message, peerId, successCallback, failureCallback) {
    var peer = peers[peerId];
    if (!peer || peer.state !== PeerState.CONNECTED) {
      if (failureCallback) {
        L.Logger.error("Invalid peer state.");
        failureCallback(Woogeen.Error.P2P_CLIENT_INVALID_STATE);
      }
      return;
    }
    // If data channel is ready, send it. Otherwise, cache it in message queue.
    var dc = peer.dataChannels[DataChannelLabel.MESSAGE];
    if (dc && dc.readyState === 'open') {
      dc.send(message);
    } else {
      peer.pendingMessages.push(message);
      createDataChannel(peerId);
    }
    if (successCallback) {
      successCallback();
    }
  };

  //DataChannel handler.
  var onDataChannelMessage = function(peer, event) {
    var dataEvent = new Woogeen.DataEvent({
      type: 'data-received',
      senderId: peer.id,
      data: event.data
    });
    that.dispatchEvent(dataEvent);
  };

  var onDataChannelOpen = function(peer, event) {
    L.Logger.debug("Data Channel is opened");
    if (event.target.label === DataChannelLabel.MESSAGE) {
      L.Logger.debug('Data channel for messages is opened.');
      drainPendingMessages(peer);
    }
  };

  var onDataChannelClose = function(peerId) {
    L.Logger.debug('Data Channel for ' + peerId + ' is closed.');
  };

  var onLocalStreamEnded = function(stream) {
    var peerIds = streamPeers[stream.getID()];
    if (peerIds) {
      for (var i = 0; i < peerIds.length; i++) {
        unpublish(stream, peerIds[i]);
      }
    }
  };

  var setAudioMaxBW = function(sdp) {
    if (!spec.bandWidth || !spec.bandWidth.maxAudioBW) {
      return sdp;
    }
    return Woogeen.Common.setPreferredBitrate(sdp, 'audio', spec.bandWidth.maxAudioBW);
  };

  var setVideoMaxBW = function(sdp) {
    if (!spec.bandWidth || !spec.bandWidth.maxVideoBW) {
      return sdp;
    }
    return Woogeen.Common.setPreferredBitrate(sdp, 'video', spec.bandWidth.maxVideoBW);
  };

  var setRtpSenderOptions = function(sdp) {
    sdp = setAudioMaxBW(sdp);
    sdp = setVideoMaxBW(sdp);
    return sdp;
  };

  var setRtpReceiverOptions = function(sdp, peer) {
    sdp = setAudioCodec(sdp);
    sdp = setVideoCodec(sdp, peer);
    return sdp;
  };

  var setAudioCodec = function(sdp) {
    if (spec.audioCodec) {
      return sdp;
    }
    return Woogeen.Common.setPreferredCodec(sdp, 'audio', spec.audioCodec);
  };

  var setVideoCodec = function(sdp, peer) {
    var codec;
    if (navigator.mozGetUserMedia) {
      codec = 'vp8';
    } else if (peer && peer.preferredVideoCodec) {
      codec = peer.preferredVideoCodec;
    } else if (spec.videoCodec) {
      codec = spec.videoCodec;
    } else {
      return sdp;
    }
    return Woogeen.Common.setPreferredCodec(sdp, 'video', codec);
  };

  /**
   * @function getPeerConnection
   * @instance
   * @desc Get PeerConnection for a specified remote client.
   * @private
   * @param targetId peerId or roomToken.
   */
  var getPeerConnection = function(targetId) { /*jshint ignore:line*/ //getPeerConnection is defined but never used.
    var peerId = getPeerId(targetId);
    var peer = peers[peerId];
    if (!peer) {
      return null;
    }
    return peer.connection;
  };

  that.connect = connect;
  that.disconnect = disconnect;
  that.invite = invite;
  that.inviteWithStream = inviteWithStream;
  that.publish = publish;
  that.unpublish = unpublish;
  that.deny = deny;
  that.accept = accept;
  that.acceptWithStream = acceptWithStream;
  that.stop = stop;
  that.send = send;
  that.getConnectionStats = getConnectionStats;
  that.getAudioLevels = getAudioLevels;

  return that;
};



window.Erizo = Erizo;
window.Woogeen = Woogeen;
window.L = L;
}(window));


