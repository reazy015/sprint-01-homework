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
exports.postExistanceCheckMiddleware = void 0;
const express_validator_1 = require("express-validator");
const constants_1 = require("./constants");
const constants_2 = require("../utils/constants");
const posts_query_repository_1 = require("../data-access-layer/query/posts-query-repository");
const postsExistanceCheck = (0, express_validator_1.checkSchema)({
    [constants_1.POST_VALIDATION_FIELDS.ID]: {
        optional: true,
        in: 'params',
        custom: {
            options: (postId) => __awaiter(void 0, void 0, void 0, function* () {
                const post = yield posts_query_repository_1.postQueryRepository.getPostById(postId);
                if (!post)
                    throw new Error(constants_1.POST_ERROR_MESSAGES.BLOG_NOT_EXISTS_ERROR);
            }),
        },
    },
});
const postExistsErrorSummary = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const errors = yield (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        const errorsMessages = Object.entries(errors.mapped()).map(([key, value]) => ({
            field: key,
            message: value.msg,
        }));
        res.status(constants_2.HTTP_STATUSES.NOT_FOUND).send({
            errorsMessages,
        });
        return;
    }
    next();
});
exports.postExistanceCheckMiddleware = [postsExistanceCheck, postExistsErrorSummary];
//# sourceMappingURL=post-existance-check-schema.js.map