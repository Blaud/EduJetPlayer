(function (QUnit,sinon,videojs) {
'use strict';

QUnit = 'default' in QUnit ? QUnit['default'] : QUnit;
sinon = 'default' in sinon ? sinon['default'] : sinon;
videojs = 'default' in videojs ? videojs['default'] : videojs;

var commonjsGlobal = typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

var empty = {};


var empty$1 = (Object.freeze || Object)({
	'default': empty
});

var minDoc = ( empty$1 && empty ) || empty$1;

var topLevel = typeof commonjsGlobal !== 'undefined' ? commonjsGlobal :
    typeof window !== 'undefined' ? window : {};


var doccy;

if (typeof document !== 'undefined') {
    doccy = document;
} else {
    doccy = topLevel['__GLOBAL_DOCUMENT_CACHE@4'];

    if (!doccy) {
        doccy = topLevel['__GLOBAL_DOCUMENT_CACHE@4'] = minDoc;
    }
}

var document_1 = doccy;

var win;

if (typeof window !== "undefined") {
    win = window;
} else if (typeof commonjsGlobal !== "undefined") {
    win = commonjsGlobal;
} else if (typeof self !== "undefined"){
    win = self;
} else {
    win = {};
}

var window_1 = win;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
  return typeof obj;
} : function (obj) {
  return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
};











var classCallCheck = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};











var inherits = function (subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
  }

  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });
  if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
};











var possibleConstructorReturn = function (self, call) {
  if (!self) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return call && (typeof call === "object" || typeof call === "function") ? call : self;
};

var defaults$$1 = {
  align: 'top-left',
  class: '',
  content: 'This overlay will show up while the video is playing',
  debug: false,
  showBackground: true,
  attachToControlBar: false,
  overlays: [{
    start: 'playing',
    end: 'paused'
  }]
};

var Component = videojs.getComponent('Component');

var dom$1 = videojs.dom || videojs;
var registerPlugin = videojs.registerPlugin || videojs.plugin;

/**
 * Whether the value is a `Number`.
 *
 * Both `Infinity` and `-Infinity` are accepted, but `NaN` is not.
 *
 * @param  {Number} n
 * @return {Boolean}
 */

/* eslint-disable no-self-compare */
var isNumber = function isNumber(n) {
  return typeof n === 'number' && n === n;
};
/* eslint-enable no-self-compare */

/**
 * Whether a value is a string with no whitespace.
 *
 * @param  {String} s
 * @return {Boolean}
 */
var hasNoWhitespace = function hasNoWhitespace(s) {
  return typeof s === 'string' && /^\S+$/.test(s);
};

/**
 * Overlay component.
 *
 * @class   Overlay
 * @extends {videojs.Component}
 */

