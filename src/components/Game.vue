<script setup lang="ts">
import router from '../router';
import { getUserToken } from '../utils/authentication';


// 在游戏中维持着 gameID
const props = defineProps<{
  gameID: string
}>()
const gameID: string = props.gameID
let userID = getUserToken()
if (userID == "") {
  router.push("/")
}
// 获取这局游戏的用户，有排序
const gameUsers = 

</script>

<template>
  <el-container>
    <el-header>
      <div> 游戏 ID: {{ gameID }}</div>
    </el-header>
    <el-main>
      <el-space>
        <div>{{ gameUsers }}</div>
      </el-space>
      
    </el-main>
    <el-footer>
      <div>选择</div>
    </el-footer>
  </el-container>
</template>

<style scoped>
</style>