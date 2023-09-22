"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.putVideoMiddleware = exports.postVideoMiddleware = exports.getVideoByIdMiddleware = void 0;
const express_validator_1 = require("express-validator");
const constants_1 = require("../utils/constants");
const constants_2 = require("./constants");
const getVideoByIdMiddleware = () => (0, express_validator_1.param)('id').notEmpty().isNumeric().withMessage(constants_2.ERROR_MESSAGES.id);
exports.getVideoByIdMiddleware = getVideoByIdMiddleware;
const postVideoMiddleware = () => (0, express_validator_1.checkSchema)({
    title: {
        isLength: {
            options: { min: 3, max: 40 },
            errorMessage: constants_2.ERROR_MESSAGES.title,
        },
    },
    author: {
        isLength: {
            options: { min: 3, max: 20 },
            errorMessage: constants_2.ERROR_MESSAGES.author,
        },
    },
    availableResolutions: {
        isArray: { options: { min: 1 } },
        isIn: {
            options: [constants_1.RESOLUTIONS],
        },
        errorMessage: constants_2.ERROR_MESSAGES.availableResolutions,
    },
});
exports.postVideoMiddleware = postVideoMiddleware;
const putVideoMiddleware = () => {
    return (0, express_validator_1.checkSchema)({
        title: {
            isLength: {
                options: { min: 3, max: 40 },
                errorMessage: constants_2.ERROR_MESSAGES.title,
            },
        },
        author: {
            isLength: {
                options: { min: 3, max: 20 },
                errorMessage: constants_2.ERROR_MESSAGES.author,
            },
        },
        availableResolutions: {
            isArray: { options: { min: 1 } },
            isIn: {
                options: [constants_1.RESOLUTIONS],
            },
            errorMessage: constants_2.ERROR_MESSAGES.availableResolutions,
        },
        canBeDownloaded: {
            isBoolean: {
                options: { strict: true },
            },
            errorMessage: constants_2.ERROR_MESSAGES.canBeDownloaded,
        },
        minAgeRestriction: {
            optional: true,
            isInt: {
                options: { min: 1, max: 18 },
            },
            errorMessage: constants_2.ERROR_MESSAGES.minAgeRestriction,
        },
        publicationDate: {
            isString: true,
            errorMessage: constants_2.ERROR_MESSAGES.publicationDate,
        },
    }, ['body']);
};
exports.putVideoMiddleware = putVideoMiddleware;
//# sourceMappingURL=video-validate-middleware.js.map