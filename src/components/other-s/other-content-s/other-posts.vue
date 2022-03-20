<template>
  <div>
    <a-card :bordered="false" style="width: 100%">
      <a-card-meta>
        <!-- 帖子标题 -->
        <div slot="title">
          <!-- 作者的姓名 -->
          <strong class="author-title">{{ authorTitle }}</strong>
          <!-- 作者发布帖子的时间 -->
          <span class="data-time">{{ releaseTime }}</span>
        </div>

        <div slot="description">
          <!-- 富文本展示 -->
          <div id="my-post-content" class="post-content" style="color: #333333;font-size:13px" v-html="CONST.escape2Html(authorText)" @click="goTo"></div>

          <van-grid
            style="padding-left: 0px; padding-top: 10px" :border="false" :column-num="3" :gutter="5"
            v-show="imageError.length !== 0"
          >
            <van-grid-item v-for="(p, index) in postPictures" :key="index">
              <van-image
                height="100" fit="cover" :src="p"
                @error="imageLoadError(index)"
                v-show="!imageError[index]"
              />
              <van-image
                height="100" fit="cover"
                :src="require('../../../assets/images/empty-image-default.png')"
                v-show="imageError[index]"
              />
            </van-grid-item>
          </van-grid>

          <div class="textTags">
            <span class="data-time">{{ releaseTime }}</span>
            <p class="textTag" align="right">
              <a-icon type="like" align="right" />
              {{ postLikes }}
            </p>
            <p class="textTag" align="right">
              <a-icon type="eye" align="right" />
              {{ postViews }}
            </p>
            <p class="textTag" align="right">
              <a-icon type="message" align="right" />
              {{ postComments }}
            </p>
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
    "postID",
    "authorTitle",
    "authorText",
    "releaseTime",

    "postLikes",
    "postViews",
    "postComments",
    "postPictures",
  ],
  data() {
    return {
      CONST,
      showPicture: true,
      message: {
        userID: this.$store.state.myUserID,
        postID: this.postID,
      },
      imageError: [],
    };
  },
  created(){
    if (this.postPictures != null) {
      for (let i = 0; i < this.postPictures.length; i++) {
        this.imageError.push(false);
      }
    }
  },
  methods: {
    goTo() {
      //带参数跳转
      this.$router.push({
        name: "content",
        params: this.message,
      });
    },
    showPictures() {
      this.showPicture = this.showPicture ? false : true;
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
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 6;  /*显示的行数*/
  overflow: hidden;
  word-break:normal; /*可择*/
}
.textTags {
  margin-top: 10px;
}
.textTag {
  float: right;
  margin-left: 20px;
  font-size: 12px;
}
.data-time {
  font-size: 12px;
  color: #999999;
  font-weight: normal;
}
</style>