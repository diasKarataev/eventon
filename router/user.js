const express = require('express');
const router = express.Router();
const {body} = require('express-validator');
const authMiddleware = require('../middleware/auth-middleware');

const userController = require('../controller/user-controller')

router.get('', authMiddleware, userController.getUsers);

module.exports = router;