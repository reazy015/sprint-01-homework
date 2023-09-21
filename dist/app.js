"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const express_1 = __importDefault(require("express"));
const videos_1 = require("./routes/videos");
const testing_1 = require("./routes/testing");
exports.app = (0, express_1.default)();
const jsonBodyParser = express_1.default.json();
exports.app.use(jsonBodyParser);
exports.app.use('/videos', (0, videos_1.getVideosRouter)());
exports.app.use('/__testing__/all-data', (0, testing_1.getTestingRouter)());
//# sourceMappingURL=app.js.map