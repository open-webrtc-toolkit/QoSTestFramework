/*
 * Intel WebRTC SDK version 3.3.0
 * Copyright (c) 2017 Intel <http://webrtc.intel.com>
 * Homepage: http://webrtc.intel.com
 */


(function(window) {


/* global window, document, webkitURL, Erizo */
/*
 * AudioPlayer represents a Licode Audio component that shows either a local or a remote Audio.
 * Ex.: var player = AudioPlayer({id: id, stream: stream, elementID: elementID});
 * A AudioPlayer is also a View component.
 */
Erizo.AudioPlayer = function(spec) {
  'use strict';

  var that = Erizo.View({}),
    onmouseover,
    onmouseout;

  // Variables

  // AudioPlayer ID
  that.id = spec.id;

  // Stream that the AudioPlayer will play
  that.stream = spec.stream.mediaStream;

  // DOM element in which the AudioPlayer will be appended
  that.elementID = spec.elementID;

  that.stream_url = (window.URL || webkitURL).createObjectURL(that.stream);

  // Audio tag
  that.audio = document.createElement('audio');
  that.audio.setAttribute('id', 'stream' + that.id);
  that.audio.setAttribute('style',
    'width: 100%; height: 100%; position: absolute');
  that.audio.setAttribute('autoplay', 'autoplay');

  if (spec.stream instanceof Woogeen.LocalStream) {
    that.audio.volume = 0;
  }

  if (that.elementID !== undefined) {

    // It will stop the AudioPlayer and remove it from the HTML
    that.destroy = function() {
      that.audio.pause();
      that.parentNode.removeChild(that.div);
    };

    onmouseover = function() {
      that.bar.display();
    };

    onmouseout = function() {
      that.bar.hide();
    };

    // Container
    that.div = document.createElement('div');
    that.div.setAttribute('id', 'player_' + that.id);
    that.div.setAttribute('style',
      'width: 100%; height: 100%; position: relative; overflow: hidden;');

    document.getElementById(that.elementID).appendChild(that.div);
    that.container = document.getElementById(that.elementID);

    that.parentNode = that.div.parentNode;

    that.div.appendChild(that.audio);

    // Bottom Bar
    that.bar = new Erizo.Bar({
      elementID: 'player_' + that.id,
      id: that.id,
      stream: spec.stream,
      media: that.audio,
      options: spec.options
    });

    that.div.onmouseover = onmouseover;
    that.div.onmouseout = onmouseout;

  } else {
    // It will stop the AudioPlayer and remove it from the HTML
    that.destroy = function() {
      that.audio.pause();
      that.parentNode.removeChild(that.audio);
    };

    document.body.appendChild(that.audio);
    that.parentNode = document.body;
  }

  that.audio.src = that.stream_url;

  return that;
};



/* global document, clearTimeout, setTimeout, Erizo */

/*
 * Bar represents the bottom menu bar of every mediaPlayer.
 * It contains a Speaker and an icon.
 * Every Bar is a View.
 * Ex.: var bar = Bar({elementID: element, id: id});
 */
Erizo.Bar = function(spec) {
  'use strict';

  var that = Erizo.View({}),
    waiting,
    show;

  // Variables

  // DOM element in which the Bar will be appended
  that.elementID = spec.elementID;

  // Bar ID
  that.id = spec.id;

  // Container
  that.div = document.createElement('div');
  that.div.setAttribute('id', 'bar_' + that.id);

  // Bottom bar
  that.bar = document.createElement('div');
  that.bar.setAttribute('style',
    'width: 100%; height: 15%; max-height: 30px; position: absolute; bottom: 0; right: 0; background-color: rgba(255,255,255,0.62)'
  );
  that.bar.setAttribute('id', 'subbar_' + that.id);

  // Private functions
  show = function(displaying) {
    if (displaying !== 'block') {
      displaying = 'none';
    } else {
      clearTimeout(waiting);
    }
    that.div.setAttribute('style',
      'width: 100%; height: 100%; position: relative; bottom: 0; right: 0; display:' +
      displaying);
  };

  // Public functions

  that.display = function() {
    show('block');
  };

  that.hide = function() {
    waiting = setTimeout(show, 1000);
  };

  document.getElementById(that.elementID).appendChild(that.div);
  that.div.appendChild(that.bar);

  // Speaker component
  if (!spec.stream.screen && (spec.options === undefined || spec.options.speaker ===
      undefined || spec.options.speaker === true)) {
    that.speaker = new Erizo.Speaker({
      elementID: 'subbar_' + that.id,
      id: that.id,
      stream: spec.stream,
      media: spec.media
    });
  }

  that.display();
  that.hide();

  return that;
};



/**
 * Copyright 2013 Marc J. Schmidt. See the LICENSE file at the top-level
 * directory of this distribution and at
 * https://github.com/marcj/css-element-queries/blob/master/LICENSE.
 */
;
(function() {

  this.L = this.L || {};

  /**
   *
   * @type {Function}
   * @constructor
   */
  this.L.ElementQueries = function() {
    /**
     *
     * @param element
     * @returns {Number}
     */
    function getEmSize(element) {
      if (!element) {
        element = document.documentElement;
      }
      var fontSize = getComputedStyle(element, 'fontSize');
      return parseFloat(fontSize) || 16;
    }

    /**
     *
     * @copyright https://github.com/Mr0grog/element-query/blob/master/LICENSE
     *
     * @param element
     * @param value
     * @param units
     * @returns {*}
     */
    function convertToPx(element, value) {
      var units = value.replace(/[0-9]*/, '');
      value = parseFloat(value);
      switch (units) {
        case "px":
          return value;
        case "em":
          return value * getEmSize(element);
        case "rem":
          return value * getEmSize();
          // Viewport units!
          // According to http://quirksmode.org/mobile/tableViewport.html
          // documentElement.clientWidth/Height gets us the most reliable info
        case "vw":
          return value * document.documentElement.clientWidth / 100;
        case "vh":
          return value * document.documentElement.clientHeight / 100;
        case "vmin":
        case "vmax":
          var vw = document.documentElement.clientWidth / 100;
          var vh = document.documentElement.clientHeight / 100;
          var chooser = Math[units === "vmin" ? "min" : "max"];
          return value * chooser(vw, vh);
        default:
          return value;
          // for now, not supporting physical units (since they are just a set number of px)
          // or ex/ch (getting accurate measurements is hard)
      }
    }

    /**
     *
     * @param {HTMLElement} element
     * @constructor
     */
    function SetupInformation(element) {
      this.element = element;
      this.options = [];
      var i, j, option, width = 0,
        height = 0,
        value, actualValue, attrValues, attrValue, attrName;

      /**
       * @param option {mode: 'min|max', property: 'width|height', value: '123px'}
       */
      this.addOption = function(option) {
        this.options.push(option);
      }

      var attributes = ['min-width', 'min-height', 'max-width',
        'max-height'
      ];

      /**
       * Extracts the computed width/height and sets to min/max- attribute.
       */
      this.call = function() {
        // extract current dimensions
        width = this.element.offsetWidth;
        height = this.element.offsetHeight;

        attrValues = {};

        for (i = 0, j = this.options.length; i < j; i++) {
          option = this.options[i];
          value = convertToPx(this.element, option.value);

          actualValue = option.property == 'width' ? width : height;
          attrName = option.mode + '-' + option.property;
          attrValue = '';

          if (option.mode == 'min' && actualValue >= value) {
            attrValue += option.value;
          }

          if (option.mode == 'max' && actualValue <= value) {
            attrValue += option.value;
          }

          if (!attrValues[attrName]) attrValues[attrName] = '';
          if (attrValue && -1 === (' ' + attrValues[attrName] + ' ').indexOf(
              ' ' + attrValue + ' ')) {
            attrValues[attrName] += ' ' + attrValue;
          }
        }

        for (var k in attributes) {
          if (attrValues[attributes[k]]) {
            this.element.setAttribute(attributes[k], attrValues[
              attributes[k]].substr(1));
          } else {
            this.element.removeAttribute(attributes[k]);
          }
        }
      };
    }

    /**
     * @param {HTMLElement} element
     * @param {Object}      options
     */
    function setupElement(element, options) {
      if (element.elementQueriesSetupInformation) {
        element.elementQueriesSetupInformation.addOption(options);
      } else {
        element.elementQueriesSetupInformation = new SetupInformation(
          element);
        element.elementQueriesSetupInformation.addOption(options);
        new ResizeSensor(element, function() {
          element.elementQueriesSetupInformation.call();
        });
      }
      element.elementQueriesSetupInformation.call();
    }

    /**
     * @param {String} selector
     * @param {String} mode min|max
     * @param {String} property width|height
     * @param {String} value
     */
    function queueQuery(selector, mode, property, value) {
      var query;
      if (document.querySelectorAll) query = document.querySelectorAll.bind(
        document);
      if (!query && 'undefined' !== typeof $$) query = $$;
      if (!query && 'undefined' !== typeof jQuery) query = jQuery;

      if (!query) {
        throw 'No document.querySelectorAll, jQuery or Mootools\'s $$ found.';
      }

      var elements = query(selector);
      for (var i = 0, j = elements.length; i < j; i++) {
        setupElement(elements[i], {
          mode: mode,
          property: property,
          value: value
        });
      }
    }

    var regex =
      /,?([^,\n]*)\[[\s\t]*(min|max)-(width|height)[\s\t]*[~$\^]?=[\s\t]*"([^"]*)"[\s\t]*]([^\n\s\{]*)/mgi;

    /**
     * @param {String} css
     */
    function extractQuery(css) {
      var match;
      css = css.replace(/'/g, '"');
      while (null !== (match = regex.exec(css))) {
        if (5 < match.length) {
          queueQuery(match[1] || match[5], match[2], match[3], match[4]);
        }
      }
    }

    /**
     * @param {CssRule[]|String} rules
     */
    function readRules(rules) {
      var selector = '';
      if (!rules) {
        return;
      }
      if ('string' === typeof rules) {
        rules = rules.toLowerCase();
        if (-1 !== rules.indexOf('min-width') || -1 !== rules.indexOf(
            'max-width')) {
          extractQuery(rules);
        }
      } else {
        for (var i = 0, j = rules.length; i < j; i++) {
          if (1 === rules[i].type) {
            selector = rules[i].selectorText || rules[i].cssText;
            if (-1 !== selector.indexOf('min-height') || -1 !== selector.indexOf(
                'max-height')) {
              extractQuery(selector);
            } else if (-1 !== selector.indexOf('min-width') || -1 !==
              selector.indexOf('max-width')) {
              extractQuery(selector);
            }
          } else if (4 === rules[i].type) {
            readRules(rules[i].cssRules || rules[i].rules);
          }
        }
      }
    }

    /**
     * Searches all css rules and setups the event listener to all elements with element query rules..
     */
    this.init = function() {
      for (var i = 0, j = document.styleSheets.length; i < j; i++) {
        readRules(document.styleSheets[i].cssText || document.styleSheets[
          i].cssRules || document.styleSheets[i].rules);
      }
    }
  }

  function init() {
    new L.ElementQueries().init();
  }

  if (window.addEventListener) {
    window.addEventListener('load', init, false);
  } else {
    window.attachEvent('onload', init);
  }

  /**
   * Class for dimension change detection.
   *
   * @param {Element|Element[]|Elements|jQuery} element
   * @param {Function} callback
   *
   * @constructor
   */
  this.L.ResizeSensor = function(element, callback) {
    /**
     * Adds a listener to the over/under-flow event.
     *
     * @param {HTMLElement} element
     * @param {Function}    callback
     */
    function addResizeListener(element, callback) {
      if (window.OverflowEvent) {
        // webkit [deprecated!]
        // element.addEventListener('overflowchanged', function(e) {
        //     callback.call(this, e);
        // });
      } else {
        element.addEventListener('overflow', function(e) {
          callback.call(this, e);
        });
        element.addEventListener('underflow', function(e) {
          callback.call(this, e);
        });
      }
    }

    /**
     *
     * @constructor
     */
    function EventQueue() {
      this.q = [];
      this.add = function(ev) {
        this.q.push(ev);
      };

      var i, j;
      this.call = function() {
        for (i = 0, j = this.q.length; i < j; i++) {
          this.q[i].call();
        }
      };
    }

    /**
     * @param {HTMLElement} element
     * @param {String}      prop
     * @returns {String|Number}
     */
    function getComputedStyle(element, prop) {
      if (element.currentStyle) {
        return element.currentStyle[prop];
      } else if (window.getComputedStyle) {
        return window.getComputedStyle(element, null).getPropertyValue(prop);
      } else {
        return element.style[prop];
      }
    }

    /**
     *
     * @param {HTMLElement} element
     * @param {Function}    resized
     */
    function attachResizeEvent(element, resized) {
      if (!element.resizedAttached) {
        element.resizedAttached = new EventQueue();
        element.resizedAttached.add(resized);
      } else if (element.resizedAttached) {
        element.resizedAttached.add(resized);
        return;
      }

      /*if ('onresize' in element) {
          //internet explorer
          if (element.attachEvent) {
              element.attachEvent('onresize', function() {
                  element.resizedAttached.call();
              });
          } else if (element.addEventListener) {
              element.addEventListener('resize', function(){
                  element.resizedAttached.call();
              });
          }
      } else {*/
      var myResized = function() {
        if (setupSensor()) {
          element.resizedAttached.call();
        }
      };
      element.resizeSensor = document.createElement('div');
      element.resizeSensor.className = 'resize-sensor';
      var style =
        'position: absolute; left: 0; top: 0; right: 0; bottom: 0; overflow: hidden; z-index: -1;';
      element.resizeSensor.style.cssText = style;
      element.resizeSensor.innerHTML =
        '<div class="resize-sensor-overflow" style="' + style + '">' +
        '<div></div>' +
        '</div>' +
        '<div class="resize-sensor-underflow" style="' + style + '">' +
        '<div></div>' +
        '</div>';
      element.appendChild(element.resizeSensor);

      if ('absolute' !== getComputedStyle(element, 'position')) {
        element.style.position = 'relative';
      }

      var x = -1,
        y = -1,
        firstStyle = element.resizeSensor.firstElementChild.firstChild.style,
        lastStyle = element.resizeSensor.lastElementChild.firstChild.style;

      function setupSensor() {
        var change = false,
          width = element.resizeSensor.offsetWidth,
          height = element.resizeSensor.offsetHeight;

        if (x != width) {
          firstStyle.width = (width - 1) + 'px';
          lastStyle.width = (width + 1) + 'px';
          change = true;
          x = width;
        }
        if (y != height) {
          firstStyle.height = (height - 1) + 'px';
          lastStyle.height = (height + 1) + 'px';
          change = true;
          y = height;
        }
        return change;
      }

      setupSensor();
      addResizeListener(element.resizeSensor, myResized);
      addResizeListener(element.resizeSensor.firstElementChild, myResized);
      addResizeListener(element.resizeSensor.lastElementChild, myResized);
      /*}*/
    }

    if ('array' === typeof element ||
      ('undefined' !== typeof jQuery && element instanceof jQuery) //jquery
      ||
      ('undefined' !== typeof Elements && element instanceof Elements) //mootools
    ) {
      var i = 0,
        j = element.length;
      for (; i < j; i++) {
        attachResizeEvent(element[i], callback);
      }
    } else {
      attachResizeEvent(element, callback);
    }
  }

})();



/* global document, Erizo*/
/*
 * Speaker represents the volume icon that will be shown in the mediaPlayer, for example.
 * It manages the volume level of the media tag given in the constructor.
 * Every Speaker is a View.
 * Ex.: var speaker = Speaker({elementID: element, media: mediaTag, id: id});
 */
Erizo.Speaker = function(spec) {
  'use strict';

  var that = Erizo.View({}),
    show,
    mute,
    unmute,
    lastVolume = 50;

  // Variables

  // DOM element in which the Speaker will be appended
  that.elementID = spec.elementID;

  // media tag
  that.media = spec.media;

  // Speaker id
  that.id = spec.id;

  // MediaStream
  that.stream = spec.stream;

  // Container
  that.div = document.createElement('div');
  that.div.setAttribute('style',
    'width: 40%; height: 100%; max-width: 32px; position: absolute; right: 0;z-index:0;'
  );

  // Volume icon
  that.icon = document.createElement('img');
  that.icon.setAttribute('id', 'volume_' + that.id);
  that.icon.setAttribute('src', Woogeen.Images.sound48);
  that.icon.setAttribute('style',
    'width: 80%; height: 100%; position: absolute;');
  that.div.appendChild(that.icon);


  if (that.stream instanceof Woogeen.RemoteStream) {

    // Volume bar
    that.picker = document.createElement('input');
    that.picker.setAttribute('id', 'picker_' + that.id);
    that.picker.type = 'range';
    that.picker.min = 0;
    that.picker.max = 100;
    that.picker.step = 10;
    that.picker.value = lastVolume;
    that.picker.orient = 'vertical'; //  FireFox supports range sliders as of version 23
    that.div.appendChild(that.picker);
    that.media.volume = that.picker.value / 100;
    that.media.muted = false;

    that.picker.oninput = function() {
      if (that.picker.value > 0) {
        that.media.muted = false;
        that.icon.setAttribute('src', Woogeen.Images.sound48);
      } else {
        that.media.muted = true;
        that.icon.setAttribute('src', Woogeen.Images.mute48);
      }
      that.media.volume = that.picker.value / 100;
    };

    // Private functions
    show = function(displaying) {
      that.picker.setAttribute('style',
        'width: 32px; height: 100px; position: absolute; bottom: 90%; z-index: 1;' +
        that.div.offsetHeight +
        'px; right: 0px; -webkit-appearance: slider-vertical; display: ' +
        displaying);
    };

    mute = function() {
      that.icon.setAttribute('src', Woogeen.Images.mute48);
      lastVolume = that.picker.value;
      that.picker.value = 0;
      that.media.volume = 0;
      that.media.muted = true;
    };

    unmute = function() {
      that.icon.setAttribute('src', Woogeen.Images.sound48);
      that.picker.value = lastVolume;
      that.media.volume = that.picker.value / 100;
      that.media.muted = false;
    };

    that.icon.onclick = function() {
      if (that.media.muted) {
        unmute();
      } else {
        mute();
      }
    };

    // Public functions
    that.div.onmouseover = function() {
      show('block');
    };

    that.div.onmouseout = function() {
      show('none');
    };

    show('none');

  } else if (that.stream instanceof Woogeen.LocalStream) {
    mute = function() {
      that.media.muted = true;
      that.icon.setAttribute('src', Woogeen.Images.mute48);
      that.stream.mediaStream.getAudioTracks()[0].enabled = false;
    };

    unmute = function() {
      that.media.muted = false;
      that.icon.setAttribute('src', Woogeen.Images.sound48);
      that.stream.mediaStream.getAudioTracks()[0].enabled = true;
    };

    that.icon.onclick = function() {
      if (that.media.muted) {
        unmute();
      } else {
        mute();
      }
    };
  }


  document.getElementById(that.elementID).appendChild(that.div);
  return that;
};



/* global Erizo */

/*
 * View class represents a HTML component
 * Every view is an EventDispatcher.
 */
Erizo.View = function(spec) {
  'use strict';

  var that = Woogeen.EventDispatcher(spec);

  // Variables

  // URL where it will look for icons and assets
  that.url = spec.url || '.';
  return that;
};



/* global window, document, webkitURL, Erizo, L */
/*
 * VideoPlayer represents a Licode video component that shows either a local or a remote video.
 * Ex.: var player = VideoPlayer({id: id, stream: stream, elementID: elementID});
 * A VideoPlayer is also a View component.
 */
Erizo.VideoPlayer = function(spec) {
  'use strict';

  var that = Erizo.View({}),
    onmouseover,
    onmouseout;

  // Variables

  // VideoPlayer ID
  that.id = spec.id;

  // Stream that the VideoPlayer will play
  that.stream = spec.stream.mediaStream;

  // DOM element in which the VideoPlayer will be appended
  that.elementID = spec.elementID;

  // Private functions
  onmouseover = function() {
    that.bar.display();
  };

  onmouseout = function() {
    that.bar.hide();
  };

  // Public functions

  // It will stop the VideoPlayer and remove it from the HTML
  that.destroy = function() {
    that.video.pause();
    delete that.resizer;
    that.parentNode.removeChild(that.div);
  };

  that.resize = function(hasAbsoluteLeft) {

    var width = that.container.offsetWidth,
      height = that.container.offsetHeight;


    if (hasAbsoluteLeft) {

      that.video.style.width = "calc(100% + " + ((4 / 3) * height - width) +
        "px)";
      that.video.style.height = "100%";

      that.video.style.top = '0px';
      that.video.style.left = -((4 / 3) * height / 2 - width / 2) + 'px';

    } else {

      that.video.style.height = '100%';
      that.video.style.width = '100%';

      that.video.style.left = '0px';
      that.video.style.top = '0px';

    }

    that.containerWidth = width;
    that.containerHeight = height;

  };

  /*window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function (m, key, value) {
      document.getElementById(key).value = unescape(value);
  });*/

  that.stream_url = (window.URL || webkitURL).createObjectURL(that.stream);

  // Container
  that.div = document.createElement('div');
  that.div.setAttribute('id', 'player_' + that.id);
  that.div.setAttribute('style',
    'width: 100%; height: 100%; position: relative; background-color: black; overflow: hidden;'
  );

  // Video tag
  that.video = document.createElement('video');
  that.video.setAttribute('id', 'stream' + that.id);
  that.video.setAttribute('style',
    'width: 100%; height: 100%; position: absolute');
  that.video.setAttribute('autoplay', 'autoplay');

  if (spec.stream instanceof Woogeen.LocalStream) {
    that.video.volume = 0;
  }

  if (that.elementID !== undefined) {
    document.getElementById(that.elementID).appendChild(that.div);
    that.container = document.getElementById(that.elementID);
  } else {
    document.body.appendChild(that.div);
    that.container = document.body;
  }

  var fullscreenHandler = (function() {
    var requestFS = ['requestFullScreen', 'webkitRequestFullScreen',
      'mozRequestFullScreen', 'msRequestFullScreen',
      'oRequestFullScreen'
    ];

    function _enterFullScreen(tag) {
      var method;
      for (var p in requestFS) {
        if (typeof tag[requestFS[p]] === 'function') {
          method = requestFS[p];
          break;
        }
      }
      if (typeof tag[method] === 'function') {
        tag[method]();
      }
    }

    function _exitFullScreen() {
      if (typeof document.exitFullscreen === 'function') {
        document.exitFullscreen();
      } else if (typeof document.webkitExitFullscreen === 'function') {
        document.webkitExitFullscreen();
      } else if (typeof document.mozCancelFullScreen === 'function') {
        document.mozCancelFullScreen();
      }
    }
    return function(tag) {
      if (tag.offsetWidth == screen.width) _exitFullScreen();
      else _enterFullScreen(tag);
    };
  }());

  that.parentNode = that.div.parentNode;

  that.div.appendChild(that.video);
  that.video.addEventListener('playing', function display() {
    if (that.video.videoWidth * that.video.videoHeight > 4) { // why remote video size initially is 2*2 in chrome?
      L.Logger.debug('video dimensions:', that.video.videoWidth, that.video
        .videoHeight);
      return;
    }
    setTimeout(display, 50);
  });
  that.containerWidth = 0;
  that.containerHeight = 0;

  that.resizer = new L.ResizeSensor(that.container, that.resize);

  that.resize();

  that.div.ondblclick = function() {
    fullscreenHandler(that.video);
  };

  // Bottom Bar
  that.bar = new Erizo.Bar({
    elementID: 'player_' + that.id,
    id: that.id,
    stream: spec.stream,
    media: that.video,
    options: spec.options
  });

  that.div.onmouseover = onmouseover;
  that.div.onmouseout = onmouseout;

  that.video.src = that.stream_url;

  return that;
};



/* global Erizo */

Woogeen.Images = {
  sound48: 'data:image/png;base64,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',
  mute48: 'data:image/png;base64,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'
};

/**
   * @function show
   * @desc This function displays the stream on HTML in the container with id elementId.
   <br><b>Remarks:</b><br>
   Tag with id value elementId should be pre-created.
   * @memberOf Woogeen.Stream
   * @instance
   * @param {string} elementId tag id of the element on HTML.
   * @return {boolean} true If stream has been displayed already or is now displaying; otherwise false.
   * @example
<script type="text/JavaScript">
stream.show('stream-div');
</script>
   */
Woogeen.Stream.prototype.show = function(elementId) {
  'use strict';
  if (!(this.mediaStream) || this.showing === true) return (this.showing ===
    true);
  if (typeof elementId !== 'string') elementId = 'stream_' + this.id();
  var options = arguments[1] || {};
  this.elementId = elementId;
  if (this.hasVideo()) {
    this.player = new Erizo.VideoPlayer({
      id: this.id(),
      stream: this,
      elementID: elementId,
      options: options
    });
    this.showing = true;
  } else if (this.hasAudio()) {
    this.player = new Erizo.AudioPlayer({
      id: this.id(),
      stream: this,
      elementID: elementId,
      options: options
    });
    this.showing = true;
  }
  return (this.showing === true);
};
/**
   * @function hide
   * @desc This function removes the stream on HTML from its container.
   * @memberOf Woogeen.Stream
   * @instance
   * @example
<script type="text/JavaScript">
stream.hide();
</script>
   */
Woogeen.Stream.prototype.hide = function() {
  'use strict';
  if (this.showing === true) {
    if (this.player && typeof this.player.destroy === 'function') {
      this.player.destroy();
      this.showing = false;
    }
  }
};

/*
 * Woogeen.UI provides UI functions for WooGeen SDK.
 */
Woogeen.UI = Woogeen.UI || Object.create({});

Woogeen.UI.attachMediaStream = function() {
  // When attachMediaStream is removed from adapter.js, we should implement by ourself.
  adapter.browserShim.attachMediaStream.apply(this, arguments);
};



window.Erizo = Erizo;
window.Woogeen = Woogeen;
window.L = L;
}(window));


