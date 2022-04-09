<template>
  <div class="box">
    <div class="my-content">
      <div class="info-box">
        <div class="title-box">
          <van-image
            class="img"
            :src="data.dailyType.colorIcon"
            :width="25"
            :height="25"
          />
          <div class="name">{{ data.dailyType.name }}</div>
          <div class="num">{{ data.money }}</div>
        </div>
        <div class="line"></div>
        <div>
          <van-field
            v-model="data.account"
            readonly
            label="账户"
            placeholder="暂无数据"
            input-align="right"
            class="my-field field-line1"
          />
        </div>
        <div>
          <van-field
            v-model="data.bookedTime"
            readonly
            label="日期"
            placeholder="暂无数据"
            input-align="right"
            class="my-field field-line2"
          />
        </div>
        <div>
          <van-field
            v-model="data.createType == 0 ? '收入':'支出'"
            readonly
            label="类型"
            placeholder="暂无数据"
            input-align="right"
            class="my-field field-line2"
          />
        </div>
        <div>
          <van-field
            v-model="data.remark"
            readonly
            label="备注"
            placeholder="暂无数据"
            input-align="right"
            class="my-field field-line2"
          >
          
            <template #input>
              <div class="remark">{{ data.remark }}</div> 
            </template>
          </van-field>
        </div>
      </div>
    </div>
    <div class="my-footer">
      <van-button
        class="my-footer-button button-del"
        type="default"
        @click="handleDel"
        >删除</van-button
      >
      <van-button class="my-footer-button" type="default" @click="handleCopy"
        >复制</van-button
      >
      <van-button
        class="my-footer-button button-edit"
        type="default"
        @click="handleEdit"
        >编辑</van-button
      >
    </div>
  </div>
</template>

<script>
import { infoById, lifeDelete } from "@/api/bill.js";
export default {
  name: "billLifeDetails",
  data() {
    return { 
      eatImg: require("@/assets/icon/餐饮.png"),
      form: {},
      data: {
        dailyType: {},
      },
    };
  },
  created() {
    this.query = this.$route.query;
    // console.log("历史提额页面里的路由参数", this.query);
    this.infoById();
  },
  mounted() {},

  methods: {
    // 获取账单详情
    infoById() {
      infoById({ id: this.query.id }).then((res) => {
        console.log("获取账单详情", res);
        this.data = res.data;
      });
    },
    //   点击删除
    handleDel() {
      this.$vDialog
        .confirm({
          title: "提示",
          message: "是否删除该账单",
          confirmButtonText: "是",
          cancelButtonText: "否",
        })
        .then(() => {
          lifeDelete({ id: this.query.id }).then((res) => {
            this.$vtoast("删除账单成功");
            this.$router.go(-1);
          });
        })
        .catch(() => {
          // on cancel
        });
    },
    // 点击复制
    handleCopy() {
      this.$router.push({
        path: "/lifeEdit",
        query: {
          id: this.query.id,
          cid: this.query.cid,
          do: 'copy',
        },
      });
    },
    //   点击编辑
    handleEdit() {
      this.$router.push({
        path: "/lifeEdit",
        query: {
          id: this.query.id,
          do: 'edit',
        },
      });
    },
  },
};
</script>

<style lang="less" scoped>
.box {
  background-color: rgb(243, 243, 243);
  min-height: 100vh;
}
.my-content {
  padding-top: 20px;
  padding-bottom: 100px;
}
.my-footer {
  position: fixed;
  bottom: 0px;
  height: 100px;
  width: 100%;
  background-color: white;
}
.my-footer-button {
  width: 33.333333%;
  border-color: white;
  height: 100%;
  font-size: 30px;
}
.button-del {
  color: #999999;
}
.button-edit {
  color: #4475fe;
}
.info-box {
  background-color: white;
  padding: 50px 50px 70px 50px;
  .title-box {
    display: flex;
    align-items: center;
    .img {
    }
    .name {
      margin-left: 25px;
      font-size: 28px;
      font-family: PingFang SC;
      font-weight: 500;
      color: #212121;
    }
    .num {
      position: absolute;
      right: 50px;
      font-size: 34px;
      font-family: PingFang SC;
      font-weight: bold;
      color: #212121;
      // line-height: 36px;
    }
  }
  .line {
    height: 1px;
    // border: 1px solid #eeeeee;
    background-color: #eeeeee;
    margin-top: 40px;
    margin-bottom: 40px;
  }
  .my-field /deep/ .van-field__label {
    font-size: 16px;
    font-family: PingFang SC;
    font-weight: 500;
    color: #666666;
  }
  .my-field /deep/ .van-field__body {
    font-size: 16px;
    font-family: PingFang SC;
    font-weight: 500;
    color: #212121;
    line-height: 36px;
  }
  .field-line1 {
    margin-top: 10px;
  }
  .field-line2 {
    margin-top: 10px;
    .remark{
      line-height: 50px;
      text-align: left;
    }
  }
}
</style>