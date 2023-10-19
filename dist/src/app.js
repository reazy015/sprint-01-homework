"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const express_1 = __importDefault(require("express"));
const video_1 = require("./routes/video");
const testing_1 = require("./routes/testing");
const blogs_1 = require("./routes/blogs");
const posts_1 = require("./routes/posts");
const users_1 = require("./routes/users");
const auth_1 = require("./routes/auth");
const comments_1 = require("./routes/comments");
exports.app = (0, express_1.default)();
const jsonBodyParser = express_1.default.json();
exports.app.use(jsonBodyParser);
exports.app.use('/videos', (0, video_1.getVideosRouter)());
exports.app.use('/blogs', (0, blogs_1.getBlogsRouter)());
exports.app.use('/posts', (0, posts_1.getPostsRouter)());
exports.app.use('/users', (0, users_1.getUsersRouter)());
exports.app.use('/auth', (0, auth_1.getAuthRouter)());
exports.app.use('/comments', (0, comments_1.getCommentsRouter)());
exports.app.use('/testing/all-data', (0, testing_1.getTestingRouter)());
//# sourceMappingURL=app.js.map