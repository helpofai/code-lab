const { Pen, User } = require('../models');
const { Op } = require('sequelize');

const createPen = async (req, res) => {
  try {
    const { title, html, css, js } = req.body;
    const userId = req.user ? req.user.id : null;
    const pen = await Pen.create({ title, html, css, js, userId });
    res.status(201).json(pen);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getPen = async (req, res) => {
  try {
    const pen = await Pen.findByPk(req.params.id, { include: { model: User, as: 'user', attributes: ['username'] } });
    if (!pen) return res.status(404).json({ message: 'Pen not found' });
    
    // Increment view count
    pen.views += 1;
    await pen.save();
    
    res.json(pen);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updatePen = async (req, res) => {
  try {
    const { title, html, css, js } = req.body;
    const pen = await Pen.findByPk(req.params.id);
    if (!pen) return res.status(404).json({ message: 'Pen not found' });
    
    // Authorization check
    if (pen.userId && (!req.user || (pen.userId !== req.user.id && req.user.role !== 'admin'))) {
        return res.status(403).json({ message: 'Unauthorized' });
    }
    
    await pen.update({ title, html, css, js });
    res.json(pen);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deletePen = async (req, res) => {
    try {
        const pen = await Pen.findByPk(req.params.id);
        if (!pen) return res.status(404).json({ message: 'Pen not found' });

        // Authorization check
        if (pen.userId && (!req.user || (pen.userId !== req.user.id && req.user.role !== 'admin'))) {
            return res.status(403).json({ message: 'Unauthorized' });
        }

        await pen.destroy();
        res.json({ message: 'Pen deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const likePen = async (req, res) => {
  try {
    const pen = await Pen.findByPk(req.params.id);
    if (!pen) return res.status(404).json({ message: 'Pen not found' });
    
    pen.likes += 1;
    await pen.save();
    
    res.json({ likes: pen.likes });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getUserPens = async (req, res) => {
  try {
    const pens = await Pen.findAll({ 
        where: { userId: req.user.id },
        order: [['updatedAt', 'DESC']]
    });
    res.json(pens);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getRecentPens = async (req, res) => {
  try {
    const pens = await Pen.findAll({
      limit: 6,
      order: [['updatedAt', 'DESC']],
      include: { model: User, as: 'user', attributes: ['username'] }
    });
    res.json(pens);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getMostViewedPens = async (req, res) => {
  try {
    const pens = await Pen.findAll({
      limit: 6,
      order: [['views', 'DESC']],
      include: { model: User, as: 'user', attributes: ['username'] }
    });
    res.json(pens);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getPublicPens = async (req, res) => {
  try {
    const pens = await Pen.findAll({
      limit: 6,
      order: [['likes', 'DESC']],
      include: { model: User, as: 'user', attributes: ['username'] }
    });
    res.json(pens);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const searchPens = async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) return res.json([]);

    const pens = await Pen.findAll({
      where: {
        title: {
          [Op.like]: `%${q}%`
        }
      },
      limit: 12,
      include: { model: User, as: 'user', attributes: ['username'] }
    });
    res.json(pens);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createPen, getPen, updatePen, deletePen, likePen, getUserPens, getPublicPens, getRecentPens, getMostViewedPens, searchPens };