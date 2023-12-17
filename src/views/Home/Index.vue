<template>
  <div class="home">
    <!-- 左侧菜单 - 区分文件类型 -->
    <SideMenu class="home-left" :storageValue="storageValue"></SideMenu>
    <!-- 右侧内容区 -->
    <div class="home-right">
      <!-- <SelectColumn></SelectColumn> -->
      <div class="operation-wrapper">
        <!-- 操作按钮组件 -->
        <OperationMenu v-if="fileType !== 14" :fileType="fileType" :filePath="filePath"
          :operationFileList="operationFileList" @getTableData="getFileData" @handleUploadFile="handleUploadFile"
          @handleSelectFile="setOperationFile" @handleMoveFile="setMoveFileDialog"></OperationMenu>
        <SearchFile :fileType="fileType" class="searchFile" @search="onSearch"></SearchFile>
        <!-- 使用查看模式切换组件 将 fileType 传递给子组件 -->
        <ShowModel :fileType="fileType"></ShowModel>
        <SelectColumn v-if="fileType !== 14 && fileType !== 6 && fileType !== 13"></SelectColumn>
        <SelectColumn1 v-if="fileType === 6 || fileType === 13"></SelectColumn1>
      </div>
      <!-- 面包屑导航栏 - 显示文件路径 -->
      <BreadCrumb v-if="fileType !== 14" :fileType="fileType"></BreadCrumb>
      <!-- 表格组件 - 文件展示区 v-if 当左侧菜单选择图片且查看模式为"列表"时显示 或 左侧菜单选择的非图片-->
      <FileTable v-if="(fileType === 1 && showModel === 0) || fileType !== 1" :tableData="tableData"
        :tableData1="tableData1" :loading="loading" :fileType="fileType" @getTableData="getFileData"
        @handleSelectFile="setOperationFile" @handleMoveFile="setMoveFileDialog"></FileTable>
      <!-- 网格模式 v-if 当左侧菜单选择图片且查看模式为"网格"时显示 -->
      <FileGrid v-if="(fileType === 1 || fileType === 8) && showModel === 1" :tableData="tableData" :loading="loading"
        :fileType="fileType">
      </FileGrid>
      <!-- 时间线模式 v-if 当左侧菜单选择图片且查看模式为"时间线"时显示 -->
      <FileTimeLine v-if="(fileType === 1 || fileType === 8) && showModel === 2" :tableData="tableData" :loading="loading"
        :fileType="fileType"></FileTimeLine>
      <!-- 分页组件 -->
      <FilePagination :pageData="pageData" @changePageData="changePageData"></FilePagination>
      <!-- 文件上传组件 -->
      <FileUploader ref="globalUploader" @getTableData="getFileData" v-if="fileType < 7"></FileUploader>
      <!-- 文件上传组件 -->
      <DeptFileUploader ref="globalUploader" @getTableData="getFileData" v-if="fileType >= 7 && fileType < 14"></DeptFileUploader>
    </div>
    <!-- 使用移动文件模态框 -->
    <MoveFileDialog :dialogMoveFile="dialogMoveFile" @setSelectFilePath="setSelectFilePath"
      @confirmMoveFile="confirmMoveFile" @handleMoveFile="setMoveFileDialog"></MoveFileDialog>
    <!-- 使用图片在线查看组件 -->
    <ImgReview></ImgReview>
  </div>
</template>

