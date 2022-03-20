<template>
  <div>
    <a-spin tip="加载中 ···" :spinning="homeLoading">
      <!-- 固定在顶部 -->
      <a-anchor>
        <home-header/>
        <home-hotList @hotListLoading="hotListLoading=true"/>
      </a-anchor>
      
      <pull-refresh @refresh=pullRefresh>
        <div
          style="width: 100%;"
          v-infinite-scroll="loadMorePost"
          :infinite-scroll-disabled="busy"
          :infinite-scroll-distance="5"
        >
          <a-list :data-source="post" :locale="postEmtpy">
            <a-list-item slot="renderItem" slot-scope="msg">
              <home-post-item
                class="post-item-summary"
                :userID="msg.user.id"
                :postID="msg.post.id"

                :postTitle="msg.post.title"
                :postContent="msg.post.content"
                :postPictures="msg.post.picUrls"
                :postReleaseTime="CONST.getDiffTime(msg.post.createTime)"

                :postComments="msg.post.commentCount"
                :postViews="msg.post.viewCount"
                :postLikes="msg.post.likeCount"
                :postLikeStatus="msg.likeStatus"

                :authorName="msg.user.username"
                :authorLevel="msg.user.level"
                :authorAvatar="msg.user.headerUrl"
              />
            </a-list-item>

            <a-list-item slot="footer">
              <div style="margin-top:15px; margin-bottom:150px; width:100%; text-align: center;">
                <span v-show="!loading" style="color:#888888;font-size: 12px"> - THE END - </span>
                <a-spin v-show="loading" tip="加载中..."></a-spin>
              </div>
            </a-list-item>

          </a-list>
        </div>
      </pull-refresh>

      <!-- 返回顶部按钮 -->
      <a-back-top style="height:0; width: 100%; right: 0" :visibilityHeight="400">
        <div>
          <a-button class="backtop-button" shape="circle">
            <a-icon class="backtop-button-icon" type="rocket" />
          </a-button>
        </div>
      </a-back-top>

      <!-- 发布帖子按钮 -->
      <div class="editor-button-root" v-show="myUserID!=''">
        <a-button
          class="editor-button" type="primary" shape="circle"
          @click="goEditor"
        >
          <my-icon class="editor-button-icon" type="icon-yongyan"></my-icon>
        </a-button>
      </div>

      <!-- 离开游客模式按钮 -->
      <div class="editor-button-root" v-show="myUserID==''">
        <a-button
          class="editor-button" type="primary" shape="circle"
          @click="goLogin"
        >
          <my-icon class="leave-button-icon" type="icon-tuichudenglu1"></my-icon>
        </a-button>
      </div>

    </a-spin>

    <van-dialog v-model="showSetUserName" :show-confirm-button="false">
      <div slot="title" style="margin-bottom: 15px">
        <span style="margin-right: 5px">首次登录设置用户名</span>
        <a-icon type="smile" theme="twoTone" twoToneColor="#FFA500" />
      </div>

      <div style="margin-right: 25px; margin-left: 25px">
        <a-input v-model="newUserName" placeholder="输入一个有趣的名字吧">
          <div slot="addonBefore">用户名</div>
        </a-input>
        <span style="font-size: 12px; color: #f5222d; margin-left: 5px">{{
          setNewUserNameInfo
        }}</span>
        <a-button
          style="margin-bottom: 20px; margin-top: 20px; float: right"
          shape="round" size="small" type="primary"
          @click="setUserNameConfirm"
        >
          确定
        </a-button>
      </div>
    </van-dialog>

    <van-dialog
      v-model="showRealNameConfirm"
      show-cancel-button
      confirm-button-text="前往认证"
      confirm-button-color="返回"
      @confirm="goRealNameConfirm"
    >
      <div slot="title">
        <span style="margin-right: 5px; font-weight: 600">未实名认证</span>
        <a-icon type="info-circle" theme="twoTone" two-tone-color="#FFA500" />
      </div>
      <div style="margin: 20px">实名认证后才可以发布帖子哦~</div>
    </van-dialog>
  </div>
</template>

<script>
import homeHeader from "../components/home-s/home-header.vue";
import homeHotList from "../components/home-s/home-hotList.vue";
import homePostItem from "../components/home-s/home-post-item.vue";

import pullRefresh from "../components/refresh-s/pull-refresh.vue"
import homePostListEmpty from "../components/empty-s/empty-list-state.vue";

import infiniteScroll from "vue-infinite-scroll";
import { Toast as VantToast } from "vant";

import CONST from "../assets/const";
import axios from "../plugins/Axios"

