<template>
  <div>
    <other-posts-list :userID='userID' @loadingFinish=loadingFinish></other-posts-list>
  </div>
</template>

<script>
import otherPostsList from "./other-content-s/other-posts-list.vue";
export default {
  props:['userID'],
  components: { 
    otherPostsList, 
  },
  data() {
    return {};
  },
  methods: {
    loadingFinish(data){
      this.$emit("loadingFinish", data);
    }
  },
  created() {
    window.scrollTo(0, 0);
  },
};
</script>

<style scoped>
.card-container {
  width: 100%;
  height: 70%;
  padding-right: 10px;
  padding-left: 10px;
}
.test {
  position: fixed;
  right: 0;
  width: 80%;
  bottom: 0;
  height: 70%;
  padding-right: 10px;
  padding-left: 10px;
}
.item-summary {
  width: 100%;
  height: 100%;
  padding-left: 0px;
  margin-top: 0px;
  margin-bottom: 0px;
}
</style>