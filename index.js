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
const bodyParser = require('body-parser')
const imageRouter = require('./router/image')
const ordersRouter = require('./router/orders')


const app = express();
const PORT = process.env.PORT || 8080;

app.use(express.json());
app.use(cookieParser());
app.use(cors({
    credentials: true,
    origin: process.env.CLIENT_URL
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


app.use('/api/events', eventRouter);
app.use('/api/auth', authRouter);
app.use('/api/users', userRouter);
app.use('/api/tickets', ticketRouter);
app.use('/api/admin', adminRouter);
app.use('/api/image', imageRouter);
app.use('/api/orders', ordersRouter);
app.use(express.urlencoded({ extended: true }));


app.use(errorMiddleware);

app.listen(PORT,() => {
    console.log(`Server is running on port ${PORT}...`);
});
