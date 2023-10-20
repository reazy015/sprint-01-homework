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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.usersService = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const users_command_repository_1 = require("../repositories/command/users-command-repository");
const users_query_repository_1 = require("../repositories/query/users-query-repository");
const mail_service_1 = require("../application/mail-service");
const crypto_1 = __importDefault(require("crypto"));
const configs_1 = require("../shared/configs");
const TOKEN_EXPIRES_IN = '1h';
exports.usersService = {
    addNewUser(newUser) {
        return __awaiter(this, void 0, void 0, function* () {
            const { password } = newUser;
            const { salt, hash } = yield this._getHash(password);
            const createdAt = new Date().toISOString();
            const newUserId = yield users_command_repository_1.usersCommandRepository.createUser(Object.assign(Object.assign({}, newUser), { createdAt }), salt, hash);
            return newUserId;
        });
    },
    checkUserRegistered({ loginOrEmail, password }) {
        return __awaiter(this, void 0, void 0, function* () {
            const saltAndHash = yield users_query_repository_1.usersQueryRepository.getUserHashAndSaltByEmailOrLogin(loginOrEmail);
            if (!saltAndHash)
                return false;
            const result = yield bcrypt_1.default.compare(password, saltAndHash.hash);
            return result;
        });
    },
    loginUser({ loginOrEmail, password }) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield users_query_repository_1.usersQueryRepository.getUserByEmailOrLogin(loginOrEmail);
            if (!user)
                return null;
            const userExists = yield bcrypt_1.default.compare(password, user.hash);
            if (!userExists)
                return null;
            return yield jsonwebtoken_1.default.sign({
                login: user.login,
                email: user.email,
                id: user.id,
                createdAt: user.createdAt,
            }, configs_1.SETTINGS.SECRET_KEY, { expiresIn: TOKEN_EXPIRES_IN });
        });
    },
    _getHash(password, userSalt) {
        return __awaiter(this, void 0, void 0, function* () {
            const roundsNumber = 10;
            const salt = userSalt !== null && userSalt !== void 0 ? userSalt : (yield bcrypt_1.default.genSalt(roundsNumber));
            const hash = yield bcrypt_1.default.hash(password, roundsNumber);
            return {
                salt,
                hash,
            };
        });
    },
    registerNewUser({ login, password, email }) {
        return __awaiter(this, void 0, void 0, function* () {
            const confirmationCode = crypto_1.default.randomUUID();
            const { hash, salt } = yield this._getHash(password);
            const createdAt = new Date().toISOString();
            const expiresIn = new Date(new Date().setMinutes(new Date().getMinutes() + 5)).toISOString();
            const addNewNoneConfirmedUser = yield users_command_repository_1.usersCommandRepository.createNoneConfirmedUser({
                login,
                email,
                createdAt,
                hash,
                salt,
                confirmationCode,
                expiresIn,
                confirmed: false,
                confirmationSentDate: createdAt,
            });
            if (!addNewNoneConfirmedUser) {
                return false;
            }
            const emailSent = yield mail_service_1.mailService.sendConfimationEmail(email, confirmationCode);
            if (!emailSent) {
                yield users_command_repository_1.usersCommandRepository.deleteNoneConfirmedUserByConfirmationCode(confirmationCode);
                return false;
            }
            return true;
        });
    },
    confirmUserRegistration(code) {
        return __awaiter(this, void 0, void 0, function* () {
            const userConfirmed = yield users_command_repository_1.usersCommandRepository.verifyAndConfirmUser(code);
            return userConfirmed;
        });
    },
    resendConfirmationEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield users_query_repository_1.usersQueryRepository.getUserByEmailOrLogin(email);
            if (!user) {
                return false;
            }
            const confirmationCode = crypto_1.default.randomUUID();
            const emailResent = yield mail_service_1.mailService.sendConfimationEmail(email, confirmationCode);
            if (emailResent) {
                yield users_command_repository_1.usersCommandRepository.updateUserConfirmationCodeByEmail(email, confirmationCode);
            }
            return emailResent;
        });
    },
};
//# sourceMappingURL=users-service.js.map