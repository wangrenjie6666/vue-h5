<!-- 诊断页面 -->
<template>
  <div class="Report">
    <!-- <router-layout class="Report"> -->
    <!-- <nav-bar
      title="信用卡诊断"
      :fixed="true"
      :placeholder="true"
      z-index="200"
      left-arrow
      right-text="历史分数"
      @click-left="back"
      @click-right="clickright"
    /> -->
    <div class="dash_box">
      <md-cell-item
        :title="`${
          diagreportData.creditCard.userName
            ? diagreportData.creditCard.userName
            : phone
            ? changephone(phone)
            : ''
        }`"
        :brief="`${
          diagreportData.creditCard.tBank.bankName
        }(${diagreportData.creditCard.cardNumber.substr(
          diagreportData.creditCard.cardNumber.length - 4
        )})`"
      >
        <span class="holder" slot="left">
          <img :src="diagreportData.creditCard.tBank.bankIcon" />
        </span>
        <div slot="right" class="cell_right">
          <div class="cell_switch_tit">{{ cid }}</div>
          <div class="tag">个人信用卡</div>
        </div>
      </md-cell-item>
      <div class="dashboard-wrap">
        <canvas ref="cvs"></canvas>
      </div>
      <div class="tiem">
        时间: {{ diagreportData.diagTime }}
      </div>
    </div>
    <nav class="diagnosis-nav">
      <span
        class="nav-item"
        :class="{ active: activeComponent === item.name }"
        v-for="item in navList"
        :key="item.name"
        @click="tab(item)"
      >
        {{ item.text }}
      </span>
    </nav>
    <div class="components-wrap">
      <transition :name="direction">
        <component
          class="component"
          :is="activeComponent"
          :reportdata="diagreportData"
        >
        </component>
      </transition>
    </div>
    <!-- </router-layout> -->
  </div>
</template>

<script>
import { mapMutations } from "vuex";
import { changephone, formatDate } from "@/utils/dom";
import { diagByCid, reportInfo } from "@/api/diagnosis.js";
// import {
//   getHistoryDiagReport,
//   newReport
// } from "api";
import Lines from "./lines.vue"; // 额度诊断
import Consumption from "./consumption.vue"; // 消费诊断
import Reimbursement from "./reimbursement.vue"; // 还款诊断
import Other from "./other.vue"; // 其他诊断
import diagnosisDefaultData from "./diagnosisDefaultData.json";
import { TickDashboard } from "@/components/common/dashboard.js";
import { Dialog } from "mand-mobile";
// import axios from 'axios'
const CAN_NOT_DIAG_BY_NO_BILL = 20024; // 没有账单无法诊断状态码
export default {
  name: "Report",
  data() {
    return {
      open: false,
      diagreportData: {},
      isHis: null,
      hCid: null,
      cid: null,
      lastAddQuotaDate: "",
      lastAddQuota: "",
      dashboard: null,
      activeIndex: 1,
      direction: "slide-right",
      activeComponent: "Lines",
      phone: JSON.parse(window.localStorage.getItem("userinfo") || null)
        ? JSON.parse(window.localStorage.getItem("userinfo") || null).phone
        : null,
      navList: [
        {
          text: "额度诊断",
          name: "Lines",
          index: 1,
        },
        {
          text: "消费诊断",
          name: "Consumption",
          index: 2,
        },
        {
          text: "还款诊断",
          name: "Reimbursement",
          index: 3,
        },
        {
          text: "其他诊断",
          name: "Other",
          index: 4,
        },
      ],
    };
  },
  components: {
    Lines,
    Consumption,
    Reimbursement,
    Other,
  },
  beforeRouteEnter(to, from, next) {
    if (from.path.indexOf("/changehistory") == "-1") {
      next((vm) => {
        vm.diagreportData = vm.merge({}, diagnosisDefaultData);
        vm._getReport();
      });
    } else {
      next((vm) => {
        vm.diagreportData = JSON.parse(
          window.localStorage.getItem("diagreportCard") || null
        );
      });
    }
  },
  beforeRouteLeave(to, from, next){
    // console.log(to)
    if( to.path.indexOf("/diagnosiscard") != "-1"){
      next({path:'/diagnosis'});
    }else {
      next(); // 注意：这边next必须要写
    }
  },
  watch: {
    "diagreportData.diagScore": function () {
      this.dashboard.update({
        value: this.diagreportData.diagScore,
        desc: this.diagreportData.diagGrade,
      });
    },
  },
  created() {
    this.diagreportData = this.merge({}, diagnosisDefaultData);
  },
  mounted() {
    this.initDashboard();
    console.log("this.$route.query)", this.$route.query);
    console.log("this.$route.params", this.$route.params);
  },
  activated() {
    const { id } = this.$route.params;
    this.cid = id;
    this.hCid = this.$route.query.hCid ? this.$route.query.hCid : null;
    this.isHis = this.$route.query.isHis == 1;
    this.lastAddQuota = this.$route.query.lastAddQuota
      ? this.$route.query.lastAddQuota
      : null;
    this.lastAddQuotaDate = this.$route.query.lastAddQuotaDate
      ? this.$route.query.lastAddQuotaDate
      : null;
  },
  deactivated() {
    this.$destroy();
  },
  methods: {
    ...mapMutations(["set_userinfo"]),
    changephone,
    formatDate,
    initDashboard() {
      this.dashboard = new TickDashboard({
        canvas: this.$refs.cvs,
        count: 45,
        width: 160,
        speed: 1,
        linear: true,
      });
    },
    _getReport() {
      console.log('1111111111111',this.$route.query.isHis)
      const { id } = this.$route.params;
      const { hCid } = this.$route.query;
      this.$toast.loading();
      if (this.$route.query.isHis == 1) {
        let params = {
          rid: hCid,
        };
        reportInfo(params).then((res) => {
          this.diagreportData = this.merge(this.diagreportData, res.data);
            this.$toast.hide();
            window.localStorage.setItem(
              "diagreportCard",
              JSON.stringify(this.diagreportData)
            );
          // if (res.errorCode === 1) {
          //   this.diagreportData = this.merge(this.diagreportData, res.data);
          //   this.$toast.hide();
          //   window.localStorage.setItem(
          //     "diagreportCard",
          //     JSON.stringify(this.diagreportData)
          //   );
          // } else if (res.errorCode === CAN_NOT_DIAG_BY_NO_BILL) {
          //   this.$toast.hide();
          //   Dialog.alert({
          //     content: res.msg,
          //     onConfirm: this.back,
          //   });
          // }
        });
      } else {
        if (this.lastAddQuotaDate) {
          this.lastAddQuotaDate = this.getYMDHMS(this.lastAddQuotaDate);
        }
        let params = {
          cid: id,
          lastAddQuota: this.lastAddQuota,
          lastAddQuotaDateStr: this.lastAddQuotaDate,
        };
        diagByCid(params).then((res) => {
          console.log("诊断报告接口", res);
          this.diagreportData = this.merge(this.diagreportData, res.data);
            this.$toast.hide();
            window.localStorage.setItem(
              "diagreportCard",
              JSON.stringify(this.diagreportData)
            );
            let cur = Object.assign(this.$store.getters.get_userinfo, {
              diagIndex: Number(this.$store.getters.get_userinfo.diagIndex) + 1,
            });
            // console.log(cur)
        });
        // 接口先注释
        // newReport(params)
        //   .then(res => {
        //     if (res.errorCode == 1) {
        //       this.diagreportData = this.merge(this.diagreportData, res.data);
        //       this.$toast.hide();
        //       window.localStorage.setItem(
        //         "diagreportCard",
        //         JSON.stringify(this.diagreportData)
        //       );
        //       let cur = Object.assign(this.$store.getters.get_userinfo, {
        //         diagIndex: Number(this.$store.getters.get_userinfo.diagIndex) + 1,
        //       });
        //       this.set_userinfo(cur);
        //     } else if (res.errorCode === CAN_NOT_DIAG_BY_NO_BILL) {
        //       this.$toast.hide();
        //       Dialog.alert({
        //         content: res.msg,
        //         onConfirm: this.back,
        //       });
        //     }
        //   })
      }
    },
    back() {
      this.$router.go(-2);
    },
    getYMDHMS(timestamp) {
      let time = new Date(timestamp);
      let year = time.getFullYear();
      const month = (time.getMonth() + 1).toString().padStart(2, "0");
      const date = time.getDate().toString().padStart(2, "0");
      // const hours = (time.getHours()).toString().padStart(2, '0')
      // const minute = (time.getMinutes()).toString().padStart(2, '0')
      // const second = (time.getSeconds()).toString().padStart(2, '0')
      return year + "-" + month + "-" + date;
    },
    clickright() {
      const { id } = this.$route.params;
      this.$router.push({
        path: "/changehistory/" + id,
      });
    },
    merge(obj1, obj2) {
      Object.keys(obj2).forEach((key) => {
        if (typeof obj2[key] === "object" && obj2[key] !== null) {
          if (!obj1[key]) obj1[key] = obj2[key] instanceof Array ? [] : {};
          obj1[key] = this.merge(obj1[key], obj2[key]);
        } else {
          if (obj2[key] !== void 0) {
            obj1[key] = obj2[key];
          }
        }
      });
      return obj1;
    },
    tab(item) {
      this.activeComponent = item.name;
      this.direction =
        this.activeIndex > item.index ? "slide-right" : "slide-left";
      this.activeIndex = item.index;
    },
  },
};
</script>
<style lang="scss">
.Report {
  .dash_box {
    background: $blue;
    padding: 10px 40px;

    .md-cell-item-title,
    .md-cell-item-brief,
    .cell_switch_tit,
    .tag {
      color: #fff;
    }

    .cell_switch_tit {
      text-align: right;
    }

    .tag {
      margin-top: 10px;
      background: #f5a623;
      padding: 10px 10px;
      border-radius: 20px;
      font-size: 24px;
    }

    .md-cell-item-body:before {
      content: none;
    }

    .tiem {
      font-size: 25px;
      color: #fff;
      text-align: center;
      padding: 0 0 20px 0;
    }

    .holder {
      display: block;
      width: 70px;
      height: 70px;
      line-height: 70px;
      border-radius: 44px;
      background-color: #e6e6e6;
      overflow: hidden;

      img {
        width: 100%;
      }
    }
  }

  .route-transition-content {
    background: #f7f8fa;
  }

  .dash_tabs {
    .md-tab-bar {
      padding: 0 !important;
      background-color: $white !important;
    }

    .content {
      width: auto;
      padding: 30px;
    }
  }

  .footer {
    font-size: 30px;
    color: #666;
    text-align: center;
    margin-bottom: 45px;
    line-height: 40px;
  }

  .lines-panel {
    background: #fff;
    padding: 30px;
    border-radius: 20px;
    margin-bottom: 30px;

    .lines-panel__hd {
      position: relative;
      display: -webkit-box;
      display: -webkit-flex;
      display: flex;
      -webkit-box-align: center;
      -webkit-align-items: center;
      align-items: center;
      color: #212121;
      margin-bottom: 40px;

      .panel-tit__bd {
        font-size: $font-size-32;
        flex: 1;
      }

      .panel-tit__ft {
        font-size: 26px;
        color: #666666;
      }
    }

    .predict__jd {
      border-radius: 15px;
      overflow: hidden;

      .predict__jd_listn {
        background: #008ffe;
        height: 30px;
        width: 16%;
        border-radius: 15px;
        overflow: hidden;
      }
    }

    .te__hd {
      margin: 40px 0 20px 0;

      .panel-tit__bd {
        color: #008ffe;
      }

      .panel-tit__ft {
        color: #de6e00;
      }
    }

    .predict__tip {
      display: flex;
      font-size: 20px;
      justify-content: space-between;

      span {
        margin: 10px 0 0 0;
      }
    }

    .predict__time {
      display: flex;
      justify-content: center;
      margin: 40px 0;

      .date_box {
        font-size: 30px;

        span {
          display: inline-block;
          background: #000;
          color: #fff;
          padding: 10px;
          border-radius: 5px;
        }
      }
    }

    .linef-box {
      background: rgba(230, 230, 230, 1);
      margin: 0 -30px;
      padding: 0 30px;
    }

    .preditc__item {
      display: flex;
      align-items: center;
      margin: 30px 0;

      .preditc__item_l {
        background: #008ffe;
        width: 100px;
        height: 100px;
        border-radius: 100%;
      }

      .preditc__item_r {
        flex: 1;
        margin-left: 20px;

        .time_progress_box {
          border-radius: 0.1rem;
          margin: 20px 0;
          position: relative;

          .time_progress {
            position: relative;
            background: #008ffe;
            height: 20px;
            width: 50%;
            border-radius: 10px;
            display: flex;
            align-items: center;
          }

          .time_progress_act {
            position: absolute;
            width: 45px;
            height: 45px;
            background: rgba(0, 143, 254, 0.5);
            margin-left: -20px;
            margin-top: -30px;
            border-radius: 50%;

            &::before {
              content: "";
              width: 30px;
              height: 30px;
              background: rgba(0, 143, 254, 1);
              border-radius: 50%;
              position: absolute;
              left: 7px;
              top: 7px;
            }
          }
        }

        .time_progress_tit {
          color: #feb900;
          font-size: 30px;
          text-align: center;
        }

        .periodtime {
          display: flex;
          font-size: 20px;
          justify-content: space-between;

          .periodtime_r {
            text-align: end;
          }
        }
      }
    }
  }
}

.blue {
  color: $blue;
}

.linkblue {
  .md-cell-item-right,
  .md-cell-item-right .md-icon-arrow-right {
    color: $blue;
  }
}

.rules_box {
  .md-cell-item-title {
    font-size: 30px;
    color: #666666;
  }

  .md-cell-item-left {
    margin-right: 15px;

    .ico {
      width: 20px;
      height: 20px;
      background: #ddd;
      transform: rotate(45deg);
    }
  }

  :nth-child(1) .md-cell-item-body .md-cell-item-left .ico {
    background: #3db500;
  }

  :nth-child(2) .md-cell-item-body .md-cell-item-left .ico {
    background: #ff930e;
  }

  :nth-child(3) .md-cell-item-body .md-cell-item-left .ico {
    background: #0083f3;
  }

  .rules_tit {
    text-align: center;
    font-size: 35px;
    color: rgb(0, 137, 218);
    margin: 40px 0;
  }

  .turoxo {
    display: flex;
    justify-content: space-between;
    font-size: $font-size-26;
    align-items: flex-end;
    padding: 40px 0;
    position: relative;

    div {
      text-align: center;
    }

    .tureox_flex {
      flex: 1;
      padding: 0 5px;

      span {
        font-size: 26px;
      }
    }

    .tureox_tiem {
      width: 160px;
    }

    .tureox_num {
      width: 170px;
    }

    .tureo_num {
      width: 210px;
    }

    .tureox_pars {
      background: #0083f3;
      height: 20px;
      border-radius: 10px;
      margin-top: 10px;
    }

    .green {
      color: #3db500;
    }
  }

  .md-cell-item-border:before {
    content: "";
    position: absolute;
    z-index: 2;
    -webkit-transform-origin: 100% 50%;
    transform-origin: 100% 50%;
    -webkit-transform: scaleY(0.5) translateY(100%);
    transform: scaleY(0.5) translateY(100%);
    bottom: 0;
    left: 0;
    right: auto;
    top: auto;
    width: 100%;
    border-bottom: 0.02rem solid #e2e4ea;
    -webkit-transform-origin: 50% 100%;
    transform-origin: 50% 100%;
  }
}

.deiagin_consum_hd {
  display: flex;

  .consum_hd_l {
    background-image: url("~@/assets/img/xfqyd.png");
    background-size: 100%;
    background-repeat: no-repeat;
    width: 250px;
    height: 280px;
    font-size: 20px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;

    .consum_code {
      height: 100px;
      line-height: 100px;
      color: #fff;
      text-align: center;
      display: flex;
      flex-direction: column;
      justify-content: center;
    }
  }

  .consum_hd_l_box {
    background-image: url("~@/assets/img/sfxs.png");
    height: 300px;

    .consum_code {
      line-height: 30px;
    }
  }

  .consum_hd_r {
    flex: 1;

    .consum_hd_tit {
      font-size: $font-size-24;
      text-align: right;
      height: 50px;
      margin-top: 20px;
      padding-top: 25px;
      border-top: 1px dashed #ddd;
      position: relative;

      &::before {
        content: "";
        font-size: 25px;
        left: -6px;
        top: -6px;
        position: absolute;
        height: 6px;
        width: 6px;
        border-radius: 100%;
        background: #666666;
      }

      &::after {
        content: "";
        font-size: 25px;
        right: -6px;
        top: -9px;
        position: absolute;
        height: 6px;
        width: 6px;
        transform: rotate(45deg);
        background: #666666;
      }
    }

    :nth-child(1) {
      margin-left: -80px;
    }

    :nth-child(2) {
      margin-left: -40px;
    }
  }
}

.toggle_box {
  font-size: 30px;
  background: rgba(230, 230, 230, 1);
  border-radius: 12px;
  padding: 0 20px;
  line-height: 45px;

  .md-cell-item-body {
    padding-bottom: 0;
  }

  .md-cell-item-children {
    padding-top: 10px;
  }
}

.tyes_hd_bg {
  text-align: center;
}

.tipse {
  margin-top: 30px;
  font-size: 26px;
  line-height: 38px;
}

.bluecolor {
  color: $blue;
}

.regcolor {
  color: $red;
}

.orangecolor {
  color: $orange;
}

.flextwo {
  display: -webkit-box;
  display: -webkit-flex;
  display: flex;
  font-size: 14px;

  .tureox_tiem {
    -webkit-box-flex: 1;
    -webkit-flex: 1;
    flex: 1;

    .placeholder {
      margin: 0 10px;
      background: $blue;
      height: 120px;
      border-radius: 10px;
      display: -webkit-box;
      display: -webkit-flex;
      display: flex;
      -webkit-box-align: center;
      -webkit-align-items: center;
      align-items: center;
      color: #fff;
      padding: 20px;

      .qw-icon-dind,
      .qw-icon-jine {
        font-size: 55px;
      }

      .media-box__hd {
        margin-right: 16px;
        width: 60px;
        height: 60px;
        line-height: 60px;
        text-align: center;
      }

      .media-box__bd {
        -webkit-box-flex: 1;
        -webkit-flex: 1;
        flex: 1;
        min-width: 0;
        text-align: center;
        line-height: 40px;
        font-size: 24px;
      }
    }
  }
}

.dashboard-wrap {
  text-align: center;
}

.predict__jd_listn,
.time_progress,
.predict__jd_listn,
.time_progress_act {
  transition: 1s;
}

.diagnosis-nav {
  display: flex;
  height: 100px;
  line-height: 100px;
  background: #fff;
  font-size: 28px;

  .nav-item {
    flex: 1;
    text-align: center;
    padding: 0 10px;
    position: relative;

    &.active {
      color: #2f86f6;

      &:after {
        content: "";
        display: block;
        width: 80%;
        height: 4px;
        background: #2f86f6;
        position: absolute;
        bottom: 4px;
        left: 50%;
        transform: translate3d(-50%, 0, 0);
      }
    }
  }
}

.components-wrap {
  position: relative;

  .component {
    position: absolute;
    left: 0;
    top: 0;
    padding: 0.3rem;
    background-color: #f7f8fa;
    width: 100%;
    box-sizing: border-box;
  }
}
</style>