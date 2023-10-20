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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCommentsRouter = void 0;
const express_1 = __importDefault(require("express"));
const constants_1 = require("../utils/constants");
const validation_error_middleware_1 = require("../middleware/validation-error-middleware");
const valid_id_check_middleware_1 = require("../middleware/valid-id-check-middleware");
const express_validator_1 = require("express-validator");
const comments_service_1 = require("../domain/comments-service");
const comment_belongs_to_middleware_1 = require("../middleware/comment-belongs-to-middleware");
const comment_existance_check_schema_1 = require("../middleware/comment-existance-check-schema");
const jwt_verify_middleware_1 = require("../middleware/jwt-verify-middleware");
const comments_query_repository_1 = require("../repositories/query/comments-query-repository");
const getCommentsRouter = () => {
    const router = express_1.default.Router();
    router.get('/:id', (0, valid_id_check_middleware_1.validIdCheckMiddleware)(), validation_error_middleware_1.validationErrorMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const comment = yield comments_query_repository_1.commentsQueryRepository.getCommentById(req.params.id);
        if (!comment) {
            res.sendStatus(constants_1.HTTP_STATUSES.NOT_FOUND);
            return;
        }
        res.status(constants_1.HTTP_STATUSES.OK).send(comment);
    }));
    router.put('/:id', (0, valid_id_check_middleware_1.validIdCheckMiddleware)(), validation_error_middleware_1.validationErrorMiddleware, ...comment_existance_check_schema_1.commentExistanceCheckMiddleware, jwt_verify_middleware_1.jwtVerifyMiddleware, comment_belongs_to_middleware_1.commentBelongsToMiddleware, (0, express_validator_1.body)('content')
        .notEmpty()
        .isLength({ min: 20, max: 300 })
        .withMessage('Incorrect comment content'), validation_error_middleware_1.validationErrorMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const updated = yield comments_service_1.commentsService.updateCommentById(req.params.id, req.body.content);
        if (!updated) {
            res.sendStatus(constants_1.HTTP_STATUSES.SERVER_ERROR);
            return;
        }
        res.sendStatus(constants_1.HTTP_STATUSES.NO_CONTENT);
    }));
    router.delete('/:id', (0, valid_id_check_middleware_1.validIdCheckMiddleware)(), validation_error_middleware_1.validationErrorMiddleware, ...comment_existance_check_schema_1.commentExistanceCheckMiddleware, jwt_verify_middleware_1.jwtVerifyMiddleware, comment_belongs_to_middleware_1.commentBelongsToMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const deleted = yield comments_service_1.commentsService.deleteCommentById(req.params.id);
        if (!deleted) {
            res.sendStatus(constants_1.HTTP_STATUSES.SERVER_ERROR);
            return;
        }
        res.sendStatus(constants_1.HTTP_STATUSES.NO_CONTENT);
    }));
    return router;
};
exports.getCommentsRouter = getCommentsRouter;
//# sourceMappingURL=comments.js.map