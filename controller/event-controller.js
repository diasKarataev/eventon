const eventService = require('../service/event-service')

class EventController {
    async getEvents(req, res, next) {
        try {
            const events = await eventService.getEvents();
            res.json(events);
        } catch (e) {
            next(e);
        }
    }

    async getEvent(req, res, next) {
        try {
            const eventId = req.params.id;
            const event = await eventService.getEvent(eventId);
            res.json(event);
        } catch (e) {
            next(e);
        }
    }
    async createEvent(req, res, next) {
        try {
            const { title, description, capacity, ticket_price, city, map_latitude, map_longitude } = req.body;
            const savedEvent = await eventService.createEvent(title, description, capacity, ticket_price, city, map_latitude, map_longitude);
            res.json(savedEvent);
        } catch (e) {
            next(e);
        }
    }

    async updateEvent(req, res, next){
        try {
            const eventId = req.params.id;
            const { title, description, capacity, ticket_price, city, map_latitude, map_longitude } = req.body;
            const updatedEvent = await eventService.updateEvent(eventId, title, description, capacity, ticket_price, city, map_latitude, map_longitude);
            res.json(updatedEvent);
        } catch (e) {
            next(e);
        }
    }


    async deleteEvent(req, res, next){
        try {
            await eventService.deleteEvent(req.params.id)
            res.json({ message: 'Event deleted successfully' });
        } catch (e) {
            next(e);
        }
    }
}

module.exports = new EventController();