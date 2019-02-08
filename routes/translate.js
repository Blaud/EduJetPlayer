const express = require('express');
const passport = require('passport');
const controller = require('../controllers/translate');
const router = express.Router();

router.post('/', passport.authenticate('jwt', {session: false}), controller.translate);

module.exports = router;