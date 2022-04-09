<template>
  <div>
    <div class="top-box">
      <div class="left-box">
        <div class="login" v-if="userinfo.type == 0" @click="handleHeadImg">
          请登录
        </div>
        <div class="name" v-if="userinfo.type == 1">
          {{ userinfo.nickName }}
        </div>
      </div>
      <!-- <van-image
        :width="69"
        :height="69"
        round
        :src="uHead ? uHead : defaultAv"
        @click="handleHeadImg"
      /> -->
      <a-avatar
        :size="69"
        :src="uHead ? uHead : defaultAv"
        @click="handleHeadImg"
      />
    </div>
    <div class="center-box">
      <div class="center-div" @click="handleAccount">
        <van-image :width="38" :height="38" :src="accountUrl" />
        <div class="name">账户</div>
      </div>
      <div class="center-div" @click="handleBook">
        <van-image :width="38" :height="38" :src="bookUrl" />
        <div class="name">我的账本</div>
      </div>
      <van-dialog
        v-model="bookShow"
        show-cancel-button
        confirm-button-color="#212121"
        cancel-button-color="#999999"
        confirm-button-text="确定"
        @confirm="bookTypeConfirm"
      >
        <div class="book-dialog">
          <div
            class="dialog-top-box"
            v-for="(item, index) in bookTypeList"
            :key="index"
            :class="{ 'dialog-active': item.value == bookType }"
            @click="bookType = item.value"
          >
            <div class="dialog-name">{{ item.name }}</div>
            <van-image
              v-if="item.name == '信用卡账本'"
              :height="30"
              :width="45"
              :src="item.imgUrl"
            ></van-image>
            <van-image
              v-else
              :height="30"
              :width="35"
              :src="item.imgUrl"
            ></van-image>
          </div>
        </div>
      </van-dialog>
      <div class="center-div" @click="handleCenter">
        <van-image :width="38" :height="38" :src="centerUrl" />
        <div class="name">个人中心</div>
      </div>
    </div>
    <div class="line"></div>
    <div class="bottom-box">
      <!-- <div>
        <van-cell title="消息" :icon="xiaoxiUrl" is-link to="/message" />
      </div> -->
      <!-- <van-cell title="帮助中心" :icon="helpUrl" is-link /> -->
      <!-- <div>
        <van-cell title="提额" :icon="tieUrl" is-link @click="handleRise" />
      </div>
      <div>
        <van-cell title="图表" :icon="tubiaoUrl" is-link @click="handleCharts" />
      </div> -->
      <div>
        <van-cell title="设置" :icon="settingUrl" is-link to="/setting" />
      </div>
    </div>
  </div>
</template>

