<script setup>
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
  }).then(({value}) => {
    ElMessage({
      type: "success",
      message: `创建房间 ${value}`
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
  <h1>"主页"</h1>
  <div :class="buttonList">
    <el-button type="primary" :icon="ArrowRight" @click="openCreateRoom">创建房间</el-button>
    <el-button type="primary" :icon="ArrowRight" @click="openJoinRoom">加入房间</el-button>
    <el-button type="primary" :icon="ArrowRight" @click="logout()">退出登录</el-button>
  </div>
  
</template>

<style scoped>
.read-the-docs {
  color: #888;
}
</style>