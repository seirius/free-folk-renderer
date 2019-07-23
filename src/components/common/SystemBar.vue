<template>
    <v-system-bar class="ff-system-bar unselectable" app window dark>
        <div class="ff-bar">
            <div class="ff-logo">
                <img src="./../../assets/logo.png" class="undraggable" alt />
            </div>
        </div>
        <div class="ff-title"> Free Folk </div>
        <v-spacer></v-spacer>
        <div class="draggable"></div>
        <v-btn @click="min" class="ff-button" dark depressed flat small>
            <v-icon>minimize</v-icon>
        </v-btn>
        <v-btn @click="close" class="ff-button close" dark depressed flat small>
            <v-icon>close</v-icon>
        </v-btn>
    </v-system-bar>
</template>

<style lang="scss" scoped>
.ff-system-bar {
    padding: 0px;
    .ff-title {
        min-width: 100px;
        padding: 0px 8px;
    }
    .ff-button {
        margin: 0px;
        height: 100%;
        padding: 0px;
        min-width: 70px;
        i {
            margin: 0px;
        }

        &.close:hover {
            background-color: #EF5350;
        }
    }
}
.ff-logo {
    padding-left: 8px;
    display: flex;
    align-items: center;
    img {
        height: 20px;
    }
}
.draggable {
    width: 100%;
    height: 100%;
    -webkit-app-region: drag;
}
</style>

<script>
const { WINDOW_MANAGER } = window.electron;

export default {
    name: "SystemBar",
    components: {
    },
    data() {
        return {};
    },
    mounted: function() {},
    methods: {
        close: function() {
            WINDOW_MANAGER.close();
        },
        minMax: function() {
            WINDOW_MANAGER.minMax();
        },
        min: function() {
            WINDOW_MANAGER.min();
        }
    }
};
</script>

