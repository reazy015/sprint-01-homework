"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
app.get('/', (req, res, next) => {
    if (req.headers.authorization) {
        return;
    }
    req.query.id = Number(req.query.id);
    next();
}, (req, res) => {
    req.query.name;
});
//# sourceMappingURL=test.js.map