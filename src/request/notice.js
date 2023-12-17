import { get } from "./http";

// 获取通知列表接口
export const getNoticeList = (p) => get("/notice/getnoticelist", p);
// 查看通知内容接口
export const getNoticeInfo = (p) => get("/notice/getnoticeinfo", p);
// 系统通知模糊查询接口
export const searchNotice = (p) => get("/notice/searchnotice", p);