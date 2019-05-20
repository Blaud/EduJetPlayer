const errorHandler = require('../utils/errorHandler');
const translator = require('google-translator');

module.exports.translate = async function(req, res) {
  try {
    if (req.body.from) {
      translator(req.body.from, req.body.to, req.body.text, response => {
        res.status(200).json(response);
      });
    } else {
      translator(undefined, req.body.to, req.body.text, response => {
        res.status(200).json(response);
      });
    }
  } catch (e) {
    errorHandler(res, e);
  }
};
