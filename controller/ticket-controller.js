const eventTicket = require('../entity/ticket')
const UserModel = require('../entity/user');
const TicketModel = require('../entity/ticket')
const tokenService = require('../service/token-service');
const ApiError = require("../exceptions/api-error");
const getUserTicketsDto = require('../dto/getUserTickets-dto')
const uuid = require("uuid");
const paymentService = require('../service/payment-service');
const EventModel = require("../entity/event");

class TicketController {
    async getEventTickets(req,res,next){
        const eventId = req.params.id;
        res.json(await eventTicket.find({event: req.params.id}));
    }

    async buyEventTicket(req, res, next){
        const {refreshToken} = req.cookies;
        const tokenData = tokenService.validateRefreshToken(refreshToken);
        const user = await UserModel.findById(tokenData.id);

        const eventId = req.params.id;
        const {seat_row, seat_number} = req.body;
        const existingTicket = await eventTicket.findOne({ event: eventId, seat_row, seat_number });
        if (existingTicket) {
            return res.status(400).json({ message: 'Это место уже занято' });
        }
        const activationLink = uuid.v4();
        const order_id = uuid.v4();
        try {
            await eventTicket.create(
                {
                    event: eventId,
                    seat_row,
                    seat_number,
                    user: user.id,
                    activationLink,
                    order_id
                }
            );
            const event = await EventModel.findById(eventId);
            const amount = event.ticket_price;
            const invoiceModel = await paymentService.createInvoice(amount,order_id, user.email);
            res.json(invoiceModel);
        } catch (e) {
            next(e);
        }
    }

    async activate(req, res, next) {
        try {
            const activationLink = req.params.link;

            const ticket = await TicketModel.findOne({activationLink});

            if (!ticket) {
                return res.status(400).json({ message: 'Incorrect activation link' });
            }
            if(ticket.isActivated === true){
                return res.status(400).json({ message: 'The ticket is already activated' });
            }
            if(ticket.isPayed === false){
                return res.status(400).json({ message: 'The ticket is not paid' });
            }
            ticket.isActivated = true;
            await ticket.save();

            return res.redirect(process.env.CLIENT_URL);
        } catch (error) {
            next(error);
        }
    }


    async getUserTickets(req, res, next) {
        try {
            const { refreshToken } = req.cookies;
            const tokenData = tokenService.validateRefreshToken(refreshToken);
            const user = await UserModel.findById(tokenData.id);
            const tickets = await TicketModel.find({ user: user.id });

            const ticketDTOArray = [];

            for (const ticket of tickets) {
                const dto = new getUserTicketsDto(ticket);
                ticketDTOArray.push(dto);
            }
            res.json(ticketDTOArray);
        } catch (e) {
            next(e);
        }
    }
    async postbackOrder(req, res, next){
        console.log("POSTBACK")
        const { status, invoice_id, amount_crypto, currency, order_id, token } = req.body;
        await paymentService.invoicePostback(order_id);
        const responseJson = {
            "status": status,
            "invoice_id": invoice_id,
            "amount_crypto": amount_crypto,
            "currency": currency
        };
        res.json(
            responseJson
        );
    }
}
module.exports = new TicketController();