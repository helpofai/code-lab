const { User } = require('../models');

const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.findAll({
      attributes: { exclude: ['password'] },
      order: [['createdAt', 'DESC']]
    });
    res.json(users);
  } catch (error) {
    next(error);
  }
};

const createUser = async (req, res, next) => {
    try {
        const { username, email, password, role, isVerified } = req.body;
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ message: 'User with this email already exists' });
        }
        const user = await User.create({ username, email, password, role, isVerified });
        res.status(201).json({ message: 'User created successfully', user: { id: user.id, username, email, role, isVerified } });
    } catch (error) {
        next(error);
    }
};

const updateUser = async (req, res, next) => {
    try {
        const { username, email, role, isVerified, status } = req.body;
        const user = await User.findByPk(req.params.id);
        
        if (!user) return res.status(404).json({ message: 'User not found' });
        
        if (user.id === req.user.id && role && role !== 'admin') {
            return res.status(400).json({ message: 'You cannot demote yourself from admin.' });
        }

        await user.update({ username, email, role, isVerified, status });
        res.json({ message: 'User updated successfully', user });
    } catch (error) {
        next(error);
    }
};

const deleteUser = async (req, res, next) => {
    try {
        const user = await User.findByPk(req.params.id);
        if (!user) return res.status(404).json({ message: 'User not found' });
        
        if (user.id === req.user.id) {
            return res.status(400).json({ message: 'You cannot delete yourself.' });
        }

        await user.destroy();
        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        next(error);
    }
};

const toggleUserStatus = async (req, res, next) => {
    try {
        const user = await User.findByPk(req.params.id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        const newStatus = user.status === 'active' ? 'suspended' : 'active';
        await user.update({ status: newStatus });
        res.json({ message: `User ${newStatus}`, status: newStatus });
    } catch (error) {
        next(error);
    }
};

module.exports = { getAllUsers, createUser, updateUser, deleteUser, toggleUserStatus };