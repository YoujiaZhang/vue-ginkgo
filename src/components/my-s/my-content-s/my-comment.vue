<template>
  <div>
    <a-card :bordered="false" style="width: 100%">
      <a-card-meta>
        <div slot="description">
          <div style="color: #333333; margin-bottom: 10px;">
            <span style="margin-right:5px;" v-html="comment.content"></span>
            <span class="release-time">{{ CONST.getDiffTime(comment.createTime) }}</span>
          </div>

          <a-card
            class="reply" :bordered="false"
            v-if="parent !== undefined"
          >
            <a-card-meta>
              <a-avatar
                class="reply-user-avatar" size="small" slot="avatar"
                :src="parent.user.headerUrl"
                @click.stop="goUser(parent.user.id)"
              />
              <div slot="title">
                <strong class="reply-user-title">{{ parent.user.username }}</strong>
                <span class="release-time">{{ CONST.getDiffTime(parent.comment.createTime) }}</span>
              </div>

              <div slot="description" @click="goContent">
                <div class="reply-content" v-html="parent.comment.content"></div>
              </div>
            </a-card-meta>
          </a-card>


          <div class="post" @click="goContent">
            <div class="post-title">
              <span v-html="post.title"></span>
              <van-tag class="post-tag" color="#888" plain round> 原帖 </van-tag>
              <span class="post-release-time">
                {{ CONST.getDiffTime(post.createTime) }}
              </span>
            </div>
            <div id="my-post-content" class="post-content">
              <div v-html="CONST.escape2Html(post.content)"></div>
            </div>
          </div>

        </div>
      </a-card-meta>
    </a-card>
  </div>
</template>

<script>
import CONST from "../../../assets/const";
export default {
  props: [
    "parent", 
    "post", 
    "comment"
  ],
  data() {
    return {
      CONST,
      message: {
        userID: this.$store.state.myUserID,
        postID: this.postID,
      },
    };
  },
  methods: {
    goContent() {
      this.$router.push({
        name: "content",
        params: {
          userID: this.post.userID,
          postID: this.post.id,
        },
      });
    },
    goUser(userID){
      if(userID == this.$store.state.myUserID){
        return
      }else{
        this.$router.push({
          name: "other",
          params: { userID: userID },
        });
      } 
    },
  },
};
</script>

<style scoped>
.reply {
  width: 100%;
  background-color: rgba(0, 0, 0, 0.03);
  border-bottom: 1px solid #ddd;
}
.reply-user-title {
  margin-right: 5px;
  font-size: 14px;
  font-weight: 600;
  color: #444;
}
.reply-user-avatar {
  border: 1px solid #eee;
}
.reply-content{
  color: #333333; 
  font-size: 14px
}
.release-time {
  font-size: 12px;
  color: #999999;
  font-weight: normal;
}
.post {
  background-color: rgba(0, 0, 0, 0.03);
  padding-left: 5px;
  padding-top: 10px;
  padding-bottom: 10px;
}
.post-title{
  color:#333; 
  font-size: 14px; 
  font-weight: 600;
}
.post-tag{
  font-weight: normal; 
  font-size: 10px;
}
.post-release-time{
  font-size: 12px; 
  font-weight: normal; 
  margin-left:5px; 
  color: #888;
}
.post-content {
  padding-top:5px; 
  font-size: 12px;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 6;  /*显示的行数*/
  overflow: hidden;
  word-break:normal; /*可择*/
}
</style>