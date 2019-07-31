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
            <v-tooltip v-if="downloadingAll" bottom>
                <template v-slot:activator="{ on }">
                    <v-btn icon @click="stopDownloadingAll" v-on="on">
                        <v-icon>stop</v-icon>
                    </v-btn>
                </template>
                <span>Stop downloading</span>
            </v-tooltip>
            <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                    <v-btn icon @click="openSearch" v-on="on" v-bind:disabled="downloadingAll">
                        <v-icon>search</v-icon>
                    </v-btn>
                </template>
                <span>Search</span>
            </v-tooltip>
            <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                    <v-btn icon @click="clearVideoList" v-on="on" v-bind:disabled="downloadingAll">
                        <v-icon>clear_all</v-icon>
                    </v-btn>
                </template>
                <span>Clear all videos</span>
            </v-tooltip>
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
                <v-list-tile
                    @click="setDownloadDirectory"
                    v-if="isElectron"
                    v-bind:disabled="downloadingAll"
                >
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

                    <v-list-tile @click="downloadAllVideo" v-bind:disabled="downloadingAll">
                        <v-list-tile-action>
                            <v-icon>videocam</v-icon>
                        </v-list-tile-action>
                        <v-list-tile-content>
                            <v-list-tile-title>as Videos</v-list-tile-title>
                        </v-list-tile-content>
                    </v-list-tile>
                    <v-list-tile @click="downloadAllMusic" v-bind:disabled="downloadingAll">
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

        <v-dialog
            v-model="searchDialog"
            width="500"
            v-bind:persistent="videoList.length === 0 && tempVideos.length === 0"
            dark
        >
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
                            <v-flex lg2 md3 xs12 v-for="item in videoList" :key="item.id">
                                <VideoItem
                                    @remove="removeVideoItem"
                                    @videoClick="videoClick(item)"
                                    @musicClick="musicClick(item)"
                                    @openVideoClick="openLink(item.video_url)"
                                    added
                                    v-bind:videoItem="item"
                                />
                            </v-flex>
                        </v-layout>
                    </v-container>
                </div>
            </div>
        </v-content>

        <v-footer class="pa-3" app>
            <v-tooltip top>
                <template v-slot:activator="{ on }">
                    <v-btn icon dark depressed small @click="appInfo = true" v-on="on">
                        <v-icon>info</v-icon>
                    </v-btn>
                </template>
                <span>About</span>
            </v-tooltip>
            <v-spacer></v-spacer>
            <v-tooltip top>
                <template v-slot:activator="{ on }">
                    <v-btn icon dark depressed small @click="openVideoSheet" v-on="on">
                        <v-icon>expand_less</v-icon>
                    </v-btn>
                </template>
                <span>Open search list</span>
            </v-tooltip>
            <v-spacer></v-spacer>
            <div>
                <span>
                    Made by
                    <a href="https://github.com/seirius" target="_blank">SeiRiuS</a>
                </span>
            </div>
        </v-footer>

        <v-bottom-sheet class="preview" v-model="videoSheet">
            <div class="video-sheet">
                <div class="actions">
                    <div class="button-action">
                        <v-tooltip top>
                            <template v-slot:activator="{ on }">
                                <v-btn
                                    block
                                    dark
                                    depressed
                                    small
                                    @click="addAllPreviewItems"
                                    v-on="on"
                                    v-bind:disabled="downloadingAll"
                                >
                                    <v-icon>add</v-icon>
                                </v-btn>
                            </template>
                            <span>Add all videos</span>
                        </v-tooltip>
                    </div>
                    <div class="button-action expand">
                        <v-tooltip top>
                            <template v-slot:activator="{ on }">
                                <v-btn
                                    block
                                    dark
                                    depressed
                                    small
                                    @click="closeVideoSheet"
                                    v-on="on"
                                >
                                    <v-icon>expand_more</v-icon>
                                </v-btn>
                            </template>
                            <span>Close search list</span>
                        </v-tooltip>
                    </div>
                </div>
                <v-container fluid grid-list-md class="video-sheet-content">
                    <v-layout row wrap class="overflow-auto">
                        <v-flex
                            class="preview-video-item"
                            lg2
                            md3
                            xs12
                            v-for="item in tempVideos"
                            :key="item.id"
                        >
                            <VideoItem
                                @videoClick="downloadVideoFromPreview(item)"
                                @musicClick="downloadMusicFromPreview(item)"
                                @add="addPreviewItems([item])"
                                @openVideoClick="openLink(item.video_url)"
                                v-bind:videoItem="item"
                            />
                        </v-flex>
                    </v-layout>
                </v-container>
            </div>
        </v-bottom-sheet>

        <v-dialog v-model="appInfo" width="500" dark>
            <v-card>
                <v-card-title class="headline" primary-title>About</v-card-title>
                <v-card-text>
                    <v-list two-line>
                        <v-list-tile v-if="info.version.renderer">
                            <v-list-tile-action>
                                <v-icon color="cyan lighten-1">devices</v-icon>
                            </v-list-tile-action>

                            <v-list-tile-content>
                                <v-list-tile-title>FreeFolk Renderer</v-list-tile-title>
                                <v-list-tile-sub-title>Version: {{info.version.renderer}}</v-list-tile-sub-title>
                            </v-list-tile-content>

                            <v-list-tile-action>
                                <v-btn icon @click="openLink('https://github.com/seirius/free-folk-renderer')">
                                    <v-icon>launch</v-icon>
                                </v-btn>
                            </v-list-tile-action>
                        </v-list-tile>
                        <v-list-tile v-if="info.version.server">
                            <v-list-tile-action>
                                <v-icon color="cyan lighten-1">domain</v-icon>
                            </v-list-tile-action>

                            <v-list-tile-content>
                                <v-list-tile-title>FreeFolk Server</v-list-tile-title>
                                <v-list-tile-sub-title>Version: {{info.version.server}}</v-list-tile-sub-title>
                            </v-list-tile-content>

                            <v-list-tile-action>
                                <v-btn icon @click="openLink('https://github.com/seirius/FreeFolkServer')">
                                    <v-icon>launch</v-icon>
                                </v-btn>
                            </v-list-tile-action>
                        </v-list-tile>
                        <v-list-tile v-if="info.version.app">
                            <v-list-tile-action>
                                <v-icon color="cyan lighten-1">dvr</v-icon>
                            </v-list-tile-action>

                            <v-list-tile-content>
                                <v-list-tile-title>FreeFolk App</v-list-tile-title>
                                <v-list-tile-sub-title>Version: {{info.version.app}}</v-list-tile-sub-title>
                            </v-list-tile-content>

                            <v-list-tile-action>
                                <v-btn icon @click="openLink('https://github.com/seirius/FreeFolkApp')">
                                    <v-icon>launch</v-icon>
                                </v-btn>
                            </v-list-tile-action>
                        </v-list-tile>
                        <v-list-tile v-if="info.version.common">
                            <v-list-tile-action>
                                <v-icon color="cyan lighten-1">compare_arrows</v-icon>
                            </v-list-tile-action>

                            <v-list-tile-content>
                                <v-list-tile-title>FreeFolk Common</v-list-tile-title>
                                <v-list-tile-sub-title>Version: {{info.version.common}}</v-list-tile-sub-title>
                            </v-list-tile-content>

                            <v-list-tile-action>
                                <v-btn icon @click="openLink('https://github.com/seirius/FreeFolkCommon')">
                                    <v-icon>launch</v-icon>
                                </v-btn>
                            </v-list-tile-action>
                        </v-list-tile>

                        <v-divider></v-divider>

                        <v-list-tile>
                            <v-list-tile-action>
                                <v-icon color="cyan lighten-1">laptop_windows</v-icon>
                            </v-list-tile-action>

                            <v-list-tile-content>
                                <v-list-tile-title>Desktop application</v-list-tile-title>
                                <v-list-tile-sub-title>Windows SO (Windows 7/8/10)</v-list-tile-sub-title>
                            </v-list-tile-content>

                            <v-list-tile-action>
                                <v-btn icon @click="openLink('https://github.com/seirius/FreeFolkApp/releases/download/v1.0.24/freefolkapp-1.0.24-setup.exe')">
                                    <v-icon>vertical_align_bottom</v-icon>
                                </v-btn>
                            </v-list-tile-action>
                        </v-list-tile>
                        <v-list-tile>
                            <v-list-tile-action>
                                <v-icon color="cyan lighten-1">laptop_windows</v-icon>
                            </v-list-tile-action>

                            <v-list-tile-content>
                                <v-list-tile-title>Desktop application</v-list-tile-title>
                                <v-list-tile-sub-title>Linux SO (debian)</v-list-tile-sub-title>
                            </v-list-tile-content>

                            <v-list-tile-action>
                                <v-btn icon @click="openLink('https://github.com/seirius/FreeFolkApp/releases/download/v1.0.24/freefolkapp_1.0.24_amd64.deb')">
                                    <v-icon>vertical_align_bottom</v-icon>
                                </v-btn>
                            </v-list-tile-action>
                        </v-list-tile>
                    </v-list>
                </v-card-text>

                <v-divider></v-divider>

                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="primary" flat @click="appInfo = false">Close</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

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
import { META_SERVICE } from "./../meta-service";
import { CONFIG_SERVICE } from "./../config-service";
import { UTIL_SERVICE } from "./../util-service";

