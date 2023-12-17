import { get, post } from "./http";

// 左侧菜单选择的为 全部 时，根据路径，获取文件列表
export const getFileListByPath = (p) => get("/file/getfilelist", p);
// 左侧菜单选择的为 除全部以外 的类型时，根据类型，获取文件列表
export const getFileListByType = (p) => get("/file/selectfilebyfiletype", p);
// 创建文件夹 或 文件
export const createFile = (p) => post("/file/createfile", p);
// 获取存储空间已占用大小
export const getFileStorage = (p) => get("/filetransfer/getstorage", p);
// 获取文件夹列表 树状结构
export const getFileTree = (p) => get('/file/getfiletree', p)
// 单文件操作接口
// 文件删除
export const deleteFile = (p) => post('/file/deletefile', p)
// 文件移动
export const moveFile = (p) => post('/file/movefile', p)
// 文件重命名
export const renameFile = (p) => post('/file/renamefile', p)
// 批量文件操作接口
// 批量删除文件
export const batchDeleteFile = (p) => post("/file/batchdeletefile", p);
// 批量移动文件
export const batchMoveFile = (p) => post("/file/batchmovefile", p);
// 模糊查询文件
export const searchFile = (p) => get("/file/searchfile", p);
// 查询删除的文件
export const getDeleteFileList = (p) => get("/file/getdeletefilelist", p);
// 文件还原
export const restoreFile = (p) => post('/file/restorefile', p);
// 删除回收站文件
export const deleteRecoveryFile = (p) => post('/file/deleterecoveryfile', p);
// 批量删除回收站文件
export const deleteRecoveryFileList = (p) => post('/file/deleterecoveryfilelist', p);