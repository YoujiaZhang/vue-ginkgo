<template>
  <!-- 还没登录的时候呈现的界面 -->
  <div>
    <div class="root"></div>
    <div class="input-root-zero">
      <div class="root-text">Welcome back !</div>

      <div class="input-root">
        <div>
          <a-input
            class="user-name" placeholder="用户名"
            v-model="loginData.email"
            @focus="inputFocus"
            @blur="inputBlur"
          ><a-icon slot="prefix" type="user" style="color: rgba(0, 0, 0, 0.25)"/>
          </a-input>

          <a-input-password
            class="user-password" type="password" placeholder="密码"
            v-model="loginData.password"
            @focus="inputFocus"
            @blur="inputBlur"
          ><a-icon slot="prefix" type="lock" style="color: rgba(0, 0, 0, 0.25)"/>
          </a-input-password>

          <div>
            <span class="forget-password">忘记密码 <a-icon type="question-circle"/></span>
          </div>

          <a-button 
            class="log-in" type="primary" shape="round" @click="submit"
            :disabled="loginData.email === '' || loginData.password === ''"
          >登 录
          </a-button>
        </div>

        <a-button
          class="log-in" type="primary" shape="round" icon="wechat" ghost
          @click="wxLogin"
        >
          微信登录
        </a-button>

        <a-button
          class="log-in" shape="round" icon="smile"
          @click="touristLogin"
        >
          游客模式
        </a-button>

      </div>
    </div>
  </div>
</template>

<script>
import axios from "../plugins/Axios"
import { Toast as VantToast } from "vant";

export default {
  data() {
    return {
      loginData: {
        email: "admin@qq.com",
        password: "123",
        code: "aaa",
        rememberMe: false,
        captchaToken: "123456",
      },
    };
  },
  created() {
    this.$store.dispatch("edKeyChange", true);
  },
  methods: {
    submit() {
      let that = this
      axios({ 
        url:  "/login",
        method: "POST",
        data: this.loginData
      })
      .then(function (response) {
        switch(response.data.code)
        {
          case '200':
          VantToast({
            message: '登录成功',
            icon: "success",
          });
          // http://119.91.149.96:8080/?ticket=eyJhbGciOiJIUzUxMiJ9.eyJleHAiOjE2NDc3MjA5NDMsInN1YiI6IjExMyIsImNyZWF0ZWQiOjE2NDc2Nzc3NDM4NzF9.mpvHE81hnfZeNGUk0PaI7pMNxTkuceTX2o26Sp1CjcjpfH7ciXu6XJPJpvklJHmu1TbSsfzNrHKTWuMHZky6qg
          // response.data.msg = 'eyJhbGciOiJIUzUxMiJ9.eyJleHAiOjE2NDc3MjA5NDMsInN1YiI6IjExMyIsImNyZWF0ZWQiOjE2NDc2Nzc3NDM4NzF9.mpvHE81hnfZeNGUk0PaI7pMNxTkuceTX2o26Sp1CjcjpfH7ciXu6XJPJpvklJHmu1TbSsfzNrHKTWuMHZky6qg'
          localStorage.setItem("ticket", response.data.msg);
          that.$router.push({
            name: 'to' in that.$route.params ? that.$route.params.to : 'home'
          });
          break;

          case '2':
          VantToast({
            message: "用户名或密码错误",
            icon: "cross",
          });
          break;
        }
      })
    },
    
    wxLogin(){
      localStorage.setItem("ticket", 'wxTempTicket');
      window.location.href = 'http://159.75.254.198:80/wechat/oauth2/login'
    },

    touristLogin(){
      // 作为游客进行访问
      localStorage.setItem("ticket", 'tourist');
      this.$router.push({
        name: 'home',
      });
    },

    inputFocus(){
      this.$store.dispatch("edKeyChange", false);
    },

    inputBlur(){
      this.$store.dispatch("edKeyChange", true);
    }
  },
};
</script>

<style scoped>
.root {
  width: 100%;
  height: 250px;
  position: relative;
  top: 0;
  z-index: -10000;
  background-color: #8cc269;
}
.root-text {
  font-size: 30px;
  font-weight: 900;
  margin-left: 5%;
  color: white;
}
.input-root-zero {
  margin-top: -100px;
  background-color: rgba(0, 0, 0, 0);
}
.input-root {
  margin-right: 5%;
  margin-left: 5%;

  padding: 15px;
  border-radius: 15px;
  background-color: #f8f8f8;
  box-shadow: 5px 5px 10px rgba(0, 0, 0, 0.2);
}
.user-name {
  margin-top: 10px;
  margin-bottom: 20px;
}
.user-password {
  margin-bottom: 10px;
}
.log-in {
  width: 100%;
  margin-top: 10px;
}
.forget-password {
  color: #888888;
  margin-top: 5px;
  margin-bottom: 20px;
  float: right;
}
</style>