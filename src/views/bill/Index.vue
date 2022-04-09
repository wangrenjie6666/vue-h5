<template>
  <div class="index-box">
    <div>
      <div v-if="bookType == '0'">
          <Card></Card>
      </div>
      <div v-else-if="bookType == '1'">
          <Life></Life>
      </div>
    </div>
  </div>
</template>

<script>
import Card from './card/Card';
import Life from './life/Life';
export default {
  components: { Card, Life },
  name: "Index",
  data() {
    return {
      bookType: null,
    };
  },
  created() {
    // console.log(this.$store.commit('set_bookType','test'))
    let nowBookType = this.$store.getters.get_bookType()
    if(this.bookType != nowBookType){
      this.bookType = nowBookType
    }
  },
  activated(){
    // let nowBookType = this.$store.getters.get_bookType()
    // if(this.bookType != nowBookType){
    //   this.bookType = nowBookType
    // }
  },
  mounted() {
  },

  methods: {
  },
};
</script>

<style lang="less" scoped>
.index-box{
  background-color: #f3f3f3;
  min-height: 93.9vh;
  padding-bottom: 5px;
}
</style>