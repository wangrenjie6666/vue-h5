<template>
  <div class="box">
    <div class="cell-group-box">
      <van-cell-group>
        <van-field
          v-model="form.userName"
          label="持卡人姓名"
          placeholder="请输入姓名"
          input-align="right"
        />
        <van-field
          v-model="form.cardNumber"
          label="卡号"
          placeholder="请输入您的卡号"
          input-align="right"
          type="digit"
          :disabled="$route.query.cid != null"
        />
        <van-field
          v-model="form.bank"
          label="卡片所属银行"
          is-link
          input-align="right"
          readonly
          @click="cardListShow = true"
        >
          <template #button>
            <div v-if="Object.keys(selectBank).length <= 0">请选择银行</div>
            <div v-else class="bank-name-box">
              <van-image
                class="bank-img"
                :width="26"
                :height="26"
                :src="selectBank.colorIcon"
              />
              <div class="name">{{ selectBank.bankName }}</div>
            </div>
          </template>
        </van-field>
        <!-- 选择银行 popup-->
        <van-popup v-model="cardListShow" position="bottom">
          <van-picker
            @cancel="cardListShow = false"
            title="选择银行"
            show-toolbar
            :columns="cardList"
            value-key="bankName"
            visible-item-count="10"
            @confirm="cardListConfirm"
          />
        </van-popup>
      </van-cell-group>
      <div class="submit-box">
        <van-button
          v-if="$route.query.cid != null"
          class="delete-bottom"
          block
          @click="handleDelete"
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
import { bankList } from "@/api/center.js";
import { getCardInfo as getCardInfo5 } from "@/api/diagnosis.js";
import { accountAdd } from "@/api/center.js";
import { accountCardEdit, deleteCardByCid } from "@/api/account.js";
export default {
  name: "editSaveCard",
  props: {},
  data() {
    return {
      action: "add", // edit
      cardListShow: false,
      cardList: [
        {
          value: 0,
          name: "招商银行",
          bankImg: require("@/assets/icon/现金.png"),
        },
        {
          value: 1,
          name: "建设银行",
          bankImg: require("@/assets/icon/现金.png"),
        },
      ],
      form: {},
      selectBank: {},
    };
  },
  created() {
    this.bankList();
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
        this.selectBank = res.data.bank;
      });
    },
    // 查询银行列表
    bankList() {
      bankList({ size: 200 }).then((res) => {
        // console.log(res.data.records)
        this.cardList = res.data.records;
        if (this.selectBank && Object.keys(this.selectBank).length >= 0) {
          this.cardList.forEach((item, index) => {
            if (item.bankId == this.selectBank.bankId) {
              this.bankDefaultIndex = index;
            }
          });
        }
      });
    },
    //   确定选择银行列表
    cardListConfirm(item) {
      console.log(item);
      this.selectBank = item;
      this.cardListShow = false;
    },
    // 确定表单
    handleSubmit() {
      console.log(this.form);
      if ( !this.form.userName || this.form.userName.length > 20) {
        return this.$vtoast("请输入姓名（20位以内）");
      } else if ( !this.form.cardNumber || this.form.cardNumber.length < 4 || this.form.cardNumber.length > 19) {
        return this.$vtoast("请输入4-19位卡号");
      } else if ( Object.keys(this.selectBank).length <= 0) {
        return this.$vtoast("请选择银行");
      }
      let form = { ...this.form };
      let data = {
        belongTypeId: 2,
        bankId: this.selectBank.bankId,
        userName: form.userName,
      };
      // console.log('data',data,'form',form);
      if (this.$route.query.cid) {
        data.cid = this.$route.query.cid;
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
    handleDelete() {
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
  .bank-name-box {
    display: flex;
    //   align-items: center;
    .bank-img {
      margin-top: -3px;
      margin-right: 10px;
    }
  }
}
</style>