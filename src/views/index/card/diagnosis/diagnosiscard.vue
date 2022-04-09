<!--信用卡诊断-->
<template>
  <!-- <router-layout class="container"> -->
  <!-- <nav-bar
      title="信用卡诊断"
      :placeholder="true"
      left-arrow
      @click-left="back"
    /> -->
  <div class="box-big">
    <div class="container-box">
      <div class="qr-scanner">
        <div class="box">
          <div class="line"></div>
          <div class="angle"></div>
        </div>
        <div
          v-if="diagnosiscard.bank"
          class="carbox"
          :style="{
            backgroundColor: diagnosiscard.bank.bankBg,
            backgroundImage: 'url(' + diagnosiscard.bank.iconBg + ')',
          }"
        >
          <div class="diagcar_hd">
            <div class="diagcar_left">
              <div class="img-wrapper">
                <img :src="diagnosiscard.bank.bankIcon" />
              </div>
              {{ diagnosiscard.bank.bankName }}
            </div>
          </div>
          <div class="diagcar_number">
            {{ diagnosiscard.cardNumber | numm }}
          </div>
        </div>
      </div>
      <!-- <div class="md-example-child md-example-child-progress">
        <md-progress
          :value="progressvalue"
          :width="10"
          :size="100"
          :rotate="-90"
          color="#5eabf7"
          transition
        >
          <span class="progress-value">
            <md-amount
              :value="amountvalue"
              :precision="0"
              transition
            ></md-amount>%
          </span>
        </md-progress>
      </div>-->

      <div class="toas">拼命诊断中...</div>
      <div class="tosex">
        <p
          v-for="(item, index) in showList"
          :key="index"
          :class="{ ishow: showTime > index && showTime < index + 16 }"
        >
          {{ item }}
        </p>
        <!-- <p v-show="showTime>1">诊断卡片当前信用额度...</p>
        <p v-show="showTime>2">诊断卡片逾期数据...</p>
        <p v-show="showTime>3">诊断卡片还款方式...</p>-->
        <!-- <p>诊断每月还款笔数</p>
        <p>诊断消费方式</p>
        <p>诊断支付方式</p>
        <p>诊断电子支付</p>
        <p>诊断POS支付</p>
        <p>诊断其它支付</p>
        <p>诊断每月额度使用率</p>
        <p>诊断近1年额度使用率</p>
        <p>诊断积分数据</p>
        <p>开始评估卡片分值</p>
        <p>开始预测下期提额时间</p>
        <p>开始预测下期可升额度</p>
        <p>开始预测最高可提额度</p>
        <p>开始计算提升建议</p>
        <p>正在生成报告 ……</p>
        <p>诊断报告生成成功</p>
        <p>即将跳转至诊断结果</p>-->
      </div>
    </div>
  </div>
  <!-- </router-layout> -->
</template>

<script>
import { bankcard } from "@/utils/dom";
import { getCardInfo } from "@/api/diagnosis.js";
export default {
  name: "Diagnosiscard",
  data() {
    return {
      amountvalue: 80,
      progressvalue: 0.8,
      diagnosiscard: {
      },
      showList: [
        "诊断用卡时长",
        "诊断卡片信用额度",
        "诊断卡片当前信用额度",
        "诊断卡片逾期数据",
        "诊断卡片还款方式",
        "诊断每月还款笔数",
        "诊断消费方式",
        "诊断支付方式",
        "诊断电子支付",
        "诊断POS支付",
        "诊断其它支付",
        "诊断每月额度使用率",
        "诊断近1年额度使用率",
        "诊断积分数据",
        "开始评估卡片分值",
        "开始预测下期提额时间",
        "开始预测下期可升额度",
        "开始预测最高可提额度",
        "开始计算提升建议",
        "正在生成报告...",
        "诊断报告生成成功",
        "即将跳转至诊断结果",
      ],
      showTime: null,
    };
  },
  filters: {
    numm(i) {
      return bankcard(i);
    },
  },
  beforeRouteEnter(to, from, next) {
    if (from.path.indexOf("/report") == "-1") {
      next((vm) => {
        vm.initcard();
      });
    } else {
      next((vm) => {
        vm.$router.replace({
          path: "/credit",
          query: {
            current: 2,
          },
        });
      });
    }
  },
  created(){
    this.showTime = 0;
  },
  activated() {
    // this.showTime = 0;
  },
  methods: {
    initcard() {
      let that = this;
      const { id } = this.$route.params;
      console.log('id',id)
      getCardInfo({
        cid: id,
      }).then((res) => {
        if (res) {
          console.log(res);
          that.diagnosiscard = res.data;
          that.initText();
        }
      });
      
    },
    initText() {
      let that = this;
      const { id } = this.$route.params;
      let tim = setInterval(() => {
        if (that.showTime < 23) {
          that.showTime += 0.4;
        } else {
          clearInterval(tim);
          that.$router.push({
            path: "/report/" + id,
            query: {
              diagIndex: that.$route.query.diagIndex,
              lastAddQuota: this.diagnosiscard.lastAddQuota,
              lastAddQuotaDate: this.diagnosiscard.lastAddQuotaDate,
            },
          });
        }
      }, 125);
    },
    back() {
      this.$router.back();
    },
  },
  mounted() {
    // console.log(this.$route.params.id);
    // console.log(this.Val);
  },
};
</script>

