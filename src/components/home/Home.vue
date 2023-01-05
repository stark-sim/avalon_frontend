<script setup>
import { ref } from 'vue'

import { getUserToken } from '../../utils/authentication'

import gql from 'graphql-tag'
import { useQuery } from '@vue/apollo-composable'

import {useRouter} from "vue-router"; // 导入路由
const router = useRouter() // 实例化路由

let userID = getUserToken()
// 没有当前用户 id 则去登录页
console.log(userID)
if (userID == null) {
  router.push("/login")
}

</script>

<template>
  <h1>"主页"</h1>
</template>

<style scoped>
.read-the-docs {
  color: #888;
}
</style>