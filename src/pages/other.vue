<template>
  <div class="root">
    <a-spin tip="加载中 ···" :spinning="otherLoading">
      <a-anchor>
        <other-header :userID="message.userID" @loadingFinish="otherHeader=true"></other-header>
      </a-anchor>
      <other-content :userID="message.userID" @loadingFinish="otherContent=true"></other-content>
    </a-spin>
  </div>
</template>

<script>
import otherHeader from "../components/other-s/other-header.vue";
import otherContent from "../components/other-s/other-content.vue";

export default {
  components: {
    otherHeader,
    otherContent,
  },
  data() {
    return {
      message: {},
      otherContent: false,
      otherHeader: false,
    };
  },
  computed:{
    otherLoading: function () {
      return !(this.otherContent && this.otherHeader)
    }
  },

  created() {
    this.$store.dispatch("edKeyChange", true);
    
    this.message = this.$route.params;
    if(JSON.stringify(this.$route.params) != "{}"){
      history.replaceState(null, null, 
        window.location.href +'?' + 
        this.$route.params.userID
      )
    }else{
      this.message = {
        userID: window.location.href.split('?')[1],
      }
    }
  },
};
</script>

<style scoped>
.root {
  width: 100%;
}
.user-info-root {
  bottom: 0;
  z-index: -1;
  height: 71%;
  width: 100%;
  position: fixed;
  padding-bottom: 10px;
  background-color: #f5f5f5;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
}
</style>