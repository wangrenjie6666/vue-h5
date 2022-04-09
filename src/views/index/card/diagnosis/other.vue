<template>
  <div id="other">
    <div class="backup" style="margin-top: 0;">
      <h2 class="common-title">
        备用金诊断
      </h2>
      <div class="backup-money">
        <span v-if="!isNaN(myData.pettyCash)">
          当前备用金：<span style="color: #f00;">{{myData.pettyCash}}</span>元
        </span>
        <span v-else>当前无备用金</span>
      </div>
      <div class="raise-space">
        <h3 class="common-subtitle">
          备用金提升空间
        </h3>
        <div class="promote">
          <div class="wrap">
            <span>全国平均此类卡备用金额度</span>
            <span class="value">{{myData.cardAverageQuota || '--'}}</span>
          </div>
          <div class="wrap">
            <span>当前银行卡最高可提升至</span>
            <span class="value">{{myData.cardHighestPro || '--'}}</span>
          </div>
          <div 
            class="advice"
            v-if="!myData.proposal"
          >
            管理师建议：暂无
          </div>
          <div 
            class="advice"
            v-else
          >
            管理师建议：
            {{ getProposal(myData.proposal) }}
          </div>
        </div>
      </div>
    </div>

    <div class="bp">
      <h2 class="common-title">
        积分诊断
      </h2>
      <div class="common-panel">
        <div class="tr-chart">
          <div class="yz">
            <span>{{ reportdata.consumptionDiagReport.totalCount || 0 }}</span>
            <span>{{ reportdata.creditCard.cardPoints || 0 }}</span>
            <span>{{ reportdata.consumptionDiagReport.totalMoney || 0 }}</span>
          </div>
          <div class="text">
            <div class="text-item">
              近12个月消费笔数
            </div>
            <div class="text-item">
              当前积分
            </div>
            <div class="text-item">
              近12个月消费金额
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 卡片负债率 -->
    <div class="lines-panel">
      <div class="lines-panel__hd">
        <div class="panel-tit__bd">卡片负债率</div>
      </div>
      <div>
        <div class="tyes_hd_bg">
          <canvas ref="cvs"></canvas>
        </div>
      </div>
      <div class="tipse">提额建议：{{ myData.quotaRatioInformation.ratioAdvise || '暂无' }}</div>
      <div class="rules_box">
        <md-cell-item title="每月负债明细">
          <span slot="right">负债率</span>
        </md-cell-item>
        <md-cell-item
          v-for="(records, index) in myData.quotaRatioInformation.monthlyQuotaRatio"
          :key="index"
          :title="`${records.month}`"
        >
          <span slot="right" :style="{color: '#008FFE'}">{{records.percent}}%</span>
        </md-cell-item>
      </div>
    </div>
    <p class="footer">
      数据如有误，请参考官网
      <br />此报告解释权归期望管家
    </p>
  </div>
</template>

<script>
import { DotTickDashboard } from "@/components/common/dashboard.js";

export default {
  props: {
    reportdata: {
      type: Object,
      default: () => ({})
    }
  },
  watch: {
    'myData.quotaRatioInformation.quotaRatioOfYear': function () {
      this.dashboard 
      && this.dashboard.update(this.myData.quotaRatioInformation.quotaRatioOfYear);
    }
  },
  computed: {
    myData () {
      return this.reportdata.otherDiagReport;
    }
  },
  data () {
    return {
      dashboard: null,
      dashboardIsUpdate: false
    };
  },
  mounted () {
    this.$nextTick(this.initDashboard());
  },
  beforeDestroy() {
    this.dashboard.stopNow();
    document.querySelector('.route-transition-content').removeEventListener('scroll', this.updateDashboard);
  },
  methods: {
    initDashboard () {
      this.dashboard = new DotTickDashboard({
        canvas: this.$refs.cvs,
        value: this.myData.quotaRatioInformation.quotaRatioOfYear,
        desc: '近1年负债率',
        unit: '%',
        toFixed: 1
      });
      this.scrollUpdateDashboard();
    },
    scrollUpdateDashboard () {
      document.querySelector('.route-transition-content').addEventListener('scroll', this.updateDashboard);
    },
    updateDashboard () {
      const { top, height } = this.dashboard.canvas.getBoundingClientRect();
      const clientHeight = document.documentElement.clientHeight;
      if (!this.dashboardIsUpdate && clientHeight - height / 10 >= top) {
        this.dashboard.update({
          value: this.myData.quotaRatioInformation.quotaRatioOfYear,
          index: 0
        });
        this.dashboardIsUpdate = true;
      }
      if (top > clientHeight) {
        this.dashboardIsUpdate = false;
      }
    },
    getProposal (proposal = '') {
      let proposalString = '';
      const proposalList = proposal.split(',');
      proposalList.forEach(item => {
        if (item.split('&')[0]) 
          proposalString += `、${item.split('&')[0]}`;
      });
      proposalString = proposalString.slice(1, proposalString.length);
      return proposalString ? proposalString : '暂无';
    }
  }
};
</script>


<style lang="scss" scoped>
@import '~@/assets/style/mixin.scss';

  #other {
    font-size: 28px;
    width: 100%;
    box-sizing: border-box;
    color: #000;
  }
  #other > div {
  background: #fff;
  margin-top: 20px;
  border-radius: 12px;
  h2, h3 { font-weight: normal; }
  .common-title {
    font-size: 32px;
    padding: 0 32px;
    height: 80px;
    line-height: 80px;
  }
  .common-subtitle {
    font-size: 28px;
    color: #008FFE;
    height: 70px;
    line-height: 70px;
    padding: 0 32px;
  }
}

.backup {
  .raise-space {
    display: block;
  } 
  .backup-money {
    background: #E6E6E6;
    padding: 24px 32px;
    font-size: 28px;
    color: #000;
  }
  .wrap {
    color: #666;
    display: flex;
    justify-content: space-between;
    height: 80px;
    line-height: 80px;
    padding: 0 32px;
    font-size: 28px;
    @include hairline(top);
    .value {
      color: #FF0000;
    }
  }
  .advice {
    padding: 24px 32px;
    line-height: 40px;
    text-align: justify;
    color: #666;
    @include hairline(top);
  }
}

.bp {
  .tr-chart {
    display: flex;
    padding: 0 32px 24px;
    .yz {
      background: url('~@/assets/img/sfxs.png') 0 0/contain no-repeat;
      width: 228px;
      height: 270px;
      display: flex;
      justify-content: space-around;
      align-items: center;
      flex-direction: column;
      box-sizing: border-box;
      &>span {
        margin-top: .1rem;
        font-size: 20px;
        color: #fff;
      }
    }
    .text {
      padding: .16rem 0 .1rem;
      text-align: right;
      flex: 1;
      display: flex;
      justify-content: space-between;
      flex-direction: column;
      align-items: flex-end;        
      .text-item {
        padding-top: 28px;
        border-top: 1px dashed #999;
        position: relative;
        @for $i from 1 to 4 {
          &:nth-of-type(#{$i}) {
            width: #{120% - 10% * $i};
          } 
        }
        &:after {
          content: '';
          display: block;
          border-radius: 50%;
          background: #999;
          z-index: 10;
          transform: translateY(-50%);
          width: 14px;
          height: 14px;
          position: absolute;
          left: 0;
          top: 0;
        }
        &:before {
          content: '';
          display: block;
          background: #999;
          z-index: 10;
          transform: translateY(-50%) rotate(45deg);
          width: 12px;
          height: 12px;
          position: absolute;
          right: 0;
          top: 0;
        }
      }
    }
  }
}
</style>
