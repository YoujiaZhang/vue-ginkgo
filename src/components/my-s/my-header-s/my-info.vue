<template>
  <div>
    <a-divider class="line" orientation="left"> 基本资料 </a-divider>

    <upload-picture
      style="margin-bottom: 25px"
      :headerUrl="user.headerUrl"
      @save="saveNewPic"
    >
    <a-progress 
      style="width:100%" size="small" strokeColor="#8cc269" slot="progress"
      v-show="showAvatarLoadingProgress" :percent="avatarLoadingProgress"
    />
    </upload-picture>

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
      <a-tag style="margin-left:10px" v-if="auditStatus===3" color="red">审核驳回</a-tag>
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
        height="250" style="border: 1px solid #d9d9d9" fit="contain" :show-error="false"
        :src="studentCardUrl"
        @error="imageLoadError"
        v-show="!imageError"
      />
      <van-image
        height="250" style="border: 1px solid #d9d9d9"
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
      :closable="true" 
      :confirmLoading="studentCardPictureLoading"
    >
      <span slot="title">学生证预览 </span>
      <img alt="example" style="width: 100%" :src="previewImg" />
      <a-button type="primary" slot="footer" @click="submitStudentCardPicture">确定上传</a-button>
      <a-progress 
        style="width:100%" size="small" strokeColor="#8cc269"
        v-show="showStuCardLoadingProgress" :percent="stuCardLoadingProgress"
      />
    </a-modal>

    <a-button
      class="button" type="primary" shape="round"
      :disabled="canNotWrite"
      @click="saveStudentInfo"
      v-show="visible"
    >
      上传
    </a-button>

    <a-button style="margin-top:30px"  type="danger" ghost block @click="showLoginOut=true">
      退出账号
    </a-button>

    <van-dialog
      v-model="showLoginOut"
      show-cancel-button
      confirm-button-text="确定"
      confirm-button-color="返回"
      @confirm="confirmLoginOut"
    >
      <div slot="title">
        <span style="margin-right: 5px; font-weight: 600">您确定登出当前账号吗？</span>
        <a-icon type="info-circle" theme="twoTone" two-tone-color="#FFA500" />
      </div>
    </van-dialog>

  </div>
</template>

<script>
import uploadPicture from "../../picture-s/picture-cut.vue";