import { version } from "./../../../package.json";

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
            downloadSetting: false,
            downloadingAll: false,
            appInfo: false,
            info: {
                version: {
                    renderer: version,
                    app: "",
                    server: "",
                    common: ""
                }
            },
            currentListDownloading: []
        };
    },
    methods: {
        openVideoSheet: function() {
            if (this.tempVideos.length) {
                this.videoSheet = true;
            } else {
                this.openSearch();
            }
        },
        closeVideoSheet: function() {
            this.videoSheet = false;
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
            if (this.searchUrl && !this.downloadingAll) {
                this.$refs.loader.start();
                const result = () => {
                    this.closeSarch();
                    this.videoSheet = true;
                    this.$refs.loader.stop();
                };
                const errorResult = error => {
                    this.closeSarch();
                    this.$refs.loader.stop();
                    console.error(error);
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
                        YT_SERVICE.getPlaylist({ id: list })
                            .then(items => {
                                this.tempVideos = [];
                                items.forEach(item => {
                                    if (this.isElectron) {
                                        this.getVideoDiskInfo(item).then(
                                            diskInfo =>
                                                resolveItem(item, diskInfo)
                                        );
                                    } else {
                                        resolveItem(item, initDiskInfo());
                                    }
                                });
                                result();
                            })
                            .catch(errorResult);
                    } else if (v) {
                        YT_SERVICE.getVideosInfo({ ids: [v] })
                            .then(response => {
                                this.tempVideos = [];
                                if (this.isElectron) {
                                    if (response.length === 1) {
                                        const video = response[0];
                                        this.getVideoDiskInfo(video).then(
                                            diskInfo =>
                                                resolveItem(video, diskInfo)
                                        );
                                    } else {
                                        alert("TODO");
                                    }
                                } else {
                                    if (response.length === 1) {
                                        resolveItem(
                                            response[0],
                                            initDiskInfo()
                                        );
                                    } else {
                                        alert("TODO");
                                    }
                                }

                                result();
                            })
                            .catch(errorResult);
                    } else {
                        UTIL_SERVICE.getUnshortenedUrl({url: this.searchUrl})
                        .then(response => {
                            this.$refs.loader.stop();
                            if (response.url !== this.searchUrl) {
                                this.searchUrl = response.url;
                                this.searchVideo();
                            } else {
                                this.$refs.feedback.open({
                                    color: "error",
                                    text: `URL (${this.searchUrl}) not valid!`
                                });
                            }
                        }).catch(errorResult);
                    }
                } catch (error) {
                    YT_SERVICE.getByText({ text: this.searchUrl })
                        .then(items => {
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
                        })
                        .catch(errorResult);
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
                this.getVideoDiskInfo(video).then(diskInfo => {
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
                const feedbackFunction = () => {
                    if (!noFeedback) {
                        this.$refs.feedback.open({
                            color: "success",
                            text: `Video (${video.title}) download complete!`
                        });
                    }
                };

                if (!video || !video.video_url) {
                    reject("No video defined");
                    return;
                }
                if (!this.downloadDirectory && this.isElectron) {
                    this.$refs.feedback.open({
                        color: "error",
                        text: `Download directory not defined`
                    });
                    reject("Download directory not defined");
                    return;
                }
                if (video.diskInfo && video.diskInfo.mp4) {
                    feedbackFunction();
                    resolve();
                    return;
                }

                const restDwn = () => {
                    video.dwnProgress.progress = 0;
                    video.dwnProgress.downloading = false;
                    video.dwnProgress.video = {
                        progress: 0,
                        loading: false
                    };
                };

                video.dwnProgress.downloading = true;
                video.dwnProgress.progress = 0;
                video.dwnProgress.video = {
                    loading: true,
                    progress: 0,
                    indeterminate: !this.isElectron
                };
                YT_SERVICE.downloadVideo({
                    savePath: this.downloadDirectory,
                    videoTitle: video.title,
                    id: video.id,
                    downloadProgressCallback: callbackArgs => {
                        const { contentLength, progress } = callbackArgs;
                        video.dwnProgress.progress = Math.trunc(progress);
                        video.dwnProgress.video.progress = Math.trunc(progress);
                        this.$forceUpdate();
                    }
                }).then(response => {
                    if (!this.isElectron) {
                        downloadInWeb(response);
                    } else {
                        this.getVideoDiskInfo(video).then(
                            diskInfo => (video.diskInfo = diskInfo)
                        );
                    }
                    restDwn();
                    feedbackFunction();
                    resolve();
                }).catch(error => {
                    restDwn();
                    console.error(error);
                    reject(error);
                });
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
                const feedbackFunction = () => {
                    if (!noFeedback) {
                        this.$refs.feedback.open({
                            color: "success",
                            text: `MP3 (${video.title}) download complete!`
                        });
                    }
                };

                if (!video || !video.video_url) {
                    reject("No video defined");
                    return;
                }
                if (!this.downloadDirectory && this.isElectron) {
                    this.$refs.feedback.open({
                        color: "error",
                        text: `Download directory not defined`
                    });
                    reject("Download directory not defined");
                    return;
                }
                if (video.diskInfo && video.diskInfo.mp3) {
                    feedbackFunction();
                    resolve();
                    return;
                }

                const resetDwn = () => {
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
                };

                video.dwnProgress.downloading = true;
                video.dwnProgress.progress = 0;
                video.dwnProgress.video = {
                    loading: true,
                    progress: 0,
                    indeterminate: !this.isElectron
                };
                video.dwnProgress.music = {
                    loading: true,
                    progress: 0,
                    indeterminate: !this.isElectron
                };
                YT_SERVICE.downloadMusic({
                    savePath: this.downloadDirectory,
                    videoTitle: video.title,
                    id: video.id,
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
                }).then(response => {
                    resetDwn();
                    if (this.isElectron) {
                        this.getVideoDiskInfo(video).then(
                            diskInfo => (video.diskInfo = diskInfo)
                        );
                    } else {
                        downloadInWeb(response);
                    }
                    feedbackFunction();
                    resolve();
                }).catch(error => {
                    resetDwn();
                    console.error(error);
                    reject(error);
                });
            });
        },
        downloadNextInChain: function(videoList, index, mp3) {
            return new Promise((resolve, reject) => {
                if (videoList.length <= index) {
                    resolve();
                    return;
                }
                const video = videoList[index];
                const auxPromise = mp3
                    ? this.downloadMusic(video, true)
                    : this.downloadVideo(video, true);
                auxPromise
                    .then(() =>
                        this.downloadNextInChain(videoList,++index, mp3)
                            .then(resolve)
                            .catch(reject)
                    )
                    .catch(error => {
                        this.$refs.feedback.open({
                            color: "error",
                            text: `Download error with ${video.title}: ${error}. Download stopped.`
                        });
                        reject(error);
                    });
            });
        },
        disableAll: function(videos) {
            if (videos && videos.length) {
                videos.forEach(video => (video.disabled = true));
            }
        },
        enableAll: function(videos) {
            if (videos && videos.length) {
                videos.forEach(video => (video.disabled = false));
            }
        },
        disableAllItems: function() {
            this.disableAll(this.videoList);
            this.disableAll(this.tempVideos);
        },
        enableAllItems: function() {
            this.enableAll(this.videoList);
            this.enableAll(this.tempVideos);
        },
        stopDownloadingAll: function () {
            this.currentListDownloading.length = 0;
        },
        downloadAllVideo: function() {
            this.downloadingAll = true;
            this.disableAllItems();
            this.currentListDownloading = this.videoList.slice(0);
            this.downloadNextInChain(this.currentListDownloading, 0)
            .then(() => {
                this.$refs.feedback.open({
                    color: "success",
                    text: `All videos download complete!`
                });
                this.stopDownloadingAll();
                this.enableAllItems();
                this.downloadingAll = false;
            }).catch(error => {
                console.error(error);
                this.stopDownloadingAll();
                this.enableAllItems();
                this.downloadingAll = false;
            });
        },
        downloadAllMusic: function() {
            this.downloadingAll = true;
            this.disableAllItems();
            this.currentListDownloading = this.videoList.slice(0);
            this.downloadNextInChain(this.currentListDownloading, 0, true)
            .then(() => {
                this.$refs.feedback.open({
                    color: "success",
                    text: `All videos download complete!`
                });
                this.enableAllItems();
                this.downloadingAll = false;
            }).catch(error => {
                console.error(error);
                this.enableAllItems();
                this.downloadingAll = false;
            });
        },
        openLink: function (link) {
            window.open(link, "_blank");
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
        }).catch(console.error);

        META_SERVICE.getMetaVersion().then(response => {
            if (response) {
                this.info.version.app = response.appVersion;
                this.info.version.server = response.serverVersion;
                this.info.version.common = response.commonVersion;
            }
        }).catch(console.error);
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
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", filename); //or any other extension
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}
</script>
