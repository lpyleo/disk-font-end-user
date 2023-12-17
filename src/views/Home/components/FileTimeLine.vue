<template>
    <!-- 时间线模式 -->
    <div class="image-timeline-wrapper" v-loading="loading" element-loading-text="加载中……">
        <div class="radio">
            排序：
            <el-radio-group v-model="reverse">
                <el-radio :label="true">倒序</el-radio>
                <el-radio :label="false">正序</el-radio>
            </el-radio-group>
        </div>
        <el-timeline class="image-timeline-list" :reverse="reverse" v-if="imageTimelineData.length">
            <el-timeline-item class="image-timeline-item" v-for="(item, index) in imageTimelineData" :key="index"
                :timestamp="item.uploadDate" color="#409EFF" placement="top">
                <ul class="image-list">
                    <li class="image-item" v-for="(image, imageIndex) in item.imageList" :key="`${index}-${imageIndex}`"
                        :title="`${image.fileName}.${image.extendName}`"
                        @click="handleFileClick(imageIndex, item.imageList)">
                        <img class="image" :src="downloadImgMin(image)" />
                        <div class="image-name">
                            {{ image.fileName }}.{{ image.extendName }}
                        </div>
                    </li>
                </ul>
            </el-timeline-item>
        </el-timeline>
    </div>
</template>
  
<script>
export default {
    name: "FileTimeLine",
    props: {
        // 文件数据
        tableData: {
            type: Array,
            required: true,
        },
        // 加载状态
        loading: {
            type: Boolean,
            required: true,
        },
        // 文件类型
        fileType: {
            type: Number,
            required: true
        }
    },
    data() {
        return {
            reverse: true, //  排序规则 - true 倒序 false 正序
        };
    },
    computed: {
        //  按年-月-日分组排序
        imageTimelineData() {
            let res = [];
            //  去重，获取返回的所有日期年-月-日
            let uploadTimeSet = new Set(
                this.tableData.map((item) => item.uploadTime.split(" ")[0])
            );
            let uploadDate = [...uploadTimeSet];
            //  分组
            uploadDate.forEach((element) => {
                res.push({
                    uploadDate: element,
                    imageList: this.tableData.filter(
                        (item) => item.uploadTime.split(" ")[0] === element
                    ), //  过滤
                });
            });
            return res;
        },
    },
    methods: {
        // 文件点击事件
        handleFileClick(activeIndex, imgList) {
            let data
            if (this.fileType < 7) {
                data = {
                    imgReviewVisible: true,
                    imgReviewList: imgList.map((item) => {
                        return {
                            fileUrl: `/api${item.fileUrl}`,
                            downloadLink: `/api/filetransfer/downloadfile?userFileId=${item.userFileId}`,
                            fileName: item.fileName,
                            extendName: item.extendName
                        }
                    }),
                    activeIndex: activeIndex
                }
            } else if(this.fileType < 14) {
                data = {
                    imgReviewVisible: true,
                    imgReviewList: imgList.map((item) => {
                        return {
                            fileUrl: `/api${item.fileUrl}`,
                            downloadLink: `/api/deptfiletransfer/downloadfile?deptFileId=${item.deptFileId}`,
                            fileName: item.fileName,
                            extendName: item.extendName
                        }
                    }),
                    activeIndex: activeIndex
                }
            }

            this.$store.commit('setImgReviewData', data) //    触发图片在线查看
        }
    }
};
</script>
  
<style lang="stylus" scoped>
@import '~@/assets/style/mixins.styl';

.image-timeline-wrapper {
    height: calc(100vh - 202px);
    overflow-y: auto;
    setScrollbar(8px);

    .image-timeline-list {
        margin-top: 8px;

        .image-timeline-item {
            .image-list {
                display: flex;
                flex-wrap: wrap;
                align-items: flex-start;
                align-content: flex-start;
                list-style: none;

                .image-item {
                    margin: 0 16px 16px 0;
                    width: 120px;
                    padding: 8px;
                    text-align: center;
                    cursor: pointer;

                    &:hover {
                        background: #F5F7FA;
                    }

                    .image {
                        width: 100px;
                        height: 100px;
                    }

                    .image-name {
                        margin-top: 8px;
                        line-height: 24px;
                        font-size: 12px;
                        word-break: break-all;
                        setEllipsis(2);
                    }
                }
            }
        }
    }
}
</style>