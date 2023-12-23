const UserModel = require('../entity/user');
const bcrypt = require('bcrypt');
const uuid = require('uuid');
const mailService = require('./mail-service')
const tokenService = require('./token-service')
const UserDto = require('../dto/user-dto')
class AuthService {
    async registration(email, password){
        const candidate = await UserModel.findOne({email})
        if(candidate){
            throw new Error('Пользователь существует')
        }
        const hashPassword = await bcrypt.hash(password, 3)
        const activationLink = uuid.v4();
        const user = await UserModel.create({email, password: hashPassword, activationLink})
        await mailService.sendActivationMail(email, activationLink)
        const userDto = new UserDto(user); // id, email, isActivated
        const tokens = tokenService.generateTokens({...userDto});
        await tokenService.saveToken(userDto.id, tokens.refreshToken);

        return{
            ...tokens,
            user: userDto
        }
    }
}

module.exports = new AuthService();