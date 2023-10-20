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
exports.emailResendingCheck = void 0;
const express_validator_1 = require("express-validator");
const new_user_validate_middleware_1 = require("./new-user-validate.middleware");
const users_query_repository_1 = require("../repositories/query/users-query-repository");
exports.emailResendingCheck = (0, express_validator_1.checkSchema)({
    email: {
        matches: {
            options: new_user_validate_middleware_1.EMAIL_REGEXP,
            errorMessage: 'Incorrect email',
        },
        custom: {
            options: (email) => __awaiter(void 0, void 0, void 0, function* () {
                const confirmed = yield users_query_repository_1.usersQueryRepository.isConfirmedUser(email);
                if (confirmed) {
                    throw new Error('User already confirmed');
                }
                const user = yield users_query_repository_1.usersQueryRepository.getUserConfirmationCodeByEmail(email);
                if (!user) {
                    throw new Error('No such email');
                }
            }),
        },
    },
});
//# sourceMappingURL=email-resending-check.js.map