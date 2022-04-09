<template>
  <div class="box">
    <div class="cell-group-box">
      <van-cell-group>
        <van-cell title="关于我们" is-link to="/aboutUs" />
        <!-- <van-cell title="投诉与举报" is-link /> -->
        <van-cell title="修改/设置密码" is-link to="/setPassword" />
        <van-cell title="注销账号" is-link @click="handleLogoff" />
      </van-cell-group>
    </div>
    <div class="logout-box">
      <van-cell class="logout-cell" @click="handleLogout">
        <template #extra>
          <div>退出</div>
        </template>
      </van-cell>
    </div>
  </div>
</template>

<script>
import { logoff } from "@/api/center";
export default {
  name: "message",
  props: {},
  data() {
    return {
      systemNotice: false,
      serviceNotice: false,
      writeNotice: false,
    };
  },
  created() {},
  mounted() {},

  methods: {
    handleLogout() {
      window.localStorage.removeItem("userinfo");
      window.localStorage.removeItem("uid");
      window.localStorage.removeItem("token");
      window.localStorage.removeItem("uniqueId");
      this.$vtoast("退出成功");
      setTimeout(() => {
        this.$router.replace("/");
      }, 1000);
    },
    handleLogoff() {
      this.$vDialog
        .confirm({
          message: "是否注销此账号",
          confirmButtonText: "是",
          cancelButtonText: "否",
        })
        .then(() => {
          logoff().then((res) => {
            console.log(res);
            this.$vtoast("注销成功");
            setTimeout(() => {
              this.$router.push({path:"/start"});
            }, 1000);
          });
        })
        .catch(() => {
          // on cancel
        });
    },
  },
};
</script>

<style lang="less" scoped>
.box {
  background-color: #f3f3f3;
  min-height: 100vh;
  padding-top: 20px;
}
.cell-group-box {
  background-color: white;
  /deep/ .van-cell {
    padding: 13px 20px !important;
  }
  /deep/ .van-field__label,
  /deep/ .van-cell__title {
    font-size: 14px;
    font-family: PingFang SC;
    font-weight: 500;
    color: #212121;
  }
  /deep/ .van-field__value,
  /deep/ .van-cell__value {
    font-size: 14px;
    font-family: PingFang SC;
    font-weight: 500;
    color: #666666;
  }
}
.logout-box {
  margin-top: 20px;
  .logout-cell {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 90px;
    font-size: 28px;
    font-family: PingFang SC;
    font-weight: 500;
    color: #4475fe;
  }
}
</style>