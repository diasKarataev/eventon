const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth-middleware');
const adminMiddleware = require('../middleware/auth-admin-middleware');
const userController = require('../controller/user-controller')

router.get('', authMiddleware, userController.getUsers);
router.get('/admin', authMiddleware, userController.makeMeAdmin);
router.get('/user', authMiddleware, userController.makeMeUser);
module.exports = router;