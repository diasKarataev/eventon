
const jwt = require('jsonwebtoken');
const tokenModel = require('../entity/token')
class TokenService{
    generateTokens(payload){
        const accessToken = jwt.sign(payload, process.env.JWT_ACCESS, {expiresIn:'30s'})
        const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH, {expiresIn:'30d'})
        return {
            accessToken,
            refreshToken
        }
    }

    async saveToken(userId, refreshToken){
        const tokenData = await tokenModel.findOne({user: userId})
        if(tokenData){
            tokenData.refreshToken = refreshToken;
            return tokenData.save();
        }
        return await tokenModel.create({user: userId, refreshToken});
    }

    async removeToken(refreshToken){
        const tokenData = await tokenModel.deleteOne({refreshToken});
        return tokenData;
    }

    async findToken(refreshToken){
        const tokenData = await tokenModel.findOne({refreshToken});
        return tokenData;
    }

    validateAccessToken(token){
        try {
            const userData = jwt.verify(token, process.env.JWT_ACCESS);
            return userData;
        } catch (e){
            return null;
        }
    }
    validateRefreshToken(token){
        try {
            const userData = jwt.verify(token, process.env.JWT_REFRESH);
            return userData;
        } catch (e){
            return null;
        }
    }
}

module.exports = new TokenService();