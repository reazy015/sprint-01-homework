"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.queryBlogValidateMiddleware = exports.postBlogValidateMiddleware = void 0;
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
const queryBlogValidateMiddleware = () => (0, express_validator_1.checkSchema)({
    [constants_1.BLOG_VALIDATION_FIELDS.SORT_BY]: {
        optional: true,
        trim: true,
        notEmpty: true,
        isInt: { negated: true },
        errorMessage: constants_1.BLOG_ERROR_MESSAGES[constants_1.BLOG_VALIDATION_FIELDS.SORT_BY],
    },
    [constants_1.BLOG_VALIDATION_FIELDS.SORT_DIRECTION]: {
        optional: true,
        trim: true,
        isString: true,
        notEmpty: true,
        isIn: {
            options: ['asc', 'desc'],
        },
        errorMessage: constants_1.BLOG_ERROR_MESSAGES[constants_1.BLOG_VALIDATION_FIELDS.SORT_DIRECTION],
    },
    [constants_1.BLOG_VALIDATION_FIELDS.PAGE_SIZE]: {
        optional: true,
        trim: true,
        isInt: true,
        notEmpty: true,
        isIn: {
            options: ['asc', 'desc'],
        },
        errorMessage: constants_1.BLOG_ERROR_MESSAGES[constants_1.BLOG_VALIDATION_FIELDS.PAGE_SIZE],
    },
    [constants_1.BLOG_VALIDATION_FIELDS.PAGE_NUMBER]: {
        optional: true,
        trim: true,
        isInt: true,
        notEmpty: true,
        isIn: {
            options: ['asc', 'desc'],
        },
        errorMessage: constants_1.BLOG_ERROR_MESSAGES[constants_1.BLOG_VALIDATION_FIELDS.PAGE_NUMBER],
    },
}, ['query']);
exports.queryBlogValidateMiddleware = queryBlogValidateMiddleware;
//# sourceMappingURL=blog-validate-middleware.js.map