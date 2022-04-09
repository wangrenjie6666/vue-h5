<template>
  <div class="box">
    <div class="tab-box">
      <van-tabs
        class="my-tabs"
        v-model="tabs.active"
        sticky
        background="#4475FE"
        color="white"
        line-width="15px"
        line-height="4px"
        animated
        @change="changeTabs"
      >
        <van-tab :title="tabs.items[0].label" :name="tabs.items[0].name">
          <div class="white-box">
            <div class="time-box" @click="popupShow = true">
              <div class="time-title">{{ timeObj.value }}</div>
              <div class="time-num">{{ timeObj.weekValue }}</div>
              <van-image class="downImg" :width="15" :height="15" :src="downImg"></van-image>
            </div>
            <div class="count-box">
              <div>总支出：{{ allMoney }}</div>
            </div>
            <div class="avg-box">
              <div>平均值：{{ average }}</div>
            </div>
            <div class="chart-box">
              <ve-line
                :extend="extend"
                :data="chartData"
                height="200px"
              ></ve-line>
            </div>
            <div class="info-box">
              <div class="info-div" v-for="(item, index) in list" :key="index">
                <!-- <van-image class="downImg" :src="item.icon"></van-image> -->
                <div class="center-div">
                  <div>
                    <span class="name">{{ item.dailyName }}</span>
                    <span class="num">￥{{ item.money }}</span>
                  </div>
                  <van-progress
                    class="my-progress"
                    :percentage="item.percent"
                    :color="
                      (index + 1) % 5 == 1
                        ? '#FF9D1C'
                        : (index + 1) % 5 == 2
                        ? '#997CF3'
                        : (index + 1) % 5 == 3
                        ? '#3DB9FE'
                        : (index + 1) % 5 == 4
                        ? '#0FD183'
                        : '#FE6562'
                    "
                    :show-pivot="false"
                    stroke-width="8"
                  />
                </div>
                <div class="right-div">{{ item.percent }}%</div>
              </div>
            </div>
          </div>
        </van-tab>
        <van-tab :title="tabs.items[1].label" :name="tabs.items[1].name">
          <div class="white-box">
            <div class="time-box" @click="popupShow = true">
              <div class="time-title">{{ timeObj.value }}</div>
              <div class="time-num">{{ timeObj.weekValue }}</div>
              <van-image class="downImg" :width="15" :height="15" :src="downImg"></van-image>
            </div>
            <div class="count-box">
              <div>总支出：{{ allMoney }}</div>
            </div>
            <div class="avg-box">
              <div>平均值：{{ average }}</div>
            </div>
            <div class="chart-box">
              <ve-line
                :extend="extend"
                :data="chartData"
                height="200px"
              ></ve-line>
            </div>
            <div class="info-box">
              <div class="info-div" v-for="(item, index) in list" :key="index">
                <!-- <van-image class="downImg" :src="item.icon"></van-image> -->
                <div class="center-div">
                  <div>
                    <span class="name">{{ item.dailyName }}</span>
                    <span class="num">￥{{ item.money }}</span>
                  </div>
                  <van-progress
                    class="my-progress"
                    :percentage="item.percent"
                    :color="
                      (index + 1) % 5 == 1
                        ? '#FF9D1C'
                        : (index + 1) % 5 == 2
                        ? '#997CF3'
                        : (index + 1) % 5 == 3
                        ? '#3DB9FE'
                        : (index + 1) % 5 == 4
                        ? '#0FD183'
                        : '#FE6562'
                    "
                    :show-pivot="false"
                    stroke-width="8"
                  />
                </div>
                <div class="right-div">{{ item.percent }}%</div>
              </div>
            </div>
          </div>
        </van-tab>
      </van-tabs>
    </div>

    <!-- 日期筛选弹窗 -->
    <md-popup
      class="my-popup"
      v-model="popupShow"
      position="bottom"
      large-radius
    >
      <van-picker
        title="选择时间"
        show-toolbar
        :default-index="pickerValue"
        :columns="columns"
        @confirm="onConfirm"
        @cancel="popupShow = false"
        value-key="value"
      >
        <div
          slot="columns-top"
          class="md-example-popup md-example-popup-bottom"
        >
          <a-radio-group
            class="my-radio-group"
            v-model="selectRadio"
            button-style="solid"
          >
            <a-radio-button class="my-radio-button" value="week">
              按周
            </a-radio-button>
            <a-radio-button class="my-radio-button" value="month">
              按月
            </a-radio-button>
            <a-radio-button class="my-radio-button" value="year">
              按年
            </a-radio-button>
          </a-radio-group>
        </div>
      </van-picker>
    </md-popup>
  </div>
