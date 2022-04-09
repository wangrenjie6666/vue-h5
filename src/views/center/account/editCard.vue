<template>
  <div class="box">
    <div class="cell-group-box">
      <van-cell-group>
        <van-field
          v-model="form.cardNumber"
          label="信用卡号"
          placeholder="请输入您的卡号"
          input-align="right"
          type="digit"
          @blur="blurCheckCard"
          :disabled="query.cid != null"
        />
        <van-field
          v-model="form.bankId"
          label="银行"
          is-link
          input-align="right"
          readonly
          @click="cardListShow = true"
        >
          <template #button>
            <div v-if="Object.keys(selectBank).length <= 0">请选择银行</div>
            <div v-else class="bank-name-box">
              <van-image
                class="bank-img"
                :width="26"
                :height="26"
                :src="selectBank.colorIcon"
              />
              <div class="name">{{ selectBank.bankName }}</div>
            </div>
          </template>
        </van-field>
        <!-- 选择银行 popup-->
        <van-popup class="init-popup" v-model="cardListShow" position="bottom">
          <van-picker
            :default-index="bankDefaultIndex"
            title="选择银行"
            show-toolbar
            :columns="cardList"
            value-key="bankName"
            visible-item-count="10"
            @confirm="cardListConfirm"
            @cancel="cardListShow = false"
          />
        </van-popup>
        <van-field
          v-model="form.cardTypeId"
          label="卡类型"
          is-link
          input-align="right"
          readonly
          @click="cardTypeListShow = true"
        >
          <template #button>
            <div v-if="!selectCardType">请选择卡类型</div>
            <div v-else>{{ selectCardType.typeName }}</div>
          </template>
        </van-field>
        <!-- 选择卡类型 popup-->
        <van-popup
          class="init-popup"
          v-model="cardTypeListShow"
          position="bottom"
        >
          <van-picker
            @cancel="cardTypeListShow = false"
            :default-index="bankTypeDefaultIndex"
            title="选择卡类型"
            show-toolbar
            :columns="cardTypeList"
            value-key="typeName"
            @confirm="cardTypeListtConfirm"
          />
        </van-popup>
        <van-field
          v-model="form.quota"
          label="信用额度（元）"
          placeholder="请输入信用额度"
          input-align="right"
          type="number"
          :label-width="120"
          @input="input_quota"
          :formatter="formatter"
        />
        <van-field
          v-model="form.availableQuota"
          label="可用额度（元）"
          placeholder="请输入可用额度"
          input-align="right"
          type="number"
          :label-width="120"
          :formatter="formatter"
        />
        <van-field label="是否有过提额" input-align="right" readonly>
          <template #button>
            <a-switch
              v-model="form.rise"
              class="rise-switch"
              checked-children="是"
              un-checked-children="否"
              @change="riseChange"
              :disabled="query.cid != null"
            />
          </template>
        </van-field>
        <van-field
          v-if="form.rise"
          v-model="form.lastAddQuotaDate"
          label="上次提额时间"
          is-link
          input-align="right"
          readonly
          @click="query.cid == null ? lastRiseTimeShow = true : lastRiseTimeShow = false"
          :disabled="query.cid != null"
        >
          <template #button>
            <div v-if="!form.lastAddQuotaDate">请选择提额时间</div>
            <!-- <div v-else>{{ form.lastAddQuotaDate }}</div> -->
          </template>
        </van-field>
        <!-- 上次提额时间弹窗 -->
        <van-popup v-model="lastRiseTimeShow" position="bottom">
          <van-datetime-picker
            v-model="currentDate"
            :max-date="maxDate"
            type="date"
            title="提额时间"
            @confirm="lastRiseTimeConfirm"
          />
        </van-popup>
        <van-field
          v-if="form.rise"
          v-model="form.lastAddQuota"
          label="上次提额额度（元）"
          placeholder="请输入提额额度"
          input-align="right"
          type="number"
          :label-width="140"
          :formatter="formatter"
          :disabled="query.cid != null"
        />

        <van-field
          v-model="form.billDate"
          label="账单日"
          input-align="right"
          type="digit"
          maxlength="2"
          class="bill-day"
          :formatter="formatterBillDay"
        >
          <template #button>
            <span class="month-font right-font">每月</span>
            <span class="right-font">日</span>
          </template>
        </van-field>
        <van-field
          v-model="form.repayDate"
          label="最后还款日"
          input-align="right"
          type="digit"
          maxlength="2"
          class="bill-day"
          :formatter="formatterBillDay"
        >
          <template #button>
            <span class="month-font right-font">每月</span>
            <span class="right-font">日</span>
          </template>
        </van-field>
        <van-field
          v-model="form.lastMonthBillMoney"
          label="已消费金额（元）"
          placeholder="请输入已消费金额"
          input-align="right"
          type="number"
          :label-width="140"
          :readonly="$route.query.cid != null"
          :formatter="formatter"
        />
      </van-cell-group>
      <div v-if="userinfo.type == 0" class="have-account-div">
        <router-link to='/login' class="have-account-a">已有账号，去登录</router-link>
      </div>

      <div class="submit-box">
        <van-button
          v-if="$route.query.cid != null"
          class="delete-bottom"
          block
          @click="handleDelete"
          >删除</van-button
        >
        <div v-if="$route.query.cid != null" class="blank-box"></div>
        <van-button
          class="submit-bottom"
          block
          native-type="submit"
          @click="handleSubmit"
          >确定</van-button
        >
      </div>
    </div>
  </div>
