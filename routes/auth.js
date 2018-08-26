const express = require('express');
const router = express.Router();
const controller = require('../controllers/auth');

// host:port/api/auth/login
router.post('/login', controller.login);
// host:port/api/auth/register
router.post('/register', controller.register);

module.exports = router;
