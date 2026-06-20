<script setup lang="ts">
import { ref, computed, reactive } from 'vue'
import { useRouter } from 'vue-router'
import type { FormInstance, FormRules } from 'element-plus'
import { useLogin, useRegister } from '@/hooks/user'

const router = useRouter()
const activeTab = ref('login')

// ============ 登录 ============
const loginFormRef = ref<FormInstance>()
const loginForm = reactive({
  username: '',
  password: '',
})
const { login, isLoading: loginLoading } = useLogin()

const loginRules: FormRules = {
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
}

const handleLogin = async () => {
  const valid = await loginFormRef.value?.validate().catch(() => false)
  if (!valid) return
  const res = await login(loginForm)
  if (res?.code === 200) {
    router.push('/home')
  }
}

// ============ 注册 ============
const registerFormRef = ref<FormInstance>()
const registerForm = reactive({
  username: '',
  email: '',
  password: '',
  confirmPassword: '',
})
const { register, isLoading: registerLoading } = useRegister()

const validateConfirmPassword = (
  _rule: unknown,
  value: string,
  callback: (err?: Error) => void,
) => {
  if (value !== registerForm.password) {
    callback(new Error('两次输入的密码不一致'))
  } else {
    callback()
  }
}

const registerRules: FormRules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 2, max: 20, message: '用户名长度为 2-20 个字符', trigger: 'blur' },
  ],
  email: [
    { required: false, message: '请输入邮箱', trigger: 'blur' },
    { type: 'email', message: '请输入有效的邮箱地址', trigger: 'blur' },
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 8, max: 20, message: '密码长度为 8-20 个字符', trigger: 'blur' },
    {
      pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      message: '密码需包含大写字母、小写字母和数字',
      trigger: 'blur',
    },
  ],
  confirmPassword: [
    { required: true, message: '请再次输入密码', trigger: 'blur' },
    { validator: validateConfirmPassword, trigger: 'blur' },
  ],
}

// 密码强度
const passwordStrength = computed(() => {
  const pwd = registerForm.password
  if (!pwd) return { level: 0, text: '', color: '' }
  let score = 0
  if (pwd.length >= 8) score++
  if (/[a-z]/.test(pwd)) score++
  if (/[A-Z]/.test(pwd)) score++
  if (/\d/.test(pwd)) score++
  if (/[^a-zA-Z\d]/.test(pwd)) score++
  if (score <= 2) return { level: 1, text: '弱', color: 'var(--color-danger)' }
  if (score <= 3) return { level: 2, text: '中', color: 'var(--color-warning)' }
  return { level: 3, text: '强', color: 'var(--color-success)' }
})

const handleRegister = async () => {
  const valid = await registerFormRef.value?.validate().catch(() => false)
  if (!valid) return
  const form:{
    email?:string,
    username:string,
    password:string,
    confirmPassword:string
  } = {
    username: registerForm.username,
    password: registerForm.password,
    confirmPassword: registerForm.confirmPassword,
  }

  if(registerForm.email){
    form.email = registerForm.email
  }
  const res = await register(form)
  if (res?.code === 200) {
    activeTab.value = 'login'
    // 清空注册表单
    registerForm.username = ''
    registerForm.email = ''
    registerForm.password = ''
    registerForm.confirmPassword = ''
  }
}
</script>

<template>
  <div class="login-page">
    <div class="login-card">
      <div class="login-card__header">
        <h1 class="login-card__title">音乐平台</h1>
        <p class="login-card__subtitle">
          {{ activeTab === 'login' ? '欢迎回来' : '创建你的账号' }}
        </p>
      </div>

      <el-tabs v-model="activeTab" class="login-card__tabs" stretch>
        <el-tab-pane label="登录" name="login">
          <el-form
            ref="loginFormRef"
            :model="loginForm"
            :rules="loginRules"
            label-position="left"
            label-width="80px"
            size="large"
          >
            <el-form-item label="用户名" prop="username">
              <el-input v-model="loginForm.username" placeholder="请输入用户名" />
            </el-form-item>
            <el-form-item label="密码" prop="password">
              <el-input
                v-model="loginForm.password"
                type="password"
                placeholder="请输入密码"
                show-password
                @keyup.enter="handleLogin"
              />
            </el-form-item>
            <el-form-item>
              <el-button
                type="primary"
                class="login-card__submit"
                :loading="loginLoading"
                @click="handleLogin"
              >
                登录
              </el-button>
            </el-form-item>
          </el-form>
        </el-tab-pane>

        <el-tab-pane label="注册" name="register">
          <el-form
            ref="registerFormRef"
            :model="registerForm"
            :rules="registerRules"
            label-position="left"
            label-width="80px"
            size="large"
          >
            <el-form-item label="用户名" prop="username">
              <el-input v-model="registerForm.username" placeholder="2-20 个字符" />
            </el-form-item>
            <el-form-item label="邮箱" prop="email">
              <el-input v-model="registerForm.email" placeholder="请输入邮箱地址" />
            </el-form-item>
            <el-form-item label="密码" prop="password">
              <el-input
                v-model="registerForm.password"
                type="password"
                placeholder="8-20 位，含大小写字母和数字"
                show-password
              />
              <div v-if="registerForm.password" class="password-strength">
                <div class="password-strength__bars">
                  <span
                    v-for="i in 3"
                    :key="i"
                    class="password-strength__bar"
                    :class="{ 'password-strength__bar--active': passwordStrength.level >= i }"
                    :style="{
                      backgroundColor:
                        passwordStrength.level >= i ? passwordStrength.color : undefined,
                    }"
                  />
                </div>
                <span class="password-strength__text" :style="{ color: passwordStrength.color }">
                  {{ passwordStrength.text }}
                </span>
              </div>
            </el-form-item>
            <el-form-item label="确认密码" prop="confirmPassword">
              <el-input
                v-model="registerForm.confirmPassword"
                type="password"
                placeholder="请再次输入密码"
                show-password
                @keyup.enter="handleRegister"
              />
            </el-form-item>
            <el-form-item>
              <el-button
                type="primary"
                class="login-card__submit"
                :loading="registerLoading"
                @click="handleRegister"
              >
                注册
              </el-button>
            </el-form-item>
          </el-form>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<style scoped>
