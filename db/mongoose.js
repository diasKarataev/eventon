const mongoose = require("mongoose");
const migration1 = require('./migrations/2024-3-2-create-admin');

require('dotenv').config();

mongoose.connect(process.env.DB_URL, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(async () => {
        console.log('Успешное подключение к базе данных MongoDB');
        migration1();

    })
    .catch((err) => {
        console.error('Ошибка подключения к базе данных MongoDB:', err);
    });
