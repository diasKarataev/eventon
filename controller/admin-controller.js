const paymentService = require('../service/payment-service');
const mailingService = require('../service/mail-service');
const userService = require('../service/user-service');
class AdminController {
    async getInvoiceList(req, res, next) {
        try {
            res.json(await paymentService.getInvoices());
        } catch (e) {
            next(e);
        }
    }

    async createInvoice(req, res, next){
        try {
            const { amount, order_id, email } = req.body;
            res.json(await paymentService.createInvoice(amount,order_id,email));
        } catch (e) {
            next(e);
        }
    }
    
    async acceptPayment(req, res, next){
        try {
            const id = req.params.id;
            res.json(await paymentService.invoicePostback(id));
        } catch (e) {
            next(e);
        }
    }
    async sendMailing(req, res, next){
        try {
            const { message } = req.body;
            const mails = await userService.getAllUsersEmails();
            await mailingService.sendMailing(mails, message);
            res.json('Email message send to all users');
        } catch (e) {
            next(e);
        }
    }
}

module.exports = new AdminController();