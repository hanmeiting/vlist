import Vue from 'vue'
import App from './App.vue'
import router from './router'
// import VirtualBlock from 'virtual-block/dist'
// Vue.use(VirtualBlock)
import VueVirtualScroller from 'vue-virtual-scroller'
import 'vue-virtual-scroller/dist/vue-virtual-scroller.css'
Vue.use(VueVirtualScroller)
// Vue.component('virtual-scroller', VueVirtualScroller)

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')