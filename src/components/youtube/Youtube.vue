<template>
    <v-app dark>
        <SystemBar v-if="isElectron" />
        <v-toolbar class="ff-toolbar" app>
            <v-toolbar-title class="headline">
                <v-btn icon @click="navigation = !navigation">
                    <v-icon large>dehaze</v-icon>
                </v-btn>
            </v-toolbar-title>
            <v-spacer></v-spacer>
            <v-btn icon @click="openSearch">
                <v-icon>search</v-icon>
            </v-btn>
            <v-btn icon @click="clearVideoList">
                <v-icon>clear_all</v-icon>
            </v-btn>
        </v-toolbar>

        <v-navigation-drawer
            class="ff-navigation"
            v-bind:class="{electron: isElectron}"
            v-model="navigation"
            app
            dark
        >
            <v-list class="pa-3" dark>
                <v-list-tile avatar>
                    <v-list-tile-content>
                        <v-list-tile-title>Youtube</v-list-tile-title>
                    </v-list-tile-content>

                    <v-list-tile-avatar>
                        <img src="./../../assets/youtube.png" />
                    </v-list-tile-avatar>
                </v-list-tile>
            </v-list>

            <v-list two-line dark dense>
                <v-divider v-if="isElectron"></v-divider>
                <v-list-tile @click="setDownloadDirectory" v-if="isElectron">
                    <v-list-tile-avatar>
                        <v-icon>folder</v-icon>
                    </v-list-tile-avatar>

                    <v-list-tile-content>
                        <v-list-tile-title>Download directory</v-list-tile-title>
                        <v-list-tile-sub-title>{{ downloadDirectory }}</v-list-tile-sub-title>
                    </v-list-tile-content>
                </v-list-tile>
                <v-divider></v-divider>
                <v-list-group no-action>
                    <template v-slot:activator>
                        <v-list-tile>
                            <v-list-tile-action>
                                <v-icon>save_alt</v-icon>
                            </v-list-tile-action>
                            <v-list-tile-content>
                                <v-list-tile-title>Download all</v-list-tile-title>
                            </v-list-tile-content>
                        </v-list-tile>
                    </template>

                    <v-list-tile @click="downloadAllVideo">
                        <v-list-tile-action>
                            <v-icon>videocam</v-icon>
                        </v-list-tile-action>
                        <v-list-tile-content>
                            <v-list-tile-title>as Videos</v-list-tile-title>
                        </v-list-tile-content>
                    </v-list-tile>
                    <v-list-tile @click="downloadAllMusic">
                        <v-list-tile-action>
                            <v-icon>music_video</v-icon>
                        </v-list-tile-action>
                        <v-list-tile-content>
                            <v-list-tile-title>as MP3</v-list-tile-title>
                        </v-list-tile-content>
                    </v-list-tile>
                </v-list-group>
            </v-list>
        </v-navigation-drawer>

        <v-dialog v-model="searchDialog" width="500" dark>
            <v-form @submit.prevent="searchVideo">
                <div class="search-form">
                    <v-text-field
                        dark
                        hide-details
                        autofocus
                        solo
                        placeholder="Keywords or Video URL"
                        v-model="searchUrl"
                        ref="search"
                    ></v-text-field>
                    <v-btn icon @click="searchVideo">
                        <v-icon>search</v-icon>
                    </v-btn>
                </div>

                <v-btn type="submit" class="d-none">Search</v-btn>
            </v-form>
        </v-dialog>

        <Loader ref="loader" />
        <Feedback ref="feedback" />

        <v-content>
            <div class="content-wrapper">
                <div class="content">
                    <v-container fluid grid-list-md>
                        <v-layout row wrap>
                            <v-flex lg2 md3 xs12 v-for="item in videoList" :key="item.title">
                                <VideoItem
                                    @remove="removeVideoItem"
                                    @videoClick="videoClick(item)"
                                    @musicClick="musicClick(item)"
                                    added
                                    v-bind:videoItem="item"
                                />
                            </v-flex>
                        </v-layout>
                    </v-container>
                </div>
            </div>
        </v-content>

        <v-bottom-sheet class="preview" v-model="videoSheet">
            <div class="video-sheet">
                <div class="actions">
                    <div class="button-action">
                        <v-btn
                            block
                            dark
                            depressed
                            small
                            @click="addAllPreviewItems"
                            color="success"
                        >
                            <v-icon>add</v-icon>
                        </v-btn>
                    </div>
                    <div class="button-action expand">
                        <v-btn block dark depressed small @click="toggleExpandedPreview">
                            <v-icon v-if="!expandPreview">expand_less</v-icon>
                            <v-icon v-if="expandPreview">expand_more</v-icon>
                        </v-btn>
                    </div>
                    <div class="button-action">
                        <v-btn block dark depressed small @click="closeVideoSheet" color="error">
                            <v-icon>close</v-icon>
                        </v-btn>
                    </div>
                </div>
                <v-container fluid grid-list-md class="video-sheet-content">
                    <v-layout row v-bind:wrap="expandPreview" class="overflow-auto">
                        <v-flex
                            class="preview-video-item"
                            lg2
                            md3
                            xs12
                            v-for="item in tempVideos"
                            :key="item.title"
                        >
                            <VideoItem
                                @videoClick="downloadVideoFromPreview(item)"
                                @musicClick="downloadMusicFromPreview(item)"
                                @add="addPreviewItems([item])"
                                v-bind:videoItem="item"
                            />
                        </v-flex>
                    </v-layout>
                </v-container>
            </div>
        </v-bottom-sheet>

        <v-dialog v-model="downloadSetting" width="500" dark persistent>
            <v-card>
                <v-card-title class="headline" primary-title>Add download directory</v-card-title>

                <v-card-text>
                    The download directory is where you are going to store all the content.
                    You will be able to change this afterwards.
                </v-card-text>

                <v-divider></v-divider>

                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="primary" flat @click="obligatorySetDwnDir">Add directory</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-app>
