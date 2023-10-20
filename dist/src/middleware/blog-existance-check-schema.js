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
exports.blogExistanceCheckMiddleware = void 0;
const express_validator_1 = require("express-validator");
const constants_1 = require("./constants");
const constants_2 = require("../utils/constants");
const blogs_query_repository_1 = require("../repositories/query/blogs-query-repository");
const blogsExistsCheck = (0, express_validator_1.checkSchema)({
    [constants_1.BLOG_VALIDATION_FIELDS.ID]: {
        optional: true,
        in: 'params',
        custom: {
            options: (blogId) => __awaiter(void 0, void 0, void 0, function* () {
                const blog = yield blogs_query_repository_1.blogsQueryRepository.getBlogById(blogId);
                if (!blog)
                    throw new Error(constants_1.BLOG_ERROR_MESSAGES.BLOG_NOT_EXISTS_ERROR);
            }),
        },
    },
});
const blogExistsErrorSummary = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const errors = yield (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        const errorsMessages = Object.entries(errors.mapped()).map(([key, value]) => ({
            field: key,
            message: value.msg,
        }));
        res.sendStatus(constants_2.HTTP_STATUSES.NOT_FOUND);
        return;
    }
    next();
});
exports.blogExistanceCheckMiddleware = [blogsExistsCheck, blogExistsErrorSummary];
//# sourceMappingURL=blog-existance-check-schema.js.map