export default {
  directives: { infiniteScroll },
  components: { homeHeader, homeHotList, homePostItem, pullRefresh },
  data() {
    return {
      CONST,
      busy: false,
      loading: false,

      /* 帖子 */
      post: [],    // 帖子数组
      current: 1,  // 页面
      postNum: 0,  // 帖子数量
      postEmtpy: {
        emptyText: <homePostListEmpty text="还没有帖子哦" />,
      },

      /* 没有实名认证 前往实名认证 */
      showRealNameConfirm: false,
      
      /* 没有用户名 设置新用户名 */
      showSetUserName: false, 
      newUserName: null,      // 新用户名
      setNewUserNameInfo: "", // 提示信息
      
      /* 加载状态 */
      postLoading: false,
      hotListLoading: false,
      wxLogLoading: true,
    };
  },
  computed: {
    homeLoading: function () {
      return !(this.postLoading && this.hotListLoading && this.wxLogLoading)
    },
    myUserID() {
      return this.$store.state.myUserID
    }
  },
  created() {
    this.$store.dispatch("edKeyChange", true);
    let myTicket = localStorage.getItem("ticket"); // 获取用户身份凭证

    // 如果是微信登录的首次登录
    if (myTicket == 'wxTempTicket') {
      this.wxLogLoading = false
      let myTicket = CONST.GetQueryString("ticket"); // 获取url中的微信登录返回的授权token
      localStorage.setItem("ticket", myTicket);

      let that = this
      axios({  // 根据新的token获取用户信息
        url:  "/user/get",
        method: "GET",
        headers: {
          Authorization: "HUSTer_" + myTicket,
        }
      })
      .then(function (response) {
        if (String(response.data.code) == "200") {
          // 首次登陆的时候是没有用户名的所以要设置
          if (response.data.msg.user.username == null) {
            that.showSetUserName = true;
          }

          that.$store.dispatch("userIDGet", response.data.msg.user.id);
          that.$store.dispatch("userTypeGet", response.data.msg.user.type);
          that.$store.dispatch("auditStatusGet", response.data.msg.user.auditStatus);
          that.wxLogLoading = true
        }
      })
    }

    this.fetchPostData((res) => {
      if(res.msg.discussPosts.result.length!=0){
        this.current += 1;
      }

      // 获取帖子
      this.post = res.msg.discussPosts.result;
      this.postNum = res.msg.discussPosts.rows;
      
      // 如何登录的用户 获取未读消息数量
      if (localStorage.getItem("ticket") != "tourist") {
        let that = this
        axios({
          url:  "/message/unread",
          method: "GET",
        })
        .then(function (response) {
          if (String(response.data.code) == "200") {
            that.$store.dispatch(
              "noticeUnreadCountGet",
              response.data.msg.commentNoticeUnreadCount +
              response.data.msg.followNoticeUnreadCount +
              response.data.msg.likeNoticeUnreadCount +
              response.data.msg.letterUnreadCount
            );
          }
            that.postLoading = true;
        });
      } else {
        this.postLoading = true;
      }
    });    
  },

  methods: {
    setUserNameConfirm() {
      if (this.newUserName === null) {
        this.setNewUserNameInfo = "用户名不能为空呀";
      } else {
        let that = this
        axios({
          url:  "/user/username",
          method: "GET",
          params: { newname: this.newUserName },
        })
        .then(function (response) {
          if(response.data.code == '200'){
            that.showSetUserName = false;
          }
          VantToast({
            message: response.data.msg,
            icon: response.data.code === "200" ? "success" : "cross",
          });
        });
      }
    },

    goEditor() {
      if (localStorage.getItem("ticket") == 'tourist') {
        VantToast({
          message: "登陆后可以发帖哦~",
        });
        return
      }
      
      if (this.$store.state.myAuditStatus == 0 || this.$store.state.myAuditStatus==3) {
        this.showRealNameConfirm = true;
        return
      }
      
      if(this.$store.state.myAuditStatus == 1){
        VantToast({
          message: "实名信息审核中，暂时无法发帖~",
        });
        this.showMoreActions = false;
        return
      }
      
      this.$router.push({
        name: "editor",
      });
    },

    goLogin(){
      this.$router.push({
        name: "login",
        params: { to: 'home' }
      });
    },

    goRealNameConfirm(){
      this.$router.push({
        name: "my",
        params: { showRealNameConfirm: true },
      });
    },

    fetchPostData(callback) {
      axios({
        url: "/discuss/index",
        method: 'get', 
        params: {
          orderMode: 0, 
          current: this.current,
        },
      })
      .then(function (response) {
        callback(response.data)
      });
    },

    loadMorePost() {
      if(this.loading==true){
        return
      }

      const post = this.post;
      this.loading = true;

      if (post.length >= this.postNum) {
        this.busy = true;
        this.loading = false;
        return;
      }

      this.fetchPostData((res) => {
        if(res.msg.discussPosts.result.length!=0 && this.loading){
          this.current += 1;
        }
        this.post = post.concat(res.msg.discussPosts.result);
        this.loading = false;
      });
    },

    pullRefresh(done){
      this.current = 1
      this.fetchPostData((res) => {
        if(res.msg.discussPosts.result.length!=0){
          this.current += 1;
        }
        // 获取帖子
        this.post = res.msg.discussPosts.result;
        this.postNum = res.msg.discussPosts.rows;
        done()
      });   
    }
  },
};
</script>

<style scoped>
.infinite-container {
  width: 100%;
}
.backtop-button {
  float: right;
  bottom: 170px;
  right: 5%;
  width: 50px;
  height: 50px;
  background-color: rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(1px);
}
.backtop-button:hover {
  color: rgba(0, 0, 0, 0.1);
  background-color: rgba(0, 0, 0, 0.05);
  border: 0px solid rgba(0, 0, 0, 0.1);
}
.backtop-button:active {
  background-color: rgba(0, 0, 0, 0.05);
  border: 0px solid rgba(0, 0, 0, 0.1);
}
.backtop-button-icon {
  font-size: 20px;
}

.editor-button-root {
  position: fixed;
  bottom: 100px;
  right: 5%;
}
.editor-button {
  float: right;
  width: 50px;
  height: 50px;
  box-shadow: 5px 5px 10px rgba(0, 0, 0, 0.2);
  
}
.editor-button-icon {
  font-size: 30px;
}

.leave-button-icon{
  font-size: 28px;
}

.post-item-summary {
  width: 100%;
  height: 100%;
  margin: 10px;
  margin-top: 0px;
  margin-bottom: 0px;
}
</style>


