import UserHeader from './UserHeader.vue'
// 这里是重点
const CustomComponents = {
    install(Vue){
        Vue.component('UserHeader',UserHeader)
    }
}
// 导出组件
export default CustomComponents
