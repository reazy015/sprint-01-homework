"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ERROR_MESSAGE_TEXT = exports.ERROR_MESSAGE_FIELD = exports.RESOLUTIONS_STRING = exports.RESOLUTIONS = void 0;
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
exports.ERROR_MESSAGE_FIELD = {
    AUTHOR: 'authour',
    TITLE: 'title'
};
exports.ERROR_MESSAGE_TEXT = {
    AUTHOR: 'Author field must be specified, at least 4 symbols',
    TITLE: 'Title field must be specified, at least 4 symbols'
};
//# sourceMappingURL=constants.js.map