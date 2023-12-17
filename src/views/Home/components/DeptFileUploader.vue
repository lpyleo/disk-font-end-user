<template>
    <div id="global-uploader">
        <!-- 上传组件 -->
        <uploader class="uploader-box" ref="uploader" :options="options" :autoStart="false" @file-added="handleFileAdded"
            @file-progress="onFileProgress" @file-success="handleFileSuccess" @file-error="handleFileError">
            <uploader-unsupport></uploader-unsupport>
            <!-- 选择文件按钮 -->
            <uploader-btn class="select-file-btn" :attrs="attrs" ref="uploadBtn">选择文件</uploader-btn>
            <!-- 正在上传的文件面板 -->
            <uploader-list v-show="panelShow">
                <div class="file-panel" slot-scope="props">
                    <div class="panel-title">
                        <span class="text">上传列表</span>
                        <div class="operate-btn-wrapper">
                            <el-button type="text" title="关闭窗口" icon="el-icon-close" @click="handleClosePanel">
                            </el-button>
                        </div>
                    </div>
                    <!-- 正在上传的文件列表 -->
                    <ul class="file-list">
                        <li class="file-item" v-for="file in props.fileList" :key="file.id">
                            <uploader-file ref="files" :class="`file_${file.id}`" :file="file" :list="true"></uploader-file>
                        </li>
                        <div class="no-file" v-if="!props.fileList.length">
                            <i class="icon-empty-file"></i> 暂无待上传文件
                        </div>
                    </ul>
                </div>
            </uploader-list>
        </uploader>
    </div>
</template>
  
<script>
import SparkMD5 from "spark-md5";
import Cookies from "js-cookie";

