<template>
  <div>
    <!-- 回到顶部 -->
    <a-back-top style="width: 100%; right: 0" :visibilityHeight="70">
      <div>
        <a-button class="backtop-button" shape="circle">
          <a-icon class="backtop-button-icon" type="rocket" />
        </a-button>
      </div>
    </a-back-top>

    <a-card class="card" :bordered="false">
      <a-card-meta>
        <div class="title" slot="title">
          Ta 的帖子 <my-icon type="icon-wofadetiezi" />
        </div>
        <div slot="description">
          
          
          <pull-refresh @refresh=pullRefresh>
          <div
            class="infinite-container"
            v-infinite-scroll="loadMore"
            :infinite-scroll-disabled="busy"
            :infinite-scroll-distance="10"
          >
            <a-list :data-source="otherPostList" :locale="commListEmtpy">
              <a-list-item slot="renderItem" slot-scope="msg">
                <otherPost
                  class="item-summary"
                  :postID="msg.post.id"
                  :authorTitle="msg.post.title"
                  :authorText="msg.post.content"
                  :releaseTime="CONST.getDiffTime(msg.post.createTime)"

                  :postPictures="msg.post.picUrls"

                  :postLikes="msg.post.likeCount"
                  :postViews="msg.post.viewCount"
                  :postComments="msg.post.commentCount"
                ></otherPost>
              </a-list-item>

              <a-list-item slot="footer" v-show="otherPostList.length!=0">
                <div style="margin-top:15px; margin-bottom:150px; width:100%; text-align: center;">
                  <span v-show="!loading" style="color:#888888;font-size: 12px"> - THE END - </span>
                  <a-spin v-show="loading" tip="加载中..."></a-spin>
                </div>
              </a-list-item>

            </a-list>
          </div>
          </pull-refresh>

        </div>
      </a-card-meta>
    </a-card>
  </div>
</template>

<script>
import commentsListEmpty from "../../empty-s/empty-list-state.vue";
import otherPost from "./other-posts.vue";
import pullRefresh from "../../refresh-s/pull-refresh.vue"

import infiniteScroll from "vue-infinite-scroll";
import CONST from "../../../assets/const";
import reqwest from "reqwest";

export default {
  props: ["userID"],
  components: { otherPost, pullRefresh },
  directives: { infiniteScroll },
  data() {
    return {
      CONST,
      loading: false,
      busy: false,
      current: 1,

      numPosts: 0,
      otherPostList: [],
      commListEmtpy: {
        emptyText: <commentsListEmpty text="暂无帖子" />,
      },
    };
  },
  created() {
    this.fetchData((res) => {
      if(res.msg.discussPosts.result.length!=0){
        this.current += 1;
      }
      this.otherPostList = res.msg.discussPosts.result;
      this.numPosts = res.msg.rows;
      this.$emit("loadingFinish", true);
    });
  },
  methods: {
    fetchData(callback) {
      reqwest({
        url: CONST.URL + "/user/discuss/" + this.userID,
        type: "json",
        method: "get",
        data: { current: this.current },
        success: (res) => {
          callback(res);
        },
      });
    },
    
    loadMore() {
      if(this.loading==true){
        return
      }

      const data = this.otherPostList;
      this.loading = true;

      if (data.length >= this.numPosts) {
        this.busy = true;
        this.loading = false;
        return;
      }

      this.fetchData((res) => {
        if(res.msg.discussPosts.result.length!=0 && this.loading){
          this.current += 1;
        }
        this.otherPostList = data.concat(res.msg.discussPosts.result);
        this.loading = false;
      });
    },

    pullRefresh(done){
      this.current = 1;
      this.fetchData((res) => {
      if(res.msg.discussPosts.result.length!=0){
        this.current += 1;
      }
      this.otherPostList = res.msg.discussPosts.result;
      this.numPosts = res.msg.rows;
      done()
      // this.$emit("loadingFinish", true);
    });
    }
  },
};
</script>

<style scoped>
.item-summary {
  width: 100%;
}
.card {
  width: 100%;
  padding-left: 15px;
  padding-right: 15px;
}
.title {
  font-size: 16px;
  text-align: center;
  padding-top: 10px;
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