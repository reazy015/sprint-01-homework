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
exports.blogsQueryRepository = void 0;
const mongodb_1 = require("mongodb");
const db_1 = require("../../db/db");
const blogsCollection = db_1.db.collection('blogs');
const postsCollection = db_1.db.collection('posts');
const DEFAULT_QUERY_PARAMS = {
    searchTermName: '',
    pageSize: 10,
    pageNumber: 1,
    sortBy: 'createdAt',
    sortDirection: 'desc',
};
exports.blogsQueryRepository = {
    getAllBlogs(queryParams) {
        return __awaiter(this, void 0, void 0, function* () {
            const { searchNameTerm = DEFAULT_QUERY_PARAMS.searchTermName, pageSize = DEFAULT_QUERY_PARAMS.pageSize, pageNumber = DEFAULT_QUERY_PARAMS.pageNumber, sortBy = DEFAULT_QUERY_PARAMS.sortBy, sortDirection = DEFAULT_QUERY_PARAMS.sortDirection, } = queryParams;
            const sortDir = sortDirection === 'asc' ? 1 : -1;
            const filter = { name: { $regex: searchNameTerm, $options: 'i' } };
            const skip = pageNumber * (pageSize - 1);
            const blogs = yield blogsCollection
                .find(filter)
                .sort({ [sortBy]: sortDir })
                .skip(skip)
                .limit(pageSize)
                .toArray();
            const totalBlogsCount = yield blogsCollection.countDocuments(filter);
            return {
                pagesCount: Math.ceil(totalBlogsCount / pageSize),
                page: pageNumber,
                pageSize: pageSize,
                totalCount: totalBlogsCount,
                items: blogs.map((blog) => ({
                    id: blog._id.toString(),
                    name: blog.name,
                    websiteUrl: blog.websiteUrl,
                    description: blog.description,
                    createdAt: blog.createdAt,
                    isMembership: blog.isMembership,
                })),
            };
        });
    },
    getBlogById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const blog = yield blogsCollection.findOne({ _id: new mongodb_1.ObjectId(id) });
            if (blog) {
                return {
                    id: blog._id.toString(),
                    name: blog.name,
                    description: blog.description,
                    websiteUrl: blog.websiteUrl,
                    createdAt: blog.createdAt,
                    isMembership: blog.isMembership,
                };
            }
            return null;
        });
    },
    getAllPostsByBlogId(id, queryParams) {
        return __awaiter(this, void 0, void 0, function* () {
            const { pageSize = DEFAULT_QUERY_PARAMS.pageSize, pageNumber = DEFAULT_QUERY_PARAMS.pageNumber, sortBy = DEFAULT_QUERY_PARAMS.sortBy, sortDirection = DEFAULT_QUERY_PARAMS.sortDirection, } = queryParams;
            const sortDir = sortDirection === 'asc' ? 1 : -1;
            const skip = pageNumber * (pageSize - 1);
            const posts = yield postsCollection
                .find({ blogId: id })
                .sort({ [sortBy]: sortDir })
                .skip(skip)
                .limit(pageSize)
                .toArray();
            const postsTotalCount = yield postsCollection.countDocuments({ blogId: id });
            return {
                pagesCount: Math.ceil(postsTotalCount / pageSize),
                totalCount: postsTotalCount,
                page: pageNumber,
                pageSize: pageSize,
                items: posts.map((post) => ({
                    id: post._id.toString(),
                    blogName: post.blogName,
                    title: post.title,
                    shortDescription: post.shortDescription,
                    content: post.content,
                    blogId: post.blogId,
                    createdAt: post.createdAt,
                })),
            };
        });
    },
};
//# sourceMappingURL=blogs-query-repository.js.map