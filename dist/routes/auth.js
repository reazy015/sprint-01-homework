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
const users_service_1 = require("../busines-logic-layer/users-service");
const getAuthRouter = () => {
    const router = express_1.default.Router();
    router.post('/login', auth_credentials_check_1.authCredentialsCheck, validation_error_middleware_1.validationErrorMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const isUserRegistered = yield users_service_1.usersService.checkUserRegistered(req.body);
        if (!isUserRegistered) {
            res.sendStatus(constants_1.HTTP_STATUSES.UNAUTH);
            return;
        }
        res.sendStatus(constants_1.HTTP_STATUSES.NO_CONTENT);
    }));
    return router;
};
exports.getAuthRouter = getAuthRouter;
//# sourceMappingURL=auth.js.map