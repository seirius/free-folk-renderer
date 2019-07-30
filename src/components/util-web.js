const axios = require("axios");

const UTIL = {
    getUnshortenedUrl: function (args) {
        return new Promise((resolve, reject) => {
            const { url } = args;
            axios.post("/util/unshortened-url", {url}).then(response => {
                if (response.status === 200) {
                    resolve(response.data);
                } else {
                    reject(response.data);
                }
            }).catch(reject);
        });
    }
};

exports.UTIL = UTIL;