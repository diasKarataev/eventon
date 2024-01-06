const eventService = require('../service/event-service')
const ApiError = require("../exceptions/api-error");


class EventController {
    async getEvents(req, res, next) {
        try {
            const events = await eventService.getEvents();
            res.json(events);
        } catch (error) {
            next(error);
        }
    }

    async getEvent(req, res, next) {
        try {
            const eventId = req.params.id;
            const event = await eventService.getEvent(eventId);
            res.json(event);

        } catch (e) {
            return res.status(400).json({ message: 'Not found' });
        }
    }
    async createEvent(req, res, next) {
        try {
            const { title, description, capacity, ticket_price } = req.body;
            const savedEvent = await eventService.createEvent(title, description, capacity, ticket_price);
            res.json(savedEvent);
        } catch (error) {
            next(error);
        }
    }

    async updateEvent(req, res, next){
        try {
            const eventId = req.params.id;
            const { title, description, capacity, ticket_price } = req.body;
            const updatedEvent = await eventService.updateEvent(eventId, title, description, capacity, ticket_price);
            res.json(updatedEvent);
        } catch (e) {
            next(e);
        }
    }


    async deleteEvent(req, res, next){
        try {
            const event = await eventService.deleteEvent(req.params.id)
            res.json({ message: 'Event deleted successfully' });
        } catch (e) {
            next(e);
        }
    }
}

module.exports = new EventController();