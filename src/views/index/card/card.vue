<template>
  <div class="box">
    <van-image
      :src="topBackgroundImg"
      width="100%"
      height="20%"
      style="margin-top: -40px"
      @click="test"
    />
    <!-- <div class="title">信用卡账本</div> -->
    <div class="card-count">
      <span class="card-count-num">{{ cardsNumber }}</span>
      <span class="card-count-zhang">张</span>
    </div>
    <div class="card-box">
      <div class="card card1">
        <div>
          <div class="card1-box card1-left">
            <div class="num">{{ totalQuota }}</div>
            <div class="font">信用金额(元)</div>
          </div>
        </div>
        <div>
          <div class="card1-box card1-right">
            <div class="num">{{ totalAvailableQuota }}</div>
            <div class="font">可用金额(元)</div>
          </div>
        </div>
      </div>
      <div class="card card2">
        <div @click="handleRise" class="card2-box" style="text-align: center">
          <van-image :src="outImg" :width="30" :height="30" />
          <div class="font">提额</div>
        </div>
        <div @click="handleDiagnosis" class="card2-box" style="text-align: center">
          <van-image :src="diagnose" :width="30" :height="30" />
          <div class="font">诊断</div>
        </div>
        <router-link to="/account" class="card2-box" style="text-align: center">
          <van-image :src="goAccountImg" :width="30" :height="30" />
          <div class="font">账户</div>
        </router-link>
        <a
          href="https://mallh5.lkkjjt.com/home"
          class="card2-box"
          target="_blank"
          style="text-align: center"
        >
          <van-image :src="goChengLiaoGouImg" :width="30" :height="30" />
          <div class="font">诚聊购</div>
        </a>
        <a
          href="https://sinwap.lkkjjt.com/index"
          class="card2-box"
          target="_blank"
          style="text-align: center"
        >
          <van-image :src="goMingPianWangImg" :width="30" :height="30" />
          <div class="font">名片网</div>
        </a>
      </div>
      <div class="card card3">
        <div class="card3-title">我的信用卡</div>
        <div class="card3-box" v-if="cardList && cardList.length > 0">
          <div
            class="card3-for"
            v-for="(item, index) in cardList"
            :key="index"
            :style="{
              backgroundImage: 'url(' + item.tBank.iconBg + ')',
              backgroundSize: '100% 100%',
            }"
            @click="handleCard(item, index)"
          >
            <div class="card3-top">
              <van-image :src="item.tBank.bankIcon" :width="24" :height="24" />
              <div class="name">
                {{ item.tBank.bankName }}({{ item.cardNumber }})
              </div>
              <div class="card3-top-right">
                <div class="type" v-if="item.payStatus == 2">未还款</div>
                <div class="type" v-if="item.payStatus == 1">本期已还清</div>
                <div class="type" v-if="item.payStatus == 3">疑似逾期</div>
                <van-image
                  v-if="item.payStatus != 1"
                  :src="tagImg"
                  :width="22"
                  :height="22"
                  @click.stop="handleReturn(item.repaymentId)"
                />
              </div>
            </div>
            <div class="card-center">
              <span
                >{{ item.statementDate }}
                <!-- v-if="item.payStatus != 2" -->
                <span v-if="item.content || item.content != ''"
                  >({{ item.content }})</span
                >
              </span>
              <span v-if="item.payStatus == 3">
                <a-tooltip
                  trigger="click"
                  placement="topRight"
                  overlayClassName="bgc_tooltip"
                >
                  <template slot="title">
                    逾期将导致信用分数和提额概率的降低。
                  </template>
                  <van-image
                    @click.stop=""
                    class="yuqi-icon"
                    :src="wenhao"
                    :width="22"
                    :height="22"
                  />
                </a-tooltip>
                <!-- <van-popover
                  v-model="showPopover"
                  theme="dark"
                  trigger="click"
                  placement="top"
                  :offset="[13, 22]"
                >
                  <template class="popover-tips">
                    逾期将导致信用分数和提额概率的降低。
                  </template>
                  <template #reference>
                    <van-image
                      class="yuqi-icon"
                      :src="wenhao"
                      :width="22"
                      :height="22"
                    />
                  </template>
                </van-popover> -->
              </span>
            </div>
            <div class="card-bottom">
              <span v-if="item.billStatus == 1">未出账单</span
              ><span v-else>本期账单</span> ：¥ {{ item.billAmount }}
            </div>
          </div>
        </div>
        <div v-else class="else-noMore-box" style="height: 300px">
          <van-image :src="noMoreImg" :width="150" :height="150" />
          <div class="noMore-text">暂无内容</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { manageCardHome, alreadyRepaid } from "@/api/index";
