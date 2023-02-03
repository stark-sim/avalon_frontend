<script setup lang="ts">
import router from "../router";
import { getUserToken } from "../utils/authentication";
import { GameUser, GetGameUsersByGame } from "../gqls/game";
import {
  GetMissionsByGame,
  PickSquads,
  GetVoteInMission,
} from "../gqls/mission";
import { Mission, Vote } from "../gqls/mission";
import { watch, ref } from "vue";
import { ElMessage } from "element-plus";

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
let shouldFetchVote = ref<boolean>(false);
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
      if (currentMission.value == undefined) {
        currentMission.value = missions.value[i];
        if (currentMission.value.status == "voting") {
          console.log(shouldFetchVote.value);
          shouldFetchVote.value = true;
        }
      }
    }
  }
});
// 队长选人
let pickedUserIDs = ref<string[]>([]);
const pickUserID = (value: string) => {
  pickedUserIDs.value.push(value);
  console.log(pickedUserIDs);
};
const unpickUserID = (value: string) => {
  let i = pickedUserIDs.value.indexOf(value);
  pickedUserIDs.value = pickedUserIDs.value.splice(i, 1);
  console.log(pickedUserIDs.value);
};
// 确认选队
const confirmSquads = () => {
  // 检查是否选好所需人数
  if (currentMission.value?.capacity == pickedUserIDs.value.length) {
    PickSquads(pickedUserIDs, currentMission.value!.id)
      .then((data) => {
        console.log(data);
      })
      .catch((error) => {
        console.log(error);
      });
  } else {
    ElMessage({
      type: "warning",
      message: `请选择${currentMission.value!.capacity}位玩家`,
    });
  }
};
// 用户的投票
let myVote = ref<Vote>();
// 当目前任务的状态时 voting，才可以看要不要投票
let voteResp = GetVoteInMission(userID, "1618249455882280960");
watch(shouldFetchVote, () => {
  console.log(11)
  
})
watch(voteResp, (data) => {
  console.log("voteResp")
  myVote = data.getVoteInMission;
  console.log(myVote);
});
</script>

<template>
  <el-container>
    <el-header>
      <div>游戏 ID: {{ gameID }}</div>
      <el-space direction="horizontal" wrap>
        <div class="missionStyle" v-for="mission in missions" :key="mission.id">
          <el-avatar> {{ mission.sequence }} </el-avatar>
        </div>
      </el-space>
    </el-header>
    <el-main>
      <div class="gameUserRow" v-for="i in midGameUsersCount" :key="i">
        <div v-for="(j, idx) in 2" :key="j">
          <el-avatar
            src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"
          />
          {{ gameUsers[i - 1 + (j == 1 ? 0 : midGameUsersCount)].user.name }}
          <div
            v-if="
              currentMission?.leaderID == userID &&
              currentMission.status == `picking` &&
              pickedUserIDs.length < currentMission?.capacity &&
              !pickedUserIDs.includes(
                gameUsers[i - 1 + (j == 1 ? 0 : midGameUsersCount)].user.id
              )
            "
          >
            <el-button
              @click="
                pickUserID(
                  gameUsers[i - 1 + (j == 1 ? 0 : midGameUsersCount)].user.id
                )
              "
              >选择</el-button
            >
          </div>
          <div
            v-else-if="
              pickedUserIDs.includes(
                gameUsers[i - 1 + (j == 1 ? 0 : midGameUsersCount)].user.id
              )
            "
          >
            <el-button
              @click="
                unpickUserID(
                  gameUsers[i - 1 + (j == 1 ? 0 : midGameUsersCount)].user.id
                )
              "
              >取消</el-button
            >
          </div>
          <div v-else-if="currentMission?.status == `voting`">
            {{ myVote }}
          </div>
        </div>
      </div>
    </el-main>
    <el-footer>
      <div
        v-if="
          currentMission?.leaderID == userID &&
          currentMission.status == `picking`
        "
      >
        <el-button type="primary" @click="confirmSquads">确认选队</el-button>
      </div>
    </el-footer>
  </el-container>
</template>

<style scoped>
.missionStyle {
  flex-direction: column;
}
.gameUserRow {
  display: flex;
  justify-content: space-between;
  width: 100%;
  /* flex-wrap: wrap; */
}
</style>
