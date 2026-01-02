const express = require('express');
const { getAllUsers, createUser, updateUser, deleteUser, toggleUserStatus } = require('../controllers/user.controller');
const { authMiddleware, adminMiddleware } = require('../middlewares/auth.middleware');
const router = express.Router();

router.use(authMiddleware, adminMiddleware);

router.get('/', getAllUsers);
router.post('/', createUser);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);
router.patch('/:id/status', toggleUserStatus);

module.exports = router;