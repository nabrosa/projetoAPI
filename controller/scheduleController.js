const express = require('express');
const router = express.Router();
const scheduleService = require('../service/scheduleService');
const { authenticateJWT } = require('../service/authService');

router.post('/register', authenticateJWT, scheduleService.registerSchedule);

module.exports = router;
