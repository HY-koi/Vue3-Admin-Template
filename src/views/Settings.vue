<script setup>
import { ref, reactive, watch, computed } from 'vue'
import { ElMessage } from 'element-plus'
import { useALLDataStore } from '@/stores'

const store = useALLDataStore()

// 主题设置
const theme = reactive({
  primaryColor: '#409EFF',
  darkMode: false,
  fontSize: 14,
  sidebarCollapsed: false,
  showTabs: true,
  animation: 'fade'
})

// 用户设置
const userForm = reactive({
  nickname: 'Admin',
  email: 'admin@example.com',
  phone: '13800138000',
  avatar: '',
  bio: '超级管理员'
})

// 通知设置
const notify = reactive({
  systemNotify: true,
  messageNotify: true,
  soundNotify: false,
  emailNotify: false,
  notifyFrequency: 'realtime'
})

// 安全设置
const security = reactive({
  loginVerify: true,
  sessionTimeout: 30,
  ipWhitelist: false
})

const passwordForm = reactive({
  oldPassword: '',
  newPassword: '',
  confirmPassword: ''
})

const pwdDialogVisible = ref(false)

// 预设颜色
const presetColors = [
  '#409EFF', '#67C23A', '#E6A23C', '#F56C6C',
  '#909399', '#00D1B2', '#7B68EE', '#FF6B6B'
]

// 动画选项
const animations = [
  { label: '淡入淡出', value: 'fade' },
  { label: '滑动', value: 'slide' },
  { label: '缩放', value: 'zoom' },
  { label: '无动画', value: 'none' }
]

// 保存主题设置到localStorage
const saveTheme = () => {
  localStorage.setItem('theme_settings', JSON.stringify(theme))
  // 应用主题色
  document.documentElement.style.setProperty('--el-color-primary', theme.primaryColor)
  ElMessage.success('主题设置已保存')
}

// 保存用户设置
const saveUser = () => {
  localStorage.setItem('user_settings', JSON.stringify(userForm))
  ElMessage.success('个人信息已保存')
}

// 保存通知设置
const saveNotify = () => {
  localStorage.setItem('notify_settings', JSON.stringify(notify))
  ElMessage.success('通知设置已保存')
}

// 保存安全设置
const saveSecurity = () => {
  localStorage.setItem('security_settings', JSON.stringify(security))
  ElMessage.success('安全设置已保存')
}

// 修改密码
const handleChangePwd = () => {
  if (!passwordForm.oldPassword || !passwordForm.newPassword) {
    ElMessage.warning('请填写完整')
    return
  }
  if (passwordForm.newPassword !== passwordForm.confirmPassword) {
    ElMessage.error('两次密码不一致')
    return
  }
  if (passwordForm.newPassword.length < 6) {
    ElMessage.error('密码长度不能少于6位')
    return
  }
  ElMessage.success('密码修改成功')
  pwdDialogVisible.value = false
  passwordForm.oldPassword = ''
  passwordForm.newPassword = ''
  passwordForm.confirmPassword = ''
}

// 重置所有设置
const resetAll = () => {
  localStorage.clear()
  theme.primaryColor = '#409EFF'
  theme.darkMode = false
  theme.fontSize = 14
  theme.sidebarCollapsed = false
  theme.showTabs = true
  theme.animation = 'fade'
  document.documentElement.style.setProperty('--el-color-primary', '#409EFF')
  ElMessage.success('已恢复默认设置')
}

// 从localStorage加载设置
const loadSettings = () => {
  try {
    const savedTheme = JSON.parse(localStorage.getItem('theme_settings'))
    if (savedTheme) Object.assign(theme, savedTheme)
    const savedUser = JSON.parse(localStorage.getItem('user_settings'))
    if (savedUser) Object.assign(userForm, savedUser)
    const savedNotify = JSON.parse(localStorage.getItem('notify_settings'))
    if (savedNotify) Object.assign(notify, savedNotify)
    const savedSecurity = JSON.parse(localStorage.getItem('security_settings'))
    if (savedSecurity) Object.assign(security, savedSecurity)
  } catch {}
}

// 初始化加载
loadSettings()

// 应用主题色
document.documentElement.style.setProperty('--el-color-primary', theme.primaryColor)
</script>