</template>

<script>
import { listForChart, getWmy } from "@/api/index.js";
export default {
  name: "index_card",
  data() {
    return {
      downImg: require("@/assets/icon/向下新.png"),
      iconImg: require("@/assets/icon/餐饮.png"),
      average: null,
      allMoney: null,
      list: [],
      tabs: {
        active: 1,
        items: [
          { name: 1, label: "支出" },
          { name: 0, label: "收入" },
        ],
      },
      timeObj: {
        name: "本周",
        remark: "8.16~8.22",
      },

      // 日期筛选弹窗
      popupShow: false,
      selectRadio: "week",
      dateType: 0,
      pickerValue: null,
      form: {},
      columns: [],

      //   折线图
      chartData: {
        columns: ["日期", "当日总支出"],
        rows: [
          { 日期: "8.8", 当日总支出: 1232 },
          { 日期: "8.9", 当日总支出: 1223 },
          { 日期: "8.10", 当日总支出: 2123 },
          { 日期: "8.11", 当日总支出: 4123 },
          { 日期: "8.12", 当日总支出: 3123 },
          { 日期: "8.13", 当日总支出: 7123 },
          { 日期: "8.14", 当日总支出: 212 },
          { 日期: "8.15", 当日总支出: 352 },
          { 日期: "8.16", 当日总支出: 50 },
          { 日期: "8.17", 当日总支出: 6000 },
          { 日期: "8.18", 当日总支出: 20 },
          { 日期: "8.19", 当日总支出: 9712 },
          { 日期: "8.20", 当日总支出: 7123 },
          { 日期: "8.21", 当日总支出: 5211233 },
          { 日期: "8.22", 当日总支出: 432545 },
          { 日期: "8.23", 当日总支出: 12343 },
          { 日期: "8.24", 当日总支出: 35255555 },
        ],
      },
      // 折线图配置
      extend: {
        series: {
          smooth: false,
          lineStyle: {
            color: "#4475FE",
          },
          itemStyle: {
            color: "#4475FE",
          },
        },
        legend: {
          show: false,
        },
        grid: {
          x: 40,
          y: 20,
          x2: 0,
          y2: 0,
        },
        xAxis: {
          axisLine: {
            lineStyle: {
              color: "#333333",
            },
          },
        },
        yAxis: {
          axisLine: {
            lineStyle: {
              color: "#C1C1C1",
            },
          },
          axisLabel: {
            inside: true,
            margin: -40,
            verticalAlign: "bottom",
            formatter: function (value, index) {
              value += ''
              // console.log(value)
              if( value.length >= 5){
                value = value.substring(0,value.length-4) + '万'
              }
              // console.log(value)
              return value
            }
          },
          splitLine: {
            //网格线
            lineStyle: {
              type: "dashed", //设置网格线类型 dotted：虚线   solid:实线
            },
          },
        },
        
      },
    };
  },
  created() {
    this.getWmy();
    console.log(11 % 5);
  },
  mounted() {},

  methods: {
    // 获取图表数据
    listForChart() {
      let data = {
        createType: this.tabs.active,
        searchType: this.dateType,
      };
      if (this.dateType == 0) {
        //周
        data.thisOrPre = this.timeObj.key;
      } else if (this.dateType == 1) {
        //月
        data.month = this.timeObj.key;
      } else if (this.dateType == 2) {
        //年
        data.year = this.timeObj.key;
      }
      listForChart(data).then((res) => {
        console.log("获取图表数据", res);
        this.allMoney = res.data.allMoney;
        this.average = res.data.average;
        
        let rows = res.data.chartBillDtoList
        rows = JSON.parse(
          JSON.stringify(res.data.chartBillDtoList).replace(
            /money/g,
            "当日总支出"
          )
        );
        rows = JSON.parse(JSON.stringify(rows).replace(/time/g, "日期"));
        console.log('rows',rows)
        this.chartData.rows = rows;
        this.list = res.data.chartBillLineDtoList;
      });
    },
    // 获取年月日枚举
    getWmy() {
      getWmy({ type: -1 }).then((res) => {
        console.log("获取年月日枚举", res);
        this.allColumns = res.data;
        // 时间picker里的列表
        this.columns = this.allColumns[0].wmyVoList;
        // 显示在页面上的时间
        this.timeObj = this.columns[this.columns.length - 1];
        //   默认选择最后一个
        this.pickerValue = this.columns.length - 1;
      });
    },
    // 时间选择器改变时间
    onConfirm(picker, index) {
      if (picker) {
        this.timeObj = picker;
      }
    },
    // 切换tabs
    changeTabs(v, i) {
      this.listForChart();
    },
  },
  watch: {
    //   改变时间类型
    selectRadio(newV, oldV) {
      if (newV == "week") {
        this.dateType = 0;
        this.columns = this.allColumns[0].wmyVoList;
      } else if (newV == "month") {
        this.dateType = 1;
        this.columns = this.allColumns[1].wmyVoList;
      } else if (newV == "year") {
        this.dateType = 2;
        this.columns = this.allColumns[2].wmyVoList;
      }
      //   默认选择最后一个
      this.pickerValue = this.columns.length - 1;
    },
    timeObj() {
      console.log("watch里timeObj改变了", this.timeObj);
      this.listForChart();
      this.popupShow = false;
    },
  },
};
</script>

