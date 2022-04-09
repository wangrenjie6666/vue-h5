<!-- 额度诊断 -->
<template>
  <div class="lines-box">
    <div class="lines-panel">
      <!-- 预期提额诊断结果 -->
      <div class="lines-panel__hd">
        <div class="panel-tit__bd">预期提额诊断结果</div>
        <!-- <span class="panel-tit__ft">上次提额时间:{{ datareport.forecast.proDate }}</span> -->
      </div>
      <!-- 预测提额率 -->
      <div class="predict__bd">
        <div class="lines-panel__hd te__hd">
          <div class="panel-tit__bd te_hd_tit">预测提额率</div>
          <span class="panel-tit__ft te_ft"
            >{{ datareport.forecastProPercent }}%</span
          >
        </div>
        <div class="predict__jd">
          <LineProgress
            :cur="datareport.forecastProPercent"
            :height="15"
            :radius="8"
          />
        </div>
        <div class="predict__tip">
          <span>0%</span>
          <span>10%</span>
          <span>20%</span>
          <span>30%</span>
          <span>40%</span>
          <span>50%</span>
          <span>60%</span>
          <span>70%</span>
          <span>80%</span>
          <span>90%</span>
          <span>100%</span>
        </div>
      </div>
      <!-- 预提时间 -->
      <div class="predict__bd">
        <div class="lines-panel__hd te__hd">
          <div class="panel-tit__bd te_hd_tit">
            预提时间<span class="pre-time-tips-666"
              >（仅供参考，不代表一定能提额）</span
            >
          </div>
        </div>
        <div class="predict__time">
          <div class="date_box">
            <span>{{
              datareport.forecastQuotaProDate
                ? new Date(datareport.forecastQuotaProDate).getFullYear()
                : '0000'
            }}</span
            >&nbsp;年&nbsp;
            <span>{{
              datareport.forecastQuotaProDate
                ? new Date(datareport.forecastQuotaProDate).getMonth() + 1
                : '00'
            }}</span
            >&nbsp;月&nbsp;
            <span>{{
              datareport.forecastQuotaProDate
                ? new Date(datareport.forecastQuotaProDate).getDate()
                : '00'
            }}</span
            >&nbsp;日&nbsp;
          </div>
        </div>
        <!-- 预计下期 -->
        <div class="predict-box">
          <div class="predict-box-item">
            <span class="item-i-box"
              ><i class="qw-icon qw-icon-lingxing"></i>
              <div class="line-dashed"></div>
              <i class="qw-icon qw-icon-yuandianda"></i
            ></span>
            <p class="item-tips">
              <!-- <div>{{datareport.forecastNextMaxPro}}</div> -->
              预计下期最高可提至{{
                returnFloat(datareport.forecastNextMaxPro)
              }}元。
            </p>
          </div>
          <div class="predict-box-item">
            <span class="item-i-box"
              ><i class="qw-icon qw-icon-lingxing"></i>
              <div class="line-dashed"></div>
              <i class="qw-icon qw-icon-yuandianda"></i
            ></span>
            <p class="item-tips">
              预计下期可提至{{ returnFloat(datareport.forecastNextPro) }}元。
            </p>
          </div>
          <div class="predict-box-item">
            <span class="item-i-box"
              ><i class="qw-icon qw-icon-lingxing"></i>
              <div class="line-dashed"></div>
              <i class="qw-icon qw-icon-yuandianda"></i
            ></span>
            <p class="item-tips">
              当前卡片额度{{ returnFloat(reportdata.creditCard.quota) }}元。
            </p>
          </div>
          <div class="highest-predict-tips pre-tips">
            {{ returnFloat(datareport.forecastNextMaxPro) }}
          </div>
          <div class="predict-tips pre-tips">
            {{ returnFloat(datareport.forecastNextPro) }}
          </div>
          <div class="current-tips pre-tips">
            {{ returnFloat(reportdata.creditCard.quota) }}
          </div>
        </div>
        <div class="preditc__item">
          <div class="preditc__item_l">
            <img src="~@/assets/img/y1.png" />
          </div>
          <div class="preditc__item_r">
            <div class="time_progress_tit">
              预计下期可提至{{ returnFloat(datareport.forecastNextPro) }}
            </div>
            <div class="time_progress_box">
              <LineProgress
                :cur="
                  (returnFloat(datareport.forecastProPercent) /
                    datareport.forecastMaxProPercent) *
                  100
                "
                :showDot="true"
              />
            </div>
            <div class="periodtime">
              <span class="periodtime_l"
                >当前卡片额度{{
                  returnFloat(reportdata.creditCard.quota)
                }}</span
              >
              <span class="periodtime_r"
                >预计最高可提至{{
                  returnFloat(datareport.forecastNextMaxPro)
                }}</span
              >
            </div>
          </div>
        </div>
        <!-- 用卡大于12个月 -->
        <!-- <div class="preditc__item">
          <div class="preditc__item_l">
            <img src="~@/assets/image/y2.png" />
          </div>
          <div class="preditc__item_r">
            <div class="time_progress_tit">用卡大于{{ datareport.average.useMonth }}个月</div>
            <div class="time_progress_box">
              <div class="time_progress" :style="{'width': dfw + '%'}"></div>
              <div class="time_progress_act" :style="{'left': dfw + '%'}"></div>
            </div>
            <div class="periodtime">
              <span class="periodtime_l">{{ datareport.average.beginMonth }}起</span>
              <span class="periodtime_r">{{ datareport.average.endMonth }}</span>
            </div>
          </div>
        </div>-->
        <!-- 月平均消费54% -->
        <div class="preditc__item">
          <div class="preditc__item_l">
            <img src="~@/assets/img/y3.png" />
          </div>
          <div class="preditc__item_r">
            <div
              class="time_progress_tit"
              v-text="
                `月平均消费${
                  datareport.quotaRatioInformation.quotaRatioOfYear <= 0
                    ? 0
                    : returnFloat(
                        datareport.quotaRatioInformation.quotaRatioOfYear
                      )
                }%`
              "
            ></div>
            <div class="time_progress_box">
              <LineProgress
                :cur="
                  datareport.quotaRatioInformation.quotaRatioOfYear <= 0
                    ? 0
                    : returnFloat(
                        datareport.quotaRatioInformation.quotaRatioOfYear
                      )
                "
                :showDot="true"
              />
            </div>
            <div class="periodtime">
              <span class="periodtime_l">月平均消费额度</span>
              <span class="periodtime_r">总额度</span>
            </div>
          </div>
        </div>
        <md-cell-item>
          <div slot="default">
            当前银行全国平均卡片额度为
            <span class="blue"
              >{{
                returnFloat(reportdata.creditCard.tBank.averageQuota)
              }}元</span
            >,您的额度
            <span class="blue"
              >{{ returnFloat(reportdata.creditCard.quota) }}元</span
            >,当前银行最高授权额度为
            <span class="blue">{{
              returnFloat(reportdata.creditCard.tBank.maxQuota)
            }}</span
            >元。
          </div>
        </md-cell-item>
        <md-cell-item
          class="linkblue"
          title=" "
          addon="免费获取信用资产打造方案"
          @click="jumpToSer"
          arrow
          no-border
        />
      </div>
    </div>
    <!-- 当前银行提额主要规则 -->
    <div class="lines-panel">
      <div class="lines-panel__hd">
        <div class="panel-tit__bd">当前银行提额主要规则</div>
      </div>
      <div class="rules_box">
        <md-cell-item
          v-for="iterules in datareport.bankRules"
          :key="iterules.rid"
          :title="`${iterules.title}`"
        >
          <div class="ico" slot="left"></div>
        </md-cell-item>
      </div>
      <md-cell-item
        class="linkblue"
        title=" "
        addon="更多规则请联系专属管家"
        @click="jumpToSer"
        arrow
        no-border
      />
    </div>
    <!-- 信用卡逾期数据 -->
    <div class="lines-panel">
      <div class="lines-panel__hd">
        <div class="panel-tit__bd">信用卡逾期数据</div>
      </div>
      <div class="linef-box">
        <md-cell-item>
          <div slot="default">
            诊断结果:近1年疑似逾期
            <span style="color: #ff0000">{{ datareport.overdueTime }}</span
            >次
            <p style="font-size: 0.24rem; color: #858b9c; margin-top: 5px">
              建议:{{ datareport.quotaDiagAdvise }}
            </p>
          </div>
        </md-cell-item>
      </div>
      <md-cell-item>
        <div slot="default">通过账单获取,具体请参考银行账单数据</div>
      </md-cell-item>
      <div class="rules_box">
        <md-cell-item
          v-for="(records, index) in datareport.monthOverdue"
          :key="index"
          :title="`${records.month}`"
        >
          <span
            slot="right"
            :style="{ color: records.isOverdue === 1 ? '#FF0000' : '#212121' }"
            >{{ records.mark }}</span
          >
        </md-cell-item>
      </div>
    </div>
    <!-- 额度使用率 -->
    <div class="lines-panel">
      <div class="lines-panel__hd">
        <div class="panel-tit__bd">额度使用率</div>
      </div>
      <div>
        <div class="tyes_hd_bg">
          <canvas ref="cvs"></canvas>
        </div>
      </div>
      <div class="tipse">
        管理师建议：{{ datareport.quotaRatioInformation.ratioAdvise }}
      </div>
      <div class="rules_box">
        <md-cell-item title="每月使用明细">
          <span slot="right">使用率</span>
        </md-cell-item>
        <md-cell-item
          :title="item.month"
          v-for="(item, index) in datareport.quotaRatioInformation
            .monthlyQuotaRatio"
          :key="index"
        >
          <span slot="right" class="bluecolor">{{ item.percent }}%</span>
        </md-cell-item>
      </div>
    </div>
    <!-- 额度变动历史 -->
    <div
      class="lines-panel"
      v-if="reportdata.creditCard.quotaChangeList.length > 0"
    >
      <div class="lines-panel__hd">
        <div class="panel-tit__bd">额度变动历史</div>
      </div>
      <div class="rules_box">
        <div class="rules_tit">固定额度变动历史</div>
        <div class="turoxo">
          <div class="tureox_tiem">时间</div>
          <div class="tureox_flex">提降额</div>
          <div class="tureox_num">总额度</div>
        </div>
        <div
          class="turoxo"
          v-for="(items, index) in reportdata.creditCard.quotaChangeList"
          :key="index"
        >
          <div class="tureox_tiem">
            {{ items.changeTime.slice(0, 4) }}年{{
              items.changeTime.slice(5, 7)
            }}月
          </div>
          <div class="tureox_flex">
            <span
              :style="{ color: items.changeType != 2 ? '#00C209' : '#FF0000' }"
              >额度{{ items.changeType != 2 ? '+' : '-'
              }}{{ returnFloat(items.balance) }}</span
            >
            <div
              class="tureox_pars"
              :style="{
                backgroundColor: items.changeType != 2 ? '#00C209' : '#FF0000',
              }"
            ></div>
          </div>
          <div class="tureox_num">{{ returnFloat(items.quota) }}</div>
        </div>
      </div>
      <!-- <div class="rules_box" v-if="datareport.templimit_history.length > 0">
        <div class="rules_tit">
          临时额度变动历史
        </div>
        <div class="turoxo">
          <div class="tureox_tiem">时间</div>
          <div class="tureox_num">临时额度</div>
        </div>
        <div class="turoxo" v-for="(items, index) in datareport.templimit_history" :key="index">
          <div class="tureox_tiem">{{ items.year }}年{{ items.month }}月</div>
          <div class="tureox_num green">{{items.quota}}</div>
        </div>
      </div> -->
    </div>
    <div class="footer">
      数据如有误，请参考官网
      <br />此报告解释权归期望管家
    </div>
  </div>
