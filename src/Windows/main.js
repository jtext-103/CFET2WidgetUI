import Vue from 'vue';
import WindowsApp from './WindowsApp.vue';
import Buefy from 'buefy';
import 'buefy/dist/buefy.css';
import 'font-awesome/css/font-awesome.min.css';
//import hscmap from '@hscmap/vue-window'
import * as VueWindow from '@hscmap/vue-window';
import 'babel-polyfill';
import VideoPlayer from 'vue-video-player';
import 'vue-video-player/src/custom-theme.css';
import 'video.js/dist/video-js.css';
Vue.config.productionTip = false;
//Vue.use(BootstrapVue)
Vue.use(Buefy);
Vue.use(VueWindow);
Vue.use(VideoPlayer);
// Vue.use(VueRouter);
// const routes = [
//   { path: '/',  meta: {
//     title: 'MdsplusWave'
//   }
// }
// ];
// const router = new VueRouter({
//   routes
// });
// router.beforeEach((to, from, next) => {
//   document.title = 'MdsplusWave'
//   next()
// })
new Vue({
    render: (h) => h(WindowsApp),
}).$mount('#WindowsApp');
//# sourceMappingURL=main.js.map