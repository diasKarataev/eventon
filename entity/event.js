const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    ticket_price: {
        type: Number,
        require: true
    },
    capacity: {
        type: Number,
        require: true
    }
}, {
    versionKey: false // Отключаем поле __v
});


const EventModel = mongoose.model('Event', eventSchema);

module.exports = EventModel;