<template>
  <div class="box">
    <div class="top-backgroud">
      <div class="card1">
        <div>
          <div class="card1-box card1-left">
            <div class="num">{{ quota }}</div>
            <div class="font">总信用金额(元)</div>
          </div>
        </div>
        <div>
          <div class="card1-box card1-right">
            <div class="num">{{ availableQuota }}</div>
            <div class="font">总可用金额(元)</div>
          </div>
        </div>
      </div>
    </div>
    <!-- 轮播卡片 -->
    <div class="card-swiper">
      <div
        class="touche-card"
        v-if="proCardList.length > 0"
        @touchmove.stop="
          () => {
            return false;
          }
        "
      >
        <swiper
          ref="mySwiper"
          :options="swiperOptions"
          :has-hots="false"
          @slideChange="slideChange"
        >
          <swiper-slide v-for="item in proCardList" :key="item.cid">
            <img :src="item.bank.iconBg" class="s-img" />
            <div class="card-conent">
              <div class="card-til">
                <div class="card-til-left">
                  <img :src="item.bank.bankIcon" class="card-bank-icon" />
                  <span class="card-bank-name"
                    >{{ item.bank.bankName }}({{
                      item.cardNumber.slice(
                        item.cardNumber.length - 4,
                        item.cardNumber.length
                      )
                    }})</span
                  >
                </div>
                <div class="card-til-right">
                  <van-image
                    :src="ellipsisImg"
                    :width="30"
                    :height="30"
                    @click="handleEllipsisImg(item)"
                  />
                  <!-- <span class="tips">{{
                    item.isProplan === 1 ? "计划已开启" : "计划已关闭"
                  }}</span> -->
                  <!-- <md-switch
                    class="bank-switch"
                    v-model="item.isPro"
                    @change.stop="handler(item, $event)"
                    size="small"
                  ></md-switch> -->
                </div>
              </div>
              <div class="card-num">
                <span>{{ item.cardNumber.slice(0, 4) }}</span>
                <span>****</span>
                <span>****</span>
                <span>{{
                  item.cardNumber.slice(
                    item.cardNumber.length - 4,
                    item.cardNumber.length
                  )
                }}</span>
              </div>
              <div class="card-cost">
                <span class="card-cost-tips">信用额度: </span>
                {{
                  item.quota == null || item.quota == ""
                    ? "暂无数据"
                    : returnFloat(item.quota)
                }}
                <span style="margin-left: 20px; margin-right: 20px">|</span>
                <span class="card-cost-tips">可用额度: </span>
                {{
                  item.availableQuota !== null && item.availableQuota !== ""
                    ? returnFloat(item.availableQuota)
                    : "暂无数据"
                }}
              </div>
              <!-- <div class="card-cost">
                
              </div> -->
              <!-- <i class="qw-icon qw-icon-caigoujihua list-icon"></i> -->
            </div>
          </swiper-slide>
        </swiper>
      </div>
    </div>
    <!-- 点击省略号弹窗 -->
    <md-action-sheet
      v-model="showPicker"
      :options="actionSheetOptions"
      @selected="actionSheetSelected"
    >
    </md-action-sheet>
    <!-- tab -->
    <van-tabs
      class="my-tab"
      v-model="active"
      sticky
      animated
      v-if="isRise"
      color="#4475FE"
    >
      <!-- 还款计划 -->
      <van-tab title="还款计划" :name="2">
        <div v-if="planList && planList.length > 0">
          <van-collapse
            class="my-collapse card-collapse"
            v-model="activeNames"
            :border="false"
          >
            <div v-for="(item, index1) in planList" :key="index1" class="card">
              <van-collapse-item :name="index1" :border="false">
                <template #title>
                  <div>
                    <span class="num1">{{ item.totalMoney }}</span>
                    <span class="data">{{ item.planDate }}</span>
                  </div>
                  <div class="ready">预计还款(元)</div>
                </template>
                <div v-for="(item, index) in item.planList" :key="index">
                  <van-divider
                    :style="{ padding: '0 32px', margin: ' 20px 0 6px 0 ' }"
                  >
                  </van-divider>
                  <div class="card-content">
                    <div class="flex-left-right">
                      <div class="flex-left">
                        <div class="card-content-title">
                          <img :src="item.colorIcon" class="card-bank-icon" />
                          <span class="card-bank-name">{{
                            item.bankName
                          }}</span>
                        </div>
                        <div class="card-content-num">
                          <span>还款金额 </span
                          ><span class="card-bank-num"> {{ item.money }}</span>
                        </div>
                        <div class="card-content-num">
                          <span>还款时间 </span
                          ><span class="card-bank-num">
                            {{ item.beginTime }} ~ {{ item.endTime }}</span
                          >
                        </div>
                        <div v-if="item.signMoney > 0" class="card-content-num">
                          <span>标记金额 </span
                          ><span class="card-bank-num">
                            {{ item.signMoney }}</span
                          >
                        </div>
                      </div>
                      <div class="flex-right">
                        <van-button
                          class="card-bank-button"
                          plain
                          type="primary"
                          size="mini"
                          color="#F73B09"
                          @click="handleFinishConfirm(item)"
                          v-if="item.statu == 0"
                          >未完成</van-button
                        >
                        <van-image
                          v-else-if="item.statu == 1"
                          class="card-bank-finishImg"
                          :src="finishImg"
                          :width="63"
                          :height="57"
                          @click="unFinish(item)"
                        />
                      </div>
                    </div>

                    <div class="card-content-footer">
                      <span class="red">* </span
                      ><span>{{ item.cueWords }}</span>
                    </div>
                  </div>
                </div>
              </van-collapse-item>
            </div>
            <div class="no-more">没有更多了</div>
          </van-collapse>
        </div>
        <div v-else class="else-noMore-box" style="height: 300px">
          <van-image :src="noMoreImg" :width="150" :height="150" />
          <div class="noMore-text">暂无内容</div>
        </div>
      </van-tab>
      <!-- 消费计划 -->
      <van-tab title="消费计划" :name="1">
        <div v-if="planList && planList.length > 0">
          <van-collapse
            class="my-collapse card-collapse"
            v-model="activeNames"
            :border="false"
          >
            <div v-for="(item, index1) in planList" :key="index1" class="card">
              <van-collapse-item :name="index1" :border="false">
                <template #title>
                  <div>
                    <span class="num1">{{ item.totalMoney }}</span>
                    <span class="data">{{ item.planDate }}</span>
                  </div>
                  <div class="ready">预计消费(元)</div>
                </template>
                <div v-for="(item, index) in item.planList" :key="index">
                  <van-divider
                    :style="{ padding: '0 32px', margin: ' 20px 0 6px 0 ' }"
                  >
                  </van-divider>
                  <div class="card-content">
                    <div class="flex-left-right">
                      <div class="flex-left">
                        <div class="card-content-title">
                          <img :src="item.colorIcon" class="card-bank-icon" />
                          <span class="card-bank-name">{{
                            item.bankName
                          }}</span>
                        </div>
                        <div class="card-content-num">
                          <span>消费金额 </span
                          ><span class="card-bank-num"> {{ item.money }}</span>
                        </div>
                        <div class="card-content-num">
                          <span>消费时间 </span
                          ><span class="card-bank-num">
                            {{ item.beginTime }} ~ {{ item.endTime }}
                          </span>
                        </div>
                        <div v-if="item.signMoney > 0" class="card-content-num">
                          <span>标记金额 </span
                          ><span class="card-bank-num">
                            {{ item.signMoney }}</span
                          >
                        </div>
                      </div>
                      <div class="flex-right">
                        <van-button
                          class="card-bank-button"
                          plain
                          type="primary"
                          size="mini"
                          color="#F73B09"
                          @click="handlePayFinish(item)"
                          v-if="item.statu == 0"
                          >未完成</van-button
                        >
                        <van-image
                          v-else-if="item.statu == 1"
                          class="card-bank-finishImg"
                          :src="finishImg"
                          :width="63"
                          :height="57"
                          @click="unFinish(item)"
                        />
                      </div>
                    </div>

                    <div class="card-content-footer">
                      <span class="red">* </span
                      ><span>{{ item.cueWords }}</span>
                    </div>
                  </div>
                </div>
              </van-collapse-item>
            </div>
            <div class="no-more">没有更多了</div>
          </van-collapse>
        </div>
        <div v-else class="else-noMore-box" style="height: 300px">
          <van-image :src="noMoreImg" :width="150" :height="150" />
          <div class="noMore-text">暂无内容</div>
        </div>
      </van-tab>
    </van-tabs>
    <div class="noRise" v-if="!isRise">
      <div>此卡未开启提额计划,请先开启提额计划</div>
      <div style="margin-top: 20px">
        <van-button @click="actionSheetSelected({ value: 'openRisePlan' })"
          >开启提额计划</van-button
        >
      </div>
    </div>

    <!-- 点击 已完成 弹窗 -->
    <van-dialog
      v-model="payFinishPopup"
      show-cancel-button
      class="finishPopup"
      @confirm="handleFinishSubmit"
      @cancel="resetForm"
    >
      <!-- <van-field
        v-model="form.value"
        type="number"
        label="标记金额"
        placeholder="点击输入标记金额"
        :formatter="formatterMoney"
        input-align="center"
        style="margin-bottom: 30px"
        
      /> -->
      <div class="finishPopup-div">
        <a-form-model
          :model="form"
          class="finishPopup-form"
          layout="horizontal"
        >
          <a-form-model-item>
            <a-input
              class="finishPopup-form-input"
              v-model="form.value"
              placeholder="点击输入标记金额（元）"
              type="number"
              :maxLength="8"
            />
          </a-form-model-item>
        </a-form-model>
      </div>
    </van-dialog>

    <!-- <van-popup
      v-model="finishPopup"
      position="bottom"
      :style="{ height: '30%', padding: '20px 40px 20px 40px' }"
      @closed="resetForm"
    >
      <van-field
        v-model="form.value"
        type="number"
        label="标记金额"
        placeholder="点击输入标记金额"
        :formatter="formatterMoney"
      />
      <div class="popup-footer">
        <van-button
          class="popup-foote-button popup-footer-submit"
          type="primary"
          color="#4475FE"
          @click="handleFinishSubmit"
          >确认</van-button
        >
      </div>
    </van-popup> -->
  </div>
