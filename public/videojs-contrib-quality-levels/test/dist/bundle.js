(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){

},{}],2:[function(require,module,exports){
(function (global){
var topLevel = typeof global !== 'undefined' ? global :
    typeof window !== 'undefined' ? window : {}
var minDoc = require('min-document');

var doccy;

if (typeof document !== 'undefined') {
    doccy = document;
} else {
    doccy = topLevel['__GLOBAL_DOCUMENT_CACHE@4'];

    if (!doccy) {
        doccy = topLevel['__GLOBAL_DOCUMENT_CACHE@4'] = minDoc;
    }
}

module.exports = doccy;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"min-document":1}],3:[function(require,module,exports){
(function (global){
'use strict';

exports.__esModule = true;

var _video = (typeof window !== "undefined" ? window['videojs'] : typeof global !== "undefined" ? global['videojs'] : null);

var _video2 = _interopRequireDefault(_video);

var _qualityLevelList = require('./quality-level-list.js');

var _qualityLevelList2 = _interopRequireDefault(_qualityLevelList);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

// vjs 5/6 support
var registerPlugin = _video2['default'].registerPlugin || _video2['default'].plugin;

/**
 * Initialization function for the qualityLevels plugin. Sets up the QualityLevelList and
 * event handlers.
 *
 * @param {Player} player Player object.
 * @param {Object} options Plugin options object.
 * @function initPlugin
 */
var initPlugin = function initPlugin(player, options) {
  var originalPluginFn = player.qualityLevels;

  var qualityLevelList = new _qualityLevelList2['default']();

  var disposeHandler = function disposeHandler() {
    qualityLevelList.dispose();
    player.qualityLevels = originalPluginFn;
    player.off('dispose', disposeHandler);
  };

  player.on('dispose', disposeHandler);

  player.qualityLevels = function () {
    return qualityLevelList;
  };
  player.qualityLevels.VERSION = '2.0.4';

  return qualityLevelList;
};

/**
 * A video.js plugin.
 *
 * In the plugin function, the value of `this` is a video.js `Player`
 * instance. You cannot rely on the player being in a "ready" state here,
 * depending on how the plugin is invoked. This may or may not be important
 * to you; if not, remove the wait for "ready"!
 *
 * @param {Object} options Plugin options object
 * @function qualityLevels
 */
var qualityLevels = function qualityLevels(options) {
  return initPlugin(this, _video2['default'].mergeOptions({}, options));
};

// Register the plugin with video.js.
registerPlugin('qualityLevels', qualityLevels);

// Include the version number.
qualityLevels.VERSION = '2.0.4';

exports['default'] = qualityLevels;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./quality-level-list.js":4}],4:[function(require,module,exports){
(function (global){
'use strict';

exports.__esModule = true;

var _video = (typeof window !== "undefined" ? window['videojs'] : typeof global !== "undefined" ? global['videojs'] : null);

var _video2 = _interopRequireDefault(_video);

var _document = require('global/document');

var _document2 = _interopRequireDefault(_document);

var _qualityLevel = require('./quality-level.js');

var _qualityLevel2 = _interopRequireDefault(_qualityLevel);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * A list of QualityLevels.
 *
 * interface QualityLevelList : EventTarget {
 *   getter QualityLevel (unsigned long index);
 *   readonly attribute unsigned long length;
 *   readonly attribute long selectedIndex;
 *
 *   void addQualityLevel(QualityLevel qualityLevel)
 *   void removeQualityLevel(QualityLevel remove)
 *   QualityLevel? getQualityLevelById(DOMString id);
 *
 *   attribute EventHandler onchange;
 *   attribute EventHandler onaddqualitylevel;
 *   attribute EventHandler onremovequalitylevel;
 * };
 *
 * @extends videojs.EventTarget
 * @class QualityLevelList
 */
var QualityLevelList = function (_videojs$EventTarget) {
  _inherits(QualityLevelList, _videojs$EventTarget);

  function QualityLevelList() {
    var _ret;

    _classCallCheck(this, QualityLevelList);

    var _this = _possibleConstructorReturn(this, _videojs$EventTarget.call(this));

    var list = _this; // eslint-disable-line

    if (_video2['default'].browser.IS_IE8) {
      list = _document2['default'].createElement('custom');
      for (var prop in QualityLevelList.prototype) {
        if (prop !== 'constructor') {
          list[prop] = QualityLevelList.prototype[prop];
        }
      }
    }

    list.levels_ = [];
    list.selectedIndex_ = -1;

    /**
     * Get the index of the currently selected QualityLevel.
     *
     * @returns {number} The index of the selected QualityLevel. -1 if none selected.
     * @readonly
     */
    Object.defineProperty(list, 'selectedIndex', {
      get: function get() {
        return list.selectedIndex_;
      }
    });

    /**
     * Get the length of the list of QualityLevels.
     *
     * @returns {number} The length of the list.
     * @readonly
     */
    Object.defineProperty(list, 'length', {
      get: function get() {
        return list.levels_.length;
      }
    });

    return _ret = list, _possibleConstructorReturn(_this, _ret);
  }

  /**
   * Adds a quality level to the list.
   *
   * @param {Representation|Object} representation The representation of the quality level
   * @param {string}   representation.id        Unique id of the QualityLevel
   * @param {number=}  representation.width     Resolution width of the QualityLevel
   * @param {number=}  representation.height    Resolution height of the QualityLevel
   * @param {number}   representation.bandwidth Bitrate of the QualityLevel
   * @param {Function} representation.enabled   Callback to enable/disable QualityLevel
   * @return {QualityLevel} the QualityLevel added to the list
   * @method addQualityLevel
   */


  QualityLevelList.prototype.addQualityLevel = function addQualityLevel(representation) {
    var qualityLevel = this.getQualityLevelById(representation.id);

    // Do not add duplicate quality levels
    if (qualityLevel) {
      return qualityLevel;
    }

    var index = this.levels_.length;

    qualityLevel = new _qualityLevel2['default'](representation);

    if (!('' + index in this)) {
      Object.defineProperty(this, index, {
        get: function get() {
          return this.levels_[index];
        }
      });
    }

    this.levels_.push(qualityLevel);

    this.trigger({
      qualityLevel: qualityLevel,
      type: 'addqualitylevel'
    });

    return qualityLevel;
  };

  /**
   * Removes a quality level from the list.
   *
   * @param {QualityLevel} remove QualityLevel to remove to the list.
   * @return {QualityLevel|null} the QualityLevel removed or null if nothing removed
   * @method removeQualityLevel
   */


  QualityLevelList.prototype.removeQualityLevel = function removeQualityLevel(qualityLevel) {
    var removed = null;

    for (var i = 0, l = this.length; i < l; i++) {
      if (this[i] === qualityLevel) {
        removed = this.levels_.splice(i, 1)[0];

        if (this.selectedIndex_ === i) {
          this.selectedIndex_ = -1;
        } else if (this.selectedIndex_ > i) {
          this.selectedIndex_--;
        }
        break;
      }
    }

    if (removed) {
      this.trigger({
        qualityLevel: qualityLevel,
        type: 'removequalitylevel'
      });
    }

    return removed;
  };

  /**
   * Searches for a QualityLevel with the given id.
   *
   * @param {string} id The id of the QualityLevel to find.
   * @returns {QualityLevel|null} The QualityLevel with id, or null if not found.
   * @method getQualityLevelById
   */


  QualityLevelList.prototype.getQualityLevelById = function getQualityLevelById(id) {
    for (var i = 0, l = this.length; i < l; i++) {
      var level = this[i];

      if (level.id === id) {
        return level;
      }
    }
    return null;
  };

  /**
   * Resets the list of QualityLevels to empty
   *
   * @method dispose
   */


  QualityLevelList.prototype.dispose = function dispose() {
    this.selectedIndex_ = -1;
    this.levels_.length = 0;
  };

  return QualityLevelList;
}(_video2['default'].EventTarget);

/**
 * change - The selected QualityLevel has changed.
 * addqualitylevel - A QualityLevel has been added to the QualityLevelList.
 * removequalitylevel - A QualityLevel has been removed from the QualityLevelList.
 */


QualityLevelList.prototype.allowedEvents_ = {
  change: 'change',
  addqualitylevel: 'addqualitylevel',
  removequalitylevel: 'removequalitylevel'
};

// emulate attribute EventHandler support to allow for feature detection
for (var event in QualityLevelList.prototype.allowedEvents_) {
  QualityLevelList.prototype['on' + event] = null;
}

exports['default'] = QualityLevelList;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./quality-level.js":5,"global/document":2}],5:[function(require,module,exports){
(function (global){
'use strict';

exports.__esModule = true;

var _video = (typeof window !== "undefined" ? window['videojs'] : typeof global !== "undefined" ? global['videojs'] : null);

var _video2 = _interopRequireDefault(_video);

var _document = require('global/document');

var _document2 = _interopRequireDefault(_document);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * A single QualityLevel.
 *
 * interface QualityLevel {
 *   readonly attribute DOMString id;
 *            attribute DOMString label;
 *   readonly attribute long width;
 *   readonly attribute long height;
 *   readonly attribute long bitrate;
 *            attribute boolean enabled;
 * };
 *
 * @class QualityLevel
 */
var QualityLevel =

/**
 * Creates a QualityLevel
 *
 * @param {Representation|Object} representation The representation of the quality level
 * @param {string}   representation.id        Unique id of the QualityLevel
 * @param {number=}  representation.width     Resolution width of the QualityLevel
 * @param {number=}  representation.height    Resolution height of the QualityLevel
 * @param {number}   representation.bandwidth Bitrate of the QualityLevel
 * @param {Function} representation.enabled   Callback to enable/disable QualityLevel
 */
function QualityLevel(representation) {
  _classCallCheck(this, QualityLevel);

  var level = this; // eslint-disable-line

  if (_video2['default'].browser.IS_IE8) {
    level = _document2['default'].createElement('custom');
    for (var prop in QualityLevel.prototype) {
      if (prop !== 'constructor') {
        level[prop] = QualityLevel.prototype[prop];
      }
    }
  }

  level.id = representation.id;
  level.label = level.id;
  level.width = representation.width;
  level.height = representation.height;
  level.bitrate = representation.bandwidth;
  level.enabled_ = representation.enabled;

  Object.defineProperty(level, 'enabled', {
    /**
     * Get whether the QualityLevel is enabled.
     *
     * @returns {boolean} True if the QualityLevel is enabled.
     */
    get: function get() {
      return level.enabled_();
    },


    /**
     * Enable or disable the QualityLevel.
     *
     * @param {boolean} enable true to enable QualityLevel, false to disable.
     */
    set: function set(enable) {
      level.enabled_(enable);
    }
  });

  return level;
};

exports['default'] = QualityLevel;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"global/document":2}],6:[function(require,module,exports){
(function (global){
'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _document = require('global/document');

var _document2 = _interopRequireDefault(_document);

var _qunit = (typeof window !== "undefined" ? window['QUnit'] : typeof global !== "undefined" ? global['QUnit'] : null);

var _qunit2 = _interopRequireDefault(_qunit);

var _sinon = (typeof window !== "undefined" ? window['sinon'] : typeof global !== "undefined" ? global['sinon'] : null);

var _sinon2 = _interopRequireDefault(_sinon);

var _video = (typeof window !== "undefined" ? window['videojs'] : typeof global !== "undefined" ? global['videojs'] : null);

var _video2 = _interopRequireDefault(_video);

var _plugin = require('../src/plugin');

var _plugin2 = _interopRequireDefault(_plugin);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var Player = _video2['default'].getComponent('Player');

_qunit2['default'].test('the environment is sane', function (assert) {
  assert.strictEqual(_typeof(Array.isArray), 'function', 'es5 exists');
  assert.strictEqual(typeof _sinon2['default'] === 'undefined' ? 'undefined' : _typeof(_sinon2['default']), 'object', 'sinon exists');
  assert.strictEqual(typeof _video2['default'] === 'undefined' ? 'undefined' : _typeof(_video2['default']), 'function', 'videojs exists');
  assert.strictEqual(typeof _plugin2['default'] === 'undefined' ? 'undefined' : _typeof(_plugin2['default']), 'function', 'plugin is a function');
});

_qunit2['default'].module('videojs-contrib-quality-levels', {
  beforeEach: function beforeEach() {

    // Mock the environment's timers because certain things - particularly
    // player readiness - are asynchronous in video.js 5. This MUST come
    // before any player is created; otherwise, timers could get created
    // with the actual timer methods!
    this.clock = _sinon2['default'].useFakeTimers();

    this.fixture = _document2['default'].getElementById('qunit-fixture');
    this.video = _document2['default'].createElement('video');
    this.fixture.appendChild(this.video);
    this.player = (0, _video2['default'])(this.video);
  },
  afterEach: function afterEach() {
    this.player.dispose();
    this.clock.restore();
  }
});

_qunit2['default'].test('registers itself with video.js', function (assert) {
  assert.strictEqual(_typeof(Player.prototype.qualityLevels), 'function', 'videojs-contrib-quality-levels plugin was registered');
});

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"../src/plugin":3,"global/document":2}],7:[function(require,module,exports){
(function (global){
'use strict';

var _qunit = (typeof window !== "undefined" ? window['QUnit'] : typeof global !== "undefined" ? global['QUnit'] : null);

var _qunit2 = _interopRequireDefault(_qunit);

var _qualityLevelList = require('../src/quality-level-list');

var _qualityLevelList2 = _interopRequireDefault(_qualityLevelList);

var _testHelpers = require('./test-helpers');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

_qunit2['default'].module('QualityLevelList', {
  beforeEach: function beforeEach() {
    this.qualityLevels = new _qualityLevelList2['default']();
    this.levels = _testHelpers.representations;
  }
});

_qunit2['default'].test('Properly adds QualityLevels to the QualityLevelList', function (assert) {
  var addCount = 0;

  this.qualityLevels.on('addqualitylevel', function (event) {
    addCount++;
  });

  var expected0 = this.qualityLevels.addQualityLevel(this.levels[0]);

  assert.equal(this.qualityLevels.length, 1, 'added quality level');
  assert.equal(addCount, 1, 'emmitted addqualitylevel event');
  assert.strictEqual(this.qualityLevels[0], expected0, 'can access quality level with index');

  var expected1 = this.qualityLevels.addQualityLevel(this.levels[1]);

  assert.equal(this.qualityLevels.length, 2, 'added quality level');
  assert.equal(addCount, 2, 'emmitted addqualitylevel event');
  assert.strictEqual(this.qualityLevels[1], expected1, 'can access quality level with index');

  var expectedDuplicate = this.qualityLevels.addQualityLevel(this.levels[0]);

  assert.equal(this.qualityLevels.length, 2, 'does not add duplicate quality level');
  assert.equal(addCount, 2, 'no event emitted on dulicate');
  assert.strictEqual(this.qualityLevels[3], undefined, 'no index property defined');
  assert.strictEqual(this.qualityLevels[0], expected0, 'quality level unchanged');
  assert.strictEqual(this.qualityLevels[0], expectedDuplicate, 'adding duplicate returns same reference');
  assert.strictEqual(this.qualityLevels[1], expected1, 'quality level unchanged');
});

_qunit2['default'].test('Properly removes QualityLevels from the QualityLevelList', function (assert) {
  var _this = this;

  var removeCount = 0;
  var expected = [];

  this.levels.forEach(function (qualityLevel) {
    expected.push(_this.qualityLevels.addQualityLevel(qualityLevel));
  });

  this.qualityLevels.on('removequalitylevel', function (event) {
    removeCount++;
  });

  // Mock an initial selected quality level
  this.qualityLevels.selectedIndex_ = 2;

  assert.equal(this.qualityLevels.length, 4, '4 initial quality levels');

  var removed = this.qualityLevels.removeQualityLevel(expected[3]);

  assert.equal(this.qualityLevels.length, 3, 'removed quality level');
  assert.equal(removeCount, 1, 'emitted removequalitylevel event');
  assert.strictEqual(removed, expected[3], 'returned removed level');
  assert.notStrictEqual(this.qualityLevels[3], expected[3], 'nothing at index');

  removed = this.qualityLevels.removeQualityLevel(expected[1]);

  assert.equal(this.qualityLevels.length, 2, 'removed quality level');
  assert.equal(removeCount, 2, 'emitted removequalitylevel event');
  assert.strictEqual(removed, expected[1], 'returned removed level');
  assert.notStrictEqual(this.qualityLevels[1], expected[1], 'quality level not at index');
  assert.strictEqual(this.qualityLevels[this.qualityLevels.selectedIndex], expected[2], 'selected index properly adjusted on quality level removal');

  removed = this.qualityLevels.removeQualityLevel(expected[3]);

  assert.equal(this.qualityLevels.length, 2, 'no quality level removed if not found');
  assert.equal(removed, null, 'returned null when nothing removed');
  assert.equal(removeCount, 2, 'no event emitted when quality level not found');

  removed = this.qualityLevels.removeQualityLevel(expected[2]);

  assert.equal(this.qualityLevels.length, 1, 'quality level removed');
  assert.equal(removeCount, 3, 'emitted removequalitylevel event');
  assert.strictEqual(removed, expected[2], 'returned removed level');
  assert.equal(this.qualityLevels.selectedIndex, -1, 'selectedIndex set to -1 when removing selected quality level');
});

_qunit2['default'].test('can get quality level by id', function (assert) {
  var _this2 = this;

  var expected = [];

  this.levels.forEach(function (qualityLevel) {
    expected.push(_this2.qualityLevels.addQualityLevel(qualityLevel));
  });

  assert.strictEqual(this.qualityLevels.getQualityLevelById('0'), expected[0], 'found quality level with id "0"');
  assert.strictEqual(this.qualityLevels.getQualityLevelById('1'), expected[1], 'found quality level with id "1"');
  assert.strictEqual(this.qualityLevels.getQualityLevelById('2'), expected[2], 'found quality level with id "2"');
  assert.strictEqual(this.qualityLevels.getQualityLevelById('3'), expected[3], 'found quality level with id "3"');
  assert.strictEqual(this.qualityLevels.getQualityLevelById('4'), null, 'no quality level with id "4" found');
});

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"../src/quality-level-list":4,"./test-helpers":8}],8:[function(require,module,exports){
'use strict';

exports.__esModule = true;
var representations = exports.representations = [{
  id: '0',
  width: 100,
  height: 100,
  bandwidth: 100,
  enabled: function enabled() {
    return true;
  }
}, {
  id: '1',
  width: 200,
  height: 200,
  bandwidth: 200,
  enabled: function enabled() {
    return true;
  }
}, {
  id: '2',
  width: 300,
  height: 300,
  bandwidth: 300,
  enabled: function enabled() {
    return true;
  }
}, {
  id: '3',
  width: 400,
  height: 400,
  bandwidth: 400,
  enabled: function enabled() {
    return true;
  }
}];

},{}]},{},[6,7]);
