<template>
  <div style="width: 100%">
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

        <span class="message-time">{{
          CONST.getDiffTime(userInfo.createTime)
        }}</span>

        <span style="float: right">
          <a-button
            type="primary" shape="round" ghost size="small"
            @click="approved"
          >
            通过 <a-icon type="check" />
          </a-button>
        </span>
      </div>

      <div slot="description">
        <span class="realname-info" @click="showRealname=!showRealname" v-show="!showRealname">查看详情</span>
        <a-descriptions style="margin-left:10px;margin-top:10px" v-show="showRealname">
          <a-descriptions-item label="真实姓名">
            {{user.realName}}
          </a-descriptions-item>
          <a-descriptions-item label="学号">
            {{user.studentCode}}
          </a-descriptions-item>
          <a-descriptions-item label="学院">
            {{user.institute}}
          </a-descriptions-item>
          <a-descriptions-item label="班级">
            {{user.professionalClass}}
          </a-descriptions-item>
          <a-descriptions-item style="">
            <van-image
              height="100" style="border: 1px solid #d9d9d9" fit="contain" :show-error="false"
              :src="user.studentCardUrl"
              @click="previewVisible=true"
            />
          </a-descriptions-item>
        </a-descriptions>
        <span class="realname-info" @click="showRealname=!showRealname" v-show="showRealname">
          收起 <a-icon type="up" />
        </span>
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
      showRealname: false,
      previewVisible: false,
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
  methods:{
    approved(){
      let that = this;
      axios({
        url: "/admin/audit",
        method: "POST",
        data: {
          userId: this.user.id,
          auditStatus: 2,
        },
      }).then(function (response) {
        console.log(response.data)
        that.$emit("refresh");
      });
    },
  }
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