</template>

<script>
import { returnFloat } from "@/utils/dom";
import {
  getCardListByUid,
  getAllPlan4Index,
  open,
  over,
  signPlan,
  unSignPlan,
} from "@/api/index";
export default {
  name: "rise",
  data() {
    return {
      noMoreImg: require("@/assets/img/暂无内容.png"),
      ellipsisImg: require("@/assets/icon/省略号.png"),
      finishImg: require("@/assets/icon/已完成新.png"),
      actionSheetOptions: [
        {
          label: "查看历史提额计划",
          value: "historyPlan",
        },
        {
          label: "查看历史提额",
          value: "historyList",
        },
        {
          label: "开启提额计划",
          value: "openRisePlan",
        },
      ],
      finishPopup: false,
      form: {
        value: null,
      },
      active: 2,
      activeNames: [0],
      proCardList: [],
      planList: [],
      // 滚动卡片
      swiperOptions: {
        slidesPerView: "auto",
        centeredSlides: true,
        hasHots: false,
        // watchSlidesProgress: true,
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
      showPicker: false,
      //
      quota: null,
      availableQuota: null,
      selectCardId: null,
      isRise: null,
      finishConfirmShow: false,
      payFinishPopup: false,
    };
  },
  created() {
    this.getCardListByUid();
  },
  mounted() {},

  methods: {
    // 获取信用卡列表
    getCardListByUid() {
      getCardListByUid({
        size: 200,
      }).then((res) => {
        console.log(res);
        this.quota = res.data.quota;
        this.availableQuota = res.data.availableQuota;
        this.proCardList = res.data.creditCard.records;
        if (this.proCardList.length > 0) {
          this.selectCardId = this.proCardList[0].cid;
        }
      });
    },
    // 获取计划列表
    getAllPlan4Index() {
      let data = {
        cid: this.selectCardId,
        type: this.active,
      };
      getAllPlan4Index(data).then((res) => {
        console.log(res);
        if (res.code == 30008) {
          this.isRise = false;
          this.actionSheetOptions[2] = {
            label: "开启提额计划",
            value: "openRisePlan",
          };
        } else {
          this.planList = res.data;
          this.isRise = true;
          this.actionSheetOptions[2] = {
            label: "关闭提额计划",
            value: "closeRisePlan",
          };
        }
      });
    },
    returnFloat, // 工具
    // 切换信用卡
    slideChange() {
      // console.log(this.$refs.mySwiper.$swiper)
      let index = this.$refs.mySwiper.$swiper.activeIndex;
      this.selectCardId = this.proCardList[index].cid;
    },
    // 点击 。。。
    handleEllipsisImg(item) {
      this.showPicker = true;
      this.cardInfo = item;
    },
    actionSheetSelected(item) {
      if (item.value == "historyPlan") {
        this.$router.push({
          path: "/historyPlan",
          query: {
            cid: this.cardInfo.cid,
          },
        });
      } else if (item.value == "historyList") {
        this.$router.push({
          path: "/historyList",
          query: {
            cid: this.cardInfo.cid,
          },
        });
      } else if (item.value == "openRisePlan") {
        open({
          cid: this.selectCardId,
        }).then((res) => {
          console.log("open", res);
          this.$vtoast("开启提额计划成功");
          this.getAllPlan4Index();
        });
      } else if (item.value == "closeRisePlan") {
        over({
          cid: this.selectCardId,
        }).then((res) => {
          console.log("over", res);
          this.$vtoast("关闭提额计划成功");
          this.getAllPlan4Index();
        });
      }
    },
    // 点击还款 未完成
    handleFinishConfirm(item) {
      this.$vDialog
        .confirm({
          message: "确认计划已完成?",
          confirmButtonText: "是",
          cancelButtonText: "否",
        })
        .then(() => {
          let data = {
            signMoney: item.money,
            pid: item.pid,
            planType: this.active,
          };
          signPlan(data).then((res) => {
            console.log(res);
            this.getAllPlan4Index();
            this.$vtoast("设置成功");
            this.finishPopup = false;
            this.resetForm();
          });
        })
        .catch(() => {
          // on cancel
        });
    },
    // 点击消费 未完成
    handleFinish(item, index) {
      console.log(item, index, this.planList);
      if (
        item.planType == 2 &&
        index > 0 &&
        this.planList[index - 1] &&
        this.planList[index - 1].planList[0].statu == 0
      ) {
        return this.$dialog.alert({
          // title: '标题',
          content: "请按照还款计划顺序进行还款，如有疑问联系客服",
        });
      } else {
        // console.log(item);
        this.form.pid = item.pid;
        this.form.planType = this.active;
        this.finishPopup = true;
      }
    },
    // 取消完成还款
    unFinish(item) {
      this.$vDialog
        .confirm({
          message: "是否取消完成计划?",
          confirmButtonText: "是",
          cancelButtonText: "否",
        })
        .then(() => {
          let data = {
            pid: item.pid,
            planType: this.active,
          };
          unSignPlan(data).then((res) => {
            console.log(res);
            this.getAllPlan4Index();
            this.$vtoast("设置成功");
            // this.finishPopup = false;
            this.resetForm();
          });
        })
        .catch(() => {
          // on cancel
        });
    },
    // 重置表单
    resetForm() {
      this.form = {
        value: null,
      };
    },
    handlePayFinish(item) {
      this.form.pid = item.pid;
      this.form.planType = this.active;
      this.payFinishPopup = true;
    },
    // 提交表单 标记金额
    handleFinishSubmit(item) {
      console.log(this.form.value);
      if (!this.form.value) {
        return this.$vtoast("请输入正确的标记金额");
      }
      if (this.form.value <= 0) {
        return this.$vtoast("标记金额必须大于0");
      }
      let form = {
        ...this.form,
      };
      console.log(form);
      let data = {
        signMoney: form.value,
        pid: form.pid,
        planType: form.planType,
      };
      signPlan(data).then((res) => {
        console.log(res);
        this.getAllPlan4Index();
        this.$vtoast("设置成功");
        this.finishPopup = false;
        this.resetForm();
      });
    },
    // 格式化金额 只要2位小数
    formatterMoney(num) {
      let v = num;
      v = v.split(".");
      console.log("v", v);
      if (v[1] && v[1].length >= 2) {
        v[1] = v[1].slice(0, 2);
        v = v.join(".");
        console.log("v", v);
        return v;
      }
      v = v.join(".");
      return v;
    },
  },
  watch: {
    selectCardId() {
      console.log("watch -> selectCardId", this.selectCardId);
      this.getAllPlan4Index();
    },
    active() {
      console.log(this.active);
      this.getAllPlan4Index();
    },
  },
};
</script>

<style lang="scss" scoped>
.box {
  background-color: rgb(243, 243, 243);
  min-height: 100vh;
  padding-bottom: 10px;
}

.top-backgroud {
  height: 320px;
  background-color: rgb(46, 47, 47);
}

.card1 {
  display: flex;
  justify-content: space-around;
  align-items: center;
  height: 290px;
  padding: 0px 60px 0px 60px;

  .card1-box {
    display: flex;
    flex-direction: column;
    justify-content: center;
  }

  .num {
    text-align: center;
    font-size: 36px;
    font-family: PingFang SC;
    font-weight: bold;
    color: #ffffff;
  }

  .font {
    text-align: center;
    margin-top: 10px;
    font-size: 24px;
    font-family: PingFang SC;
    font-weight: 500;
    color: #cacaca;
  }
}

//卡片伦播
.card-swiper {
  position: absolute;
  top: 250px;

  .touche-card {
    height: 230px;
    // margin-top: 30px;
    width: 750px;

    .swiper-slide {
      width: 86%;
      -webkit-transform-style: preserve-3d;
      -moz-transform-style: preserve-3d;
      -ms-transform-style: preserve-3d;
      transform-style: preserve-3d;
      position: relative;
      border-radius: 38px;

      .s-img {
        width: 100%;
        max-height: 230px;
        border-radius: 20px;
      }

      .card-conent {
        box-sizing: border-box;
        position: absolute;
        left: 0;
        top: 0;
        height: 100%;
        width: 100%;
        padding: 16px 44px 35px 44px;
        display: flex;
        flex-direction: column;
        justify-content: space-between;

        .card-til {
          display: flex;
          flex-direction: row;
          justify-content: space-between;
          align-items: center;

          .card-til-left,
          .card-til-right {
            display: flex;
            flex-direction: row;
            align-items: center;
          }

          .card-bank-icon {
            width: 50px;
            height: 50px;
            margin-right: 15px;
            border-radius: 50%;
          }

          .card-bank-name {
            font-size: 28px;
            font-family: PingFang SC;
            // font-weight: bold;
            color: rgba(255, 255, 255, 1);
          }

          .tips {
            margin-right: 20px;
            font-size: 28px;
            font-family: Source Han Sans CN;
            font-weight: bold;
            color: rgba(255, 255, 255, 1);
          }

          .bank-switch {
            display: block;
            // background: #a70000;
          }
        }

        .card-num {
          display: flex;
          flex-direction: row;
          justify-content: space-between;
          align-items: center;
          font-size: 33px;
          font-family: Source Han Sans CN;
          // font-weight: bold;
          color: rgba(255, 255, 255, 1);
          padding-right: 160px;
          letter-spacing: 1px;
        }

        .card-cost {
          font-size: 24px;
          font-family: PingFang SC;
          font-weight: 500;
          color: #ffffff;
          opacity: 0.6;
          // .card-cost-tips {
          //   margin-right: 20px;
          // }
        }

        .list-icon {
          font-size: 14px;
          color: $color-text;
          position: absolute;
          right: 40px;
          bottom: 40px;
        }
      }
    }
  }
}

.my-tab {
  margin-top: 160px;

  /deep/ .van-tab {
    background-color: rgb(243, 243, 243);
    font-size: 15px;
  }

  /deep/ .van-tab--active {
    font-size: 17px;
  }

  .card {
    width: 700px;
    background: #ffffff;
    border-radius: 20px;
    margin: 0 auto;
    margin-top: 20px;
    padding: 20px 30px 00px 40px;

    .num1 {
      font-size: 30px;
      font-family: PingFang SC;
      font-weight: bold;
      color: #212121;
    }

    .data {
      font-size: 24px;
      font-family: PingFang SC;
      font-weight: 500;
      color: #666666;
      float: right;
      margin-right: 10px;
    }

    /deep/ .van-collapse-item__content {
      padding: 0px 0px 38px 0px;
    }

    .ready {
      margin-top: 5px;
      margin-bottom: 20px;
      font-size: 26px;
      font-family: PingFang SC;
      color: #212121;
    }

    .card-content {
      font-size: 26px;
      font-family: PingFang SC;
      font-weight: 500;
      color: #666666;

      .flex-left-right {
        display: flex;
        justify-content: space-between;

        .flex-left {
          .card-content-title {
            width: 100%;
            margin-top: 14px;
            display: flex;
            flex-direction: row;
            justify-content: flex-start;
            align-items: center;

            .card-bank-icon {
              width: 50px;
              height: 50px;
              margin-right: 6px;
              border-radius: 50%;
            }

            .card-bank-name {
              font-weight: bold;
              color: #212121;
            }
          }
        }

        .card-bank-button {
          // position: absolute;
          // right: 0px;
          margin-top: 15px;
          border: 1px solid #f73b09;
          border-radius: 24px;
          padding: 25px 20px;
          font-size: 24px;
          font-family: PingFang SC;
          font-weight: 500;
          color: #f73b09;
        }

        .card-bank-finishImg {
          // float: right;
          // position: absolute;
          right: 0px;
          margin-top: 30px;
        }

        .card-content-num {
          margin-top: 14px;

          .card-bank-num {
            color: #212121;
          }
        }
      }

      .card-content-footer {
        margin-top: 14px;
        font-size: 22px;
        font-family: PingFang SC;
        font-weight: 500;
        color: #999999;

        .red {
          color: #fe5950;
        }
      }
    }
  }
}

.no-more {
  margin: 40px 0px 30px 0px;
  text-align: center;
  font-size: 30px;
  font-family: PingFang SC;
  font-weight: 500;
  color: #999999;
}

.popup-footer {
  position: absolute;
  bottom: 30px;
  width: 600px;
  display: flex;
  justify-content: space-between;

  .popup-foote-button {
    height: 60px;
    width: 100%;
  }

  .popup-foote-reset {
  }

  .popup-foote-submit {
  }
}

// vant collapse 点击不变色
.my-collapse /deep/.van-cell--clickable:active {
  background-color: white;
}

.noRise {
  margin-top: 350px;
  // height: 300px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  font-size: 26px;
  font-family: PingFang SC;
  font-weight: 500;
  color: #666666;
  letter-spacing: 3px;
}

.finishPopup-div {
  padding: 50px 60px 10px 60px;

  .finishPopup-form {
    .finishPopup-form-input {
      // margin-bottom: 30px;
      height: 60px;
      font-size: 26px;
      border-radius: 20px;
    }
  }
}
</style>