</template>

<style lang="scss">
.v-bottom-sheet.v-dialog {
    overflow: auto !important;
}
html {
    overflow: hidden;
}
</style>


<style lang="scss" scoped>
.content-wrapper {
    height: 100%;
    width: 100%;
    overflow: hidden;
    position: relative;
    .content {
        width: 100%;
        height: 100%;
        position: absolute;
        overflow: auto;
    }
}
.preview-video-item {
    width: 100%;
    div {
        width: 9999px;
        max-width: 100%;
    }
}

.overflow-auto {
    overflow: auto;
}
.actions-wrapper {
    position: relative;
}
.video-sheet {
    background-color: #263238;
    position: relative;
    .actions {
        width: 100%;
        position: fixed;
        height: 40px;
        display: flex;
        justify-content: space-between;
        background-color: #263238;
        z-index: 2;
        .button-action {
            flex: 1;
            margin-left: 2px;
            margin-right: 2px;
            &.expand {
                flex: 2;
            }
        }
    }
    .video-sheet-content {
        overflow: auto;
        padding-top: 41px;
    }
}
.search-form {
    display: flex;
    flex-direction: row;
}
</style>


<script>
import VideoItem from "@/components/youtube/VideoItem.vue";
import SystemBar from "@/components/common/SystemBar.vue";
import Loader from "@/components/common/Loader.vue";
import Feedback from "@/components/common/Feedback.vue";
const dialog = window.electron ? window.electron.dialog : null;
import { YT_SERVICE } from "./youtube-service";
import { CONFIG_SERVICE } from "./../config-service";