<script>
// 引入左侧菜单组件
import SideMenu from "./components/SideMenu.vue";
// 引入面包屑导航栏
import BreadCrumb from "./components/BreadCrumb.vue";
// 引入文件表格展示区
import FileTable from "./components/FileTable.vue";
// 引入分页组件
import FilePagination from './components/FilePagination.vue'
// 引入控制列显隐组件
import SelectColumn from './components/SelectColumn.vue'
// 引入控制列显隐组件
import SelectColumn1 from './components/SelectColumn1.vue'
// 引入文件上传组件
import OperationMenu from './components/OperationMenu.vue'
// 引入文件上传组件
import FileUploader from './components/FileUploader.vue'
// 引入文件上传组件
import DeptFileUploader from './components/DeptFileUploader.vue'
// 引入移动文件组件
import MoveFileDialog from './components/MoveFileDialog'
// 引入查看模式切换组件
import ShowModel from './components/ShowModel.vue'
// 引入网格组件
import FileGrid from './components/FileGrid.vue'
// 引入时间线模式组件
import FileTimeLine from "./components/FileTimeLine.vue";
// 引入图片在线查看组件
import ImgReview from "@/components/ImgReview";
// 引入搜索框组件
import SearchFile from "./components/SearchFile.vue";

// 引入获取文件列表接口
import { getFileListByPath, getFileListByType } from '@/request/file.js'
// 引入计算文件大小接口
import { getFileStorage } from '@/request/file.js'
// 引入获取文件夹列表 树状结构 接口
import { getFileTree } from '@/request/file.js'
// 引入获取文件列表接口
import { moveFile } from '@/request/file.js'
// 引入批量移动文件接口
import { batchMoveFile } from '@/request/file.js'
// 引入模糊查询接口
import { searchFile } from '@/request/file.js'
// 引入删除的文件接口
import { getDeleteFileList } from "@/request/file.js";

// 引入获取文件列表接口
import { getFileListByPath1, getFileListByType1 } from '@/request/deptFile.js'
// 引入计算文件大小接口
// import { getFileStorage1 } from '@/request/deptFile.js'
// 引入获取文件夹列表 树状结构 接口
import { getFileTree1 } from '@/request/deptFile.js'
// 引入获取文件列表接口
import { moveFile1 } from '@/request/deptFile.js'
// 引入批量移动文件接口
import { batchMoveFile1 } from '@/request/deptFile.js'
// 引入模糊查询接口
import { searchFile1 } from '@/request/deptFile.js'
// 引入查询删除的文件接口
import { getDeleteFileList1 } from "@/request/deptFile.js";

// 引入获取系统通知列表接口
import { getNoticeList } from "@/request/notice";
// 引入系统通知模糊查询接口
import { searchNotice } from "@/request/notice";

