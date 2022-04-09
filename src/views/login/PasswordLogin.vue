<template>
  <div>
    <div class="cell-group-box">
        <van-cell-group>
          <van-field
            v-model="form.phone"
            placeholder="请输入账号"
            clearable
          />
          <van-field
            v-model="form.passwd"
            placeholder="请输入密码"
            clearable
            :type="seePwd ? 'text' : 'password'"
            style="margin-top: 15px"
          >
            <template #right-icon>
              <van-icon 
                v-if="!seePwd"
                :name="closeImg"
                @click="seePwd = true"
              />
              <van-icon v-if="seePwd" :name="openImg" @click="seePwd = false" />
            </template>
          </van-field>
        </van-cell-group>
        <div class="submit-box">
          <van-button
            class="submit-bottom"
            block
            @click="handleSubmit"
            :disabled="!form.phone || !form.passwd"
            >登录</van-button
          >
        </div>
    </div>
  </div>
</template>

<script>
import { pwdLogin } from '@/api/login.js';
export default {
  name: "passwordLogin",
  data() {
    return {
      openImg: require("@/assets/icon/可见.png"),
      closeImg: require("@/assets/icon/不可见.png"),
      seePwd: false,
      form: {},
    };
  },
  created() {
    // console.log('created',this.$store.getters.get_account())
    this.form = {
      phone: this.$store.getters.get_account()
    }
    },
  mounted() {
  },

  methods: {
    // 登录
    handleSubmit() {
      // if( !this.$regex.mobileRegex.test(this.form.phone)){
      //     return this.$vtoast('请输入正确手机号');
      // }
      let form = {...this.form}
      let uniqueId = this.$store.getters.get_uniqueId()
      let data = {
        phone: form.phone,
        passwd: form.passwd,
        fromType: 2,
        uniqueId,
      }
      pwdLogin(data).then(res => {
        console.log(res)
        this.$store.commit('set_userinfo',res.data)
        this.$store.commit('set_uid',res.data.uid)
        this.$store.commit('set_token',res.data.token)
        this.$vtoast("登录成功");
        setTimeout(() => {
          this.$router.push({
            path:'/index'
          })
        }, 1000);
      })
    },
  },
};
</script>

<style lang="less" scoped>
.cell-group-box {
  padding-bottom: 50px;
  //   margin-top: 20px;
  /deep/ .van-cell {
    padding: 13px 20px !important;
  }
  /deep/ .van-field__label,
  /deep/ .van-cell__title {
    font-size: 14px;
    font-family: PingFang SC;
    font-weight: 500;
    color: #212121;
  }
  /deep/ .van-field__value,
  /deep/ .van-cell__value {
    font-size: 17px;
    font-family: PingFang SC;
    // font-weight: bold;
    color: #212121;
  }
  /deep/ .van-cell-group,
  /deep/ .van-cell {
    background-color: rgba(0, 0, 0, 0);
  }
}
.submit-bottom{
  font-size: 32px;
  letter-spacing: 1px;
  font-family: PingFang SC;
  font-weight: bold;
}
</style>