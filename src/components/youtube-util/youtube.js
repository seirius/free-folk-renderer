import * as ytdl from "ytdl-core";

export function downloadVideo(args) {
    return new Promise((resolve, reject) => {
        const {url, path, title} = args;
        if (!url || !path || !title) {
            reject("No url, path or title defined.");
        }
        const vid = ytdl(url)
        vid.pipe(window.electron.fs
        .createWriteStream(window.electron.path
        .join(path, title + ".mp4")));
        vid.on("response", resolve);
        vid.on("error", reject);
    });
}

export function downloadMusic(args) {
    return new Promise((resolve, reject) => {
        const {path, title} = args;
        downloadVideo(args)
        .then(() => {
            const nPath = window.electron.path;
            const fs = window.electron.fs;
            const videoPath = nPath.join(path, `${title}.mp4`);
            const mp3Path = nPath.join(path, `${title}.mp3`);
            window.electron
            .ffmpeg(videoPath)
            .format("mp3")
            .on("error", reject)
            .save(mp3Path)
            .on("end", () => {
                fs.unlink(videoPath, err => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve();
                    }
                });
            })
            .on("error", reject);
        }).catch(reject);
    });
}