.login-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--space-xl);
}

.login-card {
  width: 100%;
  max-width: 520px;
  background: rgba(255, 255, 255, 0.6);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-lg);
  padding: var(--space-2xl);

  /* Element Plus 主题覆盖 */
  --el-color-primary: var(--color-primary);
  --el-color-primary-light-3: var(--color-primary-hover);
  --el-color-primary-light-5: var(--color-primary-active);
  --el-color-primary-light-7: var(--color-primary-soft);
  --el-color-primary-light-8: var(--color-primary-bg);
  --el-color-primary-light-9: var(--color-primary-bg);
  --el-color-primary-dark-2: var(--color-primary-active);

  --el-border-radius-base: var(--radius-sm);
  --el-font-size-base: var(--font-size-base);

  --el-text-color-primary: var(--color-text-primary);
  --el-text-color-regular: var(--color-text-secondary);
  --el-text-color-placeholder: var(--color-input-placeholder);

  --el-border-color: var(--color-border);
  --el-border-color-light: var(--color-border-soft);
  --el-border-color-hover: var(--color-border-strong);

  --el-fill-color-blank: rgba(255, 255, 255, 0.5);
  --el-bg-color: transparent;
}

.login-card__header {
  text-align: center;
  margin-bottom: var(--space-xl);
}

.login-card__title {
  font-size: var(--font-size-2xl);
  font-weight: 700;
  color: var(--color-primary);
  margin: 0 0 var(--space-xs);
}

.login-card__subtitle {
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
  margin: 0;
}

.login-card__tabs {
  --el-tabs-header-height: 44px;
}

.login-card__tabs :deep(.el-tabs__active-bar) {
  background-color: var(--color-primary);
}

.login-card__tabs :deep(.el-tabs__item.is-active) {
  color: var(--color-primary);
}

.login-card__tabs :deep(.el-tabs__item:hover) {
  color: var(--color-primary-hover);
}

.login-card__submit {
  width: 100%;
  margin-top: var(--space-md);
  height: 44px;
  font-size: var(--font-size-md);
  border-radius: var(--radius-md);
}

.password-strength {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  margin-top: var(--space-xs);
  width: 100%;
}

.password-strength__bars {
  display: flex;
  gap: 4px;
  flex: 1;
}

.password-strength__bar {
  height: 4px;
  flex: 1;
  border-radius: 2px;
  background: var(--color-border);
  transition: background-color var(--transition-fast);
}

.password-strength__text {
  font-size: var(--font-size-xs);
  white-space: nowrap;
}

/* Element Plus 表单微调 */
.login-card__tabs :deep(.el-form-item__label) {
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
}

.login-card__tabs :deep(.el-input__wrapper) {
  border-radius: var(--radius-sm);
  box-shadow: 0 0 0 1px var(--color-border) inset;
  transition: box-shadow var(--transition-fast);
}

.login-card__tabs :deep(.el-input__wrapper:hover) {
  box-shadow: 0 0 0 1px var(--color-border-strong) inset;
}

.login-card__tabs :deep(.el-input__wrapper.is-focus) {
  box-shadow: 0 0 0 1px var(--color-border-focus) inset;
}

/* 深色模式适配 */
:root.dark .login-card {
  background: rgba(26, 18, 48, 0.6);
  border-color: rgba(139, 92, 246, 0.2);
  --el-fill-color-blank: rgba(36, 26, 61, 0.5);
}
</style>
