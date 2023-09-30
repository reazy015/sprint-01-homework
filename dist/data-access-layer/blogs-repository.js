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
exports.blogsRepository = void 0;
const mongodb_1 = require("mongodb");
const db_1 = require("./db");
const blogsCollection = db_1.db.collection('blogs');
exports.blogsRepository = {
    getAllBlogs() {
        return __awaiter(this, void 0, void 0, function* () {
            const blogs = yield blogsCollection.find({}, { projection: { _id: 0 } }).toArray();
            return blogs;
        });
    },
    getBlogById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const blog = yield blogsCollection.findOne({ id }, { projection: { _id: 0 } });
            if (blog) {
                return blog;
            }
            return null;
        });
    },
    addBlog(blog) {
        return __awaiter(this, void 0, void 0, function* () {
            const id = new mongodb_1.UUID(mongodb_1.UUID.generate()).toString();
            const createdAt = new Date().toISOString();
            const created = yield db_1.db
                .collection('blogs')
                .insertOne(Object.assign({ id, createdAt, isMembership: true }, blog));
            if (created) {
                return id;
            }
            return false;
        });
    },
    updateBlog(id, blogUpdate) {
        return __awaiter(this, void 0, void 0, function* () {
            const updated = yield blogsCollection.updateOne({ id }, { $set: Object.assign({}, blogUpdate) });
            return Boolean(updated);
        });
    },
    deleteBlogById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const deleted = yield blogsCollection.deleteOne({ id });
            return Boolean(deleted);
        });
    },
    deleteAllBlogs() {
        return __awaiter(this, void 0, void 0, function* () {
            const deleted = yield blogsCollection.deleteMany();
            return Boolean(deleted);
        });
    },
};
//# sourceMappingURL=blogs-repository.js.map