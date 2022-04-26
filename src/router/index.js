import Vue from "vue";
import VueRouter from "vue-router";

import my from "../pages/my.vue";
import other from "../pages/other.vue";
import login from "../pages/login(带账号登录).vue";
import audit from "../pages/audit.vue";

import home from "../pages/home.vue";
import editor from "../pages/editor.vue";
import search from "../pages/search.vue";
import content from "../pages/content.vue";
import message from "../pages/message.vue";
import hotList from "../pages/hotList.vue";
import error from "../pages/error.vue"

import communityNorms from "../pages/about-s/community-norms.vue"
import userAgreement from "../pages/about-s/user-agreement.vue"
import privacyPolicy from "../pages/about-s/privacy-policy.vue"

Vue.use(VueRouter);

//创建并暴露一个路由器
const router = new VueRouter({
  mode: 'history',
  routes: [
    {
      path: "/audit",
      name: "audit",
      component: audit,
    },
    {
      path: "/my",
      name: "my",
      component: my,
    },
    {
      path: "/other",
      name: "other",
      component: other,
    },
    {
      path: "/login",
      name: "login",
      component: login,
    },
    {
      path: "/home",
      name: "home",
      component: home,
    },
    {
      path: "/editor",
      name: "editor",
      component: editor,
    },
    {
      path: "/content",
      name: "content",
      component: content,
    },
    {
      path: "/search",
      name: "search",
      component: search,
    },
    {
      path: "/message",
      name: "message",
      component: message,
    },
    {
      path: "/hotList",
      name: "hotList",
      component: hotList,
    },
    {
      path: "/error",
      name: "error",
      component: error,
    },
    {
      path: "/communityNorms",
      name: "communityNorms",
      component: communityNorms,
    },
    {
      path: "/userAgreement",
      name: "userAgreement",
      component: userAgreement,
    },
    {
      path: "/privacyPolicy",
      name: "privacyPolicy",
      component: privacyPolicy,
    },
    { path: "*", redirect: "/home" },
  ],
});
export default router;

import { Toast as VantToast } from "vant";
import VueStore from "../store";
import axios from "../plugins/Axios"

router.beforeEach((to, from, next) => {
  // 不需要进行身份鉴权的页面
  if(to.name=='login'||to.name=='error'){
    next()
    return 
  }
  // 获取身份信凭证
  let myTicket = localStorage.getItem("ticket");

  // 一、作为游客身份进行访问
  if(myTicket=='tourist'){
    VueStore.state.myUserID = ''
    VueStore.state.myUserType = ''
    VueStore.state.myAuditStatus = ''

    if ( to.name == 'message' || to.name == 'my' ){
      VantToast({
        message: "需要登录哦~",
      });
    }else{
      next()
    }
  }

  // 二、作为微信登录的临时凭证
  else if(myTicket=='wxTempTicket'){
    next()
  }
  
  // 三、测试token的有效性
  else{
    axios({
      url: "/user/get",
      method: 'get', 
    })
    .then(function (response) {
      // console.log(response.data)
      if (String(response.data.code) == "200") {
        VueStore.state.myUserID = response.data.msg.user.id
        VueStore.state.myUserType = response.data.msg.user.type
        VueStore.state.myAuditStatus = response.data.msg.user.auditStatus

        let historyUser = JSON.parse(localStorage.getItem("historyUser")) || {};
        let historyUserArray = []

        historyUser[response.data.msg.user.id]=myTicket;
        for(let prop in historyUser) {
          historyUserArray.push({
            key: prop,
            value : historyUser[prop],
          })
        }
        historyUserArray = historyUserArray.slice(0, 10);
        historyUserArray.forEach(item=> {
          historyUser[item.key] = item.value
        })
        localStorage.setItem("historyUser", JSON.stringify(historyUser));

        next();
      } else if(String(response.data.code) == "403") {
        next({ 
          name: 'login',
          params: { to: from.name == null ? 'home' : from.name }
        });
      }
    });
  }
});
