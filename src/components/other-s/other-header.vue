<template>
  <div class="root">
    <a-card class="user-info">
      <a-card-meta>
        <a-avatar :src="headerUrl" slot="avatar" :size="60" />

        <div class="user-info-desc" slot="description">
          <span>{{ exp }}/{{ CONST.EXP[level] }}</span>
          <van-tag
            class="author-rank"
            :color="CONST.Tags[level].background"
            :text-color="CONST.Tags[level].color"
            :round="false"
          >
            {{ CONST.Tags[level].name }}</van-tag
          >
          <a-progress
            strokeColor="#8cc269"
            :percent="(exp / CONST.EXP[level]).toFixed(2) * 100"
            size="small"
          />
        </div>

        <div class="user-info-title" slot="title">
          <span style="font-size: 16px">{{ username }}</span>

          <a-button
            class="user-follow-button"
            v-show="!hasFollowed"
            type="primary"
            icon="user"
            shape="round"
            @click="follow"
          >
            关注TA
          </a-button>
          <a-button 
            class="user-follow-button" 
            v-show="hasFollowed" 
            icon="check" 
            shape="round"
            @click="unfollow"
          >
            已关注
          </a-button>

        </div>
      </a-card-meta>
    </a-card>

    <div class="user-some-info">
      <a-row>
        <a-col :span="8">
          <a-statistic valueStyle="font-size:20px" :value="followeeCount">
            <span slot="title">关注 <my-icon type="icon-wodeguanzhu" /></span>
          </a-statistic>
        </a-col>
        <a-col :span="8">
          <a-statistic valueStyle="font-size:20px" :value="followerCount">
            <span slot="title">粉丝 <my-icon type="icon-wodefensi" /></span>
          </a-statistic>
        </a-col>
        <a-col :span="8">
          <a-statistic valueStyle="font-size:20px" :value="userLikeCount">
            <span slot="title">获赞 <my-icon type="icon-xihuan" /></span>
          </a-statistic>
        </a-col>
      </a-row>
    </div>

    <div style="height:2px;margin-top:20px;background-color: rgb(246, 246, 246);"></div>
  </div>
</template>

<script>
import axios from "../../plugins/Axios"
import CONST from "../../assets/const.js";

export default {
  props: ["userID"],
  data() {
    return {
      CONST,
      user: {},
      headerUrl: "",
      username: "",
      visible: false,

      hasFollowed: false,

      followeeCount: 0,
      followerCount: 0,
      userLikeCount: 0,

      level: 0,
      exp: 0,
    };
  },
  created() {
    let that = this
      axios({
      url: "/user/" + this.userID,
      type: "json",
      method: "GET",
    })
    .then(function (response) {
      let res = response.data
      that.user = res.msg.user;

      that.username = res.msg.user.username;
      that.headerUrl = res.msg.user.headerUrl;
      that.level = res.msg.user.level;
      that.exp = res.msg.user.exp;

      that.followeeCount = res.msg.followeeCount;
      that.followerCount = res.msg.followerCount;
      that.userLikeCount = res.msg.user.likeCount;

      that.hasFollowed = res.msg.hasFollowed;
      // console.log("粉丝的信息", res.msg);
      that.$emit("loadingFinish", true);
    });
  },
  methods: {
    showDrawer() {
      this.visible = true;
    },
    onClose() {
      this.visible = false;
    },
    follow() {
      // console.log('关注点击')
      let that = this
      axios({
        url: "/follow",
        type: "json",
        method: "POST",
        contentType: "application/json;charset=utf-8",
        data: {
          entityType: 3,
          entityId: this.userID,
        },
      })
      .then(function () {
        // console.log("关注成功", res.msg);
        that.hasFollowed = true
      });
    },

    unfollow() {
      // console.log("/unfollow")
      let that = this
      axios({
        url: "/unfollow",
        type: "json",
        method: "POST",
        contentType: "application/json;charset=utf-8",
        data: {
          entityType: 3,
          entityId: this.userID,
        },
      })
      .then(function () {
        that.hasFollowed = false
      });
    },

  },
};
</script>

<style scoped>
.root {
  padding-bottom: 5%;
  /* background-color: #f0f5e5; */
  /* border-bottom: 1px solid red; */
}
.user-info-root {
  bottom: 0;
  z-index: -1;
  /* height: 71%; */
  width: 100%;
  position: fixed;
  padding-bottom: 10px;
  background-color: #f0f5e5;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
  
}
.user-info {
  padding-top: 5%;
  padding-left: 6%;
  padding-right: 6%;
  border-width: 0px;
  background-color: rgba(255, 255, 0, 0);
}
.user-info-title {
  font-size: 18px;
  margin-top: 10px;
  margin-left: 5px;
}
.user-info-desc{
  margin-left: 5px;
}
.user-setting {
  float: right;
  border: 0px solid;
}
.user-follow-button {
  float: right;
  border-radius: 10px;
  
}
.user-some-info {
  border-radius: 25px;
  padding: 8px;
  margin-left: 30px;
  margin-right: 30px;
  background-color: #eef7f2;
  text-align: center;
  box-shadow: 5px 5px 10px rgba(0, 0, 0, 0.1);
}
</style>