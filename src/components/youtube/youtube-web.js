const axios = require("axios");

const YOUTUBE = {
    getByText: (args) => {
        return new Promise((resolve, reject) => {
            const { text } = args;
            if (text) {
                axios.post("/youtube/search", {
                    query: text
                }).then(response => {
                    if (response.status === 200) {
                        resolve(response.data);
                    } else {
                        reject(response.data);
                    }
                }).catch(reject);
            } else {
                reject("Text not defined");
            }
        });
    },
    getPlaylist: (args) => {
        return new Promise((resolve, reject) => {
            const { id } = args;
            if (id) {
                axios.post("/youtube/playlist", {id}).then(response => {
                    if (response.status === 200) {
                        resolve(response.data);
                    } else {
                        reject(response.data);
                    }
                }).catch(reject);
            } else {
                reject("ID not defined");
            }
        });
    },
    getVideosInfo: (args) => {
        return new Promise((resolve, reject) => {
            const { ids } = args;
            if (ids) {
                axios.post("/youtube/videos-info", {ids})
                .then(response => {
                    if (response.status = 200) {
                        resolve(response.data);
                    } else {
                        reject(response.data);
                    }
                }).catch(reject);
            } else {
                reject("IDs not defined");
            }
        });
    },
    downloadVideo: (args) => {
        return new Promise((resolve, reject) => {
            const { ids, mp3 } = args;
            if (ids) {
                axios.post("/youtube/download", {ids, mp3}, {
                    responseType: "blob"
                })
                .then(response => {
                    if (response.status === 200) {
                        resolve({
                            data: response.data,
                            filename: response.headers["x-suggested-filename"]
                        });
                    } else {
                        reject(response.data);
                    }
                }).catch(reject);
            } else {
                reject("IDs not defined");
            }
        });
    }
};
YOUTUBE.downloadMusic = YOUTUBE.downloadVideo;

exports.YOUTUBE = YOUTUBE;