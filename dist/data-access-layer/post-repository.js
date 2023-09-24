"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.postsRepository = void 0;
const postsDb = {};
exports.postsRepository = {
    getAllPosts() {
        return Object.values(postsDb);
    },
};
//# sourceMappingURL=post-repository.js.map