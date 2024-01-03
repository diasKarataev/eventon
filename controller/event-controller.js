const eventService = require('../service/event-service')


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
            next(e);
        }
    }
    async createEvent(req, res, next) {
        try {
            const { title, description } = req.body;
            const savedEvent = await eventService.createEvent(title, description);
            res.json(savedEvent);
        } catch (error) {
            next(error);
        }
    }


    async updateEvent(req, res, next){
        try {
            const eventId = req.params.id;
            const { title, description } = req.body;
            const updatedEvent = await eventService.updateEvent(eventId, title, description);
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