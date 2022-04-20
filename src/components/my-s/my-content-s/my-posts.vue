<template>
  <div>
    <a-card :bordered="false" style="width: 100%">
      <a-card-meta>
        <div slot="title">
          <!-- 帖子标题 -->
          <span class="author-title" v-html="authorTitle"></span>
        </div>

        <div slot="description">
          <!-- 富文本展示 -->
          <div
            id="my-post-content" class="post-content"
            v-html="CONST.escape2Html(authorText)"
            @click="goContent"
          ></div>

          <!-- 用户上传的图片 -->
          <van-grid
            style="padding-left: 0px; padding-top: 10px" :border="false"
            :column-num="3" :gutter="5"
            v-show="imageError.length !== 0"
          >
            <van-grid-item v-for="(p, index) in pictures" :key="index">
              <van-image
                height="100" fit="cover" :src="p"
                @error="imageLoadError(index)"
                v-show="!imageError[index]"
              />
              <van-image
                height="100" fit="cover"
                :src="require('../../../assets/images/imageError.png')"
                v-show="imageError[index]"
              />
            </van-grid-item>
          </van-grid>
        </div>
      </a-card-meta>
    </a-card>

    <div class="post-tags">
      <span class="post-release-time">{{ releaseTime }}</span>
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
import CONST from "../../../assets/const";
export default {
  props: [
    "postID",
    "authorTitle",
    "authorText",
    "releaseTime",
    
    "postLikes",
    "postViews",
    "postComments",
    "pictures",
  ],
  data() {
    return {
      CONST,
      message: {
        userID: this.$store.state.myUserID,
        postID: this.postID,
      },
      imageError: [],
    };
  },
  created() {
    if (this.pictures != null) {
      for (let i = 0; i < this.pictures.length; i++) {
        this.imageError.push(false);
      }
    }
  },
  methods: {
    goContent() {
      this.$router.push({
        name: "content",
        params: this.message,
      });
    },

    imageLoadError(index) {
      this.imageError[index] = true;
      this.$forceUpdate();
    },
  },
};
</script>

<style scoped>
.author-title {
  margin-right: 5px;
  font-size: 16px;
  font-weight: 600;
  color: #222222;
}
.post-content {
  color: #333333; 
  font-size: 14px;

  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 6;  /*显示的行数*/
  overflow: hidden;
  word-break:normal;
}
.post-tags {
  margin-top: 0px;
}
.post-tag {
  float: right;
  margin-left: 20px;
  font-size: 12px;
}
.post-release-time {
  font-size: 12px;
  color: #999999;
  font-weight: normal;
}
</style>