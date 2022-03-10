<template>
  <div>
    <a-card :bordered="false" style="width: 100%" @click="goTo">
      <a-card-meta>
        <a-avatar class="author-avatar" slot="avatar" :src="userAvatar" />
        <div slot="description">
          <div style="color: #333333;">
            <span >{{ userName }}</span>
            <span class="data-time">{{ CONST.escape2Html(followTime) }}</span>

            <a-button
              class="follow-button"
              v-show="!hasFollowed"
              type="primary"
              size="small"
              icon="user"
              @click.stop="follow"
            >
              关注TA
            </a-button>
            <a-button
              class="follow-button"
              v-show="hasFollowed"
              size="small"
              icon="check"
              @click.stop="unfollow"
            >
              已关注
            </a-button>
          </div>
        </div>
      </a-card-meta>
    </a-card>
  </div>
</template>

<script>
import CONST from "../../../assets/const";
import reqwest from "reqwest";
export default {
  props: [
    "userID",
    // 用户信息
    "userName",
    "userAvatar",
    "userRank",

    "hasFollowed",
    "followTime",
  ],
  data() {
    return {
      CONST,
      showPicture: true,
      message: {
        userID: this.userID,
      },
    };
  },

  methods: {
    goTo() {
      // console.log("粉丝的ID", this.message);
      //带参数跳转
      this.$router.push({
        name: "other",
        params: this.message,
      });
    },
    showPictures() {
      this.showPicture = this.showPicture ? false : true;
    },

    follow() {
      console.log("关注点击");
      reqwest({
        url: CONST.URL + "/follow",
        type: "json",
        method: "POST",
        contentType: "application/json;charset=utf-8",
        data: JSON.stringify({
          entityType: 3,
          entityId: this.userID,
        }),
        success: (res) => {
          console.log("关注成功", res.msg);
          this.hasFollowed = true;
        },
        error: function (err) {
          this.error = err;
        },
      });
    },

    unfollow() {
      console.log(CONST.URL + "/unfollow");
      reqwest({
        url: CONST.URL + "/unfollow",
        type: "json",
        method: "POST",
        contentType: "application/json;charset=utf-8",
        data: JSON.stringify({
          entityType: 3,
          entityId: this.userID,
        }),
        success: (res) => {
          console.log("取关成功", res.msg);
          this.hasFollowed = false;
        },
        error: function (err) {
          this.error = err;
        },
      });
    },
  },
};
</script>

<style scoped>
.post {
  margin-top: 10px;
  background-color: rgba(0, 0, 0, 0.03);
}
.author-avatar{
  border: 1px solid #eee
}
.data-time {
  margin-left: 10px;
  font-size: 12px;
  color: #999999;
  font-weight: normal;
}
.textTags {
  margin-top: 0px;
  margin-bottom: 0px;
}
.textTag {
  float: right;
  margin: 0px;
  width: 25%;
}

.follow-button {
  float: right;
  /* width: 25%; */
  border-radius: 10px;
}
</style>