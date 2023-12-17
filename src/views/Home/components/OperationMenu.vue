<template>
    <div>
        <div class="operation-menu-wrapper" v-if="fileType < 7">
            <!-- 按钮组 -->
            <el-button-group class="operate-group">
                <!-- disabled 只在全部类型页面 才可新建文件夹 -->
                <el-button v-if="fileType !== 6 && fileType !== 13" size="mini" type="primary" icon="el-icon-plus"
                    :disabled="fileType !== 0 && fileType !== 7" @click="addFolderDialog.visible = true">新建文件夹</el-button>
                <el-button v-if="fileType !== 6 && fileType !== 13" size="mini" type="primary" icon="el-icon-upload2"
                    @click="handleUploadFileClick()" :disabled="fileType !== 0 && fileType !== 7">上传文件</el-button>
                <!-- disabled 当表格勾选项为空时，禁用删除按钮 -->
                <el-button size="mini" type="primary" icon="el-icon-delete" :disabled="!operationFileList.length"
                    @click="handleDeleteFileClick()">删除</el-button>
                <!-- disabled 当表格勾选项为空时，禁用移动按钮 | v-if 当左侧菜单选择全部时，才显示移动按钮 -->
                <el-button size="mini" type="primary" icon="el-icon-rank" :disabled="!operationFileList.length"
                    v-if="fileType === 0 || fileType === 7" @click="handleMoveFileClick()">移动</el-button>
                <!-- disabled 当表格勾选项为空时，禁用下载按钮 -->
                <el-button v-if="fileType !== 6 && fileType !== 13" size="mini" type="primary" icon="el-icon-download"
                    :disabled="!operationFileList.length" @click="handleDownloadFileClick()">下载</el-button>
            </el-button-group>
            <!-- 对话框 - 新建文件夹 -->
            <!-- @closed 对话框关闭动画结束时 重置表单并清空所有表单校验 -->
            <el-dialog title="新建文件夹" width="600px" :visible.sync="addFolderDialog.visible"
                @closed="$refs.addFolderForm.resetFields()">
                <el-form :model="addFolderForm" :rules="addFolderRules" label-position="top" ref="addFolderForm">
                    <el-form-item label="文件夹名称" prop="name">
                        <el-input v-model="addFolderForm.name"></el-input>
                    </el-form-item>
                </el-form>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="addFolderDialog.visible = false">取 消</el-button>
                    <el-button type="primary" :loading="addFolderDialog.loading"
                        @click="handleAddFolderSubmit('addFolderForm')">提 交</el-button>
                </span>
            </el-dialog>
            <!-- 多选文件下载，页面隐藏 -->
            <a v-for="(item, index) in operationFileList" :key="index"
                :href="`/api/filetransfer/downloadfile?userFileId=${item.userFileId}`"
                :download="`${item.fileName}.${item.extendName}`" :ref="`downloadLink${index}`"></a>
        </div>
        <div class="operation-menu-wrapper" v-else-if="fileType < 14">
            <!-- 按钮组 -->
            <el-button-group class="operate-group">
                <!-- disabled 只在全部类型页面 才可新建文件夹 -->
                <el-button v-if="fileType !== 6 && fileType !== 13" size="mini" type="primary" icon="el-icon-plus"
                    :disabled="fileType !== 0 && fileType !== 7" @click="handleClick">新建文件夹</el-button>
                <el-button v-if="fileType !== 6 && fileType !== 13" size="mini" type="primary" icon="el-icon-upload2"
                    @click="handleUploadFileClick()" :disabled="fileType !== 0 && fileType !== 7">上传文件</el-button>
                <!-- disabled 当表格勾选项为空时，禁用删除按钮 -->
                <el-button size="mini" type="primary" icon="el-icon-delete" :disabled="!operationFileList.length"
                    @click="handleDeleteFileClick()">删除</el-button>
                <!-- disabled 当表格勾选项为空时，禁用移动按钮 | v-if 当左侧菜单选择全部时，才显示移动按钮 -->
                <el-button size="mini" type="primary" icon="el-icon-rank" :disabled="!operationFileList.length"
                    v-if="fileType === 0 || fileType === 7" @click="handleMoveFileClick()">移动</el-button>
                <!-- disabled 当表格勾选项为空时，禁用下载按钮 -->
                <el-button v-if="fileType !== 6 && fileType !== 13" size="mini" type="primary" icon="el-icon-download"
                    :disabled="!operationFileList.length" @click="handleDownloadFileClick()">下载</el-button>
            </el-button-group>

            <!-- 对话框 - 新建文件夹 -->
            <!-- @closed 对话框关闭动画结束时 重置表单并清空所有表单校验 -->
            <el-dialog title="新建文件夹" width="600px" :visible.sync="addFolderDialog.visible"
                @closed="$refs.addFolderForm.resetFields()">
                <el-form :model="addFolderForm" :rules="addFolderRules" label-position="top" ref="addFolderForm">
                    <el-form-item label="文件夹名称" prop="name">
                        <el-input v-model="addFolderForm.name"></el-input>
                    </el-form-item>
                    <!-- <el-form-item label="文件夹部门" prop="department">
                        <TreeSelect style="width: 400px" class="tree" :props="props" :options="optionData" :value="valueId"
                            :clearable="isClearable" :accordion="isAccordion" @getValue="getValue($event)"></TreeSelect>
                    </el-form-item> -->
                </el-form>
                <span slot="footer" class="dialog-footer" style="margin-right: 150px">
                    <el-button @click="addFolderDialog.visible = false">取 消</el-button>
                    <el-button type="primary" :loading="addFolderDialog.loading"
                        @click="handleAddFolderSubmit('addFolderForm')">提 交</el-button>
                </span>
            </el-dialog>
            <!-- 多选文件下载，页面隐藏 -->
            <a v-for="(item, index) in operationFileList" :key="index"
                :href="`/api/deptfiletransfer/downloadfile?deptFileId=${item.deptFileId}`"
                :download="`${item.fileName}.${item.extendName}`" :ref="`downloadLink${index}`"></a>
        </div>
    </div>
