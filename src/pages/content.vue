<template>
  <div>
    <a-spin tip="加载中 ···" :spinning="contentLoading">

      <a-divider class="post-title">
        <my-icon type="icon-suoding"></my-icon>
        <span style="font-weight: 600"> {{ postTitle }}</span>
      </a-divider>

      <a-card class="post-body" :bordered="false">
        <a-card-meta>
          <!-- 帖子作者头像 -->
          <a-avatar style="border: 1px solid #eee" slot="avatar"
            :src="userAvatar"
            @click="goUser"
          />

          <div slot="title">
            <!-- 帖子作者姓名 -->
            <strong class="user-name">{{ userName }}</strong>
            <!-- 帖子作者等级 -->
            <van-tag
              class="user-level"
              :color="CONST.Tags[userLevel].background"
              :text-color="CONST.Tags[userLevel].color"
              :round="false"
            >
              {{ CONST.Tags[userLevel].name }}</van-tag
            >
          </div>

          <div class="post-body-description" slot="description">
            
            <!-- 富文本展示 帖子的具体内容 使用v-html解析-->
            <div
              ref="post-summary"
              :class="textMore ? 'post-summary' : ''" 
              style="color: #333333;" 
              v-html="postContent"
            ></div>

            <!-- 针对文本过长的情况设置文本溢出 -->
            <div class="post-summary-button" v-show="!hideBtn" @click="textMore = !textMore">
              {{textMore ? '展开' : '收起'}}
              <a-icon v-show="textMore" type="down" />
              <a-icon v-show="!textMore" type="up" />
            </div>

            <!-- 用户上传的图片 -->
            <van-grid
              style="padding-left: 0px; padding-top: 10px; width:100%"
              v-show="imageError.length!=0"
              :border="false" :column-num="3" :gutter="5"
            >
              <van-grid-item v-for="(postPic, index) in postPictures" :key="index">
                <van-image
                  style="border: 1px solid #f0f0f0" height="100" fit="cover"
                  @click="previewPostImage(postPictures, index)"
                  @error="setImageLoadError(index)"
                  v-show="!imageError[index]"
                  :src="postPic"
                />
                <van-image
                  style="border: 1px solid #f0f0f0" height="100" fit="cover"
                  v-show="imageError[index]"
                  :src="require('../assets/images/imageError.png')"
                />
              </van-grid-item>
            </van-grid>

            <div class="post-body-description-footer">
              <a-tooltip slot="datetime">
                <span style="font-size: 12px">{{ postReleaseTime }}</span>
                <span style="font-size: 12px; margin-left: 15px">
                  <a-icon type="eye" /> {{ postViews }}</span
                >
              </a-tooltip>

              <div class="post-body-description-footer-actions" align="right">
                <!-- 复制按钮 -->
                <my-icon
                  class="copy-post-text" type="icon-fuzhi" style="margin-right: 20px"
                  data-clipboard-action="copy"
                  :data-clipboard-text="CONST.removeHTMLTag(postContent)"
                  @click="copyPostText"
                />
                <!-- 举报按钮 -->
                <my-icon type="icon-jubao" style="margin-right: 20px" />

                <!-- 点赞按钮 -->
                <a-tooltip>
                  <a-icon
                    type="like" two-tone-color="#ec2d7a"
                    :theme="postLikeAction === 'liked' ? 'twoTone' : 'outlined'"
                    @click="likePost"
                  />
                </a-tooltip>
                <!-- 点赞数 -->
                <span style="padding-left: '8px'; cursor: 'auto'" v-show="postLikes !== 0">
                  {{ postLikes }}
                </span>

              </div>
            </div>
          </div>
        </a-card-meta>
      </a-card>
      <div class="comments-header">
        <span>共 {{ postCommentsNum }} 条评论</span>
        <a-button
          style="float: right" size="small" type="primary" shape="round" icon="edit"
          @click="comment"
          >评论</a-button
        >
      </div>

      <!-- 帖子的所有评论 -->
      <content-comment-item
        v-if="afterAddComment"
        :Comments="Comments"
        :postMessage="message"
        @commentsNum="getCommentsNum"
        @commentsLoading="contentCommentLoading = true"
      />

      <!-- 回复面板 顶着键盘出来的 -->
      <van-overlay z-index="1005" :show="showInputComment" @click="showInputComment = false">
        <div class="comment-overlay-field">
          <van-field
            v-model="commentMessage" @click.stop=""
            style="border-bottom: 1px solid #cdcdcd" type="textarea" rows="2" maxlength="100"
            placeholder="发表一下自己的看法吧~" show-word-limit ref="commentInput"
          />
        </div>
        <span class="comment-overlay-text">回复 @{{ userName }}</span>
        <a-button
          class="comment-overlay-button" type="primary" shape="round" size="small"
          :disabled="commentMessage.length === 0"
          @click.stop="commentSend"
        >
          发布<a-icon type="link"/>
        </a-button>
      </van-overlay>

      <!-- 返回主页面 -->
      <back-ball @click="goBack"/>

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
        <!-- <div style="margin: 20px">实名认证后才可以评论哦~</div> -->
      </van-dialog>
      
    </a-spin>
  </div>
