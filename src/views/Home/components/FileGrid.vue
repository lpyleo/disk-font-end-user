<template>
    <ul class="file-list" v-loading="loading" element-loading-text="加载中……">
        <li class="file-item" v-for="(item, index) in tableData" :key="index" :title="`${item.fileName}.${item.extendName}`"
            @click="handleFileClick(index, tableData)">
            <img class="file-img" :src="downloadImgMin(item)" />
            <div class="file-name">{{ item.fileName }}.{{ item.extendName }}</div>
        </li>
    </ul>
</template>
  
<script>
export default {
    name: "FileGrid",
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
        return {};
    },
    methods: {
        // 文件点击事件
        handleFileClick(activeIndex, imgList) {
            // 图片分类下 - 大图查看
            let data
            if (this.fileType === 1) {
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
            }
            if (this.fileType === 8) {
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

.file-list {
    height: calc(100vh - 202px);
    display: flex;
    flex-wrap: wrap;
    align-items: flex-start;
    align-content: flex-start;
    list-style: none;
    overflow-y: auto;
    setScrollbar(8px, #EBEEF5, #909399);

    .file-item {
        margin: 16px 16px 0 0;
        border-radius: 4px;
        width: 120px;
        padding: 8px;
        cursor: pointer;
        text-align: center;

        &:hover {
            background: #F5F7FA;
        }

        .file-img {
            width: 100px;
            height: 100px;
        }

        .file-name {
            line-height: 24px;
            font-size: 12px;
            word-break: break-all;
            setEllipsis(2);
        }
    }
}
</style>