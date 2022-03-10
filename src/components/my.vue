<template>
  <div class="root">
    <!-- <div class="user-info-root"></div> -->

    <a-spin tip="加载中 ···" :spinning="myLoading">
      <a-anchor>
        <my-header
          :showRealNameConfirm="showRealNameConfirm"
          @myHeaderLoadingFinish="myHeader=true"
        ></my-header>
      </a-anchor>
      <my-content></my-content>
    </a-spin>
  </div>
</template>

<script>
import myHeader from "./my-s/my-header.vue";
import myContent from "./my-s/my-content.vue";

export default {
  components: { myHeader, myContent },
  data() {
    return {
      user: {},
      showRealNameConfirm: false,
      myContent: false,
      myHeader: false,
    };
  },
  computed:{
    myLoading: function () {
      return !(this.myHeader)
    }
  },
  beforeCreate() {
    if (this.$store.state.myTicket === "") {
      this.$router.push({
        name: "myNotLogIN",
      });
    }
  },
  created(){
    this.$store.dispatch("edKeyChange", true);
    if('showRealNameConfirm' in this.$route.params){
      this.showRealNameConfirm = this.$route.params.showRealNameConfirm
    }
  },
  methods: {
  },
};
</script>

<style scoped>
.root {
  width: 100%;
  /* position: relative;
  width: 100%;
  height: 300px;
  background-image: url("../assets/images/bgcolor.png");
  background-size: cover; */
}
.user-info-root {
  bottom: 0;
  z-index: -1;
  height: 71%;
  width: 100%;
  position: fixed;
  padding-bottom: 10px;
  background-color: #f5f5f5;
  /* background-color: burlywood; */
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
}
</style>