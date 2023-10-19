"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.newUserValidateMiddleware = exports.EMAIL_REGEXP = void 0;
const express_validator_1 = require("express-validator");
const LOGIN_REGEXP = /^[a-zA-Z0-9_-]*$/;
exports.EMAIL_REGEXP = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
exports.newUserValidateMiddleware = (0, express_validator_1.checkSchema)({
    login: {
        isString: true,
        isInt: { negated: true },
        isLength: {
            options: { min: 3, max: 30 },
        },
        matches: {
            options: LOGIN_REGEXP,
        },
    },
    password: {
        isString: true,
        isLength: {
            options: { min: 6, max: 20 },
        },
    },
    email: {
        isString: true,
        matches: {
            options: exports.EMAIL_REGEXP,
        },
    },
});
//# sourceMappingURL=new-user-validate.middleware.js.map