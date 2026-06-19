<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { User, Lock } from '@element-plus/icons-vue'
import type { FormInstance, FormRules } from 'element-plus'
import {
  useGetUserProfile,
  useUpdateUserProfile,
  useUpdatePassword,
} from '@/hooks/user'
import type { UpdateUserProfilePayload } from '@/hooks/user'
import { popup } from '@/utils/popup'

/* ── 常量 ── */
const PRESET_TAGS = ['音乐', '游戏', '阅读', '乐器', '运动', '电影', '摄影', '美食']

/* ── Tab ── */
const activeTab = ref<'profile' | 'security'>('profile')

/* ── 个人资料表单 ── */
const profileFormRef = ref<FormInstance>()
const profileForm = reactive({
  username: '',
  nickname: '',
  email: '',
  bio: '',
  gender: 0,
})
const selectedTags = ref<string[]>([])
const customTagInput = ref('')

const profileRules: FormRules = {
  email: [{ type: 'email', message: '请输入有效的邮箱地址', trigger: 'blur' }],
}

/* ── 密码表单 ── */
const passwordFormRef = ref<FormInstance>()
const passwordForm = reactive({
  oldPassword: '',
  newPassword: '',
  confirmPassword: '',
})

const validateConfirmPassword = (_rule: unknown, value: string, callback: (err?: Error) => void) => {
  if (value !== passwordForm.newPassword) {
    callback(new Error('两次输入的密码不一致'))
  } else {
    callback()
  }
}

const passwordRules: FormRules = {
  oldPassword: [{ required: true, message: '请输入当前密码', trigger: 'blur' }],
  newPassword: [
    { required: true, message: '请输入新密码', trigger: 'blur' },
    { min: 6, message: '密码至少 6 位', trigger: 'blur' },
  ],
  confirmPassword: [
    { required: true, message: '请再次输入新密码', trigger: 'blur' },
    { validator: validateConfirmPassword, trigger: 'blur' },
  ],
}

/* ── Hooks ── */
const { fetchUserProfile } = useGetUserProfile()
const { updateUserProfile, isLoading: updateLoading } = useUpdateUserProfile()
const { updatePassword, isLoading: passwordLoading } = useUpdatePassword()

/* ── 加载用户信息 ── */
const loadUserProfile = async () => {
  const res = await fetchUserProfile()
  if (res?.code === 200 && res.data) {
    const d = res.data
    profileForm.username = d.username || ''
    profileForm.nickname = d.nickname || ''
    profileForm.email = d.email || ''
    profileForm.bio = d.bio || ''
    profileForm.gender = d.gender ?? 0
    selectedTags.value = d.hobby ? d.hobby.split(',').filter(Boolean) : []
  } else {
    popup.message.error(res?.message || '获取用户信息失败')
  }
}

/* ── 保存资料 ── */
const handleSaveProfile = async () => {
  const valid = await profileFormRef.value?.validate().catch(() => false)
  if (!valid) return
  const payload: UpdateUserProfilePayload = {
    nickname: profileForm.nickname,
    email: profileForm.email,
    bio: profileForm.bio,
    gender: profileForm.gender,
    hobby: selectedTags.value.join(','),
  }
  const res = await updateUserProfile(payload)
  if (res?.code === 200) {
    popup.message.success('保存成功')
    await loadUserProfile()
  } else {
    popup.message.error(res?.message || '保存失败')
  }
}

/* ── 修改密码 ── */
const handleChangePassword = async () => {
  const valid = await passwordFormRef.value?.validate().catch(() => false)
  if (!valid) return
  const res = await updatePassword({
    oldPassword: passwordForm.oldPassword,
    newPassword: passwordForm.newPassword,
  })
  if (res?.code === 200) {
    popup.message.success('密码修改成功')
    passwordForm.oldPassword = ''
    passwordForm.newPassword = ''
    passwordForm.confirmPassword = ''
    passwordFormRef.value?.clearValidate()
  } else {
    popup.message.error(res?.message || '密码修改失败')
  }
}

/* ── 标签操作 ── */
const allTags = computed(() => {
  const presetSet = new Set(PRESET_TAGS)
  const customTags = selectedTags.value.filter(t => !presetSet.has(t))
  return [...PRESET_TAGS, ...customTags]
})

const toggleTag = (tag: string) => {
  const i = selectedTags.value.indexOf(tag)
  if (i >= 0) selectedTags.value.splice(i, 1)
  else selectedTags.value.push(tag)
}

