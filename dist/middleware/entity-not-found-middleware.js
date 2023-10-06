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
exports.entityNotFoundMiddleware = void 0;
const express_validator_1 = require("express-validator");
const constants_1 = require("../utils/constants");
const entityNotFoundMiddleware = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const errors = yield (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        const errorsMessages = Object.entries(errors.mapped()).map(([key, value]) => ({
            field: key,
            message: value.msg,
        }));
        res.status(constants_1.HTTP_STATUSES.NOT_FOUND).send({
            errorsMessages,
        });
        return;
    }
    next();
});
exports.entityNotFoundMiddleware = entityNotFoundMiddleware;
//# sourceMappingURL=entity-not-found-middleware.js.map