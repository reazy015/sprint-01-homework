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
exports.commentBelongsToMiddleware = void 0;
const db_1 = require("../db/db");
const mongodb_1 = require("mongodb");
const constants_1 = require("../utils/constants");
const commentsCollection = db_1.db.collection('comments');
const commentBelongsToMiddleware = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const comment = yield commentsCollection.findOne({ _id: new mongodb_1.ObjectId(req.params.id) });
    if (!comment) {
        res.sendStatus(constants_1.HTTP_STATUSES.NOT_FOUND);
        return;
    }
    if (comment.commentatorInfo.userId !== req.context.userId) {
        res.sendStatus(constants_1.HTTP_STATUSES.FORBIDDEN);
        return;
    }
    next();
});
exports.commentBelongsToMiddleware = commentBelongsToMiddleware;
//# sourceMappingURL=comment-belongs-to-middleware.js.map