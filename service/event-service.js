const Event = require("../entity/event");
const ApiError = require('../exceptions/api-error');

class EventService {
    async getEvents() {
        try {
            return await Event.find();
        } catch (error) {
            throw new Error(error.message);
        }
    }
    async getEvent(eventId){
        const event = await Event.findById(eventId);
        if (!event) {
            throw ApiError.BadRequest('Event not found');
        }
        return event;
    }
    async createEvent(title, description) {
        try {
            const newEvent = new Event({ title, description });
            return await newEvent.save();
        } catch (error) {
            throw new Error(error.message);
        }
    }
    async updateEvent(eventId, title, description){
        const updatedEvent = await Event.findByIdAndUpdate(eventId, {title, description}, {new: true});
        if (!updatedEvent) {
            throw ApiError.BadRequest('Cannot find event');
        }
        return updatedEvent;
    }
    async deleteEvent(eventId){
        const event = await Event.findByIdAndDelete(eventId);
        if (event == null) {
            throw ApiError.BadRequest('Cannot find event');
        }
    }
}
module.exports = new EventService();