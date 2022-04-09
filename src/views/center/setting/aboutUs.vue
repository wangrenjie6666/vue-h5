<template>
  <div class="box">
    <div class="top-box">
      <van-image height="75" width="75" :src="logoImg" />
      <div class="name">期望管家</div>
      <div class="version">Version 5.0.0</div>
    </div>
    <div class="cell-group-box">
      <van-cell-group>
        <!-- <van-cell title="功能介绍" is-link /> -->
        <van-cell title="客服热线" :value="phone" @click="handlePhone" />
      </van-cell-group>
    </div>
  </div>
</template>

<script>
export default {
  name: "message",
  props: {},
  data() {
    return {
      logoImg: require("@/assets/img/期望管家.png"),
      phone: '400-1577-888',
    };
  },
  created() {},
  mounted() {},

  methods: {
      handlePhone(){
          window.location.href = 'tel://' + this.phone
      },
  },
};
</script>

<style lang="less" scoped>
.top-box {
  text-align: center;
  padding-top: 25%;
  .name {
      letter-spacing: 1px;
      margin-top: 35px;
    font-size: 34px;
    font-family: PingFang SC;
    font-weight: bold;
    color: #212121;
  }
  .version {
      letter-spacing: 1px;
      margin-top: 10px;
    font-size: 28px;
    font-family: PingFang SC;
    font-weight: 500;
    color: #212121;
  }
}
.cell-group-box {
  background-color: white;
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