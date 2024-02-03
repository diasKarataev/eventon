const userService = require('../service/user-service');
const authService = require("../service/auth-service");
const tokenService = require("../service/token-service");
const UserModel = require("../entity/user");
class UserController {
    async getUsers(req, res, next){
        try{
            const users = await userService.getUsers();
            return res.json(users);
        } catch (e){

        }
    }
    async getProfile(req, res, next){
        const accessToken = req.headers.authorization;
        const tokenData = tokenService.validateAccessToken(accessToken);
        try{
            const user = await UserModel.findById(tokenData.id);
            return res.json(user);
        } catch (e){

        }
    }
}

module.exports = new UserController();