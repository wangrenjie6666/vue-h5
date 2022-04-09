<template>
  <div class="box">
    <div class="content">
      <van-image class="bg-img" height="100%" width="100%" :src="bgImg" />
      <div class="head-img-box">
        <!-- <van-image
          class="head-img"
          round
          height="100"
          width="100"
          :src="userinfo.headPic ? userinfo.headPic : defaultAv"
        /> -->
        <a-avatar
          class="head-img"
          :size="100"
          :src="userinfo.headPic ? userinfo.headPic : defaultAv"
        />
      </div>
      <div class="cell-group-box">
        <van-cell-group>
          <van-cell title="昵称" :value="userinfo.nickName" />
          <van-cell
            title="出生日期"
            :value="userinfo.birthday ? userinfo.birthday : '暂无数据'"
          />
          <!-- <van-cell title="创建时间" :value="userinfo.createTime ? userinfo.createTime : '暂无数据'" /> -->
          <van-cell title="地址" :value="userinfo.address" />
          <van-cell
            title="签名"
            :value="userinfo.sign ? userinfo.sign : '暂无数据'"
          />
        </van-cell-group>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "personInfo",
  props: {},
  data() {
    return {
      defaultAv: require("@/assets/img/默认头像.png"),
      bgImg: require("@/assets/img/my-bg.jpg"),
      headImg: require("@/assets/img/head.jpg"),
      name: "社死",
      age: "10",
      createTime: "2020-2-20",
      address: "地址地址地址地址地址地址地址地址地址地址地址地址",
      autograph: "签名签名签名签名签名签名签名签名签名签名签名签名签名签名签名",
    };
  },
  created() {
    this.userinfo = this.$store.getters.get_userinfo();
  },
  activated() {},
  mounted() {},

  methods: {},
};
</script>

<style lang="less" scoped>
.box {
  background-color: #f3f3f3;
  min-height: 100vh;
}
.content {
  .head-img-box {
    display: flex;
    justify-content: center;
    .head-img {
      position: absolute;
      margin-top: -100px;
      z-index: 2000;
    }
  }
  .info-box {
    // margin-top: -10px;
  }
}

.cell-group-box {
  background-color: white;
  padding-top: 170px;
  margin-top: -10px;
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
</style>