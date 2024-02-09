const userService = require('../service/user-service');
const tokenService = require("../service/token-service");
const UserModel = require("../entity/user");
class UserController {
    async getUsers(req, res, next){
        try{
            const users = await userService.getUsers();
            return res.json(users);
        } catch (e){
            next(e);
        }
    }
    async getProfile(req, res, next){
        const accessToken = req.headers.authorization;
        const tokenData = tokenService.validateAccessToken(accessToken);
        try{
            const user = await UserModel.findById(tokenData.id);
            return res.json(user);
        } catch (e){
            next(e);
        }
    }
    async getUserById(req, res, next){
        try{
            const userId = req.params.id;
            const user = await userService.getUserById(userId);
            res.json(user);
        } catch (e) {
            next(e);
        }
    }

    async createUser(req, res, next){
        const { name, surname, email, password, birthDate, role } = req.body;
        try{
            const user = await userService.createUser(name, surname, email, password, birthDate, role);
            res.json(user);
        } catch (e) {
            next(e);
        }
    }
    async updateUser(req, res, next){
        const userId = req.params.id;
        const { name, surname, email, password, birthDate, role } = req.body;
        try{
            const user = await userService.updateUser(userId, name, surname, email, password, birthDate, role);
            res.json(user);
        } catch (e) {
            next(e);
        }
    }
    async deleteUser(req, res, next){
        try{
            const userId = req.params.id;
            await userService.deleteUser(userId);
            res.json({ message: 'User deleted successfully' });
        } catch (e) {
            next(e);
        }
    }
}

module.exports = new UserController();