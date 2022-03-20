<template>
  <div>
    <a-card :bordered="false" style="width: 100%" @click="goTo">
      <a-card-meta>
        <a-avatar
          class="author-avatar"
          slot="avatar"
          :src="userAvatar"
        />
        <div slot="description">
          <span style="color: #333333" @click="goTo">
            <span>{{ userName }}</span>
            <span class="data-time">{{ CONST.escape2Html(followTime) }}</span>
          </span>
          <a-button
            class="follow-button"
            v-show="!isFollowed"
            type="primary"
            size="small"
            icon="user"
            @click.stop="follow"
          >
            关注TA
          </a-button>
          <a-button
            class="follow-button"
            v-show="isFollowed"
            size="small"
            icon="check"
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
      <!-- <div style="margin: 20px">实名认证后才可以评论哦~</div> -->
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
      isFollowed: this.hasFollowed,
      showPicture: true,
      showRealNameConfirm: false,
      message: {
        userID: this.userID,
      },
    };
  },

  methods: {
    goTo() {
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

    showPictures() {
      this.showPicture = this.showPicture ? false : true;
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