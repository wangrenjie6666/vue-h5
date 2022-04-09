<!--消费诊断-->
<template>
  <div>
    <!-- 整体消费诊断 -->
    <div class="lines-panel" >
      <div class="lines-panel__hd">
        <div class="panel-tit__bd">整体消费诊断</div>
      </div>
      <div class="predict__bd">
        <div class="lines-panel__hd te__hd">
          <div class="panel-tit__bd te_hd_tit">消费指数</div><span class="panel-tit__ft te_ft">{{ datareport.consumptionDiagScore }}%</span>
        </div>
        <div class="predict__jd">
          <!-- <div class="predict__jd_listn" :style="{width: datareport.consumption.amountRate + '%'}"></div> -->
          <LineProgress
            :cur="datareport.consumptionDiagScore"
            :height="15"
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
        <div style="font-size:14px; color: #FF1515;margin-top:10px;">提醒：{{ datareport.consumptionDiagAdvise }}</div>
      </div>
    </div>
    <!-- 消费金额及笔数 -->
    <div class="lines-panel">
      <div class="lines-panel__hd">
        <div class="panel-tit__bd">消费金额及笔数</div>
      </div>
      <div class="predict__bd">
        <div class="lines-panel__hd te__hd">
          <div class="panel-tit__bd te_hd_tit">最近一年消费金额及笔数</div>
         </div>
         <div class="lines-panel__hd te__hd">
          <div class="panel-tit__bd te_hd_tit">总笔数:<span style="color:#FF0000;">{{ datareport.totalCount }}</span></div>
          <div class="panel-tit__ft te_ft" style="color:#212121">总金额:<span style="color:#009126;">{{ returnFloat(datareport.totalMoney) }}</span></div>
         </div>
        <div class="deiagin_consum_hd">
          <div class="consum_hd_l">
            <div class="consum_code">{{ Math.floor(datareport.greaterThan5000Percent) }}%</div>
            <div class="consum_code">{{ Math.floor(datareport.lessThan4999Percent) }}%</div>
            <div class="consum_code">{{ Math.floor(datareport.lessThan1000Percent) }}%</div>
          </div>
          <div class="consum_hd_r">
            <div class="consum_hd_tit">5000元以上消费{{ datareport.greaterThan5000Count }}笔。</div>
            <div class="consum_hd_tit">1000-4999元消费{{ datareport.lessThan4999Count }}笔。</div>
            <div class="consum_hd_tit">1000元以下消费{{ datareport.lessThan1000Count }}笔。</div>
          </div>
        </div>
         <div class="tipse">
        管理师建议：{{datareport.consumptionTimeAdvise}}
      </div>
      </div>
    </div>
    <!-- 消费支付方式 -->
    <div class="lines-panel" v-if="datareport.monthDataList.length">
      <!-- <div class="lines-panel__hd">
        <div class="panel-tit__bd">消费支付方式</div>
      </div>
      <div class="predict__bd">
        <div class="lines-panel__hd te__hd">
          <div class="panel-tit__bd te_hd_tit">最近一年消费金额及笔数</div>
         </div>
        <div class="deiagin_consum_hd">
          <div class="consum_hd_l consum_hd_l_box">
            <div class="consum_code consum_box">
              <p>{{ datareport.consumption.paymode.otherpay.rate }}%</p>
              <p>其他支付</p>
            </div>
            <div class="consum_code consum_box">
               <p>{{ datareport.consumption.paymode.posPay.rate }}%</p>
              <p>POS机支付</p>
            </div>
            <div class="consum_code consum_box">
               <p>{{ datareport.consumption.paymode.epay.rate }}%</p>
              <p>电子支付</p>
            </div>
          </div>
          <div class="consum_hd_r">
            <div class="consum_hd_tit">其他支付方式{{ datareport.consumption.paymode.otherpay.count }}笔，共{{ datareport.consumption.paymode.otherpay.money }}元。</div>
            <div class="consum_hd_tit">POS机支付方式{{ datareport.consumption.paymode.posPay.count }}笔，共{{ datareport.consumption.paymode.posPay.money }}元。</div>
            <div class="consum_hd_tit">电子支付方式{{ datareport.consumption.paymode.epay.rate }}笔，共{{ datareport.consumption.paymode.epay.rate }}元。</div>
          </div>
        </div>
      </div> -->
      <div class="lines-panel__hd">
        <div class="panel-tit__bd">消费支付</div>
      </div>
       <div class="lines-panel__hd te__hd">
          <div class="panel-tit__bd te_hd_tit">每月详情数据</div>
         </div>
   
      <md-cell-item title="日期" addon="消费金额(元)" />
      <div v-for="(item, index) in datareport.monthDataList" :key="index">
        <md-cell-item :title="item.date" @click="toggle(item)" >
          <div slot="right">
            <span class="regcolor">{{ returnFloat(item.money) }}</span>
            <i class="qw-icon qw-icon-arrow-done" />
          </div>
        </md-cell-item>
        <div class="toggle_box" v-if="item.hide">
           <md-cell-item>
             <div slot="default">消费共{{ item.count }}笔，电子支付{{ item.ePayCount }}笔，POS机支付{{ item.posPayCount }}笔，其他支付{{ item.otherPayCount }}笔。</div>
             <div slot="children">5000元以上消费{{ item.greaterThan5000Count }}笔，1000-4999元消费{{ item.lessThan4999Count }}笔，小于1000元消费{{ item.lessThan1000Count }}笔</div>
           </md-cell-item>
        </div>
      </div>
      <div class="tipse">
        管理师建议：{{datareport.consumptionMoneyAdvise}}
      </div>
    </div>
    <!-- 交易周期及月均数据 -->
    <div class="lines-panel">
      <div class="lines-panel__hd">
        <div class="panel-tit__bd">交易周期及月均数据</div>
      </div>
      <div class="rules_box">
        <div class="turoxo">
          <div class="tureox_tiem">统计周期</div>
          <div class="tureox_num">交易金额(元)</div>
        </div>
        <div class="turoxo">
          <div class="tureox_tiem">近1个月</div>
          <div class="tureox_flex">
            <span>{{ datareport.monthRay1.count }}笔</span>
            <div class="tureox_pars" style="backgroundColor:#0DAEFF"></div>
          </div>
          <div class="tureox_num">{{ returnFloat(datareport.monthRay1.money) }}</div>
        </div>
        <div class="turoxo">
          <div class="tureox_tiem">近3个月</div>
          <div class="tureox_flex">
            <span>{{ datareport.monthRay3.count }}笔</span>
            <div class="tureox_pars" style="backgroundColor:#0DCFFF"></div>
          </div>
          <div class="tureox_num">{{ returnFloat(datareport.monthRay3.money) }}</div>
        </div>
        <div class="turoxo">
          <div class="tureox_tiem">近6个月</div>
          <div class="tureox_flex">
            <span>{{ datareport.monthRay6.count }}笔</span>
            <div class="tureox_pars" style="backgroundColor:#730DFF"></div>
          </div>
          <div class="tureox_num">{{ returnFloat(datareport.monthRay6.money) }}</div>
        </div>
        <div class="turoxo">
          <div class="tureox_tiem">近12个月</div>
          <div class="tureox_flex">
            <span>{{ datareport.totalCount }}笔</span>
            <div class="tureox_pars" style="backgroundColor:#FFCF0D"></div>
          </div>
          <div class="tureox_num">{{ returnFloat(datareport.totalMoney) }}</div>
        </div>
        <div class="flextwo">
          <div class="tureox_tiem">
            <div class="placeholder">
              <div class="media-box__hd">
               <i class="qw-icon qw-icon-dind" style="fontSize:40px"/> 
              </div>
              <div class="media-box__bd">
                <p>月均消费笔数</p>
                <p>{{ datareport.averageTimes }}笔</p>
              </div>
            </div>
          </div>
          <div class="tureox_tiem">
            <div class="placeholder">
              <div class="media-box__hd">
               <i class="qw-icon qw-icon-jine" style="fontSize:40px"/> 
              </div>
              <div class="media-box__bd">
                <p>月均消费金额</p>
                <p>{{ returnFloat(datareport.averageMoney) }}元</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- 交易地区分析 -->
    <!-- <div class="lines-panel" v-if="Object.keys( datareport.consumption.region).length !==0 ">
      <div class="lines-panel__hd">
        <div class="panel-tit__bd">交易地区分析</div>
      </div>
      <div class="pane_zu">
        <div class="pane_zu_item" v-for="(item, index) in datareport.consumption.region.records" :key="index">
          <div class="pane_zu_box">
            <div>消费{{ item.paycount }}笔</div>
            <div class="pane_zuksl" :style="{height: item.sort === 1 ? '2.5rem;' : (item.sort == 2 ? '2rem;' : '1.5rem')}">
              <div class="pane_zuksl_end">NO.{{ item.sort }}</div>
            </div>
            <div>{{ item.title }}</div>
          </div>
        </div>
        <div class="pane_zu_item">
          <div class="pane_zu_box">
            <div>消费43笔</div>
            <div class="pane_zuksl">
              <div class="pane_zuksl_end">NO.2</div>
            </div>
            <div>厦门</div>
          </div>
        </div>
        <div class="pane_zu_item">
          <div class="pane_zu_box">
            <div>消费12笔</div>
            <div class="pane_zuksl">
              <div class="pane_zuksl_end">NO.3</div>
            </div>
            <div>南平</div>
          </div>
        </div>
      </div>
      <div class="tipse" v-if="datareport.consumption.region"> 管理师建议：{{ getProposal(datareport.consumption.region.proposal ? datareport.consumption.region.proposal : '交易地区级别高有助于提额')}} </div>
    </div> -->
    <!-- 快进快出消费 -->
    <!-- <div class="lines-panel" v-if="datareport.consumption.imex.records.length">
      <md-cell-item title="快进快出消费" />
      <div class="linef-box">
        <md-cell-item >
          <div slot="default">{{ datareport.consumption.imex.msg }}
          </div>
        </md-cell-item>
      </div>
      <div class="lines-panel__hd te__hd">
          <div class="panel-tit__bd te_hd_tit">快进快出数据</div>
      </div>
      <div class="rules_box">
      <div class="turoxo md-cell-item-border" v-for="(item, index) in datareport.consumption.imex.records" :key="index">
          <div class="tureox_tiem">{{ item.month }}</div>
          <div class="tureox_flex">
            <span class="regcolor">{{ item.statu == 0 ? '无' : '有' }}</span>
          </div>
          <div class="tureox_num tureo_num">{{ item.desc }}</div>
      </div>
    </div>
     <div class="tipse"> 管理师建议：{{ getProposal(datareport.consumption.imex.proposal ? datareport.consumption.imex.proposal : '尽量减少快进快出消费，避免被银行风控封卡或降额') }} </div>
    </div> -->
    <!-- 消费时间诊断 -->
    <div class="lines-panel">
      <div class="panel-tit__bd" style="font-size: 0.32rem;color: #000; padding-bottom: 0.32rem;">消费时间诊断</div>
      <div class="statistics">
        <div class="item">
          <i class="icon" :style="{backgroundImage: `url(${require('@/assets/img/sun.png')})`}"></i>
          <div class="name">9:00-21:00正常消费</div>
           <div class="count">{{ datareport.totalCount }}笔</div>
          <div class="money">{{ returnFloat(datareport.totalMoney) }}元</div>
        </div>
        <div class="item">
          <i class="icon" :style="{backgroundImage: `url(${require('@/assets/img/moon.png')})`}"></i>
          <div class="name">其他时间消费</div>
          <div class="count">0笔</div>
          <div class="money">0元</div>
        </div>
      </div>
      <div class="linef-box">
        <md-cell-item >
          <div slot="default">近1年9:00-21:00正常时间消费{{ datareport.totalCount }}笔，共{{ returnFloat(datareport.totalMoney) }}元；其他时间消费0笔，共0元。</div>
        </md-cell-item>
      </div>
      <div class="lines-panel__hd te__hd">
          <div class="panel-tit__bd te_hd_tit">每月消费时间明细</div>
      </div>
      <div v-for="(item, index) in datareport.monthDataList" :key="index">
        <md-cell-item :title="item.date" @click="toggle(item)" >
          <div slot="right">
            <span class="bluecolor">查看</span>
            <i class="qw-icon qw-icon-arrow-done" />
          </div>
        </md-cell-item>
        <div class="toggle_box" v-if="item.hide">
           <md-cell-item style="paddingBottom:15px">
             <div slot="default">9:00-21:00正常时间消费{{ item.count }}笔，共{{ returnFloat(item.money) }}元； 其他时间消费0笔，共0元。</div>
           </md-cell-item>
        </div>
      </div>
      <div class="tipse"> 管理师建议：正常时间09:00-21:00消费有助于提额</div>
    </div>
    <!-- 取现消费 -->
    <!-- <div class="lines-panel" v-if="Object.keys( datareport.consumption.cash).length !==0 ">
      <md-cell-item title="取现消费" />
      <div class="linef-box">
        <md-cell-item >
          <div slot="default">
            近12个月有<span class="regcolor">{{ datareport.consumption.cash.count }}</span>次取现消费，共计<span class="regcolor">{{ returnFloat(datareport.consumption.cash.money) }}</span>元；
            <p style="font-size:0.24rem;color:#858B9C;margin-top: 5px">{{ datareport.consumption.cash.msg }}</p>
          </div>
        </md-cell-item>
      </div>
      <div class="tipse"> 管理师建议：{{ getProposal(datareport.consumption.cash.proposal ? datareport.consumption.cash.proposal : '建议一年1-2次小金额取现消费，有助于提额') }}。 </div>
    </div> -->
    <!-- 境外消费 -->
    <!-- <div class="lines-panel" v-if="Object.keys(datareport.consumption.abroadpay).length !== 0">
      <md-cell-item title="境外消费" />
      <div class="linef-box">
        <md-cell-item >
          <div slot="default">
            <template v-if="datareport.consumption.abroadpay.count === 0 ">近1年无境外消费</template>
            <template v-else-if="datareport.consumption.abroadpay.count > 0">近1年有<span class="regcolor">{{ datareport.consumption.abroadpay.count }}次</span>境外消费，共计<span class="regcolor">{{returnFloat(datareport.consumption.abroadpay.money)}}</span>元；</template>
          </div>
        </md-cell-item>
      </div>
      <div class="tipse"> 管理师建议：{{ datareport.consumption.abroadpay.msg ? datareport.consumption.abroadpay.msg : '适当的境外消费，有助于强提额'}}。 </div>
    </div> -->
    <div class="footer">
      数据如有误，请参考官网
      <br />此报告解释权归期望管家
    </div>
  </div>
