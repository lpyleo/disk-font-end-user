<template>
  <div class="app-container">
    <el-row :gutter="20" class="container">
      <el-col :span="3" :xs="24" style="visibility: hidden;">
        <el-card></el-card>
      </el-col>
      <el-col :span="6" :xs="24">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>个人信息</span>
          </div>
          <div class="text item">
            <i class="el-icon-user-solid"></i>用户名称
            <span class="pull-right">{{ user.userName }}</span>
          </div>
          <div class="text item">
            <i class="el-icon-mobile-phone"></i>手机号码
            <span class="pull-right">{{ user.telephone }}</span>
          </div>
          <div class="text item">
            <i class="el-icon-message"></i>用户邮箱
            <span class="pull-right">{{ user.email }}</span>
          </div>
          <div class="text item">
            <i class="el-icon-office-building"></i>所属部门
            <span class="pull-right">{{ user.department }}</span>
          </div>
          <div class="text item">
            <i class="el-icon-s-custom"></i>所属角色
            <span class="pull-right">{{ user.role }}</span>
          </div>
        </el-card>
      </el-col>
      <el-col :span="12" :xs="24">
        <el-card>
          <div slot="header" class="clearfix">
            <span>基本资料</span>
          </div>
          <el-tabs v-model="activeTab">
            <el-tab-pane label="基本资料" name="userinfo">
              <UserInfo :user="user" />
            </el-tab-pane>
            <el-tab-pane label="修改密码" name="resetPwd">
              <resetPwd />
            </el-tab-pane>
          </el-tabs>
        </el-card>
      </el-col>
      <el-col :span="3" :xs="24" style="visibility: hidden;">
        <el-card></el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import UserInfo from "./UserInfo.vue";
import ResetPwd from "./ResetPwd.vue";
import { getUserInfo } from "@/request/user";

export default {
  name: "Profile",
  components: { UserInfo, ResetPwd },
  data() {
    return {
      user: {},
      roleGroup: {},
      postGroup: {},
      activeTab: "userinfo"
    };
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
  },
  mounted() {
    this.getInfo()
  }
};
</script>

<style lang="stylus" scoped>
.app-container {
  margin-top: 80px
  .container {
    .box-card {
      width: 100%;
      margin-bottom: 20px;
      box-shadow: 0 1px 6px rgba(0, 0, 0, .05);
      border: none;
      border-radius: 4px;
      .text {
        margin-bottom: 10px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-size: 14px;
        line-height: 1.5;
        i {
          margin-right: 5px;
          font-size: 18px;
          color: #909399;
          display: inline-block;
        }
        .pull-right {
          margin-left: auto;
          color: #606266;
        }
      }
    }
  }
}
</style>
