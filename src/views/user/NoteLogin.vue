<template>
    <div class="passwordlogin">
        <div class="mt30 title">登录/注册</div>
        <div class="tip">未注册的用户可通过验证码直接注册</div>
        <div class="user-input mt40">
            <van-field v-model="userForm.account" type="number" maxlength="11" placeholder="请输入手机号"
                @keyup="loginTest()" />
        </div>
        <div class="user-input mt24 relative">
            <div v-show="!waitNoteSend" class="get-note-code" :class="{'colorlight-gray':loginRegular.codeDisable}"
                @click="getNote()">获取验证码</div>
            <div v-show="waitNoteSend" class="agin-note-wait"><span>重新获取</span><span>
                    ({{noteTime}}s)</span>
            </div>
            <van-field v-model="userForm.code" type="numver" maxlength="6" placeholder="请输入验证码" @keyup="loginTest()" />
        </div>
        <!-- 登录按钮 -->
        <div class="mt60" @click="login()">
            <van-button class="button" :class="{'bglight-gray':loginRegular.loginDisable}" type="primary">登录
            </van-button>
        </div>
        <!-- 登录按钮 -->
        <div class="mt20 password-login" @click="goPwdLogin()">
            账号密码登录
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
        <div class="mt26 mb20 agreement ">
            <span>登录代表你已同意</span><span class="service">《服务协议》 </span> <span>和</span> <span class="privacy">
                《隐私协议》</span>
        </div>
    </div>

</template>

<script>
    import {
        sendNote,
        codeLogin
    } from '@/api/login';
    export default {
        data() {
            return {
                logining: false,
                value: '',
                checked: false,
                waitNoteSend: false,
                noteTime: 60,
                loginRegular: {
                    codeDisable: true,
                    loginDisable: true,
                },
                userForm: {
                    account: '',
                    code: '',
                    waitNoteSend: false,
                }
            }
        },
        mounted() {},
        methods: {
            goPwdLogin() {
                this.$router.push({
                    path: 'passwordlogin'
                })
            },
            //得到短信
            getNote() {
                if (this.waitNoteSend) return;
                this.waitNoteSend = true;
                this.timeCountDown();
                let data = {
                    account: this.userForm.account,
                    smsType: 'login',
                };
                sendNote(data).then(res => {

                })
            },
            //登录
            login() {
                if (this.logining) return;
                this.logining = true;
                let data = {
                    phone: this.userForm.account,
                    smsCode: this.userForm.code
                }
                codeLogin(data).then(res => {
                    this.$notify({
                        type: 'success',
                        message: '登录成功!',
                        // background: '#2FA1FD',
                        duration: 2000,
                    });
                    localStorage.setItem('token', res.data.token);
                    localStorage.setItem('userInfo', JSON.stringify({
                        uid: res.data.uid
                    }));
                    // localStorage.setItem('userInfo', res.data.token);
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
            timeCountDown() {
                let timeClock = setInterval(() => {
                    this.noteTime--;
                    if (this.noteTime == 0) {
                        clearInterval(timeClock);
                        this.noteTime = 60;
                        this.waitNoteSend = false;
                    }
                }, 1000)
            },
            loginTest() {
                let noteCodeStatus = true;
                this.$common.phoneRegular(this.userForm.account) == true ? this.loginRegular.codeDisable = false : this
                    .loginRegular.codeDisable = true;
                this.$common.numRegular(this.userForm.code) == true ? noteCodeStatus = false : noteCodeStatus = true;
                this.loginRegular.codeDisable == false && noteCodeStatus == false ? this.loginRegular.loginDisable =
                    false : this.loginRegular.loginDisable = true;
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
            .agin-note-wait {
                cursor: pointer;
                position: absolute;
                border: 0;
                right: 0;
                z-index: 99;
                top: 0;
                height: 24px;
                display: flex;
                align-items: center;
                bottom: center;
                font-size: 14px;
                color: @ash;
            }

            .get-note-code {
                cursor: pointer;
                position: absolute;
                border: 0;
                right: 0;
                z-index: 99;
                top: 0;
                height: 24px;
                display: flex;
                align-items: center;
                bottom: center;
                font-size: 14px;
                color: @blue;
            }
        }

        .password-login {
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