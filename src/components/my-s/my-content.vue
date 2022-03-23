<template>
  <div>
    <!-- 个人主页下面的导航栏 -->
    <v-touch
        v-on:swipeleft="swiperleft"
        v-on:swiperight="swiperright"
        class="v-touch"
      >
      <a-tabs
        class="card-container" type="line" size="large" tabPosition="top"
        :activeKey="tabActiveKey[tabIndex]"
        :tabBarGutter="15"
        @change="tabsChange"
      >
        <!-- ******************* 我的帖子 ******************* -->
        <a-tab-pane key="1" :forceRender="true">
          <div slot="tab">
            <my-icon type="icon-wofadetiezi" />
          </div>
          <my-posts-list ref="myPost"></my-posts-list>
        </a-tab-pane>
        <!-- ************************************************************** -->

        <!-- ************************ 我的收藏 ****************************** -->
        <a-tab-pane key="2" :forceRender="true">
          <div slot="tab">
            <my-icon type="icon-shoucang" />
          </div>
          <my-comment-list ref="myComment"></my-comment-list>
        </a-tab-pane>
        <!-- ************************************************************** -->

        <!-- ************************ 我的粉丝 ****************************** -->
        <a-tab-pane key="3" :forceRender="true">
          <div slot="tab">
            <my-icon type="icon-wodefensi" />
          </div>
          <my-follower-list ref="myFollower"></my-follower-list>
        </a-tab-pane>
        <!-- ************************************************************** -->

        <!-- ************************* 我的关注 ******************************** -->
        <a-tab-pane key="4" :forceRender="true">
          <div slot="tab">
            <my-icon type="icon-wodeguanzhu" />
          </div>
          <my-followee-list ref="myFollowee"></my-followee-list>
        </a-tab-pane>
        <!-- ************************************************************** -->
      </a-tabs>
    </v-touch>
  </div>
</template>

<script>
import myPostsList from "./my-content-s/my-posts-list.vue";
import myCommentList from "./my-content-s/my-comment-list.vue";
import myFollowerList from "./my-content-s/my-follower-list.vue";
import myFolloweeList from "./my-content-s/my-followee-list.vue";

export default {
  components: { myPostsList, myCommentList, myFollowerList, myFolloweeList },
  data() {
    return {
      tabActiveKey: ["1", "2", "3", "4"],
      tabIndex: 0,
    };
  },
  methods: {
    swiperright: function () {
      // console.log("左划");
      if(this.tabIndex==0){
        return
      }
      this.tabIndex = Math.max(0, this.tabIndex - 1);
    },
    swiperleft: function () {
      // console.log("右滑");
      if(this.tabIndex==3){
        return
      }
      this.tabIndex = Math.min(3, this.tabIndex + 1);
    },
    tabsChange(key) {

      if (key === "1") {
        this.tabIndex = 0;
        this.$refs.myPost.refresh()
      }
      if (key === "2") {
        this.tabIndex = 1;
        this.$refs.myComment.refresh()
      }
      if (key === "3") {
        this.tabIndex = 2;
        this.$refs.myFollower.refresh()
      }
      if (key === "4") {
        this.tabIndex = 3;
        this.$refs.myFollowee.refresh()
      }
    },
  },
};
</script>

<style scoped>
.card-container {
  width: 100%;
  height: 70%;
  padding-right: 10px;
  padding-left: 10px;
  /* display:none; */
}
.v-touch {
  touch-action: pan-y !important;
}
</style>