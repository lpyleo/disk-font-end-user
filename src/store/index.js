import Vue from "vue";
import Vuex from "vuex";

import user from "./module/user"; // 引入user 模块
import file from "./module/file"; // 引入 file 模块
import imgReview from "./module/imgReview"; // 引入 imgReview 模块

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    //
  },
  getters: {
    loginInfo: (state) => state.user.loginInfo,
    // 是否登录
    isLogin: (state) => state.user.isLogin,
    // 用户名
    username: (state) => state.user.username,
    // 用户id
    userId: (state) => state.user.userId,
    // 用户头像
    userAvatar: (state) => state.user.avatar,
    // 用户详细信息
    userInfoObj: (state) => state.user.userInfoObj,
    // 需要显示的表格列
    selectedColumnList: (state) =>
      state.file.selectedColumnList === null
        ? state.file.allColumnList
        : state.file.selectedColumnList.split(","),
    // 需要显示的表格列
    selectedColumnList1: (state) =>
      state.file.selectedColumnList1 === null
        ? state.file.allColumnList1
        : state.file.selectedColumnList1.split(","),
    // 查看模式 - 0 列表 | 1 网格 | 2 时间线
    showModel: (state) => (state.file.showModel === null ? 0 : Number(state.file.showModel))
  },
  mutations: {
    //
  },
  actions: {
    //
  },
  modules: {
    // 注册模块
    user,
    file,
    imgReview
  },
});