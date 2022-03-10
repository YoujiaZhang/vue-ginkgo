<template>
  <div class="my-home-header">
    <span class="my-home-header-title">
      <a-icon type="shop" theme="filled" />
      <span style="margin-left:10px">解忧杂货铺</span>
    </span>
    <a-button
      class="my-home-header-search" type="primary" shape="circle" icon="search" ghost
      @click="goSearch()"
    />
  </div>
</template>

<script>

export default {
  methods: {
    goSearch() {
      this.$router.push({
        name: "search",
      });
    },
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