<template>
    <div class="passwordlogin">
        <div class="mt30 title">密码登录</div>
        <div class="tip">未注册的用户可通过验证码直接注册</div>
        <div class="user-input mt40">
            <van-field v-model="userForm.phone" type="number" maxlength="11" placeholder="请输入手机号"
                @keyup="loginTest()" />
        </div>
        <div class="user-input mt24 relative">
            <div class="close-pwd" v-show="!pwdEyeStatus" @click="changePwdEye(true);">
                <img src="@/assets/img/closeeye.svg" alt="">
            </div>
            <div class="see-pwd" v-show="pwdEyeStatus" @click="changePwdEye(false);">
                <img src="@/assets/img/openeye.svg" alt="">
            </div>
            <van-field :type="passwordType" maxlength="20" v-model="userForm.passwd" placeholder="请输入密码"
                @keyup="loginTest()" />
        </div>
        <div class="user-add">
            <div class="rember-pwd">
                <div class="checkbox">
                    <van-checkbox icon-size="12px" class="checkbox-input" v-model="checked" shape="square">
                    </van-checkbox>
                </div>
                <div class="desc">记住密码</div>
            </div>
            <div class="lost-pwd" @click="goLostPwd()">忘记密码?</div>
        </div>
        <!-- 登录按钮 -->
        <div class="mt30">
            <van-button @click="login()" class="button" :class="{'bglight-gray':loginRegular.loginDisable}"
                type="primary">登录
            </van-button>
        </div>
        <!-- 登录按钮 -->
        <div class="mt20 note-login" @click="goNoteLogin()">
            短信验证码登录
        </div>
        <!-- 其他登录方式 -->
        <div class="mt46 other-login">
            <div class="crossing"></div>
            <div class="desc">其他登录方式</div>
            <div class="crossing"></div>
        </div>
        <!-- 微信登录方式 -->
        <div class="mt20 wechat-login">
            <div class="image">
                <img src="@/assets/img/wechat.svg" alt="">
            </div>
        </div>
        <!-- 协议 -->
        <div class="mt26 mb20 agreement">
            <span>登录代表你已同意</span><span class="service">《服务协议》 </span> <span>和</span> <span class="privacy">
                《隐私协议》</span>
        </div>
    </div>

</template>

<script>
    import {
        pwdLogin
    } from '@/api/login';
    export default {
        data() {
            return {
                logining: false,
                value: '',
                checked: false,
                passwordType: 'password',
                loginRegular: {
                    loginDisable: true,
                },
                pwdEyeStatus: false,

                userForm: {
                    phone: '',
                    passwd: '',
                }
            }
        },
        methods: {
            goNoteLogin() {
                this.$router.push({
                    path: '/notelogin'
                })
            },
            //登录
            login() {
                if (this.logining) return;
                this.logining = true;
                let data = {
                    phone: this.userForm.phone,
                    passwd: this.userForm.passwd
                }
                pwdLogin(data).then(res => {
                    this.$notify({
                        type: 'success',
                        message: '登录成功!',
                        // background: '#2FA1FD',
                        duration: 2000,
                    });
                    localStorage.setItem('token', res.data.token);
                    setTimeout(() => {
                        this.logining = false;
                        this.$router.push({
                            path: '/index'
                        });
                    }, 2000)
                }).catch(res => {
                    this.logining = false;
                })

            },
            goLostPwd() {
                this.$router.push({
                    path: '/lostpassword'
                })
            },
            loginTest() {
                this.$common.phoneRegular(this.userForm.phone) && this.userForm.passwd != '' == true ? this.loginRegular
                    .loginDisable = false : this
                    .loginRegular.loginDisable = true;
            },
            changePwdEye(status) {
                this.pwdEyeStatus = status;
                status == true ? this.passwordType = 'text' : this.passwordType = 'password';
            }
        }
    }
</script>

<style lang="less" scoped>
    .passwordlogin {
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

        .user-input {

            .see-pwd,
            .close-pwd {
                cursor: pointer;
                position: absolute;
                border: 0;
                right: 0;
                z-index: 99;
                top: 0;
                height: 24px;
                display: flex;
                align-items: center;

                img {
                    width: 16px;
                    height: 16px;
                }
            }
        }

        .user-add {
            height: 32px;
            display: flex;
            justify-content: space-between;

            .rember-pwd {
                display: flex;
                flex: 1;
                line-height: 32px;

                .checkbox {
                    display: flex;
                    align-items: center;
                    // flex: 1;
                }

                .desc {
                    margin-top: 1px;
                    margin-left: 5px;
                    font-size: 12px;
                    color: @ash;
                }
            }

            .lost-pwd {
                font-size: 12px;
                margin-top: 1px;
                color: @ash;
                line-height: 32px;
            }
        }

        .note-login {
            height: 20px;
            line-height: 20px;
            color: @blue;
            text-align: center;
            font-size: 14px;
            font-weight: 400;
        }

        .other-login {
            color: @light-gray;
            font-size: 12px;
            height: 17px;
            display: flex;
            justify-content: center;
            flex: 1;
            align-items: center;

            .desc {
                margin: 0 10px;
            }

            .crossing {
                width: 40px;
                height: 0;
                border-bottom: 1px solid @light-gray;
            }
        }

        .wechat-login {
            display: flex;
            justify-content: center;

            .image {
                width: 44px;
                height: 44px;

                img {
                    width: 100%;
                    height: 100%;
                }
            }
        }

        .agreement {
            text-align: center;
            font-size: 12px;
            color: @ash;

            .service,
            .privacy {
                color: @blue;

            }
        }
    }
</style>