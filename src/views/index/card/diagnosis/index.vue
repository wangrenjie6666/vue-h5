<template>
  <div class="diagnosis_box">
    <template v-if="manageCard.creditCard.total < 1">
      <div class="diagno_credit_box">
        <div class="diagno_credit">
          <md-button type="primary" size="large" @click="add_diagnosis">
            <i class="qw-icon qw-icon-addcar" />添加卡片
          </md-button>
          <div class="credit_tip">添加卡片后才可以帮您诊断</div>
        </div>
      </div>
      <div class="no_data">
        <img src="@/assets/img/nodata.png" width="30%" />
        <div class="tiptit">暂无数据</div>
      </div>
    </template>
    <template v-else>
      <div class="diagno_credit_header">
        <div class="diano_hd">
          <div class="diano_item">
            <div class="diano_item_num">
              {{ returnFloat(manageCard.quota) }}
            </div>
            <div class="diano_item_tit">总额度(元)</div>
          </div>
          <div class="diano_item">
            <div class="diano_item_num">
              {{ returnFloat(manageCard.availableQuota) }}
            </div>
            <div class="diano_item_tit">总可用(元)</div>
          </div>
        </div>
        <!-- 卡片 -->
        <div class="md-example-child-swiper-0" @touchmove.stop>
          <swiper
            ref="mySwiper"
            :options="swiperOptions"
            @ready="handleSwiperReadied"
            @slideChange="slideChangeStart"
          >
            <swiper-slide
              v-for="(item, index) in manageCard.creditCard.records"
              :key="index"
            >
              <div
                class="main-img"
                :style="{
                  backgroundColor: item.bank.bankBg,
                  backgroundImage: 'url(' + item.bank.iconBg + ')',
                }"
              >
                <div class="diagcar_hd">
                  <div class="diagcar_left">
                    <div class="img-wrapper">
                      <img :src="item.bank.bankIcon" />
                    </div>
                    {{ item.bank.bankName }}
                  </div>
                  <div class="diagcar_time">
                    绑卡时间
                    {{ item.bindTime }}
                    <!-- {{
                      manageCard.creditCard.records[cardactiveIndex].bindTime.toString()
                        | datatime
                    }} -->
                  </div>
                </div>
                <div class="diagcar_number">{{ item.cardNumber | numm }}</div>
              </div>
            </swiper-slide>
            <div class="swiper-pagination" slot="pagination"></div>
          </swiper>
        </div>
        <md-field>
          <template
            v-if="
              manageCard &&
              manageCard.creditCard &&
              manageCard.creditCard.records.length != 0
            "
          >
            <md-cell-item
              title="添加卡片时间"
              :addon="
                new Date(
                  manageCard.creditCard.records[cardactiveIndex].bindTime
                ).valueOf() | datatime
              "
            />
            <md-cell-item
              title="当前额度"
              :addon="
                manageCard.creditCard.records[cardactiveIndex].quota === null ||
                manageCard.creditCard.records[cardactiveIndex].quota === ''
                  ? '暂无数据'
                  : returnFloat(
                      manageCard.creditCard.records[cardactiveIndex].quota
                    ).toString()
              "
            />
            <md-cell-item
              title="可用额度"
              :addon="
                manageCard.creditCard.records[cardactiveIndex]
                  .availableQuota !== null &&
                manageCard.creditCard.records[cardactiveIndex]
                  .availableQuota !== ''
                  ? returnFloat(
                      manageCard.creditCard.records[cardactiveIndex]
                        .availableQuota
                    ).toString()
                  : '暂无数据'
              "
            />
          </template>
          <!-- v-if="this.isDiag" -->
          <template>
            <!-- v-if="this.isDiag.success" -->
            <md-button
              type="primary"
              size="large"
              style="margin-top: 20px"
              @click="sumtdiagnos"
              >立即诊断
            </md-button>
            <!-- <md-button
              v-else
              type="disabled"
              size="large"
              style="margin-top: 20px"
              >下次诊断：{{ this.isDiag.data.nextTime }}
            </md-button> -->
          </template>
          <!-- 历史诊断报告 -->
          <template>
            <md-cell-item title class="lszdbg_box">
              <span slot="left" class="lszdbgtit">历史诊断报告</span>
              <!-- <span slot="right">
                <md-button type="primary" size="small" plain inline style="margin-top:20px;">诊断分数统计</md-button>
              </span>-->
            </md-cell-item>
            <md-cell-item
              class="historys"
              :title="item.diagTime"
              v-for="item in Historydata"
              :key="item.hid"
            >
              <span slot="right">
                <md-button
                  type="primary"
                  size="small"
                  plain
                  inline
                  @click="
                    _Historyclick(
                      item.rid,
                      manageCard.creditCard.records[cardactiveIndex].cid
                    )
                  "
                  >查看报告</md-button
                >
              </span>
            </md-cell-item>
          </template>
        </md-field>
      </div>
    </template>

    <!-- 提示对话框 -->
    <md-dialog
      title="温馨提示"
      :closable="false"
      v-model="basicDialog.open"
      :btns="basicDialog.btns"
      onConfirm="handle"
      v-if="manageCard.creditCard && manageCard.creditCard.records.length != 0"
    >
      <div style="color: #000; padding: 0 40px; font-weight: bold">
        当前卡片数据不全，可能影响诊断数据,请尽量完善
      </div>
      <div class="md-example-child md-example-child-input-item-2">
        <div class="last-quotatime" style="margin-top: 15px">
          <div style="padding-left: 10px">上次提额时间</div>
          <div class="quota-time-choice" @click="showPopFn()">
            <div>
              <i
                class="time-icon"
                :style="{ backgroundImage: `url(${imageIcon.timeChoice})` }"
              ></i>
            </div>
            <div style="color: #666" v-if="!reyyyymm.yyyy">请选择时间</div>
            <div style="color: #666" v-else>
              {{ reyyyymm.yyyy }}-{{ reyyyymm.mm }}-{{ reyyyymm.dd }}
            </div>
          </div>
        </div>
        <div style="padding: 10px; margin-bottom: 10px">
          <md-input-item
            title="上次提额额度"
            type="bankCard"
            placeholder="请填写上次额度"
            v-model="repayForm.money"
          >
          </md-input-item>
        </div>

        <!-- </md-field> -->
      </div>
      <!-- 还款时间选择器 -->
      <md-date-picker
        ref="reDatePicker"
        v-model="reDatePicker.show"
        :title="reDatePicker.title"
        small-radius
        :custom-types="['yyyy', 'MM', 'dd']"
        :default-date="reDatePicker.currentDate"
        @confirm="reDataPickerConfirm"
      ></md-date-picker>
    </md-dialog>
    <!-- <md-popup v-model="isPopupShow">
      <div
        class="md-example-child md-example-child-date-picker md-example-child-date-picker-0"
      >
        <md-date-picker
          ref="datePicker"
          today-text="今天"
          :min-date="minDate"
          :max-date="maxDate"
          :default-date="currentDate"
          is-view
          @initialed="onDatePickerInitialed"
        ></md-date-picker>
      </div>
    </md-popup> -->
  </div>