export default {
  name: "index_card",
  props:{
    cardInfo: {
      type: Object,
      default: ()=>{
        {}
      }
    },
  },
  data() {
    return {
      goAccountImg: require("@/assets/img/跳转账户.png"),
      goChengLiaoGouImg: require("@/assets/img/跳转诚聊购.png"),
      goMingPianWangImg: require("@/assets/img/跳转名片网.png"),
      noMoreImg: require("@/assets/img/暂无内容.png"),
      topBackgroundImg: require("@/assets/img/首页信用卡背景.png"),
      outImg: require("@/assets/icon/矢量智能对象.png"),
      diagnose: require("@/assets/icon/诊断_svg.png"),
      wenhao: require("@/assets/icon/问号(1).png"),
      tagImg: require("@/assets/icon/标签.png"),
      totalQuota: null,
      totalAvailableQuota: null,
      cardsNumber: null,
      cardList: [],
      showPopover: false,
    };
  },
  created() {
    // this.manageCardHome();
    // this.cardInfo = {type:'test'}
  },
  mounted() {},

  methods: {
    // 获取页面信息
    manageCardHome() {
      console.log('this.manageCard',this.cardInfo)
      manageCardHome({ size: 200 }).then((res) => {
        console.log(res);
        this.totalQuota = res.data.totalQuota;
        this.totalAvailableQuota = res.data.totalAvailableQuota;
        this.cardsNumber = res.data.cardsNumber;
        this.cardList = res.data.homeCreditResponseList;
      });
    },
    //   提额
    handleRise() {
      if (!this.cardList || this.cardList.length < 1) {
        return this.$vtoast("暂无信用卡, 无法进行诊断");
      }
      this.$router.push({ path: "/rise" });
    },
    //   诊断
    handleDiagnosis() {
      if (!this.cardList || this.cardList.length < 1) {
        return this.$vtoast("暂无信用卡, 无法进行诊断");
      }
      this.$router.push({ path: "/diagnosis" });
    },
    // 设为已还清
    handleReturn(repaymentId) {
      this.$vDialog
        .confirm({
          title: "提示",
          message: "如果您已在其他平台还款，可直接将账单设为已还清",
          confirmButtonText: "设为已还清",
          cancelButtonText: "取消",
        })
        .then(() => {
          // on confirm
          alreadyRepaid({ bid: repaymentId }).then((res) => {
            console.log(res);
              this.manageCardHome();
              setTimeout(()=>{
                this.$vtoast("设置成功");
              },500)
          });
        })
        .catch(() => {
          // on cancel
        });
    },
    handleCard(item, index) {
      this.$store.commit("set_billSelectCard", {
        cardInfo: item,
        index: index,
      });
      this.$store.commit("set_tabbarActive", "/bill");
      this.$router.push({
        path: "/bill",
      });
    },
    test(){
      console.log(this.cardInfo)
    },
    // 点击问好
    // handleWenhao() {
    //   this.$vDialog
    //     .confirm({
    //       title: "提示",
    //       message: "如果您已在其他平台还款，可直接将账单设为已还清",
    //       confirmButtonText: "设为已还清",
    //       cancelButtonText: "取消",
    //     })
    //     .then(() => {
    //       // on confirm
    //       alreadyRepaid({ bid: repaymentId }).then((res) => {
    //         console.log(res);
    //         this.$vtoast("设置成功");
    //         this.manageCardHome();
    //       });
    //     })
    //     .catch(() => {
    //       // on cancel
    //     });
    // },
  },
  watch:{
    cardInfo(){
      console.log('this.cardInfo',this.cardInfo)
        this.totalQuota = this.cardInfo.totalQuota;
        this.totalAvailableQuota = this.cardInfo.totalAvailableQuota;
        this.cardsNumber = this.cardInfo.cardsNumber;
        this.cardList = this.cardInfo.homeCreditResponseList;
    },
  }
};
</script>

