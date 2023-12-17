<template>
    <el-menu class="side-menu" :default-active="activeIndex" :router="true" :collapse="isCollapse"
        background-color="#545c64" text-color="#fff" active-text-color="#ffd04b">
        <div class="fold-wrapper">
            <!-- click事件 当点击时切换菜单的收缩状态 -->
            <i class="el-icon-s-unfold" v-if="isCollapse" title="展开" @click="isCollapse = false"></i>
            <i class="el-icon-s-fold" v-else title="收缩" @click="isCollapse = true"></i>
        </div>
        <el-submenu index="myFile" class="my-file">
            <template slot="title">
                <i class="el-icon-files"></i>
                <span slot="title">我的文件</span>
            </template>
            <el-menu-item index="0" :route="{ name: 'Home', query: { fileType: 0, filePath: '/' } }">
                <i class="el-icon-menu"></i>
                <span slot="title">全部</span>
            </el-menu-item>
            <el-menu-item index="1" :route="{ name: 'Home', query: { fileType: 1 } }">
                <i class="el-icon-picture"></i>
                <span slot="title">图片</span>
            </el-menu-item>
            <el-menu-item index="2" :route="{ name: 'Home', query: { fileType: 2 } }">
                <i class="el-icon-document"></i>
                <span slot="title">文档</span>
            </el-menu-item>
            <el-menu-item index="3" :route="{ name: 'Home', query: { fileType: 3 } }">
                <i class="el-icon-video-camera-solid"></i>
                <span slot="title">视频</span>
            </el-menu-item>
            <el-menu-item index="4" :route="{ name: 'Home', query: { fileType: 4 } }">
                <i class="el-icon-headset"></i>
                <span slot="title">音乐</span>
            </el-menu-item>
            <el-menu-item index="5" :route="{ name: 'Home', query: { fileType: 5 } }">
                <i class="el-icon-takeaway-box"></i>
                <span slot="title">其他</span>
            </el-menu-item>
            <el-menu-item index="6" :route="{ name: 'Home', query: { fileType: 6 } }">
                <i class="el-icon-delete"></i>
                <span slot="title">回收站</span>
            </el-menu-item>
        </el-submenu>
        <el-submenu index="departmentFile" class="department-file">
            <template slot="title">
                <i class="el-icon-files"></i>
                <span slot="title">{{ user.department }}文件</span>
            </template>
            <el-menu-item index="7" :route="{ name: 'Home', query: { fileType: 7, filePath: '/' } }">
                <i class="el-icon-menu"></i>
                <span slot="title">全部</span>
            </el-menu-item>
            <el-menu-item index="8" :route="{ name: 'Home', query: { fileType: 8 } }">
                <i class="el-icon-picture"></i>
                <span slot="title">图片</span>
            </el-menu-item>
            <el-menu-item index="9" :route="{ name: 'Home', query: { fileType: 9 } }">
                <i class="el-icon-document"></i>
                <span slot="title">文档</span>
            </el-menu-item>
            <el-menu-item index="10" :route="{ name: 'Home', query: { fileType: 10 } }">
                <i class="el-icon-video-camera-solid"></i>
                <span slot="title">视频</span>
            </el-menu-item>
            <el-menu-item index="11" :route="{ name: 'Home', query: { fileType: 11 } }">
                <i class="el-icon-headset"></i>
                <span slot="title">音乐</span>
            </el-menu-item>
            <el-menu-item index="12" :route="{ name: 'Home', query: { fileType: 12 } }">
                <i class="el-icon-takeaway-box"></i>
                <span slot="title">其他</span>
            </el-menu-item>
            <el-menu-item index="13" :route="{ name: 'Home', query: { fileType: 13 } }">
                <i class="el-icon-delete"></i>
                <span slot="title">回收站</span>
            </el-menu-item>
        </el-submenu>
        <el-menu-item class="information" index="14" :route="{ name: 'Home', query: { fileType: 14 } }">
            <i class="el-icon-chat-dot-round"></i>
            <span slot="title">系统通知</span>
        </el-menu-item>
        <div class="storage-wrapper" v-show="!isCollapse">
            <el-progress :percentage="storagePercentage" :color="storageColor" :show-text="false"></el-progress>
            <div class="text">
                <span>存储</span>
                <span>{{ storageValue | storageTrans }} /
                    {{ storageMaxValue | storageTrans(true) }}</span>
            </div>
        </div>
    </el-menu>
