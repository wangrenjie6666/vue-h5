<template>
  <div class="index-box">
    <div class="tips">选择下列账户进行记账</div>
    <div>
      <div v-if="bookType == '0'">
        <Card />
      </div>
      <div v-else-if="bookType == '1'">
        <Life />
      </div>
    </div>
  </div>
</template>

<script>
import Card from "./card/Card.vue";
import Life from "./life/Life.vue";
export default {
  components: { Card, Life },
  name: "Index",
  data() {
    return {
      bookType: null,
    };
  },
  created() {
    let nowBookType = this.$store.getters.get_bookType();
    console.log("nowBookType", nowBookType);
    if (this.bookType != nowBookType) {
      this.bookType = nowBookType;
    }
  },
  activated() {},
  mounted() {},

  methods: {},
};
</script>
 
<style lang="less" scoped>
.index-box {
  background-color: #f3f3f3;
  min-height: 100vh;
  padding: 5px 0px 100px 0px;
}
.tips {
  padding: 20px 30px 0px 30px;
  font-size: 34px;
  font-family: PingFang SC;
  font-weight: 500;
  color: #212121;
}
</style>