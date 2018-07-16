'use strict';

exports.__esModule = true;

var _video = require('video.js');

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