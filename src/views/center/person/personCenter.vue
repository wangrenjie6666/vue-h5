<template>
  <div class="box">
    <div class="cell-group-box">
      <van-cell-group>
        <van-cell title="个人主页" is-link to="/personInfo" />
        <van-cell title="我的账号" :value="userinfo.phone" />
      </van-cell-group>
      <!-- <div style="margin-top: 10px">
        <van-cell title="二维码名片" is-link @click="qrShow = true" />
      </div> -->
      <!-- 二维码 -->
      <van-overlay :show="qrShow" @click="qrShow = false">
        <div class="wrapper">
            <div @click.stop>
          <vue-qr text="阿斯顿发士大夫撒旦法是打发上的" :size="280"  ></vue-qr></div>
        </div>
      </van-overlay>
    </div>
  </div>
</template>

<script>
import vueQr from "vue-qr";
export default {
  name: "personCenter",
  props: {},
  components: {
    vueQr,
  },
  data() {
    return {
      // phone: ,
      qrShow: false,
      userinfo: {},
    };
  },
  created() {
    this.userinfo = this.$store.getters.get_userinfo();
    // console.log('this.userinfo',this.userinfo)
  },
  activated(){
  },
  mounted() {},

  methods: {},
};
</script>

<style lang="less" scoped>
.box {
  background-color: #f3f3f3;
  min-height: 100vh;
  padding-top: 20px;
}
.cell-group-box {
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
    font-size: 14px;
    font-family: PingFang SC;
    font-weight: 500;
    color: #666666;
  }
}
.wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
}
</style>