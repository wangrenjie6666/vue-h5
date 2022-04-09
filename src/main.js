import Vue from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import store from './store'
import 'amfe-flexible';
//使用vant框架
import { Button,Field,Cell, CellGroup,Checkbox,CheckboxGroup,Dialog,Notify} from 'vant';
Vue.use(Button).use(Field).use(CellGroup).use(Checkbox).use(CheckboxGroup).use(Dialog).use(Notify);
Vue.config.productionTip = false
//引入自定义全局组件
import CustomComponents from '@/components/common/index.js'
/*引入公共的样式  */
import './assets/css/common.less'

//全局可用函数
import * as common from './utils/common'
Vue.prototype.$common = common


//路由拦截器
// 路由拦截器
router.beforeEach((to, from, next) => {
          if (Boolean(localStorage.getItem("token"))) { // 判断是否登录
              if (to.path != "/" && to.path != "/passwordlogin" && to.path != "/notelogin") { //判断是否要跳到登录界面
                next();
              } else {
                  /**
                   * 防刷新，如果登录，修改路由跳转到登录页面，修改路由为登录后的首页
                   */
                  next({
                      path:'/index'
                  })
              }
          }else{
              next();
          }
})


Vue.use(CustomComponents);
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
