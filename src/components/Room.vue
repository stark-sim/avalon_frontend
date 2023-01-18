<script setup lang="ts">
import { ref, watch } from 'vue'
import { RoomUser } from '../gqls/room';
import router from '../router';
import { getUserToken } from '../utils/authentication';
import { GetRoomUsers } from '../gqls/room'

// 在房间中维持着 roomID
const props = defineProps<{
  roomID: string
}>()
let roomID: string = props.roomID!
console.log(roomID)
let userID = getUserToken()
if (userID == "") {
  router.push("/")
}
// Subscription 来更新房间用户
let roomUsers = ref<RoomUser[]>()
const response = GetRoomUsers(roomID)
// 刷新用户列表
watch(
  response,
  data => {
    roomUsers.value = []
    let _data = data.getRoomUsers
    for (let i = 0; i < _data.length; i++) {
      roomUsers.value?.push(_data[i])
    }
  }
)

</script>

<template>
  <el-container>
    <!-- 展示房间信息 -->
    <el-header>
      <div>房间 ID: {{ roomID }}</div>
    </el-header>
    <!-- 展示玩家 -->
    <el-main>
      <el-space direction="vertical" wrap>
        <div v-for="roomUser in roomUsers">
          {{ roomUser.id }}
          {{ roomUser.user.id }}
          {{ roomUser.user.name }}
          {{ roomUser.user.phone }}
          {{ roomUser.createdAt }}
        </div>
      </el-space>
    </el-main>
  </el-container>
</template>

<style scoped>

</style>