var Overlay = function (_Component) {
  inherits(Overlay, _Component);

  function Overlay(player, options) {
    classCallCheck(this, Overlay);

    var _this = possibleConstructorReturn(this, _Component.call(this, player, options));

    ['start', 'end'].forEach(function (key) {
      var value = _this.options_[key];

      if (isNumber(value)) {
        _this[key + 'Event_'] = 'timeupdate';
      } else if (hasNoWhitespace(value)) {
        _this[key + 'Event_'] = value;

        // An overlay MUST have a start option. Otherwise, it's pointless.
      } else if (key === 'start') {
        throw new Error('invalid "start" option; expected number or string');
      }
    });

    // video.js does not like components with multiple instances binding
    // events to the player because it tracks them at the player level,
    // not at the level of the object doing the binding. This could also be
    // solved with Function.prototype.bind (but not videojs.bind because of
    // its GUID magic), but the anonymous function approach avoids any issues
    // caused by crappy libraries clobbering Function.prototype.bind.
    // - https://github.com/videojs/video.js/issues/3097
    ['endListener_', 'rewindListener_', 'startListener_'].forEach(function (name) {
      _this[name] = function (e) {
        return Overlay.prototype[name].call(_this, e);
      };
    });

    // If the start event is a timeupdate, we need to watch for rewinds (i.e.,
    // when the user seeks backward).
    if (_this.startEvent_ === 'timeupdate') {
      _this.on(player, 'timeupdate', _this.rewindListener_);
    }

    _this.debug('created, listening to "' + _this.startEvent_ + '" for "start" and "' + (_this.endEvent_ || 'nothing') + '" for "end"');

    _this.hide();
    return _this;
  }

  Overlay.prototype.createEl = function createEl() {
    var options = this.options_;
    var content = options.content;

    var background = options.showBackground ? 'vjs-overlay-background' : 'vjs-overlay-no-background';
    var el = dom$1.createEl('div', {
      className: '\n        vjs-overlay\n        vjs-overlay-' + options.align + '\n        ' + options.class + '\n        ' + background + '\n        vjs-hidden\n      '
    });

    if (typeof content === 'string') {
      el.innerHTML = content;
    } else if (content instanceof window_1.DocumentFragment) {
      el.appendChild(content);
    } else {
      dom$1.appendContent(el, content);
    }

    return el;
  };

  /**
   * Logs debug errors
   * @param  {...[type]} args [description]
   * @return {[type]}         [description]
   */


  Overlay.prototype.debug = function debug() {
    if (!this.options_.debug) {
      return;
    }

    var log = videojs.log;
    var fn = log;

    // Support `videojs.log.foo` calls.

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    if (log.hasOwnProperty(args[0]) && typeof log[args[0]] === 'function') {
      fn = log[args.shift()];
    }

    fn.apply(undefined, ['overlay#' + this.id() + ': '].concat(args));
  };

  /**
   * Overrides the inherited method to perform some event binding
   *
   * @return {Overlay}
   */


  Overlay.prototype.hide = function hide() {
    _Component.prototype.hide.call(this);

    this.debug('hidden');
    this.debug('bound `startListener_` to "' + this.startEvent_ + '"');

    // Overlays without an "end" are valid.
    if (this.endEvent_) {
      this.debug('unbound `endListener_` from "' + this.endEvent_ + '"');
      this.off(this.player(), this.endEvent_, this.endListener_);
    }

    this.on(this.player(), this.startEvent_, this.startListener_);

    return this;
  };

  /**
   * Determine whether or not the overlay should hide.
   *
   * @param  {Number} time
   *         The current time reported by the player.
   * @param  {String} type
   *         An event type.
   * @return {Boolean}
   */


  Overlay.prototype.shouldHide_ = function shouldHide_(time, type) {
    var end = this.options_.end;

    return isNumber(end) ? time >= end : end === type;
  };

  /**
   * Overrides the inherited method to perform some event binding
   *
   * @return {Overlay}
   */


  Overlay.prototype.show = function show() {
    _Component.prototype.show.call(this);
    this.off(this.player(), this.startEvent_, this.startListener_);
    this.debug('shown');
    this.debug('unbound `startListener_` from "' + this.startEvent_ + '"');

    // Overlays without an "end" are valid.
    if (this.endEvent_) {
      this.debug('bound `endListener_` to "' + this.endEvent_ + '"');
      this.on(this.player(), this.endEvent_, this.endListener_);
    }

    return this;
  };

  /**
   * Determine whether or not the overlay should show.
   *
   * @param  {Number} time
   *         The current time reported by the player.
   * @param  {String} type
   *         An event type.
   * @return {Boolean}
   */


  Overlay.prototype.shouldShow_ = function shouldShow_(time, type) {
    var start = this.options_.start;
    var end = this.options_.end;

    if (isNumber(start)) {

      if (isNumber(end)) {
        return time >= start && time < end;

        // In this case, the start is a number and the end is a string. We need
        // to check whether or not the overlay has shown since the last seek.
      } else if (!this.hasShownSinceSeek_) {
        this.hasShownSinceSeek_ = true;
        return time >= start;
      }

      // In this case, the start is a number and the end is a string, but
      // the overlay has shown since the last seek. This means that we need
      // to be sure we aren't re-showing it at a later time than it is
      // scheduled to appear.
      return Math.floor(time) === start;
    }

    return start === type;
  };

  /**
   * Event listener that can trigger the overlay to show.
   *
   * @param  {Event} e
   */


  Overlay.prototype.startListener_ = function startListener_(e) {
    var time = this.player().currentTime();

    if (this.shouldShow_(time, e.type)) {
      this.show();
    }
  };

  /**
   * Event listener that can trigger the overlay to show.
   *
   * @param  {Event} e
   */


  Overlay.prototype.endListener_ = function endListener_(e) {
    var time = this.player().currentTime();

    if (this.shouldHide_(time, e.type)) {
      this.hide();
    }
  };

  /**
   * Event listener that can looks for rewinds - that is, backward seeks
   * and may hide the overlay as needed.
   *
   * @param  {Event} e
   */


  Overlay.prototype.rewindListener_ = function rewindListener_(e) {
    var time = this.player().currentTime();
    var previous = this.previousTime_;
    var start = this.options_.start;
    var end = this.options_.end;

    // Did we seek backward?
    if (time < previous) {
      this.debug('rewind detected');

      // The overlay remains visible if two conditions are met: the end value
      // MUST be an integer and the the current time indicates that the
      // overlay should NOT be visible.
      if (isNumber(end) && !this.shouldShow_(time)) {
        this.debug('hiding; ' + end + ' is an integer and overlay should not show at this time');
        this.hasShownSinceSeek_ = false;
        this.hide();

        // If the end value is an event name, we cannot reliably decide if the
        // overlay should still be displayed based solely on time; so, we can
        // only queue it up for showing if the seek took us to a point before
        // the start time.
      } else if (hasNoWhitespace(end) && time < start) {
        this.debug('hiding; show point (' + start + ') is before now (' + time + ') and end point (' + end + ') is an event');
        this.hasShownSinceSeek_ = false;
        this.hide();
      }
    }

    this.previousTime_ = time;
  };

  return Overlay;
}(Component);

