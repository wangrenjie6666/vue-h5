<template>
  <div class="box">
    <van-image :src="topBackgroundImg" width="100%" height="20%" style="margin-top: -40px" />
    <!-- <div class="title">生活账本</div> -->
    <div class="card-count">
      <!-- @click="datePicker.show = true" -->
      <!-- <div class="date" v-if="data.dailyBillListVo.length > 0">
        {{ data.dailyBillListVo[0].dateTime | formatDate }}
      </div>
      <div class="date" v-else>
        <div class="date">{{ yyyymm.yyyy }}-{{ yyyymm.mm }}</div>
      </div> -->
      <div class="date">{{ yyyymm.yyyy }}-{{ yyyymm.mm }}-{{ yyyymm.dd }}</div>
      <!-- <van-image class="downImg" :src="downImg"></van-image> -->
    </div>
    <div class="card-box">
      <div class="card card1">
        <div>
          <div class="card1-box card1-right">
            <div class="num">{{ data.expend }}</div>
            <div class="font">支出(元)</div>
          </div>
        </div>
        <div>
          <div class="card1-box card1-left">
            <div class="num">{{ data.income }}</div>
            <div class="font">收入(元)</div>
          </div>
        </div>
      </div>
      <div class="card card2">
        <div @click="handleChart" class="card2-box" style="text-align:center">
          <van-image :src="outImg" :width="30" :height="30" />
          <div class="font">图表</div>
        </div>
        <router-link to='/account' class="card2-box" style="text-align:center">
          <van-image :src="goAccountImg" :width="30" :height="30" />
          <div class="font">账户</div>
        </router-link>
        <a  href="https://mallh5.lkkjjt.com/home" target="_blank" class="card2-box" style="text-align:center">
          <van-image :src="goChengLiaoGouImg" :width="30" :height="30" />
          <div class="font">诚聊购</div>
        </a>
        <a  href="https://sinwap.lkkjjt.com/index" target="_blank" class="card2-box" style="text-align:center">
          <van-image :src="goMingPianWangImg" :width="30" :height="30" />
          <div class="font">名片网</div>
        </a>
      </div>
      <div v-if="data.dailyBillListVo.length > 0">
        <div
          class="info-box"
          v-for="(item, index) in data.dailyBillListVo"
          :key="index"
        >
          <div class="info-title">
            <div class="info-title-left">
              {{ item.dateTime }} {{ item.week }}
            </div>
            <div class="info-title-right">
              <div class="info-title-right-box gray" >
                <van-image :src="zhiImg" :width="17" :height="17" />
                <div style="margin-left: 3px">{{ item.expend }}</div>
              </div>
              <div class="info-title-right-box" style="margin-left: 15px">
                <van-image :src="shouImg" :width="17" :height="17" />
                <div style="margin-left: 3px">{{ item.income }}</div>
              </div>
            </div>
          </div>
          <div v-for="(item, index) in item.dailyBillList" :key="index">
            <div class="cut" v-if="index >= 1"></div>
            <div class="info-content-box" @click="handleDetails(item)">
              <div class="info-content-box-left">
                <van-image
                  :src="item.dailyType.colorIcon"
                  :width="24"
                  :height="24"
                />
                <div class="info-content-box-text">
                  <div class="name">
                    {{ item.dailyType.name }}
                    <span class="remark">{{ item.remark }} </span>
                  </div>
                  <div class="remark">{{ item.account }}</div>
                </div>
              </div>
              <div
                class="info-content-box-right"
                :class="{ shouru: item.createType == 0 }"
              >
                {{ item.money }}
              </div>
            </div>
          </div>
        </div>
        <div class="goMore" @click="handleMore">
          <div>查看更多</div>
          <van-image :src="rightImg" :width="10" :height="10" />
        </div>
        <div class="tips">此页面展示近日的10条记账数据</div>
      </div>
      <div v-else class="else-noMore-box" style="height: 300px">
        <van-image :src="noMoreImg" :width="150" :height="150" />
        <div class="noMore-text">暂无内容</div>
      </div>
    </div>

    <!-- 月份选择器 -->
    <md-date-picker
      ref="datePicker_start"
      v-model="datePicker.show"
      :title="datePicker.title"
      type="custom"
      :custom-types="['yyyy', 'MM']"
      small-radius
      :default-date.sync="datePicker.yyyymm"
      @confirm="dataPickerConfirm"
    ></md-date-picker>
  </div>
</template>

