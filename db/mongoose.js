const mongoose = require ("mongoose");

require('dotenv').config();

mongoose.connect(process.env.DB_URL, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('Успешное подключение к базе данных MongoDB');
    })
    .catch((err) => {
        console.error('Ошибка подключения к базе данных MongoDB:', err);
    });