videojs.registerComponent('Overlay', Overlay);

/**
 * Initialize the plugin.
 *
 * @function plugin
 * @param    {Object} [options={}]
 */
var plugin = function plugin(options) {
  var _this2 = this;

  var settings = videojs.mergeOptions(defaults$$1, options);

  // De-initialize the plugin if it already has an array of overlays.
  if (Array.isArray(this.overlays_)) {
    this.overlays_.forEach(function (overlay) {
      _this2.removeChild(overlay);
      if (_this2.controlBar) {
        _this2.controlBar.removeChild(overlay);
      }
      overlay.dispose();
    });
  }

  var overlays = settings.overlays;

  // We don't want to keep the original array of overlay options around
  // because it doesn't make sense to pass it to each Overlay component.
  delete settings.overlays;

  this.overlays_ = overlays.map(function (o) {
    var mergeOptions = videojs.mergeOptions(settings, o);

    // Attach bottom aligned overlays to the control bar so
    // they will adjust positioning when the control bar minimizes
    if (mergeOptions.attachToControlBar && _this2.controlBar && mergeOptions.align.indexOf('bottom') !== -1) {
      return _this2.controlBar.addChild('overlay', mergeOptions);
    }

    return _this2.addChild('overlay', mergeOptions);
  });
};

plugin.VERSION = '__VERSION__';

registerPlugin('overlay', plugin);

var Player = videojs.getComponent('Player');
var dom = videojs.dom || videojs;

QUnit.test('the environment is sane', function (assert) {
  assert.strictEqual(_typeof(Array.isArray), 'function', 'es5 exists');
  assert.strictEqual(typeof sinon === 'undefined' ? 'undefined' : _typeof(sinon), 'object', 'sinon exists');
  assert.strictEqual(typeof videojs === 'undefined' ? 'undefined' : _typeof(videojs), 'function', 'videojs exists');
  assert.strictEqual(typeof plugin === 'undefined' ? 'undefined' : _typeof(plugin), 'function', 'plugin is a function');
});

QUnit.module('videojs-overlay', {
  beforeEach: function beforeEach() {
    var _this = this;

    // Mock the environment's timers because certain things - particularly
    // player readiness - are asynchronous in video.js 5. This MUST come
    // before any player is created; otherwise, timers could get created
    // with the actual timer methods!
    this.clock = sinon.useFakeTimers();

    this.fixture = document_1.getElementById('qunit-fixture');
    this.video = document_1.createElement('video');
    this.fixture.appendChild(this.video);
    this.player = videojs(this.video);

    // Simulate the video element playing to a specific time and stub
    // the `currentTime` method of the player to return this.
    this.currentTime = 0;

    this.player.currentTime = function () {
      return _this.currentTime;
    };

    this.updateTime = function (seconds) {
      _this.currentTime = seconds;
      _this.player.trigger('timeupdate');
    };

    this.assertOverlayCount = function (assert, expected) {
      var overlays = Array.prototype.filter.call(_this.player.$$('.vjs-overlay'), function (el) {
        return !dom.hasClass(el, 'vjs-hidden');
      });
      var actual = overlays ? overlays.length : 0;
      var one = expected === 1;
      var msg = expected + ' overlay' + (one ? '' : 's') + ' exist' + (one ? 's' : '');

      assert.strictEqual(actual, expected, msg);
    };
  },
  afterEach: function afterEach() {
    this.player.dispose();
    this.clock.restore();
  }
});

