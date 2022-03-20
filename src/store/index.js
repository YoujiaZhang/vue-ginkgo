import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

const actions = {
  edKeyChange(context, value) {
    context.commit("edKeyChange", value);
  },
  
  userIDGet(context, value) {
    context.commit("userIDGet", value);
  },
  userTypeGet(context, value) {
    context.commit("userTypeGet", value);
  },
  auditStatusGet(context, value) {
    context.commit("auditStatusGet", value);
  },

  noticeUnreadCountGet(context, value) {
    context.commit("noticeUnreadCountGet", value);
  },

  messageGet(context, value) {
    context.commit("messageGet", value);
  },
};

const mutations = {
  edKeyChange(state, value) {
    state.editorKey = value;
  },

  userIDGet(state, value) {
    state.myUserID = value;
  },
  userTypeGet(state, value) {
    state.myUserType = value;
  },
  auditStatusGet(state, value) {
    state.myAuditStatus = value;
  },
  
  noticeUnreadCountGet(state, value) {
    state.noticeUnreadCount = value;
  },

  messageGet(state, value) {
    state.message = value;
  },
};

const state = {
  // 是否显示底下的导航栏
  editorKey: true,

  myUserID: '',
  myUserType: '',
  myAuditStatus: '',
  
  noticeUnreadCount: 0,
  message: {}
};

const getters = {};

export default new Vuex.Store({
  actions,
  mutations,
  state,
  getters,
});
