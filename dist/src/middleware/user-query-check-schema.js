"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateQueryParamsWithDefault = void 0;
const express_validator_1 = require("express-validator");
exports.validateQueryParamsWithDefault = [
    (0, express_validator_1.query)('sortBy').trim().default('createdAt'),
    (0, express_validator_1.query)('sortDir')
        .trim()
        .default('desc')
        .customSanitizer((sortDir) => sortDir !== 'asc' && sortDir !== 'desc' ? 'desc' : sortDir),
    (0, express_validator_1.query)('pageSize')
        .trim()
        .toInt()
        .default(10)
        .customSanitizer((pageSize) => (pageSize < 1 ? 10 : pageSize)),
    (0, express_validator_1.query)('pageNumber')
        .trim()
        .toInt()
        .default(1)
        .customSanitizer((pageNumber) => (pageNumber < 1 ? 1 : pageNumber)),
    (0, express_validator_1.query)('searchEmailTerm').trim(),
    (0, express_validator_1.query)('searchLoginTerm').trim(),
];
//# sourceMappingURL=user-query-check-schema.js.map