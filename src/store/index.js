import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

const actions = {
  edKeyChange(context, value) {
    context.commit("edKeyChange", value);
  },
  ticketGet(context, value) {
    context.commit("ticketGet", value);
  },
  userIDGet(context, value) {
    context.commit("userIDGet", value);
  },
  userTypeGet(context, value) {
    context.commit("userTypeGet", value);
  },
  userNameGet(context, value) {
    context.commit("userNameGet", value);
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
  ticketGet(state, value) {
    state.myTicket = value;
  },
  userIDGet(state, value) {
    state.myUserID = value;
  },
  userTypeGet(state, value) {
    state.myUserType = value;
  },
  userNameGet(state, value) {
    state.myUserName = value;
  },
  noticeUnreadCountGet(state, value) {
    state.noticeUnreadCount = value;
  },
  messageGet(state, value) {
    state.message = value;
  },
};

const state = {
  editorKey: true,
  myTicket: '',
  myUserID: '',
  myUserType: '',
  myUserName: '',
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
