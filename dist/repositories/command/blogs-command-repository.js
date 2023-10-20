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
exports.blogsCommandRepository = void 0;
const mongodb_1 = require("mongodb");
const db_1 = require("../../db/db");
const blogsCollection = db_1.db.collection('blogs');
const postsCollection = db_1.db.collection('posts');
exports.blogsCommandRepository = {
    addBlog(blog) {
        return __awaiter(this, void 0, void 0, function* () {
            const createdAt = new Date().toISOString();
            const createdBlogs = yield db_1.db
                .collection('blogs')
                .insertOne(Object.assign(Object.assign({}, blog), { createdAt, isMembership: false }));
            if (createdBlogs.acknowledged) {
                return createdBlogs.insertedId.toString();
            }
            return false;
        });
    },
    addPostByBlogId(id, post) {
        return __awaiter(this, void 0, void 0, function* () {
            const createdAt = new Date().toISOString();
            const blog = yield blogsCollection.findOne({ _id: new mongodb_1.ObjectId(id) });
            const newPost = {
                blogId: id,
                blogName: blog.name,
                title: post.title,
                shortDescription: post.shortDescription,
                content: post.content,
                createdAt,
            };
            const createdPost = yield postsCollection.insertOne(Object.assign({}, newPost));
            return createdPost.acknowledged ? Object.assign({ id: createdPost.insertedId.toString() }, newPost) : null;
        });
    },
    updateBlog(id, blogUpdate) {
        return __awaiter(this, void 0, void 0, function* () {
            const updatedBlog = yield blogsCollection.updateOne({ _id: new mongodb_1.ObjectId(id) }, { $set: Object.assign(Object.assign({}, blogUpdate), { isMembership: false }) });
            return updatedBlog.acknowledged;
        });
    },
    deleteBlogById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const deleted = yield blogsCollection.deleteOne({ _id: new mongodb_1.ObjectId(id) });
            return deleted.acknowledged;
        });
    },
    deleteAllBlogs() {
        return __awaiter(this, void 0, void 0, function* () {
            const deleted = yield blogsCollection.deleteMany();
            return deleted.acknowledged;
        });
    },
};
//# sourceMappingURL=blogs-command-repository.js.map