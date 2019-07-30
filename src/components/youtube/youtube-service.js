const isElectron = !!window.electron;

const YOUTUBE = isElectron ? window.electron.google.YOUTUBE : require("./youtube-web").YOUTUBE;

const YT_SERVICE = {
    getPlaylist: (args) => YOUTUBE.getPlaylist(args),
    getVideosInfo: (args) => YOUTUBE.getVideosInfo(args),
    getByText: (args) => YOUTUBE.getByText(args),
    getItemDiskInformation: (args) => YOUTUBE.getItemDiskInformation(args),
    downloadVideo: (args) => YOUTUBE.downloadVideo(args),
    downloadMusic: (args) => YOUTUBE.downloadMusic(args)
};

exports.YT_SERVICE = YT_SERVICE;