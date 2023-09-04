<template>
  <div class="box">
    <el-container>
      <!-- 头部 -->
      <el-header>
        <!-- <img src="../assets/logo .png" alt=""> -->
        <span>精灵购物平台管理系统</span>
        <i class="el-icon-switch-button" @click="loginOut"></i>
      </el-header>
      <el-container>
        <!-- 侧边栏 -->
        <el-aside :width="iscollapse ? '64px' : '200px'">
          <div class="left" @click="leftzd">||| </div>
          <el-menu default-active="2" class="el-menu-vertical-demo" background-color="#303641" text-color="#fff"
            active-text-color="rgb(52,185,255)" style="border: none;" :unique-opened="true" :router="true"
            :collapse="iscollapse" :collapse-transition="false">

            <el-submenu :index="'' + item.id" v-for="(item, index) in metaList" :key="item.id">

              <template slot="title">
                <i :class="iconList[index]"></i>
                <span>{{ item.authName }}</span>
              </template>

              <el-menu-item :index="'' + itemChildren.id" v-for="(itemChildren, indexChildren) in item.children"
                :key="itemChildren.id" :route="{ path: `/home/${itemChildren.path}` }">

                <i class="el-icon-s-unfold"></i>
                {{ itemChildren.authName }}

              </el-menu-item>
            </el-submenu>
          </el-menu>
        </el-aside>
        <el-main>
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
export default {
  props: {

  },
  data() {
    return {
      metaList: [],
      iconList: ['el-icon-user-solid', 'el-icon-menu', 'el-icon-s-goods', 'el-icon-s-order', 'el-icon-s-marketing'],
      iscollapse: false
    };
  },
  methods: {
    // 推出登录回到登录页i
    loginOut() {
      sessionStorage.removeItem('token')
      this.$router.push('/login')
    },
    async getSet() {
      let { data: res } = await this.axios.get('/menus');
      // this.metaList=
      if (res.meta.status == 200) {
        this.metaList = res.data
      }
    },
    // 点击切换折叠与展开 
    leftzd() {
      this.iscollapse = !this.iscollapse
    }
  },
  components: {

  },
  mounted() {
    this.getSet()
  }
};
</script>

<style scoped lang="less">
.box {
  width: 100%;
  height: 100%;
  color: #ffffff;

  .is-vertical {
    width: 100%;
    height: 100%;
    // background: #666;

    .el-header {
      background: url('@/assets/logo .png') no-repeat 20px center;
      background-size: 40px;
      background-color: rgba(53, 60, 62.7);

      display: flex;
      justify-content: space-between;
      align-items: center;

      span {
        font-size: 24px;
        letter-spacing: 3px;
        margin-left: 50px;
      }

      i {
        font-size: 30px;
      }
    }

    .el-container {
      .el-aside {
        background: #303641;

        .left {
          background-color: #475061;
          text-align: center;
          font-size: 12px;
          letter-spacing: 3px;
          line-height: 24px;
          padding: 3px 0;
          cursor: pointer;
        }
      }

      .el-main {
        background: url('@/assets/homebj.png');
        background-size: cover;
        text-align: center;
        color: #fff;
      }
    }
  }
}
</style>
