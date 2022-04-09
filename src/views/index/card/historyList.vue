<template>
  <div class="box">
    <div class="title-box">
      <img :src="cardInfo.bankIcon" class="card-bank-icon" />
      <span class="card-bank-name"
        >{{ cardInfo.bankName }}({{
          cardInfo.cardNumber.slice(
            cardInfo.cardNumber.length - 4,
            cardInfo.cardNumber.length
          )
        }})</span
      >
    </div>
    <div
      class="
        my-scroll-div
        my-scroll
      "
    >
      <div v-if="cardInfo.content && cardInfo.content.length > 0">
        <div v-for="item,index in cardInfo.content" :key="index" class="scroll-view-list">
          <div class="scroll-view-item">
            <div class="date">{{ item.changeTime }}</div>
            <div class="money">￥{{ item.balance }}</div>
          </div>
        </div>
      </div>
      <div v-else class="else-noMore-box" style="height: 500px">
        <van-image :src="noMoreImg" :width="150" :height="150" />
        <div class="noMore-text">暂无内容</div>
      </div>
    </div>
  </div>
</template>

<script>
import { getQuotaHistory, } from "@/api/index";
export default {
  name: "historyList",
  data() {
    return {
      noMoreImg: require("@/assets/img/暂无内容.png"),
      list: 20,
      isFinished: false,
      cardInfo: {
        cardNumber:"",
        content: []
      },
    };
  },
  created() {
    this.query = this.$route.query;
    console.log("历史提额页面里的路由参数", this.query);
    this.getQuotaHistory()
  },
  mounted() {},

  methods: {
    getQuotaHistory(){
      getQuotaHistory({cid: this.query.cid}).then((res) => {
        console.log(res)
        this.cardInfo = res.data
      })
    },
  },
};
</script>

<style lang="scss" scoped>
.box {
  background-color: rgb(243, 243, 243);
  min-height: 100vh;
  width: 100%;
  padding-bottom: 10px;
}
.title-box {
  background-color: #2e2f2f;
  height: 150px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  padding: 0 30px 0 30px;
  .card-bank-icon {
    width: 60px;
    height: 60px;
    margin-right: 20px;
    border-radius: 50%;
  }
  .card-bank-name {
    font-size: 26px;
    font-family: PingFang SC;
    font-weight: 500;
    color: #ffffff;
  }
}
.my-scroll{
  // height: 90vh;
  background: #FFF;
  .scroll-view-item{
    padding: 30px 0;
    font-family: DINAlternate-Bold;
    border-bottom: .5px solid #efefef;
    display: flex;
    justify-content: space-between;
    .date{
      font-size: 28px;
      font-family: PingFang SC;
      font-weight: 500;
      color: #666666;
    }
    .money{
      font-size: 32px;
      font-family: PingFang SC;
      font-weight: bold;
      color: #212121;
    }
  }
}
.my-scroll-div{
  padding: 0px 40px;
}
</style>