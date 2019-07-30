const isElectron = !!window.electron;

const META = isElectron ? window.electron.meta : require("./meta-web").META;

const META_SERVICE = {
    getMetaVersion: META.getMetaVersion
};

exports.META_SERVICE = META_SERVICE;