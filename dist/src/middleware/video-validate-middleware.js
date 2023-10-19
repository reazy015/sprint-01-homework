"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.putVideoMiddleware = exports.postVideoMiddleware = exports.getVideoByIdMiddleware = void 0;
const express_validator_1 = require("express-validator");
const constants_1 = require("../utils/constants");
const constants_2 = require("./constants");
const getVideoByIdMiddleware = () => (0, express_validator_1.param)('id').notEmpty().isNumeric().withMessage(constants_2.ERROR_MESSAGES.id);
exports.getVideoByIdMiddleware = getVideoByIdMiddleware;
const postVideoMiddleware = () => (0, express_validator_1.checkSchema)({
    [constants_2.VIDEO_VALIDATION_FIELDS.TITLE]: {
        isLength: {
            options: { min: 3, max: 40 },
            errorMessage: constants_2.ERROR_MESSAGES[constants_2.VIDEO_VALIDATION_FIELDS.TITLE],
        },
    },
    [constants_2.VIDEO_VALIDATION_FIELDS.AUTHOR]: {
        isLength: {
            options: { min: 3, max: 20 },
            errorMessage: constants_2.ERROR_MESSAGES[constants_2.VIDEO_VALIDATION_FIELDS.AUTHOR],
        },
    },
    [constants_2.VIDEO_VALIDATION_FIELDS.AVAILABLE_RESOLUTIONS]: {
        isArray: { options: { min: 1 } },
        isIn: {
            options: [constants_1.RESOLUTIONS],
        },
        errorMessage: constants_2.ERROR_MESSAGES[constants_2.VIDEO_VALIDATION_FIELDS.AVAILABLE_RESOLUTIONS],
    },
});
exports.postVideoMiddleware = postVideoMiddleware;
const putVideoMiddleware = () => {
    return (0, express_validator_1.checkSchema)({
        [constants_2.VIDEO_VALIDATION_FIELDS.TITLE]: {
            isLength: {
                options: { min: 3, max: 40 },
                errorMessage: constants_2.ERROR_MESSAGES[constants_2.VIDEO_VALIDATION_FIELDS.TITLE],
            },
        },
        [constants_2.VIDEO_VALIDATION_FIELDS.AUTHOR]: {
            isLength: {
                options: { min: 3, max: 20 },
                errorMessage: constants_2.ERROR_MESSAGES[constants_2.VIDEO_VALIDATION_FIELDS.AUTHOR],
            },
        },
        [constants_2.VIDEO_VALIDATION_FIELDS.AVAILABLE_RESOLUTIONS]: {
            isArray: { options: { min: 1 } },
            isIn: {
                options: [constants_1.RESOLUTIONS],
            },
            errorMessage: constants_2.ERROR_MESSAGES[constants_2.VIDEO_VALIDATION_FIELDS.AVAILABLE_RESOLUTIONS],
        },
        [constants_2.VIDEO_VALIDATION_FIELDS.CAN_BE_DOWNLOADED]: {
            isBoolean: {
                options: { strict: true },
            },
            errorMessage: constants_2.ERROR_MESSAGES.canBeDownloaded,
        },
        [constants_2.VIDEO_VALIDATION_FIELDS.MIN_AGE_RESTRICTION]: {
            optional: true,
            isInt: {
                options: { min: 1, max: 18 },
            },
            errorMessage: constants_2.ERROR_MESSAGES[constants_2.VIDEO_VALIDATION_FIELDS.MIN_AGE_RESTRICTION],
        },
        [constants_2.VIDEO_VALIDATION_FIELDS.PUBLICATION_DATE]: {
            isString: true,
            errorMessage: constants_2.ERROR_MESSAGES[constants_2.VIDEO_VALIDATION_FIELDS.PUBLICATION_DATE],
        },
    });
};
exports.putVideoMiddleware = putVideoMiddleware;
//# sourceMappingURL=video-validate-middleware.js.map