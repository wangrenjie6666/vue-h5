<template>
  <div>
    <div class="add-box">
      <div class="add-content" @click="addShow = true">
        <van-image :width="22" :height="22" :src="addImg" />
        <div>添加新账户</div>
      </div>
    </div>
    <van-dialog
      class="add-dialog"
      v-model="addShow"
      :show-confirm-button="false"
      close-on-click-overlay
    >
      <div class="add-dialog-div">
        <div class="title">选择添加的新账户类型</div>
        <template v-for="(item, index) in addList">
            <!-- 全部 -->
          <div
            v-if="showAdd == 2"
            class="add-type-box"
            :key="index"
            @click="handleAdd(item)"
          >
            <div>{{ item.text }}</div>
            <van-image :width="35" :height="35" :src="item.icon" />
          </div>
          <!-- 信用卡 -->
          <div
            v-else-if="showAdd == 0 && index == 3"
            class="add-type-box"
            :key="index"
            @click="handleAdd(item)"
          >
            <div>{{ item.text }}</div>
            <van-image :width="35" :height="35" :src="item.icon" />
          </div>
          <!-- 生活 -->
          <div
            v-else-if="showAdd == 1 && index != 3"
            class="add-type-box"
            :key="index"
            @click="handleAdd(item)"
          >
            <div>{{ item.text }}</div>
            <van-image :width="35" :height="35" :src="item.icon" />
          </div>
        </template>
      </div>
    </van-dialog>
  </div>
</template>
<script>
export default {
  name: "message",
  props: {},
  data() {
    return {
      addImg: require("@/assets/icon/新增5.png"),
      addShow: false,
      addList: [
        {
          text: "微信",
          icon: require("@/assets/img/添加微信.png"),
          path: "/editWechat",
        },
        {
          text: "支付宝",
          icon: require("@/assets/img/添加支付宝.png"),
          path: "/editAlipay",
        },
        {
          text: "储蓄卡",
          icon: require("@/assets/img/添加储蓄卡.png"),
          path: "/editSaveCard",
        },
        {
          text: "信用卡",
          icon: require("@/assets/img/添加信用卡.png"),
          path: "/editCard",
        },
      ],
      showAdd: 2, // 2:全部,0:信用卡,1生活
    };
  },
  created() {
    console.log("组件里的路由", this.$route.path);
    if (this.$route.path == "/account") {
      this.showAdd = 2;
    } else {
      let nowBookType = this.$store.getters.get_bookType();
      this.showAdd = nowBookType;
    }
  },
  methods: {
    handleAdd(item) {
      this.$router.push({
        path: item.path,
      });
    },
  },
};
</script>
<style lang="less" scoped>
.add-box {
  .add-content {
    width: 702px;
    height: 110px;
    background: #ebf0ff;
    border: 2px dashed #4475fe;
    border-radius: 20px;

    font-size: 32px;
    font-family: PingFang SC;
    font-weight: 500;
    color: #4475fe;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 235px;
    margin: 0 auto;
    margin-top: 40px;
  }
}
.add-dialog {
  .add-dialog-div {
    padding: 40px 40px 60px 40px;
    background: #f8fafb;
    .title {
      font-size: 28px;
      font-family: PingFang SC;
      font-weight: 500;
      color: #666666;
    }
    .add-type-box {
      margin-top: 25px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 25px 35px;
      height: 106px;
      background: #ffffff;
      border: 4px solid #eeeeee;
      border-radius: 20px;
      font-size: 30px;
      font-family: PingFang SC;
      font-weight: 500;
      color: #212121;
    }
  }
}
</style>
