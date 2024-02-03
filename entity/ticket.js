const {Schema, model} = require('mongoose');

const eventTicketSchema = new Schema({
    event: {
        type: Schema.Types.ObjectId,
        ref: 'Event'
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    isPayed: {
        type: Boolean,
        default: false
    },
    seat_row: {
        type: String,
        require: true
    },
    seat_number: {
        type: String,
        require: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    isActivated: {
        type: Boolean,
        require: true
    },
    activationLink: {type: String, require: true},
    order_id: {type: String, require: true},
    invoice_id: {type: String, require: true}
}, {
    versionKey: false // Отключаем поле __v
});

module.exports = model('Event_tickets', eventTicketSchema);