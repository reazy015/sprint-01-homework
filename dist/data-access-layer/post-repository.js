"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.postsRepository = void 0;
let postsDb = {};
exports.postsRepository = {
    getAllPosts() {
        return Object.values(postsDb);
    },
    getPostById(id) {
        return postsDb[id];
    },
    addPost(post) {
        const id = +new Date();
        postsDb[id] = Object.assign(Object.assign({}, post), { id: id.toString() });
        return id.toString();
    },
    updatePost(id, post) {
        postsDb[id] = Object.assign({ id }, post);
        return true;
    },
    deletePost(id) {
        delete postsDb[id];
        return true;
    },
    deleteAllPosts() {
        postsDb = {};
    },
};
//# sourceMappingURL=post-repository.js.map