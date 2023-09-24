"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validationErrorMiddleware = void 0;
const express_validator_1 = require("express-validator");
const constants_1 = require("../utils/constants");
const validationErrorMiddleware = (req, res, next) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        res.status(constants_1.HTTP_STATUSES.BAD_REQUEST).send({
            errorsMessages: Object.entries(errors.mapped()).map(([key, value]) => ({
                field: key,
                message: value.msg,
            })),
        });
        return;
    }
    next();
};
exports.validationErrorMiddleware = validationErrorMiddleware;
//# sourceMappingURL=validation-error-middleware.js.map