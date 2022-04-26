<template>
  <div>
    <a-divider class="line" orientation="left"> 
      基本资料
      <my-icon type="icon-jibenziliao" />
    </a-divider>

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
      class="input" addonBefore="用户名" :placeholder="user.username"
      v-model="userName"
      @search="changeUserName"
      >
      <a-button slot="enterButton" > 修改 </a-button>
    </a-input-search>

    <a-divider class="line" orientation="left"> 
      实名认证 
      <my-icon type="icon-shimingxinxishenhe" />
      <a-tag style="margin-left:10px" v-if="auditStatus===3" color="red">审核驳回</a-tag>
      <a-tag style="margin-left:10px" v-if="auditStatus===2" color="green">审核通过</a-tag>
      <a-tag style="margin-left:10px" v-if="auditStatus===1" color="blue">审核中</a-tag>
    </a-divider>
    
    <a-form-model ref="ruleForm" :model="form" :rules="rules" @validate='validate'>
      <a-form-model-item ref="realName" prop="realName">
        <a-input
          v-model="form.realName"
          addonBefore="姓名"
          :placeholder="oldForm.realName"
          :disabled="canNotWrite"
          @blur="() => { $refs.realName.onFieldBlur();}"
        >
        </a-input>
      </a-form-model-item>

      <a-form-model-item ref="studentCode" prop="studentCode">
        <a-input
          v-model="form.studentCode"
          addonBefore="学号"
          :placeholder="oldForm.studentCode"
          :disabled="canNotWrite"
          @blur="() => { $refs.studentCode.onFieldBlur();}"
        >
        </a-input>
      </a-form-model-item>

      <a-form-model-item ref="institute" prop="institute">
        <a-input
          v-model="form.institute"
          addonBefore="学院"
          :placeholder="oldForm.institute"
          :disabled="canNotWrite"
          @blur="() => { $refs.institute.onFieldBlur();}"
        >
        </a-input>
      </a-form-model-item>

      <a-form-model-item ref="professionalClass" prop="professionalClass">
        <a-input
          v-model="form.professionalClass"
          addonBefore="班级"
          :placeholder="oldForm.professionalClass"
          :disabled="canNotWrite"
          @blur="() => { $refs.professionalClass.onFieldBlur();}"
        >
        </a-input>
      </a-form-model-item>
    </a-form-model>

    <!-- 学生证 -->
    <div style="text-align: center; margin-bottom: 10px" @click="uploadStuCardClick">
      <van-image
        height="250" style="border: 1px solid #d9d9d9" fit="contain" :show-error="false"
        :src="studentCardUrl"
        @error="imageLoadError"
        v-show="stdCardExist"
      />
      <van-image
        height="250" style="border: 1px solid #d9d9d9"
        :src="require('../../../assets/images/realName.png')"
        v-show="!stdCardExist"
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
      <img alt="example" style="width: 100%" :src="previewStuCard" />
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
      v-show="showRealNameUploadButton"
    >
      提交
    </a-button>

    <a-button style="margin-top:30px" block @click="showChangeAccount=true">
      切换账号
    </a-button>

    <van-dialog
      v-model="showChangeAccount"
      :showCancelButton="true"
      :showConfirmButton="false"
    >
      <div slot="title">
        <span style="margin-right: 5px; font-weight: 600">轻触头像以切换账号</span>
        <a-icon type="info-circle" theme="twoTone" two-tone-color="#FFA500" />
      </div>

      <van-grid style="margin-top:15px" :column-num="Math.min(Object.keys(historyUser).length,2)">
        <van-grid-item v-for="(oneUser, index) in Object.keys(historyUser)" :key="index">
          <a-avatar
            style="border: 1px solid #eee" :size="50"
            :src="historyUserAvatar[oneUser]"
            @click="changeUser(oneUser)"
          />
          <span style="color:#333;font-weight: 500;">{{historyUserName[oneUser]}}</span>
          <span v-show="oneUser==user.id" style="font-size:12px">
            <a-badge status="success"/>当前使用
          </span>
          <span v-show="oneUser!=user.id" style="font-size:12px">
            <a-badge color="#f"/>
          </span>
        </van-grid-item>
      </van-grid>

    </van-dialog>

    <a-button style="margin-top:15px"  type="danger" ghost block @click="showLoginOut=true">
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
  props: [
    "user"
  ],
  components: { uploadPicture },
  data() {
    return {
      /* 修改用户信息 */
      userName: "",                     // 新用户名
      avatarPicture: [],                // 新头像
      avatarLoadingProgress: 0,         // 上传进度
      showAvatarLoadingProgress: false, // 是否显示进度条

      /* 实名信息 */
      studentCardUrl:"",              // 学生证照片地址
      studentCardLocation: "",        // 学生证所存储的位置
      stdCardExist: true,             // 学生证照片是否存在
      showRealNameUploadButton: true, // 上传按钮 是否展示
      auditStatus: 0,                 // 提交信息的状态 审核中 审核通过 审核驳回
      canNotWrite: false,             // 表单是否可以编辑
      
      oldForm: {
        // 已经提交过得表单信息
        realName: "",
        studentCode: "",
        institute: "",
        professionalClass: "",
      },
      
      form: {
        // 当前写的表单
        realName: "",
        studentCode: "",
        institute: "",
        professionalClass: "",
      },
      
      // 表单填写规则
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

      // 表单填写是否正确合理
      formRight: {
        'realName':false,
        'studentCode':false,
        'institute':false,
        'professionalClass':false,
      },
      
      /* 预览&上传 学生证 */
      previewVisible: false,             // 预览图片组件是否展示
      previewStuCard: '',                // 预览的图片
      studentCardPicture: [],            // 存储学生证照片信息的数组
      studentCardPictureLoading: false,  // 学生证上传《确定》按钮的加载状态
      stuCardLoadingProgress: 0,         // 上传进度
      showStuCardLoadingProgress: false, // 是否显示进度条

      /* 切换账号 */
      showChangeAccount: false,
      historyUser: {},
      historyUserAvatar: {},
      historyUserName: {},
      
      /* 退出账号 */
      showLoginOut: false,  
    };
  },
  created() {
    let that = this
    axios({
      url: "/user/realname/get",
      method: "GET",
    })
    .then(function (response) {
      let res = response.data

      that.oldForm.realName = res.msg.realName;
      that.oldForm.studentCode = res.msg.studentCode;
      that.oldForm.institute = res.msg.institute;
      that.oldForm.professionalClass = res.msg.professionalClass;
      that.studentCardUrl = res.msg.studentCardUrl;
      that.auditStatus = res.msg.auditStatus

      // 判断学生证图片是否存在
      if (that.studentCardUrl != null) {
        that.stdCardExist = false;
      } else {
        that.stdCardExist = true;
      }

      // 如果是《未上传》||《审核驳回》 可以再次编辑表单内容上传
      if(that.auditStatus==0||that.auditStatus==3){
        that.showRealNameUploadButton = true
        that.canNotWrite = false;
      }
      // 否则就无法编辑已经上传的内容
      else{
        that.showRealNameUploadButton = false
        that.canNotWrite = true
      }
      that.getStuCard()
    });

    // 获取历史登录过得账号
    this.historyUser = JSON.parse(localStorage.getItem("historyUser")) || {};
    for(let id in this.historyUser){
      let that = this
      axios({
        url: "/user/" + id,
        method: "GET",
      })
      .then(function (response) {
        that.historyUserAvatar[id] = response.data.msg.user.headerUrl
        that.historyUserName[id] = response.data.msg.user.username
      });
    }
  },

  methods: {
    validate(source, options){
      this.formRight[source] = options
    },

    changeUser(userID){
      if(userID==this.user.id) return
      localStorage.setItem("ticket", this.historyUser[userID]);
      let that = this
      axios({
        url: "/user/get",
        method: 'get', 
      })
      .then(function (response) {
        if (String(response.data.code) == "200") {
          VantToast({
            message: '切换成功',
            icon: 'success',
          });
          that.$router.push({
            name: 'home',
          });
        }else if(String(response.data.code) == "403") {
          VantToast({
            message: '账号已过期需重新登录',
            icon: 'cross',
          });
          that.$router.push({
            name: 'home',
          });
        }
      })
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

    // 保存学生证信息
    saveStudentInfo() {
      let errorMessage = ''
      if((this.form.realName=="" || typeof this.form.realName== typeof null)||
        (this.form.studentCode=="" || typeof this.form.studentCode== typeof null)||
        (this.form.institute=="" || typeof this.form.institute== typeof null)||
        (this.form.professionalClass=="" || typeof this.form.professionalClasss== typeof null)||
        eval(Object.values(this.formRight).join("&&")) == false
      ){
        errorMessage = '请检查实名信息填写的是否正确'
      }

      else if(this.studentCardLocation==""){
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
          studentCardUrl: this.studentCardLocation,
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
        that.showRealNameUploadButton = false;
        that.auditStatus = 1;
        that.$forceUpdate();
      });
    },

    imageLoadError() {
      this.stdCardExist = true;
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

          that.cos.putObject(
            {
              Bucket: bucket,
              Region: region,
              Key: that.$store.state.myUserID + "/" + tempPicName,
              Body: CONST.dataURLtoFile(data),
              onProgress(params){
                that.avatarLoadingProgress = Math.floor(params.percent * 100)
                that.showAvatarLoadingProgress = true
              }
            },
            function (err, data) {
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

    getStuCard(){
      let that = this
      axios({
        url: "/cos/credential",
        method: "GET",
        params: {
          type: "studentCard",
          fileName: that.studentCardUrl.split("/")[1]
        },
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

        that.cos.getObjectUrl(
          {
            Bucket: bucket,
            Region: region,
            Key: that.studentCardUrl
          },
          function (err, data) {
            that.studentCardUrl = data.Url
            that.stdCardExist = true
            that.$forceUpdate();
          }
        );
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
            type: "studentCard",
            fileName:
              this.studentCardPicture[0].uid +
              this.studentCardPicture[0].name,
          },
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

          that.cos.putObject(
            {
              Bucket: bucket,
              Region: region,
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
              console.log(err || data);
              if (err) {
                console.log (err);
                resolve (stuCardNewPaths.push({
                  success: false, 
                  msg: '文件上传失败!'
                }));
                return;
              }

              that.cos.getObjectUrl({
                Bucket: bucket,
                Region: region,  
                Key: that.$store.state.myUserID +
                    "/" +
                    that.studentCardPicture[0].uid +
                    that.studentCardPicture[0].name,
              }, function (err, data) {
                  console.log(err || data.Url);
                  resolve(stuCardNewPaths.push({
                    success: true, 
                    url: data.Url,
                    msg: that.$store.state.myUserID + "/" +
                         that.studentCardPicture[0].uid +
                         that.studentCardPicture[0].name,
                  }));
              });
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
          this.studentCardLocation = stuCardNewPaths[0].msg;
          this.studentCardUrl = stuCardNewPaths[0].url;
          this.stdCardExist = true;
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
          this.previewStuCard = res
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