<template>
  <div class="box">
    <template v-if="cardList && cardList.length > 0">
      <div class="banner-box">
        <md-swiper
          ref="swiper"
          :is-prevent="false"
          :autoplay="0"
          :useNative-driver="false"
          @after-change="afterChange"
        >
        <!-- backgroundImage: `url(${item.tBank.iconBg})`,
              backgroundSize: '110% 100%',
              backgroundPosition: 'center', -->
          <md-swiper-item
            class="my-swiper"
            v-for="(item, index) in cardList"
            :key="index"
            :style="{
              backgroundColor: item.tBank.bankBg
            }"
          >
            <van-image class="swiper-item-accountIcon" :width="65" :height="65" :src="item.tBank.accountIcon" />
            <div class="swiper-item-box">
              <div class="card-name-box">
                <van-image
                  :src="item.tBank.bankIcon"
                  :width="20"
                  :height="20"
                />
                <div class="name">
                  {{ item.tBank.bankName }}({{
                    item.cardNumber.slice(
                      item.cardNumber.length - 4,
                      item.cardNumber.length
                    )
                  }})
                </div>
                <div class="time">{{ item.updateTimeBefore }}</div>
              </div>
              <div class="repay-box">
                <div class="repay">
                  {{
                    item.payStatus == 2
                      ? "未还款"
                      : item.payStatus == 1
                      ? "本期已还清"
                      : "疑似逾期"
                  }}
                </div>
                <div>{{ item.content }} ({{ item.statementDate }})</div>
              </div>
              <div class="quota-box">
                <div class="quota-credit">信用额度:{{ item.quota }}</div>
                <div class="vertical"></div>
                <div class="quota-use">可用额度:{{ item.availableQuota }}</div>
                <div class="free">免息期{{ item.freeMoneyDay }}天</div>
              </div>
              <!-- <van-image
              class="bank-icon"
              :src=""
              :width="80"
              :height="80"
            /> -->
            </div>
          </md-swiper-item>
        </md-swiper>
      </div>
      <div class="white-box white-box1">
        <div class="left">已出账单：{{ selectCard.outBillMoney }}</div>
        <div class="right">
          <!-- {{ selectCard.billDateAfter }}天后出账(每月{{ selectCard.billDate }}日） -->
          {{ selectCard.content }} ({{ selectCard.statementDate }})
        </div>
      </div>
      <div class="white-box2">
        <van-collapse class="my-collapse" v-model="activeNames" :border="false">
          <van-collapse-item
            v-for="(item1, index1) in billList"
            :key="index1"
            :name="index1"
          >
            <template #title>
              <div class="title-box">
                <div class="top-box">
                  <div class="left">
                    {{
                      item1.billType == 0 ? "未出账单" : item1.month + "月账单"
                    }}
                  </div>
                  <div class="right">￥{{ item1.totalMoney }}</div>
                </div>
                <div class="bottom-box">
                  <div class="left">
                    {{ item1.billDateStr }}至{{ item1.repaymentDate }}
                  </div>
                  <div class="right">{{ item1.totalTimes }}笔</div>
                </div>
              </div>
            </template>
            <div>
              <div class="content-info-box">
                <div class="top-box">
                  <div class="left">
                    <span class="font">消费金额</span>
                    <span class="num"
                      >{{ item1.totalMoney }}（{{
                        item1.consumeTimes
                      }}笔）</span
                    >
                  </div>
                  <div class="right">
                    <span class="font">最低应还</span>
                    <span class="num">{{ item1.minRepay }}</span>
                  </div>
                </div>
                <div class="bottom-box">
                  <div class="left">
                    <span class="font">剩余应还</span>
                    <span class="num">{{ item1.unpaidMoney }}</span>
                  </div>
                  <div class="right">
                    <span class="font">剩余最低应还</span>
                    <span class="num">{{ item1.residueMinRepay }}</span>
                  </div>
                </div>
              </div>
              <div
                class="content-date-box"
                ref="container"
                v-for="(item, index2) in item1.cardBillListVoList"
                :key="index2"
              >
                <div v-if="index2 >= 1" class="line"></div>
                <van-sticky class="my-sticky" container="container">
                  <div class="date">{{ item.tradeDate.slice(5, 11) }}</div>
                </van-sticky>
                <div
                  class="record-box"
                  v-for="(item, index) in item.consumeDetailList"
                  :key="index"
                  @click="handleBillDetails(item, index1, item1)"
                >
                  <div class="line"></div>
                  <div class="record-info">
                    <div class="top-box">
                      <div class="left">{{ item.detailFrom }}</div>
                      <div class="right">{{ item.money }}</div>
                    </div>
                    <div class="bottom-box" style="margin-bottom: 0px">
                      <div class="left">
                        {{ item.detailTitle ? item.detailTitle : "无备注" }}
                      </div>
                      <div class="right">
                        {{ item.ctype == 1 ? "消费" : "还款" }} 
                      </div>
                    </div>
                  </div>
                </div>
                <div
                  style="height: 15px"
                  v-if="index2 == item1.cardBillListVoList.length - 1"
                ></div>
              </div>
            </div>
          </van-collapse-item>
        </van-collapse>
      </div>
    </template>
    <div v-else class="else-noMore-box" style="height: 600px">
      <van-image :src="noMoreImg" :width="150" :height="150" />
      <div class="noMore-text">暂无内容</div>
    </div>
  </div>
</template>

<script>
import { getCardListByUid, manageCardList } from "@/api/bill.js";
import { manageCardHome } from "@/api/index";
export default {
  name: "bill_card",
  data() {
    return {
      noMoreImg: require("@/assets/img/暂无内容.png"),
      outImg: require("@/assets/icon/矢量智能对象.png"),
      jianImg: require("@/assets/icon/建设银行.png"),
      activeNames: [0],
      cardList: [],
      selectCard: {},
      billList: [],
      selectIndex: 0,
    };
  },
  created() {
    let billSelectCard = this.$store.getters.get_billSelectCard();
    console.log("billSelectCard", billSelectCard);
    if (billSelectCard) {
      this.selectCard = billSelectCard.cardInfo;
      this.selectIndex = billSelectCard.index;
      setTimeout(() => {
        this.$refs.swiper.goto(this.selectIndex);
      }, 10);
    }
  },
  mounted() {
    this.getCardListByUid();
    // 回到顶部
    this.$el.parentNode.scrollTop = 0;
  },

  activated() {
    // 回到顶部
    // this.$el.parentNode.scrollTop = 0;
    // let billSelectCard = this.$store.getters.get_billSelectCard();
    // console.log("beforeRouteEnter billSelectCard", billSelectCard, this.$route);
    // if (billSelectCard) {
    //   this.selectCard = billSelectCard.cardInfo;
    //   this.selectIndex = billSelectCard.index;
    //   manageCardHome({ size: 200 }).then((res) => {
    //     console.log("获取信用卡列表接口res", res);
    //     this.cardList = res.data.homeCreditResponseList;
    //     if (this.cardList.length > 0) {
    //       this.selectCard = billSelectCard.cardInfo;
    //       this.selectIndex = billSelectCard.index;
    //       setTimeout(() => {
    //         this.$refs.swiper.goto(this.selectIndex);
    //       }, 100);
    //     }
    //   });
    // }
  },

  methods: {
    // 获取信用卡列表
    getCardListByUid() {
      // getCardListByUid({ size: 200 }).then((res) => {
      //   console.log("获取信用卡列表接口res", res);
      //   // this.quota = res.data.quota;
      //   // this.availableQuota = res.data.availableQuota;
      //   this.cardList = res.data.creditCard.records;
      //   if (this.cardList.length > 0) {
      //     this.selectCard = this.cardList[this.selectIndex];
      //     setTimeout(() => {
      //       this.$refs.swiper.goto(this.selectIndex)
      //     }, 100);
      //   }
      // });
      manageCardHome({ size: 200 }).then((res) => {
        console.log("获取信用卡列表接口res", res);
        // this.quota = res.data.quota;
        // this.availableQuota = res.data.availableQuota;
        this.cardList = res.data.homeCreditResponseList;
        if (this.cardList.length > 0) {
          this.selectCard = this.cardList[this.selectIndex];
          setTimeout(() => {
            this.$refs.swiper.goto(this.selectIndex);
          }, 100);
        }
      });
    },
    // 获取账单列表
    manageCardList() {
      manageCardList({ cid: this.selectCard.cid }).then((res) => {
        console.log("获取账单列表接口res", res);
        this.activeNames = [0];
        this.billList = res.data;
      });
    },
    // 切换卡片
    afterChange(from, to) {
      this.selectCard = this.cardList[to];
      this.selectIndex = to;
    },
    // 点击账单详情
    handleBillDetails(item, index1, item1) {
      console.log(
        "item",
        item,
        "cid",
        this.selectCard.cid,
        "item1.billType",
        item1.billType
      );
      // if (item1.billType != 0) {
      //   return;
      // }
      // return
      this.$router.push({
        path: "/billCardDetails",
        query: {
          cid: this.selectCard.cid,
          did: item.did,
          billType: item1.billType,
        },
      });
      // this.$router.push({
      //   path: "/cardEdit",
      //   query: {
      //     cid: this.selectCard.cid,
      //     did: item.did,
      //     do: "edit",
      //   },
      // });
    },
  },
  watch: {
    selectCard() {
      console.log("this.selectCard", this.selectCard);
      this.$store.commit("set_billSelectCard", {
        cardInfo: this.selectCard,
        index: this.selectIndex,
      });
      this.manageCardList();
    },
  },
};
</script>

<style lang="less" scoped>
.banner-box {
  margin-top: -2px;
  /deep/ .md-swiper-indicators {
    bottom: 35px;
  }
  /deep/ .md-swiper-indicator {
    width: 30px;
    height: 8px;
    border-radius: 10px;
    margin-right: 15px;
    background-color: white;
    opacity: 0.4;
  }
  /deep/ .md-swiper-indicator-active {
    background-color: white;
    opacity: 1;
  }
  .swiper-item-box {
    height: 330px;
    padding: 50px 25px 55px 40px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    .card-name-box {
      display: flex;
      align-items: center;
      .name {
        margin-left: 15px;
        font-size: 26px;
        font-family: PingFang SC;
        font-weight: 500;
        color: #ffffff;
      }
      .time {
        position: absolute;
        right: 45px;
        font-size: 24px;
        font-family: PingFang SC;
        font-weight: 500;
        color: #ffffff;
      }
    }
    .repay-box {
      display: flex;
      font-size: 30px;
      font-family: PingFang SC;
      font-weight: bold;
      color: #ffffff;
      .repay {
        margin-right: 30px;
      }
    }
    .quota-box {
      display: flex;
      align-items: center;
      font-size: 24px;
      font-family: PingFang SC;
      font-weight: 500;
      color: #ffffff;
      opacity: 0.5;
      .quota-credit {
      }
      .vertical {
        width: 1px;
        height: 22px;
        background: #bfbfbf;
        margin: 0 20px;
      }
      .quota-use {
      }
      .free {
        position: absolute;
        right: 45px;
        font-size: 24px;
        font-family: PingFang SC;
        font-weight: 500;
        color: #ffffff;
      }
    }
    .bank-icon {
      position: absolute;
      right: 30px;
      margin-top: 65px;
    }
  }
}
.white-box {
  background-color: white;
}
.white-box1 {
  padding: 40px 35px;
  display: flex;
  justify-content: space-between;
  .left {
    font-size: 30px;
    font-family: PingFang SC;
    font-weight: 500;
    color: #212121;
  }
  .right {
    font-size: 30px;
    font-family: PingFang SC;
    font-weight: 500;
    color: #666666;
  }
}
.white-box2 {
  margin-top: 20px;
  .my-collapse {
    .title-box {
      padding: 27px 36px 0px 36px;
      margin-bottom: 27px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      height: 130px;
      .top-box {
        display: flex;
        justify-content: space-between;
        font-size: 30px;
        font-family: PingFang SC;
        font-weight: bold;
        color: #212121;
        .left {
        }
        .right {
        }
      }
      .bottom-box {
        display: flex;
        justify-content: space-between;
        .left {
          font-size: 24px;
          font-family: PingFang SC;
          font-weight: 500;
          color: #666666;
        }
        .right {
          font-size: 26px;
          font-family: PingFang SC;
          font-weight: 500;
          color: #212121;
          opacity: 0.9;
        }
      }
    }
    .content-info-box {
      background-color: #f3f3f3;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      padding: 28px 36px;
      height: 150px;
      .font {
        font-size: 26px;
        font-family: PingFang SC;
        font-weight: 500;
        color: #999999;
      }
      .num {
        margin-left: 20px;
        font-size: 26px;
        font-family: PingFang SC;
        font-weight: 500;
        color: #212121;
      }
      .top-box {
        display: flex;
        justify-content: space-between;
        align-items: center;
        .left {
        }
        .right {
        }
      }
      .bottom-box {
        display: flex;
        justify-content: space-between;
      }
    }
    .content-date-box {
      padding: 28px 30px 0px 30px;
      .line {
        // width: 697px;
        height: 1px;
        background: #eeeeee;
        margin: 13px 0px;
      }
      .date {
        font-size: 26px;
        font-family: PingFang SC;
        font-weight: 500;
        color: #999999;
        margin-bottom: 30px;
      }

      .record-box {
        .record-info {
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          height: 90px;
          .top-box {
            display: flex;
            justify-content: space-between;
            font-size: 28px;
            font-family: PingFang SC;
            font-weight: 500;
            color: #212121;
            .left {
            }
            .right {
            }
          }
          .bottom-box {
            display: flex;
            justify-content: space-between;
            font-size: 26px;
            font-family: PingFang SC;
            font-weight: 500;
            color: #666666;
            .left {
              width: 500px;
              white-space: nowrap;
              overflow: hidden;
              text-overflow: ellipsis;
            }
            .right {
            }
          }
        }
        .line {
          // width: 697px;
          height: 1px;
          background: #eeeeee;
          margin: 13px 0px;
        }
      }
    }
  }
}
.bg-color-blue {
  background-color: rgb(55, 140, 224);
}
// vant collapse 点击不变色
.my-collapse /deep/.van-cell--clickable:active {
  background-color: white;
}
// vant collapse 去除title和content中间的横线
.my-collapse /deep/ .van-cell::after {
  border-bottom: 0px;
}
// vant collapse 去除每个collapse-item之间的横线
.my-collapse /deep/ .van-collapse-item--border::after {
  border-top: 0px;
}
// vant collapse 每个collapse-item之间的间隔
.my-collapse /deep/ .van-collapse-item {
  margin-bottom: 10px;
}
// vant collapse 右上箭头位置设置
.my-collapse /deep/ .van-cell__right-icon {
  right: 15px;
  top: 15px;
}
// vant collapse content去除padding
.my-collapse /deep/ .van-collapse-item__content {
  padding: 0;
}
// vant sticky 吸顶位置
.my-sticky /deep/ .van-sticky--fixed {
  background-color: white;
  padding: 16.24px 0px 0px 15.15px;
}
.my-swiper {
  .swiper-item-accountIcon{
    position: absolute;
    right: 40px;
    bottom: 120px;
  }
  // background-repeat: repeat;
  // -webkit-background-size: cover;
  // background-position: 100%;
}
</style>