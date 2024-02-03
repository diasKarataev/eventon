const UserModel = require('../entity/user');
const tokenService = require('./token-service')
class UserService {
    async getUsers(){
        return await UserModel.find();
    }
}

module.exports = new UserService();