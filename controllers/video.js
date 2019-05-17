const errorHandler = require('../utils/errorHandler');
const youtubedl = require('@microlink/youtube-dl');
const keys = require('../config/keys');

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
