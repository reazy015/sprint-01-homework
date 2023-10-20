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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.jwtVerifyMiddleware = void 0;
const constants_1 = require("../utils/constants");
const dotenv_1 = __importDefault(require("dotenv"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
dotenv_1.default.config();
const SECREY_KEY = process.env.SECRET_KEY || 'localhost_temp_secret_key';
const jwtVerifyMiddleware = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.headers.authorization) {
        res.sendStatus(constants_1.HTTP_STATUSES.UNAUTH);
        return;
    }
    const bearerToken = req.headers.authorization.split(' ')[1];
    if (!bearerToken) {
        res.sendStatus(constants_1.HTTP_STATUSES.UNAUTH);
        return;
    }
    let verifiedUser;
    try {
        verifiedUser = (yield jsonwebtoken_1.default.verify(bearerToken, SECREY_KEY));
    }
    catch (error) {
        res.status(constants_1.HTTP_STATUSES.UNAUTH).send(error);
        return;
    }
    if (!verifiedUser) {
        res.sendStatus(constants_1.HTTP_STATUSES.UNAUTH);
        return;
    }
    req.context = {
        userId: verifiedUser.id,
    };
    next();
});
exports.jwtVerifyMiddleware = jwtVerifyMiddleware;
//# sourceMappingURL=jwt-verify-middleware.js.map