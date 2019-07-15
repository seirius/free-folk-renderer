<template>
</template>

<script>
import Modal from "@/components/Modal.vue";
import * as $ from "jquery";

const electron = window.electron;
const { google, init, config } = electron;

export default {
    name: "Youtube2",
    // components: {
    //     Modal
    // },
    // props: {},
    // data: function() {
    //     return {
    //         videoList: [],
    //         videoSearch: "",
    //         path: "",
    //         downloadAll: "mp3"
    //     };
    // },
    // mounted: function() {
    //     config
    //         .getUserConfig()
    //         .then(userConfig => {
    //             this.path = userConfig.setPath;
    //             this.videoSearch = userConfig.videoUrl;
    //             this.videoList = userConfig.videoList;
    //             if (this.videoList) {
    //                 this.videoList.forEach(video =>
    //                     this.getVideoDiskInfo(video.title)
    //                 );
    //             }
    //         })
    //         .catch(console.error);
    // },
    // methods: {
    //     searchVideo: function() {
    //         if (this.videoSearch) {
    //             config.getUserConfig().then(userConfig => {
    //                 userConfig.videoUrl = this.videoSearch;
    //                 config.saveCurrentUserConfig();
    //             });
    //             const url = new URL(this.videoSearch);
    //             const list = url.searchParams.get("list");
    //             if (list) {
    //                 google.getPlaylist(list).then(items => {
    //                     items.forEach(item => {
    //                         const video = this.getVideoByTitle(item.title);
    //                         if (!video) {
    //                             item.diskInfo = {};
    //                             item.dwnProgress = {
    //                                 progress: 0,
    //                                 downloading: false
    //                             };
    //                             this.videoList.unshift(item);
    //                             this.getVideoDiskInfo(item.title);
    //                         }
    //                     });
    //                     config.getUserConfig().then(userConfig => {
    //                         userConfig.videoList = this.videoList;
    //                         config.saveCurrentUserConfig();
    //                     });
    //                 });
    //             } else {
    //                 google
    //                     .getVideoInfo({ videoUrl: this.videoSearch })
    //                     .then(response => {
    //                         const video = this.getVideoByTitle(response.title);
    //                         if (!video) {
    //                             response.diskInfo = {};
    //                             response.dwnProgress = {
    //                                 progress: 0,
    //                                 downloading: false
    //                             };
    //                             this.videoList.unshift(response);
    //                             this.getVideoDiskInfo(response.title);
    //                             config.getUserConfig().then(userConfig => {
    //                                 userConfig.videoList = this.videoList;
    //                                 config.saveCurrentUserConfig();
    //                             });
    //                         }
    //                     })
    //                     .catch(console.error);
    //             }
    //         }
    //     },
    //     clearAll: async function() {
    //         const userConfig = await config.getUserConfig();
    //         this.videoList = [];
    //         userConfig.videoList = this.videoList;
    //         config.saveCurrentUserConfig();
    //     },
    //     downloadAllItems: async function() {
    //         if (this.videoList) {
    //             if (this.downloadAll === "mp4") {
    //                 await Promise.all(
    //                     this.videoList.map(video => {
    //                         if (!video.diskInfo.mp4) {
    //                             return this.downloadVideo(video.title, true);
    //                         }
    //                     })
    //                 );
    //                 this.$refs.modal.openModal({
    //                     title: "Success!",
    //                     text: "All videos download complete"
    //                 });
    //             } else {
    //                 for (let video of this.videoList) {
    //                     if (!video.diskInfo.mp3) {
    //                         await this.downloadMusic(video.title, true);
    //                     }
    //                 }
    //                 this.$refs.modal.openModal({
    //                     title: "Success!",
    //                     text: "All music download complete"
    //                 });
    //             }
    //         }
    //     },
    //     removeVideo: function(title) {
    //         const index = this.videoList.findIndex(
    //             video => video.title === title
    //         );
    //         if (index > -1) {
    //             this.videoList.splice(index, 1);
    //             config.getUserConfig().then(userConfig => {
    //                 userConfig.videoList = this.videoList;
    //                 config.saveCurrentUserConfig();
    //             });
    //         }
    //     },
    //     removeFromDisk: function(title) {
    //         google
    //             .removeVideosContent({
    //                 savePath: this.path,
    //                 videoTitles: [title],
    //                 fileTypes: [".mp3", ".mp4"]
    //             })
    //             .then(response => {
    //                 this.getVideoDiskInfo(title);
    //                 alert("Done!");
    //             })
    //             .catch(error => console.error);
    //     },
    //     removeAll: function(title) {
    //         google
    //             .removeVideosContent({
    //                 savePath: this.path,
    //                 videoTitles: [title],
    //                 fileTypes: [".mp3", ".mp4"]
    //             })
    //             .then(response => this.removeVideo(title))
    //             .catch(error => console.error);
    //     },
    //     getVideoByTitle: function(title) {
    //         return this.videoList.find(video => video.title === title);
    //     },
    //     downloadVideo: function(title, noFeedback) {
    //         return new Promise((resolve, reject) => {
    //             const video = this.getVideoByTitle(title);
    //             if (
    //                 video &&
    //                 video.video_url &&
    //                 this.path &&
    //                 !video.diskInfo.mp4
    //             ) {
    //                 video.dwnProgress.downloading = true;
    //                 video.dwnProgress.progress = 0;
    //                 google
    //                     .downloadVideo({
    //                         savePath: this.path,
    //                         videoTitle: video.title,
    //                         videoUrl: video.video_url,
    //                         downloadProgressCallback: callbackArgs => {
    //                             const {
    //                                 contentLength,
    //                                 progress
    //                             } = callbackArgs;
    //                             video.dwnProgress.progress = progress;
    //                             this.$forceUpdate();
    //                         }
    //                     })
    //                     .then(response => {
    //                         video.dwnProgress.progress = 0;
    //                         video.dwnProgress.downloading = false;
    //                         this.getVideoDiskInfo(title);
    //                         if (!noFeedback) {
    //                             this.$refs.modal.openModal({
    //                                 title: "Success!",
    //                                 text: `Video (${title}) download complete`
    //                             });
    //                         }
    //                         resolve();
    //                     })
    //                     .catch(error => {
    //                         console.error(error);
    //                         reject(error);
    //                     });
    //             }
    //         });
    //     },
    //     downloadMusic: function(title, noFeedback) {
    //         return new Promise((resolve, reject) => {
    //             const video = this.getVideoByTitle(title);
    //             if (
    //                 video &&
    //                 video.video_url &&
    //                 this.path &&
    //                 !video.diskInfo.mp3
    //             ) {
    //                 video.dwnProgress.downloading = true;
    //                 video.dwnProgress.progress = 0;
    //                 google
    //                     .downloadMusic({
    //                         savePath: this.path,
    //                         videoTitle: video.title,
    //                         videoUrl: video.video_url,
    //                         downloadProgressCallback: callbackArgs => {
    //                             const {
    //                                 contentLength,
    //                                 progress
    //                             } = callbackArgs;
    //                             video.dwnProgress.progress = progress;
    //                             this.$forceUpdate();
    //                         }
    //                     })
    //                     .then(() => {
    //                         video.dwnProgress.progress = 0;
    //                         video.dwnProgress.downloading = false;
    //                         this.getVideoDiskInfo(title);
    //                         if (!noFeedback) {
    //                             this.$refs.modal.openModal({
    //                                 title: "Success!",
    //                                 text: `MP3 (${title}) download complete`
    //                             });
    //                         }
    //                         resolve();
    //                     })
    //                     .catch(error => {
    //                         console.error(error);
    //                         reject(error);
    //                     });
    //             }
    //         });
    //     },
    //     savePath: function() {
    //         const paths = window.electron.dialog.showOpenDialog({
    //             properties: ["openDirectory"]
    //         });
    //         if (paths && paths.length === 1) {
    //             this.path = paths[0];
    //             config.getUserConfig().then(userConfig => {
    //                 userConfig.setPath = this.path;
    //                 config.saveCurrentUserConfig();
    //             });
    //         }
    //     },
    //     getVideoDiskInfo: function(title) {
    //         const video = this.getVideoByTitle(title);
    //         if (!video) {
    //             console.error(`No video found for title: ${title}`);
    //             return;
    //         }
    //         google
    //             .getItemDiskInformation({
    //                 title: title,
    //                 filePath: this.path,
    //                 fileTypes: [".mp3", ".mp4"]
    //             })
    //             .then(info => {
    //                 video.diskInfo.mp3 = !!info[".mp3"];
    //                 video.diskInfo.mp4 = !!info[".mp4"];
    //                 this.$forceUpdate();
    //             })
    //             .catch(console.error);
    //     }
    // }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->

<style scoped>
</style>
