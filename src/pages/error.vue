<template>
  <div class="error-page">
    <van-image
      :src="require('@/assets/images/网络错误'+code+'.png')"
    />
    <div class="error-desc">啊哦~ {{msg}}</div>
    <div class="error-handle">
      <router-link to="/">
        <a-button type="primary" size="large" shape="round">返回首页</a-button>
      </router-link>
      <a-button class="error-btn" type="primary" size="large" shape="round" @click="goBack"
        >返回上一页</a-button
      >
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      code: 404,
      msg: '你所访问的页面走丢了',
    }
  },
  created(){
    this.$store.dispatch("edKeyChange", false);
    if(JSON.stringify(this.$route.params)!='{}'){
      this.code = this.$route.params.code
      this.msg = this.$route.params.msg
    }
  },
  methods: {
    goBack() {
      this.$router.go(-1);
    },
  },
};
</script>


<style scoped>
.error-page {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  width: 100%;
  height: 100%;
  padding-top:130px;
  box-sizing: border-box;
}
.error-code {
  color: #00a854;
}
.error-desc {
  font-size: 20px;
  color: #777;
  padding-top: 30px;
}
.error-handle {
  margin-top: 50px;
}
.error-btn {
  margin-left: 80px;
}
</style>