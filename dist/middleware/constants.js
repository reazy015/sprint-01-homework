"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ERROR_MESSAGES = exports.POST_VIDEO_VALIDATION_FIELDS = void 0;
const constants_1 = require("../utils/constants");
exports.POST_VIDEO_VALIDATION_FIELDS = {
    ID: 'id',
    TITLE: 'title',
    AUTHOR: 'author',
    AVAILABLE_RESOLUTIONS: 'availableResolutions',
    CAN_BE_DOWNLOADED: 'canBeDownloaded',
    MIN_AGE_RESTRICTION: 'minAgeRestriction',
    PUBLICATION_DATE: 'publicationDate',
};
exports.ERROR_MESSAGES = {
    [exports.POST_VIDEO_VALIDATION_FIELDS.ID]: 'Can not be empty, only numeric accepted',
    [exports.POST_VIDEO_VALIDATION_FIELDS.TITLE]: 'Can not be empty, from 3 to 40 symbols length',
    [exports.POST_VIDEO_VALIDATION_FIELDS.AUTHOR]: 'Can not be empty, from 3 to 20 symbols length',
    [exports.POST_VIDEO_VALIDATION_FIELDS.AVAILABLE_RESOLUTIONS]: 'Can not be empty, possible values are ' + constants_1.RESOLUTIONS_STRING,
    [exports.POST_VIDEO_VALIDATION_FIELDS.CAN_BE_DOWNLOADED]: 'Can be only of boolean type',
    [exports.POST_VIDEO_VALIDATION_FIELDS.MIN_AGE_RESTRICTION]: 'Can be only of integer type in range from 1 to 18',
    [exports.POST_VIDEO_VALIDATION_FIELDS.PUBLICATION_DATE]: 'Can be only of string type',
};
//# sourceMappingURL=constants.js.map