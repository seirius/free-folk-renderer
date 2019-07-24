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
                axios.post("/youtube/download", {ids, mp3})
                .then(response => {
                    if (response.status === 200) {
                        resolve({
                            data: response.data,
                            filename: getFilename(response.headers["content-disposition"])
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

function getFilename(disposition) {
    let filename = "not_defined";
    if (disposition && disposition.indexOf('inline') !== -1) {
        let filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
        let matches = filenameRegex.exec(disposition);
        if (matches != null && matches[1]) { 
          filename = matches[1].replace(/['"]/g, '');
        }
    }

    return filename;
}

exports.YOUTUBE = YOUTUBE;