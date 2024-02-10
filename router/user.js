const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth-middleware');
const adminMiddleware = require('../middleware/auth-admin-middleware');
const userController = require('../controller/user-controller')

router.get('', authMiddleware, userController.getUsers);
router.get('/profile', authMiddleware, userController.getProfile);
router.get('/:id', authMiddleware, userController.getUserById);
router.post('', authMiddleware, userController.createUser);
router.patch('/:id', authMiddleware, userController.updateUser);
router.delete('/:id', authMiddleware, userController.deleteUser);
router.post('/:id/toggle-subscription', authMiddleware, userController.toggleSubscription);
router.post('/resend-activation-link', authMiddleware, userController.resendActivationLink);
module.exports = router;