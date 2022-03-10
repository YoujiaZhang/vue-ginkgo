<template>
  <div>
    <a-card class="card" :bordered="false">
      <a-card-meta>
        <div class="title" slot="title">
          我的关注 <my-icon type="icon-wodefensi" />
        </div>
        <div slot="description">
          <div
            v-infinite-scroll="loadMore"
            :infinite-scroll-disabled="busy"
            :infinite-scroll-distance="10"
          >
            <a-list :data-source="followees" :locale="commListEmtpy">
              <a-list-item slot="renderItem" slot-scope="msg">
                <my-followee
                  class="item-summary"
                  :userID="msg.user.id"
                  :userName="msg.user.username"
                  :userAvatar="msg.user.headerUrl"
                  :hasFollowed="msg.hasFollowed"
                  :followTime="CONST.getDiffTime(msg.followTime)"
                ></my-followee>
              </a-list-item>

              <a-list-item slot="footer" v-show="followees.length!=0">
                <div style="margin-top:15px; margin-bottom:150px; width:100%; text-align: center;">
                  <span v-show="!loading" style="color:#888888;font-size: 12px"> - THE END - </span>
                  <a-spin v-show="loading" tip="加载中..."></a-spin>
                  <div v-show="followees.length==1" style="height:400px;"></div>
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
import myFollowee from "./my-followee.vue"

import infiniteScroll from "vue-infinite-scroll";
import CONST from "../../../assets/const";
import reqwest from "reqwest";

export default {
  directives: { infiniteScroll },
  components: { myFollowee },
  data() {
    return {
      CONST,
      loading: false,
      busy: false,
      current: 1,

      numFollowees: 0,
      followees: [],
      commListEmtpy: {
        emptyText: <commentsListEmpty text="暂无关注" />,
      },
    };
  },
  created() {
    window.scrollTo(0, window.scrollTo(0,document.body.scrollHeight));
    this.$emit("loadingFinish", false);
    this.fetchData((res) => {
      if(res.msg.users.result.length!=0){
        this.current += 1;
      }
      this.followees = res.msg.users.result;
      this.numFollowees = res.msg.users.rows;
    });
  },
  methods: {
    fetchData(callback) {
      reqwest({
        url: CONST.URL + "/followees/" + this.$store.state.myUserID,
        type: "json",
        method: "GET",
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

      const followees = this.followees;
      this.loading = true;

      if (followees.length >= this.numFollowees) {
        this.busy = true;
        this.loading = false;
        return;
      }
      this.fetchData((res) => {
        if(res.msg.users.result.length!=0 && this.loading){
          this.current += 1;
        }
        this.followees = followees.concat(res.msg.users.result);
        this.loading = false;
      });
    },

    refresh(){
      this.current = 1
      this.fetchData((res) => {
        if(res.msg.users.result.length!=0){
          this.current += 1;
        }
        this.followees = res.msg.users.result;
        this.numFollowees = res.msg.users.rows;
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
  padding-right: 5px;
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