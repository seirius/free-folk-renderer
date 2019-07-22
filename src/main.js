import 'bootstrap';
import BootstrapVue from 'bootstrap-vue';
import 'bootstrap-vue/dist/bootstrap-vue.css';
import 'bootstrap/dist/css/bootstrap.css';
import 'video.js/dist/video-js.css';
import Vue from 'vue';
import App from './App.vue';
import './plugins/vuetify';
import router from './router';

Vue.use(BootstrapVue);

Vue.config.productionTip = false

new Vue({
    router,
    render: h => h(App),
    mounted() {
        window.setImmediate = window.electron.setImmediate;
    },
}).$mount('#app');
