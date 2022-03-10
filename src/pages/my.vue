<template>
  <div class="root">
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
import myHeader from "../components/my-s/my-header.vue";
import myContent from "../components/my-s/my-content.vue";

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