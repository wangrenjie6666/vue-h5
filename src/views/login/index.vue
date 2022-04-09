<template>
  <div class="box">
    <div class="login-box">
      <div class="logo-box">
        <van-image class="logo" :width="100" :height="105" :src="logoImg" />
      </div>
    </div>
    <div class="form-box">
      <Password ref="pwd" v-if="loginType == 'password'" ></Password>
      <Note ref="note" v-if="loginType == 'note'" ></Note>
    </div>

    <div class="login-type-box">
      <div v-if="loginType == 'password'">
        <div @click="handleSwithLoginType('note')" >短信验证码登录</div>
        <div @click="handleFindPwd">找回密码</div>
      </div>
      <div v-if="loginType == 'note'">
        <div @click="handleSwithLoginType('password')">账号密码登录</div>
      </div>
    </div>
  </div>
</template>

<script>
import Password from "./PasswordLogin";
import Note from "./NoteLogin";
export default {
  name: "login",
  props: {},
  components: { Password, Note },
  data() {
    return {
      loginType: "note",
      logoImg: require("@/assets/img/logo.png"),
      account: null,
    };
  },
  created() {},
  mounted() {},

  methods: {
    // 找回密码
    handleFindPwd() {
      this.$router.push({
        path: "/findPassword",
      });
    },
    // 切换短信登陆和账号登陆
    handleSwithLoginType(type){
      if(type == 'password'){
        console.log("this.$refs['note'].form.phone",this.$refs['note'].form.account)
        this.$store.commit('set_account',this.$refs['note'].form.account)
      }else if(type == 'note'){
        console.log("this.$refs['pwd'].phone",this.$refs['pwd'].form.phone)
        this.$store.commit('set_account',this.$refs['pwd'].form.phone)
      }
      this.loginType = type
    }
  },
};
</script>

<style lang="less" scoped>
.box {
  background-color: white;
  min-height: 100vh;
  background-image: url("../../assets/img/loginBg.png");
  background-size: 100%;
  background-repeat: no-repeat;
}
.login-box {
  //   height: 666px;
  .logo-box {
    //   height: 400px;
    display: flex;
    justify-content: center;
    align-items: center;
    .logo {
      margin-top: 130px;
    }
  }
}
.form-box {
  margin-top: 60px;
  padding: 20px;
}
.login-type-box {
  > div {
    padding: 0px 55px;
    display: flex;
    justify-content: space-between;
    font-size: 26px;
    font-family: PingFang SC;
    font-weight: 500;
    color: #999999;
  }
}
</style>