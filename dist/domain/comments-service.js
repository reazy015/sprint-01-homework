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
exports.commentsService = void 0;
const comments_command_repository_1 = require("../repositories/command/comments-command-repository");
const users_query_repository_1 = require("../repositories/query/users-query-repository");
exports.commentsService = {
    createNewComment({ userId, postId, content, }) {
        return __awaiter(this, void 0, void 0, function* () {
            const createdAt = new Date().toISOString();
            const user = yield users_query_repository_1.usersQueryRepository.getSingleUserById(userId);
            const newComment = {
                postId: postId,
                content: content,
                commentatorInfo: {
                    userId,
                    userLogin: user.login,
                },
                createdAt: createdAt,
            };
            const insertedCommentId = yield comments_command_repository_1.commentsCommandRespository.addNewComment(newComment);
            return insertedCommentId;
        });
    },
    updateCommentById(id, content) {
        return __awaiter(this, void 0, void 0, function* () {
            const updated = yield comments_command_repository_1.commentsCommandRespository.updateCommentById(id, content);
            return updated;
        });
    },
    deleteCommentById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const updated = yield comments_command_repository_1.commentsCommandRespository.deleteCommentById(id);
            return updated;
        });
    },
};
//# sourceMappingURL=comments-service.js.map