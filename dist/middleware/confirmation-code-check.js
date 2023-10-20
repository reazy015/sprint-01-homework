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
exports.confirmationCodeCheck = void 0;
const express_validator_1 = require("express-validator");
const users_query_repository_1 = require("../repositories/query/users-query-repository");
exports.confirmationCodeCheck = (0, express_validator_1.checkSchema)({
    code: {
        notEmpty: true,
        custom: {
            options: (code) => __awaiter(void 0, void 0, void 0, function* () {
                const codeExists = yield users_query_repository_1.usersQueryRepository.confirmationCodeExistsCheck(code);
                if (!codeExists) {
                    throw new Error('No such confirmation code');
                }
                const confirmed = yield users_query_repository_1.usersQueryRepository.isConfirmedUserByCode(code);
                if (confirmed) {
                    throw new Error('User already confirmed');
                }
            }),
        },
        errorMessage: 'Invalid confirmation code',
    },
});
//# sourceMappingURL=confirmation-code-check.js.map