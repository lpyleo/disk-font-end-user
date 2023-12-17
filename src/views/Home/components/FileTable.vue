<template>
    <div>
        <el-table v-show="fileType !== 14" class="file-table" :data="tableData" height="calc(100vh - 202px)"
            style="width: 100%" v-loading="loading" @selection-change="handleSelectRow">
            <!-- 勾选框 -->
            <el-table-column type="selection" width="56" align="center"></el-table-column>
            <el-table-column label prop="isDir" width="60" align="center">
                <template slot-scope="scope">
                    <img :src="setFileImg(scope.row)" style="width: 30px" />
                </template>
            </el-table-column>
            <el-table-column prop="fileName" label="文件名">
                <template slot-scope="scope">
                    <div style="cursor: pointer" @click="handleFileNameClick(scope.row)">
                        {{
                            scope.row.extendName
                            ? `${scope.row.fileName}.${scope.row.extendName}`
                            : `${scope.row.fileName}`
                        }}
                    </div>
                </template>
            </el-table-column>
            <el-table-column label="所在路径" prop="filePath" show-overflow-tooltip v-if="fileType > 0 && fileType < 6">
                <template slot-scope="scope">
                    <div style="cursor: pointer" title="点击跳转" @click="
                        $router.push({
                            query: { fileType: 0, filePath: scope.row.filePath }
                        })
                        ">
                        {{ scope.row.filePath }}
                    </div>
                </template>
            </el-table-column>
            <el-table-column label="所在路径" prop="filePath" show-overflow-tooltip v-if="fileType > 7 && fileType < 13">
                <template slot-scope="scope">
                    <div style="cursor: pointer" title="点击跳转" @click="
                        $router.push({
                            query: { fileType: 7, filePath: scope.row.filePath }
                        })
                        ">
                        {{ scope.row.filePath }}
                    </div>
                </template>
            </el-table-column>
            <!-- 通过 v-if 来控制 类型 列是否显示 -->
            <el-table-column prop="extendName" label="类型" width="100" v-if="selectedColumnList.includes('extendName')">
                <template slot-scope="scope">
                    <span>{{ scope.row.extendName ? scope.row.extendName : '文件夹' }}</span>
                </template>
            </el-table-column>
            <!-- 通过 v-if 来控制 大小 列是否显示 -->
            <el-table-column prop="fileSize" label="大小" width="100" v-if="selectedColumnList.includes('fileSize')">
                <template slot-scope="scope">
                    <span>{{ calculateFileSize(scope.row.fileSize) }}</span>
                </template>
            </el-table-column>
            <!-- 通过 v-if 来控制 修改日期 列是否显示 -->
            <el-table-column prop="uploadTime" label="修改日期" width="180"
                v-if="selectedColumnList.includes('uploadTime') && fileType !== 6 && fileType !== 13">
            </el-table-column>
            <el-table-column :width="operaColumnIsFold ? 200 : 100">
                <!-- 自定义表格头 -->
                <template slot="header">
                    <span>操作</span>
                    <i class="el-icon-circle-plus" title="展开" @click="operaColumnIsFold = true"></i>
                    <i class="el-icon-remove" title="折叠" @click="operaColumnIsFold = false"></i>
                </template>
                <template slot-scope="scope">
                    <!-- 操作列展开状态下的按钮 -->
                    <div class="opera-unfold" v-if="operaColumnIsFold">
                        <el-button type="text" size="small" @click.native="handleClickRestore(scope.row)"
                            v-if="fileType === 6 || fileType === 13">还原</el-button>
                        <el-button type="text" size="small" @click.native="handleClickDelete(scope.row)">删除</el-button>
                        <el-button type="text" size="small" @click.native="handleClickMove(scope.row)"
                            v-if="fileType !== 6 && fileType !== 13">移动</el-button>
                        <el-button type="text" size="small" @click.native="handleClickRename(scope.row)"
                            v-if="fileType !== 6 && fileType !== 13">重命名</el-button>
                        <el-button type="text" size="small"
                            v-if="scope.row.isDir === 0 && fileType !== 6 && fileType !== 13">
                            <a v-if="fileType >= 0 && fileType <= 5"
                                :href="`/api/filetransfer/downloadfile?userFileId=${scope.row.userFileId}`" target="_blank"
                                style="display: block; color: inherit">下载</a>
                            <a v-if="fileType >= 7 && fileType <= 12"
                                :href="`/api/deptfiletransfer/downloadfile?deptFileId=${scope.row.deptFileId}`"
                                target="_blank" style="display: block; color: inherit">下载</a>
                        </el-button>
                        <el-button type="text" size="small" @click.native="handleClickEvaluation(scope.row)"
                            v-if="fileType >= 8 && fileType <= 12">评价</el-button>
                    </div>
                    <!-- 操作列收缩状态下的按钮 -->
                    <el-dropdown trigger="click" v-else>
                        <el-button size="mini">
                            操作
                            <i class="el-icon-arrow-down el-icon--right"></i>
                        </el-button>
                        <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item @click.native="handleClickRestore(scope.row)"
                                v-if="fileType === 6 || fileType === 13">还原</el-dropdown-item>
                            <el-dropdown-item @click.native="handleClickDelete(scope.row)">删除</el-dropdown-item>
                            <el-dropdown-item @click.native="handleClickMove(scope.row)"
                                v-if="fileType !== 6 && fileType !== 13">移动</el-dropdown-item>
                            <el-dropdown-item @click.native="handleClickRename(scope.row)"
                                v-if="fileType !== 6 && fileType !== 13">重命名</el-dropdown-item>
                            <el-dropdown-item v-if="scope.row.isDir === 0 && fileType !== 6 && fileType !== 13">
                                <a v-if="fileType >= 0 && fileType <= 5"
                                    :href="`/api/filetransfer/downloadfile?userFileId=${scope.row.userFileId}`"
                                    target="_blank" style="display: block; color: inherit">下载</a>
                                <a v-if="fileType >= 7 && fileType <= 12"
                                    :href="`/api/deptfiletransfer/downloadfile?deptFileId=${scope.row.deptFileId}`"
                                    target="_blank" style="display: block; color: inherit">下载</a>
                            </el-dropdown-item>
                            <el-dropdown-item @click.native="handleClickEvaluation(scope.row)"
                                v-if="fileType >= 8 && fileType <= 12">评价</el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown>
                </template>
            </el-table-column>
        </el-table>
        <el-table v-show="fileType === 14" class="file-table" :data="tableData1" height="calc(100vh - 202px)"
            style="width: 100%;cursor: pointer;user-select: none;" v-loading="loading" @row-dblclick="handleDbClick">
            <el-table-column prop="noticeName" label="通知名称">
            </el-table-column>
            <el-table-column prop="sendTime" label="通知时间" width="180">
            </el-table-column>
        </el-table>
        <el-dialog :visible.sync="dialogVisible" title="通知详情" width="50%">
            <div v-if="selectedNotice">
                <el-card>
                    <h3 slot="header" style="text-align: center">{{ selectedNotice.noticeName }}</h3>
                    <el-row>
                        <el-col :span="24">
                            <p style="text-indent: 2em">{{ selectedNotice.noticeContent }}</p>
                        </el-col>
                    </el-row>
                </el-card>
            </div>
            <div v-else>暂无内容</div>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="dialogVisible = false">关闭</el-button>
            </span>
        </el-dialog>
        <el-dialog :visible.sync="dialogVisible1" title="用户评价">
            <template>
                <div v-if="reviews.length > 0" class="rw">
                    <div v-for="review in reviews" :key="review.id" class="review-item">
                        <div class="review-header">
                            <img :src="review.avatar" alt="用户头像" class="avatar" />
                            <div class="header-info">
                                <span class="username">{{ review.username }}</span>
                                <span class="time">{{ review.reviewTime }}</span>
                            </div>
                        </div>
                        <div class="review-content">
                            <el-card>
                                <p class="content">{{ review.content }}</p>
                            </el-card>
                        </div>
                    </div>
                </div>
                <div v-else>
                    <p>暂无评价</p>
                </div>

                <el-input v-model="userReview" placeholder="请输入评价内容" class="input-review"></el-input>
            </template>

            <span slot="footer" class="dialog-footer">
                <el-button class="reviewbtn" type="primary" @click="submitReview">提交</el-button>
                <el-button class="reviewbtn" type="primary" @click="dialogVisible1 = false">关闭</el-button>
            </span>
        </el-dialog>
    </div>