</template>

<script>
import contentCommentItem from "../components/content-s/content-comment-item.vue";
import backBall from "../components/dragBall-s/backBall.vue";

import { Toast as VantToast } from "vant";
import { ImagePreview } from "vant";

import CONST from "../assets/const";
import axios from "../plugins/Axios"

export default {
  components: { contentCommentItem, backBall },
  data() {
    return {
      CONST,
      message: {},
      
      /* 帖子 */
      postTitle: "",       // 帖子标题
      postContent: "",     // 帖子内容
      postReleaseTime: "", // 帖子发布时间
      postPictures: [],    // 帖子图片
      postViews: 0,        // 帖子浏览数量
      postLikes: 0,        // 帖子点赞数
      postCommentsNum: 0,  // 帖子评论数
      postLikeAction: null,// 当前用户对该帖子的点赞状态

      textMore: false,     //是否长文本的剩余内容
      hideBtn: true,       //是否隐藏《查看全部》的按钮
      firstUpdate: true,   //是否是第一次Updated 要获取v-html解析的内容

      /* 作者 */
      userName: "",   // 作者姓名
      userLevel: 0,   // 作者等级
      userAvatar: "", // 作者头像
    
      
      /* 评论 */
      Comments: [],   // 帖子所有评论
      commentMessage: "", // 用户发布评论的内容
      showInputComment: false, // 展示评论的输入框
      afterAddComment: true,   // 帖子评论之后
      
      /* 图片状态 */
      imageError: [],

      /* 没有实名认证 前往实名认证 */
      showRealNameConfirm: false,

      /* 加载状态 */
      contentPostLoading: false,
      contentCommentLoading: false
    };
  },
  computed: {
    contentLoading: function () {
      return !(this.contentPostLoading && this.contentCommentLoading)
    },
  },
  created() {
    // 隐藏底部导航栏
    this.$store.dispatch("edKeyChange", false);
    
    // 获取参数
    this.message = this.$route.params;
    if(JSON.stringify(this.$route.params) != "{}"){
      // 将参数置入url中 否则刷新页面丢失参数
      history.replaceState(null, null, 
        window.location.href +'?' + 
        this.$route.params.postID +'&'+ 
        this.$route.params.userID
      )
    }else{
      this.message = {
        userID: window.location.href.split('&')[1],
        postID: window.location.href.split('?')[1].split('&')[0],
      }
    }
    
    // 获取帖子详情信息
    let that = this
    axios({
      url: "/discuss/detail/" + this.message.postID,
      method: "GET",
    })
    .then(function (response) {
      let res = response.data
      that.postTitle = res.msg.post.title;
      that.postContent = res.msg.post.content;
      that.postPictures = res.msg.post.picUrls;
      that.postReleaseTime = CONST.getDiffTime(res.msg.post.createTime);

      if (that.postPictures != null) {
        for (let i = 0; i < that.postPictures.length; i++) {
          that.imageError.push(false);
        }
      }

      that.postViews = res.msg.post.viewCount;
      that.postLikes = res.msg.post.likeCount;
      that.postLikeAction = res.msg.likeStatus === 1 ? "liked" : "disliked";

      that.userName = res.msg.user.username;
      that.userLevel = res.msg.user.level;
      that.userAvatar = res.msg.user.headerUrl;

      that.contentPostLoading = true
      that.$forceUpdate();
    })
  },
  updated() {
    if(this.firstUpdate){
      let textHeight = this.$refs['post-summary'].offsetHeight
      if (textHeight >= 8*22){
        this.hideBtn = false;
        this.textMore = true;
        this.firstUpdate = false
      }
    }
  },
  methods: {
    getCommentsNum(data){
      this.postCommentsNum = data
    },

    getPostComments() {
      this.afterAddComment = false;
      let that = this
      axios({
        url: "/comment/list/" + this.message.postID,
        method: "GET",
        data: { current: 1 },
      })
      .then(function (response) {
        that.Comments = response.data.msg.result;
        that.afterAddComment = true;
        that.$forceUpdate();
      });
    },

    copyPostText() {
      let clipboard = new this.clipboard(".copy-post-text");
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

    likePost() {
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
        method: 'post',
        params: {
          entityType: "1",
          entityId: this.message.postID,
          entityUserId: this.message.userID,
          postId: this.message.postID,
        },
      })
      .then(function (response) {
        that.postLikes = response.data.msg.likeCount
        that.postLikeAction = response.data.msg.likeStatus === 1 ? "liked" : "disliked"
      });
    },

    comment() {
      if (localStorage.getItem("ticket") === "tourist") {
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
          message: "实名信息审核中，暂时无法评论~",
        });
        return
      }

      this.showInputComment = true;
      this.$nextTick(() => {
        this.$refs.commentInput.focus();
      });
    },

    commentSend() {
      this.showInputComment = false;
      let that = this
      axios({
        url: "/comment/add",
        method: "POST",
        data: {
          content: this.commentMessage,
          picUrls: [],

          entityType: 1,
          parentId: Number(this.message.postID),
          parentUserId: Number(this.message.userID),

          postId: Number(this.message.postID),
          rootId: 0,
        }
      })
      .then(function () {
        VantToast({
          message: "发布成功",
          icon: "success",
        });
        that.getPostComments();
      });
      this.commentMessage = "";
    },

    setImageLoadError(index) {
      this.imageError[index] = true;
      this.$forceUpdate();
    },

    previewPostImage(images, index) {
      ImagePreview({
        images: images,
        showIndex: true,
        loop: false,
        startPosition: index,
      });
    },

    goBack() {
      this.$router.go(-1);
    },

    goRealNameConfirm() {
      this.$router.push({
        name: "my",
        params: { showRealNameConfirm: true },
      });
    },

    goUser(){
      if(this.message.userID == this.$store.state.myUserID){
        this.$router.push({
          name: "my",
        });
      }else{
        this.$router.push({
          name: "other",
          params: { userID: this.message.userID },
        });
      } 
    },
  },

  
};
</script>

