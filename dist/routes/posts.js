"use strict";
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
const blogs_repository_1 = require("../data-access-layer/blogs-repository");
const getPostsRouter = () => {
    const router = express_1.default.Router();
    router.get('/', (_, res) => {
        const posts = post_repository_1.postsRepository.getAllPosts();
        const postsWithBlogName = posts.map((post) => {
            var _a;
            const blog = blogs_repository_1.blogsRepository.getBlogById(post.blogId);
            return Object.assign(Object.assign({}, post), { blogName: (_a = blog === null || blog === void 0 ? void 0 : blog.name) !== null && _a !== void 0 ? _a : '' });
        });
        res.status(200).json(postsWithBlogName);
    });
    router.get('/:id', (req, res) => {
        const postId = req.params.id;
        const post = post_repository_1.postsRepository.getPostById(postId);
        if (!post) {
            res.sendStatus(404);
            return;
        }
        const blog = blogs_repository_1.blogsRepository.getBlogById(post.blogId);
        if (!blog) {
            res.sendStatus(404);
            return;
        }
        res.status(200).send(Object.assign(Object.assign({}, post), { blogName: blog.name }));
    });
    router.post('/', basic_auth_middleware_1.basicAuthMiddleware, (0, post_validate_middleware_1.postValidateMiddleware)(), validation_error_middleware_1.validationErrorMiddleware, (req, res) => {
        const blogId = req.body.blogId;
        const blog = blogs_repository_1.blogsRepository.getBlogById(blogId);
        if (!blog) {
            res.sendStatus(500);
            return;
        }
        const newPostId = post_repository_1.postsRepository.addPost(req.body);
        const newPost = post_repository_1.postsRepository.getPostById(newPostId);
        if (!newPost) {
            res.sendStatus(500);
            return;
        }
        res.status(201).json(Object.assign(Object.assign({}, newPost), { blogName: blog.name }));
    });
    router.put('/:id', basic_auth_middleware_1.basicAuthMiddleware, (0, post_validate_middleware_1.postValidateMiddleware)(), validation_error_middleware_1.validationErrorMiddleware, (req, res) => {
        const postId = req.params.id;
        const post = post_repository_1.postsRepository.getPostById(postId);
        if (!post) {
            res.sendStatus(404);
            return;
        }
        const postUpdated = post_repository_1.postsRepository.updatePost(postId, req.body);
        if (!postUpdated) {
            res.sendStatus(500);
            return;
        }
        res.sendStatus(204);
    });
    router.delete('/:id', basic_auth_middleware_1.basicAuthMiddleware, (req, res) => {
        const id = req.params.id;
        const blog = post_repository_1.postsRepository.getPostById(id);
        if (!blog) {
            res.sendStatus(404);
            return;
        }
        const deleteResult = post_repository_1.postsRepository.deletePost(id);
        if (!deleteResult) {
            res.sendStatus(500);
            return;
        }
        res.sendStatus(204);
    });
    return router;
};
exports.getPostsRouter = getPostsRouter;
//# sourceMappingURL=posts.js.map