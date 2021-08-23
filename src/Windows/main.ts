import Vue from 'vue';
import Buefy from 'buefy'
import 'buefy/dist/buefy.css'

import WindowsApp from './WindowsApp.vue';



import * as VueWindow from '@hscmap/vue-window'
import ToggleButton from 'vue-js-toggle-button'
Vue.use(Buefy)
Vue.use(ToggleButton)



import 'babel-polyfill'

import VideoPlayer from 'vue-video-player'
import 'vue-video-player/src/custom-theme.css'
import 'video.js/dist/video-js.css'


Vue.config.productionTip = false;



Vue.use(VueWindow)

Vue.use(VideoPlayer)


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
    //router,
}).$mount('#WindowsApp');

