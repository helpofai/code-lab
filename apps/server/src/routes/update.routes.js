const express = require('express');
const { checkUpdate, downloadUpdate, applyUpdate, syncDatabase } = require('../controllers/update.controller');
const { authMiddleware, adminMiddleware } = require('../middlewares/auth.middleware');
const router = express.Router();

router.use(authMiddleware, adminMiddleware);

router.get('/check', checkUpdate);
router.post('/download', downloadUpdate);
router.post('/apply', applyUpdate);
router.post('/sync-db', syncDatabase);

module.exports = router;
