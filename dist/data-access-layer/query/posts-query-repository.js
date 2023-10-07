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
exports.postQueryRepository = void 0;
const mongodb_1 = require("mongodb");
const db_1 = require("../../db/db");
const postsCollection = db_1.db.collection('posts');
const DEFAULT_QUERY_PARAMS = {
    searchTermName: '',
    pageSize: 10,
    pageNumber: 1,
    sortBy: 'createdAt',
    sortDirection: 'desc',
};
exports.postQueryRepository = {
    getAllPosts(queryParams) {
        return __awaiter(this, void 0, void 0, function* () {
            const { pageSize = DEFAULT_QUERY_PARAMS.pageSize, pageNumber = DEFAULT_QUERY_PARAMS.pageNumber, sortBy = DEFAULT_QUERY_PARAMS.sortBy, sortDirection = DEFAULT_QUERY_PARAMS.sortDirection, } = queryParams;
            const sortDir = sortDirection === 'asc' ? 1 : -1;
            const skip = pageNumber * (pageSize - 1);
            const posts = yield postsCollection
                .find()
                .sort({ [sortBy]: sortDir })
                .skip(skip)
                .limit(pageSize)
                .toArray();
            const totalPostsCount = yield postsCollection.countDocuments();
            return {
                pagesCount: Math.ceil(totalPostsCount / pageSize),
                totalCount: totalPostsCount,
                page: pageNumber,
                pageSize: pageSize,
                items: posts.map((post) => ({
                    id: post._id.toString(),
                    blogId: post.blogId,
                    blogName: post.blogName,
                    title: post.title,
                    content: post.content,
                    shortDescription: post.shortDescription,
                    createdAt: post.createdAt,
                })),
            };
        });
    },
    getPostById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const post = yield postsCollection.findOne({ _id: new mongodb_1.ObjectId(id) });
            return post
                ? {
                    id: post._id.toString(),
                    blogId: post.blogId,
                    blogName: post.blogName,
                    title: post.title,
                    shortDescription: post.shortDescription,
                    content: post.content,
                    createdAt: post.createdAt,
                }
                : null;
        });
    },
};
//# sourceMappingURL=posts-query-repository.js.map