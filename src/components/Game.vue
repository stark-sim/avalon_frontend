<script setup lang="ts">
import router from "../router";
import { getUserToken } from "../utils/authentication";
import {
  GameUser,
  Card,
  GetGameUsersByGame,
  GetGameUsersWithCardByGame,
  GetVagueGameUsers,
  Assassinate,
  GetAssassinationByGame,
  GetOnesCardInGame,
  ViewOthersInGame,
  OtherView,
} from "../gqls/game";
import {
  GetMissionsByGame,
  PickSquads,
  GetVoteInMission,
  VoteIt,
  GetSquadInMission,
  ActIt,
} from "../gqls/mission";
import { Mission, Vote, Squad } from "../gqls/mission";
import { watch, ref, Ref, onMounted } from "vue";
import { ElMessage } from "element-plus";
import {
  shouldUpdateCurrenMission,
  getMissionAvatarPath,
} from "../logic/mission";
import {
  getAvatarPathByCardName,
  getAvatarPathByUserIDAndNumber,
  avatarStyle,
} from "../logic/game";
import sheriffAvatar from "../assets/avatars/sheriff.svg";

// 在游戏中维持着 gameID
const props = defineProps<{
  gameID: string;
  assassinChance: string;
}>();
const gameID: string = props.gameID;
// 刺杀环节所需数据
const assassinChance: number = parseInt(props.assassinChance);
let tempAssassinatedIDs = ref<string[]>([]);
// 登录状态检查
let userID = getUserToken();
if (userID == "") {
  router.push("/");
}
// 获取这局游戏的用户，有排序
let gameUsers = ref<GameUser[]>([]);
let midGameUsersCount = ref<number>(0);
onMounted(() => {
  const gameUsersResp = GetGameUsersByGame(gameID);
  watch(gameUsersResp, (data) => {
    let _data = data.getGameUsersByGame;
    for (let i = 0; i < _data.length; i++) {
      gameUsers.value?.push(_data[i]);
    }
    midGameUsersCount.value = gameUsers.value.length / 2;
  });
});
// 获取可视的其他人的状态
let othersViews = ref<OtherView[]>([]);
let othersViewMap = new Map();
const othersViewResp = ViewOthersInGame(userID, gameID);
watch(othersViewResp, (data) => {
  let items = data.viewOthersInGame;
  for (let i = 0; i < items.length; i++) {
    othersViews.value.push(items[i]);
    othersViewMap.set(othersViews.value[i].userID, othersViews.value[i].type);
  }
});
// 获取用户的卡牌
let myCard = ref<Card>();
const cardResp = GetOnesCardInGame(userID, gameID);
watch(cardResp, (data) => {
  let _data = data.getOnesCardInGame;
  myCard.value = _data;
});
// 获取这局游戏的任务状态
let missions = ref<Mission[]>([]);
let missionsFetchEnable = ref<boolean>(true);
let missionsResp = GetMissionsByGame(gameID, missionsFetchEnable);
let currentMission = ref<Mission>();
let shouldFetchVote = ref<boolean>(false);
let shouldFetchSquad = ref<boolean>(false);
let currentMissionStatus = ref<string>("picking");
let gameStatus = ref<string>("onMission"); // onMission onAssassination onEnd
let failedCount = 0;
let closedCount = 0;
watch(missionsResp, (data) => {
  missions.value = [];
  let tempMissions = data.getMissionsByGame;
  // 计算游戏状态
  failedCount = 0;
  closedCount = 0;
  for (let i = 0; i < tempMissions.length; i++) {
    // 统计游戏所有任务的状态已判断是否进入刺杀环节或结算环节
    if (tempMissions[i].status == "closed") {
      closedCount++;
    }
    if (tempMissions[i].failed) {
      failedCount++;
    }
    // 更新 ref
    missions.value.push(tempMissions[i]);
    // 当前进行中的任务
    if (
      currentMission.value == undefined ||
      shouldUpdateCurrenMission(currentMission, missions.value[i])
    ) {
      currentMission.value = missions.value[i];
      currentMissionStatus.value = missions.value[i].status;
    }
  }
  if (currentMission.value?.status == "voting") {
    shouldFetchVote.value = true;
  } else if (currentMission.value?.status == "acting") {
    shouldFetchSquad.value = true;
  }
  // 循环结算判断状态
  if (failedCount == 3) {
    // 失败了三次
    gameStatus.value = "onEnd";
    missionsFetchEnable.value = false;
  } else if (closedCount - failedCount == 3) {
    // 胜利了三次
    gameStatus.value = "onAssassination";
    missionsFetchEnable.value = false;
  }
});

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

