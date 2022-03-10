import Vue from "vue";
import App from "./App.vue";

// 引入 外部UI组件库
// import './plugins/Mock.js'

// 引入 外部UI组件库
import './plugins/VueUI.js'

// 引入 富文本编辑器
import './plugins/VueQuillEditor.js'
// 引入 获取剪贴板功能
import './plugins/VueClipboard.js'
// 引入 监听手指触摸事件
import './plugins/VueTouch.js'

import './plugins/Axios.js'

import store from './store'
import router from "./router";

// 代码运行入口
Vue.config.productionTip = false;
new Vue({
  render: (h) => h(App),
  router,
  store,
}).$mount("#app");
