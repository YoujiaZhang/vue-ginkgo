<template>
  <div>
    <a-card class="community-norms" :bordered="false">
      <a-card-meta>
        <div class="community-norms-title" slot="title">隐私政策</div>

        <div slot="description">
          <div>
            <p>
              我们根据《中华人民共和国网络安全法》《中华人民共和国个人信息保护法》《中华人民共和国数据安全法》《常见类型移动互联网应用程序必要个人信息范围规定》等法律法规，并参考《信息安全技术个人信息安全规范》（GB/T
              35273-2020）等国家标准，制定集市《个人信息保护指引》（以下简称「本指引」）并致力于保护您的个人信息安全。
            </p>
            <p><br></p>
            <p>
              <strong
                >请您在使用本平台前，仔细阅读并充分理解本指引。重点内容我们已采用粗体标示，希望您特别关注。&nbsp;</strong
              >
            </p>
            <p><br /></p>
            <p>
              如对本指引有任何疑问，您可以通过本指引中「如何联系我们」提供的联系方式与我们联系。我们会不时对指引进行修订。当依照本指引第八节发生实质变更时，我们会在版本更新后以推送通知、弹窗等形式向您展示变更后的内容。
            </p>
          </div>
          <van-collapse v-model="activeNames">
            <van-collapse-item name="1">
              <span class="community-norms-item-title" slot="title">
                我们如何收集和使用您的个人信息
              </span>
            </van-collapse-item>
            <van-collapse-item name="2">
              <span class="community-norms-item-title" slot="title">
                二、法律法规
              </span>
            </van-collapse-item>
            <van-collapse-item name="3">
              <span class="community-norms-item-title" slot="title">
                三、不当行为
              </span>
            </van-collapse-item>
            <van-collapse-item name="4">
              <span class="community-norms-item-title" slot="title">
                四、违规处理
              </span>
            </van-collapse-item>
          </van-collapse>

          <div class="foot">
            <p>
              当用户违反社区规范，平台将对违规内容和用户做相应处理及通知。对处理结果有任何异议，均可通过账号申诉进行反馈。
            </p>
            <p><br /></p>
            <p>
              同时，维护社区环境离不开各位用户的共同努力，我们欢迎用户们对任何可能违规的内容进行一键举报。
            </p>
            <p><br /></p>
            <p>
              平台将根据法律法规和社区管理经验，不断调整和修改社区规范。为维护社区良好氛围，任何有违社区规范或扰乱社区生态秩序的行为，平台有权依据社区规范进行处理。
            </p>
            <div style="text-align: center; margin-top: 25px">
              <span style="color: #888888; font-size: 12px"> - THE END - </span>
            </div>
          </div>
        </div>
      </a-card-meta>
    </a-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      activeNames: ["1", "2", "3", "4"],
    };
  },
};
</script>

<style scoped>
.community-norms {
  width: 100%;
}
.community-norms-title {
  font-size: 18px;
  font-weight: 800;
  padding: 10px;
  text-align: center;
}
.community-norms-item-title {
  font-size: 16px;
  font-weight: 600;
}
.foot {
  margin-left: 15px;
  margin-right: 15px;
  margin-bottom: 150px;
  margin-top: 20px;
  color: #666;
}
</style>