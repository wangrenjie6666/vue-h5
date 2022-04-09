<template>
  <div class="box">
    <!-- <div class="tips">选择下列账户进行操作</div> -->
    <div class="list-box">
      <div
        class="card-box"
        v-for="(item, index) in accountList"
        :key="index"
        :style="{
          backgroundImage: `url(${
            item.type == 0 || item.type == 2
              ? item.bank.bankColor
              : item.type == 1
              ? tempInfo[0].bankBg
              : item.type == 4
              ? tempInfo[1].bankBg
              : tempInfo[2].bankBg
          })`,
          backgroundSize: '100% 100%',
        }"
        @click="handleCard(item)"
      >
        <!-- 信用卡 和 储蓄卡 -->
        <template v-if="item.type == 0 || item.type == 2">
          <div class="top-box">
            <van-image :width="32" :height="32" :src="item.bank.bankIcon" />
            <div class="name1">
              {{ item.bank.bankName }} - {{item.type == 0 ? '信用卡' : '储蓄卡'}} ({{ item.cardNumber }}) 
            </div>
          </div>
          <div class="bottom-box">
            <div class="pay">消费:￥{{ item.expenditureAmount }}</div>
            <div class="repay">还款:￥{{ item.revenueAmount }}</div>
          </div>
        </template>

        <!-- 现金 -->
        <template v-else-if="item.type == 1">
          <div class="top-box">
            <van-image :width="32" :height="32" :src="tempInfo[0].icon" />
            <div class="name1">{{ tempInfo[0].name }}</div>
          </div>
          <div class="bottom-box">
            <div class="pay">支出:￥{{ item.expenditureAmount }}</div>
            <div class="repay">收入:￥{{ item.revenueAmount }}</div>
          </div>
        </template>

        <!-- 微信 -->
        <template v-else-if="item.type == 4">
          <div class="top-box">
            <van-image :width="32" :height="32" :src="tempInfo[1].icon" />
            <div class="name1">{{ item.cardNumber }}</div>
          </div>
          <div class="bottom-box">
            <div class="pay">支出:￥{{ item.expenditureAmount }}</div>
            <div class="repay">收入:￥{{ item.revenueAmount }}</div>
          </div>
        </template>

        <!-- 支付宝 -->
        <template v-else-if="item.type == 3">
          <div class="top-box">
            <van-image :width="32" :height="32" :src="tempInfo[2].icon" />
            <div class="name1">{{ item.cardNumber }}</div>
          </div>
          <div class="bottom-box">
            <div class="pay">支出:￥{{ item.expenditureAmount }}</div>
            <div class="repay">收入:￥{{ item.revenueAmount }}</div>
          </div>
        </template>
      </div>
    </div>
    <AddAccount></AddAccount>
  </div>
</template>

<script>
import { listByUid } from "@/api/write.js";
import AddAccount from "@/components/addAccount.vue"
export default {
  name: "message",
  props: {},
  components: {
    AddAccount,
  },
  data() {
    return {
      bgimg: require("@/assets/img/账户列表背景图.png"),
      moneyImg: require("@/assets/icon/现金白色.png"),
      addImg: require("@/assets/icon/新增5.png"),
      addShow: false,
      tempInfo: [
        {
          name: "现金账户",
          type: 1,
          bankBg: require("@/assets/img/账户现金背景图.png"),
          icon: require("@/assets/img/现金.png"),
        },
        {
          name: "微信",
          type: 4,
          bankBg: require("@/assets/img/账户微信背景图.png"),
          icon: require("@/assets/img/微信.png"),
        },
        {
          name: "支付宝",
          type: 3,
          bankBg: require("@/assets/img/账户支付宝背景图.png"),
          icon: require("@/assets/img/支付宝.png"),
        },
      ],
      bookType: null,
      accountList: [],
    };
  },
  created() {
    this.listByUid();
  },
  activated() {
    // this.listByUid();
  },
  mounted() {},

  methods: {
    // 获取账户列表
    listByUid() {
      let nowBookType = this.$store.getters.get_bookType();
      console.log("nowBookType", nowBookType);
      listByUid().then((res) => {
        console.log("获取账户列表res", res);
        this.accountList = res.data;
      });
    },
    handleCard(item) {
      console.log(item.type);
      // return
      if (item.type == 0) {
        // 信用卡
        this.$router.push({
          path: "/editCard",
          query: {
            cid: item.cid,
          },
        });
      } else if (item.type == 2) {
        // 银行卡
        this.$router.push({
          path: "/editSaveCard",
          query: {
            cid: item.cid,
          },
        });
      } else if (item.type == 3) {
        // 支付宝
        this.$router.push({
          path: "/editAlipay",
          query: {
            cid: item.cid,
          },
        });
      } else if (item.type == 4) {
        // 微信
        this.$router.push({
          path: "/editWechat",
          query: {
            cid: item.cid,
          },
        });
      } else if (item.type == 1) {
        // 现金
        this.$vtoast("无法修改现金账户");
      }
    },
    
  },
};
</script>

<style lang="less" scoped>
.box {
  background-color: #f3f3f3;
  min-height: 100vh;
  padding-top: 10px;
  padding-bottom: 300px;
}
.list-box {
  .card-box {
    width: 721px;
    height: 243px;
    // box-shadow: 0px 2px 8px 0px rgba(36, 32, 38, 0.1);
    margin: 0 auto;
    margin-top: 15px;
    .top-box {
      border-radius: 20px 20px 0px 0px;
      display: flex;
      align-items: center;
      padding: 30px 30px;
      .name1 {
        margin-left: 40px;
        font-size: 30px;
        font-family: PingFang SC;
        font-weight: 500;
        color: #ffffff;
      }
    }
    .bottom-box {
      //   margin-top: 10px;
      padding-left: 20px;
      font-size: 28px;
      font-family: PingFang SC;
      font-weight: 500;
      color: #212121;
      // background-color: white;
      padding: 30px 50px;
      border-radius: 0px 0px 20px 20px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      .pay {
        width: 50%;
      }
      .repay {
        width: 50%;
        padding-left: 30px;
        // margin-top: 10px;
      }
    }
  }
}

.tips {
  padding: 10px 30px 0px 30px;
  font-size: 34px;
  font-family: PingFang SC;
  font-weight: 500;
  color: #212121;
}
</style>