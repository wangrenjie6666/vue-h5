import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '@/views/home'
import { guid } from '@/utils/dom.js'
import { loginForVisitor } from '@/api/login.js';
import store from '@/store/index'
// import Home from '@/views/home'
/*
*用户模块
*
*/
const User = () => import('@/views/user/User')//用户主路由
const PasswordLogin = () => import('@/views/user/PasswordLogin')//密码登录
const NoteLogin = () => import('@/views/user/NoteLogin')//短信登录
const LostPassword = () => import('@/views/user/LostPassword')//忘记密码

// 首页
const Index = () => import('@/views/index/Index') // 首页
const Rise = () => import('@/views/index/card/rise') // 首页 信用卡 -> 提额
const HistoryPlan = () => import('@/views/index/card/historyPlan') // 首页 信用卡 -> 历史提额计划
const HistoryList = () => import('@/views/index/card/historyList') // 首页 信用卡 -> 历史提额计划
const Diagnosis = () => import('@/views/index/card/diagnosis/index') // 首页 信用卡 -> 诊断
const Diagnosiscard = () => import('@/views/index/card/diagnosis/diagnosiscard') // 首页 信用卡 -> 诊断卡片
const Report = () => import('@/views/index/card/diagnosis/report') // 首页 信用卡 -> 诊断卡片

const Chart = () => import('@/views/index/life/chart') // 首页 生活 -> 图表
// 账单
const Bill = () => import('@/views/bill/Index') // 账单
const Details = () => import('@/views/bill/life/details') // 账单 生活 -> 收入支出详情
const cardDetails = () => import('@/views/bill/card/details') // 账单 信用卡 -> 消费还款详情
// 记账
const Write = () => import('@/views/write/Index') // 记账
const CardEdit = () => import('@/views/write/card/writeEdit') // 记账 （信用卡）
const LifeEdit = () => import('@/views/write/life/writeEdit') // 记账 （生活）
//咨询
const News = () => import('@/views/news/index') // 资讯
// 个人中心
const Center = () => import('@/views/center/index') // 个人中心
const PersonEdit = () => import('@/views/center/person/personEdit') // 编辑个人资料
const PersonCenter = () => import('@/views/center/person/personCenter') // 个人中心
const PersonInfo = () => import('@/views/center/person/personInfo') // 个人主页
const Message = () => import('@/views/center/message/index') // 消息通知
const Setting = () => import('@/views/center/setting/index') // 设置
const Account = () => import('@/views/center/account/index') // 账户
const EditCard = () => import('@/views/center/account/editCard') // 编辑信用卡
const EditSaveCard = () => import('@/views/center/account/editSaveCard') // 编辑储蓄卡
const EditAlipay = () => import('@/views/center/account/editAlipay') // 编辑支付宝
const EditWechat = () => import('@/views/center/account/editWechat') // 编辑微信
// 登录
const Login = () => import('@/views/login/index') // 登录
const FindPassword = () => import('@/views/login/findPassword') // 找回密码
const Start = () => import('@/views/login/start') // 选择账本





