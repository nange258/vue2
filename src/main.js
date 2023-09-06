import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import axios from 'axios'
import VueAxios from 'vue-axios'
import css from '@/assets/css/index.css'
import TreeTable from 'vue-table-with-tree-grid'
Vue.use(VueAxios, axios)
Vue.use(ElementUI)
Vue.config.productionTip = false
Vue.component('tree-table', TreeTable)
axios.defaults.baseURL = 'http://www.chenfuguo.cn:8899/api/private/v1';
axios.interceptors.request.use(function (config) {
  // 在发送请求之前做些什么
  let token = sessionStorage.getItem('token');
  if (token) {
    config.headers['Authorization'] = token;
  }
  return config;
}, function (error) {
  // 对请求错误做些什么
  return Promise.reject(error);
});
// 全局的过滤器
Vue.filter('dateForm', function (val) {
  let dt = new Date(val)
  let n = dt.getFullYear()
  let y = dt.getMonth() + 1
  y = y > 10 ? y : '0' + y
  let d = dt.getDate()
  d = d > 10 ? d : '0' + d
  let h = dt.getHours()
  h = h > 10 ? h : '0' + h
  let f = dt.getMinutes()
  f = f > 10 ? f : '0' + f
  let s = dt.getSeconds()
  s = s > 10 ? s : '0' + s
  return `${n}-${y}-${d} ${h}:${f}:${s}`
})
new Vue({
  router,
  store,
  css,
  render: function (h) { return h(App) }
}).$mount('#app')
