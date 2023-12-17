import { get, post } from "./http";

// 登录接口
export const login = (p) => get("/user/login", p);
// 注册接口
export const addUser = (p) => post("/user/register", p);
// 获取登录状态及用户信息
export const checkUserLoginInfo = (p) => get("/user/checkuserlogininfo", p);
// 获取用户信息
export const getUserInfo = (p) => get("user/getuserinfo", p);
// 更新用户信息
export const updateUserInfo = (p) => post("user/updateuserinfo", p);
// 修改密码
export const updatePassword = (p) => post("user/updatepassword", p);
// 获取企业信息
export const getCompanyInfo = (p) => get("/company/getcompanyInfo", p);