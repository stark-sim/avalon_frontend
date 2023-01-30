<script setup lang="ts">
import router from "../router";
import { getUserToken } from "../utils/authentication";
import { GameUser, GetGameUsersByGame, GetMissionsByGame } from "../gqls/game";
import { watch, ref } from "vue";

// 在游戏中维持着 gameID
const props = defineProps<{
  gameID: string;
}>();
const gameID: string = props.gameID;
let userID = getUserToken();
if (userID == "") {
  router.push("/");
}
// 获取这局游戏的用户，有排序
let gameUsers = ref<GameUser[]>([]);
const response = GetGameUsersByGame(gameID);
watch(response, (data) => {
  let _data = data.getGameUsersByGame;
  for (let i = 0; i < _data.length; i++) {
    gameUsers.value?.push(_data[i]);
  }
});
// 获取这局游戏的任务状态
let missions = ref<any>([])
let missionsResp = GetMissionsByGame(gameID, ref<boolean>(true))
let currentMission = ref<any>()
watch(
  missionsResp,
  data => {
    missions.value = []
    let tempMissions = data.getMissionsByGame
    for (let i = 0; i < tempMissions.length; i++) {
      missions.value.push(tempMissions[i])
    }
  }
)
</script>

<template>
  <el-container>
    <el-header>
      <div>游戏 ID: {{ gameID }}</div>
      <div>{{ missions }}</div>
    </el-header>
    <el-main>
      <el-space direction="vertical" wrap>
        <div v-for="gameUser in gameUsers">
          <el-avatar
            src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"
          />
          {{ gameUser.id }}
          {{ gameUser.number }}
          {{ gameUser.user.id }}
          {{ gameUser.user.name }}
          {{ gameUser.user.phone }}
          {{ gameUser.createdAt }}
        </div>
      </el-space>
    </el-main>
    <el-footer>
      <div>
        <el-button type="primary">确认选队</el-button>
      </div>
    </el-footer>
  </el-container>
</template>

<style scoped></style>
