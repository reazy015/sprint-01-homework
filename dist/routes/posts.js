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
exports.getPostsRouter = void 0;
const express_1 = __importDefault(require("express"));
const post_repository_1 = require("../data-access-layer/post-repository");
const basic_auth_middleware_1 = require("../middleware/basic-auth-middleware");
const validation_error_middleware_1 = require("../middleware/validation-error-middleware");
const post_validate_middleware_1 = require("../middleware/post-validate-middleware-");
const constants_1 = require("../utils/constants");
const getPostsRouter = () => {
    const router = express_1.default.Router();
    router.get('/', (_, res) => __awaiter(void 0, void 0, void 0, function* () {
        const posts = yield post_repository_1.postsRepository.getAllPosts();
        res.status(constants_1.HTTP_STATUSES.OK).json(posts);
    }));
    router.get('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const postId = req.params.id;
        const post = yield post_repository_1.postsRepository.getPostById(postId);
        if (!post) {
            res.sendStatus(constants_1.HTTP_STATUSES.NOT_FOUND);
            return;
        }
        res.status(constants_1.HTTP_STATUSES.OK).send(post);
    }));
    router.post('/', basic_auth_middleware_1.basicAuthMiddleware, (0, post_validate_middleware_1.postValidateMiddleware)(), validation_error_middleware_1.validationErrorMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const newPostId = yield post_repository_1.postsRepository.addPost(req.body);
        if (!newPostId) {
            res.sendStatus(constants_1.HTTP_STATUSES.SERVER_ERROR);
            return;
        }
        const newPost = yield post_repository_1.postsRepository.getPostById(newPostId);
        if (!newPost) {
            res.sendStatus(constants_1.HTTP_STATUSES.SERVER_ERROR);
            return;
        }
        res.status(constants_1.HTTP_STATUSES.CREATED).json(newPost);
    }));
    router.put('/:id', basic_auth_middleware_1.basicAuthMiddleware, (0, post_validate_middleware_1.postValidateMiddleware)(), validation_error_middleware_1.validationErrorMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const postId = req.params.id;
        const post = yield post_repository_1.postsRepository.getPostById(postId);
        if (!post) {
            res.sendStatus(constants_1.HTTP_STATUSES.NOT_FOUND);
            return;
        }
        const postUpdated = yield post_repository_1.postsRepository.updatePost(postId, req.body);
        if (!postUpdated) {
            res.sendStatus(constants_1.HTTP_STATUSES.SERVER_ERROR);
            return;
        }
        res.sendStatus(constants_1.HTTP_STATUSES.NO_CONTENT);
    }));
    router.delete('/:id', basic_auth_middleware_1.basicAuthMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const id = req.params.id;
        const blog = yield post_repository_1.postsRepository.getPostById(id);
        if (!blog) {
            res.sendStatus(constants_1.HTTP_STATUSES.NOT_FOUND);
            return;
        }
        const deleteResult = yield post_repository_1.postsRepository.deletePost(id);
        if (!deleteResult) {
            res.sendStatus(constants_1.HTTP_STATUSES.SERVER_ERROR);
            return;
        }
        res.sendStatus(constants_1.HTTP_STATUSES.NO_CONTENT);
    }));
    return router;
};
exports.getPostsRouter = getPostsRouter;
//# sourceMappingURL=posts.js.map