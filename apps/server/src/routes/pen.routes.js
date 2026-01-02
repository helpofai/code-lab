const express = require('express');
const { createPen, getPen, updatePen, deletePen, likePen, getUserPens, getPublicPens, getRecentPens, getMostViewedPens, searchPens } = require('../controllers/pen.controller');
const { authMiddleware, optionalAuth } = require('../middlewares/auth.middleware');
const router = express.Router();

router.post('/', optionalAuth, createPen);
router.get('/user', authMiddleware, getUserPens);
router.get('/public', getPublicPens);
router.get('/public/recent', getRecentPens);
router.get('/public/trending', getMostViewedPens);
router.get('/search', searchPens);
router.get('/:id', getPen);
router.put('/:id', optionalAuth, updatePen);
router.delete('/:id', authMiddleware, deletePen);
router.post('/:id/like', optionalAuth, likePen);

module.exports = router;