<template>
  <div>
    <a-divider class="line" orientation="left"> 基本资料 </a-divider>

    <uploadPicture
      style="margin-bottom: 25px"
      :headerUrl="user.headerUrl"
      @save="saveNewPic"
    ></uploadPicture>

    <a-input-search
      class="input"
      addonBefore="用户名"
      v-model="userName"
      :placeholder="user.username"
      @search="changeUserName"
      ><a-button slot="enterButton" >
        修改
      </a-button>
    </a-input-search>

    <a-divider class="line" orientation="left"> 
      实名认证  
      <a-tag style="margin-left:10px" v-if="auditStatus===2" color="green">审核通过</a-tag>
      <a-tag style="margin-left:10px" v-if="auditStatus===1" color="blue">审核中</a-tag>
    </a-divider>
    
    <a-form-model ref="ruleForm" :model="form" :rules="rules" @validate='validate'>
      <a-form-model-item ref="realName" prop="realName">
        <a-input
          v-model="form.realName"
          addonBefore="姓名"
          :placeholder="form.realName"
          :disabled="canNotWrite"
          @blur="
            () => {
              $refs.realName.onFieldBlur();
            }
          "
        >
        </a-input>
      </a-form-model-item>

      <a-form-model-item ref="studentCode" prop="studentCode">
        <a-input
          v-model="form.studentCode"
          addonBefore="学号"
          :placeholder="form.studentCode"
          :disabled="canNotWrite"
          @blur="
            () => {
              $refs.studentCode.onFieldBlur();
            }
          "
        >
        </a-input>
      </a-form-model-item>

      <a-form-model-item ref="institute" prop="institute">
        <a-input
          v-model="form.institute"
          addonBefore="学院"
          :placeholder="form.institute"
          :disabled="canNotWrite"
          @blur="
            () => {
              $refs.institute.onFieldBlur();
            }
          "
        >
        </a-input>
      </a-form-model-item>

      <a-form-model-item ref="professionalClass" prop="professionalClass">
        <a-input
          v-model="form.professionalClass"
          addonBefore="班级"
          :placeholder="form.professionalClass"
          :disabled="canNotWrite"
          @blur="
            () => {
              $refs.professionalClass.onFieldBlur();
            }
          "
        >
        </a-input>
      </a-form-model-item>
    </a-form-model>

    <div
      style="text-align: center; margin-bottom: 10px"
      @click="uploadStuCardClick"
    >
      <van-image
        height="250"
        style="border: 1px solid #d9d9d9"
        fit="contain"
        :show-error="false"
        :src="studentCardUrl"
        @error="imageLoadError"
        v-show="!imageError"
      />
      <van-image
        style="border: 1px solid #d9d9d9"
        height="250"
        :src="require('../../../assets/images/realName.png')"
        v-show="imageError"
      />
    </div>

    <a-upload
      accept="image/*"
      list-type="text"
      :file-list="studentCardPicture"
      :showUploadList="false"
      @change="stuCardChange"
    >
      <div id="uploadStuCard"></div>
    </a-upload>

     <!-- 展示图片预览 -->
    <a-modal 
      :visible="previewVisible" 
      :closable="false" 
      :confirmLoading="studentCardPictureLoading"
      @cancel="previewVisible=false" 
      @ok="submitStudentCardPicture"
    >
      <span slot="title">学生证预览 </span>
      <img alt="example" style="width: 100%" :src="previewImg" />
      <span slot="cancelText">取消</span>
      <span slot="okText">确定</span>
    </a-modal>


    <a-button
      class="button"
      type="primary"
      shape="round"
      :disabled="canNotWrite"
      @click="saveStudentInfo"
      v-show="visible"
    >
      保存
    </a-button>

    <!-- <a-button style="margin-top:30px"  type="danger" ghost block @click="logout">
      退出账号
    </a-button> -->

  </div>
</template>

<script>
import uploadPicture from "../../picture-s/uploadPicture.vue";

import reqwest from "reqwest";
import CONST from "../../../assets/const";
import { Toast as VantToast } from "vant";

