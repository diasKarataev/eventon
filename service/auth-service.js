const UserModel = require('../entity/user');
const bcrypt = require('bcrypt');
const uuid = require('uuid');
const mailService = require('./mail-service')
const tokenService = require('./token-service')
const UserDto = require('../dto/user-dto')
const ApiError = require('../exceptions/api-error');
class AuthService {
    async registration(name, surname, birthDate, email, password){
        const candidate = await UserModel.findOne({email})
        if(candidate){
            throw ApiError.BadRequest('The user is already exist')
        }
        const hashPassword = await bcrypt.hash(password, 3)
        const activationLink = uuid.v4();
        const user = await UserModel.create(
            {
                name,
                surname,
                birthDate,
                email,
                password: hashPassword,
                activationLink,
                role: "USER",
                creationDate: new Date()
            }
        )
        await mailService.sendActivationMail(email, `${process.env.API_URL}/auth/activate/${activationLink}`)
        const userDto = new UserDto(user); // id, email, isActivated
        const tokens = tokenService.generateTokens({...userDto});
        await tokenService.saveToken(userDto.id, tokens.refreshToken);

        return{
            ...tokens,
            user: userDto
        }
    }

    async activate(activationLink){
        const user = await UserModel.findOne({activationLink})
        if(!user){
            throw ApiError.BadRequest('Incorrect activation link')
        }
        user.isActivated = true;
        await user.save();
    }

    async login(email, password){
        const user = await UserModel.findOne({email})
        if(!user){
            throw ApiError.BadRequest('The user is not found')
        }
        const isPassEquals = await bcrypt.compare(password, user.password);
        if(!isPassEquals){
            throw ApiError.BadRequest('Wrong password')
        }
        const userDto = new UserDto(user);
        const tokens = tokenService.generateTokens({...userDto});
        await tokenService.saveToken(userDto.id, tokens.refreshToken);
        return{
            ...tokens,
            user: userDto
        }
    }

    async logout(refreshToken){
        const token = await tokenService.removeToken(refreshToken);
        return token;
    }


    async refresh(refreshToken) {
        if (!refreshToken) {
            throw ApiError.UnauthorizedError();
        }
        const userData = tokenService.validateRefreshToken(refreshToken);
        const tokenFromDb = await tokenService.findToken(refreshToken);
        if (!userData || !tokenFromDb) {
            throw ApiError.UnauthorizedError();

        }
        const user = await UserModel.findById(userData.id);
        const userDto = new UserDto(user);
        const tokens = tokenService.generateTokens({...userDto});
        await tokenService.saveToken(userDto.id, tokens.refreshToken);
        return{
            ...tokens,
            user: userDto
        }
    }
}

module.exports = new AuthService();