<template>
  <div class="settings-container">
    <el-row :gutter="20">
      <!-- 左侧导航 -->
      <el-col :span="6">
        <el-card shadow="hover">
          <el-menu default-active="theme" class="settings-menu">
            <el-menu-item index="theme">
              <el-icon><Brush /></el-icon>
              <span>主题设置</span>
            </el-menu-item>
            <el-menu-item index="user">
              <el-icon><User /></el-icon>
              <span>个人信息</span>
            </el-menu-item>
            <el-menu-item index="notify">
              <el-icon><Bell /></el-icon>
              <span>通知设置</span>
            </el-menu-item>
            <el-menu-item index="security">
              <el-icon><Lock /></el-icon>
              <span>安全设置</span>
            </el-menu-item>
          </el-menu>
        </el-card>
      </el-col>

      <!-- 右侧内容 -->
      <el-col :span="18">
        <!-- 主题设置 -->
        <el-card shadow="hover" class="setting-section">
          <template #header>
            <div class="section-header">
              <span><el-icon><Brush /></el-icon> 主题设置</span>
            </div>
          </template>
          <el-form label-width="120px">
            <el-form-item label="主题色">
              <div class="color-picker">
                <div
                  v-for="color in presetColors"
                  :key="color"
                  class="color-item"
                  :class="{ active: theme.primaryColor === color }"
                  :style="{ background: color }"
                  @click="theme.primaryColor = color"
                ></div>
                <el-color-picker v-model="theme.primaryColor" />
              </div>
            </el-form-item>
            <el-form-item label="暗黑模式">
              <el-switch v-model="theme.darkMode" />
            </el-form-item>
            <el-form-item label="字体大小">
              <el-slider v-model="theme.fontSize" :min="12" :max="20" :step="1" show-input />
            </el-form-item>
            <el-form-item label="侧边栏折叠">
              <el-switch v-model="theme.sidebarCollapsed" />
            </el-form-item>
            <el-form-item label="显示标签页">
              <el-switch v-model="theme.showTabs" />
            </el-form-item>
            <el-form-item label="页面动画">
              <el-select v-model="theme.animation" style="width:200px">
                <el-option v-for="a in animations" :key="a.value" :label="a.label" :value="a.value" />
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="saveTheme">保存设置</el-button>
            </el-form-item>
          </el-form>
        </el-card>

        <!-- 个人信息 -->
        <el-card shadow="hover" class="setting-section">
          <template #header>
            <div class="section-header">
              <span><el-icon><User /></el-icon> 个人信息</span>
            </div>
          </template>
          <el-form :model="userForm" label-width="120px">
            <el-form-item label="头像">
              <el-avatar :size="64" src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png" />
            </el-form-item>
            <el-form-item label="昵称">
              <el-input v-model="userForm.nickname" style="width:300px" />
            </el-form-item>
            <el-form-item label="邮箱">
              <el-input v-model="userForm.email" style="width:300px" />
            </el-form-item>
            <el-form-item label="手机号">
              <el-input v-model="userForm.phone" style="width:300px" />
            </el-form-item>
            <el-form-item label="个人简介">
              <el-input v-model="userForm.bio" type="textarea" :rows="3" style="width:300px" />
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="saveUser">保存信息</el-button>
            </el-form-item>
          </el-form>
        </el-card>

        <!-- 通知设置 -->
        <el-card shadow="hover" class="setting-section">
          <template #header>
            <div class="section-header">
              <span><el-icon><Bell /></el-icon> 通知设置</span>
            </div>
          </template>
          <el-form label-width="120px">
            <el-form-item label="系统通知">
              <el-switch v-model="notify.systemNotify" />
            </el-form-item>
            <el-form-item label="消息通知">
              <el-switch v-model="notify.messageNotify" />
            </el-form-item>
            <el-form-item label="声音提醒">
              <el-switch v-model="notify.soundNotify" />
            </el-form-item>
            <el-form-item label="邮件通知">
              <el-switch v-model="notify.emailNotify" />
            </el-form-item>
            <el-form-item label="通知频率">
              <el-radio-group v-model="notify.notifyFrequency">
                <el-radio value="realtime">实时</el-radio>
                <el-radio value="hourly">每小时</el-radio>
                <el-radio value="daily">每天</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="saveNotify">保存设置</el-button>
            </el-form-item>
          </el-form>
        </el-card>

        <!-- 安全设置 -->
        <el-card shadow="hover" class="setting-section">
          <template #header>
            <div class="section-header">
              <span><el-icon><Lock /></el-icon> 安全设置</span>
            </div>
          </template>
          <el-form label-width="120px">
            <el-form-item label="登录验证">
              <el-switch v-model="security.loginVerify" />
            </el-form-item>
            <el-form-item label="会话超时">
              <el-input-number v-model="security.sessionTimeout" :min="5" :max="120" :step="5" />
              <span style="margin-left:10px;color:#999">分钟</span>
            </el-form-item>
            <el-form-item label="IP白名单">
              <el-switch v-model="security.ipWhitelist" />
            </el-form-item>
            <el-form-item label="修改密码">
              <el-button type="warning" @click="pwdDialogVisible = true">修改密码</el-button>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="saveSecurity">保存设置</el-button>
            </el-form-item>
          </el-form>
        </el-card>

        <!-- 重置 -->
        <div class="reset-section">
          <el-button type="danger" @click="resetAll">恢复默认设置</el-button>
        </div>
      </el-col>
    </el-row>

    <!-- 修改密码弹窗 -->
    <el-dialog v-model="pwdDialogVisible" title="修改密码" width="400px">
      <el-form :model="passwordForm" label-width="100px">
        <el-form-item label="原密码">
          <el-input v-model="passwordForm.oldPassword" type="password" show-password />
        </el-form-item>
        <el-form-item label="新密码">
          <el-input v-model="passwordForm.newPassword" type="password" show-password />
        </el-form-item>
        <el-form-item label="确认密码">
          <el-input v-model="passwordForm.confirmPassword" type="password" show-password />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="pwdDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleChangePwd">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped lang="less">
.settings-container {
  padding: 10px;
}
.settings-menu {
  border-right: none;
  .el-menu-item {
    height: 50px;
    line-height: 50px;
  }
}
.setting-section {
  margin-bottom: 20px;
}
.section-header {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: bold;
  font-size: 16px;
}
.color-picker {
  display: flex;
  align-items: center;
  gap: 10px;
  .color-item {
    width: 28px;
    height: 28px;
    border-radius: 6px;
    cursor: pointer;
    transition: transform 0.2s;
    border: 2px solid transparent;
    &.active {
      border-color: #333;
      transform: scale(1.15);
    }
    &:hover {
      transform: scale(1.1);
    }
  }
}
.reset-section {
  text-align: center;
  padding: 20px 0;
}
</style>
