<template>
    <v-card class="elevation-4">
        <v-img :src="videoItem.thumbnail_url" height="150px">
            <v-container class="ff-video-img" fill-height fluid pa-2>
                <v-layout fill-height row wrap>
                    <v-flex xs12 align-end flexbox>
                        <span class="white--text subheading" v-text="videoItem.title"></span>
                    </v-flex>
                    <v-flex xs12 align-self-end flexbox class="text-right">
                        <span class="white--text subheading" v-text="videoItem.duration"></span>
                    </v-flex>
                </v-layout>
            </v-container>
        </v-img>

        <v-card-actions>
            <v-tooltip top>
                <template v-slot:activator="{ on }">
                    <v-btn v-if="!added" icon @click="add" v-on="on" v-bind:disabled="videoItem.disabled">
                        <v-icon color="info">add</v-icon>
                    </v-btn>
                </template>
                <span>Add</span>
            </v-tooltip>
            <v-tooltip top>
                <template v-slot:activator="{ on }">
                    <v-btn v-if="added" icon @click="remove" v-bind:disabled="videoItem.dwnProgress.downloading || videoItem.disabled" v-on="on">
                        <v-icon color="error">remove</v-icon>
                    </v-btn>
                </template>
                <span>Remove</span>
            </v-tooltip>
            <v-spacer></v-spacer>
            <v-tooltip top>
                <template v-slot:activator="{ on }">
                    <v-btn v-if="videoItem.video_url" icon @click="openVideo" v-on="on">
                        <v-icon color="info">video_library</v-icon>
                    </v-btn>
                </template>
                <span>Open in Youtube</span>
            </v-tooltip>
            <v-spacer></v-spacer>
            <v-tooltip top>
                <template v-slot:activator="{ on }">
                    <v-btn icon @click="musicClick" v-bind:disabled="videoItem.dwnProgress.downloading || videoItem.disabled" v-on="on">
                        <v-progress-circular
                        indeterminate
                        v-if="videoItem.dwnProgress.music.indeterminate"
                        ></v-progress-circular>
                        <v-progress-circular v-if="videoItem.dwnProgress.music.loading && !videoItem.dwnProgress.music.indeterminate" 
                        v-bind:value="videoItem.dwnProgress.music.progress"></v-progress-circular>
                        <v-icon v-if="!videoItem.dwnProgress.music.loading"
                        v-bind:color="videoItem.diskInfo.mp3 ? 'success' : 'info'">music_video</v-icon>
                    </v-btn>
                </template>
                <span v-if="videoItem.diskInfo.mp3">Play</span>
                <span v-if="!videoItem.diskInfo.mp3">Download as mp3</span>
            </v-tooltip>
            <v-tooltip top>
                <template v-slot:activator="{ on }">
                    <v-btn icon @click="videoClick" v-bind:disabled="videoItem.dwnProgress.downloading || videoItem.disabled" v-on="on">
                        <v-progress-circular
                        indeterminate
                        v-if="videoItem.dwnProgress.video.indeterminate"
                        ></v-progress-circular>
                        <v-progress-circular v-if="videoItem.dwnProgress.video.loading && !videoItem.dwnProgress.video.indeterminate" 
                        v-bind:value="videoItem.dwnProgress.video.progress"></v-progress-circular>
                        <v-icon v-if="!videoItem.dwnProgress.video.loading" 
                        v-bind:color="videoItem.diskInfo.mp4 ? 'success' : 'info'">videocam</v-icon>
                    </v-btn>
                </template>
                <span v-if="videoItem.diskInfo.mp4">Play</span>
                <span v-if="!videoItem.diskInfo.mp4">Download as mp4</span>
            </v-tooltip>
        </v-card-actions>
    </v-card>
</template>

<style lang="scss" scoped>
.ff-video-img {
    background-color: rgba(0, 0, 0, 0.3);
}
</style>


<script>
export default {
    name: "VideoItem",
    components: {},
    props: {
        videoItem: {
            title: String,
            video_url: String,
            thumbnail_url: String,
            duration: String,
            diskInfo: {
                mp3: Boolean,
                mp4: Boolean
            },
            disabled: false,
            dwnProgress: {
                progress: 0,
                downloading: true,
                video: {
                    progress: 0,
                    loading: false,
                    indeterminate: false
                },
                music: {
                    progress: 0,
                    loading: false,
                    indeterminate: false
                }
            }
        },
        added: Boolean
    },
    data() {
        return {
        };
    },
    methods: {
        add: function () {
            this.$emit("add", this.videoItem);
        },
        remove: function () {
            this.$emit("remove", this.videoItem);
        },
        videoClick: function () {
            this.$emit("videoClick", this.videoItem);
        },
        musicClick: function () {
            this.$emit("musicClick", this.videoItem);
        },
        openVideo: function () {
            this.$emit("openVideoClick", this.videoItem);
        }
    },
    watch: {
    },
    mounted: function() {
    }
};
</script>
