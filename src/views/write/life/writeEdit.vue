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
              :formatter="formatterMoney"
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
              <div class="icon" :class="{ active: item.id == payForm.id }">
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
            label-width="60px"
            @focus="remarkFieldFocus"
            @blur="remarkFieldBlur"
            maxlength="50"
            style="height: 40px; line-height:32px"
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
        :min-date="minDate"
        :max-date="today"
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
              <div class="icon" :class="{ active: item.id == repayForm.id }">
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
      :min-date="minDate"
      :max-date="today"
    ></md-date-picker>
  </div>
</template>

<script>
import { getWmy } from "@/api/index.js";
import { dailyTypList, lifeAdd as add, lifeEdit } from "@/api/write.js";
import { infoById } from "@/api/bill.js";
import { parse_decimal_2, format_decimal_2, keep_decimal_2 } from "@/utils/tools.js";
export default {
  name: "writeEdit",
  props: {},
  data() {
    return {
      dateUrl: require("@/assets/icon/日历.png"),
      downUrl: require("@/assets/icon/向下666.png"),
      tabs: {
        active: 1,
        items: [
          { name: 1, label: "支出" },
          { name: 0, label: "收入" },
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
        bankName: "请选择支出类型",
        id: null,
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
        bankName: "请选择收入类型",
        id: null,
      },
      reIconData: [],
      temp_money: "",
      temp_remoney: "",
      minDate:null,
    };
  },
  created() {
    this.query = this.$route.query;
    console.log("历史提额页面里的路由参数", this.query);
    this.initDefaultDate();
    this.getWmy();
    if (this.query.id && this.query.do == "edit") {
      this.infoById();
    } else if (this.query.id && this.query.do == "copy") {
      this.infoById();
    } else {
      this.getIconData().then((res) => {
        this.iconData = res.data.records;
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
  methods: {
    // 获取年月日枚举
    getWmy() {
      getWmy({ type: 2 }).then((res) => {
        console.log("获取年月日枚举", res);
        if(res.data && res.data.length > 0 && res.data[0].wmyVoList && res.data[0].wmyVoList.length > 0){
          let date =  res.data[0].wmyVoList[0].key + '-01-01';
          this.minDate = new Date(date)
          console.log(date)
        }
      });
    },
    // 获取账单详情
    infoById() {
      infoById({ id: this.query.id }).then((res) => {
        console.log("获取账单详情", res);
        // this.data = res.data;
        this.tabs.active = res.data.createType;
        if (this.tabs.active == 0) {
          // 判断如果查询的是收入
          this.getIconData().then((iconRes) => {
            this.repayForm ={...this.repayForm,
              bankName: res.data.dailyType.name,
              money: format_decimal_2(res.data.money),
              remark: res.data.remark,
              id: res.data.dailyType.id,
              date: res.data.bookedTime,
            }
            this.rePopupShow = true;
            this.popupShow = false;
            this.reIconData = iconRes.data.records;
            // this.repayForm.bankName = res.data.dailyType.name;
            // this.repayForm.money = format_decimal_2(res.data.money);
            // this.repayForm.remark = res.data.remark;
            // this.repayForm.id = res.data.dailyType.id;
            // this.repayForm.date = res.data.bookedTime;
            this.temp_remoney = format_decimal_2(res.data.money);
            // 设置页面上显示的日期和piker里选择的日期和表单里的日期
            this.reyyyymm.yyyy = res.data.bookedTime.substring(0, 4);
            this.reyyyymm.mm = res.data.bookedTime.substring(5, 7);
            this.reyyyymm.dd = res.data.bookedTime.substring(8, 10);
            this.reDatePicker.currentDate = new Date(this.repayForm.date);
          });
        } else if (this.tabs.active == 1) {
          // 判断如果查询的是支出
          this.getIconData().then((iconRes) => {
            this.payForm ={...this.payForm,
              bankName: res.data.dailyType.name,
              money: format_decimal_2(res.data.money),
              remark: res.data.remark,
              id: res.data.dailyType.id,
              date: res.data.bookedTime,
            }
            this.popupShow = true;
            this.rePopupShow = false;
            this.iconData = iconRes.data.records;
            // this.payForm.bankName = res.data.dailyType.name;
            // this.payForm.money = format_decimal_2(res.data.money);
            // this.payForm.remark = res.data.remark;
            // this.payForm.id = res.data.dailyType.id;
            // this.payForm.date = res.data.bookedTime;
            this.temp_money = format_decimal_2(res.data.money);
            // 设置页面上显示的日期和piker里选择的日期和表单里的日期
            this.yyyymm.yyyy = res.data.bookedTime.substring(0, 4);
            this.yyyymm.mm = res.data.bookedTime.substring(5, 7);
            this.yyyymm.dd = res.data.bookedTime.substring(8, 10);
            this.datePicker.currentDate = new Date(this.repayForm.date);
            
          });
        }
      });
    },
    // 获取iconData
    getIconData() {
      return new Promise((resolve, reject) => {
        dailyTypList({ type: this.tabs.active, consumeType: 0, size: 999}).then((res) => {
          console.log("获取iconData返回值res", res);
          resolve(res);
        });
      });
    },
    // 切换tabs
    changeTabs(name, title) {
      console.log(name, title);
      // 切换tabs时关闭和打开不同的键盘
      if (title == "支出") {
        this.popupShow = true;
        this.rePopupShow = false;
        if (!this.iconData || this.iconData.length <= 0) {
          this.getIconData().then((res) => {
            this.iconData = res.data.records;
          });
        }
      } else if (title == "收入") {
        this.popupShow = false;
        this.rePopupShow = true;
        if (!this.reIconData || this.reIconData.length <= 0) {
          this.getIconData().then((res) => {
            this.reIconData = res.data.records;
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
      this.today = nowDate;
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
      this.yyyymm.yyyy = item[0].value;
      this.yyyymm.mm = item[1].value < 10 ? "0" + item[1].value : item[1].value;
      this.yyyymm.dd = item[2].value < 10 ? "0" + item[2].value : item[2].value;
      this.payForm.date =
        this.yyyymm.yyyy + "-" + this.yyyymm.mm + "-" + this.yyyymm.dd;
    },
    // 点击图标
    handleIcon(item) {
      this.payForm.bankName = item.name;
      this.payForm.id = item.id;
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
      // if(this.payForm.money[this.payForm.money.length-1])
      this.temp_money = this.payForm.money;
      this.temp_money = this.temp_money.substr(0, this.temp_money.length - 1);
      this.payForm.money = this.payForm.money.substr(
        0,
        this.payForm.money.length - 1
      );
    },
    // 数字键盘完成事件
    keyBoardConfirm() {
      let form = { ...this.payForm };
      if (!form.date) {
        return this.$vtoast("请选择日期");
      } else if (!form.id) {
        return this.$vtoast("请选择支出类型");
      } else if (!form.money) {
        return this.$vtoast("请填写支出金额");
      }  else if (form.money <= 0) {
        return this.$vtoast("金额不能为0 ");
      }
      let data = {
        cid: this.query.cid,
        bookedTime: form.date,
        money: form.money,
        dailyTypeId: form.id,
        remark: form.remark,
        createType: this.tabs.active,
      };
      // if (data.money && !data.money.split(".")[1]) {
      //   data.money += "00";
      // } else if (data.money.split(".")[1].length == 1) {
      //   data.money += "0";
      // }
      data.money = parse_decimal_2(data.money);
      // console.log("data.money", data.money);
      if (this.query.do == "edit") {
        data.id = this.query.id;
        lifeEdit(data).then((res) => {
          console.log(res);
          this.$vtoast("编辑成功");
          this.$router.push({
            path: '/bill'
          })
        });
      } else if (this.query.do == "copy") {
        data.cid = this.query.cid;
        add(data).then((res) => {
          console.log(res);
          this.$vtoast("新增成功");
          this.$router.push({
            path: '/bill'
          })
        });
      } else {
        data.cid = this.query.cid;
        add(data).then((res) => {
          console.log(res);
          this.$vtoast("新增成功");
          this.$router.push({
            path: '/bill'
          })
        });
      }
    },
    // 备注框聚焦事件
    remarkFieldFocus() {
      this.numberKeyboardShow = false;
    },
    // 备注框失焦事件
    remarkFieldBlur() {
      this.numberKeyboardShow = true;
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
      this.repayForm.bankName = item.name;
      this.repayForm.id = item.id;
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
      this.temp_remoney = this.temp_remoney.substr(0, this.temp_remoney.length - 1);
      this.repayForm.money = this.repayForm.money.substr(
        0,
        this.repayForm.money.length - 1
      );
    },
    
    // 数字键盘完成事件
    reKeyBoardConfirm() {
      let form = { ...this.repayForm };
      if (!form.date) {
        return this.$vtoast("请选择日期");
      } else if (!form.id) {
        return this.$vtoast("请选择收入类型");
      } else if (!form.money) {
        return this.$vtoast("请填写收入金额");
      } else if (form.money <= 0) {
        return this.$vtoast("金额不能为0 ");
      }
      let data = {
        bookedTime: form.date,
        money: form.money,
        dailyTypeId: form.id,
        remark: form.remark,
        createType: this.tabs.active,
      };
      data.money = parse_decimal_2(data.money);
      // console.log(data.money);
      if (this.query.do == "edit") {
        data.id = this.query.id;
        lifeEdit(data).then((res) => {
          console.log(res);
          this.$vtoast("编辑成功");
          this.$router.go(-2);
        });
      } else if (this.query.do == "copy") {
        data.cid = this.query.cid;
        add(data).then((res) => {
          console.log(res);
          this.$vtoast("新增成功");
          this.$router.push({
            path: '/bill'
          })
        });
      } else {
        data.cid = this.query.cid;
        add(data).then((res) => {
          console.log(res);
          this.$vtoast("新增成功");
          this.$router.push({
            path: '/bill'
          })
        });
      }
    },
    // 备注框聚焦事件
    reRemarkFieldFocus() {
      this.reNumberKeyboardShow = false;
    },
    // 备注框失焦事件
    reRemarkFieldBlur() {
      this.reNumberKeyboardShow = true;
    },

    // 格式化账单日
    formatterMoney(value) {
      return value;
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
  // .icon-list-box {
  //   height: 100%;
  //   padding: 10px 0px;
  //   display: flex;
  //   // justify-content: space-between;
  //   flex-wrap: wrap;
  //   // display: -ms-inline-grid;
  //   .icon-box {
  //     margin-right: 6px;
  //     margin-top: 50px;
  //     width: 19%;
  //     height: 140px;
  //     display: flex;
  //     flex-direction: column;
  //     justify-content: space-between;
  //     align-items: center;
  //     .icon {
  //       display: flex;
  //       justify-content: center;
  //       align-items: center;
  //       width: 88px;
  //       height: 88px;
  //     }
  //     .active {
  //       border: 2px solid #4475fe;
  //       border-radius: 50%;
  //     }
  //     .name {
  //       font-size: 26px;
  //       font-family: PingFang SC;
  //       font-weight: 500;
  //       color: #212121;
  //       text-align: center;
  //       width: 100%;
  //       white-space: nowrap;
  //       overflow: hidden;
  //       text-overflow: ellipsis;
  //     }
  //   }
  // }
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
      background: #fafafa;
      border-radius: 50%;
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