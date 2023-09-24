"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getBlogsRouter = void 0;
const express_1 = __importDefault(require("express"));
const blogs_repository_1 = require("../data-access-layer/blogs-repository");
const basic_auth_middleware_1 = require("../middleware/basic-auth-middleware");
const blog_validate_middleware_1 = require("../middleware/blog-validate-middleware");
const validation_error_middleware_1 = require("../middleware/validation-error-middleware");
const constants_1 = require("../utils/constants");
const getBlogsRouter = () => {
    const router = express_1.default.Router();
    router.get('/', (_, res) => {
        const blogs = blogs_repository_1.blogsRepository.getAllBlogs();
        res.status(constants_1.HTTP_STATUSES.OK).json(blogs);
    });
    router.get('/:id', (req, res) => {
        const id = req.params.id;
        const blog = blogs_repository_1.blogsRepository.getBlogById(id);
        if (!blog) {
            res.sendStatus(constants_1.HTTP_STATUSES.NOT_FOUND);
            return;
        }
        res.status(constants_1.HTTP_STATUSES.OK).send(blog);
    });
    router.post('/', basic_auth_middleware_1.basicAuthMiddleware, (0, blog_validate_middleware_1.postBlogValidateMiddleware)(), validation_error_middleware_1.validationErrorMiddleware, (req, res) => {
        const addBlogData = req.body;
        const newBlogId = blogs_repository_1.blogsRepository.addBlog(addBlogData);
        const newBlog = blogs_repository_1.blogsRepository.getBlogById(newBlogId);
        if (!newBlog) {
            res.sendStatus(constants_1.HTTP_STATUSES.SERVER_ERROR);
            return;
        }
        res.status(constants_1.HTTP_STATUSES.CREATED).json(newBlog);
    });
    router.put('/:id', basic_auth_middleware_1.basicAuthMiddleware, (0, blog_validate_middleware_1.postBlogValidateMiddleware)(), validation_error_middleware_1.validationErrorMiddleware, (req, res) => {
        const id = req.params.id;
        const blog = blogs_repository_1.blogsRepository.getBlogById(id);
        if (!blog) {
            res.sendStatus(constants_1.HTTP_STATUSES.NOT_FOUND);
            return;
        }
        const updateResult = blogs_repository_1.blogsRepository.updateBlog(id, req.body);
        if (!updateResult) {
            res.sendStatus(constants_1.HTTP_STATUSES.SERVER_ERROR);
            return;
        }
        res.sendStatus(constants_1.HTTP_STATUSES.NO_CONTENT);
    });
    router.delete('/:id', basic_auth_middleware_1.basicAuthMiddleware, (req, res) => {
        const id = req.params.id;
        const blog = blogs_repository_1.blogsRepository.getBlogById(id);
        if (!blog) {
            res.sendStatus(constants_1.HTTP_STATUSES.NOT_FOUND);
            return;
        }
        const deleteResult = blogs_repository_1.blogsRepository.deleteBlogById(id);
        if (!deleteResult) {
            res.sendStatus(constants_1.HTTP_STATUSES.SERVER_ERROR);
            return;
        }
        res.sendStatus(constants_1.HTTP_STATUSES.NO_CONTENT);
    });
    return router;
};
exports.getBlogsRouter = getBlogsRouter;
//# sourceMappingURL=blogs.js.map