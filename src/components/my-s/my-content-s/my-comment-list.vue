<template>
  <div>
    <!-- 回到顶部 -->
    <a-back-top
      style="height: 0; width: 100%; right: 0"
      :visibilityHeight="400"
    >
      <div>
        <a-button class="backtop-button" shape="circle">
          <a-icon class="backtop-button-icon" type="rocket" />
        </a-button>
      </div>
    </a-back-top>

    <a-card class="card" :bordered="false">
      <a-card-meta>
        <div class="title" slot="title">
          我的评论 <my-icon type="icon-wofadetiezi" />
        </div>
        <div slot="description">
          <div
            v-infinite-scroll="loadMore"
            :infinite-scroll-disabled="busy"
            :infinite-scroll-distance="10"
          >
            <a-list :data-source="comments" :locale="commListEmtpy">
              <a-list-item slot="renderItem" slot-scope="msg">
                <my-comment
                  class="item-summary"
                  :parent="msg.parent"
                  :post="msg.post"
                  :comment="msg.comment"
                ></my-comment>
              </a-list-item>

              <a-list-item slot="footer" v-show="comments.length!=0">
                <div style="margin-top:15px; margin-bottom:150px; width:100%; text-align: center;">
                  <span v-show="!loading" style="color:#888888;font-size: 12px"> - THE END - </span>
                  <a-spin v-show="loading" tip="加载中..."></a-spin>
                  <div v-show="comments.length==1" style="height:400px;"></div>
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
import commentsListEmpty from "../../empty-s/empty-list-state.vue";
import myComment from "./my-comment.vue";

import infiniteScroll from "vue-infinite-scroll";
import axios from "../../../plugins/Axios"

export default {
  components: { myComment },
  directives: { infiniteScroll },
  data() {
    return {
      loading: false,
      busy: false,
      current: 1,

      numComments: 0,
      comments: [],
      commListEmtpy: {
        emptyText: <commentsListEmpty text="暂无评论" />,
      },
    };
  },
  created() {
    window.scrollTo(0, window.scrollTo(0,document.body.scrollHeight));
    this.$emit("loadingFinish", false); 
    this.fetchData((res) => {
      if(res.msg.comments.result.length!=0){
        this.current += 1;
      }
      this.comments = res.msg.comments.result;
      this.numComments = res.msg.commentCounts;
      this.$emit("loadingFinish", true);
    });
  },
  methods: {
    fetchData(callback) {
      axios({
        url: "/user/comment/" + this.$store.state.myUserID,
        type: "json",
        method: "GET",
        data: { current: this.current },
      })
      .then(function (response) {
        callback(response.data);
      });
    },

    loadMore() {
      if(this.loading==true){
        return
      }

      const data = this.comments;
      this.loading = true;

      if (data.length >= this.numComments) {
        this.busy = true;
        this.loading = false;
        return;
      }

      this.fetchData((res) => {
        if(res.msg.comments.result.length!=0 && this.loading){
          this.current += 1;
        }
        this.comments = data.concat(res.msg.comments.result);
        this.loading = false;
      });
    },

    refresh(){
      this.current = 1
      this.fetchData((res) => {
        if(res.msg.comments.result.length!=0){
          this.current += 1;
        }
        this.comments = res.msg.comments.result;
        this.numComments = res.msg.commentCounts;
      });
    },
  },
};
</script>

<style scoped>
.item-summary {
  width: 100%;
}
.card {
  width: 100%;
  padding-left: 5px;
  padding-right: 0px;
}
.title {
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