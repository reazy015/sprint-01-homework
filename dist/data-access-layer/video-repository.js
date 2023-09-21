"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.videoRepositry = void 0;
let videosDb = [];
exports.videoRepositry = {
    getVideoById(id) {
        return videosDb[id];
    },
    getAllVideos() {
        return Object.values(videosDb);
    },
    addVideo(video) {
        const id = +new Date();
        const createdAtDate = new Date();
        let publicationDate = new Date(new Date(createdAtDate).setDate(createdAtDate.getDate() + 1)).toISOString();
        videosDb[id] = Object.assign(Object.assign({}, video), { id, createdAt: createdAtDate.toISOString(), publicationDate });
        return id;
    },
    updateVideo(id, video) {
        videosDb[id] = Object.assign({}, video);
        return true;
    },
    deleteVideo(id) {
        if (!(id in videosDb)) {
            return false;
        }
        delete videosDb[id];
        return true;
    },
    deleteAllVideos() {
        videosDb = {};
    },
};
//# sourceMappingURL=video-repository.js.map