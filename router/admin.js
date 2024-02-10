const express = require("express");
const adminController = require("../controller/admin-controller");
const router = express.Router();




router.get('/invoice-list', adminController.getInvoiceList);
router.post('/create-invoice', adminController.createInvoice);
router.post('/accept-invoice/:id', adminController.acceptPayment);
router.post('/mail', adminController.sendMailing);


module.exports = router;