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
const basic_auth_middleware_1 = require("../middleware/basic-auth-middleware");
const validation_error_middleware_1 = require("../middleware/validation-error-middleware");
const post_validate_middleware_1 = require("../middleware/post-validate-middleware-");
const constants_1 = require("../utils/constants");
const posts_query_repository_1 = require("../data-access-layer/query/posts-query-repository");
const posts_command_repository_1 = require("../data-access-layer/command/posts-command-repository");
const valid_id_check_middleware_1 = require("../middleware/valid-id-check-middleware");
const post_existance_check_schema_1 = require("../middleware/post-existance-check-schema");
const user_query_check_schema_1 = require("../middleware/user-query-check-schema");
const jwt_verify_middleware_1 = require("../middleware/jwt-verify-middleware");
const express_validator_1 = require("express-validator");
const comments_service_1 = require("../busines-logic-layer/comments-service");
const comments_query_repository_1 = require("../data-access-layer/query/comments-query-repository");
const getPostsRouter = () => {
    const router = express_1.default.Router();
    router.get('/', 
    // queryPostValidateMiddleware,
    // validationErrorMiddleware,
    (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const posts = yield posts_query_repository_1.postQueryRepository.getAllPosts(req.query);
        res.status(constants_1.HTTP_STATUSES.OK).json(posts);
    }));
    router.get('/:id', (0, valid_id_check_middleware_1.validIdCheckMiddleware)(), validation_error_middleware_1.validationErrorMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const postId = req.params.id;
        const post = yield posts_query_repository_1.postQueryRepository.getPostById(postId);
        if (!post) {
            res.sendStatus(constants_1.HTTP_STATUSES.NOT_FOUND);
            return;
        }
        res.status(constants_1.HTTP_STATUSES.OK).send(post);
    }));
    router.get('/:id/comments', (0, valid_id_check_middleware_1.validIdCheckMiddleware)(), validation_error_middleware_1.validationErrorMiddleware, ...post_existance_check_schema_1.postExistanceCheckMiddleware, user_query_check_schema_1.validateQueryParamsWithDefault, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const comments = yield posts_query_repository_1.postQueryRepository.getCommentsByPostId(req.params.id, req.query);
        res.status(constants_1.HTTP_STATUSES.OK).send(comments);
    }));
    router.post('/', basic_auth_middleware_1.basicAuthMiddleware, post_validate_middleware_1.postValidateMiddleware, validation_error_middleware_1.validationErrorMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const newPostId = yield posts_command_repository_1.postsCommandRepository.addPost(req.body);
        if (!newPostId) {
            res.sendStatus(constants_1.HTTP_STATUSES.SERVER_ERROR);
            return;
        }
        const newPost = yield posts_query_repository_1.postQueryRepository.getPostById(newPostId);
        if (!newPost) {
            res.sendStatus(constants_1.HTTP_STATUSES.SERVER_ERROR);
            return;
        }
        res.status(constants_1.HTTP_STATUSES.CREATED).json(newPost);
    }));
    router.post('/:id/comments', (0, valid_id_check_middleware_1.validIdCheckMiddleware)(), ...post_existance_check_schema_1.postExistanceCheckMiddleware, validation_error_middleware_1.validationErrorMiddleware, (0, express_validator_1.body)('content')
        .notEmpty()
        .isLength({ min: 20, max: 300 })
        .withMessage('Incorrect comment content'), validation_error_middleware_1.validationErrorMiddleware, jwt_verify_middleware_1.jwtVerifyMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const newCommentId = yield comments_service_1.commentsService.createNewComment({
            userId: req.context.userId,
            postId: req.params.id,
            content: req.body.content,
        });
        if (!newCommentId) {
            res.sendStatus(constants_1.HTTP_STATUSES.SERVER_ERROR);
            return;
        }
        const comment = yield comments_query_repository_1.commentsQueryRepository.getCommentById(newCommentId);
        if (!comment) {
            res.sendStatus(constants_1.HTTP_STATUSES.SERVER_ERROR);
            return;
        }
        res.status(constants_1.HTTP_STATUSES.CREATED).send(comment);
    }));
    router.put('/:id', basic_auth_middleware_1.basicAuthMiddleware, (0, valid_id_check_middleware_1.validIdCheckMiddleware)(), validation_error_middleware_1.validationErrorMiddleware, ...post_existance_check_schema_1.postExistanceCheckMiddleware, post_validate_middleware_1.postValidateMiddleware, validation_error_middleware_1.validationErrorMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const postId = req.params.id;
        const post = yield posts_query_repository_1.postQueryRepository.getPostById(postId);
        if (!post) {
            res.sendStatus(constants_1.HTTP_STATUSES.NOT_FOUND);
            return;
        }
        const postUpdated = yield posts_command_repository_1.postsCommandRepository.updatePost(postId, req.body);
        if (!postUpdated) {
            res.sendStatus(constants_1.HTTP_STATUSES.SERVER_ERROR);
            return;
        }
        res.sendStatus(constants_1.HTTP_STATUSES.NO_CONTENT);
    }));
    router.delete('/:id', basic_auth_middleware_1.basicAuthMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const id = req.params.id;
        const blog = yield posts_query_repository_1.postQueryRepository.getPostById(id);
        if (!blog) {
            res.sendStatus(constants_1.HTTP_STATUSES.NOT_FOUND);
            return;
        }
        const deleteResult = yield posts_command_repository_1.postsCommandRepository.deletePost(id);
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