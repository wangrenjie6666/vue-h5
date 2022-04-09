<template>
  <div class="box">
    <div class="cell-group-box">
      <van-cell-group>
        <van-field
          v-model="form.account"
          label="手机号"
          placeholder="请输入手机号"
          type="tel"
          clearable
        />
        <van-field
          v-model="form.smsCode"
          label="短信验证"
          placeholder="请输入验证码"
          clearable
        >
          <template #right-icon>
            <a-button
              v-if="!send"
              class="code-button"
              type="link"
              @click="handleCode"
            >
              获取验证码
            </a-button>
            <span v-if="send" class="count">{{ count }} s</span>
          </template>
        </van-field>
        <van-field
            v-model="form.password"
            label="设置密码"
            placeholder="请输入密码"
            clearable
            type="password"
          />
          <van-field
            v-model="form.againPassword"
            label="重复密码"
            placeholder="请再次输入密码"
            clearable
            type="password"
          />
      </van-cell-group>
      <div class="submit-box">
        <van-button
          class="submit-bottom"
          block
          @click="handleSubmit"
          >确认</van-button
        >
      </div>
    </div>
  </div>
</template>

<script>
import { sendNote, forgetPwdBySmsCode } from '@/api/login.js';
export default {
  name: "findPwd",
  props: {},
  data() {
    return {
      send: false,
      count: "",
      timer: null,
      form: {},
    };
  },
  created() {
  },
  mounted() {},

  methods: {
    //   验证表单
    onFailed(errorInfo) {
      console.log("failed", errorInfo);
    },
    // 登录
    handleSubmit() {
      if (!this.$regex.mobileRegex.test(this.form.account)) {
        return this.$vtoast("请输入正确手机号");
      }else if(!this.form.smsCode){
        return this.$vtoast("请输入验证码");
      }else if(this.form.password != this.form.againPassword){
        return this.$vtoast("两次输入密码不一致");
      }
      console.log(this.form);
      let form = {...this.form}
      let data = {
        phone: form.account,
        passwd: form.password,
        smsCode: form.smsCode,
      }
      forgetPwdBySmsCode(data).then(res => {
        console.log(res)
        this.$vtoast("密码设置成功");
        setTimeout(() => {
          this.$router.go(-1);//返回上一层
        }, 1000);
      })
    },
    // 获取验证码
    handleCode() {
      if (!this.$regex.mobileRegex.test(this.form.account)) {
        return this.$vtoast("请输入正确手机号");
      }
      const TIME_COUNT = 60;
      if (!this.timer) {
        this.count = TIME_COUNT;
        this.send = true;
        this.timer = setInterval(() => {
          if (this.count > 0 && this.count <= TIME_COUNT) {
            this.count--;
          } else {
            this.send = false;
            clearInterval(this.timer);
            this.timer = null;
          }
        }, 1000);
      }
      let data = {
        account:this.form.account,
        smsType:'reset',
      }
      sendNote(data).then((res) => {
        if(res.data.code == 0){
          this.$vtoast(res.data.data.msg)
        }
      })
    },
  },
};
</script>

<style lang="less" scoped>

.box {
  background-color: rgb(243,243,243);
  min-height: 100vh;
  padding-top: 20px;
}
.cell-group-box {
  padding-bottom: 50px;
  //   margin-top: 20px;
  /deep/ .van-cell {
    padding: 13px 20px !important;
  }
  /deep/ .van-field__label,
  /deep/ .van-cell__title {
    font-size: 15px;
    font-family: PingFang SC;
    font-weight: 500;
    color: #212121;
  }
  /deep/ .van-field__value,
  /deep/ .van-cell__value {
    font-size: 15px;
    font-family: PingFang SC;
    // font-weight: bold;
    color: #212121;
  }
}
.code-button {
  //   border: 0px;
  height: 45px;
  font-size: 28px;
  font-family: PingFang SC;
  font-weight: 500;
  color: #367ff9;
}
.count {
  font-size: 28px;
  font-family: PingFang SC;
  font-weight: 500;
  color: #999999;
}
</style>