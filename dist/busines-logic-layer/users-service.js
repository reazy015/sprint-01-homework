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
const users_command_repository_1 = require("../data-access-layer/command/users-command-repository");
const crypto_1 = __importDefault(require("crypto"));
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
    _getHash(password) {
        return __awaiter(this, void 0, void 0, function* () {
            const salt = crypto_1.default.randomBytes(10).toString('base64');
            const interations = 10000;
            return new Promise((resolve, reject) => {
                crypto_1.default.pbkdf2(password, salt, interations, 64, 'sha512', (error, hash) => {
                    if (error) {
                        reject(error);
                    }
                    resolve({
                        salt,
                        hash: hash.toString('base64'),
                    });
                });
            });
        });
    },
};
//# sourceMappingURL=users-service.js.map