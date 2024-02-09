const UserModel = require('../entity/user');
const ApiError = require('../exceptions/api-error');
const bcrypt = require("bcrypt");
const uuid = require("uuid");

class UserService {
    async getUsers() {
        return await UserModel.find();
    }

    async getUserById(userId) {
        const user = await UserModel.findOne({ _id: userId });
        if (!user) {
            throw ApiError.BadRequest('User not found');
        }
        return user;
    }

    async createUser(name, surname, email, password, birthDate, role) {
        const hashPassword = await bcrypt.hash(password, 3);
        const newUser = new UserModel({ name, surname, email, password: hashPassword, birthDate, activationLink: uuid.v4(), creationDate: new Date(), role: role});
        return await newUser.save();
    }

    async updateUser(userId, name, surname, email, password, birthDate, role) {
        const updateFields = {};
        if (name) updateFields.name = name;
        if (surname) updateFields.surname = surname;
        if (email) updateFields.email = email;
        if (role) updateFields.role = role
        if(password !== 'null') updateFields.password = await bcrypt.hash(password, 3);

        const user = await UserModel.findOneAndUpdate(
            { _id: userId },
            updateFields,
            { new: true }
        );

        if (!user) {
            throw ApiError.BadRequest('User not found');
        }

        return user;
    }
    async deleteUser(userId) {
        const user = await UserModel.findOneAndDelete({ _id: userId });
        if (!user) {
            throw ApiError.BadRequest('User not found');
        }
        return user;
    }
}

module.exports = new UserService();
