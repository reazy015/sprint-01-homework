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
            options: (blogId) => __awaiter(void 0, void 0, void 0, function* () {
                const blog = yield blogs_repository_1.blogsRepository.getBlogById(blogId);
                if (!blog)
                    throw new Error(constants_1.POST_ERROR_MESSAGES.BLOG_NOT_EXISTS_ERROR);
            }),
        },
    },
});
exports.postValidateMiddleware = postValidateMiddleware;
//# sourceMappingURL=post-validate-middleware-.js.map