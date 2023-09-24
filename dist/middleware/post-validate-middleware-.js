"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.postValidateMiddleware = void 0;
const express_validator_1 = require("express-validator");
const constants_1 = require("./constants");
const blogs_repository_1 = require("../data-access-layer/blogs-repository");
const postValidateMiddleware = () => (0, express_validator_1.checkSchema)({
    [constants_1.POST_VALIDATION_FIELDS.TITLE]: {
        trim: true,
        isString: true,
        isLength: {
            options: { min: 3, max: 30 },
        },
        errorMessage: constants_1.POST_ERROR_MESSAGES[constants_1.POST_VALIDATION_FIELDS.TITLE],
    },
    [constants_1.POST_VALIDATION_FIELDS.CONTENT]: {
        trim: true,
        isString: true,
        isLength: {
            options: { min: 3, max: 1000 },
        },
        errorMessage: constants_1.POST_ERROR_MESSAGES[constants_1.POST_VALIDATION_FIELDS.CONTENT],
    },
    [constants_1.POST_VALIDATION_FIELDS.SHORT_DESCRIPTION]: {
        trim: true,
        isString: true,
        isLength: {
            options: { min: 3, max: 100 },
        },
        errorMessage: constants_1.POST_ERROR_MESSAGES[constants_1.POST_VALIDATION_FIELDS.SHORT_DESCRIPTION],
    },
    [constants_1.POST_VALIDATION_FIELDS.BLOG_ID]: {
        custom: {
            options: (blogId) => {
                const blog = blogs_repository_1.blogsRepository.getBlogById(blogId);
                return Boolean(blog);
            },
        },
        errorMessage: constants_1.POST_ERROR_MESSAGES.BLOG_NOT_EXISTS_ERROR,
    },
});
exports.postValidateMiddleware = postValidateMiddleware;
//# sourceMappingURL=post-validate-middleware-.js.map