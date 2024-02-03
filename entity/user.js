const {Schema, model} = require('mongoose');

const UserSchema = new Schema({
    email: {type: String, unique: true, require: true},
    password: {type: String, require: true},
    role: {type: String, require: true},
    isActivated: {type: Boolean, require: true},
    activationLink: {type: String, require: true},
    profilePictureId: {type: String},
    name: {type: String, require: true},
    surname: {type: String, require: true},
    birthDate: {type: Date, require: true},
    creationDate: {type: Date, require: true}
})

module.exports = model('User', UserSchema);