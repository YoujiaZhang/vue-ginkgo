<template>
  <div>
    <a-card :bordered="false" style="width: 100%" @click="goOther">
      <a-card-meta>
        <a-avatar
          class="user-avatar" slot="avatar"
          :src="userAvatar"
        />
        <div slot="description">
          <span style="color: #333333">
            <span>{{ userName }}</span>
            <span class="follow-time">{{ CONST.escape2Html(followTime) }}</span>
          </span>
          <a-button
            class="follow-button" type="primary" size="small" icon="user"
            v-show="!isFollowed"
            @click.stop="follow"
          >
            关注TA
          </a-button>
          <a-button
            class="follow-button" size="small" icon="check"
            v-show="isFollowed"
            @click.stop="unfollow"
          >
            已关注
          </a-button>
        </div>
      </a-card-meta>
    </a-card>

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
import CONST from "../../../assets/const";
import axios from "../../../plugins/Axios"

import { Toast as VantToast } from "vant";
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
      // 该用户是否关注了
      isFollowed: this.hasFollowed,
      // 是否暂时实名信息
      showRealNameConfirm: false,
      message: {
        userID: this.userID,
      },
    };
  },

  methods: {
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
        that.isFollowed = true;
      })
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
        that.isFollowed = false;
      });
    },

    goOther() {
      this.$router.push({
        name: "other",
        params: this.message,
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
.user-avatar{
  border: 1px solid #eee
}
.follow-time {
  margin-left: 10px;
  font-size: 12px;
  color: #999999;
  font-weight: normal;
}
.follow-button {
  float: right;
  border-radius: 10px;
}
</style>