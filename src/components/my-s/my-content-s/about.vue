<template>
  <div>
    <!-- 回到顶部 -->
    <a-back-top style="height: 0; width: 100%; right: 0" :visibilityHeight="70">
      <div>
        <a-button class="backtop-button" shape="circle">
          <a-icon class="backtop-button-icon" type="rocket" />
        </a-button>
      </div>
    </a-back-top>

    <a-card class="about" :bordered="false">
      <a-card-meta>
        <div class="about-title" slot="title">
          关于 <my-icon type="icon-guanyu" />
        </div>
        <div slot="description">
        
        <div style="text-align: center;">
          <van-image
            class="logo"
            fit="cover"
            :src="require('@/assets/svgs/MetaCampus.svg')"
          />
          <div>v.1.0</div>
        </div>
          <van-cell title="社区规范" size="large" is-link />
          <van-cell title="用户协议" size="large" is-link />
          <van-cell title="隐私政策" size="large" is-link />
          <van-cell title="关于我们" size="large" is-link />
        </div>
      </a-card-meta>
    </a-card>
  </div>
</template>

<script>
export default {};
</script>

<style scoped>
post-list-item {
  width: 100%;
}
.about {
  width: 100%;
}
.about-title {
  font-size: 16px;
  text-align: center;
}
.logo {
  width: 25%;
  margin-top: 10px;
  border-radius: 100%;
}
.backtop-button {
  float: right;
  bottom: 130px;
  right: 5%;
  width: 50px;
  height: 50px;
  background-color: rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(1px);
}
.backtop-button:hover {
  color: rgba(0, 0, 0, 0.1);
  border: 0px solid rgba(0, 0, 0, 0.1);
}

.backtop-button:active {
  border: 0px solid rgba(0, 0, 0, 0.1);
}
.backtop-button-icon {
  font-size: 20px;
}
</style>