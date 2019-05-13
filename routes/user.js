const express = require('express');
const passport = require('passport');
const upload = require('../middleware/upload');
const controller = require('../controllers/user');
const router = express.Router();

router.get(
  '/',
  passport.authenticate('jwt', { session: false }),
  controller.getAll
);
router.get(
  '/:id',
  passport.authenticate('jwt', { session: false }),
  controller.getById
);
//router.delete('/:id', passport.authenticate('jwt', {session: false}), controller.remove);
//router.post('/', passport.authenticate('jwt', {session: false}), upload.single('image'), controller.create);
router.patch(
  '/:id',
  passport.authenticate('jwt', { session: false }),
  upload.single('image'),
  controller.update
);
//TODO: allow user update only user's profile (secure other users profiles)
router.patch(
  '/updatesettings/:id',
  passport.authenticate('jwt', { session: false }),
  controller.updateSettings
);

module.exports = router;