export default {
    name: "DeptFileUploader",
    data() {
        return {
            // 上传组件配置项，详细说明 https://github.com/simple-uploader/Uploader/blob/develop/README_zh-CN.md#uploader
            options: {
                target: "api/deptfiletransfer/uploadfile", // 目标上传 URL
                chunkSize: 1024 * 1024, //  每个分片的大小
                fileParameterName: "file", //  上传文件时文件的参数名，默认 file
                maxChunkRetries: 3, //  并发上传数，默认 3
                testChunks: true, //  是否开启分片已存在于服务器的校验
                // 服务器分片校验函数，秒传及断点续传基础
                checkChunkUploadedByResponse: function (chunk, message) {
                    let data = JSON.parse(message).data;
                    if (data.skipUpload) {
                        // 分片已存在于服务器中
                        return true;
                    }
                    return (data.uploaded || []).indexOf(chunk.offset + 1) >= 0;
                },
                headers: {
                    token: Cookies.get("token"),
                },
                query() { },
            },
            attrs: {
                accept: "*", // 可接受的文件类型
            },
            panelShow: false, //  上传文件面板是否显示
        };
    },
    computed: {
        // 全局上传组件 uploader实例
        uploader() {
            return this.$refs.uploader.uploader;
        },
        // 当前所在路径
        filePath() {
            return this.$route.query.filePath ? this.$route.query.filePath : "/";
        },
        // 是否触发上传文件事件
        startUploadFile() {
            return this.$store.state.file.startUploadFile;
        },
    },
    methods: {
        // 触发选择文件按钮的点击事件
        triggerSelectFileClick() {
            this.$refs.uploadBtn.$el.click(); // 触发 选择文件按钮 的点击事件
        },
        // 文件添加 回调函数
        handleFileAdded(file) {
            this.panelShow = true; //  显示文件上传面板
            this.calculateFileMD5(file); //  计算文件MD5值
        },
        /**
         * 文件上传过程 回调函数
         * @param rootFile 成功上传的文件所属的根 Uploader.File 对象，它应该包含或者等于成功上传文件
         * @param file 当前成功的 Uploader.File 对象本身
         * @param chunk Uploader.Chunk 实例，它就是该文件的最后一个块实例，如果你想得到请求响应码的话，chunk.xhr.status 就是
         */
        onFileProgress(rootFile, file, chunk) {
            // 打印文件上传过程中的信息
            console.log(
                `上传中 ${file.name}，chunk：${chunk.startByte / 1024 / 1024} ~ ${chunk.endByte / 1024 / 1024
                }`
            );
        },
        /**
         * 文件上传成功 回调函数
         * @param responseStr 服务端响应内容，永远都是字符串
         */
        handleFileSuccess(rootFile, file, responseStr) {
            let response = JSON.parse(responseStr);
            if (response.success) {
                this.$message.success(`${file.name} - 上传完毕`);
                this.$emit("getTableData"); //  刷新文件列表
            } else {
                this.$message.error(response.message);
            }
        },
        // 文件上传失败 回调函数
        handleFileError(rootFile, file, responseStr) {
            this.$message({
                message: JSON.parse(responseStr).message,
                type: "error",
            });
        },
        // 计算文件MD5值，实现断点续传及秒传
        calculateFileMD5(file) {
            let fileReader = new FileReader();
            let time = new Date().getTime();
            let blobSlice =
                File.prototype.slice ||
                File.prototype.mozSlice ||
                File.prototype.webkitSlice;
            let currentChunk = 0;
            const chunkSize = 1 * 1024 * 1024;
            let chunks = Math.ceil(file.size / chunkSize);
            let spark = new SparkMD5.ArrayBuffer();
            file.pause(); //  暂停上传文件
            loadNext();
            fileReader.onload = (e) => {
                spark.append(e.target.result);
                if (currentChunk < chunks) {
                    currentChunk++;
                    loadNext();
                } else {
                    let md5 = spark.end();
                    this.calculateFileMD5End(md5, file);
                    console.log(
                        `MD5计算完毕：${file.name} \nMD5：${md5} \n分片：${chunks} 大小:${file.size
                        } 用时：${new Date().getTime() - time} ms`
                    );
                }
            };
            fileReader.onerror = function () {
                this.$notify({
                    title: "上传出错",
                    message: `文件${file.name}读取出错，请检查该文件`,
                    type: "error",
                    duration: 2000,
                });
                file.cancel(); //  取消上传且从文件列表中移除。
            };
            function loadNext() {
                let start = currentChunk * chunkSize;
                let end =
                    start + chunkSize >= file.size ? file.size : start + chunkSize;
                fileReader.readAsArrayBuffer(blobSlice.call(file.file, start, end));
            }
        },
        // 文件MD5计算结束
        calculateFileMD5End(md5, file) {
            // 将自定义参数直接加载uploader实例的opts上
            Object.assign(this.uploader.opts, {
                query: {
                    filePath: this.filePath,
                    isDir: 0, // isDir 为 0 表示上传的是文件
                },
            });
            file.uniqueIdentifier = md5;
            file.resume(); //  继续上传文件
        },
        // 关闭上传面板
        handleClosePanel() {
            this.uploader.cancel(); //  取消上传文件
            this.panelShow = false;
        },
    },
};
</script>
  
<style lang="stylus" scoped>
  #global-uploader {
    position: fixed;
    z-index: 20;
    right: 15px;
    bottom: 15px;
  
    .uploader-box {
      width: 520px;
    }
  
    .file-panel {
      background-color: #fff;
      border: 1px solid #e2e2e2;
      border-radius: 7px 7px 0 0;
      box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
  
      .panel-title {
        display: flex;
        height: 40px;
        line-height: 40px;
        padding: 0 16px;
        border-bottom: 1px solid #ddd;
  
        .text {
          padding-left: 0;
          margin-bottom: 0;
          font-size: 16px;
          color: #303133;
        }
  
        .operate-btn-wrapper {
          flex: 1;
          text-align: right;
  
          >>> .el-button {
            *:hover {
              opacity: 0.5;
            }
  
            i[class^=el-icon-] {
              color: #000;
            }
          }
        }
      }
  
      .file-list {
        position: relative;
        height: 240px;
        overflow-x: hidden;
        overflow-y: auto;
        background-color: #fff;
        font-size: 14px;
  
        .file-item {
          background-color: #fff;
  
          >>>.uploader-file-icon {
            display: none;
          }
        }
      }
    }
  
    .no-file {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      font-size: 16px;
    }
  
    /deep/.uploader-file-actions > span {
      margin-right: 6px;
    }
  }
  
  /* 隐藏上传按钮 */
  .select-file-btn {
    display: none;
  }
  </style>