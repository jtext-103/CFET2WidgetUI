import 'buefy/dist/buefy.css';
import Vue from 'vue';
import App from './App.vue';
import Buefy from 'buefy';
import axios from './axios/index';
import * as VueWindow from '@hscmap/vue-window';
import ProgressBar from 'vuejs-progress-bar';
import ToggleButton from 'vue-js-toggle-button';
Vue.use(Buefy);
Vue.use(ToggleButton);
Vue.use(ProgressBar);
import 'babel-polyfill';
import VideoPlayer from 'vue-video-player';
import 'vue-video-player/src/custom-theme.css';
import 'video.js/dist/video-js.css';
Vue.config.productionTip = false;
Vue.use(VueWindow);
Vue.use(VideoPlayer);
var Appuse = new Vue({
    render: (h) => h(App),
}).$mount('#app');
//export default Appmain
Vue.prototype.$axios = axios;
//console.log(Appmain.$children[0].UpdateWidget('111'));
//window.UpdateWidget = Appuse.$children[0].UpdateWidget;
//# sourceMappingURL=main.js.map