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
    }
}, {
    versionKey: false // Отключаем поле __v
});


const Event = mongoose.model('Event', eventSchema);

module.exports = Event;