export default {
  name: "Home",
  components: {
    SideMenu,
    BreadCrumb,
    FileTable,
    FilePagination,
    SelectColumn,
    SelectColumn1,
    OperationMenu,
    FileUploader,
    DeptFileUploader,
    MoveFileDialog,
    ShowModel,
    FileGrid,
    FileTimeLine,
    ImgReview,
    SearchFile
  },
  data() {
    return {
      loading: false,
      tableData: [], //  文件列表
      tableData1: [], // 系统通知列表
      pageData: {
        currentPage: 1, //   页码
        pageCount: 20, //  每页显示条目个数
        total: 0, //  总数
      },
      storageValue: 0, //  存储空间占用大小
      //  移动文件模态框数据
      dialogMoveFile: {
        visible: false, //  对话框是否显示
        fileTree: [] //  目录树
      },
      isBatch: false, //  是否批量移动
      operationFile: {}, // 单个操作的文件信息
      operationFileList: [], // 批量操作的文件信息
      selectFilePath: '' //  目标路径
    };
  },
  computed: {
    // 左侧菜单选中的文件类型
    fileType() {
      return this.$route.query.fileType ? Number(this.$route.query.fileType) : 0
    },
    // 当前所在路径
    filePath() {
      if (this.$route.query.filePath === undefined) {
        return '/'
      } else {
        return this.$route.query.filePath
      }
    },
    // 查看模式
    showModel() {
      return this.$store.getters.showModel
    }
  },
  watch: {
    fileType() {
      if (this.fileType !== 14) {
        this.getFileData() //  获取文件列表
      } else {
        this.getNoticeLists()
      }
    },
    filePath() {
      // 当左侧菜单选择全部，文件路径发生变化时，再重新获取文件列表
      if (this.fileType === 0 || this.fileType === 7) {
        this.getFileData() //  获取文件列表
      }
    }
  },
  mounted() {
    if (this.fileType !== 14) {
      this.getFileData() //  获取文件列表
    } else {
      this.getNoticeLists()
    }
  },
  methods: {
    // 获取文件列表
    getFileData() {
      this.loading = true // 打开表格loading状态
      if (this.fileType === 0 || this.fileType === 7) {
        // 左侧菜单选择的为 全部 时，根据路径，获取文件列表
        this.loading = false
        this.getFileDataByPath()
      } else if (this.fileType === 6 || this.fileType === 13) {
        this.getDeleteFileList()
      }
      else {
        // 左侧菜单选择的为 除全部以外 的类型时，根据类型，获取文件列表
        this.getFileDataByType()
      }
      this.getStorageValue() // 调用获取文件占用空间函数
    },
    // 获取系统通知列表
    getNoticeLists() {
      getNoticeList({
        currentPage: this.pageData.currentPage,
        pageCount: this.pageData.pageCount
      }).then(
        (res) => {
          this.loading = false //  关闭表格loading状态
          if (res.success) {
            this.tableData1 = res.data.list // 表格数据赋值
            this.pageData.total = res.data.total //  分页组件 - 文件总数赋值
          } else {
            this.$message.error(res.message)
          }
        },
        (error) => {
          this.loading = false
          console.log(error)
        }
      )
      this.getStorageValue() // 调用获取文件占用空间函数
    },
    // 获取文件占用空间
    getStorageValue() {
      getFileStorage().then((res) => {
        // 调用接口
        if (res.success) {
          this.storageValue = res.data ? res.data : 0 //    4.赋值
        } else {
          this.$message.error(res.message)
        }
      })
    },
    // 根据路径获取文件列表
    getFileDataByPath() {
      if (this.fileType < 7) {
        getFileListByPath({
          filePath: this.filePath, // 传递当前路径
          currentPage: this.pageData.currentPage,
          pageCount: this.pageData.pageCount
        }).then(
          (res) => {
            this.loading = false //  关闭表格loading状态
            if (res.success) {
              this.tableData = res.data.list // 表格数据赋值
              this.pageData.total = res.data.total //  分页组件 - 文件总数赋值
            } else {
              this.$message.error(res.message)
            }
          },
          (error) => {
            this.loading = false
            console.log(error)
          }
        )
      } else if (this.fileType < 14) {
        getFileListByPath1({
          filePath: this.filePath, // 传递当前路径
          currentPage: this.pageData.currentPage,
          pageCount: this.pageData.pageCount
        }).then(
          (res) => {
            this.loading = false //  关闭表格loading状态
            if (res.success) {
              this.tableData = res.data.list // 表格数据赋值
              this.pageData.total = res.data.total //  分页组件 - 文件总数赋值
            } else {
              this.$message.error(res.message)
            }
          },
          (error) => {
            this.loading = false
            console.log(error)
          }
        )
      }
    },
    // 根据类型获取文件列表
    getFileDataByType() {
      if (this.fileType < 7) {
        getFileListByType({
          fileType: this.fileType, //  文件类型
          currentPage: this.pageData.currentPage, //  当前页码
          pageCount: this.pageData.pageCount //  每页条目数
        }).then(
          (res) => {
            this.loading = false //  关闭表格loading状态
            if (res.success) {
              this.tableData = res.data.list // 表格数据赋值
              this.pageData.total = res.data.total //  分页组件 - 文件总数赋值
            } else {
              this.$message.error(res.message)
            }
          },
          (error) => {
            this.loading = false
            console.log(error)
          }
        )
      } else if (this.fileType < 14) {
        getFileListByType1({
          fileType: this.fileType, //  文件类型
          currentPage: this.pageData.currentPage, //  当前页码
          pageCount: this.pageData.pageCount //  每页条目数
        }).then(
          (res) => {
            this.loading = false //  关闭表格loading状态
            if (res.success) {
              this.tableData = res.data.list // 表格数据赋值
              this.pageData.total = res.data.total //  分页组件 - 文件总数赋值
            } else {
              this.$message.error(res.message)
            }
          },
          (error) => {
            this.loading = false
            console.log(error)
          }
        )
      }
    },
    // 分页组件 - 页码或当页条目数改变时
    changePageData(pageData) {
      this.pageData.currentPage = pageData.currentPage // 页码赋值
      this.pageData.pageCount = pageData.pageCount //  每页条目数赋值
      if (this.fileType !== 14) {
        this.getFileData() // 获取文件列表
      } else {
        this.getNoticeLists()
      }
    },
    // 上传文件 按钮点击事件
    handleUploadFile() {
      //  触发子组件中的打开文件上传窗口事件
      this.$refs.globalUploader.triggerSelectFileClick()
    },
    /**
     * 设置移动文件时的文件信息
     * @param {Boolean} isBatch 是否批量移动，true 是批量移动，false 是单个文件操作
     * @param {Object | Array} file 需要移动的文件信息，单个操作时为Oject，批量操作时，为Array
     */
    setOperationFile(isBatch, file) {
      this.isBatch = isBatch //  保存操作类型
      if (isBatch) {
        this.operationFileList = file //  批量操作文件
      } else {
        this.operationFile = file //  单个操作文件
      }
    },
    /**
     * 设置移动文件对话框相关数据
     * @param {Boolean} visible 打开/关闭移动文件模态框
     */
    setMoveFileDialog(visible) {
      this.dialogMoveFile.visible = visible //  打开对话框
      if (visible) {
        // 打开对话框时，获取文件夹目录树
        if (this.fileType < 7) {
          getFileTree().then((res) => {
            if (res.success) {
              this.dialogMoveFile.fileTree = [res.data]
            } else {
              this.$message.error(res.message)
            }
          })
        } else if (this.fileType < 14) {
          getFileTree1().then((res) => {
            if (res.success) {
              this.dialogMoveFile.fileTree = [res.data]
            } else {
              this.$message.error(res.message)
            }
          })
        }
      }
    },
    // 设置移动文件的目标路径
    setSelectFilePath(selectFilePath) {
      this.selectFilePath = selectFilePath
    },
    // 移动文件模态框-确定按钮事件
    confirmMoveFile() {
      if (this.isBatch) {
        // 批量移动
        let data = {
          filePath: this.selectFilePath,
          files: JSON.stringify(this.operationFileList)
        }
        if (this.fileType < 7) {
          batchMoveFile(data).then((res) => {
            if (res.success) {
              this.$message.success(res.data)
              this.getFileData() // 刷新文件列表
              this.dialogMoveFile.visible = false // 关闭对话框
              this.operationFileList = []
            } else {
              this.$message.error(res.message)
            }
          })
        } else if (this.fileType < 14) {
          batchMoveFile1(data).then((res) => {
            if (res.success) {
              this.$message.success(res.data)
              this.getFileData() // 刷新文件列表
              this.dialogMoveFile.visible = false // 关闭对话框
              this.operationFileList = []
            } else {
              this.$message.error(res.message)
            }
          })
        }
      } else {
        // 单文件移动
        let data = {
          filePath: this.selectFilePath, // 目标路径
          oldFilePath: this.operationFile.filePath, // 原路径
          fileName: this.operationFile.fileName, // 文件名称
          extendName: this.operationFile.extendName // 文件扩展名
        }
        if (this.fileType < 7) {
          moveFile(data).then((res) => {
            if (res.success) {
              this.$message.success('移动文件成功')
              this.getFileData() // 刷新文件列表
              this.dialogMoveFile.visible = false // 关闭对话框
            } else {
              this.$message.error(res.message)
            }
          })
        } else if (this.fileType < 14) {
          moveFile1(data).then((res) => {
            if (res.success) {
              this.$message.success('移动文件成功')
              this.getFileData() // 刷新文件列表
              this.dialogMoveFile.visible = false // 关闭对话框
            } else {
              this.$message.error(res.message)
            }
          })
        }
      }
    },
    onSearch(keyword) {
      if (this.fileType < 7) {
        searchFile({
          fileName: keyword,
          fileType: this.fileType,
          currentPage: this.pageData.currentPage,
          pageCount: this.pageData.pageCount
        }).then(
          (res) => {
            this.loading = false //  关闭表格loading状态
            if (res.success) {
              this.tableData = res.data.list // 表格数据赋值
              this.pageData.total = res.data.total //  分页组件 - 文件总数赋值
            } else {
              this.$message.error(res.message)
            }
          },
          (error) => {
            this.loading = false
            console.log(error)
          }
        )
      } else if (this.fileType < 14) {
        searchFile1({
          fileName: keyword,
          fileType: this.fileType,
          currentPage: this.pageData.currentPage,
          pageCount: this.pageData.pageCount
        }).then(
          (res) => {
            this.loading = false //  关闭表格loading状态
            if (res.success) {
              this.tableData = res.data.list // 表格数据赋值
              this.pageData.total = res.data.total //  分页组件 - 文件总数赋值
            } else {
              this.$message.error(res.message)
            }
          },
          (error) => {
            this.loading = false
            console.log(error)
          }
        )
      } else if (this.fileType === 14) {
        searchNotice({
          noticeName: keyword,
          currentPage: this.pageData.currentPage,
          pageCount: this.pageData.pageCount
        }).then(
          (res) => {
            this.loading = false //  关闭表格loading状态
            if (res.success) {
              this.tableData1 = res.data.list // 表格数据赋值
              this.pageData.total = res.data.total //  分页组件 - 文件总数赋值
            } else {
              this.$message.error(res.message)
            }
          },
          (error) => {
            this.loading = false
            console.log(error)
          }
        )
      }
    },
    getDeleteFileList() {
      if (this.fileType < 7) {
        getDeleteFileList({
          filePath: this.filePath, // 传递当前路径
          currentPage: this.pageData.currentPage,
          pageCount: this.pageData.pageCount
        }).then(
          (res) => {
            this.loading = false //  关闭表格loading状态
            if (res.success) {
              this.tableData = res.data.list // 表格数据赋值
              this.pageData.total = res.data.total //  分页组件 - 文件总数赋值
            } else {
              this.$message.error(res.message)
            }
          },
          (error) => {
            this.loading = false
            console.log(error)
          }
        )
      } else if (this.fileType < 14) {
        getDeleteFileList1({
          filePath: this.filePath, // 传递当前路径
          currentPage: this.pageData.currentPage,
          pageCount: this.pageData.pageCount
        }).then(
          (res) => {
            this.loading = false //  关闭表格loading状态
            if (res.success) {
              this.tableData = res.data.list // 表格数据赋值
              this.pageData.total = res.data.total //  分页组件 - 文件总数赋值
            } else {
              this.$message.error(res.message)
            }
          },
          (error) => {
            this.loading = false
            console.log(error)
          }
        )
      }
    },
  }
};
</script>

<style lang="stylus" scoped>
.home {
  // 使用flex布局 菜单居左固定宽度 右侧内容区域自适应宽度
  display: flex;

  .home-left {
    box-sizing: border-box;
  }

  .home-right {
    box-sizing: border-box;
    width: calc(100% - 200px);
    padding: 8px 24px;
    flex: 1;
    .operation-wrapper {
      margin-bottom: 16px;
      display: flex;
      align-items: center;
      justify-content: space-between;

      .searchFile {
        margin-right: 200px;
      }

      // 左侧菜单按钮组 样式调整
      >>> .operation-menu-wrapper {
          flex: 1;
      }
    }
  }
}
</style>