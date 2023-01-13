import Vue from 'vue'
import App from './App'
import '@babel/polyfill'
import 'mutationobserver-shim'
import { BootstrapVue } from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import './assets/css/main.css'
import VueKonva from 'vue-konva';


Vue.use(VueKonva);
Vue.use(BootstrapVue)

Vue.config.productionTip = false

new Vue({
  render: h => h(App)
}).$mount('#app')
