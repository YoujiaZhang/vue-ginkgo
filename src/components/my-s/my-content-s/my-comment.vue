<template>
  <div>
    <a-card :bordered="false" style="width: 100%">
      <a-card-meta>
        <div slot="description">
          <div style="color: #333333;margin-bottom: 10px;">
            <span style="margin-right:5px;">{{ comment.content }}</span>
            <span class="data-time">{{
              CONST.getDiffTime(comment.createTime)
            }}</span>
          </div>

          <a-card
            class="replyObj"
            :bordered="false"
            v-if="this.parent !== undefined"
            style="width: 100%"
          >
            <a-card-meta>
              <a-avatar
                class="author-avatar"
                size="small"
                slot="avatar"
                :src="headerUrl"
                @click.stop="goUser(userID)"
              />
              <div slot="title">
                <strong class="author-title">{{ userName }}</strong>
                <span class="data-time">{{
                  CONST.getDiffTime(createTime)
                }}</span>
              </div>

              <div slot="description" @click="goTo">
                <div style="color: #333333; font-size: 14px">{{ content }}</div>
              </div>
            </a-card-meta>
          </a-card>


          <div class="post" @click="goTo">
            <div style="color:#333;font-size: 14px; font-weight: 600">
              {{ this.post.title }}
              <van-tag
                style="font-weight: normal; font-size: 10px"
                color="#888"
                plain
                round
                >原帖</van-tag
              >
              <span style="font-size:12px;font-weight:normal;margin-left:5px;color: #888;">{{
              CONST.getDiffTime(this.post.createTime)
            }}</span>
            </div>
            <div style="padding-top:5px;font-size: 12px">
              <div v-html="CONST.escape2Html(this.post.content)"></div>
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
  props: ["parent", "post", "comment"],
  data() {
    return {
      CONST,
      showPicture: true,

      content: "",
      title: "",
      pictures: [],
      createTime: "",
      userName: "",
      headerUrl: "",
      userID: "",

      message: {
        userID: this.$store.state.myUserID,
        postID: this.postID,
      },

      imageError: [],
    };
  },

  created() {
    
    if (this.parent !== undefined) {
      this.content = this.parent.comment.content;
      this.createTime = this.parent.comment.createTime;
      this.userName = this.parent.user.username;
      this.headerUrl = this.parent.user.headerUrl;
      this.userID = this.parent.user.id;

    }
    if (this.post.picUrls != null) {
      // console.log(this.pictures);
      for (let i = 0; i < this.post.picUrls.length; i++) {
        this.imageError.push(false);
      }
    }
  },
  methods: {
    goTo() {
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
.replyObj {
  background-color: rgba(0, 0, 0, 0.03);
  border-bottom: 1px solid #ddd;
}
.author-title {
  margin-right: 5px;
  font-size: 14px;
  font-weight: 600;
  color: #444;
}
.author-avatar {
  /* margin-right: 5px; */
  border: 1px solid #eee;
}
.data-time {
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
</style>