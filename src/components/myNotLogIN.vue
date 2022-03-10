<template>
  <!-- 还没登录的时候呈现的界面 -->
  <div>
    <div class="npc"></div>
    <div class="input-root-zero">
      <div class="npc2">Welcome back !</div>

      <div class="input-root">
        <a-input
          class="user-name"
          v-model="loginData.email"
          placeholder="用户名"
        >
          <a-icon
            slot="prefix"
            type="user"
            style="color: rgba(0, 0, 0, 0.25)"
          />
        </a-input>

        <a-input-password
          class="user-password"
          v-model="loginData.password"
          type="password"
          placeholder="密码"
        >
          <a-icon
            slot="prefix"
            type="lock"
            style="color: rgba(0, 0, 0, 0.25)"
          />
        </a-input-password>

        <div>
          <span class="forget-password"
            >忘记密码 <a-icon type="question-circle"
          /></span>
        </div>

        <a-button
          class="log-in"
          type="primary"
          shape="round"
          @click="submit"
          :disabled="loginData.user === '' || loginData.password === ''"
        >
          登 录
        </a-button>

        <a-button
          class="log-in"
          type="primary"
          shape="round"
          href="http://159.75.254.198:8080/wechat/oauth2/login"
          icon="wechat"
          ghost
        >
          微信登录
        </a-button>
      </div>
    </div>

  </div>
</template>

<script>
import reqwest from "reqwest";
import CONST from "../assets/const";

export default {
  data() {
    return {
      loginData: {
        email: "123@qq.com",
        password: "123",
        code: "aaa",
        rememberMe: false,
        captchaToken: "123456",
      },
      loginDataURL:"?email=123@qq.com&password=123&code=aaa&rememberMe&captchaToken"
    };
  },
  beforeCreate() {
    this.$store.dispatch("edKeyChange", true);
  },
  methods: {
    submit() {
      reqwest({
        url: CONST.URL + "/login" + this.loginDataURL,
        type: "json",
        method: "POST",
        // contentType: "application/json;charset=utf-8",
        // data: this.loginData,
        success: (res) => {

          this.$store.dispatch("ticketGet", res.msg);
          // localStorage.setItem("ticket", res.msg);

          reqwest({
            url: CONST.URL + "/user/get",
            type: "json",
            method: "GET",
            // headers: {
            //   ticket: 'this.$store.state.myTicket',
            // },
            success: (res) => {
              console.log('登录情况',res)
              if (res.state === "success" && res.code === "200") {
                this.$store.dispatch("userIDGet", res.msg.user.id);
                this.$store.dispatch("userTypeGet", res.msg.user.type);
              }
              this.$router.go(-1);
            },
          });
        },
      });
    },
  },
};
</script>

<style scoped>
.npc {
  width: 100%;
  height: 250px;
  position: relative;
  top: 0;
  z-index: -10000;
  background-color: #8cc269;
}
.npc2 {
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