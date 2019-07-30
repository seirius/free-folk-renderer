<template>
    <router-view></router-view>
</template>

<style>
html {
    overflow: hidden;
}
.ff-navigation.electron {
    margin-top: 32px !important;
}
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}
::-webkit-scrollbar-button {
  width: 9px;
  height: 9px;
}
::-webkit-scrollbar-thumb {
  background: #e1e1e1;
  border: 0px none #ffffff;
  border-radius: 50px;
}
::-webkit-scrollbar-thumb:hover {
  background: #ffffff;
}
::-webkit-scrollbar-thumb:active {
  background: #000000;
}
::-webkit-scrollbar-track {
  background: #666666;
  border: 0px none #ffffff;
  border-radius: 21px;
}
::-webkit-scrollbar-track:hover {
  background: #666666;
}
::-webkit-scrollbar-track:active {
  background: #333333;
}
::-webkit-scrollbar-corner {
  background: transparent;
}
.unselectable {
    user-select: none;
}
.undraggable {
    -webkit-user-drag: none;
}
.text-right {
    text-align: right;
}
</style>


<style lang="scss" scoped>
</style>


<script>
export default {
    name: "App",
    components: {
    },
    data() {
        return {
            isElectron: false
        };
    },
    mounted: function() {
        this.isElectron = !!window.electron;
    },
    methods: {
    }
};
</script>
