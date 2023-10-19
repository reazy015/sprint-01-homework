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
exports.basicAuthMiddleware = void 0;
const constants_1 = require("../utils/constants");
const auth_repository_1 = require("../repositories/auth-repository");
const basicAuthMiddleware = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const auth = req.headers.authorization;
    if (!auth) {
        res.status(constants_1.HTTP_STATUSES.UNAUTH).send('No auth credentials');
        return;
    }
    const isValidBasicAuthCredentials = yield auth_repository_1.authRepository.isValidBasicAuth(auth);
    if (isValidBasicAuthCredentials) {
        next();
    }
    else {
        res.status(constants_1.HTTP_STATUSES.UNAUTH).send('Invalid credentials');
    }
});
exports.basicAuthMiddleware = basicAuthMiddleware;
//# sourceMappingURL=basic-auth-middleware.js.map