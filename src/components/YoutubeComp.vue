<template>
<div class="hello">
    <form action="">
        <div class="row">
            <div class="input-group mb-3 col-lg">
                <input type="text" v-model="path" class="form-control" placeholder="Save Path" aria-label="Save Path" aria-describedby="basic-addon1" readonly>
                <div class="input-group-append">
                    <button v-on:click="savePath" class="btn btn-outline-secondary" type="button">Set path</button>
                </div>
            </div>
            <div class="input-group mb-3 col-lg">
                <input type="text" v-model="videoSearch" class="form-control" placeholder="Video URL" aria-label="Video URL" aria-describedby="basic-addon1">
                <div class="input-group-append">
                    <button v-on:click="searchVideo" class="btn btn-outline-secondary" type="button">Search</button>
                </div>
            </div>
        </div>
    </form>
    <div class="row">
        <div class="card video col-12 col-sm-6 col-md-4 col-lg-2" v-for="video in videoList" :key="video.title">
            <div class="close" v-on:click="removeVideo(video.title)"><i class="fa fa-trash" aria-hidden="true"></i></div>
            <img class="card-img-top" :src="video.thumbnail_url" alt="Card image cap">
            <div class="card-body">
                <p class="card-title cut-text">{{video.title}}</p>
                <p class="card-text cut-text">{{video.description}}</p>
                <div class="text-center">
                    <button class="btn btn-primary" v-on:click="downloadVideo(video.title)" type="button">Download</button>
                </div>
            </div>
        </div>
    </div>
</div>
</template>

<script>
import * as ytdl from "ytdl-core";

export default {
    name: 'HelloWorld',
    props: {},
    data: function () {
        return {
            videoList: [],
            videoSearch: "https://www.youtube.com/watch?v=NfQSASESKoU",
            path: "C:/temp"
        }
    },
    methods: {
        searchVideo: function () {
            if (this.videoSearch) {
                ytdl.getBasicInfo(this.videoSearch, (err, info) => {
                    if (err) {
                        console.error(err);
                    } else {
                        this.videoList.unshift(info);
                        console.log(info);
                    }
                });
            }
        },
        removeVideo: function (title) {
            const index = this.videoList.findIndex(video => video.title === title);
            if (index > -1) {
                this.videoList.splice(index, 1);
            }
        },
        getVideoByTitle: function (title) {
            return this.videoList.find(video => video.title === title);
        },
        downloadVideo: function (title) {
            const video = this.getVideoByTitle(title);
            if (video && video.video_url && this.path) {
                const vid = ytdl(video.video_url)
                vid.pipe(window.electron.fs
                .createWriteStream(window.electron.path
                .join(this.path, video.title + ".mp4")));
                vid.on("response", res => {
                    console.log(res);
                });
                vid.on("error", err => console.error(err));
            }
        },
        savePath: function () {
            const paths = window.electron.dialog.showOpenDialog({
                properties: ["openDirectory"]
            });
            if (paths && paths.length === 1) {
                this.path = paths[0];
            }
        }
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->

<style scoped>
.video {
    position: relative;
}
.close {
    position: absolute;
    color: red;
    right: 20px;
    top: 20px;
    z-index: 1;
    cursor: pointer;
}
.cut-text {
    text-overflow: ellipsis;
    overflow: hidden; 
    height: 1.2em; 
    white-space: nowrap;
}
</style>
