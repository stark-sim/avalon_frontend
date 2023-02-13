<script setup lang="ts">
import { ref, watch } from "vue";
import { RoomUser } from "../gqls/room";
import router from "../router";
import { getUserToken } from "../utils/authentication";
import { GetRoomUsers } from "../gqls/room";
import { ArrowRight } from "@element-plus/icons-vue";
import { LeaveRoom } from "../gqls/room";
import { GetRoomOngoingGame, CreateGame } from "../gqls/game";
import { getAvatarPathByUserIDAndNumber } from "../logic/game";

// 在房间中维持着 roomID
const props = defineProps<{
  roomID: string;
}>();
let roomID: string = props.roomID!;
let userID = getUserToken();
if (userID == "") {
  router.push("/");
}

// Subscription 来更新房间用户
let roomUsers = ref<RoomUser[]>([]);
let fetchingUsers = ref<boolean>(true);
const response = GetRoomUsers(roomID, fetchingUsers);
let midRoomUsersCount = ref<number>(0);

// 刷新用户列表
watch(response, (data) => {
  roomUsers.value = [];
  let _data = data.getRoomUsers;
  for (let i = 0; i < _data.length; i++) {
    roomUsers.value?.push(_data[i]);
  }
  midRoomUsersCount.value = roomUsers.value.length / 2;
});

// 离开房间，回到主页
const leaveRoom = () => {
  LeaveRoom(userID, roomID).then((data) => {
    router.push("/");
  });
};

// 获取正在进行中的游戏
let fetchingGame = ref<boolean>(true);
const ongoingGameResp = GetRoomOngoingGame(roomID, fetchingGame);
// 监听变化，一旦有游戏被创建，进入游戏页面，停止刷新用户列表和停止获取房间游戏
watch(ongoingGameResp, (data) => {
  if (data.getRoomOngoingGame != null) {
    fetchingUsers.value = false;
    fetchingGame.value = false;
    router.push({
      path: "/game",
      query: {
        gameID: data.getRoomOngoingGame.id,
        assassinChance: data.getRoomOngoingGame.assassinChance,
      },
    });
  }
});

const createGame = () => {
  CreateGame(roomID).then((data) => {
    let gameID = data.id;
    console.log("房间已创建，短号为:\n" + gameID);
  });
};
</script>

<template>
  <el-container>
    <!-- 展示房间信息 -->
    <el-header>
      <div>房间 ID: {{ roomID }}</div>
      <el-button type="primary" :icon="ArrowRight" @click="leaveRoom"
        >退出房间</el-button
      >
    </el-header>
    <!-- 展示玩家 -->
    <el-main>
      <div class="roomUserRow" v-for="i in midRoomUsersCount" :key="i">
        <div v-for="(j, idx) in 2" :key="j">
          <!-- 随机普通头像 -->
          <el-avatar
            :src="
              getAvatarPathByUserIDAndNumber(
                roomUsers[i - 1 + (j == 1 ? 0 : midRoomUsersCount)].user.id,
                i + (j == 1 ? 0 : midRoomUsersCount)
              )
            "
          />
          <!-- 名字 -->
          <div>
            {{ roomUsers[i - 1 + (j == 1 ? 0 : midRoomUsersCount)].user.name }}
          </div>
        </div>
      </div>
    </el-main>
    <el-footer>
      <el-button @click="createGame"> 开始游戏 </el-button>
    </el-footer>
  </el-container>
</template>

<style scoped>
.roomUserRow {
  display: flex;
  justify-content: space-between;
  width: 100%;
  /* flex-wrap: wrap; */
}
</style>
