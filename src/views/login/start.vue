<template>
  <div class="box">
    <div class="background"></div>
    <div class="content-box">
      <div class="title">请选择账本类型</div>
      <div class="remark">请从下方选择您要使用的账本类型，可在个人中心切换</div>
      <template v-for="(item, index) in typeList">
        <div
          class="type-div"
          :class="{ 'type-active': index == active }"
          @click="handleType(index)"
          :key="index"
          :style="index <= 0 ? 'margin-top:45px' : 'margin-top:30px'"
        >
          <div class="type-left">
            <div class="type-title">{{ item.text }}</div>
            <div class="type-remark">{{ item.remark }}</div>
          </div>
          <van-image
            class="type-img"
            v-if="item.text == '信用卡账本'"
            :height="99"
            :width="102"
            :src="item.img"
          ></van-image>
          <van-image
            class="type-img"
            v-else
            :height="99"
            :width="102"
            :src="item.img"
          ></van-image>
        </div>
      </template>

      <!-- <div class="life-div" @click="handleType">
        <div>生活账本</div>
        <van-image :height="35" :width="48" :src="lifeImg"></van-image>
      </div> -->
      <!-- <div class="next-div" @click="handleNext">
        <van-image
          class="next-img"
          :height="60"
          :width="190"
          :src="nextImg"
        ></van-image>
      </div> -->
      <van-button round type="info" class="next-botton" :disabled="disabled" @click="handleNext">{{ nextText }}</van-button>
    </div>
  </div>
</template>

<script>
import { guid } from "@/utils/dom.js";
import { loginForVisitor } from "@/api/login.js";
export default {
  name: "start",
  props: {},
  components: {},
  data() {
    return {
      nextImg: require("@/assets/img/下一步.png"),
      typeList: [
        {
          text: "信用卡账本",
          remark: "分析、提额、风险预测",
          img: require("@/assets/img/start信用卡账本.png"),
        },
        {
          text: "生活账本",
          remark: "记录日常收入、开销",
          img: require("@/assets/img/start生活账本.png"),
        },
      ],
      active: null,
      disabled: true,
      nextText: '请选择账本'
    };
  },
  created() {},
  mounted() {},
  methods: {
    handleType(index) {
      this.disabled = false;
      this.nextText = '我选择好了'
      this.active = index;
    },
    handleNext() {
      if (this.active === null) {
        return this.$vtoast("请选择账本");
      }
      let uniqueId = guid();
      let data = {
        uniqueId,
        fromType: 2, //2 代表H5
        bookType: this.active,
      };
      loginForVisitor(data).then((res) => {
        this.$store.commit("set_uniqueId", uniqueId);
        this.$store.commit("set_userinfo", res.data);
        this.$store.commit("set_uid", res.data.uid);
        this.$store.commit("set_token", res.data.token);
        if (this.active == 0) {
          // 信用卡账本
          this.$router.push({
            path: "/editCard",
          });
        } else if (this.active == 1) {
          // 生活账本
          this.$router.push({
            path: "/",
          });
        }
      });
    },
  },
};
</script>

<style lang="less" scoped>
.box {
  // background-color: rgb(237, 242, 255);
  min-height: 100vh;
}
.background {
  height: 452px;
  width: 100%;
  background-image: url("../../assets/img/start背景.png");
  background-size: 100% 100%;
}
.content-box {
  position: absolute;
  top: 0;
  width: 100%;
  display: flex;
  flex-direction: column;
  // align-items: center;
  padding: 120px 35px 0px 35px;
  .title {
    // margin-top: 20%;
    font-size: 42px;
    font-family: PingFang SC;
    // font-weight: bold;
    // letter-spacing: 1px;
    color: #ffffff;
  }
  .remark {
    margin-top: 30px;
    font-size: 26px;
    font-family: PingFang SC;
    font-weight: 500;
    color: #ffffff;
    // letter-spacing: 1px;
  }
  .type-div {
    margin-left: 20px;
    margin-right: 20px;
    // width: 424px;
    height: 220px;
    background: #ffffff;
    border-radius: 20px;
    display: flex;
    justify-content: space-between;

    align-items: center;
    padding: 0px 0px 0px 50px;
    border: 4px solid #ffffff;
    font-size: 30px;
    font-family: PingFang SC;
    font-weight: 500;
    color: #212121;
    box-shadow: 0px 0px 15px 0px rgba(33, 33, 33, 0.1);
    .type-left {
      height: 100%;
      padding: 45px 0px;
      display: flex;
      flex-direction: column;
      justify-content: space-around;
      letter-spacing: 1px;
      .type-title {
        font-size: 36px;
        font-family: PingFang SC;
        font-weight: 500;
        color: #212121;
      }
      .type-remark {
        font-size: 26px;
        font-family: PingFang SC;
        font-weight: 500;
        color: #999999;
      }
    }
    .type-img {
      margin-left: 50px;
    }
  }
  .type-active {
    border: 4px solid #4475fe;
  }
  .next-div {
    margin: 0 auto;
    margin-top: 150px;
    background-image: url("../../assets/img/下一步.png");
    background-position: 100% 100%;
    width: 3750px;
    height: 200px;
    .next-img {
      // margin-left: 280px;
    }
  }
}
.next-botton {
  margin: 0 auto;
  margin-top: 150px;
  width: 370px;
  height: 100px;
  background-color: rgb(68, 117, 254);
  font-size: 34px;
}
</style>