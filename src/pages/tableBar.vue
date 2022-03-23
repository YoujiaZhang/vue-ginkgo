<template>
  <div>
    <div>
      <router-view></router-view>
    </div>

    <div>
      <van-tabbar v-if="showBar" v-model="active" route>
        <van-tabbar-item name="home" to="/home">
          <van-icon class="tabbar-icon" name="home-o" />
        </van-tabbar-item>

        <van-tabbar-item name="message" to="/message">
          <a-badge :count="messageUnreadNum" :overflow-count="100" :numberStyle="numStyle">
            <van-icon class="tabbar-icon" name="comment-o" />
          </a-badge>
        </van-tabbar-item>

        <van-tabbar-item name="my" to="/my">
          <van-icon class="tabbar-icon" name="friends-o" />
        </van-tabbar-item>

        <van-tabbar-item v-show="userType==1" name="audit" to="/audit">
          <van-icon class="tabbar-icon" name="records" />
          <!-- <van-icon name="records" /> -->
        </van-tabbar-item>
      </van-tabbar>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      active: "home",
      numStyle:{
        fontSize:"10px",
        backgroundColor: '#ff6a4c'
      },
    };
  },
  computed:{
    showBar() {
      return this.$store.state.editorKey
    },
    messageUnreadNum() {
      return this.$store.state.noticeUnreadCount
    },
    userType() {
      return this.$store.state.myUserType
    }
  },
};
</script>

<style scoped>
.tabbar-icon {
  height: 30px;
  font-size: 22px;
}
</style>
