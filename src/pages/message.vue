<template>
  <div>
    <a-spin tip="加载中 ···" :spinning="messageLoading">
      <a-anchor>
        <div class="title">消息</div>
      </a-anchor>

      <v-touch
        class="v-touch"
        v-on:swipeleft="swiperleft"
        v-on:swiperight="swiperright"
      >
        <a-tabs
          class="tabs"
          :activeKey="tabActiveKey[tabIndex]"
          :tabBarGutter="10"
          @change="tabsChange"
        >
          <a-tab-pane key="comment" :forceRender="true">
            <van-badge slot="tab" color="#ff6a4c"
              :content="commentNotice === 0 ? '' : commentNotice"
            >
              <span style="font-size: 16px">评论</span>
            </van-badge>
            <message-comment ref="comment" :messageType="'comment'"/>
          </a-tab-pane>


          <a-tab-pane key="like" :forceRender="true">
            <van-badge slot="tab" color="#ff6a4c"
              :content="likeNotice === 0 ? '' : likeNotice"
            >
              <span style="font-size: 16px">赞</span>
            </van-badge>

            <message-like ref="like" :messageType="'like'"/>
          </a-tab-pane>


          <a-tab-pane key="follow" :forceRender="true">
            <van-badge slot="tab" color="#ff6a4c"
              :content="followNotice === 0 ? '' : followNotice"
            >
              <span style="font-size: 16px">新增关注</span>
            </van-badge>
            <message-follow ref="follow" :messageType="'follow'"/>
          </a-tab-pane>

          <div slot="tabBarExtraContent">
            <a-button shape="round" @click="allRead">
              全部已读
              <my-icon type="icon-a-qingchuquanbuyidu"></my-icon>
            </a-button>
          </div>
          
        </a-tabs>
      </v-touch>
      
    </a-spin>
  </div>
</template>

<script>
import messageComment from "../components/message-s/message-comment.vue";
import messageLike from "../components/message-s/message-like.vue";
import messageFollow from "../components/message-s/message-follow.vue";

import axios from "../plugins/Axios"

export default {
  components: { 
    messageComment, 
    messageLike, 
    messageFollow, 
  },
  data() {
    return {
      busy: false,
      loading: false,

      tabActiveKey: ["comment", "like", "follow"],
      tabIndex: 0,

      numStyle: {
        fontSize: "5px",
        backgroundColor: "#ff6a4c",
      },

      commentNotice: 0,
      likeNotice: 0,
      followNotice: 0,

      messageLoading: false,
    };
  },
  created() {
    this.$store.dispatch("edKeyChange", true);

    if (localStorage.getItem("ticket") != "tourist") {
      this.messageLoading = true;
      let that = this
      axios({
        url: "/message/unread",
        method: "get",
      })
      .then(function (response) {
        if (String(response.data.code) == "200") {
          let res = response.data
          that.commentNotice = res.msg.commentNoticeUnreadCount;
          that.likeNotice = res.msg.likeNoticeUnreadCount;
          that.followNotice = res.msg.followNoticeUnreadCount;

          that.$store.dispatch(
            "noticeUnreadCountGet",
            res.msg.commentNoticeUnreadCount +
              res.msg.followNoticeUnreadCount +
              res.msg.likeNoticeUnreadCount +
              res.msg.letterUnreadCount
          );
          that.$forceUpdate()
        }
        that.messageLoading = false;
      });
    }
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
      if(this.tabIndex==2){
        return
      }
      this.tabIndex = Math.min(2, this.tabIndex + 1);
    },

    tabsChange(key) {
      if (key === "comment") {
        this.tabIndex = 0;
        this.$store.dispatch(
          "noticeUnreadCountGet",
          Math.max(this.$store.state.noticeUnreadCount - this.commentNotice, 0)
        );
        this.$refs.comment.refresh()
        this.commentNotice = 0;
      }
      if (key === "like") {
        this.tabIndex = 1;
        this.$store.dispatch(
          "noticeUnreadCountGet",
          Math.max(this.$store.state.noticeUnreadCount - this.likeNotice, 0)
        );
        this.$refs.like.refresh()
        this.likeNotice = 0;
      }
      if (key === "follow") {
        this.tabIndex = 2;
        this.$store.dispatch(
          "noticeUnreadCountGet",
          Math.max(this.$store.state.noticeUnreadCount - this.followNotice, 0)
        );
        this.$refs.follow.refresh()
        this.followNotice = 0;
      }
    },

    allRead() {
      axios({
        url: "/message/unread",
        method: "get",
      })
      .then(function () {
        // console.log("全部已读", res);
      });
    },
  },
};
</script>

<style scoped>
.title {
  padding-top: 10px;
  padding-bottom: 5px;
  font-size: 20px;
  font-weight: 700;
  text-align: center;
  color: #333;
  background-color: rgba(255, 255, 255, 1);
}
.tabs {
  padding-right: 10px;
  padding-left: 10px;
}
.v-touch {
  touch-action: pan-y !important;
}
</style>