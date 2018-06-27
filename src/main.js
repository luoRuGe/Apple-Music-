import "babel-polyfill"
import Vue from "vue"
import App from './App'
import VueResource from "vue-resource"
import store from "./store"
import router from "./router"
import fastclick from 'fastclick'
import VueLazyLoad from "vue-lazyload"
import 'common/stylus/index.styl'

Vue.use(VueResource)
Vue.use(VueLazyLoad,{
  loading:require('common/image/default.png')
})
fastclick.attach(document.body);

new Vue({
  el:"#app",
  store,
  router,
  render:h=>h(App)
})
