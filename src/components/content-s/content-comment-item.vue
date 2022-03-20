<template>
  <div>
    <!-- 回到顶部 -->
    <a-back-top style="width: 100%; right: 0" :visibilityHeight="150">
      <div>
        <a-button class="backtop-button" shape="circle">
          <a-icon class="backtop-button-icon" type="rocket" />
        </a-button>
      </div>
    </a-back-top>

    <!-- 帖子评论 -->
    <div
      v-infinite-scroll="loadMoreComment"
      :infinite-scroll-disabled="busy"
      :infinite-scroll-distance="10"
    >
      <a-list :data-source="comments" :locale="commListEmtpy">
        
        <a-list-item v-show="comments.length != 0" slot="footer">
          <div style="margin-top: 15px;margin-bottom: 150px;width: 100%;text-align: center;">
            <span v-show="!loading" style="color: #888888; font-size: 12px">- THE END -</span>
            <a-spin v-show="loading" tip="加载中..."></a-spin>
          </div>
        </a-list-item>

        <a-list-item slot="renderItem" slot-scope="oneComment" @click="showMoreActions = true">
          <a-card
            class="comment" :bordered="false"
            @click.stop="
              selectCommentOrReply(
                oneComment.user.username,
                oneComment.user.id,
                oneComment.comment.id,
                oneComment.comment.content,
                oneComment.comment.id
              )
            "
          >
            <a-card-meta>
              <!-- 评论的用户头像 -->
              <a-avatar 
                style="border: 1px solid #eee" slot="avatar" size="small"
                :src="oneComment.user.headerUrl"
                @click="goUser(oneComment.user.id)"
              />

              <div slot="title">
                <!-- 评论的用户名 -->
                <span class="comment-user-name">{{ oneComment.user.username }}</span>

                <!-- 评论的用户等级 -->
                <van-tag
                  class="comment-user-level" :round="false"
                  :color="CONST.Tags[oneComment.user.level].background"
                  :text-color="CONST.Tags[oneComment.user.level].color"
                  v-show="oneComment.user.level >= 1"
                >{{ CONST.Tags[oneComment.user.level].name }}
                </van-tag>

                <!-- 评论的用户的标签 是否是作者 -->
                <van-tag
                  class="comment-tag" color="rgba(30,144,255,0.5)" round plain
                  v-show="oneComment.comment.userId === postMessage.userID"
                >作者
                </van-tag>

                <!-- 评论时间 -->
                <span class="comment-datetime">
                  {{ CONST.getDiffTime(oneComment.comment.createTime) }}
                </span>

                <!-- 评论点赞按钮+数量 -->
                <span class="comment-like" style="margin-right: 10px">
                  <a-tooltip>
                    <a-icon
                      type="like" style="font-size: 14px" two-tone-color="#ec2d7a"
                      :id="oneComment.comment.id"
                      :theme="
                        allLikes[oneComment.comment.id].iAction === 'liked'
                          ? 'twoTone'
                          : 'outlined'
                      "
                      @click.stop="likeComment($event, oneComment.comment.userId)"
                    />
                  </a-tooltip>
                  <span v-show="allLikes[oneComment.comment.id].iLike !== 0">
                    {{ allLikes[oneComment.comment.id].iLike }}
                  </span>
                </span>
              </div>

              <!-- 评论的回复部分 -->
              <div slot="description">
                <div class="comment-content">{{ oneComment.comment.content }}</div>

                <div
                  class="comment-replys"
                  v-for="oneReply in oneComment.replys" :key="oneReply.reply.id"
                >
                  <a-card
                    style="background-color: rgba(0, 0, 0, 0)" :bordered="false"
                    data-clipboard-action="copy" :data-clipboard-text="selectContent"
                    @click.stop="
                      selectCommentOrReply(
                        oneReply.user.username,
                        oneReply.user.id,
                        oneReply.reply.id,
                        oneReply.reply.content,
                        oneComment.comment.id
                      )
                    "
                  >
                    <a-card-meta>
                      <a-avatar
                        style="border: 1px solid #eee" slot="avatar" :size="20"
                        :src="oneReply.user.headerUrl"
                        @click="goUser(oneReply.user.id)"
                      />
                      <div slot="title">
                        <span class="comment-user-name">{{ oneReply.user.username }}</span>

                        <van-tag
                          class="comment-user-level"
                          :color="CONST.Tags[oneReply.user.level].background"
                          :text-color="CONST.Tags[oneReply.user.level].color"
                          :round="false"
                          v-show="oneComment.user.id!=oneReply.user.id && oneReply.user.level > 1"
                        >
                          {{ CONST.Tags[oneReply.user.level].name }}</van-tag
                        >

                        <van-tag
                          class="comment-tag" color="#aaaaaa" plain round
                          v-show="
                            oneComment.comment.userId === oneReply.reply.userId &&
                            oneReply.reply.userId !== postMessage.userID
                          "
                        >层主</van-tag
                        >

                        <van-tag
                          class="comment-tag" color="rgba(30,144,255,0.5)" round plain
                          v-show="oneReply.reply.userId === postMessage.userID"
                        >作者</van-tag
                        >

                        <!-- 回复对象的用户名信息 -->
                        <span
                          class="comment-user-name"
                          v-if="oneReply.reply.parentId in allLikes[oneComment.comment.id] &&
                                oneReply.reply.parentId != oneReply.reply.rootId"
                          ><a-icon type="caret-right" style="margin-left: 5px"/>
                          {{allLikes[oneComment.comment.id][oneReply.reply.parentId].iUser.username}}
                        </span>

                        <span class="comment-like">
                          <a-tooltip>
                            <a-icon
                              style="font-size: 14px" type="like" two-tone-color="#ec2d7a"
                              :id="oneReply.reply.id + '$' + oneComment.comment.id"
                              :theme="
                                allLikes[oneComment.comment.id][oneReply.reply.id].iAction === 'liked'
                                  ? 'twoTone'
                                  : 'outlined'
                              "
                              @click.stop="likeReply($event, oneReply.reply.userId)"
                            />
                          </a-tooltip>

                          <span v-show="allLikes[oneComment.comment.id][oneReply.reply.id].iLike !== 0">
                            {{ allLikes[oneComment.comment.id][oneReply.reply.id].iLike }}
                          </span>
                        </span>
                      </div>

                      <div slot="description" class="comment-content">
                        <div>
                          {{ oneReply.reply.content }}
                          <span class="comment-datetime">
                            {{ CONST.getDiffTime(oneReply.reply.createTime) }}
                          </span>
                        </div>
                      </div>
                      
                    </a-card-meta>
                  </a-card>
                </div>
                
                <div
                  v-show="oneComment.replyCount > 3"
                  @click.stop="getOneComment(oneComment.comment, oneComment.user)"
                >
                  <a-button style="margin-top: 5px; font-size: 14px" type="link" shape="round" size="small">
                    查看全部 {{ oneComment.replyCount }} 条回复
                  </a-button>
                </div>

              </div>
            </a-card-meta>
          </a-card>
        </a-list-item>
      </a-list>
    </div>

    <!-- 动作面板 -->
    <van-action-sheet
      v-model="showMoreActions"
      :description="selectUserName + '：' + selectContent"
      :closeable="false"
      cancel-text="取消"
      close-on-click-action
    >
      <div class="action-sheet-content-reply" @click="reply">回复 </div>
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
    <van-overlay
      z-index="1005"
      :show="showReply"
      @click="showReply = false"
    >
      <div class="reply-field">
        <van-field
          style="border-bottom: 1px solid #cdcdcd" rows="2" type="textarea"
          ref="replyInput" maxlength="100" placeholder="发表一下自己的看法吧~"
          show-word-limit @click.stop=""
          v-model="replyMessage"
        />
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

    <!-- 查看更多回复 -->
    <van-action-sheet
      title="评论回复"
      v-model="showMoreReplys"
      @opened="updateMoreReplys"
      @open="moreReplysKey += 1"
      @close="replyLikeReply"
    >
      
      <content-replys
        ref="reply"
        :key="moreReplysKey"
        :rootComment="rootComment"
        :rootUser="rootUser"
        :postMessage="postMessage"
        @replyLikeComment="replyLikeComment"
      />
    </van-action-sheet>
  </div>