</template>

<script>
const SUCC = 1;
const OTHER_ERROR = 20009; // 状态接口外的所有错误码
//   import {
//     manageCard,
//     getisDiag,
//     getHistory,
//     getPayUrl,
//     editCardInfo,
//     // refreshCard
//     // getgoodslist,
//     // getpayment,
//     // postwxPay
//   } from "api";
import { accountCardEdit } from "@/api/account.js";
import { getCardListByUid, getHistory5 } from "@/api/diagnosis.js";
import {
  bankcard,
  oldBaseUrl,
  returnFloat,
  isWeiXin,
  formatDate,
} from "@/utils/dom";
import {
  Dialog,
  Button,
  Toast,
  DatePicker,
  Popup,
  PopupTitleBar,
} from "mand-mobile";

const _isWeiXin = isWeiXin;
export default {
  components: {
    [Dialog.name]: Dialog,
    [Button.name]: Button,
    [Toast.name]: Toast,
    [DatePicker.name]: DatePicker,
    [Popup.name]: Popup,
    [PopupTitleBar.name]: PopupTitleBar,
  },
  name: "DiagnosisIndex",
  data() {
    return {
      repayForm: {},
      reyyyymm: {},
      reDatePicker: {
        //时间弹窗信息
        show: false,
        title: "请选择日期",
      },
      // isVip:true,
      quotatimeShow: false,
      imageIcon: {
        timeChoice: require("@/assets/img/date.png"),
      },
      isPopupShow: true,
      manageCard: {
        creditCard: {
          records: [],
        },
        cardList: [],
      },
      cardactiveIndex: 0,
      weChatParameter: [],
      isDiag: null,
      Historydata: [],
      pageNum: 1,
      Val: "",
      timeValue: "",
      pageSize: 20,
      swiperOptions: {
        slidesPerView: "auto",
        centeredSlides: true,
        watchSlidesProgress: true,
        loopedSlides: 3,
        spaceBetween: 15,
        pagination: {
          el: ".swiper-pagination",
        },
        on: {
          progress: function () {
            for (let b = 0; b < this.slides.length; b++) {
              let c = this.slides[b];
              let d = c.progress;
              let es = c.style;
              es.opacity = 1 - Math.min(Math.abs(d / 2), 1);
              es.webkitTransform =
                es.MsTransform =
                es.msTransform =
                es.MozTransform =
                es.OTransform =
                es.transform =
                  "translate3d(0px,0," + -Math.abs(150 * d) + "px)";
            }
          },
          setTransition: function (transition) {
            for (let c = 0; c < this.slides.length; c++) {
              var slide = this.slides.eq(c);
              slide.transition(transition);
            }
          },
        },
      },
      minDate: new Date("2013/9/9"),
      maxDate: new Date("2020/9/9"),
      currentDate: new Date(),
      basicDialog: {
        open: false,
        btns: [
          {
            text: "确定",
            handler: this.onBasicConfirm,
          },
        ],
      },
      toPage: null,
    };
  },
  filters: {
    numm(i) {
      return bankcard(i);
    },
    datatime(i) {
      return formatDate(i, "y年M月d日");
    },
  },
  created() {
    this.initDefaultDate();
    this._getmanageCard();
  },
  activated() {
    this._getmanageCard();
    this.initDefaultDate();
  },
  beforeRouteEnter(to, from, next) {
    // console.log('to',to,'from',from)
    next();
  },
  beforeRouteLeave(to, from, next) {
    console.log("this.toPage", this.toPage);
    if (to.path == "/index") {
      return next();
    }
    if (this.toPage != "report") {
      console.log(to);
      next({ path: "/index" });
    } else {
      console.log(222);
      next();
    }
  },
  computed: {
    swiper() {
      return this.$refs.mySwiper.$swiper;
    },
    oldToken() {
      return this.$store.getters.get_oldtoken();
    },
    isVip() {
      return this.$store.getters.get_userinfo().isVip == 1 ? true : false;
    },
    isFirstDiag() {
      return this.$store.getters.get_userinfo.diagIndex == 0 ? true : false;
    },
  },
  methods: {
    // 确定选择日期
    reDataPickerConfirm(item) {
      console.log(item);
      this.reyyyymm.yyyy = item[0].value;
      this.reyyyymm.mm = item[1].value;
      //  < 10 ? "0" + item[1].value : item[1].value
      this.reyyyymm.dd = item[2].value;
      this.repayForm.date =
        this.reyyyymm.yyyy + "-" + this.reyyyymm.mm + "-" + this.reyyyymm.dd;
    },
    //初始化查询时间
    initDefaultDate() {
      const nowDate = new Date();
      const nowYear = nowDate.getFullYear();
      const currMonth = nowDate.getMonth() + 1;
      const nowMonth = currMonth < 10 ? "0" + currMonth : currMonth;
      const nowDay =
        nowDate.getDate() < 10 ? "0" + nowDate.getDate() : nowDate.getDate();
      // ----还款----
      // this.reyyyymm = {
      //   // v-model 绑定显示用
      //   yyyy: nowYear,
      //   mm: nowMonth,
      //   dd: nowDay,
      // };
      this.date = nowYear + "-" + nowMonth + "-" + nowDay;
      this.reDatePicker.currentDate = new Date(this.date);
      this.repayForm.date = this.date;
    },
    returnFloat,
    showPopUp(type) {
      this.$set(this.isPopupShow, type, true);
    },
    hidePopUp(type) {
      this.$set(this.isPopupShow, type, false);
    },
    handleSwiperReadied() {
      this.cardactiveIndex = this.$refs.mySwiper.$swiper.activeIndex;
    },
    onDatePickerInitialed() {
      console.log(
        `[Mand Mobile] DatePicker getFormatDate: ${this.$refs.datePicker.getFormatDate(
          "yyyy/MM/dd"
        )}`
      );
    },
    showpopup() {
      this.show = true;
    },
    slideChangeStart() {
      this.cardactiveIndex = this.$refs.mySwiper.$swiper.activeIndex;
      this._getisDiag();
    },
    _Historyclick(hCid, id) {
      this.toPage = "report";
      this.$router.push({
        path: "/report/" + id,
        query: {
          isHis: 1,
          hCid: hCid,
        },
      });
    },
    _getgoodslist() {
      let formData = new FormData();
      formData.append("token", this.oldToken);
      formData.append("pay_type", "wechat");
      formData.append(
        "r_url",
        "/diagnosiscard/" +
          this.manageCard.creditCard.records[this.cardactiveIndex].cid
      );
      getPayUrl(formData).then((res) => {
        if (res.status == 0) {
          window.location.href = _isWeiXin ? oldBaseUrl + res.msg : res.msg;
        } else {
          this.$toast.info(res.msg, 1000);
        }
      });
      // window.location.href = oldBaseUrl + "/expect/diagnosispay/payment.html?token=" + this.oldToken + "&pay_type=wechat" ;
    },
    // let params = {
    //   goodsType: 2
    // };
    // getgoodslist(params).then(res => {
    //   let params = {
    //     pathoWay: true,
    //     pathowayID: res.data.content[0].goodsId
    //   };
    //   getpayment(params).then(res => {
    //     console.log(res);
    //     let params = {
    //       pathoWay: true,
    //       pathowayID: res.data.orderId,
    //       spbill_create_ip: "192.168.0.104"
    //     };
    //     postwxPay(params).then(res => {
    //       console.log("支付", res);
    //       this.weChatParameter = res.data;
    //       this.weixinPay();
    //     });
    //   });
    // });
    // },
    // 解决微信内置对象报错
    // weixinPay(params) {
    //   var that = this;
    //   if (typeof WeixinJSBridge == "undefined") {
    //     if (document.addEventListener) {
    //       document.addEventListener(
    //         "WeixinJSBridgeReady",
    //         that.onBridgeReady(params),
    //         false
    //       );
    //     } else if (document.attachEvent) {
    //       document.attachEvent(
    //         "WeixinJSBridgeReady",
    //         that.onBridgeReady(params)
    //       );
    //       document.attachEvent(
    //         "onWeixinJSBridgeReady",
    //         that.onBridgeReady(params)
    //       );
    //     }
    //   } else {
    //     that.onBridgeReady();
    //   }
    // },
    // 微信内置浏览器类，weChatParameter对象中的参数是3.步骤代码中从后端获取的数据
    // onBridgeReady() {
    //   var that = this;
    //   var timestamp = Math.round(
    //     that.weChatParameter.payInfo.timestamp
    //   ).toString();
    //   // eslint-disable-next-line no-undef
    //   WeixinJSBridge.invoke(
    //     "getBrandWCPayRequest",
    //     {
    //       debug: true,
    //       appId: that.weChatParameter.payInfo.appid, //公众号名称，由商户传入
    //       timeStamp: timestamp, //时间戳，
    //       nonceStr: that.weChatParameter.payInfo.noncestr, //随机串
    //       package: "prepay_id=" + that.weChatParameter.payInfo.prepayid,
    //       signType: "MD5", //微信签名方式：
    //       paySign: that.weChatParameter.payInfo.sign, //微信签名
    //       jsApiList: ["chooseWXPay"]
    //     },
    //     function(res) {
    //       // 使用以上方式判断前端返回,微信团队郑重提示：res.err_msg将在用户支付成功后返回ok，但并不保证它绝对可靠。
    //       if (res.err_msg == "get_brand_wcpay_request:ok") {
    //         //支付成功后的操作
    //         that.$toast.info("支付成功");
    //       } else if (res.err_msg == "get_brand_wcpay_request:cancel") {
    //         //取消支付的操作
    //         that.$toast.info("取消支付");
    //       } else {
    //         //支付失败的操作
    //         that.$toast.info("支付失败");
    //       }
    //     }
    //   );
    // },
    _getisDiag() {
      // let params = {
      //   cardId:
      //     this.manageCard.creditCard.records.length &&
      //     this.manageCard.creditCard.records[this.cardactiveIndex].cid,
      // };
      this._getHistory();
      //   getisDiag(params).then((res) => {
      //     this.isDiag = res;
      //   });
      // this.isDiag = {
      //   data: null,
      //   errorCode: 1,
      //   msg: "成功",
      //   success: true,
      // };
    },
    _getHistory() {
      let params = {
        cid: this.manageCard.creditCard.records[this.cardactiveIndex].cid,
        current: this.pageNum,
        size: this.pageSize,
      };
      getHistory5(params).then((res) => {
        console.log("获取历史诊断列表返回", res);
        this.Historydata = res.data ? res.data.records : null;
      });
    },
    // 加载卡片
    _getmanageCard() {
      this.$toast.loading("加载中...");
      let Params = {
        isDiagnosis: 1,
        isAuto: 1,
        isHide: 1,
      };
      getCardListByUid({ size: 200 }).then((res) => {
        console.log("加载卡片", res);
        this.manageCard = res.data;
        this._getisDiag();
        this.$toast.hide();
        console.log("manageCard", this.manageCard);
      });
      //   manageCard(Params)
      //     .then((res) => {
      //       this.manageCard = res.data;
      //       this._getisDiag();
      //       this.$toast.hide();
      //     })
      //     .catch(() => {
      //       this.$toast.hide();
      //     });
    },
    add_diagnosis() {
      this.toPage = "report";
      this.$router.push({
        path: "/adddiagnosis",
      });
    },
    sumtdiagnos() {
      if (
        this.manageCard.creditCard.records[this.cardactiveIndex].bankId == 6 &&
        (this.manageCard.creditCard.records[this.cardactiveIndex]
          .availableQuota === null ||
          this.manageCard.creditCard.records[this.cardactiveIndex].quota ==
            null)
      ) {
        this.$dialog.alert({
          content: "请补全信用额度和可用额度，方可进行诊断",
        });
        return;
      }
      if (
        this.manageCard.creditCard.records[this.cardactiveIndex].quota == null
      ) {
        this.$dialog.alert({
          content: "请补全信用额度，方可进行诊断",
        });
        return;
      }
      // if (this.isVip || this.isFirstDiag) {
      if (
        this.manageCard.creditCard.records[this.cardactiveIndex].cardStatus ===
        2
      ) {
        Dialog.confirm({
          content: "卡片数据不完整，请先完善卡片信息！",
          confirmText: "立即完善",
          onConfirm: () => {
            this.manageCard.creditCard.records[
              this.cardactiveIndex
            ].showEdit = true;
            this.manageCard.creditCard.records[
              this.cardactiveIndex
            ].funType = 3;
            this.$emit(
              "getCurrentCard",
              this.manageCard.creditCard.records[this.cardactiveIndex]
            );
          },
        });
        return;
      } else if (
        this.manageCard.creditCard.records[this.cardactiveIndex].cardStatus ===
        3
      ) {
        this.$toast.info("您的卡片信息有误");
        return;
      }
      // else if (
      //   !this.manageCard.creditCard.records[this.cardactiveIndex]
      //     .matchDiagCondition
      // ) {
      //   console.log(5)
      //   Dialog.confirm({
      //     title: '温馨提示',
      //     content: "该信用卡还未更新至最新一期账单，需前往管卡页面更新账单！",
      //     confirmText: "前往更新",
      //     onConfirm: () => {
      //       this.$emit("changCurr", 1);
      //     },
      //   });
      //   this.$emit("changCurr", 1);
      //   this.$emit("newUpdateAccount", {
      //     cardData: this.manageCard.creditCard.records[this.cardactiveIndex],
      //     index: 1,
      //   });
      //   // return;

      //   // this.$emit('changeCardUpdateLoad', true)
      //   // this.request(refreshCard(cid), data => {
      //   //   if (data.code === '0000') {
      //   //     this._getmanageCard();
      //   //     this.$emit('changeCardUpdateLoad', false);
      //   //     Dialog.alert({
      //   //       title: '账单更新',
      //   //       message: '账单更新成功，请继续前往诊断',
      //   //     })
      //   //   } else {
      //   //     this.$emit('changeCardUpdateLoad', false)
      //   //     Dialog.alert({
      //   //       title: '账单更新',
      //   //       message: '账单更新失败，请重新前往立即诊断',
      //   //     })
      //   //   }
      //   // });
      // }
      else if (
        this.manageCard.creditCard.records[this.cardactiveIndex].billNum >= 6
      ) {
        this.$vDialog
          .confirm({
            message:
              "当前账单记账数据较少，将导致诊断数据不准确建议记录一年或半年以上的账单周期进行诊断。",
            confirmButtonText: "确定",
            cancelButtonText: "取消",
          })
          .then(() => {
            this.toPage = "report";
            this.$router.push({
              path:
                "/diagnosiscard/" +
                this.manageCard.creditCard.records[this.cardactiveIndex].cid,
            });
          })
          .catch(() => {
            // on cancel
          });
      } else if (
        !this.manageCard.creditCard.records[this.cardactiveIndex].diagFlag
      ) {
        this.$vDialog
          .confirm({
            message: "账单信息不完整，暂时无法提供诊断。",
            showCancelButton: false,
          })
          .then(() => {})
          .catch(() => {
            // on cancel
          });
      } else {
        // 开始诊断卡片
        let a =
          this.manageCard.creditCard.records[this.cardactiveIndex].bindTime;
        let b =
          this.manageCard.creditCard.records[this.cardactiveIndex].lastAddQuota;
        let c =
          this.manageCard.creditCard.records[this.cardactiveIndex]
            .lastAddQuotaDate;
        if (a == null || ((b == null || b == "") && (c == null || c == ""))) {
          this.basicDialog.open = true;
        } else {
          this.toPage = "report";
          this.$router.push({
            path:
              "/diagnosiscard/" +
              this.manageCard.creditCard.records[this.cardactiveIndex].cid,
          });
        }
      }
      // } else {
      //     console.log('showPic')
      //   this.$emit("showPic");
      // }
    },
    //开通vip
    openVip() {
      window.location.href =
        oldBaseUrl +
        "/home/vipcenter/buyvip/renew/true/fromtype/2.html?token=" +
        this.oldToken;
    },
    confirmEdit(data) {
      Dialog.confirm({
        content:
          '<span style="text-align: justify;">当前操作将会清除本卡本期已经记录的账单详情。若本卡开启了提额或者周转，也将重新生成本卡的提额与周转的计划。</span>',
        onConfirm: () => {
          const params = {
            cid: data.cardId,
            quota: data.creditMoney,
            availableQuota: data.availableMoney,
            billDate: data.billDate,
            repayDate: data.repayDate,
            lastMonthBillMoney: data.prevBillMoney,
            billMoney: data.prevBillMoney,
            currentDate: data.currentDate,
            lastAddQuotaDate: data.lastAddQuotaDate,
            lastAddQuota: data.lastAddQuota,
            cardTypeId: this.cardTypeId,
          };
          editCardInfo(params)
            .then((res) => {
              if (res.errorCode === 1) {
                this.$emit("hideEditCard");
                this.$toast.succeed("编辑成功");
                setTimeout(() => {
                  this._getmanageCard();
                }, 500);
              }
            })
            .catch(() => {
              this.$toast.failed("系统出错啦~");
            });
        },
      });
    },
    showPopFn() {
      this.reDatePicker.show = true;
      // this.$emit("openQuotaTime");
    },
    conveyQuotaTimeValue(timeValue) {
      this.$set(
        this.manageCard.creditCard.records[this.cardactiveIndex],
        "lastAddQuotaDate",
        timeValue
      );
    },
    showPopup() {
      this.show = true;
    },
    changeFn() {
      // 值变化是触发
      this.changeDate = this.currentDate; // Tue Sep 08 2020 00:00:00 GMT+0800 (中国标准时间)
    },
    confirmFn() {
      // 确定按钮
      this.timeValue = this.timeFormat(this.currentDate);
      console.log(this.timeValue);
      return;
      // this.show = false
    },
    cancelFn() {
      this.show = true;
    },
    timeFormat(time) {
      // 时间格式化 2019-09-08
      let year = time.getFullYear();
      let month = time.getMonth() + 1;
      let day = time.getDate();
      return year + "年" + month + "月" + day + "日";
    },
    onBasicConfirm() {
      let form = { ...this.repayForm };
      // let data = {
      //   cid:
      //   belongTypeId: 0,
      //   lastAddQuotaDate: form.date,
      //   lastAddQuota: form.money
      // };
      // accountCardEdit(data).then((res) => {
      //   console.log(res);
      //   this.$vtoast("编辑成功");
      //   this.$router.go(-1);
      // });
      let a = form.money;
      let b = form.date;
      if (a || b) {
        if (a != "" || b != "") {
          let params = {
            cid: this.manageCard.creditCard.records[this.cardactiveIndex].cid,
            lastAddQuota: form.money,
            lastAddQuotaDate: form.date,
          };
          accountCardEdit(params).then((res) => {
            console.log(res);
            this.toPage = "report";
            this.$router.push({
              path:
                "/diagnosiscard/" +
                this.manageCard.creditCard.records[this.cardactiveIndex].cid,
            });
          });
        } else {
          this.toPage = "report";
          this.$router.push({
            path:
              "/diagnosiscard/" +
              this.manageCard.creditCard.records[this.cardactiveIndex].cid,
          });
        }
      } else {
        this.toPage = "report";
        this.$router.push({
          path:
            "/diagnosiscard/" +
            this.manageCard.creditCard.records[this.cardactiveIndex].cid,
        });
      }
      this.basicDialog.open = false;
    },
    handle(id) {
      this.toPage = "report";
      this.$router.push({
        path: "/report/" + id,
        query: {
          lastAddQuota: "",
          lastAddQuotaDate: "",
        },
      });
    },
    request(handler, callback) {
      handler().then((res) => {
        if (res.errorCode === SUCC) {
          const { data } = res;
          callback(data);
        } else if (res.errorCode === OTHER_ERROR) {
          this.fatal(res.msg);
        } else {
          this.reset();
        }
      });
    },
  },
  mounted() {
    this.timeFormat(new Date());
  },
};
</script>
<style lang="scss">
.md-dialog-text {
  line-height: 40px !important;
}

