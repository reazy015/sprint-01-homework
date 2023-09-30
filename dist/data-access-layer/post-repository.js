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
exports.postsRepository = void 0;
const mongodb_1 = require("mongodb");
const db_1 = require("./db");
const postsCollection = db_1.db.collection('posts');
const blogsCollection = db_1.db.collection('blogs');
exports.postsRepository = {
    getAllPosts() {
        return __awaiter(this, void 0, void 0, function* () {
            const posts = yield postsCollection.find({}, { projection: { _id: 0 } }).toArray();
            return posts;
        });
    },
    getPostById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const post = yield postsCollection.findOne({ id }, { projection: { _id: 0 } });
            return post ? post : null;
        });
    },
    addPost(post) {
        return __awaiter(this, void 0, void 0, function* () {
            const id = new mongodb_1.UUID(mongodb_1.UUID.generate()).toString();
            const createdAt = new Date().toISOString();
            const blog = yield blogsCollection.findOne({ id: post.blogId });
            if (!blog) {
                return false;
            }
            const postCreated = yield db_1.db
                .collection('posts')
                .insertOne(Object.assign({ id,
                createdAt, blogName: blog.name }, post));
            if (!postCreated) {
                return false;
            }
            return id;
        });
    },
    updatePost(id, post) {
        return __awaiter(this, void 0, void 0, function* () {
            const blog = yield blogsCollection.findOne({ id: post.blogId });
            if (!blog) {
                return false;
            }
            const postUpdated = yield postsCollection.updateOne({ id }, { $set: Object.assign({}, post) });
            if (!postUpdated) {
                return false;
            }
            return true;
        });
    },
    deletePost(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const postDeleted = yield postsCollection.deleteOne({ id });
            return Boolean(postDeleted);
        });
    },
    deleteAllPosts() {
        return __awaiter(this, void 0, void 0, function* () {
            const allPostsDeleted = yield postsCollection.deleteMany();
            return Boolean(allPostsDeleted);
        });
    },
};
//# sourceMappingURL=post-repository.js.map