QUnit.test('registers itself with video.js', function (assert) {
  assert.expect(2);

  assert.strictEqual(_typeof(Player.prototype.overlay), 'function', 'videojs-overlay plugin was registered');

  assert.ok(videojs.getComponent('Overlay'), 'the Overlay component was registered');
});

QUnit.test('does not display overlays when none are configured', function (assert) {
  assert.expect(1);

  this.player.overlay({
    overlays: []
  });

  this.assertOverlayCount(assert, 0);
});

QUnit.test('can be triggered and dismissed by events', function (assert) {
  assert.expect(3);

  this.player.overlay({
    overlays: [{
      start: 'custom-start',
      end: 'custom-end'
    }]
  });

  this.assertOverlayCount(assert, 0);

  this.player.trigger('custom-start');
  this.assertOverlayCount(assert, 1);

  this.player.trigger('custom-end');
  this.assertOverlayCount(assert, 0);
});

QUnit.test('can be triggered for time intervals', function (assert) {
  assert.expect(7);

  this.player.overlay({
    overlays: [{
      start: 5,
      end: 10
    }]
  });

  this.updateTime(4);
  this.assertOverlayCount(assert, 0);

  this.updateTime(5);
  this.assertOverlayCount(assert, 1);

  this.updateTime(7.5);
  this.assertOverlayCount(assert, 1);

  this.updateTime(10);
  this.assertOverlayCount(assert, 0);

  this.updateTime(11);
  this.assertOverlayCount(assert, 0);

  this.updateTime(6);
  this.assertOverlayCount(assert, 1);

  this.updateTime(12);
  this.assertOverlayCount(assert, 0);
});

QUnit.test('shows multiple overlays simultaneously', function (assert) {
  assert.expect(4);

  this.player.overlay({
    overlays: [{
      start: 3,
      end: 10
    }, {
      start: 'playing',
      end: 'ended'
    }]
  });

  this.updateTime(4);
  this.assertOverlayCount(assert, 1);

  this.player.trigger('playing');
  this.assertOverlayCount(assert, 2);

  this.player.trigger('ended');
  this.assertOverlayCount(assert, 1);

  this.updateTime(11);
  this.assertOverlayCount(assert, 0);
});

QUnit.test('the content of overlays can be specified as an HTML string', function (assert) {
  assert.expect(1);

  var innerHTML = '<p>overlay <a href="#">text</a></p>';

  this.player.overlay({
    content: innerHTML,
    overlays: [{
      start: 'playing',
      end: 'ended'
    }]
  });

  this.player.trigger('playing');

  assert.strictEqual(this.player.$('.vjs-overlay').innerHTML, innerHTML, 'innerHTML matched');
});

QUnit.test('an element can be used as the content of overlays', function (assert) {
  assert.expect(1);

  var content = document_1.createElement('p');

  content.innerHTML = 'this is some text';

  this.player.overlay({
    content: content,
    overlays: [{
      start: 5,
      end: 10
    }]
  });

  this.updateTime(5);

  assert.strictEqual(this.player.$('.vjs-overlay p'), content, 'sets the content element');
});

QUnit.test('a DocumentFragment can be used as the content of overlays', function (assert) {
  assert.expect(1);

  var fragment = document_1.createDocumentFragment();
  var br = document_1.createElement('br');

  fragment.appendChild(br);

  this.player.overlay({
    content: fragment,
    overlays: [{
      start: 'showoverlay',
      end: 'hideoverlay'
    }]
  });

  this.player.trigger('showoverlay');

  assert.strictEqual(this.player.$('.vjs-overlay br'), br, 'sets the content fragment');
});

