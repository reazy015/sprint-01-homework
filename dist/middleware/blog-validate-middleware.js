"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.postBlogValidateMiddleware = void 0;
const express_validator_1 = require("express-validator");
const constants_1 = require("./constants");
const WEBSITE_URL_REGEXP = new RegExp('^https://([a-zA-Z0-9_-]+.)+[a-zA-Z0-9_-]+(/[a-zA-Z0-9_-]+)*/?$');
const postBlogValidateMiddleware = () => (0, express_validator_1.checkSchema)({
    [constants_1.BLOG_VALIDATION_FIELDS.NAME]: {
        trim: true,
        isString: true,
        isLength: {
            options: { max: 15, min: 3 },
        },
        errorMessage: constants_1.BLOG_ERROR_MESSAGES[constants_1.BLOG_VALIDATION_FIELDS.NAME],
    },
    [constants_1.BLOG_VALIDATION_FIELDS.DESCRIPTION]: {
        trim: true,
        isString: true,
        isLength: {
            options: { max: 500 },
        },
        errorMessage: constants_1.BLOG_ERROR_MESSAGES[constants_1.BLOG_VALIDATION_FIELDS.DESCRIPTION],
    },
    [constants_1.BLOG_VALIDATION_FIELDS.WEBSITE_URL]: {
        trim: true,
        isString: true,
        isLength: {
            options: { max: 100 },
        },
        matches: {
            options: WEBSITE_URL_REGEXP,
        },
        errorMessage: constants_1.BLOG_ERROR_MESSAGES[constants_1.BLOG_VALIDATION_FIELDS.WEBSITE_URL],
    },
});
exports.postBlogValidateMiddleware = postBlogValidateMiddleware;
//# sourceMappingURL=blog-validate-middleware.js.map