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
const getBlogsRouter = () => {
    const router = express_1.default.Router();
    router.get('/', (_, res) => {
        const blogs = blogs_repository_1.blogsRepository.getAllBlogs();
        res.status(200).json(blogs);
    });
    router.get('/:id', (req, res) => {
        const id = req.params.id;
        const blog = blogs_repository_1.blogsRepository.getBlogById(id);
        if (!blog) {
            res.status(404);
            return;
        }
        res.status(200).send(blog);
    });
    router.post('/', basic_auth_middleware_1.basicAuthMiddleware, (0, blog_validate_middleware_1.postBlogValidateMiddleware)(), validation_error_middleware_1.validationErrorMiddleware, (req, res) => {
        const addBlogData = req.body;
        const newBlogId = blogs_repository_1.blogsRepository.addBlog(addBlogData);
        const newBlog = blogs_repository_1.blogsRepository.getBlogById(newBlogId);
        if (!newBlog) {
            res.sendStatus(500);
            return;
        }
        res.status(201).json(newBlog);
    });
    router.put('/:id', basic_auth_middleware_1.basicAuthMiddleware, (0, blog_validate_middleware_1.postBlogValidateMiddleware)(), validation_error_middleware_1.validationErrorMiddleware, (req, res) => {
        const id = req.params.id;
        const blog = blogs_repository_1.blogsRepository.getBlogById(id);
        if (!blog) {
            res.sendStatus(404);
            return;
        }
        const updateResult = blogs_repository_1.blogsRepository.updateBlog(id, req.body);
        if (!updateResult) {
            res.sendStatus(500);
            return;
        }
        res.sendStatus(204);
    });
    router.delete('/:id', basic_auth_middleware_1.basicAuthMiddleware, (req, res) => {
        const id = req.params.id;
        const blog = blogs_repository_1.blogsRepository.getBlogById(id);
        if (!blog) {
            res.sendStatus(404);
            return;
        }
        const deleteResult = blogs_repository_1.blogsRepository.deleteBlogById(id);
        if (!deleteResult) {
            res.sendStatus(500);
            return;
        }
        res.sendStatus(204);
    });
    return router;
};
exports.getBlogsRouter = getBlogsRouter;
//# sourceMappingURL=blogs.js.map