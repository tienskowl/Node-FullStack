<template>
  <div class="login-container">
    <el-card header="请先登录" class="login-card">
      <el-form @submit.native.prevent="login">
        <el-form-item label="用户名">
          <el-input v-model="model.username"></el-input> </el-form-item
        ><el-form-item label="密码">
          <el-input
            type="password"
            v-model="model.password"
          ></el-input> </el-form-item
        ><el-form-item>
          <el-button type="primary" native-type="submit">登录</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      model: {}
    };
  },
  methods: {
    async login() {
      //   console.log(this.model);
      const res = await this.$http.post('login', this.model);
      // 捕获带message的错误一般使用全局捕获
      // 转$http的定义

      // 保存token
      localStorage.token = res.data.token;
      this.$router.push('/');
      this.$message({
        type: 'success',
        message: '登录成功'
      });
    }
  }
};
</script>

<style>
.login-container {
}
.login-card {
  width: 40rem;
  margin: 10rem auto;
}
</style>