QUnit.test('allows content to be specified per overlay', function (assert) {
  assert.expect(5);

  var text = '<b>some text</b>';
  var html = '<p>overlay <a href="#">text</a></p>';
  var element = document_1.createElement('i');
  var fragment = document_1.createDocumentFragment();

  fragment.appendChild(document_1.createElement('img'));

  this.player.overlay({
    content: text,
    overlays: [{
      start: 0,
      end: 1
    }, {
      content: html,
      start: 0,
      end: 1
    }, {
      content: element,
      start: 0,
      end: 1
    }, {
      content: fragment,
      start: 0,
      end: 1
    }]
  });

  this.updateTime(0);
  this.assertOverlayCount(assert, 4);

  assert.strictEqual(this.player.$$('.vjs-overlay b').length, 1, 'shows a default overlay');

  assert.strictEqual(this.player.$$('.vjs-overlay p').length, 1, 'shows an HTML string');

  assert.strictEqual(this.player.$$('.vjs-overlay i').length, 1, 'shows a DOM element');

  assert.strictEqual(this.player.$$('.vjs-overlay img').length, 1, 'shows a document fragment');
});

QUnit.test('allows css class to be specified per overlay', function (assert) {
  assert.expect(3);

  var text = '<b>some text</b>';
  var fragment = document_1.createDocumentFragment();

  fragment.appendChild(document_1.createElement('img'));

  this.player.overlay({
    content: text,
    overlays: [{
      class: 'first-class-overlay',
      start: 0,
      end: 1
    }, {
      class: 'second-class-overlay',
      start: 0,
      end: 1
    }, {
      start: 0,
      end: 1
    }]
  });

  this.updateTime(0);

  this.assertOverlayCount(assert, 3);

  assert.strictEqual(this.player.$$('.first-class-overlay').length, 1, 'shows an overlay with a custom class');

  assert.strictEqual(this.player.$$('.second-class-overlay').length, 1, 'shows an overlay with a different custom class');
});

QUnit.test('does not double add overlays that are triggered twice', function (assert) {
  assert.expect(1);

  this.player.overlay({
    overlays: [{
      start: 'start',
      end: 'end'
    }]
  });

  this.player.trigger('start');
  this.player.trigger('start');
  this.assertOverlayCount(assert, 1);
});

QUnit.test('does not double remove overlays that are triggered twice', function (assert) {
  assert.expect(1);

  this.player.overlay({
    overlays: [{
      start: 'start',
      end: 'end'
    }]
  });

  this.player.trigger('start');
  this.player.trigger('end');
  this.player.trigger('end');
  this.assertOverlayCount(assert, 0);
});

QUnit.test('displays overlays that mix event and playback time triggers', function (assert) {
  assert.expect(4);

  this.player.overlay({
    overlays: [{
      start: 'start',
      end: 10
    }, {
      start: 5,
      end: 'end'
    }]
  });

  this.player.trigger('start');
  this.assertOverlayCount(assert, 1);

  this.updateTime(6);
  this.assertOverlayCount(assert, 2);

  this.updateTime(10);
  this.assertOverlayCount(assert, 1);

  this.player.trigger('end');
  this.assertOverlayCount(assert, 0);
});

QUnit.test('shows mixed trigger overlays once per seek', function (assert) {
  assert.expect(6);

  this.player.overlay({
    overlays: [{
      start: 1,
      end: 'pause'
    }]
  });

  this.updateTime(1);
  this.assertOverlayCount(assert, 1);

  this.player.trigger('pause');
  this.assertOverlayCount(assert, 0);

  this.updateTime(2);
  this.assertOverlayCount(assert, 0);

  this.updateTime(1);
  this.assertOverlayCount(assert, 1);

  this.player.trigger('pause');
  this.assertOverlayCount(assert, 0);

  this.updateTime(2);
  this.assertOverlayCount(assert, 0);
});

QUnit.test('applies simple alignment class names', function (assert) {
  assert.expect(4);

  this.player.overlay({
    overlays: [{
      start: 'start',
      align: 'top'
    }, {
      start: 'start',
      align: 'left'
    }, {
      start: 'start',
      align: 'right'
    }, {
      start: 'start',
      align: 'bottom'
    }]
  });

  this.player.trigger('start');

  assert.ok(this.player.$('.vjs-overlay.vjs-overlay-top'), 'applies top class');

  assert.ok(this.player.$('.vjs-overlay.vjs-overlay-right'), 'applies right class');

  assert.ok(this.player.$('.vjs-overlay.vjs-overlay-bottom'), 'applies bottom class');

  assert.ok(this.player.$('.vjs-overlay.vjs-overlay-left'), 'applies left class');
});

