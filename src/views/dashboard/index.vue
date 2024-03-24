<template>
  <div class="app-container">
    <div class="sys-title">
      <h5 class="header-left">教务管理系统</h5>
      <div class="header-right">
        <span>{{ showName() }}</span>
        <el-dropdown-item divided @click.native="logout">
          <span>Log Out</span>
        </el-dropdown-item>
        <!-- <span @click.native="logout">退出</span> -->
      </div>
    </div>
    <el-container style="height: 100%" direction="vertical">
      <el-container>
        <el-row class="tac">
          <el-col :span="100">
            <h5>教务管理</h5>
            <el-menu
              class="el-menu-vertical-demo"
              :default-active="defaultActive"
              :router="true"
            >
              <el-menu-item
                index="/redirect/course"
                v-show="isTeacherVisible()"
              >
                <template slot="title">
                  <i class="el-icon-location"></i>
                  <span>课程管理</span>
                </template>
              </el-menu-item>
              <el-menu-item index="/redirect/bill" v-show="isTeacherVisible()">
                <template slot="title">
                  <i class="el-icon-menu"></i>
                  <span slot="title">账单管理</span>
                </template>
              </el-menu-item>
              <el-menu-item
                index="/redirect/studentCourse"
                v-show="isStudentVisible()"
              >
                <i class="el-icon-document"></i>
                <span slot="title">我的课程</span>
              </el-menu-item>
              <el-menu-item
                index="/redirect/studentBill"
                v-show="isStudentVisible()"
              >
                <i class="el-icon-setting"></i>
                <span slot="title">我的账单</span>
              </el-menu-item>
            </el-menu>
          </el-col>
        </el-row>
        <el-main style="height: 100%">
          <router-view> </router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import store from "@/store";
import router from "@/router";
export default {
  data() {
    return {
      defaultActive: "",
    };
  },
  created() {
    this.defaultActive = this.$route.path;
    // if (store.getters.tokenType == "teacher") {
    //   this.defaultActive = "/redirect/course";
    // } else {
    //   this.defaultActive = "/redirect/studentCourse";
    // }
  },

  methods: {
    handleOpen(key, keyPath) {
      console.log(key, keyPath);
    },
    handleClose(key, keyPath) {
      console.log(key, keyPath);
    },
    showName() {
      return localStorage.getItem("name");
    },
    isTeacherVisible() {
      // 进行计算判断，返回 true 或 false 控制菜单项显示与隐藏
      // 这里可以根据 item 的不同值进行不同的计算逻辑
      if (store.getters.tokenType === "teacher") {
        return true; // 显示菜单项 1
      } else {
        return false; // 隐藏其他菜单项
      }
    },
    isStudentVisible() {
      // 进行计算判断，返回 true 或 false 控制菜单项显示与隐藏
      // 这里可以根据 item 的不同值进行不同的计算逻辑
      if (store.getters.tokenType === "student") {
        return true; // 显示菜单项 1
      } else {
        return false; // 隐藏其他菜单项
      }
    },
    async logout() {
      await this.$store.dispatch("user/logout");
      router.push(`/login`);
    },
  },
};
</script>
<style  lang="scss">
.sys-title {
  display: flex;
  justify-content: space-between;
  background-color: rgb(204, 231, 238);
  font-size: 20px; /* 设置字体大小为 20 像素 */
  font-weight: bold; /* 设置字体加粗 */
  border: 2px solid;
  border-radius: 18px;
}
.header-left {
  text-align: left;
  padding-left: 3%;
}
.header-right {
  text-align: right;
  padding-top: 1.5%;
  padding-right: 3%;
}
.app-container {
  height: 100%;
}
.el-container {
  height: 100%;
  padding-right: 3%;
}
html,
body,
#app,
.el-container {
  padding: 0px;
  margin: 0px;
  height: 100%;
}
</style>