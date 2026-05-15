<script setup>
import { ref, reactive, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'

const activeTab = ref('all')
const searchText = ref('')

// 消息类型
const typeMap = {
  system: { label: '系统通知', color: '#409EFF', icon: 'Bell' },
  message: { label: '用户消息', color: '#67C23A', icon: 'ChatDotRound' },
  alert: { label: '预警提醒', color: '#E6A23C', icon: 'Warning' },
  task: { label: '任务通知', color: '#F56C6C', icon: 'Tickets' },
}

// 模拟消息数据
const messages = reactive([
  { id: 1, type: 'system', title: '系统维护通知', content: '系统将于本周六凌晨2:00-6:00进行维护升级，届时服务将暂停，请提前做好准备。', time: '2025-01-15 10:30', read: false, starred: false },
  { id: 2, type: 'message', title: '张经理的留言', content: '关于下季度预算方案，请尽快审核并反馈意见，谢谢！', time: '2025-01-15 09:15', read: false, starred: true },
  { id: 3, type: 'alert', title: '服务器CPU告警', content: '服务器Node-03的CPU使用率已超过90%，请及时处理避免服务中断。', time: '2025-01-14 22:45', read: false, starred: false },
  { id: 4, type: 'task', title: '新任务分配', content: '您有一个新的开发任务：用户权限模块重构，截止日期为1月25日。', time: '2025-01-14 16:00', read: true, starred: false },
  { id: 5, type: 'system', title: '版本更新通知', content: '系统已更新至v2.5.0版本，新增数据报表导出功能，修复了若干已知问题。', time: '2025-01-14 14:20', read: true, starred: false },
  { id: 6, type: 'message', title: '李工的回复', content: '代码已经review完毕，有几个小问题需要修改，具体见PR评论。', time: '2025-01-14 11:30', read: true, starred: true },
  { id: 7, type: 'alert', title: '磁盘空间不足', content: '数据库服务器磁盘使用率已达85%，建议及时清理历史数据。', time: '2025-01-13 18:00', read: true, starred: false },
  { id: 8, type: 'task', title: '任务完成提醒', content: '您提交的"首页优化"任务已通过验收，获得50积分奖励。', time: '2025-01-13 15:45', read: true, starred: false },
  { id: 9, type: 'system', title: '安全策略更新', content: '密码策略已更新，要求密码长度不少于8位，包含大小写字母和数字。', time: '2025-01-13 10:00', read: true, starred: false },
  { id: 10, type: 'message', title: '项目组会议通知', content: '本周五下午3点在会议室A召开项目进度会议，请准时参加。', time: '2025-01-12 17:30', read: true, starred: false },
])

// 筛选
const filteredMessages = computed(() => {
  let list = messages
  if (activeTab.value === 'unread') list = list.filter(m => !m.read)
  if (activeTab.value === 'starred') list = list.filter(m => m.starred)
  if (['system', 'message', 'alert', 'task'].includes(activeTab.value)) {
    list = list.filter(m => m.type === activeTab.value)
  }
  if (searchText.value) {
    const kw = searchText.value.toLowerCase()
    list = list.filter(m => m.title.toLowerCase().includes(kw) || m.content.toLowerCase().includes(kw))
  }
  return list
})

const stats = computed(() => ({
  total: messages.length,
  unread: messages.filter(m => !m.read).length,
  starred: messages.filter(m => m.starred).length,
}))

// 标记已读
const markRead = (msg) => {
  msg.read = true
}

const markAllRead = () => {
  messages.forEach(m => m.read = true)
  ElMessage.success('已全部标记为已读')
}

// 星标
const toggleStar = (msg) => {
  msg.starred = !msg.starred
}

// 删除
const handleDelete = (msg) => {
  ElMessageBox.confirm('确认删除该消息？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    const idx = messages.findIndex(m => m.id === msg.id)
    if (idx > -1) messages.splice(idx, 1)
    ElMessage.success('删除成功')
  }).catch(() => {})
}

// 清空已读
const clearRead = () => {
  ElMessageBox.confirm('确认清空所有已读消息？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    for (let i = messages.length - 1; i >= 0; i--) {
      if (messages[i].read) messages.splice(i, 1)
    }
    ElMessage.success('清空成功')
  }).catch(() => {})
}