<style lang="scss">
.box-big {
  background-color: $color-background;
  min-height: 100vh;
}
.container {
  background: $color-background;

  .container-box {
    margin-bottom: 50px;
  }
}

.toas {
  color: #5eabf7;
  font-size: 31px;
  padding: 20px 30px;
}

.tosex {
  padding: 0 30px;
  font-size: 25px;
  line-height: 100%;
  color: #000;

  p:last-of-type {
    color: #5eabf7;
  }

  p {
    display: none;

    transition: ease all 0.5;
  }

  .ishow {
    display: block;
  }
}

.qr-scanner {
  background-image: linear-gradient(
      0deg,
      transparent 24%,
      rgba(32, 255, 77, 0.1) 25%,
      rgba(32, 255, 77, 0.1) 26%,
      transparent 27%,
      transparent 74%,
      rgba(32, 255, 77, 0.1) 75%,
      rgba(32, 255, 77, 0.1) 76%,
      transparent 77%,
      transparent
    ),
    linear-gradient(
      90deg,
      transparent 24%,
      rgba(32, 255, 77, 0.1) 25%,
      rgba(32, 255, 77, 0.1) 26%,
      transparent 27%,
      transparent 74%,
      rgba(32, 255, 77, 0.1) 75%,
      rgba(32, 255, 77, 0.1) 76%,
      transparent 77%,
      transparent
    );
  background-size: 3rem 3rem;
  background-position: -1rem -1rem;
  width: 100%;
  padding: 40px 0;
  position: relative;
}

.carbox {
  position: absolute;
  left: 10.8%;
  width: 540px;
  top: 84px;
  background-color: $blue;
  height: 280px;
  margin: 0 auto;
  border-radius: 20px;
  display: block;
  color: #fff;
  padding: 30px;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  background-size: 100% 100%;

  .diagcar_hd {
    display: flex;
    font-size: $font-size-32;
    justify-content: space-between;
    margin-top: -65px;
    align-items: center;
  }

  .diagcar_left .img-wrapper {
    width: 50px;
    height: 50px;
    vertical-align: middle;
    margin-right: 5px;
    border-radius: 50px;
    background-color: #fff;
    overflow: hidden;
    display: inline-block;

    img {
      width: 100%;
      height: auto;
      vertical-align: middle;
    }
  }

  .diagcar_number {
    font-size: $font-size-52;
    font-weight: bold;
    text-align-last: justify;
  }

  .diagcar_time {
    font-size: 25px;
  }
}

.qr-scanner .box {
  height: 400px;
  width: 650px;
  position: relative;
  overflow: hidden;
  border: 0.1rem solid rgba(0, 168, 255, 0.2);
  margin: 0px 0 0 6%;
  z-index: 9;
}

.qr-scanner .line {
  height: calc(100% - 2px);
  width: 100%;
  background: linear-gradient(180deg, rgba(0, 255, 51, 0) 43%, #0089ff 211%);
  border-bottom: 0.03rem solid #0c75d2;
  transform: translateY(-100%);
  animation: radar-beam 2s infinite;
  // animation-direction: alternate-reverse;
  animation-timing-function: cubic-bezier(0.53, 0, 0.43, 0.99);
  animation-delay: 0.3s;
}

.qr-scanner .box:after,
.qr-scanner .box:before,
.qr-scanner .angle:after,
.qr-scanner .angle:before {
  content: "";
  display: block;
  position: absolute;
  width: 20px;
  height: 20px;
  border: 10px solid transparent;
}

.qr-scanner .box:after,
.qr-scanner .box:before {
  top: 0;
  border-top-color: #5eabf7;
}

.qr-scanner .angle:after,
.qr-scanner .angle:before {
  bottom: 0;
  border-bottom-color: #5eabf7;
}

.qr-scanner .box:before,
.qr-scanner .angle:before {
  left: 0;
  border-left-color: #5eabf7;
}

.qr-scanner .box:after,
.qr-scanner .angle:after {
  right: 0;
  border-right-color: #5eabf7;
}

@keyframes radar-beam {
  0% {
    transform: translateY(-100%);
  }

  100% {
    transform: translateY(0);
  }
}

.md-example-child-progress {
  display: flex;
  justify-content: center;

  .md-progress {
    margin: 0 10px;
  }

  .progress-value {
    font-size: 24px;
  }
}
</style>