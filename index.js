const express = require('express');
require('./db/mongoose.js');
require('dotenv').config();
const eventRouter = require('./routes/events.js');


const app = express();
const PORT = process.env.PORT;

app.use(express.json());

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}...`);
});

// Использование маршрутов для событий
app.use('/events', eventRouter);
