<template>
  <div>
    <a-anchor>
      <div class="title">实名列表</div>
    </a-anchor>

    <v-touch
      v-on:swipeleft="swiperleft"
      v-on:swiperight="swiperright"
      class="v-touch"
    >
      <a-tabs
        class="card-container"
        type="line"
        :activeKey="tabActiveKey[tabIndex]"
        :tabBarGutter="10"
        size="large"
        tabPosition="top"
        @change="tabsChange"
      >
        <!-- ******************* 全部 ******************* -->
        <a-tab-pane key="1" :forceRender="true">
          <div slot="tab">未上传</div>
          <audit-not-uploaded ref="notUploaded"></audit-not-uploaded>
        </a-tab-pane>
        <!-- ************************************************************** -->

        <!-- ************************ 未审核 ****************************** -->
        <a-tab-pane key="2" :forceRender="true">
          <div slot="tab">未审核</div>
          <audit-not-approved ref="notApproved"></audit-not-approved>
        </a-tab-pane>
        <!-- ************************************************************** -->

        <!-- ************************ 审核通过 ****************************** -->
        <a-tab-pane key="3" :forceRender="true">
          <div slot="tab">审核通过</div>
          <audit-approved ref="approved"></audit-approved>
        </a-tab-pane>
        <!-- ************************************************************** -->

        <!-- ************************* 审核驳回 ******************************** -->
        <a-tab-pane key="4" :forceRender="true">
          <div slot="tab">审核驳回</div>
          <audit-reject ref="reject"></audit-reject>
        </a-tab-pane>
        <!-- ************************************************************** -->
      </a-tabs>
    </v-touch>
  </div>
</template>

<script>
import auditNotUploaded from "../components/audit-s/audit-not-uploaded.vue";
import auditNotApproved from "../components/audit-s/audit-not-approved.vue";
import auditApproved from "../components/audit-s/audit-approved.vue";
import auditReject from "../components/audit-s/audit-reject.vue";

export default {
  components: { auditNotUploaded, auditNotApproved, auditApproved, auditReject },
  data() {
    return {
      current: 1,
      auditStatus: 0,

      tabActiveKey: ["1", "2", "3", "4"],
      tabIndex: 0,
    };
  },
  methods: {
    swiperright: function () {
      // console.log("左划");
      if (this.tabIndex == 0) {
        return;
      }
      this.tabIndex = Math.max(0, this.tabIndex - 1);
    },
    swiperleft: function () {
      // console.log("右滑");
      if (this.tabIndex == 3) {
        return;
      }
      this.tabIndex = Math.min(3, this.tabIndex + 1);
    },
    tabsChange(key) {
      if (key === "1") {
        this.tabIndex = 0;
        this.$refs.notUploaded.refresh()
      }
      if (key === "2") {
        this.tabIndex = 1;
        this.$refs.notApproved.refresh()
      }
      if (key === "3") {
        this.tabIndex = 2;
        this.$refs.approved.refresh()
      }
      if (key === "4") {
        this.tabIndex = 3;
        this.$refs.reject.refresh()
      }
    },
  },
};
</script>

<style scoped>
.title {
  padding-top: 10px;
  padding-bottom: 5px;
  font-size: 20px;
  font-weight: 700;
  text-align: center;
  color: #333;
  background-color: rgba(255, 255, 255, 1);
}
.card-container {
  width: 100%;
  height: 70%;
  padding-right: 10px;
  padding-left: 10px;
  /* display:none; */
}
.v-touch {
  touch-action: pan-y !important;
}
</style>