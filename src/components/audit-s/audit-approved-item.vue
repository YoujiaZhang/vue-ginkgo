<template>
  <div style="width: 100%">
    <!-- {{user}} -->
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
            type="danger" shape="round" ghost size="small" style="margin-left:15px"
            @click="reject"
          >
            驳回 
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

    <!-- 展示图片预览 -->
    <a-modal :visible="previewVisible" :footer="null" @cancel="previewVisible = false">
      <img alt="example" style="width: 100%" :src="user.studentCardUrl" />
      <span slot="title">图片预览</span>
    </a-modal>

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
    this.getStuCard()

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
    reject(){
      let that = this;
      axios({
        url: "/admin/audit",
        method: "POST",
        data: {
          userId: this.user.id,
          auditStatus: 3,
        },
      }).then(function (response) {
        console.log(response.data)
        that.$emit("refresh");
      });
    },

    getStuCard(){
      let that = this
      let studentCardUrl = ''
      studentCardUrl += '&filePath=' + that.user.studentCardUrl
      axios({
        url: "/cos/admin/credential?type=studentCard"+studentCardUrl,
        method: "GET",
      })
      .then(function (response) {
        let bucket = response.data.msg.bucket
        let region = response.data.msg.region
        let tempSecret = response.data.msg.credential;

        const COS = require("cos-js-sdk-v5");
        that.cos = new COS({
          getAuthorization: (options, callback) => {
            let data = {
              TmpSecretId: tempSecret.credentials.tmpSecretId,
              TmpSecretKey: tempSecret.credentials.tmpSecretKey,
              XCosSecurityToken: tempSecret.credentials.sessionToken,

              StartTime: tempSecret.startTime, // 时间戳，单位秒
              ExpiredTime: tempSecret.expiredTime, // 时间戳，单位秒
            };
            callback(data);
          },
        });

        that.cos.getObjectUrl({
          Bucket: bucket,
          Region: region,
          Key: that.user.studentCardUrl
        },
        function (err, data) {
          if(data != undefined){
            that.user.studentCardUrl = data.Url
          }
        });
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