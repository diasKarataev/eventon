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
            next(e);
        }
    }
    async getProfile(req, res, next){
        const { refreshToken } = req.cookies;
        const tokenData = tokenService.validateRefreshToken(refreshToken);
        try{
            const user = await UserModel.findById(tokenData.id);
            return res.json(user);
        } catch (e){
            next(e);
        }
    }

    async makeMeAdmin(req,res,next){
        try{
            const {refreshToken} = req.cookies;
            await userService.makeMeAdmin(refreshToken);
            const token = await authService.logout(refreshToken);
            res.clearCookie('refreshToken');
            return res.json("Now you are admin");
        } catch (e){
            next(e);
        }
    }
    async makeMeUser(req,res,next){
        try{
            const {refreshToken} = req.cookies;
            await userService.makeMeUser(refreshToken);
            const token = await authService.logout(refreshToken);
            res.clearCookie('refreshToken');
            return res.json("Now you are user");
        } catch (e){
            next(e);
        }
    }
}

module.exports = new UserController();