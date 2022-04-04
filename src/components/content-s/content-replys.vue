<template>
  <div>
    <a-card class="comment" :bordered="false">
      <a-card-meta>
        <!-- 评论所属的用户头像 -->
        <a-avatar
          style="border: 1px solid #eee" slot="avatar" size="small"
          :src="rootUser.headerUrl"
          @click="goUser(rootUser.id)"
        />

        <div slot="title">
          <strong class="comment-user-name">{{ rootUser.username }}</strong>
          <van-tag
            class="comment-user-level"
            :color="CONST.Tags[rootUser.level].background"
            :text-color="CONST.Tags[rootUser.level].color"
            :round="false"
          >
            {{ CONST.Tags[rootUser.level].name }}</van-tag
          >
        </div>

        <div slot="description">
          <div 
            style="color: #333333"  
            v-html="rootComment.content" 
            @click.stop="
              selectCommentOrReply(
                rootUser.username,
                rootUser.id,
                rootComment.id,
                rootComment.content,
                rootComment.id
              )
            ">
          </div>

          <div class="comment-body">
            <a-tooltip slot="datetime">
              <span style="font-size: 12px">{{ CONST.getDiffTime(rootComment.createTime) }}</span>
            </a-tooltip>

            <div class="comment-body-actions" align="right">
              <my-icon
                class="copy-comment-text" type="icon-fuzhi" style="margin-right: 20px"
                data-clipboard-action="copy"
                :data-clipboard-text="CONST.removeHTMLTag(rootComment.content)"
                @click="copyCommentText"
              />

              <my-icon type="icon-jubao" style="margin-right: 20px" />

              <a-tooltip>
                <a-icon
                  type="like" two-tone-color="#ec2d7a"
                  :theme="commentLikeAction === 'liked' ? 'twoTone' : 'outlined'"
                  @click="likeComment(rootComment.userId)"
                />
              </a-tooltip>

              <span
                style="padding-left: '8px'; cursor: 'auto'"
                v-show="commentLikes !== 0"
              >
                {{ commentLikes }}
              </span>
            </div>
          </div>
        </div>
      </a-card-meta>
    </a-card>

    <!-- 分割线 -->
    <div style="background-color: #f6f6f6; height: 10px"></div>

    <div
      v-infinite-scroll="loadMoreReplys"
      :infinite-scroll-disabled="busy"
      :infinite-scroll-distance="10"
    >
      <a-list :data-source="replys" :locale="replyEmpty">
        
        <a-list-item v-show="replys.length != 0" slot="footer">
          <div style="margin-top: 15px;margin-bottom: 150px;width: 100%;text-align: center;">
            <span v-show="!loading" style="color: #888888; font-size: 12px">- THE END -</span>
            <a-spin v-show="loading" tip="加载中..."></a-spin>
          </div>
        </a-list-item>

        
        <a-list-item slot="renderItem" slot-scope="oneReply">
          <a-card
            style="width: 100%; padding-left: 10px; padding-right: 0px" :bordered="false"
            @click.stop="
              selectCommentOrReply(
                oneReply.user.username,
                oneReply.user.id,
                oneReply.comment.id,
                oneReply.comment.content,
                rootComment.id
              )
            "
          >
            <a-card-meta>
              <a-avatar 
                style="border: 1px solid #eee" slot="avatar" size="small"
                :src="oneReply.user.headerUrl"
                @click="goUser(oneReply.user.id)"
              />
              <div slot="title">
                <span class="reply-name">{{ oneReply.user.username }}</span>

                <van-tag
                  v-show="rootComment.userId != oneReply.user.id && oneReply.user.level > 1"
                  :color="CONST.Tags[oneReply.user.level].background"
                  :text-color="CONST.Tags[oneReply.user.level].color"
                  :round="false"
                >
                  {{ CONST.Tags[oneReply.user.level].name }}</van-tag
                >

                <van-tag
                  class="reply-tag" color="#aaaaaa" plain round
                  v-show="
                    rootComment.userId === oneReply.comment.userId &&
                    oneReply.comment.userId !== postMessage.userID
                  "
                  >层主</van-tag
                >

                <van-tag
                  class="reply-tag" color="rgba(30,144,255,0.5)" round plain
                  v-show="oneReply.comment.userId === postMessage.userID"
                  >作者</van-tag
                >

                <!-- 回复对象的用户名信息 -->
                <span
                  class="reply-name"
                  v-if="oneReply.comment.parentId != rootComment.id"
                  ><a-icon type="caret-right" style="margin-left: 5px" />
                  {{ allLikes[oneReply.comment.parentId].iUser.username }}
                </span>

                <span class="reply-like">
                  <a-tooltip>
                    <a-icon
                      style="font-size: 14px" type="like" two-tone-color="#ec2d7a"
                      :id="oneReply.comment.id + '$' + rootComment.id"
                      :theme="
                        allLikes[oneReply.comment.id].iAction === 'liked'
                          ? 'twoTone'
                          : 'outlined'
                      "
                      @click.stop="likeReply($event, oneReply.comment.userId)"
                    />
                  </a-tooltip>
                  <span v-show="allLikes[oneReply.comment.id].iLike !== 0">
                    {{ allLikes[oneReply.comment.id].iLike }}
                  </span>
                </span>
              </div>

              <div slot="description" class="reply-content">
                <div>
                  <span v-html="oneReply.comment.content"></span>
                  <span class="reply-datetime">
                    {{ CONST.getDiffTime(oneReply.comment.createTime) }}
                  </span>
                </div>
              </div>
            </a-card-meta>
          </a-card>
        </a-list-item>
      </a-list>
    </div>
  
    <van-action-sheet
      v-model="showMoreActions"
      :closeable="false"
      cancel-text="取消"
      close-on-click-action
    >
      <span slot="description" v-html="selectUserName + '：' + selectContent"></span>
      <div class="action-sheet-content-reply" @click="reply">回复</div>
      <div
        class="action-sheet-content-copy" data-clipboard-action="copy"
        :data-clipboard-text="selectContent"
        @click="copy"
      >
        复制
      </div>
      <div class="action-sheet-content-report" @click="report">举报</div>
    </van-action-sheet>

    <!-- 回复 -->
    <van-overlay z-index="1005" :show="showReply" @click="showReply = false">
      <div class="reply-field">
        <van-field
          style="border-bottom: 1px solid #cdcdcd" rows="2" type="textarea"
          ref="replyInput" maxlength="100" placeholder="发表一下自己的看法吧~"
          show-word-limit @click.stop=""
          v-model="replyMessage"
        >
        </van-field>
      </div>
      <span class="reply-text">回复 {{ selectUserName }}</span>
      <a-button
        class="reply-button" type="primary" shape="round" size="small"
        :disabled="replyMessage.length === 0"
        @click.stop="replySend"
      >
        发布<a-icon type="link" />
      </a-button>
    </van-overlay>

    <!-- 实名认证 -->
    <van-dialog
      v-model="showRealNameConfirm"
      show-cancel-button
      confirm-button-text="前往认证"
      confirm-button-color="返回"
      @confirm="goRealNameConfirm"
    >
      <div slot="title">
        <span style="margin-right: 5px; font-weight: 600">未实名认证</span>
        <a-icon type="info-circle" theme="twoTone" two-tone-color="#FFA500" />
      </div>
      <!-- <div style="margin: 20px">实名认证后才可以回复哦~</div> -->
    </van-dialog>
  </div>
