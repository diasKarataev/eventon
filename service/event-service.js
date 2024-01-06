const EventModel = require("../entity/event");
const ApiError = require('../exceptions/api-error');

class EventModelService {
    async getEvents() {
        try {
            return await EventModel.find();
        } catch (error) {
            throw new Error(error.message);
        }
    }
    async getEvent(EventId){
        const EventModel = await EventModel.findById(EventId);
        if (!EventModel) {
            throw ApiError.BadRequest('Event not found');
        }
        return EventModel;
    }
    async createEvent(title, description, capacity, ticket_price) {
        try {
            const newEventModel = new EventModel({ title, description,capacity,ticket_price });
            return await newEventModel.save();
        } catch (error) {
            throw new Error(error.message);
        }
    }
    async updateEvent(EventModelId, title, description, capacity, ticket_price){
        const updatedEventModel = await EventModel.findByIdAndUpdate(EventModelId, {title, description, capacity, ticket_price}, {new: true});
        if (!updatedEventModel) {
            throw ApiError.BadRequest('Cannot find EventModel');
        }
        return updatedEventModel;
    }
    async deleteEvent(EventModelId){
        const EventModel = await EventModel.findByIdAndDelete(EventModelId);
        if (EventModel == null) {
            throw ApiError.BadRequest('Cannot find EventModel');
        }
    }
}
module.exports = new EventModelService();