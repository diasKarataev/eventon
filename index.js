const express = require('express');
require('./db/mongoose.js');
require('dotenv').config();
const cors = require('cors');
const cookieParser = require('cookie-parser')
const eventRouter = require('./router/events.js');
const authRouter = require('./router/auth.js');
const userRouter = require('./router/user.js');
const ticketRouter = require('./router/tickets.js');
const adminRouter = require('./router/admin.js');
const errorMiddleware = require('./middleware/error-middleware');


const app = express();
const PORT = process.env.PORT || 8080;

app.use(express.json());
app.use(cookieParser());
app.use(cors());
app.use(errorMiddleware); // Идет всегда полседним


app.listen(PORT,() => {
    console.log(`Server is running on port ${PORT}...`);
});
// Использование маршрутов для событий
app.use('/events', eventRouter);
app.use('/auth', authRouter);
app.use('/users', userRouter);
app.use('/tickets', ticketRouter);
app.use('/admin', adminRouter);




