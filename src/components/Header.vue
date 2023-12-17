<template>
    <el-menu class="header-menu" :default-active="activeIndex" :router="true" mode="horizontal">
        <el-menu-item index="Home" :route="{ name: 'Home', query: { fileType: 0, filePath: '/' } }"
            v-show="isLogin">网盘</el-menu-item>
        <el-menu-item index="PersonalInformation" :route="{ name: 'PersonalInformation' }"
            v-show="isLogin">个人信息</el-menu-item>
        <el-menu-item class="chat" index="Chat" v-show="isLogin" :route="{ name: 'Chat' }">消息</el-menu-item>
        <div v-show="isLogin" class="el-menu-item companyName" @click="handleCompanyClick">{{ companyName }}</div>
        <el-menu-item class="login" index="Login" :route="{ name: 'Login' }" v-show="!isLogin">登录</el-menu-item>
        <!-- <el-menu-item class="register" index="Register" :route="{ name: 'Register' }" v-show="!isLogin">注册</el-menu-item> -->
        <div class="el-menu-item exit" @click="exitButton()" v-show="isLogin">
            退出
        </div>
        <div class="el-menu-item username" v-show="isLogin">
            <el-avatar id="avatar" class="avatar" :src="userAvatar"></el-avatar>
            {{ username }}
        </div>
        <el-dialog :visible.sync="dialogVisible" title="企业信息" width="50%">
            <el-card>
                <h3 slot="header" style="text-align: center">{{ companyName }}</h3>
                <el-row>
                    <el-col :span="24">
                        <p style="text-indent: 2em">{{ companyDetail }}</p>
                    </el-col>
                </el-row>
            </el-card>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="dialogVisible = false">关闭</el-button>
            </span>
        </el-dialog>
    </el-menu>
</template>
  
<script>
import Cookies from "js-cookie";
import { getCompanyInfo } from "@/request/user";

export default {
    name: "Header",
    data() {
        return {
            companyName: '',
            companyDetail: '',
            dialogVisible: false
        };
    },
    mounted() {
        this.getCompanyInfo()
    },
    computed: {
        // 当前激活菜单的 index
        activeIndex() {
            return this.$route.name; //  获取当前路由名称
        },
        // 登录状态
        isLogin() {
            return this.$store.getters.isLogin;
        },
        // 用户名
        username() {
            return this.$store.getters.username;
        },
        userAvatar() {
            return this.$store.getters.userAvatar;
        }
    },
    methods: {
        // 退出登录
        exitButton() {
            Cookies.set("token", "");
            this.$router.push({ path: "/login" }); //  退出登录后跳转到登录页面
            this.$message.success("退出登录成功！");
        },
        getCompanyInfo() {
            getCompanyInfo().then(
                (res) => {
                    if (res.success) {
                        this.companyName = res.data.companyName
                        this.companyDetail = res.data.companyDetail
                    } else {
                        this.$message.error(res.message)
                    }
                }
            )
        },
        handleCompanyClick() {
            this.dialogVisible = true
        }
    }
};
</script>
  
<style lang="stylus" scoped>
  .header-menu {
    padding: 0 24px;
  
    .login, .register, .username, .exit {
      float: right;
    }

    .companyName {
        margin-left: 400px;
        font-weight: bold;
        font-size: 20px;
        color: black;
    }

    .username {
        .avatar {
            margin-right: 8px
        }
    }
  }
  </style>