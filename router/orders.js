const express = require('express');
const router = express.Router();
const {body} = require('express-validator');
const orderController = require("../controller/order-controller");


router.get('', orderController.getOrders);
router.get('/:id', orderController.getOrderById);
router.post('/postback', orderController.postbackOrder);


module.exports = router;