<script>
import { manageCardHome } from "@/api/index";
import { getUserInfo } from "@/api/center.js";
import { changeAccount } from "@/api/center.js";
export default {
  name: "center",
  props: {},
  data() {
    return {
      userinfo: null,
      defaultAv: require("@/assets/img/默认头像.png"),
      accountUrl: require("@/assets/icon/账户.png"),
      bookUrl: require("@/assets/icon/我的账本.png"),
      centerUrl: require("@/assets/icon/个人中心.png"),
      xiaoxiUrl: require("@/assets/icon/消息.png"),
      helpUrl: require("@/assets/icon/帮助中心.png"),
      settingUrl: require("@/assets/icon/设置.png"),
      tieUrl: require("@/assets/icon/提额.png"),
      tubiaoUrl: require("@/assets/icon/图标.png"),
      bookShow: false,
      bookType: null,
      bookTypeList: [
        {
          value: 0,
          name: "信用卡账本",
          imgUrl: require("@/assets/img/信用卡账本.png"),
        },
        {
          value: 1,
          name: "生活账本",
          imgUrl: require("@/assets/img/生活账本.png"),
        },
      ],
      uHead: null,
    };
  },
  created() {
    this.userinfo = this.$store.getters.get_userinfo();
    if (this.userinfo.type == 1) {
      this.getUserInfo();
    }
    // this.userinfo.headPic = this.userinfo.headPic+'?'+new Date().getTime();
    console.log("created", this.userinfo.creditCardNum);
    this.manageCardHome();
  },
  activated() {
    // this.userinfo.headPic = this.userinfo.headPic+'?'+new Date().getTime();
    // this.userinfo = this.$store.getters.get_userinfo();
    console.log("activated");
  },
  mounted() {},

  methods: {
    // 获取页面信息
    manageCardHome() {
      manageCardHome().then((res) => {
        console.log("获取信用卡数", res);
        if (
          res.data.homeCreditResponseList &&
          res.data.homeCreditResponseList.length <= 0
        ) {
          this.bookType = 1;
          changeAccount({ bookType: this.bookType }).then((res) => {
            this.$store.commit("set_bookType", this.bookType);
          });
        }
      });
    },
    // 获取用户信息
    getUserInfo() {
      getUserInfo().then((res) => {
        console.log("获取用户信息res", res);
        this.uHead = res.data.uHead;
      });
    },
    // 点击头像跳转编辑页面
    handleHeadImg() {
      this.$router.push({
        path: "/personEdit",
        // query: {
        //   account: this.item.account,
        // },
      });
    },
    // 点击个人中心
    handleCenter() {
      this.$router.push({
        path: "/personCenter",
        // query: {
        //   account: this.item.account,
        // },
      });
    },
    // 点击账户
    handleAccount() {
      this.$router.push({
        path: "/account",
        // query: {
        //   account: this.item.account,
        // },
      });
    },
    // 点击账本
    handleBook() {
      let userinfo = JSON.parse(localStorage.getItem("userinfo"));
      // console.log('userinfo.type',userinfo.type)
      // 判断是否有用户缓存 没有则生成gid游客登录,有则进入跳转判判断操作
      // console.log(to,from)
      if (userinfo.type == 0) {
        // 判断当前是否是游客 0游客 1用户
        return this.$router.push({
          path: "/login",
          // query: {
          //   account: this.item.account,
          // },
        });
      }
      this.bookType = this.$store.getters.get_bookType();
      this.bookShow = true;
    },
    // 切换账本类型
    bookTypeConfirm() {
      changeAccount({ bookType: this.bookType }).then((res) => {
        this.$vtoast("切换成功");
        this.$store.commit("set_bookType", this.bookType);
        if (this.bookType == 0 && res.data < 1) {
          this.$router.push({ path: "/editCard" });
        }
      });
    },
    //   提额
    handleRise() {
      // if (!this.cardList || this.cardList.length < 1) {
      //   return this.$vtoast("暂无信用卡, 无法进行诊断");
      // }
      this.$router.push({ path: "/rise" });
    },
    // 点击图表跳转
    handleChart() {
      this.$router.push({ path: "/bookChart" });
    },
  },
};
</script>

<style lang="less" scoped>
.top-box {
  // background-color: bisque;
  background-image: url("../../assets/img/个人中心顶部背景.png");
  background-repeat: no-repeat;
  background-size: 100%;
  height: 247px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0px 45px;
  .login {
    font-size: 34px;
    font-family: PingFang SC;
    font-weight: bold;
    color: #212121;
  }
  .name {
    font-size: 34px;
    font-family: PingFang SC;
    font-weight: bold;
    color: #212121;
  }
}
.center-box {
  display: flex;
  justify-content: space-around;
  align-items: center;
  height: 180px;
  padding: 0px 20px;
  .center-div {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    height: 120px;
    .name {
      margin-top: 8px;
      font-size: 28px;
      font-family: PingFang SC;
      font-weight: bold;
      color: #212121;
    }
  }
}
.book-dialog {
  padding: 50px 80px 50px 80px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 350px;
  .dialog-top-box,
  .dialog-bottom-box {
    height: 106px;
    border-radius: 53px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0px 50px;
    border: 4px solid #eeeeee;
  }
  .dialog-active {
    border: 4px solid #4475fe;
  }
}

.line {
  width: 700px;
  height: 2px;
  background: #f2f2f2;
  margin: 0 auto;
  margin-top: 20px;

  margin-bottom: 20px;
}
.bottom-box {
  padding: 5px 36px;
  /deep/ .van-cell {
    padding: 13px 0px !important;
  }
  /deep/ .van-cell__left-icon {
    // margin-top: -3px;
    margin-right: 10px;
    display: flex;
    align-items: center;
  }
  /deep/ .van-icon__image {
    height: 22px;
    width: 22px;
  }
  /deep/ .van-cell__title {
    font-size: 15px;
    font-family: PingFang SC;
    font-weight: 500;
    color: #212121;
  }
}
</style>