'use strict';

exports.__esModule = true;

var _video = require('video.js');

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
  player.qualityLevels.VERSION = '__VERSION__';

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
qualityLevels.VERSION = '__VERSION__';

exports['default'] = qualityLevels;