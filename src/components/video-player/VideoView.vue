<template>
    <v-app dark>
        <SystemBar />
        <v-content>
            <div class="content-wrapper">
                <div class="content">
                    <!-- <v-container fluid> -->
                        <!-- <v-layout align-center fill-height row wrap> -->
                            <!-- <v-flex style="text-align: center"> -->
                                <Video v-if="load" :options="videoOptions"/>
                            <!-- </v-flex> -->
                        <!-- </v-layout> -->
                    <!-- </v-container> -->
                </div>
            </div>
        </v-content>
    </v-app>

</template>

<style lang="scss">
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
</style>

<script>

import SystemBar from "@/components/common/SystemBar.vue";
import Video from "@/components/video-player/Video.vue";

const { path, config } = window.electron;

export default {
    name: "VideoView",
    components: {
        SystemBar,
        Video
    },
    props: {
        name: String,
        type: String
    },
    data: function () {
        return {
            src: "",
            load: false,
            videoOptions: {
				autoplay: true,
				controls: true,
				sources: [],
                width: "100%",
                height: "100%"
			}
        };
    },
    mounted: function () {
        console.log(this.name);
        config
        .getUserConfig()
        .then(userConfig => {
            this.src = path.join(userConfig.setPath, this.name);
            this.videoOptions.sources.push({
                src: this.src,
                type: this.type === "mp4" ? "video/mp4" : "audio/mp3"
            });
            this.load = true;
        }).catch(console.error);
    }
}
</script>

