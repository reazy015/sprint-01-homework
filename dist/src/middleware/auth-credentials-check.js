"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authCredentialsCheck = void 0;
const express_validator_1 = require("express-validator");
exports.authCredentialsCheck = (0, express_validator_1.checkSchema)({
    loginOrEmail: {
        isInt: { negated: true },
        isString: true,
        notEmpty: true,
        errorMessage: 'Can not be just int or empty',
    },
    password: {
        isInt: { negated: true },
        isString: true,
        notEmpty: true,
        errorMessage: 'Can not be just int or empty',
    },
});
//# sourceMappingURL=auth-credentials-check.js.map