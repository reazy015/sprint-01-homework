"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.blogsRepository = void 0;
const blogsDb = {};
exports.blogsRepository = {
    getAllBlogs() {
        return Object.values(blogsDb);
    },
    getBlogById(id) {
        if (id in blogsDb) {
            return blogsDb[id];
        }
        return null;
    },
    addBlog(blog) {
        const id = +new Date();
        blogsDb[id] = Object.assign({ id: id.toString() }, blog);
        return id.toString();
    },
};
//# sourceMappingURL=blogs-repository.js.map