'use strict';

exports.__esModule = true;

var _video = require('video.js');

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