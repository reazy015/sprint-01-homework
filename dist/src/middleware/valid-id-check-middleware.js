"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validIdCheckMiddleware = void 0;
const express_validator_1 = require("express-validator");
const mongodb_1 = require("mongodb");
const constants_1 = require("./constants");
const validIdCheckMiddleware = () => (0, express_validator_1.param)('id')
    .custom((id) => mongodb_1.ObjectId.isValid(id))
    .withMessage(constants_1.COMMON_ERROR_MESSAGE.INVALID_ID);
exports.validIdCheckMiddleware = validIdCheckMiddleware;
//# sourceMappingURL=valid-id-check-middleware.js.map