import Vue from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import store from './store'

import './assets/js/rem'
// import 'amfe-flexible';


// 引入 mandMobile
import mandMobile from 'mand-mobile'
import 'mand-mobile/lib/mand-mobile.css'
import { Toast, Dialog, ActionSheet} from 'mand-mobile';
Vue.prototype.$toast = Toast
Vue.prototype.$alert = Dialog.alert;
Vue.prototype.$dialog = Dialog;
Vue.prototype.$actionsheet = ActionSheet;
Vue.use(mandMobile)
//使用vant框架
import { Button, Field, Cell, CellGroup, Checkbox, CheckboxGroup, Dialog as vDialog, Notify,Tabbar, TabbarItem, Image as VanImage, Popup, Picker, Tab, Tabs ,
  Collapse, CollapseItem,Divider, NumberKeyboard, Progress, Sticky, Overlay, Uploader, ActionSheet as vActionSheet, DatetimePicker, Switch, Icon, Form, Toast as vToast,
  PullRefresh, List, Loading, Popover  } from 'vant';
Vue.use(Button).use(Field).use(CellGroup).use(Checkbox).use(CheckboxGroup).use(vDialog).use(Notify).use(Tabbar).use(TabbarItem).use(VanImage).use(Popup).use(Picker).use(Tab).use(Tabs)
.use(Collapse).use(CollapseItem).use(Divider).use(NumberKeyboard).use(Progress).use(Sticky).use(Overlay).use(Cell).use(Uploader).use(vActionSheet).use(DatetimePicker)
.use(Switch).use(Icon).use(Form).use(PullRefresh).use(List).use(Loading).use(Popover);
Vue.prototype.$vtoast = vToast
Vue.prototype.$vDialog = vDialog
Vue.config.productionTip = false
//引入自定义全局组件
import CustomComponents from '@/components/common/index.js'
/*引入公共的样式  */
import './assets/css/common.less'
import './assets/css/index.scss'

//全局可用函数
import * as common from './utils/common'
Vue.prototype.$common = common

// 引入swiper轮播组件
import VueAwesomeSwiper from 'vue-awesome-swiper'
import 'swiper/css/swiper.css'
Vue.use(VueAwesomeSwiper, /* { default options with global component } */ )

// 引入vconsole
// import Vconsole from 'vconsole';
// new Vconsole();

// 引入使用antd-vue框架
import { Radio, Switch as aSwitch, Button as aButton, Tooltip as aTooltip, Input as aInput, FormModel, Avatar } from 'ant-design-vue';
import 'ant-design-vue/dist/antd.css';
Vue.use( Radio ).use(aSwitch).use(aButton).use(aTooltip).use(aInput).use(FormModel).use(Avatar);

// 引入v-charts
import VCharts from 'v-charts'
Vue.use(VCharts)

// 正则
import regex from './utils/regex.js';
Vue.prototype.$regex = regex;

// vue-route-transition
import RouteTransition from 'vue-route-transition'
Vue.use(RouteTransition)

// 引入animate动画
import 'animate.css';

Vue.use(CustomComponents);
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