</template>

<script>
import { returnFloat, formatDate } from "@/utils/dom";
import LineProgress from "@/components/common/progress.vue";
export default {
  components: {
    LineProgress
  },
  name: 'Consumption',
  props: {
    reportdata: {
      type: Object,
      default: () => ({})
    }
  },
  computed: {
    datareport () {
      return this.reportdata.consumptionDiagReport;
    }
  },
  methods: {
    returnFloat,
    formatDate,
    toggle (obj) {
      obj.hide = !obj.hide; // 向这个对象中添加 hide 属性
      this.$forceUpdate();
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
  },
};
</script>
<style scoped lang="scss">
.qw-icon-arrow-done{
  font-size: 12px;
}
.tipse{
  margin-top: 30px;
  font-size: 26px;
}

.pane_zu{
  display: flex;
  .pane_zu_item{
    flex: 1;
    font-size: 14px;
    align-self: flex-end;    
    .pane_zu_box{
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      .pane_zuksl{
        height: 200px;
        background: #ddd;
        width: 50px;
        border-radius: 5px;
        position: relative;
        margin: 10px 0 20px 0;
      .pane_zuksl_end{
        border: 8px solid #fdadad;
        background: #ff7804;
        position: absolute;
        bottom: -10px;
        height: 60px;
        width: 60px;
        border-radius: 100%;
        left: -14px;
        line-height: 60px;
        color: #fff;
        font-size: 14px;
        text-align: center;
      }
      }
    }
    &:nth-child(3) .pane_zu_box .pane_zuksl{
      height: 100px;
      .pane_zuksl_end{
        border: 0.08rem solid #e1a6f9;
        background: #a115f9;
      }
    }
    &:nth-child(2) .pane_zu_box .pane_zuksl{
      height: 150px;
      .pane_zuksl_end{
        border: 0.08rem solid #a6e2f9;
        background: #159bf9;
      }
    }
  }
}

.statistics {
  display: flex;
  justify-content: space-between;
  margin-bottom: 28px;
  .item {
    font-size: 28px;
    color: #fff;
    text-align: center;
    width: 48.5%;
    background: #0DAEFF;
    border-radius: 12px;
    padding: 15px 0;
    line-height: 40px;
    .icon {
      display: block;
      width: 100px;
      height: 100px;
      margin: 10px auto 20px;
      background: center center / contain no-repeat;
    }
    .count,
    .money {
      font-size: 32px;
    }
  }
}
</style>