</template>

<script>
import { returnFloat, formatDate } from "@/utils/dom";
import { DotTickDashboard } from "@/components/common/dashboard.js";
import LineProgress from "@/components/common/progress.vue";
export default {
  components: {
    LineProgress,
  },
  name: "Lines",
  props: {
    reportdata: {
      type: Object,
      default: () => ({}),
    },
  },
  data () {
    return {
      // datareport: JSON.parse(window.localStorage.getItem('diagreport') || null),
      dfw: "15",
      dashboard: null,
      dashboardIsUpdate: false,
    };
  },
  watch: {
    reportdata: {
      handler () {
        this.dashboard &&
          this.dashboard.update(
            this.datareport.quotaRatioInformation.quotaRatioOfYear
          );
      },
      deep: true,
    },
  },
  computed: {
    datareport () {
      return this.reportdata.quotaDiagReport;
    },
  },
  mounted () {
    this.$nextTick(this.initDashboard);
  },
  beforeDestroy () {
    this.dashboard.stopNow();
    document
      .querySelector(".route-transition-content")
      .removeEventListener("scroll", this.updateDashboard);
  },
  methods: {
    returnFloat,
    formatDate,
    jumpToSer () {
      window.location.href = "tel://0591 87718115";
    },
    initDashboard () {
      this.dashboard = new DotTickDashboard({
        canvas: this.$refs.cvs,
        value: this.datareport.quotaRatioInformation.quotaRatioOfYear,
        desc: "近1年使用率",
        unit: "%",
        toFixed: 1,
      });
      this.scrollUpdateDashboard();
    },
    scrollUpdateDashboard () {
      document
        .querySelector(".route-transition-content")
        .addEventListener("scroll", this.updateDashboard);
    },
    updateDashboard () {
      const { top, height } = this.dashboard.canvas.getBoundingClientRect();
      const clientHeight = document.documentElement.clientHeight;
      if (!this.dashboardIsUpdate && clientHeight - height / 10 >= top) {
        this.dashboard.update({
          value: this.datareport.quotaRatioInformation.quotaRatioOfYear,
          index: 0,
        });
        this.dashboardIsUpdate = true;
      }
      if (top > clientHeight) {
        this.dashboardIsUpdate = false;
      }
    },
  },
};
</script>
<style lang="scss">
.preditc__item_l img {
  width: 100%;
}
.te_hd_tit {
  vertical-align: middle;
}
//仅供参考。。。
.pre-time-tips-666 {
  font-size: 25px;
  font-family: Source Han Sans CN;
  font-weight: 400;
  color: #666666;
}
//柱状图模块
.predict-box {
  height: 280px;
  box-sizing: border-box;
  background: url('../../../../assets/img/zhuzhuangtu.png') no-repeat;
  background-size: 230px 250px;
  background-position: right bottom;
  padding: 20px 0;
  margin-bottom: 50px;
  position: relative;
  //每行样式
  .predict-box-item {
    display: flex;
    flex-direction: column;
    margin-top: 20px;
  }
  //虚线
  .item-i-box {
    font-size: 8px;
    line-height: 16px;
    display: flex;
    align-items: center;
    .line-dashed {
      height: 1px;
      width: 83%;
      border-top: 1px dashed #666666;
    }
    .qw-icon-lingxing {
      font-size: 18px;
    }
    .qw-icon-yuandianda {
      font-size: 18px;
    }
  }
  .predict-box-item:nth-of-type(2) {
    margin-top: 30px;
    .line-dashed {
      width: 69%;
    }
  }
  .predict-box-item:nth-of-type(3) {
    margin-top: 30px;
    .line-dashed {
      width: 56%;
    }
  }
  //预测字样
  .item-tips {
    font-size: 25px;
    font-family: Source Han Sans CN;
    font-weight: 400;
    color: #212121;
    line-height: 36px;
  }
  //柱状图-金额
  .pre-tips {
    font-size: 21px;
    font-family: Source Han Sans CN;
    font-weight: 400;
    color: #ff0000;
    text-align: right;
    position: absolute;
  }
  .highest-predict-tips {
    right: 0px;
    top: 0px;
  }
  .predict-tips {
    right: 80px;
    top: 80px;
  }
  .current-tips {
    right: 170px;
    top: 160px;
  }
}
</style>
