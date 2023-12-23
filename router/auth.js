const express = require('express');
const router = express.Router();

const userController = require('../controller/auth-controller')

router.post('/registration', userController.registration);
router.post('/login', userController.login);
router.post('/logout', userController.logout);
router.post('/activate/:link', userController.activate);
router.post('/refresh', userController.refresh);
router.post('/users', userController.users);

module.exports = router;