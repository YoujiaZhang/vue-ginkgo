<template>
  <div>
    <a-list-item-meta>
      <a-avatar
        slot="avatar"
        style="border: 1px solid #eee"
        :src="userInfo.headerUrl"
      />
      <div slot="title">
        <span class="message-name">{{ userInfo.username }}</span>

        <!-- 消息来源用户的等级 -->
        <van-tag
          class="message-user-level"
          :color="CONST.Tags[level].background"
          :text-color="CONST.Tags[level].color"
          :round="false"
        >
          {{ CONST.Tags[level].name }}</van-tag
        >
      </div>

      <div slot="description">
        <div class="message-time">
          <span class="message-time">{{
            CONST.getDiffTime(userInfo.createTime)
          }}</span>
        </div>
      </div>
    </a-list-item-meta>
  </div>
</template>

<script>
import axios from "../../plugins/Axios";
import CONST from "../../assets/const";

export default {
  props: ["user"],
  data() {
    return {
      CONST,
      userInfo: {},
      level: 0,
    };
  },
  created() {
    let that = this;
    axios({
      url: "/user/" + this.user.id,
      method: "GET",
    }).then(function (response) {
      that.userInfo = response.data.msg.user;
      that.level = that.userInfo.level
    });
  },
};
</script>

<style scoped>
.message-time {
  color: #888;
  font-weight: normal;
  font-size: 12px;
  margin-left: 5px;
  margin-bottom: 5px;
}
.message-user-level {
  font-size: 10px;
  margin-left: 5px;
}
.message-name {
  color: #333;
  margin-left: 10px;
  font-size: 14px;
  font-weight: 600;
}
.realname-info{
  color: #8cc269;
  margin-left: 10px;
  /* border: 1px solid #fff; */
}
</style>