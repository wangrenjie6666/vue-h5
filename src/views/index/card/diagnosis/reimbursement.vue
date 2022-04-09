<!--还款诊断-->
<template>
  <div>
    <!-- 整体还款指数评分 -->
    <div class="lines-panel">
      <div class="lines-panel__hd">
        <div class="panel-tit__bd">整体还款指数评分</div><span class="panel-tit__ft">{{ datareport.repaymentDiagGrade }}</span>
      </div>
      <div class="predict__bd">
        <div class="lines-panel__hd te__hd">
          <div class="panel-tit__bd te_hd_tit">还款指数</div><span class="panel-tit__ft te_ft">{{ datareport.repaymentDiagScore }}</span>
        </div>
        <div class="predict__jd">
          <LineProgress
            :cur="datareport.repaymentDiagScore"
            :height="15"
          />
        </div>
        <div class="predict__tip">
          <span>0</span>
          <span>10</span>
          <span>20</span>
          <span>30</span>
          <span>40</span>
          <span>50</span>
          <span>60</span>
          <span>70</span>
          <span>80</span>
          <span>90</span>
          <span>100</span>
        </div>
      </div>
    </div>
    <!-- 还款日期分析 -->
    <div class="lines-panel">
      <div class="lines-panel__hd">
        <div class="panel-tit__bd">还款日期分析</div>
      </div>
      <div class="flextwo">
        <div class="tureox_tiem">
          <div class="placeholder">
            <div class="media-box__bd">
              <p>{{ datareport.beforeBillDateRepaymentTime }}次</p>
              <p>账单日前还款</p>
            </div>
          </div>
        </div>
        <div class="tureox_tiem">
          <div class="placeholder">
            <div class="media-box__bd">
              <p>{{ datareport.afterBillDateRepaymentTime }}次</p>
              <p>账单日后还款</p>
            </div>
          </div>
        </div>
      </div>
      <div class="tipse">
        管理师建议:{{ datareport.repaymentDiagAdvise ? datareport.repaymentDiagAdvise : '偶尔在账单日前还款有助于降低负债实现提额'}}
      </div>
    </div>
    <!-- 还款笔数分析 -->
    <div class="lines-panel">
      <div class="lines-panel__hd">
        <div class="panel-tit__bd">还款笔数分析</div>
      </div>
      <div class="lines-panel__hd te__hd">
        <div class="panel-tit__bd te_hd_tit">每月还款笔数分析</div>
      </div>
      <div class="rules_box">
        <div class="turoxo md-cell-item-border" v-for="(item, index) in datareport.monthRepaymentData" :key="index">
            <div class="tureox_tiem color666">{{ item.date}}</div>
            <div class="tureox_flex">
              <span>还款{{ item.repaymentTime }}笔</span>
            </div>
            <div class="tureox_num">消费{{ reportdata.consumptionDiagReport.monthDataList[index].count }}笔</div>
        </div>
      </div>
      <div class="tipse">
        管理师建议：{{ datareport.repaymentDateAdvise ? datareport.repaymentDateAdvise : '尽量每次还款不能超过3次，否则银行会认定您资产较低'}}
      </div>
    </div>
    <!-- 还款金额分析 -->
    <div class="lines-panel">
      <div class="lines-panel__hd">
        <div class="panel-tit__bd">还款金额分析</div>
      </div>
      <div class="flextwo">
        <div class="tureox_tiem">
          <div class="placeholder" style="background: #FEA100;">
            <div class="media-box__bd">
              <p>{{ datareport.repaymentMoneyGrade }}</p>
              <p>最近一年</p>
            </div>
          </div>
        </div>
        <div class="tureox_tiem">
          <div class="placeholder">
            <div class="media-box__bd">
              <p>{{ datareport.inFullRepaymentTime }}次</p>
              <p>全额还款</p>
            </div>
          </div>
        </div>
        <div class="tureox_tiem">
          <div class="placeholder">
            <div class="media-box__bd">
              <p>{{ datareport.minimumRepaymentTime }}次</p>
              <p>最低还款</p>
            </div>
          </div>
        </div>
        <div class="tureox_tiem" >
          <div class="placeholder" style="background: #FF0000;">
            <div class="media-box__bd">
              <p>{{ reportdata.quotaDiagReport.overdueTime }}次</p>
              <p>近一年逾期</p>
            </div>
          </div>
        </div>
      </div>
      <div class="lines-panel__hd te__hd">
        <div class="panel-tit__bd te_hd_tit">还款金额明细</div>
      </div>
      <div class="rules_box">
        <div class="turoxo md-cell-item-border" v-for="(item, index) in datareport.monthRepaymentData" :key="index">
            <div class="tureox_tiem color666">{{ item.date }}</div>
            <div class="tureox_flex">
              <span>{{ item.repaymentType == 1 ? '最低还款' : item.repaymentType == 2 ? '全额还款': '还款'}}{{ item.repaymentTime }}笔</span>
            </div>
            <div class="tureox_num">{{ returnFloat(item.repaymentMoney) }}</div>
        </div>
      </div>
      <div class="tipse">
        管理师建议：{{datareport.repaymentMoneyAdvise ? datareport.repaymentMoneyAdvise : '尽量还款金额不要都太低，否则银行会认定您资产较低'}}
      </div>
    </div>
    <!-- 分期数据 -->
    <!-- <div class="lines-panel">
      <div class="lines-panel__hd">
        <div class="panel-tit__bd">分期数据</div>
      </div>
      <md-cell-item>
        <span slot="default" class="bluecolor">日期</span>
        <span slot="right" class="regcolor">{{datareport.repayment.stages.times}}笔</span>
      </md-cell-item>
      <div v-for="(item, index) in datareport.repayment.stages.monthData" :key="index">
        <md-cell-item :title="item.month" addon="8365.00" @click="toggle(index)" >
          <div slot="right">
            <span class="regcolor">{{ item.isStages ? `分期金额${item.money}元` : '无分期'}}</span>
            <i class="qw-icon qw-icon-arrow-done" />
          </div>
        </md-cell-item>
        <div class="toggle_box tebox_hd" v-if="item.hide && item.isStages">
           <ul>
             <li class="tebox">
               <div class="tebox_item"><span class="orangecolor">{{ item.money }}元</span><span>{{ item.detail[0].statu == 1 ? '正常' : '逾期' }}</span><span class="bluecolor">{{  item.detail[0].nowNumber }}/{{  item.detail[0].totalNumber }}期</span></div>
               <div class="tebox_item"><span>本期应还</span><span class="regcolor">{{ item.detail[0].needRepay }}元</span><span><md-button type="warning" size="small" inline round>{{ repayStatu == 1 ? '已还款': '未还款'}}</md-button></span></div>
               <div class="tebox_item"><span>本期到期还款日</span><span>{{  item.detail[0].repayDate }}</span><span>{{  item.detail[0].realDate }}</span></div>
             </li>
           </ul>
        </div>
      </div>
      <div class="tipse">
        管理师建议：{{ datareport.repayment.stages.proposal ? datareport.repayment.stages.proposal : '建议一年1-2次分期还款，有助于提额'}}
      </div>
    </div> -->
    <!-- 额度保留率 -->
    <div class="lines-panel">
      <div class="lines-panel__hd">
        <div class="panel-tit__bd">额度保留率</div>
      </div>
      <div>
        <div class="tyes_hd_bg">
          <canvas ref="cvs"></canvas>
        </div>
      </div>
      <div class="tipse">提额建议：{{ datareport.quotaRetentionRateInformation.ratioAdvise }}</div>
      <div class="rules_box">
        <md-cell-item title="每月保留明细">
          <span slot="right">保留率</span>
        </md-cell-item>
        <md-cell-item
          v-for="(records, index) in datareport.quotaRetentionRateInformation.monthlyQuotaRatio"
          :key="index"
          :title="`${records.month}`"
        >
          <span slot="right" :style="{color: '#008FFE'}">{{ records.percent}}%</span>
        </md-cell-item>
      </div>
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
    LineProgress
  },
  name: 'Reimbursement',
  props: {
    reportdata: {
      type: Object,
      default: () => ({})
    },
  },
  data () {
    return {
      dashboard: null,
      dashboardIsUpdate: false
      // datareport: JSON.parse(window.localStorage.getItem('diagreport') || null),
    };
  },
  watch: {
    reportdata: {
      handler () {
        this.dashboard 
          &&this.dashboard.update(this.datareport.quotaRetentionRateInformation.quotaRatioOfYear);
      },
      deep: true
    }
  },
  mounted () {
    this.$nextTick(this.initDashboard);
  },
  beforeDestroy() {
    this.dashboard.stopNow();
    document.querySelector('.route-transition-content').removeEventListener('scroll', this.updateDashboard);
  },
  computed: {
    datareport () {
      return this.reportdata.repaymentDiagReport;
    }
  },
  methods: {
    returnFloat,
    formatDate,
    initDashboard () {
      this.dashboard = new DotTickDashboard({
        canvas: this.$refs.cvs,
        value: this.datareport.quotaRetentionRateInformation.quotaRatioOfYear,
        desc: '近1年保留率',
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
          value: this.datareport.quotaRetentionRateInformation.quotaRatioOfYear,
          index: 0
        });
        this.dashboardIsUpdate = true;
      }
      if (top > clientHeight) {
        this.dashboardIsUpdate = false;
      }
    }
  },
};
</script>
<style scoped lang="scss">
.qw-icon-arrow-done{
  font-size: 12px;
}
.color666{
  color: $color-666 ;
}
.tebox_hd{
  font-size: $font-size-28;
  margin: 0 -30px;
  border-radius: 0;
  padding: 20px 30px;
  .tebox_item{
    display: flex;
    align-items: center;
    padding: 10px 0;
    span{      
      &:nth-child(1){
        flex: 1;
      }
      &:nth-child(2){
        text-align: center;
        width: 190px;
      }
      &:last-child{
        text-align: right;
        width: 190px;
      }
    }
    
  }
}
</style>
