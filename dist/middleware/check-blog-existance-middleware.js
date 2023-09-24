"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkBlogExistanceMiddleware = void 0;
const blogs_repository_1 = require("../data-access-layer/blogs-repository");
const checkBlogExistanceMiddleware = (req, res, next) => {
    const blog = blogs_repository_1.blogsRepository.getBlogById(req.params.id);
    if (!blog) {
        res.sendStatus(404);
        return;
    }
    next();
};
exports.checkBlogExistanceMiddleware = checkBlogExistanceMiddleware;
//# sourceMappingURL=check-blog-existance-middleware.js.map