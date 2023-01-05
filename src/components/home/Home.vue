<script setup>
import { ref } from 'vue'

import { deleteUserToken, getUserToken } from '../../utils/authentication'

import gql from 'graphql-tag'
import { useQuery } from '@vue/apollo-composable'

import { ArrowRight } from '@element-plus/icons-vue'

import { useRouter } from "vue-router"; // 导入路由
const router = useRouter() // 实例化路由

let userID = getUserToken()
// 没有当前用户 id 则去登录页
console.log(userID)
if (userID == null) {
  router.push("/login")
}

function logout() {
  console.log("logout")
  deleteUserToken()
  router.push("/login")
}

</script>

<template>
  <h1>"主页"</h1>
  <el-button type="primary" :icon="ArrowRight" @click="">创建房间</el-button>
  <el-button type="primary" :icon="ArrowRight" @click="">加入房间</el-button>
  <el-button type="primary" :icon="ArrowRight" @click="logout()">登出</el-button>
</template>

<style scoped>
.read-the-docs {
  color: #888;
}
</style>