</template>

<script>
import { getCardInfo as getCardInfo5 } from "@/api/diagnosis.js";
import { accountCardEdit, deleteCardByCid } from "@/api/account.js";
import { keep_decimal_2 } from "@/utils/tools.js";
import {
  getCardInfo,
  bankList,
  cardTypeList as getCardTypeList,
  accountAdd,
} from "@/api/center.js";
export default {
  name: "editCard",
  props: {},
  data() {
    return {
      action: "add", // edit
      cardListShow: false,
      cardTypeListShow: false,
      lastRiseTimeShow: false,
      maxDate: null,
      currentDate: null,
      checkCard: false,
      cardList: [],
      cardTypeList: [],
      selectBank: {},
      selectCardType: null,
      form: {},
      bankDefaultIndex: null,
      bankTypeDefaultIndex: null,
    };
  },
  created() {
    this.userinfo = this.$store.getters.get_userinfo();
    this.query = this.$route.query;
    this.bankList();
    this.initDefaultDate();
    if (this.query.cid) {
      this.getCardInfo5();
    }
    
  },
  mounted() {},

  methods: {
    // 查询卡片信息
    getCardInfo5() {
      getCardInfo5({ cid: this.query.cid }).then((res) => {
        console.log("查询卡片信息5.0res", res);
        this.form = {
          cardNumber: res.data.cardNumber,
          quota: res.data.quota,
          availableQuota: res.data.availableQuota,
          billDate: res.data.billDate,
          repayDate: res.data.repayDate,
          lastMonthBillMoney: res.data.lastMonthBillMoney
            ? res.data.lastMonthBillMoney
            : 0,
          lastAddQuotaDate: res.data.lastAddQuotaDate,
          lastAddQuota: res.data.lastAddQuota,
        };
        this.selectBank = res.data.bank;
        this.selectCardType = res.data.cardTypeId;
        if (res.data.lastAddQuotaDate && res.data.lastAddQuota) {
          this.form.rise = true;
          // this.form.lastAddQuotaDate = res.data.lastAddQuotaDate;
          // this.form.lastAddQuota = res.data.lastAddQuota;
        }
      });
    },

    // 查询银行列表
    bankList() {
      bankList({ size: 200 }).then((res) => {
        // console.log(res.data.records)
        this.cardList = res.data.records;
        if (Object.keys(this.selectBank).length >= 0) {
          this.cardList.forEach((item, index) => {
            if (item.bankId == this.selectBank.bankId) {
              this.bankDefaultIndex = index;
            }
          });
        }
      });
    },
    // 查询卡片类型列表
    getCardTypeList() {
      getCardTypeList({ bankId: this.selectBank.bankId, size: 200 }).then(
        (res) => {
          // console.log("getCardTypeList", res.data);
          this.cardTypeList = res.data.records;
          if (Object.keys(this.selectCardType).length >= 0) {
            this.cardTypeList.forEach((item, index) => {
              // console.log(item.cardTypeId,this.selectCardType)
              if (item.cardTypeId == this.selectCardType) {
                this.bankTypeDefaultIndex = index;
                this.selectCardType = item;
              }
            });
          }
        }
      );
    },
    //初始化查询时间
    initDefaultDate() {
      const nowDate = new Date();
      const nowYear = nowDate.getFullYear();
      const currMonth = nowDate.getMonth() + 1;
      const nowMonth = currMonth < 10 ? "0" + currMonth : currMonth;
      const nowDay =
        nowDate.getDate() < 10 ? "0" + nowDate.getDate() : nowDate.getDate();
      const today = new Date(nowYear + "-" + nowMonth + "-" + nowDay);
      this.currentDate = today;
      this.maxDate = today;
    },
    //   确定选择银行列表
    cardListConfirm(item) {
      // console.log(item)
      this.selectBank = item;
      this.cardListShow = false;
      this.blurCheckCard();
    },
    //   确定选择卡类型
    cardTypeListtConfirm(item) {
      console.log("确定选择卡类型", item);
      this.selectCardType = item;
      this.cardTypeListShow = false;
    },
    // 开关是否提额
    riseChange(check) {
      this.form.rise = check;
      this.$forceUpdate();
      if (!check) {
        this.form.lastAddQuotaDate = null;
        this.form.lastAddQuota = null;
      }
      console.log(this.form.lastAddQuotaDate, this.form.lastAddQuota);
    },
    // 格式化账单日
    formatterBillDay(value) {
      if (value > 28) {
        // 可31,目前后端暂时不好计算帐单暂且28
        value = 28;
      }
      if (value < 1 && value) {
        value = 1;
      }
      return value;
    },
    // 确定上次提额时间
    lastRiseTimeConfirm(value) {
      const nowYear = value.getFullYear();
      const currMonth = value.getMonth() + 1;
      const nowMonth = currMonth < 10 ? "0" + currMonth : currMonth;
      const nowDay =
        value.getDate() < 10 ? "0" + value.getDate() : value.getDate();
      this.form.lastAddQuotaDate = nowYear + "-" + nowMonth + "-" + nowDay;
      // console.log(this.form.lastAddQuotaDate);
      this.lastRiseTimeShow = false;
    },
    // 确定表单
    handleSubmit() {
      console.log(this.form.quota)
      if (
        !this.form.cardNumber ||
        this.form.cardNumber.length < 4 ||
        this.form.cardNumber.length > 19
      ) {
        return this.$vtoast("请输入4-19位卡号");
      } else if (Object.keys(this.selectBank).length <= 0) {
        return this.$vtoast("请选择银行");
      } else if (!this.form.quota) {
        return this.$vtoast("请输入信用额度");
      }  else if (this.form.quota <= 0) {
        return this.$vtoast("信用额度必须大于0");
      }else if (!this.form.availableQuota) {
        return this.$vtoast("请输入可用额度");
      }else if (this.form.availableQuota < 0) {
        return this.$vtoast("可用额度不能为负数");
      } else if (!this.form.billDate) {
        return this.$vtoast("请输入账单日");
      } else if (!this.form.repayDate) {
        return this.$vtoast("请输入最后还款日");
      } else if ( this.form.lastMonthBillMoney && this.form.lastMonthBillMoney < 0) {
        return this.$vtoast("已消费金额不能为负数");
      } else if (this.form.rise && !this.form.lastAddQuotaDate) {
        return this.$vtoast("请输入上次提额时间");
      } else if (this.form.rise && !this.form.lastAddQuota) {
        return this.$vtoast("请输入上次提额额度");
      } else if (this.form.rise && this.form.lastAddQuota && this.form.lastAddQuota <= 0) {
        return this.$vtoast("上次提额额度必须大于0");
      }
      let form = { ...this.form };
      let data = {
        belongTypeId: 0,
        bankId: this.selectBank.bankId,
        cardTypeId: this.selectCardType ? this.selectCardType.cardTypeId : null,
        quota: form.quota,
        availableQuota: form.availableQuota,
        billDate: form.billDate,
        repayDate: form.repayDate,
        lastMonthBillMoney: form.lastMonthBillMoney,
        lastAddQuotaDate: form.lastAddQuotaDate,
        lastAddQuota: form.lastAddQuota,
        lastMonthBillMoneyOld: form.lastMonthBillMoneyOld,
        lastMonthBillFlag: form.lastMonthBillFlag
      };
      if (form.rise) {
        // console.log('form.rise',form.rise)
        // data.lastAddQuotaDate = form.lastAddQuotaDate;
        // data.lastAddQuota = form.lastAddQuota;
      }
      if (form.cardBillList) {
        data.cardBillList = form.cardBillList;
      }
      // console.log('data',data,'form',form);
      if (this.query.cid) {
        data.cid = this.query.cid;
        this.$vDialog
          .confirm({
            message:
              "确认是否修改当前信用卡的信息，修改将会导致提额、诊断数据报告产生变化",
            confirmButtonText: "是",
            cancelButtonText: "否",
          })
          .then(() => {
            accountCardEdit(data).then((res) => {
              console.log(res);
              this.$vtoast("修改成功");
              setTimeout(() => {
                this.$router.go(-1);
              }, 1000);
            });
          })
          .catch(() => {
            // on cancel
          });
      } else {
        data.cardNumber = form.cardNumber;
        accountAdd(data).then((res) => {
          this.userinfo = this.$store.getters.get_userinfo();
          this.$vtoast("添加成功");
          if (this.userinfo.type == 1) {
            setTimeout(() => {
              this.$router.go(-1);
            }, 1000);
          } else if (this.userinfo.type == 0) {
            setTimeout(() => {
              this.$router.push({
                path: "/index",
              });
            }, 1000);
          }
        });
      }
    },
    // 删除表单
    handleDelete() {
      console.log(this.form);
      this.$vDialog
        .confirm({
          message:
            "是否删除此卡? 删除将会移除账单记录、提额计划、信用诊断信息。",
          confirmButtonText: "是",
          cancelButtonText: "否",
        })
        .then(() => {
          deleteCardByCid({ cid: +this.$route.query.cid }).then((res) => {
            this.$vtoast("删除成功");
            this.$store.commit("set_billSelectCard", null);
            setTimeout(() => {
              this.$router.go(-1);
            }, 1000);
          });
        })
        .catch(() => {
          // on cancel
        });
    },

    // 查询银行卡是否已经导入过
    blurCheckCard() {
      // 游客不检查
      let userinfo = this.$store.getters.get_userinfo();
      if (userinfo && userinfo.type == 0) return;
      if (
        !this.form.cardNumber ||
        this.form.cardNumber.length < 4 ||
        Object.keys(this.selectBank).length <= 0
      )
        return;
      // 用户检测
      this.checkCard = true;
      let data = {
        phone: userinfo.phone,
        // phone: 13328943879,
        cardNumber: this.form.cardNumber,
        bankId: this.selectBank.bankId,
      };
      getCardInfo(data).then((res) => {
        console.log("getCardInfo", res);
        if (res.data) {
          this.$vDialog
            .confirm({
              title: "提示",
              message:
                "系统检测到您的卡号" +
                this.form.cardNumber.slice(
                  this.form.cardNumber.length - 4,
                  this.form.cardNumber.length
                ) +
                "有使用数据，是否直接导入",
              confirmButtonText: "是",
              cancelButtonText: "否",
            })
            .then(() => {
              // on confirm
              this.cardTypeList.forEach((item) => {
                if (item.cardTypeId == res.data.cardTypeId) {
                  this.selectCardType = item;
                }
              });
              // this.form.quota = res.data.quota;
              // this.form.availableQuota = res.data.availableQuota;
              // if (res.data.lastAddQuotaDate && res.data.lastAddQuota) {
              //   this.form.rise = true;
              //   this.form.lastAddQuotaDate = res.data.lastAddQuotaDate;
              //   this.form.lastAddQuota = res.data.lastAddQuota;
              // }
              // this.form.billDate = res.data.billDate;
              // this.form.repayDate = res.data.repayDate;
              // this.form.lastMonthBillMoney = res.data.lastMonthBillMoney;
              // console.log(this.form);
              // this.form.cardBillList = res.data.cardBillList;



              this.form = {
                ...this.form,
                quota: res.data.quota ? res.data.quota: null,
                availableQuota: res.data.availableQuota ? res.data.availableQuota : null,
                rise: res.data.lastAddQuotaDate && res.data.lastAddQuota ? true : false,
                lastAddQuotaDate: res.data.lastAddQuotaDate ? res.data.lastAddQuotaDate : null,
                lastAddQuota: res.data.lastAddQuota ? res.data.lastAddQuota : null,
                billDate: res.data.billDate ? res.data.billDate : null,
                repayDate: res.data.repayDate ? res.data.repayDate : null,
                lastMonthBillMoney: res.data.lastMonthBillMoney ? res.data.lastMonthBillMoney : null,
                cardBillList: res.data.cardBillList ? res.data.cardBillList : null,
                lastMonthBillMoneyOld: res.data.lastMonthBillMoneyOld,
                lastMonthBillFlag: res.data.lastMonthBillFlag,
              }
              
              // this.$forceUpdate();
            })
            .catch(() => {
              // on cancel
            });
        }
      });
    },

    input_quota() {
      console.log(this.form.quota);
    },
    // 过滤判断除去小数点8位数
    formatter(value){
      if(!value){
        return null
      }
      let v = keep_decimal_2(value)
      console.log(v)
      return v
    }
  },
  watch: {
    selectBank(newValue, oldValue) {
      this.selectBank = newValue;
      this.getCardTypeList();
    },
  },
};
</script>

