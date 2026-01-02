const express = require('express');
const { getAdminStats } = require('../controllers/analytics.controller');
const { authMiddleware, adminMiddleware } = require('../middlewares/auth.middleware');
const router = express.Router();

router.get('/stats', authMiddleware, adminMiddleware, getAdminStats);

module.exports = router;
