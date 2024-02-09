const EventModel = require("../entity/event");
const ApiError = require('../exceptions/api-error');

class EventModelService {
    async getEvents() {
        return await EventModel.find();
    }
    async getEvent(eventId) {
        const event = await EventModel.findOne({_id: eventId});
        if (!event) {
            throw ApiError.BadRequest('Event not found')
        }
        return event;
    }
    async createEvent(title, description, capacity, ticket_price) {
        const newEventModel = new EventModel({ title, description,capacity,ticket_price });
        return await newEventModel.save();
    }
    async updateEvent(eventId, title, description, capacity, ticket_price) {
        const updateFields = {};
        if (title) updateFields.title = title;
        if (description) updateFields.description = description;
        if (capacity) updateFields.capacity = capacity;
        if (ticket_price) updateFields.ticket_price = ticket_price;

        const event = await EventModel.findOneAndUpdate(
            { _id: eventId },
            updateFields,
            { new: true }
        );

        if (!event) {
            throw ApiError.BadRequest('Event not found');
        }

        return event;
    }
    async deleteEvent(eventId){
        const event = await EventModel.findOneAndDelete({_id: eventId});
        if(!event){
            throw ApiError.BadRequest('Event not found')
        }
    }
}
module.exports = new EventModelService();