export default {
    name: "Youtube",
    components: {
        VideoItem,
        SystemBar,
        Loader,
        Feedback
    },
    props: {},
    data() {
        return {
            isElectron: false,
            navigation: false,
            downloadDirectory: "",
            searchDialog: false,
            searchUrl: "",
            videoList: [],
            videoSheet: false,
            tempVideos: [],
            expandPreview: false,
            downloadSetting: false
        };
    },
    methods: {
        openVideoSheet: function() {
            this.videoSheet = true;
        },
        closeVideoSheet: function() {
            this.videoSheet = false;
        },
        openExpandedPreview: function() {
            this.expandPreview = true;
        },
        closeExpandedPreview: function() {
            this.expandPreview = false;
        },
        toggleExpandedPreview: function() {
            this.expandPreview = !this.expandPreview;
        },
        obligatorySetDwnDir: function() {
            this.setDownloadDirectory()
                .then(() => {
                    this.downloadSetting = false;
                    if (this.videoList.length === 0) {
                        this.openSearch();
                    }
                })
                .catch(err => {
                    this.$refs.feedback.open({
                        color: "error",
                        text: `You must set a download directory`
                    });
                });
        },
        setDownloadDirectory: function() {
            return new Promise((resolve, reject) => {
                const paths = dialog.showOpenDialog({
                    properties: ["openDirectory"]
                });
                if (paths && paths.length === 1) {
                    this.downloadDirectory = paths[0];
                    resolve();
                    CONFIG_SERVICE.getUserConfig().then(userConfig => {
                        userConfig.setPath = this.downloadDirectory;
                        CONFIG_SERVICE.saveUserConfig(userConfig);
                    });
                } else {
                    reject("Path not selected");
                }
            });
        },
        openSearch: function() {
            this.searchDialog = true;
            this.navigation = false;
        },
        closeSarch: function() {
            this.searchDialog = false;
        },
        getVideoByTitle: function(title) {
            return this.videoList.find(video => video.title === title);
        },
        getVideoDiskInfo: function(video) {
            return new Promise((resolve, reject) => {
                YT_SERVICE.getItemDiskInformation({
                    title: video.title,
                    filePath: this.downloadDirectory,
                    fileTypes: [".mp3", ".mp4"]
                })
                    .then(info => {
                        resolve({
                            mp3: !!info[".mp3"],
                            mp4: !!info[".mp4"],
                            safeTitle: info.safeTitle
                        });
                    })
                    .catch(console.error);
            });
        },
        searchVideo: function() {
            if (this.searchUrl) {
                const result = () => {
                    this.closeSarch();
                    this.videoSheet = true;
                };

                const resolveItem = (item, diskInfo) => {
                    item.diskInfo = diskInfo;
                    item.dwnProgress = initProgress();
                    this.tempVideos.unshift(item);
                };

                try {
                    const url = new URL(this.searchUrl);
                    const list = url.searchParams.get("list");
                    const v = url.searchParams.get("v");

                    if (list) {
                        YT_SERVICE.getPlaylist({ id: list }).then(items => {
                            this.tempVideos = [];
                            items.forEach(item => {
                                if (this.isElectron) {
                                    this.getVideoDiskInfo(item).then(diskInfo =>
                                        resolveItem(item, diskInfo)
                                    );
                                } else {
                                    resolveItem(item, initDiskInfo());
                                }
                            });
                            result();
                        });
                    } else if (v) {
                        YT_SERVICE.getVideosInfo({ ids: [v] })
                            .then(response => {
                                this.tempVideos = [];
                                if (this.isElectron) {
                                    if (response.length === 1) {
                                        const video = response[0];
                                        this.getVideoDiskInfo(video)
                                        .then(diskInfo => resolveItem(video, diskInfo));
                                    } else {
                                        alert("TODO");
                                    }
                                } else {
                                    if (response.length === 1) {
                                        resolveItem(response[0], initDiskInfo());
                                    } else {
                                        alert("TODO");
                                    }
                                }

                                result();
                            })
                            .catch(console.error);
                    }
                } catch (error) {
                    YT_SERVICE.getByText({ text: this.searchUrl }).then(
                        items => {
                            this.tempVideos = [];
                            items.forEach(item => {
                                if (this.isElectron) {
                                    this.getVideoDiskInfo(item).then(diskInfo =>
                                        resolveItem(item, diskInfo)
                                    );
                                } else {
                                    resolveItem(item, initDiskInfo());
                                }
                            });
                            result();
                        }
                    );
                }
            }
        },
        addPreviewItems: function(items) {
            this.addToVideoList(items);
            items.forEach(item => {
                const tempIndex = this.tempVideos.indexOf(item);
                if (tempIndex > -1) {
                    this.tempVideos.splice(tempIndex, 1);
                }
            });
            if (this.tempVideos.length === 0) {
                this.closeVideoSheet();
            }
        },
        addAllPreviewItems: function() {
            this.addPreviewItems(this.tempVideos.slice(0));
            this.closeVideoSheet();
        },
        addToVideoList: function(videos) {
            if (videos) {
                videos.forEach(video => {
                    if (
                        video &&
                        video.title &&
                        !this.getVideoByTitle(video.title)
                    ) {
                        this.videoList.unshift(video);
                    }
                });
                CONFIG_SERVICE.getUserConfig().then(userConfig => {
                    userConfig.videoList = this.videoList;
                    CONFIG_SERVICE.saveUserConfig(userConfig);
                });
            }
        },
        removeVideoItem: function(item) {
            const videoListIndex = this.videoList.indexOf(item);
            if (videoListIndex > -1) {
                this.videoList.splice(videoListIndex, 1);
                CONFIG_SERVICE.getUserConfig().then(userConfig => {
                    userConfig.videoList = this.videoList;
                    CONFIG_SERVICE.saveUserConfig(userConfig);
                });
            }
        },
        clearVideoList: function() {
            this.videoList = [];
            CONFIG_SERVICE.getUserConfig().then(userConfig => {
                userConfig.videoList = this.videoList;
                CONFIG_SERVICE.saveUserConfig(userConfig);
            });
        },
        downloadVideoFromPreview: function(video, noFeedback) {
            const index = this.videoList.indexOf(video);
            if (index === -1) {
                this.addPreviewItems([video]);
            }
            this.downloadVideo(video, noFeedback);
        },
        musicClick: function(video) {
            if (this.isElectron) {
                this.getVideoDiskInfo(video)
                .then(diskInfo => {
                    if (diskInfo.mp3) {
                        window.open(
                            `#/video/${diskInfo.safeTitle}.mp3/mp3`,
                            "video"
                        );
                    } else {
                        this.downloadMusic(video);
                    }
                });
            } else {
                this.downloadMusic(video);
            }
        },
        videoClick: function(video) {
            if (this.isElectron) {
                this.getVideoDiskInfo(video).then(diskInfo => {
                    if (diskInfo.mp4) {
                        window.open(
                            `#/video/${diskInfo.safeTitle}.mp4/mp4`,
                            "video"
                        );
                    } else {
                        this.downloadVideo(video);
                    }
                });
            } else {
                this.downloadVideo(video);
            }
        },
        downloadVideo: function(video, noFeedback) {
            return new Promise((resolve, reject) => {
                if (
                    video &&
                    video.video_url &&
                    (this.downloadDirectory || !this.isElectron) &&
                    !video.diskInfo.mp4
                ) {
                    video.dwnProgress.downloading = true;
                    video.dwnProgress.progress = 0;
                    video.dwnProgress.video = {
                        loading: true,
                        progress: 0
                    };
                    YT_SERVICE.downloadVideo({
                        savePath: this.downloadDirectory,
                        videoTitle: video.title,
                        ids: [video.id],
                        downloadProgressCallback: callbackArgs => {
                            const { contentLength, progress } = callbackArgs;
                            video.dwnProgress.progress = Math.trunc(progress);
                            video.dwnProgress.video.progress = Math.trunc(
                                progress
                            );
                            this.$forceUpdate();
                        }
                    })
                        .then(response => {
                            if (!this.isElectron) {
                                downloadInWeb(response);
                            } else {
                                this.getVideoDiskInfo(video)
                                .then(diskInfo => (video.diskInfo = diskInfo));
                            }
                            video.dwnProgress.progress = 0;
                            video.dwnProgress.downloading = false;
                            video.dwnProgress.video = {
                                progress: 0,
                                loading: false
                            };
                            if (!noFeedback) {
                                this.$refs.feedback.open({
                                    color: "success",
                                    text: `Video (${video.title}) download complete!`
                                });
                            }
                            resolve();
                        })
                        .catch(error => {
                            console.error(error);
                            reject(error);
                        });
                }
            });
        },
        downloadMusicFromPreview: function(video, noFeedback) {
            const index = this.videoList.indexOf(video);
            if (index === -1) {
                this.addPreviewItems([video]);
            }
            this.downloadMusic(video, noFeedback);
        },
        downloadMusic: function(video, noFeedback) {
            return new Promise((resolve, reject) => {
                if (
                    video &&
                    video.video_url &&
                    (this.downloadDirectory || !this.isElectron) &&
                    !video.diskInfo.mp3
                ) {
                    video.dwnProgress.downloading = true;
                    video.dwnProgress.progress = 0;
                    video.dwnProgress.video = {
                        loading: true,
                        progress: 0
                    };
                    video.dwnProgress.music = {
                        loading: true,
                        progress: 0
                    };
                    YT_SERVICE.downloadMusic({
                        savePath: this.downloadDirectory,
                        videoTitle: video.title,
                        ids: [video.id],
                        mp3: true,
                        downloadProgressCallback: callbackArgs => {
                            const {
                                contentLength,
                                progress,
                                videoProgress,
                                musicProgress
                            } = callbackArgs;
                            video.dwnProgress.progress = Math.trunc(progress);
                            video.dwnProgress.video.progress = Math.trunc(
                                videoProgress
                            );
                            video.dwnProgress.music.progress = Math.trunc(
                                musicProgress
                            );
                            this.$forceUpdate();
                        }
                    })
                        .then((response) => {
                            video.dwnProgress.progress = 0;
                            video.dwnProgress.downloading = false;
                            video.dwnProgress.video = {
                                loading: false,
                                progress: 0
                            };
                            video.dwnProgress.music = {
                                loading: false,
                                progress: 0
                            };
                            if (this.isElectron) {
                                this.getVideoDiskInfo(video)
                                .then(diskInfo => (video.diskInfo = diskInfo));
                            } else {
                                downloadInWeb(response);
                            }
                            if (!noFeedback) {
                                this.$refs.feedback.open({
                                    color: "success",
                                    text: `MP3 (${video.title}) download complete!`
                                });
                            }
                            resolve();
                        })
                        .catch(error => {
                            console.error(error);
                            reject(error);
                        });
                }
            });
        },
        downloadAllVideo: function() {
            const promises = [];
            this.videoList.forEach(video => {
                promises.push(this.downloadVideo(video, true));
            });
            Promise.all(promises).then(() => {
                this.$refs.feedback.open({
                    color: "success",
                    text: `All videos download complete!`
                });
            });
        },
        downloadAllMusic: function() {
            const promises = [];
            this.videoList.forEach(video => {
                promises.push(this.downloadMusic(video, true));
            });
            Promise.all(promises).then(() => {
                this.$refs.feedback.open({
                    color: "success",
                    text: `All MP3 download complete!`
                });
            });
        }
    },
    watch: {
        searchDialog: function(val) {
            if (val) {
                this.$nextTick(this.$refs.search.focus);
            }
        }
    },
    mounted: function() {
        this.isElectron = !!window.electron;
        window.addEventListener(
            "keyup",
            event => {
                if (event && event.ctrlKey && event.key === "f") {
                    this.openSearch();
                }
            },
            true
        );
        CONFIG_SERVICE.getUserConfig()
            .then(userConfig => {
                if (userConfig) {
                    this.videoList = userConfig.videoList;

                    if (this.isElectron) {
                        this.downloadDirectory = userConfig.setPath;
                        if (!this.downloadDirectory) {
                            this.downloadSetting = true;
                        }
                        if (
                            (!this.videoList || !this.videoList.length) &&
                            this.downloadDirectory
                        ) {
                            this.openSearch();
                        } else if (this.videoList) {
                            const promises = [];
                            this.$refs.loader.start();
                            this.videoList.forEach(video => {
                                video.dwnProgress = initProgress();
                                const promise = this.getVideoDiskInfo(video);
                                promises.push(promise);
                                promise.then(diskInfo => {
                                    video.diskInfo = diskInfo;
                                });
                            });

                            Promise.all(promises)
                                .then(() => {
                                    this.$forceUpdate();
                                    this.$refs.loader.stop();
                                })
                                .catch(error => {
                                    console.error(error);
                                    this.$refs.loader.stop();
                                });
                        }
                    } else {
                        if (!this.videoList || !this.videoList.length) {
                            this.openSearch();
                        }
                    }
                }
            })
            .catch(console.error);
    }
};

function initProgress() {
    return {
        video: {
            loading: false,
            progress: 0
        },
        music: {
            loading: false,
            progress: 0
        },
        progress: 0,
        downloading: false
    };
}

function initDiskInfo() {
    return {
        mp3: false,
        mp4: false
    };
}

function downloadInWeb(args) {
    const { data, filename } = args;
    const url = window.URL.createObjectURL(new Blob([data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename); //or any other extension
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}
</script>
