const userService = require('../service/user-service');
const authService = require("../service/auth-service");
class UserController {
    async getUsers(req, res, next){
        try{
            const users = await userService.getUsers();
            return res.json(users);
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