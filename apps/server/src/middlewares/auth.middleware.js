const jwt = require('jsonwebtoken');
const { User } = require('../models');

const authMiddleware = async (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ message: 'No token, authorization denied' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Fetch latest user data from DB to ensure role is accurate
    const user = await User.findByPk(decoded.id, {
        attributes: ['id', 'username', 'email', 'role', 'status']
    });

    if (!user) {
        return res.status(401).json({ message: 'User no longer exists' });
    }

    if (user.status === 'suspended') {
        return res.status(403).json({ message: 'Your account has been suspended.' });
    }

    req.user = user; 
    next();
  } catch (err) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};

const optionalAuth = async (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) {
    return next();
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findByPk(decoded.id, {
        attributes: ['id', 'username', 'email', 'role', 'status']
    });
    if (user && user.status !== 'suspended') {
        req.user = user;
    }
    next();
  } catch (err) {
    next();
  }
};

const adminMiddleware = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(403).json({ message: 'Access denied. Admin only.' });
    }
};

module.exports = { authMiddleware, optionalAuth, adminMiddleware };