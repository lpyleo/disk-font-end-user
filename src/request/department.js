import { get } from "./http";

// 获取部门树
export const getDeptTree = (p) => get("/department/departmenttree", p);
// 获取子部门树
export const getSonDeptTreeById = (p) => get("/department/getallsondeptbyid", p);