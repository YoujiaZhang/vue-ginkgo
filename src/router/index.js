import Vue from "vue";
import VueRouter from "vue-router";

import my from "../components/my.vue";
import other from "../components/other.vue";
import myNotLogIN from "../components/myNotLogIN.vue";

import home from "../components/home.vue";
import editor from "../components/editor.vue";
import search from "../components/search.vue";
import content from "../components/content.vue";
import message from "../components/message.vue";
import hotList from "../components/hotList.vue";
import error from "../components/error.vue"

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


// import CONST from "../assets/const";
// import reqwest from "reqwest";
// import axios from "../plugins/Axios"
// import VueStore from "../store";

router.beforeEach((to, from, next) => {
  // alert(localStorage.getItem("ticket"))
  // let myTicket = localStorage.getItem("ticket");
  let myTicket = 'eyJhbGciOiJIUzUxMiJ9.eyJleHAiOjE2NDY4NTkyMTcsInN1YiI6IjExMyIsImNyZWF0ZWQiOjE2NDY4MTYwMTc2Mjl9.XSATXEV0mSPMc-8F2v4Lozebq4R_gPJTZS_GkPdpytp1_FSqQtjlxPnnJbC9D1QyTX75RPkhI68xvYPo3Yz_zw'
  
  next()
  if (myTicket=='tempTicket'){
    next()
    return
  }
  // reqwest({
  //   url: CONST.URL + "/user/get",
  //   type: "json",
  //   method: "GET",
  //   headers: {
  //     Authorization: "HUSTer_" + myTicket,
  //   },
  //   success: (res) => {
  //     // console.log(res)
  //     if (String(res.code) == "200") {
  //       VueStore.state.myTicket = myTicket
  //       VueStore.state.myUserID = res.msg.user.id
  //       VueStore.state.myUserType = res.msg.user.auditStatus
  //       VueStore.state.myUserName = res.msg.user.username
  //       next();
  //     }
  //     if (String(res.code) === "403"){
  //       localStorage.setItem("ticket", 'tempTicket');
  //       window.location.href = 'http://159.75.254.198:8080/wechat/oauth2/login'
  //     }
  //   },
  // });

  // axios.get(CONST.URL + "/user/get", {
  // })
  // .then(function (response) {
  //   console.log(response);
  //   next()
  // })
  // .catch(function (error) {
  //   console.log(error);
  //   next()
  // });
});
