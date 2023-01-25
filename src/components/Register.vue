<script setup lang="ts">
import { reactive, ref } from "vue";
import router from "../router";
import { FormInstance } from "element-plus";
import { Register } from "../gqls/auth";
import { ElMessage } from "element-plus";

const formSize = ref("default");
const ruleFormRef = ref();
const ruleForm = reactive({
  phone: "",
  name: "",
});

const rules = reactive({
  phone: [
    { required: true, message: "请输入手机号", trigger: "blur" },
    { min: 11, max: 11, message: "11 位谢谢", trigger: "blur" },
  ],
  name: [{ required: true, message: "请输入名称", trigger: "blur" }],
});

const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  await formEl.validate((valid, fields) => {
    if (valid) {
      Register(ruleForm.phone, ruleForm.name)
        .then((data) => {
          if (data != null) {
            ElMessage({
              type: "success",
              message: `成功创建用户 ${data.id}`,
              showClose: true,
              center: true,
            });
            router.push("/login");
          } else {
            ElMessage({
              type: "error",
              message: `创建用户失败，手机号已被使用`,
              showClose: true,
              center: true,
            });
          }
        })
        .catch((error) => {
          console.log(error);
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
  <h1>注册</h1>
  <el-form
    ref="ruleFormRef"
    :model="ruleForm"
    :rules="rules"
    label-width="120px"
    class="demo-ruleForm"
    :size="formSize"
    status-icon
  >
    <el-form-item label="手机" prop="phone">
      <el-input v-model="ruleForm.phone" />
    </el-form-item>
    <el-form-item label="名称" prop="name">
      <el-input v-model="ruleForm.name" />
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="submitForm(ruleFormRef)">
        注册
      </el-button>
      <el-button @click="resetForm(ruleFormRef)"> 重置 </el-button>
    </el-form-item>
  </el-form>
</template>

<style scoped></style>
