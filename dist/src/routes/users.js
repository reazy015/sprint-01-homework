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
exports.getUsersRouter = void 0;
const express_1 = __importDefault(require("express"));
const basic_auth_middleware_1 = require("../middleware/basic-auth-middleware");
const constants_1 = require("../utils/constants");
const user_query_check_schema_1 = require("../middleware/user-query-check-schema");
const new_user_validate_middleware_1 = require("../middleware/new-user-validate.middleware");
const validation_error_middleware_1 = require("../middleware/validation-error-middleware");
const valid_id_check_middleware_1 = require("../middleware/valid-id-check-middleware");
const users_query_repository_1 = require("../repositories/query/users-query-repository");
const users_service_1 = require("../domain/users-service");
const users_command_repository_1 = require("../repositories/command/users-command-repository");
const getUsersRouter = () => {
    const router = express_1.default.Router();
    router.get('/', basic_auth_middleware_1.basicAuthMiddleware, user_query_check_schema_1.validateQueryParamsWithDefault, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const users = yield users_query_repository_1.usersQueryRepository.getUsers(req.query);
        res.status(constants_1.HTTP_STATUSES.OK).send(users);
    }));
    router.post('/', basic_auth_middleware_1.basicAuthMiddleware, new_user_validate_middleware_1.newUserValidateMiddleware, validation_error_middleware_1.validationErrorMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const newUserId = yield users_service_1.usersService.addNewUser(req.body);
        if (!newUserId) {
            res.sendStatus(constants_1.HTTP_STATUSES.SERVER_ERROR);
            return;
        }
        const createdUser = yield users_query_repository_1.usersQueryRepository.getSingleUserById(newUserId);
        if (!createdUser) {
            res.sendStatus(constants_1.HTTP_STATUSES.SERVER_ERROR);
            return;
        }
        res.status(constants_1.HTTP_STATUSES.CREATED).send(createdUser);
    }), router.delete('/:id', basic_auth_middleware_1.basicAuthMiddleware, (0, valid_id_check_middleware_1.validIdCheckMiddleware)(), validation_error_middleware_1.validationErrorMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const user = yield users_query_repository_1.usersQueryRepository.getSingleUserById(req.params.id);
        if (!user) {
            res.sendStatus(constants_1.HTTP_STATUSES.NOT_FOUND);
            return;
        }
        const deleted = yield users_command_repository_1.usersCommandRepository.deleteUserById(req.params.id);
        if (!deleted) {
            res.sendStatus(constants_1.HTTP_STATUSES.SERVER_ERROR);
        }
        res.sendStatus(constants_1.HTTP_STATUSES.NO_CONTENT);
    })));
    return router;
};
exports.getUsersRouter = getUsersRouter;
//# sourceMappingURL=users.js.map