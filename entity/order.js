const {Schema, model} = require('mongoose');

const orderSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    ticket: {
        type: Schema.Types.ObjectId,
        ref: 'Ticket'
    },
    creationDate: {
        type: Date,
        default: Date.now
    },
    invoice_id: {type: String, require: true},
    paymentId: {type: String, require: true}
}, {
    versionKey: false // Отключаем поле __v
});

module.exports = model('Orders', orderSchema);