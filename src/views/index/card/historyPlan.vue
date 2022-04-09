<template>
  <div class="box">
    <div class="top-backgroud">
      <div class="card-til">
        <div class="card-til-left">
          <img :src="cardInfo.bankIcon" class="card-bank-icon" />
          <span class="card-bank-name"
            >{{ cardInfo.bankName }}({{ cardInfo.cardNumber }})</span
          >
        </div>
        <div
          v-if="screenType == 'no'"
          class="card-til-right card-til-right-style1"
          @click="popupShow = true"
        >
          <span>筛选</span>
          <van-image
            style="margin-left: 2px"
            :src="screenImg"
            :width="12"
            :height="15"
          />
        </div>
        <div
          v-if="screenType == 'yes'"
          class="card-til-right card-til-right-style2"
          @click="popupShow = true"
        >
          <span>筛选</span>
          <van-image
            style="margin-left: 2px"
            :src="screenImg2"
            :width="12"
            :height="15"
          />
        </div>
        4
      </div>
    </div>
    <div
      v-if="
        cardInfo.proPlanDateResponse && cardInfo.proPlanDateResponse.length > 0
      "
    >
      <div
        class="my-card"
        v-for="(item, index) in cardInfo.proPlanDateResponse"
        :key="index"
      >
        <div class="date-line">
          <div class="date-line-left">{{ item.planDate }}</div>
          <div class="date-line-right">
            <span>共消费</span>
            <span class="blue">{{ item.totalCousum }}</span>
            <span>，共需还款</span>
            <span class="blue">{{ item.totalRepayment }}</span>
          </div>
        </div>
        <div
          class="card-content"
          v-for="(item, index) in item.proPlan"
          :key="index"
        >
          <van-divider :style="{ margin: ' 10px 0px 10px 0px ' }" />
          <div class="card-content-top">
            <div>预计消费(元)</div>
            <div class="num1">{{ item.money }}</div>
            <div class="card-content-top-info">
              <div class="card-content-top-info-left">
                <div>消费时间</div>
                <div>{{ item.beginTime }}-{{ item.endTime }}</div>
              </div>
              <div class="card-content-top-info-right">
                <div>标记金额(元)</div>
                <div>{{ item.signMoney }}</div>
              </div>
            </div>
            <van-image
              class="finishImg"
              v-if="item.isSign"
              :src="finishImg"
              :width="63"
              :height="57"
            />
          </div>
          <van-divider :style="{ margin: ' 5px 0px 3px 0px ' }" />
          <div class="card-content-bottom">
            <!-- <div class="line line1"> -->
              <div class="circle"></div>
              <div>{{ item.desc }}</div>
            <!-- </div> -->
            <!-- <div class="line line2"> -->
                    <!-- <div class="circle"></div>
                    <div>建议行业：【鞋店】、【烟酒店】</div> -->
                <!-- </div> -->
          </div>
        </div>
      </div>
    </div>
    <div v-else class="else-noMore-box" style="height: 500px">
      <van-image :src="noMoreImg" :width="150" :height="150" />
      <div class="noMore-text">暂无内容</div>
    </div>
    <md-popup
      class="my-popup"
      v-model="popupShow"
      position="bottom"
      @beforeHide="popupBeforeHide"
    >
      <md-popup-title-bar
        title="选择筛选条件"
        large-radius
      ></md-popup-title-bar>
      <div class="md-example-popup md-example-popup-bottom">
        <div class="date-time-box">
          <div class="time-box start-time-box">
            <div>开始日期</div>
            <div class="date-time-start" @click="showDate('start')">
              {{ form.startTime }}
            </div>
          </div>
          <div class="s-line"></div>
          <div class="time-box end-time-box">
            <div>结束日期</div>
            <div class="date-time-end" @click="showDate('end')">
              {{ form.endTime }}
            </div>
          </div>
        </div>
        <div class="plan-type-box">
          <div>计划类型</div>
          <div class="plan-type-button-box">
            <div class="my-radio-box">
              <md-radio-box
                class="my-radio"
                :name="1"
                v-model="form.planType"
                label="消费计划"
              />
              <md-radio-box
                class="my-radio"
                :name="2"
                v-model="form.planType"
                label="还款计划"
              />
              <md-radio-box
                class="my-radio"
                :name="0"
                v-model="form.planType"
                label="全部"
              />
            </div>
          </div>
        </div>
        <div class="line"></div>
        <div class="popup-footer">
          <van-button
            class="popup-foote-button popup-footer-reset"
            plain
            type="primary"
            color="#4475FE"
            @click="resetForm"
            >重置</van-button
          >
          <van-button
            class="popup-foote-button popup-footer-submit"
            type="primary"
            color="#4475FE"
            @click="handleFinishSubmit"
            >确认</van-button
          >
        </div>
      </div>
      <md-date-picker
        ref="datePicker_start"
        v-model="isTimePicker.show"
        :title="isTimePicker.title"
        small-radius
        :custom-types="['yyyy', 'MM', 'dd']"
        :default-date="isTimePicker.currentDate"
        @confirm="dataPickerConfirm('start')"
        :max-date="maxDate"
      ></md-date-picker>
      <md-date-picker
        ref="datePicker_end"
        v-model="isTimePicker.showE"
        :title="isTimePicker.titleE"
        small-radius
        :custom-types="['yyyy', 'MM', 'dd']"
        :default-date.sync="isTimePicker.currentDateE"
        @confirm="dataPickerConfirm('end')"
        :max-date="maxDate"
      ></md-date-picker>
    </md-popup>
  </div>
