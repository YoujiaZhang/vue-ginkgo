<template>
  <div class="root">
    <a-spin tip="加载中 ···" :spinning="homeLoading">
    <a-affix :offset-top="0">
      <div class="title">
        <my-icon type="icon-bangdan"></my-icon>
        <span> 热 搜 </span>
      </div>
    </a-affix>

    <div>
      <a-list class="list" :data-source="hotPost" :locale="hotListEmtpy">
        <a-list-item
          slot="renderItem"
          slot-scope="msg, index"
        >
          <hotList-item
            class="post-item-summary"
            :userID="msg.user.id"
            :postID="msg.post.id"
            
            :hotRank="index"
            :hotDegree="msg.post.score.toFixed(0)"

            :postTitle="msg.post.title"
            :postContent="msg.post.content"
            :postPictures="msg.post.picUrls"
            :postReleaseTime="CONST.getDiffTime(msg.post.createTime)"

            :postComments="msg.post.commentCount"
            :postLikes="msg.post.likeCount"
            :postViews="msg.post.viewCount"

            :authorName="msg.user.username"
            :authorLevel="msg.user.level"
            :authorAvatar="msg.user.headerUrl"
          ></hotList-item>
        </a-list-item>

        <a-list-item slot="footer">
          <div style="margin-top:15px; margin-bottom:150px; width:100%; text-align: center;">
            <span style="color:#888888;font-size: 12px"> - THE END - </span>
          </div>
        </a-list-item>

      </a-list>
    </div>

    <!-- 返回主页面 -->
    <back-ball @click="goBack"/>

    </a-spin>
  </div>
</template>

<script>
import backBall from "../components/dragBall-s/backBall.vue";
import hotListItem from "../components/hotList-s/hotList-item.vue";
import hotListEmtpy from "../components/empty-s/empty-list-state.vue";

import CONST from "../assets/const";
import axios from "../plugins/Axios"

export default {
  components: { hotListItem, backBall },
  data() {
    return {
      CONST,
      hotPost: [],
      hotListEmtpy: {
        emptyText: <hotListEmtpy text="空空如也~" />,
      },
      homeLoading: true,
    };
  },
  created() {
    this.$store.dispatch("edKeyChange", false);
    
    this.fetchData((res) => {
      console.log(res)
      this.hotPost = res.msg.discussPosts.result;
      this.rows = res.msg.discussPosts.rows;
      this.homeLoading = false;
    });
  },

  methods: {
    fetchData(callback) {
      axios({
        url: "/discuss/index",
        method: "GET",
        params: { orderMode: 1, current: 1 },
      })
      .then(function (response) {
        callback(response.data);
      });
    },

    goBack() {
      this.$router.go(-1);
    },
  },
};
</script>

<style scoped>
.post-item-summary {
  width: 100%;
  height: 100%;
  margin-right: 10px;
  margin-top: 0px;
  margin-bottom: 0px;
}
.title {
  padding-top: 10px;
  padding-bottom: 5px;
  font-size: 20px;
  font-weight: 700;
  text-align: center;
  color: #333;
  background-color: rgba(255, 255, 255, 1);
}
.list {
  margin-left: 0%;
  margin-right: 0%;
}
.infinite-container {
  width: 100%;
}
</style>