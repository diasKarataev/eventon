const express = require('express');
const router = express.Router();
const {body} = require('express-validator');

const authController = require('../controller/auth-controller')

router.post('/registration',
    body('email').isEmail(),
    body('password').isLength({min: 3, max:32}),
    authController.registration);
router.post('/login', authController.login);
router.post('/logout', authController.logout);
router.get('/activate/:link', authController.activate);
router.get('/refresh', authController.refresh);

module.exports = router;