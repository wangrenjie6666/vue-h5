<template>
    <div class="lost-password">
        <div class="mt30 title">找回密码</div>
        <div class="user-input mt66">
            <van-field v-model="value" placeholder="请输入手机号" />
        </div>
        <div class="user-input mt24">
            <van-field v-model="value" placeholder="请输入验证码" />
        </div>
        <!-- 登录按钮 -->
        <div class="mt60">
            <van-button class="grey-button" type="primary">下一步</van-button>
        </div>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                value: '',
                checked: false,
            }
        }
    }
</script>

<style lang="less" scoped>
    .lost-password {
        padding: 0 32px;

        .title {
            font-size: 20px;
            font-weight: bold;
            color: @black;
            height: 28px;
            line-height: 28px;
        }

        .tip {
            font-size: 12px;
            color: @ash;
            font-weight: 400;
            height: 17px;
            line-height: 17px;
            margin-top: 8px;
        }
    }
</style>