.time-icon {
  display: inline-block;
  width: 48px;
  height: 48px;
  background: center center / contain no-repeat;
  vertical-align: middle;
  margin-left: 10px;
}

.quota-time-choice {
  display: flex;
  align-items: center;
  flex-direction: row-reverse;
}

.md-input-item-input {
  text-align: center !important;
}

.lszdbgtit {
  font-size: 34px;
}

.last-quotatime {
  display: flex;
  width: 100%;
  height: 100px;
  align-items: center;
  border-bottom: 1px solid #efefef;
}

.last-quotatime > div {
  width: 50%;
}

.lszdbg_box .md-cell-item-body {
  padding-bottom: 20px;
}

.historys .md-cell-item-body {
  padding-bottom: 20px;
}

.diagnosis_box {
  .diagno_credit_header {
    background: #363d47;

    .diano_hd {
      display: flex;
      justify-content: center;
      align-items: center;
      text-align: center;
      color: #fff;
      font-size: 25px;
      padding: 60px 0 40px 0;

      .diano_item {
        flex: 1;
      }

      .diano_item_num {
        font-weight: bold;
        font-size: 38px;
        margin-bottom: 20px;
      }
    }
  }

  .diagno_credit_box {
    padding: 80px;
    background: #363d47;
  }

  .diagno_credit {
    padding: 80px;
    background: $white;
    overflow: hidden;
    border-radius: 20px;

    .credit_tip {
      padding: 20px;
      text-align: center;
      font-size: $font-size-26;
    }
  }

  .qw-icon-addcar {
    margin-right: 15px;
  }

  .no_data {
    text-align: center;
    font-size: $font-size-36;
    padding: 20px 0;
    margin-top: 210px;

    .tiptit {
      padding: 20px 0 0 0;
      font-size: $font-size-30;
    }
  }

  .md-example-child-swiper-0 {
    .swiper-container {
      max-width: 750px;
      -webkit-perspective: 1200px;
      -moz-perspective: 1200px;
      -ms-perspective: 1200px;
      perspective: 1200px;
      padding-bottom: 60px;
    }

    .swiper-wrapper {
      margin-top: 10px;
    }

    .swiper-container-horizontal
      > .swiper-pagination-bullets
      .swiper-pagination-bullet {
      background: rgba(255, 255, 255, 0.62);
    }

    .swiper-slide {
      width: 85%;
      -webkit-transform-style: preserve-3d;
      -moz-transform-style: preserve-3d;
      -ms-transform-style: preserve-3d;
      transform-style: preserve-3d;
    }

    .swiper-slide .main-img {
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
    }

    .swiper-container-horizontal
      > .swiper-pagination-bullets
      .swiper-pagination-bullet.swiper-pagination-bullet-active {
      background: rgba(255, 255, 255, 1);
      width: 14px;
    }
  }

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

.md-dialog-title {
  color: #018fff;
}

.md-field-item-title {
  font-size: 26px;
}

.md-input-item-input {
  text-align: right !important;
  font-size: 26px;
}

.md-dialog-actions {
  width: 360px;
  margin: 0 auto;
}

.md-dialog-btn:last-child {
  color: #fff;
  border: 1px solid;
  background: #018fff;
  height: 90px;
  margin-bottom: 25px;
  border-radius: 10px;
}

.md-field-item {
  height: 50px;
}

.van-picker__toolbar {
  height: auto;
}

.van-picker__cancel {
  font-size: $font-size-30;
}

.van-picker__confirm {
  font-size: $font-size-30;
}

.van-picker-column {
  font-size: $font-size-30;
}

.van-field__control {
  font-size: 30px;
}
</style>