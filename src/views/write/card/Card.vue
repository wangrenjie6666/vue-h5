<template>
  <div class="box">
    <div v-if="accountList && accountList.length > 0">
      <div class="card-box" v-for="(item, index) in accountList" :key="index">
        <Write :item="item" :index="index"></Write>
      </div>
    </div>
    <div v-else class="else-noMore-box" style="height: 500px">
      <van-image :src="noMoreImg" :width="150" :height="150" />
      <div class="noMore-text">暂无内容</div>
    </div>
    <AddAccount></AddAccount>
  </div>
</template>

<script>
import Write from "@/components/common/Write.vue";
import { listByUid } from "@/api/write.js";
import AddAccount from "@/components/addAccount.vue"
export default {
  name: "card",
  components: { Write, AddAccount },
  data() {
    return {
      noMoreImg: require("@/assets/img/暂无内容.png"),
      accountList: [],
    };
  },
  created() {
    this.listByUid();
  },
  mounted() {},

  methods: {
    listByUid() {
      listByUid({ type: 0 }).then((res) => {
        console.log(res);
        this.accountList = res.data;
      });
    },
  },
};
</script>

<style lang="less" scoped>
.card-box {
  width: 100%;
  padding-top: 15px;
}
</style>