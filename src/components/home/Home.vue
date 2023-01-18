<script setup lang="ts">
import { ref } from 'vue'

import { deleteUserToken, getUserToken } from '../../utils/authentication'

import { ArrowRight } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'

import { useRouter } from "vue-router"; // 导入路由
import { CreateRoom, JoinRoom } from '../../gqls/room'
const router = useRouter() // 实例化路由

let userID = getUserToken()
// 没有当前用户 id 则去登录页
if (userID == "") {
  router.push("/login")
}
// TODO 检查有没有在某个房间，有的话直接去房间页面

function logout() {
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
    CreateRoom(value).then((value) => {
      // 创建的房间 id
      let roomID = value
      console.log(roomID)
      // 随后加入房间
      JoinRoom(userID, roomID).then((value) => {
        // 跳转到对应房间页面
      router.push({
        path: "/room",
        query: {
          roomID: value.roomID
        }
      })
      })
    })
    ElMessage({
      type: "success",
      message: `创建房间 ${value}，正在进入`,
      showClose: true,
      center: true,
    })
  })
}

const openJoinRoom = () => {
  ElMessageBox.prompt('请输入房间号', {
    confirmButtonText: "加入",
  }).then(({ value }) => {
    // 异步请求处理数据
    JoinRoom(userID, value).then((value) => {
      // 跳转到对应房间页面
      router.push({
        path: "/room",
        query: {
          roomID: value.roomID
        }
      })
    })
    // 提示
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

</script>

<template>
  <el-container>
    <el-header>Header</el-header>
    <el-main>
      <div class="main">
        <el-space direction="vertical" wrap>
          <div class="mainButton">
            <el-button type="primary" :icon="ArrowRight" @click="openCreateRoom">创建房间</el-button>
          </div>
          <div class="mainButton">
            <el-button type="primary" :icon="ArrowRight" @click="openJoinRoom">加入房间</el-button>
          </div>
          <div class="mainButton">
            <el-button type="primary" :icon="ArrowRight" @click="logout()">退出登录</el-button>
          </div>
        </el-space>
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

