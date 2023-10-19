"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.confirmationCheckMiddleware = void 0;
const auth_query_repository_1 = require("../repositories/query/auth-query-repository");
const constants_1 = require("../utils/constants");
const confirmationCheckMiddleware = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield auth_query_repository_1.authQueryRepository.getNoneConfirmedUserByEmailOrLogin({
        email: req.body.email,
        login: req.body.login,
    });
    if (!user) {
        return next();
    }
    if (new Date(user.expiresIn) > new Date()) {
        res.status(constants_1.HTTP_STATUSES.BAD_REQUEST).json({
            message: 'Confirmation code sent, please check your email and try a bit later',
        });
        return;
    }
    // if (new Date(user.expiresIn!) < new Date()) {
    //   res.status(HTTP_STATUSES.BAD_REQUEST).json({
    //     message: 'Confirmation code expired, ask for confirmation code resend',
    //   })
    //   return
    // }
    if (user.confirmed) {
        res.sendStatus(constants_1.HTTP_STATUSES.BAD_REQUEST).json({
            message: 'User already confirmed',
        });
        return;
    }
    next();
});
exports.confirmationCheckMiddleware = confirmationCheckMiddleware;
//# sourceMappingURL=confirmation-check-middleware.js.map