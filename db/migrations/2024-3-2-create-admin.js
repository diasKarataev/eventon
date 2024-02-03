// createUser.js
const mongoose = require("mongoose");
const User = require("../../entity/user");
const bcrypt = require("bcrypt");

require('dotenv').config();

async function createUser() {
    try {
        await mongoose.connect(process.env.DB_URL, { useNewUrlParser: true, useUnifiedTopology: true });
        const hashPassword = await bcrypt.hash('admin', 3);
        const sampleUser = new User({
            name: 'admin',
            surname: 'admin',
            email: 'admin',
            password: hashPassword,
            isActivated: 'true',
            activationLink: '',
            role: 'ADMIN',
            birthDate: new Date(),
            creationDate: new Date()
        });
        try {
            await sampleUser.save();
            console.log('Пример пользователя успешно создан:', sampleUser);
        } catch (e){
            console.log('Admin user is already exists');
        }
    } catch (err) {
        console.error('Ошибка подключения к базе данных MongoDB:', err);
    }
}

module.exports = createUser;