<style scoped>

.user-name {
  margin-right: 5px;
}
.user-level {
  font-size: 10px;
}
.post-title {
  text-align: center;
  padding-top: 0px;
  font-size: 20px;
  color: #222222;
}
.post-summary {
  text-overflow: -o-ellipsis-lastline;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 8;
  -webkit-box-orient: vertical;
}
.post-summary-button{
  color: #8cc269;
  width: 100%;
}
.post-summary-button-over{
  position: absolute;
  height: 3rem;
  width: 100%;
  top: 50%; 
  left: 0;
  z-index: 100; 
  background-color: #8cc269;
  /* background: linear-gradient(rgba(255,255,255,.5), white);  */
}

.post-body {
  padding-left: 10px;
}
.post-body-description {
  margin-bottom: 10px;
  margin-right: 15px;
}
.post-body-description-footer {
  margin-top: 10px;
  margin-bottom: 0px;
}
.post-body-description-footer-actions {
  float: right;
  margin: 0px;
  width: 45%;
}
.comments-header {
  padding: 15px;
  padding-left: 15px;
  padding-right: 15px;
  border-radius: 0 0 5px 5px;
  border-bottom: 1px solid #efefef;
  border-top: 1px solid #efefef;
}
.comment-overlay-field {
  background-color: #fff;
  width: 100%;
  height: 145px;
  position: fixed;
  bottom: 0;
}
.comment-overlay-button {
  margin-bottom: 10px;
  position: fixed;
  right: 4%;
  bottom: 0;
}
.comment-overlay-text {
  margin-bottom: 10px;
  position: fixed;
  left: 4%;
  bottom: 0;
  color: #888888;

  
}
</style>