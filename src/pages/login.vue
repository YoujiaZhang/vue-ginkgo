<template>
  <div class="root">
    <div class="logo-root">
      <van-image
        class="logo"
        fit="cover"
        :src="require('@/assets/svgs/MetaCampus.svg')"
      />
      <div class="root-text">Welcome back !</div>
      <div class="root-bar"></div>

      <div class="button">
      <van-grid :column-num="2">
        <van-grid-item @click="wxLogin">
          <a-icon type="wechat"  theme="filled" style="font-size:32px;color:#8cc269"/>
          <span class="button-text" >微信登录</span>
        </van-grid-item>

        <van-grid-item @click="touristLogin">
          <a-icon type="smile" theme="filled" style="font-size:32px;color:#aaa"/>
          <span class="button-text">游客模式</span>
        </van-grid-item>
      </van-grid>
    </div>

    </div>

    
  </div>
</template>

<script>
export default {
  methods: {
    wxLogin() {
      localStorage.setItem("ticket", "wxTempTicket");
      window.location.href = "https://social-api.metacompus.com/wechat/oauth2/login";
    },

    touristLogin() {
      // 作为游客进行访问
      localStorage.setItem("ticket", "tourist");
      this.$router.push({
        name: "home",
      });
    },
  },
};
</script>

<style scoped>
.logo-root {
  position: fixed;
  padding-top: 50%;
  width: 100%;
  text-align: center;
  background-color: #8cc269;
}
.logo {
  width: 35%;
  padding: 4%;
  border-radius: 100%;
  background-color: #fff;
}
.root-text {
  font-size: 35px;
  font-weight: 900;
  color: #fff;
  padding-bottom: 50px;
}
.root-bar{
  height: 50px;
  background-color: #fff;
  border-top-left-radius: 30px;
  border-top-right-radius: 30px;
}
.button {
  position: fixed;
  width: 100%;
  padding-bottom: 40%;
}
.button-text {
  margin-top: 5px;
  color: #333;
}
</style>