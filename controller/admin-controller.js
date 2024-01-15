const axios = require('axios');
const {response} = require('express');
const paymentService = require('../service/payment-service')

class AdminController {
    async getInvoiceList(req, res, next) {
        res.json(await paymentService.getInvoices());
    }


    async createInvoice(req, res, next){
        const { amount, order_id, email } = req.body;
        res.json(await paymentService.createInvoice(amount,order_id,email));

    }
    
    async acceptPayment(req, res){
        const id = req.params.id;
        res.json(await paymentService.invoicePostback(id));
    }
}

module.exports = new AdminController();