QUnit.test('applies compound alignment class names', function (assert) {
  assert.expect(4);

  this.player.overlay({
    overlays: [{
      start: 'start',
      align: 'top-left'
    }, {
      start: 'start',
      align: 'top-right'
    }, {
      start: 'start',
      align: 'bottom-left'
    }, {
      start: 'start',
      align: 'bottom-right'
    }]
  });

  this.player.trigger('start');

  assert.ok(this.player.$('.vjs-overlay.vjs-overlay-top-left'), 'applies top class');

  assert.ok(this.player.$('.vjs-overlay.vjs-overlay-top-right'), 'applies right class');

  assert.ok(this.player.$('.vjs-overlay.vjs-overlay-bottom-left'), 'applies bottom class');

  assert.ok(this.player.$('.vjs-overlay.vjs-overlay-bottom-right'), 'applies left class');
});

QUnit.test('removes time based overlays if the user seeks backward', function (assert) {
  assert.expect(2);

  this.player.overlay({
    overlays: [{
      start: 5,
      end: 10
    }]
  });

  this.updateTime(6);
  this.assertOverlayCount(assert, 1);

  this.updateTime(4);
  this.assertOverlayCount(assert, 0);
});

QUnit.test('applies background styling when showBackground is true', function (assert) {
  assert.expect(1);

  this.player.overlay({
    overlays: [{
      start: 'start',
      showBackground: true
    }]
  });

  this.player.trigger('start');

  assert.ok(this.player.$('.vjs-overlay.vjs-overlay-background'), 'applies background styling');
});

QUnit.test('doesn\'t apply background when showBackground is false', function (assert) {
  assert.expect(1);

  this.player.overlay({
    overlays: [{
      start: 'start',
      showBackground: false
    }]
  });

  this.player.trigger('start');

  assert.notOk(this.player.$('.vjs-overlay.vjs-overlay-background'), 'does not apply background styling');
});

QUnit.test('attaches bottom aligned overlays to the controlBar', function (assert) {
  assert.expect(4);

  this.player.overlay({
    attachToControlBar: true,
    overlays: [{
      start: 'start',
      align: 'bottom-left'
    }, {
      start: 'start',
      align: 'bottom'
    }, {
      start: 'start',
      align: 'bottom-right'
    }, {
      start: 'start',
      align: 'top-right'
    }]
  });

  this.player.trigger('start');

  assert.ok(this.player.controlBar.$('.vjs-overlay.vjs-overlay-bottom-left'), 'bottom-left attaches to control bar');

  assert.ok(this.player.controlBar.$('.vjs-overlay.vjs-overlay-bottom'), 'bottom attaches to control bar');

  assert.ok(this.player.controlBar.$('.vjs-overlay.vjs-overlay-bottom-right'), 'bottom-right attaches to control bar');

  assert.notOk(this.player.controlBar.$('.vjs-overlay.vjs-overlay-top-right'), 'top-right is not attached to control bar');
});

QUnit.test('attach only to player when attachToControlbar is false', function (assert) {
  assert.expect(2);

  this.player.overlay({
    attachToControlBar: false,
    overlays: [{
      start: 'start',
      align: 'bottom-left'
    }, {
      start: 'start',
      align: 'bottom'
    }]
  });

  assert.notOk(this.player.controlBar.$('.vjs-overlay.vjs-overlay-bottom-left'), 'bottom-left is not attached to control bar');

  assert.notOk(this.player.controlBar.$('.vjs-overlay.vjs-overlay-bottom'), 'bottom is not attached to control bar');
});

QUnit.test('can deinitialize the plugin on reinitialization', function (assert) {
  assert.expect(3);

  this.player.overlay({
    attachToControlBar: true,
    overlays: [{
      start: 'start',
      align: 'bottom-left'
    }, {
      start: 'start',
      align: 'top-right'
    }]
  });

  this.player.overlay({
    overlays: [{
      start: 'start',
      align: 'top-left'
    }]
  });

  assert.notOk(this.player.$('.vjs-overlay.vjs-overlay-bottom-left'), 'previous bottom-left aligned overlay removed');

  assert.notOk(this.player.$('.vjs-overlay.vjs-overlay-top-right'), 'previous top-right aligned overlay removed');

  assert.ok(this.player.$('.vjs-overlay.vjs-overlay-top-left'), 'new top-left overlay added');
});

}(QUnit,sinon,videojs));