// 刺杀或结算逻辑
let assassinatorID = ref<string>();
watch(gameStatus, (data) => {
  console.log("游戏状态变========");
  console.log(gameStatus);
  // 刺杀环境，全局揭示红方身份，ws 实时获取刺杀结果，刺杀完成时 gameStatus切换到结算状态
  let assassinationFetchEnable = ref<boolean>(true);
  if (gameStatus.value == "onAssassination") {
    const vagueGameUserResp = GetVagueGameUsers(gameID);
    watch(vagueGameUserResp, (data) => {
      gameUsers.value = [];
      let _data = data.getVagueGameUsers;
      for (let i = 0; i < _data.length; i++) {
        gameUsers.value.push(_data[i]);
        if (gameUsers.value[i].card.name == "Agravain") {
          assassinatorID.value = gameUsers.value[i].user.id;
        }
      }
      // 刺客本人不需要通过请求获取刺杀环节信息
      watch(assassinatorID, () => {
        if (assassinatorID.value == userID) {
          assassinationFetchEnable.value = false;
        }
      });
    });
    // 获取刺杀环节实时信息更新
    const assassinationResp = GetAssassinationByGame(
      gameID,
      assassinationFetchEnable
    );
    watch(assassinationResp, (data) => {
      tempAssassinatedIDs.value = [];
      let res = data.getAssassinationByGame;
      let tempPickedIDs = res.tempPickedIDs;
      for (let i = 0; i < tempPickedIDs.length; i++) {
        tempAssassinatedIDs.value.push(tempPickedIDs[i]);
      }
      // 如果最终刺杀目标出现，则进入 onEnd 状态
      if (res.theAssassinatedIDs.length != 0) {
        assassinationFetchEnable.value = false;
        gameStatus.value = "onEnd";
      }
    });
  } else if (gameStatus.value == "onEnd") {
    // 结算，全局揭示所有身份
    const clearGameUsersResp = GetGameUsersWithCardByGame(gameID);
    watch(clearGameUsersResp, (data) => {
      gameUsers.value = [];
      let _data = data.getGameUsersByGame;
      for (let i = 0; i < _data.length; i++) {
        gameUsers.value.push(_data[i]);
      }
    });
  }
});
// 刺客选人
const aimTarget = (value: string) => {
  tempAssassinatedIDs.value.push(value);
};
const cancelTarget = (value: string) => {
  let i = tempAssassinatedIDs.value.indexOf(value);
  tempAssassinatedIDs.value.splice(i, 1);
};
// 确认刺杀
const confirmAssassination = () => {
  // 检查是否选好所需人数
  if (assassinChance == tempAssassinatedIDs.value.length) {
    Assassinate(gameID, tempAssassinatedIDs.value)
      .then((data) => {
        console.log(data);
        gameStatus.value = "onEnd";
      })
      .catch((error) => {
        console.log(error);
      });
  } else {
    ElMessage({
      type: "warning",
      message: `请瞄准${assassinChance}位玩家`,
    });
  }
};
</script>

