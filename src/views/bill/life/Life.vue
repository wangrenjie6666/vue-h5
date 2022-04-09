<template>
  <div class="box">
    <van-image :src="topBackgroundImg" width="100%" />
    <div class="top-box">
      <div class="date">
        <md-button
          class="date-button"
          type="default"
          plain
          inline
          round
          @click="popupShow = true"
          >{{ timeObj.value }}</md-button
        >
      </div>
      <div class="top-bottom">
        <div class="top-pay">
          <div class="font">
            <span>支出</span><span class="yuan">(元)</span>
          </div>
          <!-- <div class="num" >555555555.43</div> -->
          <div class="num" v-if="data.expend || data.expend == 0">
            {{ data.expend }}
          </div>
          <div class="noData" v-else>暂无数据</div>
        </div>
        <div class="top-income">
          <div class="font">
            <span>收入</span><span class="yuan">(元)</span>
          </div>
          <!-- <div class="num" >555555555.43</div> -->
          <div class="num" v-if="data.income || data.income == 0">
            {{ data.income }}
          </div>
          <div class="noData" v-else>暂无数据</div>
        </div>
      </div>
    </div>
    <div
      class="collapse-box"
      v-if="data.dailyBillList && data.dailyBillList.length > 0"
    >
      <van-collapse class="my-collapse" v-model="active" accordion>
        <van-collapse-item
          v-for="(item, index) in data.dailyBillList"
          :key="index"
          class="collapse-item"
          :name="item.month"
          :disabled="!item.income && !item.expend"
          :is-link="item.income || item.expend ? true : false"
        >
          <template #title>
            <div class="collapse-title">
              <div class="title-left">{{ item.month }}月</div>
              <div class="title-right">
                <div class="pay">
                  <van-image :src="zhiImg" :width="17" :height="17" />
                  <div class="num">{{ item.expend }}</div>
                </div>
                <div class="income">
                  <van-image :src="shouImg" :width="17" :height="17" />
                  <div class="num">{{ item.income }}</div>
                </div>
              </div>
            </div>
          </template>
          <div
            class="collapse-content"
            v-for="(item, index) in billList"
            :key="index"
          >
            <div
              class="left-box"
              :style="{ 'margin-top': `${index >= 1 ? '12px' : ''}` }"
            >
              <div class="day">{{ item.dateTime.substring(8, 10) }}</div>
              <div class="week">{{ item.week }}</div>
            </div>
            <div class="line" v-if="index >= 1"></div>
            <div v-for="(item, index) in item.dailyBillList" :key="index">
              <div class="line" v-if="index >= 1"></div>
              <div class="right-box" @click="handleInfo(item)">
                <div class="name-box">
                  <van-image
                    class="img"
                    :src="item.dailyType.colorIcon"
                    :width="24"
                    :height="24"
                  />
                  <div class="font-box">
                    <div class="name">
                      {{ item.dailyType.name }}
                      <span class="count"
                        >{{ item.account }}</span
                      >
                    </div>
                    <div class="remark">
                      {{ item.remark }}
                    </div>
                  </div>
                </div>
                <div class="num-box" :class="{ blue: item.createType == 0 }">
                  {{ item.money }}
                </div>
              </div>
            </div>
          </div>
        </van-collapse-item>
      </van-collapse>
    </div>
    <div v-else class="else-noMore-box" style="height: 350px">
      <van-image :src="noMoreImg" :width="150" :height="150" />
      <div class="noMore-text">暂无内容</div>
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
        value-key="value"
        @confirm="onConfirm"
        @cancel="popupShow = false"
      >
      </van-picker>
    </md-popup>
  </div>
</template>

<script>
import { getWmy } from "@/api/index.js";
import { lifeList, listByMonth } from "@/api/bill.js";
export default {
  name: "bill_life",
  data() {
    return {
      noMoreImg: require("@/assets/img/暂无内容.png"),
      topBackgroundImg: require("@/assets/icon/账单生活背景.png"),
      shouImg: require("@/assets/icon/收.png"),
      zhiImg: require("@/assets/icon/支.png"),
      eatImg: require("@/assets/icon/餐饮.png"),
      active: null,
      popupShow: false,
      columns: [],
      pickerValue: null,
      timeObj: {},
      data: {
        dailyBillList: [],
      },
      billList: [],
    };
  },
  created() {
    this.getWmy();
    this.pickerValue = this.columns.length - 1;
  },
  mounted() {},

  methods: {
    // 获取年月日枚举
    getWmy() {
      getWmy({ type: 2 }).then((res) => {
        console.log("获取年月日枚举", res);
        // 时间picker里的列表
        this.columns = res.data[0].wmyVoList;
        // 显示在页面上的时间
        this.timeObj = this.columns[this.columns.length - 1];
        //   默认选择最后一个
        this.pickerValue = this.columns.length - 1;
      });
    },
    // 查询外列表
    lifeList() {
      lifeList({ year: this.timeObj.key }).then((res) => {
        console.log("查询外列表接口返回", res);
        this.data = res.data;
        if (this.data.dailyBillList) {
          this.active = this.data.dailyBillList[0].month;
          console.log(this.active);
        }
      });
    },
    // 查询内列表
    listByMonth() {
      listByMonth({ year: this.timeObj.key, month: this.active }).then(
        (res) => {
          console.log("查询内列表接口返回", res);
          this.billList = res.data;
        }
      );
    },
    // 时间选择器改变时间
    onConfirm(picker, index) {
      if (picker) {
        console.log(picker, index);
        this.timeObj = picker;
        this.popupShow = false;
        this.billList = [];
      }
    },
    // 点击列表
    handleInfo(item) {
      let id = item.id;
      let cid = item.cid;
      this.$router.push({
        path: "/billLifeDetails",
        query: {
          id: id,
          cid: cid,
        },
      });
    },
  },
  watch: {
    timeObj() {
      (this.active = null), this.lifeList();
    },
    active() {
      console.log("watch -> this.active", this.active);
      if (this.active) {
        this.listByMonth();
      }
    },
  },
};
</script>