import axios from "../../../plugins/Axios"
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
      visible: true,
      formRight: {
        'realName':false,
        'studentCode':false,
        'institute':false,
        'professionalClass':false,
      },

      stuCardLoadingProgress: 0,
      showStuCardLoadingProgress: false,

      avatarLoadingProgress: 0,
      showAvatarLoadingProgress: false,

      showLoginOut: false
    };
  },
  created() {
    let that = this
    axios({
      url: "/user/realname/get",
      method: "GET",
    })
    .then(function (response) {
      console.log("获取实名信息", response.data);
      let res = response.data
      that.form.realName = res.msg.realName;
      that.form.studentCode = res.msg.studentCode;
      that.form.institute = res.msg.institute;
      that.form.professionalClass = res.msg.professionalClass;
      that.studentCardUrl = res.msg.studentCardUrl;
      that.auditStatus = res.msg.auditStatus

      if (that.studentCardUrl != null) {
        that.imageError = false;
      } else {
        that.imageError = true;
      }
      
      if(that.auditStatus==0||that.auditStatus==3){
        that.visible = true
        that.canNotWrite = false;
      }
      else{
        that.visible = false
        that.canNotWrite = true
      }
    });
  },
  methods: {
    validate(source, options){
      console.log(options,source)
      this.formRight[source] = options
    },

    changeUserName() {
      let that = this
      axios({
        url: "/user/username",
        method: "GET",
        params: {
          newname : this.userName
        },
      })
      .then(function (response) {
        let res = response.data
        // console.log(res)
        if(res.code=='2'){
          res.msg="该用户名已存在"
        }
        VantToast({
          message: res.msg,
          icon: res.code==='200' ? "success" : "cross",
        });
        if(res.code=='200'){
          that.$emit("myNewUserName", that.userName);
          that.user.username = that.userName
          that.userName = ''
        }
      });
    },

    changeStudentInfo() {
      this.canNotWrite = false;
    },

    saveStudentInfo() {
      // console.log(this.form)
      let errorMessage = ''
      if((this.form.realName=="" || typeof this.form.realName== typeof null)||
        (this.form.studentCode=="" || typeof this.form.studentCode== typeof null)||
        (this.form.institute=="" || typeof this.form.institute== typeof null)||
        (this.form.professionalClass=="" || typeof this.form.professionalClasss== typeof null)||
        eval(Object.values(this.formRight).join("&&")) == false
      ){
        errorMessage = '请检查实名信息填写的是否正确'
      }

      else if(this.studentCardUrl==""){
        errorMessage = '请上传学生证'
      }

      if(errorMessage!=""){
        VantToast({
          message: errorMessage,
          icon: "cross",
        });
        return
      }

      let that = this
      axios({
        url: "/user/realname/update",
        method: "POST",
        data: {
          studentCardUrl: this.studentCardUrl,
          studentCode: this.form.studentCode,
          realName: this.form.realName,
          institute: this.form.institute,
          professionalClass: this.form.professionalClass,
        },
      })
      .then(function () {
        VantToast({
          message: "上传成功",
          icon: "success",
        });
        that.canNotWrite = true;
        that.visible = false;
        that.auditStatus = 1;
        that.$forceUpdate();
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

    saveNewPic(data, done) {
      let avatarNewPaths = [];
      let promiseArr = [];
      let tempPicName = CONST.guid() + ".jpg";
      
      let p = new Promise((resolve) => {
        let that= this
        axios({
          url: "/cos/credential",
          method: "GET",
          params: {
            type: "avatar",
            fileName: tempPicName,
          },
        })
        .then(function (response) {
          let tempSecret = response.data.msg;
          // console.log(tempSecret)
          // Authorization: q-sign-algorithm=sha1&q-ak=...&q-sign-time=1557989753;1557996953&...&q-signature=...
          // x-cos-security-token: ...
          // /exampleobject?q-sign-algorithm=sha1&q-ak=...&q-sign-time=1557989753%3B1557996953&...&q-signature=...&x-cos-security-token=...

          // console.log(
          //   '?q-sign-algorithm=sha1' /
          //   '&q-ak='+tempSecret.credentials.tmpSecretId+
          //   '&q-sign-time='+tempSecret.startTime+
          //   '&q-signature=...&x-cos-security-token=...')
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

          that.cos.putObject(
            {
              Bucket: "test-1306812178",
              Region: "ap-guangzhou",
              Key: that.$store.state.myUserID + "/" + tempPicName,
              Body: CONST.dataURLtoFile(data),
              onProgress(params){
                that.avatarLoadingProgress = Math.floor(params.percent * 100)
                that.showAvatarLoadingProgress = true
              }
            },
            function (err, data) {
              // console.log(err || data);
              if (err) {
                console.log (err);
                resolve (avatarNewPaths.push({
                  success: false, 
                  msg: '文件上传失败!'
                }));
                return;
              }
              resolve(avatarNewPaths.push({
                success: true, 
                msg: "https://" + data.Location
              }));
            }
          );
        });
      });
      promiseArr.push(p);

      Promise.all(promiseArr).then(() => {
        if(!avatarNewPaths[0].success){
          VantToast({
            message: "头像上传失败",
            icon: "cross",
          });
          done()
        }else{
          let that= this
          axios({
            url: "/user/updateHeader",
            method: "POST",
            data: {
              headerUrl: avatarNewPaths[0].msg,
            },
          })
          .then(function () {
            VantToast({
              message: "更新成功",
              icon: "success",
            });
            that.user.headerUrl = avatarNewPaths[0].msg;
            that.$forceUpdate();
            that.$emit("myNewAvatar", avatarNewPaths[0].msg);
          });
          done()
        }

        this.avatarLoadingProgress = 0
        this.showAvatarLoadingProgress = false
      });
    },


    // 上传学生信息
    submitStudentCardPicture(){
      this.studentCardPictureLoading = true

      let stuCardNewPaths = [];
      let promiseArr = [];
      let p = new Promise((resolve) => {
        let that= this
        axios({
          url: "/cos/credential",
          method: "GET",
          params: {
            type: "picture",
            fileName:
              this.studentCardPicture[0].uid +
              this.studentCardPicture[0].name,
          },
        })
        .then(function (response) {
          let tempSecret = response.data.msg;

          console.log(tempSecret)
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

          that.cos.putObject(
            {
              Bucket: "test-1306812178",
              Region: "ap-guangzhou",
              Key:
                that.$store.state.myUserID +
                "/" +
                that.studentCardPicture[0].uid +
                that.studentCardPicture[0].name,
              Body: that.studentCardPicture[0].originFileObj,
              onProgress(params){
                that.stuCardLoadingProgress = Math.floor(params.percent * 100)
                that.showStuCardLoadingProgress = true
              }
            },
            function (err, data) {
              // console.log(err || data);
              if (err) {
                console.log (err);
                resolve (stuCardNewPaths.push({
                  success: false, 
                  msg: '文件上传失败!'
                }));
                return;
              }
              resolve(stuCardNewPaths.push({
                success: true, 
                msg: "https://" + data.Location
              }));
            }
          );
        });
      });
      promiseArr.push(p);

      Promise.all(promiseArr).then(() => {
        if(!stuCardNewPaths[0].success){
          VantToast({
            message: "文件上传失败",
            icon: "cross",
          });
        }else{
          this.studentCardUrl = stuCardNewPaths[0].msg;
          this.imageError = false;
        }

        this.studentCardPictureLoading = false
        this.showStuCardLoadingProgress = false
        this.previewVisible = false
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

    confirmLoginOut(){
      let that = this
      axios({
        url: "/logout",
        method: "GET",
      })
      .then(function () {
        VantToast({
          message: "退出成功",
          icon: "success",
        });
        that.$store.dispatch("userIDGet", '');
        that.$store.dispatch("auditStatusGet", 0);
        that.$store.dispatch("noticeUnreadCountGet",0);

        localStorage.setItem("ticket", 'tourist');
        that.$router.replace({
          name: "home",
        });
        location.reload();
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