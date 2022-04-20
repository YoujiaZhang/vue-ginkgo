<template>
  <div class="root">
    <a-card class="user-info">
      <a-card-meta>
        <!-- 用户头像 -->
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
            class="user-follow-button" type="primary" icon="user" shape="round"
            v-show="!hasFollowed"
            @click="follow"
          >
            关注TA
          </a-button>
          <a-button 
            class="user-follow-button" icon="check"  shape="round"
            v-show="hasFollowed" 
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
    </van-dialog>
  </div>
</template>

<script>
import axios from "../../plugins/Axios"
import CONST from "../../assets/const.js";

import { Toast as VantToast } from "vant";
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

      showRealNameConfirm: false,
    };
  },
  created() {
    let that = this
      axios({
      url: "/user/" + this.userID,
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
        url: "/follow",
        method: "POST",
        data: {
          entityType: 3,
          entityId: this.userID,
        },
      })
      .then(function () {
        that.hasFollowed = true
      });
    },

    unfollow() {
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
        url: "/unfollow",
        method: "POST",
        data: {
          entityType: 3,
          entityId: this.userID,
        },
      })
      .then(function () {
        that.hasFollowed = false
      });
    },

    goRealNameConfirm() {
      this.$router.push({
        name: "my",
        params: { showRealNameConfirm: true },
      });
    },

  },
};
</script>

<style scoped>
.root {
  padding-bottom: 5%;
}
.user-info-root {
  bottom: 0;
  z-index: -1;
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