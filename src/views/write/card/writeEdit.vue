<template>
  <div class="box">
    <van-tabs
      class="my-tabs"
      v-model="tabs.active"
      sticky
      line-width="15px"
      line-height="4px"
      color="rgb(68,117,254)"
      @change="changeTabs"
    >
      <!-- -----------------消费-------------------- --->
      <van-tab :title="tabs.items[0].label" :name="tabs.items[0].name">
        <div class="pay-box">
          <div class="date-box" @click="datePicker.show = true">
            <van-image :src="dateUrl" :height="15" :width="15"></van-image>
            <div class="date">
              {{ yyyymm.yyyy }}-{{ yyyymm.mm }}-{{ yyyymm.dd }}
            </div>
            <van-image
              class="downImg"
              :src="downUrl"
              :height="12"
              :width="12"
            ></van-image>
          </div>
          <div>
            <van-field
              ref="moneyField"
              class="money-field"
              v-model="payForm.money"
              :label="payForm.bankName"
              placeholder="0.00"
              input-align="right"
              type="number"
              label-width="150px"
              @focus="moneyFieldFocus"
              readonly
            />
          </div>
          <div class="line"></div>
          <div class="icon-list-box">
            <div
              class="icon-box"
              v-for="(item, index) in iconData"
              :key="index"
              @click="handleIcon(item)"
            >
              <div
                class="icon"
                :class="{ active: item.dailyTypeId == payForm.dailyTypeId }"
              >
                <van-image
                  class="iconImg"
                  :src="item.icon"
                  :height="32"
                  :width="32"
                ></van-image>
              </div>
              <div class="name">{{ item.name }}</div>
            </div>
          </div>
          <div class="line2"></div>
        </div>
      </van-tab>
      <!-- ----------消费----------- -->
      <!-- 数字键盘窗口 -->
      <md-popup
        class="my-popup"
        v-model="popupShow"
        position="bottom"
        large-radius
        :has-mask="false"
      >
        <div class="remark-box">
          <van-field
            class="remarkField"
            v-model="payForm.remark"
            label="备注"
            placeholder="写下你的备注..."
            input-align="left"
          style="height: 40px; line-height:32px"
            label-width="60px"
            @focus="remarkFieldFocus"
            @blur="remarkFieldBlur"
            maxlength="50"
          />
        </div>
        <md-number-keyboard
          v-show="numberKeyboardShow"
          is-view
          @enter="numberEnter"
          @delete="numberDelete"
          ok-text="完成"
          @confirm="keyBoardConfirm"
        ></md-number-keyboard>
      </md-popup>
      <!-- 还款时间选择器 -->
      <md-date-picker
        class="my-md-date-picker"
        ref="datePicker"
        v-model="datePicker.show"
        :title="datePicker.title"
        small-radius
        :custom-types="['yyyy', 'MM', 'dd']"
        :default-date="datePicker.currentDate"
        @confirm="dataPickerConfirm"
        :min-date="billStartDate"
        :max-date="billEndDate"
      ></md-date-picker>

      <!-- ------------------------还款----------------- -->
      <van-tab :title="tabs.items[1].label" :name="tabs.items[1].name">
        <div class="repay-box">
          <div class="date-box" @click="reDatePicker.show = true">
            <van-image :src="dateUrl" :height="15" :width="15"></van-image>
            <div class="date">
              {{ reyyyymm.yyyy }}-{{ reyyyymm.mm }}-{{ reyyyymm.dd }}
            </div>
            <van-image
              class="downImg"
              :src="downUrl"
              :height="12"
              :width="12"
            ></van-image>
          </div>
          <div>
            <van-field
              ref="reMoneyField"
              class="money-field"
              v-model="repayForm.money"
              :label="repayForm.bankName"
              placeholder="0.00"
              input-align="right"
              type="number"
              label-width="150px"
              @focus="reMoneyFieldFocus"
              readonly
            />
          </div>
          <div class="line"></div>
          <div class="icon-list-box">
            <div
              class="icon-box"
              v-for="(item, index) in reIconData"
              :key="index"
              @click="reHandleIcon(item)"
            >
              <div
                class="icon"
                :class="{ active: item.dailyTypeId == repayForm.dailyTypeId }"
              >
                <van-image
                  class="iconImg"
                  :src="item.icon"
                  :height="32"
                  :width="32"
                ></van-image>
              </div>
              <div class="name">{{ item.name }}</div>
              <div class="name">{{ item.extend }}</div>
            </div>
          </div>
          <div class="line2"></div>
        </div>
      </van-tab>
    </van-tabs>

    <!-- -------------------还款-------------- -->
    <!-- 数字键盘窗口 -->
    <md-popup
      class="my-popup"
      v-model="rePopupShow"
      position="bottom"
      large-radius
      :has-mask="false"
    >
      <div class="remark-box">
        <van-field
          class="remarkField"
          v-model="repayForm.remark"
          label="备注"
          placeholder="写下你的备注..."
          input-align="left"
          style="height: 40px; line-height:32px"
          label-width="60px"
          @focus="reRemarkFieldFocus"
          @blur="reRemarkFieldBlur"
          maxlength="50"
        />
      </div>
      <md-number-keyboard
        v-show="reNumberKeyboardShow"
        is-view
        @enter="reNumberEnter"
        @delete="reNumberDelete"
        ok-text="完成"
        @confirm="reKeyBoardConfirm"
      ></md-number-keyboard>
    </md-popup>
    <!-- 还款时间选择器 -->
    <md-date-picker
      class="my-md-date-picker"
      ref="reDatePicker"
      v-model="reDatePicker.show"
      :title="reDatePicker.title"
      small-radius
      :custom-types="['yyyy', 'MM', 'dd']"
      :default-date="reDatePicker.currentDate"
      @confirm="reDataPickerConfirm"
      :min-date="billStartDate"
      :max-date="billEndDate"
    ></md-date-picker>
  </div>
