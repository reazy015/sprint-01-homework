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
exports.newUserValidateMiddleware = exports.EMAIL_REGEXP = void 0;
const express_validator_1 = require("express-validator");
const users_query_repository_1 = require("../repositories/query/users-query-repository");
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
        custom: {
            options: (login) => __awaiter(void 0, void 0, void 0, function* () {
                const user = yield users_query_repository_1.usersQueryRepository.getUserByEmailOrLogin(login);
                if (user) {
                    throw new Error('Login already in use');
                }
            }),
            bail: true,
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
        custom: {
            options: (email) => __awaiter(void 0, void 0, void 0, function* () {
                const user = yield users_query_repository_1.usersQueryRepository.getUserByEmailOrLogin(email);
                if (user) {
                    throw new Error('Email already in use');
                }
            }),
            bail: true,
        },
    },
});
//# sourceMappingURL=new-user-validate.middleware.js.map