</template>
  
<script>
// 引入删除文件接口
import { deleteFile } from '@/request/file.js'
// 引入文件重命名接口
import { renameFile } from '@/request/file.js'
// 引入还原文件接口
import { restoreFile } from '@/request/file.js'
// 引入删除文件接口
import { deleteFile1 } from '@/request/deptFile.js'
// 引入文件重命名接口
import { renameFile1 } from '@/request/deptFile.js'
// 引入还原文件接口
import { restoreFile1 } from '@/request/deptFile.js'
// 引入删除回收站文件接口
import { deleteRecoveryFile } from '@/request/file.js'
// 引入删除回收站部门文件接口
import { deleteRecoveryDeptFile } from '@/request/deptFile.js'
// 引入添加评价接口
import { addReview } from '@/request/deptFile.js'
// 引入查询评价接口
import { getReviews } from '@/request/deptFile.js'


export default {
    name: "FileTable",
    props: {
        // 表格数据
        tableData: {
            type: Array,
            required: true
        },
        tableData1: {
            type: Array,
        },
        // 表格加载状态
        loading: {
            type: Boolean,
            required: true
        },
        // 文件类型
        fileType: {
            type: Number,
            required: true
        }
    },
    data() {
        return {
            //  文件图片Map映射
            fileImgMap: {
                apk: require('@/assets/images/apk.png'),
                csv: require('@/assets/images/csv.png'),
                doc: require('@/assets/images/doc.png'),
                excel: require('@/assets/images/excel.png'),
                exe: require('@/assets/images/exe.png'),
                fold: require('@/assets/images/fold.png'),
                gif: require('@/assets/images/gif.png'),
                html: require('@/assets/images/html.png'),
                json: require('@/assets/images/json.png'),
                mp3: require('@/assets/images/mp3.png'),
                mp4: require('@/assets/images/mp4.png'),
                other: require('@/assets/images/other.png'),
                pdf: require('@/assets/images/pdf.png'),
                ppt: require('@/assets/images/ppt.png'),
                rar: require('@/assets/images/rar.png'),
                svg: require('@/assets/images/svg.png'),
                txt: require('@/assets/images/txt.png'),
                zip: require('@/assets/images/zip.png')
            },
            operaColumnIsFold: sessionStorage.getItem('operaColumnIsFold') || false,//  表格操作列-是否收缩
            dialogVisible: false,
            selectedNotice: null,
            dialogVisible1: false,
            reviews: [],
            userReview: '',
            data1: {
                content: '',
                fileId: 0,
                reviewTime: '',
            },
        }
    },
    computed: {
        // 表格显示列
        selectedColumnList() {
            if (this.fileType === 6 || this.fileType === 13) {
                return this.$store.getters.selectedColumnList1
            } else {
                return this.$store.getters.selectedColumnList
            }
        }
    },
    watch: {
        // 监听收缩状态变化，存储在sessionStorage中，保证页面刷新时仍然保存设置的状态
        operaColumnIsFold(newValue) {
            sessionStorage.setItem('operaColumnIsFold', newValue)
        }
    },
    created() {
        this.operaColumnIsFold = sessionStorage.getItem('operaColumnIsFold') === 'true' //  读取保存的状态
    },
    methods: {
        // 计算文件大小
        calculateFileSize(size) {
            const B = 1024
            const KB = Math.pow(1024, 2)
            const MB = Math.pow(1024, 3)
            const GB = Math.pow(1024, 4)
            if (!size) {
                return '_'
            } else if (size < KB) {
                return (size / B).toFixed(0) + 'KB'
            } else if (size < MB) {
                return (size / KB).toFixed(1) + 'MB'
            } else if (size < GB) {
                return (size / MB).toFixed(2) + 'GB'
            } else {
                return (size / GB).toFixed(3) + 'TB'
            }
        },
        // 还原按钮 - 点击事件
        handleClickRestore(row) {
            // 消息弹框提示用户
            this.$confirm('确认还原选中的文件？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            })
                .then(() => {
                    // 确定按钮 点击事件 调用删除文件接口
                    if (this.fileType < 7) {
                        restoreFile(row).then((res) => {
                            if (res.success) {
                                this.$emit('getTableData') //  刷新文件列表
                                this.$message.success('还原成功')
                            } else {
                                this.$message.error(res.message)
                            }
                        })
                    } else if (this.fileType < 14) {
                        restoreFile1(row).then((res) => {
                            if (res.success) {
                                this.$emit('getTableData') //  刷新文件列表
                                this.$message.success('还原成功')
                            } else {
                                this.$message.error(res.message)
                            }
                        })
                    }
                })
                .catch(() => {
                    //  取消
                    this.$message({
                        type: 'info',
                        message: '已取消还原'
                    })
                })
        },
        // 删除按钮 - 点击事件
        handleClickDelete(row) {
            // 消息弹框提示用户
            this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            })
                .then(() => {
                    // 确定按钮 点击事件 调用删除文件接口
                    if (this.fileType < 6) {
                        deleteFile(row).then((res) => {
                            if (res.success) {
                                this.$emit('getTableData') //  刷新文件列表
                                this.$message.success('删除成功')
                            } else {
                                this.$message.error(res.message)
                            }
                        })
                    } else if (this.fileType === 6) {
                        deleteRecoveryFile(row).then((res) => {
                            if (res.success) {
                                this.$emit('getTableData') //  刷新文件列表
                                this.$message.success('删除成功')
                            } else {
                                this.$message.error(res.message)
                            }
                        })
                    } else if (this.fileType < 13) {
                        deleteFile1(row).then((res) => {
                            if (res.success) {
                                this.$emit('getTableData') //  刷新文件列表
                                this.$message.success('删除成功')
                            } else {
                                this.$message.error(res.message)
                            }
                        })
                    } else if (this.fileType === 13) {
                        deleteRecoveryDeptFile(row).then((res) => {
                            if (res.success) {
                                this.$emit('getTableData') //  刷新文件列表
                                this.$message.success('删除成功')
                            } else {
                                this.$message.error(res.message)
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
        // 移动按钮 - 点击事件
        handleClickMove(row) {
            this.$emit('handleSelectFile', false, row) // true/false 操作类型：批量移动/单文件操作；row 当前行文件数据
            this.$emit('handleMoveFile', true) // true/false 打开/关闭移动文件对话框
        },
        // 重命名按钮 - 点击事件
        handleClickRename(row) {
            var fileName = row.fileName
            this.$prompt('请输入文件名', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                inputValue: fileName,
                inputPattern: /\S/, // 文件名不能为空
                inputErrorMessage: '请输入文件名',
                closeOnClickModal: false
            })
                .then(({ value }) => {
                    // 确定按钮 调用重命名接口
                    if (this.fileType < 7) {
                        renameFile({
                            ...row,
                            fileName: value
                        }).then((res) => {
                            if (res.success) {
                                this.$emit('getTableData') // 刷新文件列表
                                this.$message.success('文件已重命名')
                            } else {
                                this.$message.error(res.message)
                            }
                        })
                    } else if (this.fileType < 14) {
                        renameFile1({
                            ...row,
                            fileName: value
                        }).then((res) => {
                            if (res.success) {
                                this.$emit('getTableData') // 刷新文件列表
                                this.$message.success('文件已重命名')
                            } else {
                                this.$message.error(res.message)
                            }
                        })
                    }
                })
                .catch(() => {
                    this.$message({
                        type: 'info',
                        message: '取消'
                    })
                })
        },
        // 文件名点击事件
        handleFileNameClick(row) {
            //  若是目录则进入目录
            if (row.isDir && this.fileType !== 6 && this.fileType !== 13) {
                if (this.fileType < 7) {
                    this.$router.push({
                        query: {
                            filePath: `${row.filePath}${row.fileName}/`,
                            fileType: 0
                        }
                    })
                } else if (this.fileType < 14) {
                    this.$router.push({
                        query: {
                            filePath: `${row.filePath}${row.fileName}/`,
                            fileType: 7
                        }
                    })
                }

            } else {
                //  若当前点击项是图片
                const PIC = ['png', 'jpg', 'jpeg', 'gif', 'svg']
                if (PIC.includes(row.extendName)) {
                    let data
                    if (this.fileType < 7) {
                        data = {
                            imgReviewVisible: true,
                            imgReviewList: [{
                                fileUrl: `/api${row.fileUrl}`,
                                downloadLink: `/api/filetransfer/downloadfile?userFileId=${row.userFileId}`,
                                fileName: row.fileName,
                                extendName: row.extendName
                            }],
                            activeIndex: 0
                        }
                    } else if (this.fileType < 14) {
                        data = {
                            imgReviewVisible: true,
                            imgReviewList: [{
                                fileUrl: `/api${row.fileUrl}`,
                                downloadLink: `/api/deptfiletransfer/downloadfile?deptFileId=${row.deptFileId}`,
                                fileName: row.fileName,
                                extendName: row.extendName
                            }],
                            activeIndex: 0
                        }
                    }

                    this.$store.commit('setImgReviewData', data)    // 触发图片在线查看
                }
            }
        },
        // 根据文件扩展名设置文件图片
        setFileImg(row) {
            if (!row.extendName) {
                //  文件夹
                return this.fileImgMap.fold
            } else if (['jpg', 'png', 'jpeg'].includes(row.extendName)) {
                // 图片类型，直接显示缩略图
                return this.downloadImgMin(row)
            } else {
                const fileTypeMap = {
                    pptx: 'ppt',
                    doc: 'word',
                    docx: 'doc',
                    xls: 'excel',
                    xlsx: 'excel'
                }
                //  可以识别文件类型的文件
                return this.fileImgMap[row.extendName] || this.fileImgMap[fileTypeMap[row.extendName]] || this.fileImgMap.other
            }
        },
        // 表格行勾选事件
        handleSelectRow(selection) {
            this.$emit('handleSelectFile', true, selection) // true/false 批量移动/单文件操作；selection 勾选的表格行数据
        },
        handleDbClick(row) {
            this.selectedNotice = row
            this.dialogVisible = true
        },
        getReviews(id) {
            getReviews({
                fileId: id
            }).then(
                (res) => {
                    if (res.success) {
                        this.reviews = res.data
                    } else {
                        this.$message.error(res.message)
                    }
                }
            )
        },
        handleClickEvaluation(row) {
            this.getReviews(row.deptFileId)
            this.data1.fileId = row.deptFileId
            this.dialogVisible1 = true
        },
        formatTime(time) {
            const options = {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: 'numeric',
                minute: 'numeric',
                second: 'numeric'
            };
            return time.toLocaleString(undefined, options);
        },
        submitReview() {
            this.data1.content = this.userReview
            this.data1.reviewTime = this.formatTime1(new Date())
            addReview(this.data1).then(
                (res) => {
                    if (res.success) {
                        this.getReviews(this.data1.fileId)
                        this.userReview = ''
                        this.$message.success('评论成功')
                    } else {
                        this.$message.error(res.message)
                    }
                }
            )
        },
        formatTime1(date) {
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            const hours = String(date.getHours()).padStart(2, '0');
            const minutes = String(date.getMinutes()).padStart(2, '0');
            const seconds = String(date.getSeconds()).padStart(2, '0');

            return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
        }

    },
};
</script>

<style lang="stylus" scoped>
.rw {
    max-height: 250px;
    overflow: auto;
}
.review-item {
  margin-bottom: 10px;
}
.review-header {
  display: flex;
  align-items: center;
  margin-bottom: 5px;
}
.avatar {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  margin-right: 10px;
}
.header-info {
  display: flex;
  flex-direction: column;
}
.username {
  font-weight: bold;
}
.time {
  color: gray;
  font-size: 12px;
}
.review-content {
  padding: 10px;
}
.content {
  font-size: 14px;
}
.input-review {
  margin-top: 10px;
}
.reviewbtn {
    margin-top: 10px;
}

.file-table {
  // 调整滚动条样式
  >>> .el-table__body-wrapper {
    setScrollbar(8px, #EBEEF5, #909399);
  }
}
// 表格操作列-表头图标样式调整
.el-icon-circle-plus, .el-icon-remove {
    margin-left: 8px;
    cursor: pointer;
    font-size: 16px;

    &:hover {
        opacity: 0.5;
    }
}
</style>