export default {
  props: ["user"],
  components: { uploadPicture },
  data() {
    return {
      userName: "",

      form: {
        realName: "",
        studentCode: "",
        institute: "",
        professionalClass: "",
      },
      studentCardUrl:"",

      rules: {
        realName: [
          {
            required: true,
            message: "请填写真实姓名",
            trigger: "blur",
          },
          {
            min: 0,
            max: 10,
            message: "10个字以内",
            trigger: "blur",
          },
        ],
        studentCode: [
          {
            required: true,
            message: "请填写学号",
            trigger: "blur",
          },
          {
            len: 10,
            message: "确认学号格式",
            trigger: "blur",
          },
        ],
        institute: [
          {
            required: true,
            message: "请学院名",
            trigger: "blur",
          },
          {
            min: 2,
            max: 10,
            message: "输入2~10个字",
            trigger: "blur",
            hasFeedback: true,
          },
        ],
        professionalClass: [
          {
            required: true,
            message: "请输入班级",
            trigger: "blur",
          }
        ]
      },
      auditStatus: 0,

      canNotWrite: false,

      avatarPicture: [],
      pictureInfo: "",

      studentCardPicture: [],
      previewVisible: false,
      previewImg: '',
      studentCardPictureLoading: false,

      imageError: true,
      visible: false,
      formRight: true,
    };
  },
  created() {
    reqwest({
      url: CONST.URL + "/user/realname/get",
      type: "json",
      method: "GET",
      headers: {
        ticket: this.$store.state.myTicket,
      },
      success: (res) => {
        console.log("获取实名信息", res);
        this.form.realName = res.msg.realName;
        this.form.studentCode = res.msg.studentCode;
        this.form.institute = res.msg.institute;
        this.form.professionalClass = res.msg.professionalClass;
        this.studentCardUrl = res.msg.studentCardUrl;

        this.auditStatus = res.msg.auditStatus

        if (this.studentCardUrl != null) {
          this.imageError = false;
        } else {
          this.imageError = true;
        }
        
        if(this.form.realName==null||
          this.form.studentCode==null||
          this.form.institute==null||
          this.form.professionalClass==null||
          this.studentCardUrl==null
        ){
          this.visible = true
          this.canNotWrite = false;
        }
        else{
          this.visible = false
          this.canNotWrite = true
        }
      },
    });
  },
  methods: {
    validate(source, options){
      this.formRight = this.formRight && options
    },

    changeUserName() {
      reqwest({
        url: CONST.URL + "/user/username",
        type: "json",
        method: "POST",
        contentType: "application/json;charset=utf-8",
        headers: {
          ticket: this.$store.state.myTicket,
        },
        data: JSON.stringify(this.userName),
        success: (res) => {
          VantToast({
            message: res.msg,
            icon: res.code==='200' ? "success" : "cross",
          });
          if(res.code==='200'){
            this.$emit("myNewUserName", this.userName);
            this.user.username = this.userName
            this.userName = ''
          }
        },
      });
    },
    changeStudentInfo() {
      this.canNotWrite = false;
    },
    saveStudentInfo() {
      if(this.form.realName==null||
        this.form.studentCode==null||
        this.form.institute==null||
        this.form.professionalClass==null||
        this.studentCardUrl==null||
        this.formRight == false
      ){
        VantToast({
          message: "请输入正确的格式",
          icon: "cross",
        });
        return
      }

      reqwest({
        url: CONST.URL + "/user/realname",
        type: "json",
        method: "POST",
        contentType: "application/json;charset=utf-8",

        headers: {
          ticket: this.$store.state.myTicket,
        },

        data: JSON.stringify({
          studentCardUrl: this.studentCardUrl,
          studentCode: this.form.studentCode,
          realName: this.form.realName,
          institute: this.form.institute,
          professionalClass: this.form.professionalClass,
        }),

        success: () => {
          VantToast({
            message: "上传成功",
            icon: "success",
          });
          this.canNotWrite = true;
          this.visible = false
        },
      });
    },

    imageLoadError() {
      this.imageError = true;
      this.$forceUpdate();
    },

    uploadStuCardClick() {
      if (this.canNotWrite === true) {
        return;
      }

      let upload = document.getElementById("uploadStuCard");
      upload.click();
      this.studentCardPicture = [];
    },

    saveNewPic(data) {
      let avatarNewPaths = [];
      let promiseArr = [];
      let tempPicName = CONST.guid() + ".jpg";
      
      let p = new Promise((resolve) => {
        reqwest({
          url: CONST.URL + "/cos/credential",
          type: "json",
          method: "GET",
          data: {
            type: "avatar",
            fileName: tempPicName,
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

                  StartTime: tempSecret.startTime, // 时间戳，单位秒
                  ExpiredTime: tempSecret.expiredTime, // 时间戳，单位秒
                };
                callback(data);
              },
            });

            this.cos.putObject(
              {
                Bucket: "test-1306812178",
                Region: "ap-guangzhou",
                Key: this.$store.state.myUserID + "/" + tempPicName,
                Body: CONST.dataURLtoFile(data),
              },
              function (err, data) {
                console.log(err || data);
                resolve(avatarNewPaths.push("https://" + data.Location));
              }
            );
          },
        });
      });
      promiseArr.push(p);

      Promise.all(promiseArr).then(() => {
        reqwest({
          url: CONST.URL + "/user/updateHeader",
          type: "json",
          method: "POST",
          contentType: "application/json;charset=utf-8",

          headers: {
            Authorization: "HUSTer_" + this.$store.state.myTicket,
          },

          data: JSON.stringify({
            headerUrl: avatarNewPaths[0],
          }),
          success: () => {
            VantToast({
              message: "更新成功",
              icon: "success",
            });
            this.user.headerUrl = avatarNewPaths[0];
            this.$forceUpdate();
            this.$emit("myNewAvatar", avatarNewPaths[0]);
          },
        });
      });
    },

    submitStudentCardPicture(){
      this.studentCardPictureLoading = true

      let stuCardNewPaths = [];
      let promiseArr = [];
      let p = new Promise((resolve) => {
        reqwest({
          url: CONST.URL + "/cos/credential",
          type: "json",
          method: "GET",
          data: {
            type: "avatar",
            fileName:
              this.studentCardPicture[0].uid +
              this.studentCardPicture[0].name,
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

                  StartTime: tempSecret.startTime, // 时间戳，单位秒
                  ExpiredTime: tempSecret.expiredTime, // 时间戳，单位秒
                };
                callback(data);
              },
            });

            this.cos.putObject(
              {
                Bucket: "test-1306812178",
                Region: "ap-guangzhou",
                Key:
                  this.$store.state.myUserID +
                  "/" +
                  this.studentCardPicture[0].uid +
                  this.studentCardPicture[0].name,
                Body: this.studentCardPicture[0].originFileObj,
              },
              function (err, data) {
                console.log(err || data);
                resolve(stuCardNewPaths.push("https://" + data.Location));
              }
            );
          },
        });
      });
      promiseArr.push(p);

      Promise.all(promiseArr).then(() => {
        this.studentCardUrl = stuCardNewPaths[0];
        this.imageError = false;
        this.studentCardPictureLoading = false
        this.previewVisible = false

        this.auditStatus = 1
        this.$forceUpdate();
      });
    },

    stuCardChange({ fileList, event }) {
      
      this.studentCardPicture = fileList;
      for (var i = 0; i < this.studentCardPicture.length; i++) {
        this.studentCardPicture[i].status = "done";
      }
      if (event != undefined && event.percent == 100) {
        this.previewVisible = true
        this.fileToBase64(this.studentCardPicture[0].originFileObj,(res)=>{
          this.previewImg = res
        })

        if(event.percent == 100){
          return
        }
      }
    },

    fileToBase64 (img, callback) {
      const reader = new FileReader()
      reader.addEventListener('load', () => callback(reader.result))
      reader.readAsDataURL(img)
    },

    logout(){
      reqwest({
        url: CONST.URL + "/logout",
        type: "json",
        method: "GET",
        success: () => {
          VantToast({
            message: "退出成功",
            icon: "success",
          });
          this.$store.dispatch("ticketGet", '');
          this.$store.dispatch("noticeUnreadCountGet",0);
          localStorage.setItem("ticket", '');
          this.$router.replace({
            name: "home",
          });
        }
      });
    }
  },
};
</script>

<style scoped>
.input {
  margin-bottom: 20px;
}
.line {
  margin-top: 10%;
}
.button {
  float: right;
  margin-right: 10px;
}
</style>