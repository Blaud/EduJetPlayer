const errorHandler = require('../utils/errorHandler');

module.exports.getAll = async function (req, res) {
    try{
        res.status(200).json(req);
    }catch (e) {
        errorHandler(res, e);
    }
};

module.exports.getById = async function (req, res) {
    try{
        res.status(200).json(req);
    }catch (e) {
        errorHandler(res, e);
    }
};

module.exports.remove = async function (req, res) {
    try{
        res.status(200).json(req);
    }catch (e) {
        errorHandler(res, e);
    }
};

module.exports.create = async function (req, res) {
    try{
        res.status(200).json(req);
    }catch (e) {
        errorHandler(res, e);
    }
};

module.exports.update = async function (req, res) {
    try{
        res.status(200).json(req);
    }catch (e) {
        errorHandler(res, e);
    }
};