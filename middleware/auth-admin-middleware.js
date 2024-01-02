const ApiError = require('../exceptions/api-error');
const tokenService = require('../service/token-service');

module.exports = function (req, res, next) {
    try {
        const authorizationHeader = req.headers.authorization;

        if (!authorizationHeader) {
            return next(ApiError.UnauthorizedError());
        }

        const accessToken = authorizationHeader.split(' ')[1];

        if (!accessToken) {
            return next(ApiError.UnauthorizedError());
        }

        const userData = tokenService.validateAccessToken(accessToken);

        if (!userData || !userData.role || userData.role !== 'ADMIN') {
            return next(ApiError.NoPermissionsError());
        }

        req.user = userData;
        next();

    } catch (e) {
        return next(ApiError.UnauthorizedError());
    }
};
