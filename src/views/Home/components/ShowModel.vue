<template>
  <div class="change-file-model">
    <!-- v-if 只有左侧菜单选择图片时 才展示此组件 -->
    <el-radio-group v-if="fileType === 1 || fileType === 8" v-model="currentshowModel" size="mini">
      <el-radio-button :label="0">
        <i class="el-icon-tickets"></i> 列表
      </el-radio-button>
      <el-radio-button :label="1">
        <i class="el-icon-s-grid"></i> 网格
      </el-radio-button>
      <el-radio-button :label="2">
        <i class="el-icon-date"></i> 时间线
      </el-radio-button>
    </el-radio-group>
  </div>
</template>
  
<script>
export default {
  name: "ShowModel",
  props: {
    // 文件类型
    fileType: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {};
  },
  computed: {
    //  查看模式 - 0 列表 | 1 网格 | 2 时间线
    currentshowModel: {
      get() {
        return this.$store.getters.showModel;
      },
      set(val) {
        this.$store.commit("changeShowModel", val); //  修改查看模式
      },
    },
  },
};
</script>
  
<style lang="stylus" scoped>
.change-file-model {
    margin-right: 16px;
}
</style>