const UserModel = require('../entity/user');
const tokenService = require('./token-service')
class UserService {
    async getUsers(){
        return await UserModel.find();
    }


    async makeMeAdmin(token) {
        try {
            const tokenData = tokenService.validateRefreshToken(token);
            const user = await UserModel.findById(tokenData.id);

            if (!user) {
                console.log("Пользователь не найден.");
                return;
            }

            user.role = 'ADMIN';
            await user.save();

            console.info("Пользователь успешно обновлен:", user);
        } catch (error) {
            console.error("Ошибка при обновлении пользователя:", error);
        }
    }

    async makeMeUser(token) {
        try {
            const tokenData = tokenService.validateRefreshToken(token);
            const user = await UserModel.findById(tokenData.id);

            if (!user) {
                console.log("Пользователь не найден.");
                return;
            }

            user.role = 'USER';
            await user.save();

            console.info("Пользователь успешно обновлен:", user);
        } catch (error) {
            console.error("Ошибка при обновлении пользователя:", error);
        }
    }
}

module.exports = new UserService();