const addCustomTag = () => {
  const val = customTagInput.value.trim()
  if (!val || selectedTags.value.includes(val) || PRESET_TAGS.includes(val)) return
  selectedTags.value.push(val)
  customTagInput.value = ''
}

const removeTag = (tag: string) => {
  const i = selectedTags.value.indexOf(tag)
  if (i >= 0) selectedTags.value.splice(i, 1)
}

onMounted(loadUserProfile)
</script>

<template>
  <div class="user-center">
    <!-- Tab 栏 -->
    <div class="tab-bar">
      <button
        class="tab-item"
        :class="{ active: activeTab === 'profile' }"
        @click="activeTab = 'profile'"
      >
        <el-icon :size="16"><User /></el-icon>
        个人资料
      </button>
      <button
        class="tab-item"
        :class="{ active: activeTab === 'security' }"
        @click="activeTab = 'security'"
      >
        <el-icon :size="16"><Lock /></el-icon>
        账号安全
      </button>
    </div>

    <!-- 内容区 -->
    <div class="content-area">
      <!-- 个人资料 -->
      <div v-show="activeTab === 'profile'" class="panel">
        <div class="panel-header">
          <h3 class="panel-title">个人资料</h3>
          <p class="panel-subtitle">管理你的个人信息</p>
        </div>

        <el-form
          ref="profileFormRef"
          :model="profileForm"
          :rules="profileRules"
          label-position="top"
          size="large"
        >
          <el-form-item label="用户名">
            <el-input :model-value="profileForm.username" disabled />
          </el-form-item>

          <el-form-item label="昵称">
            <el-input v-model="profileForm.nickname" placeholder="给自己取个好听的名字" />
          </el-form-item>

          <el-form-item label="邮箱" prop="email">
            <el-input v-model="profileForm.email" placeholder="your@email.com" />
          </el-form-item>

          <el-form-item label="个人简介">
            <el-input
              v-model="profileForm.bio"
              type="textarea"
              :rows="3"
              maxlength="200"
              show-word-limit
              placeholder="介绍一下自己吧..."
            />
          </el-form-item>

          <el-form-item label="性别">
            <el-radio-group v-model="profileForm.gender">
              <el-radio :value="1">男</el-radio>
              <el-radio :value="2">女</el-radio>
              <el-radio :value="0">保密</el-radio>
            </el-radio-group>
          </el-form-item>

          <el-form-item label="兴趣爱好">
            <div class="tag-section">
              <div class="tag-group">
                <button
                  v-for="tag in allTags"
                  :key="tag"
                  type="button"
                  class="tag-btn"
                  :class="{ active: selectedTags.includes(tag) }"
                  @click="PRESET_TAGS.includes(tag) ? toggleTag(tag) : removeTag(tag)"
                >
                  {{ tag }}<span v-if="!PRESET_TAGS.includes(tag)" class="tag-remove">&times;</span>
                </button>
              </div>
              <div class="custom-tag-row">
                <el-input
                  v-model="customTagInput"
                  placeholder="自定义标签"
                  maxlength="10"
                  class="custom-tag-input"
                  @keyup.enter="addCustomTag"
                />
                <el-button @click="addCustomTag">添加</el-button>
              </div>
            </div>
          </el-form-item>

          <div class="form-actions">
            <el-button :loading="updateLoading" type="primary" @click="handleSaveProfile">
              保存修改
            </el-button>
          </div>
        </el-form>
      </div>

      <!-- 账号安全 -->
      <div v-show="activeTab === 'security'" class="panel">
        <div class="panel-header">
          <h3 class="panel-title">账号安全</h3>
          <p class="panel-subtitle">修改密码以保护账号安全</p>
        </div>

        <el-form
          ref="passwordFormRef"
          :model="passwordForm"
          :rules="passwordRules"
          label-position="top"
          size="large"
          class="password-form"
        >
          <el-form-item label="当前密码" prop="oldPassword">
            <el-input
              v-model="passwordForm.oldPassword"
              type="password"
              placeholder="请输入当前密码"
              show-password
            />
          </el-form-item>

          <el-form-item label="新密码" prop="newPassword">
            <el-input
              v-model="passwordForm.newPassword"
              type="password"
              placeholder="请输入新密码（至少6位）"
              show-password
            />
          </el-form-item>

          <el-form-item label="确认新密码" prop="confirmPassword">
            <el-input
              v-model="passwordForm.confirmPassword"
              type="password"
              placeholder="请再次输入新密码"
              show-password
            />
          </el-form-item>

          <div class="form-actions">
            <el-button :loading="passwordLoading" type="primary" @click="handleChangePassword">
              确认修改
            </el-button>
          </div>
        </el-form>
      </div>
    </div>
  </div>
