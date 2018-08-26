const express = require('express');
const router = express.Router();
const controller = require('../../controllers/online_shop/analytics');

router.get('/overview', controller.overview);
router.get('/analytics', controller.analytics);

module.exports = router;
