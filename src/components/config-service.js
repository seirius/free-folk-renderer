const isElectron = !!window.electron;

const CONFIG = isElectron ? window.electron.config : require("./config-web").CONFIG;

const CONFIG_SERVICE = {
    getUserConfig: CONFIG.getUserConfig,
    saveUserConfig: CONFIG.saveUserConfig
};

exports.CONFIG_SERVICE = CONFIG_SERVICE;