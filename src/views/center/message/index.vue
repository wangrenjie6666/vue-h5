<template>
  <div class="box">
    <div class="cell-group-box">
      <van-cell-group>
        <van-cell title="系统通知">
          <template #extra>
            <van-switch v-model="systemNotice" size="25px" active-color="#5FBD75" />
          </template>
        </van-cell>
        <van-cell title="服务通知">
          <template #extra>
            <van-switch v-model="serviceNotice" size="25px" active-color="#5FBD75" />
          </template>
        </van-cell>
        <van-cell title="记账提醒通知">
          <template #extra>
            <van-switch v-model="writeNotice" size="25px" active-color="#5FBD75" />
          </template>
        </van-cell>
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
      systemNotice: false,
      serviceNotice: false,
      writeNotice: false,
    };
  },
  created() {},
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