const msgTemplates = {
  system: [
    { title: '系统维护通知', content: '系统将于今晚22:00-次日2:00进行维护升级，届时部分功能可能暂不可用。' },
    { title: '版本更新提醒', content: '系统已更新至最新版本，新增多项功能优化，请查看更新日志。' },
    { title: '安全策略变更', content: '为保障账户安全，系统已启用双因子认证，请及时绑定手机号。' },
  ],
  message: [
    { title: '王经理的留言', content: '关于Q2预算方案，请在本周五前提交审核意见，谢谢配合！' },
    { title: '李工的反馈', content: '代码Review已完成，有几个性能优化建议，详见PR评论。' },
    { title: '项目组通知', content: '下周一上午10点召开项目评审会议，请准备好演示材料。' },
  ],
  alert: [
    { title: '服务器CPU告警', content: '生产环境服务器Node-05的CPU使用率持续超过85%，请及时排查。' },
    { title: '磁盘空间预警', content: '数据库服务器磁盘使用率已达90%，建议立即清理历史日志。' },
    { title: '异常登录检测', content: '检测到您的账号在新设备上登录，如非本人操作请立即修改密码。' },
  ],
  task: [
    { title: '新任务分配', content: '您被分配了用户权限模块重构任务，截止日期为1月30日。' },
    { title: '任务即将到期', content: '您负责的首页性能优化任务将于明天到期，请尽快完成。' },
    { title: '任务验收通过', content: '您提交的数据报表功能已通过验收，获得80积分奖励。' },
  ],
}

// 模拟新消息
const simulateNewMsg = () => {
  const types = ['system', 'message', 'alert', 'task']
  const type = types[Math.floor(Math.random() * types.length)]
  const templates = msgTemplates[type]
  const tpl = templates[Math.floor(Math.random() * templates.length)]
  messages.unshift({
    id: Date.now(),
    type,
    title: tpl.title,
    content: tpl.content,
    time: new Date().toLocaleString(),
    read: false,
    starred: false,
  })
  ElMessage.success('收到新消息：' + tpl.title)
}

// 消息详情
const detailVisible = ref(false)
const currentMsg = ref(null)
const showDetail = (msg) => {
  msg.read = true
  currentMsg.value = msg
  detailVisible.value = true
}
</script>

