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
exports.authRepository = void 0;
const db_1 = require("../db/db");
const authCollection = db_1.db.collection('credentials');
exports.authRepository = {
    isValidBasicAuth(basicAuthString) {
        return __awaiter(this, void 0, void 0, function* () {
            const [authType, string] = basicAuthString === null || basicAuthString === void 0 ? void 0 : basicAuthString.split(' ');
            if (authType !== 'Basic') {
                return false;
            }
            const decodedString = Buffer.from(string, 'base64').toString('ascii');
            const [login, password] = decodedString.split(':');
            const hasRegistered = yield authCollection.findOne({ login, password }, { projection: { _id: 0 } });
            if (hasRegistered) {
                return true;
            }
            return false;
        });
    },
};
//# sourceMappingURL=auth-repository.js.map