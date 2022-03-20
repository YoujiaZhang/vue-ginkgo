<template>
  <div class="post-item" @click="goContent">
    <!-- 热榜排名 -->
    <a-tag class="hot-rank" :color="getTagStyle(hotRank)">{{ hotRank + 1}}</a-tag>
    <!-- 帖子标题 -->
    <span class="post-title">{{ postTitle }}</span>
    <!-- 帖子热度 -->
    <span class="post-hot-degree">
      {{ hotDegree }}
      <a-icon type="fire" theme="twoTone" twoToneColor="#f5222d"/></span
    >

    <a-card class="card" :bordered="false">
      <a-card-meta>
        <a-avatar class="author-avatar" slot="avatar" :size="28" :src="authorAvatar" />
        <div class="title" slot="title">
          <!-- 作者的姓名 -->
          <strong class="author-name">{{ authorName }}</strong>
          <!-- 作者的等级 -->
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
          <div
            class="post-content"
            style="color: #333333"
            v-html="CONST.escape2Html(postContent)"
          ></div>
          <!-- 用户上传的图片 -->
          <van-grid
            style="padding-left: 0px; padding-top: 10px"
            :column-num="3" :gutter="5"
            v-show="imageError.length!==0"
          >
            <van-grid-item
              v-for="(postPic, index) in postPictures"
              :key="index"
            >
              <van-image
                height="100" fit="cover" style="border: 1px solid #f0f0f0"
                :src="postPic" :show-error="false"
                @error="imageLoadError(index)"
                v-show="!imageError[index]"
              />
              <van-image
                height="100" fit="cover" style="border: 1px solid #f0f0f0"
                :src="require('../../assets/images/imageError.png')"
                v-show="imageError[index]"
              />
            </van-grid-item>
          </van-grid>
        </div>
      </a-card-meta>
    </a-card>

    <div class="post-tags">
      <span class="post-release-time">{{ postReleaseTime }}</span>
      <p class="post-tag" align="right">
        <a-icon type="like" align="right" />
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

    "hotRank",
    "hotDegree",

    "authorName",
    "authorLevel",
    "authorAvatar",

    "postTitle",
    "postContent",
    "postPictures",
    "postReleaseTime",

    "postComments",
    "postViews",
    "postLikes",
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

  methods: {
    goContent() {
      //带参数跳转
      this.$router.push({
        name: "content",
        params: this.message,
      });
    },
    imageLoadError(index) {
      this.imageError[index] = true;
      this.$forceUpdate();
    },

    getCardStyle(hotRank) {
      return "borderColor:" + CONST.Hots[hotRank].color;
    },
    getTagStyle(hotRank) {
      return CONST.Hots[hotRank].color;
    },
    getShow(hotRank) {
      if (hotRank > 2) {
        return false;
      }
      return true;
    },
  },
};
</script>

<style scoped>
.post-item {
  width: 100%;
}
.hot-rank {
  width: 35px;
  line-height: 18px;
  font-weight: 900;
  font-size: 14px;
  margin-left: 2%;
  text-align: center;

}
.card {
  float: right;
  width: 95%;
  margin-right: 3%;
  margin-left: 3%;
  /* border-bottom: 1px solid #f0f0f0; */
}
.author-avatar {
  border: 1px solid #eee;
}
.author-name {
  margin-left: 2px;
  margin-right: 5px;
  font-size: 12px;
  color: #666666;
}
.author-level {
  font-size: 10px;
  padding-left: 5px;
  padding-right: 5px;
}

.post-title {
  font-weight: 600;
  font-size: 16px;
  color: #333333;
}
.post-content {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 6;  /*显示的行数*/
  overflow: hidden;
  word-break:normal; /*可择*/
}
.post-hot-degree {
  float: right;
  /* margin-right: 3%; */
  font-weight: normal;
  font-size: 16px;
  color: #333;
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
  margin-left: 45px;
  font-size: 12px;
  color: #999999;
  font-weight: normal;
}
</style>