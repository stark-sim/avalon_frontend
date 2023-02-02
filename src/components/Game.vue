<script setup lang="ts">
import router from "../router";
import { getUserToken } from "../utils/authentication";
import { GameUser, GetGameUsersByGame } from "../gqls/game";
import { GetMissionsByGame } from "../gqls/mission";
import { Mission } from "../gqls/mission";
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
let midGameUsersCount = ref<number>(0);
const response = GetGameUsersByGame(gameID);
watch(response, (data) => {
  let _data = data.getGameUsersByGame;
  for (let i = 0; i < _data.length; i++) {
    gameUsers.value?.push(_data[i]);
  }
  midGameUsersCount.value = gameUsers.value.length / 2;
});
// 获取这局游戏的任务状态
let missions = ref<Mission[]>([]);
let missionsResp = GetMissionsByGame(gameID, ref<boolean>(true));
let currentMission = ref<Mission>();
watch(missionsResp, (data) => {
  missions.value = [];
  let tempMissions = data.getMissionsByGame;
  for (let i = 0; i < tempMissions.length; i++) {
    missions.value.push(tempMissions[i]);
    // 当前进行中的任务
    if (
      missions.value[i].status != "closed" &&
      missions.value[i].status != "delayed"
    ) {
      currentMission.value = missions.value[i];
    }
  }
});
// 队长选人
let pickedUserIDs = ref<string[]>([]);
const pickUserID = (value: string) => {
  pickedUserIDs.value.push(value);
};
const unPickUserID = (value: string) => {
  let i = pickedUserIDs.value.indexOf(value);
  pickedUserIDs.value = pickedUserIDs.value
    .slice(0, i)
    .concat(pickedUserIDs.value.slice(i, pickedUserIDs.value.length));
};
</script>

<template>
  <el-container>
    <el-header>
      <div>游戏 ID: {{ gameID }}</div>
      <el-space direction="horizontal" wrap>
        <div :class="mission" v-for="mission in missions">
          <el-avatar> {{ mission.sequence }} </el-avatar>
        </div>
      </el-space>
    </el-header>
    <el-main>
      <el-space direction="vertical" wrap>
        <div v-for="i in midGameUsersCount">
          <el-avatar
            src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"
          />
          {{ gameUsers[i].user.name }}
          <div
            v-if="
              currentMission?.leaderID == userID &&
              pickedUserIDs.length < currentMission.capacity
            "
          >
            <el-button :click="pickUserID">选择</el-button>
          </div>
        </div>
        <div v-for="i in midGameUsersCount">
          <el-avatar
            src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"
          />
          {{ gameUsers[i+midGameUsersCount-1].user.name }}
          <div
            v-if="
              currentMission?.leaderID == userID &&
              pickedUserIDs.length < currentMission.capacity
            "
          >
            <el-button :click="pickUserID">选择</el-button>
          </div>
        </div>
      </el-space>
    </el-main>
    <el-footer>
      <div v-if="currentMission?.leaderID == userID">
        <el-button type="primary">确认选队</el-button>
      </div>
    </el-footer>
  </el-container>
</template>

<style scoped>
.mission {
  flex-direction: column;
}
</style>