</template>

<script>
import { getHistory } from "@/api/index";
export default {
  name: "historyPlan",
  data() {
    return {
      noMoreImg: require("@/assets/img/暂无内容.png"),
      screenImg: require("@/assets/icon/筛选.png"),
      screenImg2: require("@/assets/icon/筛选 拷贝.png"),
      finishImg: require("@/assets/icon/已完成新.png"),
      popupShow: false,
      screenType: "no",
      cardInfo: {
        cardNumber: "",
        proPlanDateResponse: [],
      },
      isTimePicker: {
        //时间弹窗信息
        show: false,
        showE: false,
        title: "请选择开始时间",
        titleE: "请选择结束时间",
      },
      form: {
        startTime: "选择开始日期",
        endTime: "选择结束日期",
        planType: 1,
      },
      maxDate: null,
    };
  },
  created() {
    this.query = this.$route.query;
    console.log("历史提额计划页面里的路由参数", this.query);
    this.initDefaultDate();
    this.getHistory();
  },
  mounted() {},

  methods: {
    getHistory() {
      let data = {
        cid: this.query.cid,
        type: this.form.planType,
        beginDate: this.form.startTime,
        endDate: this.form.endTime,
      };
      console.log("data", data);
      getHistory(data).then((res) => {
        this.popupShow = false;
        console.log(res);
        this.cardInfo = res.data;
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
      this.beginDate = nowYear + "-" + nowMonth + "-" + "01";
      this.endDate = nowYear + "-" + nowMonth + "-" + nowDay;
      this.form.startTime = this.beginDate;
      this.form.endTime = this.endDate;
      this.maxDate = new Date(nowYear + "-" + nowMonth + "-" + nowDay);
      console.log('this.maxDate', this.maxDate)
    },
    // 筛选窗即将关闭
    popupBeforeHide() {
      if (
        this.beginDate != this.form.startTime ||
        this.endDate != this.form.endTime ||
        this.form.planType != 1
      ) {
        this.screenType = "yes";
      } else {
        this.screenType = "no";
      }
    },
    // 点击时间事件 显示 时间选择器
    showDate(col) {
      // this.dataPickerShow = true
      // this.defaultDate = new Date(enddate);
      if (col === "start") {
        const startdate = this.beginDate;
        this.isTimePicker.currentDate = new Date(startdate);
        this.isTimePicker.show = true;
      }
      if (col === "end") {
        const enddate = this.endDate;
        this.isTimePicker.currentDateE = new Date(enddate);
        this.isTimePicker.showE = true;
      }
    },
    // 时间选择器确定
    dataPickerConfirm(col) {
      if (col == "start") {
        this.form.startTime =
          this.$refs.datePicker_start.getFormatDate("yyyy-MM-dd");
      } else if (col == "end") {
        this.form.endTime =
          this.$refs.datePicker_end.getFormatDate("yyyy-MM-dd");
      }
      console.log(this.form.startTime, this.form.endTime);
    },
    // 表单重置
    resetForm() {
      this.initDefaultDate();
      this.form.planType = 1;
    },
    // 表单确定
    handleFinishSubmit() {
      // 发送请求
      this.getHistory();
    },
  },
};
</script>

<style lang="scss" scoped>
.box {
  background-color: rgb(243, 243, 243);
  min-height: 100vh;
  padding-bottom: 10px;
}
.top-backgroud {
  height: 150px;
  background-color: rgb(46, 47, 47);
  display: flex;
  justify-content: space-around;
  align-items: center;
  .card-til {
    width: 100%;
    padding: 0 30px 0 30px;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;

    .card-til-left,
    .card-til-right {
      display: flex;
      flex-direction: row;
      align-items: center;
      font-size: 26px;
      font-weight: 500;
    }
    .card-til-right {
      position: absolute;
      right: 30px;
    }

    .card-til-right-style1 {
      color: rgb(191, 191, 191);
    }
    .card-til-right-style2 {
      color: #4475fe;
    }

    .card-bank-icon {
      width: 50px;
      height: 50px;
      margin-right: 20px;
      border-radius: 50%;
    }

    .card-bank-name {
      font-size: 26px;
      font-family: PingFang SC;
      // font-weight: bold;
      color: rgba(255, 255, 255, 1);
    }

    .tips {
      margin-right: 20px;
      font-size: 26px;
      font-family: Source Han Sans CN;
      font-weight: bold;
      color: rgba(255, 255, 255, 1);
    }

    .bank-switch {
      display: block;
      // background: #a70000;
    }
  }
}
.md-example-popup {
  position: relative;
  font-size: 28px;
  font-family: DINPro;
  font-weight: 500;
  box-sizing: border-box;
  text-align: center;
  background-color: #fff;
}
.md-example-popup-bottom {
  width: 100%;
  padding: 10px 20px 20px 20px;
}
.my-popup /deep/ .md-popup-title-bar {
  // padding-top: 0px;
  // height: 50%;
  // font-size: 26px;
}
.my-popup /deep/ .title {
  // padding-top: 0px;
  // height: 50%;
  font-size: 32px !important;
}
.date-time-box {
  display: flex;
  justify-content: space-around;
  margin-top: 20px;
  .s-line {
    margin-top: 85px;
    width: 40px;
    height: 1px;
    //   line-height: 10px;
    background: #666666;
    //   margin-right: 20px;
  }
  .time-box {
    height: 150px;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    align-items: flex-start;
    font-size: 28px;
    font-family: PingFang SC;
    font-weight: 500;
    color: #666666;
    .date-time-start,
    .date-time-end {
      //   border: 1px solid rgba(216, 216, 216, 1);
      width: 310px;
      height: 82px;
      background: #f6f6f6;
      border-radius: 10px;
      font-size: 28px;
      font-family: PingFang SC;
      font-weight: 500;
      color: #999999;
      text-align: center;
      line-height: 83px;
    }
  }
}

.plan-type-box {
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: flex-start;
  height: 150px;
  font-size: 28px;
  font-family: PingFang SC;
  font-weight: 500;
  color: #666666;

  .plan-type-button-box {
    width: 100%;
    .my-radio-box {
      display: flex;
      justify-content: space-around;
      .my-radio {
        font-size: 28px;
        display: flex;
        justify-content: center;
        align-items: center;
        width: 220px;
        height: 70px;
        background: #f4f6fd;
        border-radius: 10px;
      }
    }
  }
}
.popup-footer {
  margin-top: 30px;
  width: 100%;
  display: flex;
  justify-content: space-between;
  .popup-foote-button {
    width: 338px;
    height: 86px;
    border: 1px solid #4475fe;
    border-radius: 10px;

    font-size: 30px;
    font-family: PingFang SC;
    font-weight: 500;
  }
  .popup-foote-reset {
    color: #4475fe;
  }
  .popup-foote-submit {
    color: #ffffff;
  }
}
.my-card {
  width: 702px;
  background: #ffffff;
  border-radius: 20px;
  padding: 20px 30px;
  margin: 0 auto;
  margin-top: 25px;
  .date-line {
    display: flex;
    justify-content: space-between;
    .date-line-left {
      font-size: 24px;
      font-family: PingFang SC;
      font-weight: 500;
      color: #666666;
    }
    .date-line-right {
      font-size: 24px;
      font-family: PingFang SC;
      font-weight: 500;
      color: #666666;
      .blue {
        color: #4475fe;
      }
    }
  }
  .card-content {
    .card-content-top {
      font-size: 26px;
      font-family: PingFang SC;
      font-weight: 500;
      color: #666666;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      height: 210px;
      .num1 {
        font-size: 36px;
        font-family: PingFang SC;
        font-weight: bold;
        color: #212121;
      }
      .card-content-top-info {
        display: flex;
        justify-content: space-between;
        width: 420px;
        .card-content-top-info-left,
        .card-content-top-info-right {
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          height: 82px;
        }
      }
      .finishImg {
        position: absolute;
        right: 60px;
        // margin-top: 90px;
      }
    }
    .card-content-bottom {
      font-size: 24px;
      font-family: PingFang SC;
      font-weight: 500;
      color: #999999;
      margin-bottom: 30px;
      .line {
        width: 100%;
        display: flex;
        justify-content: flex-start;
        align-items: center;
        .circle {
          width: 8px;
          height: 8px;
          background: #6f94fe;
          border-radius: 50%;
          margin-right: 15px;
        }
      }
      .line2 {
        margin-top: 15px;
      }
    }
  }
}
.line {
  margin-top: 25px;
  // width: 697px;
  height: 1px;
  background: #eeeeee;
}
</style>