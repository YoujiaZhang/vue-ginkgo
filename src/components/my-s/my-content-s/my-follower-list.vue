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

    <a-card class="followers-list" :bordered='false'>
      <a-card-meta>
        <div class="followers-list-title" slot="title">
          我的粉丝 <my-icon type="icon-wodefensi" />
        </div>
        <div slot="description">
          <div
            v-infinite-scroll="loadMore"
            :infinite-scroll-disabled="busy"
            :infinite-scroll-distance="10"
          >
            <a-list :data-source="followers" :locale="followerListEmpty">
              <a-list-item slot="renderItem" slot-scope="msg">
                <my-follower
                  class="followers-list-item"
                  :userID="msg.user.id"
                  :userName="msg.user.username"
                  :userAvatar="msg.user.headerUrl"
                  :hasFollowed="msg.hasFollowed"
                  :followTime="CONST.getDiffTime(msg.followTime)"
                ></my-follower>
              </a-list-item>

              <!-- 列表 下方的footer -->
              <a-list-item slot="footer" v-show="followers.length!=0">
                <div style="margin-top:15px; margin-bottom:150px; width:100%; text-align: center;">
                  <span v-show="!loading" style="color:#888888;font-size: 12px"> - THE END - </span>
                  <a-spin v-show="loading" tip="加载中..."></a-spin>
                  <div v-show="followers.length==1" style="height:400px;"></div>
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
import followerListEmpty from "../../empty-s/empty-list-state.vue";
import myFollower from "./my-follower.vue";

import infiniteScroll from "vue-infinite-scroll";

import CONST from "../../../assets/const"
import axios from "../../../plugins/Axios"

export default {
  components: { myFollower },
  directives: { infiniteScroll },
  data() {
    return {
      CONST,
      loading: false,
      busy: false,

      /* 粉丝 */
      followers: [],  // 粉丝列表
      numFollowers:0, // 粉丝总数
      current: 1,     // 当前页

      followerListEmpty: {
        emptyText: <followerListEmpty text="暂无粉丝" />,
      },
    };
  },

  created() {
    window.scrollTo(0, window.scrollTo(0,document.body.scrollHeight));
    this.fetchData((res) => {
      if(res.msg.result.length!=0){
        this.current += 1;
      }

      this.followers = res.msg.result;
      this.numFollowers = res.msg.rows;
    });
  },

  methods: {
    fetchData(callback) {
      axios({
        url: "/followers/" + this.$store.state.myUserID,
        method: "GET",
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

      const followers = this.followers;
      this.loading = true;

      if (followers.length >= this.numFollowers) {
        this.busy = true;
        this.loading = false;
        return;
      }
      
      this.fetchData((res) => {
        if(res.msg.result.length!=0 && this.loading){
          this.current += 1;
        }
        this.followers = followers.concat(res.msg.result);
        this.loading = false;
      });
    },

    refresh(){
      this.current = 1
      this.followers = []
      this.fetchData((res) => {
        if(res.msg.result.length!=0){
          this.current += 1;
        }
        this.followers = res.msg.result;
        this.numFollowers = res.msg.rows;
        this.$forceUpdate();
      });
    },
  },
};
</script>

<style scoped>
.followers-list-item {
  width: 100%;
}
.followers-list {
  width: 100%;
  padding-left: 5px;
  padding-right: 5px;
}
.followers-list-title {
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