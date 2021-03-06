<template>
  <div>
    <!-- 回到顶部 -->
    <a-back-top style="width: 100%; right: 0" :visibilityHeight="400">
      <div>
        <a-button class="backtop-button" shape="circle">
          <a-icon class="backtop-button-icon" type="rocket" />
        </a-button>
      </div>
    </a-back-top>

    <div
      v-infinite-scroll="loadMoreMessage"
      :infinite-scroll-disabled="busy"
      :infinite-scroll-distance="10"
    >
      <a-list :data-source="followNotices" :locale="messageListEmpty">
        <a-list-item class="list-item" slot="renderItem" slot-scope="item">
          <a-list-item-meta>
            <!-- 消息来源用户的头像 -->                       
            <van-badge slot="avatar" :dot="item.notice.status == 0">
              <a-avatar 
                style="border: 1px solid #eee" 
                :src="item.user.headerUrl" 
                @click="goUser(item.user.id)"
              />
            </van-badge>
            
            <div slot="title">
              <!-- 消息来源用户的用户名 -->
              <span class="message-user-name">{{ item.user.username }}</span>

              <!-- 消息来源用户的等级 -->
              <van-tag
                class="message-user-level"
                :color="CONST.Tags[item.user.level].background"
                :text-color="CONST.Tags[item.user.level].color"
                :round="false"
              >
                {{ CONST.Tags[item.user.level].name }}</van-tag
              >
            </div>

            <div class="message-time" slot="description">
              <span>开始关注了你</span>
              <span class="message-time">
                {{ CONST.getDiffTime(item.notice.createTime) }}
              </span>
            </div>
          </a-list-item-meta>
        </a-list-item>

        <a-list-item slot="footer" v-show="followNotices.length!=0">
          <div style="margin-top:15px; margin-bottom:150px; width:100%; text-align: center;">
            <span v-show="!loading" style="color:#888888;font-size: 12px"> - THE END - </span>
            <a-spin v-show="loading" tip="加载中..."></a-spin>
            <div v-show="followNotices.length<=2" style="height:400px;"></div>
          </div>
        </a-list-item>

      </a-list>
    </div>
  </div>
</template>

<script>
import messageListEmpty from "../empty-s/empty-list-state.vue";

import infiniteScroll from "vue-infinite-scroll";

import CONST from "../../assets/const";
import axios from "../../plugins/Axios"

export default {
  directives: { infiniteScroll },
  props: ["messageType"],
  data() {
    return {
      CONST,
      loading: false,
      busy: false,

      /* 消息 */
      followNotices: [],  // 所有消息
      numNotices: 0,      // 消息数量
      current: 1,         // 当前页
      messageListEmpty: {
        emptyText: <messageListEmpty text="暂无消息" />,
      },
    };
  },
  beforeMount() {
    window.scrollTo(0, window.scrollTo(0,document.body.scrollHeight));
    
    this.fetchMessageData((res) => {
      if(res.msg.result.length!=0){
        this.current += 1;
      }
      this.followNotices = res.msg.result;
      this.numNotices = res.msg.rows;
    });
  },
  methods: {
    fetchMessageData(callback) {
      axios({
        url: "/notice/detail/" + this.messageType,
        method: "GET",
        params: { current: this.current },
      })
      .then(function (response) {
        callback(response.data);
      });
    },

    loadMoreMessage() {
      if(this.loading==true){
        return
      }

      const followNotices = this.followNotices;
      this.loading = true;

      if (followNotices.length >= this.numNotices) {
        this.busy = true;
        this.loading = false;
        return;
      }

      this.fetchMessageData((res) => {
        if(res.msg.result.length!=0 && this.loading){
          this.current += 1;
        }
        this.followNotices = followNotices.concat(res.msg.result);
        this.loading = false;
      });
    },

    refresh(){
      this.current = 1
      this.fetchMessageData((res) => {
        if(res.msg.result.length!=0){
          this.current += 1;
        }
        this.followNotices = res.msg.result;
        this.numNotices = res.msg.rows;
      });
    },
    
    goUser(userID){
      if(userID == this.$store.state.myUserID){
        this.$router.push({
          name: "my",
        });
      }else{
        this.$router.push({
          name: "other",
          params: { userID: userID },
        });
      } 
    }
  },
};
</script>

<style scoped>
.list-item {
  margin-left: 15px;
  margin-right: 15px;
  margin-bottom: 10px;
}
.message-time {
  color: #888;
  font-weight: normal;
  font-size: 12px;
  margin-left: 10px;
  margin-bottom: 5px;
}
.message-user-name {
  margin-left: 10px;
  font-weight: 600;
}
.message-user-level {
  font-size: 10px;
  margin-left: 5px;
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