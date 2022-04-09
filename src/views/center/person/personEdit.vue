<template>
  <div class="box">
    <div class="filed-box">
      <van-uploader :after-read="afterRead">
        <div class="head-box">
          <!-- <van-image
            round
            :width="69"
            :height="69"
            :src="form.uHead ? form.uHead : defaultAv"
            :style="{ visibility: 'visible' }"
          /> -->
          <a-avatar
            :size="69"
            :src="form.uHead ? form.uHead : defaultAv"
            :style="{ visibility: 'visible' }"
          />
          <div class="changeFont">更换头像</div>
        </div>
      </van-uploader>
      <div class="cell-group-box">
        <van-cell-group>
          <van-field
            v-model="form.uNikeName"
            label="昵称"
            placeholder="请输入您的昵称"
            input-align="right"
            maxlength="15"
          />
          <van-field
            v-model="form.sign"
            label="签名"
            placeholder="请输入您的签名"
            input-align="right"
            maxlength="20"
          />
          <van-cell
            title="性别"
            is-link
            :value="form.uSex == 0 ? '男' : form.uSex == 1 ? '女' : '未知'"
            @click="sexShow = true"
          />
          <van-action-sheet
            v-model="sexShow"
            :actions="sexActions"
            @select="sexSelect"
          />
          <van-cell
            title="生日"
            is-link
            :value="form.birthday"
            @click="birthShow = true"
          />
          <van-popup v-model="birthShow" round position="bottom">
            <van-datetime-picker
              v-model="currentDate"
              type="date"
              :min-date="new Date('1900-01-01')"
              :max-date="maxDate"
              title="选择年月日"
              @confirm="birthConfirm"
              @cancel="birthCancel"
            />
          </van-popup>
          <van-field
            v-model="form.job"
            label="职务"
            placeholder="请输入您的职务"
            input-align="right"
            maxlength="10"
          />
          <van-field
            v-model="form.address"
            label="家庭地址"
            placeholder="请输入您的家庭地址"
            input-align="right"
            maxlength="40"
          />
        </van-cell-group>
      </div>
    </div>
    <div class="action-box">
      <van-button class="submit" type="info" @click="submit">保存</van-button>
    </div>
  </div>
</template>

<script>
import { getUserInfo, editUserInfo, modifyHead } from "@/api/center.js";
export default {
  name: "personEdit",
  props: {},
  data() {
    return {
      defaultAv: require("@/assets/img/默认头像.png"),
      headImg: "",
      sexShow: false,
      birthShow: false,
      sexActions: [
        { value: 0, name: "男" },
        { value: 1, name: "女" },
      ],
      form: {},
      // minDate: new Date('1900-1-1'),
      file: {},
    };
  },
  created() {
    this.initDefaultDate();
    this.getUserInfo();
  },
  mounted() {},

  methods: {
    // 获取用户信息
    getUserInfo() {
      getUserInfo().then((res) => {
        console.log("获取用户信息res", res);
        this.form = res.data;
      });
    },

    //初始化查询时间
    initDefaultDate() {
      const nowDate = new Date();
      const nowYear = nowDate.getFullYear();
      const currMonth = nowDate.getMonth() + 1;
      const nowMonth = currMonth < 10 ? "0" + currMonth : currMonth;
      const nowDay =
        nowDate.getDate() < 10 ? "0" + nowDate.getDate() : nowDate.getDate();
      const today = new Date(nowYear + "-" + nowMonth + "-" + nowDay);
      this.currentDate = today;
      this.maxDate = today;
      console.log(this.currentDate);
    },
    //   图片读取成功
    afterRead(file) {
      console.log(file);
      this.file = file;
      this.headImg = file.content;
      modifyHead(file).then((res) => {
        console.log("修改头像接口返回res", res);
        let userinfo = this.$store.getters.get_userinfo();
        userinfo.headPic = res.data.uHead;
        userinfo.uHead = res.data.uHead;
        this.$store.commit("set_userinfo", userinfo);
        this.form.uHead = userinfo.uHead + "?" + new Date().getTime();
        this.$nextTick(() => {
          console.log("$nextTick");
          this.$forceUpdate();
        });
        this.$vtoast("头像修改成功");
      });
    },
    // 选择性别
    sexSelect(item) {
      console.log(item);
      this.form.uSex = item.value;
      this.sexShow = false;
    },
    // 生日确定
    birthConfirm(value) {
      const nowYear = value.getFullYear();
      const currMonth = value.getMonth() + 1;
      const nowMonth = currMonth < 10 ? "0" + currMonth : currMonth;
      const nowDay =
        value.getDate() < 10 ? "0" + value.getDate() : value.getDate();
      this.form.birthday = nowYear + "-" + nowMonth + "-" + nowDay;
      console.log(this.form.birthday);
      this.birthShow = false;
    },
    // 生日取消
    birthCancel() {
      this.birthShow = false;
    },
    // 提交表单
    submit() {
      let form = { ...this.form };
      console.log(form);
      let data = {
        uNikeName: form.uNikeName,
        uHead: form.uHead,
        birthday: form.birthday,
        uSex: form.uSex,
        address: form.address,
        sign: form.sign,
        job: form.job,
      };
      editUserInfo(data).then((res) => {
        console.log("修改用户信息res", res);
        this.$store.commit("set_userinfo", res.data);
        this.$vtoast("保存成功");
        setTimeout(() => {
          this.$router.go(-1); //返回上一层
        }, 1000);
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
.filed-box {
  background-color: white;
  padding-bottom: 20px;
}
.head-box {
  width: 750px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  padding: 20px 0px;
  height: 235px;
  .changeFont {
    font-size: 28px;
    font-family: PingFang SC;
    font-weight: 500;
    color: #4475fe;
  }
}
.cell-group-box {
  margin-top: 20px;
  /deep/ .van-cell {
    padding: 13px 20px !important;
  }
  /deep/ .van-field__label,
  /deep/ .van-cell__title {
    font-size: 14px !important;
    font-family: PingFang SC !important;
    font-weight: 500 !important;
    color: #212121 !important;
  }
  /deep/ .van-field__value,
  /deep/ .van-cell__value {
    font-size: 14px !important;
    font-family: PingFang SC !important;
    font-weight: 500 !important;
    color: #212121 !important;
  }
}
.action-box {
  margin-top: 200px;
  width: 100%;
  display: flex;
  justify-content: space-around;
  .submit {
    width: 700px;
    height: 80px;
    background: #4475fe;
    border-radius: 20px;
    font-size: 30px;
    font-family: PingFang SC;
    // font-weight: bold;
    color: #ffffff;
  }
}
</style>