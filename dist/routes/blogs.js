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
exports.getBlogsRouter = void 0;
const express_1 = __importDefault(require("express"));
const basic_auth_middleware_1 = require("../middleware/basic-auth-middleware");
const blog_validate_middleware_1 = require("../middleware/blog-validate-middleware");
const validation_error_middleware_1 = require("../middleware/validation-error-middleware");
const constants_1 = require("../utils/constants");
const blogs_query_repository_1 = require("../data-access-layer/query/blogs-query-repository");
const blogs_command_repository_1 = require("../data-access-layer/command/blogs-command-repository");
const blog_existance_check_schema_1 = require("../middleware/blog-existance-check-schema");
const valid_id_check_middleware_1 = require("../middleware/valid-id-check-middleware");
const post_validate_middleware_1 = require("../middleware/post-validate-middleware-");
const getBlogsRouter = () => {
    const router = express_1.default.Router();
    router.get('/', (0, blog_validate_middleware_1.queryBlogValidateMiddleware)(), validation_error_middleware_1.validationErrorMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const blogs = yield blogs_query_repository_1.blogsQueryRepository.getAllBlogs(req.query);
        res.status(constants_1.HTTP_STATUSES.OK).json(blogs);
    }));
    router.get('/:id', (0, valid_id_check_middleware_1.validIdCheckMiddleware)(), validation_error_middleware_1.validationErrorMiddleware, ...blog_existance_check_schema_1.blogExistanceCheckMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const id = req.params.id;
        const blog = yield blogs_query_repository_1.blogsQueryRepository.getBlogById(id);
        if (!blog) {
            res.sendStatus(constants_1.HTTP_STATUSES.NOT_FOUND);
            return;
        }
        res.status(constants_1.HTTP_STATUSES.OK).send(blog);
    }));
    router.get('/:id/posts', basic_auth_middleware_1.basicAuthMiddleware, (0, valid_id_check_middleware_1.validIdCheckMiddleware)(), validation_error_middleware_1.validationErrorMiddleware, ...blog_existance_check_schema_1.blogExistanceCheckMiddleware, (0, blog_validate_middleware_1.queryBlogValidateMiddleware)(), validation_error_middleware_1.validationErrorMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const posts = yield blogs_query_repository_1.blogsQueryRepository.getAllPostsByBlogId(req.params.id, req.query);
        res.status(constants_1.HTTP_STATUSES.OK).send(posts);
    }));
    router.post('/', basic_auth_middleware_1.basicAuthMiddleware, (0, blog_validate_middleware_1.postBlogValidateMiddleware)(), validation_error_middleware_1.validationErrorMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const addBlogData = req.body;
        const newBlogId = yield blogs_command_repository_1.blogsCommandRepository.addBlog(addBlogData);
        if (!newBlogId) {
            res.sendStatus(constants_1.HTTP_STATUSES.SERVER_ERROR);
            return;
        }
        const newBlog = yield blogs_query_repository_1.blogsQueryRepository.getBlogById(newBlogId);
        if (!newBlog) {
            res.sendStatus(constants_1.HTTP_STATUSES.SERVER_ERROR);
            return;
        }
        res.status(constants_1.HTTP_STATUSES.CREATED).json(newBlog);
    }));
    router.post('/:id/posts', (0, valid_id_check_middleware_1.validIdCheckMiddleware)(), validation_error_middleware_1.validationErrorMiddleware, ...blog_existance_check_schema_1.blogExistanceCheckMiddleware, post_validate_middleware_1.postByBlogValidateMiddleware, validation_error_middleware_1.validationErrorMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const createdPost = yield blogs_command_repository_1.blogsCommandRepository.addPostByBlogId(req.params.id, req.body);
        if (!createdPost) {
            res.sendStatus(constants_1.HTTP_STATUSES.SERVER_ERROR);
            return;
        }
        res.status(constants_1.HTTP_STATUSES.CREATED).send(createdPost);
    }));
    router.put('/:id', basic_auth_middleware_1.basicAuthMiddleware, (0, blog_validate_middleware_1.postBlogValidateMiddleware)(), validation_error_middleware_1.validationErrorMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const id = req.params.id;
        const blog = yield blogs_query_repository_1.blogsQueryRepository.getBlogById(id);
        if (!blog) {
            res.sendStatus(constants_1.HTTP_STATUSES.NOT_FOUND);
            return;
        }
        const updateResult = yield blogs_command_repository_1.blogsCommandRepository.updateBlog(id, req.body);
        if (!updateResult) {
            res.sendStatus(constants_1.HTTP_STATUSES.SERVER_ERROR);
            return;
        }
        res.sendStatus(constants_1.HTTP_STATUSES.NO_CONTENT);
    }));
    router.delete('/:id', basic_auth_middleware_1.basicAuthMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const id = req.params.id;
        const blog = yield blogs_query_repository_1.blogsQueryRepository.getBlogById(id);
        if (!blog) {
            res.sendStatus(constants_1.HTTP_STATUSES.NOT_FOUND);
            return;
        }
        const deleteResult = yield blogs_command_repository_1.blogsCommandRepository.deleteBlogById(id);
        if (!deleteResult) {
            res.sendStatus(constants_1.HTTP_STATUSES.SERVER_ERROR);
            return;
        }
        res.sendStatus(constants_1.HTTP_STATUSES.NO_CONTENT);
    }));
    return router;
};
exports.getBlogsRouter = getBlogsRouter;
//# sourceMappingURL=blogs.js.map