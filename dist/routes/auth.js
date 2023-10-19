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
exports.getAuthRouter = void 0;
const express_1 = __importDefault(require("express"));
const constants_1 = require("../utils/constants");
const auth_credentials_check_1 = require("../middleware/auth-credentials-check");
const validation_error_middleware_1 = require("../middleware/validation-error-middleware");
const jwt_verify_middleware_1 = require("../middleware/jwt-verify-middleware");
const new_user_validate_middleware_1 = require("../middleware/new-user-validate.middleware");
const users_service_1 = require("../domain/users-service");
const express_validator_1 = require("express-validator");
const confirmation_check_middleware_1 = require("../middleware/confirmation-check-middleware");
const users_query_repository_1 = require("../repositories/query/users-query-repository");
const getAuthRouter = () => {
    const router = express_1.default.Router();
    router.post('/login', auth_credentials_check_1.authCredentialsCheck, validation_error_middleware_1.validationErrorMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const accessToken = yield users_service_1.usersService.loginUser(req.body);
        if (!accessToken) {
            res.sendStatus(constants_1.HTTP_STATUSES.UNAUTH);
            return;
        }
        res.status(constants_1.HTTP_STATUSES.OK).json({ accessToken });
    }));
    router.get('/me', jwt_verify_middleware_1.jwtVerifyMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        res.status(constants_1.HTTP_STATUSES.OK).send(req.context.userId);
    }));
    router.post('/registration', new_user_validate_middleware_1.newUserValidateMiddleware, validation_error_middleware_1.validationErrorMiddleware, confirmation_check_middleware_1.confirmationCheckMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const code = yield users_service_1.usersService.registerNewUser(req.body);
        if (!code) {
            res.sendStatus(constants_1.HTTP_STATUSES.BAD_REQUEST);
            return;
        }
        res.sendStatus(constants_1.HTTP_STATUSES.NO_CONTENT);
    }));
    router.post('/registration-confirmation', (0, express_validator_1.body)('code').notEmpty().withMessage('invalid code'), validation_error_middleware_1.validationErrorMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const confirmed = yield users_service_1.usersService.confirmUserRegistration(req.body.code);
        if (!confirmed) {
            res.sendStatus(constants_1.HTTP_STATUSES.BAD_REQUEST);
            return;
        }
        res.sendStatus(constants_1.HTTP_STATUSES.NO_CONTENT);
    }));
    router.post('/registration-email-resending', (0, express_validator_1.body)('email').matches(new_user_validate_middleware_1.EMAIL_REGEXP).withMessage('Incorrect email'), (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        const confirmed = yield users_query_repository_1.usersQueryRepository.isConfirmedUser(req.body.email);
        if (confirmed) {
            res.sendStatus(constants_1.HTTP_STATUSES.BAD_REQUEST).json({ message: 'User already confirmed' });
            return;
        }
        next();
    }), validation_error_middleware_1.validationErrorMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const emailResent = yield users_service_1.usersService.resendConfirmationEmail(req.body.email);
        if (!emailResent) {
            res.sendStatus(constants_1.HTTP_STATUSES.BAD_REQUEST).json({ message: 'Something went wrong' });
        }
        res.sendStatus(constants_1.HTTP_STATUSES.NO_CONTENT);
    }));
    return router;
};
exports.getAuthRouter = getAuthRouter;
//# sourceMappingURL=auth.js.map