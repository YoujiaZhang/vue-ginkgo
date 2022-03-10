import Vue from "vue";
import VueRouter from "vue-router";

import my from "../pages/my.vue";
import other from "../pages/other.vue";
import myNotLogIN from "../pages/myNotLogIN.vue";

import home from "../pages/home.vue";
import editor from "../pages/editor.vue";
import search from "../pages/search.vue";
import content from "../pages/content.vue";
import message from "../pages/message.vue";
import hotList from "../pages/hotList.vue";
import error from "../pages/error.vue"

Vue.use(VueRouter);

//创建并暴露一个路由器
const router = new VueRouter({
  routes: [
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
      path: "/myNotLogIN",
      name: "myNotLogIN",
      component: myNotLogIN,
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
    { path: "*", redirect: "/home" },
  ],
});
export default router;


import VueStore from "../store";
import CONST from "../assets/const";
// import reqwest from "reqwest";
import axios from "../plugins/Axios"


router.beforeEach((to, from, next) => {
  // alert(localStorage.getItem("ticket"))
  // let myTicket = localStorage.getItem("ticket");
  let myTicket = 'eyJhbGciOiJIUzUxMiJ9.eyJleHAiOjE2NDY5NDczMTcsInN1YiI6IjExMyIsImNyZWF0ZWQiOjE2NDY5MDQxMTc5OTJ9.L1Rw8b3O4ofNk9TmvwcU5V0aEVgWKcVwRN0BuaXhyK_JvDG0viNTi_gQC4kqEJEKcDCGSeVw0xGmkxagpnNxFA'
  if (myTicket=='tempTicket'){
    next()
    return
  }

  axios({
    url: CONST.URL + "/user/get",
    method: 'get', 
    headers: {
      Authorization: "HUSTer_" + myTicket,
    },
  })
  .then(function (response) {
    if (String(response.data.code) == "200") {
      VueStore.state.myTicket = myTicket
      VueStore.state.myUserID = response.data.msg.user.id
      VueStore.state.myUserType = response.data.msg.user.auditStatus
      VueStore.state.myUserName = response.data.msg.user.username
      next();
    }
    if (String(response.data.code) === "403"){
      localStorage.setItem("ticket", 'tempTicket');
      window.location.href = 'http://159.75.254.198:8080/wechat/oauth2/login'
    }
  });
});
