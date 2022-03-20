<template>
  <div class="root">
    <a-card class="user-info">
      <a-card-meta>
        <a-avatar
          style="border: 1px solid #eee" slot="avatar" :size="60"
          :src="headerUrl"
        />
        
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
            strokeColor="#8cc269" size="small"
            :percent="(exp / CONST.EXP[level]).toFixed(2) * 100"
          />
        </div>

        <div class="user-info-title" slot="title">
          <span style="font-size: 16px">{{ username }}</span>
          <a-icon
            class="user-setting" type="setting" theme="twoTone" twoToneColor="#41b349"
            @click="showDrawer"
          />
        </div>
      </a-card-meta>
    </a-card>

    <div class="user-some-info">
      <a-row>
        <a-col :span="8">
          <a-statistic valueStyle="font-size:18px" :value="followeeCount">
            <span slot="title">关注 <my-icon type="icon-wodeguanzhu" /></span>
          </a-statistic>
        </a-col>
        <a-col :span="8">
          <a-statistic valueStyle="font-size:18px" :value="followerCount">
            <span slot="title">粉丝 <my-icon type="icon-wodefensi" /></span>
          </a-statistic>
        </a-col>
        <a-col :span="8">
          <a-statistic valueStyle="font-size:18px" :value="userLikeCount">
            <span slot="title">获赞 <my-icon type="icon-xihuan" /></span>
          </a-statistic>
        </a-col>
      </a-row>
    </div>

    <div style="height:2px;margin-top:20px;background-color: rgb(246, 246, 246);"></div>

    <a-drawer
      placement="right" width="100%"
      :closable="true"
      :visible="visible"
      @close="onClose"
    >
      <my-info
        :user="user"
        @myNewAvatar="myNewAvatar"
        @myNewUserName="myNewUserName"
      ></my-info>
    </a-drawer>
  </div>
</template>

<script>
import myInfo from "./my-header-s/my-info.vue";

import CONST from "../../assets/const.js";
import axios from "../../plugins/Axios"

export default {
  components: { myInfo },
  props: ["showRealNameConfirm"],
  data() {
    return {
      CONST,
      user: {},
      headerUrl: "",
      username: "",

      visible: false,

      followeeCount: 0,
      followerCount: 0,
      userLikeCount: 0,

      level: 0,
      exp: 0,
    };
  },

  created() {
    if(this.showRealNameConfirm){
      this.visible = true
    }

    if (this.$store.state.myUserID != "") {
      let that = this
      axios({
        url: "/user/" + this.$store.state.myUserID,
        method: "GET",
      })
      .then(function (response) {
        let res = response.data
        console.log("加载个人信息", res.msg);
        that.user = res.msg.user;

        that.username = res.msg.user.username;
        that.headerUrl = res.msg.user.headerUrl;
        that.level = res.msg.user.level;
        that.exp = res.msg.user.exp;

        that.followeeCount = res.msg.followeeCount;
        that.followerCount = res.msg.followerCount;
        that.userLikeCount = res.msg.user.likeCount;

        that.$forceUpdate();
        that.$emit("myHeaderLoadingFinish");
      });
    }
  },

  methods: {
    showDrawer() {
      this.visible = true;
    },
    onClose() {
      this.visible = false;
    },
    myNewAvatar(value) {
      this.headerUrl = value;
    },
    myNewUserName(value) {
      this.username = value;
    },
  },
};
</script>

<style scoped>
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
  font-size: 24px;
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