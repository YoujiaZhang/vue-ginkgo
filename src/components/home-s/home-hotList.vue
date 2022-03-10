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
        <span class="hotlist-swipe-item-title">{{ item.post.title }}</span>
        <div class="hotlist-swipe-item-heat">
          <span>{{ item.post.score.toFixed(0) }}</span>
          <a-icon type="fire" theme="twoTone" twoToneColor="#f5222d" />
        </div>
      </van-swipe-item>
    </van-swipe>
  </div>
</template>

<script>
import reqwest from "reqwest";
import CONST from "../../assets/const";

export default {
  data() {
    return {
      data: [],
    };
  },
  created() {
    reqwest({
      url: CONST.URL + "/discuss/index",
      type: "json",
      method: "GET",
      data: { orderMode: 1, current: 1 },
      success: (res) => {
        this.data = res.msg.discussPosts.result;
        this.$emit("hotListLoading");
        this.$forceUpdate();
      },
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