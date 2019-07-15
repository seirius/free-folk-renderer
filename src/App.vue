<template>
  <v-app dark>
    <v-toolbar app>
      <v-toolbar-title class="headline text-uppercase">
        <div class="ff-bar">
            <div class="ff-logo">
                <img src="./assets/logo.png" alt="">
            </div>
        </div>
        <!-- <span>Vuetify</span>
        <span class="font-weight-light">MATERIAL DESIGN</span> -->
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <!-- <v-btn
        flat
        href="https://github.com/vuetifyjs/vuetify/releases/latest"
        target="_blank"
      >
        <span class="mr-2">Latest Release</span>
      </v-btn> -->
    </v-toolbar>

    <v-content>
      <HelloWorld/>
    </v-content>
  </v-app>
</template>

<style lang="scss" scoped>
.ff-logo {
    width: 30px;
    height: 30px;
    margin-left: 5px;
    display: flex;
    align-items: center;
    img {
        height: 20px;
    }
}
.ff-bar {
    background-color: #212121;
    max-height: 30px;
    display: flex;
    align-items: center;
    -webkit-app-region: drag;
}
</style>


<script>
import HelloWorld from './components/HelloWorld'

export default {
  name: 'App',
  components: {
    HelloWorld
  },
  data () {
    return {
      //
    }
  }
}
</script>
