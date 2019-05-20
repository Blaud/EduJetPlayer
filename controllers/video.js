const errorHandler = require('../utils/errorHandler');
const youtubedl = require('@microlink/youtube-dl');
const keys = require('../config/keys');

const subtitlesDlOptions = {
  // Write automatic subtitle file (youtube only)
  auto: true,
  // Downloads all the available subtitles.
  all: false,
  // Subtitle format. YouTube generated subtitles
  // are available ttml or vtt.
  format: 'vtt',
  // Languages of subtitles to download, separated by commas.
  // TODO: download for all selected(by user) languages
  lang: 'en,ru,es',
  // The directory to save the downloaded files in.
  cwd: 'uploads/',
};

module.exports.getAll = async function(req, res) {
  try {
    res.status(200).json(req);
  } catch (e) {
    errorHandler(res, e);
  }
};

module.exports.getById = async function(req, res) {
  try {
    res.status(200).json(req);
  } catch (e) {
    errorHandler(res, e);
  }
};

module.exports.remove = async function(req, res) {
  try {
    res.status(200).json(req);
  } catch (e) {
    errorHandler(res, e);
  }
};

module.exports.create = async function(req, res) {
  try {
    res.status(200).json(req);
  } catch (e) {
    errorHandler(res, e);
  }
};

module.exports.update = async function(req, res) {
  try {
    res.status(200).json(req);
  } catch (e) {
    errorHandler(res, e);
  }
};

module.exports.getYoutubeDirectUrl = async function(req, res) {
  try {
    youtubedl.getInfo(req.body.ytUrl, function(err, info) {
      if (err) throw err;
      info.corsUrl = keys.corsAnyWhereServer + info.url;
      res.status(200).json(info);
    });
  } catch (e) {
    errorHandler(res, e);
  }
};

module.exports.getYoutubeSubtitles = async function(req, res) {
  try {
    youtubedl.getSubs(req.body.ytUrl, subtitlesDlOptions, function(err, files) {
      if (err) errorHandler(res, err);
      let liksToSubs = [];
      files.forEach(function(element) {
        liksToSubs.push(req.headers.host + '/uploads/' + element);
      });
      res.status(200).json(liksToSubs);
    });
  } catch (e) {
    errorHandler(res, e);
  }
};
