<template>
    <v-card>
        <v-img :src="videoItem.thumbnail_url" height="200px">
            <v-container fill-height fluid pa-2>
                <v-layout fill-height>
                    <v-flex xs12 align-end flexbox>
                        <span class="headline white--text" v-text="videoItem.title"></span>
                    </v-flex>
                </v-layout>
            </v-container>
        </v-img>

        <v-card-actions>
            <v-btn v-if="!added" icon @click="add">
                <v-icon color="info">add</v-icon>
            </v-btn>
            <v-btn v-if="added" icon @click="remove" v-bind:disabled="videoItem.dwnProgress.downloading">
                <v-icon color="error">remove</v-icon>
            </v-btn>
            <v-spacer></v-spacer>
            <v-btn icon @click="musicClick" v-bind:disabled="videoItem.dwnProgress.downloading">
                <v-progress-circular v-if="videoItem.dwnProgress.music.loading" 
                v-bind:value="videoItem.dwnProgress.music.progress"></v-progress-circular>
                <v-icon v-if="!videoItem.dwnProgress.music.loading"
                v-bind:color="videoItem.diskInfo.mp3 ? 'success' : 'info'">music_video</v-icon>
            </v-btn>
            <v-btn icon @click="videoClick" v-bind:disabled="videoItem.dwnProgress.downloading">
                <v-progress-circular v-if="videoItem.dwnProgress.video.loading" 
                v-bind:value="videoItem.dwnProgress.video.progress"></v-progress-circular>
                <v-icon v-if="!videoItem.dwnProgress.video.loading" 
                v-bind:color="videoItem.diskInfo.mp4 ? 'success' : 'info'">videocam</v-icon>
            </v-btn>
        </v-card-actions>
    </v-card>
</template>

<style lang="scss" scoped>
</style>


<script>
const { WINDOW_MANAGER, dialog, config, google } = window.electron;

export default {
    name: "VideoItem",
    components: {},
    props: {
        videoItem: {
            title: String,
            video_url: String,
            thumbnail_url: String,
            diskInfo: {
                mp3: Boolean,
                mp4: Boolean
            },
            dwnProgress: {
                progress: 0,
                downloading: true,
                video: {
                    progress: 0,
                    loading: false
                },
                music: {
                    progress: 0,
                    loading: false
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
        }
    },
    watch: {
    },
    mounted: function() {
    }
};
</script>
