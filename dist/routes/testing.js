"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTestingRouter = void 0;
const express_1 = __importDefault(require("express"));
const video_repository_1 = require("../data-access-layer/video-repository");
const blogs_repository_1 = require("../data-access-layer/blogs-repository");
const post_repository_1 = require("../data-access-layer/post-repository");
const getTestingRouter = () => {
    const router = express_1.default.Router();
    router.delete('/', (_, res) => {
        video_repository_1.videoRepositry.deleteAllVideos();
        blogs_repository_1.blogsRepository.deleteAllBlogs();
        post_repository_1.postsRepository.deleteAllPosts();
        res.sendStatus(204);
    });
    return router;
};
exports.getTestingRouter = getTestingRouter;
//# sourceMappingURL=testing.js.map