<template>
  <div class="post-item" @click="goContent">
    
    <div class="post-title">
      <my-icon style="margin-right: 5px" type="icon-suoding"></my-icon>
      <span id="postID" v-html="postTitle"></span>
    </div>

    <a-card style="width: 100%" :bordered="false">
      <a-card-meta>
        <!-- 帖子作者头像 -->
        <a-avatar class="author-avatar" slot="avatar"
          :src="authorAvatar" :size="28" 
        />
        <div slot="title">
          <!-- 帖子作者姓名 -->
          <strong class="author-name">{{ authorName }}</strong>
          <!-- 帖子作者等级 -->
          <van-tag
            class="author-level"
            :color="CONST.Tags[authorLevel].background"
            :text-color="CONST.Tags[authorLevel].color"
            :round="false"
          >
            {{ CONST.Tags[authorLevel].name }}</van-tag
          >
        </div>

        <div slot="description">
          <!-- 富文本展示 -->
          <div class="post-content" style="color: #333333" v-html="CONST.escape2Html(postContent)"></div>
          <!-- 用户上传的图片 -->
          <van-grid
            style="padding-left: 0px; padding-top: 10px"
            v-show="imageError.length !== 0"
            :border="false" :column-num="3" :gutter="5"
          >
            <van-grid-item v-for="(postPic, index) in postPictures" :key="index">
              <van-image
                style="border: 1px solid #f0f0f0" height="100" fit="cover"
                @error="setImageLoadError(index)"
                v-show="!imageError[index]"
                :src="postPic" :show-error="false"
              />
              <van-image
                style="border: 1px solid #f0f0f0" height="100" fit="cover"
                v-show="imageError[index]"
                :src="require('../../assets/images/imageError.png')"
              />
            </van-grid-item>
          </van-grid>
        </div>
      </a-card-meta>
    </a-card>

    <div class="post-tags">
      <span class="post-release-time">{{ postReleaseTime }}</span>
      <p class="post-tag" align="right">
        <a-icon 
          type="like" 
          align="right" two-tone-color="#ec2d7a" 
          :theme="postLikeStatus === 1 ? 'twoTone' : 'outlined'"
        />
        {{ postLikes }}
      </p>
      <p class="post-tag" align="right">
        <a-icon type="eye" align="right" />
        {{ postViews }}
      </p>
      <p class="post-tag" align="right">
        <a-icon type="message" align="right" />
        {{ postComments }}
      </p>
    </div>
    
  </div>
</template>

<script>
import CONST from "../../assets/const.js";

export default {
  props: [
    "userID",
    "postID",

    "postTitle",
    "postContent",
    "postPictures",
    "postReleaseTime",

    "authorName",
    "authorLevel",
    "authorAvatar",
    
    "postComments",
    "postViews",
    "postLikes",
    "postLikeStatus"
  ],
  data() {
    return {
      CONST,
      message: {
        userID: this.userID,
        postID: this.postID,
      },

      imageError: [],
    };
  },
  
  created() {
    if (this.postPictures != null) {
      for (let i = 0; i < this.postPictures.length; i++) {
        this.imageError.push(false);
      }
    }
  },

  mounted(){
    // 挂载的时候 如果页面上有em标签 那就进行标注
    // 因为搜索之后需要标注出关键词
    let keyword = document.getElementsByTagName("em");
    for(var i=0; i<keyword.length; i++){
      keyword.item(i).style.color="#FF6600"
      keyword.item(i).style.fontStyle="normal"
      keyword.item(i).style.fontWeight="bold"
    }
  },

  methods: {
    goContent() {
      //带参数跳转
      this.$router.push({
        name: "content",
        params: this.message,
      });
    },
    setImageLoadError(index) {
      this.imageError[index] = true;
      this.$forceUpdate();
    },
  },
};
</script>

<style scoped>
.post-item {
  width: 100%;
  height: 100%;
  margin: 10px;
  margin-top: 0px;
  margin-bottom: 0px;
}
.post-title {
  margin-left: 5px;
  font-weight: 600;
  font-size: 16px;
  color: #222222;
}
.author-avatar {
  border: 1px solid #eee;
}
.author-name {
  margin-right: 5px;
  font-size: 12px;
  color: #333333;
}
.author-level {
  font-size: 10px;
}
.post-content {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 6;  
  overflow: hidden;
  word-break:normal; 
}
.post-tags {
  margin-bottom: 0px;
}
.post-tag {
  float: right;
  margin-left: 20px;
  font-size: 12px;
}
.post-release-time {
  margin-left: 35px;
  font-size: 12px;
  color: #999999;
  font-weight: normal;
}
</style>