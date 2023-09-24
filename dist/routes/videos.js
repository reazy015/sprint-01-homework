"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getVideosRouter = void 0;
const express_1 = __importDefault(require("express"));
const constants_1 = require("../utils/constants");
const helpers_1 = require("../utils/helpers");
const video_repository_1 = require("../data-access-layer/video-repository");
const getVideosRouter = () => {
    const router = express_1.default.Router();
    router.get('/', (_, res) => {
        res.status(HTTP_STATUSES.OK).json(video_repository_1.videoRepositry.getAllVideos());
    });
    router.get('/:id', (req, res) => {
        const id = +req.params.id;
        const found = video_repository_1.videoRepositry.getVideoById(id);
        if (!found) {
            res.sendStatus(404);
            return;
        }
        res.status(HTTP_STATUSES.OK).json(found);
    });
    router.post('/', (req, res) => {
        const { title, author, availableResolutions } = req.body;
        const errorsMessages = [];
        if (!title || title.length > 40) {
            errorsMessages.push({
                message: 'title is required, max length 40',
                field: 'title',
            });
        }
        if (!author || author.length > 20) {
            errorsMessages.push({
                message: 'author is required, max length 20',
                field: 'author',
            });
        }
        if (!availableResolutions || !availableResolutions.length) {
            errorsMessages.push({
                message: 'availableResolutions is required',
                field: 'availableResolutions',
            });
        }
        if (availableResolutions &&
            availableResolutions.length &&
            !(0, helpers_1.isAvailableResolutionsCorrect)(availableResolutions)) {
            errorsMessages.push({
                message: `availableResolutions has incorrect values, correct types are: ${constants_1.RESOLUTIONS_STRING}`,
                field: 'availableResolutions',
            });
        }
        if (errorsMessages.length) {
            res.status(400).json({ errorsMessages });
            return;
        }
        const createdVideoId = video_repository_1.videoRepositry.addVideo({
            title,
            author,
            availableResolutions,
            minAgeRestriction: null,
            canBeDownloaded: false,
        });
        const createdVideo = video_repository_1.videoRepositry.getVideoById(createdVideoId);
        res.status(HTTP_STATUSES.CREATED).json(createdVideo);
    });
    router.delete('/:id', (req, res) => {
        const id = +req.params.id;
        const isDeleted = video_repository_1.videoRepositry.deleteVideo(id);
        if (!isDeleted) {
            res.status(404);
            return;
        }
        res.status(204);
    });
    router.put('/:id', (req, res) => {
        const updates = req.body;
        const { title, author, availableResolutions, canBeDownloaded, minAgeRestriction, publicationDate, } = updates;
        const id = +req.params.id;
        const found = video_repository_1.videoRepositry.getVideoById(id);
        if (!found) {
            res.sendStatus(404);
            return;
        }
        const errorsMessages = [];
        if (typeof canBeDownloaded !== 'boolean') {
            errorsMessages.push({
                message: 'can be only boolean type',
                field: 'canBeDownloaded',
            });
        }
        if (!title || title.length > 40) {
            errorsMessages.push({
                message: 'title is required, max length 40',
                field: 'title',
            });
        }
        if (!author || author.length > 20) {
            errorsMessages.push({
                message: 'author is required, max length 20',
                field: 'author',
            });
        }
        if (!availableResolutions || !availableResolutions.length) {
            errorsMessages.push({
                message: 'availableResolutions is required',
                field: 'availableResolutions',
            });
        }
        if (minAgeRestriction > 18 || minAgeRestriction < 1) {
            errorsMessages.push({
                message: 'minAgeRestriction is incorrect, must be in range 1-18',
                field: 'minAgeRestriction',
            });
        }
        if (typeof publicationDate !== 'string') {
            errorsMessages.push({
                message: 'publicationDate is incorrect, must be a date string in ISO format',
                field: 'publicationDate',
            });
        }
        if (availableResolutions &&
            availableResolutions.length &&
            !(0, helpers_1.isAvailableResolutionsCorrect)(availableResolutions)) {
            errorsMessages.push({
                message: `availableResolutions has incorrect values, correct types are: ${constants_1.RESOLUTIONS_STRING}`,
                field: 'availableResolutions',
            });
        }
        if (errorsMessages.length) {
            res.status(400).json({ errorsMessages });
            return;
        }
        video_repository_1.videoRepositry.updateVideo(id, updates);
        res.sendStatus(204);
    });
    return router;
};
exports.getVideosRouter = getVideosRouter;
//# sourceMappingURL=videos.js.map