</template>

<style scoped>
.user-center {
  display: flex;
  flex-direction: column;
  gap: var(--space-xl);
  max-width: 720px;
  margin: 0 auto;
  padding: var(--space-2xl);
  padding-bottom: 100px;
}

/* ── Element Plus 主题覆盖 ── */
.user-center {
  --el-color-primary: var(--color-primary);
  --el-color-primary-light-3: var(--color-primary-hover);
  --el-color-primary-light-5: var(--color-primary-active);
  --el-color-primary-light-7: var(--color-primary-soft);
  --el-color-primary-light-8: var(--color-primary-bg);
  --el-color-primary-light-9: var(--color-primary-bg);
  --el-color-primary-dark-2: var(--color-primary-active);
  --el-border-radius-base: var(--radius-sm);
  --el-text-color-primary: var(--color-text-primary);
  --el-text-color-regular: var(--color-text-secondary);
  --el-border-color: var(--color-border);
  --el-border-color-light: var(--color-border-soft);
  --el-fill-color-blank: rgba(255, 255, 255, 0.5);
  --el-bg-color: transparent;
}

/* ══════ Tab Bar ══════ */
.tab-bar {
  display: flex;
  gap: var(--space-xs);
  padding: var(--space-sm);
  background: rgba(255, 255, 255, 0.55);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-md);
}

.tab-item {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-sm);
  padding: var(--space-md) var(--space-lg);
  border: none;
  border-radius: var(--radius-md);
  background: none;
  font-family: inherit;
  font-size: var(--font-size-base);
  color: var(--color-text-secondary);
  cursor: pointer;
  transition: all var(--transition-fast);
}

.tab-item:hover {
  background: var(--color-bg-hover);
  color: var(--color-primary);
}

.tab-item.active {
  background: var(--color-bg-active);
  color: var(--color-primary);
  font-weight: 600;
}

/* ══════ Content Area ══════ */
.content-area {
  background: rgba(255, 255, 255, 0.55);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-lg);
  padding: var(--space-2xl);
}

.panel-header {
  margin-bottom: var(--space-xl);
}

.panel-title {
  font-size: var(--font-size-lg);
  font-weight: 700;
  color: var(--color-text-primary);
  margin: 0 0 var(--space-xs);
}

.panel-subtitle {
  font-size: var(--font-size-sm);
  color: var(--color-text-muted);
  margin: 0;
}

/* ══════ 标签区域 ══════ */
.tag-section {
  width: 100%;
}

.tag-group {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-sm);
}

.tag-btn {
  padding: 6px 16px;
  border-radius: var(--radius-full);
  border: 1.5px solid var(--color-border);
  background: transparent;
  font-family: inherit;
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
  cursor: pointer;
  transition: all var(--transition-fast);
}

.tag-btn:hover {
  border-color: var(--color-primary-hover);
  color: var(--color-primary);
}

.tag-btn.active {
  background: var(--color-primary-soft);
  border-color: var(--color-primary);
  color: var(--color-primary);
  font-weight: 600;
}

.tag-remove {
  display: inline-flex;
  align-items: center;
  margin-left: 4px;
  margin-right: -4px;
  font-size: 13px;
  line-height: 1;
}

.custom-tag-row {
  display: flex;
  gap: var(--space-sm);
  margin-top: var(--space-md);
}

.custom-tag-input {
  max-width: 200px;
}

.custom-tag-row .el-button {
  white-space: nowrap;
}

/* ══════ 密码表单 ══════ */
.password-form {
  max-width: 420px;
}

/* ══════ 操作按钮 ══════ */
.form-actions {
  display: flex;
  justify-content: flex-end;
  margin-top: var(--space-xl);
  padding-top: var(--space-xl);
  border-top: 1px solid var(--color-border-soft);
}

/* ══════ 响应式 ══════ */
@media (max-width: 768px) {
  .user-center {
    padding: var(--space-lg);
  }

  .tab-item {
    font-size: var(--font-size-sm);
    padding: var(--space-sm) var(--space-md);
  }

  .content-area {
    padding: var(--space-xl);
  }
}

/* ══════ 暗色模式 ══════ */
:root.dark .tab-bar,
:root.dark .content-area {
  background: rgba(26, 18, 48, 0.6);
  border-color: rgba(139, 92, 246, 0.2);
}

:root.dark .user-center {
  --el-fill-color-blank: rgba(36, 26, 61, 0.5);
}
</style>
