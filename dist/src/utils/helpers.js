"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAvailableResolutionsCorrect = void 0;
const constants_1 = require("./constants");
const isAvailableResolutionsCorrect = (availableResolutions) => {
    return availableResolutions.every((res) => constants_1.RESOLUTIONS.includes(res));
};
exports.isAvailableResolutionsCorrect = isAvailableResolutionsCorrect;
//# sourceMappingURL=helpers.js.map