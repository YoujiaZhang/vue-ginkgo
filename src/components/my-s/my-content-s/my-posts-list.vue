<template>
  <div>
    <!-- 回到顶部 -->
    <a-back-top style="height: 0; width: 100%; right: 0" :visibilityHeight="70">
      <div>
        <a-button class="backtop-button" shape="circle">
          <a-icon class="backtop-button-icon" type="rocket" />
        </a-button>
      </div>
    </a-back-top>

    <a-card class="post-list" :bordered="false">
      <a-card-meta>
        <div class="post-list-title" slot="title">
          我的帖子 <my-icon type="icon-wofadetiezi" />
        </div>
        <div slot="description">
          <div
            v-infinite-scroll="loadMore"
            :infinite-scroll-disabled="busy"
            :infinite-scroll-distance="10"
          >
            <a-list :data-source="myPostList" :locale="postListEmtpy">
              <a-list-item slot="renderItem" slot-scope="msg">
                <my-posts
                  class="post-list-item"
                  :postID="msg.post.id"
                  :authorTitle="msg.post.title"
                  :authorText="msg.post.content"
                  :pictures="msg.post.picUrls"
                  :releaseTime="CONST.getDiffTime(msg.post.createTime)"

                  :postLikes="msg.post.likeCount"
                  :postViews="msg.post.viewCount"
                  :postComments="msg.post.commentCount"
                ></my-posts>
              </a-list-item>

              <!-- 列表 下方的footer -->
              <a-list-item slot="footer" v-show="myPostList.length!=0">
                <div style="margin-top:15px; margin-bottom:150px; width:100%; text-align: center;">
                  <span v-show="!loading" style="color:#888888;font-size: 12px"> - THE END - </span>
                  <a-spin v-show="loading" tip="加载中..."></a-spin>
                  <div v-show="myPostList.length==1" style="height:400px;"></div>
                </div>
              </a-list-item>
              
            </a-list>
          </div>
        </div>
      </a-card-meta>
    </a-card>
  </div>
</template>

<script>
import postListEmtpy from "../../empty-s/empty-list-state.vue";
import myPosts from "./my-posts.vue";

import infiniteScroll from "vue-infinite-scroll";

import CONST from "../../../assets/const";
import axios from "../../../plugins/Axios"

export default {
  components: { myPosts },
  directives: { infiniteScroll },
  data() {
    return {
      CONST,
      loading: false,
      busy: false,

      /* 帖子 */
      myPostList: [], // 帖子列表
      numPosts: 0,    // 帖子总数
      current: 1,     // 当前页

      postListEmtpy: {
        emptyText: <postListEmtpy text="暂无帖子" />,
      },
    };
  },
  created() {
    window.scrollTo(0, window.scrollTo(0,document.body.scrollHeight));
    this.fetchData((res) => {
      if(res.msg.discussPosts.result.length!=0){
        this.current += 1;
      }
      this.myPostList = res.msg.discussPosts.result;
      this.numPosts = res.msg.rows;
    });
  },
  methods: {
    fetchData(callback) {
      axios({
        url: "/user/discuss/" + this.$store.state.myUserID,
        method: "get",
        params: { current: this.current },
      })
      .then(function (response) {
        callback(response.data);
      });
    },

    loadMore() {
      if(this.loading==true){
        return
      }

      const myPostList = this.myPostList;
      this.loading = true;

      if (myPostList.length >= this.numPosts) {
        this.busy = true;
        this.loading = false;
        return;
      }

      this.fetchData((res) => {
        if(res.msg.discussPosts.result.length!=0 && this.loading){
          this.current += 1;
        }
        this.myPostList = myPostList.concat(res.msg.discussPosts.result);
        this.loading = false;
      });
    },

    refresh(){
      this.current = 1
      this.myPostList = []
      this.fetchData((res) => {
        if(res.msg.discussPosts.result.length!=0){
          this.current += 1;
        }
        this.myPostList = res.msg.discussPosts.result;
        this.numPosts = res.msg.rows;
        this.$forceUpdate();
      });
    },
  },
};
</script>

<style scoped>
.post-list-item {
  width: 100%;
}
.post-list {
  width: 100%;
  padding-left: 5px;
  padding-right: 5px;
}
.post-list-title {
  font-size: 16px;
  text-align: center;
}
.backtop-button {
  float: right;
  bottom: 130px;
  right: 5%;
  width: 50px;
  height: 50px;
  background-color: rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(1px);
}
.backtop-button:hover {
  color: rgba(0, 0, 0, 0.1);
  border: 0px solid rgba(0, 0, 0, 0.1);
}

.backtop-button:active {
  border: 0px solid rgba(0, 0, 0, 0.1);
}
.backtop-button-icon {
  font-size: 20px;
}
</style>