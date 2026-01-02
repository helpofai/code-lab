const { Post, User } = require('../models');
const { Op } = require('sequelize');

const calculateReadingTime = (text) => {
  if (!text || typeof text !== 'string') return 0;
  const wordsPerMinute = 200;
  const words = text.split(/\s+/).length;
  return Math.ceil(words / wordsPerMinute);
};

const createPost = async (req, res, next) => {
  try {
    const { title, content, excerpt, featuredImage, status, tags } = req.body;
    const userId = req.user.id;
    
    console.log('Creating post for user:', userId);

    const post = await Post.create({ 
      title, 
      content, 
      excerpt, 
      featuredImage, 
      status: status || 'draft',
      tags: tags || '',
      readingTime: calculateReadingTime(content),
      userId 
    });
    
    res.status(201).json(post);
  } catch (error) {
    console.error('Create Post Error:', error);
    next(error);
  }
};

const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.findAll({
      where: { status: 'published' },
      order: [['createdAt', 'DESC']],
      include: { model: User, as: 'user', attributes: ['username', 'id'] }
    });
    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getPostById = async (req, res) => {
  try {
    const post = await Post.findByPk(req.params.id, { 
      include: { model: User, as: 'user', attributes: ['username', 'id'] } 
    });
    
    if (!post) return res.status(404).json({ message: 'Post not found' });
    
    // Check if draft and user is not author
    if (post.status === 'draft') {
       if (!req.user || req.user.id !== post.userId) {
          return res.status(403).json({ message: 'Unauthorized to view this draft' });
       }
    }
    
    // Increment view count if published
    if (post.status === 'published') {
      post.views += 1;
      await post.save();
    }
    
    res.json(post);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getUserPosts = async (req, res, next) => {
  try {
    console.log('Fetching posts for user:', req.user.id);
    const posts = await Post.findAll({ 
        where: { userId: req.user.id },
        order: [['updatedAt', 'DESC']]
    });
    res.json(posts);
  } catch (error) {
    console.error('GetUserPosts Error:', error);
    next(error);
  }
};

const updatePost = async (req, res) => {
  try {
    const { title, content, excerpt, featuredImage, status, tags } = req.body;
    const post = await Post.findByPk(req.params.id);
    
    if (!post) return res.status(404).json({ message: 'Post not found' });
    
    // Authorization check
    if (post.userId !== req.user.id && req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Unauthorized' });
    }
    
    await post.update({ 
        title, 
        content, 
        excerpt, 
        featuredImage, 
        status, 
        tags,
        readingTime: content ? calculateReadingTime(content) : post.readingTime
    });
    res.json(post);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deletePost = async (req, res) => {
    try {
        const post = await Post.findByPk(req.params.id);
        if (!post) return res.status(404).json({ message: 'Post not found' });

        // Authorization check
        if (post.userId !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Unauthorized' });
        }

        await post.destroy();
        res.json({ message: 'Post deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { 
  createPost, 
  getAllPosts, 
  getPostById, 
  getUserPosts, 
  updatePost, 
  deletePost 
};
