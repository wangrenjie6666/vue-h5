<template>
  <div>
      <!-- :enter-active-class="enterTransition"
      :leave-active-class="leaveTransition" -->
    <transition
      :enter-active-class="enterTransition"
      :leave-active-class="leaveTransition"
    >
      <!-- <router-view v-if="index == 0"></router-view> -->
      <router-view></router-view>
    </transition>
    <Loading v-show="isLoading" />
  </div>
</template>
<script>
import { mapState } from "vuex";
import Loading from "@/views/loading.vue";
export default {
  components: {
    Loading,
  },
  computed: {
    ...mapState(["isLoading"]),
  },
  data() {
    return {
      // index: 0,
      enterTransition: "",
      leaveTransition: "",
    };
  },
  created() {
    console.log("this.$navigation.on", this.$navigation.on);
    // this.$navigation.on("forward", (to, from) => {
    //   this.enterTransition = "animate__animated animate__fadeInRight";
    //   this.leaveTransition = "animate__animated animate__fadeOutLeft";
    // });
    // this.$navigation.on("back", (to, from) => {
    //   this.enterTransition = "animate__animated animate__fadeInLeft";
    //   this.leaveTransition = "animate__animated animate__fadeOutRight";
    // });
    // this.$navigation.on("replace", (to, from) => {
    //   this.enterTransition = "animate__animated animate__fadeIn";
    //   this.leaveTransition = "animate__animated animate__fadeOut";
    // });
  },
  methods: {
    test() {
      console.log(12123);
    },
  },
  watch: {
    $route(to, from) {
      // 通过判断路由自定义的级别来判断是转入还是转出
      if (to.meta.index > from.meta.index) {
        this.enterTransition = "animate__animated animate__fadeInRight animate__faster";
        this.leaveTransition = "animate__animated animate__fadeOutLeft animate__faster";
      } else if(to.meta.index < from.meta.index){
        this.enterTransition = "animate__animated animate__fadeInLeft animate__faster",
        this.leaveTransition = "animate__animated animate__fadeOutRight animate__faster";
      } else if(to.meta.index == from.meta.index){
        this.enterTransition = "",
        this.leaveTransition = "";
      }
    },
  },
};
</script>
<style lang="scss">
// .md-dialog .md-popup {
//   z-index: 10000000000000000000000 !important;
// }
.loading {
  width: 100%;
  height: 100%;
  left: 0;
  top: 0;
  position: fixed;
  padding-top: 700px;
}

/*
    动画样式
    will-change: transform    优化渲染速度
*/
.animate__animated {
  height: 100vh;
  width: 100%;
  position: absolute;
  background: opacity;
}
</style>