<template>
  <div class="my-home-header">
    <span class="my-home-header-title">
      <a-icon type="shop" theme="filled" />
      <span style="margin-left:10px">解忧杂货铺</span>
    </span>

    <a-button
      v-show="myUserID!=''"
      class="my-home-header-search" type="danger" shape="circle" icon="logout" ghost
      @click="showLoginOut=true"
    />

    <a-button
      class="my-home-header-search" type="primary" shape="circle" icon="search" ghost
      @click="goSearch()"
    />

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
import axios from "../../plugins/Axios"
import { Toast as VantToast } from "vant";
export default {
  data(){
    return {
      showLoginOut: false
    }
  },
  computed: {
    myUserID() {
      return this.$store.state.myUserID
    }
  },
  methods: {
    goSearch() {
      this.$router.push({
        name: "search",
      });
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
.my-home-header {
  padding: 16px;
  background-color: #fff;
}
.my-home-header-root {
  padding: 10px;
  background-color: #fff;
  border-radius: 50px;
}
.my-home-header-title {
  font-size: 20px;
  font-weight: bolder;
  color: #333333;
}
.my-home-header-search {
  float: right;
  margin-right: 10px;
}
</style>