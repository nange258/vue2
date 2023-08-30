<template>
  <div class="box">
    <el-form :model="Login" ref="ruleForm" :rules="rules">
      <el-form-item prop="name">
        <el-input v-model="Login.name" prefix-icon="el-icon-user-solid"></el-input>
      </el-form-item>
      <el-form-item prop="pwd">
        <el-input v-model="Login.pwd" prefix-icon="el-icon-lock" show-password></el-input>
      </el-form-item>
      <el-button type="primary" @click="submitForm('ruleForm')">登录 </el-button>
      <el-button @click="resetForm('ruleForm')">重置</el-button>
    </el-form>

  </div>
</template>

<script>
export default {
  props: {

  },
  data() {
    return {

      Login: {
        name: 'admin',
        pwd: '123456',
        type: ''
      },
      rules: {
        name: [
          { required: true, message: '用户名称', trigger: 'blur' },
          { min: 4, max: 10, message: '长度在 4 到 10 个字符', trigger: 'blur' }
        ],
        pwd: [
          { required: true, message: '用户密码', trigger: 'blur' },
          { min: 6, max: 12, message: '长度在 6 到 12 个字符', trigger: 'blur' }
        ],
      },
    };
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          let { data: res } = await this.axios.post('/login', {
            username: this.Login.name,
            password: this.Login.pwd,
          })
          if (res.meta.status == 200) {
            sessionStorage.setItem('token', res.data.token)
            this.$message({
              message: '登录成功',
              type: 'success',
              duration: 500,
              onClose: () => {
                this.$router.push('/home')
              }

            });
          }
          // console.log(res);
          // alert('submit!');
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    }, resetForm(formName) {
      this.$refs[formName].resetFields();
    }
  },
  components: {

  },
};
</script>

<style scoped lang="less">
.box {
  width: 100%;
  height: 100%;
  // background: #6666;
  background: url(../assets/bj.jpg);
  background-size: cover;
  display: flex;
  justify-content: center;
  align-items: center;

  .el-form {
    width: 350px;
    background-color: rgba(99, 97, 97, 0.5);
    border-radius: 20px;
    box-sizing: border-box;
    padding: 30px;
    // padding: 20px 20px 10px 20px;
  }
}
</style>
