<template>
  <div>
    <!-- 回到顶部 -->
    <a-back-top style="width: 100%; right: 0" :visibilityHeight="400">
      <div>
        <a-button class="backtop-button" shape="circle">
          <a-icon class="backtop-button-icon" type="rocket" />
        </a-button>
      </div>
    </a-back-top>

    <div
      v-infinite-scroll="loadMoreAudit"
      :infinite-scroll-disabled="busy"
      :infinite-scroll-distance="10"
    >
      <a-list :data-source="auditList" :locale="auditListEmpty">
        <a-list-item class="list-item" slot="renderItem" slot-scope="item" key="item.id">
          <audit-approved-item :user="item" @refresh="refresh"/>
        </a-list-item>

        <a-list-item slot="footer" v-show="auditList.length!=0">
          <div style="margin-top:15px; margin-bottom:150px; width:100%; text-align: center;">
            <span v-show="!loading" style="color:#888888;font-size: 12px"> - THE END - </span>
            <a-spin v-show="loading" tip="加载中..."></a-spin>
            <div v-show="auditList.length==1" style="height:400px;"></div>
          </div>
        </a-list-item>

      </a-list>
    </div>

  </div>
</template>

<script>
import auditApprovedItem from "./audit-approved-item.vue"
import auditListEmpty from "../empty-s/empty-list-state.vue";
import infiniteScroll from "vue-infinite-scroll";

import axios from "../../plugins/Axios";

export default {
  directives: { infiniteScroll },
  components: { auditApprovedItem },
  data() {
    return {
      loading: false,
      busy: false,

      /* 实名消息 */
      auditList: [],   // 实名消息
      studentCard: [], // 所有学生证 
      numAuditList: 0, // 消息数量
      current: 1,      // 当前页
      auditStatus: 2,
      auditListEmpty: {
        emptyText: <auditListEmpty text="暂无消息" />,
      },
    };
  },
  beforeMount() {
    window.scrollTo(0, window.scrollTo(0, document.body.scrollHeight));

    this.fetchAuditData((res) => {
        console.log(res)
      if (res.msg.result.length != 0) {
        this.current += 1;
      }
      this.auditList = res.msg.result;
      this.numAuditList = res.msg.rows;
    });
  },
  methods: {
    fetchAuditData(callback) {
      axios({
        url: "/admin/user/detailed",
        method: "get",
        params: {
          current: this.current,
          auditStatus: this.auditStatus,
        },
      }).then(function (response) {
        callback(response.data);
      });
    },

    loadMoreAudit() {
      if (this.loading == true) {
        return;
      }

      const auditList = this.auditList;
      this.loading = true;

      if (auditList.length >= this.numAuditList) {
        this.busy = true;
        this.loading = false;
        return;
      }

      this.fetchAuditData((res) => {
        if (res.msg.result.length != 0 && this.loading) {
          this.current += 1;
        }
        this.auditList = auditList.concat(res.msg.result);
        this.loading = false;
      });
    },

    refresh() {
      this.current = 1;
      this.auditList = []
      this.fetchAuditData((res) => {
        if (res.msg.result.length != 0) {
          this.current += 1;
        }
        this.auditList = res.msg.result;
        this.numAuditList = res.msg.rows;
        this.$forceUpdate();
      });
    },
  },
};
</script>

<style scopde>
.list-item {
  margin-left: 5px;
  margin-right: 5px;
  margin-bottom: 10px;
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