</template>
  
<script>
import { getUserInfo } from '@/request/user';

export default {
    name: "SideMenu",
    props: {
        storageValue: {
            type: Number,
            required: true
        }
    },
    data() {
        return {
            isCollapse: false, //  控制菜单收缩展开
            storageMaxValue: Math.pow(1024, 3) * 100, //  最大存储容量，1GB
            //  自定义进度条颜色，不同占比，进度条颜色不同
            storageColor: [
                { color: '#67C23A', percentage: 50 },
                { color: '#E6A23C', percentage: 80 },
                { color: '#F56C6C', percentage: 100 }
            ],
            user: {}
        };
    },
    computed: {
        // 当前激活菜单的 index
        activeIndex() {
            return String(this.$route.query.fileType); //  获取当前路由参数中包含的文件类型
        },
        // 存储百分比
        storagePercentage() {
            return (this.storageValue / this.storageMaxValue) * 100
        }
    },
    watch: {
        // 监听收缩状态变化，存储在sessionStorage中，保证页面刷新时仍然保存设置的状态
        isCollapse(newValue) {
            sessionStorage.setItem("isCollapse", newValue);
        },
    },
    filters: {
        // 计算空间占比
        storageTrans(size, status) {
            const B = 1024
            const KB = Math.pow(1024, 2)
            const MB = Math.pow(1024, 3)
            const GB = Math.pow(1024, 4)
            if (status) {
                //    截取整数部分
                if (!size) {
                    return 0 + 'KB'
                } else if (size < KB) {
                    return (size / B).toFixed(0) + 'KB'
                } else if (size < MB) {
                    return (size / KB).toFixed(0) + 'MB'
                } else if (size < GB) {
                    return (size / MB).toFixed(0) + 'GB'
                } else {
                    return (size / GB).toFixed(0) + 'TB'
                }
            } else {
                if (!size) {
                    return 0 + 'KB'
                } else if (size < KB) {
                    return (size / B).toFixed(0) + 'KB'
                } else if (size < MB) {
                    return (size / KB).toFixed(2) + 'MB'
                } else if (size < GB) {
                    return (size / MB).toFixed(3) + 'GB'
                } else {
                    return (size / GB).toFixed(4) + 'TB'
                }
            }
        }
    },
    created() {
        this.isCollapse = sessionStorage.getItem("isCollapse") === "true"; //  读取保存的状态
    },
    mounted() {
        this.getInfo();
    },
    methods: {
        getInfo() {
            getUserInfo().then((res) => {
                if (res.success) {
                    this.user = res.data
                } else {
                    this.$message.error(res.message)
                }
            })
        }
    }
};
</script>

<style lang="stylus" scoped>
@import '~@/assets/style/mixins.styl';

.side-menu {
    position: relative;
    // 高度设置为屏幕高度减去顶部导航栏的高度
    height: calc(100vh - 61px);
    overflow: auto;
    // 调整滚动条样式
    // setScrollbar(6px, #909399, #EBEEF5);

    // 折叠图标调整样式
    .fold-wrapper {
        height: 56px;
        line-height: 56px;
        padding: 0 20px;
        text-align: right;
        color: #fff;
        font-size: 24px;

        .el-icon-s-unfold, .el-icon-s-fold {
            cursor: pointer;

            &:hover {
                opacity: 0.5;
            }
        }
    }

    .information {
        margin-bottom: 100px
    }

    // 存储空间展示区
    .storage-wrapper {
        position: fixed;
        bottom: 0;
        left: 0;
        box-sizing: border-box;
        width: 199px;
        padding: 16px;
        z-index: 2;
        color: #fff;
        opacity: 1;
        background-color: #909399;
        border-radius: 3px;

        .text {
            margin-top: 8px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            font-size: 14px;
        }
    }
}

// 对展开状态下的菜单设置宽度
.side-menu:not(.el-menu--collapse) {
    width: 200px;
}
</style>