<style lang="less" scoped>
.box {
  background-color: #f3f3f3;
  min-height: 100vh;
  padding-top: 10px;
}
.cell-group-box {
  background-color: white;
  padding-bottom: 50px;
  //   margin-top: 20px;
  /deep/ .van-cell {
    padding: 13px 20px !important;
  }
  /deep/ .van-field__label,
  /deep/ .van-cell__title {
    font-size: 14px;
    font-family: PingFang SC;
    font-weight: 500;
    color: #212121;
  }
  /deep/ .van-field__value,
  /deep/ .van-cell__value {
    font-size: 14px;
    font-family: PingFang SC;
    font-weight: 500;
    color: #666666;
  }
  .bank-name-box {
    display: flex;
    //   align-items: center;
    .bank-img {
      margin-top: -3px;
      margin-right: 10px;
    }
  }
  .rise-switch {
    height: 45px;
    width: 110px;
    /deep/ .ant-switch-inner {
      font-size: 28px;
    }
  }
  /deep/ .ant-switch-loading-icon,
  .ant-switch::after {
    height: 37px;
    width: 37px;
  }
  .bill-day {
    .right-font {
      color: #212121;
    }
    .month-font {
      position: absolute;
      margin-left: -120px;
    }
    /deep/ .van-field__control {
      font-size: 14px;
      font-family: PingFang SC;
      font-weight: 500;
      color: #4475fe;
    }
  }
}
.have-account-div {
  margin-top: 20px;
  padding: 13px 20px;
  height: 60px;
  .have-account-a {
    float: right;
    font-size: 28px;
    font-family: PingFang SC;
    font-weight: 500;
    color: #4475fe;
  }
}
.submit-box{
  width: 92%;
  margin-top: 22vh;
  // position: relative;
}
</style>