<style lang="less" scoped>
.box {
  background-color: rgb(243, 243, 243);
  min-height: 100vh;
}
.tab-box {
  padding-top: 20px;
  background-color: #4475fe;
  .my-tabs /deep/ .van-tabs__nav--line {
    padding-left: 120px;
    padding-right: 120px;
  }
  .my-tabs /deep/ .van-tab {
    font-size: 16px;
    font-family: PingFang SC;
    font-weight: bold;
    color: #ffffff;
  }
  .white-box {
    background-color: white;
    // margin-top: 10px;
    padding: 40px 20px;
    .time-box {
      display: flex;
      align-items: center;
      margin-bottom: 30px;
      .time-title {
        font-size: 40px;
        font-family: PingFang SC;
        font-weight: 500;
        color: #212121;
      }
      .time-num {
        font-size: 26px;
        font-family: PingFang SC;
        font-weight: 500;
        color: #999999;
        margin-left: 15px;
      }
      .downImg {
        // width: 25px;
        // height: 25px;
        margin-left: 10px;
        margin-top: 5px;
      }
    }
    .count-box,
    .avg-box {
      margin-top: 10px;
      font-size: 26px;
      font-family: PingFang SC;
      font-weight: 500;
      color: #333333;
    }
    .chart-box {
      margin-top: 30px;
    }
    .info-box {
      margin-top: 70px;
      .info-div {
        display: flex;
        align-items: flex-end;
        justify-content: space-between;
        margin-bottom: 50px;
        // height: 200px;
        padding: 0px 0px 0px 10px;
        .downImg {
          width: 55px;
          height: 55px;
        }
        .center-div {
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          width: 620px;
          height: 60px;
          .name {
            font-size: 26px;
            font-family: PingFang SC;
            font-weight: 500;
            color: #212121;
          }
          .num {
            font-size: 24px;
            font-family: PingFang SC;
            font-weight: 500;
            color: #212121;
          }
        }
        .right-div {
          width: 65px;
          font-size: 26px;
          font-family: PingFang SC;
          font-weight: 500;
          color: #666666;
        }
      }
    }
  }
}

// 弹窗
.my-popup {
  /deep/ .md-popup-box {
    border-top-left-radius: 30px;
    border-top-right-radius: 30px;
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
  .my-radio-group {
    margin-top: 20px;
    /deep/ .ant-radio-button-wrapper-checked{
      background:#4475FE;
      border-color: #4475FE;
    }
    .my-radio-button {
      width: 161px;
      height: 56px;
      line-height: 50px;
      font-size: 26px;
      font-family: PingFang SC;
      font-weight: 500;
    }
  }
}
.my-popup{
  /deep/ .van-picker__confirm{
    color: #4475FE;
    font-size: 14px !important;
  }
  /deep/ .van-picker__cancel{
    font-size: 14px !important;
  }
  /deep/ .van-picker__title{
    font-size: 16px !important;
  }
}
</style>