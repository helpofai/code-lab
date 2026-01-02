const express = require('express');
const { 
  createPost, 
  getAllPosts, 
  getPostById, 
  getUserPosts, 
  updatePost, 
  deletePost 
} = require('../controllers/post.controller');
const { authMiddleware, optionalAuth } = require('../middlewares/auth.middleware');
const router = express.Router();

router.post('/', authMiddleware, createPost);
router.get('/', getAllPosts);
router.get('/user', authMiddleware, getUserPosts);
router.get('/:id', optionalAuth, getPostById);
router.put('/:id', authMiddleware, updatePost);
router.delete('/:id', authMiddleware, deletePost);

module.exports = router;
