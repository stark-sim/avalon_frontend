<script setup lang="ts">
import { ref } from 'vue'
import { RoomUser } from '../gqls/room';
import router from '../router';
import { getUserToken } from '../utils/authentication';
import { GetRoomUsers } from '../gqls/room'

// 在房间中维持着 roomID
let roomID: string = "1614667364896677888"
let userID = getUserToken()
if (userID == "") {
  router.push("/")
}
// Subscription 来更新房间用户
// let roomUsers = ref<RoomUser>()
console.log("fine at here")
GetRoomUsers(roomID)

</script>

<template>
  <el-container>
    <!-- 展示房间信息 -->
    <el-header>
      <div>{{ roomID }}</div>
    </el-header>
    <!-- 展示玩家 -->
    <el-main>
      <el-space direction="vertical" wrap>
        <div></div>
      </el-space>
    </el-main>
  </el-container>
</template>

<style scoped>

</style>