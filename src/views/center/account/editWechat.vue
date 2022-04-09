<template>
  <div class="box">
    <div class="cell-group-box">
      <van-cell-group>
        <van-field
          v-model="form.userName"
          label="姓名"
          placeholder="请输入姓名"
          input-align="right"
        />
        <van-field
          v-model="form.cardNumber"
          label="微信账号"
          placeholder="请输入微信账号"
          input-align="right"
          :disabled="$route.query.cid != null"
        />
      </van-cell-group>
      <div class="submit-box">
        <van-button v-if="$route.query.cid != null" class="delete-bottom" block @click="handleDelete"
          >删除</van-button
        >
        <div v-if="$route.query.cid != null" class="blank-box"></div>
        <van-button
          class="submit-bottom"
          block
          native-type="submit"
          @click="handleSubmit"
          >确定</van-button
        >
      </div>
    </div>
  </div>
</template>

<script>
import { getCardInfo as getCardInfo5 } from "@/api/diagnosis.js";
import { accountAdd } from "@/api/center.js";
import { accountCardEdit, deleteCardByCid } from "@/api/account.js";

export default {
  name: "editAlipay",
  props: {},
  data() {
    return {
        action: 'add', // edit
      form: {},
    };
  },
  created() {
    if (this.$route.query.cid) {
      this.getCardInfo5();
    }
  },
  mounted() {},

  methods: {
    // 查询卡片信息
    getCardInfo5() {
      getCardInfo5({ cid: this.$route.query.cid }).then((res) => {
        console.log("查询卡片信息5.0res", res);
        this.form = {
          cardNumber: res.data.cardNumber,
          userName: res.data.userName,
        };
      });
    },
    // 确定表单
    handleSubmit() {
      console.log(this.form);
      if ( !this.form.userName || this.form.userName.length > 20 ) {
        return this.$vtoast("请输入姓名（20位以内）");
      } else if (!this.form.cardNumber ||this.form.cardNumber.length > 20) {
        return this.$vtoast("请输入微信账号（20位以内）");
      }else if (!this.form.cardNumber ||this.form.cardNumber.length < 4) {
        return this.$vtoast("请输入微信账号（4位以上）");
      }
      let form = { ...this.form };
      let data = {
        belongTypeId: 4,
        userName: form.userName,
      };
      // console.log('data',data,'form',form);
      if (this.$route.query.cid) {
        data.cid = this.$route.query.cid
        accountCardEdit(data).then((res) => {
          this.$vtoast("修改成功");
          setTimeout(() => {
            this.$router.go(-1);
          }, 1000);
        });
      } else {
        data.cardNumber = form.cardNumber;
        accountAdd(data).then((res) => {
          this.$vtoast("添加成功");
          setTimeout(() => {
            this.$router.go(-1);
          }, 1000);
        });
      }
    },
    // 删除表单
    handleDelete(){
      console.log(this.form);
      this.$vDialog
        .confirm({
          message: "确定要删除此卡?",
          confirmButtonText: "是",
          cancelButtonText: "否",
        })
        .then(() => {
          deleteCardByCid({ cid: +this.$route.query.cid }).then((res) => {
            this.$vtoast("删除成功");
            setTimeout(() => {
              this.$router.go(-1);
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
  padding-top: 10px;
}
.cell-group-box {
  background-color: white;
  padding-bottom: 50px;
  //   margin-top: 20px;
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

</style>