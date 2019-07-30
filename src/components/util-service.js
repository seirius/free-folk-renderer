const isElectron = !!window.electron;

const UTIL = isElectron ? window.electron.util : require("./util-web").UTIL;

const UTIL_SERVICE = {
    getUnshortenedUrl: UTIL.getUnshortenedUrl
};

exports.UTIL_SERVICE = UTIL_SERVICE;