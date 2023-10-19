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
Object.defineProperty(exports, "__esModule", { value: true });
exports.postsCommandRepository = void 0;
const mongodb_1 = require("mongodb");
const db_1 = require("../../db/db");
const postsCollection = db_1.db.collection('posts');
const blogsCollection = db_1.db.collection('blogs');
exports.postsCommandRepository = {
    addPost(post) {
        return __awaiter(this, void 0, void 0, function* () {
            const createdAt = new Date().toISOString();
            const blog = yield blogsCollection.findOne({ _id: new mongodb_1.ObjectId(post.blogId) });
            if (!blog) {
                return false;
            }
            const newPost = Object.assign(Object.assign({}, post), { createdAt, blogName: blog.name, blogId: blog._id.toString() });
            const postCreated = yield db_1.db
                .collection('posts')
                .insertOne(Object.assign({}, newPost));
            return postCreated.acknowledged ? postCreated.insertedId.toString() : false;
        });
    },
    updatePost(id, post) {
        return __awaiter(this, void 0, void 0, function* () {
            const postUpdated = yield postsCollection.updateOne({ _id: new mongodb_1.ObjectId(id) }, { $set: Object.assign({}, post) });
            return postUpdated.acknowledged;
        });
    },
    deletePost(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const postDeleted = yield postsCollection.deleteOne({ _id: new mongodb_1.ObjectId(id) });
            return postDeleted.acknowledged;
        });
    },
    deleteAllPosts() {
        return __awaiter(this, void 0, void 0, function* () {
            const allPostsDeleted = yield postsCollection.deleteMany();
            return allPostsDeleted.acknowledged;
        });
    },
};
//# sourceMappingURL=posts-command-repository.js.map