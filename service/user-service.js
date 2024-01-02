const UserModel = require('../entity/user');
class UserService {
    async getUsers(){
        const users = await UserModel.find();
        return users;
    }
}

module.exports = new UserService();