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
exports.getTestingRouter = void 0;
const express_1 = __importDefault(require("express"));
const video_repository_1 = require("../data-access-layer/video-repository");
const constants_1 = require("../utils/constants");
const blogs_command_repository_1 = require("../data-access-layer/command/blogs-command-repository");
const posts_command_repository_1 = require("../data-access-layer/command/posts-command-repository");
const users_command_repository_1 = require("../data-access-layer/command/users-command-repository");
const comments_command_repository_1 = require("../data-access-layer/command/comments-command-repository");
const getTestingRouter = () => {
    const router = express_1.default.Router();
    router.delete('/', (_, res) => __awaiter(void 0, void 0, void 0, function* () {
        video_repository_1.videoRepositry.deleteAllVideos();
        const allBlogsDeleted = yield blogs_command_repository_1.blogsCommandRepository.deleteAllBlogs();
        const allPostsDeleted = yield posts_command_repository_1.postsCommandRepository.deleteAllPosts();
        const allUsersDeleted = yield users_command_repository_1.usersCommandRepository.deleteAllUsers();
        const allCommentsDeleted = yield comments_command_repository_1.commentsCommandRespository.deleteAllComments();
        if (allBlogsDeleted && allPostsDeleted && allUsersDeleted && allCommentsDeleted) {
            res.sendStatus(constants_1.HTTP_STATUSES.NO_CONTENT);
            return;
        }
        res.sendStatus(constants_1.HTTP_STATUSES.SERVER_ERROR);
    }));
    return router;
};
exports.getTestingRouter = getTestingRouter;
//# sourceMappingURL=testing.js.map