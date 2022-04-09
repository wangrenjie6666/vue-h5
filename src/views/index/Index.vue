<template>
    <div>
        <h1 class="f16">首页</h1>
        <div v-if="!islogin">
            <div class="f16" @click="goLogin">进入短信登录</div>
            <div class="f16" @click="goPasswordLogin">进入密码登录</div>
        </div>
        <div v-else>
            恭喜你已经登录了
            <div @click="loginOut">点击退出登录</div>
        </div>

    </div>
</template>

<script>
    import {
        loginOut
    } from '@/api/login';
    export default {
        name: 'Index',
        data() {
            return {
                islogin: localStorage.getItem('token'),
            };
        },

        mounted() {
            console.log(this.islogin);


        },

        methods: {
            goLogin() {
                this.$router.push({
                    path: '/notelogin'
                })
            },
            goPasswordLogin() {
                this.$router.push({
                    path: '/passwordlogin'
                })
            },
            loginOut() {
                let uid = JSON.parse(localStorage.getItem('userInfo')).uid;
                loginOut({
                    uid,
                }).then(res => {
                    console.log(res);
                    localStorage.removeItem('token');
                    localStorage.removeItem('userInfo');
                    this.$router.push({
                        path: '/login'
                    })
                })
            }
        },
    };
</script>

<style lang="less" scoped>

</style>