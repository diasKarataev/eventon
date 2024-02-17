const OrderModel = require('../entity/order')
const paymentService = require('../service/payment-service');

class OrderController {
    async getOrders(req, res, next){
        try {
            const orders = await OrderModel.find();
            res.json(orders);
        } catch (e){
            next(e);
        }
    }

    async getOrderById(req, res, next) {
        const orderId = req.params.id;
        try {
            const orders = await OrderModel.findById(orderId);
            res.json(orders);
        } catch (e){
            next(e);
        }
    }
    async postbackOrder(req, res, next){
        try {
            console.log("POSTBACK")
            const { status, invoice_id, amount_crypto, currency, order_id, token } = req.body;
            // TODO: Add status validation
            await paymentService.invoicePostback(order_id);
            const responseJson = {
                "status": status,
                "invoice_id": invoice_id,
                "amount_crypto": amount_crypto,
                "currency": currency
            };
            res.json(responseJson);
        } catch (e){
            next(e);
        }

    }
}
module.exports = new OrderController();