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
exports.commentsCommandRespository = void 0;
const mongodb_1 = require("mongodb");
const db_1 = require("../../db/db");
const commentsCollection = db_1.db.collection('comments');
exports.commentsCommandRespository = {
    addNewComment(newComment) {
        return __awaiter(this, void 0, void 0, function* () {
            const insertedComment = yield commentsCollection.insertOne(newComment);
            return insertedComment.acknowledged ? insertedComment.insertedId.toString() : null;
        });
    },
    updateCommentById(id, content) {
        return __awaiter(this, void 0, void 0, function* () {
            const updatedComment = yield commentsCollection.updateOne({ _id: new mongodb_1.ObjectId(id) }, { $set: { content: content } });
            return updatedComment.acknowledged;
        });
    },
    deleteCommentById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const deleted = yield commentsCollection.deleteOne({ _id: new mongodb_1.ObjectId(id) });
            return deleted.acknowledged;
        });
    },
    deleteAllComments() {
        return __awaiter(this, void 0, void 0, function* () {
            const deleted = yield commentsCollection.deleteMany();
            return deleted.acknowledged;
        });
    },
};
//# sourceMappingURL=comments-command-repository.js.map