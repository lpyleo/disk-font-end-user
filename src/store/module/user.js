import { checkUserLoginInfo } from "@/request/user.js"; // 引入获取用户登录信息接口

export default {
    state: {
        isLogin: false, // 初始时候给一个 isLogin = false 表示用户未登录
        username: "",
        userId: 0,
        userImgUrl: "",
        userInfoObj: {},
        loginInfo: {},
        avatar: ""
    },
    mutations: {
        changeLogin(state, data) {
            state.isLogin = data;
        },
        changeUsername(state, data) {
            state.username = data;
        },
        changeUserId(state, data) {
            state.userId = data;
        },
        changeUserAvatar(state, data){
            state.avatar = data
        },
        changeUserInfoObj(state, data) {
            state.userInfoObj = Object.assign({}, state.userInfoObj, data);
        },
        setLoginInfo(state, data) {
            state.loginInfo = Object.assign({}, state.loginInfo, data);
        }
    },
    actions: {
        getUserInfo(context) {
            return checkUserLoginInfo().then((res) => {
                if (res.success) {
                    context.commit("changeLogin", res.success);
                    context.commit("changeUsername", res.data.username);
                    context.commit("changeUserId", res.data.userId);
                    context.commit("changeUserInfoObj", res.data);
                    context.commit("changeUserAvatar", res.data.avatar);
                } else {
                    context.commit("changeLogin", res.success);
                }
            });
        },
    },
};