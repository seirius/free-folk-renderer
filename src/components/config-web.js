const CONFIG = {
    getUserConfig: function () {
        return new Promise((resolve, reject) => {
            resolve({
                setPath: "",
                videoList: []
            });
        });
    },
    saveUserConfig: function (userConfig) {
        return Promise.resolve();
    }
};

exports.CONFIG = CONFIG;