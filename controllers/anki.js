const errorHandler = require('../utils/errorHandler');

module.exports.getAnki = async function (req, res) {
    try{
        res.status(200).json(req);
    }catch (e) {
        errorHandler(res, e);
    }
};