<template>
  <div>
    <keep-alive v-if="$route.meta.keepAlive" >
      <router-view></router-view>
    </keep-alive>
      <router-view v-if="!$route.meta.keepAlive"></router-view>
    <van-tabbar
      v-model="active"
      placeholder
      active-color="#4475fe"
      inactive-color="#2c2c2c"
      class="my-tabbar"
    >
      <van-tabbar-item
        v-for="(item, index) in tabbar_data"
        class="tabbar"
        :key="index"
        :name="item.url"
        :to="item.url"
      >
        <span
          :class="active == item.url ? 'tabbar-text-active' : 'tabbar-text'"
          >{{ item.title }}</span
        >
        <template #icon="props">
          <!-- <a-avatar
            v-if="index == 2 && bookType == 0"
            :src="item.select_icon"
            :size="32"
          /> -->
          <a-avatar
            v-if="index == 2 "
            :src="item.icon"
            :size="32"
          />
          <img
            v-else
            width="24"
            style="height: 24px"
            :src="props.active ? item.select_icon : item.icon"
          />
        </template>
      </van-tabbar-item>
    </van-tabbar>
  </div>
</template>
<script>
export default {
  data() {
    return {
      active: null,
      tabbar_data: [
        {
          title: "首页",
          url: "/index",
          icon: require("@/assets/navIcon/首页.png"),
          select_icon: require("@/assets/navIcon/首页(1).png"),
        },
        {
          title: "账单",
          url: "/bill",
          icon: require("@/assets/navIcon/账单.png"),
          select_icon: require("@/assets/navIcon/账单(1).png"),
        },
        {
          url: "/write",
          icon: require("@/assets/navIcon/发布.png"),
          select_icon: require("@/assets/navIcon/发布(1).png"),
        },
        {
          title: "资讯",
          url: "/news",
          icon: require("@/assets/navIcon/资讯.png"),
          select_icon: require("@/assets/navIcon/资讯(1).png"),
        },
        {
          title: "个人中心",
          url: "/center",
          icon: require("@/assets/navIcon/个人中心.png"),
          select_icon: require("@/assets/navIcon/个人中心(1).png"),
        },
      ],
      bookType: null,
    };
  },

  created() {
    this.$store.commit("set_tabbarActive", this.$route.path);
    this.active = this.$route.path;
    // console.log(this.active);
    let nowBookType = this.$store.getters.get_bookType();
    if (this.bookType != nowBookType) {
      this.bookType = nowBookType;
    }
  },
  mounted() {},
  methods: {},
  computed: {
    tabbarActive() {
      return this.$store.getters.get_tabbarActive();
    },
    nowBookType() {
      // console.log(s.get_bookTypeLS());
      return this.$store.getters.get_bookTypeLS();
      // console.log(this.$store.getters.get_bookType())
    },
  },
  //监听执行
  watch: {
    active() {
      this.$store.commit("set_tabbarActive", this.active);
      // console.log("改变active");
    },
    tabbarActive() {
      this.active = this.tabbarActive;
      // console.log("home页面里的tabbar", this.active);
    },
    nowBookType() {
      // console.log("this.nowBookType", this.nowBookType);
      this.bookType = this.nowBookType;
    },
  },
};
</script>
<style lang="less" >
.plus /deep/ .van-icon__image {
  width: 45px;
  height: 45px;
}
.tabbar.van-tabbar-item {
  font-size: 12px;
  font-family: PingFang SC;
  font-weight: bold;
  color: #666666;
}
.submit-box {
  margin: 80px 30px 0px 30px;
  display: flex;
  .delete-bottom {
    height: 80px;
    background: #fc6262;
    border-radius: 20px;
    color: white;
    font-size: 30px;
  }
  .blank-box {
    width: 200px;
  }
  .submit-bottom {
    height: 80px;
    background: #4475fe;
    border-radius: 20px;
    color: white;
    font-size: 30px;
  }
}
.van-tabbar {
  height: 50px !important;
}
.noMore-text {
  font-size: 28px;
  font-family: PingFang SC;
  font-weight: 500;
  color: #7a7979;
}
.else-noMore-box {
  // text-align: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.tabbar-text {
  font-weight: 400;
}
.tabbar-text-active {
  font-weight: bold;
}
.van-tabbar-item__icon {
  // height: 25px;
}
.van-popover__content {
  padding: 5px 0px 5px 10px;
  // padding-left: 20px ;
  font-size: 12px;
}
.van-field__control {
  font-size: inherit !important;
}
.van-picker__confirm {
  font-size: initial !important;
  height: 40px;
}
.van-picker__cancel {
  font-size: initial !important;
  height: 40px;
}
.van-picker-column {
  font-size: initial !important;
}

.bgc_tooltip {
  .ant-tooltip-inner {
    padding: 10px 0px 10px 15px;
    min-width: 450px;
    border-radius: 10px;
    font-size: 23px;
  }
}
</style>