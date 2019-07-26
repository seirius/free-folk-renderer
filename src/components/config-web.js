const axios = require("axios");

const CONFIG = {
    getUserConfig: function () {
        return new Promise((resolve, reject) => {
            axios.get("/config/user-config").then(response => {
                if (response.status === 200) {
                    resolve(response.data);
                } else {
                    reject(response.data);
                }
            }).catch(reject);
        });
    },
    saveUserConfig: function (userConfig) {
        return new Promise((resolve, reject) => {
            axios.post("/config/user-config", {config: userConfig})
            .then(response => {
                if (response.status === 200) {
                    resolve(response.data);
                } else {
                    reject(response.data);
                }
            }).catch(reject);
        });
    }
};

exports.CONFIG = CONFIG;