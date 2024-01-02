const express = require('express');
const router = express.Router();
const {body} = require('express-validator');

const userController = require('../controller/auth-controller')

router.post('/registration',
    body('email').isEmail(),
    body('password').isLength({min: 3, max:32}),
    userController.registration);
router.post('/login', userController.login);
router.post('/logout', userController.logout);
router.get('/activate/:link', userController.activate);
router.post('/refresh', userController.refresh);
router.post('/users', userController.users);

module.exports = router;