import Vue from 'vue'
import VueRouter from 'vue-router'
/*
*用户模块
*
*/
const User = () => import( '@/views/user/User')//用户主路由
const PasswordLogin = () => import( '@/views/user/PasswordLogin')//密码登录
const NoteLogin=() => import ( '@/views/user/NoteLogin')//短信登录
const LostPassword = () => import ('@/views/user/LostPassword')//忘记密码

/**
 * 首页
 */
const Index=()=> import('@/views/index/Index')


Vue.use(VueRouter)
const routes = [
  {
    path: '/',
    name: '',
    redirect: '/index',
    hidden: true,
    meta: {
        requireAuth: false
    }
  },
  {
    path: '/index',
    name: '首页',
    hidden: true,
    component:Index,
    meta: {
        requireAuth: false
    }
  },
  {
    path:'/user',
    name:'用户',
    redirect:'/notelogin',
    component:User,
    children:[
      {
        path: '/passwordlogin',
        name: '密码登录',
        component: PasswordLogin,
        meta: {
          requireAuth: false
      }
     },
      {
        path:'/notelogin',
        name:'短信登录',
        component:NoteLogin,
        meta:{
          requireAuth: false
      }
      },
      {
        path:'/lostpassword',
        name:'忘记密码',
        component:LostPassword,
        meta: {
          requireAuth: false
      }
    }
      
    ],
    
    
  }
   
  
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
