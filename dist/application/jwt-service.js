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
exports.jwtService = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const configs_1 = require("../shared/configs");
const TOKEN_EXPIRES_IN = '1h';
exports.jwtService = {
    getJWTToken(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            let token;
            try {
                token = yield jsonwebtoken_1.default.sign(payload, configs_1.SETTINGS.SECRET_KEY, { expiresIn: TOKEN_EXPIRES_IN });
            }
            catch (error) {
                console.log(error);
                throw new Error('JWT token creating error');
            }
            if (!token) {
                return null;
            }
            return token;
        });
    },
    verifyPassword(password, hash) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield bcrypt_1.default.compare(password, hash);
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
};
//# sourceMappingURL=jwt-service.js.map