Vue.use(VueRouter)
const routes = [

  {
    path: '/',
    component: Home,
    redirect: '/index',
    meta: {
      requireAuth: false, // 添加该字段，表示进入这个路由是需要登录的
      title: '首页',
    },
    children: [
      {
        path: '/',
        redirect: '/index'
      },
      // 首页
      {
        path: '/index',
        component: Index,
        meta: {
          requireAuth: false, // 添加该字段，表示进入这个路由是需要登录的
          title: '首页',
          index: 0
        },
      },
      //账单
      {
        path: '/bill',
        component: Bill,
        meta: {
          requireAuth: false, // 添加该字段，表示进入这个路由是需要登录的
          title: '账单',
          index: 0
        },
      },
      // 资讯
      {
        path: '/news',
        component: News,
        meta: {
          requireAuth: false, // 添加该字段，表示进入这个路由是需要登录的
          title: '资讯',
          index: 0
        },
      },
      // 个人中心
      {
        path: '/center',
        component: Center,
        meta: {
          requireAuth: false, // 添加该字段，表示进入这个路由是需要登录的
          title: '个人中心',
          index: 0
        },
      }
    ]
  },
  // 记账
  {
    path: '/write',
    component: Write,
    meta: {
      requireAuth: false, // 添加该字段，表示进入这个路由是需要登录的
      title: '记账',
      index: 1
    },
  },
  // 首页 信用卡 -> 提额
  {
    path: '/rise',
    name: '提额',
    hidden: true,
    component: Rise,
    meta: {
      requireAuth: true, // 添加该字段，表示进入这个路由是需要登录的
      title: '提额',
      index: 1
    }
  },
  // 首页 信用卡 -> 提额 -> 历史提额计划
  {
    path: '/historyPlan',
    name: '历史提额计划',
    hidden: true,
    component: HistoryPlan,
    meta: {
      requireAuth: true, // 添加该字段，表示进入这个路由是需要登录的
      title: '历史提额计划',
      index: 2
    }
  },
  // 首页 信用卡 -> 提额 -> 历史提额计划
  {
    path: '/historyList',
    name: '历史提额',
    hidden: true,
    component: HistoryList,
    meta: {
      requireAuth: true, // 添加该字段，表示进入这个路由是需要登录的
      title: '历史提额',
      index: 2
    }
  },
  // 首页 信用卡 -> 诊断
  {
    path: '/diagnosis',
    name: '诊断',
    hidden: true,
    component: Diagnosis,
    meta: {
      requireAuth: true, // 添加该字段，表示进入这个路由是需要登录的
      title: '诊断',
      index: 1
    }
  },
  // 首页 信用卡 -> 诊断卡片
  {
    path: '/diagnosiscard/:id',
    name: '诊断卡片',
    hidden: true,
    component: Diagnosiscard,
    meta: {
      requireAuth: true, // 添加该字段，表示进入这个路由是需要登录的
      title: '诊断卡片',
      index: 2
    }
  },
  // 首页 信用卡 -> 诊断卡片 -> 报告
  {
    path: '/report/:id',
    name: '诊断报告',
    hidden: true,
    component: Report,
    meta: {
      requireAuth: true, // 添加该字段，表示进入这个路由是需要登录的
      title: '诊断报告',
      index: 3
    }
  },

  // 首页 生活 -> 图表
  {
    path: '/bookChart',
    name: '图表',
    hidden: true,
    component: Chart,
    meta: {
      requireAuth: true, // 添加该字段，表示进入这个路由是需要登录的
      title: '图表',
      index: 1
    }
  },

  // 账单 生活 -> 收入支出详情
  {
    path: '/billLifeDetails',
    name: '详情',
    hidden: true,
    component: Details,
    meta: {
      requireAuth: true, // 添加该字段，表示进入这个路由是需要登录的
      title: '详情',
      index: 1
    }
  },

  // 账单 信用卡 -> 消费还款详情
  {
    path: '/billCardDetails',
    name: '详情',
    hidden: true,
    component: cardDetails,
    meta: {
      requireAuth: true, // 添加该字段，表示进入这个路由是需要登录的
      title: '详情',
      index: 1
    }
  },
  // 记账 信用卡 -> 编辑
  {
    path: '/cardEdit',
    name: '信用卡记账',
    hidden: true,
    component: CardEdit,
    meta: {
      requireAuth: true, // 添加该字段，表示进入这个路由是需要登录的
      title: '信用卡记账',
      index: 2
    }
  },
  // 记账 生活 -> 编辑
  {
    path: '/lifeEdit',
    name: '生活记账',
    hidden: true,
    component: LifeEdit,
    meta: {
      requireAuth: true, // 添加该字段，表示进入这个路由是需要登录的
      title: '生活记账',
      index: 2
    }
  },

  // 个人中心 -> 个人 -> 编辑个人资料
  {
    path: '/personEdit',
    name: '编辑个人信息',
    hidden: true,
    component: PersonEdit,
    meta: {
      requireAuth: true, // 添加该字段，表示进入这个路由是需要登录的
      title: '编辑个人信息',
      index: 1
    }
  },

  // 个人中心 -> 个人中心
  {
    path: '/personCenter',
    name: '个人中心',
    hidden: true,
    component: PersonCenter,
    meta: {
      requireAuth: true, // 添加该字段，表示进入这个路由是需要登录的
      title: '个人中心',
      index: 1
    }
  },
  // 个人中心 -> 个人中心 -> 个人主页
  {
    path: '/personInfo',
    name: '个人主页',
    hidden: true,
    component: PersonInfo,
    meta: {
      requireAuth: true, // 添加该字段，表示进入这个路由是需要登录的
      title: '个人主页',
      index: 2
    }
  },
  // 个人中心 -> 消息 
  {
    path: '/message',
    name: '消息',
    hidden: true,
    component: Message,
    meta: {
      requireAuth: true, // 添加该字段，表示进入这个路由是需要登录的
      title: '消息',
      index: 1
    }
  },
  // 个人中心 -> 设置
  {
    path: '/setting',
    name: '设置',
    hidden: true,
    component: Setting,
    meta: {
      requireAuth: true, // 添加该字段，表示进入这个路由是需要登录的
      title: '设置',
      index: 1
    }
  },

  // 个人中心 -> 账户
  {
    path: '/account',
    name: '账户',
    hidden: true,
    component: Account,
    meta: {
      requireAuth: true, // 添加该字段，表示进入这个路由是需要登录的
      title: '账户',
      index: 1
    }
  },

  // 个人中心 -> 账户 -> 编辑信用卡
  {
    path: '/editCard',
    name: '编辑信用卡',
    hidden: true,
    component: EditCard,
    meta: {
      requireAuth: false, // 添加该字段，表示进入这个路由是需要登录的
      title: '编辑信用卡',
      index: 2
    }
  },
  // 个人中心 -> 账户 -> 编辑储蓄卡
  {
    path: '/editSaveCard',
    name: '编辑储蓄卡',
    hidden: true,
    component: EditSaveCard,
    meta: {
      requireAuth: true, // 添加该字段，表示进入这个路由是需要登录的
      title: '编辑储蓄卡',
      index: 2
    }
  },
  // 个人中心 -> 账户 -> 编辑支付宝
  {
    path: '/editAlipay',
    name: '编辑支付宝',
    hidden: true,
    component: EditAlipay,
    meta: {
      requireAuth: true, // 添加该字段，表示进入这个路由是需要登录的
      title: '编辑支付宝',
      index: 2
    }
  },
  // 个人中心 -> 账户 -> 编辑微信
  {
    path: '/editWechat',
    name: '编辑微信',
    hidden: true,
    component: EditWechat,
    meta: {
      requireAuth: true, // 添加该字段，表示进入这个路由是需要登录的
      title: '编辑微信',
      index: 2
    }
  },
  // 登录
  {
    path: '/login',
    name: '登录',
    component: Login,
    meta: {
      requireAuth: false, // 添加该字段，表示进入这个路由是需要登录的
      title: '登录',
      index: 0
    }
  },
  // 找回密码
  {
    path: '/findPassword',
    name: '找回密码',
    component: FindPassword,
    meta: {
      requireAuth: false, // 添加该字段，表示进入这个路由是需要登录的
      title: '找回密码',
      index: 1
    }
  },
  // 设置密码
  {
    path: '/setPassword',
    name: '设置密码',
    component: () =>
      import('@/views/center/setting/setPassword.vue'),
    meta: {
      requireAuth: false, // 添加该字段，表示进入这个路由是需要登录的
      title: '设置密码',
      index: 2
    }
  },
  // 启动选择账本页
  {
    path: '/start',
    name: '选择账本',
    component: Start,
    meta: {
      requireAuth: false, // 添加该字段，表示进入这个路由是需要登录的
      title: '选择账本',
      index: -1
    }
  },
  // 关于我们
  {
    path: '/aboutUs',
    name: '关于我们',
    component: () =>
      import('@/views/center/setting/aboutUs.vue'),
    meta: {
      requireAuth: false, // 添加该字段，表示进入这个路由是需要登录的
      title: '关于我们',
      index: 2
    }
  },

  // {
  //   path: '/user',
  //   name: '用户',
  //   redirect: '/notelogin',
  //   component: User,
  //   children: [
  //     {
  //       path: '/passwordlogin',
  //       name: '密码登录',
  //       component: PasswordLogin,
  //       meta: {
  //         requireAuth: false // 添加该字段，表示进入这个路由是需要登录的
  //       }
  //     },
  //     {
  //       path: '/notelogin',
  //       name: '短信登录',
  //       component: NoteLogin,
  //       meta: {
  //         requireAuth: false // 添加该字段，表示进入这个路由是需要登录的
  //       }
  //     },
  //     {
  //       path: '/lostpassword',
  //       name: '忘记密码',
  //       component: LostPassword,
  //       meta: {
  //         requireAuth: false // 添加该字段，表示进入这个路由是需要登录的
  //       }
  //     }
  //   ],
  // }


]

let router = new VueRouter({
  mode: 'hash',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach((to, from, next) => {
  // console.log( 'to', to , 'from',from)
  if (to.meta.title) {// 设置网页title
    document.title = to.meta.title
  }
  let userinfo = JSON.parse(localStorage.getItem('userinfo'))
  // console.log('userinfo.type',userinfo.type)
  // 判断是否有用户缓存 没有则生成gid游客登录,有则进入跳转判判断操作
  // console.log(to,from)
  if (to.path != '/start' && !userinfo) {
    next({
      path: '/start'
    })
  } else if (to.path == '/lifeEdit' || to.path == '/cardEdit' || to.path == '/billLifeDetails' || to.path == '/billCardDetails') {
    // 未登录时可以使用的页面
    next()
  } else {
    if (to.meta.requireAuth) { // 判断该路由是否需要登录权限
      if (userinfo.type == 1) { // 判断当前是否是游客 0游客 1用户
        next()
      } else {
        next({
          path: '/login'
        })
      }
    } else {
      next()
    }
  }

})
export default router
