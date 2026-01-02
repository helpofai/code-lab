const express = require('express');
const { getAllScripts, getActiveScripts, createScript, updateScript, deleteScript } = require('../controllers/script.controller');
const { authMiddleware, adminMiddleware } = require('../middlewares/auth.middleware');
const router = express.Router();

// Public route for injection
router.get('/active', getActiveScripts);

// Admin routes
router.get('/', authMiddleware, adminMiddleware, getAllScripts);
router.post('/', authMiddleware, adminMiddleware, createScript);
router.put('/:id', authMiddleware, adminMiddleware, updateScript);
router.delete('/:id', authMiddleware, adminMiddleware, deleteScript);

module.exports = router;
