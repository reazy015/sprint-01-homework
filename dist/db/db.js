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
exports.rundb = exports.db = void 0;
const mongodb_1 = require("mongodb");
const configs_1 = require("../shared/configs");
const DB_URL = configs_1.SETTINGS.DB_URL;
const client = new mongodb_1.MongoClient(DB_URL);
exports.db = client.db();
const rundb = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield client.connect();
        console.log('DB connected');
    }
    catch (e) {
        console.log('DB connection error');
        yield client.close();
    }
});
exports.rundb = rundb;
//# sourceMappingURL=db.js.map