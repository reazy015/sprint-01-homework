"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.postBlogValidateMiddleware = void 0;
const express_validator_1 = require("express-validator");
const constants_1 = require("./constants");
const postBlogValidateMiddleware = () => (0, express_validator_1.checkSchema)({
    name: {
        isLength: {
            options: { max: 15, min: 3 },
        },
        errorMessage: constants_1.BLOG_ERROR_MESSAGES.name,
    },
    description: {
        isString: true,
        isLength: {
            options: { max: 500 },
        },
        errorMessage: constants_1.BLOG_ERROR_MESSAGES.description,
    },
    websiteUrl: {
        isString: true,
        isLength: {
            options: { max: 100 },
        },
        matches: {
            options: new RegExp('^https://([a-zA-Z0-9_-]+.)+[a-zA-Z0-9_-]+(/[a-zA-Z0-9_-]+)*/?$'),
        },
        errorMessage: constants_1.BLOG_ERROR_MESSAGES.websiteUrl,
    },
});
exports.postBlogValidateMiddleware = postBlogValidateMiddleware;
//# sourceMappingURL=blog-validate-middleware.js.map