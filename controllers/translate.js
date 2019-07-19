const errorHandler = require('../utils/errorHandler');
const translator = require('googletranslatefree');

module.exports.translate = async function(req, res) {
  try {
    if (req.body.from) {
      await translator(req.body.from, req.body.to, req.body.text, response => {
        res.status(200).json(response);
      });
    } else {
      await translator(undefined, req.body.to, req.body.text, response => {
        res.status(200).json(response);
      });
    }
  } catch (e) {
    errorHandler(res, e);
  }
};
