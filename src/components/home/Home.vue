<script setup lang="ts">
import { ref } from 'vue'

import { deleteUserToken, getUserToken } from '../../utils/authentication'

import gql from 'graphql-tag'
import { useQuery } from '@vue/apollo-composable'

import { ArrowRight } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'

import { useRouter } from "vue-router"; // 导入路由
const router = useRouter() // 实例化路由

let userID = getUserToken()
// 没有当前用户 id 则去登录页
console.log(userID)
if (userID == null) {
  router.push("/login")
}
// TODO 检查有没有在某个房间，有的话直接去房间页面

function logout() {
  console.log("logout")
  deleteUserToken()
  router.push("/login")
}

const openCreateRoom = () => {
  ElMessageBox({
    title: '创建房间',
    showCancelButton: false,
    confirmButtonText: "创建",
    showInput: true,
    inputPlaceholder: "请输入房间名称",
    center: true,
  }).then(({ value }) => {
    ElMessage({
      type: "success",
      message: `创建房间 ${value}`,
      showClose: true,
      center: true,
    })
  })
}

const openJoinRoom = () => {
  ElMessageBox.prompt('请输入房间号', {
    confirmButtonText: "加入",
  }).then(({ value }) => {
    ElMessage({
      type: "success",
      message: `正在加入 ${value} 房间`
    })
  }).catch(() => {
    ElMessage({
      type: 'info',
      message: `取消加入`
    })
  })
}

function createRoom() {
}

function joinRoom() {

}

</script>

<template>
  <el-container>
    <el-header>Header</el-header>
    <el-main>Main
      <div class="main">
        <div class="mainButton">
          <el-button type="primary" :icon="ArrowRight" @click="openCreateRoom">创建房间</el-button>
        </div>
        <div class="mainButton">
          <el-button type="primary" :icon="ArrowRight" @click="openJoinRoom">加入房间</el-button>
        </div>
        <div class="mainButton">
          <el-button type="primary" :icon="ArrowRight" @click="logout()">退出登录</el-button>
        </div>
      </div>
    </el-main>
  </el-container>
</template>
  
<style scoped>
.read-the-docs {
  color: #888;
}

.mainButton {
  margin-left: 1%;
  margin-top: 3%;
  margin-right: 1%;
  margin-bottom: 3%;
}
</style>

