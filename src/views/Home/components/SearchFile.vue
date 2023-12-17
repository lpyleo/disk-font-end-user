<template>
    <div>
        <el-row :gutter="20">
            <el-col :span="20">
                <el-input v-if="this.fileType !== 14" v-model="searchFileName" placeholder="请输入文件名"
                    @keyup.enter.native="search" clearable size="small"></el-input>
                <el-input v-if="this.fileType === 14" v-model="searchFileName" placeholder="请输入通知名称"
                    @keyup.enter.native="search" clearable size="small"></el-input>
            </el-col>
            <el-col :span="4">
                <el-button type="primary" @click="search" size="small">搜索</el-button>
            </el-col>
        </el-row>
    </div>
</template>

<script>
export default {
    props: {
        // 文件类型
        fileType: {
            type: Number,
            required: true,
        },
    },
    data() {
        return {
            searchFileName: '', // 搜索关键字
        }
    },
    methods: {
        search() {
            this.$emit('search', this.searchFileName)
        }
    }
}
</script>

<style scoped></style>