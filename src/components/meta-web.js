const axios = require("axios");

const META = {
    getMetaVersion: function () {
        return new Promise((resolve, reject) => {
            axios.get("/meta/version").then(response => {
                if (response.status === 200) {
                    resolve(response.data);
                } else {
                    reject(response.data);
                }
            }).catch(reject);
        });
    }
};

exports.META = META;