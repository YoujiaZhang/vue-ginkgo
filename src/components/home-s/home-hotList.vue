<template>
  <div class="hotlist" @click="goHotList">
    <a-icon class="hotlist-icon" type="sound" theme="twoTone" two-tone-color="#CD853F"/>
    <!-- 轮播图 -->
    <van-swipe
      class="hotlist-swipe"
      :autoplay="3000"
      :show-indicators="false"
      vertical
    >
      <van-swipe-item  class="hotlist-swipe-item" v-for="(item, index) in data" :key="index">
        <span class="hotlist-swipe-item-title" v-html="item.post.title"></span>
        <div class="hotlist-swipe-item-heat">
          <span>{{ item.post.score.toFixed(0) }}</span>
          <a-icon type="fire" theme="twoTone" twoToneColor="#f5222d" />
        </div>
      </van-swipe-item>
    </van-swipe>
  </div>
</template>

<script>
import axios from "../../plugins/Axios"

export default {
  data() {
    return {
      data: [],
    };
  },
  created() {
    let that = this
    axios({
      url: "/discuss/index",
      method: "GET",
      params: { orderMode: 1, current: 1 },
    })
    .then(function (response) {
      that.data = response.data.msg.discussPosts.result;
      that.$emit("hotListLoading");
      that.$forceUpdate();
    });
  },
  methods: {
    goHotList() {
      this.$router.push({
        name: "hotList",
      });
    },
  },
};
</script>

<style scoped>
.hotlist {
  padding-top: 10px;
  padding-bottom: 10px;
  border-radius: 0 0 5px 5px;
  border-top: 1px solid #eeeeee;
  border-bottom: 1px solid #eeeeee;
  background-color: #fff;
}
.hotlist-icon {
  margin-left: 10px;
  font-size: 20px;
}
.hotlist-swipe {
  width: 90%;
  height: 22.5px;
  float: right;
  /* background-color: aqua; */
}
.hotlist-swipe-item-title {
  font-weight: bold;
  font-size: 15px;
}
.hotlist-swipe-item-heat {
  float: right;
  font-size: 15px;
  margin-right: 5%;
}
</style>