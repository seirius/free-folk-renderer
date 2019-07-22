<template>
    <div class="video-content">
        <video ref="videoPlayer" class="video-js"></video>
    </div>
</template>

<style lang="scss" scoped>
.video-content {
    display: flex;
    text-align: center;
    height: 100%;
    .video-js {
        height: 100%;
        flex: 1;
    }
}
</style>


<script>

import videojs from "video.js";

export default {
    name: "VideoPlayer",
    props: {
        options: {
            type: Object,
            default() {
                return {};
            }
        }
    },
    data() {
        return {
            player: null
        };
    },
    mounted() {
        this.player = videojs(
            this.$refs.videoPlayer,
            this.options,
            function onPlayerReady() {
                console.log("onPlayerReady", this);
            }
        );
    },
    beforeDestroy() {
        if (this.player) {
            this.player.dispose();
        }
    }
};
</script>