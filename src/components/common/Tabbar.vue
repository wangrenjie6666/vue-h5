<template>
    <div class="box">
        <van-tabbar v-model="active" route   >
            <van-tabbar-item v-for="item,index in tabbar_data" class="tabbar" :class="index == 2 ? 'plus' : ''" 
            :icon="active == index ? item.select_icon : item.icon" :key="index" :to="item.url">{{ item.title }}</van-tabbar-item>
        </van-tabbar>
    </div>
</template>

<script>
    export default {
        props:{
            nowActive:{
                type: Number,
                default:0,
            },
        },
        data(){
            return {
                active: this.nowActive,
                tabbar_data:[
                    {
                        title:'首页',
                        url:'/index',
                        icon:require('../../assets/icon/首页 (4).png'),
                        select_icon:require('../../assets/icon/首页 (3).png'),
                    },
                    {
                        title:'账单',
                        url:'/bill',
                        icon:require('../../assets/icon/记账.png'),
                        select_icon:require('../../assets/icon/记账(1).png'),
                    },
                    {
                        url:'/write',
                        icon:require('../../assets/icon/组 97.png'),
                        select_icon:require('../../assets/icon/组 97(1).png'),
                    },
                    {
                        title:'资讯',
                        url:'',
                        icon:require('../../assets/icon/交易记录.png'),
                        select_icon:require('../../assets/icon/交易记录(1).png'),
                    },
                    {
                        title:'个人中心',
                        url:'',
                        icon:require('../../assets/icon/身份.png'),
                        select_icon:require('../../assets/icon/身份(1).png'),
                    }
                ]
            }
        },
        methods: {},
    }
</script>

<style lang="less" scoped>
    .plus /deep/ .van-icon__image{
        height: 35px;
        width: 35px;
    }
    .tabbar.van-tabbar-item.van-tabbar-item--active{
        font-weight: 600;
    }
</style>