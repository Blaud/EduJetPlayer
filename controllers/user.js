const User = require('../models/User');
const errorHandler = require('../utils/errorHandler');

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

module.exports.updateSettings = async function(req, res) {
  try {
    const user = await User.findOneAndUpdate(
      { _id: req.params.id },
      {
        $set: {
          lastDeckName: req.body.lastDeckName,
          lastModelName: req.body.lastModelName,
        },
      },
      { new: true }
    );
    user.password = 'secured';
    res.status(200).json(user);
  } catch (e) {
    errorHandler(res, e);
  }
};
