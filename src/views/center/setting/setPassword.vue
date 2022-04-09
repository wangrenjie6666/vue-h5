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
import { sendNote, changePwdBySmsCode } from '@/api/login.js';
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
    this.count = this.store_state_codeTime;
			this.send = this.store_state_send;
			console.log('created',this.codeTime)
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
      changePwdBySmsCode(data).then(res => {
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
				let data = {
					account: this.form.account,
					smsType: 'login',
				}
				sendNote(data).then((res) => {
					if (res.data.code == 0) {
						this.$vtoast(res.data.data.msg)
						if(res.data.data.status == 0){
							this.$store.commit('send_loginCode')
						}
					}
				})
			},
  },
  computed: {
		  store_state_codeTime() {
		    return this.$store.getters.get_codeTime();
		  },
		  store_state_send() {
		    return this.$store.getters.get_send();
		  },
		},
		//监听执行
		watch: {
		  store_state_codeTime() {
		    this.codeTime = this.store_state_codeTime;
			this.count = this.codeTime
		    console.log("this.codeTime", this.codeTime);
		  },
		  store_state_send(){
		    this.send = this.store_state_send;
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