</template>

<script>
import {
  infoById,
  add,
  cardInfoById,
  cardEdit,
  getBookkeepingTime,
} from "@/api/write.js";

import {
  parse_decimal_2,
  format_decimal_2,
  keep_decimal_2,
} from "@/utils/tools.js";
export default {
  name: "writeEdit",
  props: {
    action: {
      type: String,
      default: "add",
    },
  },

  data() {
    return {
      dateUrl: require("@/assets/icon/日历.png"),
      downUrl: require("@/assets/icon/向下666.png"),
      tabs: {
        active: 1,
        items: [
          { name: 1, label: "消费" },
          { name: 2, label: "还款" },
        ],
      },

      // -------------消费------------
      numberKeyboardShow: true,
      datePicker: {
        //时间弹窗信息
        show: false,
        title: "请选择日期",
      },
      yyyymm: {},
      popupShow: true,
      payForm: {
        money: null,
        bankName: "请选择消费类型",
        dailyTypeId: null,
      },
      iconData: [],

      // ----------还款----------
      reNumberKeyboardShow: true,
      reDatePicker: {
        //时间弹窗信息
        show: false,
        title: "请选择日期",
      },
      reyyyymm: {},
      rePopupShow: false,
      repayForm: {
        money: null,
        bankName: "请选择还款类型",
        dailyTypeId: null,
      },
      reIconData: [],
      billStartDate: null,
      billEndDate: null,
      temp_money: "",
      temp_remoney: "",
    };
  },
  created() {
    this.query = this.$route.query;
    console.log("编辑账单页面里的路由参数", this.query);
    this.initDefaultDate();
    this.getBookkeepingTime();
    if (this.query.do == "edit") {
      this.cardInfoById();
    } else if (this.query.did && this.query.do == "copy") {
      this.cardInfoById();
    } else {
      this.getIconData().then((res) => {
        this.iconData = res.data;
      });
    }
  },
  mounted() {
    // 监听手机键盘 开启和关闭
    this.defaultPhoneHeight = window.innerHeight;
    console.log("this.defaultPhoneHeight", this.defaultPhoneHeight);
    window.onresize = () => {
      this.nowPhoneHeight = window.innerHeight;
      console.log("this.nowPhoneHeight", this.nowPhoneHeight);
      if (this.defaultPhoneHeight != this.nowPhoneHeight) {
        //手机键盘被唤起了。
        console.log("手机键盘被唤起了。");
      } else {
        //手机键盘被关闭了。
        console.log("手机键盘被关闭了。this.tabs.active", this.tabs.active);
        if (this.tabs.active == 1) {
          this.numberKeyboardShow = true;
          this.$refs.moneyField.focus()
        } else {
          this.reNumberKeyboardShow = true;
          this.$refs.reMoneyField.focus()
        }
        this.$forceUpdate();
      }
    };
  },
  destroyed() {
    window.onresize = null;
  },
  watch: {
    // nowPhoneHeight: function () {
    //   console.log("watch => this.nowPhoneHeight", this.nowPhoneHeight);
    //   if (this.defaultPhoneHeight != this.nowPhoneHeight) {
    //     //手机键盘被唤起了。
    //     console.log("手机键盘被唤起了。");
    //   } else {
    //     //手机键盘被关闭了。
    //     console.log("手机键盘被关闭了。");
    //   }
    // },
  },
  methods: {
    // 获取记账开始时间和结束时间
    getBookkeepingTime() {
      getBookkeepingTime({ cid: this.query.cid }).then((res) => {
        console.log("获取记账开始时间和结束时间res", res);
        this.billStartDate = new Date(res.data.data.startDate);
        this.billEndDate = new Date(res.data.data.endDate);
      });
    },
    // 查询单个
    cardInfoById() {
      cardInfoById({ did: this.query.did }).then((res) => {
        console.log("获取账单详情", res);
        this.data = res.data;
        this.tabs.active = res.data.ctype;
        if (this.tabs.active == 2) {
          // 判断如果查询的是还款
          this.getIconData().then((iconRes) => {
            console.log("res.data.dailyTypeId", res.data.dailyTypeId);
            this.repayForm = {
              bankName: res.data.classifyName,
              money: format_decimal_2(res.data.money),
              remark: res.data.remark,
              dailyTypeId: res.data.dailyTypeId,
              date: res.data.detailTime,
            }
            this.rePopupShow = true;
            this.popupShow = false;
            this.reIconData = iconRes.data;
            // this.repayForm.bankName = res.data.classifyName;
            // this.repayForm.money = format_decimal_2(res.data.money);
            // this.repayForm.remark = res.data.remark;
            // this.repayForm.dailyTypeId = res.data.dailyTypeId;
            // this.repayForm.date = res.data.detailTime;
            this.temp_remoney = format_decimal_2(res.data.money);
            // 设置页面上显示的日期和piker里选择的日期和表单里的日期
            this.reyyyymm.yyyy = res.data.detailTime.substring(0, 4);
            this.reyyyymm.mm = res.data.detailTime.substring(5, 7);
            this.reyyyymm.dd = res.data.detailTime.substring(8, 10);
            this.reDatePicker.currentDate = new Date(this.repayForm.date);
          });
        } else if (this.tabs.active == 1) {
          // 判断如果查询的是消费
          this.getIconData().then((iconRes) => {
            this.payForm = {
              bankName: res.data.classifyName,
              money: format_decimal_2(res.data.money),
              remark: res.data.remark,
              dailyTypeId: res.data.dailyTypeId,
              date: res.data.detailTime,
            }
            this.popupShow = true;
            this.rePopupShow = false;
            this.iconData = iconRes.data;
            // this.payForm.bankName = res.data.classifyName;
            // this.payForm.money = format_decimal_2(res.data.money);
            // this.payForm.remark = res.data.remark;
            // this.payForm.dailyTypeId = res.data.dailyTypeId;
            // this.payForm.date = res.data.detailTime;
            this.temp_money = format_decimal_2(res.data.money);
            // 设置页面上显示的日期和piker里选择的日期和表单里的日期
            this.yyyymm.yyyy = res.data.detailTime.substring(0, 4);
            this.yyyymm.mm = res.data.detailTime.substring(5, 7);
            this.yyyymm.dd = res.data.detailTime.substring(8, 10);
            this.datePicker.currentDate = new Date(this.repayForm.date);
          });
        }
      });
    },
    // 获取iconData
    getIconData() {
      return new Promise((resolve, reject) => {
        infoById({ ctype: this.tabs.active, cid: this.query.cid }).then(
          (res) => {
            console.log("获取iconData返回值res", res);
            resolve(res);
          }
        );
      });
    },
    // 切换tabs
    changeTabs(name, title) {
      console.log(name, title);
      // 切换tabs时关闭和打开不同的键盘
      this.tabs.active = name;
      if (title == "消费") {
        this.popupShow = true;
        this.rePopupShow = false;
        if (!this.iconData || this.iconData.length <= 0) {
          this.getIconData().then((res) => {
            this.iconData = res.data;
          });
        }
      } else if (title == "还款") {
        this.popupShow = false;
        this.rePopupShow = true;
        if (!this.reIconData || this.reIconData.length <= 0) {
          this.getIconData().then((res) => {
            this.reIconData = res.data;
          });
        }
      }
    },

    //初始化查询时间
    initDefaultDate() {
      const nowDate = new Date();
      const nowYear = nowDate.getFullYear();
      const currMonth = nowDate.getMonth() + 1;
      const nowMonth = currMonth < 10 ? "0" + currMonth : currMonth;
      const nowDay =
        nowDate.getDate() < 10 ? "0" + nowDate.getDate() : nowDate.getDate();
      // ----消费----
      this.yyyymm = {
        // v-model 绑定显示用
        yyyy: nowYear,
        mm: nowMonth,
        dd: nowDay,
      };
      this.date = nowYear + "-" + nowMonth + "-" + nowDay;
      this.datePicker.currentDate = new Date(this.date);
      this.payForm.date = this.date;

      // ----还款----
      this.reyyyymm = {
        // v-model 绑定显示用
        yyyy: nowYear,
        mm: nowMonth,
        dd: nowDay,
      };
      this.date = nowYear + "-" + nowMonth + "-" + nowDay;
      this.reDatePicker.currentDate = new Date(this.date);
      this.repayForm.date = this.date;
    },

    // -----------------------消费--------------------------
    // 确定选择日期
    dataPickerConfirm(item) {
      console.log(item);
      // return
      this.yyyymm.yyyy = item[0].value;
      this.yyyymm.mm = item[1].value < 10 ? "0" + item[1].value : item[1].value;
      this.yyyymm.dd = item[2].value < 10 ? "0" + item[2].value : item[2].value;
      console.log(this.yyyymm)
      this.payForm.date =
        this.yyyymm.yyyy + "-" + this.yyyymm.mm + "-" + this.yyyymm.dd;
    },
    // 点击图标
    handleIcon(item) {
      this.payForm.bankName = item.name;
      this.payForm.dailyTypeId = item.dailyTypeId;
    },
    // 还款金额输入框聚焦事件
    moneyFieldFocus() {
      // document.activeElement.blur();
    },
    // 数字键盘输入事件
    numberEnter(val) {
      this.temp_money += val;
      let v = keep_decimal_2(this.temp_money);
      this.payForm.money = v;
    },
    // 数字键盘删除事件
    numberDelete() {
      if (this.payForm.money === "") {
        return;
      }
      this.temp_money = this.payForm.money;
      this.temp_money = this.temp_money.substr(0, this.temp_money.length - 1);
      this.payForm.money = this.payForm.money.substr(
        0,
        this.payForm.money.length - 1
      );
    },
    // 备注框聚焦事件
    remarkFieldFocus() {
      this.numberKeyboardShow = false;
    },
    // 备注框失焦事件
    remarkFieldBlur() {
      this.numberKeyboardShow = true;
    },
    // 数字键盘完成事件
    keyBoardConfirm() {
      console.log(this.payForm);
      let form = { ...this.payForm };
      if (!form.date) {
        return this.$vtoast("请选择日期");
      } else if (!form.dailyTypeId) {
        return this.$vtoast("请选择消费类型");
      } else if (!form.money) {
        return this.$vtoast("请填写消费金额");
      } else if (form.money <= 0) {
        return this.$vtoast("金额不能为0 ");
      }
      let data = {
        detailTime: form.date,
        money: form.money,
        dailyTypeId: form.dailyTypeId,
        detailTitle: form.remark,
        ctype: this.tabs.active,
        detailFrom: form.bankName,
      };
      data.money = parse_decimal_2(data.money);
      if (this.query.do == "edit") {
        data.did = this.query.did;
        cardEdit(data).then((res) => {
          console.log(res);
          this.$vtoast("编辑成功");
          this.$router.push({
            path: '/bill'
          })
        });
      } else {
        data.cid = this.query.cid;
        data.bid = this.query.bid;
        add(data).then((res) => {
          console.log(res);
          this.$vtoast("新增成功");
          this.$router.push({
            path: '/bill'
          })
        });
      }
    },

    // -----------------------还款--------------------------
    // 确定选择日期
    reDataPickerConfirm(item) {
      console.log(item);
      this.reyyyymm.yyyy = item[0].value;
      this.reyyyymm.mm = item[1].value < 10 ? "0" + item[1].value : item[1].value;
      this.reyyyymm.dd = item[2].value < 10 ? "0" + item[2].value : item[2].value;
      this.repayForm.date =
        this.reyyyymm.yyyy + "-" + this.reyyyymm.mm + "-" + this.reyyyymm.dd;
    },
    // 点击图标
    reHandleIcon(item) {
      this.repayForm.bankName = item.name
      if(item.extend) this.repayForm.bankName += item.extend;
      this.repayForm.dailyTypeId = item.dailyTypeId;
    },
    // 还款金额输入框聚焦事件
    reMoneyFieldFocus() {
      // document.activeElement.blur();
    },
    // 数字键盘输入事件
    reNumberEnter(val) {
      this.temp_remoney += val;
      let v = keep_decimal_2(this.temp_remoney);
      this.repayForm.money = v;
    },
    // 数字键盘删除事件
    reNumberDelete() {
      if (this.repayForm.money === "") {
        return;
      }
      this.temp_remoney = this.repayForm.money;
      this.temp_remoney = this.temp_remoney.substr(
        0,
        this.temp_remoney.length - 1
      );
      this.repayForm.money = this.repayForm.money.substr(
        0,
        this.repayForm.money.length - 1
      );
    },
    // 备注框聚焦事件
    reRemarkFieldFocus() {
      this.reNumberKeyboardShow = false;
    },
    // 备注框失焦事件
    reRemarkFieldBlur() {
      this.reNumberKeyboardShow = true;
    },
    // 数字键盘完成事件
    reKeyBoardConfirm() {
      console.log(this.repayForm);
      let form = { ...this.repayForm };
      if (!form.date) {
        return this.$vtoast("请选择日期");
      } else if (!form.dailyTypeId) {
        return this.$vtoast("请选择还款类型");
      } else if (!form.money) {
        return this.$vtoast("请填写还款金额");
      } else if (form.money <= 0) {
        return this.$vtoast("金额不能为0 ");
      }
      let data = {
        detailTime: form.date,
        money: form.money,
        dailyTypeId: form.dailyTypeId,
        detailTitle: form.remark,
        ctype: this.tabs.active,
        detailFrom: form.bankName,
      };
      data.money = parse_decimal_2(data.money);
      if (this.query.do == "edit") {
        data.did = this.query.did;
        cardEdit(data).then((res) => {
          console.log(res);
          this.$vtoast("编辑成功");
          this.$router.push({
            path: '/bill'
          })
        });
      } else {
        data.cid = this.query.cid;
        data.bid = this.query.bid;
          add(data).then((res) => {
            console.log(res);
            this.$vtoast("新增成功");
            this.$router.push({
              path: '/bill'
            })
          });
      }
    },
  },
};
</script>

