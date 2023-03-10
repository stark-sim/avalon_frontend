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
let roomUsersCount = ref<number>(0);

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
let cardsResponse = GetGames()
watch(cardsResponse, (data) => {
  for (let i = 0; i < data.cards.length; i++) {
    cards.value.push(data.cards[i])
  }
})

// 游戏配置表单数据
const formSize = ref("default");
const ruleFormRef = ref<FormInstance>();
const ruleForm = reactive({
  name: "Hello",
  region: "",
  assassinChance: 1,
  date1: "",
  date2: "",
  randomLeader: false,
  cardIDs: [],
  resource: "",
  desc: "",
});

const rules = reactive<FormRules>({
  name: [
    { required: true, message: "Please input Activity name", trigger: "blur" },
    { min: 3, max: 5, message: "Length should be 3 to 5", trigger: "blur" },
  ],
  region: [
    {
      required: true,
      message: "Please select Activity zone",
      trigger: "change",
    },
  ],
  assassinChance: [
    {
      required: true,
      message: "请选择可刺杀次数",
      trigger: "change",
    },
  ],
  date1: [
    {
      type: "date",
      required: true,
      message: "Please pick a date",
      trigger: "change",
    },
  ],
  date2: [
    {
      type: "date",
      required: true,
      message: "Please pick a time",
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
  resource: [
    {
      required: true,
      message: "Please select activity resource",
      trigger: "change",
    },
  ],
  desc: [
    { required: true, message: "Please input activity form", trigger: "blur" },
  ],
});

const submitForm = async (formEl: FormInstance | undefined) => {
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
      <el-aside width="500px">
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
          <el-form-item label="Activity name" prop="name">
            <el-input v-model="ruleForm.name" />
          </el-form-item>
          <el-form-item label="Activity zone" prop="region">
            <el-select v-model="ruleForm.region" placeholder="Activity zone">
              <el-option label="Zone one" value="shanghai" />
              <el-option label="Zone two" value="beijing" />
            </el-select>
          </el-form-item>
          <el-form-item label="刺杀机会" prop="assassinChance">
            <el-select-v2
              v-model="ruleForm.assassinChance"
              :options="assassinChanceOptions"
            />
          </el-form-item>
          <el-form-item label="Activity time" required>
            <el-col :span="11">
              <el-form-item prop="date1">
                <el-date-picker
                  v-model="ruleForm.date1"
                  type="date"
                  label="Pick a date"
                  placeholder="Pick a date"
                  style="width: 100%"
                />
              </el-form-item>
            </el-col>
            <el-col class="text-center" :span="2">
              <span class="text-gray-500">-</span>
            </el-col>
            <el-col :span="11">
              <el-form-item prop="date2">
                <el-time-picker
                  v-model="ruleForm.date2"
                  label="Pick a time"
                  placeholder="Pick a time"
                  style="width: 100%"
                />
              </el-form-item>
            </el-col>
          </el-form-item>
          <el-form-item label="随机队长" prop="randomLeader">
            <el-switch v-model="ruleForm.randomLeader" />
          </el-form-item>
          <el-form-item label="选择角色" prop="cardIDs">
            <el-checkbox-group style="display: flex; flex-direction: column" v-model="ruleForm.cardIDs" :min="roomUsersCount" :max="roomUsersCount">
              <el-checkbox v-for="card in cards" :key="card.id" :label="card.role + ' ' + card.name" name="cardIDs" />
            </el-checkbox-group>
          </el-form-item>
          <el-form-item label="Resources" prop="resource">
            <el-radio-group v-model="ruleForm.resource">
              <el-radio label="Sponsorship" />
              <el-radio label="Venue" />
            </el-radio-group>
          </el-form-item>
          <el-form-item label="Activity form" prop="desc">
            <el-input v-model="ruleForm.desc" type="textarea" />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitForm(ruleFormRef)">
              Create
            </el-button>
            <el-button @click="resetForm(ruleFormRef)">Reset</el-button>
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
</style>
