import ElementUI from 'element-ui';
import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import 'normalize.css/normalize.css'
// import 'element-ui/lib/theme-chalk/index.css';
import '@/styles/element-variables.scss'
import '@/styles/index.scss' // global css
// import './permission'
Vue.config.productionTip = false
Vue.use(ElementUI, {
  size: 'medium', // set element-ui default size
  // locale: enLang // 如果使用中文，无需设置，请删除
});
console.log(process.env.NODE_ENV);
console.log(process.env.VUE_APP_BASE_API);
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
