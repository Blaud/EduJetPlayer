const errorHandler = require('../utils/errorHandler');
const translator = require('google-translator');

module.exports.translate = async function(req, res) {
  try {
    translator(req.body.from, req.body.to, req.body.text, response => {
      res.status(200).json(response);
    });
  } catch (e) {
    errorHandler(res, e);
  }
};