<template>
  <el-container>
    <el-header>
      <div>游戏 ID: {{ gameID }}</div>
      <el-space direction="horizontal" wrap>
        <div class="missionStyle" v-for="mission in missions" :key="mission.id">
          <div
            v-if="
              mission.sequence == currentMission?.sequence &&
              mission.status != `closed` &&
              gameStatus == `onMission`
            "
          >
            <el-avatar
              size="large"
              :src="getMissionAvatarPath(mission.sequence)"
            />
          </div>
          <div v-else>
            <el-avatar :src="getMissionAvatarPath(mission.sequence)" />
          </div>
        </div>
      </el-space>
    </el-header>
    <el-main>
      <div class="gameUserRow" v-for="i in midGameUsersCount" :key="i">
        <div v-for="(j, idx) in 2" :key="j">
          <div v-if="gameStatus == `onMission`">
            <!-- 每轮的队长固定头像 -->
            <el-avatar
              v-if="
                currentMission?.leaderID ==
                gameUsers[i - 1 + (j == 1 ? 0 : midGameUsersCount)].user.id
              "
              :src="sheriffAvatar"
              :style="
                avatarStyle(
                  othersViewMap.get(
                    gameUsers[i - 1 + (j == 1 ? 0 : midGameUsersCount)].user.id
                  )
                )
              "
              class="border border-3"
            />
            <!-- 随机普通头像 -->
            <el-avatar
              v-else
              :src="
                getAvatarPathByUserIDAndNumber(
                  gameUsers[i - 1 + (j == 1 ? 0 : midGameUsersCount)].user.id,
                  gameUsers[i - 1 + (j == 1 ? 0 : midGameUsersCount)].number
                )
              "
              :style="
                avatarStyle(
                  othersViewMap.get(
                    gameUsers[i - 1 + (j == 1 ? 0 : midGameUsersCount)].user.id
                  )
                )
              "
            />
          </div>
          <div
            v-else-if="
              gameUsers[i - 1 + (j == 1 ? 0 : midGameUsersCount)].card !=
              undefined
            "
          >
            <!-- 角色对应头像 -->
            <el-avatar
              :src="
                getAvatarPathByCardName(
                  gameUsers[i - 1 + (j == 1 ? 0 : midGameUsersCount)].card.name
                )
              "
            />
          </div>
          <!-- 名字 -->
          <div>
            {{ gameUsers[i - 1 + (j == 1 ? 0 : midGameUsersCount)].user.name }}
          </div>
          <!-- 选人刺杀等动作 -->
          <div v-if="gameStatus == `onMission`">
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
          <div v-else-if="gameStatus == `onAssassination`">
            <div
              v-if="
                userID == assassinatorID &&
                tempAssassinatedIDs.length < assassinChance &&
                gameUsers[i - 1 + (j == 1 ? 0 : midGameUsersCount)].card.name ==
                  `Merlin` &&
                !tempAssassinatedIDs.includes(
                  gameUsers[i - 1 + (j == 1 ? 0 : midGameUsersCount)].user.id
                )
              "
            >
              <el-button
                @click="
                  aimTarget(
                    gameUsers[i - 1 + (j == 1 ? 0 : midGameUsersCount)].user.id
                  )
                "
                >瞄准</el-button
              >
            </div>
            <div
              v-else-if="
                userID == assassinatorID &&
                tempAssassinatedIDs.includes(
                  gameUsers[i - 1 + (j == 1 ? 0 : midGameUsersCount)].user.id
                )
              "
            >
              <el-button
                @click="
                  cancelTarget(
                    gameUsers[i - 1 + (j == 1 ? 0 : midGameUsersCount)].user.id
                  )
                "
                >放过</el-button
              >
            </div>
          </div>
        </div>
      </div>
    </el-main>
    <el-footer>
      <div v-if="gameStatus == `onMission`">
        <div v-if="currentMission?.status == `picking`">
          <div v-if="currentMission?.leaderID == userID">
            <el-button type="primary" @click="confirmSquads"
              >确认选队</el-button
            >
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
              <el-button v-if="myCard?.red" @click="act(true, mySquad!.id)"
                >破坏</el-button
              >
              <el-button @click="act(false, mySquad!.id)">通过</el-button>
            </div>
          </div>
          <div v-else>请等待任务小队行动</div>
        </div>
      </div>
      <div v-else-if="gameStatus == `onAssassination`">
        <div v-if="userID == assassinatorID">
          <el-button @click="confirmAssassination()">刺杀</el-button>
        </div>
        <div v-else>刺杀环节</div>
      </div>
      <div v-else-if="gameStatus == `onEnd`">
        <el-button
          @click="
            () => {
              router.back();
            }
          "
          >返回房间</el-button
        >
      </div>
    </el-footer>
  </el-container>
</template>

<style scoped>
.missionStyle {
  flex-direction: column;
}

.missionStyle:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}

.gameUserRow {
  display: flex;
  justify-content: space-between;
  width: 100%;
  /* flex-wrap: wrap; */
}
</style>
