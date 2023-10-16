"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HTTP_STATUSES = exports.RESOLUTIONS_STRING = exports.RESOLUTIONS = void 0;
exports.RESOLUTIONS = [
    'P144',
    'P240',
    'P360',
    'P480',
    'P720',
    'P1080',
    'P1440',
    'P2160',
];
exports.RESOLUTIONS_STRING = exports.RESOLUTIONS.join(', ');
exports.HTTP_STATUSES = {
    OK: 200,
    CREATED: 201,
    NO_CONTENT: 204,
    BAD_REQUEST: 400,
    UNAUTH: 401,
    NOT_FOUND: 404,
    SERVER_ERROR: 500,
    NOT_IMPLEMENTED: 501,
    FORBIDDEN: 403,
};
//# sourceMappingURL=constants.js.map