<style lang="less" scoped>
.box {
  background-color: rgb(243, 243, 243);
  min-height: 100vh;
}
.top-box {
  position: absolute;
  width: 100%;
  top: 60px;
  .date {
    display: flex;
    justify-content: center;
    .date-button {
      font-size: 30px;
      font-family: PingFang SC;
      font-weight: 500;
      color: #f0f3fc;
      width: 150px;
      height: 57px;
      // border: 1px solid #f0f3fc;
      border-radius: 28px;
    }
  }
  .top-bottom {
    display: flex;
    justify-content: space-between;
    margin-top: 80px;
    padding: 0px 10px;
    text-align: center;
    .top-pay {
      height: 145px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      width: 350px;
      // text-align: center;
      .font {
        font-size: 28px;
        font-family: PingFang SC;
        font-weight: 500;
        color: #f0f3fc;
        .yuan {
          font-size: 24px;
        }
      }
      .num {
        font-size: 49px;
        font-family: PingFang SC;
        font-weight: 500;
        color: #ffffff;
      }
    }
    .top-income {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      width: 350px;
      margin-left: 30px;
      // text-align: center;
      .font {
        font-size: 28px;
        font-family: PingFang SC;
        font-weight: 500;
        color: #f0f3fc;
        .yuan {
          font-size: 24px;
        }
      }
      .num {
        font-size: 49px;
        font-family: PingFang SC;
        font-weight: 500;
        color: #ffffff;
      }
    }
  }
}
.collapse-box {
  .my-collapse {
    .collapse-item {
      margin-top: 15px;
      padding: 30px;
      background-color: white;
      .collapse-title {
        display: flex;
        justify-content: space-between;
        align-items: center;
        .title-left {
          font-size: 36px;
          font-family: PingFang SC;
          //   font-weight: bold;
          color: #212121;
        }
        .title-right {
          display: flex;
          justify-content: space-between;
          align-items: center;
          .income {
            display: flex;
            justify-content: space-between;
            align-items: center;
            .num {
              margin-left: 7px;
              line-height: 30px;
              font-size: 28px;
              font-family: PingFang SC;
              font-weight: 500;
              color: #4475fe;
            }
          }
          .pay {
            margin-left: 30px;
            margin-right: 30px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            .num {
              margin-left: 7px;
              line-height: 30px;
              font-size: 28px;
              font-family: PingFang SC;
              font-weight: 500;
              color: #666666;
            }
          }
        }
      }
      .collapse-content {
        margin-top: 20px;
        // display: flex;
        // align-items: flex-start;
        // justify-content: space-between;
        .left-box {
          position: absolute;
          display: flex;
          flex-direction: column;
          .day {
            font-size: 34px;
            font-family: PingFang SC;
            font-weight: bold;
            color: #999999;
          }
          .week {
            margin-top: -10px;
            font-size: 20px;
          }
        }
        .line {
          height: 1px;
          background: #eeeeee;
          margin: 12px 0px 20px 0px;
          margin-left: 85px;
        }
        .right-box {
          // margin-left: 40px;
          margin-left: 85px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          width: 580px;
          .name-box {
            height: 70px;
            display: flex;
            align-items: center;
            .img {
              // margin-top: 5px;
            }
            .font-box {
              margin-left: 30px;
              display: flex;
              flex-direction: column;
              // justify-content: center;
              .name {
                font-size: 30px;
                font-family: PingFang SC;
                font-weight: 500;
                color: #212121;
                width: 250px;
                white-space: nowrap;
                  overflow: hidden;
                  text-overflow: ellipsis;
                .count {
                  // width: 200px;
                  font-size: 22px;
                  font-family: PingFang SC;
                  font-weight: 500;
                  color: #999999;
                  // white-space: nowrap;
                  // overflow: hidden;
                  // text-overflow: ellipsis;
                }
              }

              .remark {
                width: 250px;
                font-size: 22px;
                font-family: PingFang SC;
                font-weight: 500;
                color: #999999;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
              }
            }
          }
          .num-box {
            // margin-top: 10px;
            font-size: 34px;
            font-family: PingFang SC;
            font-weight: 500;
            color: #212121;
          }
          .blue {
            color: #4475fe;
          }
        }
      }
    }
  }
}
.noData {
  color: #ffffff;
  font-size: 28px;
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
// vant collapse content去除padding
.my-collapse /deep/ .van-collapse-item__content {
  padding: 0 0 0 10px;
  margin-top: 15px;
}
.my-popup {
  /deep/ .van-picker__title {
    font-size: 16px !important;
  }
  /deep/ .van-picker__cancel {
    font-size: 14px !important;
  }
  /deep/ .van-picker__confirm {
    font-size: 14px !important;
    color: #4475fe;
  }
}
</style>