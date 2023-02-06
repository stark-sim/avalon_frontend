<script setup lang="ts">
import router from "../router";
import { getUserToken } from "../utils/authentication";
import { GameUser, GetGameUsersByGame } from "../gqls/game";
import {
  GetMissionsByGame,
  PickSquads,
  GetVoteInMission,
  VoteIt,
  GetSquadInMission,
  ActIt,
} from "../gqls/mission";
import { Mission, Vote, Squad } from "../gqls/mission";
import { watch, ref, Ref } from "vue";
import { ElMessage } from "element-plus";
import { shouldUpdateCurrenMission } from "../logic/mission";

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
const gameUsersResp = GetGameUsersByGame(gameID);
watch(gameUsersResp, (data) => {
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
let shouldFetchSquad = ref<boolean>(false);
let currentMissionStatus = ref<string>("picking");
let gameStatus = ref<string>("onMission"); // onMission onAssassination onEnd
watch(missionsResp, (data) => {
  missions.value = [];
  let tempMissions = data.getMissionsByGame;
  // 计算游戏状态
  let failedCount = 0
  let closedCount = 0
  for (let i = 0; i < tempMissions.length; i++) {
    // 统计游戏所有任务的状态已判断是否进入刺杀环节或结算环节
    if (tempMissions[i].closed) {
      closedCount++
    }
    if (tempMissions[i].failed) {
      failedCount++
    }
    // 更新 ref
    missions.value.push(tempMissions[i]);
    // 当前进行中的任务
    if (
      currentMission.value == undefined ||
      shouldUpdateCurrenMission(currentMission, missions.value[i])
    ) {
      currentMission.value = missions.value[i];
      if (currentMission.value.status == "voting") {
        shouldFetchVote.value = true;
      } else if (currentMission.value.status == "acting") {
        shouldFetchSquad.value = true;
      }
      currentMissionStatus.value = missions.value[i].status;
    }
  }
  // 循环结算判断状态
  if (failedCount == 3) {
    // 失败了三次
    gameStatus.value = "onEnd"
  } else if (closedCount - failedCount == 3) {
    // 胜利了三次
    gameStatus.value = "onAssassination"
  }
});
// 弹窗进行刺杀或结算逻辑 始
watch(gameStatus, (data) => {
  console.log("游戏状态变==================================================")
  console.log(gameStatus)
})
// 弹窗进行刺杀或结算逻辑 完
// 队长选人
let pickedUserIDs = ref<string[]>([]);
const pickUserID = (value: string) => {
  pickedUserIDs.value.push(value);
};
const unpickUserID = (value: string) => {
  let i = pickedUserIDs.value.indexOf(value);
  pickedUserIDs.value.splice(i, 1);
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
let voteResp = ref<any>();
let isVoted = ref<boolean>(false);
let isPassed = ref<boolean>(false);
watch(shouldFetchVote, () => {
  voteResp = GetVoteInMission(userID, currentMission.value!.id);
  watch(voteResp, (data) => {
    myVote = data.getVoteInMission;
    isVoted.value = data.getVoteInMission.voted;
    isPassed.value = data.getVoteInMission.pass;
  });
});
// 投票
const vote = (pass: boolean, myVoteID: string) => {
  VoteIt(pass, myVoteID).then((data) => {
    myVote = data;
    isVoted.value = data.voted;
    isPassed.value = data.pass;
  });
};
// 用户的行动
let mySquad = ref<Squad>();
// 当目前任务的状态时 acting，才可以看要不要行动
let SquadResp = ref<any>();
let isActed = ref<boolean>(false);
let isRat = ref<boolean>(false);
let shouldAct = ref<boolean>(false);
watch(shouldFetchSquad, () => {
  SquadResp = GetSquadInMission(userID, currentMission.value!.id);
  watch(SquadResp, (data) => {
    mySquad = data.getSquadInMission;
    if (data.getSquadInMission != null) {
      isActed.value = data.getSquadInMission.acted;
      isRat.value = data.getSquadInMission.rat;
      shouldAct.value = true;
    }
    console.log(mySquad);
  });
});
// 行动
let act = (rat: boolean, mySquadID: string) => {
  ActIt(rat, mySquadID).then((data) => {
    mySquad = data;
    isActed.value = data.acted;
    isRat.value = data.rat;
  });
};
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
              currentMissionStatus == `picking` &&
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
        </div>
      </div>
    </el-main>
    <el-footer>
      <div v-if="currentMission?.status == `picking`">
        <div v-if="currentMission?.leaderID == userID">
          <el-button type="primary" @click="confirmSquads">确认选队</el-button>
        </div>
        <div v-else>请等待队长选择任务小队</div>
      </div>
      <div v-else-if="currentMissionStatus == `voting`">
        <div v-if="isVoted">
          <div v-if="isPassed">已表示通过</div>
          <div v-else>已表示拒绝</div>
        </div>
        <div v-else>
          <el-button @click="vote(true, myVote!.id)">同意</el-button>
          <el-button @click="vote(false, myVote!.id)">否决</el-button>
        </div>
      </div>
      <div v-else-if="currentMissionStatus == `acting`">
        <div v-if="shouldAct">
          <div v-if="isActed">
            <div v-if="isRat">已破坏任务</div>
            <div v-else>已完成任务</div>
          </div>
          <div v-else>
            <el-button @click="act(true, mySquad!.id)">破坏</el-button>
            <el-button @click="act(false, mySquad!.id)">通过</el-button>
          </div>
        </div>
        <div v-else>请等待任务小队行动</div>
      </div>
      <div v-else>任务状态{{ currentMissionStatus }}</div>
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
