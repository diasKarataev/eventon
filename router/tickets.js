const express = require('express');
const router = express.Router();
const {body} = require('express-validator');
const ticketController = require("../controller/ticket-controller");



router.get('/event-tickets/:id', ticketController.getEventTickets);
router.post('/buy-ticket/:id', ticketController.buyEventTicket);
router.post('/check-ticket/:link', ticketController.activate);
router.get('/mytickets', ticketController.getUserTickets);
router.get('/paymentlink/:ticket', ticketController.getPaymentLink)


module.exports = router;