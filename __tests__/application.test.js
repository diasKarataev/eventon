const request = require('supertest');
const app = require('../index');
const EventModel = require('../entity/event')
const UserModel = require('../entity/user')
const TicketModel = require('../entity/ticket')
const OrderModel = require('../entity/order')

jest.setTimeout(100000)
describe('Application tests', () => {
    let server;

    beforeAll(() => {
        server = app.listen(1010);
    });

    afterAll((done) => {
        server.close(done);
    });
    describe('Authentication tests', () => {
        test('registration', async () => {
            const registrationResponse = await request(app)
                .post('/api/auth/registration')
                .send({
                    email:"test@test.com",
                    password:"Test",
                    name:"Test",
                    surname:"Test",
                    birthDate:"2002-09-02"
                });
            expect(registrationResponse.statusCode).toBe(200);
            expect(registrationResponse.body.accessToken).toBeDefined();
            expect(registrationResponse.body.refreshToken).toBeDefined();

            const loginResponse = await request(app)
                .post('/api/auth/login')
                .send({
                    email: 'test@test.com',
                    password: 'Test'
                });
            expect(loginResponse.statusCode).toBe(200);
            expect(loginResponse.body.accessToken).toBeDefined();
            expect(loginResponse.body.refreshToken).toBeDefined();
            await UserModel.findByIdAndDelete(loginResponse.body.user.id);
        });
        test('login', async () => {
            const registrationResponse = await request(app)
                .post('/api/auth/registration')
                .send({
                    email:"test@test.com",
                    password:"Test",
                    name:"Test",
                    surname:"Test",
                    birthDate:"2002-09-02"
                });
            const response = await request(app)
                .post('/api/auth/login')
                .send({
                    email: 'test@test.com',
                    password: 'Test'
                });
            expect(response.statusCode).toBe(200);
            expect(response.body.accessToken).toBeDefined();
            expect(response.body.refreshToken).toBeDefined();
            await UserModel.findByIdAndDelete(response.body.user.id);
        });
    });

    describe('Events tests', () => {
        test('getEvents', async () => {
            const response = await request(app)
                .get('/api/events');
            expect(response.statusCode).toBe(200);
        });

        test('createEvent', async () => {
            const response = await request(app)
                .post('/api/events')
                .send({
                    title: "Test Description",
                    description: "Test Description",
                    capacity: 50,
                    ticket_price: 1000}
                )
            const eventId = response.body._id;
            const event = await EventModel.findById(eventId);
            await EventModel.findByIdAndDelete(eventId);
            expect(response.statusCode).toBe(200);
            expect(event).toBeDefined();

        });
        test('updateEvent', async () => {
            const response = await request(app)
                .post('/api/events')
                .send({
                    title: "Test Description",
                    description: "Test Description",
                    capacity: 50,
                    ticket_price: 1000}
                )
            const eventId = response.body._id;

            await request(app)
                .patch('/api/events/' + eventId)
                .send({
                    title: "Test Update",
                    description: "Test Update",
                    capacity: 1,
                    ticket_price: 1
                });

            const updatedEvent = await EventModel.findById(eventId);
            await EventModel.findByIdAndDelete(eventId);
            expect(updatedEvent.title).toEqual("Test Update");
            expect(updatedEvent.description).toEqual("Test Update");
            expect(updatedEvent.capacity).toBe(1);
            expect(updatedEvent.ticket_price).toBe(1);
            expect(response.statusCode).toBe(200);

        });
    });

    describe('User tests', () => {
        test('getUsers', async () => {
            const loginResponse = await request(app)
                .post('/api/auth/login')
                .send({
                    email: 'admin',
                    password: 'admin'
                });

            const accessToken = loginResponse.body.accessToken;

            const response = await request(app)
                .get('/api/users')
                .set('Authorization', 'Bearer ' + accessToken)
            expect(response.statusCode).toBe(200)
        });
        test('getProfile', async () => {
            const loginResponse = await request(app)
                .post('/api/auth/login')
                .send({
                    email: 'admin',
                    password: 'admin'
                });

            const accessToken = loginResponse.body.accessToken;

            const profileResponse = await request(app)
                .get('/api/users/profile')
                .set('Authorization', 'Bearer ' + accessToken)


            expect(profileResponse.body.email).toEqual("admin")
            expect(profileResponse.body.role).toEqual("ADMIN")
        });
        test('createUserByAdmin', async () => {
            const loginResponse = await request(app)
                .post('/api/auth/login')
                .send({
                    email: 'admin',
                    password: 'admin'
                });
            const accessToken = loginResponse.body.accessToken;
            expect(loginResponse.statusCode).toBe(200)

            const createResponse = await request(app)
                .post('/api/users')
                .set('Authorization', 'Bearer ' + accessToken)
                .send({
                    email:"testEmail",
                    password:"testCreate",
                    name:"testName",
                    surname:"testSurname",
                    birthDate:"2002-09-02",
                    role: "ADMIN"
                })
                expect(createResponse.statusCode).toBe(200)


                const createdUser = createResponse.body;
                console.log(createdUser);
                await UserModel.findByIdAndDelete(createdUser._id);
                expect(createdUser.email).toEqual("testEmail")
                expect(createdUser.name).toEqual("testName")
                expect(createdUser.surname).toEqual("testSurname")
                expect(createdUser.role).toEqual("ADMIN")
        });
        test('updateUserByAdmin', async () => {
            const loginResponse = await request(app)
                .post('/api/auth/login')
                .send({
                    email: 'admin',
                    password: 'admin'
                });
            const accessToken = loginResponse.body.accessToken;
            expect(loginResponse.statusCode).toBe(200)

            const createResponse = await request(app)
                .post('/api/users')
                .set('Authorization', 'Bearer ' + accessToken)
                .send({
                    email:"testEmail",
                    password:"testCreate",
                    name:"testName",
                    surname:"testSurname",
                    birthDate:"2002-09-02",
                    role: "ADMIN"
                })
            expect(createResponse.statusCode).toBe(200)
            const createdUser = createResponse.body;

            const updateResponse = await request(app)
                .patch('/api/users/' + createdUser._id)
                .set('Authorization', 'Bearer ' + accessToken)
                .send({
                    email:"updateEmail",
                    password:"updateCreate",
                    name:"updateName",
                    surname:"updateSurname",
                    birthDate:"2002-09-02",
                    role: "USER"
                })
            expect(updateResponse.statusCode).toBe(200)

            await UserModel.findByIdAndDelete(createdUser._id);
            const updatedUser = updateResponse.body;
            expect(updatedUser.email).toEqual("updateEmail")
            expect(updatedUser.name).toEqual("updateName")
            expect(updatedUser.surname).toEqual("updateSurname")
            expect(updatedUser.role).toEqual("USER")

        });

    });
    describe('Ticket tests', () => {
        test('buyTicket', async () => {
            const registrationResponse = await request(app)
                .post('/api/auth/registration')
                .send({
                    email:"test@test.com",
                    password:"Test",
                    name:"Test",
                    surname:"Test",
                    birthDate:"2002-09-02"
                });
            const accessToken = registrationResponse.body.accessToken;
            expect(accessToken).toBeDefined();

            const createEventResponse = await request(app)
                .post('/api/events')
                .send({
                    title: "Test Description",
                    description: "Test Description",
                    capacity: 50,
                    ticket_price: 1000}
                )
            const eventId = createEventResponse.body._id;

            const buyTicketResponse = await request(app)
                .post('/api/tickets/buy-ticket/' + eventId)
                .set('Authorization', 'Bearer ' + accessToken)
                .send({
                        seat_row: "1",
                        seat_number: "1"
                    }
                )


            const ticket = await TicketModel.findOne({event: eventId});
            await UserModel.findByIdAndDelete(registrationResponse.body.user.id);
            await EventModel.findByIdAndDelete(eventId);
            await TicketModel.findByIdAndDelete(ticket._id)
            await OrderModel.findOneAndDelete({ticket: ticket._id})
            expect(ticket.seat_row).toEqual("1")
            expect(ticket.seat_number).toEqual("1")
            expect(ticket.user.toString()).toEqual(registrationResponse.body.user.id.toString())

        });
    });
});

