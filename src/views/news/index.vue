<template>
  <div>
    <van-tabs
      class="my-tabs"
      v-model="active"
      swipeable
      animated
      line-width="20px"
      sticky
      @change="changeTabs"
      :ellipsis="false"
    >
      <van-tab
        v-for="(item, index) in tabList"
        :title="item.name"
        :key="index"
        :name="item.id"
      >
        <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
          <van-list
            v-model="loading"
            :finished="finished"
            :finished-text="dataList.length > 0 ? '没有更多了' : ''"
            @load="onLoad"
          >
            <div v-if="dataList.length > 0">
              <div v-for="(item, index) in dataList" :key="index">
                <!-- 图片 -->
                <template>
                  <a
                    class="content-box"
                    :class="
                      !item.image ? 'content-box-img' : 'content-box-text'
                    "
                    :href="item.link + '&token=' + userinfo.unifyToken"
                    target="_blank"
                  >
                    <div class="content-left-box">
                      <div class="left-title">{{ item.title }}</div>
                      <div class="left-bottom">
                        <span> {{ item.visitsVirtual + item.visitsReal }} 阅读</span>
                        <span style="margin-left: 15px">{{
                          item.createTime
                        }}</span>
                      </div>
                    </div>
                    <div class="content-right-box" v-if="item.image">
                      <van-image
                        class="content-right-box-img"
                        :width="113"
                        :height="76"
                        :radius="5"
                        :src="item.image ? item.image : noImg"
                      />
                    </div>
                  </a>
                  <div class="line"></div>
                </template>
                <!-- 视频 -->
                <!-- <template>
                  <a
                    class="video-content-box"
                    :href="item.link"
                    target="_blank"
                  >
                    <div class="video-content-top-box">
                      {{ item.title }}
                    </div>
                    <div class="video-content-center-box">
                      <van-image
                        class="content-right-box-img"
                        width="100%"
                        height="203px"
                        :radius="5"
                        :src="item.image ? item.image : noImg"
                      />
                      <van-image
                        class="content-right-box-videoBottun"
                        :width="50"
                        :height="50"
                        :src="videoBottunUrl"
                      />
                    </div>
                    <div class="video-content-bottom-box">
                      <span>{{ item.visitsVirtual }} 阅读</span>
                      <span style="margin-left: 15px">{{
                        item.createTime
                      }}</span>
                    </div>
                  </a>
                  <div class="line"></div>
                </template> -->
              </div>
            </div>
            <div v-else class="else-noMore-box" style="height: 550px">
              <van-image :src="noMoreImg" :width="150" :height="150" />
              <div class="noMore-text">暂无内容</div>
            </div>
          </van-list>
        </van-pull-refresh>
      </van-tab>
    </van-tabs>
  </div>
</template>

