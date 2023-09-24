"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.basicAuthMiddleware = void 0;
const auth_repository_1 = require("../data-access-layer/auth-repository");
const constants_1 = require("../utils/constants");
const basicAuthMiddleware = (req, res, next) => {
    const auth = req.headers.authorization;
    if (!auth) {
        res.status(constants_1.HTTP_STATUSES.UNAUTH).send('No auth credentials');
        return;
    }
    const isValidBasicAuthCredentials = auth_repository_1.authRepository.isValidBasicAuth(auth);
    if (isValidBasicAuthCredentials) {
        next();
    }
    else {
        res.status(constants_1.HTTP_STATUSES.UNAUTH).send('Invalid credentials');
    }
};
exports.basicAuthMiddleware = basicAuthMiddleware;
//# sourceMappingURL=basic-auth-middleware.js.map