<script setup lang="ts">
import { ref, watch, reactive } from "vue";
import { GetGames, RoomUser } from "../gqls/room";
import router from "../router";
import { getUserToken } from "../utils/authentication";
import { GetRoomUsers } from "../gqls/room";
import { ArrowRight } from "@element-plus/icons-vue";
import { LeaveRoom } from "../gqls/room";
import { GetRoomOngoingGame, CreateGame, Card } from "../gqls/game";
import { getAvatarPathByUserIDAndNumber } from "../logic/game";
import type { FormInstance, FormRules } from "element-plus";
import { getDefaultMissionCapacity } from "../logic/mission";

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
// 需要初始值来让选择人数的组件不会在一开始报错
let roomUsersCount = ref<number>(5);

// 是否为房主，房主可以开始游戏，配置游戏设置
let isHost = ref<boolean>(false);
// 刷新用户列表
watch(response, (data) => {
  roomUsers.value = [];
  let _data = data.getRoomUsers;
  roomUsersCount.value = _data.length;
  for (let i = 0; i < _data.length; i++) {
    roomUsers.value?.push(_data[i]);
    // 发现自己是房主
    if (roomUsers.value[i].host && roomUsers.value[i].user.id == userID) {
      isHost.value = true;
    }
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

// 角色卡牌可选项
const cards = ref<Card[]>([]);
let cardsResponse = GetGames();
watch(cardsResponse, (data) => {
  for (let i = 0; i < data.cards.length; i++) {
    cards.value.push(data.cards[i]);
  }
});

// 游戏配置表单数据
const formSize = ref("default");
const ruleFormRef = ref<FormInstance>();
const ruleForm = reactive({
  assassinChance: 1,
  randomLeader: false,
  cardIDs: [
    "1605836259502399488",
    "1605836090014769152",
    "1605836006992715776",
  ],
  missionOptions: [
    {
      sequence: 1,
      capacity: getDefaultMissionCapacity(1, roomUsersCount.value),
      protected: false,
    },
    {
      sequence: 2,
      capacity: getDefaultMissionCapacity(2, roomUsersCount.value),
      protected: false,
    },
    {
      sequence: 3,
      capacity: getDefaultMissionCapacity(3, roomUsersCount.value),
      protected: false,
    },
    {
      sequence: 4,
      capacity: getDefaultMissionCapacity(4, roomUsersCount.value),
      protected: roomUsersCount.value > 6 ? true : false,
    },
    {
      sequence: 5,
      capacity: getDefaultMissionCapacity(5, roomUsersCount.value),
      protected: false,
    },
  ],
});

const rules = reactive<FormRules>({
  assassinChance: [
    {
      required: true,
      message: "请选择可刺杀次数",
      trigger: "change",
    },
  ],
  cardIDs: [
    {
      type: "array",
      required: true,
      message: "请选择足够人数的角色卡",
      trigger: "change",
    },
  ],
});

const submitForm = async (formEl: FormInstance | undefined) => {
  console.log(ruleForm.cardIDs);
  if (!formEl) return;
  await formEl.validate((valid, fields) => {
    if (valid) {
      console.log("submit!");
    } else {
      console.log("error submit!", fields);
    }
  });
};

const resetForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.resetFields();
};

const assassinChanceOptions = Array.from({ length: 5 }).map((_, idx) => ({
  value: `${idx + 1}`,
  label: `${idx + 1}`,
}));
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
    <el-container>
      <el-aside width="200px">
        <el-form
          label-position="top"
          ref="ruleFormRef"
          :model="ruleForm"
          :rules="rules"
          label-width="120px"
          class="demo-ruleForm"
          :size="formSize"
          status-icon
        >
          <el-form-item label="刺杀机会" prop="assassinChance">
            <el-slider
              v-model="ruleForm.assassinChance"
              :step="1"
              show-stops
              :max="roomUsersCount - 1"
              :min="1"
              style="margin: 0 10%"
            />
          </el-form-item>
          <el-form-item label="随机队长" prop="randomLeader">
            <el-switch v-model="ruleForm.randomLeader" />
          </el-form-item>
          <el-form-item label="选择角色" prop="cardIDs">
            <el-checkbox-group
              style="display: flex; flex-direction: column"
              v-model="ruleForm.cardIDs"
            >
              <el-scrollbar height="100px">
                <el-checkbox
                  v-for="card in cards"
                  :key="card.id"
                  class="scrollbar-demo-item"
                  :label="card.id"
                  name="cardIDs"
                  >{{ card.role + " " + card.name }}</el-checkbox
                >
              </el-scrollbar>
            </el-checkbox-group>
          </el-form-item>
          <el-scrollbar height="160px">
            <el-card
              shadow="hover"
              v-for="i in 5"
              :key="i"
              style="margin: 2% 0; height: 150px"
            >
              <el-form-item label="出征人数" prop="missionOptions" size="small">
                <el-select-v2
                  v-model="ruleForm.missionOptions[i - 1].capacity"
                  :options="assassinChanceOptions"
                />
              </el-form-item>
              <el-form-item label="保护轮" prop="missionOptions" size="small">
                <el-switch v-model="ruleForm.missionOptions[i - 1].protected" />
              </el-form-item>
            </el-card>
          </el-scrollbar>

          <el-form-item>
            <el-button type="primary" @click="submitForm(ruleFormRef)">
              Create
            </el-button>
            <el-button @click="resetForm(ruleFormRef)">恢复默认</el-button>
          </el-form-item>
        </el-form>
      </el-aside>
      <el-container>
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
                {{
                  roomUsers[i - 1 + (j == 1 ? 0 : midRoomUsersCount)].user.name
                }}
              </div>
            </div>
          </div>
        </el-main>
        <el-footer>
          <el-button v-if="isHost" @click="createGame"> 开始游戏 </el-button>
        </el-footer>
      </el-container>
      <el-aside width="100px"> 右侧 </el-aside>
    </el-container>
  </el-container>
</template>

<style scoped>
.roomUserRow {
  display: flex;
  justify-content: space-between;
  width: 100%;
  /* flex-wrap: wrap; */
}

.scrollbar-demo-item {
  display: flex;
  align-items: center;
  /* justify-content: center;
  height: 50px;
  margin: 10px;
  text-align: center;
  border-radius: 4px;
  background: var(--el-color-primary-light-9);
  color: var(--el-color-primary); */
}
</style>
