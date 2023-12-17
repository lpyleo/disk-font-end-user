import { get, post } from "./http";

// 左侧菜单选择的为 全部 时，根据路径，获取文件列表
export const getFileListByPath1 = (p) => get("/departmentfile/getfilelist", p);
// 左侧菜单选择的为 除全部以外 的类型时，根据类型，获取文件列表
export const getFileListByType1 = (p) => get("/departmentfile/selectfilebyfiletype", p);
// 创建文件夹 或 文件
export const createFile1 = (p) => post("/departmentfile/createfile", p);
// 获取存储空间已占用大小
export const getFileStorage1 = (p) => get("/deptfiletransfer/getstorage", p);
// 获取文件夹列表 树状结构
export const getFileTree1 = (p) => get('/departmentfile/getfiletree', p)
// 单文件操作接口
// 文件删除
export const deleteFile1 = (p) => post('/departmentfile/deletefile', p)
// 文件移动
export const moveFile1 = (p) => post('/departmentfile/movefile', p)
// 文件重命名
export const renameFile1 = (p) => post('/departmentfile/renamefile', p)
// 批量文件操作接口
// 批量删除文件
export const batchDeleteFile1 = (p) => post("/departmentfile/batchdeletefile", p);
// 批量移动文件
export const batchMoveFile1 = (p) => post("/departmentfile/batchmovefile", p);
// 模糊查询文件
export const searchFile1 = (p) => get("/departmentfile/searchfile", p);
// 查询删除的文件
export const getDeleteFileList1 = (p) => get("/departmentfile/getdeletefilelist", p);
// 文件还原
export const restoreFile1 = (p) => post('/departmentfile/restorefile', p);
// 删除回收站部门文件
export const deleteRecoveryDeptFile = (p) => post('/departmentfile/deleterecoverydeptfile', p);
// 批量删除回收站部门文件
export const deleteRecoveryDeptFileList = (p) => post('/departmentfile/deleterecoverydeptfilelist', p);
// 添加评论
export const addReview = (p) => post('/departmentfile/addreview', p);
// 获取评论列表
export const getReviews = (p) => get('/departmentfile/getreviews', p);