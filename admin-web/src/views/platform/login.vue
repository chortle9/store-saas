<template>
  <div class="login-container">
    <div class="login-box">
      <div class="login-left">
        <div class="brand">
          <h1>店小伴 · 平台管理</h1>
          <p>SaaS运营方总后台</p>
          <ul class="features">
            <li>✓ 全平台店铺数据统计</li>
            <li>✓ 入驻店铺管理</li>
            <li>✓ 套餐续费/开通</li>
            <li>✓ 店铺状态管控</li>
          </ul>
        </div>
      </div>
      <div class="login-right">
        <h2>平台管理员登录</h2>
        <el-form
          ref="loginFormRef"
          :model="loginForm"
          :rules="rules"
          size="large"
        >
          <el-form-item prop="username">
            <el-input v-model="loginForm.username" placeholder="平台管理员账号" prefix-icon="User" />
          </el-form-item>
          <el-form-item prop="password">
            <el-input v-model="loginForm.password" type="password" placeholder="密码" prefix-icon="Lock" show-password />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" :loading="loading" style="width: 100%" @click="handleLogin">
              登 录
            </el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, type FormInstance } from 'element-plus'
import { platformLogin } from '@/api/platform'

const router = useRouter()
const loginFormRef = ref<FormInstance>()
const loading = ref(false)

const loginForm = reactive({
  username: 'admin',
  password: '123456',
})

const rules = {
  username: [{ required: true, message: '请输入账号', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
}

async function handleLogin() {
  if (!loginFormRef.value) return
  await loginFormRef.value.validate(async (valid) => {
    if (!valid) return
    loading.value = true
    try {
      const res = await platformLogin({ username: loginForm.username, password: loginForm.password })
      localStorage.setItem('platform_token', res.token)
      ElMessage.success('登录成功')
      router.push('/platform/dashboard')
    } catch (error) {
      // 错误已在拦截器处理
    } finally {
      loading.value = false
    }
  })
}
</script>

<style scoped>
.login-container {
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
}
.login-box {
  display: flex;
  width: 900px;
  height: 500px;
  background: #fff;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}
.login-left {
  flex: 1;
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
  padding: 60px 40px;
  color: #fff;
  display: flex;
  align-items: center;
}
.brand h1 { font-size: 28px; margin-bottom: 12px; }
.brand p { font-size: 14px; opacity: 0.8; margin-bottom: 30px; }
.features { list-style: none; }
.features li { font-size: 14px; margin-bottom: 10px; opacity: 0.9; }
.login-right {
  flex: 1;
  padding: 60px 50px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.login-right h2 { font-size: 22px; color: #303133; margin-bottom: 30px; }
</style>
