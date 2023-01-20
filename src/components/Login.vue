<script setup lang="ts">
import { reactive, ref } from "vue";
import { watch } from "vue";
import router from "../router";
import { setUserToken } from "../utils/authentication";
import { FormInstance } from "element-plus";
import { Login } from "../gqls/room";

const formSize = ref("default");
const ruleFormRef = ref();
const ruleForm = reactive({
  phone: "",
});

const rules = reactive({
  phone: [
    { required: true, message: "请输入手机号", trigger: "blur" },
    { min: 11, max: 11, message: "11 位谢谢", trigger: "blur" },
  ],
});

const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  await formEl.validate((valid, fields) => {
    if (valid) {
      let result = Login(ruleForm.phone);
      watch(result, (value) => {
        setUserToken(value.login.id);
        router.push("/");
      });
    } else {
      console.log("error submit!", fields);
    }
  });
};

const resetForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.resetFields();
};
</script>

<template>
  <h1>登录页</h1>
  <el-form
    ref="ruleFormRef"
    :model="ruleForm"
    :rules="rules"
    label-width="120px"
    class="demo-ruleForm"
    :size="formSize"
    status-icon
  >
    <el-form-item label="手机号" prop="phone">
      <el-input v-model="ruleForm.phone" />
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="submitForm(ruleFormRef)">
        登录
      </el-button>
      <el-button @click="resetForm(ruleFormRef)"> 重置 </el-button>
    </el-form-item>
  </el-form>
  <!-- <p>{{ result }}</p> -->
</template>

<style scoped>
.read-the-docs {
  color: #888;
}
</style>
