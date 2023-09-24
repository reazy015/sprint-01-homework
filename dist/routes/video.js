"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getVideosRouter = void 0;
const constants_1 = require("./../utils/constants");
const express_1 = __importDefault(require("express"));
const video_repository_1 = require("../data-access-layer/video-repository");
const validation_error_middleware_1 = require("../middleware/validation-error-middleware");
const video_validate_middleware_1 = require("../middleware/video-validate-middleware");
const getVideosRouter = () => {
    const router = express_1.default.Router();
    router.get('/', (_, res) => {
        res.status(constants_1.HTTP_STATUSES.OK).json(video_repository_1.videoRepositry.getAllVideos());
    });
    router.get('/:id', (0, video_validate_middleware_1.getVideoByIdMiddleware)(), validation_error_middleware_1.validationErrorMiddleware, (req, res) => {
        const id = +req.params.id;
        const found = video_repository_1.videoRepositry.getVideoById(id);
        if (!found) {
            res.sendStatus(constants_1.HTTP_STATUSES.NOT_FOUND);
            return;
        }
        res.status(constants_1.HTTP_STATUSES.OK).json(found);
    });
    router.post('/', (0, video_validate_middleware_1.postVideoMiddleware)(), validation_error_middleware_1.validationErrorMiddleware, (req, res) => {
        const { title, author, availableResolutions } = req.body;
        const { id } = video_repository_1.videoRepositry.addVideo({
            title,
            author,
            availableResolutions,
            minAgeRestriction: null,
            canBeDownloaded: false,
        });
        const createdVideo = video_repository_1.videoRepositry.getVideoById(id);
        res.status(constants_1.HTTP_STATUSES.CREATED).json(createdVideo);
    });
    router.delete('/:id', (0, video_validate_middleware_1.getVideoByIdMiddleware)(), validation_error_middleware_1.validationErrorMiddleware, (req, res) => {
        const id = +req.params.id;
        const isDeleted = video_repository_1.videoRepositry.deleteVideo(id);
        if (!isDeleted) {
            res.status(constants_1.HTTP_STATUSES.NOT_FOUND);
            return;
        }
        res.status(constants_1.HTTP_STATUSES.NO_CONTENT);
    });
    router.put('/:id', (0, video_validate_middleware_1.getVideoByIdMiddleware)(), (0, video_validate_middleware_1.putVideoMiddleware)(), validation_error_middleware_1.validationErrorMiddleware, (req, res) => {
        const updates = req.body;
        const id = +req.params.id;
        const found = video_repository_1.videoRepositry.getVideoById(id);
        if (!found) {
            res.sendStatus(constants_1.HTTP_STATUSES.NOT_FOUND);
            return;
        }
        video_repository_1.videoRepositry.updateVideo(id, updates);
        res.sendStatus(constants_1.HTTP_STATUSES.NO_CONTENT);
    });
    return router;
};
exports.getVideosRouter = getVideosRouter;
//# sourceMappingURL=video.js.map