</template>
  
<script>
// 引入创建文件接口
import { createFile } from "@/request/file.js";
// 引入批量删除文件接口
import { batchDeleteFile } from '@/request/file.js';
// 引入批量删除回收站文件接口
import { deleteRecoveryFileList } from "@/request/file.js";
// 引入创建部门文件接口
import { createFile1 } from "@/request/deptFile.js";
// 引入批量删除部门文件接口
import { batchDeleteFile1 } from '@/request/deptFile.js';
// 引入批量删除回收站部门文件接口
import { deleteRecoveryDeptFileList } from "@/request/deptFile.js";
import { getUserInfo } from "@/request/user";
import { getDeptTree } from "@/request/department.js";
import { getSonDeptTreeById } from "@/request/department.js";

// import TreeSelect from "@/components/TreeSelect.vue";

export default {
    name: "OperationMenu",
    components: {
        // TreeSelect
    },
    props: {
        // 文件类型
        fileType: {
            type: Number,
            required: true,
        },
        // 文件路径
        filePath: {
            type: String,
            required: true,
        },
        // 表格行 已选项
        operationFileList: {
            type: Array,
            required: true
        }
    },
    data() {
        return {
            // 新建文件夹对话框数据
            addFolderDialog: {
                visible: false, //  对话框显隐状态
                loading: false,
            },
            // 新建文件夹表单
            addFolderForm: {
                name: "",
            },
            // 新建文件夹表单校验规则
            addFolderRules: {
                name: [
                    {
                        required: true,
                        message: "请输入文件夹名称",
                        trigger: "blur, change",
                    },
                ],
            },
            isClearable: true, // 可清空（可选）
            isAccordion: true, // 可收起（可选）
            valueId: 1, // 初始ID（可选）
            props: {
                // 配置项（必选）
                value: "id",
                label: "name",
                children: "children"
                // disabled:true
            },
            // 选项列表（必选）
            list: [{ id: 1, parentId: 0, name: "总公司", rank: 1 }],
            deptId: 0,
            son: []
        };
    },
    created() {
        this.getInfo()
        getDeptTree().then((res) => {
            if (res.success) {
                this.list = res.data
            }
        })

    },
    methods: {
        // 新建文件夹对话框 - 提交按钮
        handleAddFolderSubmit(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    this.addFolderDialog.loading = true; //  对话框的确定按钮打开loading状态
                    // 表单校验通过 - 调用新建文件夹接口
                    if (this.fileType === 0) {
                        createFile({
                            fileName: this.addFolderForm.name,
                            filePath: this.filePath, //  文件路径
                            isDir: 1, //  是否为文件夹：1 表示文件夹 0 表示文件
                        }).then(
                            (res) => {
                                this.addFolderDialog.loading = false; //  对话框的确定按钮关闭loading状态
                                if (res.success) {
                                    this.$message.success("添加成功");
                                    this.addFolderDialog.visible = false; //  关闭对话框
                                    this.$emit("getTableData"); // 重新获取文件列表
                                } else {
                                    this.$message.warning(res.message);
                                }
                            },
                            (error) => {
                                this.addFolderDialog.loading = false; //  对话框的确定按钮关闭loading状态
                                console.log(error);
                            }
                        );
                    }
                    if (this.fileType === 7) {
                        createFile1({
                            fileName: this.addFolderForm.name,
                            filePath: this.filePath, //  文件路径
                            isDir: 1, //  是否为文件夹：1 表示文件夹 0 表示文件
                        }).then(
                            (res) => {
                                this.addFolderDialog.loading = false; //  对话框的确定按钮关闭loading状态
                                if (res.success) {
                                    this.$message.success("添加成功");
                                    this.addFolderDialog.visible = false; //  关闭对话框
                                    this.$emit("getTableData"); // 重新获取文件列表
                                } else {
                                    this.$message.warning(res.message);
                                }
                            },
                            (error) => {
                                this.addFolderDialog.loading = false; //  对话框的确定按钮关闭loading状态
                                console.log(error);
                            }
                        );
                        // for (let i = 0; i < this.son.length; i++) {
                        //     createFile1({
                        //         fileName: this.addFolderForm.name,
                        //         filePath: "/", //  文件路径
                        //         isDir: 1, //  是否为文件夹：1 表示文件夹 0 表示文件
                        //     }).then(
                        //         (res) => {
                        //             this.addFolderDialog.loading = false; //  对话框的确定按钮关闭loading状态
                        //             if (res.success) {
                        //                 this.$message.success("添加成功");
                        //                 this.addFolderDialog.visible = false; //  关闭对话框
                        //                 this.$emit("getTableData"); // 重新获取文件列表
                        //             } else {
                        //                 this.$message.warning(res.message);
                        //             }
                        //         },
                        //         (error) => {
                        //             this.addFolderDialog.loading = false; //  对话框的确定按钮关闭loading状态
                        //             console.log(error);
                        //         }
                        //     );
                        // }
                    }
                } else {
                    return false;
                }
            });
        },
        // 上传文件按钮 - 点击事件
        handleUploadFileClick() {
            this.$emit('handleUploadFile', true)
        },
        // 删除文件按钮 - 点击事件
        handleDeleteFileClick() {
            // 消息弹框提示用户
            this.$confirm('此操作将永久删除文件, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            })
                .then(() => {
                    // 确定按钮 点击事件 调用批量删除文件接口
                    if (this.fileType < 6) {
                        batchDeleteFile({
                            files: JSON.stringify(this.operationFileList)
                        }).then((res) => {
                            if (res.success) {
                                this.$message({
                                    message: res.message,
                                    type: 'success'
                                })
                                this.$emit('getTableData') //  刷新文件列表
                            } else {
                                this.$message.error('失败' + res.message)
                            }
                        })
                    } else if (this.fileType === 6) {
                        let li = []
                        for (let i = 0; i < this.operationFileList.length; i++) {
                            li.push({ "userFileId": this.operationFileList[i].userFileId })
                        }
                        deleteRecoveryFileList(li).then((res) => {
                            if (res.success) {
                                this.$message({
                                    message: res.message,
                                    type: 'success'
                                })
                                this.$emit('getTableData') //  刷新文件列表
                            } else {
                                this.$message.error('失败' + res.message)
                            }
                        })
                    } else if (this.fileType < 13) {
                        batchDeleteFile1({
                            files: JSON.stringify(this.operationFileList)
                        }).then((res) => {
                            if (res.success) {
                                this.$message({
                                    message: res.message,
                                    type: 'success'
                                })
                                this.$emit('getTableData') //  刷新文件列表
                            } else {
                                this.$message.error('失败' + res.message)
                            }
                        })
                    } else if (this.fileType === 13) {
                        let li = []
                        for (let i = 0; i < this.operationFileList.length; i++) {
                            li.push({ "deptFileId": this.operationFileList[i].deptFileId })
                        }
                        deleteRecoveryDeptFileList(li).then((res) => {
                            if (res.success) {
                                this.$message({
                                    message: res.message,
                                    type: 'success'
                                })
                                this.$emit('getTableData') //  刷新文件列表
                            } else {
                                this.$message.error('失败' + res.message)
                            }
                        })
                    }
                })
                .catch(() => {
                    //  取消
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    })
                })
        },
        // 移动文件按钮 - 点击事件
        handleMoveFileClick() {
            // true/false 批量移动/单文件操作 | this.operationFileList 当前行文件数据
            this.$emit('handleSelectFile', true, this.operationFileList)
            this.$emit('handleMoveFile', true) // true/false 打开/关闭移动文件对话框
        },
        // 下载文件按钮 - 点击事件
        handleDownloadFileClick() {
            for (let i = 0; i < this.operationFileList.length; i++) {
                this.$refs[`downloadLink${i}`][0].click() //  依次调用 a 标签的点击事件来下载文件
            }
        },
        getInfo() {
            getUserInfo().then((res) => {
                if (res.success) {
                    this.deptId = res.data.deptId
                } else {
                    this.$message.error(res.message)
                }
            })
        },
        // 取值
        getValue(value) {
            this.valueId = value;
        },
        handleClick() {
            this.addFolderDialog.visible = true
            getSonDeptTreeById({
                deptId: this.valueId
            }).then(
                (res) => {
                    if (res.success) {
                        this.son = res.data
                    }
                }
            )
        }
    },
    computed: {
        /* 转树形数据 */
        optionData() {
            let cloneData = JSON.parse(JSON.stringify(this.list)); // 对源数据深度克隆
            return cloneData.filter(father => {
                // 循环所有项，并添加children属性
                let branchArr = cloneData.filter(child => father.id == child.parentId); // 返回每一项的子级数组
                branchArr.length > 0 ? (father.children = branchArr) : ""; //给父级添加一个children属性，并赋值
                return father.parentId == 0; //返回第一层
            });
        }
    },
};
</script>