"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.blogsRepository = void 0;
let blogsDb = {};
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
    updateBlog(id, blogUpdate) {
        blogsDb[id] = Object.assign({ id }, blogUpdate);
        return true;
    },
    deleteBlogById(id) {
        delete blogsDb[id];
        return true;
    },
    deleteAllBlogs() {
        blogsDb = {};
    },
};
//# sourceMappingURL=blogs-repository.js.map