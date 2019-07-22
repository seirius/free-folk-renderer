<template>
    <v-dialog v-model="loader" content-class="loader" fullscreen dark>
        <v-container fluid fill-height align-center>
            <v-layout row wrap fill-height align-center>
                <v-flex class="text-center">
                    <v-progress-circular
                        :size="100"
                        :width="15"
                        :indeterminate="true"
                        color="teal"
                    >Loading</v-progress-circular>
                </v-flex>
            </v-layout>
        </v-container>
    </v-dialog>
</template>

<style lang="scss">
.loader {
    background-color: rgba(66,66,66, 0.8);
    .text-center {
        text-align: center;
    }
}
</style>

<script>
export default {
    name: "Loader",
    data: function () {
        return {
            counter: 0,
            loader: false
        };
    },
    props: {},
    methods: {
        start: function () {
            this.counter++;
            if (this.counter > 0) {
                this.loader = true;
            }
        },
        stop: function () {
            this.counter--;
            if (this.counter <= 0) {
                this.counter = 0;
                this.loader = false;
            }
        },
        orderStart: function () {
            this.counter = 1;
            this.loader = true;
        },
        orderStop: function () {
            this.counter = 0;
            this.loader = false;
        }
    }
}
</script>

