<template>
  <div class="empty-wrap">
    <img
      class="empty-image"
      :src="imgStr"
      alt=""
    />
    <div>{{ text }}</div>
  </div>
</template>

<script>
export default {
  props: {
    text: {
      type: String,
      default: "空空如也",
    },
    imgStr:{
      default: require('@/assets/images/empty-image-default.png')
    }
  },
};
</script>

<style scoped>
.empty-wrap{
  height: 500px;
}
.empty-image {
  width: 30%;
}
</style>