</template>

<script>
import dataListEmpty from "../empty-s/empty-list-state.vue";

import infiniteScroll from "vue-infinite-scroll";
import { Toast as VantToast } from "vant";

import CONST from "../../assets/const";
import axios from "../../plugins/Axios"

export default {
  directives: { infiniteScroll },
  props: ["rootUser", "rootComment", "postMessage"],
  data() {
    return {
      CONST,
      busy: false,
      loading: false,
      
      /* 评论 */
      commentLikeAction: null,  // 这条评论的点赞状态
      commentLikes: 0,          // 这条评论的点赞数量

      /* 动作面板 */
      showMoreActions: false,

      /* 回复 */
      showReply: false,
      replyMessage: "",     // 回复的内容
      selectUserName: "",   // 被回复的用户名
      selectUserID: "",     // 被回复的用户ID
      selectEntryID: "",    // 被回复的实体ID
      selectContent: "",    // 被回复的内容

      /* 回复 */
      replys: [],   // 所有的回复
      replysNum: 0, // 回复的数量
      current: 1,   // 当前页
      allLikes: {}, // 所有的点赞(数量+状态)
      replyEmpty: {
        emptyText: <dataListEmpty text="还没有回复哦" />,
      },

      /* 实名认证 */
      showRealNameConfirm: false,
    };
  },
  created() {
    this.fetchReplyData((res) => {
      if (res.msg.result.length != 0) {
        this.current += 1;
      }

      this.replys = res.msg.result;
      this.replysNum = res.msg.rows;

      window.scrollTo(0, 0);

      for (let i = 0; i < this.replys.length; i++) {
        // 回复的点赞 数量+状态
        this.allLikes[this.replys[i].comment.id] = {
          iLike: this.replys[i].comment.likeCount,
          iAction: this.replys[i].likeStatus === 1 ? "liked" : "disliked",
          iUser: this.replys[i].user,
        };
      }
    });
  },
  methods: {
    fetchReplyData(callback) {
      axios({
        url: "/comment/reply-list/" + this.rootComment.id,
        method: "GET",
        data: { current: this.current },
      })
      .then(function (response) {
        callback(response.data);
      });
    },

    loadMoreReplys() {
      if (this.loading == true) {
        return;
      }

      const replys = this.replys;
      this.loading = true;

      if (replys.length >= this.replysNum) {
        this.busy = true;
        this.loading = false;
        return;
      }

      this.fetchReplyData((res) => {
        if (res.msg.result.length != 0 && this.loading) {
          this.current += 1;
        }
        this.replys = replys.concat(res.msg.result);
        this.loading = false;

        for (let i = 0; i < this.replys.length; i++) {
          this.allLikes[this.replys[i].comment.id] = {
            iLike: this.replys[i].comment.likeCount,
            iAction: this.replys[i].likeStatus === 1 ? "liked" : "disliked",
            iUser: this.replys[i].user,
          };
        }
      });
    },

    copyCommentText() {
      let clipboard = new this.clipboard(".copy-comment-text");
      clipboard.on("success", function () {
        VantToast({
          message: "复制成功",
          icon: "success",
        });
      });
      clipboard.on("error", function () {
        VantToast({
          message: "复制失败",
          icon: "success",
        });
      });
    },

    likeComment(userID) {
      if(localStorage.getItem("ticket")=='tourist'){
        VantToast({
          message: "需要登录哦~",
        });
        return
      }

      if (this.$store.state.myAuditStatus == 0||this.$store.state.myAuditStatus == 3) {
        this.showRealNameConfirm = true;
        return;
      }

      if(this.$store.state.myAuditStatus == 1){
        VantToast({
          message: "实名信息审核中，暂时无法点赞~",
        });
        return
      }

      let that = this
      axios({
        url: "/like",
        method: "POST",
        params: {
          entityType: "2",
          entityId: String(this.rootComment.id),
          entityUserId: userID,
          postId: this.postMessage.postID,
        },
      })
      .then(function (response) {
        that.commentLikes = response.data.msg.likeCount;
        that.commentLikeAction = response.data.msg.likeStatus === 1 ? "liked" : "disliked";
        that.$forceUpdate();
        that.$emit("replyLikeComment", that.rootComment.id, response.data.msg);
      });
    },

    likeReply(a, userID) {
      if(localStorage.getItem("ticket")=='tourist'){
        VantToast({
          message: "需要登录哦~",
        });
        return
      }

      if (this.$store.state.myAuditStatus == 0||this.$store.state.myAuditStatus == 3) {
        this.showRealNameConfirm = true;
        return;
      }

      if(this.$store.state.myAuditStatus == 1){
        VantToast({
          message: "实名信息审核中，暂时无法点赞~",
        });
        return
      }

      let idStrings = a.currentTarget.id.split("$");
      let that = this
      axios({
        url: "/like",
        method: "POST",
        params: {
          entityType: "2",
          entityId: idStrings[0],
          entityUserId: userID,
          postId: this.postMessage.postID,
        },
      })
      .then(function (response) {
        that.allLikes[idStrings[0]].iLike = response.data.msg.likeCount;
        that.allLikes[idStrings[0]].iAction = response.data.msg.likeStatus === 1 ? "liked" : "disliked";
        that.$forceUpdate();
      });
    },

    selectCommentOrReply(userName, userID, entryID, content, rootCommentId) {
      this.showMoreActions = true;
      this.selectUserName = "@" + userName;
      this.selectUserID = userID;
      this.selectEntryID = entryID;
      this.selectContent = content;
      this.rootCommentId = rootCommentId;
    },

    reply() {
      if(localStorage.getItem("ticket")=='tourist'){
        VantToast({
          message: "需要登录哦~",
        });
        return
      }

      if (this.$store.state.myAuditStatus == 0||this.$store.state.myAuditStatus == 3) {
        this.showRealNameConfirm = true;
        this.showMoreActions = false;
        return;
      }
      
      if(this.$store.state.myAuditStatus == 1){
        VantToast({
          message: "实名信息审核中，暂时无法评论~",
        });
        this.showMoreActions = false;
        return
      }

      this.showMoreActions = false;
      this.showReply = true;
      this.$nextTick(() => {
        this.$refs.replyInput.focus();
      });
    },

    replySend() {
      this.showReply = false;
      let that = this
      axios({
        url: "/comment/add",
        method: "POST",
        data: {
          content: this.replyMessage,
          picUrls: [],

          entityType: 2,
          parentId: Number(this.selectEntryID),
          parentUserId: Number(this.selectUserID),

          postId: Number(this.postMessage.postID),
          rootId: Number(this.rootCommentId),
        },
      })
      .then(function () {
        // console.log("评论回复成功", res);
        VantToast({
          message: "发布成功",
          icon: "success",
        });

        that.current = 1;
        that.replys = [];
        that.allLikes = [];
        that.loadMoreReplys();
      });
      this.replyMessage = "";
    },

    copy() {
      this.showMoreActions = false;
      let clipboard = new this.clipboard(".action-sheet-content-copy");
      clipboard.on("success", function () {});
    },

    report() {
      this.showMoreActions = false;
    },
    
    updateMoreReplys(replylike) {
      this.commentLikes = replylike.iLike;
      this.commentLikeAction = replylike.iAction;

      for (let key in replylike) {
        if (key != "iAction" && key != "iLike") {
          this.allLikes[key].iLike = replylike[key].iLike;
          this.allLikes[key].iAction = replylike[key].iAction;
        }
      }
      this.$forceUpdate();
    },

    /* 前往实名认证的页面 */
    goRealNameConfirm() {
      this.$router.push({
        name: "my",
        params: { showRealNameConfirm: true },
      });
    },

    /* 前往用户个人主页 */
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
.comment {
  width: 100%;
  padding-left: 10px;
  padding-right: 10px;
}
.comment-body {
  margin-top: 10px;
  margin-bottom: 5px;
}
.comment-body-actions {
  float: right;
  margin: 0px;
  width: 45%;
}
.comment-user-name {
  margin-left: 5px;
  margin-right: 5px;
}
.comment-user-level {
  font-size: 10px;
}

.reply-name {
  font-size: 12px;
  font-weight: 500;
  margin-left: 0px;
  color: #333333;
}
.reply-datetime {
  font-size: 12px;
  font-weight: normal;
  margin-left: 5px;
  color: #888888;
}
.reply-like {
  float: right;
  font-weight: normal;
  font-size: 12px; 
  margin-right: 10px;
  margin-left: 5px;
  color: #888888;
}
.reply-tag {
  margin-left: 5px;
  font-size: 1px;
}
.reply-content {
  color: #333333;
  margin-bottom: 10px;
  margin-right: 35px;
}
.reply-field {
  background-color: #fff;
  width: 100%;
  height: 145px;
  position: fixed;
  bottom: 0;
}
.reply-button {
  margin-bottom: 10px;
  position: fixed;
  right: 4%;
  bottom: 0;
}
.reply-text {
  margin-bottom: 10px;
  position: fixed;
  left: 4%;
  bottom: 0;
  color: #888888;
}

.action-sheet-content-copy {
  height: 50px;
  text-align: center;
  padding: 14px 16px;
  font-size: 16px;
  color: #646566;
}
.action-sheet-content-reply {
  height: 50px;
  text-align: center;
  padding: 14px 16px;
  font-size: 16px;
  color: #646566;
}
.action-sheet-content-report {
  height: 50px;
  text-align: center;
  padding: 14px 16px;
  font-size: 16px;
  color: #646566;
}

.action-sheet-content:active {
  background-color: #888888;
}
</style>