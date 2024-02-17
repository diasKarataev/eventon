const eventTicket = require('../entity/ticket')
const UserModel = require('../entity/user');
const TicketModel = require('../entity/ticket')
const tokenService = require('../service/token-service');
const ApiError = require("../exceptions/api-error");
const getUserTicketsDto = require('../dto/getUserTickets-dto')
const uuid = require("uuid");
const paymentService = require('../service/payment-service');
const EventModel = require("../entity/event");
const OrderModel = require("../entity/order");

class TicketController {
    async getEventTickets(req,res,next){
        try {
            const eventId = req.params.id;
            const tickets = await eventTicket.find({event: eventId})
            if(!tickets) {
                throw ApiError.BadRequest('No tickets found')
            }
            res.json(tickets);
        } catch (e){
            next(e);
        }
    }

    async buyEventTicket(req, res, next){
        try {
            const { seat_row, seat_number } = req.body;

            // Retrieve user information
            const accessToken = req.headers.authorization;
            const tokenData = tokenService.validateAccessToken(accessToken);
            if (!tokenData) {
                throw ApiError.UnauthorizedError();
            }
            const user = await UserModel.findById(tokenData.id);

            // Ticket validation
            const eventId = req.params.id;
            const existingTicket = await eventTicket.findOne({ event: eventId, seat_row, seat_number });
            if (existingTicket) {
                return res.status(400).json({ message: 'Это место уже занято' });
            }

            // Ticket creation
            try {
                const event = await EventModel.findById(eventId);
                const order_id = uuid.v4();
                const invoiceModel = await paymentService.createInvoice(event.ticket_price, order_id, user.email);

                const newTicket = await eventTicket.create({
                    event: eventId,
                    seat_row,
                    seat_number,
                    user: user.id,
                    activationLink: uuid.v4()
                });

                await OrderModel.create({
                    paymentId: order_id,
                    user: user.id,
                    ticket: newTicket.id,
                    invoice_id: invoiceModel.result.uuid
                })

                res.json('Ticket created');
            } catch (e) {
                next(e);
            }
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
            const accessToken = req.headers.authorization;
            const tokenData = tokenService.validateAccessToken(accessToken);
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
}
module.exports = new TicketController();