</template>

<script>
import contentReplys from "./content-replys.vue";
import dataListEmpty from "../empty-s/empty-list-state.vue";

import infiniteScroll from "vue-infinite-scroll";
import { Toast as VantToast } from "vant";

import CONST from "../../assets/const";
import axios from "../../plugins/Axios"

export default {
  directives: { infiniteScroll },
  components: { contentReplys },
  props: [
    "Comments", 
    "postMessage"
  ],
  data() {
    return {
      CONST,
      busy: false,
      loading: false,
      
      /* 评论和回复 */
      comments: [],    // 所有的评论和回复
      commentsNum: 0,  // 评论和回复的数量
      current: 1,      // 当前分页
      allLikes: [],    // 所有的点赞(数量+状态)
      commListEmtpy: { 
        emptyText: <dataListEmpty text="还没有评论，快发表第一个评论吧~" />,
      },

      /* 动作面板 */
      showMoreActions: false,

      /* 回复 */
      showReply: false,
      replyMessage: "",   // 回复的内容
      selectUserName: "", // 被回复的用户名
      selectUserID: "",   // 被回复的用户ID
      selectEntryID: "",  // 被回复的实体ID
      selectContent: "",  // 被回复的内容
      rootCommentId: "",  // 被回复的回复的根评论

      /* 查看更多回复 */
      moreReplysKey: 0,     // 评论的回复组件的key 用以刷新组件
      showMoreReplys: false,// 展示该条评论的全部的回复
      rootUser: {},         // 评论的所属用户
      rootComment: {},      // 评论的内容
      moreReplysAllLikes: {},  // 评论以及它所有回复的点赞信息

      /* 实名认证 */
      showRealNameConfirm: false,
    };
  },
  created() {
    // 隐藏底部导航栏
    this.$store.dispatch("edKeyChange", false);

    // 获取评论消息
    this.fetchCommentData((res) => {
      // console.log(res)
      if (res.msg.result.length != 0) {
        this.current += 1;
      }

      this.comments = res.msg.result;
      this.commentsNum = res.msg.rows;

      this.$emit("commentsNum", this.commentsNum);
      this.$emit("commentsLoading");

      window.scrollTo(0, 0);

      for (let i = 0; i < this.comments.length; i++) {
        // 评论的点赞 数量+状态
        this.allLikes[this.comments[i].comment.id] = {
          iLike: this.comments[i].comment.likeCount,
          iAction: this.comments[i].likeStatus === 1 ? "liked" : "disliked",
        };
        // 回复的点赞 数量+状态
        for (let j = 0; j < this.comments[i].replys.length; j++) {
          this.allLikes[this.comments[i].comment.id][this.comments[i].replys[j].reply.id] = {
            iLike: this.comments[i].replys[j].reply.likeCount,
            iAction:
              this.comments[i].replys[j].likeStatus === 1
                ? "liked"
                : "disliked",
            iUser: this.comments[i].replys[j].user,
          };
        }
      }
      console.log(this.allLikes)
    });
  },

  methods: {
    fetchCommentData(callback) {
      axios({
        url: "/comment/list/" + this.postMessage.postID,
        method: "GET",
        data: { current: this.current },
      })
      .then(function (response) {
        callback(response.data);
      });
    },

    loadMoreComment() {
      if (this.loading == true) {
        return;
      }

      const comments = this.comments;
      this.loading = true;

      if (comments.length >= this.commentsNum) {
        this.busy = true;
        this.loading = false;
        return;
      }

      this.fetchCommentData((res) => {
        if (res.msg.result.length != 0 && this.loading) {
          this.current += 1;
        }
        this.comments = comments.concat(res.msg.result);
        this.loading = false;

        // 相当于重新构造
        for (let i = 0; i < this.comments.length; i++) {
          this.allLikes[this.comments[i].comment.id] = {
            iLike: this.comments[i].comment.likeCount,
            iAction: this.comments[i].likeStatus === 1 ? "liked" : "disliked",
          };
          
          for (let j = 0; j < this.comments[i].replys.length; j++) {
            this.allLikes[this.comments[i].comment.id][this.comments[i].replys[j].reply.id] = {
              iLike: this.comments[i].replys[j].reply.likeCount,
              iAction: this.comments[i].replys[j].likeStatus === 1 ? "liked" : "disliked",
              iUser: this.comments[i].replys[j].user,
            };
          }
        }
        this.$forceUpdate();
      });
    },

    likeComment(a, userID) {
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
          message: "实名信息审核中，暂时无法点赞~",
        });
        return
      }
      
      let idStrings = a.currentTarget.id;
      let that = this
      axios({
        url: "/like",
        method: "POST",
        params: {
          entityType: "2",
          entityId: idStrings,
          entityUserId: userID,
          postId: this.postMessage.postID,
        },
      })
      .then(function (response) {
        that.allLikes[idStrings].iLike = response.data.msg.likeCount;
        that.allLikes[idStrings].iAction = response.data.msg.likeStatus === 1 ? "liked" : "disliked";
        that.moreReplysAllLikes = that.allLikes[idStrings];
        that.$forceUpdate();
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
        this.showMoreActions = false;
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
        that.allLikes[idStrings[1]][idStrings[0]].iLike = response.data.msg.likeCount;
        that.allLikes[idStrings[1]][idStrings[0]].iAction = response.data.msg.likeStatus === 1 ? "liked" : "disliked";
        that.moreReplysAllLikes = that.allLikes[idStrings[1]];
        that.$forceUpdate();
      });
    },

    // 选中的评论或回复的信息
    selectCommentOrReply(userName, userID, entryID, content, rootCommentId) {
      this.showMoreActions = true;
      this.selectUserName = "@" + userName;
      this.selectUserID = userID;
      this.selectEntryID = entryID;
      this.selectContent = content;
      this.rootCommentId = rootCommentId;
    },

    reply() {
       if (localStorage.getItem("ticket") === "tourist") {
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
        VantToast({
          message: "发布成功",
          icon: "success",
        });

        that.current = 1;
        that.comments = [];
        that.allLikes = [];
        that.loadMoreComment();
      });
      this.replyMessage = "";
    },

    copy() {
      this.showMoreActions = false;
      let clipboard = new this.clipboard(".action-sheet-content-copy");
      clipboard.on("success", function () {
        VantToast({
          message: "复制成功",
          icon: "success",
        });
      });
    },

    report() {
      this.showMoreActions = false;
    },
    
    /* 《查看更多回复》  获取一条评论的信息 */
    // 评论的内容 + 评论的用户
    getOneComment(rootComment, rootUser) {
      this.showMoreReplys = true;
      this.rootUser = rootUser;
      this.rootComment = rootComment;
      this.moreReplysAllLikes = this.allLikes[rootComment.id];
    },
    
    updateMoreReplys() {
      this.$refs.reply.updateMoreReplys(this.moreReplysAllLikes);
    },

    /* 《查看更多回复》 如果对根评论点赞了 这个状态需要及时更新 */ 
    replyLikeComment(commentID, msg) {
      this.allLikes[commentID].iLike = msg.likeCount
      this.allLikes[commentID].iAction = msg.likeStatus === 1 ? "liked" : "disliked"
      this.$forceUpdate()
    },

    /* 《查看更多回复》 如果对回复点赞了 这个状态需要及时更新 */
    replyLikeReply() {
      this.current = 1
      this.comments = []
      this.allLikes = []
      this.loadMoreComment()
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
  margin-left: 10px;
  margin-right: 10px;
}
.comment-replys {
  border-bottom: 2px solid #fff;
  background-color: rgba(0, 0, 0, 0.03);
}
.comment-user-level {
  margin-left: 5px;
  font-size: 10px;
}
.comment-user-name {
  font-size: 12px;
  font-weight: 500;
  color: #333333;
}
.comment-datetime {
  font-size: 12px;
  font-weight: normal;
  margin-left: 5px;
  color: #888888;
}
.comment-like {
  float: right;
  font-weight: normal;
  font-size: 12px;
  margin-left: 5px;
  color: #888888;
}
.comment-tag {
  margin-left: 5px;
  font-size: 10px;
  font-weight: normal;
}
.comment-content {
  color: #333333;
  margin-bottom: 10px;
  margin-right: 15px;
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