<template>
  <div class="message-container">
    <!-- 统计 -->
    <el-row :gutter="20" class="stats-row">
      <el-col :span="8">
        <el-card shadow="hover" class="stat-card">
          <div class="stat-item">
            <el-icon :size="32" color="#409EFF"><ChatDotRound /></el-icon>
            <div>
              <div class="stat-num">{{ stats.total }}</div>
              <div class="stat-label">全部消息</div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card shadow="hover" class="stat-card" style="cursor:pointer" @click="activeTab = 'unread'">
          <div class="stat-item">
            <el-badge :value="stats.unread" :hidden="stats.unread === 0">
              <el-icon :size="32" color="#E6A23C"><Bell /></el-icon>
            </el-badge>
            <div>
              <div class="stat-num" style="color:#E6A23C">{{ stats.unread }}</div>
              <div class="stat-label">未读消息</div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card shadow="hover" class="stat-card" style="cursor:pointer" @click="activeTab = 'starred'">
          <div class="stat-item">
            <el-icon :size="32" color="#F56C6C"><Star /></el-icon>
            <div>
              <div class="stat-num" style="color:#F56C6C">{{ stats.starred }}</div>
              <div class="stat-label">星标消息</div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 操作栏 -->
    <div class="action-bar">
      <div class="action-left">
        <el-radio-group v-model="activeTab" size="small">
          <el-radio-button value="all">全部</el-radio-button>
          <el-radio-button value="unread">未读</el-radio-button>
          <el-radio-button value="starred">星标</el-radio-button>
          <el-radio-button value="system">系统</el-radio-button>
          <el-radio-button value="message">消息</el-radio-button>
          <el-radio-button value="alert">预警</el-radio-button>
          <el-radio-button value="task">任务</el-radio-button>
        </el-radio-group>
        <el-input
          v-model="searchText"
          placeholder="搜索消息"
          prefix-icon="Search"
          size="small"
          style="width:200px"
          clearable
        />
      </div>
      <div class="action-right">
        <el-button size="small" @click="simulateNewMsg" type="success">模拟新消息</el-button>
        <el-button size="small" @click="markAllRead" :disabled="stats.unread === 0">全部已读</el-button>
        <el-button size="small" type="danger" @click="clearRead" :disabled="stats.total - stats.unread === 0">清空已读</el-button>
      </div>
    </div>

    <!-- 消息列表 -->
    <div class="message-list">
      <el-card
        v-for="msg in filteredMessages"
        :key="msg.id"
        shadow="hover"
        class="message-item"
        :class="{ unread: !msg.read }"
        @click="showDetail(msg)"
      >
        <div class="msg-left">
          <div class="msg-dot" v-if="!msg.read"></div>
          <div class="msg-icon" :style="{ background: typeMap[msg.type].color }">
            <el-icon color="#fff" :size="18"><component :is="typeMap[msg.type].icon" /></el-icon>
          </div>
        </div>
        <div class="msg-content">
          <div class="msg-header">
            <span class="msg-title">{{ msg.title }}</span>
            <el-tag size="small" :color="typeMap[msg.type].color" effect="dark" style="border:none">
              {{ typeMap[msg.type].label }}
            </el-tag>
          </div>
          <div class="msg-text">{{ msg.content }}</div>
          <div class="msg-time">{{ msg.time }}</div>
        </div>
        <div class="msg-actions" @click.stop>
          <el-icon
            :size="20"
            :color="msg.starred ? '#F56C6C' : '#C0C4CC'"
            @click="toggleStar(msg)"
            style="cursor:pointer"
          >
            <StarFilled v-if="msg.starred" /><Star v-else />
          </el-icon>
          <el-icon :size="18" color="#F56C6C" @click="handleDelete(msg)" style="cursor:pointer">
            <Delete />
          </el-icon>
        </div>
      </el-card>

      <el-empty v-if="filteredMessages.length === 0" description="暂无消息" />
    </div>

    <!-- 消息详情弹窗 -->
    <el-dialog v-model="detailVisible" :title="currentMsg?.title" width="500px">
      <div v-if="currentMsg" class="msg-detail">
        <div class="detail-meta">
          <el-tag :color="typeMap[currentMsg.type].color" effect="dark" style="border:none">
            {{ typeMap[currentMsg.type].label }}
          </el-tag>
          <span class="detail-time">{{ currentMsg.time }}</span>
        </div>
        <div class="detail-content">{{ currentMsg.content }}</div>
      </div>
      <template #footer>
        <el-button @click="detailVisible = false">关闭</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped lang="less">
.message-container {
  padding: 10px;
}
.stats-row {
  margin-bottom: 20px;
  .stat-card {
    :deep(.el-card__body) { padding: 15px; }
  }
  .stat-item {
    display: flex;
    align-items: center;
    gap: 15px;
  }
  .stat-num { font-size: 28px; font-weight: bold; }
  .stat-label { font-size: 13px; color: #999; }
}
.action-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  flex-wrap: wrap;
  gap: 10px;
  .action-left {
    display: flex;
    align-items: center;
    gap: 10px;
  }
  .action-right {
    display: flex;
    gap: 8px;
  }
}
.message-list {
  max-height: 520px;
  overflow-y: auto;
}
.message-item {
  margin-bottom: 10px;
  cursor: pointer;
  transition: all 0.3s;
  &.unread {
    border-left: 3px solid #409EFF;
    :deep(.el-card__body) { background: #f0f7ff; }
  }
  &:hover {
    transform: translateX(4px);
  }
  :deep(.el-card__body) {
    padding: 12px 16px;
    display: flex;
    align-items: center;
    gap: 15px;
  }
}
.msg-left {
  display: flex;
  align-items: center;
  gap: 10px;
  .msg-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: #409EFF;
  }
  .msg-icon {
    width: 36px;
    height: 36px;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
}
.msg-content {
  flex: 1;
  .msg-header {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 6px;
  }
  .msg-title {
    font-size: 15px;
    font-weight: 500;
    color: #333;
  }
  .msg-text {
    font-size: 13px;
    color: #666;
    line-height: 1.5;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
  .msg-time {
    font-size: 12px;
    color: #bbb;
    margin-top: 4px;
  }
}
.msg-actions {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.msg-detail {
  .detail-meta {
    display: flex;
    align-items: center;
    gap: 15px;
    margin-bottom: 20px;
    .detail-time { font-size: 13px; color: #999; }
  }
  .detail-content {
    font-size: 15px;
    line-height: 1.8;
    color: #333;
    padding: 20px;
    background: #f5f7fa;
    border-radius: 8px;
  }
}
</style>
