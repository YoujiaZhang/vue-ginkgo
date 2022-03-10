<template>
  <div class="editor">
    <a-divider orientation="left">1. 相关信息</a-divider>
    <!-- 帖子相关的表单信息 -->
    <editor-form
      @formDataChange="formDataChange"
      @valueValid="valueValid"
    ></editor-form>

    <a-divider orientation="left">2. 编辑内容</a-divider>
    
    <!-- 富文本编辑区 -->
    <a-collapse class="add-pictures">
      <a-collapse-panel>
        <div slot="header">
          <span>上传图片</span>
          <span style="float: right">{{ postPicturesList.length }}/6</span>
        </div>
        <a-upload
          name="file"
          accept="image/*"
          list-type="picture-card"
          :file-list="postPicturesList"
          @preview="handlePreview"
          @change="handleChange"
        >
          <div v-if="postPicturesList.length < 6">
            <a-icon type="plus" />
            <div class="ant-upload-text">选择图片</div>
          </div>
        </a-upload>
      </a-collapse-panel>
    </a-collapse>

    <!-- 展示图片预览 -->
    <a-modal :visible="previewVisible" :footer="null" @cancel="previewVisible = false">
      <img alt="example" style="width: 100%" :src="previewImage" />
      <span slot="title">图片预览</span>
    </a-modal>

    <editor-richtext v-show="true" @richTextDataChange="richTextDataChange"></editor-richtext>

    <!-- 返回按钮 -->
    <myBall @click="goBack"></myBall>

    <!-- 提交按钮 -->
    <a-button class="submit" type="primary" shape="round" @click="submit">
      提交
    </a-button>

    <!-- 提交成功反馈信息 -->
    <van-dialog v-model="showSubmit" @confirm="submitConfirm" showConfirmButton>
      <div slot="title">
        <span style="margin-right: 5px; font-weight: 600">发布成功</span>
        <a-icon type="check-circle" theme="twoTone" />
      </div>
    </van-dialog>

    <van-dialog v-model="showSubmitError" showConfirmButton>
      <div slot="title">
        <span style="margin-right: 5px; font-weight: 600">发布错误</span>
        <a-icon type="close-circle" theme="twoTone" two-tone-color="#ff6a4c" />
      </div>
      <div style="margin: 20px">{{ errorMessage }}</div>
    </van-dialog>

  </div>
</template>

<script>
import editorRichtext from "./editor-s/editor-richtext.vue";
import editorForm from "./editor-s/editor-form.vue";
import myBall from "./dragBall-s/backBall.vue";

import reqwest from "reqwest";
import CONST from "../assets/const";

export default {
  components: { editorRichtext, editorForm, myBall },
  data() {
    return {
      /* 提交 */
      showSubmit: false,      // 提交成功反馈界面
      showSubmitError: false, // 提交错误反馈界面
      // activeKey: ["0"],
      
      /* 帖子 */
      form: "",         // 帖子的相关信息 表单
      content: "",      // 富文本的内容
      formCorrectData: {// 帖子的相关信息 校验信息
        source: "", 
        options: false,
        message:"标题不能为空哦~" 
      },
      errorMessage: "", // 帖子的相关信息 检验错误之后的提示信息

      /* 上传图片 */
      postPicturesList: [], // 图片数组
      cos: {},              // COS对象
      previewImage: "",     // 预览的图片
      previewVisible: false,// 预览的图片的显示状态
    };
  },
  created() {
    this.$store.dispatch("edKeyChange", false);
  },
  
  methods: {
    /* 获取表单数据校验信息 */
    valueValid(data) {
      this.formCorrectData = data;
    },
    /* 获取表单 */
    formDataChange(data) {
      this.form = data;
    },
    /* 获取富文本内容 */
    richTextDataChange(data) {
      this.content = data;
    },

    // 帖子发布成功
    submitConfirm() {
      this.$router.replace({
        name: "home",
      });
    },

    getBase64(file) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
      });
    },

    async handlePreview(file) {
      if (!file.preview) {
        file.preview = await this.getBase64(file.originFileObj);
      }
      this.previewImage = file.preview;
      this.previewVisible = true;
    },

    handleChange({ fileList }) {
      this.postPicturesList = fileList;
      for (var i = 0; i < this.postPicturesList.length; i++) {
        this.postPicturesList[i].status = "done";
      }
    },

    submit() {
      if (this.formCorrectData.options === false) {
        this.errorMessage = this.formCorrectData.message;
        this.showSubmitError = true;
        return;
      }
      if (this.content === "") {
        this.errorMessage = "内容不能为空哦";
        this.showSubmitError = true;
        return;
      }

      let allPicturesNewPaths = [];
      let promiseArr = [];

      for (var i = 0; i < this.postPicturesList.length; i++) {
        let p = new Promise((resolve) => {
          let thisFileName = this.postPicturesList[i].name;
          let thisFileObj = this.postPicturesList[i].originFileObj;
          reqwest({
            url: CONST.URL + "/cos/credential",
            type: "json",
            method: "GET",
            data: {
              type: "picture",
              fileName: thisFileName,
            },
            success: (res) => {
              let tempSecret = res.msg;
              const COS = require("cos-js-sdk-v5");

              this.cos = new COS({
                getAuthorization: (options, callback) => {
                  let data = {
                    TmpSecretId: tempSecret.credentials.tmpSecretId,
                    TmpSecretKey: tempSecret.credentials.tmpSecretKey,
                    XCosSecurityToken: tempSecret.credentials.sessionToken,

                    StartTime: tempSecret.startTime,     // 时间戳，单位秒
                    ExpiredTime: tempSecret.expiredTime, // 时间戳，单位秒
                  };
                  callback(data);
                },
              });

              this.cos.putObject(
                {
                  Bucket: "test-1306812178",
                  Region: "ap-guangzhou",
                  Key: this.$store.state.myUserID + "/" + thisFileName,
                  Body: thisFileObj,
                },
                function (err, data) {
                  resolve(allPicturesNewPaths.push("https://" + data.Location));
                }
              );
            },
          });
        });
        promiseArr.push(p);
      }
      Promise.all(promiseArr).then(() => {
        reqwest({
          url: CONST.URL + "/discuss/add",
          type: "json",
          method: "POST",
          contentType: "application/json;charset=utf-8",

          headers: {
            Authorization: "HUSTer_" + this.$store.state.myTicket,
          },

          data: JSON.stringify({
            title: this.form.title,
            content: this.content,
            picUrls: allPicturesNewPaths,
          }),
          success: (res) => {
            this.showSubmit = true;
            console.log("发布成功", res);
          },
        });
      });
    },

    // 返回上一页
    goBack() {
      this.$router.go(-1);
    },
  },
};
</script>

<style scoped>
.editor {
  padding-top: 10px;
}
.submit {
  position: fixed;
  z-index: 1000;
  bottom: 50px;
  right: 5%;
  box-shadow: 5px 5px 10px rgba(0, 0, 0, 0.2);
}
.back {
  margin-top: 90px;
  margin-left: 5%;
  float: left;
}
.add-pictures {
  margin-right: 5%;
  margin-left: 5%;
}
.footer {
  width: 100%;
  height: 150px;
}
</style>
