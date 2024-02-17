const axios = require("axios");
const TicketModel = require("../entity/ticket");
const OrderModel = require("../entity/order");
const ApiError = require("../exceptions/api-error");

class PaymentService {
    async getInvoices() {
        const currentDate = new Date();
        const response = await axios.post(
            'https://api.cryptocloud.plus/v2/invoice/merchant/list',
            {
                start: "01.01.2023",
                end: `${currentDate.getDate()}.${currentDate.getMonth()+1}.${currentDate.getFullYear()}`,
                offset: 0,
                limit: 10
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Token ${process.env.ACQUIRING_API_KEY}`
                }
            }
        );
        return response.data;
    }

    async createInvoice(amount, order_id, email) {
        const response = await axios.post(
            'https://api.cryptocloud.plus/v2/invoice/create',
            {
                shop_id: process.env.SHOP_ID,
                amount: amount,
                currency: "KZT",
                order_id: order_id,
                add_fields: {
                    email_to_send: email,
                    time_to_pay: { "hours": 0, "minutes": 30 }
                }
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Token ${process.env.ACQUIRING_API_KEY}`
                }
            }
        );
        return response.data;
    }

    async invoicePostback(paymentId) {
        const order = await OrderModel.findOne({paymentId});
        if(!order){
            throw ApiError.BadRequest('Ticket not found')
        }
        const ticket = await TicketModel.findById(order.ticket)
        ticket.isPaid = true;
        return await ticket.save();
    }
}
module.exports = new PaymentService();