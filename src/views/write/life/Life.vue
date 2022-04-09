<template>
  <div class="box">
    <div class="card-box" v-for="item,index in accountList" :key="index">
      <WriteLife :item="item"></WriteLife>
    </div>
    <AddAccount></AddAccount>
  </div> 
</template>

<script>
import WriteLife from "@/components/common/WriteLife.vue";
import { listByUid, } from '@/api/write.js'
import AddAccount from "@/components/addAccount.vue"
export default {
  name: "life", 
  components: { WriteLife, AddAccount },
  data() {
    return {
      accountList: [
      ],
    };
  },
  created(){
    this.listByUid()
  },
  mounted() {},

  methods: {
    listByUid(){
      listByUid({type: 1}).then(res=>{
        console.log('记账账户列表接口返回res',res)
        this.accountList = res.data
      })
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