<style lang="less" scoped>
.box {
  background-color: rgb(243, 243, 243);
  min-height: 100vh;
  padding-bottom: 500px;
}
.my-tabs /deep/ .van-tabs__nav--line {
  padding-left: 100px;
  padding-right: 100px;
}
.my-tabs /deep/ .van-tab {
  font-size: 16px;
  font-family: PingFang SC;
  font-weight: 500;
  color: #666666;
}
.my-tabs /deep/ .van-tab--active {
  font-size: 16px;
  font-family: PingFang SC;
  font-weight: bold;
  color: #212121;
}

.repay-box {
  margin-top: 10px;
  background-color: white;
  padding: 25px 40px 35px 40px;
  .date-box {
    display: flex;
    align-items: center;
    font-size: 26px;
    font-family: PingFang SC;
    font-weight: 500;
    color: #666666;
    .date {
      margin-left: 10px;
    }
    .downImg {
      margin-left: 10px;
    }
  }
  .money-field {
    margin-top: 20px;
  }
  .line {
    height: 1px;
    background: #eeeeee;
    margin-top: 20px;
    // margin-bottom: 20px;
  }
  .icon-list-box {
    height: 100%;
    padding: 10px 0px;
    display: flex;
    // justify-content: space-between;
    flex-wrap: wrap;
    // display: -ms-inline-grid;
    .icon-box {
      margin-right: 6px;
      margin-top: 50px;
      width: 24%;
      height: 145px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      align-items: center;
      .icon {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 88px;
        height: 88px;
        border-radius: 50%; 
      }
      .active {
        border: 2px solid #4475fe;
        border-radius: 50%; 
      }
      .name {
        font-size: 26px;
        font-family: PingFang SC;
        font-weight: 500;
        color: #212121;
        text-align: center;
        // width: 100px;
        // white-space: pre-wrap;
        // overflow: hidden;
        // text-overflow: ellipsis;
        word-wrap: normal;
      }
    }
  }
  .line2 {
    height: 1px;
    background: #eeeeee;
    margin-top: 50px;
    margin-bottom: 30px;
  }
  .remark-field {
    // margin-top: 40px;
  }
}

