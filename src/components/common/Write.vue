<template>
  <div>
    <div
      class="write-box"
      :style="{ backgroundImage: `url(${item.bank.bankColor})`, backgroundSize: '100% 100%' }"
      @click="handleBox"
    >
      <div class="top-box">
        <van-image
          :src="item.bank.bankIcon"
          :height="30"
          :width="30"
        ></van-image>
        <div class="name">{{ item.bank.bankName }} - {{item.type == 0 ? '信用卡' : '储蓄卡'}} ({{ item.cardNumber }})</div>
      </div>
      <div class="bottom-box">
        <div class="pay">消费:￥{{ item.expenditureAmount }}</div>
        <div class="repay">还款:￥{{ item.revenueAmount }}</div>
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
    index: {
      type: Number,
      default: 0,
    }
  },
  data() {
    return {
      bgimg: require("@/assets/img/账户列表背景图.png"),
    };
  },
  created() {
    // console.log(this.item)
  },
  mounted() {},

  methods: {
    handleBox() {
      console.log(this.item,this.index)
      this.$store.commit('set_billSelectCard',{cardInfo:this.item,index:this.index})
      this.$router.push({
        path: "/cardEdit",
        query: {
          cid: this.item.cid,
          bid: this.item.bid,
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