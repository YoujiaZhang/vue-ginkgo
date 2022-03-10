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
      <a-list :data-source="commentNotices" :locale="messageListEmpty">
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

              <van-tag
                class="message-tag" color="#aaaaaa" plain
                v-show="item.user.id === item.post.userId"
                >作者</van-tag
              >
              <span class="message-time">
                <span>{{ getCommReplyObj(item) }}了你</span>
                <span class="message-time">{{
                  CONST.getDiffTime(item.notice.createTime)
                }}</span>
              </span>

            </div>

            <div slot="description">
              <div
                style="font-size: 14px;color: #333333;margin-bottom: 5px;margin-left: 10px;"
                v-if="item.comment != null"
              >
                {{ item.comment.content }}
              </div>

              <a-card
                class="reply" :bordered="false"
                v-if="item.parent != null"
              >
                <a-card-meta>
                  <div style="font-size: 14px; color: #333" slot="description">
                    <div>我：{{ item.parent.content }}</div>
                  </div>
                </a-card-meta>
              </a-card>

              <div class="post" @click="goContent(item.post.id, item.post.userId)">
                <div style="color:#333;font-size: 14px; font-weight: 600">
                  {{ item.post.title }}
                  <van-tag
                    style="font-weight: normal; font-size: 10px" color="#888" plain round
                    >原帖</van-tag
                  >
                  <span style="font-size:12px;font-weight:normal;margin-left:5px;color: #888;">{{
                  CONST.getDiffTime(item.post.createTime)
                }}</span>
                </div>
                <div style="font-size: 12px">
                  <div v-html="CONST.escape2Html(item.post.content)"></div>
                </div>
              </div>

            </div>
          </a-list-item-meta>
        </a-list-item>

        <a-list-item slot="footer" v-show="commentNotices.length!=0">
          <div style="margin-top:15px; margin-bottom:150px; width:100%; text-align: center;">
            <span v-show="!loading" style="color:#888888;font-size: 12px"> - THE END - </span>
            <a-spin v-show="loading" tip="加载中..."></a-spin>
            <div v-show="commentNotices.length==1" style="height:400px;"></div>
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
      commentNotices: [],  // 所有消息
      numNotices: 0,       // 消息数量
      current: 1,          // 当前页
      messageListEmpty: {
        emptyText: <messageListEmpty text="暂无消息" />,
      },
    };
  },
  beforeMount() {
    if (this.$store.state.myTicket !== "") {
      window.scrollTo(0, window.scrollTo(0,document.body.scrollHeight));
      this.fetchMessageData((res) => {
        if(res.msg.result.length!=0){
          this.current += 1;
        }
        this.commentNotices = res.msg.result;
        this.numNotices = res.msg.rows;
      });
    }
  },
  methods: {
    fetchMessageData(callback) {
      axios({
        url: "/notice/detail/" + this.messageType,
        type: "json",
        method: "GET",
        data: { current: this.current },
      })
      .then(function (response) {
        callback(response.data);
      });
    },

    loadMoreMessage() {
      if(this.loading==true){
        return
      }

      const commentNotices = this.commentNotices;
      this.loading = true;

      if (commentNotices.length >= this.numNotices) {
        this.busy = true;
        this.loading = false;
        return;
      }

      this.fetchMessageData((res) => {
        if(res.msg.result.length!=0 && this.loading){
          this.current += 1;
        }
        this.commentNotices = commentNotices.concat(res.msg.result);
        this.loading = false;
      });
    },

    refresh(){
      this.current = 1
      this.fetchMessageData((res) => {
        if(res.msg.result.length!=0){
          this.current += 1;
        }
        this.commentNotices = res.msg.result;
        this.numNotices = res.msg.rows;
      });
    },

    getCommReplyObj(item) {
      if (item.parent == null) {
        return "评论";
      }
      return "回复";
    },

    goContent(postID, userID) {
      this.$router.push({
        name: "content",
        params: {
          userID: userID,
          postID: postID,
        },
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
.message-time {
  color: #888;
  font-weight: normal;
  font-size: 12px;
  margin-left: 10px;
}
.message-user-name {
  color: #333;
  margin-left: 10px;
  font-size: 14px;
  font-weight: 600;
}
.message-user-level {
  font-size: 10px;
  margin-left: 5px;
}
.message-type {
  font-size: 10px;
  margin-left: 10px;
  margin-right: 10px;
}
.message-tag {
  margin-left: 10px;
  font-size: 10px;
}
.message-type-dot {
  float: right;
}
.comment-notice {
  height: 30%;
  margin-left: 10%;
  margin-right: 10%;
  margin-bottom: 20px;
  padding-top: 8px;
  padding-bottom: 8px;
  border-radius: 10px;
  box-shadow: 5px 5px 10px rgba(0, 0, 0, 0.1);
}
.comment-notice-icon {
  width: 50px;
  height: 50px;
  border-radius: 15px;
}

.list-item {
  margin-left: 5px;
  margin-right: 5px;
  margin-bottom: 10px;
}
.reply {
  background-color: rgba(0, 0, 0, 0.03);
  padding-left: 5px;
  border-left: 3px solid #ddd;
  border-bottom: 1px solid #ddd;
}
.post {
  background-color: rgba(0, 0, 0, 0.03);
  padding-left: 10px;
  padding-top: 5px;
  padding-bottom: 5px;
  border-left: 3px solid #ddd;
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