<style lang="less" scoped>
.title {
  position: absolute;
  left: 40%;
  top: 26px;
  font-size: 34px;
  font-family: PingFang SC;
  font-weight: bold;
  color: #ffffff;
  letter-spacing: 1px;
}

.card-count {
  position: relative;
  // left: 100px;
  margin-left: 80%;
  top: -255px;
  // display: flex;
  // align-items: center;
  // justify-content: space-between;
  // width: 220px;
  // z-index: 2;
  .card-count-num {
    font-size: 52px;
    font-family: PingFang SC;
    font-weight: bold;
    color: #fbfbfb;
  }
  .card-count-zhang {
    margin-left: 5px;
    font-size: 30px;
    font-family: PingFang SC;
    // font-weight: bold;
    color: #b7c9fb;
  }
}
.card-box {
  display: flex;
  justify-content: center;
  flex-direction: column;
  position: relative;
  width: 100%;
  margin-top: -262px;
  .card {
    width: 690px;
    background: #ffffff;
    border-radius: 20px;
    margin: 0 auto;
    margin-top: 18px;
  }
  .card1 {
    display: flex;
    justify-content: space-around;
    align-items: center;
    height: 190px;
    padding: 0px 50px;
    .card1-box {
      display: flex;
      flex-direction: column;
      justify-content: center;
    }
    .num {
      text-align: center;
      font-size: 36px;
      font-family: PingFang SC;
      font-weight: bold;
      color: #212121;
    }
    .font {
      text-align: center;
      margin-top: 20px;
      font-size: 24px;
      font-family: PingFang SC;
      font-weight: 500;
      color: #666666;
    }
  }
  .card2 {
    display: flex;
    // justify-content: space-around;
    // align-items: center;
    flex-wrap: wrap;
    // height: 180px;
    // padding: 0px 70px;
    .card2-box {
      width: 25%;
      height: 150px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      // margin-left: 7?0px;
      .font {
        text-align: center;
        font-size: 26px;
        font-family: PingFang SC;
        font-weight: 500;
        color: #212121;
      }
    }
  }
  .card3 {
    padding: 18px 30px;
    .card3-title {
      font-size: 30px;
      font-family: PingFang SC;
      font-weight: bold;
      color: #212121;
    }
    .card3-for {
      margin-top: 28px;
      border-radius: 20px;
      width: 100%;
      height: 241px;
      padding: 28px 10px 28px 37px;
      background-image: url("../../../assets/img/组 93 拷贝.png");
      background-repeat: repeat;
      -webkit-background-size: cover;
      background-position: 100%;
      .card3-top {
        display: flex;
        // justify-content: space-between;
        align-items: center;
        line-height: 44px;
        .name {
          margin-left: 10px;
          font-size: 26px;
          font-family: PingFang SC;
          font-weight: 500;
          color: #ffffff;
        }
        .card3-top-right {
          display: flex;
          position: absolute;
          right: 80px;
          .type {
            margin-left: 190px;
            margin-right: 10px;
            font-size: 26px;
            font-family: PingFang SC;
            font-weight: 500;
            color: #ffffff;
          }
        }
      }
      .card-center {
        margin-top: 25px;
        font-size: 30px;
        font-family: PingFang SC;
        font-weight: bold;
        color: #ffffff;
        display: flex;
        .yuqi-icon {
          margin-top: 3px;
          margin-left: 6px;
          position: absolute;
        }
      }
      .card-bottom {
        margin-top: 25px;
        font-size: 24px;
        font-family: PingFang SC;
        font-weight: 500;
        color: #ffffff;
        opacity: 0.5;
      }
    }
  }
}
</style>