<script>
import { dailyBillIndex } from "@/api/index.js";
export default {
  name: "index_card",
  data() {
    return {
      goAccountImg: require("@/assets/img/跳转账户.png"),
      goChengLiaoGouImg: require("@/assets/img/跳转诚聊购.png"),
      goMingPianWangImg: require("@/assets/img/跳转名片网.png"),
      noMoreImg: require("@/assets/img/暂无内容.png"),
      topBackgroundImg: require("@/assets/icon/lifeBg.png"),
      downImg: require("@/assets/icon/向下.png"),
      outImg: require("@/assets/icon/图表.png"),
      shouImg: require("@/assets/icon/收.png"),
      zhiImg: require("@/assets/icon/支.png"),
      yinshiImg: require("@/assets/icon/餐饮.png"),
      rightImg: require("@/assets/icon/向右箭头.png"),
      yyyymm: {},
      datePicker: {
        //时间弹窗信息
        show: false,
        title: "请选择查询年月",
      },
      data: {
        dailyBillListVo: [],
      },
    };
  },

  created() {
    this.initDefaultDate();
    this.dailyBillIndex();
  },
  mounted() {},

  methods: {
    // 获取生活账本数据
    dailyBillIndex() {
      dailyBillIndex().then((res) => {
        console.log("获取生活账本数据", res);
        this.data = res.data;
      });
    },

    //初始化查询时间
    initDefaultDate() {
      const nowDate = new Date();
      const nowYear = nowDate.getFullYear();
      const currMonth = nowDate.getMonth() + 1;
      const nowMonth = currMonth < 10 ? "0" + currMonth : currMonth;
      const nowDay =
        nowDate.getDate() < 10 ? "0" + nowDate.getDate() : nowDate.getDate();
      this.yyyymm = {
        yyyy: nowYear,
        mm: nowMonth,
        dd: nowDay,
      };
      this.datePicker.yyyymm = new Date(nowYear + "-" + nowMonth);
    },
    // 确定查询年月
    dataPickerConfirm(item) {
      console.log(item);
      this.yyyymm.yyyy = item[0].value;
      this.yyyymm.mm = item[1].value;
    },
    // 点击图表跳转
    handleChart() {
      this.$router.push({ path: "/bookChart" });
    },
    // 点击详细
    handleDetails(item) {
      this.$router.push({
        path: "/billLifeDetails",
        query: {
          id: item.id,
          cid: item.cid,
        },
      });
    },
    // 查看更多
    handleMore() {
      this.$router.replace("/bill");
      this.$store.commit("set_tabbarActive", "/bill");
    },
  },
  filters: {
    formatDate(i) {
      var today = new Date();
      var now = today.valueOf();
      var time = new Date(i).valueOf();
      if (now > time) {
        // console.log("今天比较大");
        return i;
      } else {
        // console.log("给的日期比较大");
        return (
          today.getFullYear() +
          "-" +
          (today.getMonth() + 1) +
          "-" +
          today.getDate()
        );
      }
    },
  },
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
  margin-left: 68%;
  top: -235px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  // width: 220px;
  // z-index: 2;
  .date {
    font-size: 32px;
    font-family: PingFang SC;
    font-weight: bold;
    color: #b7c9fb;
  }
  .downImg {
    width: 25px;
    height: 25px;
  }
}
.card-box {
  display: flex;
  justify-content: center;
  flex-direction: column;
  position: relative;
  margin-top: -232px;
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
    .card3-for {
    }
  }
}
.info-box {
  width: 690px;
  background: #ffffff;
  border-radius: 20px;
  margin: 0 auto;
  margin-top: 18px;
  padding: 30px 40px;
  .info-title {
    display: flex;
    justify-content: space-between;
    .info-title-left {
      font-size: 26px;
      font-family: PingFang SC;
      font-weight: 500;
      color: #666666;
    }
    .info-title-right {
      display: flex;
      justify-content: space-between;
      // width: 240px;
      .info-title-right-box {
        // width: 197px;
        display: flex;
        // justify-content: space-between;
        align-items: center;
        font-size: 28px;
        font-family: PingFang SC;
        font-weight: 500;
        color: #4475fe;
      }
      .gray {
        color: #666666;
      }
    }
  }
  .info-content-box {
    margin-top: 25px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .info-content-box-left {
      display: flex;
      justify-content: flex-start;
      align-items: center;
      .info-content-box-text {
        margin-left: 20px;
        .name {
          // font-size: 28px;
          // font-family: PingFang SC;
          // font-weight: 500;
          // color: #666666;
          font-size: 30px;
          font-family: PingFang SC;
          font-weight: 500;
          color: #212121;
          margin-top: 5px;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 1; /*想省略几行就写几*/
          -webkit-box-orient: vertical;
        }
        .remark {
          font-size: 22px;
          font-family: PingFang SC;
          font-weight: 500;
          color: #999999;
        }
      }
    }
    .info-content-box-right {
      font-size: 30px;
      font-family: PingFang SC;
      font-weight: 500;
      color: #212121;
      margin-top: 5px;
    }
  }
  .cut {
    height: 1px;
    background: #eeeeee;
    margin-top: 25px;
  }
}
.goMore {
  font-size: 26px;
  font-family: PingFang SC;
  font-weight: 500;
  color: #666666;
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 130px;
  margin: 0 auto;
  margin-top: 45px;
}
.tips {
  margin-top: 30px;
  font-size: 24px;
  font-family: PingFang SC;
  font-weight: 500;
  color: #999999;
  text-align: center;
}
.shouru {
  color: #4475fe !important;
}
</style>