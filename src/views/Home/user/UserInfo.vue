<template>
  <el-form ref="form" :model="userInfo" :rules="rules" label-width="80px">
    <el-form-item label="用户昵称" prop="userName">
      <el-input v-model="userInformation.userName" maxlength="30" />
    </el-form-item>
    <el-form-item label="手机号码" prop="telephone">
      <el-input v-model="userInformation.telephone" maxlength="11" />
    </el-form-item>
    <el-form-item label="邮箱" prop="email">
      <el-input v-model="userInformation.email" maxlength="50" />
    </el-form-item>
    <el-form-item label="性别">
      <el-radio-group v-model="userInformation.sex">
        <el-radio label="0">男</el-radio>
        <el-radio label="1">女</el-radio>
      </el-radio-group>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" size="mini" @click="submit">保存</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import { updateUserInfo } from '@/request/user';
import { Message } from 'element-ui';

export default {
  props: {
    user: {
      type: Object
    }
  },
  data() {
    return {
      // 表单校验
      rules: {
        userName: [
          { required: true, message: "用户昵称不能为空", trigger: "blur" }
        ],
        email: [
          { required: true, message: "邮箱地址不能为空", trigger: "blur" },
          {
            type: "email",
            message: "请输入正确的邮箱地址",
            trigger: ["blur", "change"]
          }
        ],
        telephone: [
          { required: true, message: "手机号码不能为空", trigger: "blur" },
          {
            pattern: /^1[3|4|5|6|7|8|9][0-9]\d{8}$/,
            message: "请输入正确的手机号码",
            trigger: "blur"
          }
        ]
      },
      userInformation: {}
    };
  },
  computed: {
    userInfo() {
      return this.user
    }
  },
  watch: {
    userInfo: {
      immediate: true,
      deep: true,
      handler(newValue) {
        this.userInformation = newValue
      }
    }
  },
  methods: {
    submit() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          updateUserInfo(this.userInformation).then(res => {
            if(res.success){
              Message.success("修改成功");
            } else {
              Message.error("修改失败");
            }
          });
        }
      });
    }
  },
  created() {
  }
};
</script>
