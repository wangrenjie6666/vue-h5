<template>
  <div>
    <div
      class="write-box"
      @click="handleBox"
      :style="{
        backgroundImage:`url(${
          item.type == 1
            ? tempInfo[0].bankBg
            : item.type == 2
            ? item.bank.bankColor
            : item.type == 3
            ? tempInfo[2].bankBg
            : item.type == 4
            ? tempInfo[1].bankBg
            : ''})`,
        backgroundSize: '100% 100%',
      }"
    >
      <div class="top-box">
        <van-image
          :src="
            item.type == 1
              ? tempInfo[0].icon
              : item.type == 2
              ? item.bank.bankIcon
              : item.type == 3
              ? tempInfo[2].icon
              : item.type == 4
              ? tempInfo[1].icon
              : ''
          "
          :height="30"
          :width="30"
        ></van-image>
        <div class="name" v-if="item.type == 2">
          {{ item.bank.bankName }} - {{item.type == 0 ? '信用卡' : '储蓄卡'}} ({{ item.cardNumber }})
        </div>
        <div class="name" v-else>
          {{ item.cardNumber }}
        </div>
      </div>
      <div class="bottom-box">
        <div class="pay">支出:￥{{ item.expenditureAmount }}</div>
        <div class="repay">收入:￥{{ item.revenueAmount }}</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Write",
  props: {
    item: {
      type: Object,
      default: {},
    },
  },
  data() {
    return {
      tempInfo: [
        {
          name: "现金账户",
          type: 1,
          bankBg: require("@/assets/img/账户现金背景图.png"),
          icon: require("@/assets/img/现金.png"),
        },
        {
          name: "微信",
          type: 4,
          bankBg: require("@/assets/img/账户微信背景图.png"),
          icon: require("@/assets/img/微信.png"),
        },
        {
          name: "支付宝",
          type: 3,
          bankBg: require("@/assets/img/账户支付宝背景图.png"),
          icon: require("@/assets/img/支付宝.png"),
        },
      ],
      bgimg: require("@/assets/img/账户列表背景图.png"),
    };
  },
  created() {
    // console.log(this.item)
  },
  mounted() {},

  methods: {
    handleBox() {
      this.$router.push({
        path: "/lifeEdit",
        query: {
          cid: this.item.cid,
        },
      });
    },
  },
};
</script>

<style lang="less" scoped>
.write-box {
  margin: 0 auto;
  width: 721px;
  height: 243px;
  // background: #ffffff;
  // box-shadow: 0px 2px 10px 0px rgba(33, 33, 33, 0.1);
  // border-radius: 20px;
  .top-box {
    display: flex;
    align-items: center;
    padding: 30px;
    height: 50%;
    border-radius: 20px 20px 0px 0px;
    .icon {
    }
    .name {
      margin-left: 20px;
      font-size: 30px;
      font-family: PingFang SC;
      font-weight: 500;
      color: #ffffff;
    }
  }
  .bottom-box {
    height: 45%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0px 50px;
    border-radius: 0px 0px 20px 20px;
    font-size: 28px;
    font-family: PingFang SC;
    font-weight: 500;
    color: #212121;
    .pay {
      width: 50%;
    }
    .repay {
      width: 50%;
      padding-left: 30px;
    }
  }
}
</style>