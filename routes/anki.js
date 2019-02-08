const express = require('express');
const passport = require('passport');
const upload = require('../middleware/upload');
const controller = require('../controllers/anki');
const router = express.Router();

router.get('/:DeckId', passport.authenticate('jwt', {session: false}), controller.getAnki);

module.exports = router;