<script>
import { getCategoriesList, getContentsList } from "@/api/news.js";
export default {
  name: "news",
  props: {},
  data() {
    return {
      noImg: require("@/assets/img/暂无图片.png"),
      noMoreImg: require("@/assets/img/暂无内容.png"),
      videoBottunUrl: require("@/assets/img/播放.png"),
      active: null,
      tabList: [],
      dataList: [],
      loading: false,
      finished: false,
      refreshing: false,
      pagination_size: 20,
      pagination_current: 0,
      pagination_total: null,
      userinfo:{},
    };
  },
  created() {
    this.getCategoriesList();
    this.userinfo = this.$store.getters.get_userinfo();
  },
  mounted() {},

  methods: {
    // 获取分类
    getCategoriesList() {
      getCategoriesList().then((res) => {
        console.log("获取新闻分类", res);
        if (res.data && res.data.length > 0) {
          this.tabList = res.data;
          this.active = this.tabList[0].id;
          // this.getContentsList();
        }
      });
    },
    // 获取新闻
    getContentsList() {
      let data = {
        size: this.pagination_size,
        current: this.pagination_current,
        categoryId: this.active,
      };
      getContentsList(data).then((res) => {
        console.log("获取新闻res", res);
        this.dataList = this.dataList.concat(res.data);
        this.loading = false;
        this.pagination_total = res.data.total;
        //   // 判断没有数据时 显示没有更多了
        this.pagination_current * this.pagination_size;
        if (
          this.pagination_current * this.pagination_size >=
          this.pagination_total
        ) {
          this.finished = true;
        }
        // console.log(this.dataList)
      });
    },
    // 切换tabs
    changeTabs(index, title) {
      console.log(this.active);
      // 重新加载
      this.onRefresh();
    },
    onLoad() {
      if (this.refreshing) {
        this.refreshing = false;
      }
      this.pagination_current += 1;
      this.getContentsList();
      // setTimeout(() => {
      //   // 判断是否处于下拉加载中...
      //   if (this.refreshing) {
      //     this.dataList = [];
      //     this.refreshing = false;
      //   }
      //   // 获取数据
      //   // this.getContentsList()
      //   // for (let i = 0; i < 8; i++) {
      //   //   this.dataList.push({
      //   //     content:
      //   //       "美国这次真的惹恼中国了，华春莹亮出一张照片，特朗普看懂了吗？大师傅",
      //   //     readNum: i + "0000",
      //   //     createTime: "昨天18:24",
      //   //     imgUrl: require("@/assets/img/新闻.jpg"),
      //   //     type: "img",
      //   //   });
      //   //   if (i == 2) {
      //   //     this.dataList.push({
      //   //       content:
      //   //         "视频视频视频视频视频视频视频视频视频视频视频视频视频视频视频视频视频视频 美国这次真的惹恼中国了，华春莹亮出一张照片，特朗普看懂了吗？大师傅",
      //   //       readNum: i + "0000",
      //   //       createTime: "昨天18:24",
      //   //       videoUrl: require("@/assets/img/新闻.jpg"),
      //   //       type: "video",
      //   //     });
      //   //   }
      //   //   if (i == 4) {
      //   //     this.dataList.push({
      //   //       content:
      //   //         "视频视频视频视频视频视频视频视频视频视频视频视频视频视频视频视频视频视频 美国这次真的惹恼中国了，华春莹亮出一张照片，特朗普看懂了吗？大师傅",
      //   //       readNum: i + "0000",
      //   //       createTime: "昨天18:24",
      //   //       type: "img",
      //   //     });
      //   //   }
      //   // }
      //   this.loading = false;

      //   // 判断没有数据时 显示没有更多了
      //   if (this.dataList.length >= 30) {
      //     this.finished = true;
      //   }
      // }, 1000);
    },
    onRefresh() {
      this.finished = false;
      // 清空列表数据
      this.dataList = [];
      this.pagination_current = 0;
      console.log(this.pagination_current);
      // 重新加载数据
      // 将 loading 设置为 true，表示处于加载状态
      this.loading = true;
      this.onLoad();
    },
  },
  watch: {
    active() {
      // console.log('watch里的this.active',this.active)
    },
  },
};
</script>

<style lang="less" scoped>
.my-tabs {
  /deep/ .van-tab--active{
    font-size: 17px;
    margin-top: -3px;
  }
  // .content-box-text {
  //   height: 180px;
  // }
  // .content-box-img {
  //   height: 224px;
  // }
  .content-box {
    padding: 0px 27px 0px 27px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    // background-color: rosybrown;
    .content-left-box {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      padding: 20px 0px;
      // width: 454px;
      .left-title {
        font-size: 30px;
        font-family: PingFang SC;
        font-weight: 500;
        color: #212121;
        line-height: 44px;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 2; /*想省略几行就写几*/
        -webkit-box-orient: vertical;
      }
      .left-bottom {
        margin-top: 40px;
        font-size: 22px;
        font-family: PingFang SC;
        font-weight: 500;
        color: #9f9f9f;
        line-height: 50px;
      }
    }
    .content-right-box {
      margin-left: 10px;
      display: flex;
      justify-content: center;
      align-items: center;
      .content-right-box-img {
        border-radius: 10px;
      }
    }
  }
  .video-content-box {
    padding: 20px 25px 20px 25px;
    // height: 600px;
    display: flex;
    flex-direction: column;
    // justify-content: space-between;
    .video-content-top-box {
      font-size: 30px;
      font-family: PingFang SC;
      font-weight: 500;
      color: #212121;
      line-height: 44px;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 2; /*想省略几行就写几*/
      -webkit-box-orient: vertical;
    }
    .video-content-center-box {
      margin-top: 10px;
      .content-right-box-videoBottun {
        position: absolute;
        left: 330px;
        margin-top: 150px;
      }
    }
    .video-content-bottom-box {
      font-size: 22px;
      font-family: PingFang SC;
      font-weight: 500;
      color: #9f9f9f;
      line-height: 50px;
      // margin-top: -30px;
    }
  }
  .line {
    height: 1px;
    background: #eeeeee;
    margin: 0 auto;
    margin-top: 10px;
    margin-bottom: 20px;
    width: 702px;
  }
  /deep/ .van-tabs__line {
    background: linear-gradient(90deg, #4475fe 0%, #5a85fe 100%);
    border-radius: 4px;
  }
}
</style>