.pay-box {
  margin-top: 10px;
  background-color: white;
  padding: 25px 40px 35px 40px;
  .date-box {
    display: flex;
    align-items: center;
    font-size: 26px;
    font-family: PingFang SC;
    font-weight: 500;
    color: #666666;
    .date {
      margin-left: 10px;
    }
    .downImg {
      margin-left: 10px;
    }
  }
  .money-field {
    margin-top: 20px;
  }
  .line {
    height: 1px;
    background: #eeeeee;
    margin-top: 20px;
    // margin-bottom: 20px;
  }
  .icon-list-box {
    height: 100%;
    padding: 10px 0px;
    display: flex;
    // justify-content: space-between;
    flex-wrap: wrap;
    // display: -ms-inline-grid;
    .icon-box {
      margin-right: 6px;
      margin-top: 50px;
      width: 19%;
      height: 140px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      align-items: center;
      .icon {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 88px;
        height: 88px;
      }
      .active {
        width: 88px;
      height: 88px;
      background: #e0e9ff;
      border-radius: 50%;
      }
      .name {
        font-size: 26px;
        font-family: PingFang SC;
        font-weight: 500;
        color: #212121;
        text-align: center;
        width: 100%;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }
  }
  .line2 {
    height: 1px;
    background: #eeeeee;
    margin-top: 50px;
    margin-bottom: 30px;
  }
  .remark-field {
    // margin-top: 40px;
  }
}
.remark-box {
  /deep/ .van-field__label {
    font-size: 16px;
    font-family: PingFang SC;
    font-weight: bold;
    color: #212121;
    text-align: center;
    margin-top: 5px;
  }
  /deep/ .van-field__body {
    margin-top: 5px;
    font-size: 14px;
    font-family: PingFang SC;
    font-weight: 500;
    color: #c5c5c5;
  }
}
.money-field /deep/ .van-field__label {
  font-size: 16px;
  font-family: PingFang SC;
  font-weight: 500;
  color: #212121;
  line-height: 36px;
}
.money-field /deep/ .van-field__body {
  font-size: 27px;
  font-family: PingFang SC;
  font-weight: bold;
  color: #212121;
  line-height: 36px;
}
.remark-field /deep/ .van-field__label,
.remark-field /deep/ .van-field__body {
  font-size: 15px;
  font-family: PingFang SC;
  font-weight: 500;
  color: #212121;
}
.my-md-date-picker{
  /deep/ .title{
    font-size: 32px !important;
  }
  /deep/ .md-popup-cancel{
    font-size: 28px !important;
  }
  /deep/ .md-popup-confirm{
    font-size: 28px !important;
  }
}
</style>